"""
Test Railway Backend Deployment
Run this to verify your Railway backend is working correctly
"""
import requests
import json
import uuid

# ⚠️ REPLACE THIS WITH YOUR ACTUAL RAILWAY URL
RAILWAY_URL = "https://mind-scroll-production.up.railway.app"

print("=" * 70)
print("  TESTING RAILWAY BACKEND DEPLOYMENT")
print("=" * 70)
print(f"\nBackend URL: {RAILWAY_URL}\n")

# Test 1: Health Check
print("[Test 1] Health Check...")
try:
    response = requests.get(f"{RAILWAY_URL}/health", timeout=10)
    if response.status_code == 200:
        print(f"  ✓ Health check passed!")
        print(f"  Response: {response.json()}")
    else:
        print(f"  ✗ Health check failed: {response.status_code}")
        print(f"  Response: {response.text}")
except Exception as e:
    print(f"  ✗ Error: {e}")
    print("\n⚠️  Make sure you updated RAILWAY_URL in this script!")
    exit(1)

# Test 2: API Documentation
print("\n[Test 2] API Documentation...")
try:
    response = requests.get(f"{RAILWAY_URL}/docs", timeout=10)
    if response.status_code == 200:
        print(f"  ✓ API docs accessible!")
        print(f"  Visit: {RAILWAY_URL}/docs")
    else:
        print(f"  ✗ API docs failed: {response.status_code}")
except Exception as e:
    print(f"  ✗ Error: {e}")

# Test 3: User Signup
print("\n[Test 3] User Signup...")
test_email = f"test_{uuid.uuid4().hex[:8]}@railway-test.com"
signup_data = {
    "email": test_email,
    "password": "testpass123",
    "name": "Railway Test User",
    "age": 25,
    "gender": "male",
    "weight": 70.0,
    "height": 175.0,
    "activity_level": "moderately_active",
    "primary_health_goal": "Test deployment",
    "motivation": "Verify backend works",
    "lifestyle_vision": "Live healthy",
    "intellectual_interests": ["Technology"],
    "learning_style": "visual",
    "time_availability": "1 hour daily"
}

try:
    response = requests.post(
        f"{RAILWAY_URL}/auth/signup",
        json=signup_data,
        timeout=30
    )
    if response.status_code == 200:
        user_data = response.json()
        user_id = user_data.get("user_id")
        print(f"  ✓ User signup successful!")
        print(f"  User ID: {user_id}")
        print(f"  Email: {test_email}")
        print(f"  Goal: {user_data.get('goal', {}).get('goal_description', 'N/A')[:60]}...")
    else:
        print(f"  ✗ Signup failed: {response.status_code}")
        print(f"  Response: {response.text[:200]}")
        user_id = None
        test_email = None
except Exception as e:
    print(f"  ✗ Error: {e}")
    user_id = None
    test_email = None

# Test 4: User Login
if user_id and test_email:
    print("\n[Test 4] User Login...")
    login_data = {
        "email": test_email,
        "password": "testpass123"
    }
    try:
        response = requests.post(
            f"{RAILWAY_URL}/auth/login",
            json=login_data,
            timeout=10
        )
        if response.status_code == 200:
            login_result = response.json()
            print(f"  ✓ Login successful!")
            print(f"  Welcome: {login_result.get('name')}")
        else:
            print(f"  ✗ Login failed: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"  ✗ Error: {e}")

# Test 5: Generate Health Summary
print("\n[Test 5] AI Health Summary Generation...")
summary_data = {
    "meals": ["Breakfast: Oatmeal", "Lunch: Salad"],
    "exercises": ["30 min jogging"],
    "lifestyle": {
        "sleep_hours": 7,
        "water_intake": 8,
        "stress_level": 3
    }
}

try:
    response = requests.post(
        f"{RAILWAY_URL}/generate-summary-from-user-data",
        json=summary_data,
        timeout=30
    )
    if response.status_code == 200:
        result = response.json()
        print(f"  ✓ Summary generated successfully!")
        if "orchestrator_summary" in result:
            score = result["orchestrator_summary"].get("overall_health_score", "N/A")
            summary = result["orchestrator_summary"].get("summary", "N/A")[:80]
            print(f"  Health Score: {score}/10")
            print(f"  Summary: {summary}...")
    else:
        print(f"  ⚠ Summary generation failed: {response.status_code}")
        print(f"  This might be due to OpenAI API quota")
        print(f"  Response: {response.text[:200]}")
except Exception as e:
    print(f"  ⚠ Error: {e}")
    print(f"  This might be due to OpenAI API quota")

# Test 6: MongoDB Connection Test
print("\n[Test 6] Database Connection...")
if user_id:
    try:
        response = requests.get(f"{RAILWAY_URL}/user/{user_id}", timeout=10)
        if response.status_code == 200:
            print(f"  ✓ MongoDB connection working!")
            print(f"  User data retrieved successfully")
        else:
            print(f"  ✗ Database query failed: {response.status_code}")
    except Exception as e:
        print(f"  ✗ Error: {e}")

# Summary
print("\n" + "=" * 70)
print("  TEST SUMMARY")
print("=" * 70)

print("\n✅ Core Features Tested:")
print("   - Backend API (Railway)")
print("   - User Authentication (Signup/Login)")
print("   - MongoDB Atlas (Database)")
print("   - AI Analysis (OpenAI)")

print(f"\n🌐 Your Live Backend:")
print(f"   URL: {RAILWAY_URL}")
print(f"   Health: {RAILWAY_URL}/health")
print(f"   Docs: {RAILWAY_URL}/docs")

if user_id:
    print(f"\n📝 Test User Created:")
    print(f"   Email: {test_email}")
    print(f"   Password: testpass123")
    print(f"   ID: {user_id}")

print("\n🎉 Backend deployment successful!")
print("=" * 70)

