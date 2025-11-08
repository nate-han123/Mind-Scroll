# Mindscroll Project Structure Documentation

This document provides a comprehensive overview of the Mindscroll project structure, architecture, and key components.

## 📁 Complete Project Overview

```
Mind-Scroll/
├── src/
│   ├── backend/                    # FastAPI Python backend
│   ├── frontend/                   # Next.js React web app
│   └── mobile/                     # React Native mobile app
├── docs/                           # Documentation
├── data/                           # Static assets
├── ARCHITECTURE_DIAGRAM.md         # System architecture diagrams
├── MOBILE_APP_READY.md            # Mobile app setup guide
├── README.md                       # Main documentation
└── Various deployment guides
```

---

## 🏗️ Backend Architecture

### Directory Structure
```
src/backend/
├── agents/                         # AI agents and orchestration
│   ├── enhanced_orchestrator.py   # Main AI coordinator
│   ├── exercise_agent.py          # Exercise analysis
│   ├── food_agent.py              # Nutrition analysis
│   ├── goal_generator.py          # AI goal creation
│   ├── lifestyle_agent.py         # Wellness analysis
│   ├── orchestrator.py            # Basic orchestrator
│   └── personalization_generator.py # Nickname/avatar AI
├── data/                          # Local data storage
│   └── users.json                 # User data (dev mode)
├── database/                      # Database configuration
│   └── mongodb.py                 # MongoDB connection
├── models/                        # Database models
│   └── user.py                    # User model
├── routes/                        # API routes
│   ├── food.py                    # Food analysis endpoints
│   └── intellectual.py            # Educational content
├── schemas/                       # Pydantic schemas
│   ├── summary.py                 # Health summary
│   └── user.py                    # User validation
├── services/                      # Business logic
│   ├── feedback_learning_service.py
│   ├── food_vision_service.py    # Image recognition
│   ├── mongodb_user_service.py   # User CRUD
│   ├── sync_mongodb_user_service.py
│   └── user_service.py            # Local user service
├── config.py                      # Configuration
├── main.py                        # FastAPI app entry
└── requirements.txt               # Python dependencies
```

### Key Backend Files

| File | Purpose | Key Features |
|------|---------|--------------|
| `main.py` | API Gateway | Authentication, routing, CORS, endpoints |
| `agents/enhanced_orchestrator.py` | AI Coordination | Manages all agents, generates summaries |
| `agents/food_agent.py` | Nutrition AI | Analyzes meals, calculates calories |
| `agents/exercise_agent.py` | Exercise AI | Evaluates activities, burns |
| `agents/lifestyle_agent.py` | Wellness AI | Sleep, stress, screen time |
| `agents/goal_generator.py` | Goal Creation | AI-generated personalized goals |
| `routes/food.py` | Food API | Image upload, nutrition analysis |
| `routes/intellectual.py` | Content API | YouTube integration |
| `services/food_vision_service.py` | Image AI | Food photo recognition |
| `services/mongodb_user_service.py` | Database | User management |

---

## 🎨 Frontend Web Architecture

### Directory Structure
```
src/frontend/
├── components/                    # Reusable components
│   ├── AgentOutput.tsx           # Agent results display
│   ├── Navbar.tsx                # Navigation bar
│   └── SummaryCard.tsx           # Summary visualization
├── pages/                         # Next.js routes
│   ├── _app.tsx                  # App wrapper
│   ├── index.tsx                 # Landing page
│   ├── login.tsx                 # Login page
│   ├── signup.tsx                # Signup page
│   ├── essential-signup.tsx      # Detailed signup
│   ├── path-selection.tsx        # Path chooser
│   ├── goal-homepage.tsx         # Goals display
│   ├── data-entry.tsx            # Daily tracking
│   ├── dashboard.tsx             # Health dashboard
│   ├── intellectual.tsx          # Study path
│   ├── profile.tsx               # User profile
│   └── comprehensive-profile.tsx # Extended profile
├── src/modules/                   # Feature modules
│   └── intellectual/             # Study path module
│       ├── index.jsx             # Main entry
│       ├── InterestSelector.jsx  # Subject picker
│       ├── DurationSelector.jsx  # Video length
│       ├── ReelFeed.jsx          # Video feed
│       ├── ReelCard.jsx          # Video card
│       ├── VerticalVideoFeed.jsx # Video player
│       └── fallbackData.js       # Demo content
├── styles/
│   └── globals.css               # Global styles
├── utils/
│   └── api.ts                    # API integration
├── public/                        # Static assets
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS
└── tsconfig.json                 # TypeScript config
```

