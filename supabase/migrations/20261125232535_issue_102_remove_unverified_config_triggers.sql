-- The initial config-table trigger path did not pass actor-attribution validation.
-- Remove it until the settings handlers can supply a verified authenticated actor.
drop trigger if exists detection_rules_audit_changes on public.detection_rules;
drop trigger if exists attachment_user_quotas_audit_changes on public.attachment_user_quotas;
drop function if exists public.audit_configuration_change();
