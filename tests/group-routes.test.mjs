import test from "node:test";
import assert from "node:assert/strict";
import { GroupAdminError } from "../src/groups/group-admin.mjs";
import { createGroupRouteHandlers } from "../src/groups/group-routes.mjs";

const session = {
  accessToken: "rotated-access-token",
  refreshToken: "rotated-refresh-token",
  expiresIn: 1800,
  refreshed: true,
  user: { id: "11111111-1111-4111-8111-111111111111", role: "ti" },
};
const group = {
  id: "22222222-2222-4222-8222-222222222222",
  kind: "group",
  name: "Equipe técnica",
};

function request(body, { invalidJson = false } = {}) {
  return {
    cookies: { get: () => undefined },
    async json() {
      if (invalidJson) throw new SyntaxError("invalid json");
      return body;
    },
  };
}

function authorized(overrides = {}) {
  return {
    authorized: true,
    status: 200,
    session,
    ...overrides,
  };
}

function assertRotatedCookies(response) {
  assert.equal(response.cookies.get("polychat_access_token")?.value, session.accessToken);
  assert.equal(response.cookies.get("polychat_refresh_token")?.value, session.refreshToken);
}

test("POST cria grupo e retorna 201 com cookies renovados", async () => {
  let createArgs;
  let authOptions;
  const handlers = createGroupRouteHandlers({
    authorize: async (_request, options) => {
      authOptions = options;
      return authorized();
    },
    create: async (args) => {
      createArgs = args;
      return group;
    },
  });

  const response = await handlers.POST(request({ name: "Equipe técnica" }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { group });
  assert.deepEqual(createArgs, {
    actorProfileId: session.user.id,
    name: "Equipe técnica",
  });
  assert.deepEqual(authOptions.allowedRoles, ["ti"]);
  assert.equal(authOptions.preserveSessionOnForbidden, true);
  assert.equal(authOptions.enforceDeviceCompatibility, true);
  assertRotatedCookies(response);
});

test("POST mantém cookies renovados quando o corpo JSON é inválido", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    create: async () => assert.fail("não deve criar grupo com JSON inválido"),
  });

  const response = await handlers.POST(request(null, { invalidJson: true }));
  assert.equal(response.status, 400);
  assertRotatedCookies(response);
});

test("POST mantém cookies renovados quando a validação do payload falha", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    create: async () => assert.fail("não deve criar grupo com campos extras"),
  });

  const response = await handlers.POST(request({ name: "Equipe", role: "ti" }));
  assert.equal(response.status, 400);
  assertRotatedCookies(response);
});

test("POST preserva sessão renovada ao negar perfil User com 403", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized({
      authorized: false,
      status: 403,
      session: { ...session, user: { ...session.user, role: "user" } },
    }),
    create: async () => assert.fail("perfil User não pode criar grupo"),
  });

  const response = await handlers.POST(request({ name: "Equipe" }));
  assert.equal(response.status, 403);
  assertRotatedCookies(response);
});

test("POST não cria cookies quando não existe sessão (401)", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => ({
      authorized: false,
      status: 401,
      session: null,
    }),
    create: async () => assert.fail("sessão ausente não pode criar grupo"),
  });

  const response = await handlers.POST(request({ name: "Equipe" }));
  assert.equal(response.status, 401);
  assert.equal(response.cookies.get("polychat_access_token"), undefined);
});

test("POST mantém cookies renovados quando a RPC retorna erro de domínio", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    create: async () => {
      throw new GroupAdminError("Grupo não encontrado.", 404);
    },
  });

  const response = await handlers.POST(request({ name: "Equipe" }));
  assert.equal(response.status, 404);
  assertRotatedCookies(response);
});

test("PATCH atualiza nome e mantém cookies renovados em sucesso", async () => {
  let updateArgs;
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    update: async (args) => {
      updateArgs = args;
      return { ...group, name: "Novo nome" };
    },
  });

  const response = await handlers.PATCH(
    request({ name: "Novo nome" }),
    { params: Promise.resolve({ groupId: group.id }) },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(updateArgs, {
    actorProfileId: session.user.id,
    groupId: group.id,
    name: "Novo nome",
  });
  assert.deepEqual(await response.json(), { group: { ...group, name: "Novo nome" } });
  assertRotatedCookies(response);
});

test("PATCH mantém cookies renovados quando o grupo não existe", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    update: async () => {
      throw new GroupAdminError("Grupo não encontrado.", 404);
    },
  });

  const response = await handlers.PATCH(
    request({ name: "Novo nome" }),
    { params: Promise.resolve({ groupId: group.id }) },
  );
  assert.equal(response.status, 404);
  assertRotatedCookies(response);
});

test("PATCH rejeita campos fora do contrato sem chamar a RPC", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    update: async () => assert.fail("não deve atualizar campos não permitidos"),
  });

  const response = await handlers.PATCH(
    request({ name: "Novo nome", status: "disabled" }),
    { params: Promise.resolve({ groupId: group.id }) },
  );
  assert.equal(response.status, 400);
  assertRotatedCookies(response);
});

test("POST rejeita objeto sem name antes de chamar a operação", async () => {
  const handlers = createGroupRouteHandlers({
    authorize: async () => authorized(),
    create: async () => assert.fail("não deve criar grupo sem name"),
  });

  const response = await handlers.POST(request({}));
  assert.equal(response.status, 400);
  assertRotatedCookies(response);
});
