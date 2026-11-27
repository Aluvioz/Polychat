import test from "node:test";
import assert from "node:assert/strict";
import { authorizeTIConsoleRequest } from "../src/auth/ti-console.mjs";

function requestCookies(accessToken = null, refreshToken = null) {
  const values = new Map([
    ["polychat_access_token", accessToken],
    ["polychat_refresh_token", refreshToken],
  ]);
  return {
    headers: {
      get: (name) =>
        name === "user-agent"
          ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
          : null,
    },
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
  accessToken: "rotated-access",
  refreshToken: "rotated-refresh",
  expiresIn: 3600,
  refreshed: true,
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

test("nega TI em celular e preserva a sessão renovada", async () => {
  const mobileRequest = {
    ...requestCookies("access"),
    headers: {
      get: (name) =>
        name === "user-agent"
          ? "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
          : null,
    },
  };
  const result = await authorizeTIConsoleRequest(mobileRequest, {
    validate: async () => ({ ...userSession, user: { ...userSession.user, role: "ti" } }),
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.reason, "DEVICE_NOT_SUPPORTED");
  assert.equal(result.session.refreshToken, "rotated-refresh");
});

test("nega usuário comum e preserva tokens renovados para a sessão", async () => {
  const result = await authorizeTIConsoleRequest(requestCookies("access"), {
    allowedRoles: ["user"],
    validate: async () => userSession,
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.session, userSession);
  assert.equal(result.session.refreshToken, "rotated-refresh");
});

test("nega papel desconhecido sem conceder acesso e preserva a sessão validada", async () => {
  const unknownRoleSession = {
    user: { id: "unknown-1", username: "sem-papel", role: "admin" },
  };
  const result = await authorizeTIConsoleRequest(requestCookies("access"), {
    validate: async () => unknownRoleSession,
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.session, unknownRoleSession);
  assert.equal(result.session.user.role, "admin");
});

test("nega perfil sem papel sem conceder acesso", async () => {
  const sessionWithoutRole = {
    user: { id: "unknown-2", username: "sem-papel" },
  };
  const result = await authorizeTIConsoleRequest(requestCookies("access"), {
    validate: async () => sessionWithoutRole,
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.session, sessionWithoutRole);
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
