# Mind-Scroll Architecture Diagram

## 🏗️ System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Frontend<br/>Next.js/React]
        MOBILE[Mobile App<br/>React Native/Expo]
    end
    
    subgraph "API Gateway"
        FASTAPI[FastAPI Backend<br/>main.py]
    end
    
    subgraph "AI Processing Layer"
        ORCHESTRATOR[Enhanced Orchestrator<br/>enhanced_orchestrator.py]
        FOODAGENT[Food Agent<br/>food_agent.py]
        EXERCISEAGENT[Exercise Agent<br/>exercise_agent.py]
        LIFESTYLEAGENT[Lifestyle Agent<br/>lifestyle_agent.py]
        GOALGEN[Goal Generator<br/>goal_generator.py]
        PERSONALGEN[Personalization Generator<br/>personalization_generator.py]
        GPT[OpenAI GPT-4o-mini]
    end
    
    subgraph "Business Logic"
        USERSERVICE[User Service<br/>mongodb_user_service.py]
        FOODVISION[Food Vision Service<br/>food_vision_service.py]
        FEEDBACK[Feedback Learning Service<br/>feedback_learning_service.py]
    end
    
    subgraph "External APIs"
        YOUTUBE[YouTube API<br/>intellectual.py]
        OPENAI[OpenAI API]
    end
    
    subgraph "Data Layer"
        MONGODB[(MongoDB Atlas<br/>Cloud Database)]
        LOCALSTORAGE[Browser LocalStorage]
    end
    
    WEB --> FASTAPI
    MOBILE --> FASTAPI
    
    FASTAPI --> ORCHESTRATOR
    FASTAPI --> USERSERVICE
    FASTAPI --> YOUTUBE
    
    ORCHESTRATOR --> FOODAGENT
    ORCHESTRATOR --> EXERCISEAGENT
    ORCHESTRATOR --> LIFESTYLEAGENT
    
    FOODAGENT --> GPT
    EXERCISEAGENT --> GPT
    LIFESTYLEAGENT --> GPT
    GOALGEN --> GPT
    PERSONALGEN --> GPT
    
    USERSERVICE --> MONGODB
    GOALGEN --> USERSERVICE
    PERSONALGEN --> USERSERVICE
    
    YOUTUBE --> OPENAI
    WEB --> LOCALSTORAGE
    MOBILE --> LOCALSTORAGE
    
    ORCHESTRATOR --> GPT
    FOODVISION --> OPENAI
    FEEDBACK --> MONGODB
```

## 🎯 Core Features & File Mapping

### 1. **User Authentication & Management**

```mermaid
graph LR
    A[User Registration] --> B[main.py<br/>/auth/signup]
    B --> C[SyncMongoDBUserService<br/>mongodb_user_service.py]
    C --> D[Goal Generator<br/>goal_generator.py]
    D --> E[AI-Generated Goal]
    E --> F[Personalization Generator<br/>personalization_generator.py]
    F --> G[Nickname & Avatar]
    
    H[User Login] --> I[main.py<br/>/auth/login]
    I --> C
    C --> J[User Profile Data]
    
    K[Profile Update] --> L[main.py<br/>/user/profile]
    L --> C
    C --> D
    
    style A fill:#e1f5ff
    style H fill:#e1f5ff
    style K fill:#e1f5ff
    style E fill:#ffe1e1
    style G fill:#ffe1e1
