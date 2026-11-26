#!/usr/bin/env bash
set -euo pipefail

blocked() { echo "BLOCKED: $*" >&2; exit 2; }

# The marker must be provisioned by the database owner, only on an isolated
# test database. It is an identity label, not a password or authorization.
[[ "${POLYCHAT_TEST_DB_CONFIRM:-}" == "dedicated-test" ]] || blocked "explicit dedicated-test confirmation required."
[[ "${POLYCHAT_TEST_DB_ID:-}" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]] || blocked "configure the dedicated database UUID."
[[ "${PGHOST:-}" =~ ^[a-zA-Z0-9.-]+$ && "${PGDATABASE:-}" =~ ^[a-zA-Z0-9_-]+$ && "${PGUSER:-}" =~ ^[a-zA-Z0-9_.-]+$ ]] || blocked "configure one explicit host, database and role."
[[ "${PGPORT:-5432}" =~ ^[0-9]+$ ]] || blocked "invalid port."
[[ -z "${PGHOSTADDR:-}" && -z "${PGSERVICE:-}" && -z "${PGOPTIONS:-}" ]] || blocked "connection overrides are not allowed."
command -v psql >/dev/null || blocked "psql is not installed."
export PGCONNECT_TIMEOUT=10
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Recheck server-side identity in the exact session that runs each fixture.
# -X disables startup scripts; ON_ERROR_STOP prevents the subsequent -f on error.
for file in \
  issue_101_rls.integration.sql \
  issue_101_direct_conversation_creation.sql \
  issue_102_audit_retention.integration.sql \
  issue_102_discard_retention.integration.sql; do
  echo "CHECK: dedicated database identity before $file"
  psql -X --no-password --host="$PGHOST" --port="${PGPORT:-5432}" \
    --dbname="$PGDATABASE" --username="$PGUSER" --set=ON_ERROR_STOP=1 \
    --set=expected_db="$PGDATABASE" --set=expected_role="$PGUSER" \
    --set=expected_marker="polychat-dedicated-test:$POLYCHAT_TEST_DB_ID" \
    --file=- --file="$root/supabase/tests/$file" <<'SQL'
SELECT (
  current_database() = :'expected_db'
  AND session_user = :'expected_role'
  AND coalesce(pg_catalog.shobj_description(oid, 'pg_database'), '') = :'expected_marker'
) AS dedicated_ok
FROM pg_catalog.pg_database
WHERE datname = current_database()
\gset
\if :dedicated_ok
  \echo VERIFIED: server-side dedicated database marker
\else
  DO $$ BEGIN RAISE EXCEPTION 'BLOCKED: database identity does not match dedicated test marker'; END $$;
\endif
SQL
  echo "PASS: $file"
done
