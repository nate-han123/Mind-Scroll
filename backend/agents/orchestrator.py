from agents.food_agent import FoodAgent
from agents.exercise_agent import ExerciseAgent
from agents.lifestyle_agent import LifestyleAgent
from schemas.summary import DailySummary

class Orchestrator:
    def __init__(self):
        self.food_agent = FoodAgent()
        self.exercise_agent = ExerciseAgent()
        self.lifestyle_agent = LifestyleAgent()
    
    def generate_daily_summary(self, user_data: dict) -> dict:
        """
        Orchestrate all agents to generate a comprehensive daily summary
        """
        # Get agent outputs
        food_output = self.food_agent.analyze_meals(user_data.get("meals", []))
        exercise_output = self.exercise_agent.analyze_exercises(user_data.get("exercises", []))
        lifestyle_output = self.lifestyle_agent.analyze_lifestyle(user_data.get("lifestyle", {}))
        
        # Calculate overall health score
        overall_score = (
            food_output.nutrition_score + 
            (exercise_output.calories_burned / 50) +  # Convert to 0-10 scale
            lifestyle_output.wellness_score
        ) / 3
        
        # Generate summary
        summary_parts = []
        if food_output.nutrition_score > 7:
            summary_parts.append("excellent nutrition choices")
        elif food_output.nutrition_score > 5:
            summary_parts.append("good meal variety")
        else:
            summary_parts.append("room for nutritional improvement")
        
        if exercise_output.calories_burned > 300:
            summary_parts.append("active lifestyle")
        elif exercise_output.calories_burned > 100:
            summary_parts.append("moderate activity")
        else:
            summary_parts.append("opportunities for more movement")
        
        if lifestyle_output.wellness_score > 7:
            summary_parts.append("healthy lifestyle habits")
        else:
            summary_parts.append("areas for lifestyle optimization")
        
        summary = f"Today shows {', '.join(summary_parts)}."
        
        # Generate personalized recommendations
        recommendations = []
        
        # Sleep recommendation
        sleep_hours = user_data.get("lifestyle", {}).get("sleep_hours", 8)
        if sleep_hours < 7:
            recommendations.append("Prioritize getting 7-8 hours of sleep tonight")
        elif sleep_hours > 9:
            recommendations.append("Consider if you need that much sleep - focus on quality")
        
        # Exercise recommendation
        if exercise_output.calories_burned < 200:
            recommendations.append("Add a 20-minute walk or light stretching to your day")
        elif exercise_output.calories_burned > 500:
            recommendations.append("Great workout! Remember to rest and recover properly")
        
        # Nutrition recommendation
        if food_output.nutrition_score < 6:
            recommendations.append("Include more vegetables and whole grains in your next meal")
        elif food_output.nutrition_score > 8:
            recommendations.append("Excellent food choices! Keep up the balanced eating")
        
        # Ensure we have at least 3 recommendations
        while len(recommendations) < 3:
            recommendations.append("Stay hydrated and take breaks throughout your day")
        
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
            "orchestrator_summary": {
                "overall_health_score": round(overall_score, 1),
                "summary": summary,
                "recommendations": recommendations[:3]
            }
        }
