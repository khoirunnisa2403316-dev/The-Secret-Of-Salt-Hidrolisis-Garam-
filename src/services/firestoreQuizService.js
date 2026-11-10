import {
  db,
  isFirebaseConfigured,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
} from './firebase';

/**
 * Save completed quiz attempt to Cloud Firestore
 */
export async function saveQuizAttemptToFirestore(attempt, userId) {
  if (!isFirebaseConfigured() || !db || !userId) {
    return { success: false, reason: 'Firebase or userId unavailable' };
  }

  try {
    const attemptDocRef = doc(db, 'quiz_attempts', attempt.attemptId);
    const payload = {
      attemptId: attempt.attemptId,
      userId,
      guestSessionId: attempt.guestSessionId || '',
      questionVersion: attempt.questionVersion || '1.0.0',
      moduleId: 'modul-1-konsep-dasar',
      totalQuestions: attempt.totalQuestions || 10,
      correctCount: attempt.correctCount,
      score: attempt.score,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      answers: attempt.answers || {},
      syncedAt: serverTimestamp(),
    };

    await setDoc(attemptDocRef, payload, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Failed to save quiz attempt to Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Retrieve user's quiz attempt history from Cloud Firestore
 */
export async function fetchUserQuizHistoryFromFirestore(userId) {
  if (!isFirebaseConfigured() || !db || !userId) {
    return [];
  }

  try {
    const attemptsRef = collection(db, 'quiz_attempts');
    const q = query(
      attemptsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const list = [];
    snapshot.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch {
    // If composite index is missing or query fails, try query without orderBy as fallback
    try {
      const attemptsRef = collection(db, 'quiz_attempts');
      const qFallback = query(attemptsRef, where('userId', '==', userId));
      const snapshot = await getDocs(qFallback);
      const list = [];
      snapshot.forEach((d) => {
        list.push(d.data());
      });
      list.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      return list;
    } catch (e) {
      console.warn('Firestore quiz history fetch fallback failed:', e);
      return [];
    }
  }
}

/**
 * Migrate local guest attempts into Firestore once authenticated
 */
export async function migrateLocalGuestAttemptsToFirestore(userId) {
  if (!isFirebaseConfigured() || !db || !userId) return;

  try {
    const raw = localStorage.getItem('secret_of_salt_guest_m1_history');
    if (!raw) return;
    const history = JSON.parse(raw);
    if (!Array.isArray(history) || history.length === 0) return;

    for (const attempt of history) {
      await saveQuizAttemptToFirestore(attempt, userId);
    }
  } catch (err) {
    console.warn('Guest attempts migration to Firestore notice:', err);
  }
}
