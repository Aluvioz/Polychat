-- Issue #107: SECURITY INVOKER direct-conversation RPC integration assertions.
-- All synthetic identities and rows are rolled back at the end of this script.
begin;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated',
   'issue107-a@rls.invalid', now(), now(), '{}', '{}'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated',
   'issue107-b@rls.invalid', now(), now(), '{}', '{}'),
  ('44444444-4444-4444-8444-444444444444', 'authenticated', 'authenticated',
   'issue107-inactive@rls.invalid', now(), now(), '{}', '{}');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

-- Assert the exact predicates used by the conversations INSERT policy before
-- invoking either the direct INSERT probe or the RPC.
do $policy_preconditions$
begin
  if auth.uid() <> '11111111-1111-4111-8111-111111111111'::uuid then
    raise exception 'JWT subject was not applied to the authenticated role';
  end if;
  if not private.is_active_profile(auth.uid())
     or not private.is_active_profile('22222222-2222-4222-8222-222222222222')
     or not private.can_create_direct_conversation(
       '11111111-1111-4111-8111-111111111111',
       '22222222-2222-4222-8222-222222222222',
       auth.uid()
     ) then
    raise exception 'Issue #107 fixture does not satisfy the existing direct-conversation INSERT policy';
  end if;
end;
$policy_preconditions$;

-- Read-only diagnostics under the same authenticated role/JWT used by the INSERT.
-- This reports every effective policy, trigger, RLS flag, and INSERT privilege
-- without bypassing RLS or changing any security rule.
do $issue107_runtime_diagnostics$
declare
  v_policy_summary text;
  v_trigger_summary text;
  v_rls_enabled boolean;
  v_rls_forced boolean;
  v_table_insert boolean;
  v_column_privileges jsonb;
  v_full_policy_check boolean;
  v_created_by uuid := auth.uid();
  v_user_a uuid := '11111111-1111-4111-8111-111111111111';
  v_user_b uuid := '22222222-2222-4222-8222-222222222222';
begin
  select c.relrowsecurity, c.relforcerowsecurity
    into v_rls_enabled, v_rls_forced
  from pg_class c
  where c.oid = 'public.conversations'::regclass;

  select coalesce(string_agg(
    format('name=%s; permissive=%s; roles=%s; cmd=%s; using=%s; with_check=%s',
      policyname, permissive, roles::text, cmd,
      coalesce(qual, '<null>'), coalesce(with_check, '<null>')),
    E'\n' order by policyname), '<no policies>')
    into v_policy_summary
  from pg_policies
  where schemaname = 'public' and tablename = 'conversations';

  select coalesce(string_agg(
    format('name=%s; enabled=%s; definition=%s',
      t.tgname, t.tgenabled, pg_get_triggerdef(t.oid, true)),
    E'\n' order by t.tgname), '<no user triggers>')
    into v_trigger_summary
  from pg_trigger t
  where t.tgrelid = 'public.conversations'::regclass
    and not t.tgisinternal;

  v_table_insert := has_table_privilege(current_user, 'public.conversations', 'INSERT');
  v_column_privileges := jsonb_build_object(
    'id', has_column_privilege(current_user, 'public.conversations', 'id', 'INSERT'),
    'kind', has_column_privilege(current_user, 'public.conversations', 'kind', 'INSERT'),
    'created_by_profile_id', has_column_privilege(current_user, 'public.conversations', 'created_by_profile_id', 'INSERT'),
    'direct_user_a_id', has_column_privilege(current_user, 'public.conversations', 'direct_user_a_id', 'INSERT'),
    'direct_user_b_id', has_column_privilege(current_user, 'public.conversations', 'direct_user_b_id', 'INSERT')
  );
  v_full_policy_check :=
    v_created_by = (select auth.uid())
    and private.is_active_profile((select auth.uid()))
    and (
      ('direct' = 'direct' and private.can_create_direct_conversation(
        v_user_a, v_user_b, v_created_by
      ))
      or ('direct' = 'group' and (select public.is_active_ti()))
    );

  raise notice 'ISSUE107_RUNTIME role=% auth.uid=% jwt.sub=% row_security=% force_rls=% table_insert=% column_insert=% full_policy_check=%',
    current_user, v_created_by, current_setting('request.jwt.claim.sub', true),
    v_rls_enabled, v_rls_forced, v_table_insert, v_column_privileges, v_full_policy_check;
  raise notice 'ISSUE107_RUNTIME policies: %', v_policy_summary;
  raise notice 'ISSUE107_RUNTIME triggers: %', v_trigger_summary;
  raise notice 'ISSUE107_RUNTIME candidate row: kind=direct created_by=% user_a=% user_b=%; created_by_matches_uid=%; actor_active=%; both_participants_active=%; can_create_direct=%',
    v_created_by, v_user_a, v_user_b,
    v_created_by = auth.uid(),
    private.is_active_profile(auth.uid()),
    private.is_active_profile(v_user_a) and private.is_active_profile(v_user_b),
    private.can_create_direct_conversation(v_user_a, v_user_b, v_created_by);
