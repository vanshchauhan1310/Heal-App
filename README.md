# HEAL Wellness Platform - PCOS & Menstrual Health 🌿

> **Positioning**: A comprehensive **Wellness & Lifestyle Platform** for women's health, focusing on PCOS management, cycle tracking, and holistic care.
> **Scale Target**: Designed for 50,000+ concurrent users with a stateless, scalable architecture.

---

## 📖 Executive Summary
HEAL is a cross-platform mobile application that empowers women to take control of their menstrual and metabolic health. Unlike generic period trackers, HEAL provides:
1.  **Clinical-Grade Screening**: Logic aligned with Rotterdam Criteria (Cycle + Androgen + Metabolic risk).
2.  **Holistic Care Plans**: Auto-assigned Lifestyle, Guided, or Clinical plans based on risk score.
3.  **Community & Support**: A safe space for shared experiences and expert validation.
4.  **Privacy-First Design**: Stateless backend architecture ensuring data security and compliance.

The project is structured as a **Monorepo** containing the Mobile Client (`frontend`) and the API Server (`backend`).

---

## 🛠 Technology Stack

### A. Mobile Frontend (`/frontend`)
*   **Framework**: React Native (Expo SDK 52)
*   **Language**: JavaScript / TypeScript
*   **Navigation**: React Navigation v6 (Stack + Bottom Tabs + Custom FAB)
*   **State Management**: React Context API (`UserContext`) - *State kept lightweight for performance.*
*   **UI/UX**:
    *   `expo-linear-gradient`: Premium visual aesthetics.
    *   `react-native-safe-area-context`: Adaptive layouts for notched devices.
    *   `@expo/vector-icons`: Consistent iconography.
*   **Network**: Custom `api.js` service layer with Bearer Token authentication.

### B. Backend API (`/backend`)
*   **Runtime**: Node.js v20 (LTS)
*   **Framework**: Express.js (Stateless REST API)
*   **Language**: TypeScript (Strict typing for reliability)
*   **Validation**: **Zod** schema validation middleware (Input sanitization).
*   **Security**:
    *   `helmet`: HTTP Header security.
    *   `cors`: Cross-Origin Resource Sharing control.
    *   `express-rate-limit`: Protection against DDOS/Spam (`100 req/15min`).
*   **Database**: **Supabase** (Managed PostgreSQL)
*   **Authentication**: Supabase Auth (Store-less JWT verification).

---

## 📱 detailed Feature Breakdown

### 1. Onboarding & Authentication
*   **Intro Flow**: Immersive 3-slide carousel explaining the value proposition.
*   **Login**: Phone number-based authentication via OTP (One Time Password).
    *   *Dev Mode*: Use phone `9876543210` and OTP `123456`.
*   **Stateless Auth**: The app stores the JWT in `AsyncStorage` and sends it in the `Authorization: Bearer <token>` header for every request.

### 2. Clinical PCOS Screener (The Core Engine)
A sophisticated 4-stage data intake process located in `features/screener/QuestionnaireScreen.js`.
*   **Stage 1: Personal Profile**
    *   Captures Name, Date of Birth, **Country**, and **Age of Menarche**.
    *   *Validation*: Ensures age consistency.
*   **Stage 2: Clinical Questions (Rotterdam Aligned)**
    *   **Section A**: Cycle Pattern (Irregularity, Oligomenorrhea).
    *   **Section B**: Androgen Excess (Hirsutism, Acne, Hair Loss).
    *   **Section C**: Metabolic Risks (Weight gain, Fatigue, Family History).
    *   **Section D**: Quality of Life Impact.
*   **Stage 3: Interactive Calendar**
    *   User taps dates to log last 3 months of period history.
    *   *Smart Logic*: Auto-fills 5 days when a single date is selected (simulating average flow).
*   **Stage 4: BMI Calculator**
    *   Real-time calculation from Height/Weight.
    *   Classifies into: *Underweight, Healthy, Overweight, Obese*.

### 3. Risk Engine & Triage
*   **Scoring Logic**: Sums weighted scores from all answers (0-3 points each).
*   **Triage Categories**:
    *   🟢 **Low Risk (0-6)**: Lifestyle Guidance Plan.
    *   🟡 **Moderate Risk (7-13)**: 3-Month HEAL Guided Journey.
    *   🔴 **High Risk (14+)**: Clinical Care Plan (+ Referral).

### 4. Home Ecosystem (`features/home`)
*   **Cycle Tracker**: Visual "Day X of 28" circular indicator.
*   **Daily Logging**: Quick-add modal for Mood, Symptoms (Cramps, Bloating), and Sleep.
*   **Insights**: "Did you know?" cards tailored to the user's current cycle phase.
*   **Quick Actions**: One-tap access to "Log Period", "Consult Doctor", "Community".

---

## 🔌 API Architecture (Stateless)

The backend follows a strict **Controller-Service-Repository** pattern.

### Key Endpoints (`v1`)
| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/send-otp` | Triggers SMS via Supabase/Firebase. |
| **Auth** | `POST` | `/auth/verify-otp` | Returns JWT Session Token. |
| **User** | `POST` | `/users/profile` | Updates clinically relevant profile data. |
| **Wellness** | `POST` | `/wellness/logs` | Saves daily symptom logs. |
| **Wellness** | `POST` | `/wellness/cycles` | Syncs historic period dates. |
| **Assessment**| `POST` | `/assessments/batch` | Batch uploads questionnaire answers. |

*Refer to `API_Contract.md` for full JSON schemas.*

---

## 🚀 Installation & Setup Guide

### Prerequisites
*   Node.js (v18+)
*   Expo Go App (on mobile)
*   Git

### Step 1: Backend Setup
1.  Navigate to folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create `.env` file in `/backend`:
    ```env
    PORT=5000
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_KEY=your-anon-key
    ```
4.  Run Server:
    ```bash
    npm run dev
    ```
    *Output should confirm: `Server running on port 5000`*

### Step 2: Frontend Setup
1.  Navigate to folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure IP Address**:
    *   Open `src/services/api.js`.
    *   Replace `192.168.x.x` with your machine's **LAN IP** (find using `ipconfig` or `ifconfig`).
    *   *Note: `localhost` will NOT work on a physical phone.*
4.  Start Expo:
    ```bash
    npx expo start --clear
    ```
5.  Scan the QR code with your phone.

---

## 🧩 Contribution & Standards

1.  **Code Style**:
    *   **Frontend**: Functional Components + Hooks. meaningful variable names (`isLoading`, `handleSubmit`).
    *   **Backend**: Async/Await controllers with `try/catch` blocks.
2.  **Validation**:
    *   All new backend routes **MUST** use the `validate()` middleware with a Zod schema.
3.  **Commits**: Use conventional commits (e.g., `feat: add calendar logic`, `fix: navigation crash`).

---

## 🔒 Security & Compliance
*   **Data Minimization**: We only store what is clinically necessary.
*   **Encryption**: All API traffic must use HTTPS in production.
*   **Rate Limiting**: Configured to prevent abuse of the OTP system.

---
*Built by the HEAL Team*