### Frontend Pages Flow

```
Landing (index.tsx)
    ↓
Signup/Login → Path Selection
                    ↓
        ┌───────────┴────────────┐
        ↓                        ↓
    Health Path             Study Path
        ↓                        ↓
Goal Homepage          Intellectual Content
        ↓                        ↓
Data Entry              Video Feed
        ↓                        
    Dashboard                    
```

---

## 📱 Mobile App Architecture

### Directory Structure
```
src/mobile/
├── app/                           # Expo Router screens
│   ├── _layout.tsx               # Root navigation
│   ├── index.tsx                 # Welcome screen
│   ├── login.tsx                 # Login screen
│   ├── signup.tsx                # Signup screen
│   └── (tabs)/                   # Tab navigation
│       ├── _layout.tsx           # Tab config
│       ├── dashboard.tsx         # Health dashboard
│       ├── track.tsx             # Daily tracking
│       ├── analysis.tsx          # AI insights
│       └── profile.tsx           # User profile
├── config/
│   └── api.ts                    # API configuration
├── utils/
│   └── storage.ts                # Secure storage
├── constants/
│   └── colors.ts                 # Design system
├── types/
│   └── index.ts                  # TypeScript types
├── assets/                        # Images, fonts
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── MOBILE_ARCHITECTURE.md        # Detailed docs
└── QUICK_SETUP.md                # Setup guide
```

### Mobile App Screens

| Screen | File | Purpose |
|--------|------|---------|
| Welcome | `index.tsx` | Landing screen, auto-login check |
| Login | `login.tsx` | User authentication |
| Signup | `signup.tsx` | Account creation |
| Dashboard | `(tabs)/dashboard.tsx` | Health score, stats, goals |
| Track | `(tabs)/track.tsx` | Log meals, exercise, lifestyle |
| Analysis | `(tabs)/analysis.tsx` | AI-generated insights |
| Profile | `(tabs)/profile.tsx` | User info, settings, logout |

### Mobile Configuration Files

| File | Purpose |
|------|---------|
| `config/api.ts` | Backend URL: `https://mind-scroll-eta.vercel.app` |
| `utils/storage.ts` | Expo SecureStore wrapper |
| `constants/colors.ts` | Design system (colors, spacing, typography) |
| `app.json` | Expo SDK 54 configuration |

---

## 📚 Documentation Files

### Root Documentation
```
Mind-Scroll/
├── README.md                      # Main project documentation
├── ARCHITECTURE_DIAGRAM.md        # System architecture with diagrams
├── MOBILE_APP_READY.md           # Mobile setup completion guide
├── architecture-diagram.html      # Interactive HTML diagram
├── DEPLOYMENT_CHECKLIST.md        # Deployment steps
├── MONGODB_ATLAS_SETUP.md        # Database setup
├── MONGODB_SECURITY_SETUP.md     # Database security
├── QUICK_START_ATLAS.md          # Quick MongoDB guide
├── QUICK_DEPLOY.md               # Fast deployment
├── START_SERVER.md               # Local server guide
└── LICENSE.txt                    # License information
```

