-- Issue #115: provision the private Supabase Storage bucket for attachments.
-- Upload/download authorization remains server-side; no client Storage policies
-- are opened by this migration. Trusted server operations use SUPABASE_SECRET_KEY.
insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('attachments', 'attachments', false, 10485760, array['application/pdf', 'image/jpeg'])
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
