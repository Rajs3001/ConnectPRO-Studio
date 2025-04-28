
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration (Replace with your actual config)
// Consider using environment variables for sensitive keys
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGitcD0JK2my44GOoYqvUfPTCvPzCFITE", // Use environment variable or fallback
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "connectpro-p47uv.firebaseapp.com",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://connectpro-p47uv-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "connectpro-p47uv",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "connectpro-p47uv.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "817355298876",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:817355298876:web:a6fb8aa8c1caa4e5a90b39",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S22JYSEVYL" // Optional
};


// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics if supported (runs only on client-side)
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics initialized");
        } else {
            console.log("Firebase Analytics is not supported in this environment.");
        }
    });
}


export { app, auth, db, analytics };
