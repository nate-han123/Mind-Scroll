"""
Test the AI analysis endpoint
"""
import requests
import json

# Test data
test_data = {
    "meals": ["breakfast: oatmeal with fruits", "lunch: grilled chicken salad"],
    "exercises": ["30 minutes jogging", "20 push-ups"],
    "lifestyle": {
        "sleep_hours": 7,
        "water_intake": 8,
        "stress_level": 3
    }
}

print("Testing AI Analysis Endpoint...")
print("=" * 60)

try:
    response = requests.post(
        "http://localhost:8000/generate-summary-from-user-data",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
except requests.exceptions.ConnectionError:
    print("[ERROR] Cannot connect to server!")
    print("Make sure the backend is running on http://localhost:8000")
except Exception as e:
    print(f"[ERROR] {e}")
    print(f"Response text: {response.text if 'response' in locals() else 'N/A'}")

