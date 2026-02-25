package com.heal.app.user.internal;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteBatch;
import com.heal.app.user.internal.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
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
                if (db.collection("users").document(userId).get().get().exists()) continue;

                dataAdded = true;
                User user = new User();
                user.setUser_id(userId);
                user.setSchema_version(1);
                user.setCreated_at(Timestamp.now());
                user.setUpdated_at(Timestamp.now());
                user.setProfile(new UserProfile(names[i]));
                user.setPreferences(new UserPreferences("20:" + (30 + i)));
                
                LandingPageSummary summary = new LandingPageSummary();
                summary.setRisk(new Risk(risks[random.nextInt(3)], 20 + random.nextInt(60)));
                summary.setCycle(new Cycle("2026-02-0" + (1 + i), "2026-02-0" + (6 + i)));
                summary.setPad_usage(new PadUsage(padStatuses[random.nextInt(3)]));
                user.setLanding_page_summary(summary);

                batch.set(db.collection("users").document(userId), user);
                seedSubcollections(db, batch, userId);
            }

            if (dataAdded) {
                batch.commit().get();
                System.out.println("Firestore stub data for 5 users seeded successfully.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void seedSubcollections(Firestore db, WriteBatch batch, String userId) {
        // Simple seeding for subcollections
        String[] logs = {"assessment_logs", "period_logs", "yoga_attendance_logs", "pad_logs"};
        for (String log : logs) {
            String id = log.substring(0, 3) + "_" + userId + "_1";
            Object data;
            if (log.equals("assessment_logs")) data = new AssessmentLog(null, id, "pcos_v1", new HashMap<>(), new HashMap<>());
            else if (log.equals("period_logs")) data = new PeriodLog(null, id, "start", "2026-02-01");
            else if (log.equals("yoga_attendance_logs")) data = new YogaAttendanceLog(null, id, true);
            else data = new PadLog(null, id, "status_update", "transitioning");
            
            batch.set(db.collection("users").document(userId).collection(log).document(id), data);
        }
    }
}
