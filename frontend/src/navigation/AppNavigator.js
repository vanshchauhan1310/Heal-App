import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from '../features/onboarding/IntroScreen';
import OnboardingScreen from '../features/onboarding/OnboardingScreen';
import LoginScreen from '../features/auth/LoginScreen';
import OTPScreen from '../features/auth/OTPScreen';
import QuestionnaireScreen from '../features/screener/QuestionnaireScreen';
import AuthLoadingScreen from '../features/auth/AuthLoadingScreen';
import MainTabNavigator from './MainTabNavigator';

import ProfileScreen from '../features/profile/ProfileScreen';
import CommunityActivityScreen from '../features/profile/CommunityActivityScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
            <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
            <Stack.Screen name="Home" component={MainTabNavigator} />
            <Stack.Screen name="Consult" component={ProfileScreen} />
            <Stack.Screen name="CommunityActivity" component={CommunityActivityScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
