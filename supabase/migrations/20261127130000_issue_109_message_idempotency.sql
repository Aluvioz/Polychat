-- Issue #109: permit the client-generated message UUID used for idempotent retries.
-- The existing primary key on public.messages.id remains the uniqueness authority.
-- RLS policies are unchanged: only an active conversation member may insert as self.
grant insert (id, conversation_id, sender_profile_id, body)
  on table public.messages to authenticated;
