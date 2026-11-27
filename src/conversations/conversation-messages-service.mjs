/**
 * @typedef {{id: string, body: string | null, senderProfileId: string, createdAt: string, editedAt: string | null, deletedAt: string | null}} ConversationMessage
 * @typedef {{ok: true, messages: ConversationMessage[], hasMore: boolean, nextCursor: {createdAt: string, messageId: string} | null} | {ok: false, status: number, reason: string}} ListConversationMessagesResult
 * @typedef {{ok: true, recorded: number} | {ok: false, status: number, reason: string}} MarkConversationMessagesReadResult
 */

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

function headers(config, accessToken) {
  return {
    apikey: config.apiKey,
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
  };
}

function validMessage(row) {
  return row && typeof row === "object" &&
    typeof row.id === "string" && UUID_PATTERN.test(row.id) &&
    (row.body === null || typeof row.body === "string") &&
    typeof row.sender_profile_id === "string" && UUID_PATTERN.test(row.sender_profile_id) &&
    typeof row.created_at === "string" && Number.isFinite(Date.parse(row.created_at)) &&
    (row.edited_at === null || (typeof row.edited_at === "string" && Number.isFinite(Date.parse(row.edited_at)))) &&
    (row.deleted_at === null || (typeof row.deleted_at === "string" && Number.isFinite(Date.parse(row.deleted_at))));
}

/**
 * @param {{config: {baseUrl: string, apiKey: string}, accessToken: string, conversationId: string, fetchImpl: typeof fetch}} options
 * @returns {Promise<{ok: true} | {ok: false, status: number, reason: string}>}
 */
