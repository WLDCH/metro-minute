FROM python:3.9 

WORKDIR /dbt_metro_minute

RUN apt-get update && \
    apt-get install -y postgresql-client && \
    pip install dbt-core dbt-postgres

COPY ./dbt_metro_minute /dbt_metro_minute/.
COPY ./app/database.sql /dbt_metro_minute/database.sql
COPY ./data /dbt_metro_minute/data

CMD ["sh", "-c", "PGPASSWORD=$DATABASE_PASSWORD psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_NAME -f /dbt_metro_minute/database.sql; dbt run --project-dir /dbt_metro_minute --target gcp"]
