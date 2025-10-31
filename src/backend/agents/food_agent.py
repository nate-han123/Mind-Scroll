from schemas.summary import FoodAgentOutput
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

class FoodAgent:
    def __init__(self):
        self.name = "Food Agent"
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    def analyze_meals(self, meals: list) -> FoodAgentOutput:
        """
        Analyze meals using AI and return nutritional insights
        """
        if not meals:
            return FoodAgentOutput(
                calories=0,
                nutrition_score=0.0,
                comment="No meals recorded today. Consider adding nutritious meals to your day."
            )
        
        # Create prompt for AI analysis
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a nutrition expert AI. Analyze the provided meals and return a JSON response with:
            - calories: estimated total calories (integer)
            - nutrition_score: score from 0-10 based on nutritional quality (float)
            - comment: brief nutritional advice (string)
            
            Consider factors like:
            - Calorie density
            - Nutritional balance (proteins, carbs, fats, vitamins)
            - Meal variety
            - Healthiness of ingredients
            
            Return ONLY valid JSON in this format:
            {{"calories": number, "nutrition_score": number, "comment": "string"}}"""),
            ("human", f"Analyze these meals: {', '.join(meals)}")
        ])
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({})
            
            # Parse AI response
            import json
            result = json.loads(response.content)
            
            return FoodAgentOutput(
                calories=result.get("calories", 0),
                nutrition_score=result.get("nutrition_score", 0.0),
                comment=result.get("comment", "Unable to analyze meals.")
            )
            
        except Exception as e:
            print(f"Error in food agent: {e}")
            # Fallback to simple analysis
            return self._fallback_analysis(meals)
    
    def _fallback_analysis(self, meals: list) -> FoodAgentOutput:
        """Fallback analysis if AI fails"""
        total_calories = len(meals) * 400  # Simple estimate
        nutrition_score = min(10.0, len(meals) * 2.5)  # Basic scoring
        
        comment = f"Analyzed {len(meals)} meals. Consider adding more variety for better nutrition."
        
        return FoodAgentOutput(
            calories=total_calories,
            nutrition_score=nutrition_score,
            comment=comment
        )
