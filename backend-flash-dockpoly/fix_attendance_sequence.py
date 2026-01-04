from sqlalchemy import text
from app.core.database import engine

def fix_sequence():
    print("Fixing attendance_records sequence...")
    with engine.connect() as conn:
        # For PostgreSQL
        if engine.dialect.name == 'postgresql':
            # Get the maximum ID from the table
            result = conn.execute(text("SELECT MAX(id) FROM attendance_records"))
            max_id = result.scalar() or 0
            
            # Set the sequence to the next available ID
            conn.execute(
                text(f"SELECT setval('attendance_records_id_seq', {max_id + 1}, false)")
            )
            conn.commit()
            print(f"PostgreSQL sequence set to {max_id + 1}")
        else:
            # For SQLite, we don't need to do anything as it handles autoincrement automatically
            print("No sequence fix needed for SQLite")

if __name__ == "__main__":
    fix_sequence()
