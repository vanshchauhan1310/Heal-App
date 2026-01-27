import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const HomeQuickActions = ({ onNavigate, onOpenLog }) => {
    const actions = [
        {
            id: 'period-tracker',
            label: 'Log Period',
            icon: 'water-outline',
            lib: Ionicons,
            color: '#E91E63',
            bgColor: '#FCE4EC'
        },
        {
            id: 'symptoms',
            label: 'Log Symptoms',
            icon: 'clipboard-list-outline',
            lib: MaterialCommunityIcons,
            color: '#FF9800',
            bgColor: '#FFF3E0',
            action: onOpenLog
        },
        {
            id: 'consultation',
            label: 'Book Doctor',
            icon: 'stethoscope',
            lib: MaterialCommunityIcons,
            color: '#9C27B0',
            bgColor: '#F3E5F5'
        },
        {
            id: 'community',
            label: 'Community',
            icon: 'people-outline',
            lib: Ionicons,
            color: '#2D6A4F',
            bgColor: '#E8F5E9'
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Quick Actions</Text>
            <View style={styles.grid}>
                {actions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={[styles.card, { backgroundColor: action.bgColor }]}
                        onPress={() => action.action ? action.action() : onNavigate(action.id)}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'white' }]}>
                            <action.lib name={action.icon} size={24} color={action.color} />
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>{action.label}</Text>
                            <Text style={styles.cardSub}>Tap to open</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 30
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    card: {
        width: '48%',
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
    },
    cardSub: {
        fontSize: 10,
        color: '#888'
    }
});

export default HomeQuickActions;
