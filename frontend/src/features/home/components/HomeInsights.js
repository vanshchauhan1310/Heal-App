import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeInsights = ({ user }) => {
    const getTip = () => {
        if (user?.painLevel > 7) {
            return "High pain days are common with your condition. Try gentle movement and heat therapy.";
        }
        if (user?.conditions?.includes("PCOS")) {
            return "PCOS management: Regular exercise and balanced nutrition help regulate hormones.";
        }
        return "Tracking your symptoms helps identify patterns specific to your condition.";
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="bulb" size={24} color="#FFC107" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Tip for Today</Text>
                    <Text style={styles.tipText}>{getTip()}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#FFF8E1', // Light yellow/warm bg
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FFE082'
    },
    content: {
        flexDirection: 'row',
        gap: 15
    },
    iconContainer: {
        justifyContent: 'center'
    },
    textContainer: {
        flex: 1
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#F57F17',
        textTransform: 'uppercase',
        marginBottom: 4
    },
    tipText: {
        color: '#424242',
        fontSize: 14,
        lineHeight: 20
    }
});

export default HomeInsights;
