-- Issue #117: make unscanned attachments fail closed by default.
-- Existing rows without a scan result become pending and must not be served.
update public.attachments
   set scan_status = 'pending'
 where scan_status is null
    or scan_status not in ('pending', 'clean', 'blocked', 'inconclusive');

alter table public.attachments
  alter column scan_status set default 'pending',
  alter column scan_status set not null;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'attachments_scan_status_check'
       and conrelid = 'public.attachments'::regclass
  ) then
    alter table public.attachments
      add constraint attachments_scan_status_check
      check (scan_status in ('pending', 'clean', 'blocked', 'inconclusive'));
  end if;
end;
$$;

comment on column public.attachments.scan_status is
  'Antimalware workflow state. Only clean is eligible for normal availability; pending, blocked and inconclusive remain unavailable.';
comment on column public.attachments.scan_result is
  'Scanner result code/reason. For the academic demo scanner this is explicitly simulated, not a real malware verdict.';
