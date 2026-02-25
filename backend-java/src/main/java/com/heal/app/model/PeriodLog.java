package com.heal.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.google.cloud.firestore.annotation.DocumentId;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodLog {
    @DocumentId
    private String id;
    private String period_log_id;
    private String action;
    private String date;
}
