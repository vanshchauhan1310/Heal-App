package com.heal.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.google.cloud.firestore.annotation.DocumentId;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentLog {
    @DocumentId
    private String id;
    private String assessment_id;
    private String questionnaire_version;
    private Map<String, Object> answers;
    private Map<String, Object> result;
}
