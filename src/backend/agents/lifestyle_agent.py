from schemas.summary import LifestyleAgentOutput
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

class LifestyleAgent:
    def __init__(self):
        self.name = "Lifestyle Agent"
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def analyze_lifestyle(self, lifestyle_data: dict) -> LifestyleAgentOutput:
        """
        Analyze lifestyle factors using AI and return wellness insights
        """
        sleep_hours = lifestyle_data.get("sleep_hours", 8)
        screen_time = lifestyle_data.get("screen_time", 2)
        stress_level = lifestyle_data.get("stress_level", 5)
        
        # Create prompt for AI analysis
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a wellness expert AI. Analyze the provided lifestyle data and return a JSON response with:
            - wellness_score: overall wellness score from 0-10 (float)
            - advice: personalized wellness advice (string)
            
            Consider factors like:
            - Sleep quality and duration (7-9 hours optimal)
            - Screen time impact (less is better)
            - Stress levels (lower is better)
            - Overall lifestyle balance
            
            Return ONLY valid JSON in this format:
            {{"wellness_score": number, "advice": "string"}}"""),
            ("human", f"Analyze this lifestyle data: Sleep: {sleep_hours}h, Screen time: {screen_time}h, Stress level: {stress_level}/10")
        ])
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse AI response
            import json
            result = json.loads(response.content)
            
            return LifestyleAgentOutput(
                wellness_score=result.get("wellness_score", 5.0),
                advice=result.get("advice", "Focus on maintaining a balanced lifestyle.")
            )
            
        except Exception as e:
            print(f"Error in lifestyle agent: {e}")
            # Fallback to simple analysis
            return self._fallback_analysis(lifestyle_data)
    
    def _fallback_analysis(self, lifestyle_data: dict) -> LifestyleAgentOutput:
        """Fallback analysis if AI fails"""
        sleep_hours = lifestyle_data.get("sleep_hours", 8)
        screen_time = lifestyle_data.get("screen_time", 2)
        stress_level = lifestyle_data.get("stress_level", 5)
        
        # Calculate wellness score (0-10)
        sleep_score = min(10, sleep_hours * 1.25)  # Optimal is 8 hours
        screen_score = max(0, 10 - (screen_time * 1.5))  # Less screen time is better
        stress_score = max(0, 10 - stress_level)  # Lower stress is better
        
        wellness_score = (sleep_score + screen_score + stress_score) / 3
        
        # Generate advice
        advice_parts = []
        if sleep_hours < 7:
            advice_parts.append("Try to get 7-8 hours of sleep for better recovery.")
        if screen_time > 6:
            advice_parts.append("Consider reducing screen time for better mental health.")
        if stress_level > 7:
            advice_parts.append("Consider stress management techniques like meditation or deep breathing.")
        
        if not advice_parts:
            advice = "Great lifestyle balance! Keep up the healthy habits."
        else:
            advice = " ".join(advice_parts)
        
        return LifestyleAgentOutput(
            wellness_score=round(wellness_score, 1),
            advice=advice
        )
