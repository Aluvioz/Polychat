-- Issue #99: initial domain schema.
-- This migration intentionally does not implement the audit strategy owned by Issue #102.
-- RLS is enabled without domain policies; authorization policies belong to Issues #100/#101.

alter table public.profiles
  add column if not exists username text;

create unique index if not exists profiles_username_unique
  on public.profiles (username)
  where username is not null;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('direct', 'group')),
  name text,
  created_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'active'
    check (status in ('active', 'disabled', 'closed')),
  direct_user_a_id uuid references public.profiles(id) on delete restrict,
  direct_user_b_id uuid references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_direct_pair_shape check (
    (kind = 'direct'
      and direct_user_a_id is not null
      and direct_user_b_id is not null
      and direct_user_a_id < direct_user_b_id
      and name is null)
    or
    (kind = 'group'
      and direct_user_a_id is null
      and direct_user_b_id is null)
  )
);

create unique index if not exists conversations_direct_pair_unique
  on public.conversations (direct_user_a_id, direct_user_b_id)
  where kind = 'direct';

create index if not exists conversations_created_by_idx
  on public.conversations (created_by_profile_id);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  added_by_profile_id uuid references public.profiles(id) on delete restrict,
  joined_at timestamptz not null default now(),
  ended_at timestamptz,
  ended_by_profile_id uuid references public.profiles(id) on delete restrict,
  constraint memberships_period_order check (ended_at is null or ended_at >= joined_at),
  constraint memberships_ended_by_consistency check (
    (ended_at is null and ended_by_profile_id is null)
    or (ended_at is not null)
  )
);

create unique index if not exists memberships_one_current_period
  on public.memberships (conversation_id, profile_id)
  where ended_at is null;

create index if not exists memberships_profile_conversation_idx
  on public.memberships (profile_id, conversation_id);

create index if not exists memberships_conversation_profile_idx
  on public.memberships (conversation_id, profile_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete restrict,
  sender_profile_id uuid not null references public.profiles(id) on delete restrict,
  body text,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  edited_by_profile_id uuid references public.profiles(id) on delete restrict,
  deleted_at timestamptz,
  deleted_by_profile_id uuid references public.profiles(id) on delete restrict,
  constraint messages_body_not_blank check (
    body is null or length(btrim(body)) > 0
  ),
  constraint messages_edit_metadata_consistency check (
    (edited_at is null and edited_by_profile_id is null)
    or (edited_at is not null and edited_by_profile_id is not null)
  ),
  constraint messages_delete_metadata_consistency check (
    (deleted_at is null and deleted_by_profile_id is null)
    or (deleted_at is not null and deleted_by_profile_id is not null)
  )
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc, id desc);

create index if not exists messages_sender_created_idx
  on public.messages (sender_profile_id, created_at desc);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete restrict,
  storage_reference text not null,
  original_filename text not null,
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  scan_status text,
  scan_result text,
  scanned_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists attachments_message_idx
  on public.attachments (message_id);

create table if not exists public.message_reads (
  message_id uuid not null references public.messages(id) on delete restrict,
  reader_profile_id uuid not null references public.profiles(id) on delete restrict,
  read_at timestamptz not null default now(),
  primary key (message_id, reader_profile_id)
);

create index if not exists message_reads_reader_read_at_idx
  on public.message_reads (reader_profile_id, read_at desc);

create table if not exists public.security_alerts (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete restrict,
  rule_reference text not null,
  detected_at timestamptz not null default now(),
  severity text not null check (severity in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'closed')),
  reviewed_by_profile_id uuid references public.profiles(id) on delete restrict,
  reviewed_at timestamptz,
  constraint security_alerts_review_consistency check (
    (status = 'open' and reviewed_by_profile_id is null and reviewed_at is null)
    or
    (status = 'closed' and reviewed_by_profile_id is not null and reviewed_at is not null)
  )
);

create index if not exists security_alerts_queue_idx
  on public.security_alerts (status, severity, detected_at);

create index if not exists security_alerts_message_idx
  on public.security_alerts (message_id);

-- Exposed public-schema tables remain inaccessible to API roles until
-- the domain authorization matrix and policies are implemented in #100/#101.
alter table public.conversations enable row level security;
alter table public.memberships enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;
alter table public.message_reads enable row level security;
alter table public.security_alerts enable row level security;
