from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHTLY_ACTIVE = "lightly_active"
    MODERATELY_ACTIVE = "moderately_active"
    VERY_ACTIVE = "very_active"
    EXTRA_ACTIVE = "extra_active"

class GoalType(str, Enum):
    WEIGHT_LOSS = "weight_loss"
    WEIGHT_GAIN = "weight_gain"
    MUSCLE_GAIN = "muscle_gain"
    ENDURANCE = "endurance"
    GENERAL_HEALTH = "general_health"
    STRESS_REDUCTION = "stress_reduction"
    BETTER_SLEEP = "better_sleep"

class UserCredentials(BaseModel):
    email: EmailStr
    password: str  # In production, this should be hashed
    created_at: datetime = datetime.now()

class UserProfile(BaseModel):
    name: str
    age: int
    gender: Gender
    weight: float  # in kg
    height: float  # in cm
    activity_level: ActivityLevel
    medical_conditions: Optional[List[str]] = []
    dietary_restrictions: Optional[List[str]] = []
    
    # Personalization
    nickname: Optional[str] = None
    avatar: Optional[str] = None
    
    # Health Goals and Motivation
    primary_health_goal: str
    motivation: Optional[str] = None
    lifestyle_vision: Optional[str] = None
    
    # Intellectual Interests
    intellectual_interests: List[str]
    learning_style: str
    time_availability: str
    
    created_at: datetime = datetime.now()

class UserGoal(BaseModel):
    goal_type: GoalType
    target_weight: Optional[float] = None
    target_muscle_mass: Optional[float] = None
    target_calories_per_day: Optional[int] = None
    target_protein_per_day: Optional[float] = None
    target_exercise_minutes_per_week: Optional[int] = None
    target_sleep_hours: Optional[float] = None
    target_screen_time_hours: Optional[float] = None
    target_stress_level: Optional[float] = None
    goal_description: str
    ai_generated: bool = True
    created_at: datetime = datetime.now()

class DailyEntry(BaseModel):
    date: str  # YYYY-MM-DD format
    meals: List[str]
    exercises: List[str]
    lifestyle: Dict[str, Any]
    created_at: datetime = datetime.now()

class UserProgress(BaseModel):
    user_id: str
    entries: List[DailyEntry]
    current_streak: int = 0
    total_entries: int = 0
    last_entry_date: Optional[str] = None

class User(BaseModel):
    id: str
    credentials: UserCredentials
    profile: UserProfile
    goal: UserGoal
    progress: UserProgress
    is_active: bool = True
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
