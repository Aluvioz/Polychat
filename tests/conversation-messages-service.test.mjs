import test from "node:test";
import assert from "node:assert/strict";
import {
  listConversationMessages,
  markConversationMessagesRead,
} from "../src/conversations/conversation-messages-service.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example/",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};
const conversationId = "33333333-3333-4333-8333-333333333333";
const ownId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";
const firstMessageId = "44444444-4444-4444-8444-444444444444";
const secondMessageId = "55555555-5555-4555-8555-555555555555";

function message(id, senderId, createdAt) {
  return {
    id,
    body: "Mensagem",
    sender_profile_id: senderId,
    created_at: createdAt,
    edited_at: null,
    deleted_at: null,
  };
}

test("loads a conversation page using the caller JWT and a composite cursor", async () => {
  const requests = [];
  const rows = [
    message(firstMessageId, otherId, "2026-11-27T12:00:00.000Z"),
    message(secondMessageId, ownId, "2026-11-27T11:00:00.000Z"),
  ];
  const result = await listConversationMessages({
    accessToken: "user-jwt",
    conversationId,
    beforeCreatedAt: "2026-11-27T13:00:00.000Z",
    beforeMessageId: "66666666-6666-4666-8666-666666666666",
    limit: 1,
    env,
    fetchImpl: async (url, options) => {
      requests.push({ url: String(url), options });
      return requests.length === 1
        ? new Response(JSON.stringify([{ id: conversationId }]), { status: 200 })
        : new Response(JSON.stringify(rows), { status: 200 });
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.messages.length, 1);
  assert.equal(result.messages[0].id, firstMessageId);
  assert.equal(result.hasMore, true);
  assert.deepEqual(result.nextCursor, {
    createdAt: rows[0].created_at,
    messageId: firstMessageId,
  });
  assert.equal(requests[0].options.headers.Authorization, "Bearer user-jwt");
  assert.equal(requests[1].options.headers.Authorization, "Bearer user-jwt");
  assert.match(requests[1].url, /order=created_at\.desc%2Cid\.desc/);
  assert.match(requests[1].url, /beforeCreatedAt|or=/);
});

test("does not query messages when RLS hides the conversation", async () => {
  let calls = 0;
  const result = await listConversationMessages({
    accessToken: "user-jwt",
    conversationId,
    env,
    fetchImpl: async () => {
      calls += 1;
      return new Response("[]", { status: 200 });
    },
  });
  assert.equal(calls, 1);
  assert.deepEqual(result, {
    ok: false,
    status: 404,
    reason: "conversation_unavailable",
  });
});

test("does not call Supabase without an authenticated caller token", async () => {
  const result = await listConversationMessages({
    accessToken: null,
    conversationId,
    env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 401);
});

test("marks only non-own, non-deleted messages in the selected conversation as read", async () => {
  const requests = [];
  const result = await markConversationMessagesRead({
    accessToken: "user-jwt",
    conversationId,
    readerProfileId: ownId,
    messageIds: [firstMessageId, secondMessageId],
    env,
    fetchImpl: async (url, options) => {
      requests.push({ url: String(url), options });
      if (requests.length === 1) return new Response(JSON.stringify([{ id: conversationId }]), { status: 200 });
      if (requests.length === 2) return new Response(JSON.stringify([{ id: firstMessageId }]), { status: 200 });
      return new Response(null, { status: 201 });
    },
  });

  assert.deepEqual(result, { ok: true, recorded: 1 });
  assert.match(requests[1].url, /sender_profile_id=neq/);
  assert.match(requests[1].url, /deleted_at=is.null/);
  assert.equal(requests[2].options.method, "POST");
  assert.equal(requests[2].options.headers.Authorization, "Bearer user-jwt");
  assert.deepEqual(JSON.parse(requests[2].options.body), [{
    message_id: firstMessageId,
    reader_profile_id: ownId,
  }]);
});

test("rejects malformed pagination cursors before making requests", async () => {
  const result = await listConversationMessages({
    accessToken: "user-jwt",
    conversationId,
    beforeCreatedAt: "not-a-date",
    beforeMessageId: firstMessageId,
    env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 400);
});
