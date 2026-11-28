-- Issue #107: list_recent_conversations integration assertions under the caller's JWT/RLS.
-- Synthetic identities, conversation and message are rolled back at the end.
begin;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated',
   'issue107-recent-a@rls.invalid', now(), now(), '{}', '{}'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated',
   'issue107-recent-b@rls.invalid', now(), now(), '{}', '{}');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
select set_config(
  'issue107.recent_conversation_id',
  public.open_direct_conversation('22222222-2222-4222-8222-222222222222')::text,
  true
);

reset role;

-- Seed an incoming message as the migration owner. The RPC assertion below
-- still runs as authenticated and therefore exercises SECURITY INVOKER + RLS.
insert into public.messages (conversation_id, sender_profile_id, body)
values (
  current_setting('issue107.recent_conversation_id')::uuid,
  '22222222-2222-4222-8222-222222222222',
  'Issue 107 unread integration message'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

do $assert_recent_conversations$
declare
  v_recent record;
  v_conversation_id uuid := current_setting('issue107.recent_conversation_id')::uuid;
begin
  select *
    into v_recent
  from public.list_recent_conversations()
  where conversation_id = v_conversation_id;

  if not found then
    raise exception 'The authenticated member did not receive their recent conversation';
  end if;

  if v_recent.conversation_kind <> 'direct' then
    raise exception 'The recent conversation returned an unexpected kind: %', v_recent.conversation_kind;
  end if;

  if v_recent.last_message_body <> 'Issue 107 unread integration message' then
    raise exception 'The recent conversation did not expose the latest visible message preview';
  end if;

  if v_recent.unread_count <> 1 then
    raise exception 'Expected one unread incoming message, received %', v_recent.unread_count;
  end if;
end;
$assert_recent_conversations$;

reset role;

do $assert_anon_denied$
begin
  if has_function_privilege('anon', 'public.list_recent_conversations()', 'EXECUTE') then
    raise exception 'Anonymous role unexpectedly has execute permission';
  end if;
end;
$assert_anon_denied$;

rollback;
