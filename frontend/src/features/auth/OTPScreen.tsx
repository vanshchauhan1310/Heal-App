import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const OTPScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params || { phoneNumber: 'xxxxxxxxxx' };

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        const code = otp;
        if (code.length < 6) {
            Alert.alert("Invalid OTP", "Please enter the full 6-digit code.");
            return;
        }

        setLoading(true);
        try {
            const result = await api.auth.verifyOtp(phoneNumber, code);

            if (result.error) {
                Alert.alert("Verification Failed", result.error);
            } else {
                // Success: User is logged in.
                // Store session if needed? For now just navigate.
                Alert.alert("Success", "Verified successfully!", [
                    { text: "OK", onPress: () => navigation.replace('AuthLoading') }
                ]);
            }
        } catch (error) {
            Alert.alert("Error", "Could not verify code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setTimer(30);
        Alert.alert('OTP Resent', 'A new code has been sent to your device.');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>Verification Code</Text>
                        <Text style={styles.subtitle}>
                            Enter the 6-digit code sent to{'\n'}
                            <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Enter OTP</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={6} // User requested 123455 which is 6 digits
                                placeholder="------"
                                placeholderTextColor="#A0C8A0"
                            />
                        </View>

                        <View style={styles.resendContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.changeNumber}>Change number</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.timerContainer}>
                            <Text style={styles.timerText}>
                                Resend OTP in <Text style={styles.timerBold}>00:{timer < 10 ? `0${timer}` : timer}</Text>
                            </Text>
                            {timer === 0 && (
                                <TouchableOpacity onPress={handleResend}>
                                    <Text style={styles.resendLink}>Resend Now</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerify}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#2E7D32']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Verify and proceed</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F4EA', // Light green
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1B3A23',
        marginBottom: 10,
        fontFamily: 'serif',
    },
    subtitle: {
        fontSize: 14,
        color: '#557C60',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    phoneNumber: {
        fontWeight: 'bold',
        color: '#1B3A23',
    },
    inputContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        position: 'relative',
        height: 60,
        justifyContent: 'center',
        marginBottom: 10,
    },
    label: {
        position: 'absolute',
        top: -10,
        left: 12,
        backgroundColor: '#E6F4EA',
        paddingHorizontal: 4,
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
        zIndex: 1,
    },
    input: {
        fontSize: 24,
        color: '#1B3A23',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 5,
        width: '100%',
        height: '100%',
        paddingVertical: 0,
    },
    resendContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    changeNumber: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
    },
    timerContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 14,
        color: '#557C60',
    },
    timerBold: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    resendLink: {
        marginTop: 5,
        fontSize: 14,
        color: '#1B3A23',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    button: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default OTPScreen;
