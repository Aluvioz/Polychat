import test from "node:test";
import assert from "node:assert/strict";
import { listUsers, UserAdminError } from "../src/admin/user-admin.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example.supabase.co",
  SUPABASE_SECRET_KEY: "server-secret",
};

function response(payload, { ok = true, headers = {} } = {}) {
  return {
    ok,
    json: async () => payload,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
  };
}

test("lista apenas metadados de perfil com paginação e segredo server-side", async () => {
  let request;
  const users = [{ id: "id-1", username: "ana", role: "user", is_active: true }];
  const result = await listUsers({
    page: "2",
    limit: "10",
    env,
    fetchImpl: async (url, init) => {
      request = { url: new URL(url), init };
      return response(users, { headers: { "content-range": "10-19/31" } });
    },
  });

  assert.deepEqual(result, { users, page: 2, limit: 10, total: 31 });
  assert.equal(request.url.searchParams.get("select"), "id,username,role,is_active,created_at,updated_at");
  assert.equal(request.url.searchParams.get("limit"), "10");
  assert.equal(request.url.searchParams.get("offset"), "10");
  assert.equal(request.init.headers.apikey, env.SUPABASE_SECRET_KEY);
  assert.equal(request.init.headers.Authorization, `Bearer ${env.SUPABASE_SECRET_KEY}`);
  assert.equal(request.init.cache, "no-store");
});

test("aplica pesquisa, perfil e estado sem aceitar filtros arbitrários", async () => {
  let url;
  await listUsers({
    search: "ana",
    role: "ti",
    status: "inactive",
    env,
    fetchImpl: async (request) => {
      url = new URL(request);
      return response([]);
    },
  });
  assert.equal(url.searchParams.get("username"), "ilike.*ana*");
  assert.equal(url.searchParams.get("role"), "eq.ti");
  assert.equal(url.searchParams.get("is_active"), "eq.false");
});

test("rejeita paginação e filtros inválidos antes da chamada externa", async () => {
  let called = false;
  await assert.rejects(
    listUsers({ limit: "101", env, fetchImpl: async () => { called = true; } }),
    (error) => error instanceof UserAdminError && error.status === 400,
  );
  await assert.rejects(
    listUsers({ role: "superadmin", env, fetchImpl: async () => { called = true; } }),
    (error) => error instanceof UserAdminError && error.status === 400,
  );
  assert.equal(called, false);
});

test("falhas do provedor não expõem detalhes internos", async () => {
  await assert.rejects(
    listUsers({
      env,
      fetchImpl: async () => { throw new Error("private provider detail"); },
    }),
    (error) => error instanceof UserAdminError &&
      error.status === 503 &&
      error.message === "Não foi possível consultar os usuários.",
  );
});
