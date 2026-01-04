#!/usr/bin/env python3
"""Test different Supabase hostname formats"""

import socket
import psycopg2

def test_hostname_formats():
    project_id = "yjaowcmzeegriwxshckl"
    password = "Ds261wyMO164RQw1"
    
    # Different possible hostname formats
    hostnames = [
        f"db.{project_id}.supabase.co",
        f"{project_id}.db.supabase.co", 
        f"{project_id}.supabase.co",
        f"postgres.{project_id}.supabase.co"
    ]
    
    for hostname in hostnames:
        print(f"\n--- Testing hostname: {hostname} ---")
        
        # Test DNS resolution first
        try:
            ip = socket.gethostbyname(hostname)
            print(f"✅ DNS resolution successful: {hostname} -> {ip}")
            
            # Test database connection
            conn = psycopg2.connect(
                host=hostname,
                port=5432,
                database="postgres",
                user="postgres",
                password=password,
                connect_timeout=10
            )
            print(f"✅ Database connection successful to {hostname}!")
            
            # Test a simple query
            cursor = conn.cursor()
            cursor.execute("SELECT version()")
            version = cursor.fetchone()[0]
            print(f"PostgreSQL version: {version}")
            
            cursor.close()
            conn.close()
            return True, hostname
            
        except socket.gaierror as e:
            print(f"❌ DNS resolution failed: {e}")
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
    
    return False, None

if __name__ == "__main__":
    success, working_hostname = test_hostname_formats()
    if success:
        print(f"\n✅ SUCCESS! Working hostname: {working_hostname}")
    else:
        print("\n❌ No working hostname found. Please verify your Supabase project details.")
