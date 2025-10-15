# Mindscroll — AI-Powered Student Health & Learning Platform

A comprehensive student-focused health and learning platform that uses AI to help students balance their academic life with physical wellness. Features personalized health goals, educational content, and intelligent insights tailored specifically for student lifestyles.

## 🎯 Key Features

### 🎓 Student-Focused Design
- **Academic Language**: All content tailored for student life
- **Study-Life Balance**: Health tracking optimized for student schedules
- **Educational Content**: YouTube integration for learning and growth
- **Student Goals**: AI-generated health goals for academic success

### 🤖 AI-Powered Insights
- **Personalized Goals**: AI creates custom health goals based on student profile
- **Daily Analysis**: Intelligent evaluation of food, exercise, and lifestyle choices
- **Smart Recommendations**: Actionable advice for student wellness
- **Progress Tracking**: Long-term goal monitoring and motivation

### 🛤️ Dual Path System
- **Health Path**: Physical wellness and lifestyle tracking
- **Study Path**: Educational content and intellectual growth
- **Unified Experience**: Seamless switching between health and learning

## 🏗️ Project Structure

```
mindscroll/
├── backend/                    # FastAPI Python backend
│   ├── agents/                # AI agents and orchestration
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   ├── schemas/               # Data validation
│   └── main.py                # Application entry point
├── frontend/                   # Next.js React frontend
│   ├── pages/                 # Application pages
│   ├── components/            # Reusable components
│   ├── src/modules/           # Feature modules
│   └── utils/                 # Utility functions
├── DEPLOYMENT.md              # Deployment guide
├── MOBILE_GUIDE.md            # Mobile app integration guide
├── PROJECT_STRUCTURE.md       # Detailed project documentation
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **YouTube API Key**: Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
3. **Python 3.8+** and **Node.js 16+**
4. **MongoDB Atlas** (optional, for production)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env and add your API keys:
   # OPENAI_API_KEY=your_openai_api_key_here
   # YOUTUBE_API_KEY=your_youtube_api_key_here
   # MONGODB_URL=your_mongodb_connection_string (optional)
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Quick Start Script

Use the provided startup script to run both services:
```bash
./start.sh
```

## 🎯 User Journey

### 1. Student Registration
- **Essential Signup**: Multi-step form collecting student information
- **AI Goal Generation**: Personalized health goals based on student profile
- **AI Personalization**: Custom nickname and avatar generation
- **Path Selection**: Choose between Health Path and Study Path

### 2. Health Path Experience
- **Goal Homepage**: Display personalized student health goals
- **Daily Tracking**: Log student meals, activities, and lifestyle
- **AI Analysis**: Get intelligent insights and recommendations
- **Progress Dashboard**: Track progress toward health goals

### 3. Study Path Experience
- **Interest Selection**: Choose academic subjects of interest
- **Duration Preference**: Set video length preferences
- **Educational Content**: Watch YouTube videos or fallback content
- **Progress Tracking**: Save and organize educational content

## 🧠 How It Works

### Backend Architecture

The backend uses **LangChain with GPT-4o-mini** for real AI processing:

- **Food Agent**: Analyzes student meals and provides nutritional insights
- **Exercise Agent**: Evaluates physical activities and study breaks
- **Lifestyle Agent**: Assesses sleep, screen time, and stress for student wellness
- **Goal Generator**: Creates personalized health goals for students
- **Personalization Generator**: Creates student-friendly nicknames and avatars

The **Enhanced Orchestrator** coordinates all agents using AI to generate:
- Overall health score (0-10) with student-focused analysis
- Personalized daily summary for student life
- Smart recommendations for academic success and wellness

### API Endpoints

**Authentication:**
- `POST /auth/signup` - Student registration
- `POST /auth/login` - Student authentication
- `GET /user/profile` - Get student profile
- `PUT /user/profile` - Update student profile

**Health Analysis:**
- `POST /generate-summary-from-user-data` - Generate health summary
- `GET /user/{user_id}/progress` - Get student progress

**Educational Content:**
- `GET /api/intellectual/recommendations` - Get educational videos
- `GET /api/intellectual/recommendations/personalized` - Personalized content
- `GET /api/intellectual/categories` - Available subject categories

### Frontend Features

- **Landing Page**: Clean introduction with agent explanations
- **Dashboard**: Real-time visualization of agent outputs and orchestrator summary
- **Responsive Design**: Mobile-friendly with TailwindCSS
- **Smooth Animations**: Fade-in and slide-up effects for better UX

## 🎨 Design System

- **Color Palette**: Light pastels with primary (blue) and secondary (purple) gradients
- **Typography**: Inter font family for clean readability
- **Components**: Modular, reusable React components
- **Animations**: CSS transitions and keyframe animations

## 🔧 Development

### Backend Development

The backend uses FastAPI with:
- Pydantic for data validation
- Modular agent architecture
- JSON-based dummy data (no database required)
- CORS enabled for frontend communication

### Frontend Development

The frontend uses Next.js with:
- TypeScript for type safety
- TailwindCSS for styling
- Recharts for data visualization (ready for future charts)
- Responsive design patterns

## 🧪 Testing the Pipeline

### Complete User Flow

1. **Start Services**: Run both backend and frontend servers
2. **Visit Landing Page**: Go to `http://localhost:3000`
3. **Input Data**: Click on agent buttons to input your data:
   - 🍎 **Food Agent**: Enter your meals for the day
   - 💪 **Exercise Agent**: Log your physical activities
   - 🌱 **Lifestyle Agent**: Set sleep, screen time, and stress levels
