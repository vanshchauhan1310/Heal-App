# HEAL Unified Wellness API Contract (v1.0)
**Scope:** Universal API for Mobile App, Web, and External Partners (College Team).
**Positioning:** Wellness & Lifestyle Support (Not Medical Diagnosis).
**Scale Target:** 50,000+ Users.
**Base URL:** `https://api.heal-wellness.app/api/v1`

## Strategic Principles
1.  **Statelessness:** All requests must be self-contained (Bearer Token). No session cookies.
2.  **Batching:** Heavy write operations (Log Sync, Risk Assessments) MUST use batch endpoints to minimize round-trips.
3.  **Unified Signatures:** Endpoints are designed to be consumed identically by the HEAL App and future WhatsApp integration.

## Global Standards

### Headers
*   `Content-Type`: `application/json`
*   `Authorization`: `Bearer <SUPABASE_JWT_TOKEN>` (Required for all protected routes)
*   `X-App-Version`: `1.0.0` (For client compatibility checks)

### Response Format (Standardized envelope)
All responses will follow this structure to ensure the frontend can handle errors gracefully.

**Success (200 OK):**
```json
{
  "success": true,
  "data": { ... }, 
  "meta": { "timestamp": "2024-01-21T10:00:00Z" }
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format for 'dob'. Expected YYYY-MM-DD.",
    "details": "..."
  }
}
```

---

## 1. Authentication Module

### Send OTP
*   **Endpoint:** `POST /auth/send-otp`
*   **Rate Limit:** 5 requests / minute / IP
*   **Request:** `{ "phone": "+919876543210" }`
*   **Response:** `{ "success": true, "message": "OTP queued successfully" }`

### Verify OTP (Login)
*   **Endpoint:** `POST /auth/verify-otp`
*   **Request:** `{ "phone": "+919876543210", "token": "123456" }`
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "token": "eyJhbGciOiJIUz...",
        "user": {
           "id": "550e8400-e29b-41d4-a716-446655440000",
           "isNewUser": false
        }
      }
    }
    ```

---

## 2. Onboarding & Screener Module

### Update User Profile & Risk
*   **Endpoint:** `POST /users/profile`
*   **Description:** Saves personal details, calculated risk score, and clinical answers.
*   **Request Body:**
    ```json
    {
      "name": "Ananya Sharma",
      "dob": "2002-05-15",
      "country": "India",         
      "menarcheAge": 13,          
      "height": 165,
      "weight": 60.5,
      "bmi": 22.2,
      "riskScore": 8,
      "riskLevel": "Moderate",
      "symptoms": { "Q1": { "score": 2, "label": "35-45 days" } }
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "assignedPlan": "3-Month HEAL Guided Journey" // Auto-assigned by backend logic
      }
    }
    ```

### Batch Submit Assessment Responses
*   **Endpoint:** `POST /assessments/batch`
*   **Purpose:** Efficiently sync locally cached answers or WhatsApp batched inputs.
*   **Request Body:**
    ```json
    {
      "assessmentId": "PCOS_SCREENER_V1",
      "responses": [
        { "questionId": "Q1", "value": "21–34 days", "score": 0 },
        { "questionId": "Q2", "value": "10-12", "score": 0 }
      ]
    }
    ```
*   **Response:** `{ "success": true, "riskScore": 0, "riskLevel": "Low" }`

### Batch Log Cycles
*   **Endpoint:** `POST /wellness/cycles/batch`
*   **Optimization:** Accepts array to reduce HTTP overhead.
*   **Request:**
    ```json
    {
      "cycles": [
        { "startDate": "2023-11-01", "endDate": "2023-11-05" },
        { "startDate": "2023-12-02", "endDate": "2023-12-06" }
      ]
    }
    ```

---

## 3. Prediction Module

### Get Next Cycle Prediction
*   **Endpoint:** `GET /prediction/:userId`
*   **Caching:** Response cached for 24 hours (unless new log added).
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "userId": "uuid",
        "predictedDate": "2024-01-28",
        "confidenceIntervals": { "lower": "2024-01-26", "upper": "2024-01-30" },
        "skipProbability": 0.05,
        "metrics": {
           "meanCycleLength": 28.5,
           "regularityScore": 90
        }
      }
    }
    ```
