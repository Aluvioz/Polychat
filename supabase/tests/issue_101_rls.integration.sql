-- Issue #101 integration checks for Supabase SQL Editor.
-- All synthetic Auth users and domain rows are rolled back at the end.
begin;

create temp table rls_results(test_name text primary key, passed boolean not null, detail text);
grant insert, select on rls_results to authenticated;

insert into auth.users (id,aud,role,email,created_at,updated_at,raw_app_meta_data,raw_user_meta_data) values
('11111111-1111-4111-8111-111111111111','authenticated','authenticated','a@rls.invalid',now(),now(),'{}','{}'),
('22222222-2222-4222-8222-222222222222','authenticated','authenticated','b@rls.invalid',now(),now(),'{}','{}'),
('33333333-3333-4333-8333-333333333333','authenticated','authenticated','c@rls.invalid',now(),now(),'{}','{}'),
('44444444-4444-4444-8444-444444444444','authenticated','authenticated','ti@rls.invalid',now(),now(),'{}','{}'),
('55555555-5555-4555-8555-555555555555','authenticated','authenticated','inactive@rls.invalid',now(),now(),'{}','{}');

update public.profiles set role='ti' where id='44444444-4444-4444-8444-444444444444';
update public.profiles set is_active=false where id='55555555-5555-4555-8555-555555555555';

insert into public.conversations(id,kind,created_by_profile_id,direct_user_a_id,direct_user_b_id)
values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','direct','11111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222'),
('abababab-abab-4bab-8bab-abababababab','direct','11111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111','33333333-3333-4333-8333-333333333333');
insert into public.conversations(id,kind,name,created_by_profile_id,status)
values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','group','active','44444444-4444-4444-8444-444444444444','active'),
       ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','group','closed','44444444-4444-4444-8444-444444444444','closed');

insert into public.memberships(conversation_id,profile_id,added_by_profile_id) values
('abababab-abab-4bab-8bab-abababababab','11111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111'),
('abababab-abab-4bab-8bab-abababababab','33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','11111111-1111-4111-8111-111111111111','44444444-4444-4444-8444-444444444444'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','44444444-4444-4444-8444-444444444444'),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc','11111111-1111-4111-8111-111111111111','44444444-4444-4444-8444-444444444444'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','55555555-5555-4555-8555-555555555555','44444444-4444-4444-8444-444444444444');

insert into public.messages(id,conversation_id,sender_profile_id,body) values
('dddddddd-dddd-4ddd-8ddd-dddddddddddd','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','direct'),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','group');

insert into public.attachments(id,message_id,storage_reference,original_filename,mime_type,size_bytes)
values ('ffffffff-ffff-4fff-8fff-ffffffffffff','dddddddd-dddd-4ddd-8ddd-dddddddddddd','test/path','test.pdf','application/pdf',100);
insert into public.security_alerts(id,message_id,rule_reference,severity)
values ('99999999-9999-4999-8999-999999999999','eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','test','low');

-- Active member: own conversations, current memberships, messages and attachments.
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
insert into public.memberships(conversation_id,profile_id,added_by_profile_id) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',(select auth.uid()),(select auth.uid())),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','22222222-2222-4222-8222-222222222222',(select auth.uid()));
insert into rls_results select 'member_conversations',count(*)=3,'directs and active group; closed group hidden' from public.conversations;
insert into rls_results select 'member_messages',count(*)=2,'only messages in current memberships' from public.messages;
insert into rls_results select 'member_attachments',count(*)=1,'only attachment in readable conversation' from public.attachments;
insert into rls_results select 'member_memberships',count(*)=4,'only own memberships' from public.memberships;
insert into public.messages(conversation_id,sender_profile_id,body)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',(select auth.uid()),'allowed direct message');

insert into public.message_reads(message_id,reader_profile_id)
values ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',(select auth.uid()));
insert into rls_results select 'reader_sees_receipt',count(*)=1,'reader can see own receipt' from public.message_reads;

do $$
begin
  begin
    insert into public.conversations(kind,name,created_by_profile_id)
    values ('group','denied',(select auth.uid()));
    insert into rls_results values ('user_cannot_create_group',false,'insert unexpectedly succeeded');
  exception when insufficient_privilege then
    insert into rls_results values ('user_cannot_create_group',true,'insert rejected');
  end;
  begin
    insert into public.memberships(conversation_id,profile_id,added_by_profile_id)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','33333333-3333-4333-8333-333333333333',(select auth.uid()));
    insert into rls_results values ('user_cannot_add_group_member',false,'insert unexpectedly succeeded');
  exception when insufficient_privilege then
    insert into rls_results values ('user_cannot_add_group_member',true,'insert rejected');
  end;
  begin
    insert into public.messages(conversation_id,sender_profile_id,body)
    values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc',(select auth.uid()),'denied');
    insert into rls_results values ('closed_group_read_only',false,'insert unexpectedly succeeded');
  exception when insufficient_privilege then
    insert into rls_results values ('closed_group_read_only',true,'insert rejected');
  end;
end $$;

update public.messages set body='unauthorized edit'
where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
insert into rls_results
select 'user_cannot_edit_message',count(*)=0,'update affected zero rows'
from public.messages where id='dddddddd-dddd-4ddd-8ddd-dddddddddddd' and body='unauthorized edit';
insert into rls_results select 'user_cannot_read_alerts',count(*)=0,'alerts hidden from ordinary user' from public.security_alerts;
reset role;

-- A direct recipient sees only the newly-created direct conversation, not the
-- earlier direct/group conversations or their messages.
set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
insert into rls_results select 'new_direct_participant_isolated',count(*)=1,'only own direct conversation' from public.conversations;
insert into rls_results select 'new_direct_participant_no_old_messages',count(*)=0,'no access to unrelated messages' from public.messages;
reset role;

-- Membership does not restore access for an inactive profile.
set local role authenticated;
select set_config('request.jwt.claim.sub','55555555-5555-4555-8555-555555555555',true);
insert into rls_results select 'inactive_user_denied',count(*)=0,'inactive profile cannot read conversations' from public.conversations;
reset role;

-- TI can inspect closed conversations, close alerts and create groups.
set local role authenticated;
select set_config('request.jwt.claim.sub','44444444-4444-4444-8444-444444444444',true);
insert into rls_results select 'ti_reads_all_conversations',count(*)=4,'TI sees direct, active and closed conversations' from public.conversations;
update public.security_alerts
set status='closed',reviewed_by_profile_id=(select auth.uid()),reviewed_at=now()
where id='99999999-9999-4999-8999-999999999999';
insert into rls_results values ('ti_closes_alert',true,'TI update accepted');
insert into public.conversations(kind,name,created_by_profile_id)
values ('group','TI group',(select auth.uid()));
insert into rls_results values ('ti_creates_group',true,'TI group insert accepted');
reset role;

do $assert$
declare total_tests integer; failed_tests integer;
begin
  select count(*),count(*) filter (where not passed)
    into total_tests,failed_tests
  from rls_results;
  if total_tests<>16 or failed_tests<>0 then
    raise exception 'Issue #101 RLS tests failed: % total, % failed',total_tests,failed_tests;
  end if;
end;
$assert$;

select * from rls_results order by test_name;
rollback;
