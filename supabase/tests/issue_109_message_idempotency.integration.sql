-- Issue #109 integration assertions for client-generated message IDs.
-- Run against a disposable local Supabase database after all migrations.
begin;

create temp table message_idempotency_results (
  test_name text primary key,
  passed boolean not null,
  detail text not null
);
grant insert, select on message_idempotency_results to authenticated;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
(
  '11111111-1111-4111-8111-111111111111',
  'authenticated', 'authenticated', 'message-a@idempotency.invalid',
  now(), now(), '{}', '{}'
),
(
  '22222222-2222-4222-8222-222222222222',
  'authenticated', 'authenticated', 'message-b@idempotency.invalid',
  now(), now(), '{}', '{}'
);

insert into public.conversations (
  id, kind, created_by_profile_id, direct_user_a_id, direct_user_b_id
) values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'direct',
  '11111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222'
);

insert into public.memberships (conversation_id, profile_id, added_by_profile_id) values
(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111'
),
(
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);

-- Explicit client-generated UUID is permitted by the column-level INSERT grant.
insert into public.messages (id, conversation_id, sender_profile_id, body)
values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  (select auth.uid()),
  'Mensagem original'
);
insert into message_idempotency_results
select 'client_id_insert_allowed', count(*) = 1,
       'authenticated member can insert using a client-generated primary key'
from public.messages where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

-- An identical retry is ignored by the primary-key conflict target.
insert into public.messages (id, conversation_id, sender_profile_id, body)
values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  (select auth.uid()),
  'Mensagem original'
)
on conflict (id) do nothing;
insert into message_idempotency_results
select 'identical_retry_not_duplicated', count(*) = 1,
       'repeated primary key leaves exactly one row'
from public.messages where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

-- A conflicting payload cannot overwrite the original message.
insert into public.messages (id, conversation_id, sender_profile_id, body)
values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  (select auth.uid()),
  'Conteúdo conflitante'
)
on conflict (id) do nothing;
insert into message_idempotency_results
select 'conflicting_retry_preserves_original',
       count(*) = 1 and bool_and(body = 'Mensagem original'),
       'conflicting retry does not update the persisted body'
from public.messages where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

reset role;

do $assert$
declare total_tests integer; failed_tests integer;
begin
  select count(*), count(*) filter (where not passed)
    into total_tests, failed_tests
  from message_idempotency_results;
  if total_tests <> 3 or failed_tests <> 0 then
    raise exception 'Issue #109 idempotency tests failed: % total, % failed',
      total_tests, failed_tests;
  end if;
end;
$assert$;

select * from message_idempotency_results order by test_name;
rollback;
