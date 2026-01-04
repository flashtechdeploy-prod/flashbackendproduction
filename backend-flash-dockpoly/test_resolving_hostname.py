#!/usr/bin/env python3
"""Test connection with the resolving hostname"""

import psycopg2

def test_resolving_hostname():
    try:
        print("Testing connection to yjaowcmzeegriwxshckl.supabase.co:5432")
        
        conn = psycopg2.connect(
            host="yjaowcmzeegriwxshckl.supabase.co",
            port=5432,
            database="postgres",
            user="postgres",
            password="Ds261wyMO164RQw1",
            connect_timeout=15  # Longer timeout
        )
        print("✅ Connection successful!")
        
        # Test a simple query
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()[0]
        print(f"PostgreSQL version: {version}")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.OperationalError as e:
        if "timeout expired" in str(e):
            print("❌ Connection timed out. This could mean:")
            print("   - Database is paused/suspended")
            print("   - PostgreSQL is not enabled for this project")
            print("   - Network/firewall issues")
            print("   - Incorrect connection details")
        else:
            print(f"❌ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_resolving_hostname()
