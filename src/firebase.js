import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBNaX6-RiIHTp1003NREKfYX2AnH_BmAOI',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'globalpp-1.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'globalpp-1',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'globalpp-1.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '900286647865',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:900286647865:web:e2b706131518b05f9407e8',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-N3LDQ5DD3D'
};

// Initialize Firebase with error handling
let app;
let db;
let auth;
let functions;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  db = getFirestore(app);
  auth = getAuth(app);
  functions = getFunctions(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback: create mock services for development
  db = null;
  auth = null;
  functions = null;
}

// Export callable functions with error handling
export const trackAffiliateClick = httpsCallable(functions, 'trackAffiliateClick');

export { db, auth, functions };
export default app; 