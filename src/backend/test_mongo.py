"""Simple MongoDB Connection Test (Windows-compatible)"""
import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async def test():
    print("=" * 60)
    print("  MONGODB ATLAS CONNECTION TEST")
    print("=" * 60)
    
    mongodb_url = os.getenv("MONGODB_URL")
    
    if not mongodb_url:
        print("\n[ERROR] MONGODB_URL not found in .env file")
        print("Please add MONGODB_URL to your .env file")
        return False
    
    # Hide password
    safe_url = "***" + mongodb_url.split("@")[1] if "@" in mongodb_url else "..."
    print(f"\nConnecting to: {safe_url}")
    
    try:
        client = AsyncIOMotorClient(
            mongodb_url,
            serverSelectionTimeoutMS=5000
        )
        
        # Test ping
        await client.admin.command('ping')
        print("[SUCCESS] Connected to MongoDB Atlas!")
        
        # Get database info
        db = client.mindscroll
        collections = await db.list_collection_names()
        
        print(f"\nDatabase: mindscroll")
        print(f"Collections: {len(collections)}")
        
        if collections:
            for col in collections:
                count = await db[col].count_documents({})
                print(f"  - {col}: {count} documents")
        else:
            print("  (No collections yet)")
        
        # Test write
        print("\nTesting write operation...")
        test_col = db.test_connection
        result = await test_col.insert_one({"test": "ok"})
        print(f"[SUCCESS] Write test passed (ID: {result.inserted_id})")
        
        # Clean up
        await test_col.delete_one({"_id": result.inserted_id})
        client.close()
        
        print("\n" + "=" * 60)
        print("[SUCCESS] MongoDB Atlas is ready!")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Connection failed: {e}")
        print("\nTroubleshooting:")
        print("  1. Check MONGODB_URL in .env file")
        print("  2. Verify username/password are correct")
        print("  3. Check Network Access in Atlas (0.0.0.0/0)")
        return False

if __name__ == "__main__":
    success = asyncio.run(test())
    if not success:
        print("\nSee MONGODB_ATLAS_SETUP.md for help")

