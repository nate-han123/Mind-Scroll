# Mind-Scroll Mobile App - Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- **Node.js** 16+ installed
- **npm** or **yarn** package manager
- **Expo Go** app on your phone (optional, for testing)

---

## 📱 Setup Steps

### 1. Navigate to Mobile Directory

```bash
cd src/mobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser showing a QR code.

### 4. Test on Your Device

#### Option A: Physical Device (Recommended)

1. Install **Expo Go** from App Store (iOS) or Google Play (Android)
2. Scan the QR code shown in terminal/browser
3. App will load on your device!

#### Option B: Emulator/Simulator

```bash
# iOS (Mac only, requires Xcode)
npm run ios

# Android (requires Android Studio)
npm run android
```

---

## 🌐 Backend Configuration

The app is **already configured** to use the Vercel backend:

```typescript
// config/api.ts
export const API_BASE_URL = 'https://mind-scroll-eta.vercel.app';
```

No additional configuration needed! 🎉

---

## ✅ Verify Setup

### Test Authentication

1. **Open app** on your device
2. **Click "Get Started"**
3. **Fill signup form:**
   - Name: Test User
   - Email: test@example.com
   - Password: testpass123
   - Age: 25
   - Weight: 70 kg
4. **Click "Create Account"**
5. Should navigate to Dashboard!

### Test Daily Tracking

1. **Navigate to "Track" tab** (🎯 icon)
2. **Add a meal:**
   - Tab: Food
   - Input: "Breakfast: Oatmeal with berries"
   - Click "Log Food"
3. **Add exercise:**
   - Tab: Exercise
   - Input: "30 min jogging"
   - Click "Log Exercise"
4. **Set lifestyle:**
   - Tab: Lifestyle
   - Water: 6 glasses
   - Sleep: 7 hours
5. **Click "Get AI Analysis"** button
6. Should show success and save analysis!

### Test AI Analysis

1. **Navigate to "Analysis" tab** (📊 icon)
2. Should see your AI analysis with:
   - Overall health score
   - Nutrition breakdown
   - Exercise summary
   - Lifestyle advice
   - Personalized recommendations

---

## 📂 Project Structure

```
src/mobile/
├── app/                    # Screens (file-based routing)
│   ├── _layout.tsx        # Root navigation
│   ├── index.tsx          # Welcome screen
│   ├── login.tsx          # Login
│   ├── signup.tsx         # Signup
│   └── (tabs)/            # Tab navigation
│       ├── dashboard.tsx  # Main dashboard
│       ├── track.tsx      # Daily tracking
│       ├── analysis.tsx   # AI insights
│       └── profile.tsx    # User profile
├── config/
│   └── api.ts             # Backend URL & Axios config
├── utils/
│   └── storage.ts         # SecureStore wrapper
└── constants/
    └── colors.ts          # Design system
```

---

## 🎨 Features Overview

### 🏠 Dashboard
- Health score display
- Quick stats cards
- Today's goals progress
- Recent activity timeline

### 🎯 Track
- Log meals (food tab)
- Log exercises (exercise tab)
- Track lifestyle (water, sleep, stress)
- Submit for AI analysis

### 📊 Analysis
- Overall health score
- AI-generated summary
- Food analysis
- Exercise analysis
- Lifestyle insights
- Personalized recommendations

### 👤 Profile
- User information
- Health stats
- Goals display
- Settings
- Logout

---

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Start and open iOS simulator
npm run ios

# Start and open Android emulator
npm run android

# Run on web (for quick testing)
npm run web

# Clear cache and restart
npm start -c
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to development server"

**Solution:**
1. Make sure phone and computer are on same WiFi
2. Try `npm start -c` to clear cache
3. Restart Expo Go app

### Issue: "Unable to resolve module"

**Solution:**
```bash
rm -rf node_modules
npm install
npm start -c
```

### Issue: "Network request failed"

**Solution:**
- Check internet connection
- Verify backend URL is accessible
- Check if backend is online: https://mind-scroll-eta.vercel.app/

### Issue: "Build failed on iOS/Android"

**Solution:**
```bash
# Clear cache
rm -rf node_modules
npm cache clean --force
npm install

# For iOS
cd ios && pod install && cd ..

# Start fresh
npm start -c
```

---

## 📱 Backend API Endpoints

The mobile app uses these endpoints from the Vercel backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | Create new account |
| `/auth/login` | POST | User authentication |
| `/generate-personalized-summary` | POST | Get AI health analysis |

All endpoints are **already working** with the deployed backend!

---

## 🎯 Next Steps

### For Development:

1. **Read the Architecture Docs:**
   - `MOBILE_ARCHITECTURE.md` - Complete technical details
   
2. **Customize the App:**
   - Modify colors in `constants/colors.ts`
   - Add new screens in `app/` directory
   - Extend API calls in `config/api.ts`

3. **Add Features:**
   - Push notifications
   - Camera for food photos
   - Charts for progress tracking
   - Dark mode support

### For Production:

1. **Build for iOS:**
   ```bash
   npx expo build:ios
   ```

2. **Build for Android:**
   ```bash
   npx expo build:android
   ```

3. **Submit to App Stores:**
   - Follow Expo docs for publishing
   - Configure app.json with metadata
   - Add required assets (icons, splash screens)

---

## 💡 Tips

1. **Hot Reload:** Changes automatically reload in Expo Go
2. **Debug Menu:** Shake device to open debug menu
3. **Console Logs:** Use `console.log()` - visible in terminal
4. **Network Inspect:** Enable in Expo debug menu
5. **Haptic Feedback:** Test on real device (not in simulator)

---

## 📚 Resources

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **Expo Router:** https://expo.github.io/router/
- **Backend API:** https://mind-scroll-eta.vercel.app/

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts (`npm start`)
- [ ] App loads on device (Expo Go)
- [ ] Can create account (signup works)
- [ ] Can login (authentication works)
- [ ] Can log meals/exercise (tracking works)
- [ ] Can submit data (API integration works)
- [ ] Can view analysis (AI insights display)
- [ ] Can logout (session management works)

---

## 🆘 Need Help?

1. Check `MOBILE_ARCHITECTURE.md` for technical details
2. Review error messages in terminal
3. Test backend directly: https://mind-scroll-eta.vercel.app/
4. Verify Expo Go app is up to date

---

**Happy Coding! 🚀**

The Mind-Scroll mobile app is ready to use with your Vercel backend!

