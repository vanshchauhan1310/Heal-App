import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';

// Mock Data for Tabs
const MOCK_ACTIVITY = {
    LIKED: [
        { id: '1', user: 'Sarah Jenkins', time: '2 hours ago', content: 'Just completed my first week of consistently tracking my symptoms! It\'s amazing how much more aware I am of my body\'s signals. 🌱 #PCOSJourney #Wellness', likes: 24, comments: 5, liked: true },
        { id: '2', user: 'Maya K.', time: 'Yesterday', content: 'Has anyone else tried the spearmint tea remedy? I\'ve been drinking two cups a day for a month and I think it\'s actually helping! 🍵', likes: 156, comments: 42, liked: true },
    ],
    SAVED: [
        { id: '3', user: 'Dr. Emily', time: '3 days ago', content: 'Top 5 supplements for PCOS management: 1. Inositol, 2. Vitamin D, 3. Omega-3... (Read more)', likes: 89, comments: 12, saved: true },
    ],
    COMMENTED: [
        { id: '4', user: 'You', time: '1 hour ago', content: 'Replying to Sarah: That is awesome! Keep going!', likes: 2, comments: 0 },
    ]
};

const CommunityActivityScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('LIKED'); // LIKED, SAVED, COMMENTED

    const renderItem = ({ item }) => (
        <View style={styles.activityCard}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{item.user.substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.userName}>{item.user}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            <Text style={styles.postContent}>{item.content}</Text>

            <View style={styles.actionRow}>
                <View style={styles.statContainer}>
                    <Ionicons name="heart" size={18} color={activeTab === 'LIKED' || item.liked ? '#E91E63' : '#ccc'} />
                    <Text style={styles.statText}>{item.likes}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Ionicons name="chatbubble-outline" size={18} color="#999" />
                    <Text style={styles.statText}>{item.comments}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Ionicons name="share-social-outline" size={20} color="#999" />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomHeader />

            <View style={styles.headerTitleRow}>
                <Text style={styles.pageTitle}>Community Activity</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'LIKED' && styles.activeTabLiked]}
                    onPress={() => setActiveTab('LIKED')}
                >
                    <Ionicons name={activeTab === 'LIKED' ? "heart" : "heart-outline"} size={18} color={activeTab === 'LIKED' ? "white" : "#666"} />
                    <Text style={[styles.tabText, activeTab === 'LIKED' && { color: 'white' }]}>Liked</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'SAVED' && styles.activeTabDefault]}
                    onPress={() => setActiveTab('SAVED')}
                >
                    <Ionicons name={activeTab === 'SAVED' ? "bookmark" : "bookmark-outline"} size={18} color={activeTab === 'SAVED' ? "#333" : "#666"} />
                    <Text style={[styles.tabText, activeTab === 'SAVED' && { color: '#333' }]}>Saved</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'COMMENTED' && styles.activeTabDefault]}
                    onPress={() => setActiveTab('COMMENTED')}
                >
                    <Ionicons name={activeTab === 'COMMENTED' ? "chatbubble" : "chatbubble-outline"} size={18} color={activeTab === 'COMMENTED' ? "#333" : "#666"} />
                    <Text style={[styles.tabText, activeTab === 'COMMENTED' && { color: '#333' }]}>Commented</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_ACTIVITY[activeTab]}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: '#999' }}>No items yet.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerTitleRow: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B5E20',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    activeTabLiked: {
        backgroundColor: '#1B5E20', // Dark Green
    },
    activeTabDefault: {
        backgroundColor: '#E8F5E9',
    },
    tabText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activityCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD', // Light Blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1565C0',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    postContent: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
        fontWeight: '600',
    },
});

export default CommunityActivityScreen;
