-- Keep audit disposal as an authenticated TI RPC, not SECURITY DEFINER.
-- The RLS DELETE policy requires transaction-local authorization flags set only
-- by this function; ordinary direct DELETE remains denied.
grant delete on table public.audit_events to authenticated;
drop policy if exists audit_events_delete_retention_ti on public.audit_events;
create policy audit_events_delete_retention_ti on public.audit_events
for delete to authenticated
using (
  (select public.is_active_ti())
  and current_setting('app.audit_retention_discard',true)='true'
  and current_setting('app.audit_retention_actor',true)=(select auth.uid())::text
);

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
  lock table public.retention_holds in share row exclusive mode;
  select event_type,resource_type,resource_id
    into v_event_type,v_resource_type,v_resource_id
  from public.audit_events where id=p_audit_event_id;
  if not found then raise exception 'Audit event not found' using errcode='22023'; end if;
  if v_event_type in ('retention_discarded','retention_hold_placed','retention_hold_released') then
    raise exception 'Retention control events cannot be discarded' using errcode='42501';
  end if;
  if exists (
    select 1 from public.retention_holds h
    where h.released_at is null
      and (
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
