from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
import json
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# YouTube API configuration
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search"

async def fetch_youtube_videos(topic: str, max_results: int = 5, duration: str = "short") -> List[Dict[str, Any]]:
    """
    Fetch YouTube videos for a given topic using YouTube Data API v3
    """
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YouTube API key not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            # Map duration to YouTube API parameter
            duration_map = {
                "short": "short",
                "medium": "medium", 
                "long": "long",
                "any": None  # No duration filter
            }
            
            params = {
                "key": YOUTUBE_API_KEY,
                "part": "snippet",
                "q": topic,
                "type": "video",
                "maxResults": max_results,
                "videoEmbeddable": "true",
                "order": "relevance"
            }
            
            # Add duration filter if not "any"
            if duration_map.get(duration) and duration != "any":
                params["videoDuration"] = duration_map[duration]
            
            response = await client.get(YOUTUBE_BASE_URL, params=params)
            
            if response.status_code != 200:
                data = response.json()
                if "error" in data and "quotaExceeded" in str(data.get("error", {}).get("errors", [])):
                    print("YouTube API quota exceeded - using demo content")
                    return []
                raise HTTPException(status_code=response.status_code, detail="YouTube API request failed")
            
            data = response.json()
            
            if "items" not in data:
                return []
            
            videos = []
            for item in data["items"]:
                video = {
                    "id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                    "videoId": item["id"]["videoId"],
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "category": topic,
                    "description": item["snippet"]["description"][:200] + "..." if len(item["snippet"]["description"]) > 200 else item["snippet"]["description"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "publishedAt": item["snippet"]["publishedAt"]
                }
                videos.append(video)
            
            return videos
            
    except httpx.RequestError as e:
        print(f"YouTube API request failed: {str(e)}")
        # Return empty list instead of raising exception
        return []
    except Exception as e:
        print(f"Error fetching YouTube videos: {str(e)}")
        # Return empty list instead of raising exception
        return []

# Fallback content for when YouTube API is unavailable
fallback_content = [
    {
        "id": 1,
        "title": "The Beauty of Chaos Theory",
        "category": "Science",
        "description": "Explore how small changes can lead to massive effects in complex systems",
        "thumbnail": "/videos/science1.jpg",
        "videoUrl": "/videos/science1.mp4",
        "duration": "3:45",
        "views": "2.3M",
        "likes": "156K"
    },
    {
        "id": 2,
        "title": "How Art Changes the Brain",
        "category": "Art",
        "description": "Discover the neuroscience behind creativity and artistic expression",
        "thumbnail": "/videos/art1.jpg",
        "videoUrl": "/videos/art1.mp4",
        "duration": "4:12",
        "views": "1.8M",
        "likes": "98K"
    },
    {
        "id": 3,
        "title": "The Psychology of Motivation",
        "category": "Psychology",
        "description": "Understanding what drives human behavior and decision-making",
        "thumbnail": "/videos/psy1.jpg",
        "videoUrl": "/videos/psy1.mp4",
        "duration": "5:30",
        "views": "3.1M",
        "likes": "234K"
    },
    {
        "id": 4,
        "title": "Quantum Computing Explained",
        "category": "Technology",
        "description": "A beginner's guide to the revolutionary world of quantum computing",
        "thumbnail": "/videos/tech1.jpg",
        "videoUrl": "/videos/tech1.mp4",
        "duration": "6:15",
        "views": "4.2M",
        "likes": "312K"
    },
    {
        "id": 5,
        "title": "The Renaissance Revolution",
        "category": "History",
        "description": "How the Renaissance changed the world forever",
        "thumbnail": "/videos/history1.jpg",
        "videoUrl": "/videos/history1.mp4",
        "duration": "7:20",
        "views": "1.5M",
        "likes": "87K"
    },
    {
        "id": 6,
        "title": "Advanced Mathematics Concepts",
        "category": "Mathematics",
        "description": "Deep dive into complex mathematical theories and applications",
        "thumbnail": "/videos/math1.jpg",
        "videoUrl": "/videos/math1.mp4",
        "duration": "8:30",
        "views": "1.2M",
        "likes": "89K"
    },
    {
        "id": 7,
        "title": "Classical Literature Analysis",
        "category": "Literature",
        "description": "Exploring the themes and techniques in classic literary works",
        "thumbnail": "/videos/lit1.jpg",
        "videoUrl": "/videos/lit1.mp4",
        "duration": "9:15",
        "views": "950K",
        "likes": "67K"
    },
    {
        "id": 8,
        "title": "Music Theory Fundamentals",
        "category": "Music",
        "description": "Understanding the building blocks of musical composition",
        "thumbnail": "/videos/music1.jpg",
        "videoUrl": "/videos/music1.mp4",
        "duration": "6:45",
        "views": "1.4M",
        "likes": "112K"
    }
]

@router.get("/recommendations")
async def get_recommendations(
    topics: Optional[str] = Query(None, description="Comma-separated list of topics"),
    duration: Optional[str] = Query("short", description="Video duration preference: short, medium, long, any")
):
    """
    Get intellectual content recommendations from YouTube API.
    Note: If YouTube API quota is exceeded, demo content will be returned instead.
    """
    try:
        if not topics:
            # Return dummy data if no topics provided
            return {
                "success": True,
                "data": fallback_content,
                "message": "Intellectual content recommendations retrieved successfully (dummy data)"
            }
        
        # Parse topics from query parameter
        topic_list = [topic.strip() for topic in topics.split(",")]
        
        all_videos = []
        for topic in topic_list:
            videos = await fetch_youtube_videos(topic, max_results=5, duration=duration)
            all_videos.extend(videos)
        
        # If no YouTube videos found, return filtered dummy data
        if not all_videos:
            filtered_fallback = [item for item in fallback_content if item["category"] in topic_list]
            return {
                "success": True,
                "data": filtered_fallback,
                "topics": topic_list,
                "message": "YouTube API quota exceeded. Showing demo content instead.",
                "quota_exceeded": True
            }
        
        return {
            "success": True,
            "data": all_videos,
            "topics": topic_list,
            "message": f"YouTube videos retrieved successfully for {len(topic_list)} topics"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

@router.get("/recommendations/{category}")
async def get_recommendations_by_category(category: str):
    """
    Get intellectual content recommendations by category
    """
    try:
        filtered_data = [item for item in fallback_content if item["category"].lower() == category.lower()]
        
        if not filtered_data:
            raise HTTPException(status_code=404, detail=f"No content found for category: {category}")
        
        return {
            "success": True,
            "data": filtered_data,
            "message": f"Content for {category} category retrieved successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

@router.post("/recommendations/personalized")
async def get_personalized_recommendations(interests: List[str], duration: str = "short"):
    """
    Get personalized intellectual content based on user interests using YouTube API
    """
    try:
        if not interests:
            raise HTTPException(status_code=400, detail="Interests list cannot be empty")
        
        all_videos = []
        for interest in interests:
            videos = await fetch_youtube_videos(interest, max_results=3, duration=duration)
            all_videos.extend(videos)
        
        # If no YouTube videos found, return filtered dummy data
        if not all_videos:
            filtered_dummy = [item for item in intellectual_data if item["category"] in interests]
            return {
                "success": True,
                "data": filtered_fallback,
                "interests": interests,
                "message": "YouTube API quota exceeded. Showing demo content instead.",
                "quota_exceeded": True
            }
        
        return {
            "success": True,
            "data": all_videos,
            "interests": interests,
            "message": f"YouTube videos retrieved successfully for {len(interests)} interests"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get personalized recommendations: {str(e)}")

@router.get("/categories")
async def get_categories():
    """
    Get available content categories
    """
    try:
        categories = list(set([item["category"] for item in fallback_content]))
        return {
            "success": True,
            "data": categories,
            "message": "Categories retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")
