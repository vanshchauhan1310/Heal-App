import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import CycleCalendarStrip from './CycleCalendarStrip';
import api from '../../../services/api';

const HomeHeroSection = ({ user, onOpenLog, selectedDate, setSelectedDate }) => {
    const [dayLogs, setDayLogs] = useState(null);
    const [cycleDisplay, setCycleDisplay] = useState({ title: "Day 1", phase: "Follicular" });

    // Mock cycle data for strip (replace with api call later)
    const [periodDays, setPeriodDays] = useState([]);

    const fetchDayLogs = async () => {
        // In real app, get userid from user object or context
        const userId = user?.id || '123e4567-e89b-12d3-a456-426614174000';
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        try {
            const data = await api.wellness.getDailyLog(userId, dateKey);
            setDayLogs(data);
        } catch (e) {
            setDayLogs(null);
        }
    };

    useEffect(() => {
        fetchDayLogs();
        // Calculate Phase Logic (Simplified placeholder)
        if (user?.lastPeriodDate) {
            // Logic to update cycleDisplay would go here
        }
    }, [selectedDate, user]);

    return (
        <View style={styles.container}>
            {/* Green Card */}
            <LinearGradient colors={['#2D6A4F', '#1B4332']} style={styles.greenCard}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>Hey, {user?.name?.split(' ')[0] || "Friend"}</Text>
                        <Text style={styles.date}>{format(selectedDate, "EEEE, MMM d")}</Text>
                    </View>
                    <TouchableOpacity style={styles.calBtn}>
                        <Ionicons name="calendar-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <CycleCalendarStrip
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    periodDays={periodDays}
                />

                <View style={styles.miniStatsRow}>
                    <View style={styles.miniStat}>
                        <Text style={styles.miniLabel}>Cycle Status</Text>
                        <Text style={styles.miniValue}>Regular</Text>
                    </View>
                    <View style={styles.miniStat}>
                        <Text style={styles.miniLabel}>Next Period</Text>
                        <Text style={styles.miniValue}>In ~12 Days</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Floating Daily Card */}
            <View style={styles.floatingCardContainer}>
                <View style={styles.floatingCard}>
                    <Text style={styles.phaseLabel}>{cycleDisplay.phase} PHASE</Text>
                    <Text style={styles.dayTitle}>{cycleDisplay.title}</Text>

                    {dayLogs ? (
                        <View>
                            <View style={styles.logSummary}>
                                <View style={styles.logItem}>
                                    <Text style={styles.logLabel}>Mood</Text>
                                    <Text style={styles.logValue}>{dayLogs.mood || "-"}</Text>
                                </View>
                                <View style={styles.logItem}>
                                    <Text style={styles.logLabel}>Symptoms</Text>
                                    <Text style={styles.logValue} numberOfLines={1}>
                                        {dayLogs.symptoms?.length ? dayLogs.symptoms.join(", ") : "None"}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.editBtn} onPress={onOpenLog}>
                                <Text style={styles.editBtnText}>Edit Log</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionBtnPrimary} onPress={onOpenLog}>
                                <Ionicons name="add" size={24} color="white" />
                                <Text style={styles.actionBtnText}>Log Symptoms</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtnSecondary}>
                                <Ionicons name="water-outline" size={24} color="#E91E63" />
                                <Text style={[styles.actionBtnText, { color: '#E91E63' }]}>Log Period</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    greenCard: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingTop: 60,
        paddingBottom: 80,
        paddingHorizontal: 20
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greeting: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    date: { color: 'rgba(255,255,255,0.8)' },
    calBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 20 },
    miniStatsRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
    miniStat: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12, minWidth: 100 },
    miniLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
    miniValue: { color: 'white', fontWeight: 'bold' },

    floatingCardContainer: { paddingHorizontal: 20, marginTop: -60 },
    floatingCard: { backgroundColor: 'white', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    phaseLabel: { color: '#999', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    dayTitle: { fontSize: 28, fontWeight: 'bold', color: '#1B4332', marginBottom: 20 },

    actionButtons: { flexDirection: 'row', gap: 10 },
    actionBtnPrimary: { flex: 1, backgroundColor: '#2D6A4F', padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
    actionBtnSecondary: { flex: 1, backgroundColor: '#FCE4EC', padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
    actionBtnText: { color: 'white', fontWeight: 'bold' },

    logSummary: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    logItem: { flex: 1, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 12 },
    logLabel: { color: '#999', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    logValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    editBtn: { backgroundColor: '#e0f7fa', padding: 12, borderRadius: 12, alignItems: 'center' },
    editBtnText: { color: '#006064', fontWeight: 'bold' }
});

export default HomeHeroSection;
