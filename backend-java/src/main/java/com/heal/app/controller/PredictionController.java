package com.heal.app.controller;

import com.heal.app.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping("/predict-period")
    public Map<String, Object> predict(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String screeningId = request.get("screeningId");
        
        Map<String, Object> response = new HashMap<>();
        try {
            LocalDate predictedDate = predictionService.predictNextPeriod(userId, screeningId);
            response.put("status", "success");
            response.put("predictedDate", predictedDate.toString());
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }
}
