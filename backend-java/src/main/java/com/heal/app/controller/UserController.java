package com.heal.app.controller;

import com.heal.app.model.User;
import com.heal.app.model.UserLandingResponse;
import com.heal.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/v1/me")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/landing")
    public ResponseEntity<?> getLandingSummary(@RequestParam String userId) {
        try {
            User user = userService.getUserLandingData(userId);

            if (user != null) {
                UserLandingResponse response = UserLandingResponse.builder()
                        .profile(user.getProfile())
                        .preferences(user.getPreferences())
                        .landing_page_summary(user.getLanding_page_summary())
                        .build();
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body("User not found: " + userId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage() + ". Cause: " + e.getCause());
        }
    }
}
