from agents.food_agent import FoodAgent
from agents.exercise_agent import ExerciseAgent
from agents.lifestyle_agent import LifestyleAgent
from schemas.summary import DailySummary
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

class Orchestrator:
    def __init__(self):
        self.food_agent = FoodAgent()
        self.exercise_agent = ExerciseAgent()
        self.lifestyle_agent = LifestyleAgent()
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.4,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def generate_daily_summary(self, user_data: dict) -> dict:
        """
        Orchestrate all agents to generate a comprehensive daily summary using AI
        """
        # Get agent outputs
        food_output = self.food_agent.analyze_meals(user_data.get("meals", []))
        exercise_output = self.exercise_agent.analyze_exercises(user_data.get("exercises", []))
        lifestyle_output = self.lifestyle_agent.analyze_lifestyle(user_data.get("lifestyle", {}))
        
        # Use AI to generate overall summary and recommendations
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a health and wellness expert AI. Based on the provided agent outputs, generate a comprehensive daily health summary with:
                - overall_health_score: overall score from 0-10 (float)
                - summary: brief daily summary (string)
                - recommendations: list of 3 personalized recommendations (list of strings)
                
                Consider the nutrition score, exercise calories burned, and wellness score to provide balanced insights.
                
                Return ONLY valid JSON in this format:
                {{"overall_health_score": number, "summary": "string", "recommendations": ["string1", "string2", "string3"]}}"""),
                ("human", f"""Analyze this health data:
                Nutrition: {food_output.nutrition_score}/10, {food_output.calories} calories, {food_output.comment}
                Exercise: {exercise_output.calories_burned} calories burned, {exercise_output.note}
                Lifestyle: {lifestyle_output.wellness_score}/10 wellness score, {lifestyle_output.advice}""")
            ])
            
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse AI response
            import json
            result = json.loads(response.content)
            
            orchestrator_summary = {
                "overall_health_score": result.get("overall_health_score", 5.0),
                "summary": result.get("summary", "Daily health analysis completed."),
                "recommendations": result.get("recommendations", ["Stay hydrated", "Get enough sleep", "Stay active"])
            }
            
        except Exception as e:
            print(f"Error in orchestrator AI: {e}")
            # Fallback to simple calculation
            overall_score = (
                food_output.nutrition_score + 
                min(10, exercise_output.calories_burned / 50) +  # Convert to 0-10 scale
                lifestyle_output.wellness_score
            ) / 3
            
            orchestrator_summary = {
                "overall_health_score": round(overall_score, 1),
                "summary": f"Today shows nutrition score of {food_output.nutrition_score}/10, {exercise_output.calories_burned} calories burned, and wellness score of {lifestyle_output.wellness_score}/10.",
                "recommendations": [
                    "Maintain balanced nutrition",
                    "Stay physically active",
                    "Prioritize rest and recovery"
                ]
            }
        
        return {
            "food_agent": {
                "calories": food_output.calories,
                "nutrition_score": food_output.nutrition_score,
                "comment": food_output.comment
            },
            "exercise_agent": {
                "calories_burned": exercise_output.calories_burned,
                "note": exercise_output.note
            },
            "lifestyle_agent": {
                "wellness_score": lifestyle_output.wellness_score,
                "advice": lifestyle_output.advice
            },
            "orchestrator_summary": orchestrator_summary
        }
