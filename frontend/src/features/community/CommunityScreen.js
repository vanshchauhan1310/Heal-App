import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import api from '../../services/api';
import { useUser } from '../../context/UserContext';

const CATEGORIES = ['All', 'Diet', 'Mental Health', 'Periods', 'PCOS', 'Fitness', 'Success Stories'];

const CommunityScreen = () => {
    const [activeMode, setActiveMode] = useState('PUBLIC'); // 'PUBLIC' or 'ANONYMOUS'
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newPostText, setNewPostText] = useState('');
    const [composeVisible, setComposeVisible] = useState(false); // Modal visibility

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, activeMode]);

    // Mock Data for Demo/Fallback
    const MOCK_POSTS = [
        {
            id: '1',
            user_id: 'u1',
            content: 'Has anyone tried seed cycling for PCOS? I just started and curious about results! 🌱',
            category: 'Diet',
            is_anonymous: false,
            likes: 12,
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            user_id: 'u2',
            content: 'Feeling really low energy today. Is this normal for follicular phase?',
            category: 'Mental Health',
            is_anonymous: true,
            likes: 5,
            created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: '3',
            user_id: 'u3',
            content: 'Just did 20 mins of yoga and feeling so much better! 🧘‍♀️',
            category: 'Fitness',
            is_anonymous: false,
            likes: 24,
            created_at: new Date(Date.now() - 172800000).toISOString()
        }
    ];

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // In a real app we'd filter by category/mode in the API
            const data = await api.community.getPosts(selectedCategory, activeMode);

            if (data && Array.isArray(data) && data.length > 0) {
                setPosts(data);
            } else {
                // If API returns empty (e.g. no DB table yet), use Mock Data filtered by mode
                console.log('Using Mock Data');
                const filteredMock = MOCK_POSTS.filter(p =>
                    (activeMode === 'ANONYMOUS' ? p.is_anonymous : !p.is_anonymous) &&
                    (selectedCategory === 'All' || p.category === selectedCategory)
                );
                setPosts(filteredMock);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Fallback to Mock Data on error too
            const filteredMock = MOCK_POSTS.filter(p =>
                (activeMode === 'ANONYMOUS' ? p.is_anonymous : !p.is_anonymous) &&
                (selectedCategory === 'All' || p.category === selectedCategory)
            );
            setPosts(filteredMock);
        } finally {
            setLoading(false);
        }
    };

    const { userData, toggleSavePost, savedPosts, toggleLikePost, likedPosts } = useUser(); // Context

    const handlePost = async () => {
        if (!newPostText.trim()) return;

        try {
            const newPost = {
                user_id: '123e4567-e89b-12d3-a456-426614174000', // Dummy UUID for now
                content: newPostText,
                category: selectedCategory === 'All' ? 'PCOS' : selectedCategory,
                is_anonymous: activeMode === 'ANONYMOUS',
                user_name: userData.name // Send Name to persist in DB (optional if using User Table join)
            };

            await api.community.createPost(newPost);
            setNewPostText('');
            setComposeVisible(false); // Close modal
            fetchPosts(); // Refresh
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again.');
        }
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(item)}
        >
            <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
            ]}>{item}</Text>
        </TouchableOpacity>
    );

    const renderPostItem = ({ item }) => {
        const isLiked = likedPosts.includes(item.id);
        const isSaved = savedPosts.includes(item.id);

        return (
            <View style={styles.tweetCard}>
                {/* Left: Avatar */}
                <View style={styles.tweetAvatarContainer}>
                    <Ionicons
                        name={item.is_anonymous ? "eye-off" : "person-circle"}
                        size={48}
                        color={item.is_anonymous ? "#2E7D32" : "#ccc"}
                    />
                </View>

                {/* Right: Content */}
                <View style={styles.tweetContentContainer}>
                    {/* Header: Name, Handle, Time */}
                    <View style={styles.tweetHeader}>
                        <Text style={styles.tweetName} numberOfLines={1}>
                            {item.is_anonymous ? 'Anonymous' : (item.user_name || 'Member')}
                        </Text>
                        <Text style={styles.tweetHandle} numberOfLines={1}>
                            @{item.is_anonymous ? 'anon_user' : (item.user_name ? item.user_name.replace(' ', '').toLowerCase() : 'user')}
                        </Text>
                        <Text style={styles.tweetSeparator}>·</Text>
                        <Text style={styles.tweetTime}>2h</Text>

                        {/* Category Chip in corner */}
                        <View style={styles.tweetCategoryChip}>
                            <Text style={styles.tweetCategoryText}>{item.category}</Text>
                        </View>
                    </View>

                    {/* Text Content */}
                    <Text style={styles.tweetText}>{item.content}</Text>

                    {/* Action Row */}
                    <View style={styles.tweetActions}>
                        <TouchableOpacity style={styles.tweetActionGroup}>
                            <Ionicons name="chatbubble-outline" size={18} color="#657786" />
                            <Text style={styles.tweetActionCount}>5</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tweetActionGroup} onPress={() => toggleLikePost(item.id)}>
                            {/* Toggle Heart Color */}
                            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? "#E91E63" : "#657786"} />
                            <Text style={[styles.tweetActionCount, isLiked && { color: '#E91E63' }]}>{item.likes + (isLiked ? 1 : 0)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tweetActionGroup} onPress={() => toggleSavePost(item.id)}>
                            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={18} color={isSaved ? "#4CAF50" : "#657786"} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tweetActionGroup}>
                            <Ionicons name="share-social-outline" size={18} color="#657786" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* 1. Global Header */}
            <CustomHeader />

            <ScrollView
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }} // Add bottom padding for tab bar
            >
                {/* Spacer to prevent touching header */}
                <View style={{ height: 16 }} />

                {/* 2. Banner Card */}
                <View style={styles.bannerContainer}>
                    <View style={styles.bannerCard}>
                        <Text style={styles.bannerTitle}>Community Support</Text>
                        <Text style={styles.bannerSubtitle}>Connect, share, and support each other.</Text>

                        {/* Toggle */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, activeMode === 'PUBLIC' && styles.toggleActivePublic]}
                                onPress={() => setActiveMode('PUBLIC')}
                            >
                                <Ionicons name="chatbubbles-outline" size={18} color={activeMode === 'PUBLIC' ? '#333' : '#666'} />
                                <Text style={[styles.toggleText, activeMode === 'PUBLIC' && styles.toggleTextActive]}>Public Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.toggleButton, activeMode === 'ANONYMOUS' && styles.toggleActiveAnon]}
                                onPress={() => setActiveMode('ANONYMOUS')}
                            >
                                <Ionicons name="shield-checkmark-outline" size={18} color={activeMode === 'ANONYMOUS' ? 'white' : '#666'} />
                                <Text style={[styles.toggleText, activeMode === 'ANONYMOUS' && { color: 'white' }]}>Annual Anonymous</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 3. Categories (Sticky) */}
                <View style={styles.categoriesContainer}>
                    <FlatList
                        data={CATEGORIES}
                        renderItem={renderCategoryItem}
                        keyExtractor={item => item}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    />
                </View>

                {/* 4. Feed */}
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.feedContainer}>
                        {posts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconCircle}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={40} color="#4CAF50" />
                                </View>
                                <Text style={styles.emptyText}>No posts yet in this category.</Text>
                                <Text style={styles.emptySubText}>Be the first to share!</Text>
                            </View>
                        ) : (
                            posts.map((item, index) => (
                                <View key={index}>{renderPostItem({ item })}</View>
                            ))
                        )}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Action Button for New Post */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setComposeVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            {/* Compose Modal */}
            <Modal
                visible={composeVisible}
                animationType="slide"
                transparent={false}
                presentationStyle="pageSheet" // iOS effect
            >
                <SafeAreaView style={styles.composeContainer}>
                    {/* Header */}
                    <View style={styles.composeHeader}>
                        <TouchableOpacity onPress={() => setComposeVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.postButton, (!newPostText.trim()) && styles.postButtonDisabled]}
                            onPress={handlePost}
                            disabled={!newPostText.trim()}
                        >
                            <Text style={styles.postButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Compose Area */}
                    <View style={styles.composeContent}>
                        <View style={styles.composeRow}>
                            <View style={[styles.avatar, activeMode === 'ANONYMOUS' && styles.anonAvatar]}>
                                <Ionicons
                                    name={activeMode === 'ANONYMOUS' ? "eye-off" : "person"}
                                    size={24}
                                    color={activeMode === 'ANONYMOUS' ? "#2E7D32" : "#aaa"}
                                />
                            </View>
                            <TextInput
                                style={styles.composeInput}
                                placeholder={activeMode === 'ANONYMOUS' ? "What's happening? (posting anonymously)" : "What's happening?"}
                                multiline
                                autoFocus
                                value={newPostText}
                                onChangeText={setNewPostText}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Toolbar / Options */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.composeToolbar}
                    >
                        <View style={styles.toolbarDivider} />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbarScroll}>
                            {/* Toggle Mode */}
                            <TouchableOpacity
                                style={[styles.toolbarChip, activeMode === 'ANONYMOUS' ? styles.toolbarChipActive : styles.toolbarChipInactive]}
                                onPress={() => setActiveMode(activeMode === 'PUBLIC' ? 'ANONYMOUS' : 'PUBLIC')}
                            >
                                <Ionicons
                                    name={activeMode === 'ANONYMOUS' ? "eye-off" : "earth"}
                                    size={16}
                                    color={activeMode === 'ANONYMOUS' ? "white" : "#4CAF50"}
                                />
                                <Text style={[styles.toolbarChipText, activeMode === 'ANONYMOUS' ? { color: 'white' } : { color: '#4CAF50' }]}>
                                    {activeMode === 'ANONYMOUS' ? 'Anonymous Mode' : 'Public Mode'}
                                </Text>
                            </TouchableOpacity>

                            {/* Category Selector */}
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.toolbarChip, selectedCategory === cat ? styles.toolbarChipActive : styles.toolbarChipInactive]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[styles.toolbarChipText, selectedCategory === cat ? { color: 'white' } : { color: '#555' }]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Light grey-white
    },
    // Banner
    bannerContainer: {
        backgroundColor: 'white', // Extend header white
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 10,
    },
    bannerCard: {
        backgroundColor: '#F2EBE5', // Beige
        borderRadius: 24,
        padding: 20,
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004D40', // Dark Green
        marginBottom: 8,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#E8E0D9', // Darker beige
        borderRadius: 16,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    toggleActivePublic: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    toggleActiveAnon: {
        backgroundColor: '#1B5E20', // Dark Green
    },
    toggleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
    toggleTextActive: {
        color: '#333',
    },

    // Categories
    categoriesContainer: {
        backgroundColor: '#F8F9FA',
        paddingVertical: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryChipActive: {
        backgroundColor: '#4CAF50', // Green
        borderColor: '#4CAF50',
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
    categoryTextActive: {
        color: 'white',
    },

    // FAB
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 110, // Above tab bar
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },

    // Compose Modal
    composeContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    composeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cancelText: {
        fontSize: 16,
        color: '#333',
    },
    postButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        backgroundColor: '#A5D6A7', // Light green
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    composeContent: {
        flex: 1,
        padding: 20,
    },
    composeRow: {
        flexDirection: 'row',
    },
    composeInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 18,
        color: '#333',
        minHeight: 150,
    },
    composeToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    toolbarScroll: {
        padding: 12,
    },
    toolbarChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    toolbarChipActive: {
        backgroundColor: '#4CAF50',
    },
    toolbarChipInactive: {
        backgroundColor: '#f5f5f5',
    },
    toolbarChipText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },

    // Tweet Style Feed
    tweetCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFF3F4',
    },
    tweetAvatarContainer: {
        marginRight: 12,
    },
    tweetContentContainer: {
        flex: 1,
    },
    tweetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    tweetName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#14171A',
        marginRight: 4,
    },
    tweetHandle: {
        fontSize: 14,
        color: '#657786',
        marginRight: 4,
        flexShrink: 1,
    },
    tweetSeparator: {
        fontSize: 14,
        color: '#657786',
        marginRight: 4,
    },
    tweetTime: {
        fontSize: 14,
        color: '#657786',
    },
    tweetCategoryChip: {
        marginLeft: 'auto',
        backgroundColor: '#F5F8FA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E1E8ED',
    },
    tweetCategoryText: {
        fontSize: 11,
        color: '#657786',
        fontWeight: '600',
    },
    tweetText: {
        fontSize: 15,
        color: '#14171A',
        lineHeight: 22,
        marginBottom: 10,
    },
    tweetActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 32, // Prevent spreading too wide
    },
    tweetActionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tweetActionCount: {
        fontSize: 12,
        color: '#657786',
        marginLeft: 4,
    },

    // Old Styles (Can Clean up)
    feedContainer: {
        backgroundColor: 'white', // Twitter feed is usually unified white background
        marginTop: 10,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

export default CommunityScreen;
