-- Issue #101 direct-conversation creation path.
-- The client generates the UUID, inserts the conversation, then inserts both
-- memberships. The transaction is rolled back and creates no persistent users.
begin;
insert into auth.users (id,aud,role,email,created_at,updated_at,raw_app_meta_data,raw_user_meta_data) values
('11111111-1111-4111-8111-111111111111','authenticated','authenticated','direct-a@rls.invalid',now(),now(),'{}','{}'),
('33333333-3333-4333-8333-333333333333','authenticated','authenticated','direct-c@rls.invalid',now(),now(),'{}','{}');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
insert into public.conversations(id,kind,created_by_profile_id,direct_user_a_id,direct_user_b_id)
values ('abababab-abab-4bab-8bab-abababababab','direct',auth.uid(),'11111111-1111-4111-8111-111111111111','33333333-3333-4333-8333-333333333333');
insert into public.memberships(conversation_id,profile_id,added_by_profile_id) values
('abababab-abab-4bab-8bab-abababababab',auth.uid(),auth.uid()),
('abababab-abab-4bab-8bab-abababababab','33333333-3333-4333-8333-333333333333',auth.uid());
do $assert$
begin
  if (select count(*) from public.conversations
      where id='abababab-abab-4bab-8bab-abababababab') <> 1 then
    raise exception 'Direct conversation is not visible after membership';
  end if;
end;
$assert$;
select true as direct_conversation_visible_after_membership;
rollback;
