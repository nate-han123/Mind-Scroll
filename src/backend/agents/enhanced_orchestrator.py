from agents.food_agent import FoodAgent
from agents.exercise_agent import ExerciseAgent
from agents.lifestyle_agent import LifestyleAgent
from schemas.summary import DailySummary
from schemas.user import User, UserGoal
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class EnhancedOrchestrator:
    def __init__(self):
        self.food_agent = FoodAgent()
        self.exercise_agent = ExerciseAgent()
        self.lifestyle_agent = LifestyleAgent()
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.4,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def generate_personalized_summary(self, user: User, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized daily summary considering user's goals and progress
        """
        # Get agent outputs
        food_output = self.food_agent.analyze_meals(user_data.get("meals", []))
        exercise_output = self.exercise_agent.analyze_exercises(user_data.get("exercises", []))
        lifestyle_output = self.lifestyle_agent.analyze_lifestyle(user_data.get("lifestyle", {}))
        
        # Generate goal-aligned summary and recommendations
        goal_alignment = self._analyze_goal_alignment(user, food_output, exercise_output, lifestyle_output)
        
        # Use AI to generate personalized summary
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a personalized health coach AI. Based on the user's profile, goals, and today's data, generate a comprehensive daily summary with:
                - overall_health_score: overall score from 0-10 (float)
                - summary: personalized daily summary (string)
                - recommendations: list of 3 personalized recommendations (list of strings)
                - goal_progress: how well they're doing toward their goal (string)
                - motivation: personalized motivational message (string)
                
                Consider the user's specific goals, current progress, and today's performance.
                
                Return ONLY valid JSON in this format:
                {{"overall_health_score": number, "summary": "string", "recommendations": ["string1", "string2", "string3"], "goal_progress": "string", "motivation": "string"}}"""),
                ("human", f"""Generate personalized summary for {user.profile.name}:
                
                User Profile:
                - Age: {user.profile.age}, Gender: {user.profile.gender}
                - Weight: {user.profile.weight}kg, Height: {user.profile.height}cm
                - Activity Level: {user.profile.activity_level}
                
                User Goal: {user.goal.goal_description}
                Goal Type: {user.goal.goal_type}
                Target Weight: {user.goal.target_weight}kg
                Target Calories: {user.goal.target_calories_per_day}/day
                Target Exercise: {user.goal.target_exercise_minutes_per_week}min/week
                
                Today's Data:
                - Nutrition: {food_output.nutrition_score}/10, {food_output.calories} calories
                - Exercise: {exercise_output.calories_burned} calories burned
                - Lifestyle: {lifestyle_output.wellness_score}/10 wellness score
                
                Goal Alignment: {goal_alignment}""")
            ])
            
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse AI response
            import json
            result = json.loads(response.content)
            
            orchestrator_summary = {
                "overall_health_score": result.get("overall_health_score", 5.0),
                "summary": result.get("summary", "Daily health analysis completed."),
                "recommendations": result.get("recommendations", ["Stay hydrated", "Get enough sleep", "Stay active"]),
                "goal_progress": result.get("goal_progress", "Keep working toward your goals!"),
                "motivation": result.get("motivation", "You're doing great! Keep it up!")
            }
            
        except Exception as e:
            print(f"Error in enhanced orchestrator: {e}")
            # Fallback to basic calculation
            overall_score = (
                food_output.nutrition_score + 
                min(10, exercise_output.calories_burned / 50) + 
                lifestyle_output.wellness_score
            ) / 3
            
            orchestrator_summary = {
                "overall_health_score": round(overall_score, 1),
                "summary": f"Today shows progress toward your {user.goal.goal_type} goal.",
                "recommendations": [
                    "Continue following your personalized plan",
                    "Stay consistent with your daily habits",
                    "Monitor your progress regularly"
                ],
                "goal_progress": f"You're making progress toward your {user.goal.goal_type} goal!",
                "motivation": f"Keep up the great work, {user.profile.name}!"
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
            "orchestrator_summary": orchestrator_summary,
            "goal_alignment": goal_alignment
        }
    
    def _analyze_goal_alignment(self, user: User, food_output, exercise_output, lifestyle_output) -> str:
        """Analyze how well the user is aligned with their goals"""
        goal = user.goal
        alignment_score = 0
        total_checks = 0
        
        # Check calorie alignment
        if goal.target_calories_per_day:
            calorie_diff = abs(food_output.calories - goal.target_calories_per_day)
            calorie_alignment = max(0, 1 - (calorie_diff / goal.target_calories_per_day))
            alignment_score += calorie_alignment
            total_checks += 1
        
        # Check exercise alignment
        if goal.target_exercise_minutes_per_week:
            # Estimate weekly exercise from today's data
            estimated_weekly_exercise = exercise_output.calories_burned * 7 / 300  # Rough estimate
            exercise_alignment = min(1, estimated_weekly_exercise / goal.target_exercise_minutes_per_week)
            alignment_score += exercise_alignment
            total_checks += 1
        
        # Check sleep alignment
        if goal.target_sleep_hours and hasattr(lifestyle_output, 'wellness_score'):
            # Use wellness score as a proxy for sleep quality
            sleep_alignment = lifestyle_output.wellness_score / 10
            alignment_score += sleep_alignment
            total_checks += 1
        
        if total_checks == 0:
            return "Goal alignment cannot be determined yet."
        
        alignment_percentage = (alignment_score / total_checks) * 100
        
        if alignment_percentage >= 80:
            return f"Excellent! You're {alignment_percentage:.0f}% aligned with your goals."
        elif alignment_percentage >= 60:
            return f"Good progress! You're {alignment_percentage:.0f}% aligned with your goals."
        elif alignment_percentage >= 40:
            return f"Room for improvement. You're {alignment_percentage:.0f}% aligned with your goals."
        else:
            return f"Let's get back on track. You're {alignment_percentage:.0f}% aligned with your goals."
