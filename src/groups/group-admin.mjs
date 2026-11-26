/**
 * Server-only group administration through transaction-safe PostgreSQL RPCs.
 * Never import this module into a Client Component.
 */

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class GroupAdminError extends Error {
  constructor(message, status = 503) {
    super(message);
    this.name = "GroupAdminError";
    this.status = status;
  }
}

function getConfig(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = env.SUPABASE_SECRET_KEY;

  if (!baseUrl || !secretKey) {
    throw new GroupAdminError("Serviço de grupos indisponível.", 503);
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    secretKey,
  };
}

function mapDatabaseError(payload) {
  switch (payload?.code) {
    case "42501":
      return new GroupAdminError("Operação administrativa não autorizada.", 403);
    case "22023":
      return new GroupAdminError("Dados do grupo inválidos.", 400);
    case "P0002":
      return new GroupAdminError("Grupo não encontrado.", 404);
    case "P0001":
      return new GroupAdminError("O recurso informado não é um grupo.", 409);
    default:
      return new GroupAdminError("Não foi possível salvar os dados do grupo.", 503);
  }
}

async function invokeGroupRpc({
  functionName,
  args,
  env = process.env,
  fetchImpl = fetch,
}) {
  const config = getConfig(env);
  let response;

  try {
    response = await fetchImpl(
      `${config.baseUrl}/rest/v1/rpc/${functionName}`,
      {
        method: "POST",
        headers: {
          apikey: config.secretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
        cache: "no-store",
      },
    );
  } catch {
    throw new GroupAdminError("Não foi possível acessar o serviço de grupos.", 503);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // A resposta inválida é tratada como falha genérica abaixo.
  }

  if (!response.ok) throw mapDatabaseError(payload);

  if (!payload || typeof payload !== "object" || !UUID_PATTERN.test(payload.id ?? "")) {
    throw new GroupAdminError("O serviço de grupos retornou uma resposta inválida.", 503);
  }

  return payload;
}

function assertActor(actorProfileId) {
  if (typeof actorProfileId !== "string" || !UUID_PATTERN.test(actorProfileId)) {
    throw new GroupAdminError("Identidade administrativa inválida.", 403);
  }
}

function normalizeName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new GroupAdminError("Informe um nome válido para o grupo.", 400);
  }
  return name.trim();
}

export async function createGroup({
  actorProfileId,
  name,
  env = process.env,
  fetchImpl = fetch,
}) {
  assertActor(actorProfileId);
  return invokeGroupRpc({
    functionName: "create_group_with_audit",
    args: {
      p_actor_profile_id: actorProfileId,
      p_name: normalizeName(name),
    },
    env,
    fetchImpl,
  });
}

export async function updateGroupMetadata({
  actorProfileId,
  groupId,
  name,
  env = process.env,
  fetchImpl = fetch,
}) {
  assertActor(actorProfileId);
  if (typeof groupId !== "string" || !UUID_PATTERN.test(groupId)) {
    throw new GroupAdminError("Identificador do grupo inválido.", 400);
  }

  return invokeGroupRpc({
    functionName: "update_group_metadata_with_audit",
    args: {
      p_actor_profile_id: actorProfileId,
      p_group_id: groupId,
      p_name: normalizeName(name),
    },
    env,
    fetchImpl,
  });
}
