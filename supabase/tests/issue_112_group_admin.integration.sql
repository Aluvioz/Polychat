-- Issue #112 integration checks for an authorized Supabase SQL environment.
-- Fixture setup and assertions run as the migration owner. Only privileged RPC
-- calls run as service_role, which intentionally has no direct table grants.
-- Synthetic data and temporary triggers are rolled back at the end.

begin;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
('61111111-1111-4111-8111-111111111111','authenticated','authenticated','issue112-ti@rls.invalid',now(),now(),'{}','{}'),
('62222222-2222-4222-8222-222222222222','authenticated','authenticated','issue112-user@rls.invalid',now(),now(),'{}','{}');

update public.profiles set role='ti', is_active=true
 where id='61111111-1111-4111-8111-111111111111';

-- Create group through the server-only RPC. Do not access domain tables as service_role.
set local role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select set_config('request.jwt.claim.sub','61111111-1111-4111-8111-111111111111',true);

do $create_group$
declare v_group jsonb;
begin
  v_group := public.create_group_with_audit('61111111-1111-4111-8111-111111111111','Issue 112 integration group');
  if v_group->>'kind'<>'group'
     or v_group->>'status'<>'active'
     or v_group->>'created_by_profile_id'<>'61111111-1111-4111-8111-111111111111' then
    raise exception 'Group creation returned unexpected metadata';
  end if;
end;
$create_group$;

reset role;

do $create_assertions$
declare v_group_id uuid;
begin
  select id into v_group_id from public.conversations
   where kind='group' and name='Issue 112 integration group';
  if v_group_id is null then raise exception 'Group creation did not persist'; end if;
  if exists(select 1 from public.memberships where conversation_id=v_group_id) then
    raise exception 'Group creation must not invent initial membership';
  end if;
  if not exists(select 1 from public.privileged_action_audit
    where event_type='group.created' and resource_type='group' and resource_id=v_group_id::text
      and actor_profile_id='61111111-1111-4111-8111-111111111111' and outcome='success') then
    raise exception 'group.created audit event was not persisted';
  end if;
  insert into public.memberships(conversation_id,profile_id,added_by_profile_id)
  values(v_group_id,'62222222-2222-4222-8222-222222222222','61111111-1111-4111-8111-111111111111');
  insert into public.messages(conversation_id,sender_profile_id,body)
  values(v_group_id,'62222222-2222-4222-8222-222222222222','Preserve this message');
  perform set_config('test.issue112.group_id',v_group_id::text,true);
end;
$create_assertions$;

set local role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select set_config('request.jwt.claim.sub','61111111-1111-4111-8111-111111111111',true);

do $update_group$
declare v_group jsonb; v_group_id uuid;
begin
  v_group_id:=current_setting('test.issue112.group_id')::uuid;
  v_group:=public.update_group_metadata_with_audit(
    '61111111-1111-4111-8111-111111111111',v_group_id,'Issue 112 renamed group');
  if v_group->>'name'<>'Issue 112 renamed group' then raise exception 'Group name was not updated'; end if;
end;
$update_group$;

reset role;

do $update_assertions$
declare v_group_id uuid;
begin
  v_group_id:=current_setting('test.issue112.group_id')::uuid;
  if (select count(*) from public.memberships where conversation_id=v_group_id)<>1
     or (select count(*) from public.messages where conversation_id=v_group_id and body='Preserve this message')<>1 then
    raise exception 'Group metadata update modified membership or message history';
  end if;
  if not exists(select 1 from public.privileged_action_audit
    where event_type='group.updated' and resource_type='group' and resource_id=v_group_id::text
      and actor_profile_id='61111111-1111-4111-8111-111111111111' and outcome='success') then
    raise exception 'group.updated audit event was not persisted';
  end if;
end;
$update_assertions$;

-- A failed audit insert must roll back group creation.
create or replace function pg_temp.reject_group_created_audit()
returns trigger language plpgsql as $$
begin
  if new.event_type='group.created' then raise exception 'synthetic audit failure'; end if;
  return new;
end;
$$;
create trigger issue112_force_audit_failure before insert on public.privileged_action_audit
for each row execute function pg_temp.reject_group_created_audit();

set local role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select set_config('request.jwt.claim.sub','61111111-1111-4111-8111-111111111111',true);
do $create_rollback$
begin
  begin
    perform public.create_group_with_audit('61111111-1111-4111-8111-111111111111','Must be rolled back');
    raise exception 'Expected audit failure did not occur';
  exception when others then
    if sqlerrm='Expected audit failure did not occur' then raise; end if;
  end;
end;
$create_rollback$;
reset role;

do $create_rollback_assertion$
begin
  if exists(select 1 from public.conversations where kind='group' and name='Must be rolled back') then
    raise exception 'Group mutation survived an audit failure';
  end if;
