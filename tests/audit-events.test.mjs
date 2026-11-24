import assert from "node:assert/strict";
import test from "node:test";

import {
  AUDIT_EVENT_TYPES,
  AuditWriteError,
  recordAuditEvent,
} from "../src/audit/audit-events.mjs";

const activeTi = {
  id: "a4c2d9f1-8a2b-4f3c-9d1e-123456789abc",
  role: "ti",
  isActive: true,
};

function createClient({ error = null } = {}) {
  const calls = [];
  return {
    calls,
    from(table) {
      assert.equal(table, "audit_events");
      return {
        async insert(row) {
          calls.push(row);
          return { error };
        },
      };
    },
  };
}

test("exposes the complete audit catalog defined by Issue #102 plus the required retention discard event", () => {
  assert.deepEqual(AUDIT_EVENT_TYPES, [
    "admin_login",
    "account_created",
    "account_updated",
    "account_deactivated",
    "account_reactivated",
    "group_created",
    "group_closed",
    "group_activated",
    "group_deactivated",
    "participant_added",
    "participant_removed",
    "conversation_viewed",
    "alert_reviewed",
    "alert_closed",
    "attachment_downloaded",
    "attachment_released",
    "conversation_exported",
    "message_admin_edited",
    "message_admin_deleted",
    "configuration_changed",
    "retention_discarded",
  ]);
});

test("records an event using the validated TI actor and database-generated timestamp", async () => {
  const supabase = createClient();

  await recordAuditEvent({
    supabase,
    actor: activeTi,
    eventType: "conversation_viewed",
    resourceId: "0d5c9e11-8f8a-42c8-8e2a-10b84ac4a91e",
    outcome: "success",
    metadata: { request_id: "req-123" },
  });

  assert.equal(supabase.calls.length, 1);
  assert.deepEqual(supabase.calls[0], {
    actor_profile_id: activeTi.id,
    event_type: "conversation_viewed",
    resource_type: "conversation",
    resource_id: "0d5c9e11-8f8a-42c8-8e2a-10b84ac4a91e",
    outcome: "success",
    metadata: { request_id: "req-123" },
  });
  assert.equal("occurred_at" in supabase.calls[0], false);
});

test("does not require a justification for conversation view, export or alert close", async () => {
  for (const [eventType, resourceId] of [
    ["conversation_viewed", "0d5c9e11-8f8a-42c8-8e2a-10b84ac4a91e"],
    ["conversation_exported", "0d5c9e11-8f8a-42c8-8e2a-10b84ac4a91e"],
    ["alert_closed", "8d5c9e11-8f8a-42c8-8e2a-10b84ac4a91e"],
  ]) {
    const supabase = createClient();
    await recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType,
      resourceId,
      outcome: "success",
    });
    assert.equal(supabase.calls.length, 1);
  }
});

test("rejects missing, inactive or non-TI actors before writing", async () => {
  const invalidActors = [
    null,
    { ...activeTi, role: "user" },
    { ...activeTi, isActive: false },
    { role: "ti", isActive: true },
  ];

  for (const actor of invalidActors) {
    const supabase = createClient();
    await assert.rejects(
      recordAuditEvent({
        supabase,
        actor,
        eventType: "conversation_viewed",
        resourceId: "0d5c9e11-8f8a-42c8-8e2a-10b84ac4a91e",
        outcome: "success",
      }),
      TypeError,
    );
    assert.equal(supabase.calls.length, 0);
  }
});

test("rejects unsupported event types, missing resources and empty outcomes", async () => {
  const supabase = createClient();

  await assert.rejects(
    recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType: "arbitrary_event",
      outcome: "success",
    }),
    /Unsupported audit event type/,
  );

  await assert.rejects(
    recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType: "conversation_viewed",
      outcome: "success",
    }),
    /resource identifier is required/,
  );

  await assert.rejects(
    recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType: "admin_login",
      outcome: " ",
    }),
    /outcome is required/,
  );

  assert.equal(supabase.calls.length, 0);
});

test("rejects sensitive metadata keys, including nested keys", async () => {
  const supabase = createClient();

  await assert.rejects(
    recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType: "admin_login",
      outcome: "success",
      metadata: {
        request_id: "req-1",
        nested: { access_token: "must-not-be-recorded" },
      },
    }),
    /proibida/,
  );

  assert.equal(supabase.calls.length, 0);
});

test("fails closed when the database rejects the audit insert", async () => {
  const supabase = createClient({ error: new Error("database unavailable") });

  await assert.rejects(
    recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType: "admin_login",
      outcome: "success",
    }),
    AuditWriteError,
  );
});

test("fails closed when the Supabase client throws", async () => {
  const supabase = {
    from() {
      return {
        insert() {
          throw new Error("network failure");
        },
      };
    },
  };

  await assert.rejects(
    recordAuditEvent({
      supabase,
      actor: activeTi,
      eventType: "admin_login",
      outcome: "success",
    }),
    AuditWriteError,
  );
});
