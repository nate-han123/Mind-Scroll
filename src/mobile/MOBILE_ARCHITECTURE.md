# Mind-Scroll Mobile App Architecture

## 🏗️ Overview

The Mind-Scroll mobile app is built with **React Native** and **Expo**, providing a native cross-platform experience for iOS and Android. It mirrors the web app functionality while optimizing for mobile interactions and native features.

### Key Technologies
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build tools
- **TypeScript** - Type safety and better DX
- **Expo Router** - File-based navigation
- **Axios** - HTTP client for API calls
- **Expo SecureStore** - Secure data storage
- **Expo Linear Gradient** - Beautiful UI gradients
- **Expo Haptics** - Tactile feedback

---

## 📱 App Architecture

### Architecture Pattern: **Lightweight Client-Server**

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ UI Components│  │  Navigation  │  │    Storage   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                     API Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Axios Client│  │  Interceptors│  │   Endpoints  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Backend (Shared with Web)            │
│         https://mind-scroll-eta.vercel.app/              │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
src/mobile/
├── app/                          # Expo Router file-based navigation
│   ├── _layout.tsx              # Root layout with navigation config
│   ├── index.tsx                # Landing/Welcome screen
│   ├── login.tsx                # Login screen
│   ├── signup.tsx               # Signup screen
│   └── (tabs)/                  # Tab navigation group
│       ├── _layout.tsx          # Tab bar configuration
│       ├── dashboard.tsx        # Health dashboard
│       ├── track.tsx            # Daily tracking
│       ├── analysis.tsx         # AI analysis results
│       └── profile.tsx          # User profile & settings
│
├── config/
│   └── api.ts                   # API configuration & Axios setup
│
├── utils/
│   └── storage.ts               # SecureStore wrapper utilities
│
├── constants/
│   └── colors.ts                # Design system (colors, spacing, typography)
│
├── types/
│   └── index.ts                 # TypeScript type definitions
│
├── package.json                 # Dependencies & scripts
└── app.json                     # Expo configuration
```

---

## 🎯 Core Features & Implementation

### 1. **Authentication Flow**

#### Files:
- `app/index.tsx` - Landing screen with auto-login check
- `app/login.tsx` - Email/password login
- `app/signup.tsx` - User registration
- `utils/storage.ts` - User data persistence

#### Flow:
```
┌─────────────┐
│ App Launch  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐      Yes    ┌──────────────┐
│ User in Storage?├──────────────►  Dashboard   │
└────────┬────────┘              └──────────────┘
         │ No
         ▼
┌─────────────────┐
│  Welcome Screen │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌────────┐
│ Login │ │ Signup │
└───┬───┘ └───┬────┘
    │         │
    └────┬────┘
         ▼
  ┌─────────────┐
  │ POST /auth  │
  │   /login    │
  │   /signup   │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Save to     │
  │ SecureStore │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Navigate   │
  │ to Dashboard│
  └─────────────┘
```

**Code Example:**
```typescript
// app/login.tsx
const handleLogin = async () => {
  const response = await api.post('/auth/login', {
    email, password
  });
  await storage.saveUser(response.data);
  router.replace('/(tabs)');
};
```

---

### 2. **Daily Tracking (Track Screen)**

#### File: `app/(tabs)/track.tsx`

#### Features:
- ✅ **Tabbed Interface** - Food, Exercise, Lifestyle
- ✅ **Local Data Collection** - Store meals & exercises in state
- ✅ **Lifestyle Metrics** - Water intake, sleep, screen time, stress
- ✅ **AI Analysis Button** - Submit all data to backend

#### Data Flow:
```
User Input → Local State → Submit Button → API Call → Backend Processing → AI Analysis → Save to Storage → Display Results
```

#### Implementation Details:

**State Management:**
```typescript
const [meals, setMeals] = useState<string[]>([]);
const [exercises, setExercises] = useState<string[]>([]);
const [waterGlasses, setWaterGlasses] = useState(0);
const [sleepHours, setSleepHours] = useState('7');
const [stressLevel, setStressLevel] = useState(3);
const [screenTime, setScreenTime] = useState('3');
```

**API Submission:**
```typescript
const handleSubmitData = async () => {
  const payload = {
    user_id: user.user_id,
    meals: meals.length > 0 ? meals : ['No meals logged'],
    exercises: exercises.length > 0 ? exercises : ['No exercises logged'],
    lifestyle: {
      sleep_hours: parseFloat(sleepHours) || 7,
      water_intake: waterGlasses,
      stress_level: stressLevel,
      screen_time: parseFloat(screenTime) || 3,
    },
  };

  const response = await api.post('/generate-personalized-summary', payload);
  await storage.set('latest_analysis', JSON.stringify(response.data));
};
```

**UI Tabs:**
- 🍎 **Food Tab** - Text input for meals, quick add buttons
- 💪 **Exercise Tab** - Text input for activities, popular exercises
- 🌱 **Lifestyle Tab** - Water counter, sleep input, stress slider

---

### 3. **Dashboard Screen**

#### File: `app/(tabs)/dashboard.tsx`

#### Features:
- ✅ **Health Score Display** - Overall score from AI analysis
- ✅ **Quick Stats Cards** - Calories, burned, nutrition, wellness
- ✅ **Today's Goals** - Progress bars for daily targets
- ✅ **Recent Activity** - Timeline of logged data
- ✅ **Pull to Refresh** - Reload latest analysis

#### Data Sources:
```typescript
// Load user data from SecureStore
const user = await storage.getUser();

