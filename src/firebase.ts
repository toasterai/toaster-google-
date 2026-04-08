import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from 'firebase/auth';

// ============================================================
// SETUP: Replace these with your Firebase project credentials.
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your apps > Add web app
// 4. Copy the firebaseConfig object and paste below
// 5. Enable Authentication > Sign-in method > Email/Password AND Google
// ============================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDELhKUVd59FX1lctWBcvQzDmc1zj7dW10",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "toasterai.org",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "toasterai-b9c65",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "toasterai-b9c65.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1068248009964",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1068248009964:web:19f223ebe7b654c40ba9c9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GPXEXJFT46",
};

const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.error('Firebase initialization failed:', err);
  }
} else {
  console.warn('Firebase not configured. Auth features disabled.');
}

export { auth, googleProvider };

// --- Auth Helper Functions ---

export async function signUp(email: string, password: string) {
  if (!auth) throw { code: 'auth/not-configured', message: 'Firebase is not configured. Please set up your Firebase environment variables.' };
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logIn(email: string, password: string) {
  if (!auth) throw { code: 'auth/not-configured', message: 'Firebase is not configured. Please set up your Firebase environment variables.' };
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
  if (!auth) return;
  return signOut(auth);
}

export async function signInWithGoogle() {
  if (!auth || !googleProvider) throw { code: 'auth/not-configured', message: 'Firebase is not configured. Please set up your Firebase environment variables.' };
  return signInWithPopup(auth, googleProvider);
}

export { onAuthStateChanged, type User };
