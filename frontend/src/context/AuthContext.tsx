import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User as FirebaseUser,
    signInWithPhoneNumber,
    ConfirmationResult,
    signOut
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authenticated: boolean;
    sendOTP: (phoneNumber: string, verifier: any) => Promise<ConfirmationResult>;
    verifyOTP: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        let unsubscribeDoc: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setAuthenticated(true);
                // Listen to user data from Firestore in real-time
                const userRef = doc(db, 'users', firebaseUser.uid);

                unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data() as User;
                        console.log("AuthContext: User doc updated. onboarding_complete:", userData.onboarding_complete);
                        setUser(userData);
                    } else {
                        console.log("AuthContext: User doc does not exist.");
                        setUser(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("User doc snapshot error:", error);
                    setLoading(false);
                });
            } else {
                if (unsubscribeDoc) unsubscribeDoc();
                setAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const sendOTP = async (phoneNumber: string, verifier: any) => {
        try {
            console.log("Sending OTP to:", phoneNumber);
            console.log("Auth object exists:", !!auth);
            console.log("Verifier object exists:", !!verifier);
            if (verifier) {
                console.log("Verifier type property:", verifier.type);
                console.log("Verifier has verify method:", typeof verifier.verify === 'function');
            }

            if (!auth || !phoneNumber || !verifier) {
                throw new Error("Missing required arguments for sendOTP");
            }

            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
            return confirmationResult;
        } catch (error) {
            console.error("Error in AuthContext.sendOTP:", error);
            throw error;
        }
    };

    const verifyOTP = async (confirmationResult: ConfirmationResult, code: string) => {
        console.log("AuthContext: Verifying OTP...");
        const result = await confirmationResult.confirm(code);

        if (result.user) {
            console.log("AuthContext: OTP Verified. UID:", result.user.uid);

            // 1. Immediately update UI state with minimal user data
            const minimalUser: any = {
                uid: result.user.uid,
                phone: result.user.phoneNumber || '',
                onboarding_complete: false,
            };
            setUser(minimalUser);
            setAuthenticated(true);

            // 2. Perform Firestore sync in the background WITHOUT awaiting
            // Use setDoc with { merge: true } so it works even if offline (will sync later)
            const syncUserBackground = async () => {
                try {
                    const userRef = doc(db, 'users', result.user.uid);

                    // We use setDoc here instead of getDoc + create/update.
                    // This is "fire and forget" and Firestore handles the queuing if offline.
                    console.log("AuthContext: Queuing background sync...");
                    await setDoc(userRef, {
                        uid: result.user.uid,
                        phone: result.user.phoneNumber || '',
                        updated_at: serverTimestamp(),
                    }, { merge: true });

                    console.log("AuthContext: Background sync queued successfully.");
                } catch (e) {
                    // SILENT fail - we don't want to break the UI if sync is slow or offline
                    console.log("AuthContext: Background sync notice (ignore if offline):", e);
                }
            };

            syncUserBackground();
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, authenticated, sendOTP, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
