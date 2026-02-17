import { Timestamp } from 'firebase/firestore';

export interface User {
    uid: string;
    phone: string;
    email: string | null;
    full_name: string;
    date_of_birth: Timestamp;
    age: number;
    onboarding_complete: boolean;
    onboarded_at: Timestamp | null;
    onboarded_via: 'app' | 'whatsapp';
    height_cm: number | null;
    weight_kg: number | null;
    bmi: number | null;
    bmi_category: 'underweight' | 'normal' | 'overweight' | 'obese' | null;
    last_period_date: Timestamp | null;
    avg_cycle_length: number | null;
    latest_risk_level: 'low' | 'moderate' | 'high' | null;
    latest_risk_score: number | null;
    latest_screening_id: string | null;
    latest_screened_at: Timestamp | null;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface Screening {
    screening_id: string;
    user_id: string;
    version: 'v1.0';
    source: 'app' | 'whatsapp';
    started_at: Timestamp;
    completed_at: Timestamp | null;
    duration_secs: number | null;
    name: string;
    dob: Timestamp;
    age: number;
    cycle_history: {
        recent_periods: Timestamp[];
        avg_cycle_length: number;
        cycle_regularity: 'regular' | 'irregular' | 'very_irregular';
    };
    bmi_data: {
        height_cm: number;
        weight_kg: number;
        bmi: number;
        bmi_category: string;
    };
    responses: {
        menstrual_cycle: {
            q1_irregular_cycles: string;
            q2_prolonged_bleeding: string;
            q3_missed_periods: string;
        };
        androgen_symptoms: {
            q4_acne: string;
            q5_excess_hair_growth: string;
            q6_hair_loss: string;
        };
        metabolic_risk: {
            q7_weight_gain: string;
            q8_fatigue: string;
            q9_family_history: string;
        };
        quality_of_life: {
            q10_mood_changes: string;
            q11_daily_impact: string;
        };
    };
    results: {
        total_score: number;
        risk_level: 'low' | 'moderate' | 'high';
        section_scores: {
            menstrual_score: number;
            androgen_score: number;
            metabolic_score: number;
            quality_score: number;
        };
        flagged_symptoms: string[];
        recommendations: string[];
    };
}
