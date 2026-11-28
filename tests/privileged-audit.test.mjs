import test from "node:test";
import assert from "node:assert/strict";
import {
  PRIVILEGED_AUDIT_EVENT_TYPES,
  recordPrivilegedAuditEvent,
  sanitizeAuditMetadata,
  searchPrivilegedAuditEvents,
} from "../src/audit/privileged-audit.mjs";

const ti = { id: "ti-1", role: "ti", isActive: true };

test("catálogo contém os eventos privilegiados previstos na Issue #124", () => {
  assert.deepEqual(PRIVILEGED_AUDIT_EVENT_TYPES, [
    "admin.login.succeeded", "admin.login.failed", "account.created", "account.updated",
    "account.deactivated", "group.created", "group.updated", "group.member_added",
    "group.member_removed", "sensitive.consultation", "sensitive.change",
  ]);
});

test("remove recursivamente campos de credenciais dos metadados", () => {
  const result = sanitizeAuditMetadata({
    action: "account.updated",
    password: "not-to-store",
    nested: { access_token: "secret", target: "profile" },
    items: [{ authorization: "Bearer secret", id: "x" }],
  });
  assert.deepEqual(result, {
    action: "account.updated",
    nested: { target: "profile" },
    items: [{ id: "x" }],
  });
});

test("rejeita metadados que não sejam objeto", () => {
  assert.throws(() => sanitizeAuditMetadata(["x"]), /objeto JSON/);
});

test("não registra ação sem ator TI ativo", async () => {
  const supabase = { rpc: async () => assert.fail("RPC não deve ser chamado"), from() {} };
  await assert.rejects(recordPrivilegedAuditEvent({
    supabase, actor: { id: "u-1", role: "user", isActive: true },
    eventType: "account.updated", resourceType: "profile",
  }), /ator TI autenticado e ativo/);
});

test("permite registrar falha de login administrativo sem identidade validada", async () => {
  let args;
  const supabase = { rpc: async (name, payload) => { args = { name, payload }; return { data: "event-1", error: null }; }, from() {} };
  const result = await recordPrivilegedAuditEvent({
    supabase, actor: null, eventType: "admin.login.failed", resourceType: "auth_session", outcome: "failure",
    metadata: { reason: "invalid_credentials", password: "discard" },
  });
  assert.equal(result, "event-1");
  assert.equal(args.name, "write_privileged_audit_event");
  assert.equal(args.payload.p_actor_profile_id, null);
  assert.deepEqual(args.payload.p_metadata, { reason: "invalid_credentials" });
});

test("propaga falha do banco sem expor mensagem interna", async () => {
  const supabase = { rpc: async () => ({ data: null, error: new Error("database secret") }), from() {} };
  await assert.rejects(recordPrivilegedAuditEvent({
    supabase, actor: ti, eventType: "account.updated", resourceType: "profile",
  }), (error) => error.message === "Não foi possível registrar o evento de auditoria.");
});

test("consulta de auditoria exige TI ativo", async () => {
  const supabase = { from: () => assert.fail("consulta não deve ser iniciada"), rpc() {} };
  await assert.rejects(searchPrivilegedAuditEvents({
    supabase, actor: { id: "u-1", role: "user", isActive: true },
  }), /restrita ao perfil TI ativo/);
});

test("pesquisa aplica filtros e paginação no servidor", async () => {
  const calls = [];
  const query = {
    select(...args) { calls.push(["select", ...args]); return this; },
    order(...args) { calls.push(["order", ...args]); return this; },
    range(...args) { calls.push(["range", ...args]); return this; },
    eq(...args) { calls.push(["eq", ...args]); return this; },
    gte(...args) { calls.push(["gte", ...args]); return this; },
    lte(...args) { calls.push(["lte", ...args]); return this; },
    then(resolve) { resolve({ data: [{ id: "e1" }], count: 1, error: null }); },
  };
  const supabase = { from: (table) => { assert.equal(table, "privileged_action_audit"); return query; }, rpc() {} };
  const result = await searchPrivilegedAuditEvents({
    supabase, actor: ti, limit: 20, offset: 10,
    filters: { eventType: "group.created", actorProfileId: "ti-1", from: "2026-11-01T00:00:00Z" },
  });
  assert.deepEqual(result, { events: [{ id: "e1" }], total: 1, limit: 20, offset: 10 });
  assert.ok(calls.some(([name, ...args]) => name === "range" && args[0] === 10 && args[1] === 29));
  assert.ok(calls.some(([name, ...args]) => name === "eq" && args[0] === "event_type" && args[1] === "group.created"));
  assert.ok(calls.some(([name, ...args]) => name === "gte" && args[0] === "occurred_at"));
});

test("limita paginação a 100 registros", async () => {
  const supabase = { from() { return {}; }, rpc() {} };
  await assert.rejects(searchPrivilegedAuditEvents({ supabase, actor: ti, limit: 101 }), /entre 1 e 100/);
});

test("registro de auditoria aceita adaptador RPC server-side sem cliente de consulta", async () => {
  let called = false;
  const result = await recordPrivilegedAuditEvent({
    supabase: {
      async rpc(name, payload) {
        called = true;
        assert.equal(name, "write_privileged_audit_event");
        assert.equal(payload.p_event_type, "account.updated");
        return { data: "event-rpc-only", error: null };
      },
    },
    actor: ti,
    eventType: "account.updated",
    resourceType: "profile",
    resourceId: "profile-1",
    metadata: { operation: "password_reset" },
  });
  assert.equal(called, true);
  assert.equal(result, "event-rpc-only");
});
