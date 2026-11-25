import test from "node:test";
import assert from "node:assert/strict";
import { recordAuditEvent, validateAuditEvent } from "../src/audit/audit-events.mjs";

const actor = "11111111-1111-4111-8111-111111111111";
const resource = "22222222-2222-4222-8222-222222222222";
const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://polychat-test.supabase.co/",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-test-key",
};
const event = {
  actorProfileId: actor,
  eventType: "message_admin_edited",
  resourceType: "message",
  resourceId: resource,
  outcome: "success",
  metadata: { operation: "edit" },
};

test("validates event/resource pairing and creates database payload", () => {
  assert.deepEqual(validateAuditEvent(event), {
    actor_profile_id: actor,
    event_type: "message_admin_edited",
    resource_type: "message",
    resource_id: resource,
    outcome: "success",
    metadata: { operation: "edit" },
  });
});

test("rejects unknown event type or mismatched resource", () => {
  assert.throws(() => validateAuditEvent({ ...event, eventType: "unknown" }), /combination/);
  assert.throws(() => validateAuditEvent({ ...event, resourceType: "conversation" }), /combination/);
});

test("rejects missing resource identifiers except admin_login", () => {
  assert.throws(() => validateAuditEvent({ ...event, resourceId: null }), /required/);
  assert.doesNotThrow(() => validateAuditEvent({
    actorProfileId: actor,
    eventType: "admin_login",
    resourceType: "session",
    resourceId: null,
    outcome: "success",
    metadata: {},
  }));
});

test("rejects sensitive metadata keys recursively", () => {
  assert.throws(() => validateAuditEvent({
    ...event,
    metadata: { context: [{ password: "must-not-be-logged" }] },
  }), /sensitive key/);
  assert.throws(() => validateAuditEvent({
    ...event,
    metadata: { message: "must-not-be-logged" },
  }), /sensitive key/);
});

test("requires a caller access token and does not use service role", async () => {
  await assert.rejects(
    recordAuditEvent({ event, env, fetchImpl: async () => { throw new Error("should not run"); } }),
    /access token/,
  );
});

test("posts with anon key and caller JWT, returning the inserted event id", async () => {
  let request;
  const id = await recordAuditEvent({
    event,
    accessToken: "user-access-token",
    env,
    fetchImpl: async (url, init) => {
      request = { url, init };
      return new Response(JSON.stringify([{ id: resource }]), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  assert.equal(id, resource);
  assert.equal(request.url, "https://polychat-test.supabase.co/rest/v1/audit_events");
  assert.equal(request.init.headers.apikey, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  assert.equal(request.init.headers.Authorization, "Bearer user-access-token");
  assert.equal(request.init.cache, "no-store");
  assert.equal(request.init.body.includes("service_role"), false);
});

test("does not expose provider response details on failure", async () => {
  await assert.rejects(
    recordAuditEvent({
      event,
      accessToken: "user-access-token",
      env,
      fetchImpl: async () => new Response(JSON.stringify({ message: "private provider detail" }), { status: 403 }),
    }),
    (error) => error.message === "Audit event could not be recorded.",
  );
});
