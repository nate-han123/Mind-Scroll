from schemas.summary import ExerciseAgentOutput

class ExerciseAgent:
    def __init__(self):
        self.name = "Exercise Agent"
    
    def analyze_exercises(self, exercises: list) -> ExerciseAgentOutput:
        """
        Analyze exercise activities and return fitness insights
        """
        # Simple calorie burn estimation
        exercise_calories = {
            "jog": 300,
            "run": 400,
            "pushup": 50,
            "walk": 200,
            "bike": 250,
            "swim": 350
        }
        
        total_calories_burned = 0
        for exercise in exercises:
            exercise_lower = exercise.lower()
            for key, calories in exercise_calories.items():
                if key in exercise_lower:
                    # Adjust for duration if mentioned
                    if "30" in exercise_lower or "mins" in exercise_lower:
                        total_calories_burned += calories
                    elif "sets" in exercise_lower:
                        total_calories_burned += calories * 0.5  # Less for sets
                    else:
                        total_calories_burned += calories
                    break
        
        # Generate motivational note
        if total_calories_burned > 500:
            note = "Excellent workout! You're building great fitness habits."
        elif total_calories_burned > 300:
            note = "Good activity level! Consider adding some stretching."
        elif total_calories_burned > 100:
            note = "Nice start! Try to gradually increase your activity."
        else:
            note = "Every step counts! Consider a short walk to boost your day."
        
        return ExerciseAgentOutput(
            calories_burned=int(total_calories_burned),
            note=note
        )
