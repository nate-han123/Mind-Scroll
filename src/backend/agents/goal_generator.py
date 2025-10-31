from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from schemas.user import UserProfile, UserGoal, GoalType, ActivityLevel, Gender
from agents.personalization_generator import PersonalizationGenerator
import json

load_dotenv()

class GoalGenerator:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.personalization_generator = PersonalizationGenerator()
    
    def generate_goal(self, profile: UserProfile) -> UserGoal:
        """Generate personalized health goal based on user profile"""
        
        # Create prompt for AI goal generation
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a student health and wellness expert AI. Based on the student's profile, generate a personalized health goal that considers their academic lifestyle and study demands.

            Generate a comprehensive health goal that includes:
            - goal_type: one of "weight_loss", "weight_gain", "muscle_gain", "endurance", "general_health", "stress_reduction", "better_sleep"
            - target_weight: if applicable (in kg)
            - target_calories_per_day: daily calorie target
            - target_protein_per_day: daily protein target (in grams)
            - target_exercise_minutes_per_week: weekly exercise target
            - target_sleep_hours: daily sleep target
            - target_screen_time_hours: daily screen time limit
            - target_stress_level: target stress level (1-10)
            - goal_description: detailed description of the goal

            Return ONLY valid JSON in this format:
            {{"goal_type": "string", "target_weight": number, "target_calories_per_day": number, "target_protein_per_day": number, "target_exercise_minutes_per_week": number, "target_sleep_hours": number, "target_screen_time_hours": number, "target_stress_level": number, "goal_description": "string"}}"""),
            ("human", f"""Generate a personalized student health goal for this student:
            
            BASIC INFO:
            Name: {profile.name}
            Age: {profile.age}
            Gender: {profile.gender.value}
            Weight: {profile.weight} kg
            Height: {profile.height} cm
            Activity Level: {profile.activity_level.value}
            
            HEALTH INFO:
            Medical Conditions: {', '.join(profile.medical_conditions) if profile.medical_conditions else 'None'}
            Dietary Restrictions: {', '.join(profile.dietary_restrictions) if profile.dietary_restrictions else 'None'}
            
            HEALTH GOALS & MOTIVATION:
            Primary Health Goal: {profile.primary_health_goal}
            Motivation: {profile.motivation or 'Not specified'}
            Lifestyle Vision: {profile.lifestyle_vision or 'Not specified'}
            
            INTELLECTUAL INTERESTS:
            Intellectual Interests: {', '.join(profile.intellectual_interests) if profile.intellectual_interests else 'Not specified'}
            Learning Style: {profile.learning_style}
            Time Availability: {profile.time_availability}""")
        ])
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse AI response
            result = json.loads(response.content)
            
            return UserGoal(
                goal_type=GoalType(result.get("goal_type", "general_health")),
                target_weight=result.get("target_weight"),
                target_calories_per_day=result.get("target_calories_per_day", 2000),
                target_protein_per_day=result.get("target_protein_per_day", 50),
                target_exercise_minutes_per_week=result.get("target_exercise_minutes_per_week", 150),
                target_sleep_hours=result.get("target_sleep_hours", 8),
                target_screen_time_hours=result.get("target_screen_time_hours", 6),
                target_stress_level=result.get("target_stress_level", 5),
                goal_description=result.get("goal_description", "Improve overall health and wellness"),
                ai_generated=True
            )
            
        except Exception as e:
            print(f"Error in goal generator: {e}")
            # Fallback to basic goal
            return self._fallback_goal(profile)
    
    def _fallback_goal(self, profile: UserProfile) -> UserGoal:
        """Fallback goal generation if AI fails"""
        # Calculate BMI
        height_m = profile.height / 100
        bmi = profile.weight / (height_m ** 2)
        
        # Determine goal based on BMI and activity level
        if bmi < 18.5:
            goal_type = GoalType.WEIGHT_GAIN
            target_weight = profile.weight * 1.1
        elif bmi > 25:
            goal_type = GoalType.WEIGHT_LOSS
            target_weight = profile.weight * 0.9
        else:
            goal_type = GoalType.GENERAL_HEALTH
            target_weight = profile.weight
        
        # Set targets based on activity level
        if profile.activity_level == ActivityLevel.SEDENTARY:
            target_exercise = 150
            target_calories = 1800
        elif profile.activity_level == ActivityLevel.LIGHTLY_ACTIVE:
            target_exercise = 200
            target_calories = 2000
        elif profile.activity_level == ActivityLevel.MODERATELY_ACTIVE:
            target_exercise = 250
            target_calories = 2200
        else:
            target_exercise = 300
            target_calories = 2500
        
        return UserGoal(
            goal_type=goal_type,
            target_weight=target_weight,
            target_calories_per_day=target_calories,
            target_protein_per_day=profile.weight * 1.6,  # 1.6g per kg body weight
            target_exercise_minutes_per_week=target_exercise,
            target_sleep_hours=8,
            target_screen_time_hours=6,
            target_stress_level=5,
            goal_description=f"Personalized health goal based on your profile: {goal_type.value}",
            ai_generated=True
        )
