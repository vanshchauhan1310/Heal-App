package com.heal.app.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.heal.app.user.internal.model.UserProfile;
import com.heal.app.user.internal.model.UserPreferences;
import com.heal.app.user.internal.model.LandingPageSummary;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLandingResponse {
    private UserProfile profile;
    private UserPreferences preferences;
    private LandingPageSummary landing_page_summary;
}
