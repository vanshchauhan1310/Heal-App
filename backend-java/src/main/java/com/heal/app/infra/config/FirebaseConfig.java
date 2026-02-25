package com.heal.app.infra.config;

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

            String jsonConfig = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
            if (jsonConfig != null && !jsonConfig.isEmpty()) {
                try (ByteArrayInputStream is = new ByteArrayInputStream(jsonConfig.getBytes(StandardCharsets.UTF_8))) {
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(is))
                            .build();
                }
            }

            if (options == null) {
                String serviceAccountPath = System.getenv("FIREBASE_CONFIG_PATH");
                if (serviceAccountPath == null) {
                    serviceAccountPath = "src/main/resources/serviceAccountKey.json";
                }

                File file = new File(serviceAccountPath);
                if (file.exists()) {
                    try (FileInputStream serviceAccount = new FileInputStream(file)) {
                        options = FirebaseOptions.builder()
                                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                .build();
                    }
                }
            }

            if (options == null) {
                String defaultPath = "src/main/resources/serviceAccountKey.json";
                File file = new File(defaultPath);
                if (file.exists()) {
                    try (FileInputStream serviceAccount = new FileInputStream(file)) {
                        options = FirebaseOptions.builder()
                                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                .build();
                    }
                }
            }

            if (options == null) {
                throw new IOException("CRITICAL ERROR: No Firebase credentials found!");
            }

            FirebaseApp.initializeApp(options);
        }
        return FirestoreClient.getFirestore();
    }
}
