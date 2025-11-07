import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';

// Generic CRUD operations

export const createDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> => {
  await setDoc(doc(getFirebaseDb(), collectionName, docId), data);
};

export const getDocument = async (
  collectionName: string,
  docId: string
): Promise<DocumentData | null> => {
  const docRef = doc(getFirebaseDb(), collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  const docRef = doc(getFirebaseDb(), collectionName, docId);
  await updateDoc(docRef, data);
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(getFirebaseDb(), collectionName, docId));
};

export const queryDocuments = async (
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<DocumentData[]> => {
  const q = query(collection(getFirebaseDb(), collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// User management functions

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  joinDate?: Date;
  level?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastSignIn?: Date;
}

export const createUserProfile = async (userProfile: UserProfile): Promise<void> => {
  await createDocument('users', userProfile.uid, {
    ...userProfile,
    createdAt: userProfile.createdAt,
    lastSignIn: userProfile.lastSignIn,
  });
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  await updateDocument('users', uid, updates);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const profile = await getDocument('users', uid);
  return profile as UserProfile | null;
};

export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  return queryDocuments('users', orderBy('createdAt', 'desc')) as Promise<UserProfile[]>;
};

export const getUsersByRole = async (role: 'admin' | 'user'): Promise<UserProfile[]> => {
  return queryDocuments('users', where('role', '==', role)) as Promise<UserProfile[]>;
};

export const getActiveUsers = async (): Promise<UserProfile[]> => {
  return queryDocuments('users', where('isActive', '==', true)) as Promise<UserProfile[]>;
};