// Load latest AI analysis from SecureStore
const analysisData = await storage.get('latest_analysis');
const parsed = JSON.parse(analysisData);

// Update UI with real data
setHealthScore(parsed.orchestrator_summary?.overall_health_score);
setCalories(parsed.food_agent?.calories);
setCaloriesBurned(parsed.exercise_agent?.calories_burned);
```

#### Visual Hierarchy:
```
┌─────────────────────────────────────┐
│         Gradient Header              │
│  Hello, [User Name]!                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Your Health Score: 8.5/10 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Quick Stats Grid             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐ │
│  │Cals  │ │Burned│ │Nutrit│ │Well│ │
│  └──────┘ └──────┘ └──────┘ └────┘ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Today's Goals                │
│  [████████░░] Meals     3/4          │
│  [██████░░░░] Exercise  45/60 min    │
│  [████████░░] Water     6/8 glasses  │
└─────────────────────────────────────┘
```

---

### 4. **Analysis Screen**

#### File: `app/(tabs)/analysis.tsx`

#### Features:
- ✅ **Overall Health Score** - Large display with gradient
- ✅ **AI Summary** - Personalized daily summary
- ✅ **Agent Breakdowns** - Food, Exercise, Lifestyle details
- ✅ **Recommendations** - Actionable AI suggestions
- ✅ **Regenerate Button** - Fetch new analysis

#### Data Flow:
```
Component Mount → Load from Storage → Display Analysis
                ↓
    User Clicks "Generate" → API Call → Save to Storage → Display
```

#### UI Sections:
```
┌─────────────────────────────────────┐
│   🎯 Overall Health Score Card      │
│        8.5/10                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   💬 AI Summary                     │
│   "Your nutrition is excellent..."  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   🍎 Nutrition Analysis             │
│   Calories: 1850 kcal               │
│   Score: 8/10                       │
│   "Great balanced meals today!"     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   💪 Exercise Analysis              │
│   Burned: 300 kcal                  │
│   "Good workout session!"           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   🌱 Lifestyle Analysis             │
│   Wellness Score: 7/10              │
│   "Consider reducing screen time"   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   💡 Recommendations                │
│   ✓ Stay hydrated                   │
│   ✓ Maintain sleep schedule         │
│   ✓ Add more protein                │
└─────────────────────────────────────┘
```

---

### 5. **Profile Screen**

#### File: `app/(tabs)/profile.tsx`

#### Features:
- ✅ **User Avatar** - First letter of name
- ✅ **Health Information** - Age, weight, height, gender
- ✅ **User Goals** - Display primary health goal
- ✅ **Settings Options** - Notifications, privacy, help
- ✅ **Logout** - Clear storage & navigate to welcome

---

## 🔧 Configuration Files

### 1. **API Configuration** (`config/api.ts`)

```typescript
import axios from 'axios';

// Vercel Backend URL (Production)
export const API_BASE_URL = 'https://mind-scroll-eta.vercel.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth token if needed
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### 2. **Storage Utilities** (`utils/storage.ts`)

```typescript
import * as SecureStore from 'expo-secure-store';

export const storage = {
  async set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  
  async get(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  
  async saveUser(user: any) {
    await this.set('user', JSON.stringify(user));
  },
  
  async getUser() {
    const userString = await this.get('user');
    return userString ? JSON.parse(userString) : null;
  },
  
  async clearAll() {
    await this.delete('user');
    await this.delete('auth_token');
    await this.delete('latest_analysis');
  },
};
```

### 3. **Design System** (`constants/colors.ts`)

