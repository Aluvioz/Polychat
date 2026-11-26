-- Issue #112 integration checks for an authorized Supabase SQL environment.
-- Uses synthetic Auth users and rolls all records back at the end.
begin;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
(
  '61111111-1111-4111-8111-111111111111',
  'authenticated', 'authenticated', 'issue112-ti@rls.invalid',
  now(), now(), '{}', '{}'
),
(
  '62222222-2222-4222-8222-222222222222',
  'authenticated', 'authenticated', 'issue112-user@rls.invalid',
  now(), now(), '{}', '{}'
);

update public.profiles
   set role = 'ti', is_active = true
 where id = '61111111-1111-4111-8111-111111111111';

-- The privileged API key is represented by the service_role JWT claim in this
-- SQL integration harness. The application itself sends SUPABASE_SECRET_KEY
-- only in the apikey header, never as a Bearer token.
set local role service_role;
select set_config('request.jwt.claim.role', 'service_role', true);
select set_config('request.jwt.claim.sub', '61111111-1111-4111-8111-111111111111', true);

do $create$
declare
  v_group jsonb;
  v_id uuid;
begin
  v_group := public.create_group_with_audit(
    '61111111-1111-4111-8111-111111111111',
    'Issue 112 integration group'
  );
  v_id := (v_group ->> 'id')::uuid;

  if v_group ->> 'kind' <> 'group'
     or v_group ->> 'status' <> 'active'
     or v_group ->> 'created_by_profile_id' <> '61111111-1111-4111-8111-111111111111' then
    raise exception 'Group creation returned unexpected metadata';
  end if;

  if exists (
    select 1 from public.memberships where conversation_id = v_id
  ) then
    raise exception 'Group creation must not invent initial membership';
  end if;

  insert into public.memberships (conversation_id, profile_id, added_by_profile_id)
  values (v_id, '62222222-2222-4222-8222-222222222222', '61111111-1111-4111-8111-111111111111');
  insert into public.messages (conversation_id, sender_profile_id, body)
  values (v_id, '62222222-2222-4222-8222-222222222222', 'Preserve this message');

  if not exists (
    select 1 from public.privileged_action_audit
     where event_type = 'group.created'
       and resource_type = 'group'
       and resource_id = v_id::text
       and actor_profile_id = '61111111-1111-4111-8111-111111111111'
       and outcome = 'success'
  ) then
    raise exception 'group.created audit event was not persisted';
  end if;

  v_group := public.update_group_metadata_with_audit(
    '61111111-1111-4111-8111-111111111111',
    v_id,
    'Issue 112 renamed group'
  );

  if v_group ->> 'name' <> 'Issue 112 renamed group' then
    raise exception 'Group name was not updated';
  end if;

  if (select count(*) from public.memberships where conversation_id = v_id) <> 1
     or (select count(*) from public.messages where conversation_id = v_id and body = 'Preserve this message') <> 1 then
    raise exception 'Group metadata update modified membership or message history';
  end if;

  if not exists (
    select 1 from public.privileged_action_audit
     where event_type = 'group.updated'
       and resource_type = 'group'
       and resource_id = v_id::text
       and actor_profile_id = '61111111-1111-4111-8111-111111111111'
       and outcome = 'success'
  ) then
    raise exception 'group.updated audit event was not persisted';
  end if;
end;
$create$;

-- Simulate an audit storage failure. The group insert must roll back with it.
-- Trigger DDL is performed as the migration/table owner, then execution returns
-- to the service_role context used by the RPC.
reset role;
create or replace function pg_temp.reject_group_created_audit()
returns trigger
language plpgsql
as $$
begin
  if new.event_type = 'group.created' then
    raise exception 'synthetic audit failure';
  end if;
  return new;
end;
$$;

create trigger issue112_force_audit_failure
before insert on public.privileged_action_audit
for each row execute function pg_temp.reject_group_created_audit();

set local role service_role;
select set_config('request.jwt.claim.role', 'service_role', true);
select set_config('request.jwt.claim.sub', '61111111-1111-4111-8111-111111111111', true);

do $rollback$
begin
  begin
    perform public.create_group_with_audit(
      '61111111-1111-4111-8111-111111111111',
      'Must be rolled back'
    );
    raise exception 'Expected audit failure did not occur';
  exception when others then
    if sqlerrm = 'Expected audit failure did not occur' then
      raise;
    end if;
  end;

  if exists (
    select 1 from public.conversations
     where kind = 'group' and name = 'Must be rolled back'
  ) then
    raise exception 'Group mutation survived an audit failure';
  end if;
end;
$rollback$;

