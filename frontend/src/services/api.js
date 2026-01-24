import { Platform } from 'react-native';

// Use localhost for iOS simulator
// Use 192.168.29.212 for Android/Physical devices to reach the backend on this machine
const BASE_URL = Platform.OS === 'android' ? 'http://192.168.29.212:5000/api' : 'http://localhost:5000/api';

let authToken = null;

const api = {
    setToken: (token) => {
        authToken = token;
    },
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.session?.access_token) {
                authToken = data.session.access_token;
            }
            return data;
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
            const data = await response.json();
            if (data.session?.access_token) {
                authToken = data.session.access_token;
            }
            return data;
        },
    },
    user: {
        updateProfile: async (data) => {
            const response = await fetch(`${BASE_URL}/users/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data),
            });
            return response.json();
        }
    }
};

export default api;
