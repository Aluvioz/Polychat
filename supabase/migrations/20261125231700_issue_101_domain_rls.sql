-- Issue #101: domain Row Level Security and least-privilege Data API grants.
-- Role and membership remain separate: TI can inspect all conversations; Users
-- can read only conversations with a current membership. Closed groups are TI-only.
-- The private schema is not intended to be exposed through the Supabase Data API.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_active_profile(p_profile_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_profile_id and p.is_active = true
  );
$$;

create or replace function private.is_current_conversation_member(p_conversation_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.is_active_profile((select auth.uid()))
    and exists (
      select 1 from public.memberships m
      where m.conversation_id = p_conversation_id
        and m.profile_id = (select auth.uid())
        and m.ended_at is null
    );
$$;

create or replace function private.can_read_conversation(p_conversation_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select public.is_active_ti())
    or (
      private.is_current_conversation_member(p_conversation_id)
      and exists (
        select 1 from public.conversations c
        where c.id = p_conversation_id and c.status <> 'closed'
      )
    );
$$;

create or replace function private.can_send_to_conversation(p_conversation_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.is_current_conversation_member(p_conversation_id)
    and exists (
      select 1 from public.conversations c
      where c.id = p_conversation_id and c.status = 'active'
    );
$$;

create or replace function private.can_create_direct_conversation(
  p_user_a uuid, p_user_b uuid, p_creator uuid
)
returns boolean language sql stable security definer set search_path = ''
as $$
  select p_user_a is not null
    and p_user_b is not null
    and p_user_a < p_user_b
    and p_creator = (select auth.uid())
    and p_creator in (p_user_a, p_user_b)
    and private.is_active_profile(p_user_a)
    and private.is_active_profile(p_user_b);
$$;

create or replace function private.can_create_direct_membership(
  p_conversation_id uuid, p_profile_id uuid
)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.is_active_profile((select auth.uid()))
    and private.is_active_profile(p_profile_id)
    and exists (
      select 1 from public.conversations c
      where c.id = p_conversation_id
        and c.kind = 'direct'
        and c.status = 'active'
        and (select auth.uid()) in (c.direct_user_a_id, c.direct_user_b_id)
        and p_profile_id in (c.direct_user_a_id, c.direct_user_b_id)
    );
$$;

create or replace function private.can_read_message(p_message_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select public.is_active_ti())
    or exists (
      select 1 from public.messages m
      where m.id = p_message_id
        and private.can_read_conversation(m.conversation_id)
    );
$$;

create or replace function private.can_attach_to_message(p_message_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.messages m
    where m.id = p_message_id
      and m.sender_profile_id = (select auth.uid())
      and private.can_send_to_conversation(m.conversation_id)
  );
$$;

create or replace function private.can_read_attachment(p_attachment_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select public.is_active_ti())
    or exists (
      select 1
      from public.attachments a
      join public.messages m on m.id = a.message_id
      where a.id = p_attachment_id
        and private.can_read_conversation(m.conversation_id)
    );
$$;

create or replace function private.can_read_message_read(
  p_message_id uuid, p_reader_profile_id uuid
)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select public.is_active_ti())
    or (
      private.can_read_message(p_message_id)
      and (
        p_reader_profile_id = (select auth.uid())
        or exists (
          select 1 from public.messages m
          where m.id = p_message_id
            and m.sender_profile_id = (select auth.uid())
        )
      )
    );
$$;

revoke all on all functions in schema private from public, anon, authenticated;
grant execute on all functions in schema private to authenticated;

-- Revoke default client privileges and grant only the columns/operations used
-- by the policies. service_role grants are not changed.
revoke all on table public.profiles from public, anon;
grant select on table public.profiles to authenticated;

revoke all on table public.conversations from public, anon, authenticated;
grant select on table public.conversations to authenticated;
grant insert (kind, name, created_by_profile_id, direct_user_a_id, direct_user_b_id)
  on table public.conversations to authenticated;
grant update (name, status, updated_at) on table public.conversations to authenticated;

revoke all on table public.memberships from public, anon, authenticated;
grant select on table public.memberships to authenticated;
grant insert (conversation_id, profile_id, added_by_profile_id)
  on table public.memberships to authenticated;
grant update (ended_at, ended_by_profile_id) on table public.memberships to authenticated;

revoke all on table public.messages from public, anon, authenticated;
grant select on table public.messages to authenticated;
grant insert (conversation_id, sender_profile_id, body) on table public.messages to authenticated;
grant update (body, edited_at, edited_by_profile_id, deleted_at, deleted_by_profile_id)
  on table public.messages to authenticated;

revoke all on table public.attachments from public, anon, authenticated;
grant select on table public.attachments to authenticated;
grant insert (message_id, storage_reference, original_filename, mime_type, size_bytes)
  on table public.attachments to authenticated;
grant update (scan_status, scan_result, scanned_at) on table public.attachments to authenticated;

revoke all on table public.message_reads from public, anon, authenticated;
grant select on table public.message_reads to authenticated;
grant insert (message_id, reader_profile_id) on table public.message_reads to authenticated;

revoke all on table public.security_alerts from public, anon, authenticated;
grant select on table public.security_alerts to authenticated;
grant update (status, reviewed_by_profile_id, reviewed_at)
  on table public.security_alerts to authenticated;

revoke all on table public.detection_rules from public, anon, authenticated;
grant select, delete on table public.detection_rules to authenticated;
grant insert (rule_value) on table public.detection_rules to authenticated;
grant update (rule_value, updated_at) on table public.detection_rules to authenticated;

revoke all on table public.attachment_user_quotas from public, anon, authenticated;
grant select on table public.attachment_user_quotas to authenticated;
grant insert (profile_id, quota_bytes) on table public.attachment_user_quotas to authenticated;
grant update (quota_bytes, updated_at) on table public.attachment_user_quotas to authenticated;

revoke all on table public.attachment_storage_capacity from public, anon, authenticated;
grant select on table public.attachment_storage_capacity to authenticated;
grant insert (capacity_bytes) on table public.attachment_storage_capacity to authenticated;
grant update (capacity_bytes, updated_at) on table public.attachment_storage_capacity to authenticated;

-- Generic audit events stay TI-only and append-only under Issue #102.
revoke all on table public.audit_events from public, anon;
grant select, insert on table public.audit_events to authenticated;

drop policy if exists conversations_select_authorized on public.conversations;
create policy conversations_select_authorized on public.conversations
for select to authenticated using (private.can_read_conversation(id));

drop policy if exists conversations_insert_authorized on public.conversations;
create policy conversations_insert_authorized on public.conversations
for insert to authenticated
with check (
  created_by_profile_id = (select auth.uid())
  and private.is_active_profile((select auth.uid()))
  and (
    (kind = 'direct' and private.can_create_direct_conversation(
      direct_user_a_id, direct_user_b_id, created_by_profile_id
    ))
    or (kind = 'group' and (select public.is_active_ti()))
  )
);

drop policy if exists conversations_update_ti on public.conversations;
create policy conversations_update_ti on public.conversations
for update to authenticated
using ((select public.is_active_ti()))
with check ((select public.is_active_ti()));

drop policy if exists memberships_select_authorized on public.memberships;
create policy memberships_select_authorized on public.memberships
for select to authenticated
using (
  (select public.is_active_ti())
  or (
    profile_id = (select auth.uid())
    and private.is_active_profile((select auth.uid()))
  )
);

drop policy if exists memberships_insert_authorized on public.memberships;
create policy memberships_insert_authorized on public.memberships
for insert to authenticated
with check (
  added_by_profile_id = (select auth.uid())
  and (
    (select public.is_active_ti())
    or private.can_create_direct_membership(conversation_id, profile_id)
  )
);

drop policy if exists memberships_update_ti on public.memberships;
create policy memberships_update_ti on public.memberships
for update to authenticated
using ((select public.is_active_ti()))
with check (
  (select public.is_active_ti())
  and ended_at is not null
  and ended_by_profile_id = (select auth.uid())
);

drop policy if exists messages_select_authorized on public.messages;
create policy messages_select_authorized on public.messages
for select to authenticated using (private.can_read_conversation(conversation_id));

drop policy if exists messages_insert_member on public.messages;
create policy messages_insert_member on public.messages
for insert to authenticated
with check (
  sender_profile_id = (select auth.uid())
  and private.can_send_to_conversation(conversation_id)
);

drop policy if exists messages_update_ti on public.messages;
create policy messages_update_ti on public.messages
for update to authenticated
using ((select public.is_active_ti()))
with check (
  (select public.is_active_ti())
  and (edited_at is null or edited_by_profile_id = (select auth.uid()))
  and (deleted_at is null or deleted_by_profile_id = (select auth.uid()))
);

drop policy if exists attachments_select_authorized on public.attachments;
create policy attachments_select_authorized on public.attachments
for select to authenticated using (private.can_read_attachment(id));

drop policy if exists attachments_insert_member on public.attachments;
create policy attachments_insert_member on public.attachments
for insert to authenticated with check (private.can_attach_to_message(message_id));

drop policy if exists attachments_update_ti on public.attachments;
create policy attachments_update_ti on public.attachments
for update to authenticated
using ((select public.is_active_ti()))
with check ((select public.is_active_ti()));

drop policy if exists message_reads_select_authorized on public.message_reads;
create policy message_reads_select_authorized on public.message_reads
for select to authenticated
using (private.can_read_message_read(message_id, reader_profile_id));

drop policy if exists message_reads_insert_self on public.message_reads;
create policy message_reads_insert_self on public.message_reads
for insert to authenticated
with check (
  reader_profile_id = (select auth.uid())
  and private.can_read_message(message_id)
);

drop policy if exists security_alerts_select_ti on public.security_alerts;
create policy security_alerts_select_ti on public.security_alerts
for select to authenticated using ((select public.is_active_ti()));

drop policy if exists security_alerts_update_ti on public.security_alerts;
create policy security_alerts_update_ti on public.security_alerts
for update to authenticated
using ((select public.is_active_ti()))
with check (
  (select public.is_active_ti())
  and status = 'closed'
  and reviewed_by_profile_id = (select auth.uid())
  and reviewed_at is not null
);

drop policy if exists detection_rules_select_ti on public.detection_rules;
create policy detection_rules_select_ti on public.detection_rules
for select to authenticated using ((select public.is_active_ti()));
drop policy if exists detection_rules_insert_ti on public.detection_rules;
create policy detection_rules_insert_ti on public.detection_rules
for insert to authenticated with check ((select public.is_active_ti()));
drop policy if exists detection_rules_update_ti on public.detection_rules;
create policy detection_rules_update_ti on public.detection_rules
for update to authenticated using ((select public.is_active_ti()))
with check ((select public.is_active_ti()));
drop policy if exists detection_rules_delete_ti on public.detection_rules;
create policy detection_rules_delete_ti on public.detection_rules
for delete to authenticated using ((select public.is_active_ti()));

drop policy if exists attachment_user_quotas_select_ti on public.attachment_user_quotas;
create policy attachment_user_quotas_select_ti on public.attachment_user_quotas
for select to authenticated using ((select public.is_active_ti()));
drop policy if exists attachment_user_quotas_insert_ti on public.attachment_user_quotas;
create policy attachment_user_quotas_insert_ti on public.attachment_user_quotas
for insert to authenticated with check ((select public.is_active_ti()));
drop policy if exists attachment_user_quotas_update_ti on public.attachment_user_quotas;
create policy attachment_user_quotas_update_ti on public.attachment_user_quotas
for update to authenticated using ((select public.is_active_ti()))
with check ((select public.is_active_ti()));

drop policy if exists attachment_storage_capacity_select_ti on public.attachment_storage_capacity;
create policy attachment_storage_capacity_select_ti on public.attachment_storage_capacity
for select to authenticated using ((select public.is_active_ti()));
drop policy if exists attachment_storage_capacity_insert_ti on public.attachment_storage_capacity;
create policy attachment_storage_capacity_insert_ti on public.attachment_storage_capacity
for insert to authenticated with check ((select public.is_active_ti()));
drop policy if exists attachment_storage_capacity_update_ti on public.attachment_storage_capacity;
create policy attachment_storage_capacity_update_ti on public.attachment_storage_capacity
for update to authenticated using ((select public.is_active_ti()))
with check ((select public.is_active_ti()));
