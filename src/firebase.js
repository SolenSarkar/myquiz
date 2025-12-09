import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as sdkSignInWithPopup,
  signOut as sdkSignOut
} from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Firebase config (must come from .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Debug check
console.log("Loaded Firebase API Key:", firebaseConfig.apiKey)

if (!firebaseConfig.apiKey) {
  throw new Error(
    "Firebase API key missing! Check your .env file and restart Vite."
  )
}

// Initialize Firebase once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

// Optional analytics
try {
  if (firebaseConfig.measurementId) getAnalytics(app)
} catch (e) {
  console.warn("Analytics not available in dev", e)
}

// Auth
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export const signInWithPopup = () => sdkSignInWithPopup(auth, provider)
export const signOut = () => sdkSignOut(auth)

export { app, auth, provider, }


