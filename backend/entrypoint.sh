#!/bin/sh
set -e

echo "=== Entrypoint: checking DATABASE_URL ==="
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set!"
  echo "Available DB-related env vars:"
  env | grep -i -E "database|postgres|pg" || echo "  (none found)"
else
  echo "DATABASE_URL is set (length: ${#DATABASE_URL})"
fi

echo "=== Running prisma db push ==="
npx prisma db push --accept-data-loss || echo "WARNING: prisma db push failed, continuing..."

echo "=== Running prisma db seed ==="
npx prisma db seed || echo "WARNING: prisma db seed failed, continuing..."

echo "=== Starting application ==="
exec node dist/main
