import test from "node:test";
import assert from "node:assert/strict";
import { listGroups, GroupAdminError } from "../src/groups/group-admin.mjs";

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

test("lista somente grupos com paginação e filtros permitidos", async () => {
  let request;
  const groups = [{ id: "group-1", name: "Equipe", status: "active" }];
  const result = await listGroups({
    page: "2",
    limit: "10",
    search: "Equipe",
    status: "active",
    env,
    fetchImpl: async (url, init) => {
      request = { url: new URL(url), init };
      return response(groups, { headers: { "content-range": "10-19/21" } });
    },
  });

  assert.deepEqual(result, { groups, page: 2, limit: 10, total: 21 });
  assert.equal(request.url.searchParams.get("kind"), "eq.group");
  assert.equal(request.url.searchParams.get("name"), "ilike.*Equipe*");
  assert.equal(request.url.searchParams.get("status"), "eq.active");
  assert.equal(request.url.searchParams.get("offset"), "10");
  assert.equal(request.init.headers.apikey, env.SUPABASE_SECRET_KEY);
  assert.equal(request.init.cache, "no-store");
});

test("rejeita filtros inválidos sem consultar o banco", async () => {
  let called = false;
  await assert.rejects(
    listGroups({
      status: "deleted",
      env,
      fetchImpl: async () => { called = true; },
    }),
    (error) => error instanceof GroupAdminError && error.status === 400,
  );
  assert.equal(called, false);
});

test("falha de rede retorna erro genérico", async () => {
  await assert.rejects(
    listGroups({
      env,
      fetchImpl: async () => { throw new Error("private provider detail"); },
    }),
    (error) => error instanceof GroupAdminError &&
      error.status === 503 &&
      error.message === "Não foi possível acessar o serviço de grupos.",
  );
});
