import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { screeningService } from '../../services/screeningService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ route, navigation }: any) => {
    const { user } = useAuth();
    const [latestScreening, setLatestScreening] = useState<any>(null);

    useEffect(() => {
        if (user) {
            loadLatestScreening();
        }
    }, [user]);

    const loadLatestScreening = async () => {
        if (!user) return;
        const screening = await screeningService.getLatestScreening(user.uid);
        setLatestScreening(screening);
    };

    const userName = user?.full_name || route.params?.userName || 'Friend';
    const riskCategory = user?.latest_risk_level || route.params?.riskCategory || 'low';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. Header Card */}
                <LinearGradient
                    colors={['#7d4595ff', '#E67E22']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCard}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greetingText}>Hello, {userName}! ✨</Text>
                            <Text style={styles.subGreetingText}>
                                {latestScreening ? `Latest Risk: ${riskCategory.toUpperCase()}` : 'Complete your screener to see your risk level'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.headerCircle} onPress={() => navigation.navigate('Consult')}>
                            <Ionicons name="person" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* 2. Cycle Card */}
                <LinearGradient
                    colors={['#4CAF50', '#2E7D32']}
                    style={styles.cycleCard}
                >
                    <View style={styles.cycleRow}>
                        <View style={styles.cycleIndicator}>
                            <Ionicons name="calendar-outline" size={24} color="white" />
                        </View>

                        <View style={styles.cycleInfo}>
                            <Text style={styles.cycleTitle}>Cycle Status</Text>
                            <Text style={styles.cycleSubtitle}>
                                {user?.last_period_date ? 'Tracking active' : 'Log your period to start tracking'}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.expandButton}>
                            <Ionicons name="chevron-down" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.phaseInfoRow}>
                        <Ionicons name="sunny-outline" size={24} color="white" style={{ marginRight: 10 }} />
                        <View>
                            <Text style={styles.phaseTitle}>Follicular Phase</Text>
                            <Text style={styles.phaseDesc}>Energy levels are rising, great time for activity.</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* 3. PCOS Risk Assessment (Gauge) */}
                <View style={styles.riskCard}>
                    <View style={styles.riskHeader}>
                        <Text style={styles.sectionHeaderTitle}>PCOS Risk Assessment</Text>
                        <Ionicons name="information-circle-outline" size={20} color="#999" />
                    </View>

                    <View style={styles.gaugeContainer}>
                        <View style={styles.gaugeArch}>
                            <View style={[styles.gaugeSegment, { backgroundColor: '#4CAF50', borderTopLeftRadius: 100, flex: 1, opacity: riskCategory === 'low' ? 1 : 0.3 }]} />
                            <View style={[styles.gaugeSegment, { backgroundColor: '#FFAB00', flex: 1, opacity: riskCategory === 'moderate' ? 1 : 0.3 }]} />
                            <View style={[styles.gaugeSegment, { backgroundColor: '#F44336', borderTopRightRadius: 100, flex: 1, opacity: riskCategory === 'high' ? 1 : 0.3 }]} />
                        </View>
                        <View style={[styles.gaugeCenter, { backgroundColor: riskCategory === 'high' ? '#F44336' : riskCategory === 'moderate' ? '#FFAB00' : '#4CAF50' }]}>
                            <View style={styles.shieldIcon}>
                                <Ionicons name="shield-checkmark" size={32} color="white" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.riskLabels}>
                        <Text style={[styles.riskLabelText, { color: '#4CAF50' }]}>Low</Text>
                        <Text style={[styles.riskLabelText, { color: '#FFAB00' }]}>Medium</Text>
                        <Text style={[styles.riskLabelText, { color: '#F44336' }]}>High</Text>
                    </View>

                    <Text style={styles.riskResultTitle}>{riskCategory.toUpperCase()} RISK</Text>
                    <Text style={styles.riskResultDesc}>
                        {riskCategory === 'high' ? 'We recommend consulting a gynecologist.' : 'Consistency can bring meaningful improvement.'}
                    </Text>
                </View>

                {/* Rest of the UI components (Pillars, Success Stories, etc.) */}
                <Text style={styles.sectionTitle}>Four Pillars of HEAL</Text>
                <View style={styles.pillarsContainer}>
                    <PillarCard icon="body" color="#9C27B0" tag="YOGA" title="How to relieve PCOS symptoms with Guided Yoga" />
                    <PillarCard icon="restaurant" color="#4CAF50" tag="BEST DIET" title="What's the best diet plan for PCOS management?" />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const PillarCard = ({ icon, color, tag, title }: any) => (
    <View style={styles.pillarCard}>
        <View style={[styles.pillarIconBox, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="white" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={[styles.pillarTag, { backgroundColor: color + '20' }]}>
                <Text style={[styles.pillarTagText, { color: color }]}>{tag}</Text>
            </View>
            <Text style={styles.pillarTitle}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F9F6' },
    scrollContent: { padding: 20 },
    headerCard: { width: '100%', padding: 20, borderRadius: 24, marginBottom: 20, height: 120, justifyContent: 'center' },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greetingText: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
    subGreetingText: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
    headerCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    cycleCard: { padding: 20, borderRadius: 24, marginBottom: 20 },
    cycleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    cycleIndicator: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    cycleInfo: { flex: 1 },
    cycleTitle: { color: 'white', fontSize: 14, opacity: 0.9 },
    cycleSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
    expandButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    phaseInfoRow: { flexDirection: 'row', alignItems: 'center' },
    phaseTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    phaseDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 12, maxWidth: '90%' },
    riskCard: { backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 20, alignItems: 'center', elevation: 3 },
    riskHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    sectionHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    gaugeContainer: { height: 100, width: '100%', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10, overflow: 'hidden' },
    gaugeArch: { width: 200, height: 100, flexDirection: 'row', alignItems: 'flex-end' },
    gaugeSegment: { height: 20, marginBottom: 60 },
    gaugeCenter: { position: 'absolute', bottom: 0, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'white', marginBottom: 20, zIndex: 10 },
    riskLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: -10, marginBottom: 16 },
    riskLabelText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    riskResultTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    riskResultDesc: { fontSize: 12, color: '#666', textAlign: 'center', maxWidth: '80%' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16, marginLeft: 4 },
    pillarsContainer: { width: '100%', marginBottom: 24 },
    pillarCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 2 },
    pillarIconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    pillarTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 6 },
    pillarTagText: { fontSize: 10, fontWeight: 'bold' },
    pillarTitle: { fontSize: 14, fontWeight: '600', color: '#333', lineHeight: 20 },
});

export default HomeScreen;
