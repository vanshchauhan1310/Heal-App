# HEAL App - PCOS & Menstrual Health Tracker 🌿

## 📖 Project Overview
HEAL is a comprehensive mobile application designed to help women manage PCOS (Polycystic Ovary Syndrome) and track their menstrual health. It combines medical screener tools, cycle tracking, and personalized lifestyle guidance into a premium, user-friendly interface.

The project is built as a monorepo containing both the
 **Mobile Frontend** (React Native/Expo) and the
 **Backend API** (Node.js/Express).

---

## 🛠 Tech Stack

### Mobile Frontend (`/frontend`)
- **Framework**: React Native (Expo SDK 52)
- **Language**: JavaScript (ES6+)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Styling**: StyleSheet, `expo-linear-gradient` for premium UI effects
- **Icons**: `@expo/vector-icons` (Ionicons, MaterialCommunityIcons)
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext` pattern)

### Backend API (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Security**: `helmet`, `cors`

---

## 📂 Project Structure

```
HEAL-App/
├── backend/                 # Node.js Server
│   ├── src/
│   │   ├── config/          # Supabase & Env Config
│   │   ├── controllers/     # Business Logic (Auth, User Profile)
│   │   ├── routes/          # API Route Definitions
│   │   └── index.ts         # App Entry Point
│   ├── .env                 # API Keys
│   └── package.json
│
└── frontend/                # React Native App
    ├── assets/              # Images (Intro slides, logos)
    ├── src/
    │   ├── constants/       # Static Data (Questionnaire JSON)
    │   ├── features/        # Feature-based Modules
    │   │   ├── auth/        # Login, OTP Screens
    │   │   ├── home/        # Dashboard (HomeScreen)
    │   │   ├── onboarding/  # Intro Carousel
    │   │   ├── screener/    # Questionnaire Logic & UI
    │   │   └── track/       # Tracking placeholder
    │   ├── navigation/      # AppNavigator & MainTabNavigator
    │   └── services/        # API Client (api.js)
    ├── App.js               # Root Component
    └── package.json
```

---

## 📱 detailed Features Module-by-Module

### 1. Onboarding Flow
- **IntroScreen**: Splash screen with navigation to Onboarding.
- **OnboardingScreen**: A carousel of 3 slides explaining the app's value.
- **Buttons**: Custom gradient buttons for "Get Started" and "Login".

### 2. Authentication (`features/auth`)
- **LoginScreen**: Takes a phone number input. Note: Currently uses dummy authentication for development ease.
- **OTPScreen**: A 6-digit OTP entry screen.
    - **Logic**: Enter `123455` to pass validation successfully.
    - **Backend Integration**: Calls `/api/auth/send-otp` and `/api/auth/verify-otp`.

### 3. PCOS Screener Questionnaire (`features/screener`)
This is the core personalized data intake engine.
- **File**: `QuestionnaireScreen.js`
- **Data Source**: `src/constants/questionnaireData.js`
- **Supported Step Types**:
    1.  **`personal-details`**: Custom form collecting **Name** and **Date of Birth** (using `DateTimePicker`). This data is passed to the Home Screen and Backend.
    2.  **`question`**: Standard multiple-choice questions with associated scores.
    3.  **`calendar`**: A custom-built 3-month calendar view allowing users to tap on dates to log period history. Auto-selects 5 days for convenience on single tap.
    4.  **`bmi`**: An interactive calculator taking Height (cm) and Weight (kg) to compute BMI and determine status (Underweight, Healthy, Overweight, Obese) with color-coded feedback.
- **Risk Calculation**: Sums up scores to categorize user into Low, Moderate, or High Risk.
- **Navigation**: Upon completion, uses `navigation.replace` to prevent going back to the screener.

### 4. Home Dashboard (`features/home`)
- **Dynamic Personalization**: Displays "Hello, [User Name]!".
- **Header**: Gradient card showing current cycle phase (e.g., "Follicular Phase").
- **Profile Access**: Top-right icon to access Profile/Consult settings.
- **Visualizations**:
    - **Cycle Card**: Circular indicator of current day.
    - **Risk Gauge**: Visual representation of the PCOS risk assessment result.
- **Content**: Horizontal scroll views for "Success Stories" and "Learn & Explore".

### 5. Navigation Architecture (`navigation`)
- **`AppNavigator.js`**: Native Stack Navigator handling the linear flow:
    `Intro -> Onboarding -> Login -> OTP -> Questionnaire -> Home`.
- **`MainTabNavigator.js`**: Custom Bottom Tab Navigator.
    - **Layout**: 5 Tabs (Cycle, HEAL, Track, Community, Consult).
    - **Special Feature**: The "Track" button in the center is a custom Floating Action Button (FAB) that sits higher than the rest of the bar for quick access.
    - **Styling**: White background with distinct shadow to match design mocks.

---

## 🔌 Backend API Reference

Base URL: `http://<YOUR_IP>:5000/api`

### Auth Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Initiates login/signup via Supabase. |
| `POST` | `/auth/send-otp` | Sends OTP to phone number. |
| `POST` | `/auth/verify-otp` | Verifies the OTP token. |

### User Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/users/profile` | Updates user metadata (Name, DOB, Height, Weight, BMI). |

**Controller Logic (`userProfile.controller.ts`)**:
Uses `supabase.auth.admin.updateUserById` to securely store user details in the `user_metadata` JSON field in Supabase.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your physical device (Android/iOS)

### 1. Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Configure Environment:
   Create `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   # Use service role key for admin updates if necessary, but keep secure
   SUPABASE_SERVICE_ROLE_KEY=optional_if_using_admin_api
   PORT=5000
   ```
4. Start Server:
   ```bash
   npm run dev
   ```
   *Server should run on Port 5000.*

### 2. Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Configure API:
   Open `src/services/api.js` and update `BASE_URL`:
   ```javascript
   // Replace with your Laptop's private IP address (e.g., from ipconfig)
   const BASE_URL = 'http://192.168.1.5:5000/api'; 
   ```
4. Start App:
   ```bash
   npx expo start --clear
   ```
5. Scan the QR code with the Expo Go app.

---

## 🧩 Troubleshooting

- **"Network request failed"**:
    - Ensure your phone and laptop are on the **same Wi-Fi network**.
    - Check if the IP in `api.js` is correct.
    - Ensure Backend is running (`npm run dev`).
    - Windows Firewall might block port 5000. Allow Node.js through firewall.
- **"File appears to be binary" (Backend)**:
    - This happens if a file was created with incorrect encoding (e.g., UTF-16 via PowerShell `echo`).
    - Fix: Delete the file and recreate it using a pure text editor or VS Code.
- **"Cannot find module"**:
    - Ensure you are importing the correct file path. We recently renamed `user.controller.ts` to `userProfile.controller.ts` to resolve caching issues.

## Login Flow
Enter the Test Phone Number: 9876543210.
Click Continue.
The app will call your backend → Supabase.
Supabase sees it's a test number and "sends" the pre-configured OTP.
On the OTP Screen, enter 123456.
Click Verify.