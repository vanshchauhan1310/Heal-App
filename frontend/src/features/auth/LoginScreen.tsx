import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../../config/firebase';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { sendOTP } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    // reCAPTCHA ref
    const recaptchaVerifier = useRef<any>(null);

    const handleContinue = async () => {
        if (phoneNumber.length >= 10) {
            setLoading(true);
            try {
                const fullPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

                if (!recaptchaVerifier.current) {
                    throw new Error("reCAPTCHA verifier not ready");
                }

                // Pass the current verifier to the sendOTP function
                const confirmation = await sendOTP(fullPhone, recaptchaVerifier.current);

                navigation.navigate('OTP', {
                    phoneNumber: fullPhone,
                    confirmationResult: confirmation
                });
            } catch (error: any) {
                Alert.alert("Login Failed", error.message || "Could not connect to Firebase.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig as any}
                    attemptInvisibleVerification={true}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../assets/intro/intro.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Enter your number</Text>

                            <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
                                <Text style={styles.label}>Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    placeholder="98765 43210"
                                    placeholderTextColor="#A0C8A0"
                                    selectionColor="#4CAF50"
                                    maxLength={10}
                                    editable={!loading}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#4CAF50', '#2E7D32']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.buttonText}>Continue</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <Text style={styles.disclaimer}>
                                By clicking, I accept the <Text style={styles.link}>terms of service</Text> and <Text style={styles.link}>privacy policy</Text>
                            </Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F4EA',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logo: {
        width: '70%',
        height: '70%',
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B3A23',
        marginBottom: 30,
        fontFamily: 'serif',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        position: 'relative',
        height: 60,
        justifyContent: 'center',
        marginBottom: 40,
    },
    inputFocused: {
        borderColor: '#2E7D32',
        borderWidth: 2,
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
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
        fontSize: 18,
        color: '#1B3A23',
        fontWeight: '500',
        width: '100%',
        height: '100%',
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
        marginBottom: 20,
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
    disclaimer: {
        fontSize: 11,
        color: '#557C60',
        textAlign: 'center',
        lineHeight: 18,
    },
    link: {
        fontWeight: 'bold',
        color: '#1B3A23',
    },
});

export default LoginScreen;