```

**Files Involved:**
- `src/backend/main.py` (lines 138-229): Authentication endpoints
- `src/backend/services/mongodb_user_service.py`: User CRUD operations
- `src/backend/agents/goal_generator.py`: AI goal generation
- `src/backend/agents/personalization_generator.py`: Nickname/avatar generation
- `src/backend/models/user.py`: User data models
- `src/backend/schemas/user.py`: Validation schemas
- `src/frontend/pages/signup.tsx`: Signup UI
- `src/frontend/pages/login.tsx`: Login UI
- `src/frontend/pages/profile.tsx`: Profile management

---

### 2. **Health Path - Daily Tracking & Analysis**

```mermaid
graph TB
    A[User Enters Daily Data<br/>Meals, Exercise, Lifestyle] --> B[data-entry.tsx]
    B --> C[POST /generate-personalized-summary<br/>main.py]
    C --> D[Enhanced Orchestrator<br/>enhanced_orchestrator.py]
    
    D --> E[Food Agent<br/>food_agent.py]
    D --> F[Exercise Agent<br/>exercise_agent.py]
    D --> G[Lifestyle Agent<br/>lifestyle_agent.py]
    
    E --> H[GPT-4o-mini<br/>Nutrition Analysis]
    F --> I[GPT-4o-mini<br/>Exercise Analysis]
    G --> J[GPT-4o-mini<br/>Wellness Analysis]
    
    H --> K[Orchestrator Summary]
    I --> K
    J --> K
    
    K --> L[Goal Alignment Check]
    L --> M[Personalized Recommendations]
    M --> N[Dashboard Display<br/>dashboard.tsx]
    
    N --> O[SummaryCard.tsx<br/>AgentOutput.tsx]
    
    style A fill:#e1ffe1
    style H fill:#ffe1e1
    style I fill:#ffe1e1
    style J fill:#ffe1e1
    style M fill:#fff5e1
```

**Files Involved:**
- `src/frontend/pages/data-entry.tsx`: Data input form
- `src/frontend/pages/dashboard.tsx`: Results display
- `src/frontend/components/SummaryCard.tsx`: Summary visualization
- `src/frontend/components/AgentOutput.tsx`: Agent results display
- `src/backend/main.py` (lines 276-324): Summary generation endpoint
- `src/backend/agents/enhanced_orchestrator.py`: Coordinates all agents
- `src/backend/agents/food_agent.py`: Analyzes meals
- `src/backend/agents/exercise_agent.py`: Analyzes activities
- `src/backend/agents/lifestyle_agent.py`: Analyzes wellness factors

---

### 3. **Study Path - Intellectual Content**

```mermaid
graph TB
    A[User Selects Interests<br/>& Duration] --> B[intellectual.tsx<br/>index.jsx]
    B --> C[GET /api/intellectual/recommendations<br/>main.py]
    C --> D[Intellectual Routes<br/>routes/intellectual.py]
    
    D --> E{YouTube API<br/>Available?}
    E -->|Yes| F[Fetch Educational Videos]
    E -->|No| G[Fallback Content<br/>fallbackData.js]
    
    F --> H[Video Recommendations]
    G --> H
    
    H --> I[ReelFeed.jsx]
    I --> J[VerticalVideoFeed.jsx]
    J --> K[User Watches Content]
    
    K --> L[Save Progress<br/>LocalStorage]
    
    style A fill:#e1e1ff
    style E fill:#ffe1e1
    style K fill:#e1ffe1
```

**Files Involved:**
- `src/frontend/pages/intellectual.tsx`: Study path entry
- `src/frontend/src/modules/intellectual/index.jsx`: Main intellectual module
- `src/frontend/src/modules/intellectual/InterestSelector.jsx`: Subject selection
- `src/frontend/src/modules/intellectual/DurationSelector.jsx`: Video length preference
- `src/frontend/src/modules/intellectual/ReelFeed.jsx`: Content feed
- `src/frontend/src/modules/intellectual/VerticalVideoFeed.jsx`: Video player
- `src/frontend/src/modules/intellectual/ReelCard.jsx`: Individual video card
- `src/frontend/src/modules/intellectual/fallbackData.js`: Offline content
- `src/backend/routes/intellectual.py`: YouTube API integration

---

### 4. **Food Vision - Image Recognition**

```mermaid
graph LR
    A[User Uploads Food Photo] --> B[POST /api/food/analyze<br/>routes/food.py]
    B --> C[Food Vision Service<br/>food_vision_service.py]
    C --> D[OpenAI Vision API]
    D --> E[Food Identification]
    E --> F[Nutritional Info]
    F --> G[Return to User]
    
    style A fill:#e1ffe1
    style D fill:#ffe1e1
    style F fill:#fff5e1
