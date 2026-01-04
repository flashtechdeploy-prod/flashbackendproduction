#!/usr/bin/env python3
"""
Startup script for the FastAPI application.
This script handles database connection gracefully and starts the server.
"""
import os
import sys
import time

# Add the app directory to Python path
sys.path.insert(0, '/app')

def check_database_connection(max_retries=5, retry_delay=5):
    """Check database connection with retries."""
    try:
        from sqlalchemy import text
        from app.core.database import engine
    except ImportError as e:
        print(f"❌ Failed to import required modules: {e}")
        print("Make sure all dependencies are installed")
        return False
    
    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
        except Exception as e:
            print(f"❌ Database connection attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("❌ Failed to connect to database after all retries")
                return False

if __name__ == "__main__":
    print("🚀 Starting Flash ERP Backend...")
    
    # Check database connection
    if not check_database_connection():
        print("❌ Cannot start without database connection")
        sys.exit(1)
    
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", "8000"))
    
    print(f"🌐 Starting server on port {port}")
    
    try:
        import uvicorn
        from app.main import app
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
    except ImportError as e:
        print(f"❌ Failed to import application: {e}")
        sys.exit(1)
