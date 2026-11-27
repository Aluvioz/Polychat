-- Issue #107: active-user directory exposes only id/username for active non-self profiles.
-- Synthetic identities and all related profile rows are rolled back.
begin;

insert into auth.users (
  id, aud, role, email, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated',
   'issue107-search-a@rls.invalid', now(), now(), '{}', '{}'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated',
   'issue107-search-b@rls.invalid', now(), now(), '{}', '{}'),
  ('44444444-4444-4444-8444-444444444444', 'authenticated', 'authenticated',
   'issue107-search-b-inactive@rls.invalid', now(), now(), '{}', '{}');

update public.profiles
set username = 'qz107recipient'
where id = '22222222-2222-4222-8222-222222222222';

update public.profiles
set is_active = false
where id = '44444444-4444-4444-8444-444444444444';

-- Keep the prefix deterministic instead of deriving it from a profile read
-- that may be hidden by the baseline profile-directory RLS policy.
select set_config('issue107.search_query', 'qz', true);

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

do $assert_active_directory$
declare
  v_query text := current_setting('issue107.search_query');
begin
  if not exists (
    select 1
    from public.search_active_profiles(v_query) result
    where result.profile_id = '22222222-2222-4222-8222-222222222222'
      and result.username = 'qz107recipient'
  ) then
    raise exception 'The active recipient was not returned by the restricted directory';
  end if;

  if exists (
    select 1
    from public.search_active_profiles(v_query) result
    where result.profile_id in (
      '11111111-1111-4111-8111-111111111111',
      '44444444-4444-4444-8444-444444444444'
    )
  ) then
    raise exception 'The directory returned the caller or an inactive profile';
  end if;

  if (select count(*) from public.search_active_profiles(v_query)) > 25 then
    raise exception 'The directory exceeded its result limit';
  end if;
end;
$assert_active_directory$;

reset role;

do $assert_anon_denied$
begin
  if has_function_privilege('anon', 'public.search_active_profiles(text)', 'EXECUTE') then
    raise exception 'Anonymous role unexpectedly has execute permission';
  end if;
end;
$assert_anon_denied$;

rollback;
