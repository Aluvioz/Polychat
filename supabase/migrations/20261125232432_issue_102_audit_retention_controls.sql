-- Issue #102: generic TI audit trail, investigation holds and controlled audit disposal.
-- The table is created idempotently because the development database already
-- contains an earlier instance; this migration also makes a clean main install reproducible.

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null,
  resource_type text not null,
  resource_id uuid,
  occurred_at timestamptz not null default clock_timestamp(),
  outcome text not null,
  metadata jsonb not null default '{}'::jsonb
);
alter table public.audit_events enable row level security;
alter table public.audit_events drop constraint if exists audit_events_event_type_check;
alter table public.audit_events add constraint audit_events_event_type_check check (event_type in (
  'admin_login','account_created','account_updated','account_deactivated','account_reactivated',
  'group_created','group_closed','group_activated','group_deactivated','participant_added','participant_removed',
  'conversation_viewed','alert_reviewed','alert_closed','attachment_downloaded','attachment_released',
  'conversation_exported','message_admin_edited','message_admin_deleted','configuration_changed','retention_discarded',
  'retention_hold_placed','retention_hold_released'
));
alter table public.audit_events drop constraint if exists audit_events_resource_type_check;
alter table public.audit_events add constraint audit_events_resource_type_check check (
  resource_type in ('session','account','group','membership','conversation','alert','attachment','message','configuration','retention')
);
alter table public.audit_events drop constraint if exists audit_events_resource_id_required;
alter table public.audit_events add constraint audit_events_resource_id_required check (event_type='admin_login' or resource_id is not null);
alter table public.audit_events drop constraint if exists audit_events_resource_matches_event;
alter table public.audit_events add constraint audit_events_resource_matches_event check (
  (event_type='admin_login' and resource_type='session')
  or (event_type in ('account_created','account_updated','account_deactivated','account_reactivated') and resource_type='account')
  or (event_type in ('group_created','group_closed','group_activated','group_deactivated') and resource_type='group')
  or (event_type in ('participant_added','participant_removed') and resource_type='membership')
  or (event_type in ('conversation_viewed','conversation_exported') and resource_type='conversation')
  or (event_type in ('alert_reviewed','alert_closed') and resource_type='alert')
  or (event_type in ('attachment_downloaded','attachment_released') and resource_type='attachment')
  or (event_type in ('message_admin_edited','message_admin_deleted') and resource_type='message')
  or (event_type='configuration_changed' and resource_type='configuration')
  or (event_type in ('retention_discarded','retention_hold_placed','retention_hold_released') and resource_type='retention')
);
alter table public.audit_events drop constraint if exists audit_events_metadata_check;
alter table public.audit_events add constraint audit_events_metadata_check check (jsonb_typeof(metadata)='object');
alter table public.audit_events drop constraint if exists audit_events_outcome_check;
alter table public.audit_events add constraint audit_events_outcome_check check (length(btrim(outcome))>0);

create index if not exists audit_events_actor_time_idx
  on public.audit_events(actor_profile_id,occurred_at desc);
create index if not exists audit_events_resource_time_idx
  on public.audit_events(resource_type,resource_id,occurred_at desc);

create or replace function public.audit_metadata_has_sensitive_keys(p_value jsonb)
returns boolean language plpgsql immutable set search_path=''
as $$
declare item record;
begin
 if jsonb_typeof(p_value)='object' then
  for item in select key,value from jsonb_each(p_value) loop
   if lower(item.key) in ('body','content','text','message','conversation')
    or lower(item.key) ~ '(^|_)(password|passwd|token|secret|credential|authorization|cookie|api_key|private_key|service_role|access_key|refresh_token|message_body|conversation_body|content_body)(_|$)' then return true; end if;
   if public.audit_metadata_has_sensitive_keys(item.value) then return true; end if;
  end loop;
 elsif jsonb_typeof(p_value)='array' then
  for item in select value from jsonb_array_elements(p_value) loop
   if public.audit_metadata_has_sensitive_keys(item.value) then return true; end if;
  end loop;
 end if;
 return false;
end;
$$;

create or replace function public.guard_audit_event_insert()
returns trigger language plpgsql set search_path=''
as $$
begin
 if new.actor_profile_id is distinct from (select auth.uid()) or not (select public.is_active_ti()) then
  raise exception 'Only the active TI operator may write audit events' using errcode='42501';
 end if;
 if public.audit_metadata_has_sensitive_keys(new.metadata) then
  raise exception 'Audit metadata contains a prohibited sensitive key' using errcode='22023';
 end if;
 new.occurred_at := clock_timestamp();
 return new;
end;
$$;

