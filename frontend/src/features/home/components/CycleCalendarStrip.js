import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CycleCalendarStrip = ({ selectedDate, onSelectDate, periodDays = [] }) => {
    const scrollViewRef = useRef(null);
    const [weekDates, setWeekDates] = useState([]);

    useEffect(() => {
        // Generate a 2-week strip centered on today or selectedDate
        const start = addDays(selectedDate, -7);
        const dates = [];
        for (let i = 0; i < 15; i++) {
            dates.push(addDays(start, i));
        }
        setWeekDates(dates);

        // Scroll to center (simplified)
        setTimeout(() => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ x: SCREEN_WIDTH * 0.4, animated: true });
            }
        }, 100);
    }, [selectedDate]);

    const isPeriodDay = (date) => {
        return periodDays.some(d => isSameDay(new Date(d), date));
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {weekDates.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isPeriod = isPeriodDay(date);
                    const isToday = isSameDay(date, new Date());

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dateItem,
                                isSelected && styles.selectedItem,
                                isPeriod && !isSelected && styles.periodItem
                            ]}
                            onPress={() => onSelectDate(date)}
                        >
                            <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                                {format(date, 'EEE')}
                            </Text>
                            <Text style={[styles.dayNum, isSelected && styles.selectedText, isPeriod && !isSelected && styles.periodText]}>
                                {format(date, 'd')}
                            </Text>
                            {isToday && <View style={styles.dot} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    dateItem: {
        width: 50,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    selectedItem: {
        backgroundColor: 'white',
    },
    periodItem: {
        backgroundColor: 'rgba(255, 100, 100, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 100, 100, 0.4)'
    },
    dayName: {
        color: 'white',
        fontSize: 12,
        marginBottom: 4,
        opacity: 0.8
    },
    dayNum: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedText: {
        color: '#2D6A4F',
    },
    periodText: {
        color: '#ffcccb'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'white',
        marginTop: 4
    }
});

export default CycleCalendarStrip;
