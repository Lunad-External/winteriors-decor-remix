#!/usr/bin/env bash
# Apply database changes in db/migrations/*.sql that have not run yet, in file-name order.
# Run by .github/workflows/deploy.yml on the server before the new code starts; safe to run by hand.
# Each file runs in its own transaction together with its record in schema_migrations,
# so a failing file changes nothing and is retried on the next deploy.
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE="${ENV_FILE:-$HOME/.config/winteriors/app.env}"
URL=$(grep -E '^DB_Connection=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"')
[ -n "$URL" ] || { echo "migrate: DB_Connection not found in $ENV_FILE" >&2; exit 1; }
db() { psql "$URL" -v ON_ERROR_STOP=1 -q -X "$@"; }

db -c "CREATE TABLE IF NOT EXISTS public.schema_migrations (filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())"

pending=()
for f in db/migrations/*.sql; do
  [ -e "$f" ] || continue
  name=$(basename "$f")
  [[ "$name" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "migrate: unsafe file name $name" >&2; exit 1; }
  [ "$(db -tAc "SELECT 1 FROM public.schema_migrations WHERE filename = '$name'")" = "1" ] || pending+=("$f")
done

if [ ${#pending[@]} -eq 0 ]; then
  echo "migrate: database is up to date"
  exit 0
fi

BACKUP="${BACKUP_CMD:-$HOME/backups/backup-db.sh}"
if [ -x "$BACKUP" ]; then
  echo "migrate: ${#pending[@]} change(s) to apply; backing up first"
  "$BACKUP"
else
  echo "migrate: WARNING no backup script at $BACKUP; applying without a fresh backup"
fi

for f in "${pending[@]}"; do
  name=$(basename "$f")
  echo "migrate: applying $name"
  db --single-transaction -f "$f" -c "INSERT INTO public.schema_migrations (filename) VALUES ('$name')"
done
echo "migrate: done"
