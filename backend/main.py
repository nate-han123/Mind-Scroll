from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
from agents.orchestrator import Orchestrator
from agents.enhanced_orchestrator import EnhancedOrchestrator
from services.user_service import UserService
from schemas.user import UserCredentials, UserProfile, Gender, ActivityLevel

app = FastAPI(title="Mindscroll AI Health Pipeline", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
user_service = UserService()
orchestrator = Orchestrator()
enhanced_orchestrator = EnhancedOrchestrator()

# Pydantic models for request/response
class UserData(BaseModel):
    meals: List[str]
    exercises: List[str]
    lifestyle: Dict[str, Any]

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str
    age: int
    gender: Gender
    weight: float
    height: float
    activity_level: ActivityLevel
    medical_conditions: Optional[List[str]] = []
    dietary_restrictions: Optional[List[str]] = []

class LoginRequest(BaseModel):
    email: str
    password: str

class DailyEntryRequest(BaseModel):
    user_id: str
    meals: List[str]
    exercises: List[str]
    lifestyle: Dict[str, Any]

class ProfileUpdateRequest(BaseModel):
    user_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[Gender] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None
    medical_conditions: Optional[List[str]] = None
    dietary_restrictions: Optional[List[str]] = None

@app.get("/")
async def root():
    return {"message": "Mindscroll AI Health Pipeline API"}

@app.get("/generate-summary")
async def generate_summary():
    """
    Generate a daily health summary using dummy data (for testing)
    """
    try:
        # Load dummy data
        dummy_data_path = os.path.join(os.path.dirname(__file__), "dummy_data", "user_data.json")
        with open(dummy_data_path, "r") as f:
            user_data = json.load(f)
        
        # Initialize orchestrator
        orchestrator = Orchestrator()
        
        # Generate summary
        summary = orchestrator.generate_daily_summary(user_data)
        
        return summary
        
    except Exception as e:
        return {"error": f"Failed to generate summary: {str(e)}"}

@app.post("/generate-summary-from-user-data")
async def generate_summary_from_user_data(user_data: UserData):
    """
    Generate a daily health summary from user-provided data
    """
    try:
        # Convert Pydantic model to dict
        user_data_dict = user_data.dict()
        
        # Generate summary
        summary = orchestrator.generate_daily_summary(user_data_dict)
        
        return summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

# User Management Endpoints
@app.post("/auth/signup")
async def signup(request: SignupRequest):
    """
    Create a new user account with AI-generated goal
    """
    try:
        # Check if user already exists
        existing_user = user_service.get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create credentials and profile
        credentials = UserCredentials(email=request.email, password=request.password)
        profile = UserProfile(
            name=request.name,
            age=request.age,
            gender=request.gender,
            weight=request.weight,
            height=request.height,
            activity_level=request.activity_level,
            medical_conditions=request.medical_conditions,
            dietary_restrictions=request.dietary_restrictions
        )
        
        # Create user with AI-generated goal
        user = user_service.create_user(credentials, profile)
        
        return {
            "user_id": user.id,
            "name": user.profile.name,
            "goal": user.goal.dict(),
            "message": "Account created successfully with personalized goal!"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create account: {str(e)}")

@app.post("/auth/login")
async def login(request: LoginRequest):
    """
    Authenticate user and return user data
    """
    try:
        user = user_service.authenticate_user(request.email, request.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "user_id": user.id,
            "name": user.profile.name,
            "goal": user.goal.dict(),
            "progress": user_service.get_user_progress_summary(user.id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/user/{user_id}")
async def get_user(user_id: str):
    """
    Get user profile and progress
    """
    try:
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "user_id": user.id,
            "name": user.profile.name,
            "goal": user.goal.dict(),
            "progress": user_service.get_user_progress_summary(user.id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user: {str(e)}")

@app.post("/daily-entry")
async def add_daily_entry(request: DailyEntryRequest):
    """
    Add a daily entry for a user
    """
    try:
        success = user_service.add_daily_entry(
            request.user_id,
            request.meals,
            request.exercises,
            request.lifestyle
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Daily entry added successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add daily entry: {str(e)}")

@app.post("/generate-personalized-summary")
async def generate_personalized_summary(request: DailyEntryRequest):
    """
    Generate personalized daily summary for a user
    """
    try:
        # Get user
        user = user_service.get_user_by_id(request.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Add daily entry
        user_service.add_daily_entry(
            request.user_id,
            request.meals,
            request.exercises,
            request.lifestyle
        )
        
        # Generate personalized summary
        user_data = {
            "meals": request.meals,
            "exercises": request.exercises,
            "lifestyle": request.lifestyle
        }
        
        summary = enhanced_orchestrator.generate_personalized_summary(user, user_data)
        
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate personalized summary: {str(e)}")

@app.get("/user/{user_id}/progress")
async def get_user_progress(user_id: str, days: int = 7):
    """
    Get user's progress history
    """
    try:
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        recent_entries = user_service.get_recent_entries(user_id, days)
        
        return {
            "user_id": user_id,
            "recent_entries": [entry.dict() for entry in recent_entries],
            "progress_summary": user_service.get_user_progress_summary(user_id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get progress: {str(e)}")

@app.put("/user/profile")
async def update_user_profile(request: ProfileUpdateRequest):
    """Update user profile and regenerate AI goal"""
    try:
        # Get current user
        user = user_service.get_user_by_id(request.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update profile with new data (only non-None values)
        update_data = {}
        if request.name is not None:
            update_data["name"] = request.name
        if request.email is not None:
            update_data["email"] = request.email
        if request.age is not None:
            update_data["age"] = request.age
        if request.gender is not None:
            update_data["gender"] = request.gender
        if request.weight is not None:
            update_data["weight"] = request.weight
        if request.height is not None:
            update_data["height"] = request.height
        if request.activity_level is not None:
            update_data["activity_level"] = request.activity_level
        if request.medical_conditions is not None:
            update_data["medical_conditions"] = request.medical_conditions
        if request.dietary_restrictions is not None:
            update_data["dietary_restrictions"] = request.dietary_restrictions
        
        # Update user profile
        updated_user = user_service.update_user_profile(request.user_id, update_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Regenerate AI goal based on updated profile
        from agents.goal_generator import GoalGenerator
        goal_generator = GoalGenerator()
        new_goal = goal_generator.generate_goal(updated_user.profile)
        
        # Update user's goal
        updated_user.goal = new_goal
        user_service.save_user(updated_user)
        
        return {
            "message": "Profile updated successfully with new AI-generated goal!",
            "user": {
                "user_id": updated_user.id,
                "name": updated_user.profile.name,
                "email": updated_user.credentials.email,
                "age": updated_user.profile.age,
                "gender": updated_user.profile.gender,
                "weight": updated_user.profile.weight,
                "height": updated_user.profile.height,
                "activity_level": updated_user.profile.activity_level,
                "medical_conditions": updated_user.profile.medical_conditions,
                "dietary_restrictions": updated_user.profile.dietary_restrictions
            },
            "goal": {
                "goal_type": updated_user.goal.goal_type,
                "target_weight": updated_user.goal.target_weight,
                "target_calories_per_day": updated_user.goal.target_calories_per_day,
                "target_protein_per_day": updated_user.goal.target_protein_per_day,
                "target_exercise_minutes_per_week": updated_user.goal.target_exercise_minutes_per_week,
                "target_sleep_hours": updated_user.goal.target_sleep_hours,
                "target_screen_time_hours": updated_user.goal.target_screen_time_hours,
                "target_stress_level": updated_user.goal.target_stress_level,
                "goal_description": updated_user.goal.goal_description,
                "ai_generated": True,
                "created_at": updated_user.goal.created_at
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)