-- Polychat issue #105: server-managed roles and account activation state.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'ti')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_self_or_ti" on public.profiles;
create policy "profiles_select_self_or_ti"
on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or exists (
    select 1 from public.profiles current_profile
    where current_profile.id = (select auth.uid())
      and current_profile.role = 'ti'
      and current_profile.is_active = true
  )
);

-- No client write policies: only trusted server-side administration can mutate.
create or replace function public.prevent_client_profile_privilege_changes()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if auth.role() = 'authenticated'
     and (new.role is distinct from old.role
          or new.is_active is distinct from old.is_active) then
    raise exception 'Role and account status require trusted server operations'
      using errcode = '42501';
  end if;
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges before update on public.profiles
for each row execute function public.prevent_client_profile_privilege_changes();

create or replace function public.create_default_profile()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role, is_active)
  values (new.id, 'user', true) on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
for each row execute function public.create_default_profile();

revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
