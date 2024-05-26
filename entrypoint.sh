#!/bin/sh
set -e

# until pg_isready -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER; do
#     >&2 echo "Postgres is unavailable - sleeping"
#     sleep 1
# done

>&2 echo "Postgres is up - executing SQL init command"

PGPASSWORD=$DATABASE_PASSWORD psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -d "$DATABASE_NAME" -f /metro_minute/app/database.sql

>&2 echo "SQL init command executed"

dbt run --profiles-dir ./dbt_metro_minute/ --project-dir ./dbt_metro_minute/

exec python app/main.py
