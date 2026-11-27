import test from "node:test";
import assert from "node:assert/strict";
import {
  persistTextMessage,
  validateTextMessageInput,
} from "../src/messaging/message-service.mjs";

const messageId = "33333333-3333-4333-8333-333333333333";
const conversationId = "11111111-1111-4111-8111-111111111111";
const senderProfileId = "22222222-2222-4222-8222-222222222222";
const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};
const storedMessage = {
  id: messageId,
  conversation_id: conversationId,
  sender_profile_id: senderProfileId,
  body: "Olá",
  created_at: "2026-11-26T12:00:00Z",
};

test("accepts a valid text message and trims surrounding whitespace", () => {
  assert.deepEqual(
    validateTextMessageInput({ id: messageId, conversationId, body: "  Olá  " }),
    { ok: true, id: messageId, conversationId, body: "Olá" },
  );
});

test("normalizes UUID values and rejects a missing or malformed message id", () => {
  assert.equal(validateTextMessageInput({ conversationId, body: "Olá" }).ok, false);
  assert.equal(
    validateTextMessageInput({ id: "not-a-uuid", conversationId, body: "Olá" }).ok,
    false,
  );
  assert.equal(
    validateTextMessageInput({
      id: messageId.toUpperCase(),
      conversationId: conversationId.toUpperCase(),
      body: "Olá",
    }).id,
    messageId,
  );
});

test("rejects a missing or malformed conversation identifier", () => {
  assert.equal(validateTextMessageInput({ id: messageId, body: "Olá" }).ok, false);
  assert.equal(
    validateTextMessageInput({ id: messageId, conversationId: "not-a-uuid", body: "Olá" }).ok,
    false,
  );
});

test("rejects empty and whitespace-only message bodies", () => {
  assert.equal(validateTextMessageInput({ id: messageId, conversationId, body: "" }).ok, false);
  assert.equal(validateTextMessageInput({ id: messageId, conversationId, body: "   " }).ok, false);
});

test("persists with the caller JWT, client message id and ignore-duplicates semantics", async () => {
  let request;
  const result = await persistTextMessage({
    id: messageId,
    conversationId,
    senderProfileId,
    body: "Olá",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return new Response(JSON.stringify([storedMessage]), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.created, true);
  assert.match(request.url, /\/rest\/v1\/messages/);
  assert.match(request.url, /on_conflict=id/);
  assert.equal(request.options.headers.Authorization, "Bearer user-jwt");
  assert.equal(request.options.headers.apikey, "publishable-test-key");
  assert.equal(
    request.options.headers.Prefer,
    "resolution=ignore-duplicates,return=representation",
  );
  assert.deepEqual(JSON.parse(request.options.body), {
    id: messageId,
    conversation_id: conversationId,
    sender_profile_id: senderProfileId,
    body: "Olá",
  });
});

test("treats an identical retry as success and returns the original persisted row", async () => {
  const calls = [];
  const result = await persistTextMessage({
    id: messageId,
    conversationId,
    senderProfileId,
    body: "Olá",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      if (options.method === "POST") {
        return new Response("[]", { status: 201 });
      }
      return new Response(JSON.stringify([storedMessage]), { status: 200 });
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.created, false);
  assert.deepEqual(result.message, storedMessage);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.method, "GET");
  assert.match(calls[1].url, /id=eq\.33333333-3333-4333-8333-333333333333/);
});

test("rejects reuse of a message id with different content", async () => {
  const result = await persistTextMessage({
    id: messageId,
    conversationId,
    senderProfileId,
    body: "Conteúdo diferente",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (_url, options) => options.method === "POST"
      ? new Response("[]", { status: 201 })
      : new Response(JSON.stringify([storedMessage]), { status: 200 }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 409);
  assert.equal(result.reason, "idempotency_conflict");
});

test("rejects reuse of a message id by a different sender or conversation", async () => {
  const result = await persistTextMessage({
    id: messageId,
    conversationId,
    senderProfileId: "44444444-4444-4444-8444-444444444444",
    body: "Olá",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (_url, options) => options.method === "POST"
      ? new Response("[]", { status: 201 })
      : new Response(JSON.stringify([storedMessage]), { status: 200 }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 409);
});

test("supports lookup after a database duplicate-key response", async () => {
  const result = await persistTextMessage({
    id: messageId,
    conversationId,
    senderProfileId,
    body: "Olá",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (_url, options) => options.method === "POST"
      ? new Response("{}", { status: 409 })
      : new Response(JSON.stringify([storedMessage]), { status: 200 }),
  });

  assert.equal(result.ok, true);
  assert.equal(result.created, false);
});

test("does not persist without an authenticated user token", async () => {
  const result = await persistTextMessage({
    id: messageId, conversationId, senderProfileId, body: "Olá", accessToken: null, env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 401);
});

test("fails closed when the database denies conversation access", async () => {
  const result = await persistTextMessage({
    id: messageId, conversationId, senderProfileId, body: "Olá", accessToken: "user-jwt", env,
    fetchImpl: async () => new Response("{}", { status: 403 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 403);
});

test("does not claim success when neither insert nor lookup confirms a row", async () => {
  const result = await persistTextMessage({
    id: messageId, conversationId, senderProfileId, body: "Olá", accessToken: "user-jwt", env,
    fetchImpl: async (_url, options) => options.method === "POST"
      ? new Response("[]", { status: 201 })
      : new Response("[]", { status: 200 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 409);
});

test("maps database transport failure to a recoverable service error", async () => {
  const result = await persistTextMessage({
    id: messageId, conversationId, senderProfileId, body: "Olá", accessToken: "user-jwt", env,
    fetchImpl: async () => { throw new Error("internal database details"); },
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
  assert.equal(JSON.stringify(result).includes("internal database details"), false);
});
