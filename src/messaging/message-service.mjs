const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateTextMessageInput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "invalid_payload" };
  }

  const { conversationId, body } = value;
  if (typeof conversationId !== "string" || !UUID_PATTERN.test(conversationId)) {
    return { ok: false, reason: "invalid_conversation" };
  }
  if (typeof body !== "string" || body.trim().length === 0) {
    return { ok: false, reason: "empty_message" };
  }

  return {
    ok: true,
    conversationId,
    body: body.trim(),
  };
}

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

/**
 * Persists a text message using the caller's JWT. Database RLS remains the
 * authority for active membership, conversation state and sender identity.
 */
export async function persistTextMessage({
  conversationId,
  senderProfileId,
  body,
  accessToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!senderProfileId || !accessToken) {
    return { ok: false, status: 401, reason: "unauthorized" };
  }

  const cfg = configuration(env);
  if (!cfg) return { ok: false, status: 503, reason: "configuration_unavailable" };

  const endpoint = new URL(`${cfg.baseUrl}/rest/v1/messages`);
  endpoint.searchParams.set(
    "select",
    "id,conversation_id,sender_profile_id,body,created_at",
  );

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender_profile_id: senderProfileId,
        body,
      }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (response.status === 401) {
    return { ok: false, status: 401, reason: "session_invalid" };
  }
  if (response.status === 403) {
    return { ok: false, status: 403, reason: "conversation_forbidden" };
  }
  if (!response.ok) {
    return {
      ok: false,
      status: response.status >= 500 ? 503 : 400,
      reason: response.status >= 500 ? "database_unavailable" : "message_rejected",
    };
  }

  let rows;
  try {
    rows = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  const message = Array.isArray(rows) ? rows[0] : null;
  if (!message?.id || message.sender_profile_id !== senderProfileId ||
      message.conversation_id !== conversationId) {
    return { ok: false, status: 503, reason: "message_not_confirmed" };
  }

  return { ok: true, message };
}
