import test from "node:test";
import assert from "node:assert/strict";
import { authorizeNextRequest } from "../src/auth/next-authorization.mjs";

const userAgent = {
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
};

function request(userAgentValue) {
  return {
    cookies: { get: () => ({ value: "valid-cookie" }) },
    headers: { get: (name) => name === "user-agent" ? userAgentValue : null },
  };
}

const validateUser = async () => ({
  accessToken: "rotated-access",
  refreshToken: "rotated-refresh",
  expiresIn: 3600,
  refreshed: true,
  user: { id: "user-1", username: "colaborador", role: "user" },
});
const validateTi = async () => ({
  user: { id: "ti-1", username: "suporte", role: "ti" },
});

test("opção de compatibilidade bloqueia User em computador após validar a sessão", async () => {
  const result = await authorizeNextRequest(request(userAgent.desktop), {
    validate: validateUser,
    enforceDeviceCompatibility: true,
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.reason, "DEVICE_NOT_SUPPORTED");
  assert.equal(result.message, "só pode ser usado em celular");
  assert.equal(result.session, null);
});

test("opção de compatibilidade permite User em celular", async () => {
  const result = await authorizeNextRequest(request(userAgent.android), {
    validate: validateUser,
    enforceDeviceCompatibility: true,
  });
  assert.equal(result.authorized, true);
  assert.equal(result.deviceCompatibility.compatible, true);
});

test("opção de compatibilidade bloqueia TI em celular", async () => {
  const result = await authorizeNextRequest(request(userAgent.android), {
    validate: validateTi,
    enforceDeviceCompatibility: true,
  });
  assert.equal(result.authorized, false);
  assert.equal(result.status, 403);
  assert.equal(result.reason, "DEVICE_NOT_SUPPORTED");
});

test("compatibilidade é opt-in e não altera a autorização existente por padrão", async () => {
  const result = await authorizeNextRequest(request(userAgent.desktop), {
    validate: validateUser,
  });
  assert.equal(result.authorized, true);
  assert.equal(result.session.user.role, "user");
  assert.equal(result.session.refreshed, true);
  assert.equal(result.session.refreshToken, "rotated-refresh");
  assert.equal("deviceCompatibility" in result, false);
});

test("rejeita configuração inválida da opção de compatibilidade", async () => {
  await assert.rejects(
    authorizeNextRequest(request(userAgent.android), {
      validate: validateUser,
      enforceDeviceCompatibility: "yes",
    }),
    TypeError,
  );
});
