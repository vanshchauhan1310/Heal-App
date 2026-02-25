package com.heal.app.prediction.internal;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class PredictionServiceTest {

    private final PredictionService predictionService = new PredictionService();

    @Test
    void shouldPredictNextPeriod() {
        // Given
        String userId = "usr_100";
        String screeningId = "scr_001";

        // When
        LocalDate predictedDate = predictionService.predictNextPeriod(userId, screeningId);

        // Then
        assertThat(predictedDate).isNotNull();
        assertThat(predictedDate).isAfterOrEqualTo(LocalDate.now());
    }
}
