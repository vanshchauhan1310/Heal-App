import { db } from '../config/firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { User } from '../types';

export const userService = {
    createUser: async (uid: string, phone: string) => {
        const userRef = doc(db, 'users', uid);
        const newUser: Partial<User> = {
            uid,
            phone,
            full_name: '',
            email: null,
            onboarding_complete: false,
            onboarded_via: 'app',
            created_at: serverTimestamp() as any,
            updated_at: serverTimestamp() as any,
        };
        await setDoc(userRef, newUser, { merge: true });
    },

    getUser: async (uid: string): Promise<User | null> => {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? (userSnap.data() as User) : null;
    },

    updateUser: async (uid: string, data: Partial<User>) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            updated_at: serverTimestamp(),
        });
    },

    completeOnboarding: async (uid: string, data: Partial<User>) => {
        const userRef = doc(db, 'users', uid);

        // Calculate Age if DOB is provided
        let age = data.age;
        if (data.date_of_birth && !age) {
            try {
                const dobDate = typeof data.date_of_birth.toDate === 'function'
                    ? data.date_of_birth.toDate()
                    : new Date(data.date_of_birth as any);

                const today = new Date();
                age = today.getFullYear() - dobDate.getFullYear();
                const m = today.getMonth() - dobDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                    age--;
                }
            } catch (e) {
                console.warn("Age calculation failed:", e);
            }
        }

        // Calculate BMI if height and weight provided
        let bmiValue = data.bmi;
        let bmiCat = data.bmi_category;
        if (data.height_cm && data.weight_kg && !bmiValue) {
            const hMeters = data.height_cm / 100;
            bmiValue = parseFloat((data.weight_kg / (hMeters * hMeters)).toFixed(1));

            if (bmiValue < 18.5) bmiCat = 'underweight';
            else if (bmiValue < 25) bmiCat = 'normal';
            else if (bmiValue < 30) bmiCat = 'overweight';
            else bmiCat = 'obese';
        }

        // Prepare the update object, filtering out ANY undefined fields
        const updateData: any = {
            ...data,
            onboarding_complete: true,
            onboarded_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        if (age !== undefined) updateData.age = age;
        if (bmiValue !== undefined) updateData.bmi = bmiValue;
        if (bmiCat !== undefined) updateData.bmi_category = bmiCat;

        // Clean up any other potential undefineds in data spread
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await updateDoc(userRef, updateData);
    }
};
