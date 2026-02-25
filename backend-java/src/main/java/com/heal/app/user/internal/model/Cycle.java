package com.heal.app.user.internal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cycle {
    private String last_period_start;
    private String last_period_end;
}
