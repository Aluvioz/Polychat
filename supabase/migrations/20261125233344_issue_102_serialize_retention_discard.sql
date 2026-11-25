-- Serialize hold creation/release and audit-event disposal by resource.
-- This avoids granting authenticated users table-lock privileges or using
-- SECURITY DEFINER for the disposal RPC.
create or replace function private.serialize_retention_hold_change()
returns trigger language plpgsql set search_path=''
as $$
begin
  if tg_op='UPDATE' then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(old.resource_type || ':' || old.resource_id::text,0)
    );
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.resource_type || ':' || new.resource_id::text,0)
  );
  return new;
end;
$$;
drop trigger if exists retention_holds_serialize_resource on public.retention_holds;
create trigger retention_holds_serialize_resource
before insert or update of resource_type,resource_id,released_at
on public.retention_holds
for each row execute function private.serialize_retention_hold_change();

create or replace function public.discard_audit_event(p_audit_event_id uuid)
returns uuid language plpgsql set search_path=''
as $$
declare
  v_event_type text;
  v_resource_type text;
  v_resource_id uuid;
begin
  if (select auth.uid()) is null or not (select public.is_active_ti()) then
    raise exception 'Only active TI can authorize audit event disposal' using errcode='42501';
  end if;
  select event_type,resource_type,resource_id into v_event_type,v_resource_type,v_resource_id
  from public.audit_events where id=p_audit_event_id;
  if not found then raise exception 'Audit event not found' using errcode='22023'; end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_resource_type || ':' || v_resource_id::text,0)
  );
  if v_event_type in ('retention_discarded','retention_hold_placed','retention_hold_released') then
    raise exception 'Retention control events cannot be discarded' using errcode='42501';
  end if;
  if exists (
    select 1 from public.retention_holds h
    where h.released_at is null and (
      (h.resource_type='audit_event' and h.resource_id=p_audit_event_id)
      or (h.resource_type=v_resource_type and h.resource_id=v_resource_id)
    )
  ) then
    raise exception 'Audit event or its underlying resource is protected by an active retention hold' using errcode='42501';
  end if;
  insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
  values ((select auth.uid()),'retention_discarded','retention',p_audit_event_id,'success',
    jsonb_build_object('target_type','audit_event','target_resource_type',v_resource_type));
  perform pg_catalog.set_config('app.audit_retention_discard','true',true);
  perform pg_catalog.set_config('app.audit_retention_actor',(select auth.uid())::text,true);
  delete from public.audit_events where id=p_audit_event_id;
  return p_audit_event_id;
end;
$$;
revoke all on function public.discard_audit_event(uuid) from public,anon;
grant execute on function public.discard_audit_event(uuid) to authenticated;
