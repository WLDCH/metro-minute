import os

import psycopg2


def get_db_connection():
    db_params = {
        "host": os.getenv("DATABASE_HOST", "localhost"),
        "database": os.getenv("DATABASE_NAME", "metrominute"),
        "user": os.getenv("DATABASE_USER", "postgres"),
        "password": os.getenv("DATABASE_PASSWORD", "postgres"),
        "port": os.getenv("DATABASE_PORT", 5432),
    }

    conn = psycopg2.connect(**db_params)

    return conn
