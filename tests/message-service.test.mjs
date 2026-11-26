import test from "node:test";
import assert from "node:assert/strict";
import {
  persistTextMessage,
  validateTextMessageInput,
} from "../src/messaging/message-service.mjs";

const conversationId = "11111111-1111-4111-8111-111111111111";
const senderProfileId = "22222222-2222-4222-8222-222222222222";
const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};

test("accepts a valid text message and trims surrounding whitespace", () => {
  assert.deepEqual(
    validateTextMessageInput({ conversationId, body: "  Olá  " }),
    { ok: true, conversationId, body: "Olá" },
  );
});

test("rejects a missing or malformed conversation identifier", () => {
  assert.equal(validateTextMessageInput({ body: "Olá" }).ok, false);
  assert.equal(
    validateTextMessageInput({ conversationId: "not-a-uuid", body: "Olá" }).ok,
    false,
  );
});

test("rejects empty and whitespace-only message bodies", () => {
  assert.equal(validateTextMessageInput({ conversationId, body: "" }).ok, false);
  assert.equal(validateTextMessageInput({ conversationId, body: "   " }).ok, false);
});

test("persists with the caller JWT and returns only a confirmed row", async () => {
  let request;
  const result = await persistTextMessage({
    conversationId,
    senderProfileId,
    body: "Olá",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return new Response(JSON.stringify([{
        id: "33333333-3333-4333-8333-333333333333",
        conversation_id: conversationId,
        sender_profile_id: senderProfileId,
        body: "Olá",
        created_at: "2026-11-26T12:00:00Z",
      }]), { status: 201, headers: { "Content-Type": "application/json" } });
    },
  });

  assert.equal(result.ok, true);
  assert.match(request.url, /\/rest\/v1\/messages/);
  assert.equal(request.options.headers.Authorization, "Bearer user-jwt");
  assert.equal(request.options.headers.apikey, "publishable-test-key");
  assert.deepEqual(JSON.parse(request.options.body), {
    conversation_id: conversationId,
    sender_profile_id: senderProfileId,
    body: "Olá",
  });
});

test("does not persist without an authenticated user token", async () => {
  const result = await persistTextMessage({
    conversationId, senderProfileId, body: "Olá", accessToken: null, env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 401);
});

test("fails closed when the database denies conversation access", async () => {
  const result = await persistTextMessage({
    conversationId, senderProfileId, body: "Olá", accessToken: "user-jwt", env,
    fetchImpl: async () => new Response("{}", { status: 403 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 403);
});

test("does not claim success when the database returns no persisted row", async () => {
  const result = await persistTextMessage({
    conversationId, senderProfileId, body: "Olá", accessToken: "user-jwt", env,
    fetchImpl: async () => new Response("[]", { status: 201 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
});

test("maps database transport failure to a recoverable service error", async () => {
  const result = await persistTextMessage({
    conversationId, senderProfileId, body: "Olá", accessToken: "user-jwt", env,
    fetchImpl: async () => { throw new Error("internal database details"); },
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
  assert.equal(JSON.stringify(result).includes("internal database details"), false);
});
