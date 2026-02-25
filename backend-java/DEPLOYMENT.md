# Deployment Guide - Heal App Java Backend

This guide outlines how to deploy the Spring Boot backend to production.

## Prerequisites
- Docker installed
- Google Cloud SDK (gcloud) installed (for Cloud Run)
- Your `serviceAccountKey.json` from Firebase

## Option 1: Deploy to Google Cloud Run (Recommended)

Since the app already uses Firebase, Google Cloud Run is the easiest and most cost-effective way to deploy.

### 1. Build and Push to Google Container Registry
Run these commands from the `backend-java` directory:

```bash
# 1. Set your Project ID
PROJECT_ID="your-google-cloud-project-id"

# 2. Build the Docker image
docker build -t gcr.io/$PROJECT_ID/heal-backend:v1 .

# 3. Push to Container Registry
docker push gcr.io/$PROJECT_ID/heal-backend:v1
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy heal-backend \
  --image gcr.io/$PROJECT_ID/heal-backend:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="FIREBASE_CONFIG_PATH=/secrets/serviceAccountKey.json"
```

> **Note on Secrets**: For real production, use **Google Cloud Secret Manager** to mount the `serviceAccountKey.json` as a volume or inject it via environment variables.

---

## Option 2: Deploy to Render (Recommended for Secret Files)

Render allows you to upload "Secret Files" which are mounted to the container.

1.  **Create Secret File**:
    *   In Render Dashboard, go to your **Service** > **Environment**.
    *   Under **Secret Files**, click **Add Secret File**.
    *   **Filename**: `serviceAccountKey.json`
    *   **Contents**: Paste your entire JSON key file.
2.  **Add Environment Variable**:
    *   In the same **Environment** tab, add an Environment Variable:
    *   **Key**: `FIREBASE_CONFIG_PATH`
    *   **Value**: `/etc/secrets/serviceAccountKey.json`
3.  **Deployment**:
    *   Render will automatically build your `Dockerfile` from the root or the `backend-java` subdirectory.

---

## Local Production Build
If you just want to create a production JAR file locally:

```bash
mvn clean package -DskipTests
# The JAR will be in target/heal-app-backend-1.0-SNAPSHOT.jar
```

To run the JAR:
```bash
java -jar target/heal-app-backend-1.0-SNAPSHOT.jar
```

## Security Reminders
- **NEVER** commit your `serviceAccountKey.json` to public version control.
- Ensure `src/main/resources/serviceAccountKey.json` is in your `.gitignore` (which it should be by default if you followed the setup).
- Use `GOOGLE_APPLICATION_CREDENTIALS` environment variable in production if possible, as it is the standard way for Google Cloud libraries to find credentials.
