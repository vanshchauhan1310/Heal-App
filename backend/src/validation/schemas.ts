import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const sendOtpSchema = z.object({
    phone: z.string().min(10, 'Invalid phone number'),
});

export const verifyOtpSchema = z.object({
    phone: z.string().min(10, 'Invalid phone number'),
    token: z.string().length(6, 'OTP must be 6 digits'),
});

export const updateProfileSchema = z.object({
    name: z.string().optional(),
    dob: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    bmi: z.number().optional(),
    bmiStatus: z.string().optional(),
});
