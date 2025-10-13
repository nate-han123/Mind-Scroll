from schemas.summary import LifestyleAgentOutput

class LifestyleAgent:
    def __init__(self):
        self.name = "Lifestyle Agent"
    
    def analyze_lifestyle(self, lifestyle_data: dict) -> LifestyleAgentOutput:
        """
        Analyze lifestyle factors like sleep and screen time
        """
        sleep_hours = lifestyle_data.get("sleep_hours", 8)
        screen_time = lifestyle_data.get("screen_time", 2)
        
        # Calculate wellness score (0-10)
        sleep_score = min(10, sleep_hours * 1.25)  # Optimal is 8 hours
        screen_score = max(0, 10 - (screen_time * 1.5))  # Less screen time is better
        
        wellness_score = (sleep_score + screen_score) / 2
        
        # Generate advice based on analysis
        advice_parts = []
        
        if sleep_hours < 7:
            advice_parts.append("Try to get 7-8 hours of sleep for better recovery.")
        elif sleep_hours > 9:
            advice_parts.append("Consider if you need that much sleep - quality matters more than quantity.")
        else:
            advice_parts.append("Great sleep duration! Keep up the good rest habits.")
        
        if screen_time > 6:
            advice_parts.append("Consider reducing screen time for better mental health.")
        elif screen_time < 3:
            advice_parts.append("Good screen time balance! Your eyes will thank you.")
        else:
            advice_parts.append("Moderate screen time - try to take regular breaks.")
        
        advice = " ".join(advice_parts)
        
        return LifestyleAgentOutput(
            wellness_score=round(wellness_score, 1),
            advice=advice
        )
