import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password
  );
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

// Sign in with email and password
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password
  );
  return userCredential.user;
};

// Sign out
export const logOut = async (): Promise<void> => {
  await signOut(getFirebaseAuth());
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
};

// Auth state observer
export const observeAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(getFirebaseAuth(), callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getFirebaseAuth().currentUser;
};

