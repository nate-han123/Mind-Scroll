"""
Quick test to verify the application works with MongoDB Atlas
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("  TESTING APPLICATION WITH MONGODB")
print("=" * 60)

# Test 1: Check environment
print("\n[Test 1] Checking environment variables...")
mongodb_url = os.getenv("MONGODB_URL")
openai_key = os.getenv("OPENAI_API_KEY")

if mongodb_url:
    print("  [OK] MONGODB_URL is set")
else:
    print("  [ERROR] MONGODB_URL not found")

if openai_key:
    print("  [OK] OPENAI_API_KEY is set")
else:
    print("  [WARNING] OPENAI_API_KEY not found")

# Test 2: Initialize MongoDB service
print("\n[Test 2] Initializing MongoDB service...")
try:
    from services.sync_mongodb_user_service import SyncMongoDBUserService
    service = SyncMongoDBUserService()
    print("  [OK] MongoDB service initialized successfully!")
except Exception as e:
    print(f"  [ERROR] Failed to initialize: {e}")
    exit(1)

# Test 3: Check database connection
print("\n[Test 3] Testing database connection...")
try:
    # Try to count users (should work even if 0)
    count = service.users_collection.count_documents({})
    print(f"  [OK] Database connected! Current users: {count}")
except Exception as e:
    print(f"  [ERROR] Database connection failed: {e}")
    exit(1)

# Test 4: Import main app
print("\n[Test 4] Testing FastAPI app import...")
try:
    from main import app, user_service
    print("  [OK] FastAPI app loaded successfully!")
    print(f"  [OK] Using: {type(user_service).__name__}")
except Exception as e:
    print(f"  [ERROR] Failed to import app: {e}")
    exit(1)

print("\n" + "=" * 60)
print("  ALL TESTS PASSED!")
print("=" * 60)
print("\nYour application is ready to use MongoDB Atlas!")
print("\nTo start the server:")
print("  uvicorn main:app --reload --host 0.0.0.0 --port 8000")

