from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os
from agents.orchestrator import Orchestrator

app = FastAPI(title="Mindscroll AI Health Pipeline", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class UserData(BaseModel):
    meals: List[str]
    exercises: List[str]
    lifestyle: Dict[str, Any]

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
        # Initialize orchestrator
        orchestrator = Orchestrator()
        
        # Convert Pydantic model to dict
        user_data_dict = user_data.dict()
        
        # Generate summary
        summary = orchestrator.generate_daily_summary(user_data_dict)
        
        return summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)