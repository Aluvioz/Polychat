-- Remove duplicate audit indexes introduced by the retention extension.
-- Keep the original Issue #102 actor/resource indexes.
drop index if exists public.audit_events_actor_time_idx;
drop index if exists public.audit_events_resource_time_idx;
create index if not exists retention_holds_placed_by_profile_idx
  on public.retention_holds(placed_by_profile_id);
create index if not exists retention_holds_released_by_profile_idx
  on public.retention_holds(released_by_profile_id);

drop policy if exists audit_events_delete_retention_ti on public.audit_events;
create policy audit_events_delete_retention_ti on public.audit_events
for delete to authenticated
using (
  (select public.is_active_ti())
  and (select current_setting('app.audit_retention_discard',true))='true'
  and (select current_setting('app.audit_retention_actor',true))=(select auth.uid())::text
);
