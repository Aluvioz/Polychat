-- Issue #107: recent conversations and unread counters.
-- SECURITY INVOKER keeps the caller's existing table grants and RLS policies
-- as the authorization boundary. No profile-directory access is introduced.

create or replace function public.list_recent_conversations()
returns table (
  conversation_id uuid,
  conversation_kind text,
  conversation_name text,
  last_message_id uuid,
  last_message_body text,
  last_message_at timestamptz,
  last_message_sender_id uuid,
  last_message_deleted boolean,
  unread_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    c.id as conversation_id,
    c.kind as conversation_kind,
    c.name as conversation_name,
    latest.id as last_message_id,
    case
      when latest.deleted_at is not null then null
      else latest.body
    end as last_message_body,
    latest.created_at as last_message_at,
    latest.sender_profile_id as last_message_sender_id,
    (latest.deleted_at is not null) as last_message_deleted,
    coalesce(unread.total, 0)::bigint as unread_count
  from public.conversations c
  join public.memberships own_membership
    on own_membership.conversation_id = c.id
   and own_membership.profile_id = (select auth.uid())
   and own_membership.ended_at is null
  left join lateral (
    select
      m.id,
      m.body,
      m.created_at,
      m.sender_profile_id,
      m.deleted_at
    from public.messages m
    where m.conversation_id = c.id
    order by m.created_at desc, m.id desc
    limit 1
  ) latest on true
  left join lateral (
    select count(*)::bigint as total
    from public.messages m
    where m.conversation_id = c.id
      and m.sender_profile_id <> (select auth.uid())
      and m.deleted_at is null
      and m.created_at >= own_membership.joined_at
      and not exists (
        select 1
        from public.message_reads mr
        where mr.message_id = m.id
          and mr.reader_profile_id = (select auth.uid())
      )
  ) unread on true
  where c.status <> 'closed'
  order by latest.created_at desc nulls last, c.created_at desc, c.id;
$$;

revoke all on function public.list_recent_conversations()
  from public, anon;
grant execute on function public.list_recent_conversations()
  to authenticated;