```typescript
export const Colors = {
  light: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#f6ad55',
    error: '#f56565',
    text: '#2d3748',
    textSecondary: '#718096',
    background: '#f7fafc',
    surface: '#edf2f7',
    border: '#e2e8f0',
    placeholder: '#a0aec0',
  },
  gradients: {
    primary: ['#667eea', '#764ba2'],
    ocean: ['#667eea', '#48bb78'],
    fire: ['#f6ad55', '#f56565'],
    sunset: ['#f6ad55', '#764ba2'],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  small: {
    fontSize: 14,
    fontWeight: '400',
  },
};
```

---

## 🔄 Data Flow Architecture

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                            │
└─────────────────────────────────────────────────────────────┘

1. Authentication
   ┌──────┐     ┌─────────┐     ┌─────────────┐
   │ Open │ --> │ Signup/ │ --> │ Save User   │
   │ App  │     │  Login  │     │ to Storage  │
   └──────┘     └─────────┘     └─────────────┘

2. Daily Tracking
   ┌──────────┐     ┌───────────┐     ┌──────────┐
   │ Navigate │ --> │ Log Food/ │ --> │ Submit   │
   │ to Track │     │ Exercise  │     │ to API   │
   └──────────┘     └───────────┘     └──────────┘
                                              │
                                              ▼
                                       ┌──────────┐
                                       │ Backend  │
                                       │   AI     │
                                       │ Analysis │
                                       └──────────┘
                                              │
                                              ▼
                                       ┌──────────┐
                                       │   Save   │
                                       │ Analysis │
                                       │to Storage│
                                       └──────────┘

3. View Results
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Navigate │ --> │ Load from│ --> │ Display  │
   │Dashboard/│     │ Storage  │     │ Results  │
   │ Analysis │     └──────────┘     └──────────┘
   └──────────┘

4. Profile Management
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ View     │ --> │ Update   │ --> │ Logout & │
   │ Profile  │     │ Settings │     │  Clear   │
   └──────────┘     └──────────┘     └──────────┘
```

---

## 🚀 API Integration

### Endpoints Used

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/auth/signup` | POST | Create account | email, password, name, age, weight, height, etc. | user_id, name, goal |
| `/auth/login` | POST | Authenticate user | email, password | user data + goal |
| `/generate-personalized-summary` | POST | Get AI analysis | user_id, meals, exercises, lifestyle | Full analysis with agent outputs |

### Example API Call

```typescript
// Track Screen - Submit Daily Data
const response = await api.post('/generate-personalized-summary', {
  user_id: 'user-uuid',
  meals: [
    'Breakfast: Oatmeal with berries',
    'Lunch: Grilled chicken salad',
    'Dinner: Salmon with vegetables'
  ],
  exercises: [
    '30 min jogging',
    '20 min strength training'
  ],
  lifestyle: {
    sleep_hours: 7.5,
    water_intake: 7,
    stress_level: 3,
    screen_time: 4
  }
});

// Response Structure:
{
  food_agent: {
    calories: 1850,
    nutrition_score: 8.5,
    comment: "Excellent balanced meals!"
  },
  exercise_agent: {
    calories_burned: 350,
    note: "Great workout today!"
  },
  lifestyle_agent: {
    wellness_score: 7.5,
    advice: "Good sleep, but reduce screen time"
  },
  orchestrator_summary: {
    overall_health_score: 8.2,
    summary: "Fantastic day! You're making great progress...",
    recommendations: [
      "Continue your balanced diet",
      "Add 10 more minutes of exercise",
      "Reduce screen time before bed"
    ],
    goal_progress: "You're 85% aligned with your goals!",
    motivation: "Keep up the amazing work!"
  }
}
```

---

## 📊 State Management

### Local State Strategy

The app uses **React Hooks** for state management:

```typescript
// Component State
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
const [meals, setMeals] = useState<string[]>([]);

// Effects for Data Loading
useEffect(() => {
  loadUserData();
  loadAnalysisData();
}, []);

// Async Operations
const loadUserData = async () => {
  const userData = await storage.getUser();
  setUser(userData);
};
```

### Persistent Storage

| Key | Content | Where Used |
|-----|---------|------------|
| `user` | User profile & authentication data | All screens |
| `latest_analysis` | Most recent AI analysis | Dashboard, Analysis |
| `auth_token` | JWT token (if implemented) | API calls |

---

## 🎨 UI/UX Design Principles

### 1. **Native Feel**
- ✅ Expo Haptics for tactile feedback
- ✅ Native navigation patterns
- ✅ Platform-specific styling
- ✅ Smooth animations

### 2. **Gradient-First Design**
- Primary gradient: Purple to Blue (`#667eea` → `#764ba2`)
- Used in headers, buttons, score cards
- Creates premium, modern feel

### 3. **Mobile-Optimized Interactions**
- Large touch targets (min 44x44 pts)
- Pull-to-refresh on Dashboard
- Swipeable tabs
- Haptic feedback on actions
- Loading states on all async operations

