# Heal App - Java Backend (Spring Modulith)

Welcome to the backend service for the Heal App. This project is a production-ready Java backend built with focus on modularity, scalability, and robust testing.

---

## 🚀 Tech Stack

- **Lanuage**: Java 17
- **Framework**: Spring Boot 3.1.5
- **Architecture**: Spring Modulith (Modular Monolith)
- **Database**: Google Firestore (Firebase Admin SDK)
- **Testing**: JUnit 5, AssertJ, Mockito, Spring Modulith Test
- **Build Tool**: Maven
- **Infrastructure**: Docker, Render

---

## 🏛 Architecture: Spring Modulith

The project follows the **Spring Modulith** architectural pattern. Unlike a traditional layered monolith, this project is divided into **functional modules** (bounded contexts) that enforce strict encapsulation.

### Project Structure
```text
src/main/java/com/heal/app/
├── infra/              # Shared infrastructure module (Firebase config)
├── prediction/         # Prediction module (Health logic)
│   ├── internal/       # Encapsulated logic (Service)
│   └── *.java          # Module API (Controller)
└── user/               # User management module
    ├── internal/       # Encapsulated logic & models
    └── *.java          # Module API (Controller, DTOs)
```

### Encapsulation Rules 🛡️
- **Public API**: Only classes in the top-level module package (e.g., `com.heal.app.user`) are visible to other modules.
- **Internal Logic**: Packages named `internal` are strictly private. Spring Modulith will cause test failures if these boundaries are violated.
- **Cross-Module Events**: Modules communicate through events or published public APIs, ensuring clean separation.

---

## 🧪 Testing Strategy (JUnit 5 Suite)

The project includes a multi-layered testing strategy to ensuring reliability.

### 1. Architectural Verification
We use `ApplicationModules.verify()` to ensure the project structure hasn't drifted from the modularity rules. It also generates UML diagrams of the system architecture.
- **Run**: `mvn test -Dtest=ModulithTest`

### 2. Unit Testing
Critical business logic is tested in isolation using **AssertJ** for expressive assertions.
- **Example**: `PredictionServiceTest` verifies algorithms without needing the full Spring Context.

### 3. Web Slice Testing
We use `@WebMvcTest` to test REST endpoints. This ignores the database and uses **Mockito** to mock dependencies, focusing only on the web layer (JSON mapping, HTTP status codes).
- **Example**: `UserControllerTest` verifies the `/v1/me/landing` endpoint.

---

## 📡 API Endpoints

### 👤 User Module
- **GET** `/v1/me/landing?userId={id}`
  - Returns: Profile, Preferences, and Landing Page Summary.
  - Seeding: The app automatically seeds 5 users (`usr_100` to `usr_104`) on startup if the database is empty.

### 🔮 Prediction Module
- **POST** `/api/predict-period`
  - Body: `{ "userId": "...", "screeningId": "..." }`
  - Returns: Predicted next period date.

---

## ☁️ Deployment & Configuration

### Firestore Setup
1. Place your `serviceAccountKey.json` in `src/main/resources/`.
2. For production (Render), use either:
   - **Secret Files**: Set `FIREBASE_CONFIG_PATH` to `/etc/secrets/serviceAccountKey.json`.
   - **Environment Variable**: Paste the JSON content into `FIREBASE_SERVICE_ACCOUNT_JSON`.

### Docker
The project uses a multi-stage Dockerfile based on **Eclipse Temurin 17** (Ubuntu/JRE) to ensure compatibility with Firebase's native gRPC libraries and avoid SIGSEGV crashes.

```bash
docker build -t heal-app-backend .
docker run -p 8080:8080 heal-app-backend
```

---

## 🛠 Useful Commands

- **Run Locally**: `mvn spring-boot:run`
- **Run Tests**: `mvn test`
- **Build Package**: `mvn clean package`
- **Verify Modulith**: `mvn spring-modulith:check` (Requires plugin)
