"""
Simple test of user creation (without OpenAI)
"""
from services.sync_mongodb_user_service import SyncMongoDBUserService
from schemas.user import UserCredentials, UserProfile, UserGoal, UserProgress, Gender, ActivityLevel, GoalType
import uuid

print("Testing user creation...")

service = SyncMongoDBUserService()

# Create test credentials and profile
credentials = UserCredentials(
    email=f"test{uuid.uuid4().hex[:6]}@test.com",
    password="testpass123"
)

profile = UserProfile(
    name="Test User",
    age=25,
    gender=Gender.MALE,
    weight=70.0,
    height=175.0,
    activity_level=ActivityLevel.MODERATELY_ACTIVE,
    primary_health_goal="Get healthy",
    intellectual_interests=["Tech"],
    learning_style="visual",
    time_availability="2 hours"
)

# Manually create goal (skip AI generation for now)
goal = UserGoal(
    goal_type=GoalType.GENERAL_HEALTH,
    goal_description="Stay healthy and active"
)

progress = UserProgress()

# Test the dict conversion and storage
user_id = str(uuid.uuid4())
user_dict = {
    "id": user_id,
    "user_id": user_id,
    "credentials": credentials.model_dump(mode='json'),
    "profile": profile.model_dump(mode='json'),
    "goal": goal.model_dump(mode='json'),
    "progress": progress.model_dump(mode='json'),
    "is_active": True
}

print("[INFO] User dict created successfully")
print(f"[INFO] Inserting into MongoDB...")

try:
    result = service.users_collection.insert_one(user_dict)
    print(f"[SUCCESS] User created! ID: {user_id}")
    print(f"[SUCCESS] MongoDB ID: {result.inserted_id}")
    
    # Test retrieval
    retrieved = service.get_user_by_id(user_id)
    if retrieved:
        print(f"[SUCCESS] User retrieved! Name: {retrieved.profile.name}")
    else:
        print("[ERROR] Could not retrieve user")
        
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()

