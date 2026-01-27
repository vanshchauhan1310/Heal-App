import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* 
 * A utility wrapper to ensure consistent safe area handling 
 * across screens that don't need the custom header 
 */
const ScreenWrapper = ({ children, style }) => {
    return (
        <SafeAreaView style={[styles.container, style]} edges={['top']}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default ScreenWrapper;
