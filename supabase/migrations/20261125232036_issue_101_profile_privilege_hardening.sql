-- Issue #101 follow-up: remove residual broad profile/function privileges.
-- Trigger functions are invoked by their triggers and must not be callable as RPCs.
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;

revoke all on function public.create_default_profile() from public, anon, authenticated;
revoke all on function public.prevent_client_profile_privilege_changes() from public, anon, authenticated;

-- is_active_ti is used by authenticated RLS policies; keep it unavailable to anon.
revoke all on function public.is_active_ti() from public, anon;
grant execute on function public.is_active_ti() to authenticated;
