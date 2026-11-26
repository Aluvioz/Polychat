-- Issue #102: authorized audit-event disposal and investigation-hold behavior.
-- Runs entirely inside a transaction and rolls back all synthetic rows.
begin;
insert into auth.users (id,aud,role,email,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
values ('66666666-6666-4666-8666-666666666666','authenticated','authenticated','discard-ti@invalid.test',now(),now(),'{}','{}');
update public.profiles set role='ti' where id='66666666-6666-4666-8666-666666666666';
set local role authenticated;
select set_config('request.jwt.claim.sub','66666666-6666-4666-8666-666666666666',true);
insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
values (auth.uid(),'conversation_viewed','conversation','88888888-8888-4888-8888-888888888888','success','{"source":"discard-test"}');
create temp table discard_test_ids as
select id from public.audit_events where metadata->>'source'='discard-test';
insert into public.retention_holds(resource_type,resource_id,placed_by_profile_id)
values ('conversation','88888888-8888-4888-8888-888888888888',auth.uid());
do $$
declare v_id uuid;
begin
 select id into v_id from discard_test_ids;
 begin
  perform public.discard_audit_event(v_id);
  raise exception 'discard unexpectedly succeeded while hold active';
 exception when insufficient_privilege then null;
 end;
 if not exists(select 1 from public.audit_events where id=v_id) then
  raise exception 'event linked to held resource was deleted';
 end if;
 update public.retention_holds set released_by_profile_id=auth.uid(),released_at=now()
 where resource_type='conversation' and resource_id='88888888-8888-4888-8888-888888888888' and released_at is null;
 insert into public.retention_holds(resource_type,resource_id,placed_by_profile_id)
 values ('audit_event',v_id,auth.uid());
 begin
  perform public.discard_audit_event(v_id);
  raise exception 'discard unexpectedly succeeded while event hold active';
 exception when insufficient_privilege then null;
 end;
 if not exists(select 1 from public.audit_events where id=v_id) then
  raise exception 'event-specific held audit event was deleted';
 end if;
 update public.retention_holds set released_by_profile_id=auth.uid(),released_at=now()
 where resource_type='audit_event' and resource_id=v_id and released_at is null;
 perform public.discard_audit_event(v_id);
 if exists(select 1 from public.audit_events where id=v_id) then
  raise exception 'authorized audit event was not deleted';
 end if;
 if not exists(select 1 from public.audit_events where event_type='retention_discarded' and resource_id=v_id) then
  raise exception 'discard action was not recorded';
 end if;
end $$;
reset role;
rollback;
select 'issue_102_discard_hold_and_audit_tests_passed' as result;
