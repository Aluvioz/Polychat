-- Issue #99: enforce cross-table message/attachment invariants and persist
-- only the configuration inventory explicitly defined in POLY-DATA-001 v0.3.
-- Domain authorization policies remain in Issue #101.

-- The product permits at most five attachments per message.
-- Advisory transaction locks serialize concurrent inserts for the same message.
create or replace function public.enforce_message_attachment_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  existing_count integer;
  old_lock_key bigint;
  new_lock_key bigint;
begin
  if tg_op = 'UPDATE' and new.message_id is distinct from old.message_id then
    old_lock_key := hashtextextended(old.message_id::text, 0);
    new_lock_key := hashtextextended(new.message_id::text, 0);
    perform pg_advisory_xact_lock(least(old_lock_key, new_lock_key));
    perform pg_advisory_xact_lock(greatest(old_lock_key, new_lock_key));
  else
    perform pg_advisory_xact_lock(hashtextextended(new.message_id::text, 0));
  end if;

  select count(*)
    into existing_count
    from public.attachments a
   where a.message_id = new.message_id
     and a.id <> new.id;

  if existing_count >= 5 then
    raise exception 'A message cannot contain more than five attachments'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists attachments_enforce_message_limit on public.attachments;
create trigger attachments_enforce_message_limit
before insert or update of message_id on public.attachments
for each row execute function public.enforce_message_attachment_limit();

-- A message must have non-blank text or at least one attachment at transaction
-- commit. The deferred constraint triggers allow message + attachment creation
-- in one transaction (for example, through a server-side RPC).
create or replace function public.assert_message_content_or_attachment()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  affected_message_ids uuid[];
  affected_message_id uuid;
begin
  if tg_table_name = 'messages' then
    affected_message_ids := array[new.id];
  elsif tg_op = 'INSERT' then
    affected_message_ids := array[new.message_id];
  elsif tg_op = 'DELETE' then
    affected_message_ids := array[old.message_id];
  else
    affected_message_ids := array[old.message_id, new.message_id];
  end if;

  foreach affected_message_id in array affected_message_ids loop
    if affected_message_id is not null and exists (
      select 1
        from public.messages m
       where m.id = affected_message_id
         and nullif(btrim(m.body), '') is null
         and not exists (
           select 1
             from public.attachments a
            where a.message_id = m.id
         )
    ) then
      raise exception 'A message must contain non-blank text or at least one attachment'
        using errcode = '23514';
    end if;
  end loop;

  return null;
end;
$$;

drop trigger if exists messages_require_content_or_attachment on public.messages;
create constraint trigger messages_require_content_or_attachment
after insert or update on public.messages
deferrable initially deferred
for each row execute function public.assert_message_content_or_attachment();

drop trigger if exists attachments_require_parent_message_content on public.attachments;
create constraint trigger attachments_require_parent_message_content
after insert or update or delete on public.attachments
deferrable initially deferred
for each row execute function public.assert_message_content_or_attachment();

-- Persist the exact configuration inventory from POLY-DATA-001 v0.3.
-- No generic key/value configuration table or invented defaults are introduced.
create table if not exists public.detection_rules (
  id uuid primary key default gen_random_uuid(),
  rule_value text not null check (length(btrim(rule_value)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists detection_rules_updated_at_idx
  on public.detection_rules (updated_at desc);

create table if not exists public.attachment_user_quotas (
  profile_id uuid primary key references public.profiles(id) on delete restrict,
  quota_bytes bigint not null check (quota_bytes > 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.attachment_storage_capacity (
  singleton_id smallint primary key default 1 check (singleton_id = 1),
  capacity_bytes bigint not null check (capacity_bytes > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.set_configuration_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists detection_rules_set_updated_at on public.detection_rules;
create trigger detection_rules_set_updated_at
before update on public.detection_rules
for each row execute function public.set_configuration_updated_at();

drop trigger if exists attachment_user_quotas_set_updated_at on public.attachment_user_quotas;
create trigger attachment_user_quotas_set_updated_at
before update on public.attachment_user_quotas
for each row execute function public.set_configuration_updated_at();

drop trigger if exists attachment_storage_capacity_set_updated_at on public.attachment_storage_capacity;
create trigger attachment_storage_capacity_set_updated_at
before update on public.attachment_storage_capacity
for each row execute function public.set_configuration_updated_at();

-- RLS is enabled now; policies and API access belong to the authorization work
-- in Issue #101. No client-facing access is opened by this migration.
alter table public.detection_rules enable row level security;
alter table public.attachment_user_quotas enable row level security;
alter table public.attachment_storage_capacity enable row level security;

revoke all on table public.detection_rules from public, anon, authenticated;
revoke all on table public.attachment_user_quotas from public, anon, authenticated;
revoke all on table public.attachment_storage_capacity from public, anon, authenticated;
