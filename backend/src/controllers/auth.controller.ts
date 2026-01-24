import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Login Wrapper
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Signup Wrapper
export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(201).json({
            message: 'Registration successful',
            user: data.user,
            session: data.session
        });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Send OTP (Phone)
export const sendOtp = async (req: Request, res: Response) => {
    const { phone } = req.body;

    try {
        const { error } = await supabase.auth.signInWithOtp({
            phone,
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Verify OTP (Phone)
export const verifyOtp = async (req: Request, res: Response) => {
    const { phone, token } = req.body;

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });

        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }

        res.status(200).json({
            message: 'OTP verified successfully',
            user: data.user,
            session: data.session
        });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
