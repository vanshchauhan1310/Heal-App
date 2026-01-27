import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        name: 'Guest',
        age: '',
        riskLevel: 'Moderate', // Default or from quiz
        points: 0,
        isGuest: true,
    });

    // Community Interactions
    const [savedPosts, setSavedPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user_data');
            const storedSaved = await AsyncStorage.getItem('saved_posts');
            const storedLiked = await AsyncStorage.getItem('liked_posts');

            if (storedUser) setUserData(JSON.parse(storedUser));
            if (storedSaved) setSavedPosts(JSON.parse(storedSaved));
            if (storedLiked) setLikedPosts(JSON.parse(storedLiked));
        } catch (e) {
            console.error('Failed to load user data');
        }
    };

    const updateUser = async (newData) => {
        const updated = { ...userData, ...newData };
        setUserData(updated);
        await AsyncStorage.setItem('user_data', JSON.stringify(updated));
    };

    const toggleSavePost = async (postId) => {
        let newSaved;
        if (savedPosts.includes(postId)) {
            newSaved = savedPosts.filter(id => id !== postId);
        } else {
            newSaved = [...savedPosts, postId];
        }
        setSavedPosts(newSaved);
        await AsyncStorage.setItem('saved_posts', JSON.stringify(newSaved));
    };

    const toggleLikePost = async (postId) => {
        let newLiked;
        if (likedPosts.includes(postId)) {
            newLiked = likedPosts.filter(id => id !== postId);
        } else {
            newLiked = [...likedPosts, postId];
        }
        setLikedPosts(newLiked);
        await AsyncStorage.setItem('liked_posts', JSON.stringify(newLiked));
    };

    return (
        <UserContext.Provider value={{
            userData,
            updateUser,
            savedPosts,
            toggleSavePost,
            likedPosts,
            toggleLikePost
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
