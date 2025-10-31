from schemas.summary import ExerciseAgentOutput
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

class ExerciseAgent:
    def __init__(self):
        self.name = "Exercise Agent"
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def analyze_exercises(self, exercises: list) -> ExerciseAgentOutput:
        """
        Analyze exercise activities using AI and return fitness insights
        """
        if not exercises:
            return ExerciseAgentOutput(
                calories_burned=0,
                note="No exercises recorded today. Consider adding some physical activity to boost your health and energy."
            )
        
        # Create prompt for AI analysis
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a fitness expert AI. Analyze the provided exercises and return a JSON response with:
            - calories_burned: estimated total calories burned (integer)
            - note: motivational and fitness advice (string)
            
            Consider factors like:
            - Exercise type and intensity
            - Duration mentioned
            - Fitness level indicators
            - Motivational tone
            
            Return ONLY valid JSON in this format:
            {{"calories_burned": number, "note": "string"}}"""),
            ("human", f"Analyze these exercises: {', '.join(exercises)}")
        ])
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse AI response
            import json
            result = json.loads(response.content)
            
            return ExerciseAgentOutput(
                calories_burned=result.get("calories_burned", 0),
                note=result.get("note", "Great job staying active!")
            )
            
        except Exception as e:
            print(f"Error in exercise agent: {e}")
            # Fallback to simple analysis
            return self._fallback_analysis(exercises)
    
    def _fallback_analysis(self, exercises: list) -> ExerciseAgentOutput:
        """Fallback analysis if AI fails"""
        total_calories = len(exercises) * 150  # Simple estimate
        
        if total_calories > 300:
            note = "Excellent workout! You're building great fitness habits."
        elif total_calories > 150:
            note = "Good activity level! Keep up the great work."
        else:
            note = "Every step counts! Consider adding more activities."
        
        return ExerciseAgentOutput(
            calories_burned=total_calories,
            note=note
        )