### Docs Directory
```
docs/
├── DEPLOYMENT.md                  # Production deployment
├── MOBILE_GUIDE.md               # Mobile app development
├── PROJECT_STRUCTURE.md          # This file
├── RAILWAY_DEPLOYMENT.md         # Railway hosting
└── start.sh                      # Startup script
```

### Mobile-Specific Docs
```
src/mobile/
├── MOBILE_ARCHITECTURE.md         # Technical architecture
├── QUICK_SETUP.md                # 5-minute setup guide
└── README.md                     # Mobile app overview
```

---

## 🌐 Deployment Structure

### Production Setup

```
┌─────────────────────────────────────────┐
│   Frontend (Vercel)                     │
│   https://mind-scroll-eta.vercel.app/   │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  │
┌─────────────────▼───────────────────────┐
│   Backend (Vercel/Railway)              │
│   FastAPI + AI Agents                   │
└─────────────────┬───────────────────────┘
                  │
                  │ Database Queries
                  │
┌─────────────────▼───────────────────────┐
│   MongoDB Atlas (Cloud Database)        │
│   User data, goals, progress            │
└─────────────────────────────────────────┘

                  │
┌─────────────────▼───────────────────────┐
│   Mobile App (Expo Go / Built)          │
│   React Native + Expo Router            │
└─────────────────────────────────────────┘
```

### Environment Files

| File | Location | Purpose |
|------|----------|---------|
| `.env` | `src/backend/` | Backend secrets (OpenAI, MongoDB, YouTube API) |
| `railway.env.example` | Root | Railway deployment template |
| `config/api.ts` | `src/mobile/` | Mobile API endpoint |

---

## 🔄 Data Flow Architecture

### User Registration Flow

```
Web/Mobile App
    ↓
POST /auth/signup
    ↓
Backend (main.py)
    ↓
User Service → Create User
    ↓
Goal Generator → AI creates goal
    ↓
Personalization Generator → AI creates nickname/avatar
    ↓
MongoDB Atlas → Save user data
    ↓
Response → User + Goal + Personalization
    ↓
SecureStore/LocalStorage → Save locally
```

### Daily Health Tracking Flow

```
User logs data (Track screen)
    ↓
POST /generate-personalized-summary
    ↓
Enhanced Orchestrator
    ↓
┌────────────┬──────────────┬────────────┐
│ Food Agent │Exercise Agent│Lifestyle   │
│            │              │Agent       │
└────────────┴──────────────┴────────────┘
    ↓            ↓              ↓
OpenAI GPT-4o-mini Analysis
    ↓
Orchestrator Summary
    ↓
Response with insights
    ↓
Save to SecureStore/LocalStorage
    ↓
Display in Dashboard/Analysis
```

---

## 🗃️ Database Schema

### MongoDB Collections

#### Users Collection
```json
{
  "_id": "user-uuid",
  "credentials": {
    "email": "user@example.com",
    "password": "hashed_password"
  },
  "profile": {
    "name": "John Doe",
    "age": 22,
    "gender": "male",
    "weight": 70,
    "height": 175,
    "activity_level": "moderately_active",
    "nickname": "The Academic Achiever",
    "avatar": "🎓"
  },
  "goal": {
    "goal_type": "maintain",
    "target_weight": 70,
    "target_calories_per_day": 2200,
    "goal_description": "AI-generated description"
  },
  "daily_entries": [
    {
      "date": "2024-11-08",
      "meals": ["Breakfast: Oatmeal"],
      "exercises": ["30 min jogging"],
      "lifestyle": {
        "sleep_hours": 7,
        "water_intake": 6,
        "stress_level": 3,
        "screen_time": 4
      }
    }
  ]
}
```

---

## 🎯 API Endpoints

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | Create new account |
| `/auth/login` | POST | User authentication |

### Health Analysis
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/generate-summary-from-user-data` | POST | Get AI analysis (no user) |
| `/generate-personalized-summary` | POST | Get personalized AI analysis |
| `/user/{user_id}/progress` | GET | Get user progress history |

### User Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/user/{user_id}` | GET | Get user profile |
| `/user/profile` | PUT | Update user profile |

