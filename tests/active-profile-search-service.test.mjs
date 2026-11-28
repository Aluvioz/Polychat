import test from "node:test";
import assert from "node:assert/strict";
import {
  searchActiveProfiles,
  validateActiveProfileQuery,
} from "../src/conversations/active-profile-search-service.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example/",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-test-key",
};
const profileId = "22222222-2222-4222-8222-222222222222";

test("validates bounded search input", () => {
  assert.deepEqual(validateActiveProfileQuery("ma"), { ok: true, query: "ma" });
  assert.equal(validateActiveProfileQuery(" ").ok, false);
  assert.equal(validateActiveProfileQuery("a").ok, false);
  assert.equal(validateActiveProfileQuery("x".repeat(65)).ok, false);
});

test("calls the restricted RPC with the caller JWT and maps only id/username", async () => {
  let request;
  const result = await searchActiveProfiles({
    query: "ma",
    accessToken: "user-jwt",
    env,
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return new Response(JSON.stringify([{ profile_id: profileId, username: "matheus" }]), { status: 200 });
    },
  });

  assert.deepEqual(result, { ok: true, users: [{ id: profileId, username: "matheus" }] });
  assert.equal(request.url, "https://polychat.example/rest/v1/rpc/search_active_profiles");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers.Authorization, "Bearer user-jwt");
  assert.equal(request.options.headers.apikey, "publishable-test-key");
  assert.equal(request.options.cache, "no-store");
});

test("rejects short queries before calling Supabase", async () => {
  const result = await searchActiveProfiles({
    query: "a",
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 400);
});

test("does not call Supabase without a caller token", async () => {
  const result = await searchActiveProfiles({
    query: "ma",
    accessToken: null,
    env,
    fetchImpl: async () => assert.fail("fetch must not run"),
  });
  assert.equal(result.status, 401);
});

test("rejects malformed or excessive database results", async () => {
  const malformed = await searchActiveProfiles({
    query: "ma",
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response(JSON.stringify([{ profile_id: "bad", username: "x" }]), { status: 200 }),
  });
  assert.equal(malformed.status, 503);

  const excessive = await searchActiveProfiles({
    query: "ma",
    accessToken: "user-jwt",
    env,
    fetchImpl: async () => new Response(JSON.stringify(Array.from({ length: 26 }, (_, i) => ({
      profile_id: profileId,
      username: "user" + i,
    }))), { status: 200 }),
  });
  assert.equal(excessive.status, 503);
});
