import { Platform } from 'react-native';

// Use localhost for iOS simulator
// Use 192.168.29.212 for Android/Physical devices to reach the backend on this machine
const BASE_URL = Platform.OS === 'android' ? 'http://192.168.29.212:5000/api' : 'http://localhost:5000/api';

const api = {
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return response.json();
        },
        sendOtp: async (phone) => {
            const response = await fetch(`${BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            return response.json();
        },
        verifyOtp: async (phone, token) => {
            const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, token }),
            });
            return response.json();
        },
    },
    user: {
        updateProfile: async (data) => {
            const response = await fetch(`${BASE_URL}/users/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return response.json();
        }
    }
};

export default api;
