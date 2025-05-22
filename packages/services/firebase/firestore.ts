import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { PracticeItem, PracticeSession } from '../types';

// Firebase configuration will be reused from auth.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
const practiceItemsCollection = collection(db, 'practiceItems');
const practiceSessionsCollection = collection(db, 'practiceSessions');

// Practice Items CRUD operations
export const addPracticeItem = async (item: Omit<PracticeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date();
  const itemWithTimestamps = {
    ...item,
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(practiceItemsCollection, itemWithTimestamps);
  return { id: docRef.id, ...itemWithTimestamps };
};

export const getPracticeItem = async (id: string) => {
  const docRef = doc(db, 'practiceItems', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PracticeItem;
  }
  
  return null;
};

export const updatePracticeItem = async (id: string, item: Partial<PracticeItem>) => {
  const docRef = doc(db, 'practiceItems', id);
  
  const updates = {
    ...item,
    updatedAt: new Date()
  };
  
  await updateDoc(docRef, updates);
  
  return { id, ...updates };
};

export const deletePracticeItem = async (id: string) => {
  const docRef = doc(db, 'practiceItems', id);
  await deleteDoc(docRef);
  return id;
};

export const getUserPracticeItems = async (userId: string) => {
  const q = query(
    practiceItemsCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PracticeItem);
};

export const getDuePracticeItems = async (userId: string) => {
  const today = new Date();
  
  const q = query(
    practiceItemsCollection,
    where('userId', '==', userId),
    where('nextDue', '<=', today),
    orderBy('nextDue', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PracticeItem);
};

// Practice Sessions CRUD operations
export const addPracticeSession = async (session: Omit<PracticeSession, 'id'>) => {
  const docRef = await addDoc(practiceSessionsCollection, session);
  return { id: docRef.id, ...session };
};

export const getItemPracticeSessions = async (itemId: string, userId: string) => {
  const q = query(
    practiceSessionsCollection,
    where('itemId', '==', itemId),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PracticeSession);
}; 