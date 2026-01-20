import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const updateProfile = async (req: Request, res: Response) => {
    const { userId, name, dob, height, weight, bmi, bmiStatus } = req.body;

    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        // Update user metadata in Supabase Auth
        const { data, error } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { name, dob, height, weight, bmi, bmiStatus } }
        );

        if (error) {
            console.error('Supabase Update Error:', error);
            res.status(500).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'Profile updated successfully', user: data.user });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
