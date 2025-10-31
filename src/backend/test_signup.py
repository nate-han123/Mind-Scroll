"""
Test user signup with MongoDB
"""
from services.sync_mongodb_user_service import SyncMongoDBUserService
from schemas.user import UserCredentials, UserProfile, Gender, ActivityLevel

print("Testing user signup with MongoDB...")

# Initialize service
service = SyncMongoDBUserService()

# Create test user
credentials = UserCredentials(
    email="test@example.com",
    password="test123"
)

profile = UserProfile(
    name="Test User",
    age=25,
    gender=Gender.MALE,
    weight=70.0,
    height=175.0,
    activity_level=ActivityLevel.MODERATELY_ACTIVE,
    primary_health_goal="Stay healthy and fit",
    intellectual_interests=["Technology", "Science"],
    learning_style="visual",
    time_availability="1-2 hours daily"
)

try:
    # Check if user exists
    existing = service.get_user_by_email("test@example.com")
    if existing:
        print("[INFO] Test user already exists, skipping creation")
        print(f"[OK] User ID: {existing.id}")
        print(f"[OK] Name: {existing.profile.name}")
        print("[SUCCESS] MongoDB integration working!")
    else:
        print("[INFO] Creating new test user...")
        user = service.create_user(credentials, profile)
        print(f"[SUCCESS] User created!")
        print(f"  User ID: {user.id}")
        print(f"  Name: {user.profile.name}")
        print(f"  Goal: {user.goal.goal_type}")
        print("[SUCCESS] MongoDB integration working perfectly!")
        
except Exception as e:
    print(f"[ERROR] Failed: {e}")
    import traceback
    traceback.print_exc()

