import test from "node:test";
import assert from "node:assert/strict";
import {
  loginWithUsername,
  validateSession,
  logoutSession,
} from "../src/auth/supabase-session.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.invalid",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fake-public",
  SUPABASE_SECRET_KEY: "fake-server",
};
const profile = { id: "user-a", username: "test", role: "user", is_active: true };
const tokens = {
  access_token: "fake-access",
  refresh_token: "fake-refresh",
  expires_in: 30,
  user: { id: profile.id },
};
const json = (value, status = 200) => new Response(JSON.stringify(value), { status });
const login = (fetchImpl, overrides = {}) =>
  loginWithUsername({ username: "test", password: "test-secret", env, fetchImpl, ...overrides });
const denied = (error) =>
  error.status === 401 && error.message === "Usuário ou senha inválidos.";
const unavailable = (error) =>
  error.status === 503 && error.message === "Não foi possível validar a sessão.";

function sequence(...steps) {
  const calls = [];
  return {
    calls,
    fetchImpl: async (input, init = {}) => {
      calls.push({ url: new URL(String(input)), init });
      const next = steps[calls.length - 1];
      assert.ok(next, "Unexpected provider request");
      return next();
    },
  };
}

test("127-A01: invalid input fails before contacting the provider", async () => {
  for (const overrides of [
    { username: "" }, { username: "   " }, { username: null },
    { password: "" }, { password: 123 }, { username: "a".repeat(129) },
    { password: "a".repeat(1025) },
  ]) {
    const mock = sequence();
    await assert.rejects(login(mock.fetchImpl, overrides), denied);
    assert.equal(mock.calls.length, 0);
  }
});

test("127-A02: ambiguous username or role outside the allowlist is denied", async () => {
  for (const profiles of [[profile, profile], [{ ...profile, role: "admin" }]]) {
    const mock = sequence(() => json(profiles));
    await assert.rejects(login(mock.fetchImpl), denied);
    assert.equal(mock.calls.length, 1);
  }
});

test("127-A03: missing identity email is denied without password exchange", async () => {
  const mock = sequence(() => json([profile]), () => json({ id: profile.id }));
  await assert.rejects(login(mock.fetchImpl), denied);
  assert.equal(mock.calls.length, 2);
});

test("127-A04: token for a different identity cannot establish a session", async () => {
  const mock = sequence(
    () => json([profile]),
    () => json({ email: "test@example.invalid" }),
    () => json({ ...tokens, user: { id: "user-b" } }),
  );
  await assert.rejects(login(mock.fetchImpl), denied);
  assert.equal(mock.calls.length, 3);
});

test("127-A05: provider lookup outage is sanitized and fails closed", async () => {
  const mock = sequence(() => json({ secret: "provider diagnostic" }, 500));
  await assert.rejects(login(mock.fetchImpl), unavailable);
  assert.equal(mock.calls.length, 1);
});

test("127-A06: expired access and rejected refresh result in no session", async () => {
  const mock = sequence(() => json({}, 401), () => json({}, 400));
  assert.equal(await validateSession({ accessToken: "expired", refreshToken: "invalid", env, fetchImpl: mock.fetchImpl }), null);
  assert.equal(mock.calls.length, 2);
  assert.equal(mock.calls[0].init.headers.Authorization, "Bearer expired");
  assert.equal(mock.calls[1].init.headers.apikey, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
});

test("127-A07: session uses current database role, not auth metadata", async () => {
  const mock = sequence(
    () => json({ id: profile.id, user_metadata: { role: "ti" } }),
    () => json([profile]),
  );
  const result = await validateSession({ accessToken: "access", env, fetchImpl: mock.fetchImpl });
  assert.equal(result.user.role, "user");
  assert.equal(result.refreshed, false);
  assert.equal(mock.calls.length, 2);
  assert.equal(mock.calls[0].init.headers.apikey, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  assert.equal(mock.calls[1].init.headers.apikey, env.SUPABASE_SECRET_KEY);
});

test("127-A08: missing session tokens do not access the provider", async () => {
  const mock = sequence();
  assert.equal(await validateSession({ env, fetchImpl: mock.fetchImpl }), null);
  await logoutSession({ env, fetchImpl: mock.fetchImpl });
  assert.equal(mock.calls.length, 0);
});

test("127-A09: session profile lookup outage cannot grant access", async () => {
  const mock = sequence(() => json({ id: profile.id }), () => json({}, 503));
  await assert.rejects(validateSession({ accessToken: "access", env, fetchImpl: mock.fetchImpl }), unavailable);
  assert.equal(mock.calls.length, 2);
});

test("127-A10: successful logout does not unnecessarily exchange refresh token", async () => {
  const mock = sequence(() => json({}));
  await logoutSession({ accessToken: "access", refreshToken: "refresh", env, fetchImpl: mock.fetchImpl });
  assert.equal(mock.calls.length, 1);
  assert.equal(mock.calls[0].url.pathname, "/auth/v1/logout");
  assert.equal(mock.calls[0].init.headers.Authorization, "Bearer access");
});
