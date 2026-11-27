-- Issue #112: create/update group metadata and its privileged audit event
-- in one PostgreSQL transaction. Description is intentionally not added:
-- RF-005 and public.conversations currently define only group name metadata.

create or replace function public.create_group_with_audit(
  p_actor_profile_id uuid,
  p_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group public.conversations;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Privileged server execution required' using errcode = '42501';
  end if;

  if p_name is null or pg_catalog.length(pg_catalog.btrim(p_name)) = 0 then
    raise exception 'Group name is required' using errcode = '22023';
  end if;

  if not exists (
    select 1
      from public.profiles p
     where p.id = p_actor_profile_id
       and p.role = 'ti'
       and p.is_active = true
  ) then
    raise exception 'An active TI actor is required' using errcode = '42501';
  end if;

  insert into public.conversations (
    kind,
    name,
    created_by_profile_id
  ) values (
    'group',
    pg_catalog.btrim(p_name),
    p_actor_profile_id
  )
  returning * into v_group;

  -- This SQL writer is invoked inside the current transaction. If the audit
  -- insert fails, PostgreSQL rolls back the conversation insert as well.
  perform public.write_privileged_audit_event(
    p_actor_profile_id,
    'group.created',
    'group',
    v_group.id::text,
    'success',
    pg_catalog.jsonb_build_object('operation', 'create')
  );

  return pg_catalog.to_jsonb(v_group);
end;
$$;

create or replace function public.update_group_metadata_with_audit(
  p_actor_profile_id uuid,
  p_group_id uuid,
  p_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group public.conversations;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Privileged server execution required' using errcode = '42501';
  end if;

  if p_name is null or pg_catalog.length(pg_catalog.btrim(p_name)) = 0 then
    raise exception 'Group name is required' using errcode = '22023';
  end if;

  if not exists (
    select 1
      from public.profiles p
     where p.id = p_actor_profile_id
       and p.role = 'ti'
       and p.is_active = true
  ) then
    raise exception 'An active TI actor is required' using errcode = '42501';
  end if;

  select *
    into v_group
    from public.conversations c
   where c.id = p_group_id
   for update;

  if not found then
    raise exception 'Group not found' using errcode = 'P0002';
  end if;

  if v_group.kind <> 'group' then
    raise exception 'The resource is not a group' using errcode = 'P0001';
  end if;

  update public.conversations
     set name = pg_catalog.btrim(p_name),
         updated_at = pg_catalog.clock_timestamp()
   where id = p_group_id
  returning * into v_group;

  -- Keep the metadata mutation and its audit event indivisible.
  perform public.write_privileged_audit_event(
    p_actor_profile_id,
    'group.updated',
    'group',
    v_group.id::text,
    'success',
    pg_catalog.jsonb_build_object('operation', 'update', 'fields', pg_catalog.jsonb_build_array('name'))
  );

  return pg_catalog.to_jsonb(v_group);
end;
$$;

revoke all on function public.create_group_with_audit(uuid, text)
  from public, anon, authenticated, service_role;
revoke all on function public.update_group_metadata_with_audit(uuid, uuid, text)
  from public, anon, authenticated, service_role;

grant execute on function public.create_group_with_audit(uuid, text) to service_role;
grant execute on function public.update_group_metadata_with_audit(uuid, uuid, text) to service_role;
