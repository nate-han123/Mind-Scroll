# Mindscroll Project Structure Documentation

This document provides a comprehensive overview of the Mindscroll project structure, architecture, and key components.

## 📁 Project Overview

```
mindscroll/
├── backend/                    # FastAPI Python backend
├── frontend/                   # Next.js React frontend
├── DEPLOYMENT.md              # Deployment guide
├── MOBILE_GUIDE.md            # Mobile app integration guide
├── PROJECT_STRUCTURE.md      # This file
├── README.md                  # Main project documentation
└── start.sh                   # Development startup script
```

## 🏗️ Backend Architecture

### Directory Structure
```
backend/
├── agents/                    # AI agents and orchestration
│   ├── enhanced_orchestrator.py
│   ├── exercise_agent.py
│   ├── food_agent.py
│   ├── goal_generator.py
│   ├── lifestyle_agent.py
│   ├── orchestrator.py
│   └── personalization_generator.py
├── data/                     # Local data storage
│   └── users.json
├── database/                 # Database configuration
│   └── mongodb.py
├── models/                   # Database models
│   └── user.py
├── routes/                   # API routes
│   └── intellectual.py
├── schemas/                  # Pydantic schemas
│   ├── summary.py
│   └── user.py
├── services/                 # Business logic services
│   ├── mongodb_user_service.py
│   ├── sync_mongodb_user_service.py
│   └── user_service.py
├── env.example               # Environment variables template
├── main.py                   # FastAPI application entry point
└── requirements.txt          # Python dependencies
```

### Key Components

#### 1. Main Application (`main.py`)
- **FastAPI app initialization**
- **CORS configuration**
- **Route registration**
- **Authentication endpoints**
- **User management endpoints**
- **Health summary generation**

#### 2. AI Agents (`agents/`)
- **Enhanced Orchestrator**: Coordinates all AI agents
- **Food Agent**: Analyzes food intake and nutrition
- **Exercise Agent**: Evaluates physical activity
- **Lifestyle Agent**: Assesses sleep, stress, screen time
- **Goal Generator**: Creates personalized health goals
- **Personalization Generator**: Creates nicknames and avatars

#### 3. Data Models (`models/`, `schemas/`)
- **User Model**: MongoDB user document structure
- **User Schema**: Pydantic validation schemas
- **Summary Schema**: Health summary data structure

#### 4. Services (`services/`)
- **User Service**: User CRUD operations (local JSON)
- **MongoDB Services**: Database operations (MongoDB Atlas)
- **Authentication**: Login/signup logic

#### 5. Routes (`routes/`)
- **Intellectual Routes**: YouTube API integration
- **Content Recommendations**: Educational video fetching
- **Fallback Content**: Demo content when API unavailable

## 🎨 Frontend Architecture

