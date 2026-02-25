package com.heal.app.user.internal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandingPageSummary {
    private Risk risk;
    private String heal_journey;
    private String next_yoga;
    private Cycle cycle;
    private PadUsage pad_usage;
}
