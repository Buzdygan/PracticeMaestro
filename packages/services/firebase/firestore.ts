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
    updatedAt: now,
    nextDue: now
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
  try {
    const today = new Date();
    const allItems: PracticeItem[] = [];
    
    // 1. Get all items for this user
    const userItemsQuery = query(
      practiceItemsCollection,
      where('userId', '==', userId)
    );
    
    const allItemsSnapshot = await getDocs(userItemsQuery);
    
    // 2. Process each item to determine if it's due
    allItemsSnapshot.docs.forEach(doc => {
      const item = { id: doc.id, ...doc.data() } as PracticeItem;
      
      // Case 1: Item has nextDue date and it's today or earlier
      if (item.nextDue) {
        // Convert Firestore timestamp or Date to JavaScript Date
        let nextDueDate: Date;
        
        // Handle Firestore timestamp
        if (typeof item.nextDue === 'object' && 'toDate' in item.nextDue) {
          nextDueDate = (item.nextDue as any).toDate();
        } 
        // Handle regular Date
        else if (item.nextDue instanceof Date) {
          nextDueDate = item.nextDue;
        }
        // Handle everything else as a date string
        else {
          nextDueDate = new Date(item.nextDue as any);
        }
          
        if (nextDueDate <= today) {
          allItems.push(item);
        }
      } 
      // Case 2: Item has never been practiced (no lastPracticed)
      else if (!item.lastPracticed) {
        allItems.push(item);
      }
    });
    
    // 3. Sort items by nextDue date (or createdAt if nextDue is not available)
    return allItems.sort((a, b) => {
      // Helper function to safely convert any timestamp to Date
      const toDate = (timestamp: any): Date => {
        if (timestamp instanceof Date) return timestamp;
        if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
          return timestamp.toDate();
        }
        return new Date(timestamp);
      };
      
      // If both have nextDue dates, compare those
      if (a.nextDue && b.nextDue) {
        const dateA = toDate(a.nextDue);
        const dateB = toDate(b.nextDue);
        return dateA.getTime() - dateB.getTime();
      }
      
      // If only one has a nextDue date, prioritize that one
      if (a.nextDue) return -1;
      if (b.nextDue) return 1;
      
      // If neither has a nextDue date, compare by createdAt
      const dateA = toDate(a.createdAt);
      const dateB = toDate(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
    
  } catch (error) {
    console.error("Error fetching practice items:", error);
    return [];
  }
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