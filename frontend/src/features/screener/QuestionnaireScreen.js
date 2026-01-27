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
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { questionnaireData } from '../../constants/questionnaireData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../../context/UserContext'; // Import Context

const { width, height } = Dimensions.get('window');

// --- Helper Functions for Calendar ---
// Get last 12 months
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
            startDayOffset: d.getDay(), // 0=Sun, 1=Mon...
        });
    }
    return months;
};

const QuestionnaireScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [totalScore, setTotalScore] = useState(0);

    // Personal Details State
    const [name, setName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [country, setCountry] = useState('');
    const [menarcheAge, setMenarcheAge] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // BMI State
    const [weight, setWeight] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    // Calendar State
    const [calendarMonths, setCalendarMonths] = useState([]);
    const [selectedDates, setSelectedDates] = useState({}); // { "YYYY-MM-DD": true }

    useEffect(() => {
        setCalendarMonths(getLastTwelveMonths());
    }, []);

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

    // --- Handlers ---

    const handleOptionSelect = (option) => {
        const newAnswers = { ...answers, [currentStep.id]: { score: option.score, label: option.label } };
        setAnswers(newAnswers);

        let newTotal = 0;
        Object.values(newAnswers).forEach(ans => newTotal += ans.score);
        setTotalScore(newTotal);

        setTimeout(() => {
            handleNextFromOption(); // Separate handler to avoid circular dep issues if any
        }, 200);
    };

    // Special handler for auto-advance after option select
    const handleNextFromOption = () => {
        if (currentStepIndex < questionnaireData.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            finishQuestionnaire();
        }
    };

    const handleNext = () => {
        // Validation
        if (currentStep.type === 'personal-details') {
            if (!name.trim()) {
                Alert.alert("Required", "Please enter your name.");
                return;
            }
            // DOB check optional but good practice
        }

        // Validation: Mandatory Questions
        if (currentStep.type === 'question') {
            if (!answers[currentStep.id]) {
                Alert.alert("Required", "Please select an option to proceed.");
                return;
            }
        }

        if (currentStep.type === 'calendar') {
            // Validation: Mandatory previous 3 months
            const distinctMonths = new Set();
            Object.keys(selectedDates).forEach(dateStr => {
                // dateStr format YYYY-MM-DD.
                // We need to check if we have data for month M, M-1, M-2 roughly.
                // Simplest check: do we have dates in at least 3 distinct "Year-Month" buckets?
                const [y, m] = dateStr.split('-');
                distinctMonths.add(`${y}-${m}`);
            });

            if (distinctMonths.size < 3) {
                Alert.alert("Detailed Logging Needed", "Please select dates across at least 3 months to help us analyze your cycle accurately.");
                return;
            }
        }

        if (currentStep.type === 'bmi') {
            if (!bmiResult) {
                Alert.alert("Required", "Please enter valid weight and height.");
                return;
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
        console.log("Starting finishQuestionnaire...");
        // Helper to find the latest date from selectedDates
        const findLatestSelectedDate = () => {
            const dates = Object.keys(selectedDates);
            if (dates.length === 0) return null;
            const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
            return new Date(sortedDates[0]);
        };

        // 1. Calculate Risk
        let calculatedTotalScore = 0;
        Object.values(answers).forEach((val) => {
            if (val && typeof val.score === 'number') calculatedTotalScore += val.score;
        });
        const riskCategory = calculatedTotalScore <= 5 ? 'Low' : calculatedTotalScore <= 10 ? 'Moderate' : 'High';

        console.log("Risk Calculated:", riskCategory);

        // 2. Update Context (Immediate UI update)
        try {
            await updateUser({
                name: name,
                riskLevel: riskCategory,
                isGuest: false,
            });
            console.log("Context Updated");
        } catch (e) {
            console.error("Context Update Error:", e);
        }

        // 3. Save to Backend Database (Persistent)
        const bmiStatus = bmiResult ? getBMIStatus(bmiResult)?.label : null;
        const lastPeriodDate = findLatestSelectedDate();

        const profileData = {
            userId: '123e4567-e89b-12d3-a456-426614174000', // Replace with real Auth ID when Auth is live
            name: name,
            dob: dob ? dob.toISOString().split('T')[0] : null,
            country: country,
            menarcheAge: menarcheAge,
            height: heightCm ? parseFloat(heightCm) : null,
            weight: weight ? parseFloat(weight) : null,
            bmi: bmiResult ? parseFloat(bmiResult) : null,
            bmiStatus: bmiStatus,
            lastPeriodDate: lastPeriodDate ? lastPeriodDate.toISOString().split('T')[0] : null,
            avgCycleLength: 28, // Default or from input if you added that step
            avgPeriodLength: 5, // Default
            riskScore: calculatedTotalScore,
            riskLevel: riskCategory,
            symptoms: answers
        };

        console.log("Saving Profile Data...", profileData);

        try {
            await api.user.updateProfile(profileData);
            console.log('Profile saved to DB');
        } catch (error) {
            console.error('Failed to save profile to DB:', error);
            // Optionally, show an alert to the user
            Alert.alert("Error", "Failed to save your profile. Please try again.");
        }

        // 4. Navigate
        console.log("Navigating to Home...");
        try {
            navigation.replace('Home', {
                screen: 'Cycle',
                params: {
                    userName: name,
                    riskCategory,
                    totalScore
                }
            });
            console.log("Navigation call failed?");
        } catch (navError) {
            console.error("Navigation Error:", navError);
        }
    };

    // --- Calendar Logic ---
    const handleDatePress = (year, monthIndex, day) => {
        const dateStr = `${year}-${monthIndex}-${day}`;
        const newSelected = { ...selectedDates };

        // 1. If currently selected -> Toggle OFF (Single day)
        if (newSelected[dateStr]) {
            delete newSelected[dateStr];
            setSelectedDates(newSelected);
            return;
        }

        // 2. If NOT selected: Check adjacency to determine if we add 1 day or 5 days.
        const targetDate = new Date(year, monthIndex, day);

        // Check Previous Day
        const prevDate = new Date(targetDate);
        prevDate.setDate(targetDate.getDate() - 1);
        const prevStr = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

        // Check Next Day
        const nextDate = new Date(targetDate);
        nextDate.setDate(targetDate.getDate() + 1);
        const nextStr = `${nextDate.getFullYear()}-${nextDate.getMonth()}-${nextDate.getDate()}`;

        const isAdjacent = newSelected[prevStr] || newSelected[nextStr];

        if (isAdjacent) {
            // Extend/Fill gap -> Add Single Day
            newSelected[dateStr] = true;
        } else {
            // Isolated selection -> Start new period (5 Days)
            for (let i = 0; i < 5; i++) {
                const d = new Date(targetDate);
                d.setDate(targetDate.getDate() + i);
                const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                newSelected[dStr] = true;
            }
        }

        setSelectedDates(newSelected);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
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
                <Text style={styles.label}>Where are you from?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Country"
                    value={country}
                    onChangeText={setCountry}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.datePickerText}>{dob.toDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Age of 1st Period</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 13"
                    keyboardType="numeric"
                    value={menarcheAge}
                    onChangeText={setMenarcheAge}
                    placeholderTextColor="#999"
                />
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
        </View>
    );

    const renderCalendar = () => {
        return (
            <View style={styles.calendarContainer}>
                <Text style={styles.questionText}>{currentStep.question}</Text>
                <Text style={styles.descriptionText}>{currentStep.description}</Text>

                {calendarMonths.map((month, mIdx) => (
                    <View key={mIdx} style={styles.monthBlock}>
                        <Text style={styles.monthTitle}>{String(month.name)} {String(month.year)}</Text>
                        <View style={styles.datesGrid}>
                            {[...Array(month.startDayOffset)].map((_, i) => (
                                <View key={`empty-${mIdx}-${i}`} style={styles.dateCell} />
                            ))}
                            {[...Array(month.daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${month.year}-${month.monthIndex}-${day}`;
                                const isSelected = !!selectedDates[dateStr];

                                return (
                                    <TouchableOpacity
                                        key={day}
                                        style={[styles.dateCell, isSelected && styles.dateCellSelected]}
                                        onPress={() => handleDatePress(month.year, month.monthIndex, day)}
                                    >
                                        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{day}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next →</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const getBMIStatus = (val) => {
        const v = parseFloat(val);
        if (v < 18.5) return { label: 'Underweight', color: '#FFAB00' }; // Amber
        if (v >= 18.5 && v < 25) return { label: 'Healthy', color: '#4CAF50' }; // Green
        if (v >= 25 && v < 30) return { label: 'Overweight', color: '#FF9800' }; // Orange
        return { label: 'Obese', color: '#F44336' }; // Red
    };

    const renderBMI = () => {
        const status = bmiResult ? getBMIStatus(bmiResult) : null;

        return (
            <View style={styles.bmiContainer}>
                <Text style={styles.questionText}>{currentStep.question}</Text>
                <Text style={styles.descriptionText}>{currentStep.description}</Text>

                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#ccc"
                            value={weight}
                            onChangeText={setWeight}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#ccc"
                            value={heightCm}
                            onChangeText={setHeightCm}
                        />
                    </View>
                </View>

                {bmiResult ? (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>BMI Status</Text>
                        <Text style={[styles.resultValue, { color: status.color }]}>
                            {status.label}
                        </Text>
                        <Text style={{ fontSize: 16, color: '#557C60', marginTop: 4 }}>BMI: {bmiResult}</Text>
                    </View>
                ) : (
                    <View style={[styles.resultContainer, { backgroundColor: '#f0f0f0' }]}>
                        <Text style={[styles.resultLabel, { color: '#aaa' }]}>Enter details to calculate</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next →</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderQuestion = () => (
        <View>
            <Text style={styles.questionText}>{currentStep.question}</Text>
            {currentStep.options.map((option, index) => {
                const isSelected = answers[currentStep.id]?.label === option.label;
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            isSelected && styles.optionSelected
                        ]}
                        onPress={() => handleOptionSelect(option)}
                    >
                        <Text style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected
                        ]}>{option.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const renderProgressBar = () => {
        const progress = ((currentStepIndex + 1) / questionnaireData.length) * 100;
        return (
            <View style={[styles.progressContainer, { marginTop: insets.top + 10 }]}>
                {/* Top Row: Back Button & Step Counter */}
                <View style={styles.progressHeaderRow}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.progressText}>{currentStepIndex + 1}<Text style={styles.progressTotal}>/{questionnaireData.length}</Text></Text>
                    {/* Placeholder for symmetry if needed, or just space-between */}
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />
            {/* White Header Background */}
            <View style={styles.headerBackground} />

            {/* Header */}
            <View style={styles.header}>
                {renderProgressBar()}
            </View>

            {/* Content Card */}
            <View style={styles.card}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {currentStep.type === 'personal-details' && renderPersonalDetails()}
                    {currentStep.type === 'question' && renderQuestion()}
                    {currentStep.type === 'calendar' && renderCalendar()}
                    {currentStep.type === 'bmi' && renderBMI()}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background for the whole container
    },
    headerBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF', // White header
        height: height * 0.15, // Reduced height since no gradient needing space
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        zIndex: 1,
        backgroundColor: '#FFFFFF',
    },
    progressContainer: {
        width: '100%',
        marginBottom: 10,
    },
    progressHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    backButton: {
        padding: 10,
        paddingLeft: 0,
    },
    backText: {
        fontSize: 28,
        color: '#1B3A23', // Dark Green for visibility on White
        fontWeight: '300',
    },
    progressText: {
        color: '#1B3A23', // Dark Green
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    progressTotal: {
        fontSize: 14,
        color: '#888', // Grey for total
        fontWeight: '400',
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        backgroundColor: '#F0F0F0', // Light grey track
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1B3A23', // Dark Green Fill
        borderRadius: 3,
    },
    card: {
        flex: 1,
        backgroundColor: '#F9FCFA', // Keep slightly off-white for card to distinguish? Or matching design?
        // If header is white, maybe card background should be white too effectively, or slightly different.
        // Keeping it consistent with previous design but fixing header.
        marginTop: 0,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 24,
        paddingTop: 32,
        // Remove shadow if looking flat, or keep for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    scrollContent: {
        paddingBottom: 60,
    },
    sectionTitle: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: 24,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    questionText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1B3A23',
        marginBottom: 32,
        lineHeight: 30,
        fontFamily: 'serif',
        textAlign: 'left',
    },
    descriptionText: {
        fontSize: 15,
        color: '#557C60',
        marginBottom: 24,
        lineHeight: 22,
        fontStyle: 'italic',
    },

    // Form Styles
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#557C60',
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    datePickerText: {
        fontSize: 16,
        color: '#1B3A23',
    },

    optionButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#E6F4EA',
        borderColor: '#4CAF50',
        borderWidth: 1.5,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    optionTextSelected: {
        color: '#1B3A23',
        fontWeight: '700',
    },

    // BMI Styles
    bmiContainer: {
        alignItems: 'center',
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    inputWrapper: {
        width: '48%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        backgroundColor: '#FFFFFF',
        color: '#1B3A23',
        fontWeight: '600',
    },
    calculateButton: {
        display: 'none', // Hiding as per request
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    resultContainer: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#E6F4EA',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        minHeight: 100,
        justifyContent: 'center',
    },
    resultLabel: {
        fontSize: 14,
        color: '#557C60',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    resultValue: {
        fontSize: 32, // Smaller font for text labels like 'Healthy'
        fontWeight: 'bold',
        color: '#4CAF50',
    },

    // Calendar Styles
    calendarContainer: {
        width: '100%',
    },
    monthBlock: {
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1B3A23',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    datesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateCell: {
        width: '14.28%', // 7 days
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
    },
    dateCellSelected: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
    },
    dateText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    dateTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noteText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },

    nextButton: {
        marginTop: 10,
        paddingVertical: 16,
        paddingHorizontal: 40,
        alignSelf: 'center',
        backgroundColor: '#1B3A23', // Matching header theme? Or keep bright green?
        // Let's make it Dark Green to match the new "White/Dark" header aesthetic.
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#1B3A23',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default QuestionnaireScreen;