end;
$create_rollback_assertion$;
drop trigger issue112_force_audit_failure on public.privileged_action_audit;

-- The group RPC must reject a direct conversation.
insert into public.conversations(id,kind,created_by_profile_id,direct_user_a_id,direct_user_b_id)
values('63333333-3333-4333-8333-333333333333','direct',
 '61111111-1111-4111-8111-111111111111',
 '61111111-1111-4111-8111-111111111111','62222222-2222-4222-8222-222222222222');

set local role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select set_config('request.jwt.claim.sub','61111111-1111-4111-8111-111111111111',true);
do $direct_conversation$
begin
  begin
    perform public.update_group_metadata_with_audit(
      '61111111-1111-4111-8111-111111111111',
      '63333333-3333-4333-8333-333333333333','Must not modify direct conversation');
    raise exception 'Expected direct-conversation rejection did not occur';
  exception when sqlstate 'P0001' then null;
  end;
end;
$direct_conversation$;
reset role;

-- An ordinary member cannot rename a group directly through table grants/RLS.
set local role authenticated;
select set_config('request.jwt.claim.role','authenticated',true);
select set_config('request.jwt.claim.sub','62222222-2222-4222-8222-222222222222',true);
update public.conversations set name='Unauthorized rename' where name='Issue 112 renamed group';
do $direct_update$
begin
  if exists(select 1 from public.conversations where name='Unauthorized rename') then
    raise exception 'Ordinary user bypassed conversations_update_ti policy';
  end if;
  if not exists(select 1 from public.conversations where name='Issue 112 renamed group') then
    raise exception 'Ordinary member lost access to their existing group';
  end if;
end;
$direct_update$;
reset role;

-- An authenticated user cannot execute the privileged RPC.
set local role authenticated;
select set_config('request.jwt.claim.role','authenticated',true);
select set_config('request.jwt.claim.sub','62222222-2222-4222-8222-222222222222',true);
do $denied$
begin
  begin
    perform public.create_group_with_audit('62222222-2222-4222-8222-222222222222','Must be denied');
    raise exception 'Expected execute privilege denial did not occur';
  exception when insufficient_privilege then null;
  end;
end;
$denied$;
reset role;

do $rls$
begin
  if not exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='conversations' and c.relrowsecurity) then
    raise exception 'RLS must remain enabled on public.conversations';
  end if;
end;
$rls$;

-- An inactive TI profile must be rejected by the privileged RPC.
-- The database-owner fixture update must not inherit the previous authenticated JWT claim.
-- The test sets a trusted claim only for the trigger guard; it does not grant table privileges.
select set_config('request.jwt.claim.role','service_role',true);
update public.profiles set is_active=false where id='61111111-1111-4111-8111-111111111111';
set local role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select set_config('request.jwt.claim.sub','61111111-1111-4111-8111-111111111111',true);
do $inactive_ti$
begin
  begin
    perform public.create_group_with_audit('61111111-1111-4111-8111-111111111111','Inactive TI must be denied');
    raise exception 'Expected inactive TI denial did not occur';
  exception when insufficient_privilege then null;
  end;
end;
$inactive_ti$;
reset role;
update public.profiles set is_active=true where id='61111111-1111-4111-8111-111111111111';

-- A failed audit insert must also roll back a group-name update.
create or replace function pg_temp.reject_group_updated_audit()
returns trigger language plpgsql as $$
begin
  if new.event_type='group.updated' then raise exception 'synthetic update audit failure'; end if;
  return new;
end;
$$;
create trigger issue112_force_update_audit_failure before insert on public.privileged_action_audit
for each row execute function pg_temp.reject_group_updated_audit();

set local role service_role;
select set_config('request.jwt.claim.role','service_role',true);
select set_config('request.jwt.claim.sub','61111111-1111-4111-8111-111111111111',true);
do $update_rollback$
declare v_group_id uuid;
begin
  v_group_id:=current_setting('test.issue112.group_id')::uuid;
  begin
    perform public.update_group_metadata_with_audit(
      '61111111-1111-4111-8111-111111111111',v_group_id,'Must be rolled back');
    raise exception 'Expected update audit failure did not occur';
  exception when others then
    if sqlerrm='Expected update audit failure did not occur' then raise; end if;
  end;
end;
$update_rollback$;
reset role;

do $update_rollback_assertion$
declare v_group_id uuid;
begin
  v_group_id:=current_setting('test.issue112.group_id')::uuid;
  if not exists(select 1 from public.conversations where id=v_group_id and name='Issue 112 renamed group') then
    raise exception 'Group metadata update survived an audit failure';
  end if;
end;
$update_rollback_assertion$;
drop trigger issue112_force_update_audit_failure on public.privileged_action_audit;

rollback;
