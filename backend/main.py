from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
async def root():
    return {"message": "Mindscroll AI Health Pipeline API"}

@app.get("/generate-summary")
async def generate_summary():
    """
    Generate a daily health summary by orchestrating all agents
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
