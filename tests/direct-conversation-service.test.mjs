import test from "node:test";
import assert from "node:assert/strict";
import {
  openDirectConversation,
  validateDirectConversationInput,
} from "../src/conversations/direct-conversation-service.mjs";

const actorProfileId = "11111111-1111-4111-8111-111111111111";
const recipientProfileId = "22222222-2222-4222-8222-222222222222";
const conversationId = "33333333-3333-4333-8333-333333333333";
const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};

test("validates and normalizes a recipient profile UUID", () => {
  assert.deepEqual(
    validateDirectConversationInput({ otherProfileId: recipientProfileId.toUpperCase() }),
    { ok: true, otherProfileId: recipientProfileId },
  );
});

test("rejects missing, malformed and non-object payloads", () => {
  assert.equal(validateDirectConversationInput(null).ok, false);
  assert.equal(validateDirectConversationInput([]).ok, false);
  assert.equal(validateDirectConversationInput({ otherProfileId: "not-a-uuid" }).ok, false);
});

test("does not call Supabase when the recipient is the authenticated user", async () => {
  const result = await openDirectConversation({
    otherProfileId: actorProfileId,
    actorProfileId,
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.equal(result.reason, "self_conversation");
});

test("calls the SECURITY INVOKER RPC with the caller JWT and recipient only", async () => {
  let request;
  const result = await openDirectConversation({
    otherProfileId: recipientProfileId.toUpperCase(),
    actorProfileId,
    accessToken: "user-jwt",
    env,
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return new Response(JSON.stringify(conversationId), { status: 200 });
    },
  });

  assert.deepEqual(result, { ok: true, conversationId });
  assert.equal(request.url, "https://polychat.example/rest/v1/rpc/open_direct_conversation");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers.Authorization, "Bearer user-jwt");
  assert.equal(request.options.headers.apikey, "publishable-test-key");
  assert.deepEqual(JSON.parse(request.options.body), {
    p_other_profile_id: recipientProfileId,
  });
  assert.equal(request.options.cache, "no-store");
});

test("does not accept an actor identity from the request payload", async () => {
  const input = validateDirectConversationInput({
    otherProfileId: recipientProfileId,
    actorProfileId: "99999999-9999-4999-8999-999999999999",
  });
  assert.deepEqual(input, { ok: true, otherProfileId: recipientProfileId });
});

test("fails closed when the database rejects access to the recipient", async () => {
  const result = await openDirectConversation({
    otherProfileId: recipientProfileId,
    actorProfileId,
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response("{}", { status: 403 }),
  });
  assert.deepEqual(result, {
    ok: false,
    status: 403,
    reason: "conversation_forbidden",
  });
});

test("maps an expired token to 401 and provider failures to 503", async () => {
  const expired = await openDirectConversation({
    otherProfileId: recipientProfileId,
    actorProfileId,
    accessToken: "expired-jwt",
    env,
    fetchImpl: async () => new Response("{}", { status: 401 }),
  });
  const unavailable = await openDirectConversation({
    otherProfileId: recipientProfileId,
    actorProfileId,
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => { throw new Error("private provider detail"); },
  });
  assert.equal(expired.status, 401);
  assert.equal(unavailable.status, 503);
  assert.equal(JSON.stringify(unavailable).includes("private provider detail"), false);
});

test("does not claim success when the RPC response is not a UUID", async () => {
  const result = await openDirectConversation({
    otherProfileId: recipientProfileId,
    actorProfileId,
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response(JSON.stringify({ id: conversationId }), { status: 200 }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
});
