import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        if (phoneNumber.length >= 10) {
            setLoading(true);
            try {
                // Call Backend API
                // For now, Supabase requires country code. Assuming +91 or adding it.
                // Let's assume user enters 10 digits, we append country code.
                const fullPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

                const result = await api.auth.sendOtp(fullPhone);

                if (result.error) {
                    alert("Login Failed: " + result.error);
                } else {
                    navigation.navigate('OTP', { phoneNumber: fullPhone });
                }
            } catch (error) {
                alert("Error: Could not connect to server.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter a valid phone number");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        {/* Logo Section */}
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../assets/intro/intro.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Input Section */}
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
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#4CAF50', '#2E7D32']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>Continue</Text>
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
        backgroundColor: '#E6F4EA', // Light green background matching reference
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
        backgroundColor: '#E6F4EA', // Match bg to hide border
        paddingHorizontal: 4,
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
        zIndex: 1, // Ensure label is above border
    },
    input: {
        fontSize: 18,
        color: '#1B3A23',
        fontWeight: '500',
        width: '100%',
        height: '100%', // Take full height of container
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
