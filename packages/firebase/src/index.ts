// Firebase configuration and utilities
export { 
  initializeFirebase, 
  getFirebaseApp, 
  getFirebaseAuth, 
  getFirebaseDb, 
  getFirebaseAnalytics,
  type FirebaseConfig 
} from './config';
export * from './auth';
export * from './firestore';

