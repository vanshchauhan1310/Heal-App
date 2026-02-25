package com.heal.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options = null;

            // 1. Try JSON String Env Var
            String jsonConfig = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
            if (jsonConfig != null && !jsonConfig.isEmpty()) {
                System.out.println("DEBUG: Found FIREBASE_SERVICE_ACCOUNT_JSON. Initializing...");
                try (ByteArrayInputStream is = new ByteArrayInputStream(jsonConfig.getBytes(StandardCharsets.UTF_8))) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(is))
                            .build();
                }
            }

            // 2. Try File Path Env Var
            if (options == null) {
                String serviceAccountPath = System.getenv("FIREBASE_CONFIG_PATH");
                System.out.println("DEBUG: FIREBASE_CONFIG_PATH value is: " + (serviceAccountPath == null ? "NULL" : serviceAccountPath));
                
                if (serviceAccountPath != null) {
                    File file = new File(serviceAccountPath);
                    if (file.exists()) {
                        System.out.println("DEBUG: File exists at " + serviceAccountPath + ". Reading...");
                        try (FileInputStream serviceAccount = new FileInputStream(file)) {
                            options = FirebaseOptions.builder()
                                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                    .build();
                        }
                    } else {
                        System.err.println("DEBUG ERROR: No file found at path provided in env var: " + serviceAccountPath);
                    }
                }
            }

            // 3. Last resort: Default local path
            if (options == null) {
                String defaultPath = "src/main/resources/serviceAccountKey.json";
                File file = new File(defaultPath);
                if (file.exists()) {
                    System.out.println("DEBUG: Found local file at " + defaultPath);
                    try (FileInputStream serviceAccount = new FileInputStream(file)) {
                        options = FirebaseOptions.builder()
                                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                .build();
                    }
                }
            }

            if (options == null) {
                throw new IOException("CRITICAL ERROR: No credentials found! Check if the Environment Group is 'Linked' to your service in Render settings.");
            }

            FirebaseApp.initializeApp(options);
            System.out.println("Firebase initialized successfully!");
        }
        return FirestoreClient.getFirestore();
    }
}
