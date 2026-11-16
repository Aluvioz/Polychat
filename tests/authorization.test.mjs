import test from "node:test";
import assert from "node:assert/strict";
import { requireAuthenticatedUser, requireRole } from "../src/auth/authorization.mjs";

function response() {
  return { statusCode: 200, body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}
function makeSupabase({ user = { id: "user-1", email: "user@example.com" },
  authError = null, profile = { id: "user-1", role: "user", is_active: true },
  profileError = null } = {}) {
  return {
    auth: { getUser: async () => ({ data: { user }, error: authError }) },
    from: (table) => {
      assert.equal(table, "profiles");
      return { select() { return this; }, eq() { return this; },
        maybeSingle: async () => ({ data: profile, error: profileError }) };
    },
  };
}

test("permite usuário autenticado e ativo", async () => {
  const middleware = requireAuthenticatedUser({ supabase: makeSupabase() });
  const req = { headers: { authorization: "Bearer valid-token" } };
  const res = response(); let called = false;
  await middleware(req, res, () => { called = true; });
  assert.equal(called, true);
  assert.equal(req.authUser.role, "user");
});
test("nega requisição sem token", async () => {
  const middleware = requireAuthenticatedUser({ supabase: makeSupabase() });
  const res = response();
  await middleware({ headers: {} }, res, () => assert.fail("next não deveria ser chamado"));
  assert.equal(res.statusCode, 401);
});
test("nega sessão inválida", async () => {
  const middleware = requireAuthenticatedUser({ supabase: makeSupabase({
    user: null, authError: new Error("invalid token") }) });
  const res = response();
  await middleware({ headers: { authorization: "Bearer bad" } }, res, () => {});
  assert.equal(res.statusCode, 401);
});
test("bloqueia conta inativa", async () => {
  const middleware = requireAuthenticatedUser({ supabase: makeSupabase({
    profile: { id: "user-1", role: "user", is_active: false } }) });
  const res = response();
  await middleware({ headers: { authorization: "Bearer valid" } }, res, () =>
    assert.fail("conta inativa não pode prosseguir"));
  assert.equal(res.statusCode, 403);
});
test("falha na consulta não concede acesso", async () => {
  const middleware = requireAuthenticatedUser({ supabase: makeSupabase({
    profileError: new Error("database unavailable") }) });
  const res = response();
  await middleware({ headers: { authorization: "Bearer valid" } }, res, () => {});
  assert.equal(res.statusCode, 503);
});
test("nega role desconhecida", async () => {
  const middleware = requireAuthenticatedUser({ supabase: makeSupabase({
    profile: { id: "user-1", role: "superadmin", is_active: true } }) });
  const res = response();
  await middleware({ headers: { authorization: "Bearer valid" } }, res, () => {});
  assert.equal(res.statusCode, 403);
});
test("TI pode acessar rota administrativa", () => {
  let called = false;
  requireRole("ti")({ authUser: { id: "ti-1", role: "ti", isActive: true } },
    response(), () => { called = true; });
  assert.equal(called, true);
});
test("User não acessa rota restrita a TI", () => {
  const res = response();
  requireRole("ti")({ authUser: { id: "user-1", role: "user", isActive: true } },
    res, () => assert.fail("não deveria prosseguir"));
  assert.equal(res.statusCode, 403);
});
