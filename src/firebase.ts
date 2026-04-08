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
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
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
