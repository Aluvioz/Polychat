-- Direct conversation creators provide a client-generated UUID. The row is
-- not visible through SELECT until its membership records are created, so
-- INSERT ... RETURNING is intentionally not required by the client flow.
grant insert (id) on table public.conversations to authenticated;
