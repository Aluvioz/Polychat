-- Issue #102 transactional integration checks for Supabase SQL Editor.
-- Synthetic Auth identities and all domain/audit rows are rolled back.
-- This script intentionally does not invoke the physical-discard RPC; disposal
-- of a real audit row requires an explicit TI decision and is not a test fixture.

begin;
insert into auth.users (id,aud,role,email,created_at,updated_at,raw_app_meta_data,raw_user_meta_data) values
('66666666-6666-4666-8666-666666666666','authenticated','authenticated','audit-ti-test@invalid.test',now(),now(),'{}','{}'),
('77777777-7777-4777-8777-777777777777','authenticated','authenticated','audit-user-test@invalid.test',now(),now(),'{}','{}');
update public.profiles set role='ti' where id='66666666-6666-4666-8666-666666666666';

insert into public.conversations(id,kind,name,created_by_profile_id,status)
values ('88888888-8888-4888-8888-888888888888','group','audit-test','66666666-6666-4666-8666-666666666666','active');
insert into public.memberships(conversation_id,profile_id,added_by_profile_id)
values ('88888888-8888-4888-8888-888888888888','66666666-6666-4666-8666-666666666666','66666666-6666-4666-8666-666666666666');
insert into public.messages(id,conversation_id,sender_profile_id,body)
values ('99999999-9999-4999-8999-999999999998','88888888-8888-4888-8888-888888888888','66666666-6666-4666-8666-666666666666','before');
insert into public.security_alerts(id,message_id,rule_reference,severity)
values ('99999999-9999-4999-8999-999999999997','99999999-9999-4999-8999-999999999998','audit-test','low');

-- Ordinary users cannot read the audit trail or retention holds.
set local role authenticated;
select set_config('request.jwt.claim.sub','77777777-7777-4777-8777-777777777777',true);
do $$ declare n integer; begin
  select count(*) into n from public.audit_events;
  if n<>0 then raise exception 'ordinary user read audit events'; end if;
  select count(*) into n from public.retention_holds;
  if n<>0 then raise exception 'ordinary user read retention holds'; end if;
end $$;
reset role;

-- TI can write permitted audit metadata; sensitive values and direct mutations
-- are rejected by the database guard/append-only trigger.
set local role authenticated;
select set_config('request.jwt.claim.sub','66666666-6666-4666-8666-666666666666',true);
insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
values (auth.uid(),'conversation_viewed','conversation','88888888-8888-4888-8888-888888888888','success','{"source":"test"}');

do $$ begin
  begin
    insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
    values (auth.uid(),'conversation_viewed','conversation','88888888-8888-4888-8888-888888888888','success','{"password":"not-logged"}');
    raise exception 'sensitive metadata unexpectedly accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    update public.audit_events set outcome='tampered' where event_type='conversation_viewed';
    raise exception 'audit event unexpectedly updated';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.audit_events where event_type='conversation_viewed';
  exception when insufficient_privilege then null;
  end;
  if not exists(select 1 from public.audit_events where event_type='conversation_viewed') then
    raise exception 'direct audit-event deletion unexpectedly succeeded';
  end if;
end $$;

-- Investigation holds are TI-only, unique while active, and their placement
-- and release create immutable audit events.
insert into public.retention_holds(resource_type,resource_id,placed_by_profile_id)
select 'audit_event',id,auth.uid() from public.audit_events where event_type='conversation_viewed';
update public.retention_holds
set released_by_profile_id=auth.uid(),released_at=now()
where resource_type='audit_event' and released_at is null;

-- Privileged message edits and alert closures create audit rows in the same
-- transaction as the business mutation.
update public.messages
set body='after',edited_at=now(),edited_by_profile_id=auth.uid()
where id='99999999-9999-4999-8999-999999999998';
update public.security_alerts
set status='closed',reviewed_by_profile_id=auth.uid(),reviewed_at=now()
where id='99999999-9999-4999-8999-999999999997';

do $$ declare n integer; begin
  select count(*) into n from public.audit_events where event_type='message_admin_edited';
  if n<>1 then raise exception 'message edit audit trigger missing'; end if;
  select count(*) into n from public.audit_events where event_type='alert_closed';
  if n<>1 then raise exception 'alert closure audit trigger missing'; end if;
  select count(*) into n from public.audit_events where event_type='retention_hold_placed';
  if n<>1 then raise exception 'retention hold placement not audited'; end if;
  select count(*) into n from public.audit_events where event_type='retention_hold_released';
  if n<>1 then raise exception 'retention hold release not audited'; end if;
end $$;
reset role;
rollback;
select 'issue_102_audit_and_hold_tests_passed' as result;
