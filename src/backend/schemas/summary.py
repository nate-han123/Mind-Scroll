from pydantic import BaseModel
from typing import List

class FoodAgentOutput(BaseModel):
    calories: int
    nutrition_score: float
    comment: str

class ExerciseAgentOutput(BaseModel):
    calories_burned: int
    note: str

class LifestyleAgentOutput(BaseModel):
    wellness_score: float
    advice: str

class OrchestratorSummary(BaseModel):
    overall_health_score: float
    summary: str
    recommendations: List[str]

class DailySummary(BaseModel):
    food_agent: FoodAgentOutput
    exercise_agent: ExerciseAgentOutput
    lifestyle_agent: LifestyleAgentOutput
    orchestrator_summary: OrchestratorSummary
