package com.heal.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLandingResponse {
    private UserProfile profile;
    private UserPreferences preferences;
    private LandingPageSummary landing_page_summary;
}
