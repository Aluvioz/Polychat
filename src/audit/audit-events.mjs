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
  conversation_exported: "conversation",
  alert_reviewed: "alert",
  alert_closed: "alert",
  attachment_downloaded: "attachment",
  attachment_released: "attachment",
  message_admin_edited: "message",
  message_admin_deleted: "message",
  configuration_changed: "configuration",
  retention_discarded: "retention",
  retention_hold_placed: "retention",
  retention_hold_released: "retention",
});

const FORBIDDEN_METADATA_KEYS = new Set([
  "body",
  "content",
  "text",
  "message",
  "conversation",
]);

const SENSITIVE_KEY_PATTERN =
  /(^|_)(password|passwd|token|secret|credential|authorization|cookie|api_key|private_key|service_role|access_key|refresh_token|message_body|conversation_body|content_body)(_|$)/i;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hasSensitiveMetadataKey(value) {
  if (Array.isArray(value)) return value.some(hasSensitiveMetadataKey);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) =>
    FORBIDDEN_METADATA_KEYS.has(key.toLowerCase()) ||
    SENSITIVE_KEY_PATTERN.test(key) ||
    hasSensitiveMetadataKey(child),
  );
}

export function validateAuditEvent(event) {
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    throw new TypeError("Invalid audit event.");
  }
  if (typeof event.actorProfileId !== "string" || !UUID_PATTERN.test(event.actorProfileId)) {
    throw new TypeError("Invalid audit actor.");
  }
  const expectedResourceType = EVENT_RESOURCE_TYPES[event.eventType];
  if (!expectedResourceType || event.resourceType !== expectedResourceType) {
    throw new TypeError("Invalid audit event/resource combination.");
  }
  if (event.eventType !== "admin_login" &&
      (typeof event.resourceId !== "string" || !UUID_PATTERN.test(event.resourceId))) {
    throw new TypeError("Audit resource ID is required.");
  }
  if (event.eventType === "admin_login" && event.resourceId != null &&
      (typeof event.resourceId !== "string" || !UUID_PATTERN.test(event.resourceId))) {
    throw new TypeError("Invalid audit resource ID.");
  }
  if (typeof event.outcome !== "string" || event.outcome.trim().length === 0) {
    throw new TypeError("Audit outcome is required.");
  }
  const metadata = event.metadata ?? {};
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new TypeError("Audit metadata must be an object.");
  }
  if (hasSensitiveMetadataKey(metadata)) {
    throw new TypeError("Audit metadata contains a prohibited sensitive key.");
  }

  return {
    actor_profile_id: event.actorProfileId,
    event_type: event.eventType,
    resource_type: event.resourceType,
    resource_id: event.resourceId ?? null,
    outcome: event.outcome.trim(),
    metadata,
  };
}

/**
 * Writes through the caller's Supabase access token. The database guard remains
 * authoritative for actor identity, active TI status and append-only rules.
 * The service-role key is deliberately not accepted by this helper.
 */
export async function recordAuditEvent({
  event,
  accessToken,
  env = process.env,
  fetchImpl = fetch,
}) {
  if (typeof accessToken !== "string" || accessToken.length === 0) {
    throw new TypeError("An authenticated access token is required.");
  }
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) {
    throw new Error("Audit service is not configured.");
  }
  const payload = validateAuditEvent(event);
  let response;
  try {
    response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/rest/v1/audit_events`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    throw new Error("Audit event could not be recorded.");
  }
  if (!response.ok) {
    throw new Error("Audit event could not be recorded.");
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Audit event could not be recorded.");
  }
  const id = Array.isArray(result) ? result[0]?.id : result?.id;
  if (typeof id !== "string") {
    throw new Error("Audit event could not be recorded.");
  }
  return id;
}
