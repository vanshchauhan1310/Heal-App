export const questionnaireData = [
    {
        id: 'Q0',
        section: 'PERSONAL DETAILS',
        question: 'Tell us a bit about yourself',
        description: 'This helps us personalize your experience.',
        type: 'personal-details',
        mandatory: true,
    },
    // --- SECTION A: MENSTRUAL CYCLE PATTERN ---
    {
        id: 'Q1',
        section: 'SECTION A — MENSTRUAL CYCLE PATTERN',
        category: 'menstrual_cycle',
        question: 'How long is your usual menstrual cycle?',
        type: 'question',
        options: [
            { label: 'Less than 21 days', score: 0 },
            { label: '21–34 days', score: 0 },
            { label: '35–45 days', score: 2 },
            { label: 'More than 45 days', score: 3 },
            { label: 'Periods come very irregularly / unpredictably', score: 3 },
        ],
    },
    {
        id: 'Q2',
        section: 'SECTION A — MENSTRUAL CYCLE PATTERN',
        category: 'menstrual_cycle',
        question: 'In the last 12 months, how many periods did you have?',
        type: 'question',
        options: [
            { label: '10–12', score: 0 },
            { label: '8–9', score: 1 },
            { label: '6–7', score: 2 },
            { label: 'Fewer than 6', score: 3 },
        ],
    },
    {
        id: 'Q3',
        section: 'SECTION A — MENSTRUAL CYCLE PATTERN',
        category: 'menstrual_cycle',
        question: 'Do you often miss periods for 2 months or more (when not pregnant)?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Sometimes', score: 1 },
            { label: 'Frequently', score: 3 },
        ],
    },
    // --- SPECIAL STEP: CALENDAR ---
    {
        id: 'CALENDAR',
        type: 'calendar',
        section: 'MENSTRUAL TRACKING',
        question: 'Please log your Period Dates for the last 3 months.',
        description: 'This helps us understand your cycle intervals better.',
    },
    // --- SECTION B: ANDROGEN-RELATED SYMPTOMS ---
    {
        id: 'Q4',
        section: 'SECTION B — ANDROGEN-RELATED SYMPTOMS',
        category: 'androgen_symptoms',
        question: 'Have you noticed excess or coarse hair growth on areas such as chin, upper lip, chest, abdomen, or thighs?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Mild', score: 1 },
            { label: 'Moderate', score: 2 },
            { label: 'Severe / worsening over time', score: 3 },
        ],
    },
    {
        id: 'Q5',
        section: 'SECTION B — ANDROGEN-RELATED SYMPTOMS',
        category: 'androgen_symptoms',
        question: 'Do you have persistent or severe acne (especially jawline, cheeks, back) after age 18?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Mild', score: 1 },
            { label: 'Moderate', score: 2 },
            { label: 'Severe / resistant to treatment', score: 3 },
        ],
    },
    {
        id: 'Q6',
        section: 'SECTION B — ANDROGEN-RELATED SYMPTOMS',
        category: 'androgen_symptoms',
        question: 'Have you experienced notice scalp hair thinning or hair fall near the crown?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Mild', score: 1 },
            { label: 'Moderate or progressive', score: 2 },
        ],
    },
    // --- SECTION C: METABOLIC & FAMILY RISK FACTORS ---
    {
        id: 'Q7',
        section: 'SECTION C — METABOLIC & FAMILY RISK FACTORS',
        category: 'metabolic_risk',
        question: 'Have you experienced unexplained or rapid weight gain in the last 1–2 years?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Yes', score: 2 },
        ],
    },
    // --- SPECIAL STEP: BMI ---
    {
        id: 'BMI',
        type: 'bmi',
        section: 'BODY MASS INDEX',
        question: 'Calculate your BMI',
        description: 'Please enter your height and weight.',
    },
    {
        id: 'Q8',
        section: 'SECTION C — METABOLIC & FAMILY RISK FACTORS',
        category: 'metabolic_risk',
        question: 'Do you often feel fatigued, crave sugar, or feel energy crashes?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Sometimes', score: 1 },
            { label: 'Frequently', score: 2 },
        ],
    },
    {
        id: 'Q9',
        section: 'SECTION C — METABOLIC & FAMILY RISK FACTORS',
        category: 'metabolic_risk',
        question: 'Does anyone in your family have PCOS, diabetes, or thyroid disorders?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Yes', score: 2 },
        ],
    },
    // --- SECTION D: QUALITY OF LIFE & FUNCTIONAL IMPACT ---
    {
        id: 'Q10',
        section: 'SECTION D — QUALITY OF LIFE & FUNCTIONAL IMPACT',
        category: 'quality_of_life',
        question: 'In the last 3 months, how much have menstrual issues affected your daily life (college, work, mood)?',
        type: 'question',
        options: [
            { label: 'Not at all', score: 0 },
            { label: 'Mildly', score: 1 },
            { label: 'Moderately', score: 2 },
            { label: 'Severely', score: 3 },
        ],
    },
    {
        id: 'Q11',
        section: 'SECTION D — QUALITY OF LIFE & FUNCTIONAL IMPACT',
        category: 'quality_of_life',
        question: 'Do you experience frequent mood changes, anxiety, or low mood linked to your cycle?',
        type: 'question',
        options: [
            { label: 'No', score: 0 },
            { label: 'Sometimes', score: 1 },
            { label: 'Often', score: 2 },
        ],
    },
];
