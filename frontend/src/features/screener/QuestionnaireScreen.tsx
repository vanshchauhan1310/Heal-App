import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
    TextInput,
    Alert,
    Platform,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { questionnaireData } from '../../constants/questionnaireData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { screeningService } from '../../services/screeningService';
import { auth, db } from '../../config/firebase';
import { Timestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const getLastTwelveMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            name: d.toLocaleString('default', { month: 'long' }),
            daysInMonth: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
            startDayOffset: d.getDay(),
        });
    }
    return months;
};

const QuestionnaireScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [totalScore, setTotalScore] = useState(0);
    const [screeningId, setScreeningId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Personal Details State
    const [name, setName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // BMI State
    const [weight, setWeight] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [bmiResult, setBmiResult] = useState<string | null>(null);

    // Calendar State
    const [calendarMonths, setCalendarMonths] = useState<any[]>([]);
    const [selectedDates, setSelectedDates] = useState<any>({});

    const screeningStartedRef = React.useRef(false);

    useEffect(() => {
        setCalendarMonths(getLastTwelveMonths());

        const checkAndStart = async () => {
            const currentUid = user?.uid || auth.currentUser?.uid;

            if (currentUid && !screeningId && !screeningStartedRef.current) {
                screeningStartedRef.current = true;
                console.log("Starting screening for UID:", currentUid);
                try {
                    const id = await screeningService.createScreening(currentUid);
                    console.log("Screening created ID:", id);
                    if (id) {
                        setScreeningId(id);
                    } else {
                        screeningStartedRef.current = false; // Reset if it failed
                    }
                } catch (error) {
                    console.error("Failed to create screening", error);
                    screeningStartedRef.current = false;
                }
            }
        };
        checkAndStart();
    }, [user, screeningId]);

    // Auto-Calculate BMI
    useEffect(() => {
        const w = parseFloat(weight);
        const h = parseFloat(heightCm) / 100;
        if (w > 0 && h > 0) {
            const bmi = (w / (h * h)).toFixed(1);
            setBmiResult(bmi);
        } else {
            setBmiResult(null);
        }
    }, [weight, heightCm]);

    const currentStep = questionnaireData[currentStepIndex];

    const handleOptionSelect = async (option: any) => {
        const section = currentStep.category || 'general';
        const newAnswers = { ...answers, [currentStep.id]: { score: option.score, label: option.label } };
        setAnswers(newAnswers);

        let newTotal = 0;
        Object.values(newAnswers).forEach((ans: any) => newTotal += ans.score);
        setTotalScore(newTotal);

        const currentUid = user?.uid || auth.currentUser?.uid;
        if (currentUid && screeningId) {
            await screeningService.updateScreeningAnswer(currentUid, screeningId, section, currentStep.id, option.label);
        }

        setTimeout(() => {
            handleNextFromOption();
        }, 200);
    };

    const handleNextFromOption = () => {
        if (currentStepIndex < questionnaireData.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentStep.type === 'personal-details') {
            if (!name.trim()) {
                Alert.alert("Required", "Please enter your name.");
                return;
            }
            if (user) {
                await userService.updateUser(user.uid, {
                    full_name: name,
                    date_of_birth: Timestamp.fromDate(dob)
                });
            }
        }

        if (currentStep.type === 'question') {
            if (!answers[currentStep.id]) {
                Alert.alert("Required", "Please select an option to proceed.");
                return;
            }
        }

        if (currentStep.type === 'calendar') {
            const distinctMonths = new Set();
            Object.keys(selectedDates).forEach(dateStr => {
                const [y, m] = dateStr.split('-');
                distinctMonths.add(`${y}-${m}`);
            });

            if (distinctMonths.size < 3) {
                Alert.alert("Detailed Logging Needed", "Please select dates across at least 3 months to help us analyze your cycle accurately.");
                return;
            }
            const currentUid = user?.uid || auth.currentUser?.uid;
            if (currentUid && screeningId) {
                const datesArray = Object.keys(selectedDates).map(d => Timestamp.fromDate(new Date(d)));
                await screeningService.updateScreeningAnswer(currentUid, screeningId, 'cycle_history', 'recent_periods', datesArray);
            }
        }

        if (currentStep.type === 'bmi') {
            if (!bmiResult) {
                Alert.alert("Required", "Please enter valid weight and height.");
                return;
            }
            const currentUid = user?.uid || auth.currentUser?.uid;
            if (currentUid) {
                await userService.updateUser(currentUid, {
                    height_cm: parseFloat(heightCm),
                    weight_kg: parseFloat(weight),
                    bmi: parseFloat(bmiResult)
                });
            }
        }

        if (currentStepIndex < questionnaireData.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            finishQuestionnaire();
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        } else {
            navigation.goBack();
        }
    };

    const finishQuestionnaire = async () => {
        if (loading) return;
        setLoading(true);
        console.log("finishQuestionnaire started. Current totalScore:", totalScore);

        try {
            let riskCategory: 'low' | 'moderate' | 'high' = 'low';
            if (totalScore >= 14) riskCategory = 'high';
            else if (totalScore >= 7) riskCategory = 'moderate';

            const currentUid = user?.uid || auth.currentUser?.uid;

            if (currentUid && screeningId) {
                console.log("Saving results to Firestore for UID:", currentUid);
                const results = {
                    total_score: totalScore,
                    risk_level: riskCategory,
                    section_scores: { menstrual_score: 0, androgen_score: 0, metabolic_score: 0, quality_score: 0 },
                    flagged_symptoms: [],
                    recommendations: []
                };

                await screeningService.saveScreeningResults(currentUid, screeningId, results as any);
                await screeningService.updateUserLatestScreening(currentUid, screeningId, riskCategory, totalScore);

                console.log("Calling completeOnboarding...");
                await userService.completeOnboarding(currentUid, {
                    full_name: name,
                    date_of_birth: Timestamp.fromDate(dob),
                    height_cm: heightCm ? parseFloat(heightCm) : null,
                    weight_kg: weight ? parseFloat(weight) : null,
                    bmi: bmiResult ? parseFloat(bmiResult) : null,
                    latest_risk_level: riskCategory
                });

                console.log("Onboarding complete. Navigating...");
                navigation.replace('Home', {
                    screen: 'Cycle',
                    params: { userName: name, riskCategory, totalScore }
                });
            } else {
                console.warn("User or screeningId missing during finishQuestionnaire", { currentUid, screeningId });
                Alert.alert("Error", "Your session expired or your profile isn't ready. Please wait a moment and try again.");
            }
        } catch (error: any) {
            console.error("Error in finishQuestionnaire:", error);
            Alert.alert("Error", "Something went wrong saving your results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Calendar logic... (unchanged)
    const handleDatePress = (year: number, monthIndex: number, day: number) => {
        const dateStr = `${year}-${monthIndex}-${day}`;
        const newSelected = { ...selectedDates };
        if (newSelected[dateStr]) {
            delete newSelected[dateStr];
        } else {
            const targetDate = new Date(year, monthIndex, day);
            const prevDate = new Date(targetDate);
            prevDate.setDate(targetDate.getDate() - 1);
            const prevStr = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;
            const isAdjacent = newSelected[prevStr];
            if (isAdjacent) {
                newSelected[dateStr] = true;
            } else {
                for (let i = 0; i < 5; i++) {
                    const d = new Date(targetDate);
                    d.setDate(targetDate.getDate() + i);
                    const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                    newSelected[dStr] = true;
                }
            }
        }
        setSelectedDates(newSelected);
    };

    const renderPersonalDetails = () => (
        <View style={styles.formContainer}>
            <Text style={styles.questionText}>{currentStep.question}</Text>
            <Text style={styles.descriptionText}>{currentStep.description}</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>What should we call you?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.datePickerText}>{dob.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); setDob(d || dob); }}
                        maximumDate={new Date()}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                    {currentStepIndex === questionnaireData.length - 1 ? 'Finish Analysis →' : 'Next →'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderCalendar = () => (
        <View style={styles.calendarContainer}>
            <Text style={styles.questionText}>{currentStep.question}</Text>
            <Text style={styles.descriptionText}>{currentStep.description}</Text>
            {calendarMonths.map((month: any, mIdx: number) => (
                <View key={mIdx} style={styles.monthBlock}>
                    <Text style={styles.monthTitle}>{month.name} {month.year}</Text>
                    <View style={styles.datesGrid}>
                        {[...Array(month.startDayOffset)].map((_, i) => <View key={`empty-${mIdx}-${i}`} style={styles.dateCell} />)}
                        {[...Array(month.daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${month.year}-${month.monthIndex}-${day}`;
                            const isSelected = !!selectedDates[dateStr];
                            return (
                                <TouchableOpacity key={day} style={[styles.dateCell, isSelected && styles.dateCellSelected]} onPress={() => handleDatePress(month.year, month.monthIndex, day)}>
                                    <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{day}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                    {currentStepIndex === questionnaireData.length - 1 ? 'Finish Analysis →' : 'Next →'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderBMI = () => {
        const getBMIStatus = (val: string) => {
            const v = parseFloat(val);
            if (v < 18.5) return { label: 'Underweight', color: '#FFAB00' };
            if (v < 25) return { label: 'Healthy', color: '#4CAF50' };
            if (v < 30) return { label: 'Overweight', color: '#FF9800' };
            return { label: 'Obese', color: '#F44336' };
        };
        const status = bmiResult ? getBMIStatus(bmiResult) : null;
        return (
            <View style={styles.bmiContainer}>
                <Text style={styles.questionText}>{currentStep.question}</Text>
                <Text style={styles.descriptionText}>{currentStep.description}</Text>
                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={weight} onChangeText={setWeight} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={heightCm} onChangeText={setHeightCm} />
                    </View>
                </View>
                {bmiResult ? (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>BMI Status</Text>
                        <Text style={[styles.resultValue, { color: status?.color }]}>{status?.label}</Text>
                        <Text style={{ fontSize: 16, color: '#557C60', marginTop: 4 }}>BMI: {bmiResult}</Text>
                    </View>
                ) : (
                    <View style={[styles.resultContainer, { backgroundColor: '#f0f0f0' }]}>
                        <Text style={[styles.resultLabel, { color: '#aaa' }]}>Enter details to calculate</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {currentStepIndex === questionnaireData.length - 1 ? 'Finish Analysis →' : 'Next →'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderQuestion = () => (
        <View>
            <Text style={styles.questionText}>{currentStep.question}</Text>
            {currentStep.options.map((option: any, index: number) => {
                const isSelected = answers[currentStep.id]?.label === option.label;
                return (
                    <TouchableOpacity
                        key={index}
                        style={[styles.optionButton, isSelected && styles.optionSelected]}
                        onPress={() => handleOptionSelect(option)}
                        disabled={loading}
                    >
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.label}</Text>
                    </TouchableOpacity>
                );
            })}

            {/* Show choice-based Next button or Finish button */}
            {currentStepIndex === questionnaireData.length - 1 ? (
                // Only show Finish button AFTER they made a choice for the last question
                answers[currentStep.id] && (
                    <TouchableOpacity
                        style={[styles.nextButton, { marginTop: 30, backgroundColor: '#4CAF50' }]}
                        onPress={finishQuestionnaire}
                        disabled={loading}
                    >
                        <Text style={styles.nextButtonText}>Finish Analysis →</Text>
                    </TouchableOpacity>
                )
            ) : (
                // For regular questions, we could show a Next button too if they want to change but handleOptionSelect auto-proceeds
                answers[currentStep.id] && (
                    <TouchableOpacity
                        style={[styles.nextButton, { marginTop: 30, backgroundColor: '#888', opacity: 0.6 }]}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextButtonText}>Next →</Text>
                    </TouchableOpacity>
                )
            )}
        </View>
    );

    const renderProgressBar = () => {
        const progress = ((currentStepIndex + 1) / questionnaireData.length) * 100;
        return (
            <View style={[styles.progressContainer, { marginTop: insets.top + 10 }]}>
                <View style={styles.progressHeaderRow}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}><Text style={styles.backText}>←</Text></TouchableOpacity>
                    <Text style={styles.progressText}>{currentStepIndex + 1}<Text style={styles.progressTotal}>/{questionnaireData.length}</Text></Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.progressBarBackground}><View style={[styles.progressBarFill, { width: `${progress}%` }]} /></View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />
            <View style={styles.headerBackground} />
            <View style={styles.header}>{renderProgressBar()}</View>
            <View style={styles.card}>
                {loading || !user || !screeningId ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <ActivityIndicator size="large" color="#1B3A23" />
                        <Text style={{ marginTop: 20, color: '#1B3A23', textAlign: 'center', fontSize: 16 }}>
                            {!user ? "Syncing your profile..." : "Preparing your PCOS analysis..."}
                        </Text>
                        <Text style={{ marginTop: 10, color: '#666', textAlign: 'center', fontSize: 12 }}>
                            This usually takes only a few seconds.
                        </Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {currentStep.type === 'personal-details' && renderPersonalDetails()}
                        {currentStep.type === 'question' && renderQuestion()}
                        {currentStep.type === 'calendar' && renderCalendar()}
                        {currentStep.type === 'bmi' && renderBMI()}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF', height: height * 0.15 },
    header: { paddingHorizontal: 20, paddingBottom: 20, zIndex: 1, backgroundColor: '#FFFFFF' },
    progressContainer: { width: '100%', marginBottom: 10 },
    progressHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
    backButton: { padding: 10, paddingLeft: 0 },
    backText: { fontSize: 28, color: '#1B3A23', fontWeight: '300' },
    progressText: { color: '#1B3A23', fontSize: 20, fontWeight: 'bold', fontFamily: 'serif' },
    progressTotal: { fontSize: 14, color: '#888', fontWeight: '400' },
    progressBarBackground: { width: '100%', height: 6, backgroundColor: '#F0F0F0', borderRadius: 3 },
    progressBarFill: { height: '100%', backgroundColor: '#1B3A23', borderRadius: 3 },
    card: { flex: 1, backgroundColor: '#F9FCFA', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 32, elevation: 5 },
    scrollContent: { paddingBottom: 60 },
    questionText: { fontSize: 22, fontWeight: '700', color: '#1B3A23', marginBottom: 32, lineHeight: 30, fontFamily: 'serif' },
    descriptionText: { fontSize: 15, color: '#557C60', marginBottom: 24, lineHeight: 22, fontStyle: 'italic' },
    formContainer: { width: '100%' },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 14, color: '#557C60', marginBottom: 8, fontWeight: '600', marginLeft: 4 },
    datePickerButton: { borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 12, padding: 16, backgroundColor: '#FFFFFF' },
    datePickerText: { fontSize: 16, color: '#1B3A23' },
    optionButton: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, marginBottom: 16, backgroundColor: '#FFFFFF', elevation: 2, flexDirection: 'row', alignItems: 'center' },
    optionSelected: { backgroundColor: '#E6F4EA', borderColor: '#4CAF50', borderWidth: 1.5 },
    optionText: { fontSize: 16, color: '#333', fontWeight: '500', flex: 1 },
    optionTextSelected: { color: '#1B3A23', fontWeight: '700' },
    bmiContainer: { alignItems: 'center', width: '100%' },
    inputRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24 },
    inputWrapper: { width: '48%' },
    input: { borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 12, padding: 16, fontSize: 18, backgroundColor: '#FFFFFF', color: '#1B3A23', fontWeight: '600' },
    resultContainer: { alignItems: 'center', marginBottom: 30, backgroundColor: '#E6F4EA', padding: 20, borderRadius: 20, width: '100%', minHeight: 100, justifyContent: 'center' },
    resultLabel: { fontSize: 14, color: '#557C60', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
    resultValue: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50' },
    calendarContainer: { width: '100%' },
    monthBlock: { marginBottom: 30, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EEE' },
    monthTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: '#1B3A23', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
    datesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dateCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 4 },
    dateCellSelected: { backgroundColor: '#4CAF50', borderRadius: 20 },
    dateText: { color: '#333', fontSize: 14, fontWeight: '500' },
    dateTextSelected: { color: '#fff', fontWeight: 'bold' },
    nextButton: { marginTop: 10, paddingVertical: 16, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#1B3A23', borderRadius: 30, width: '100%', alignItems: 'center', elevation: 6 },
    nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
});

export default QuestionnaireScreen;
