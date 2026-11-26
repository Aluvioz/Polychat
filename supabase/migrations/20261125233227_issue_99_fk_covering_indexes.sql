-- Issue #99: add covering indexes for foreign keys identified by the
-- Supabase Performance Advisor on 2026-11-25.
-- Additive only; does not alter already-applied migrations or migration history.

create index if not exists conversations_direct_user_b_idx
  on public.conversations (direct_user_b_id);

create index if not exists memberships_added_by_profile_idx
  on public.memberships (added_by_profile_id);

create index if not exists memberships_ended_by_profile_idx
  on public.memberships (ended_by_profile_id);

create index if not exists messages_edited_by_profile_idx
  on public.messages (edited_by_profile_id);

create index if not exists messages_deleted_by_profile_idx
  on public.messages (deleted_by_profile_id);

create index if not exists security_alerts_reviewed_by_profile_idx
  on public.security_alerts (reviewed_by_profile_id);
