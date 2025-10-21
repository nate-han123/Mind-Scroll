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
    
    # Check environment variables
    openai_key = os.getenv('OPENAI_API_KEY')
    youtube_key = os.getenv('YOUTUBE_API_KEY')
    
    if not openai_key:
        print("⚠️  Warning: OPENAI_API_KEY not set - AI features will not work")
    else:
        print("✅ OpenAI API key found")
        
    if not youtube_key:
        print("⚠️  Warning: YOUTUBE_API_KEY not set - intellectual content will use fallback data")
    else:
        print("✅ YouTube API key found")
    
    # Set environment variables
    port = os.getenv('PORT', '8000')
    host = '0.0.0.0'
    
    print(f"📡 Starting server on {host}:{port}")
    print(f"🌐 Health check available at: http://{host}:{port}/health")
    
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
