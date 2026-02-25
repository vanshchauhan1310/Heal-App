package com.heal.app.service;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteBatch;
import com.heal.app.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Service
public class DataSeedingService {

    @Autowired
    private Firestore db;

    private final Random random = new Random();

    @PostConstruct
    public void seedData() {
        try {
            
            // Generate 5 users
            String[] names = {"Priya", "Ananya", "Sara", "Meera", "Ishita"};
            String[] risks = {"low", "medium", "high"};
            String[] padStatuses = {"transitioning", "stable", "normal"};

            WriteBatch batch = db.batch();
            boolean dataAdded = false;

            for (int i = 0; i < 5; i++) {
                String userId = "usr_" + (100 + i);
                
                // Check if user already exists
                if (db.collection("users").document(userId).get().get().exists()) {
                    continue;
                }

                dataAdded = true;
                User user = new User();
                user.setUser_id(userId);
                user.setSchema_version(1);
                user.setCreated_at(Timestamp.now());
                user.setUpdated_at(Timestamp.now());
                user.setProfile(new UserProfile(names[i]));
                user.setPreferences(new UserPreferences("20:" + (30 + i)));
                
                LandingPageSummary summary = new LandingPageSummary();
                int score = 20 + random.nextInt(60);
                String riskLevel = risks[random.nextInt(risks.length)];
                summary.setRisk(new Risk(riskLevel, score));
                summary.setCycle(new Cycle("2026-02-0" + (1 + i), "2026-02-0" + (6 + i)));
                summary.setPad_usage(new PadUsage(padStatuses[random.nextInt(padStatuses.length)]));
                user.setLanding_page_summary(summary);

                batch.set(db.collection("users").document(userId), user);

                // Seed subcollections
                seedSubcollections(db, batch, userId);
            }

            if (dataAdded) {
                batch.commit().get();
                System.out.println("Firestore stub data for 5 users seeded successfully.");
            } else {
                System.out.println("Stub data for all users already exists.");
            }
            
        } catch (Exception e) {
            System.err.println("Error seeding data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void seedSubcollections(Firestore db, WriteBatch batch, String userId) {
        // Assessment Logs
        for (int j = 1; j <= 2; j++) {
            String id = "asmt_" + userId + "_" + j;
            batch.set(db.collection("users").document(userId).collection("assessment_logs").document(id), 
                new AssessmentLog(null, id, "pcos_v1", new HashMap<>(), new HashMap<>()));
        }
        
        // Period Logs
        for (int j = 1; j <= 2; j++) {
            String id = "per_" + userId + "_" + j;
            batch.set(db.collection("users").document(userId).collection("period_logs").document(id), 
                new PeriodLog(null, id, j == 1 ? "start" : "end", "2026-02-0" + (j)));
        }
        
        // Yoga Attendance Logs
        for (int j = 1; j <= 3; j++) {
            String id = "yog_" + userId + "_" + j;
            batch.set(db.collection("users").document(userId).collection("yoga_attendance_logs").document(id), 
                new YogaAttendanceLog(null, id, random.nextBoolean()));
        }
        
        // Pad Logs
        for (int j = 1; j <= 2; j++) {
            String id = "pad_" + userId + "_" + j;
            batch.set(db.collection("users").document(userId).collection("pad_logs").document(id), 
                new PadLog(null, id, "status_update", "transitioning"));
        }
    }
}
