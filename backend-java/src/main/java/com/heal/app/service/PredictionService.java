package com.heal.app.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    public LocalDate predictNextPeriod(String userId, String screeningId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot screeningDoc = db.collection("users").document(userId)
                .collection("screenings").document(screeningId).get().get();

        if (!screeningDoc.exists()) {
            throw new Exception("Screening not found");
        }

        Map<String, Object> cycleHistory = (Map<String, Object>) screeningDoc.get("cycle_history");
        if (cycleHistory == null) {
            return null;
        }

        List<com.google.cloud.Timestamp> recentPeriods = (List<com.google.cloud.Timestamp>) cycleHistory.get("recent_periods");
        Number avgCycleLengthNum = (Number) cycleHistory.get("avg_cycle_length");
        int avgCycleLength = (avgCycleLengthNum != null) ? avgCycleLengthNum.intValue() : 28;

        if (recentPeriods == null || recentPeriods.isEmpty()) {
            // Fallback: If no history, we can't predict accurately, but use a default from today
            return LocalDate.now().plusDays(avgCycleLength);
        }

        // Get the most recent period date
        com.google.cloud.Timestamp lastPeriodTimestamp = recentPeriods.get(0);
        for (com.google.cloud.Timestamp ts : recentPeriods) {
            if (ts.compareTo(lastPeriodTimestamp) > 0) {
                lastPeriodTimestamp = ts;
            }
        }

        LocalDate lastPeriodDate = lastPeriodTimestamp.toDate().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();

        // Basic Prediction: Last Period + Average Cycle Length
        // For a more advanced "ML" feel, we could weight the last 3 cycles 
        // or apply a correction factor if the cycle_regularity is "irregular"
        
        String regularity = (String) cycleHistory.get("cycle_regularity");
        int adjustment = 0;
        if ("irregular".equals(regularity)) {
            adjustment = 2; // Add some buffer for irregularity
        } else if ("very_irregular".equals(regularity)) {
            adjustment = 5;
        }

        return lastPeriodDate.plusDays(avgCycleLength + adjustment);
    }
}
