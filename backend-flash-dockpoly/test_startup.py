#!/usr/bin/env python3
"""
Simple startup script to test if the app starts without database dependency
"""
import os
import sys

# Add the app directory to Python path
sys.path.insert(0, '/app')

if __name__ == "__main__":
    print("🚀 Testing Flash ERP Backend startup...")
    
    try:
        # Test basic imports
        from fastapi import FastAPI
        print("✅ FastAPI imported successfully")
        
        # Try to import the app
        from app.main import app
        print("✅ App imported successfully")
        
        # Get port from environment
        port = int(os.getenv("PORT", "8000"))
        print(f"🌐 Starting server on port {port}")
        
        # Start uvicorn
        import uvicorn
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Startup error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
