import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Login Wrapper
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }

        res.status(200).json({ user: data.user, session: data.session });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Signup Wrapper (Optional, simpler to just use client-side for most cases, but good for admin)
export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(201).json({ user: data.user, session: data.session });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

// Send OTP (Phone)
export const sendOtp = async (req: Request, res: Response) => {
    const { phone } = req.body;
    if (!phone) {
        res.status(400).json({ error: 'Phone number is required' });
        return;
    }
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
    if (!phone || !token) {
        res.status(400).json({ error: 'Phone and OTP are required' });
        return;
    }
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
        res.status(200).json({ user: data.user, session: data.session });
    } catch (err: any) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
