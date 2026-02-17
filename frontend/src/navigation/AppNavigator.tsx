import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from '../features/onboarding/IntroScreen';
import OnboardingScreen from '../features/onboarding/OnboardingScreen';
import LoginScreen from '../features/auth/LoginScreen';
import OTPScreen from '../features/auth/OTPScreen';
import QuestionnaireScreen from '../features/screener/QuestionnaireScreen';
import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { authenticated, loading, user } = useAuth();

    console.log("AppNavigator render. auth:", authenticated, "user:", !!user, "onboarding:", user?.onboarding_complete);

    // If loading auth state OR (logged in but waiting for user doc)
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!authenticated ? (
                <>
                    <Stack.Screen name="Intro" component={IntroScreen as any} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen as any} />
                    <Stack.Screen name="Login" component={LoginScreen as any} />
                    <Stack.Screen name="OTP" component={OTPScreen as any} />
                </>
            ) : (
                <>
                    {!user?.onboarding_complete ? (
                        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen as any} />
                    ) : (
                        <Stack.Screen name="Home" component={MainTabNavigator as any} />
                    )}
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
