/**
 * @file firebase.ts
 * @description Firebase initialization with environment-variable-based configuration.
 * Values are injected at build time via Dockerfile ENV directives in production,
 * or via .env.local during local development.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration sourced from NEXT_PUBLIC_ environment variables.
 * These are embedded at build time by Next.js and available on the client.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Firebase application instance (singleton pattern).
 * Prevents re-initialization during hot module replacement.
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
