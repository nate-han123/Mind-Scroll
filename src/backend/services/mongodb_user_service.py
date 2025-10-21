from typing import Optional, List, Dict, Any
from datetime import datetime
from database.mongodb import get_database
from models.user import User, UserCredentials, UserProfile, UserGoal, UserProgress, DailyEntry, GoalType, ActivityLevel, Gender
from agents.goal_generator import GoalGenerator
import uuid

class MongoDBUserService:
    def __init__(self):
        self.db = get_database()
        self.users_collection = self.db.users
        self.goal_generator = GoalGenerator()
    
    async def create_user(self, credentials: UserCredentials, profile: UserProfile) -> User:
        """Create a new user with AI-generated goal"""
        user_id = str(uuid.uuid4())
        
        # Generate AI goal based on profile
        goal = self.goal_generator.generate_goal(profile)
        
        # Create user progress
        progress = UserProgress(
            total_entries=0,
            current_streak=0,
            last_entry_date=None,
            entries=[]
        )
        
        # Create user
        user = User(
            user_id=user_id,
            credentials=credentials,
            profile=profile,
            goal=goal,
            progress=progress
        )
        
        # Insert into MongoDB
        result = await self.users_collection.insert_one(user.dict())
        user.id = result.inserted_id
        
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by user_id"""
        user_data = await self.users_collection.find_one({"user_id": user_id})
        if user_data:
            return User(**user_data)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        user_data = await self.users_collection.find_one({"credentials.email": email})
        if user_data:
            return User(**user_data)
        return None
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await self.get_user_by_email(email)
        if user and user.credentials.password == password:
            return user
        return None
    
    async def update_user_profile(self, user_id: str, update_data: Dict[str, Any]) -> Optional[User]:
        """Update user profile with new data"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Update profile fields
        for key, value in update_data.items():
            if key == 'email' and hasattr(user.credentials, 'email'):
                # Update email in credentials
                user.credentials.email = value
            elif hasattr(user.profile, key) and value is not None:
                # Update profile fields
                setattr(user.profile, key, value)
        
        # Save updated user
        await self.save_user(user)
        return user
    
    async def save_user(self, user: User):
        """Save user to MongoDB"""
        await self.users_collection.replace_one(
            {"user_id": user.user_id},
            user.dict(),
            upsert=True
        )
    
    async def add_daily_entry(self, user_id: str, entry: DailyEntry) -> Optional[User]:
        """Add a daily entry for a user"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Add entry to user's progress
        user.progress.entries.append(entry)
        user.progress.total_entries = len(user.progress.entries)
        
        # Update streak
        await self._update_streak(user)
        
        # Save updated user
        await self.save_user(user)
        return user
    
    async def _update_streak(self, user: User):
        """Update user's current streak"""
        if not user.progress.entries:
            user.progress.current_streak = 0
            return
        
        # Sort entries by date
        sorted_entries = sorted(user.progress.entries, key=lambda x: x.date, reverse=True)
        
        # Calculate streak
        streak = 0
        current_date = datetime.now().date()
        
        for entry in sorted_entries:
            entry_date = entry.date.date()
            days_diff = (current_date - entry_date).days
            
            if days_diff == streak:
                streak += 1
            else:
                break
        
        user.progress.current_streak = streak
    
    async def get_recent_entries(self, user_id: str, days: int = 7) -> List[DailyEntry]:
        """Get user's recent entries"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return []
        
        # Sort entries by date and get recent ones
        sorted_entries = sorted(user.progress.entries, key=lambda x: x.date, reverse=True)
        return sorted_entries[:days]
    
    async def get_user_progress_summary(self, user_id: str) -> Dict[str, Any]:
        """Get user's progress summary"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return {}
        
        return {
            "total_entries": user.progress.total_entries,
            "current_streak": user.progress.current_streak,
            "last_entry_date": user.progress.last_entry_date,
            "goal": user.goal.dict(),
            "profile": user.profile.dict()
        }
    
    async def migrate_from_json(self, json_data: Dict[str, Any]) -> int:
        """Migrate existing JSON data to MongoDB"""
        migrated_count = 0
        
        for user_id, user_data in json_data.items():
            try:
                # Convert JSON data to User model
                user = User(**user_data)
                
                # Insert into MongoDB
                await self.users_collection.replace_one(
                    {"user_id": user.user_id},
                    user.dict(),
                    upsert=True
                )
                migrated_count += 1
                print(f"Migrated user: {user.profile.name} ({user.user_id})")
                
            except Exception as e:
                print(f"Error migrating user {user_id}: {e}")
                continue
        
        return migrated_count
