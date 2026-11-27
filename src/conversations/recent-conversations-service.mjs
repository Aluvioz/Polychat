const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

function validRow(row) {
  return row && typeof row === "object" &&
    typeof row.conversation_id === "string" &&
    UUID_PATTERN.test(row.conversation_id) &&
    ["direct", "group"].includes(row.conversation_kind) &&
    (row.conversation_name === null || typeof row.conversation_name === "string") &&
    (row.last_message_id === null ||
      (typeof row.last_message_id === "string" && UUID_PATTERN.test(row.last_message_id))) &&
    (row.last_message_body === null || typeof row.last_message_body === "string") &&
    (row.last_message_at === null ||
      (typeof row.last_message_at === "string" && Number.isFinite(Date.parse(row.last_message_at)))) &&
    (row.last_message_sender_id === null ||
      (typeof row.last_message_sender_id === "string" && UUID_PATTERN.test(row.last_message_sender_id))) &&
    typeof row.last_message_deleted === "boolean" &&
    Number.isSafeInteger(Number(row.unread_count)) && Number(row.unread_count) >= 0;
}

/** Calls the SECURITY INVOKER RPC using the authenticated user's JWT. */
export async function listRecentConversations({
  accessToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!accessToken) return { ok: false, status: 401, reason: "unauthorized" };

  const cfg = configuration(env);
  if (!cfg) return { ok: false, status: 503, reason: "configuration_unavailable" };

  let response;
  try {
    response = await fetchImpl(
      cfg.baseUrl + "/rest/v1/rpc/list_recent_conversations",
      {
        method: "POST",
        headers: {
          apikey: cfg.apiKey,
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: "{}",
        cache: "no-store",
      },
    );
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (!response.ok) {
    if (response.status === 401) return { ok: false, status: 401, reason: "session_invalid" };
    if (response.status === 403) return { ok: false, status: 403, reason: "forbidden" };
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  let rows;
  try {
    rows = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  if (!Array.isArray(rows) || !rows.every(validRow)) {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  return {
    ok: true,
    conversations: rows.map((row) => ({
      conversationId: row.conversation_id.toLowerCase(),
      kind: row.conversation_kind,
      name: row.conversation_name,
      lastMessageId: row.last_message_id?.toLowerCase() ?? null,
      lastMessageBody: row.last_message_body,
      lastMessageAt: row.last_message_at,
      lastMessageSenderId: row.last_message_sender_id?.toLowerCase() ?? null,
      lastMessageDeleted: row.last_message_deleted,
      unreadCount: Number(row.unread_count),
    })),
  };
}
