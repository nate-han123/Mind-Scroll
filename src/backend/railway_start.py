#!/usr/bin/env python3
"""
Railway-specific startup script for Mindscroll backend
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    """Start the FastAPI application for Railway deployment"""
    print("🚀 Starting Mindscroll backend on Railway...")
    
    # Set environment variables
    port = os.getenv('PORT', '8000')
    host = '0.0.0.0'
    
    print(f"📡 Starting server on {host}:{port}")
    
    # Start uvicorn server
    try:
        subprocess.run([
            sys.executable, '-m', 'uvicorn',
            'main:app',
            '--host', host,
            '--port', port,
            '--workers', '1'
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("🛑 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()
