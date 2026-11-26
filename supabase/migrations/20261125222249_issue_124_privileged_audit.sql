-- Issue #124: independent, append-only audit trail for privileged actions.
-- This implementation does not reuse any pre-existing audit table.

create table if not exists public.privileged_action_audit (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete restrict,
  event_type text not null check (event_type in (
    'admin.login.succeeded',
    'admin.login.failed',
    'account.created',
    'account.updated',
    'account.deactivated',
    'group.created',
    'group.updated',
    'group.member_added',
    'group.member_removed',
    'sensitive.consultation',
    'sensitive.change'
  )),
  resource_type text not null check (length(btrim(resource_type)) between 1 and 64),
  resource_id text check (resource_id is null or length(resource_id) <= 128),
  occurred_at timestamptz not null default pg_catalog.clock_timestamp(),
  outcome text not null check (outcome in ('success', 'failure', 'denied')),
  metadata jsonb not null default '{}'::jsonb check (pg_catalog.jsonb_typeof(metadata) = 'object')
);

create index if not exists privileged_action_audit_occurred_at_idx
  on public.privileged_action_audit (occurred_at desc);
create index if not exists privileged_action_audit_event_time_idx
  on public.privileged_action_audit (event_type, occurred_at desc);
create index if not exists privileged_action_audit_actor_time_idx
  on public.privileged_action_audit (actor_profile_id, occurred_at desc);
create index if not exists privileged_action_audit_resource_time_idx
  on public.privileged_action_audit (resource_type, resource_id, occurred_at desc);

alter table public.privileged_action_audit enable row level security;
revoke all on table public.privileged_action_audit from public, anon, authenticated;
grant select, insert on table public.privileged_action_audit to service_role;

create or replace function public.strip_privileged_audit_secrets(p_value jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_result jsonb;
  v_key text;
  v_value jsonb;
begin
  if pg_catalog.jsonb_typeof(p_value) = 'object' then
    v_result := '{}'::jsonb;
    for v_key, v_value in select key, value from pg_catalog.jsonb_each(p_value)
    loop
      if v_key !~* '(password|passwd|token|secret|authorization|credential|api[_-]?key|private[_-]?key|cookie|session)' then
        v_result := v_result || pg_catalog.jsonb_build_object(
          v_key, public.strip_privileged_audit_secrets(v_value)
        );
      end if;
    end loop;
    return v_result;
  elsif pg_catalog.jsonb_typeof(p_value) = 'array' then
    select coalesce(
      pg_catalog.jsonb_agg(public.strip_privileged_audit_secrets(value)),
      '[]'::jsonb
    ) into v_result
    from pg_catalog.jsonb_array_elements(p_value);
    return v_result;
  end if;
  return p_value;
end;
$$;

revoke all on function public.strip_privileged_audit_secrets(jsonb) from public, anon, authenticated;
grant execute on function public.strip_privileged_audit_secrets(jsonb) to service_role;

create or replace function public.write_privileged_audit_event(
  p_actor_profile_id uuid,
  p_event_type text,
  p_resource_type text,
  p_resource_id text default null,
  p_outcome text default 'success',
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_event_type not in (
    'admin.login.succeeded', 'admin.login.failed',
    'account.created', 'account.updated', 'account.deactivated',
    'group.created', 'group.updated', 'group.member_added', 'group.member_removed',
    'sensitive.consultation', 'sensitive.change'
  ) then
    raise exception 'Unsupported privileged audit event' using errcode = '22023';
  end if;
  if p_outcome not in ('success', 'failure', 'denied') then
    raise exception 'Unsupported privileged audit outcome' using errcode = '22023';
  end if;
  if p_resource_type is null or length(btrim(p_resource_type)) not between 1 and 64
     or (p_resource_id is not null and length(p_resource_id) > 128) then
    raise exception 'Invalid privileged audit resource' using errcode = '22023';
  end if;
  if pg_catalog.jsonb_typeof(p_metadata) <> 'object' then
    raise exception 'Audit metadata must be a JSON object' using errcode = '22023';
  end if;
  if p_event_type = 'admin.login.failed' and p_actor_profile_id is null then
    null;
  elsif p_actor_profile_id is null or not exists (
    select 1 from public.profiles p
    where p.id = p_actor_profile_id and p.role = 'ti' and p.is_active = true
  ) then
    raise exception 'An active TI actor is required for this audit event' using errcode = '42501';
  end if;

  insert into public.privileged_action_audit (
    actor_profile_id, event_type, resource_type, resource_id, outcome, metadata
  ) values (
    p_actor_profile_id, p_event_type, p_resource_type, p_resource_id,
    p_outcome, public.strip_privileged_audit_secrets(p_metadata)
  ) returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.write_privileged_audit_event(uuid, text, text, text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.write_privileged_audit_event(uuid, text, text, text, text, jsonb)
  to service_role;

create or replace function public.reject_privileged_audit_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Privileged audit records are append-only' using errcode = '55000';
end;
$$;

revoke all on function public.reject_privileged_audit_mutation() from public, anon, authenticated, service_role;
drop trigger if exists privileged_action_audit_append_only on public.privileged_action_audit;
create trigger privileged_action_audit_append_only
before update or delete on public.privileged_action_audit
for each row execute function public.reject_privileged_audit_mutation();

revoke update, delete, truncate on table public.privileged_action_audit from service_role;
