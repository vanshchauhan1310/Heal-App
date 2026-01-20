import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommunityScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Community Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#ca1212ff',
    },
});

export default CommunityScreen;
