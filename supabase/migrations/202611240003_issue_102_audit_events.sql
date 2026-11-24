-- Issue #102: append-only audit trail.
-- Depends on Issue #99 schema (profiles) and its existing is_active_ti() helper.
-- No automatic audit-log deletion or retention job is created here.

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid not null
    references public.profiles(id) on delete restrict,
  event_type text not null check (event_type in (
    'admin_login',
    'account_created',
    'account_updated',
    'account_deactivated',
    'account_reactivated',
    'group_created',
    'group_closed',
    'group_activated',
    'group_deactivated',
    'participant_added',
    'participant_removed',
    'conversation_viewed',
    'alert_reviewed',
    'alert_closed',
    'attachment_downloaded',
    'attachment_released',
    'conversation_exported',
    'message_admin_edited',
    'message_admin_deleted',
    'configuration_changed',
    'retention_discarded'
  )),
  resource_type text not null check (resource_type in (
    'session',
    'account',
    'group',
    'membership',
    'conversation',
    'alert',
    'attachment',
    'message',
    'configuration',
    'retention'
  )),
  resource_id uuid,
  occurred_at timestamptz not null default clock_timestamp(),
  outcome text not null check (length(btrim(outcome)) > 0),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  constraint audit_events_resource_matches_event check (
    (event_type = 'admin_login' and resource_type = 'session')
    or (event_type in (
      'account_created', 'account_updated', 'account_deactivated',
      'account_reactivated'
    ) and resource_type = 'account')
    or (event_type in (
      'group_created', 'group_closed', 'group_activated',
      'group_deactivated'
    ) and resource_type = 'group')
    or (event_type in (
      'participant_added', 'participant_removed'
    ) and resource_type = 'membership')
    or (event_type in (
      'conversation_viewed', 'conversation_exported'
    ) and resource_type = 'conversation')
    or (event_type in ('alert_reviewed', 'alert_closed') and resource_type = 'alert')
    or (event_type in (
      'attachment_downloaded', 'attachment_released'
    ) and resource_type = 'attachment')
    or (event_type in (
      'message_admin_edited', 'message_admin_deleted'
    ) and resource_type = 'message')
    or (event_type = 'configuration_changed' and resource_type = 'configuration')
    or (event_type = 'retention_discarded' and resource_type = 'retention')
  )
);

create index if not exists audit_events_occurred_at_idx
  on public.audit_events (occurred_at desc);

create index if not exists audit_events_actor_occurred_at_idx
  on public.audit_events (actor_profile_id, occurred_at desc);

create index if not exists audit_events_type_occurred_at_idx
  on public.audit_events (event_type, occurred_at desc);

create index if not exists audit_events_resource_occurred_at_idx
  on public.audit_events (resource_type, resource_id, occurred_at desc);

-- Reject sensitive metadata keys recursively. Values must remain minimal and
-- must never contain message bodies, conversation contents, credentials or secrets.
create or replace function public.audit_metadata_has_sensitive_keys(p_value jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  item record;
begin
  if jsonb_typeof(p_value) = 'object' then
    for item in
      select key, value from jsonb_each(p_value)
    loop
      if lower(item.key) ~ '(^|_)(password|passwd|token|secret|credential|authorization|cookie|api_key|private_key|service_role|access_key|refresh_token|message_body|conversation_body|content_body)(_|$)' then
        return true;
      end if;

      if public.audit_metadata_has_sensitive_keys(item.value) then
        return true;
      end if;
    end loop;
  elsif jsonb_typeof(p_value) = 'array' then
    for item in
      select value from jsonb_array_elements(p_value)
    loop
      if public.audit_metadata_has_sensitive_keys(item.value) then
        return true;
      end if;
    end loop;
  end if;

  return false;
end;
$$;

revoke all on function public.audit_metadata_has_sensitive_keys(jsonb) from public, anon;
grant execute on function public.audit_metadata_has_sensitive_keys(jsonb) to authenticated;

-- Bind the actor and timestamp to the authenticated database context. This
-- prevents a caller from supplying another operator or backdating an event.
create or replace function public.guard_audit_event_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.actor_profile_id is distinct from (select auth.uid())
     or not (select public.is_active_ti()) then
    raise exception 'Only the active TI operator may write audit events'
      using errcode = '42501';
  end if;

  if public.audit_metadata_has_sensitive_keys(new.metadata) then
    raise exception 'Audit metadata contains a prohibited sensitive key'
      using errcode = '22023';
  end if;

  new.occurred_at := clock_timestamp();
  return new;
end;
$$;

drop trigger if exists audit_events_guard_insert on public.audit_events;
create trigger audit_events_guard_insert
before insert on public.audit_events
for each row execute function public.guard_audit_event_insert();

-- Application/API roles cannot update, delete or truncate audit history.
-- This trigger is defense in depth; database owners/superusers can still alter
-- schema objects and are outside the protection boundary of an application trigger.
create or replace function public.reject_audit_event_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Audit events are append-only'
    using errcode = '42501';
end;
$$;

drop trigger if exists audit_events_reject_update_delete on public.audit_events;
create trigger audit_events_reject_update_delete
before update or delete on public.audit_events
for each row execute function public.reject_audit_event_mutation();

drop trigger if exists audit_events_reject_truncate on public.audit_events;
create trigger audit_events_reject_truncate
before truncate on public.audit_events
for each statement execute function public.reject_audit_event_mutation();

alter table public.audit_events enable row level security;

revoke all on table public.audit_events from public, anon, authenticated;
grant select, insert on table public.audit_events to authenticated;

drop policy if exists audit_events_select_active_ti on public.audit_events;
create policy audit_events_select_active_ti
on public.audit_events
for select
to authenticated
using ((select public.is_active_ti()));

drop policy if exists audit_events_insert_active_ti on public.audit_events;
create policy audit_events_insert_active_ti
on public.audit_events
for insert
to authenticated
with check (
  actor_profile_id = (select auth.uid())
  and (select public.is_active_ti())
);

comment on table public.audit_events is
  'Append-only audit events. Only active TI can read/insert through authenticated API context; updates/deletes/truncates are denied to application roles.';
