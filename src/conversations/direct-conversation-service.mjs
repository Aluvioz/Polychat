const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateDirectConversationInput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "invalid_payload" };
  }

  const { otherProfileId } = value;
  if (typeof otherProfileId !== "string" || !UUID_PATTERN.test(otherProfileId)) {
    return { ok: false, reason: "invalid_recipient" };
  }

  return { ok: true, otherProfileId: otherProfileId.toLowerCase() };
}

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

function mapDatabaseError(status) {
  if (status === 401) return { ok: false, status: 401, reason: "session_invalid" };
  if (status === 403) return { ok: false, status: 403, reason: "conversation_forbidden" };
  if (status === 400 || status === 404 || status === 409) {
    return { ok: false, status: 400, reason: "recipient_unavailable" };
  }
  return { ok: false, status: 503, reason: "database_unavailable" };
}

/**
 * Opens a direct conversation through the SECURITY INVOKER database function.
 * The caller JWT is forwarded unchanged so existing RLS policies remain active.
 */
export async function openDirectConversation({
  otherProfileId,
  actorProfileId,
  accessToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!accessToken || !actorProfileId) {
    return { ok: false, status: 401, reason: "unauthorized" };
  }

  if (typeof otherProfileId !== "string" || !UUID_PATTERN.test(otherProfileId)) {
    return { ok: false, status: 400, reason: "invalid_recipient" };
  }

  const normalizedRecipientId = otherProfileId.toLowerCase();
  if (normalizedRecipientId === actorProfileId.toLowerCase()) {
    return { ok: false, status: 400, reason: "self_conversation" };
  }

  const cfg = configuration(env);
  if (!cfg) return { ok: false, status: 503, reason: "configuration_unavailable" };

  let response;
  try {
    response = await fetchImpl(
      cfg.baseUrl + "/rest/v1/rpc/open_direct_conversation",
      {
        method: "POST",
        headers: {
          apikey: cfg.apiKey,
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_other_profile_id: normalizedRecipientId }),
        cache: "no-store",
      },
    );
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (!response.ok) return mapDatabaseError(response.status);

  let conversationId;
  try {
    conversationId = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  if (typeof conversationId !== "string" || !UUID_PATTERN.test(conversationId)) {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  return { ok: true, conversationId: conversationId.toLowerCase() };
}