### 4. **Accessibility**
- Readable font sizes
- High contrast ratios
- Icon + text labels
- Clear visual hierarchy

---

## 🔐 Security

### Data Protection
- ✅ **Expo SecureStore** for sensitive data (user, tokens)
- ✅ **HTTPS** for all API calls
- ✅ **Timeout** handling (30s)
- ✅ **Error interception** for failed requests

### Best Practices
```typescript
// Never log sensitive data
console.log('User:', user.email); // ❌ Bad
console.log('Login successful'); // ✅ Good

// Clear storage on logout
await storage.clearAll();

// Validate input before API calls
if (!email || !password) {
  Alert.alert('Error', 'Please fill all fields');
  return;
}
```

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "expo": "~49.0.0",
  "expo-router": "^2.0.0",
  "react": "18.2.0",
  "react-native": "0.72.0",
  "typescript": "^5.0.0"
}
```

### UI & Interaction
```json
{
  "expo-linear-gradient": "~12.3.0",
  "expo-haptics": "~12.4.0",
  "@expo/vector-icons": "^13.0.0"
}
```

### Data & Storage
```json
{
  "axios": "^1.6.0",
  "expo-secure-store": "~12.3.0"
}
```

---

## 🚀 Running the Mobile App

### Development

```bash
# Navigate to mobile directory
cd src/mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Or run directly on platform
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser (for testing)
```

### Testing on Physical Device

1. **Install Expo Go** app from App Store/Play Store
2. **Scan QR code** shown in terminal
3. **App loads** and connects to Vercel backend automatically

---

## 🎯 Key Differences from Web App

| Feature | Web App | Mobile App |
|---------|---------|------------|
| Navigation | Next.js Router | Expo Router (file-based) |
| Storage | LocalStorage | Expo SecureStore |
| Styling | TailwindCSS | React Native StyleSheet |
| Interactions | Mouse/Keyboard | Touch + Haptics |
| Build | Static export | Native binary |
| Distribution | Web hosting | App Stores |

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Push Notifications** - Daily reminders
- [ ] **Camera Integration** - Food photo upload
- [ ] **Offline Mode** - Work without internet
- [ ] **Charts & Graphs** - Progress visualization
- [ ] **Apple Health Integration** - Sync health data
- [ ] **Google Fit Integration** - Android health sync
- [ ] **Dark Mode** - System theme support
- [ ] **Biometric Auth** - Face ID / Fingerprint

### Technical Improvements
- [ ] **Redux/Zustand** - Centralized state management
- [ ] **React Query** - Better data fetching
- [ ] **Animated** - More fluid animations
- [ ] **Code Push** - OTA updates
- [ ] **Sentry** - Error tracking
- [ ] **Analytics** - User behavior tracking

---

## 🎓 Architecture Patterns Used

### 1. **Component-Based Architecture**
- Reusable UI components
- Props-driven design
- Separation of concerns

### 2. **Hooks Pattern**
- `useState` for local state
- `useEffect` for side effects
- Custom hooks for reusable logic

### 3. **Async/Await Pattern**
- All API calls use async/await
- Error handling with try/catch
- Loading states for UX

### 4. **Storage Abstraction**
- Wrapper around SecureStore
- Consistent API across app
- Easy to mock for testing

---

## 📝 Code Quality

### TypeScript Usage
```typescript
// Strong typing for API responses
interface AnalysisResponse {
  food_agent: {
    calories: number;
    nutrition_score: number;
    comment: string;
  };
  orchestrator_summary: {
    overall_health_score: number;
    summary: string;
    recommendations: string[];
  };
}

// Type-safe state
const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
```

### Error Handling
```typescript
try {
  const response = await api.post('/endpoint', data);
  // Success handling
} catch (error: any) {
  console.error('Error:', error);
  Alert.alert(
    'Error Title',
    error.response?.data?.detail || 'Generic error message'
  );
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
```

---

## 🎉 Summary

The Mind-Scroll mobile app is a **lightweight**, **native-feeling** health tracking application that:

✅ Shares the same backend API as the web app  
✅ Provides seamless authentication and data sync  
✅ Offers native mobile interactions (haptics, gestures)  
✅ Stores data securely with Expo SecureStore  
✅ Displays AI-powered health insights beautifully  
✅ Works cross-platform (iOS & Android)  

**Backend:** https://mind-scroll-eta.vercel.app/  
**Architecture:** Lightweight client with server-side AI processing  
**State:** Local component state + SecureStore persistence  
**Navigation:** Expo Router (file-based)  
**Styling:** React Native StyleSheet with design system  

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Author:** Mind-Scroll Development Team

