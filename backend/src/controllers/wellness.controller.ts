import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// --- LOGS ---

export const getDailyLog = async (req: Request, res: Response) => {
    const { userId, date } = req.query; // Expecting query params for specific day

    try {
        const { data, error } = await supabase
            .from('wellness_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.status(200).json(data || null); // Return null if no log exists
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const saveDailyLog = async (req: Request, res: Response) => {
    const { userId, date, flowIntensity, symptoms, mood, hydration, sleep, exercise, notes } = req.body;

    try {
        const { data, error } = await supabase
            .from('wellness_logs')
            .upsert({
                user_id: userId,
                date: date, // 'YYYY-MM-DD'
                flow_intensity: flowIntensity,
                symptoms: symptoms, // JSON B array
                mood: mood,
                hydration: hydration,
                sleep: sleep,
                exercise: exercise,
                notes: notes,
                created_at: new Date()
            }, { onConflict: 'user_id, date' })
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err: any) {
        console.error('Save Log Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// --- CYCLES ---

export const getCycles = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('cycles')
            .select('*')
            .eq('user_id', userId)
            .order('start_date', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const addCycle = async (req: Request, res: Response) => {
    const { userId, startDate, endDate, type } = req.body;

    try {
        const { data, error } = await supabase
            .from('cycles')
            .insert({
                user_id: userId,
                start_date: startDate,
                end_date: endDate,
                type: type || 'period'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
