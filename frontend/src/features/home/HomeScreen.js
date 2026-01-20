import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const HomeScreen = ({ route, navigation }) => {
    // Get user name from navigation params, default to 'Friend' if not found
    const { userName } = route.params || { userName: 'Friend' };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. Header Card */}
                <LinearGradient
                    colors={['#7d4595ff', '#E67E22']} // Purple to Orange roughly based on image
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCard}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greetingText}>Hello, {userName}! ✨</Text>
                            <Text style={styles.subGreetingText}>Day 15 • Follicular Phase • Your energy is rising</Text>
                        </View>
                        {/* Profile Icon in Top Right */}
                        <TouchableOpacity style={styles.headerCircle} onPress={() => navigation.navigate('Consult')}>
                            <Ionicons name="person" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* 2. Cycle Card */}
                <LinearGradient
                    colors={['#4CAF50', '#2E7D32']} // Green Gradient
                    style={styles.cycleCard}
                >
                    <View style={styles.cycleRow}>
                        {/* Circular Indicator Placeholder */}
                        <View style={styles.cycleIndicator}>
                            <Ionicons name="calendar-outline" size={24} color="white" />
                        </View>

                        <View style={styles.cycleInfo}>
                            <Text style={styles.cycleTitle}>Your Cycle <Text style={styles.cycleDayHighlight}>Day 15</Text></Text>
                            <Text style={styles.cycleSubtitle}>December 2026 • of 28</Text>
                        </View>

                        <TouchableOpacity style={styles.expandButton}>
                            <Ionicons name="chevron-down" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.phaseInfoRow}>
                        <Ionicons name="sunny-outline" size={24} color="white" style={{ marginRight: 10 }} />
                        <View>
                            <Text style={styles.phaseTitle}>Ovulation Phase</Text>
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

                    {/* Gauge Visual Placeholder - Building a pure CSS semi-circle gauge is complex without SVG, 
                        using a simplified visual representation for now: A 3-color bar */}
                    <View style={styles.gaugeContainer}>
                        <View style={styles.gaugeArch}>
                            <View style={[styles.gaugeSegment, { backgroundColor: '#4CAF50', borderTopLeftRadius: 100, flex: 1 }]} />
                            <View style={[styles.gaugeSegment, { backgroundColor: '#FFAB00', flex: 1 }]} />
                            <View style={[styles.gaugeSegment, { backgroundColor: '#F44336', borderTopRightRadius: 100, flex: 1 }]} />
                        </View>
                        <View style={styles.gaugeCenter}>
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

                    <Text style={styles.riskResultTitle}>Medium Risk</Text>
                    <Text style={styles.riskResultDesc}>Consistency can bring meaningful improvement within months.</Text>
                </View>

                {/* 4. Promo Banner */}
                <LinearGradient
                    colors={['#8E2D56', '#D35400']} // Reddish Gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.promoCard}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.promoSubtitle}>Ready to transform?</Text>
                        <Text style={styles.promoTitle}>Start Your 3-Month HEAL Journey</Text>
                    </View>
                    <View style={styles.promoIcon}>
                        <Ionicons name="sparkles" size={24} color="white" />
                    </View>
                </LinearGradient>

                {/* 5. Four Pillars */}
                <Text style={styles.sectionTitle}>Four Pillars of HEAL</Text>
                <View style={styles.pillarsContainer}>
                    <PillarCard icon="body" color="#9C27B0" tag="YOGA" title="How to relieve PCOS symptoms with Guided Yoga" />
                    <PillarCard icon="restaurant" color="#4CAF50" tag="BEST DIET" title="What's the best diet plan for PCOS management?" />
                    <PillarCard icon="leaf" color="#8BC34A" tag="PERIOD PRODS" title="Eco-friendly period products for sustainable care" />
                    <PillarCard icon="checkbox" color="#FF9800" tag="DAILY HABITS" title="Daily habits to track for better PCOS outcomes" />
                </View>

                {/* 6. Success Stories */}
                <Text style={styles.sectionTitle}>Success Stories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    <SuccessCard name="Priya M." location="Mumbai" text="After 3 months on the HEAL journey, my cycles became more regular..." rating={5} />
                    <SuccessCard name="Sarah J." location="Delhi" text="The personalized approach changed my life completely." rating={5} />
                </ScrollView>

                {/* 7. Learn & Explore */}
                <Text style={styles.sectionTitle}>Learn & Explore</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    <ExploreCard title="Understand PCOS" time="2 min" icon="book" />
                    <ExploreCard title="Yoga for PCOS" time="7 min" icon="fitness" />
                    <ExploreCard title="PCOS Friendly" time="10 min" icon="nutrition" />
                </ScrollView>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Sub Components ---

const PillarCard = ({ icon, color, tag, title }) => (
    <View style={styles.pillarCard}>
        <View style={[styles.pillarIconBox, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="white" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={[styles.pillarTag, { backgroundColor: color + '20' }]}>
                <Text style={[styles.pillarTagText, { color: color }]}>{tag}</Text>
            </View>
            <Text style={styles.pillarTitle} numberOfLines={2}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </View>
);

const SuccessCard = ({ name, location, text, rating }) => (
    <View style={styles.successCard}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.successText}>"{text}"</Text>
        <View style={styles.ratingRow}>
            {[...Array(rating)].map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#FFC107" />
            ))}
        </View>
        <Text style={styles.successName}>{name}</Text>
        <Text style={styles.successLocation}>{location}</Text>
    </View>
);

const ExploreCard = ({ title, time, icon }) => (
    <View style={styles.exploreCard}>
        <Ionicons name={icon} size={32} color="#555" style={{ marginBottom: 10 }} />
        <Text style={styles.exploreTitle}>{title}</Text>
        <Text style={styles.exploreTime}>{time}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F9F6', // Light greenish-grey background
    },
    scrollContent: {
        padding: 20,
    },
    headerCard: {
        width: '100%',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
        height: 120,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subGreetingText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    headerCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Cycle Card
    cycleCard: {
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
    },
    cycleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cycleIndicator: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cycleInfo: {
        flex: 1,
    },
    cycleTitle: {
        color: 'white',
        fontSize: 14,
        opacity: 0.9,
    },
    cycleDayHighlight: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    cycleSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    expandButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    phaseInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phaseTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    phaseDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        maxWidth: '90%',
    },

    // Risk Card
    riskCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    riskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    sectionHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    gaugeContainer: {
        height: 100, // Reduced height for visual approximation
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
        overflow: 'hidden',
    },
    gaugeArch: {
        width: 200,
        height: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    gaugeSegment: {
        height: 20,
        marginBottom: 60, // Push up
    },
    gaugeCenter: {
        position: 'absolute',
        bottom: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFAB00', // Medium color
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    riskLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: -10,
        marginBottom: 16,
    },
    riskLabelText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    riskResultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    riskResultDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        maxWidth: '80%',
    },

    // Promo
    promoCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    promoSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 4,
    },
    promoTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    promoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    // Pillars
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 4,
    },
    pillarsContainer: {
        width: '100%',
        marginBottom: 24,
    },
    pillarCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    pillarIconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pillarTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    pillarTagText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    pillarTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        lineHeight: 20,
    },

    // Horizontal Scroll
    horizontalScroll: {
        marginBottom: 24,
    },
    successCard: {
        width: width * 0.7,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginRight: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    successText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#555',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    ratingRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    successName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    successLocation: {
        fontSize: 12,
        color: '#888',
    },
    exploreCard: {
        width: 120,
        height: 140,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    exploreTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    exploreTime: {
        fontSize: 12,
        color: '#888',
    },
});

export default HomeScreen;