```

**Files Involved:**
- `src/backend/routes/food.py`: Food analysis endpoint
- `src/backend/services/food_vision_service.py`: Image processing & AI analysis

---

## 📱 Mobile App Architecture

```mermaid
graph TB
    subgraph "Mobile App Structure"
        A[App Root<br/>app/_layout.tsx]
        
        B[Landing<br/>app/index.tsx]
        C[Login<br/>app/login.tsx]
        D[Signup<br/>app/signup.tsx]
        
        E[Tab Navigation<br/>app/tabs/_layout.tsx]
        
        F[Dashboard<br/>app/tabs/dashboard.tsx]
        G[Track<br/>app/tabs/track.tsx]
        H[Analysis<br/>app/tabs/analysis.tsx]
        I[Profile<br/>app/tabs/profile.tsx]
        
        J[API Config<br/>config/api.ts]
        K[Storage Utils<br/>utils/storage.ts]
        L[Types<br/>types/index.ts]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    
    E --> F
    E --> G
    E --> H
    E --> I
    
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> M[Backend API]
    K --> N[AsyncStorage]
    
    style A fill:#e1e1ff
    style E fill:#e1ffe1
    style M fill:#ffe1e1
```

**Files Involved:**
- `src/mobile/app/_layout.tsx`: Root navigation
- `src/mobile/app/(tabs)/_layout.tsx`: Tab navigation
- `src/mobile/app/(tabs)/dashboard.tsx`: Health dashboard
- `src/mobile/app/(tabs)/track.tsx`: Daily tracking
- `src/mobile/app/(tabs)/analysis.tsx`: AI analysis view
- `src/mobile/app/(tabs)/profile.tsx`: User profile
- `src/mobile/config/api.ts`: API configuration
- `src/mobile/utils/storage.ts`: Local data storage
- `src/mobile/types/index.ts`: TypeScript definitions

---

## 🔄 Data Flow Diagrams

### User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>essential-signup.tsx
    participant A as Backend API<br/>main.py
    participant S as User Service<br/>mongodb_user_service.py
    participant G as Goal Generator<br/>goal_generator.py
    participant P as Personalization<br/>personalization_generator.py
    participant D as MongoDB Atlas
    participant AI as OpenAI GPT-4o-mini
    
    U->>F: Fill Registration Form
    F->>A: POST /auth/signup
    A->>S: Check User Exists
    S->>D: Query Database
    D->>S: User Not Found
    S->>G: Generate Goal
    G->>AI: Request Personalized Goal
    AI->>G: Return Goal Data
    G->>S: Save Goal
    S->>P: Generate Nickname & Avatar
    P->>AI: Request Personalization
    AI->>P: Return Nickname & Avatar
    P->>S: Update Profile
    S->>D: Save User Data
    D->>S: Success
    S->>A: Return User Data
    A->>F: User Created + Goal + Personalization
    F->>U: Display Welcome Screen
```

### Daily Health Analysis Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>data-entry.tsx
    participant A as Backend API<br/>main.py
    participant O as Enhanced Orchestrator<br/>enhanced_orchestrator.py
    participant FA as Food Agent
    participant EA as Exercise Agent
    participant LA as Lifestyle Agent
    participant AI as OpenAI GPT-4o-mini
    participant D as Dashboard<br/>dashboard.tsx
    
    U->>F: Enter Daily Data
    F->>A: POST /generate-personalized-summary
    A->>O: Process User Data
    
    par Agent Analysis
        O->>FA: Analyze Meals
        FA->>AI: Get Nutrition Insights
        AI->>FA: Return Analysis
        
        O->>EA: Analyze Exercise
        EA->>AI: Get Exercise Insights
        AI->>EA: Return Analysis
        
        O->>LA: Analyze Lifestyle
        LA->>AI: Get Wellness Insights
        AI->>LA: Return Analysis
    end
    
    FA->>O: Food Results
    EA->>O: Exercise Results
    LA->>O: Lifestyle Results
    
    O->>AI: Generate Personalized Summary
    AI->>O: Return Summary & Recommendations
    O->>A: Complete Analysis
    A->>F: Return Results
    F->>D: Display Dashboard
    D->>U: Show Personalized Insights
