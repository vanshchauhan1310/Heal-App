package com.heal.app.user.internal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.google.cloud.firestore.annotation.DocumentId;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YogaAttendanceLog {
    @DocumentId
    private String id;
    private String attendance_id;
    private Boolean attended;
}
