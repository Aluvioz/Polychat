#!/usr/bin/env bash
set -euo pipefail

# Run only against a dedicated, already migrated test database.
if [[ "${POLYCHAT_TEST_DB_CONFIRM:-}" != "dedicated-test" || -z "${PGHOST:-}" || -z "${PGDATABASE:-}" || -z "${PGUSER:-}" ]]; then
  echo "BLOCKED: configure PGHOST, PGDATABASE, PGUSER and POLYCHAT_TEST_DB_CONFIRM=dedicated-test." >&2
  exit 2
fi
command -v psql >/dev/null || { echo "BLOCKED: psql is not installed." >&2; exit 2; }
export PGCONNECT_TIMEOUT=10
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for file in \
  issue_101_rls.integration.sql \
  issue_101_direct_conversation_creation.sql \
  issue_102_audit_retention.integration.sql \
  issue_102_discard_retention.integration.sql; do
  echo "RUN: $file"
  psql -X --no-password --set=ON_ERROR_STOP=1 --file="$root/supabase/tests/$file"
  echo "PASS: $file"
done
