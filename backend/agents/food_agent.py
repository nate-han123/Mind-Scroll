from schemas.summary import FoodAgentOutput

class FoodAgent:
    def __init__(self):
        self.name = "Food Agent"
    
    def analyze_meals(self, meals: list) -> FoodAgentOutput:
        """
        Analyze meals and return nutritional insights
        """
        # Simple calorie estimation based on meal types
        calorie_map = {
            "avocado toast": 350,
            "chicken salad": 400,
            "pasta dinner": 600,
            "breakfast": 300,
            "lunch": 500,
            "dinner": 600
        }
        
        total_calories = 0
        for meal in meals:
            meal_lower = meal.lower()
            for key, calories in calorie_map.items():
                if key in meal_lower:
                    total_calories += calories
                    break
            else:
                # Default calorie estimate
                total_calories += 400
        
        # Calculate nutrition score (0-10)
        nutrition_score = min(10.0, total_calories / 200)  # Rough scoring
        
        # Generate comment based on analysis
        if total_calories < 1200:
            comment = "Consider adding more nutritious meals to meet daily requirements."
        elif total_calories > 2500:
            comment = "Good energy intake, but watch portion sizes for optimal health."
        else:
            comment = "Balanced calorie intake with good variety in your meals."
        
        return FoodAgentOutput(
            calories=total_calories,
            nutrition_score=nutrition_score,
            comment=comment
        )
