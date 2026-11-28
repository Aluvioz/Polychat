import { Buffer } from "node:buffer";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const MESSAGE_PAGE_SIZE = 50;

export function encodeMessageCursor(message) {
  if (!message || typeof message.created_at !== "string" ||
      !Number.isFinite(Date.parse(message.created_at)) ||
      typeof message.id !== "string" || !UUID_PATTERN.test(message.id)) {
    throw new TypeError("A valid persisted message is required for a cursor.");
  }
  return Buffer.from(JSON.stringify({
    createdAt: message.created_at,
    id: message.id,
  }), "utf8").toString("base64url");
}

export function decodeMessageCursor(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || value.length > 512 ||
      !/^[A-Za-z0-9_-]+$/.test(value)) return undefined;

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!parsed || typeof parsed.createdAt !== "string" ||
        !Number.isFinite(Date.parse(parsed.createdAt)) ||
        typeof parsed.id !== "string" || !UUID_PATTERN.test(parsed.id)) {
      return undefined;
    }
    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch {
    return undefined;
  }
}

/**
 * Reads a page using the caller JWT. The database RLS policy remains the
 * authority for conversation visibility and current membership.
 */
export async function fetchMessagePage({
  conversationId,
  accessToken,
  cursor = null,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (typeof conversationId !== "string" || !UUID_PATTERN.test(conversationId)) {
    return { ok: false, status: 400, reason: "invalid_conversation" };
  }
  if (!accessToken) return { ok: false, status: 401, reason: "unauthorized" };

  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !apiKey) {
    return { ok: false, status: 503, reason: "configuration_unavailable" };
  }

  const endpoint = new URL(`${baseUrl}/rest/v1/messages`);
  endpoint.searchParams.set(
    "select",
    "id,conversation_id,sender_profile_id,body,created_at",
  );
  endpoint.searchParams.set("conversation_id", `eq.${conversationId}`);
  endpoint.searchParams.set("order", "created_at.desc,id.desc");
  endpoint.searchParams.set("limit", String(MESSAGE_PAGE_SIZE + 1));
  if (cursor) {
    endpoint.searchParams.set(
      "or",
      `(created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id}))`,
    );
  }

  let response;
  try {
    response = await fetchImpl(endpoint, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
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
      reason: response.status >= 500 ? "database_unavailable" : "query_rejected",
    };
  }

  let rows;
  try {
    rows = await response.json();
  } catch {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }
  if (!Array.isArray(rows)) {
    return { ok: false, status: 503, reason: "invalid_database_response" };
  }

  const hasMore = rows.length > MESSAGE_PAGE_SIZE;
  const messages = rows.slice(0, MESSAGE_PAGE_SIZE);
  const last = messages[messages.length - 1];
  return {
    ok: true,
    messages,
    hasMore,
    nextCursor: hasMore && last ? encodeMessageCursor(last) : null,
  };
}
