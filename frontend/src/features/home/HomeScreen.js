import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../../context/UserContext';
import HomeHeroSection from './components/HomeHeroSection';
import HomeInsights from './components/HomeInsights';
import HomeQuickActions from './components/HomeQuickActions';
import DailyLogModal from './components/DailyLogModal';

const HomeScreen = ({ navigation }) => {
    const { userData } = useUser();
    const [isLogModalVisible, setLogModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. Hero Section (Green Card + Calendar) */}
                <HomeHeroSection
                    user={userData}
                    onOpenLog={() => setLogModalVisible(true)}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />

                {/* 2. Insights */}
                <HomeInsights user={userData} />

                {/* 3. Quick Actions */}
                <HomeQuickActions
                    onNavigate={navigation.navigate}
                    onOpenLog={() => setLogModalVisible(true)}
                />

                {/* Spacer for Bottom Tabs */}
                <View style={{ height: 100 }} />
            </ScrollView>

            <DailyLogModal
                visible={isLogModalVisible}
                onClose={() => setLogModalVisible(false)}
                date={selectedDate}
                onSave={() => {
                    // Optional: Global refresh or just rely on modal internal state + simple re-renders
                    // To be perfect, we could pass a 'refreshTrigger' to Hero
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray bg
    },
    scrollContent: {
        flexGrow: 1,
    }
});

export default HomeScreen;
