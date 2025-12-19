import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "welder-inspection-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "welder-inspection-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "welder-inspection-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for PWA
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase offline persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all features required for persistence
      console.warn('Firebase offline persistence not supported in this browser');
    }
  });
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    // Only connect if not already connected
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }

    // @ts-ignore - Firestore emulator check
    if (!db._delegate._databaseId.projectId.includes('(default)')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }

    // @ts-ignore - Storage emulator check
    if (!storage._host.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch (error) {
    // Emulators already connected or not available
    console.log('Firebase emulators already connected or not available');
  }
}

export { app };
