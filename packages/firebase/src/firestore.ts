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
  limit,
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

// Game-specific helpers

export const saveGameScore = async (
  userId: string,
  score: number,
  level?: number
): Promise<void> => {
  await createDocument('scores', `${userId}_${Date.now()}`, {
    userId,
    score,
    level,
    timestamp: new Date(),
  });
};

export const getUserScores = async (userId: string): Promise<DocumentData[]> => {
  return queryDocuments(
    'scores',
    where('userId', '==', userId),
    orderBy('score', 'desc'),
    limit(10)
  );
};

export const getTopScores = async (limitCount = 10): Promise<DocumentData[]> => {
  return queryDocuments(
    'scores',
    orderBy('score', 'desc'),
    limit(limitCount)
  );
};

