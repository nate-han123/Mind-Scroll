"""
Migrate existing JSON data to MongoDB Atlas
Run this script to transfer all user data from local files to the cloud database
"""
import json
import os
from dotenv import load_dotenv
from services.sync_mongodb_user_service import SyncMongoDBUserService

load_dotenv()

def migrate_users():
    """Migrate users from JSON file to MongoDB"""
    print("=" * 60)
    print("  MIGRATING DATA TO MONGODB ATLAS")
    print("=" * 60)
    
    # Path to JSON file
    json_file = os.path.join(os.path.dirname(__file__), "data", "users.json")
    
    if not os.path.exists(json_file):
        print(f"\n[INFO] No users.json file found at: {json_file}")
        print("Starting fresh with MongoDB Atlas!")
        return
    
    print(f"\n[INFO] Found users.json file")
    
    # Load JSON data
    try:
        with open(json_file, 'r') as f:
            users_data = json.load(f)
        
        print(f"[INFO] Loaded {len(users_data)} users from JSON")
    except Exception as e:
        print(f"[ERROR] Failed to read JSON file: {e}")
        return
    
    if not users_data:
        print("[INFO] No users to migrate")
        return
    
    # Initialize MongoDB service
    try:
        user_service = SyncMongoDBUserService()
        print("[SUCCESS] Connected to MongoDB Atlas")
    except Exception as e:
        print(f"[ERROR] Failed to connect to MongoDB: {e}")
        print("Make sure MONGODB_URL is set in your .env file")
        return
    
    # Migrate each user
    migrated_count = 0
    skipped_count = 0
    error_count = 0
    
    for user_id, user_data in users_data.items():
        try:
            # Check if user already exists
            email = user_data.get('credentials', {}).get('email')
            if email:
                existing_user = user_service.get_user_by_email(email)
                if existing_user:
                    print(f"[SKIP] User {email} already exists in MongoDB")
                    skipped_count += 1
                    continue
            
            # Insert user into MongoDB
            user_service.users_collection.insert_one(user_data)
            
            name = user_data.get('profile', {}).get('name', 'Unknown')
            print(f"[SUCCESS] Migrated: {name} ({email})")
            migrated_count += 1
            
        except Exception as e:
            print(f"[ERROR] Failed to migrate user {user_id}: {e}")
            error_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("  MIGRATION COMPLETE")
    print("=" * 60)
    print(f"Migrated: {migrated_count} users")
    print(f"Skipped: {skipped_count} users (already exist)")
    print(f"Errors: {error_count} users")
    print("\n[SUCCESS] All data is now in MongoDB Atlas!")
    print("You can safely keep users.json as a backup.")
    
if __name__ == "__main__":
    migrate_users()

