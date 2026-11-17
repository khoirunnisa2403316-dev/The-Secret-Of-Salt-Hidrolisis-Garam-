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
import { soalHidrolisisGaram, SOAL_VERSION } from '../data/soalHidrolisisGaram';

const STORAGE_KEYS = {
  GUEST_HISTORY: 'secret_of_salt_guest_m1_history',
  MIGRATED_MAP: 'chem_guest_migrated_map',
};

/**
 * Helper to get active user ID from current session
 */
function getActiveSessionUserId() {
  try {
    const raw = sessionStorage.getItem('chem_auth_session_token') ||
                localStorage.getItem('chem_auth_session_token');
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.user?.id || session?.user?.uid || null;
  } catch {
    return null;
  }
}

/**
 * 1. Save completed quiz attempt to Cloud Firestore (Idempotent by attemptId)
 */
export async function saveQuizAttemptToFirestore(attempt, userId) {
  if (!isFirebaseConfigured() || !db || !userId) {
    return { success: false, reason: 'Firebase or userId unavailable' };
  }

  // Account race condition verification
  const activeId = getActiveSessionUserId();
  if (activeId && activeId !== userId) {
    console.warn('Sync aborted: account changed during request.');
    return { success: false, reason: 'account_changed' };
  }

  try {
    const attemptDocRef = doc(db, 'quiz_attempts', attempt.attemptId);
    const payload = {
      attemptId: attempt.attemptId,
      userId,
      userFullName: attempt.userFullName || 'Siswa Kimia',
      classGrade: attempt.classGrade || 'XI-MIPA-1',
      guestSessionId: attempt.guestSessionId || '',
      questionVersion: attempt.questionVersion || SOAL_VERSION,
      moduleId: 'modul-1-konsep-dasar',
      activityName: 'Kuis Formatif Modul 1: Konsep Dasar Hidrolisis Garam',
      attemptType: attempt.attemptType || 'Percobaan Utama',
      totalQuestions: attempt.totalQuestions || 10,
      correctCount: attempt.correctCount,
      score: attempt.score,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      answers: attempt.answers || {},
      syncedAt: serverTimestamp(),
    };

    // Idempotent setDoc with merge: true (writing same attemptId never creates duplicates)
    await setDoc(attemptDocRef, payload, { merge: true });
    return { success: true, attemptId: attempt.attemptId };
  } catch (err) {
    console.error('Failed to save quiz attempt to Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Retrieve user's quiz attempt history from Cloud Firestore
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
 * 3. Account-Scoped Sync Queue (Offline-First Resiliency)
 */
export function getAccountQueue(userId) {
  if (!userId) return [];
  try {
    const key = `chem_sync_queue_${userId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function enqueueAccountAttempt(userId, attempt) {
  if (!userId || !attempt?.attemptId) return;
  try {
    const key = `chem_sync_queue_${userId}`;
    const queue = getAccountQueue(userId);
    // Idempotent: prevent duplicate enqueue of same attemptId
    const exists = queue.some((item) => item.attemptId === attempt.attemptId);
    if (!exists) {
      queue.push({
        ...attempt,
        queuedAt: new Date().toISOString(),
        syncStatus: 'pending',
      });
      localStorage.setItem(key, JSON.stringify(queue));
    }
  } catch (err) {
    console.warn('Failed to enqueue attempt:', err);
  }
}

/**
 * Process pending sync queue for this account
 */
export async function processAccountSyncQueue(userId) {
  if (!userId) return { processed: 0, failed: 0 };

  // Guard: check if account changed
  const activeId = getActiveSessionUserId();
  if (activeId && activeId !== userId) {
    console.warn('Queue processing cancelled: user mismatch');
    return { processed: 0, failed: 0, reason: 'account_mismatch' };
  }

  const queue = getAccountQueue(userId);
  if (queue.length === 0) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;
  const remaining = [];

  for (const item of queue) {
    // Re-check account status between requests
    if (getActiveSessionUserId() !== userId) {
      remaining.push(item);
      continue;
    }

    const res = await saveQuizAttemptToFirestore(item, userId);
    if (res.success) {
      processed += 1;
      // Mark local attempt history item as synced
      markLocalAttemptSynced(userId, item.attemptId);
    } else {
      failed += 1;
      remaining.push({ ...item, syncStatus: 'failed', lastError: res.error });
    }
  }

  // Update remaining queue
  try {
    localStorage.setItem(`chem_sync_queue_${userId}`, JSON.stringify(remaining));
  } catch {
    // ignore
  }

  return { processed, failed };
}

function markLocalAttemptSynced(userId, attemptId) {
  try {
    const key = `chem_user_history_${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const history = JSON.parse(raw);
    const updated = history.map((item) =>
      item.attemptId === attemptId
        ? { ...item, isSynced: true, syncedAt: new Date().toISOString() }
        : item
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * 4. Selective Guest Quiz Migration
 * Returns guest attempts that haven't been linked to this account
 */
export function getUnmigratedGuestAttempts(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUEST_HISTORY);
    if (!raw) return [];
    const guestAttempts = JSON.parse(raw);
    if (!Array.isArray(guestAttempts)) return [];

    const migratedMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.MIGRATED_MAP) || '{}');
    const userMigratedSet = new Set(migratedMap[userId] || []);

    return guestAttempts.filter((a) => !userMigratedSet.has(a.attemptId));
  } catch {
    return [];
  }
}

/**
 * Migrate ONLY the guest attempts selected by the student
 */
export async function migrateSelectedGuestAttempts(selectedAttemptIds, targetUserId, userFullName = '') {
  if (!targetUserId || !Array.isArray(selectedAttemptIds) || selectedAttemptIds.length === 0) {
    return { success: false, migratedCount: 0 };
  }

  // Guard: race condition check
  const activeId = getActiveSessionUserId();
  if (activeId && activeId !== targetUserId) {
    throw new Error('Sesi akun telah berubah saat proses migrasi berjalan.');
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GUEST_HISTORY);
    if (!raw) return { success: true, migratedCount: 0 };
    const allGuest = JSON.parse(raw);

    const toMigrate = allGuest.filter((a) => selectedAttemptIds.includes(a.attemptId));
    if (toMigrate.length === 0) return { success: true, migratedCount: 0 };

    // 1. Save to user's local history
    const userHistoryKey = `chem_user_history_${targetUserId}`;
    const existing = JSON.parse(localStorage.getItem(userHistoryKey) || '[]');
    const existingIds = new Set(existing.map((e) => e.attemptId));

    const newItems = toMigrate
      .filter((item) => !existingIds.has(item.attemptId))
      .map((item) => ({
        ...item,
        userId: targetUserId,
        userFullName: userFullName || 'Siswa Kimia',
        migratedFromGuest: true,
        migratedAt: new Date().toISOString(),
      }));

    localStorage.setItem(userHistoryKey, JSON.stringify([...newItems, ...existing]));

    // 2. Queue or sync to Firestore
    for (const item of newItems) {
      if (getActiveSessionUserId() !== targetUserId) break; // abort if user logged out
      if (isFirebaseConfigured() && db) {
        await saveQuizAttemptToFirestore(item, targetUserId);
      } else {
        enqueueAccountAttempt(targetUserId, item);
      }
    }

    // 3. Mark as migrated in map
    const migratedMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.MIGRATED_MAP) || '{}');
    const userSet = new Set(migratedMap[targetUserId] || []);
    selectedAttemptIds.forEach((id) => userSet.add(id));
    migratedMap[targetUserId] = Array.from(userSet);
    localStorage.setItem(STORAGE_KEYS.MIGRATED_MAP, JSON.stringify(migratedMap));

    return { success: true, migratedCount: newItems.length };
  } catch (err) {
    console.error('Selective guest migration error:', err);
    throw err;
  }
}