async function visibleConversation({ config, accessToken, conversationId, fetchImpl }) {
  const url = new URL(config.baseUrl + "/rest/v1/conversations");
  url.search = new URLSearchParams({
    select: "id",
    id: "eq." + conversationId,
    limit: "1",
  }).toString();

  let response;
  try {
    response = await fetchImpl(url, {
      headers: headers(config, accessToken),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (response.status === 401) return { ok: false, status: 401, reason: "session_invalid" };
  if (response.status === 403) return { ok: false, status: 403, reason: "forbidden" };
  if (!response.ok) return { ok: false, status: 503, reason: "database_unavailable" };

  const rows = await response.json().catch(() => null);
  if (!Array.isArray(rows)) return { ok: false, status: 503, reason: "invalid_database_response" };
  if (rows.length === 0) return { ok: false, status: 404, reason: "conversation_unavailable" };
  return { ok: true };
}

/**
 * Reads a keyset-paginated message page using the caller JWT and existing RLS.
 * @param {object} options
 * @param {string | null | undefined} options.accessToken
 * @param {string} options.conversationId
 * @param {string | null} [options.beforeCreatedAt]
 * @param {string | null} [options.beforeMessageId]
 * @param {number} [options.limit]
 * @param {Record<string, string | undefined>} [options.env]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<ListConversationMessagesResult>}
 */
export async function listConversationMessages({
  accessToken,
  conversationId,
  beforeCreatedAt = null,
  beforeMessageId = null,
  limit = 50,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!accessToken) return { ok: false, status: 401, reason: "unauthorized" };
  if (!UUID_PATTERN.test(conversationId ?? "")) return { ok: false, status: 400, reason: "invalid_conversation" };
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return { ok: false, status: 400, reason: "invalid_limit" };
  }
  if ((beforeCreatedAt === null) !== (beforeMessageId === null) ||
      (beforeCreatedAt !== null && (!Number.isFinite(Date.parse(beforeCreatedAt)) ||
        !UUID_PATTERN.test(beforeMessageId)))) {
    return { ok: false, status: 400, reason: "invalid_cursor" };
  }

  const config = configuration(env);
  if (!config) return { ok: false, status: 503, reason: "configuration_unavailable" };

  const visible = await visibleConversation({ config, accessToken, conversationId, fetchImpl });
  if (!visible.ok) return visible;

  const params = new URLSearchParams({
    select: "id,body,sender_profile_id,created_at,edited_at,deleted_at",
    conversation_id: "eq." + conversationId,
    order: "created_at.desc,id.desc",
    limit: String(limit + 1),
  });
  if (beforeCreatedAt !== null) {
    params.set("or", "(created_at.lt." + beforeCreatedAt +
      ",and(created_at.eq." + beforeCreatedAt + ",id.lt." + beforeMessageId + "))");
  }

  let response;
  try {
    response = await fetchImpl(config.baseUrl + "/rest/v1/messages?" + params.toString(), {
      headers: headers(config, accessToken),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (response.status === 401) return { ok: false, status: 401, reason: "session_invalid" };
  if (response.status === 403) return { ok: false, status: 403, reason: "forbidden" };
  if (!response.ok) return { ok: false, status: 503, reason: "database_unavailable" };

  const rows = await response.json().catch(() => null);
  if (!Array.isArray(rows) || !rows.every(validMessage)) {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit);
  const oldest = page.at(-1);
  return {
    ok: true,
    messages: page.map((row) => ({
      id: row.id.toLowerCase(),
      body: row.deleted_at ? null : row.body,
      senderProfileId: row.sender_profile_id.toLowerCase(),
      createdAt: row.created_at,
      editedAt: row.edited_at,
      deletedAt: row.deleted_at,
    })),
    hasMore,
    nextCursor: hasMore && oldest
      ? { createdAt: oldest.created_at, messageId: oldest.id.toLowerCase() }
      : null,
  };
}

/**
 * Inserts read receipts only for messages in this conversation; RLS validates each row.
 * @param {object} options
 * @param {string | null | undefined} options.accessToken
 * @param {string} options.conversationId
 * @param {string} options.readerProfileId
 * @param {string[]} options.messageIds
 * @param {Record<string, string | undefined>} [options.env]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<MarkConversationMessagesReadResult>}
 */
export async function markConversationMessagesRead({
  accessToken,
  conversationId,
  readerProfileId,
  messageIds,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!accessToken) return { ok: false, status: 401, reason: "unauthorized" };
  if (!UUID_PATTERN.test(conversationId ?? "") || !UUID_PATTERN.test(readerProfileId ?? "") ||
      !Array.isArray(messageIds) || messageIds.length > 100 ||
      !messageIds.every((id) => typeof id === "string" && UUID_PATTERN.test(id))) {
    return { ok: false, status: 400, reason: "invalid_input" };
  }

  const config = configuration(env);
  if (!config) return { ok: false, status: 503, reason: "configuration_unavailable" };

  const visible = await visibleConversation({ config, accessToken, conversationId, fetchImpl });
  if (!visible.ok) return visible;
  if (messageIds.length === 0) return { ok: true, recorded: 0 };

  const params = new URLSearchParams({
    select: "id",
    conversation_id: "eq." + conversationId,
    sender_profile_id: "neq." + readerProfileId,
    deleted_at: "is.null",
    id: "in.(" + [...new Set(messageIds.map((id) => id.toLowerCase()))].join(",") + ")",
    limit: "100",
  });

  let lookup;
  try {
    lookup = await fetchImpl(config.baseUrl + "/rest/v1/messages?" + params.toString(), {
      headers: headers(config, accessToken),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }
  if (lookup.status === 401) return { ok: false, status: 401, reason: "session_invalid" };
  if (lookup.status === 403) return { ok: false, status: 403, reason: "forbidden" };
  if (!lookup.ok) return { ok: false, status: 503, reason: "database_unavailable" };

  const rows = await lookup.json().catch(() => null);
  if (!Array.isArray(rows) || !rows.every((row) => row && typeof row.id === "string" && UUID_PATTERN.test(row.id))) {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }
  if (rows.length === 0) return { ok: true, recorded: 0 };

  let insert;
  try {
    insert = await fetchImpl(config.baseUrl + "/rest/v1/message_reads", {
      method: "POST",
      headers: {
        ...headers(config, accessToken),
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(rows.map((row) => ({
        message_id: row.id,
        reader_profile_id: readerProfileId,
      }))),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, reason: "database_unavailable" };
  }

  if (insert.status === 401) return { ok: false, status: 401, reason: "session_invalid" };
  if (insert.status === 403) return { ok: false, status: 403, reason: "forbidden" };
  if (!insert.ok) return { ok: false, status: 503, reason: "database_unavailable" };
  return { ok: true, recorded: rows.length };
}
