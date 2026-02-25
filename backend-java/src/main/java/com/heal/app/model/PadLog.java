package com.heal.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.google.cloud.firestore.annotation.DocumentId;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PadLog {
    @DocumentId
    private String id;
    private String pad_log_id;
    private String action;
    private String pad_status;
}
