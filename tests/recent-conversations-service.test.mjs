import test from "node:test";
import assert from "node:assert/strict";
import { listRecentConversations } from "../src/conversations/recent-conversations-service.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example/",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};
const conversationId = "33333333-3333-4333-8333-333333333333";
const messageId = "44444444-4444-4444-8444-444444444444";
const senderId = "55555555-5555-4555-8555-555555555555";

const row = {
  conversation_id: conversationId,
  conversation_kind: "direct",
  conversation_name: null,
  last_message_id: messageId,
  last_message_body: "Olá",
  last_message_at: "2026-11-27T12:00:00.000Z",
  last_message_sender_id: senderId,
  last_message_deleted: false,
  unread_count: 2,
};

test("calls the recent-conversations SECURITY INVOKER RPC with the caller JWT", async () => {
  let request;
  const result = await listRecentConversations({
    accessToken: "user-jwt",
    env,
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return new Response(JSON.stringify([row]), { status: 200 });
    },
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.conversations[0], {
    conversationId,
    kind: "direct",
    name: null,
    lastMessageId: messageId,
    lastMessageBody: "Olá",
    lastMessageAt: row.last_message_at,
    lastMessageSenderId: senderId,
    lastMessageDeleted: false,
    unreadCount: 2,
  });
  assert.equal(request.url, "https://polychat.example/rest/v1/rpc/list_recent_conversations");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers.Authorization, "Bearer user-jwt");
  assert.equal(request.options.headers.apikey, "publishable-test-key");
  assert.equal(request.options.cache, "no-store");
});

test("returns an empty list when the caller has no conversations", async () => {
  const result = await listRecentConversations({
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response("[]", { status: 200 }),
  });
  assert.deepEqual(result, { ok: true, conversations: [] });
});

test("does not call Supabase without a caller token", async () => {
  const result = await listRecentConversations({
    accessToken: null,
    env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 401);
});

test("maps provider errors without exposing database details", async () => {
  const result = await listRecentConversations({
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response("private SQL detail", { status: 500 }),
  });
  assert.deepEqual(result, {
    ok: false,
    status: 503,
    reason: "database_unavailable",
  });
});

test("rejects malformed rows instead of rendering untrusted data", async () => {
  const result = await listRecentConversations({
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response(JSON.stringify([{ ...row, unread_count: -1 }]), { status: 200 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
});