end;
$issue107_runtime_diagnostics$;

-- Diagnostic isolation: perform the exact INSERT statement used by the
-- SECURITY INVOKER RPC, including its partial-index ON CONFLICT clause, as the
-- authenticated caller. Roll it back via a PL/pgSQL exception subtransaction.
do $direct_insert_probe$
declare
  v_probe_id uuid := gen_random_uuid();
  v_inserted_count integer;
begin
  begin
    insert into public.conversations (
      id,
      kind,
      created_by_profile_id,
      direct_user_a_id,
      direct_user_b_id
    )
    values (
      v_probe_id,
      'direct',
      auth.uid(),
      '11111111-1111-4111-8111-111111111111',
      '22222222-2222-4222-8222-222222222222'
    )
    on conflict (direct_user_a_id, direct_user_b_id)
      where kind = 'direct'
      do nothing;

    get diagnostics v_inserted_count = row_count;
    if v_inserted_count <> 1 then
      raise exception 'Direct authenticated INSERT probe did not insert exactly one row';
    end if;

    raise exception 'ISSUE107_PROBE_ROLLBACK';
  exception
    when others then
      if sqlerrm = 'ISSUE107_PROBE_ROLLBACK' then
        null;
      else
        raise exception 'Direct authenticated INSERT probe failed: %', sqlerrm;
      end if;
  end;
end;
$direct_insert_probe$;

select set_config(
  'issue107.first_id',
  public.open_direct_conversation('22222222-2222-4222-8222-222222222222')::text,
  true
);
select set_config(
  'issue107.retry_id',
  public.open_direct_conversation('22222222-2222-4222-8222-222222222222')::text,
  true
);

select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
select set_config(
  'issue107.reciprocal_id',
  public.open_direct_conversation('11111111-1111-4111-8111-111111111111')::text,
  true
);

reset role;

do $assert$
declare
  v_conversation_id uuid := current_setting('issue107.first_id')::uuid;
  v_count integer;
begin
  if v_conversation_id is null
     or current_setting('issue107.retry_id')::uuid <> v_conversation_id
     or current_setting('issue107.reciprocal_id')::uuid <> v_conversation_id then
    raise exception 'Repeated or reciprocal open did not reuse the same direct conversation';
  end if;

  select count(*) into v_count
  from public.conversations
  where id = v_conversation_id
    and kind = 'direct'
    and direct_user_a_id = '11111111-1111-4111-8111-111111111111'
    and direct_user_b_id = '22222222-2222-4222-8222-222222222222'
    and status = 'active';

  if v_count <> 1 then
    raise exception 'Expected exactly one active direct conversation with canonical participants';
  end if;

  select count(*) into v_count
  from public.memberships
  where conversation_id = v_conversation_id
    and profile_id in (
      '11111111-1111-4111-8111-111111111111',
      '22222222-2222-4222-8222-222222222222'
    )
    and ended_at is null;

  if v_count <> 2 then
    raise exception 'Expected exactly two current memberships';
  end if;
end;
$assert$;

update public.profiles
set is_active = false
where id = '44444444-4444-4444-8444-444444444444';

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

do $negative$
begin
  begin
    perform public.open_direct_conversation('44444444-4444-4444-8444-444444444444');
    raise exception 'Inactive recipient was unexpectedly accepted';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    perform public.open_direct_conversation('11111111-1111-4111-8111-111111111111');
    raise exception 'Self-conversation was unexpectedly accepted';
  exception
    when invalid_parameter_value then
      null;
  end;
end;
$negative$;

reset role;
rollback;
