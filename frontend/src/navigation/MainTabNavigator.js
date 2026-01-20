import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../features/home/HomeScreen';
import CareScreen from '../features/care/CareScreen'; // Used as HEAL tab
import TrackScreen from '../features/track/TrackScreen';
import CommunityScreen from '../features/community/CommunityScreen';
import ConsultScreen from '../features/consult/ConsultScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30, // Move up higher to match design
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
        }}
        onPress={onPress}
    >
        <View style={{
            width: 60, // Slightly smaller match image
            height: 60,
            borderRadius: 30,
            backgroundColor: '#4CAF50', // Green Theme
            marginBottom: 4, // Spacing for text
        }}>
            {children}
        </View>
        {/* Add Label Manually since we replace the button content */}
        <Text style={{
            fontSize: 12,
            color: '#555',
            fontWeight: '600',
            textAlign: 'center'
        }}>
            Track
        </Text>
    </TouchableOpacity>
);

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#4CAF50', // Green for active tab text
                tabBarInactiveTintColor: '#777', // Grey for inactive
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    height: 90, // Taller footer
                    paddingTop: 10,
                    ...styles.shadow, // Add shadow for "exact match" 
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    paddingBottom: 5,
                }
            }}
        >
            <Tab.Screen
                name="Cycle"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="home-outline" size={28} color={focused ? '#4CAF50' : '#777'} />
                    ),
                }}
            />
            <Tab.Screen
                name="HEAL"
                component={CareScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="heart-outline" size={28} color={focused ? '#4CAF50' : '#777'} />
                    ),
                }}
            />
            <Tab.Screen
                name="Track"
                component={TrackScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="plus" size={35} color="white" />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ),
                    // Hide default label because we render it manually in CustomTabBarButton
                    tabBarLabel: () => null,
                }}
            />
            <Tab.Screen
                name="Community"
                component={CommunityScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="account-group-outline" size={28} color={focused ? '#4CAF50' : '#777'} />
                    ),
                }}
            />
            <Tab.Screen
                name="Consult"
                component={ConsultScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="stethoscope" size={28} color={focused ? '#4CAF50' : '#777'} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
});

export default MainTabNavigator;
