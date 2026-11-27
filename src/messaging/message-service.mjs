const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateTextMessageInput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, reason: "invalid_payload" };
  }

  const { id, conversationId, body } = value;
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return { ok: false, reason: "invalid_message_id" };
  }
  if (typeof conversationId !== "string" || !UUID_PATTERN.test(conversationId)) {
    return { ok: false, reason: "invalid_conversation" };
  }
  if (typeof body !== "string" || body.trim().length === 0) {
    return { ok: false, reason: "empty_message" };
  }

  return {
    ok: true,
    id: id.toLowerCase(),
    conversationId: conversationId.toLowerCase(),
    body: body.trim(),
  };
}

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

function requestHeaders(apiKey, accessToken, extra = {}) {
  return {
    apikey: apiKey,
    Authorization: \`Bearer \${accessToken}\`,
    ...extra,
  };
}

function serviceError(response) {
  if (response.status === 401) {
    return { ok: false, status: 401, reason: "session_invalid" };
  }
  if (response.status === 403) {
    return { ok: false, status: 403, reason: "conversation_forbidden" };
  }
  return {
    ok: false,
    status: response.status >= 500 ? 503 : 400,
    reason: response.status >= 500 ? "database_unavailable" : "message_rejected",
  };
}

async function readExistingMessage({
  endpoint,
  id,
  conversationId,
  senderProfileId,
  body,
  apiKey,
  accessToken,
  fetchImpl,
}) {
  const lookup = new URL(endpoint);
  lookup.searchParams.set(
    "select",
    "id,conversation_id,sender_profile_id,body,created_at",
  );
  lookup.searchParams.set("id", \`eq.\${id}\`);

  let response;
  try {
    response = await fetchImpl(lookup, {
      method: "GET",
      headers: requestHeaders(apiKey, accessToken),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (!response.ok) return serviceError(response);

  let rows;
  try {
    rows = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  const message = Array.isArray(rows) ? rows[0] : null;
  if (!message) {
    return { ok: false, status: 409, reason: "idempotency_conflict" };
  }

  if (
    message.id !== id ||
    message.conversation_id !== conversationId ||
    message.sender_profile_id !== senderProfileId ||
    message.body !== body
  ) {
    return { ok: false, status: 409, reason: "idempotency_conflict" };
  }

  return { ok: true, created: false, message };
}

/**
 * Persists a text message using the caller's JWT. Database RLS remains the
 * authority for active membership, conversation state and sender identity.
 *
 * The client-generated message UUID is the idempotency key. A conflicting
 * insert is never merged or overwritten; an existing row is read and compared.
 */
export async function persistTextMessage({
  id,
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

  const endpoint = new URL(\`\${cfg.baseUrl}/rest/v1/messages\`);
  endpoint.searchParams.set("on_conflict", "id");
  endpoint.searchParams.set(
    "select",
    "id,conversation_id,sender_profile_id,body,created_at",
  );

  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: requestHeaders(cfg.apiKey, accessToken, {
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=representation",
      }),
      body: JSON.stringify({
        id,
        conversation_id: conversationId,
        sender_profile_id: senderProfileId,
        body,
      }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  // A duplicate primary key may be returned as an empty representation (the
  // normal ignore-duplicates path) or as HTTP 409 by a PostgREST deployment.
  if (response.status === 409) {
    return readExistingMessage({
      endpoint,
      id,
      conversationId,
      senderProfileId,
      body,
      apiKey: cfg.apiKey,
      accessToken,
      fetchImpl,
    });
  }

  if (!response.ok) return serviceError(response);

  let rows;
  try {
    rows = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  const message = Array.isArray(rows) ? rows[0] : null;
  if (!message) {
    return readExistingMessage({
      endpoint,
      id,
      conversationId,
      senderProfileId,
      body,
      apiKey: cfg.apiKey,
      accessToken,
      fetchImpl,
    });
  }

  if (
    message.id !== id ||
    message.sender_profile_id !== senderProfileId ||
    message.conversation_id !== conversationId ||
    message.body !== body
  ) {
    return { ok: false, status: 503, reason: "message_not_confirmed" };
  }

  return { ok: true, created: true, message };
}
