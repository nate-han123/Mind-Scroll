import json
import os
import uuid
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from schemas.user import User, UserCredentials, UserProfile, UserGoal, DailyEntry, UserProgress, GoalType, ActivityLevel, Gender
from agents.goal_generator import GoalGenerator

class UserService:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        self.users_file = os.path.join(self.data_dir, "users.json")
        self.goal_generator = GoalGenerator()
        self._ensure_data_directory()
        self._load_users()
    
    def _ensure_data_directory(self):
        """Ensure data directory exists"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def _load_users(self):
        """Load users from JSON file"""
        if os.path.exists(self.users_file):
            with open(self.users_file, 'r') as f:
                self.users = json.load(f)
        else:
            self.users = {}
    
    def _save_users(self):
        """Save users to JSON file"""
        with open(self.users_file, 'w') as f:
            json.dump(self.users, f, indent=2, default=str)
    
    def create_user(self, credentials: UserCredentials, profile: UserProfile) -> User:
        """Create a new user with AI-generated goal"""
        user_id = str(uuid.uuid4())
        
        # Generate AI goal based on profile
        goal = self.goal_generator.generate_goal(profile)
        
        # Create user progress
        progress = UserProgress(
            user_id=user_id,
            entries=[],
            current_streak=0,
            total_entries=0
        )
        
        # Create user
        user = User(
            id=user_id,
            credentials=credentials,
            profile=profile,
            goal=goal,
            progress=progress
        )
        
        # Store user
        self.users[user_id] = user.dict()
        self._save_users()
        
        return user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        for user_data in self.users.values():
            if user_data['credentials']['email'] == email:
                return User(**user_data)
        return None
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        if user_id in self.users:
            return User(**self.users[user_id])
        return None
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)
        if user and user.credentials.password == password:
            return user
        return None
    
    def add_daily_entry(self, user_id: str, meals: List[str], exercises: List[str], lifestyle: Dict[str, Any]) -> bool:
        """Add a daily entry for a user"""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        # Create daily entry
        today = date.today().strftime("%Y-%m-%d")
        entry = DailyEntry(
            date=today,
            meals=meals,
            exercises=exercises,
            lifestyle=lifestyle
        )
        
        # Update user progress
        user.progress.entries.append(entry)
        user.progress.total_entries += 1
        user.progress.last_entry_date = today
        
        # Update streak
        self._update_streak(user)
        
        # Save updated user
        self.users[user_id] = user.dict()
        self._save_users()
        
        return True
    
    def _update_streak(self, user: User):
        """Update user's current streak"""
        if not user.progress.entries:
            user.progress.current_streak = 0
            return
        
        # Sort entries by date
        sorted_entries = sorted(user.progress.entries, key=lambda x: x.date, reverse=True)
        
        streak = 0
        current_date = datetime.now().date()
        
        for entry in sorted_entries:
            entry_date = datetime.strptime(entry.date, "%Y-%m-%d").date()
            days_diff = (current_date - entry_date).days
            
            if days_diff == streak:
                streak += 1
            else:
                break
        
        user.progress.current_streak = streak
    
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
    
    def get_recent_entries(self, user_id: str, days: int = 7) -> List[DailyEntry]:
        """Get user's recent entries"""
        user = self.get_user_by_id(user_id)
        if not user:
            return []
        
        # Sort entries by date and get recent ones
        sorted_entries = sorted(user.progress.entries, key=lambda x: x.date, reverse=True)
        return sorted_entries[:days]
    
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
        """Save user to storage"""
        self.users[user.id] = user.dict()
        self._save_users()
