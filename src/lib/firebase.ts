import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "REDACTED_FIREBASE_API_KEY",
  authDomain: "REDACTED_AUTH_DOMAIN",
  projectId: "REDACTED_PROJECT_ID",
  storageBucket: "REDACTED_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "REDACTED_SENDER_ID",
  appId: "1:REDACTED_SENDER_ID:web:4890a8eba6f688ff9a2f0e",
  measurementId: "REDACTED_MEASUREMENT_ID",
};

/**
 * Firebase application instance.
 */
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 */
export const auth = getAuth(app);

/**
 * Firestore Database instance.
 */
export const db = getFirestore(app);

/**
 * Google Auth Provider instance for Sign-in with Google.
 */
export const googleProvider = new GoogleAuthProvider();
