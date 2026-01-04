#!/usr/bin/env python3
"""Test network connectivity to Supabase"""

import socket
import urllib.parse
import psycopg2

def test_network_connectivity():
    host = "db.havvryodllqvnlnhybis.supabase.co"
    port = 5432
    
    print(f"Testing network connectivity to {host}:{port}")
    
    # Test basic TCP connection
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(10)  # 10 second timeout
        result = sock.connect_ex((host, port))
        sock.close()
        
        if result == 0:
            print(f"✅ Network connection to {host}:{port} is successful")
        else:
            print(f"❌ Network connection failed with error code: {result}")
            return False
    except Exception as e:
        print(f"❌ Network test failed: {e}")
        return False
    
    # Test DNS resolution
    try:
        ip = socket.gethostbyname(host)
        print(f"✅ DNS resolution successful: {host} -> {ip}")
    except Exception as e:
        print(f"❌ DNS resolution failed: {e}")
        return False
    
    # Test database connection
    password = "[6%H+7@9V3G/mTvy]"
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database="postgres",
            user="postgres",
            password=password,
            connect_timeout=10
        )
        print("✅ Database connection successful!")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_network_connectivity()
