package com.heal.app.user.internal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.Timestamp;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @DocumentId
    private String id;
    private String user_id;
    private Integer schema_version;
    private Timestamp created_at;
    private Timestamp updated_at;
    private UserProfile profile;
    private UserPreferences preferences;
    private LandingPageSummary landing_page_summary;
}
