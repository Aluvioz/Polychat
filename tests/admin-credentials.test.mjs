import test from "node:test";
import assert from "node:assert/strict";
import { resetUserPassword } from "../src/auth/admin-credentials.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat-test.supabase.co",
  SUPABASE_SECRET_KEY: "server-only-test-key",
};
const ti = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  role: "ti",
  isActive: true,
};
const profileId = "11111111-1111-4111-8111-111111111111";
const profile = {
  id: profileId,
  username: "colaborador",
  role: "user",
  is_active: true,
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
    const handler = handlers.find((item) => item.match(url, init));
    if (!handler) throw new Error(`Unexpected request: ${url}`);
    return handler.respond(url, init);
  };
  return { calls, fetchImpl };
}

const profileLookup = {
  match: (url) => url.pathname === "/rest/v1/profiles" &&
    url.searchParams.get("id") === `eq.${profileId}`,
  respond: () => json([profile]),
};
const authUpdate = {
  match: (url, init) => url.pathname === `/auth/v1/admin/users/${profileId}` &&
    init.method === "PUT",
  respond: () => json({ id: profileId }),
};
const auditWrite = {
  match: (url, init) => url.pathname === "/rest/v1/rpc/write_privileged_audit_event" &&
    init.method === "POST",
  respond: () => json("audit-event-id"),
};

test("TI redefine senha por ID interno sem exigir ou consultar e-mail", async () => {
  const { fetchImpl, calls } = mockFetch([profileLookup, authUpdate, auditWrite]);
  const result = await resetUserPassword({
    actor: ti,
    profileId,
    password: "senha-definida-pela-ti",
    env,
    fetchImpl,
  });

  assert.deepEqual(result, { profileId, username: "colaborador" });
  const update = calls.find(({ url }) => url.pathname.startsWith("/auth/v1/admin/users/"));
  assert.equal(update.init.headers.apikey, env.SUPABASE_SECRET_KEY);
  assert.equal(update.init.headers.Authorization, undefined);
  assert.deepEqual(JSON.parse(update.init.body), { password: "senha-definida-pela-ti" });
  assert.equal(calls.some(({ url }) => url.pathname.includes("/admin/users/") && url.searchParams.has("email")), false);

  const audit = calls.find(({ url }) => url.pathname.includes("/rpc/"));
  const auditBody = JSON.parse(audit.init.body);
  assert.equal(auditBody.p_event_type, "account.updated");
  assert.equal(auditBody.p_outcome, "success");
  assert.deepEqual(auditBody.p_metadata, { operation: "password_reset" });
  assert.equal(JSON.stringify(auditBody).includes("senha-definida-pela-ti"), false);
});

test("nega reset quando ator não é TI e não chama Supabase", async () => {
  let called = false;
  await assert.rejects(resetUserPassword({
    actor: { ...ti, role: "user" },
    profileId,
    password: "valid-password",
    env,
    fetchImpl: async () => { called = true; },
  }), (error) => error.status === 403);
  assert.equal(called, false);
});

test("nega ator TI inativo", async () => {
  await assert.rejects(resetUserPassword({
    actor: { ...ti, isActive: false },
    profileId,
    password: "valid-password",
    env,
    fetchImpl: async () => assert.fail("não deve chamar Supabase"),
  }), (error) => error.status === 403);
});

test("rejeita identificador e senha inválidos antes de acessar o provedor", async () => {
  const fetchImpl = async () => assert.fail("não deve chamar Supabase");
  await assert.rejects(resetUserPassword({
    actor: ti, profileId: "not-a-uuid", password: "valid-password", env, fetchImpl,
  }), (error) => error.status === 400);
  await assert.rejects(resetUserPassword({
    actor: ti, profileId, password: "", env, fetchImpl,
  }), (error) => error.status === 400);
  await assert.rejects(resetUserPassword({
    actor: ti, profileId, password: "x".repeat(1025), env, fetchImpl,
  }), (error) => error.status === 400);
});

test("conta inexistente não aciona atualização de senha", async () => {
  const { fetchImpl, calls } = mockFetch([{
    ...profileLookup,
    respond: () => json([]),
  }]);
  await assert.rejects(resetUserPassword({
    actor: ti, profileId, password: "valid-password", env, fetchImpl,
  }), (error) => error.status === 404);
  assert.equal(calls.length, 1);
});

test("falha no provedor gera auditoria de falha sem revelar detalhes", async () => {
  const { fetchImpl, calls } = mockFetch([
    profileLookup,
    { ...authUpdate, respond: () => json({ message: "provider secret detail" }, 500) },
    auditWrite,
  ]);
  await assert.rejects(resetUserPassword({
    actor: ti, profileId, password: "never-log-this", env, fetchImpl,
  }), (error) => error.status === 503 && !error.message.includes("provider"));
  const audit = calls.find(({ url }) => url.pathname.includes("/rpc/"));
  const payload = JSON.parse(audit.init.body);
  assert.equal(payload.p_outcome, "failure");
  assert.equal(JSON.stringify(payload).includes("never-log-this"), false);
});

test("falha fechada quando a configuração server-side está incompleta", async () => {
  await assert.rejects(resetUserPassword({
    actor: ti, profileId, password: "valid-password", env: {},
    fetchImpl: async () => assert.fail("não deve chamar Supabase"),
  }), (error) => error.status === 503);
});

test("retorna falha explícita se a atualização ocorrer mas a auditoria não puder ser confirmada", async () => {
  const { fetchImpl } = mockFetch([
    profileLookup,
    authUpdate,
    { ...auditWrite, respond: () => json({ message: "audit unavailable" }, 500) },
  ]);
  await assert.rejects(resetUserPassword({
    actor: ti, profileId, password: "valid-password", env, fetchImpl,
  }), (error) => error.status === 503 && error.message.includes("auditoria"));
});
