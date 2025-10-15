from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field=None):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            if ObjectId.is_valid(v):
                return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

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
    password: str
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
    date: datetime
    meals: List[str]
    exercises: List[str]
    lifestyle: Dict[str, Any]
    summary: Optional[Dict[str, Any]] = None

class UserProgress(BaseModel):
    total_entries: int = 0
    current_streak: int = 0
    last_entry_date: Optional[datetime] = None
    entries: List[DailyEntry] = []

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[str] = None
    credentials: UserCredentials
    profile: UserProfile
    goal: UserGoal
    progress: UserProgress
    created_at: datetime = datetime.now()

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        populate_by_name = True
