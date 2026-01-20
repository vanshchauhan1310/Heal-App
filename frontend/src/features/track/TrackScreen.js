import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TrackScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Track Screen / Modal</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
    },
});

export default TrackScreen;