create or replace function public.reject_audit_event_mutation()
returns trigger language plpgsql set search_path=''
as $$
begin
 if tg_op='DELETE'
  and current_setting('app.audit_retention_discard',true)='true'
  and current_setting('app.audit_retention_actor',true)=(select auth.uid())::text
  and (select public.is_active_ti()) then
  return old;
 end if;
 raise exception 'Audit events are append-only except for the controlled TI retention procedure' using errcode='42501';
end;
$$;

drop trigger if exists audit_events_guard_insert on public.audit_events;
create trigger audit_events_guard_insert before insert on public.audit_events
for each row execute function public.guard_audit_event_insert();
drop trigger if exists audit_events_reject_update_delete on public.audit_events;
create trigger audit_events_reject_update_delete before update or delete on public.audit_events
for each row execute function public.reject_audit_event_mutation();
drop trigger if exists audit_events_reject_truncate on public.audit_events;
create trigger audit_events_reject_truncate before truncate on public.audit_events
for each statement execute function public.reject_audit_event_mutation();

drop policy if exists audit_events_insert_active_ti on public.audit_events;
create policy audit_events_insert_active_ti on public.audit_events
for insert to authenticated
with check (actor_profile_id=(select auth.uid()) and (select public.is_active_ti()));
drop policy if exists audit_events_select_active_ti on public.audit_events;
create policy audit_events_select_active_ti on public.audit_events
for select to authenticated using ((select public.is_active_ti()));
revoke all on table public.audit_events from public,anon,authenticated;
grant select,insert on table public.audit_events to authenticated;

create table if not exists public.retention_holds (
 id uuid primary key default gen_random_uuid(),
 resource_type text not null check (resource_type in (
  'session','account','group','membership','conversation','alert','attachment','message',
  'configuration','audit_event','privileged_action_audit'
 )),
 resource_id uuid not null,
 placed_by_profile_id uuid not null references public.profiles(id) on delete restrict,
 placed_at timestamptz not null default clock_timestamp(),
 released_by_profile_id uuid references public.profiles(id) on delete restrict,
 released_at timestamptz,
 constraint retention_holds_release_consistency check (
  (released_by_profile_id is null and released_at is null)
  or (released_by_profile_id is not null and released_at is not null)
 )
);
create unique index if not exists retention_holds_one_active_resource_idx
  on public.retention_holds(resource_type,resource_id) where released_at is null;
alter table public.retention_holds enable row level security;
revoke all on table public.retention_holds from public,anon,authenticated;
grant select on table public.retention_holds to authenticated;
grant insert (resource_type,resource_id,placed_by_profile_id)
  on table public.retention_holds to authenticated;
grant update (released_by_profile_id,released_at)
  on table public.retention_holds to authenticated;

drop policy if exists retention_holds_select_ti on public.retention_holds;
create policy retention_holds_select_ti on public.retention_holds
for select to authenticated using ((select public.is_active_ti()));
drop policy if exists retention_holds_insert_ti on public.retention_holds;
create policy retention_holds_insert_ti on public.retention_holds
for insert to authenticated
with check (
  (select public.is_active_ti())
  and placed_by_profile_id=(select auth.uid())
  and released_by_profile_id is null
  and released_at is null
);
drop policy if exists retention_holds_release_ti on public.retention_holds;
create policy retention_holds_release_ti on public.retention_holds
for update to authenticated
using ((select public.is_active_ti()) and released_at is null)
with check (
  (select public.is_active_ti())
  and released_at is not null
  and released_by_profile_id=(select auth.uid())
);

create or replace function public.reject_retention_hold_deletion()
returns trigger language plpgsql set search_path=''
as $$ begin raise exception 'Retention hold records cannot be deleted' using errcode='42501'; end; $$;
drop trigger if exists retention_holds_reject_delete on public.retention_holds;
create trigger retention_holds_reject_delete before delete or truncate on public.retention_holds
for each statement execute function public.reject_retention_hold_deletion();

create or replace function public.audit_message_admin_mutation()
returns trigger language plpgsql set search_path=''
as $$
begin
 if new.body is distinct from old.body then
  if new.edited_at is null or new.edited_by_profile_id is distinct from (select auth.uid()) then
   raise exception 'Message edit must identify the active TI actor' using errcode='42501';
  end if;
  insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
  values ((select auth.uid()),'message_admin_edited','message',new.id,'success',jsonb_build_object('operation','edit'));
 end if;
 if old.deleted_at is null and new.deleted_at is not null then
  if new.deleted_by_profile_id is distinct from (select auth.uid()) then
   raise exception 'Message deletion must identify the active TI actor' using errcode='42501';
  end if;
  insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
  values ((select auth.uid()),'message_admin_deleted','message',new.id,'success',jsonb_build_object('operation','soft_delete'));
 end if;
 return new;
