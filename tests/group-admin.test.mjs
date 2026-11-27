import test from "node:test";
import assert from "node:assert/strict";
import {
  createGroup,
  GroupAdminError,
  updateGroupMetadata,
} from "../src/groups/group-admin.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat.example.supabase.co",
  SUPABASE_SECRET_KEY: "server-secret",
};
const actorProfileId = "11111111-1111-4111-8111-111111111111";
const groupId = "22222222-2222-4222-8222-222222222222";
const group = {
  id: groupId,
  kind: "group",
  name: "Equipe técnica",
  created_by_profile_id: actorProfileId,
  status: "active",
};

function response(payload, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => payload };
}

test("cria grupo chamando RPC transacional e envia ator validado pelo servidor", async () => {
  let request;
  const result = await createGroup({
    actorProfileId,
    name: "  Equipe técnica  ",
    env,
    fetchImpl: async (url, init) => {
      request = { url, init };
      return response(group);
    },
  });

  assert.equal(result.id, groupId);
  assert.equal(request.url, `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/create_group_with_audit`);
  assert.equal(request.init.method, "POST");
  assert.equal(request.init.headers.apikey, "server-secret");
  assert.equal("Authorization" in request.init.headers, false);
  assert.deepEqual(JSON.parse(request.init.body), {
    p_actor_profile_id: actorProfileId,
    p_name: "Equipe técnica",
  });
  assert.equal(request.init.cache, "no-store");
});

test("atualiza somente o nome por RPC transacional", async () => {
  let request;
  await updateGroupMetadata({
    actorProfileId,
    groupId,
    name: "Novo nome",
    env,
    fetchImpl: async (url, init) => {
      request = { url, init };
      return response({ ...group, name: "Novo nome" });
    },
  });

  assert.equal(request.url, `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/update_group_metadata_with_audit`);
  assert.deepEqual(JSON.parse(request.init.body), {
    p_actor_profile_id: actorProfileId,
    p_group_id: groupId,
    p_name: "Novo nome",
  });
});

test("rejeita nome ausente ou vazio antes de acessar o banco", async () => {
  let called = false;
  await assert.rejects(
    createGroup({
      actorProfileId,
      name: "  ",
      env,
      fetchImpl: async () => { called = true; },
    }),
    (error) => error instanceof GroupAdminError && error.status === 400,
  );
  assert.equal(called, false);
});

test("rejeita identificador de grupo inválido", async () => {
  await assert.rejects(
    updateGroupMetadata({
      actorProfileId,
      groupId: "not-a-uuid",
      name: "Nome",
      env,
      fetchImpl: async () => assert.fail("RPC não deveria ser chamado"),
    }),
    (error) => error instanceof GroupAdminError && error.status === 400,
  );
});

test("não aceita ator não identificado por UUID", async () => {
  await assert.rejects(
    createGroup({
      actorProfileId: "actor-from-request-body",
      name: "Grupo",
      env,
      fetchImpl: async () => assert.fail("RPC não deveria ser chamado"),
    }),
    (error) => error instanceof GroupAdminError && error.status === 403,
  );
});

test("mapeia grupo inexistente sem expor detalhes do Postgres", async () => {
  await assert.rejects(
    updateGroupMetadata({
      actorProfileId,
      groupId,
      name: "Nome",
      env,
      fetchImpl: async () => response(
        { code: "P0002", message: "internal database details" },
        { ok: false, status: 404 },
      ),
    }),
    (error) => error instanceof GroupAdminError &&
      error.status === 404 &&
      error.message === "Grupo não encontrado.",
  );
});

test("mapeia conversa individual e nega mutação como grupo", async () => {
  await assert.rejects(
    updateGroupMetadata({
      actorProfileId,
      groupId,
      name: "Nome",
      env,
      fetchImpl: async () => response(
        { code: "P0001", message: "internal database details" },
        { ok: false, status: 409 },
      ),
    }),
    (error) => error instanceof GroupAdminError && error.status === 409,
  );
});

test("falha de auditoria transacional retorna erro e não declara sucesso", async () => {
  await assert.rejects(
    createGroup({
      actorProfileId,
      name: "Grupo",
      env,
      fetchImpl: async () => response(
        { code: "XX000", message: "audit insert failed" },
        { ok: false, status: 500 },
      ),
    }),
    (error) => error instanceof GroupAdminError &&
      error.status === 503 &&
      error.message === "Não foi possível salvar os dados do grupo.",
  );
});

test("configuração ausente falha sem chamada externa", async () => {
  let called = false;
  await assert.rejects(
    createGroup({
      actorProfileId,
      name: "Grupo",
      env: {},
      fetchImpl: async () => { called = true; },
    }),
    (error) => error instanceof GroupAdminError && error.status === 503,
  );
  assert.equal(called, false);
});

test("trata falha de rede sem expor detalhes internos", async () => {
  await assert.rejects(
    createGroup({
      actorProfileId,
      name: "Grupo",
      env,
      fetchImpl: async () => {
        throw new Error("internal network detail");
      },
    }),
    (error) => error instanceof GroupAdminError &&
      error.status === 503 &&
      error.message === "Não foi possível acessar o serviço de grupos.",
  );
});

test("rejeita resposta RPC sem identificador UUID válido", async () => {
  await assert.rejects(
    createGroup({
      actorProfileId,
      name: "Grupo",
      env,
      fetchImpl: async () => response({ id: "not-a-uuid", name: "Grupo" }),
    }),
    (error) => error instanceof GroupAdminError &&
      error.status === 503 &&
      error.message === "O serviço de grupos retornou uma resposta inválida.",
  );
});

test("mapeia payload SQL inválido sem expor mensagem do banco", async () => {
  await assert.rejects(
    createGroup({
      actorProfileId,
      name: "Grupo",
      env,
      fetchImpl: async () => response(
        { code: "22023", message: "internal database details" },
        { ok: false, status: 400 },
      ),
    }),
    (error) => error instanceof GroupAdminError &&
      error.status === 400 &&
      error.message === "Dados do grupo inválidos.",
  );
});
