-- Keep the TI predicate SECURITY DEFINER only in the non-exposed private schema.
-- The public function used by existing RLS policies becomes an invoker wrapper.
create or replace function private.is_active_ti()
returns boolean language sql stable security definer set search_path=''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id=(select auth.uid()) and p.role='ti' and p.is_active=true
  );
$$;
revoke all on function private.is_active_ti() from public,anon;
grant execute on function private.is_active_ti() to authenticated;

create or replace function public.is_active_ti()
returns boolean language sql stable security invoker set search_path=''
as $$
  select private.is_active_ti();
$$;
revoke all on function public.is_active_ti() from public,anon;
grant execute on function public.is_active_ti() to authenticated;