```

### Educational Content Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>intellectual.tsx
    participant A as Backend API<br/>main.py
    participant I as Intellectual Routes<br/>routes/intellectual.py
    participant Y as YouTube API
    participant FB as Fallback Data<br/>fallbackData.js
    participant V as Video Player<br/>VerticalVideoFeed.jsx
    
    U->>F: Select Interests & Duration
    F->>A: GET /api/intellectual/recommendations
    A->>I: Fetch Content
    
    alt YouTube API Available
        I->>Y: Request Videos
        Y->>I: Return Video List
    else YouTube API Unavailable
        I->>FB: Get Fallback Content
        FB->>I: Return Demo Videos
    end
    
    I->>A: Video Recommendations
    A->>F: Return Content List
    F->>V: Load Videos
    V->>U: Display Video Feed
    U->>V: Watch & Interact
    V->>F: Save Progress (LocalStorage)
```

---

## 🗂️ Complete File Structure with Responsibilities

### Backend Files

| File | Primary Responsibility | Key Features |
|------|----------------------|-------------|
| `main.py` | API Gateway & Route Coordination | Authentication, Health Analysis, User Management |
| **Agents** | | |
| `enhanced_orchestrator.py` | Coordinate all AI agents | Personalized summary generation, goal alignment |
| `orchestrator.py` | Basic orchestration (legacy) | Simple agent coordination |
| `food_agent.py` | Food analysis | Meal evaluation, calorie estimation, nutrition scoring |
| `exercise_agent.py` | Exercise analysis | Activity tracking, calorie burn estimation |
| `lifestyle_agent.py` | Wellness analysis | Sleep, stress, screen time evaluation |
| `goal_generator.py` | AI goal creation | Personalized health goals based on profile |
| `personalization_generator.py` | User personalization | Nickname & avatar generation |
| **Services** | | |
| `mongodb_user_service.py` | User CRUD operations | Database interactions, user management |
| `sync_mongodb_user_service.py` | Synchronous DB operations | Blocking database calls |
| `user_service.py` | Legacy local storage (JSON) | File-based user management |
| `food_vision_service.py` | Image recognition | Food photo analysis with OpenAI Vision |
| `feedback_learning_service.py` | Learning from feedback | User feedback processing |
| **Routes** | | |
| `routes/intellectual.py` | Educational content | YouTube API integration, content recommendations |
| `routes/food.py` | Food analysis endpoints | Image upload, nutrition analysis |
| **Models & Schemas** | | |
| `models/user.py` | Database models | MongoDB document structure |
| `schemas/user.py` | Validation schemas | Request/response validation |
| `schemas/summary.py` | Summary data structures | Health summary format |
| **Database** | | |
| `database/mongodb.py` | Database configuration | MongoDB connection setup |

### Frontend Files

| File | Primary Responsibility | Key Features |
|------|----------------------|-------------|
| **Pages** | | |
| `pages/index.tsx` | Landing page | Welcome screen, navigation |
| `pages/signup.tsx` | User registration | Account creation form |
| `pages/essential-signup.tsx` | Detailed signup | Multi-step registration |
| `pages/login.tsx` | Authentication | User login form |
| `pages/path-selection.tsx` | Path chooser | Health vs Study path selection |
| `pages/goal-homepage.tsx` | Goal display | AI-generated goals showcase |
| `pages/data-entry.tsx` | Daily tracking | Meal, exercise, lifestyle input |
| `pages/dashboard.tsx` | Health dashboard | AI analysis results display |
| `pages/intellectual.tsx` | Study path | Educational content access |
| `pages/profile.tsx` | User profile | Profile viewing/editing |
| `pages/comprehensive-profile.tsx` | Detailed profile | Extended profile management |
| **Components** | | |
| `components/Navbar.tsx` | Navigation bar | Header with user controls |
| `components/SummaryCard.tsx` | Summary display | Health score visualization |
| `components/AgentOutput.tsx` | Agent results | Individual agent output display |
| **Intellectual Module** | | |
| `modules/intellectual/index.jsx` | Main module entry | Intellectual path coordinator |
| `modules/intellectual/InterestSelector.jsx` | Interest picker | Subject selection UI |
| `modules/intellectual/DurationSelector.jsx` | Duration picker | Video length preference |
| `modules/intellectual/ReelFeed.jsx` | Content feed | Scrollable video feed |
| `modules/intellectual/ReelCard.jsx` | Video card | Individual video display |
| `modules/intellectual/VerticalVideoFeed.jsx` | Video player | TikTok-style player |
| `modules/intellectual/fallbackData.js` | Demo content | Offline video data |
| **Utils** | | |
| `utils/api.ts` | API communication | Backend integration |