4. **AI Processing**: Watch as GPT-4o-mini analyzes your data
5. **View Results**: See color-coded dashboard with personalized insights

### Color-Coded Visual Feedback

- 🟢 **Green**: Excellent performance (scores 8-10)
- 🟡 **Yellow**: Fair performance (scores 6-7)
- 🔴 **Red**: Needs attention (scores below 6)

### API Testing

Test the backend directly:
```bash
# Test with dummy data
curl http://localhost:8000/generate-summary

# Test with user data
curl -X POST http://localhost:8000/generate-summary-from-user-data \
  -H "Content-Type: application/json" \
  -d '{"meals": ["Avocado toast"], "exercises": ["30-min jog"], "lifestyle": {"sleep_hours": 8, "screen_time": 3, "stress_level": 4}}'
```

## 📚 Documentation

### For Developers
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**: Detailed project architecture and components
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Complete deployment guide for production
- **[MOBILE_GUIDE.md](./MOBILE_GUIDE.md)**: Mobile app integration guide

### For Team Members
- **Backend Developer**: Focus on `backend/` directory and API endpoints
- **Frontend Developer**: Focus on `frontend/` directory and React components
- **Mobile Developer**: Use `MOBILE_GUIDE.md` for React Native/Flutter implementation
- **DevOps Engineer**: Use `DEPLOYMENT.md` for production deployment

## 🚀 Production Deployment

### Quick Deployment Options

**Option 1: Separate Deployment (Recommended)**
- **Backend**: Deploy to Railway, Render, or DigitalOcean
- **Frontend**: Deploy to Vercel, Netlify, or Railway
- **Database**: Use MongoDB Atlas for production

**Option 2: Monolithic Deployment**
- **Single Platform**: Deploy both backend and frontend together
- **Docker**: Use provided Dockerfile for containerization
- **Environment**: Set all required environment variables

### Required Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
MONGODB_URL=your_mongodb_connection_string
```

## 📱 Mobile App Development

### React Native Implementation
- Use the provided `MOBILE_GUIDE.md` for step-by-step implementation
- Reuse existing API endpoints
- Implement native features (camera, notifications, biometrics)

### Flutter Implementation
- Follow Flutter guide in `MOBILE_GUIDE.md`
- Use existing backend APIs
- Implement platform-specific features

## 🔧 Development Workflow

### Local Development
1. **Backend**: `cd backend && uvicorn main:app --reload`
2. **Frontend**: `cd frontend && npm run dev`
3. **Database**: Use MongoDB Atlas or local MongoDB

### Code Organization
- **Modular Structure**: Separate concerns into modules
- **Reusable Components**: Shared UI components
- **Type Safety**: TypeScript for frontend, Pydantic for backend
- **Error Handling**: Comprehensive error management

## 🎯 Next Steps for Production

### Immediate Tasks
1. **Deploy Backend**: Follow `DEPLOYMENT.md` guide
2. **Deploy Frontend**: Use Vercel or similar platform
3. **Set Up Database**: Configure MongoDB Atlas
4. **Configure APIs**: Set up OpenAI and YouTube API keys

### Mobile Development
1. **Choose Platform**: React Native or Flutter
2. **Follow Guide**: Use `MOBILE_GUIDE.md` for implementation
3. **Test Integration**: Ensure mobile app works with deployed backend
4. **App Store**: Deploy to iOS App Store and Google Play

### Long-term Enhancements
- **Real-time Features**: WebSocket integration
- **Advanced Analytics**: User behavior tracking
- **Social Features**: Student community and sharing
- **AI Improvements**: More sophisticated health analysis
- **Gamification**: Rewards and achievement system

## 🤝 Team Collaboration

### For Backend Developer
- Focus on API endpoints and database integration
- Implement additional AI agents as needed
- Optimize performance and scalability
- Add comprehensive error handling

### For Frontend Developer
- Enhance UI/UX based on user feedback
- Implement additional features and pages
- Optimize performance and loading times
- Add responsive design improvements

### For Mobile Developer
- Convert web components to mobile components
- Implement native features and optimizations
- Ensure cross-platform compatibility
- Add offline functionality

---

**Built with ❤️ for Student Health & Learning Innovation**

*This project is production-ready and optimized for team collaboration. Use the provided documentation to deploy and extend the platform.*
