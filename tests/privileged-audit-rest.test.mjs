import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePrivilegedAuditFilters,
  recordPrivilegedAuditEventRest,
  searchPrivilegedAuditEventsRest,
} from "../src/audit/privileged-audit-rest.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat-test.supabase.co",
  SUPABASE_SECRET_KEY: "server-only-test-key",
};
const ti = {
  id: "11111111-1111-4111-8111-111111111111",
  role: "ti",
  isActive: true,
};

test("registra login administrativo com RPC server-side e metadados sanitizados", async () => {
  let request;
  const result = await recordPrivilegedAuditEventRest({
    actor: ti,
    eventType: "admin.login.succeeded",
    resourceType: "auth_session",
    metadata: { password: "do-not-store", channel: "password" },
    env,
    fetchImpl: async (url, init) => {
      request = { url: String(url), init };
      return new Response(JSON.stringify("event-id"), { status: 200 });
    },
  });
  assert.equal(result, "event-id");
  assert.equal(request.url, "https://polychat-test.supabase.co/rest/v1/rpc/write_privileged_audit_event");
  assert.equal(request.init.headers.apikey, env.SUPABASE_SECRET_KEY);
  assert.equal(request.init.headers.Authorization, `Bearer ${env.SUPABASE_SECRET_KEY}`);
  const body = JSON.parse(request.init.body);
  assert.equal(body.p_actor_profile_id, ti.id);
  assert.deepEqual(body.p_metadata, { channel: "password" });
});

test("registra falha de login TI sem atribuir identidade não autenticada", async () => {
  let body;
  await recordPrivilegedAuditEventRest({
    actor: null,
    eventType: "admin.login.failed",
    resourceType: "auth_session",
    outcome: "failure",
    env,
    fetchImpl: async (_url, init) => {
      body = JSON.parse(init.body);
      return new Response(JSON.stringify("event-id"), { status: 200 });
    },
  });
  assert.equal(body.p_actor_profile_id, null);
  assert.equal(body.p_outcome, "failure");
});

test("não permite ator comum registrar ação privilegiada", async () => {
  await assert.rejects(recordPrivilegedAuditEventRest({
    actor: { id: ti.id, role: "user", isActive: true },
    eventType: "admin.login.succeeded",
    resourceType: "auth_session",
    env,
    fetchImpl: async () => assert.fail("não deve chamar o banco"),
  }), /ator TI autenticado e ativo/);
});

test("valida filtros e paginação da pesquisa", () => {
  const parsed = parsePrivilegedAuditFilters(new URLSearchParams(
    "eventType=group.created&actorProfileId=11111111-1111-4111-8111-111111111111&limit=20&offset=40&from=2026-11-01T00%3A00%3A00Z",
  ));
  assert.deepEqual(parsed, {
    filters: {
      eventType: "group.created",
      actorProfileId: ti.id,
      from: "2026-11-01T00:00:00Z",
      to: null,
    },
    limit: 20,
    offset: 40,
  });
  assert.throws(
    () => parsePrivilegedAuditFilters(new URLSearchParams("limit=101")),
    /Parâmetro limit inválido/,
  );
  assert.throws(
    () => parsePrivilegedAuditFilters(new URLSearchParams("eventType=unknown")),
    /Tipo de evento inválido/,
  );
});

test("pesquisa eventos usando filtros no PostgREST e paginação", async () => {
  let request;
  const events = [{ id: "event-1", event_type: "group.created" }];
  const result = await searchPrivilegedAuditEventsRest({
    params: new URLSearchParams(
      "eventType=group.created&resourceType=conversation&limit=10&offset=10",
    ),
    env,
    fetchImpl: async (url, init) => {
      request = { url: new URL(String(url)), init };
      return new Response(JSON.stringify(events), {
        status: 200,
        headers: { "Content-Range": "10-10/31" },
      });
    },
  });
  assert.deepEqual(result, { events, total: 31, limit: 10, offset: 10 });
  assert.equal(request.url.searchParams.get("event_type"), "eq.group.created");
  assert.equal(request.url.searchParams.get("resource_type"), "eq.conversation");
  assert.equal(request.url.searchParams.get("limit"), "10");
  assert.equal(request.url.searchParams.get("offset"), "10");
  assert.equal(request.init.headers.apikey, env.SUPABASE_SECRET_KEY);
});

test("não expõe detalhes do provedor quando a consulta falha", async () => {
  await assert.rejects(
    searchPrivilegedAuditEventsRest({
      params: new URLSearchParams(),
      env,
      fetchImpl: async () => new Response("private database detail", { status: 500 }),
    }),
    (error) => error.message === "Não foi possível consultar a trilha de auditoria.",
  );
});
