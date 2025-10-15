from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection"""
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        raise ValueError("MONGODB_URL environment variable not set")
    
    # Connect to MongoDB Atlas with proper SSL configuration
    mongodb.client = AsyncIOMotorClient(
        mongodb_url,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=20000,
        retryWrites=True
    )
    mongodb.database = mongodb.client.mindscroll
    
    # Test the connection
    await mongodb.client.admin.command('ping')
    print("Connected to MongoDB!")

async def close_mongo_connection():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()
        print("Disconnected from MongoDB!")

def get_database():
    """Get database instance"""
    return mongodb.database
