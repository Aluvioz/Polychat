-- Issue #115: read-only verification of the private attachment bucket.
do $$
declare
  v_bucket storage.buckets%rowtype;
  v_policy_count integer;
begin
  select * into v_bucket from storage.buckets where id='attachments';
  if not found then raise exception 'attachments bucket missing'; end if;
  if v_bucket.public is distinct from false then
    raise exception 'attachments bucket must be private';
  end if;
  if v_bucket.file_size_limit is distinct from 10000000 then
    raise exception 'attachments bucket must enforce the 10 MB decimal limit (10,000,000 bytes)';
  end if;
  if v_bucket.allowed_mime_types is distinct from array['application/pdf','image/jpeg']::text[] then
    raise exception 'attachments bucket must allow only PDF and JPEG MIME types';
  end if;
  select count(*) into v_policy_count
  from pg_policies
  where schemaname='storage' and tablename='objects';
  if v_policy_count <> 0 then
    raise exception 'Unexpected Storage object policy exists; review server-only access assumptions';
  end if;
end $$;
