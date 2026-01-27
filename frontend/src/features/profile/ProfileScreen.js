import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { useUser } from '../../context/UserContext';

const ProfileScreen = ({ navigation }) => {
    const { userData } = useUser();

    const menuItems = [
        { icon: 'settings-outline', label: 'Account', color: '#4CAF50' },
        { icon: 'shield-checkmark-outline', label: 'Privacy', color: '#4CAF50' },
        { icon: 'moon-outline', label: 'Preferences', color: '#4CAF50' },
        { icon: 'help-circle-outline', label: 'Help & Support', color: '#4CAF50' },
    ];

    return (
        <View style={styles.container}>
            <CustomHeader />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person-outline" size={40} color="#2E7D32" />
                        </View>
                        <View style={styles.editBadge}>
                            <Ionicons name="ellipsis-horizontal" size={12} color="#666" />
                        </View>
                    </View>

                    <Text style={styles.userName}>{userData.name || 'User'}</Text>
                    <Text style={styles.userDetails}>
                        📅 {userData.age || '18'} years old   Guest Account
                    </Text>

                    {/* Risk Report Badge */}
                    <View style={styles.riskBadge}>
                        <View style={styles.shieldIcon}>
                            <Ionicons name="shield-checkmark" size={16} color="#FF9800" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.riskLabel}>ASSESSMENT RESULT</Text>
                            <Text style={styles.riskValue}>{userData.riskLevel || 'Moderate'} Risk</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewReportText}>View Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. Community Activity Button */}
                <TouchableOpacity
                    style={styles.activityButton}
                    onPress={() => navigation.navigate('CommunityActivity')}
                >
                    <View style={styles.activityIconBox}>
                        <Ionicons name="chatbubbles-outline" size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.activityText}>Community Activity</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <Text style={styles.sectionHeader}>Settings</Text>

                {/* 3. Settings List */}
                <View style={styles.settingsList}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuIconBox}>
                                <Ionicons name={item.icon} size={20} color="#555" />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#eee" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 4. Log Out */}
                <TouchableOpacity style={styles.logoutButton}>
                    <View style={styles.logoutIconBox}>
                        <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
                    </View>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
    },
    // Profile Card
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1B5E20', // Dark Green
        marginBottom: 4,
    },
    userDetails: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    riskBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1', // Light Orange bg
        padding: 12,
        borderRadius: 16,
        width: '100%',
    },
    shieldIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFE0B2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    riskLabel: {
        fontSize: 10,
        color: '#E65100',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    riskValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    viewReportText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#BF360C',
        textDecorationLine: 'underline',
    },

    // Community Activity
    activityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    activityIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    activityText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1B5E20',
    },

    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 4,
    },

    // Settings
    settingsList: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 8,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuIconBox: {
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },

    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
    },
    logoutIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEBEE', // Light Red
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D32F2F', // Red
    },
});

export default ProfileScreen;
