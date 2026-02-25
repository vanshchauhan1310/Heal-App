# User Service v0 - Java Backend

This service handles user data storage in Firestore and exposes a read endpoint for the Landing Page Summary.

## Tech Stack
- Java 17
- Spring Boot 3.1.5
- Firebase Admin SDK (Firestore)
- Lombok

## API Endpoints

### Get Landing Page Summary
- **Endpoint**: `GET /v1/me/landing?userId={userId}`
- **Description**: Returns the profile, preferences, and landing page summary for the specified user.
- **Example**: `GET /v1/me/landing?userId=usr_100`

## Firestore Schema Structure

### Root Collection: `users`
- **Document ID**: `{userId}` (e.g., `usr_123`)
- **Fields**:
  ```json
  {
    "user_id": "usr_123",
    "schema_version": 1,
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "profile": { "name": "Priya" },
    "preferences": { "daily_checkin_time": "20:30" },
    "landing_page_summary": {
      "risk": { "level": "medium", "score": 62 },
      "heal_journey": null,
      "next_yoga": null,
      "cycle": { "last_period_start": "2026-02-01", "last_period_end": "2026-02-06" },
      "pad_usage": { "status": "transitioning" }
    }
  }
  ```

### Subcollections under `users/{userId}`

#### 1. `assessment_logs`
- **Document ID**: `{assessmentId}`
- **Fields**:
  ```json
  {
    "assessment_id": "asmt_001",
    "questionnaire_version": "pcos_v1",
    "answers": {},
    "result": {}
  }
  ```

#### 2. `period_logs`
- **Document ID**: `{periodLogId}`
- **Fields**:
  ```json
  {
    "period_log_id": "per_001",
    "action": "start",
    "date": "2026-02-01"
  }
  ```

#### 3. `yoga_attendance_logs`
- **Document ID**: `{attendanceId}`
- **Fields**:
  ```json
  {
    "attendance_id": "yog_001",
    "attended": true
  }
  ```

#### 4. `pad_logs`
- **Document ID**: `{padLogId}`
- **Fields**:
  ```json
  {
    "pad_log_id": "pad_001",
    "action": "status_update",
    "pad_status": "transitioning"
  }
  ```

## How to Setup Firestore

1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Enable Firestore**: In the build menu, select "Firestore Database" and click "Create Database".
3. **Generate Service Account Key**:
   - Go to Project Settings > Service accounts.
   - Click "Generate new private key".
   - Download the JSON file.
4. **Place Service Account Key**:
   - Rename the file to `serviceAccountKey.json`.
   - Place it in `backend-java/src/main/resources/`.
5. **Run Application**: Run the Spring Boot application. The `DataSeedingService` will automatically populate the stub data on startup if it doesn't already exist.
