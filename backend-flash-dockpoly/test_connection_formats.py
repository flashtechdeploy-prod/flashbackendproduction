#!/usr/bin/env python3
"""Test different Supabase connection formats"""

import psycopg2
import urllib.parse

def test_connection_formats():
    # Original password
    password = "[6%H+7@9V3G/mTvy]"
    
    # URL encode the password
    encoded_password = urllib.parse.quote(password, safe='')
    print(f"Original password: {password}")
    print(f"URL encoded: {encoded_password}")
    
    # Test different connection formats
    formats = [
        # Format 1: Direct psycopg2 connection
        {
            "host": "db.havvryodllqvnlnhybis.supabase.co",
            "port": 5432,
            "database": "postgres", 
            "user": "postgres",
            "password": password
        },
        # Format 2: With encoded password
        {
            "host": "db.havvryodllqvnlnhybis.supabase.co",
            "port": 5432,
            "database": "postgres",
            "user": "postgres", 
            "password": encoded_password
        }
    ]
    
    for i, params in enumerate(formats, 1):
        print(f"\n--- Testing Format {i} ---")
        try:
            conn = psycopg2.connect(**params)
            print(f"✅ Connected successfully with format {i}!")
            
            # Test a simple query
            cursor = conn.cursor()
            cursor.execute("SELECT version()")
            version = cursor.fetchone()[0]
            print(f"PostgreSQL version: {version}")
            
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            print(f"❌ Format {i} failed: {e}")
    
    return False

if __name__ == "__main__":
    test_connection_formats()
