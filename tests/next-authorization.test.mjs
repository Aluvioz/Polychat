import test from "node:test";
import assert from "node:assert/strict";
import { authorizeNextRequest } from "../src/auth/next-authorization.mjs";

function requestCookies(accessToken = null, refreshToken = null) {
  const values = new Map([
    ["polychat_access_token", accessToken],
    ["polychat_refresh_token", refreshToken],
  ]);
  return {
    cookies: {
      get(name) {
        const value = values.get(name);
        return value ? { value } : undefined;
      },
    },
  };
}

const activeUserSession = {
  accessToken: "new-access",
  refreshToken: "new-refresh",
  expiresIn: 3600,
  refreshed: true,
  user: { id: "user-1", username: "colaborador", role: "user" },
};

test("adapta os cookies HttpOnly e autoriza usuário ativo no App Router", async () => {
  let received;
  const result = await authorizeNextRequest(requestCookies("access", "refresh"), {
    validate: async (tokens) => {
      received = tokens;
      return activeUserSession;
    },
  });

  assert.deepEqual(received, { accessToken: "access", refreshToken: "refresh" });
  assert.equal(result.authorized, true);
  assert.equal(result.status, 200);
  assert.equal(result.session.user.role, "user");
});

test("nega sessão ausente ou inválida", async () => {
  const result = await authorizeNextRequest(requestCookies(), {
    validate: async () => null,
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 401);
  assert.equal(result.session, null);
});

test("nega usuário em rota exclusiva de TI", async () => {
  const result = await authorizeNextRequest(requestCookies("access"), {
    allowedRoles: ["ti"],
    validate: async () => activeUserSession,
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
});

test("preserva a sessão renovada quando a role é negada, se solicitado", async () => {
  const result = await authorizeNextRequest(requestCookies("access", "refresh"), {
    allowedRoles: ["ti"],
    preserveSessionOnForbidden: true,
    validate: async () => activeUserSession,
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.session, activeUserSession);
  assert.equal(result.session.refreshToken, "new-refresh");
});

test("permite TI em rota exclusiva de TI", async () => {
  const result = await authorizeNextRequest(requestCookies("access"), {
    allowedRoles: ["ti"],
    validate: async () => ({
      ...activeUserSession,
      user: { ...activeUserSession.user, role: "ti" },
    }),
  });
  assert.equal(result.authorized, true);
  assert.equal(result.session.user.role, "ti");
});

test("falha do provedor não concede acesso e retorna erro genérico", async () => {
  const result = await authorizeNextRequest(requestCookies("access"), {
    validate: async () => {
      const error = new Error("segredo interno");
      error.status = 503;
      throw error;
    },
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 503);
  assert.equal(JSON.stringify(result).includes("segredo interno"), false);
});

test("rejeita configuração de roles vazia ou desconhecida", async () => {
  await assert.rejects(
    authorizeNextRequest(requestCookies(), { allowedRoles: [] }),
    TypeError,
  );
  await assert.rejects(
    authorizeNextRequest(requestCookies(), { allowedRoles: ["admin"] }),
    TypeError,
  );
});
