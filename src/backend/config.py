"""
Centralized configuration and environment variable loading
Ensures all services load from .env file (not env.example)
"""
import os
from dotenv import load_dotenv
from pathlib import Path

# Get the backend directory path
BACKEND_DIR = Path(__file__).parent

# Explicitly load from .env file (not env.example)
ENV_FILE = BACKEND_DIR / ".env"

# Load environment variables from .env
load_dotenv(dotenv_path=ENV_FILE, override=True)

# Environment variables
MONGODB_URL = os.getenv("MONGODB_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

def check_env_vars():
    """Check if required environment variables are set"""
    print("\n" + "=" * 60)
    print("  ENVIRONMENT CONFIGURATION")
    print("=" * 60)
    print(f"Loading from: {ENV_FILE}")
    print(f"File exists: {ENV_FILE.exists()}")
    print("\nEnvironment Variables:")
    print(f"  MONGODB_URL: {'SET' if MONGODB_URL else 'NOT SET'}")
    print(f"  OPENAI_API_KEY: {'SET' if OPENAI_API_KEY else 'NOT SET'}")
    print(f"  YOUTUBE_API_KEY: {'SET' if YOUTUBE_API_KEY else 'NOT SET'}")
    print(f"  ENVIRONMENT: {ENVIRONMENT}")
    print("=" * 60 + "\n")
    
    missing = []
    if not MONGODB_URL:
        missing.append("MONGODB_URL")
    if not OPENAI_API_KEY:
        missing.append("OPENAI_API_KEY")
    
    if missing:
        print(f"[WARNING] Missing required variables: {', '.join(missing)}")
        print("Please add them to your .env file\n")
    else:
        print("[SUCCESS] All required environment variables are set!\n")
    
    return len(missing) == 0

if __name__ == "__main__":
    check_env_vars()

