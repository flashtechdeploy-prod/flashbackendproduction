#!/usr/bin/env python3
"""Check what data exists in the flash database"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text, inspect
from sqlalchemy.exc import SQLAlchemyError

def check_database_data():
    try:
        print(f"Checking database: {settings.DATABASE_URL.split('@')[1]}")  # Hide password
        
        with engine.connect() as connection:
            # Get all tables
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            print(f"\n📊 Database Overview:")
            print(f"Total tables found: {len(tables)}")
            
            if not tables:
                print("❌ No tables found in the database")
                return
            
            print(f"\n📋 Tables in database:")
            for table in sorted(tables):
                print(f"  - {table}")
            
            # Check each table for data
            print(f"\n🔍 Table Data Summary:")
            for table in sorted(tables):
                try:
                    result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.fetchone()[0]
                    
                    if count > 0:
                        print(f"  ✅ {table}: {count} rows")
                        
                        # Show sample data for tables with data
                        if count <= 5:  # Show all data if small
                            sample_result = connection.execute(text(f"SELECT * FROM {table} LIMIT 5"))
                            columns = [col[0] for col in sample_result.cursor.description]
                            rows = sample_result.fetchall()
                            
                            print(f"    Columns: {', '.join(columns)}")
                            for i, row in enumerate(rows, 1):
                                print(f"    Row {i}: {row}")
                        else:  # Just show sample for larger tables
                            sample_result = connection.execute(text(f"SELECT * FROM {table} LIMIT 3"))
                            columns = [col[0] for col in sample_result.cursor.description]
                            rows = sample_result.fetchall()
                            
                            print(f"    Columns: {', '.join(columns)}")
                            print(f"    Sample data (showing 3 of {count} rows):")
                            for i, row in enumerate(rows, 1):
                                print(f"      {i}: {row}")
                    else:
                        print(f"  ⚪ {table}: 0 rows (empty)")
                        
                except SQLAlchemyError as e:
                    print(f"  ❌ {table}: Error checking data - {e}")
            
            print(f"\n✅ Database check completed!")
            
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")

if __name__ == "__main__":
    check_database_data()
