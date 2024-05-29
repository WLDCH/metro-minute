FROM python:3.9 as builder

# Installer les dépendances nécessaires pour psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


RUN pip install poetry==1.8.3

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /metro_minute

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-dev --no-root && rm -rf $POETRY_CACHE_DIR

FROM python:3.9-slim as runtime

RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/metro_minute/.venv \
    PATH=/metro_minute/.venv/bin:$PATH \
    DATABASE_HOST=${DATABASE_HOST} \
    DATABASE_USER=${DATABASE_USER} \
    DATABASE_PASSWORD=${DATABASE_PASSWORD} \
    DATABASE_PORT=${DATABASE_PORT} \
    API_TOKEN=${API_TOKEN} \
    PORT=${PORT}

WORKDIR /metro_minute

COPY --from=builder /metro_minute/.venv /metro_minute/.venv

COPY ./dbt_metro_minute ./dbt_metro_minute
COPY ./data ./data
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

COPY ./app ./app

EXPOSE 8000

ENTRYPOINT ["python", "app/main.py"]
