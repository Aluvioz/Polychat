import test from "node:test";
import assert from "node:assert/strict";
import { authorizeTIConsoleRequest } from "../src/auth/ti-console.mjs";

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

const tiSession = {
  refreshed: false,
  user: { id: "ti-1", username: "administrador", role: "ti" },
};
const userSession = {
  refreshed: false,
  user: { id: "user-1", username: "colaborador", role: "user" },
};

test("permite acesso ao console para TI autenticado e ativo", async () => {
  const result = await authorizeTIConsoleRequest(requestCookies("access"), {
    validate: async () => tiSession,
  });

  assert.equal(result.authorized, true);
  assert.equal(result.status, 200);
  assert.equal(result.session.user.role, "ti");
});

test("nega usuário comum mesmo que solicite a role user nas opções", async () => {
  const result = await authorizeTIConsoleRequest(requestCookies("access"), {
    allowedRoles: ["user"],
    validate: async () => userSession,
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.session, null);
});

test("nega sessão ausente ou expirada", async () => {
  const result = await authorizeTIConsoleRequest(requestCookies(), {
    validate: async () => null,
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 401);
});

test("falha de validação não concede acesso", async () => {
  const result = await authorizeTIConsoleRequest(requestCookies("access"), {
    validate: async () => {
      throw new Error("detalhe interno");
    },
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 503);
  assert.equal(JSON.stringify(result).includes("detalhe interno"), false);
});