end;
$$;
drop trigger if exists messages_audit_admin_mutation on public.messages;
create trigger messages_audit_admin_mutation after update on public.messages
for each row execute function public.audit_message_admin_mutation();

create or replace function public.audit_security_alert_closure()
returns trigger language plpgsql set search_path=''
as $$
begin
 if old.status is distinct from new.status and new.status='closed' then
  if new.reviewed_by_profile_id is distinct from (select auth.uid()) or new.reviewed_at is null then
   raise exception 'Alert closure must identify the active TI actor' using errcode='42501';
  end if;
  insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
  values ((select auth.uid()),'alert_closed','alert',new.id,'success',jsonb_build_object('severity',new.severity));
 end if;
 return new;
end;
$$;
drop trigger if exists security_alerts_audit_closure on public.security_alerts;
create trigger security_alerts_audit_closure after update on public.security_alerts
for each row execute function public.audit_security_alert_closure();

create or replace function public.audit_configuration_change()
returns trigger language plpgsql set search_path=''
as $
declare v_id uuid; v_operation text;
begin
 if tg_op='DELETE' then v_id:=old.id; v_operation:='delete';
 elsif tg_table_name='attachment_user_quotas' then v_id:=new.profile_id; v_operation:=lower(tg_op);
 else v_id:=coalesce(new.id,old.id); v_operation:=lower(tg_op);
 end if;
 insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
 values ((select auth.uid()),'configuration_changed','configuration',v_id,'success',
  jsonb_build_object('entity',tg_table_name,'operation',v_operation));
 if tg_op='DELETE' then return old; end if;
 return new;
end;
$;
drop trigger if exists detection_rules_audit_changes on public.detection_rules;
create trigger detection_rules_audit_changes after insert or update or delete on public.detection_rules
for each row execute function public.audit_configuration_change();
drop trigger if exists attachment_user_quotas_audit_changes on public.attachment_user_quotas;
create trigger attachment_user_quotas_audit_changes after insert or update on public.attachment_user_quotas
for each row execute function public.audit_configuration_change();


create or replace function public.audit_retention_hold_change()
returns trigger language plpgsql set search_path=''
as $$
declare v_event_type text;
begin
 if tg_op='INSERT' then v_event_type:='retention_hold_placed';
 elsif old.released_at is null and new.released_at is not null then v_event_type:='retention_hold_released';
 else return new;
 end if;
 insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
 values (
  (select auth.uid()),v_event_type,'retention',new.id,'success',
  jsonb_build_object('target_resource_type',new.resource_type,'target_resource_id',new.resource_id)
 );
 return new;
end;
$$;
drop trigger if exists retention_holds_audit_changes on public.retention_holds;
create trigger retention_holds_audit_changes after insert or update on public.retention_holds
for each row execute function public.audit_retention_hold_change();

create or replace function public.discard_audit_event(p_audit_event_id uuid)
returns uuid language plpgsql security definer set search_path=''
as $$
declare v_event_type text;
begin
 if (select auth.uid()) is null or not (select public.is_active_ti()) then
  raise exception 'Only active TI can authorize audit event disposal' using errcode='42501';
 end if;
 select event_type into v_event_type from public.audit_events where id=p_audit_event_id for update;
 if not found then raise exception 'Audit event not found' using errcode='22023'; end if;
 if v_event_type in ('retention_discarded','retention_hold_placed','retention_hold_released') then
  raise exception 'Retention control events cannot be discarded' using errcode='42501';
 end if;
 if exists (
  select 1 from public.retention_holds h
  where h.resource_type='audit_event' and h.resource_id=p_audit_event_id and h.released_at is null
 ) then raise exception 'Audit event is protected by an active retention hold' using errcode='42501'; end if;
 insert into public.audit_events(actor_profile_id,event_type,resource_type,resource_id,outcome,metadata)
 values ((select auth.uid()),'retention_discarded','retention',p_audit_event_id,'success',
  jsonb_build_object('target_type','audit_event'));
 perform pg_catalog.set_config('app.audit_retention_discard','true',true);
 perform pg_catalog.set_config('app.audit_retention_actor',(select auth.uid())::text,true);
 delete from public.audit_events where id=p_audit_event_id;
 return p_audit_event_id;
end;
$$;
revoke all on function public.discard_audit_event(uuid) from public,anon;
grant execute on function public.discard_audit_event(uuid) to authenticated;
