import test from "node:test";
import assert from "node:assert/strict";
import {
  decodeMessageCursor,
  encodeMessageCursor,
  fetchMessagePage,
  MESSAGE_PAGE_SIZE,
} from "../src/messaging/message-history.mjs";

const conversationId = "11111111-1111-4111-8111-111111111111";
const makeMessage = (id, created_at) => ({
  id,
  conversation_id: conversationId,
  sender_profile_id: "22222222-2222-4222-8222-222222222222",
  body: "Mensagem",
  created_at,
});
const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};

test("encodes and decodes a stable timestamp/id cursor", () => {
  const message = makeMessage(
    "33333333-3333-4333-8333-333333333333",
    "2026-11-26T12:00:00.000Z",
  );
  assert.deepEqual(decodeMessageCursor(encodeMessageCursor(message)), {
    createdAt: message.created_at,
    id: message.id,
  });
});

test("rejects malformed cursors", () => {
  assert.equal(decodeMessageCursor("not-a-cursor"), undefined);
  assert.equal(decodeMessageCursor("e30"), undefined);
  assert.equal(decodeMessageCursor(""), null);
});

test("requests descending stable order with the caller JWT", async () => {
  let captured;
  const result = await fetchMessagePage({
    conversationId,
    accessToken: "caller-jwt",
    env,
    fetchImpl: async (url, options) => {
      captured = { url: new URL(url), options };
      return new Response(JSON.stringify([makeMessage(
        "33333333-3333-4333-8333-333333333333",
        "2026-11-26T12:00:00.000Z",
      )]), { status: 200 });
    },
  });
  assert.equal(result.ok, true);
  assert.equal(captured.options.headers.Authorization, "Bearer caller-jwt");
  assert.equal(captured.url.searchParams.get("order"), "created_at.desc,id.desc");
  assert.equal(captured.url.searchParams.get("limit"), String(MESSAGE_PAGE_SIZE + 1));
});

test("applies the keyset cursor to the next page", async () => {
  const cursor = {
    createdAt: "2026-11-26T12:00:00.000Z",
    id: "33333333-3333-4333-8333-333333333333",
  };
  let filter;
  await fetchMessagePage({
    conversationId,
    accessToken: "caller-jwt",
    cursor,
    env,
    fetchImpl: async (url) => {
      filter = new URL(url).searchParams.get("or");
      return new Response("[]", { status: 200 });
    },
  });
  assert.equal(
    filter,
    "(created_at.lt.2026-11-26T12:00:00.000Z,and(created_at.eq.2026-11-26T12:00:00.000Z,id.lt.33333333-3333-4333-8333-333333333333))",
  );
});

test("returns a continuation cursor only when another row exists", async () => {
  const rows = Array.from({ length: MESSAGE_PAGE_SIZE + 1 }, (_, index) =>
    makeMessage(
      `33333333-3333-4333-8333-${String(index + 1).padStart(12, "0")}`,
      new Date(Date.UTC(2026, 10, 26, 12, 0, index)).toISOString(),
    ),
  );
  const result = await fetchMessagePage({
    conversationId, accessToken: "caller-jwt", env,
    fetchImpl: async () => new Response(JSON.stringify(rows), { status: 200 }),
  });
  assert.equal(result.ok, true);
  assert.equal(result.messages.length, MESSAGE_PAGE_SIZE);
  assert.equal(result.hasMore, true);
  assert.ok(result.nextCursor);
});

test("fails closed when the database denies access to the conversation", async () => {
  const result = await fetchMessagePage({
    conversationId, accessToken: "caller-jwt", env,
    fetchImpl: async () => new Response("{}", { status: 403 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 403);
});

test("does not expose database errors on transport failure", async () => {
  const result = await fetchMessagePage({
    conversationId, accessToken: "caller-jwt", env,
    fetchImpl: async () => { throw new Error("private database detail"); },
  });
  assert.equal(result.status, 503);
  assert.equal(JSON.stringify(result).includes("private database detail"), false);
});
