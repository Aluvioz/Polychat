-- Integration assertions for Issue #102 audit_events.
-- Run against a disposable/development Supabase PostgreSQL database after the migration.
-- This script is read-only except for a deliberately rejected INSERT inside a rolled-back transaction.
begin;

do $$
declare
  v_table regclass;
  v_policy_count integer;
  v_trigger_count integer;
  v_event text;
  v_events text[] := array[
    'admin_login','account_created','account_updated','account_deactivated','account_reactivated',
    'group_created','group_closed','group_activated','group_deactivated','participant_added',
    'participant_removed','conversation_viewed','alert_reviewed','alert_closed','attachment_downloaded',
    'attachment_released','conversation_exported','message_admin_edited','message_admin_deleted',
    'configuration_changed','retention_discarded'
  ];
  v_constraint text;
begin
  v_table := to_regclass('public.audit_events');
  if v_table is null then raise exception 'public.audit_events is missing'; end if;

  if not (select relrowsecurity from pg_class where oid = v_table) then
    raise exception 'RLS must be enabled on public.audit_events';
  end if;

  select count(*) into v_policy_count
  from pg_policies where schemaname = 'public' and tablename = 'audit_events';
  if v_policy_count <> 2 then
    raise exception 'Expected exactly two audit_events policies; found %', v_policy_count;
  end if;

  select count(*) into v_trigger_count
  from pg_trigger where tgrelid = v_table and not tgisinternal;
  if v_trigger_count <> 3 then
    raise exception 'Expected three audit_events triggers; found %', v_trigger_count;
  end if;

  if has_table_privilege('anon', v_table, 'SELECT')
     or has_table_privilege('anon', v_table, 'INSERT') then
    raise exception 'anon must not read or insert audit events';
  end if;

  if not has_table_privilege('authenticated', v_table, 'SELECT')
     or not has_table_privilege('authenticated', v_table, 'INSERT') then
    raise exception 'authenticated must have SELECT and INSERT grants';
  end if;

  if has_table_privilege('authenticated', v_table, 'UPDATE')
     or has_table_privilege('authenticated', v_table, 'DELETE')
     or has_table_privilege('authenticated', v_table, 'TRUNCATE') then
    raise exception 'authenticated must not mutate or truncate audit events';
  end if;

  select pg_get_constraintdef(oid) into v_constraint
  from pg_constraint
  where conrelid = v_table and conname = 'audit_events_event_type_check';

  if v_constraint is null then raise exception 'Closed event catalog constraint is missing'; end if;
  foreach v_event in array v_events loop
    if position(v_event in v_constraint) = 0 then
      raise exception 'Event % is missing from the database catalog', v_event;
    end if;
  end loop;

  if not public.audit_metadata_has_sensitive_keys('{"nested":{"access_token":"x"}}'::jsonb) then
    raise exception 'Nested sensitive metadata key was not rejected';
  end if;

  if public.audit_metadata_has_sensitive_keys('{"request_id":"r1","operation":"read"}'::jsonb) then
    raise exception 'Safe metadata was incorrectly rejected';
  end if;
end
$$;

-- Verify that an authenticated request without a validated active-TI identity
-- cannot write an audit event. The attempted row is expected to be rejected.
set local role authenticated;
do $$
begin
  begin
    insert into public.audit_events(actor_profile_id, event_type, resource_type, outcome, metadata)
    values ('00000000-0000-0000-0000-000000000001', 'admin_login', 'session', 'success', '{}'::jsonb);
    raise exception 'An authenticated request without active-TI identity unexpectedly inserted an event';
  exception when insufficient_privilege then
    null; -- Expected: RLS/trigger denied the write.
  end;
end
$$;

rollback;