### Mobile App Files

| File | Primary Responsibility | Key Features |
|------|----------------------|-------------|
| `app/_layout.tsx` | Root navigation | App structure setup |
| `app/index.tsx` | Landing screen | Welcome & navigation |
| `app/login.tsx` | Mobile login | Authentication |
| `app/signup.tsx` | Mobile signup | Registration |
| `app/(tabs)/_layout.tsx` | Tab navigation | Bottom tab setup |
| `app/(tabs)/dashboard.tsx` | Mobile dashboard | Health metrics display |
| `app/(tabs)/track.tsx` | Mobile tracking | Daily data entry |
| `app/(tabs)/analysis.tsx` | Mobile analysis | AI insights view |
| `app/(tabs)/profile.tsx` | Mobile profile | User settings |
| `config/api.ts` | API configuration | Backend endpoints |
| `utils/storage.ts` | Local storage | AsyncStorage wrapper |
| `types/index.ts` | Type definitions | TypeScript types |

---

## 🎨 Feature Map

### Health Path Features

```mermaid
mindmap
  root((Health Path))
    Daily Tracking
      Food Logging
        Manual Entry
        Photo Analysis
      Exercise Logging
        Activity Type
        Duration
        Intensity
      Lifestyle Tracking
        Sleep Hours
        Screen Time
        Stress Level
    AI Analysis
      Food Agent
        Calorie Count
        Nutrition Score
        Dietary Advice
      Exercise Agent
        Calories Burned
        Activity Quality
        Exercise Tips
      Lifestyle Agent
        Wellness Score
        Sleep Quality
        Stress Management
      Orchestrator
        Overall Health Score
        Daily Summary
        Personalized Recommendations
        Goal Alignment
        Motivation Message
    Progress Tracking
      Historical Data
      Trend Analysis
      Goal Progress
      Achievements
```

### Study Path Features

```mermaid
mindmap
  root((Study Path))
    Content Discovery
      Interest Selection
        Academic Subjects
        Skills
        Hobbies
      Duration Preference
        Short 5-10 min
        Medium 10-20 min
        Long 20+ min
      Content Sources
        YouTube API
        Fallback Content
    Content Consumption
      Video Feed
        Vertical Scrolling
        TikTok-style UI
        Like/Save
      Video Player
        Embedded YouTube
        Playback Controls
      Progress Tracking
        Watch History
        Saved Videos
        Liked Content
    Personalization
      Interest-based
      Duration-based
      Learning Style
      Time Availability
```

### User Management Features

```mermaid
mindmap
  root((User Management))
    Authentication
      Signup
        Email/Password
        Profile Information
        Health Goals
        Interests
      Login
        Email Verification
        Password Authentication
      Session Management
        JWT Tokens
        LocalStorage
    Profile
      Basic Info
        Name, Age, Gender
        Weight, Height
        Activity Level
      Health Data
        Medical Conditions
        Dietary Restrictions
        Primary Health Goal
      AI Personalization
        Generated Nickname
        Custom Avatar
        Personal Goals
      Intellectual Interests
        Subjects
        Learning Style
        Time Availability
    Data Storage
      MongoDB Atlas
        User Profiles
        Goals
        Progress History
      LocalStorage
        Session Data
        Cached Data
        User Preferences
```

---

## 🔐 Security & Data Flow

