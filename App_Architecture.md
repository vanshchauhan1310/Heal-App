# HEAL System Architecture (Target: 50k+ Users)

## 1. Executive Summary
This document outlines the scalable architecture for the **HEAL Wellness Platform**. Following the strategic decision to prioritize "Wellness" over "Medical" positioning, the system is designed as a **Stateless**, **Feature-Driven** architecture on **Google Cloud Platform (GCP)** and **Supabase**. It eliminates active session management in favor of lightweight JWT authentication to streamline compliance and scalability.

## 2. Technology Stack

### Mobile Frontend (Client)
*   **Framework:** React Native (Expo SDK 50+)
*   **Language:** TypeScript / JavaScript (ES6+)
*   **State Management:** React Context API (No complex session tracking).
*   **Validation:** First-layer strict schema validation (Zod/Yup).

### Backend API (Server)
*   **Runtime:** Node.js (v20 LTS) with **TypeScript**.
*   **Architecture:** Stateless REST API. **No server-side session storage**.
*   **Infrastructure:** Google Cloud Platform (GCP) for compute/hosting.
*   **Validation:** Second-layer API validation.

### Database & Storage (Persistence)
*   **Service:** Supabase (Managed PostgreSQL on GCP).
*   **Data Model:** Hybrid Relational + Document.
    *   **Relational:** Core User Identity, Auth.
    *   **JSONB (NoSQL):** Questionnaire/Assessment responses (allows flexible schema evolution).
*   **Validation:** Third-layer Database constraints (Check constraints, RLS).

---

## 3. Data Flow & Scalability Strategy

### A. Authentication (Stateless & Secure)
*   **Flow:** Mobile App -> Supabase Auth -> SMS Provider -> Verify.
*   **Scalability:** We verify JWTs (JSON Web Tokens) on the backend without hitting the database for every request. This reduces DB load by 90%.
*   **User ID:** UUID v4 (Primary Key) ensures no collision at scale.

### B. Questionnaire & Write-Heavy Operations
*   **Challenge:** 50k users submitting detailed questionnaires generates massive write spikes.
*   **Strategy:**
    *   **Batch Inserts:** Cycles are sent as a single JSON array and inserted via a single Transaction connection.
    *   **Optimized Payload:** Frontend sends only necessary IDs strings, minimizing bandwidth.

### C. Prediction Engine (Read-Heavy)
*   **Flow:** User opens App -> `GET /api/prediction`.
*   **Optimization:**
    *   **Indexing:** `user_id` and `start_date` columns in `cycles` table are Indexed (B-Tree).
    *   **Query limit:** API fetches only the last 6 months of data, not full history.
    *   **Response Time:** Target < 200ms.

---

## 4. Directory Structure (Modular Monolith)

```
/backend
  /src
    /controllers    # Logic separated from routing (cleaner testing)
    /routes         # Versioned routes (e.g., /api/v1/user)
    /middleware     # Auth, Validation, Error Handling
    /services       # Business interactions (DB, External APIs)
    /utils          # Helper functions (Standardized Responses)
```

## 5. Security & Compliance
*   **Data Encryption:** TLS 1.3 in transit, AES-256 at rest (Supabase default).
*   **API Security:** All endpoints require `Bearer` token header.
*   **Input Validation:** Strict type checking on incoming JSON bodies to prevent injection.