### Educational Content
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/intellectual/recommendations` | GET | Get video recommendations |
| `/api/intellectual/recommendations/personalized` | GET | Personalized videos |
| `/api/intellectual/categories` | GET | Available categories |

### Food Analysis
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/food/analyze` | POST | Analyze food image |

---

## 🧩 Component Architecture

### Shared Components (Web & Mobile)

| Component | Web | Mobile | Purpose |
|-----------|-----|--------|---------|
| Navigation | `Navbar.tsx` | Tab navigation | App navigation |
| Summary Display | `SummaryCard.tsx` | Score cards | Health metrics |
| Agent Output | `AgentOutput.tsx` | Analysis cards | AI results |
| Login Form | `login.tsx` | `login.tsx` | Authentication |
| Signup Form | `signup.tsx` | `signup.tsx` | Registration |

---

## 🔐 Security Architecture

### Authentication Layer
- Email/Password authentication
- Secure password hashing
- Session management (JWT potential)

### Data Protection
- **Backend**: Environment variables for API keys
- **Web**: LocalStorage for session data
- **Mobile**: Expo SecureStore for sensitive data
- **Database**: MongoDB Atlas with authentication

### API Security
- CORS configuration
- Input validation (Pydantic)
- Error handling without data leakage

---

## 📊 Technology Stack Summary

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **AI**: LangChain + OpenAI GPT-4o-mini
- **Database**: MongoDB Atlas (PyMongo)
- **Server**: Uvicorn

### Frontend Web
- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: React Hooks
- **Deployment**: Vercel

### Mobile
- **Framework**: React Native
- **Platform**: Expo SDK 54
- **Navigation**: Expo Router
- **Language**: TypeScript
- **Storage**: Expo SecureStore
- **UI**: React Native StyleSheet

### External APIs
- **OpenAI API**: GPT-4o-mini for AI analysis
- **YouTube Data API v3**: Educational content
- **MongoDB Atlas**: Cloud database

---

## 🚀 Development Workflow

### Local Development

**Backend:**
```bash
cd src/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd src/frontend
npm install
npm run dev
```

**Mobile:**
```bash
cd src/mobile
npm install --legacy-peer-deps
npm start
```

### Production Deployment

1. **Backend**: Deploy to Vercel/Railway
2. **Frontend**: Deploy to Vercel
3. **Mobile**: Build with Expo and submit to stores
4. **Database**: MongoDB Atlas (already cloud-hosted)

---

## 📈 Project Statistics

- **Total Files**: 200+
- **Backend Endpoints**: 12+
- **Frontend Pages**: 12
- **Mobile Screens**: 7
- **AI Agents**: 6
- **Documentation Files**: 15+
- **Supported Platforms**: Web, iOS, Android
- **Lines of Code**: ~15,000+

---

## 🎓 Learning Resources

- **Architecture Overview**: `ARCHITECTURE_DIAGRAM.md`
- **Mobile Setup**: `src/mobile/MOBILE_ARCHITECTURE.md`
- **API Integration**: `utils/api.ts` (web), `config/api.ts` (mobile)
- **Backend Logic**: `agents/enhanced_orchestrator.py`
- **Deployment**: `docs/DEPLOYMENT.md`

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time WebSocket updates
- [ ] Push notifications (mobile)
- [ ] Advanced analytics dashboard
- [ ] Social features (community)
- [ ] Gamification system
- [ ] Dark mode support
- [ ] Offline mode
- [ ] Apple Health / Google Fit integration

### Technical Improvements
- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] CI/CD pipeline
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

**Document Version**: 2.0  
**Last Updated**: November 2024  
**Maintainers**: Mind-Scroll Development Team

---

**Note:** This is a living document. As the project evolves, this structure documentation should be updated to reflect new changes, features, and architectural decisions.
