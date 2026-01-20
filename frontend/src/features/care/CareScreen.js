import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CareScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Care Screen</Text>
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

export default CareScreen;
