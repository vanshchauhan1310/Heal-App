package com.heal.app.prediction.internal;

import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class PredictionService {

    public LocalDate predictNextPeriod(String userId, String screeningId) {
        // Mock prediction logic
        return LocalDate.now().plusDays(28);
    }
}
