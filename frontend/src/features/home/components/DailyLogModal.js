import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import api from '../../../services/api';
import { useUser } from '../../../context/UserContext';

const SYMPTOMS_LIST = [
    { id: "cramps", label: "Cramps", icon: "water-outline", lib: Ionicons },
    { id: "bloating", label: "Bloating", icon: "cloud-outline", lib: Ionicons },
    { id: "fatigue", label: "Fatigue", icon: "battery-charging", lib: MaterialCommunityIcons },
    { id: "mood_swings", label: "Mood", icon: "emoticon-outline", lib: MaterialCommunityIcons },
    { id: "headache", label: "Headache", icon: "brain", lib: MaterialCommunityIcons },
    { id: "acne", label: "Acne", icon: "flash-outline", lib: Ionicons },
];

const MOODS = [
    { id: "happy", label: "Happy", icon: "emoticon-happy-outline", color: "#4CAF50" },
    { id: "neutral", label: "Neutral", icon: "emoticon-neutral-outline", color: "#9E9E9E" },
    { id: "sad", label: "Sad", icon: "emoticon-sad-outline", color: "#2196F3" },
    { id: "irritated", label: "Irritated", icon: "emoticon-angry-outline", color: "#F44336" },
];

const DailyLogModal = ({ visible, onClose, date, currentData, onSave }) => {
    const { userData } = useUser(); // Need userId 
    // In real app, userId should be in context. Assuming hardcoded demo ID for now if missing.
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        flowIntensity: "",
        symptoms: [],
        mood: "",
        notes: "",
        hydration: 0,
        sleep: 7,
        exercise: 0
    });

    useEffect(() => {
        if (visible) {
            if (currentData) {
                setFormData(currentData);
            } else {
                setFormData({
                    flowIntensity: "",
                    symptoms: [],
                    mood: "",
                    notes: "",
                    hydration: 0,
                    sleep: 7,
                    exercise: 0
                });
            }
        }
    }, [visible, currentData]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const dateKey = format(date, 'yyyy-MM-dd');
            await api.wellness.saveDailyLog({
                userId: userId,
                date: dateKey,
                ...formData
            });
            if (onSave) onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save log", error);
            alert("Failed to save log");
        } finally {
            setLoading(false);
        }
    };

    const toggleSymptom = (id) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(id)
                ? prev.symptoms.filter(s => s !== id)
                : [...prev.symptoms, id]
        }));
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Daily Log</Text>
                        <Text style={styles.subtitle}>{format(date, "EEEE, MMMM do")}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* Hydration & Sleep Row */}
                    <View style={styles.row}>
                        <View style={[styles.card, { backgroundColor: '#e0f7fa' }]}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="water" size={20} color="#006064" />
                                <Text style={styles.cardValue}>{formData.hydration}</Text>
                            </View>
                            <Text style={styles.cardLabel}>Glasses</Text>
                            <View style={styles.counterRow}>
                                <TouchableOpacity onPress={() => setFormData({ ...formData, hydration: Math.max(0, formData.hydration - 1) })}>
                                    <Ionicons name="remove-circle" size={24} color="#00838F" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setFormData({ ...formData, hydration: formData.hydration + 1 })}>
                                    <Ionicons name="add-circle" size={24} color="#00838F" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.card, { backgroundColor: '#e8eaf6' }]}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="moon" size={20} color="#1a237e" />
                                <Text style={styles.cardValue}>{formData.sleep}</Text>
                            </View>
                            <Text style={styles.cardLabel}>Hours Sleep</Text>
                            <View style={styles.counterRow}>
                                <TouchableOpacity onPress={() => setFormData({ ...formData, sleep: Math.max(0, formData.sleep - 0.5) })}>
                                    <Ionicons name="remove-circle" size={24} color="#3949AB" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setFormData({ ...formData, sleep: formData.sleep + 0.5 })}>
                                    <Ionicons name="add-circle" size={24} color="#3949AB" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Symptoms */}
                    <Text style={styles.sectionTitle}>Symptoms</Text>
                    <View style={styles.symptomsGrid}>
                        {SYMPTOMS_LIST.map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                style={[styles.chip, formData.symptoms.includes(s.id) && styles.activeChip]}
                                onPress={() => toggleSymptom(s.id)}
                            >
                                <s.lib name={s.icon} size={16} color={formData.symptoms.includes(s.id) ? 'white' : '#666'} />
                                <Text style={[styles.chipText, formData.symptoms.includes(s.id) && styles.activeChipText]}>{s.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Mood */}
                    <Text style={styles.sectionTitle}>Mood</Text>
                    <View style={styles.moodRow}>
                        {MOODS.map((m) => (
                            <TouchableOpacity
                                key={m.id}
                                style={[styles.moodItem, formData.mood === m.id && { borderColor: m.color, borderWidth: 2, backgroundColor: m.color + '10' }]}
                                onPress={() => setFormData({ ...formData, mood: m.id })}
                            >
                                <MaterialCommunityIcons name={m.icon} size={32} color={formData.mood === m.id ? m.color : '#ccc'} />
                                <Text style={[styles.moodText, formData.mood === m.id && { color: m.color }]}>{m.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Notes */}
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Anything else?"
                        multiline
                        numberOfLines={4}
                        value={formData.notes}
                        onChangeText={(t) => setFormData({ ...formData, notes: t })}
                    />

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Entry</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderColor: '#f0f0f0' },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { color: '#666' },
    closeBtn: { padding: 5, backgroundColor: '#f5f5f5', borderRadius: 20 },
    content: { padding: 20 },
    row: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    card: { flex: 1, padding: 15, borderRadius: 16, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardValue: { fontSize: 24, fontWeight: 'bold' },
    cardLabel: { fontSize: 12, opacity: 0.7, marginVertical: 5 },
    counterRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10, textTransform: 'uppercase', color: '#888' },
    symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#eee', gap: 5 },
    activeChip: { backgroundColor: '#9C27B0', borderColor: '#9C27B0' },
    chipText: { fontSize: 14, color: '#666' },
    activeChipText: { color: 'white' },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
    moodItem: { alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
    moodText: { fontSize: 12, marginTop: 4, color: '#888' },
    input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, minHeight: 100, textAlignVertical: 'top' },
    footer: { padding: 20, borderTopWidth: 1, borderColor: '#f0f0f0' },
    saveBtn: { backgroundColor: '#1B4332', padding: 16, borderRadius: 16, alignItems: 'center' },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default DailyLogModal;
