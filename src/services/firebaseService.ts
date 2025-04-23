import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  WithFieldValue,
} from "firebase/firestore";

// Test connection to Firestore
export const testDbConnection = async () => {
  try {
    const testCollection = collection(db, "books");
    const timestamp = new Date().toISOString();
    const docRef = await addDoc(testCollection, { timestamp });
    console.log("Firebase Firestore connected successfully!", docRef.id);

    // Clean up by deleting the test document
    await deleteDoc(doc(db, 'books', docRef.id));
    return true;
  } catch (error) {
    console.error("Error connecting to Firebase:", error);
    return false;
  }
};

// Generic function to add a document to a collection
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...(data as T) };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Get all documents from a collection
export const getDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// Get a specific document by ID
export const getDocumentById = async (
  collectionName: string,
  docId: string
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, data as any);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
