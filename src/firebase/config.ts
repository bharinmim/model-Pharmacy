import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAdrNVAjtGvMWjE23lkbT0Enevb0Akx3w0",
  authDomain: "model-pharmacy-2cbd3.firebaseapp.com",
  projectId: "model-pharmacy-2cbd3",
  storageBucket: "model-pharmacy-2cbd3.firebasestorage.app",
  messagingSenderId: "444083432304",
  appId: "1:444083432304:web:60f767d6bde15f36b9bdb5"
};

// Initialize Firebase safely (avoid re-initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Generic Firestore Sync Helper with try-catch
export async function syncDocToFirestore<T>(collectionName: string, docId: string, data: T): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data as any, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[Firebase] Firestore sync for ${collectionName}/${docId}:`, error);
    return false;
  }
}

export async function fetchDocFromFirestore<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as T;
    }
  } catch (error) {
    console.warn(`[Firebase] Firestore fetch for ${collectionName}/${docId}:`, error);
  }
  return null;
}
