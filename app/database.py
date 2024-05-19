import psycopg2


def get_db_connection():
    db_params = {
        "host": "localhost",
        "database": "metrominute",
        "user": "postgres",
        "password": "postgres",
        "port": 5432,
    }

    conn = psycopg2.connect(**db_params)

    return conn