```mermaid
graph TB
    subgraph "Security Layer"
        A[CORS Protection] --> B[Input Validation<br/>Pydantic Schemas]
        B --> C[Authentication<br/>JWT/Email-Password]
        C --> D[Environment Variables<br/>API Keys Protection]
    end
    
    subgraph "Data Flow"
        E[User Input] --> F[Frontend Validation]
        F --> G[API Request]
        G --> H[Backend Validation]
        H --> I[Business Logic]
        I --> J[Database/AI Processing]
        J --> K[Response Formatting]
        K --> L[Frontend Display]
    end
    
    A --> G
    B --> H
    C --> H
    D --> I
    
    style A fill:#ffe1e1
    style B fill:#ffe1e1
    style C fill:#ffe1e1
    style D fill:#ffe1e1
```

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        A[Vercel<br/>Frontend Hosting] --> B[Railway/Render<br/>Backend Hosting]
        B --> C[MongoDB Atlas<br/>Cloud Database]
        B --> D[OpenAI API]
        B --> E[YouTube API]
    end
    
    subgraph "Development Environment"
        F[localhost:3000<br/>Next.js Dev Server] --> G[localhost:8000<br/>FastAPI Dev Server]
        G --> H[MongoDB Atlas<br/>or Local MongoDB]
        G --> D
        G --> E
    end
    
    style A fill:#e1ffe1
    style B fill:#e1e1ff
    style C fill:#fff5e1
    style F fill:#e1ffe1
    style G fill:#e1e1ff
```

---

## 📊 Technology Stack

| Layer | Technologies | Purpose |
|-------|-------------|---------|
| **Frontend Web** | Next.js, React, TypeScript, TailwindCSS | Responsive web interface |
| **Frontend Mobile** | React Native, Expo, TypeScript | Native mobile apps |
| **Backend** | FastAPI, Python 3.8+, Uvicorn | REST API server |
| **AI/ML** | LangChain, OpenAI GPT-4o-mini | Natural language processing |
| **Database** | MongoDB Atlas, PyMongo, Motor | Cloud data storage |
| **External APIs** | YouTube Data API v3, OpenAI API | Content & AI services |
| **Authentication** | JWT, Pydantic | Secure user sessions |
| **Deployment** | Vercel, Railway, Docker | Production hosting |

---

## 🎯 Key Architectural Decisions

### 1. **Microservices-Inspired Agent Architecture**
- Each agent (Food, Exercise, Lifestyle) is independent
- Orchestrator coordinates agents without tight coupling
- Easy to add new agents or modify existing ones

### 2. **Dual Storage Strategy**
- **MongoDB Atlas**: Production user data, goals, progress
- **LocalStorage**: Client-side caching, session management
- Enables offline functionality and reduces API calls

### 3. **Dual Path System**
- **Health Path**: Physical wellness tracking
- **Study Path**: Educational content consumption
- Unified user experience with separate feature sets

### 4. **AI-First Approach**
- Goal generation powered by GPT-4o-mini
- Personalized recommendations based on user context
- Natural language analysis for health insights

### 5. **Fallback Systems**
- Fallback content when YouTube API fails
- Basic calculations when AI is unavailable
- Graceful degradation ensures system reliability

### 6. **Mobile-First API Design**
- RESTful endpoints work for web and mobile
- JSON responses for easy parsing
- CORS enabled for cross-platform access

---

## 📈 Future Architecture Enhancements

```mermaid
graph TB
    A[Current Architecture] --> B[Planned Enhancements]
    
    B --> C[Real-time Features<br/>WebSockets]
    B --> D[Advanced Analytics<br/>ML Models]
    B --> E[Social Features<br/>Community]
    B --> F[Gamification<br/>Achievements]
    B --> G[Offline Mode<br/>Service Workers]
    B --> H[Notifications<br/>Push Services]
    
    style A fill:#e1ffe1
    style B fill:#fff5e1
    style C fill:#e1e1ff
    style D fill:#e1e1ff
    style E fill:#e1e1ff
    style F fill:#e1e1ff
    style G fill:#e1e1ff
    style H fill:#e1e1ff
```

---

## 🔑 Key Takeaways

### Architecture Strengths
✅ **Modular Design**: Easy to maintain and extend  
✅ **AI-Powered**: Personalized user experience  
✅ **Scalable**: Cloud-native with MongoDB Atlas  
✅ **Flexible**: Dual path system for different user needs  
✅ **Cross-Platform**: Web, mobile, and API support  
✅ **Resilient**: Fallback mechanisms for reliability  

### Component Responsibilities
- **Backend**: Business logic, AI processing, data management
- **Frontend Web**: Desktop/tablet user interface
- **Frontend Mobile**: Native mobile experience
- **AI Agents**: Specialized analysis and recommendations
- **External APIs**: Extended functionality (videos, advanced AI)

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Generated For**: Mind-Scroll Architecture Understanding

