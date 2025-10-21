from typing import Optional, List, Dict, Any
from datetime import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from models.user import User, UserCredentials, UserProfile, UserGoal, UserProgress, DailyEntry, GoalType, ActivityLevel, Gender
from agents.goal_generator import GoalGenerator
import uuid

load_dotenv()

class SyncMongoDBUserService:
    def __init__(self):
        mongodb_url = os.getenv("MONGODB_URL")
        # Use connection string as-is, let MongoDB handle TLS automatically
        self.client = MongoClient(mongodb_url)
        self.db = self.client.mindscroll
        self.users_collection = self.db.users
        self.goal_generator = GoalGenerator()
    
    def create_user(self, credentials: UserCredentials, profile: UserProfile) -> User:
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
        result = self.users_collection.insert_one(user.dict())
        user.id = result.inserted_id
        
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by user_id"""
        user_data = self.users_collection.find_one({"user_id": user_id})
        if user_data:
            return User(**user_data)
        return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        user_data = self.users_collection.find_one({"credentials.email": email})
        if user_data:
            return User(**user_data)
        return None
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)
        if user and user.credentials.password == password:
            return user
        return None
    
    def update_user_profile(self, user_id: str, update_data: Dict[str, Any]) -> Optional[User]:
        """Update user profile with new data"""
        user = self.get_user_by_id(user_id)
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
        self.save_user(user)
        return user
    
    def save_user(self, user: User):
        """Save user to MongoDB"""
        self.users_collection.replace_one(
            {"user_id": user.user_id},
            user.dict(),
            upsert=True
        )
    
    def add_daily_entry(self, user_id: str, entry: DailyEntry) -> Optional[User]:
        """Add a daily entry for a user"""
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Add entry to user's progress
        user.progress.entries.append(entry)
        user.progress.total_entries = len(user.progress.entries)
        
        # Update streak
        self._update_streak(user)
        
        # Save updated user
        self.save_user(user)
        return user
    
    def _update_streak(self, user: User):
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
    
    def get_recent_entries(self, user_id: str, days: int = 7) -> List[DailyEntry]:
        """Get user's recent entries"""
        user = self.get_user_by_id(user_id)
        if not user:
            return []
        
        # Sort entries by date and get recent ones
        sorted_entries = sorted(user.progress.entries, key=lambda x: x.date, reverse=True)
        return sorted_entries[:days]
    
    def get_user_progress_summary(self, user_id: str) -> Dict[str, Any]:
        """Get user's progress summary"""
        user = self.get_user_by_id(user_id)
        if not user:
            return {}
        
        return {
            "total_entries": user.progress.total_entries,
            "current_streak": user.progress.current_streak,
            "last_entry_date": user.progress.last_entry_date,
            "goal": user.goal.dict(),
            "profile": user.profile.dict()
        }
