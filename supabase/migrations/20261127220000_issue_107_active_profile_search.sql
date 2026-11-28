-- Issue #107: expose only the minimum directory data needed to start a direct chat.
-- SECURITY DEFINER is narrowly scoped: active caller, active non-self profiles,
-- username prefix search, at most 25 rows, and no email/role/account metadata.

create or replace function public.search_active_profiles(p_query text)
returns table (
  profile_id uuid,
  username text
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.username
  from public.profiles p
  where (select auth.uid()) is not null
    and private.is_active_profile((select auth.uid()))
    and not (select private.is_active_ti())
    and p.is_active = true
    and p.id <> (select auth.uid())
    and length(btrim(coalesce(p_query, ''))) between 2 and 64
    and left(lower(p.username), length(btrim(p_query))) = lower(btrim(p_query))
  order by lower(p.username), p.id
  limit 25;
$$;

revoke all on function public.search_active_profiles(text)
  from public, anon;
grant execute on function public.search_active_profiles(text)
  to authenticated;
