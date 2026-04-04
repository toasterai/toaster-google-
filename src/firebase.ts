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
  apiKey: "AIzaSyDELhKUVd59FX1lctWBcvQzDmc1zj7dW10",
  authDomain: "toasterai-b9c65.firebaseapp.com",
  projectId: "toasterai-b9c65",
  storageBucket: "toasterai-b9c65.firebasestorage.app",
  messagingSenderId: "1068248009964",
  appId: "1:1068248009964:web:19f223ebe7b654c40ba9c9",
  measurementId: "G-GPXEXJFT46"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// --- Auth Helper Functions ---

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
  return signOut(auth);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export { onAuthStateChanged, type User };
