package com.heal.app;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@SpringBootApplication
public class HealBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealBackendApplication.class, args);
    }

    @PostConstruct
    public void initializeFirebase() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseOptions options;
                
                // Try to find the service account key file
                String serviceAccountPath = System.getenv("FIREBASE_CONFIG_PATH");
                if (serviceAccountPath == null) {
                    serviceAccountPath = "src/main/resources/serviceAccountKey.json";
                }

                try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                } catch (IOException e) {
                    // Fallback to default credentials (useful for GCP environments like Cloud Run)
                    System.out.println("Local service account file not found, falling back to default Google credentials...");
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                }

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialized successfully.");
            }
        } catch (IOException e) {
            System.err.println("Critical Error: Could not initialize Firebase: " + e.getMessage());
        }
    }
}