/**
 * Migrate all guest attempts (legacy helper)
 */
export async function migrateLocalGuestAttemptsToFirestore(userId) {
  const unmigrated = getUnmigratedGuestAttempts(userId);
  if (unmigrated.length > 0) {
    await migrateSelectedGuestAttempts(
      unmigrated.map((u) => u.attemptId),
      userId
    );
  }
}

/**
 * 5. Fetch Teacher Class Submissions (REAL STUDENT DATA ONLY)
 * Retrieves real quiz attempts submitted by students from Cloud Firestore.
 * If running in local browser environment, checks for real student attempt records.
 * Zero dummy / mock student data.
 */
export async function fetchTeacherClassSubmissions(selectedClass = 'all') {
  // Purge any legacy dummy / mock submission caches
  try {
    localStorage.removeItem('chem_teacher_submissions_cache');
    localStorage.removeItem('chem_user_history_usr_demo_student_01');
    localStorage.removeItem('chem_user_history_usr_demo_student_02');
  } catch {
    // ignore
  }

  let list = [];

  // 1. Fetch real student submissions from live Cloud Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const attemptsRef = collection(db, 'quiz_attempts');
      let q = query(attemptsRef, orderBy('completedAt', 'desc'));
      if (selectedClass && selectedClass !== 'all') {
        q = query(attemptsRef, where('classGrade', '==', selectedClass), orderBy('completedAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      snapshot.forEach((d) => {
        const data = d.data();
        // Exclude any legacy demo / mock attempt entries
        if (!data.attemptId?.startsWith('att_demo_')) {
          list.push({ ...data, serverReceivedAt: data.syncedAt || data.completedAt });
        }
      });
    } catch (err) {
      console.warn('Firestore teacher fetch notice:', err);
    }
  }

  // 2. Also check for real student quiz attempts stored in localStorage on this device
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith('chem_user_history_') && !storageKey.includes('demo')) {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const userAttempts = JSON.parse(raw);
          if (Array.isArray(userAttempts)) {
            userAttempts.forEach((item) => {
              if (item?.attemptId && !item.attemptId.startsWith('att_demo_')) {
                if (!list.some((existing) => existing.attemptId === item.attemptId)) {
                  list.push({
                    ...item,
                    userFullName: item.userFullName || 'Siswa',
                    classGrade: item.classGrade || 'XI-MIPA-1',
                    activityName: item.activityName || 'Kuis Formatif Modul 1: Konsep Dasar Hidrolisis Garam',
                    attemptType: item.attemptType || 'Percobaan Siswa',
                    serverReceivedAt: item.syncedAt || item.completedAt || new Date().toISOString(),
                  });
                }
              }
            });
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // 3. Filter by classGrade if requested
  if (selectedClass && selectedClass !== 'all') {
    list = list.filter((item) => item.classGrade === selectedClass);
  }

  // 4. Sort descending by completion time
  list.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

  return list;
}

/**
 * 7. Item-by-Item Analysis (Rekap Per Butir & Frekuensi Pilihan)
 * Supports 1-attempt-per-student rule:
 * - 'latest' (Only latest attempt per student)
 * - 'best'   (Only best attempt per student)
 * - 'all'    (All attempts)
 */
export function calculateItemAnalysis(submissions, attemptRule = 'latest') {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return {
      ruleUsed: attemptRule,
      evaluatedAttemptsCount: 0,
      uniqueStudentsCount: 0,
      items: [],
      mostDifficultQuestion: null,
      pedagogicalInsight: null,
    };
  }

  // 1. Apply 1-attempt-per-student rule
  let filtered = [];
  if (attemptRule === 'all') {
    filtered = [...submissions];
  } else {
    const studentMap = new Map();
    submissions.forEach((item) => {
      const studentKey = item.userId || item.userFullName;
      if (!studentMap.has(studentKey)) {
        studentMap.set(studentKey, item);
      } else {
        const existing = studentMap.get(studentKey);
        if (attemptRule === 'best') {
          if (item.score > existing.score) {
            studentMap.set(studentKey, item);
          }
        } else {
          // 'latest' rule
          if (new Date(item.completedAt) > new Date(existing.completedAt)) {
            studentMap.set(studentKey, item);
          }
        }
      }
    });
    filtered = Array.from(studentMap.values());
  }

  const evaluatedCount = filtered.length;
  const uniqueStudents = new Set(filtered.map((s) => s.userId || s.userFullName)).size;

  // 2. Compute item statistics for each question 1-10
  const items = soalHidrolisisGaram.map((q, idx) => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    let correctCount = 0;
    let wrongCount = 0;

    filtered.forEach((sub) => {
      const resp = sub.answers?.[q.id];
      if (resp && resp.selectedOption) {
        const opt = resp.selectedOption.toUpperCase();
        if (counts[opt] !== undefined) {
          counts[opt] += 1;
        }
        if (resp.isCorrect) {
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      } else {
        wrongCount += 1; // Unanswered treated as wrong
      }
    });

    const totalAnswered = correctCount + wrongCount;
    const correctPercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const errorRate = 100 - correctPercentage;

    // Difficulty categorization per educational standards
    let difficulty = 'Sedang';
    if (correctPercentage >= 80) difficulty = 'Mudah';
    else if (correctPercentage < 50) difficulty = 'Sulit';

    // Frequencies with percentages
    const frequencies = {
      A: { count: counts.A, percentage: totalAnswered ? Math.round((counts.A / totalAnswered) * 100) : 0 },
      B: { count: counts.B, percentage: totalAnswered ? Math.round((counts.B / totalAnswered) * 100) : 0 },
      C: { count: counts.C, percentage: totalAnswered ? Math.round((counts.C / totalAnswered) * 100) : 0 },
      D: { count: counts.D, percentage: totalAnswered ? Math.round((counts.D / totalAnswered) * 100) : 0 },
    };

    // Find most picked distractor
    let mostPickedDistractor = null;
    let maxDistractorCount = 0;
    Object.keys(counts).forEach((opt) => {
      if (opt !== q.jawabanBenar && counts[opt] > maxDistractorCount) {
        maxDistractorCount = counts[opt];
        mostPickedDistractor = opt;
      }
    });

    return {
      index: idx + 1,
      id: q.id,
      konsep: q.konsep,
      pertanyaan: q.pertanyaan,
      jawabanBenar: q.jawabanBenar,
      pembahasan: q.pembahasan,
      totalAnswered,
      correctCount,
      wrongCount,
      correctPercentage,
      errorRate,
      difficulty,
      frequencies,
      mostPickedDistractor: maxDistractorCount > 0 ? mostPickedDistractor : null,
      maxDistractorCount,
    };
  });

  // 3. Find most difficult question (highest error rate)
  const sortedByError = [...items].sort((a, b) => b.errorRate - a.errorRate);
  const mostDifficult = sortedByError[0] || null;

  // 4. Generate automated pedagogical interpretation and next learning action
  let pedagogicalInsight = null;
  if (mostDifficult && mostDifficult.errorRate > 0) {
    let conceptInterpretation = '';
    let nextLearningActivity = '';

    if (mostDifficult.id === 'm1-q8') {
      conceptInterpretation = `Sebanyak ${mostDifficult.errorRate}% siswa mengalami kesulitan pada perhitungan pH garam terhidrolisis (CH₃COONa 0,1 M). Kesalahan paling dominan adalah memilih opsi ${mostDifficult.mostPickedDistractor || 'A'} (pH asam 5), mengindikasikan siswa lupa bahwa garam dari asam lemah dan basa kuat bersifat basa (pH > 7) serta keliru menggunakan rumus asam konjugat alih-alih menghitung [OH⁻].`;
      nextLearningActivity = 'Remediasi Terarah: Eksplorasi Virtual Lab Beaker Uji Lakmus Garam CH₃COONa & Latihan Terpandu Penurunan Rumus [OH⁻] = √(Kw/Ka · [anion]) pada Modul 5.';
    } else if (mostDifficult.id === 'm1-q7') {
      conceptInterpretation = `Sebanyak ${mostDifficult.errorRate}% siswa keliru dalam menentukan rumus tetapan hidrolisis (Kh). Distraktor ${mostDifficult.mostPickedDistractor} paling sering dipilih, menunjukkan kerancuan antara perbandingan Kw/Ka untuk anion dengan Kw/Kb untuk kation.`;
      nextLearningActivity = 'Penguatan Konsep: Bedah Rumus Tetapan Kesetimbangan Hidrolisis Garam (Modul 4) dengan Matriks Perbandingan Ka vs Kb.';
    } else if (mostDifficult.id === 'm1-q3') {
      conceptInterpretation = `Sebanyak ${mostDifficult.errorRate}% siswa keliru mengidentifikasi ion yang mengalami hidrolisis pada CH₃COONa. Siswa cenderung memilih Na⁺ dan CH₃COO⁻ sekaligus, yang mencerminkan miskonsepsi bahwa semua ion bereaksi dengan air.`;
      nextLearningActivity = 'Klarifikasi Konsep: Simulasi Partikel Mikroskopis Johnstone (Pembedaan Kation Kuat Na⁺ yang Terhidrasi vs Anion Lemah CH₃COO⁻ yang Bereaksi Membentuk OH⁻).';
    } else {
      conceptInterpretation = `Sebanyak ${mostDifficult.errorRate}% siswa belum menuntaskan konsep ${mostDifficult.konsep}. Mayoritas salah memilih opsi ${mostDifficult.mostPickedDistractor}.`;
      nextLearningActivity = `Kegiatan Pembelajaran Berikutnya: Diskusi Kelompok Terbimbing & Studi Kasus Reaksi Kesetimbangan Ion Garam (${mostDifficult.konsep}).`;
    }

    pedagogicalInsight = {
      conceptInterpretation,
      nextLearningActivity,
      targetQuestionId: mostDifficult.id,
      targetConcept: mostDifficult.konsep,
      errorRate: mostDifficult.errorRate,
    };
  }

  return {
    ruleUsed: attemptRule,
    evaluatedAttemptsCount: evaluatedCount,
    uniqueStudentsCount: uniqueStudents,
    items,
    mostDifficultQuestion: mostDifficult,
    pedagogicalInsight,
  };
}
