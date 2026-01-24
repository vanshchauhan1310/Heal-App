import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { name, dob, height, weight, bmi, bmiStatus } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: User ID not found' });
        return;
    }

    try {
        // Update user metadata in Supabase Auth
        // Note: Using admin.updateUserById requires service_role key if done from backend, 
        // but since we are just updating metadata of the logged-in user, 
        // we should ideally use the user's own session if possible, 
        // or ensure the backend has the right permissions.

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
