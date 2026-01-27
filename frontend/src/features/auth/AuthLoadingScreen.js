import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../context/UserContext';
import api from '../../services/api';

const AuthLoadingScreen = ({ navigation }) => {
    const { updateUser } = useUser();

    useEffect(() => {
        checkLoginState();
    }, []);

    const checkLoginState = async () => {
        try {
            // 1. Check if we have a stored User ID (simulated login persistence)
            // In a real app, you'd check Supabase Auth Session here
            const storedUserId = await AsyncStorage.getItem('user_id');
            const demoUserId = '123e4567-e89b-12d3-a456-426614174000'; // Hardcoded for demo

            // For this demo, let's assume if they passed OTP, they are 'logged in' with the demo ID
            // Ideally OTPScreen sets this AsyncStorage item

            if (storedUserId || true) { // Force true for demo flow check
                // 2. Check if Profile Exists in Backend
                const profile = await api.user.getProfile(demoUserId);

                if (profile && profile.id) {
                    // User exists and has a profile!
                    // Load their data into context
                    updateUser({
                        name: profile.full_name,
                        riskLevel: profile.risk_level,
                        isGuest: false,
                        // ... load other fields
                    });

                    // SKIP Questionnaire -> Go to Home
                    navigation.replace('Home', {
                        screen: 'Cycle',
                        params: { userName: profile.full_name }
                    });
                } else {
                    // User logged in but NO profile -> Go to Questionnaire
                    navigation.replace('Questionnaire');
                }
            } else {
                // Not logged in
                navigation.replace('Login');
            }
        } catch (error) {
            console.error('Auth Check Error:', error);
            // Fallback
            navigation.replace('Login');
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4CAF50" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default AuthLoadingScreen;
