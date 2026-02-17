import { db } from '../config/firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { Screening, User } from '../types';

const JAVA_BACKEND_URL = process.env.EXPO_PUBLIC_JAVA_BACKEND_URL || 'http://localhost:8080';

export const screeningService = {
    createScreening: async (userId: string): Promise<string> => {
        const screeningsRef = collection(db, 'users', userId, 'screenings');
        const newScreeningRef = doc(screeningsRef);
        const screeningId = newScreeningRef.id;

        const initialScreening: Partial<Screening> = {
            screening_id: screeningId,
            user_id: userId,
            version: 'v1.0',
            source: 'app',
            started_at: serverTimestamp() as any,
        };

        await setDoc(newScreeningRef, initialScreening);
        return screeningId;
    },

    updateScreeningAnswer: async (
        userId: string,
        screeningId: string,
        section: string,
        questionKey: string,
        answer: any
    ) => {
        const screeningRef = doc(db, 'users', userId, 'screenings', screeningId);
        await updateDoc(screeningRef, {
            [`responses.${section}.${questionKey}`]: answer,
        });
    },

    saveScreeningResults: async (userId: string, screeningId: string, results: Screening['results']) => {
        const screeningRef = doc(db, 'users', userId, 'screenings', screeningId);

        // Also calculate next period prediction via Java Backend
        let predictedNextPeriod = null;
        try {
            console.log("Fetching prediction from:", `${JAVA_BACKEND_URL}/api/predict-period`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(`${JAVA_BACKEND_URL}/api/predict-period`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, screeningId }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            predictedNextPeriod = data.predictedDate;
            console.log("Prediction successful:", predictedNextPeriod);
        } catch (error: any) {
            console.warn("Java Backend Prediction skipped (likely unreachable):", error.message);
        }

        await updateDoc(screeningRef, {
            results,
            completed_at: serverTimestamp(),
            predicted_next_period: predictedNextPeriod // Optional field based on new requirement
        });
    },

    getLatestScreening: async (userId: string): Promise<Screening | null> => {
        const screeningsRef = collection(db, 'users', userId, 'screenings');
        const q = query(screeningsRef, orderBy('started_at', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data() as Screening;
        }
        return null;
    },

    updateUserLatestScreening: async (
        userId: string,
        screeningId: string,
        riskLevel: string,
        riskScore: number
    ) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            latest_risk_level: riskLevel,
            latest_risk_score: riskScore,
            latest_screening_id: screeningId,
            latest_screened_at: serverTimestamp(),
        });
    }
};
