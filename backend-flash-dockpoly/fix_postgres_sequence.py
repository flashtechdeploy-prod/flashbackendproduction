import os
import urllib.parse

import psycopg2
from dotenv import load_dotenv

def fix_sequence():
    # Load environment variables from .env file
    load_dotenv()
    
    # Get database URL from environment
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("Error: DATABASE_URL not found in environment variables")
        return
    
    conn = None
    try:
        parsed = urllib.parse.urlparse(db_url)

        if parsed.scheme not in ("postgresql", "postgres"):
            raise ValueError(f"Unsupported DATABASE_URL scheme: {parsed.scheme}")

        dbname = (parsed.path or "").lstrip("/")
        if not dbname:
            raise ValueError("DATABASE_URL is missing database name")

        user = urllib.parse.unquote(parsed.username or "")
        password = urllib.parse.unquote(parsed.password or "")
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432

        conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
        conn.autocommit = False
        cur = conn.cursor()

        table_name = "attendance_records"
        pk_column = "id"

        cur.execute(f"SELECT COALESCE(MAX({pk_column}), 0) FROM {table_name}")
        max_id = int(cur.fetchone()[0] or 0)
        next_id = max_id + 1

        # Get the correct sequence name automatically (works even if sequence name differs)
        cur.execute("SELECT pg_get_serial_sequence(%s, %s)", (table_name, pk_column))
        seq_name = cur.fetchone()[0]
        if not seq_name:
            raise ValueError(f"Could not find serial sequence for {table_name}.{pk_column}")

        # Set sequence so that next nextval() returns next_id
        cur.execute("SELECT setval(%s, %s, false)", (seq_name, next_id))

        conn.commit()
        print(f"Successfully set sequence {seq_name} to {next_id}")
    except Exception as e:
        if conn is not None:
            conn.rollback()
        print(f"Error: {e}")
        raise
    finally:
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    fix_sequence()
