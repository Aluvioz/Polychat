-- Issue #107: atomically create or reuse a direct conversation.
-- The function runs with the caller's privileges. Existing RLS policies remain
-- the authorization boundary for both conversation and membership writes.
-- A transaction-scoped advisory lock serializes creation for a canonical pair,
-- avoiding ON CONFLICT's additional RLS/privilege path for authenticated users.

create or replace function public.open_direct_conversation(
  p_other_profile_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor_id uuid := auth.uid();
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_conversation_id uuid := gen_random_uuid();
  v_existing_status text;
begin
  if v_actor_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  if p_other_profile_id is null or p_other_profile_id = v_actor_id then
    raise exception 'A different recipient is required'
      using errcode = '22023';
  end if;

  if not private.is_active_profile(v_actor_id)
     or not private.is_active_profile(p_other_profile_id) then
    raise exception 'Recipient unavailable'
      using errcode = '42501';
  end if;

  v_user_a_id := least(v_actor_id, p_other_profile_id);
  v_user_b_id := greatest(v_actor_id, p_other_profile_id);

  -- Serialize concurrent attempts for this exact pair. The lock is held until
  -- transaction end, including both membership inserts below.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_a_id::text || ':' || v_user_b_id::text, 0)
  );

  -- A current participant can see and reuse their existing direct conversation.
  -- If RLS hides an old/ended conversation, the unique index remains the final
  -- integrity guard and the insert will fail closed rather than duplicate it.
  select c.id, c.status
    into v_conversation_id, v_existing_status
  from public.conversations c
  where c.kind = 'direct'
    and c.direct_user_a_id = v_user_a_id
    and c.direct_user_b_id = v_user_b_id;

  if found then
    if v_existing_status <> 'active' then
      raise exception 'Conversation is not active'
        using errcode = '42501';
    end if;
    return v_conversation_id;
  end if;

  insert into public.conversations (
    id,
    kind,
    created_by_profile_id,
    direct_user_a_id,
    direct_user_b_id
  )
  values (
    v_conversation_id,
    'direct',
    v_actor_id,
    v_user_a_id,
    v_user_b_id
  );

  -- Both membership inserts share this transaction with the conversation.
  -- If either insert is rejected by RLS or a constraint, all writes roll back.
  insert into public.memberships (
    conversation_id,
    profile_id,
    added_by_profile_id
  )
  values
    (v_conversation_id, v_actor_id, v_actor_id),
    (v_conversation_id, p_other_profile_id, v_actor_id);

  return v_conversation_id;
end;
$$;

revoke all on function public.open_direct_conversation(uuid)
  from public, anon;
grant execute on function public.open_direct_conversation(uuid)
  to authenticated;
