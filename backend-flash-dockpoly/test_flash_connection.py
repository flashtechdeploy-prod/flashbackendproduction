#!/usr/bin/env python3
"""Test connection to flash database"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text

def test_flash_connection():
    try:
        print(f"Testing connection to: {settings.DATABASE_URL.split('@')[1]}")  # Hide password
        
        # Test SQLAlchemy connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version}")
            
            # Test if we can create a simple table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS connection_test (
                    id SERIAL PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Test insert
            connection.execute(text("""
                INSERT INTO connection_test DEFAULT VALUES
            """))
            
            # Test select
            result = connection.execute(text("SELECT COUNT(*) FROM connection_test"))
            count = result.fetchone()[0]
            print(f"✅ Database operations working! Test table has {count} rows")
            
            # Clean up
            connection.execute(text("DROP TABLE IF EXISTS connection_test"))
            connection.commit()
            
        print("✅ All tests passed! Your local PostgreSQL connection is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_flash_connection()
    if success:
        print("\n🎉 Your Flash ERP backend is ready to use!")
        print("You can now run: uvicorn app.main:app --reload")
    else:
        print("\n❌ Please check your PostgreSQL password or connection settings.")
