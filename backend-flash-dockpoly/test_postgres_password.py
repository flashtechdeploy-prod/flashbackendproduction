#!/usr/bin/env python3
"""Test different PostgreSQL passwords"""

import psycopg2

def test_passwords():
    host = "localhost"
    port = 5432
    user = "postgres"
    database = "postgres"
    
    # Common passwords to try
    passwords = [
        "postgres",
        "password", 
        "admin",
        "root",
        "123456",
        "",  # Empty password
        "PostgreSQL",
        "postgres123"
    ]
    
    for password in passwords:
        try:
            print(f"Testing password: '{password}'")
            conn = psycopg2.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                database=database
            )
            print(f"✅ SUCCESS! Password is: '{password}'")
            
            # Test creating flash_erp database
            conn.autocommit = True
            cursor = conn.cursor()
            cursor.execute("CREATE DATABASE flash_erp;")
            print("✅ Database 'flash_erp' created successfully!")
            
            cursor.close()
            conn.close()
            return password
            
        except psycopg2.OperationalError as e:
            if "password authentication failed" in str(e):
                print(f"❌ Password '{password}' failed")
            else:
                print(f"❌ Other error with '{password}': {e}")
        except Exception as e:
            if "database \"flash_erp\" already exists" in str(e):
                print(f"✅ Password '{password}' works! Database already exists.")
                return password
            else:
                print(f"❌ Error with '{password}': {e}")
    
    print("\n❌ None of the common passwords worked.")
    print("You need to recall your PostgreSQL installation password.")
    return None

if __name__ == "__main__":
    password = test_passwords()
    if password:
        print(f"\n🎉 Your PostgreSQL password is: '{password}'")
        print("Your configuration is ready to use!")
    else:
        print("\n❌ Please check your PostgreSQL installation or reset the password.")
