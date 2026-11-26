const EVENT_TYPES = new Set([
  "admin.login.succeeded",
  "admin.login.failed",
  "account.created",
  "account.updated",
  "account.deactivated",
  "group.created",
  "group.updated",
  "group.member_added",
  "group.member_removed",
  "sensitive.consultation",
  "sensitive.change",
]);

const OUTCOMES = new Set(["success", "failure", "denied"]);
const SECRET_KEY_PARTS = [
  "password", "passwd", "token", "secret", "authorization", "credential",
  "apikey", "privatekey", "cookie", "session", "clientsecret",
];
const MAX_METADATA_BYTES = 8192;
const MAX_METADATA_DEPTH = 6;
const MAX_PAGE_SIZE = 100;

function isSecretKey(key) {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  return SECRET_KEY_PARTS.some((part) => normalized.includes(part));
}

function sanitizeValue(value, depth = 0) {
  if (depth > MAX_METADATA_DEPTH) {
    throw new TypeError("Metadados de auditoria excedem a profundidade permitida.");
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, depth + 1));
  if (value && typeof value === "object") {
    const sanitized = {};
    for (const [key, nested] of Object.entries(value)) {
      if (!isSecretKey(key)) sanitized[key] = sanitizeValue(nested, depth + 1);
    }
    return sanitized;
  }
  if (typeof value === "string" && value.length > 1024) {
    throw new TypeError("Valor de metadado excede 1024 caracteres.");
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new TypeError("Metadados não aceitam números não finitos.");
  }
  if (["string", "number", "boolean"].includes(typeof value) || value === null) return value;
  throw new TypeError("Tipo de metadado não suportado.");
}

export function sanitizeAuditMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new TypeError("Metadados devem ser um objeto JSON.");
  }
  const sanitized = sanitizeValue(metadata);
  if (Buffer.byteLength(JSON.stringify(sanitized), "utf8") > MAX_METADATA_BYTES) {
    throw new TypeError("Metadados de auditoria excedem 8 KB.");
  }
  return sanitized;
}

function assertPrivilegedActor(actor, eventType) {
  if (eventType === "admin.login.failed" && actor == null) return null;
  if (!actor || actor.role !== "ti" || actor.isActive !== true || typeof actor.id !== "string") {
    throw new Error("Ação de auditoria exige ator TI autenticado e ativo.");
  }
  return actor.id;
}

function assertSupabase(supabase) {
  if (!supabase?.rpc || !supabase?.from) {
    throw new TypeError("Cliente Supabase server-side inválido.");
  }
}

export async function recordPrivilegedAuditEvent({
  supabase,
  actor,
  eventType,
  resourceType,
  resourceId = null,
  outcome = "success",
  metadata = {},
}) {
  assertSupabase(supabase);
  if (!EVENT_TYPES.has(eventType)) throw new TypeError("Tipo de evento de auditoria inválido.");
  if (!OUTCOMES.has(outcome)) throw new TypeError("Resultado de auditoria inválido.");
  if (typeof resourceType !== "string" || !/^[a-z_]{1,64}$/.test(resourceType)) {
    throw new TypeError("Tipo de recurso de auditoria inválido.");
  }
  if (resourceId !== null && (typeof resourceId !== "string" || resourceId.length > 128)) {
    throw new TypeError("Identificador de recurso inválido.");
  }

  const actorProfileId = assertPrivilegedActor(actor, eventType);
  const safeMetadata = sanitizeAuditMetadata(metadata);
  const { data, error } = await supabase.rpc("write_privileged_audit_event", {
    p_actor_profile_id: actorProfileId,
    p_event_type: eventType,
    p_resource_type: resourceType,
    p_resource_id: resourceId,
    p_outcome: outcome,
    p_metadata: safeMetadata,
  });
  if (error) throw new Error("Não foi possível registrar o evento de auditoria.", { cause: error });
  return data;
}

export async function searchPrivilegedAuditEvents({
  supabase,
  actor,
  filters = {},
  limit = 50,
  offset = 0,
}) {
  assertSupabase(supabase);
  if (!actor || actor.role !== "ti" || actor.isActive !== true) {
    throw new Error("Consulta da auditoria restrita ao perfil TI ativo.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    throw new TypeError("Limite de consulta deve estar entre 1 e 100.");
  }
  if (!Number.isInteger(offset) || offset < 0) throw new TypeError("Offset inválido.");

  let query = supabase
    .from("privileged_action_audit")
    .select("id, actor_profile_id, event_type, resource_type, resource_id, occurred_at, outcome, metadata", { count: "exact" })
    .order("occurred_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const exactFilters = [
    ["eventType", "event_type"],
    ["actorProfileId", "actor_profile_id"],
    ["resourceType", "resource_type"],
    ["resourceId", "resource_id"],
    ["outcome", "outcome"],
  ];
  for (const [inputKey, column] of exactFilters) {
    const value = filters[inputKey];
    if (value !== undefined && value !== null && value !== "") query = query.eq(column, value);
  }
  if (filters.from) query = query.gte("occurred_at", filters.from);
  if (filters.to) query = query.lte("occurred_at", filters.to);

  const { data, error, count } = await query;
  if (error) throw new Error("Não foi possível consultar a trilha de auditoria.", { cause: error });
  return { events: data ?? [], total: count ?? 0, limit, offset };
}

export const PRIVILEGED_AUDIT_EVENT_TYPES = Object.freeze([...EVENT_TYPES]);
