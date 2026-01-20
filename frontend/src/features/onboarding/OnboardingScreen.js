import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { onboardingData } from '../../constants/onboardingData';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Animation values for text content
    const textOpacity = useRef(new Animated.Value(1)).current;
    const textTranslateY = useRef(new Animated.Value(0)).current;

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
            // Trigger text animation on slide change
            animateText();
        }
    }).current;

    const animateText = () => {
        textOpacity.setValue(0);
        textTranslateY.setValue(20);
        Animated.parallel([
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(textTranslateY, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('Login');
        }
    };

    const renderItem = ({ item, index }) => {
        // Parallax effect for image
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const imageScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const imageOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.slide}>
                <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }], opacity: imageOpacity }]}>
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {/* Subtle glow effect behind image could be added here if needed */}
                </Animated.View>

                {/* Text Container is static relative to slide, but content animates */}
                <View style={styles.textContainerWrapper}>
                    {/* We render text here to make it part of the scroll or keep it static? 
                 Design has it sliding with card. Let's keep it in slide. */}
                    <View style={styles.textContent}>
                        <Text style={styles.title}>
                            {item.title.split(' ').map((word, i) => {
                                const isHighlight = ['Heal', 'Health', 'Insights'].includes(word);
                                return (
                                    <Text key={i} style={isHighlight ? styles.highlightText : {}}>
                                        {word}{' '}
                                    </Text>
                                );
                            })}
                        </Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>

                    {/* Button inside the card */}
                    <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>
                                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                            {/* Arrow Icon could go here */}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#2E5E36', '#1B3A23', '#0F2213']} // Deep, premium green gradient
                style={StyleSheet.absoluteFill}
            />

            <Animated.FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfig}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B3A23',
    },
    slide: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    imageContainer: {
        position: 'absolute',
        top: height * 0.1, // Push down slightly from top
        width: width * 0.9, // Constrain width
        height: height * 0.5, // Reduced height to fit image better without huge gaps
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30, // Rounded corners for the "container" look
        overflow: 'hidden', // Enforce rounded corners on children (image)
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 30, // Match container
    },
    textContainerWrapper: {
        width: width,
        height: height * 0.35, // Reduced height slightly to pull things together
        backgroundColor: '#F1F8F3',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 32,
        paddingTop: 30, // Reduced top padding
        alignItems: 'center',
        justifyContent: 'flex-start', // Stack from top
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
        paddingBottom: 20, // Add bottom padding for safety
    },
    textContent: {
        alignItems: 'center',
        marginBottom: 0, // Removed bottom margin to bring button closer
    },
    title: {
        fontSize: 28, // Slightly smaller to save space if needed
        fontWeight: '700',
        color: '#1B3A23',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'serif',
        letterSpacing: 0.5,
    },
    highlightText: {
        color: '#4CAF50',
        fontStyle: 'italic',
    },
    description: {
        fontSize: 14,
        color: '#557C60',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'Roboto',
        paddingHorizontal: 12,
        marginBottom: 20, // Space between text and button
    },
    button: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 10, // Small gap from description
        // Removed marginBottom: 40 and marginTop: 'auto'
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default OnboardingScreen;
