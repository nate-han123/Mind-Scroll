# 📱 MindScroll Mobile App

Beautiful, crisp, and aesthetic mobile app for MindScroll - Your AI-Powered Health Companion

## ✨ Features

- 🎨 **Modern UI** - Beautiful gradients, animations, and glassmorphism effects
- 🔐 **Secure Authentication** - Login and signup with secure storage
- 📊 **Health Dashboard** - Track your health metrics with real-time updates
- 📝 **Easy Data Entry** - Log food, exercise, and lifestyle activities
- 🤖 **AI Analysis** - Get personalized health insights powered by OpenAI
- 👤 **User Profile** - Manage your health information and goals
- 🌙 **Dark Mode Ready** - Automatic theme support
- 📳 **Haptic Feedback** - Premium tactile interactions
- 🔔 **Push Notifications Ready** - Stay on track with reminders

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- iOS Simulator (for Mac) or Android Studio (for Windows/Mac/Linux)
- Expo Go app on your phone (optional, for testing on real device)

### Installation

1. **Navigate to mobile directory**
   ```bash
   cd src/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   Or use specific platform commands:
   ```bash
   npm run ios      # Run on iOS simulator
   npm run android  # Run on Android emulator
   npm run web      # Run in web browser
   ```

---

## 📱 Testing on Your Phone

### Using Expo Go (Easiest!)

1. **Install Expo Go app** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the dev server**
   ```bash
   cd src/mobile
   npm start
   ```

3. **Scan the QR code**
   - iOS: Use Camera app to scan QR code
   - Android: Use Expo Go app to scan QR code

4. **App loads instantly!** 🎉

---

## 🎨 App Structure

```
src/mobile/
├── app/                      # Expo Router app directory
│   ├── (tabs)/              # Main app tabs
│   │   ├── dashboard.tsx    # Health dashboard
│   │   ├── track.tsx        # Data entry screen
│   │   ├── analysis.tsx     # AI analysis view
│   │   └── profile.tsx      # User profile
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Welcome screen
│   ├── login.tsx            # Login screen
│   └── signup.tsx           # Signup screen
├── config/                   # Configuration
│   └── api.ts               # API client setup
├── constants/               # App constants
│   └── colors.ts            # Color palette & typography
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
├── utils/                   # Utility functions
│   └── storage.ts           # Secure storage helper
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

---

## 🔧 Configuration

### Backend Connection

The app is pre-configured to connect to your Railway backend:

```typescript
// config/api.ts
export const API_BASE_URL = 'https://mind-scroll-production.up.railway.app';
```

To use a different backend, update this URL.

---

## 🎨 Design System

### Color Palette

```typescript
Primary: #6366f1 (Indigo)
Secondary: #8b5cf6 (Purple)
Accent: #ec4899 (Pink)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
```

### Gradients

- **Primary**: Indigo → Purple
- **Sunset**: Amber → Pink
- **Ocean**: Cyan → Blue
- **Forest**: Green → Dark Green
- **Fire**: Red → Orange

### Typography

- **Heading 1**: 32px, Bold
- **Heading 2**: 24px, Bold
- **Heading 3**: 20px, Semi-Bold
- **Body**: 16px, Regular
- **Small**: 14px, Regular
- **Tiny**: 12px, Regular

---

## 📸 Screenshots

### Welcome Screen
- Beautiful gradient background
- Smooth animations
- Quick access to login/signup

### Dashboard
- Health score display
- Quick stats cards
- Today's goals progress
- Recent activity feed

### Track Screen
- Tabbed interface (Food, Exercise, Lifestyle)
- Easy data entry
- Quick add buttons
- Haptic feedback

### Analysis Screen
- AI-powered insights
- Visual health metrics
- Personalized recommendations
- Regenerate option

### Profile Screen
- User information
- Health stats
- Settings options
- Logout functionality

---

## 🔒 Security

- **Secure Storage**: User data stored using `expo-secure-store`
- **HTTPS**: All API calls use secure HTTPS connection
- **Password Security**: Passwords never stored locally
- **Token Management**: Auth tokens securely stored

---

## 🚀 Deployment

### Building for Production

#### iOS

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure build**
   ```bash
   eas build:configure
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

#### Android

```bash
eas build --platform android
```

### Publishing to App Stores

1. **iOS App Store**
   - Requires Apple Developer Account ($99/year)
   - Follow Apple's submission guidelines
   - Use EAS Submit: `eas submit --platform ios`

2. **Google Play Store**
   - Requires Google Play Developer Account ($25 one-time)
   - Follow Google's submission guidelines
   - Use EAS Submit: `eas submit --platform android`

---

## 🛠️ Development Tips

### Hot Reload

The app supports hot reload! Make changes to any file and see them instantly on your device.

### Debug Menu

- **iOS**: Shake device or press `Cmd + D` in simulator
- **Android**: Shake device or press `Cmd + M` in emulator

### Clear Cache

```bash
npm start -- --clear
```

### Reset Metro Bundler

```bash
npm start -- --reset-cache
```

---

## 📦 Key Dependencies

- **expo**: ~51.0.0 - The Expo framework
- **expo-router**: ~3.5.0 - File-based routing
- **react-native**: 0.74.0 - React Native framework
- **expo-linear-gradient**: Gradient backgrounds
- **expo-haptics**: Haptic feedback
- **expo-secure-store**: Secure data storage
- **axios**: HTTP client for API calls
- **@expo/vector-icons**: Icon library

---

## 🐛 Troubleshooting

### App Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

### Connection Issues

1. Make sure Railway backend is running
2. Check API_BASE_URL in `config/api.ts`
3. Verify network connection

### iOS Simulator Issues

```bash
# Reset iOS simulator
xcrun simctl erase all
```

### Android Emulator Issues

```bash
# Cold boot the emulator
adb kill-server
adb start-server
```

---

## 🎯 Next Steps

### Planned Features

- [ ] Camera integration for food photos
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Push notifications
- [ ] Offline mode with sync
- [ ] Data visualization charts
- [ ] Social features
- [ ] Weekly reports
- [ ] Goal setting and tracking

---

## 📝 Notes

- **No Impact on Web App**: This mobile app is completely separate from the web app
- **Shared Backend**: Uses the same Railway API as the web app
- **Shared Database**: Accesses the same MongoDB Atlas database
- **Cross-Platform**: Works on both iOS and Android
- **Easy Updates**: Push changes to GitHub, rebuild with EAS

---

## 🤝 Support

Need help? 

- Check the Expo documentation: https://docs.expo.dev/
- React Native docs: https://reactnative.dev/
- Expo Discord: https://chat.expo.dev/

---

## 🎉 You're All Set!

Your mobile app is ready to go! Start developing, testing on your phone, and building something amazing!

**Happy coding!** 🚀📱✨




