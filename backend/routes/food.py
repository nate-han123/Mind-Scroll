from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from services.food_vision_service import food_vision_service
from services.feedback_learning_service import feedback_learning_service
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.post("/analyze-image")
async def analyze_food_image(image: UploadFile = File(...)):
    """
    Analyze a food image using free Hugging Face model
    """
    try:
        # Validate image file
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await image.read()
        
        # Use free food vision service
        result = food_vision_service.analyze_food_image(image_bytes)
        
        if result["success"]:
            return JSONResponse(content=result)
        else:
            # Fallback to sample data if model fails
            return JSONResponse(content={
                "success": True,
                "foodItems": [
                    "Sample food item 1",
                    "Sample food item 2"
                ],
                "detailedAnalysis": [
                    {
                        "name": "Sample food item 1",
                        "portion": "1 serving",
                        "description": "This is a sample food item for demonstration"
                    },
                    {
                        "name": "Sample food item 2", 
                        "portion": "1 serving",
                        "description": "This is another sample food item for demonstration"
                    }
                ],
                "message": "Free AI model temporarily unavailable. Using sample data.",
                "free_model": True,
                "fallback": True
            })
        
    except Exception as e:
        print(f"Error analyzing food image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

@router.get("/nutrition/{food_name}")
async def get_food_nutrition(food_name: str):
    """
    Get nutritional information for a specific food item
    """
    try:
        # This would typically connect to a nutrition database
        # For now, return basic nutritional info
        nutrition_info = {
            "name": food_name,
            "calories": "Estimated calories",
            "protein": "Estimated protein",
            "carbs": "Estimated carbohydrates",
            "fat": "Estimated fat",
            "fiber": "Estimated fiber"
        }
        
        return JSONResponse(content={
            "success": True,
            "nutrition": nutrition_info
        })
        
    except Exception as e:
        print(f"Error getting nutrition info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get nutrition info: {str(e)}")

# Pydantic models for feedback
class FeedbackRequest(BaseModel):
    image_hash: str
    ai_prediction: List[str]
    user_correction: str
    image_info: dict

@router.post("/feedback")
async def record_feedback(feedback: FeedbackRequest):
    """
    Record user feedback to improve AI predictions
    """
    try:
        success = feedback_learning_service.record_correction(
            image_hash=feedback.image_hash,
            ai_prediction=feedback.ai_prediction,
            user_correction=feedback.user_correction,
            image_info=feedback.image_info
        )
        
        if success:
            return JSONResponse(content={
                "success": True,
                "message": "Feedback recorded successfully",
                "learning_active": True
            })
        else:
            return JSONResponse(content={
                "success": False,
                "message": "Failed to record feedback"
            })
        
    except Exception as e:
        print(f"Error recording feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to record feedback: {str(e)}")

@router.get("/feedback/stats")
async def get_feedback_stats():
    """
    Get feedback learning statistics
    """
    try:
        stats = feedback_learning_service.get_feedback_stats()
        return JSONResponse(content={
            "success": True,
            "stats": stats
        })
    except Exception as e:
        print(f"Error getting feedback stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get feedback stats: {str(e)}")
