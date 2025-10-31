"""
Test the generate-personalized-summary endpoint directly
"""
import requests
import json

# Make sure you have a valid user_id from your MongoDB
test_data = {
    "user_id": "test-user-id",  # Replace with a real user_id from your database
    "meals": ["Breakfast: Oatmeal with fruits", "Lunch: Chicken salad"],
    "exercises": ["30 min jogging", "20 push-ups"],
    "lifestyle": {
        "sleep_hours": 7,
        "water_intake": 8,
        "stress_level": 3
    }
}

print("Testing /generate-personalized-summary endpoint...")
print("=" * 60)

try:
    response = requests.post(
        "http://localhost:8000/generate-personalized-summary",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("[SUCCESS] Endpoint working!")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"[ERROR] Response: {response.text}")
    
except requests.exceptions.ConnectionError:
    print("[ERROR] Cannot connect to backend server!")
    print("Is the backend running on http://localhost:8000?")
    print("\nTo start backend:")
    print("  cd src/backend")
    print("  uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    
except requests.exceptions.Timeout:
    print("[ERROR] Request timed out!")
    print("Backend is taking too long to respond")
    
except Exception as e:
    print(f"[ERROR] {e}")
    if 'response' in locals():
        print(f"Response text: {response.text}")

