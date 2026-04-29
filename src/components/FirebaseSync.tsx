'use client';
import { useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppStore } from '@/lib/store';
import { saveProgress, loadProgress } from '@/lib/persistence';

export function FirebaseSync() {
  const { user, setUser, xp, badges, questSteps, persona, onboardingCompleted, onboardingAnswers, eligibility, voteHistory, reports, reminders } = useAppStore();
  const isInitialMount = useRef(true);

  // Sync Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);

        // Load progress from cloud on first login in this session
        const cloudData = await loadProgress(firebaseUser.uid);
        if (cloudData) {
          // We could merge or overwrite. For a hackathon, overwriting local with cloud is usually expected for "sync".
          // But to be safe, we only load if local is empty or older.
          // For simplicity, we just merge some key fields if they exist.
          const store = useAppStore.getState();
          if (cloudData.xp > store.xp) {
            useAppStore.setState({
              xp: cloudData.xp,
              badges: cloudData.badges || store.badges,
              questSteps: cloudData.questSteps || store.questSteps,
              persona: cloudData.persona || store.persona,
              level: cloudData.level || store.level,
            });
          }
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  // Sync Progress to Cloud
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (user?.uid) {
      const dataToSave = {
        xp,
        badges,
        questSteps,
        persona,
        onboardingCompleted,
        onboardingAnswers,
        eligibility,
        voteHistory,
        reports,
        reminders,
        level: useAppStore.getState().level,
      };
      saveProgress(user.uid, dataToSave);
    }
  }, [user, xp, badges, questSteps, persona, onboardingCompleted, onboardingAnswers, eligibility, voteHistory, reports, reminders]);

  return null;
}
