import {
  PRIVILEGED_AUDIT_EVENT_TYPES,
  sanitizeAuditMetadata,
} from "./privileged-audit.mjs";

const EVENT_TYPES = new Set(PRIVILEGED_AUDIT_EVENT_TYPES);
const OUTCOMES = new Set(["success", "failure", "denied"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SELECT_COLUMNS = "id,actor_profile_id,event_type,resource_type,resource_id,occurred_at,outcome,metadata";

function getConfig(env) {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !secretKey) {
    throw new Error("Auditoria indisponível.");
  }
  return { baseUrl, secretKey };
}

// Supabase secret API keys are opaque API keys, not JWTs. Send them only
// through the apikey header; Authorization is reserved for user/legacy JWTs.
function apiHeaders(secretKey, extra = {}) {
  return {
    apikey: secretKey,
    ...extra,
  };
}

/**
 * @param {{
 *   actor?: { id: string, role: string, isActive: boolean } | null,
 *   eventType: string,
 *   resourceType: string,
 *   resourceId?: string | null,
 *   outcome?: string,
 *   metadata?: Record<string, unknown>,
 *   env?: NodeJS.ProcessEnv,
 *   fetchImpl?: typeof fetch,
 * }} options
 */
export async function recordPrivilegedAuditEventRest({
  actor = null,
  eventType,
  resourceType,
  resourceId = null,
  outcome = "success",
  metadata = {},
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!EVENT_TYPES.has(eventType)) throw new TypeError("Tipo de evento de auditoria inválido.");
  if (!OUTCOMES.has(outcome)) throw new TypeError("Resultado de auditoria inválido.");
  if (typeof resourceType !== "string" || !/^[a-z_]{1,64}$/.test(resourceType)) {
    throw new TypeError("Tipo de recurso de auditoria inválido.");
  }
  if (resourceId !== null && (typeof resourceId !== "string" || resourceId.length > 128)) {
    throw new TypeError("Identificador de recurso inválido.");
  }
  if (eventType === "admin.login.failed" && actor === null && outcome === "failure") {
    // A failed TI login may have no authenticated identity.
  } else if (!actor || actor.role !== "ti" || actor.isActive !== true ||
      typeof actor.id !== "string" || !UUID_PATTERN.test(actor.id)) {
    throw new Error("Ação de auditoria exige ator TI autenticado e ativo.");
  }

  const safeMetadata = sanitizeAuditMetadata(metadata);
  const { baseUrl, secretKey } = getConfig(env);
  let response;
  try {
    response = await fetchImpl(`${baseUrl}/rest/v1/rpc/write_privileged_audit_event`, {
      method: "POST",
      headers: apiHeaders(secretKey, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        p_actor_profile_id: actor?.id ?? null,
        p_event_type: eventType,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_outcome: outcome,
        p_metadata: safeMetadata,
      }),
      cache: "no-store",
    });
  } catch {
    throw new Error("Não foi possível registrar o evento de auditoria.");
  }
  if (!response.ok) throw new Error("Não foi possível registrar o evento de auditoria.");
  try {
    return await response.json();
  } catch {
    throw new Error("Não foi possível confirmar o registro de auditoria.");
  }
}

function readInteger(params, key, fallback, min, max = Number.MAX_SAFE_INTEGER) {
  const raw = params.get(key);
  if (raw === null) return fallback;
  if (!/^(0|[1-9][0-9]*)$/.test(raw)) throw new TypeError(`Parâmetro ${key} inválido.`);
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new TypeError(`Parâmetro ${key} inválido.`);
  }
  return value;
}

function readDate(params, key) {
  const value = params.get(key);
  if (value === null || value === "") return null;
  if (!/^\\d{4}-\\d{2}-\\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new TypeError(`Parâmetro ${key} inválido.`);
  }
  return value;
}

export function parsePrivilegedAuditFilters(params) {
  const filters = {};
  const eventType = params.get("eventType");
  if (eventType) {
    if (!EVENT_TYPES.has(eventType)) throw new TypeError("Tipo de evento inválido.");
    filters.eventType = eventType;
  }
  const actorProfileId = params.get("actorProfileId");
  if (actorProfileId) {
    if (!UUID_PATTERN.test(actorProfileId)) throw new TypeError("Identificador do ator inválido.");
    filters.actorProfileId = actorProfileId;
  }
  const resourceType = params.get("resourceType");
  if (resourceType) {
    if (!/^[a-z_]{1,64}$/.test(resourceType)) throw new TypeError("Tipo de recurso inválido.");
    filters.resourceType = resourceType;
  }
  const resourceId = params.get("resourceId");
  if (resourceId) {
    if (resourceId.length > 128) throw new TypeError("Identificador de recurso inválido.");
    filters.resourceId = resourceId;
  }
  const outcome = params.get("outcome");
  if (outcome) {
    if (!OUTCOMES.has(outcome)) throw new TypeError("Resultado inválido.");
    filters.outcome = outcome;
  }
  filters.from = readDate(params, "from");
  filters.to = readDate(params, "to");
  if (filters.from && filters.to && Date.parse(filters.from) > Date.parse(filters.to)) {
    throw new TypeError("Intervalo de datas inválido.");
  }
  return {
    filters,
    limit: readInteger(params, "limit", 50, 1, 100),
    offset: readInteger(params, "offset", 0, 0),
  };
}

export async function searchPrivilegedAuditEventsRest({
  params,
  env = process.env,
  fetchImpl = fetch,
}) {
  const { filters, limit, offset } = parsePrivilegedAuditFilters(params);
  const { baseUrl, secretKey } = getConfig(env);
  const url = new URL(`${baseUrl}/rest/v1/privileged_action_audit`);
  url.searchParams.set("select", SELECT_COLUMNS);
  url.searchParams.set("order", "occurred_at.desc");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  const exactFilters = [
    ["eventType", "event_type"],
    ["actorProfileId", "actor_profile_id"],
    ["resourceType", "resource_type"],
    ["resourceId", "resource_id"],
    ["outcome", "outcome"],
  ];
  for (const [key, column] of exactFilters) {
    if (filters[key]) url.searchParams.set(column, `eq.${filters[key]}`);
  }
  if (filters.from && filters.to) {
    url.searchParams.set(
      "and",
      `(occurred_at.gte.${filters.from},occurred_at.lte.${filters.to})`,
    );
  } else if (filters.from) {
    url.searchParams.set("occurred_at", `gte.${filters.from}`);
  } else if (filters.to) {
    url.searchParams.set("occurred_at", `lte.${filters.to}`);
  }

  let response;
  try {
    response = await fetchImpl(url, {
      headers: apiHeaders(secretKey, { Prefer: "count=exact" }),
      cache: "no-store",
    });
  } catch {
    throw new Error("Não foi possível consultar a trilha de auditoria.");
  }
  if (!response.ok) throw new Error("Não foi possível consultar a trilha de auditoria.");
  const events = await response.json();
  if (!Array.isArray(events)) throw new Error("Não foi possível consultar a trilha de auditoria.");
  const contentRange = response.headers.get("content-range") ?? "";
  const totalMatch = contentRange.match(/\\/(\\d+|\\*)$/);
  const total = totalMatch && totalMatch[1] !== "*" ? Number(totalMatch[1]) : events.length;
  return { events, total, limit, offset };
}
