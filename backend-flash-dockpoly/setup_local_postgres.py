#!/usr/bin/env python3
"""Setup local PostgreSQL database for Flash ERP"""

import psycopg2
import sys
import os

def setup_database():
    """Create the flash_erp database and test connection"""
    
    # Connection parameters for default postgres database
    default_conn_params = {
        'host': 'localhost',
        'port': 5432,
        'user': 'postgres',
        'password': 'postgres',
        'database': 'postgres'  # Connect to default database first
    }
    
    try:
        print("Step 1: Connecting to PostgreSQL...")
        conn = psycopg2.connect(**default_conn_params)
        conn.autocommit = True  # Required for CREATE DATABASE
        cursor = conn.cursor()
        print("✅ Connected to PostgreSQL successfully!")
        
        print("Step 2: Creating flash_erp database...")
        cursor.execute("CREATE DATABASE flash_erp;")
        print("✅ Database 'flash_erp' created successfully!")
        
        cursor.close()
        conn.close()
        
        print("Step 3: Testing connection to flash_erp database...")
        flash_erp_params = default_conn_params.copy()
        flash_erp_params['database'] = 'flash_erp'
        
        conn = psycopg2.connect(**flash_erp_params)
        cursor = conn.cursor()
        
        # Test basic operations
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"✅ Connected to flash_erp database!")
        print(f"PostgreSQL version: {version}")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Local PostgreSQL setup completed successfully!")
        return True
        
    except psycopg2.OperationalError as e:
        if "could not connect" in str(e):
            print("❌ Cannot connect to PostgreSQL server.")
            print("Please ensure:")
            print("1. PostgreSQL is installed and running")
            print("2. PostgreSQL service is started")
            print("3. Username/password are correct (default: postgres/postgres)")
            print("4. Port 5432 is available")
        elif "database \"flash_erp\" already exists" in str(e):
            print("✅ Database 'flash_erp' already exists. Testing connection...")
            # Test existing database
            flash_erp_params = default_conn_params.copy()
            flash_erp_params['database'] = 'flash_erp'
            conn = psycopg2.connect(**flash_erp_params)
            print("✅ Connected to existing flash_erp database!")
            conn.close()
            return True
        else:
            print(f"❌ Operational error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = setup_database()
    if success:
        print("\n🎉 Your local PostgreSQL is ready for Flash ERP!")
        print("You can now run your FastAPI application.")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")
        sys.exit(1)
