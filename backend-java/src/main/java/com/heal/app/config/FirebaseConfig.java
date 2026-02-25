package com.heal.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options;

            String serviceAccountPath = System.getenv("FIREBASE_CONFIG_PATH");
            if (serviceAccountPath == null) {
                serviceAccountPath = "src/main/resources/serviceAccountKey.json";
            }

            System.out.println("Initializing Firebase with key from: " + serviceAccountPath);

            try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
            } catch (IOException e) {
                System.out.println("Service account file not found at " + serviceAccountPath + ", falling back to default Google credentials...");
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
            }

            FirebaseApp.initializeApp(options);
            System.out.println("Firebase initialized successfully.");
        }
        return FirestoreClient.getFirestore();
    }
}