### Directory Structure
```
frontend/
├── components/               # Reusable React components
│   ├── AgentOutput.tsx
│   ├── Navbar.tsx
│   └── SummaryCard.tsx
├── pages/                    # Next.js pages (routing)
│   ├── _app.tsx
│   ├── comprehensive-profile.tsx
│   ├── dashboard.tsx
│   ├── data-entry.tsx
│   ├── essential-signup.tsx
│   ├── goal-homepage.tsx
│   ├── index.tsx
│   ├── intellectual.tsx
│   ├── login.tsx
│   ├── path-selection.tsx
│   ├── profile.tsx
│   └── signup.tsx
├── src/modules/              # Feature modules
│   └── intellectual/          # Intellectual Path module
│       ├── DurationSelector.jsx
│       ├── fallbackData.js
│       ├── index.jsx
│       ├── InterestSelector.jsx
│       ├── ReelCard.jsx
│       ├── ReelFeed.jsx
│       └── VerticalVideoFeed.jsx
├── styles/                   # Global styles
│   └── globals.css
├── utils/                    # Utility functions
│   └── api.ts
├── next.config.js           # Next.js configuration
├── package.json             # Node.js dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

### Key Components

#### 1. Pages (`pages/`)
- **Index**: Landing page with authentication
- **Essential Signup**: Multi-step student registration
- **Login**: User authentication
- **Path Selection**: Choose between Health and Study paths
- **Goal Homepage**: Display AI-generated goals
- **Data Entry**: Daily activity logging
- **Dashboard**: Health summary and progress
- **Comprehensive Profile**: Profile editing
- **Intellectual**: Study path with educational content

#### 2. Components (`components/`)
- **Navbar**: Navigation with user controls
- **SummaryCard**: Health summary display
- **AgentOutput**: AI agent results display

#### 3. Intellectual Module (`src/modules/intellectual/`)
- **InterestSelector**: Subject selection interface
- **DurationSelector**: Video length preference
- **ReelFeed**: Educational content feed
- **ReelCard**: Individual video display
- **VerticalVideoFeed**: TikTok-style video player
- **FallbackData**: Demo content for offline mode

#### 4. Utilities (`utils/`)
- **API Service**: Backend communication
- **Type Definitions**: TypeScript interfaces

## 🔄 Data Flow

### User Registration Flow
1. **Essential Signup** → Collect student information
2. **AI Goal Generation** → Create personalized health goals
3. **AI Personalization** → Generate nickname and avatar
4. **Path Selection** → Choose Health or Study path
5. **Goal Homepage** → Display personalized goals

### Daily Usage Flow
1. **Login** → Authenticate user
2. **Path Selection** → Choose current focus
3. **Data Entry** → Log daily activities
4. **AI Analysis** → Generate insights and recommendations
5. **Dashboard** → View progress and summaries

### Intellectual Path Flow
1. **Interest Selection** → Choose academic subjects
2. **Duration Selection** → Set video length preference
3. **Content Fetching** → Get YouTube videos or fallback content
4. **Video Playback** → Watch educational content
5. **Progress Tracking** → Save liked/saved content

## 🗄️ Data Storage

### Local Storage (Development)
- **User Data**: `localStorage.getItem('user')`
- **Food Data**: `localStorage.getItem('userFoodData')`
- **Exercise Data**: `localStorage.getItem('userExerciseData')`
- **Lifestyle Data**: `localStorage.getItem('userLifestyleData')`

### Database (Production)
- **MongoDB Atlas**: Cloud NoSQL database
- **User Collection**: User profiles and authentication
- **Progress Collection**: Daily activity logs
- **Goals Collection**: AI-generated health goals

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Health Analysis
- `POST /generate-summary-from-user-data` - Generate health summary
- `GET /user/{user_id}/progress` - Get user progress

### Intellectual Content
- `GET /api/intellectual/recommendations` - Get educational videos
- `GET /api/intellectual/recommendations/personalized` - Personalized content
- `GET /api/intellectual/categories` - Available categories

## 🎯 Key Features

### Student-Focused Design
- **Academic Language**: All text tailored for students
- **Study-Life Balance**: Health tracking for student lifestyle
- **Educational Content**: YouTube integration for learning
- **Student Goals**: AI-generated goals for academic success

### AI-Powered Insights
- **Goal Generation**: Personalized health goals based on profile
- **Daily Analysis**: AI evaluation of food, exercise, lifestyle
- **Recommendations**: Actionable advice for improvement
- **Progress Tracking**: Long-term goal monitoring

### Dual Path System
- **Health Path**: Physical wellness and lifestyle tracking
- **Study Path**: Educational content and intellectual growth
- **Unified Experience**: Seamless switching between paths

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
OPENAI_API_KEY=your_openai_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
MONGODB_URL=your_mongodb_connection_string

# Frontend (if needed)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Dependencies
```json
// Frontend (package.json)
{
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "typescript": "^4.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

```txt
# Backend (requirements.txt)
fastapi==0.104.1
uvicorn==0.24.0
langchain==0.0.350
openai==1.3.0
pymongo==4.15.3
motor==3.3.2
httpx==0.25.2
```

## 🚀 Development Workflow

### Local Development
1. **Backend**: `cd backend && uvicorn main:app --reload`
2. **Frontend**: `cd frontend && npm run dev`
3. **Database**: MongoDB Atlas or local MongoDB

### Code Organization
- **Modular Structure**: Separate concerns into modules
- **Reusable Components**: Shared UI components
- **Type Safety**: TypeScript for frontend, Pydantic for backend
- **Error Handling**: Comprehensive error management
- **Testing**: Unit and integration tests

## 📱 Mobile Considerations

### API Design
- **RESTful Endpoints**: Standard HTTP methods
- **JSON Responses**: Consistent data format
- **Error Handling**: Standardized error responses
- **CORS Configuration**: Cross-origin support

### Data Structure
- **User Profiles**: Comprehensive student information
- **Activity Logs**: Structured daily data
- **AI Insights**: Machine-readable analysis
- **Content Metadata**: Educational video information

## 🔐 Security

### Authentication
- **JWT Tokens**: Secure user sessions
- **Password Hashing**: Secure password storage
- **Input Validation**: Pydantic schema validation
- **CORS Protection**: Cross-origin security

### Data Protection
- **Environment Variables**: Sensitive data protection
- **API Key Management**: Secure key storage
- **Database Security**: MongoDB Atlas security
- **HTTPS Only**: Encrypted communication

## 📊 Monitoring & Analytics

### Backend Monitoring
- **API Response Times**: Performance tracking
- **Error Rates**: Failure monitoring
- **Database Performance**: Query optimization
- **AI Agent Performance**: Model effectiveness

### Frontend Analytics
- **User Engagement**: Page views and interactions
- **Feature Usage**: Path selection and data entry
- **Performance Metrics**: Load times and responsiveness
- **Error Tracking**: Client-side error monitoring

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **AI Agent Testing**: Model output validation
- **Database Testing**: Data persistence testing

### Frontend Testing
- **Component Tests**: React component testing
- **Integration Tests**: Page flow testing
- **API Integration**: Backend communication testing
- **User Experience**: End-to-end testing

## 📈 Performance Optimization

### Backend Optimization
- **Database Indexing**: Query performance
- **Caching**: Response caching
- **Async Operations**: Non-blocking operations
- **API Rate Limiting**: Resource protection

### Frontend Optimization
- **Code Splitting**: Lazy loading
- **Image Optimization**: Compressed assets
- **Bundle Size**: Minimal JavaScript
- **Caching**: Static asset caching

## 🔄 Maintenance

### Regular Updates
- **Dependency Updates**: Security patches
- **Feature Enhancements**: New functionality
- **Bug Fixes**: Issue resolution
- **Performance Improvements**: Optimization

### Monitoring
- **Health Checks**: System status monitoring
- **Error Tracking**: Issue identification
- **User Feedback**: Feature requests
- **Analytics**: Usage patterns

---

**Note:** This project structure is designed for scalability and maintainability. The modular architecture allows for easy feature additions and team collaboration. Regular code reviews and documentation updates are essential for long-term success.
