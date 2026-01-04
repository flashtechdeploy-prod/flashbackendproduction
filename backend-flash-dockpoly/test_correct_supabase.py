#!/usr/bin/env python3
"""Test Supabase connection with correct details"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text
import psycopg2

def test_connection():
    try:
        print(f"Testing connection to: {settings.DATABASE_URL.split('@')[1]}")  # Hide password
        
        # Test direct psycopg2 connection first
        print("\n--- Testing direct psycopg2 connection ---")
        conn = psycopg2.connect(
            host="db.yjaowcmzeegriwxshckl.supabase.co",
            port=5432,
            database="postgres",
            user="postgres",
            password="Ds261wyMO164RQw1",
            connect_timeout=10
        )
        print("✅ Direct psycopg2 connection successful!")
        
        # Test a simple query
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()[0]
        print(f"PostgreSQL version: {version}")
        cursor.close()
        conn.close()
        
        # Test SQLAlchemy connection
        print("\n--- Testing SQLAlchemy connection ---")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ SQLAlchemy connection successful!")
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
            
        print("✅ All tests passed! Supabase connection is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
