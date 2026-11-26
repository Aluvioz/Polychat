import { recordPrivilegedAuditEvent } from "../audit/privileged-audit.mjs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PASSWORD_LENGTH = 1024;

function configuration(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !secretKey) {
    throw new Error("Configuração administrativa indisponível.");
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), secretKey };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function adminHeaders(secretKey) {
  return {
    apikey: secretKey,
    "Content-Type": "application/json",
  };
}

async function findProfile(profileId, config, fetchImpl) {
  const url = new URL(`${config.baseUrl}/rest/v1/profiles`);
  url.searchParams.set("select", "id,username,role,is_active");
  url.searchParams.set("id", `eq.${profileId}`);
  url.searchParams.set("limit", "1");

  const response = await fetchImpl(url, {
    headers: adminHeaders(config.secretKey),
    cache: "no-store",
  });
  if (!response.ok) throw serviceError(503, "Não foi possível consultar a conta.");
  const profiles = await readJson(response);
  return Array.isArray(profiles) && profiles.length === 1 ? profiles[0] : null;
}

function createAuditAdapter(config, fetchImpl) {
  return {
    async rpc(functionName, parameters) {
      if (functionName !== "write_privileged_audit_event") {
        return { data: null, error: new Error("Operação de auditoria não permitida.") };
      }
      try {
        const response = await fetchImpl(
          `${config.baseUrl}/rest/v1/rpc/${functionName}`,
          {
            method: "POST",
            headers: adminHeaders(config.secretKey),
            body: JSON.stringify(parameters),
            cache: "no-store",
          },
        );
        const data = await readJson(response);
        return response.ok
          ? { data, error: null }
          : { data: null, error: new Error("Falha ao gravar auditoria.") };
      } catch {
        return { data: null, error: new Error("Falha ao gravar auditoria.") };
      }
    },
  };
}

async function auditPasswordReset({ config, fetchImpl, actor, profileId, outcome }) {
  await recordPrivilegedAuditEvent({
    supabase: createAuditAdapter(config, fetchImpl),
    actor,
    eventType: "account.updated",
    resourceType: "profile",
    resourceId: profileId,
    outcome,
    metadata: { operation: "password_reset" },
  });
}

/**
 * Replaces the password of an existing Auth identity referenced by profiles.id.
 * It does not create identities, choose an Auth identifier, or expose provider
 * details. The password is never included in audit metadata or response data.
 */
export async function resetUserPassword({
  actor,
  profileId,
  password,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!actor || actor.role !== "ti" || actor.isActive !== true ||
      typeof actor.id !== "string" || !UUID_PATTERN.test(actor.id)) {
    throw serviceError(403, "Operação restrita à TI.");
  }
  if (typeof profileId !== "string" || !UUID_PATTERN.test(profileId)) {
    throw serviceError(400, "Identificador de conta inválido.");
  }
  if (typeof password !== "string" || password.length === 0 ||
      password.length > MAX_PASSWORD_LENGTH) {
    throw serviceError(400, "Senha inválida.");
  }

  let config;
  try {
    config = configuration(env);
  } catch {
    throw serviceError(503, "Serviço de credenciais indisponível.");
  }

  let profile;
  try {
    profile = await findProfile(profileId, config, fetchImpl);
  } catch {
    throw serviceError(503, "Não foi possível consultar a conta.");
  }
  if (!profile) throw serviceError(404, "Conta não encontrada.");

  let updateResponse;
  try {
    updateResponse = await fetchImpl(
      `${config.baseUrl}/auth/v1/admin/users/${encodeURIComponent(profile.id)}`,
      {
        method: "PUT",
        headers: adminHeaders(config.secretKey),
        body: JSON.stringify({ password }),
        cache: "no-store",
      },
    );
  } catch {
    try {
      await auditPasswordReset({
        config, fetchImpl, actor, profileId, outcome: "failure",
      });
    } catch {
      // The public response remains generic; neither provider nor audit details escape.
    }
    throw serviceError(503, "Não foi possível redefinir a senha.");
  }

  if (!updateResponse.ok) {
    try {
      await auditPasswordReset({
        config, fetchImpl, actor, profileId, outcome: "failure",
      });
    } catch {
      // Preserve the generic failure response.
    }
    throw serviceError(503, "Não foi possível redefinir a senha.");
  }

  try {
    await auditPasswordReset({
      config, fetchImpl, actor, profileId, outcome: "success",
    });
  } catch {
    // The Auth update cannot be rolled back through the Admin API. Report the
    // incomplete operation so the caller can reconcile it through the audit trail.
    throw serviceError(503, "A senha foi atualizada, mas não foi possível confirmar a auditoria.");
  }

  return { profileId: profile.id, username: profile.username };
}
