const EVENT_RESOURCE_TYPES = Object.freeze({
  admin_login: "session",
  account_created: "account",
  account_updated: "account",
  account_deactivated: "account",
  account_reactivated: "account",
  group_created: "group",
  group_closed: "group",
  group_activated: "group",
  group_deactivated: "group",
  participant_added: "membership",
  participant_removed: "membership",
  conversation_viewed: "conversation",
  alert_reviewed: "alert",
  alert_closed: "alert",
  attachment_downloaded: "attachment",
  attachment_released: "attachment",
  conversation_exported: "conversation",
  message_admin_edited: "message",
  message_admin_deleted: "message",
  configuration_changed: "configuration",
  retention_discarded: "retention",
});

const SENSITIVE_METADATA_KEY =
  /(^|_)(password|passwd|token|secret|credential|authorization|cookie|api_key|private_key|service_role|access_key|refresh_token|message_body|conversation_body|content_body)(_|$)|^(body|content|text|message|conversation)$/i;

export const AUDIT_EVENT_TYPES = Object.freeze(
  Object.keys(EVENT_RESOURCE_TYPES),
);

export class AuditWriteError extends Error {
  constructor() {
    super("A operação não pode ser concluída porque o registro de auditoria falhou.");
    this.name = "AuditWriteError";
  }
}

function assertSafeJson(value, path = "metadata") {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError(`${path} contém um número não serializável.`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSafeJson(item, `${path}[${index}]`));
    return;
  }

  if (typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      if (SENSITIVE_METADATA_KEY.test(key)) {
        throw new TypeError(`${path} contém uma chave de metadados proibida.`);
      }
      assertSafeJson(nestedValue, `${path}.${key}`);
    }
    return;
  }

  throw new TypeError(`${path} contém um valor não serializável.`);
}

/**
 * Records an audit event using the authenticated TI Supabase client.
 *
 * The actor must come from the server-side authentication middleware
 * (req.authUser), not from request body, query parameters or client metadata.
 * The database independently checks auth.uid(), active TI status and event
 * immutability. Callers must await this function and fail closed on rejection.
 *
 * This insert is not atomic with a separate business-data request. Operations
 * requiring atomic mutation + audit must perform both writes in one database
 * transaction/RPC before returning success.
 */
export async function recordAuditEvent({
  supabase,
  actor,
  eventType,
  resourceId = null,
  outcome,
  metadata = {},
}) {
  if (!supabase?.from) {
    throw new TypeError("A server-side Supabase client is required.");
  }

  if (!actor?.id || actor.role !== "ti" || actor.isActive !== true) {
    throw new TypeError("An active TI operator from validated server context is required.");
  }

  const resourceType = EVENT_RESOURCE_TYPES[eventType];
  if (!resourceType) {
    throw new TypeError("Unsupported audit event type.");
  }

  if (typeof outcome !== "string" || outcome.trim().length === 0) {
    throw new TypeError("An audit outcome is required.");
  }

  if (eventType !== "admin_login" && !resourceId) {
    throw new TypeError("The affected resource identifier is required for this event.");
  }

  if (metadata === null || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new TypeError("Audit metadata must be a JSON object.");
  }
  assertSafeJson(metadata);

  const row = {
    actor_profile_id: actor.id,
    event_type: eventType,
    resource_type: resourceType,
    resource_id: resourceId,
    outcome: outcome.trim(),
    metadata,
  };

  try {
    const { error } = await supabase.from("audit_events").insert(row);
    if (error) throw new AuditWriteError();
  } catch {
    throw new AuditWriteError();
  }

  return true;
}
