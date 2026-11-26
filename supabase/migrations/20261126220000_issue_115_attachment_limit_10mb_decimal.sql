-- Product limit: 10 MB decimal = exactly 10,000,000 bytes.
-- Correct the existing private bucket without rewriting the historical migration.
-- Keep privacy and MIME allowlist unchanged.
do $$
declare
  v_file_size_limit bigint;
begin
  update storage.buckets
  set file_size_limit = 10000000
  where id = 'attachments';

  if not found then
    raise exception 'attachments bucket must exist before applying the 10 MB limit';
  end if;

  select file_size_limit
  into v_file_size_limit
  from storage.buckets
  where id = 'attachments';

  if v_file_size_limit is distinct from 10000000 then
    raise exception 'attachments bucket must enforce exactly 10 MB decimal (10,000,000 bytes)';
  end if;
end $$;
