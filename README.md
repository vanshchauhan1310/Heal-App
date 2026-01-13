# Heal-App Boilerplate

This project is a boilerplate for a full-stack application using React Native (Expo) for the frontend and Node.js (TypeScript) for the backend.

## Project Structure

- `frontend/`: React Native application with Expo and TypeScript.
- `backend/`: Node.js Express server with TypeScript.

## Getting Started

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```
   You can then run the app on an emulator or a physical device using the Expo Go app.

## Connecting Frontend to Backend

In `frontend/App.tsx`, the `API_URL` is set to `http://localhost:5000`. 
- **iOS Simulator**: `http://localhost:5000` works.
- **Android Emulator**: Use `http://10.0.2.2:5000`.
- **Physical Device**: Use your computer's local IP address (e.g., `http://192.168.1.5:5000`).
