"""
Feedback Learning Service
Stores user corrections and improves AI predictions over time
"""
import json
import os
import hashlib
from typing import Dict, List, Any
from datetime import datetime

class FeedbackLearningService:
    def __init__(self):
        """Initialize the feedback learning service"""
        self.feedback_file = "backend/data/feedback_learning.json"
        self.feedback_data = self._load_feedback_data()
        print("[INFO] Feedback learning service initialized")
    
    def _load_feedback_data(self) -> Dict[str, Any]:
        """Load existing feedback data"""
        try:
            if os.path.exists(self.feedback_file):
                with open(self.feedback_file, 'r') as f:
                    return json.load(f)
            return {
                "corrections": [],
                "patterns": {},
                "improvements": {},
                "total_feedback": 0
            }
        except Exception as e:
            print(f"Error loading feedback data: {e}")
            return {"corrections": [], "patterns": {}, "improvements": {}, "total_feedback": 0}
    
    def _save_feedback_data(self):
        """Save feedback data to file"""
        try:
            os.makedirs(os.path.dirname(self.feedback_file), exist_ok=True)
            with open(self.feedback_file, 'w') as f:
                json.dump(self.feedback_data, f, indent=2)
        except Exception as e:
            print(f"Error saving feedback data: {e}")
    
    def record_correction(self, image_hash: str, ai_prediction: List[str], user_correction: str, image_info: Dict[str, Any]):
        """Record a user correction for learning"""
        correction = {
            "timestamp": datetime.now().isoformat(),
            "image_hash": image_hash,
            "ai_prediction": ai_prediction,
            "user_correction": user_correction,
            "image_info": image_info,
            "correction_type": "manual_override"
        }
        
        self.feedback_data["corrections"].append(correction)
        self.feedback_data["total_feedback"] += 1
        
        # Update patterns
        self._update_patterns(correction)
        
        # Save data
        self._save_feedback_data()
        
        print(f"📝 Recorded correction: AI said '{ai_prediction}', user said '{user_correction}'")
        return True
    
    def _update_patterns(self, correction: Dict[str, Any]):
        """Update learning patterns based on corrections"""
        ai_pred = correction["ai_prediction"]
        user_corr = correction["user_correction"]
        
        # Create pattern key
        pattern_key = f"{ai_pred[0] if ai_pred else 'unknown'}_to_{user_corr}"
        
        if pattern_key not in self.feedback_data["patterns"]:
            self.feedback_data["patterns"][pattern_key] = {
                "count": 0,
                "examples": [],
                "confidence_boost": 0.0
            }
        
        # Update pattern
        self.feedback_data["patterns"][pattern_key]["count"] += 1
        self.feedback_data["patterns"][pattern_key]["examples"].append({
            "timestamp": correction["timestamp"],
            "image_hash": correction["image_hash"]
        })
        
        # Calculate confidence boost based on frequency
        count = self.feedback_data["patterns"][pattern_key]["count"]
        self.feedback_data["patterns"][pattern_key]["confidence_boost"] = min(0.5, count * 0.1)
    
    def get_learned_suggestions(self, image_hash: str, color_analysis: Dict[str, bool], aspect_ratio: float) -> List[Dict[str, Any]]:
        """Get improved suggestions based on learned patterns"""
        suggestions = []
        
        # Check for learned patterns
        for pattern_key, pattern_data in self.feedback_data["patterns"].items():
            if pattern_data["count"] >= 2:  # Only use patterns with multiple examples
                confidence_boost = pattern_data["confidence_boost"]
                
                # Apply pattern-based suggestions
                if "vegetables_to_boiled_egg" in pattern_key:
                    if not color_analysis['has_green'] and 0.7 <= aspect_ratio <= 1.4:
                        suggestions.append({
                            "name": "boiled egg",
                            "confidence": 0.85 + confidence_boost,
                            "portion": "1 egg",
                            "description": f"Learned pattern: vegetables often corrected to boiled egg (boost: +{confidence_boost:.1%})"
                        })
                
                elif "food_item_to_boiled_egg" in pattern_key:
                    if not color_analysis['has_red'] and not color_analysis['has_green']:
                        suggestions.append({
                            "name": "boiled egg",
                            "confidence": 0.80 + confidence_boost,
                            "portion": "1 egg",
                            "description": f"Learned pattern: generic food often corrected to boiled egg (boost: +{confidence_boost:.1%})"
                        })
        
        return suggestions
    
    def get_feedback_stats(self) -> Dict[str, Any]:
        """Get feedback learning statistics"""
        total_corrections = len(self.feedback_data["corrections"])
        total_patterns = len(self.feedback_data["patterns"])
        
        # Most common corrections
        pattern_counts = {k: v["count"] for k, v in self.feedback_data["patterns"].items()}
        most_common = sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "total_corrections": total_corrections,
            "total_patterns": total_patterns,
            "most_common_corrections": most_common,
            "learning_active": total_corrections > 0
        }
    
    def apply_learning_to_analysis(self, image_hash: str, color_analysis: Dict[str, bool], aspect_ratio: float, base_suggestions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Apply learned patterns to improve base suggestions"""
        learned_suggestions = self.get_learned_suggestions(image_hash, color_analysis, aspect_ratio)
        
        # Combine base suggestions with learned suggestions
        all_suggestions = base_suggestions + learned_suggestions
        
        # Remove duplicates and sort by confidence
        unique_suggestions = []
        seen_names = set()
        
        for suggestion in sorted(all_suggestions, key=lambda x: x.get('confidence', 0), reverse=True):
            if suggestion['name'] not in seen_names:
                unique_suggestions.append(suggestion)
                seen_names.add(suggestion['name'])
        
        return unique_suggestions

# Global instance
feedback_learning_service = FeedbackLearningService()
