from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from schemas.user import UserProfile, UserGoal
import json

load_dotenv()

class PersonalizationGenerator:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.8,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def generate_nickname_and_avatar(self, profile: UserProfile, goal: UserGoal) -> tuple[str, str]:
        """Generate a personalized nickname and avatar based on user's profile and goal"""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a creative AI that generates fun, motivational nicknames and avatar emojis for students.

            Based on the user's profile and goal, create:
            1. A cool, motivational nickname (2-3 words max)
            2. An appropriate avatar emoji

            The nickname should be:
            - Motivational and positive for students
            - Related to their academic interests and health goals
            - Fun and memorable for student life
            - Appropriate for student age groups

            The avatar should be:
            - A single emoji that represents their goal or personality
            - Motivational and positive
            - Related to their interests or goal

            Return ONLY valid JSON in this format:
            {{"nickname": "string", "avatar": "emoji"}}"""),
            ("human", f"""Generate a nickname and avatar for this student:

            BASIC INFO:
            Name: {profile.name}
            Age: {profile.age}
            Gender: {profile.gender.value}
            Goal Type: {goal.goal_type}
            Goal Description: {goal.goal_description}

            HEALTH & MOTIVATION:
            Primary Health Goal: {profile.primary_health_goal}
            Motivation: {profile.motivation or 'Not specified'}
            Lifestyle Vision: {profile.lifestyle_vision or 'Not specified'}

            INTELLECTUAL INTERESTS:
            Intellectual Interests: {', '.join(profile.intellectual_interests) if profile.intellectual_interests else 'Not specified'}
            Learning Style: {profile.learning_style}
            Time Availability: {profile.time_availability}
            Activity Level: {profile.activity_level.value}
            """)
        ])
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse the JSON response
            result = json.loads(response.content)
            
            nickname = result.get("nickname", "Health Warrior")
            avatar = result.get("avatar", "💪")
            
            return nickname, avatar
            
        except Exception as e:
            print(f"Error generating nickname and avatar: {e}")
            # Fallback nicknames and avatars based on goal type
            return self._get_fallback_personalization(goal.goal_type)
    
    def _get_fallback_personalization(self, goal_type: str) -> tuple[str, str]:
        """Fallback nicknames and avatars based on goal type"""
        fallbacks = {
            "weight_loss": ("Fat Burner", "🔥"),
            "weight_gain": ("Muscle Builder", "💪"),
            "muscle_gain": ("Iron Warrior", "🏋️"),
            "endurance": ("Speed Demon", "🏃"),
            "general_health": ("Health Hero", "❤️"),
            "stress_reduction": ("Zen Master", "🧘"),
            "better_sleep": ("Sleep Champion", "😴")
        }
        return fallbacks.get(goal_type, ("Health Warrior", "💪"))
