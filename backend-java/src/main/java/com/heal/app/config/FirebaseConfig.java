package com.heal.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options = null;

            // Method 1: Try to initialize from a full JSON string in environment variables (Very reliable for Render/Railway)
            String jsonConfig = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
            if (jsonConfig != null && !jsonConfig.isEmpty()) {
                System.out.println("Attempting to initialize Firebase from FIREBASE_SERVICE_ACCOUNT_JSON env var...");
                try (ByteArrayInputStream is = new ByteArrayInputStream(jsonConfig.getBytes(StandardCharsets.UTF_8))) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(is))
                            .build();
                    System.out.println("Success: Firebase initialized from JSON string.");
                } catch (Exception e) {
                    System.err.println("Failed to initialize from JSON string: " + e.getMessage());
                }
            }

            // Method 2: Try to find the service account key file (Used for Render Secret Files)
            if (options == null) {
                String serviceAccountPath = System.getenv("FIREBASE_CONFIG_PATH");
                if (serviceAccountPath == null) {
                    serviceAccountPath = "src/main/resources/serviceAccountKey.json";
                }

                System.out.println("Attempting to initialize Firebase from file path: " + serviceAccountPath);
                try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                    System.out.println("Success: Firebase initialized from file: " + serviceAccountPath);
                } catch (IOException e) {
                    System.err.println("File not found or unreadable at: " + serviceAccountPath);
                }
            }

            // Method 3: Fallback to Google Application Default Credentials (Only works on GCP)
            if (options == null) {
                System.out.println("Falling back to Google Application Default Credentials...");
                try {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                    System.out.println("Success: Firebase initialized from Application Default Credentials.");
                } catch (IOException e) {
                    throw new IOException("Critical Error: No Firebase credentials found. Please set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CONFIG_PATH.", e);
                }
            }

            FirebaseApp.initializeApp(options);
        }
        return FirestoreClient.getFirestore();
    }
}
