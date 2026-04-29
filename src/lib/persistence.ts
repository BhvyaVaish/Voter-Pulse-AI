import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Saves the current user progress to Firestore.
 * @param uid The user's unique identifier.
 * @param data The progress data to save.
 */
export async function saveProgress(uid: string, data: Record<string, unknown>) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Loads the user progress from Firestore.
 * @param uid The user's unique identifier.
 */
export async function loadProgress(uid: string) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return null;
}