reset role;
drop trigger issue112_force_audit_failure on public.privileged_action_audit;
set local role service_role;
select set_config('request.jwt.claim.role', 'service_role', true);
select set_config('request.jwt.claim.sub', '61111111-1111-4111-8111-111111111111', true);

-- A direct conversation cannot be edited through the group RPC.
insert into public.conversations (
  id, kind, created_by_profile_id, direct_user_a_id, direct_user_b_id
) values (
  '63333333-3333-4333-8333-333333333333',
  'direct',
  '61111111-1111-4111-8111-111111111111',
  '61111111-1111-4111-8111-111111111111',
  '62222222-2222-4222-8222-222222222222'
);

do $direct$
begin
  begin
    perform public.update_group_metadata_with_audit(
      '61111111-1111-4111-8111-111111111111',
      '63333333-3333-4333-8333-333333333333',
      'Must not modify direct conversation'
    );
    raise exception 'Expected direct-conversation rejection did not occur';
  exception when sqlstate 'P0001' then
    null;
  end;
end;
$direct$;

-- An ordinary member cannot directly rename a group through table privileges/RLS.
reset role;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '62222222-2222-4222-8222-222222222222', true);

update public.conversations
   set name = 'Unauthorized rename'
 where name = 'Issue 112 renamed group';

do $direct_update$
begin
  if exists (
    select 1 from public.conversations where name = 'Unauthorized rename'
  ) then
    raise exception 'Ordinary user bypassed conversations_update_ti policy';
  end if;
  if not exists (
    select 1 from public.conversations where name = 'Issue 112 renamed group'
  ) then
    raise exception 'Ordinary member lost access to their existing group';
  end if;
end;
$direct_update$;

-- An ordinary authenticated user cannot execute the privileged RPC.
reset role;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '62222222-2222-4222-8222-222222222222', true);

do $denied$
begin
  begin
    perform public.create_group_with_audit(
      '62222222-2222-4222-8222-222222222222',
      'Must be denied'
    );
    raise exception 'Expected execute privilege denial did not occur';
  exception when insufficient_privilege then
    null;
  end;
end;
$denied$;

reset role;

do $rls$
begin
  if not exists (
    select 1
      from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public'
       and c.relname = 'conversations'
       and c.relrowsecurity
  ) then
    raise exception 'RLS must remain enabled on public.conversations';
  end if;
end;
$rls$;

-- An inactive TI profile must not be able to invoke either privileged mutation.
set local role service_role;
select set_config('request.jwt.claim.role', 'service_role', true);
select set_config('request.jwt.claim.sub', '61111111-1111-4111-8111-111111111111', true);
update public.profiles set is_active = false
 where id = '61111111-1111-4111-8111-111111111111';

do $inactive_ti$
begin
  begin
    perform public.create_group_with_audit(
      '61111111-1111-4111-8111-111111111111',
      'Inactive TI must be denied'
    );
    raise exception 'Expected inactive TI denial did not occur';
  exception when insufficient_privilege then
    null;
  end;
end;
$inactive_ti$;

update public.profiles set is_active = true
 where id = '61111111-1111-4111-8111-111111111111';

-- An audit failure during metadata update must roll back the name change too.
reset role;
create or replace function pg_temp.reject_group_updated_audit()
returns trigger
language plpgsql
as $
begin
  if new.event_type = 'group.updated' then
    raise exception 'synthetic update audit failure';
  end if;
  return new;
end;
$;

create trigger issue112_force_update_audit_failure
before insert on public.privileged_action_audit
for each row execute function pg_temp.reject_group_updated_audit();

set local role service_role;
select set_config('request.jwt.claim.role', 'service_role', true);
select set_config('request.jwt.claim.sub', '61111111-1111-4111-8111-111111111111', true);

do $update_rollback$
declare
  v_group_id uuid;
begin
  select id into v_group_id
    from public.conversations
   where kind = 'group' and name = 'Issue 112 renamed group';

  begin
    perform public.update_group_metadata_with_audit(
      '61111111-1111-4111-8111-111111111111',
      v_group_id,
      'Must be rolled back'
    );
    raise exception 'Expected update audit failure did not occur';
  exception when others then
    if sqlerrm = 'Expected update audit failure did not occur' then
      raise;
    end if;
  end;

  if not exists (
    select 1 from public.conversations
     where id = v_group_id and name = 'Issue 112 renamed group'
  ) then
    raise exception 'Group metadata update survived an audit failure';
  end if;
end;
$update_rollback$;

reset role;
drop trigger issue112_force_update_audit_failure on public.privileged_action_audit;

rollback;
