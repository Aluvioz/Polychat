import test from "node:test";
import assert from "node:assert/strict";
import {
  AUTH_COOKIE_NAMES,
  loginWithUsername,
  logoutSession,
  validateSession,
} from "../src/auth/supabase-session.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat-test.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-test-key",
  SUPABASE_SERVICE_ROLE_KEY: "server-only-test-key",
};
const profile = {
  id: "11111111-1111-4111-8111-111111111111",
  username: "alvaro",
  role: "user",
  is_active: true,
};
const tokens = {
  access_token: "access-test",
  refresh_token: "refresh-test",
  expires_in: 3600,
  user: { id: profile.id },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockFetch(handlers) {
  const calls = [];
  const fetchImpl = async (input, init = {}) => {
    const url = new URL(String(input));
    calls.push({ url, init });
    const handler = handlers.find((entry) => entry.match(url, init));
    if (!handler) throw new Error(`Unexpected request: ${url}`);
    return handler.respond(url, init);
  };
  return { fetchImpl, calls };
}

test("login por username resolve identidade, autentica senha e retorna apenas dados de perfil", async () => {
  const { fetchImpl, calls } = mockFetch([
    { match: (u) => u.pathname === "/rest/v1/profiles" && u.searchParams.get("username") === "eq.alvaro",
      respond: () => json([profile]) },
    { match: (u) => u.pathname === `/auth/v1/admin/users/${profile.id}`,
      respond: () => json({ id: profile.id, email: "private@example.invalid" }) },
    { match: (u, i) => u.pathname === "/auth/v1/token" && u.searchParams.get("grant_type") === "password" && i.method === "POST",
      respond: () => json(tokens) },
    { match: (u) => u.pathname === "/rest/v1/profiles" && u.searchParams.get("id") === `eq.${profile.id}`,
      respond: () => json([profile]) },
  ]);

  const result = await loginWithUsername({ username: "alvaro", password: "password", env, fetchImpl });
  assert.deepEqual(result.user, { id: profile.id, username: "alvaro", role: "user" });
  assert.equal(result.accessToken, tokens.access_token);
  assert.equal(result.refreshToken, tokens.refresh_token);
  assert.equal(result.expiresIn, 3600);
  assert.equal(JSON.stringify(result).includes("private@example.invalid"), false);
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`);
  assert.equal(calls[2].init.headers.apikey, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  assert.deepEqual(AUTH_COOKIE_NAMES, {
    access: "polychat_access_token",
    refresh: "polychat_refresh_token",
  });
});

test("username inexistente retorna erro genérico sem consultar identidade ou senha", async () => {
  const { fetchImpl, calls } = mockFetch([
    { match: (u) => u.pathname === "/rest/v1/profiles", respond: () => json([]) },
  ]);
  await assert.rejects(
    loginWithUsername({ username: "unknown", password: "password", env, fetchImpl }),
    (error) => error.status === 401 && error.message === "Usuário ou senha inválidos.",
  );
  assert.equal(calls.length, 1);
});

test("conta inativa não inicia autenticação e não revela seu estado", async () => {
  const { fetchImpl, calls } = mockFetch([
    { match: (u) => u.pathname === "/rest/v1/profiles",
      respond: () => json([{ ...profile, is_active: false }]) },
  ]);
  await assert.rejects(
    loginWithUsername({ username: "alvaro", password: "password", env, fetchImpl }),
    (error) => error.status === 401 && error.message === "Usuário ou senha inválidos.",
  );
  assert.equal(calls.length, 1);
});

test("senha inválida retorna a mesma resposta genérica", async () => {
  const { fetchImpl } = mockFetch([
    { match: (u) => u.pathname === "/rest/v1/profiles" && u.searchParams.has("username"),
      respond: () => json([profile]) },
    { match: (u) => u.pathname.startsWith("/auth/v1/admin/users/"),
      respond: () => json({ email: "private@example.invalid" }) },
    { match: (u) => u.pathname === "/auth/v1/token",
      respond: () => json({ msg: "Invalid login credentials" }, 400) },
  ]);
  await assert.rejects(
    loginWithUsername({ username: "alvaro", password: "wrong", env, fetchImpl }),
    (error) => error.status === 401 && error.message === "Usuário ou senha inválidos.",
  );
});

test("login não retorna sessão se o perfil for desativado durante a autenticação", async () => {
  let logoutCalled = false;
  const { fetchImpl } = mockFetch([
    { match: (u) => u.pathname === "/rest/v1/profiles" && u.searchParams.has("username"),
      respond: () => json([profile]) },
    { match: (u) => u.pathname.startsWith("/auth/v1/admin/users/"),
      respond: () => json({ email: "private@example.invalid" }) },
    { match: (u) => u.pathname === "/auth/v1/token",
      respond: () => json(tokens) },
    { match: (u) => u.pathname === "/rest/v1/profiles" && u.searchParams.has("id"),
      respond: () => json([{ ...profile, is_active: false }]) },
    { match: (u) => u.pathname === "/auth/v1/logout",
      respond: () => { logoutCalled = true; return json({}); } },
  ]);
  await assert.rejects(
    loginWithUsername({ username: "alvaro", password: "password", env, fetchImpl }),
    (error) => error.status === 401,
  );
  assert.equal(logoutCalled, true);
});

test("sessão expirada renova tokens e revalida perfil ativo", async () => {
  const { fetchImpl } = mockFetch([
    { match: (u) => u.pathname === "/auth/v1/user", respond: () => json({ message: "expired" }, 401) },
    { match: (u) => u.pathname === "/auth/v1/token" && u.searchParams.get("grant_type") === "refresh_token",
      respond: () => json(tokens) },
    { match: (u) => u.pathname === "/rest/v1/profiles" && u.searchParams.has("id"),
      respond: () => json([profile]) },
  ]);
  const result = await validateSession({
    accessToken: "expired-access",
    refreshToken: "old-refresh",
    env,
    fetchImpl,
  });
  assert.equal(result.refreshed, true);
  assert.equal(result.accessToken, tokens.access_token);
  assert.equal(result.refreshToken, tokens.refresh_token);
  assert.deepEqual(result.user, { id: profile.id, username: "alvaro", role: "user" });
});

test("sessão de conta desativada é recusada e revogada", async () => {
  let logoutCalled = false;
  const { fetchImpl } = mockFetch([
    { match: (u) => u.pathname === "/auth/v1/user", respond: () => json({ id: profile.id }) },
    { match: (u) => u.pathname === "/rest/v1/profiles",
      respond: () => json([{ ...profile, is_active: false }]) },
    { match: (u) => u.pathname === "/auth/v1/logout",
      respond: () => { logoutCalled = true; return json({}); } },
  ]);
  const result = await validateSession({ accessToken: "access-test", env, fetchImpl });
  assert.equal(result, null);
  assert.equal(logoutCalled, true);
});

test("logout usa refresh token quando o access token já expirou", async () => {
  let refreshCalled = false;
  let logoutCalled = false;
  const { fetchImpl } = mockFetch([
    { match: (u) => u.pathname === "/auth/v1/logout",
      respond: () => { logoutCalled = true; return json({ message: "expired" }, 401); } },
    { match: (u) => u.pathname === "/auth/v1/token" && u.searchParams.get("grant_type") === "refresh_token",
      respond: () => { refreshCalled = true; return json(tokens); } },
  ]);
  await logoutSession({
    accessToken: "expired-access",
    refreshToken: "old-refresh",
    env,
    fetchImpl,
  });
  assert.equal(refreshCalled, true);
  assert.equal(logoutCalled, true);
});

test("sem credenciais de configuração, sessão falha fechada", async () => {
  await assert.rejects(
    loginWithUsername({ username: "alvaro", password: "password", env: {} }),
    (error) => error.status === 503,
  );
});
