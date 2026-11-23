import type {
  GuestQuizSession,
  QuizAttemptHistoryItem,
  SubmittedAnswer,
  StorageOperationResult,
} from '../types/quiz';
import { SOAL_VERSION, soalHidrolisisGaram } from '../data/soalHidrolisisGaram';

const STORAGE_KEYS = {
  GUEST_SESSION: 'secret_of_salt_guest_m1_session',
  GUEST_HISTORY: 'secret_of_salt_guest_m1_history',
  CANARY: 'secret_of_salt_canary_test',
};

const TOTAL_QUESTIONS = soalHidrolisisGaram.length || 10;

/**
 * Generate a random alphanumeric unique ID
 */
export function generateUid(prefix: string): string {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

/**
 * Safely verify if browser LocalStorage is available and writable
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(STORAGE_KEYS.CANARY, 'ok');
    const canary = window.localStorage.getItem(STORAGE_KEYS.CANARY);
    window.localStorage.removeItem(STORAGE_KEYS.CANARY);
    return canary === 'ok';
  } catch {
    return false;
  }
}

/**
 * Validate and safely sanitize or recover a guest quiz session.
 * Guarantees that draftAnswers and submittedAnswers are never null, arrays, or corrupted structures.
 * Validates data types, keys, question index, status, score, dates, and session version.
 * Preserves all valid user answers without data loss.
 */
export function sanitizeAndRecoverSession(raw: unknown): {
  session: GuestQuizSession | null;
  recovered: boolean;
  unrecoverable: boolean;
} {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { session: null, recovered: false, unrecoverable: true };
  }

  const obj = raw as Record<string, unknown>;

  // Check if completely empty or missing any identifiable session structure
  if (
    !obj.guestSessionId &&
    !obj.attemptId &&
    !obj.draftAnswers &&
    !obj.submittedAnswers
  ) {
    return { session: null, recovered: false, unrecoverable: true };
  }

  let recovered = false;

  // 1. Validate guestSessionId and attemptId
  let guestSessionId =
    typeof obj.guestSessionId === 'string' && obj.guestSessionId.trim()
      ? obj.guestSessionId.trim()
      : '';
  if (!guestSessionId) {
    guestSessionId = generateUid('guest');
    recovered = true;
  }

  let attemptId =
    typeof obj.attemptId === 'string' && obj.attemptId.trim()
      ? obj.attemptId.trim()
      : '';
  if (!attemptId) {
    attemptId = generateUid('att_m1');
    recovered = true;
  }

  // 2. Validate questionVersion
  let questionVersion =
    typeof obj.questionVersion === 'string' && obj.questionVersion.trim()
      ? obj.questionVersion.trim()
      : '';
  if (!questionVersion) {
    questionVersion = SOAL_VERSION;
    recovered = true;
  }

  // 3. Validate draftAnswers: never null, never array, only valid string key & string value
  const safeDraftAnswers: Record<string, string> = {};
  if (
    !obj.draftAnswers ||
    typeof obj.draftAnswers !== 'object' ||
    Array.isArray(obj.draftAnswers)
  ) {
    recovered = true;
  } else {
    for (const [key, val] of Object.entries(
      obj.draftAnswers as Record<string, unknown>
    )) {
      if (typeof key === 'string' && key.trim()) {
        if (typeof val === 'string' && val.trim()) {
          safeDraftAnswers[key.trim()] = val.trim();
        } else {
          recovered = true; // Dropped invalid/null draft value
        }
      } else {
        recovered = true;
      }
    }
  }

  // 4. Validate submittedAnswers: never null, never array, each entry conforms to SubmittedAnswer
  const safeSubmittedAnswers: Record<string, SubmittedAnswer> = {};
  if (
    !obj.submittedAnswers ||
    typeof obj.submittedAnswers !== 'object' ||
    Array.isArray(obj.submittedAnswers)
  ) {
    recovered = true;
  } else {
    for (const [key, item] of Object.entries(
      obj.submittedAnswers as Record<string, unknown>
    )) {
      if (typeof key !== 'string' || !key.trim()) {
        recovered = true;
        continue;
      }
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        recovered = true; // Dropped null or non-object entry
        continue;
      }

      const ansObj = item as Record<string, unknown>;
      const selectedOption =
        typeof ansObj.selectedOption === 'string' && ansObj.selectedOption.trim()
          ? ansObj.selectedOption.trim()
          : null;

      if (!selectedOption) {
        recovered = true; // Cannot recover answer without selected option
        continue;
      }

      const questionId =
        typeof ansObj.questionId === 'string' && ansObj.questionId.trim()
          ? ansObj.questionId.trim()
          : key.trim();
      if (questionId !== ansObj.questionId) {
        recovered = true;
      }

      const isCorrect =
        typeof ansObj.isCorrect === 'boolean'
          ? ansObj.isCorrect
          : Boolean(ansObj.isCorrect);
      if (typeof ansObj.isCorrect !== 'boolean') {
        recovered = true;
      }

      let answeredAt =
        typeof ansObj.answeredAt === 'string' &&
        !isNaN(Date.parse(ansObj.answeredAt))
          ? ansObj.answeredAt
          : '';
      if (!answeredAt) {
        answeredAt = new Date().toISOString();
        recovered = true;
      }

      safeSubmittedAnswers[key.trim()] = {
        questionId,
        selectedOption,
        isCorrect,
        answeredAt,
      };
    }
  }

  // 5. Validate currentQuestionIndex
  let currentQuestionIndex = 0;
  if (
    typeof obj.currentQuestionIndex === 'number' &&
    Number.isInteger(obj.currentQuestionIndex)
  ) {
    if (
      obj.currentQuestionIndex >= 0 &&
      obj.currentQuestionIndex < TOTAL_QUESTIONS
    ) {
      currentQuestionIndex = obj.currentQuestionIndex;
    } else {
      currentQuestionIndex = Math.max(
        0,
        Math.min(obj.currentQuestionIndex, TOTAL_QUESTIONS - 1)
      );
      recovered = true;
    }
  } else if (
    typeof obj.currentQuestionIndex === 'string' &&
    !isNaN(parseInt(obj.currentQuestionIndex, 10))
  ) {
    const parsedIdx = parseInt(obj.currentQuestionIndex, 10);
    currentQuestionIndex = Math.max(0, Math.min(parsedIdx, TOTAL_QUESTIONS - 1));
    recovered = true;
  } else {
    currentQuestionIndex = 0;
    recovered = true;
  }

  // 6. Validate status
  const answeredCount = Object.keys(safeSubmittedAnswers).length;
  let status: 'in_progress' | 'completed';
  if (obj.status === 'in_progress' || obj.status === 'completed') {
    status = obj.status;
  } else {
    status = answeredCount >= TOTAL_QUESTIONS ? 'completed' : 'in_progress';
    recovered = true;
  }

  // 7. Validate score
  let score: number | null = null;
  if (status === 'completed') {
    if (typeof obj.score === 'number' && !isNaN(obj.score)) {
      score = Math.max(0, Math.min(100, Math.round(obj.score)));
    } else {
      const correctCount = Object.values(safeSubmittedAnswers).filter(
        (a) => a.isCorrect
      ).length;
      score = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
      recovered = true;
    }
  } else {
    score = null;
  }

  // 8. Validate startedAt and completedAt
  let startedAt =
    typeof obj.startedAt === 'string' && !isNaN(Date.parse(obj.startedAt))
      ? obj.startedAt
      : '';
  if (!startedAt) {
    startedAt = new Date().toISOString();
    recovered = true;
  }

  let completedAt: string | null = null;
  if (status === 'completed') {
    completedAt =
      typeof obj.completedAt === 'string' && !isNaN(Date.parse(obj.completedAt))
        ? obj.completedAt
        : new Date().toISOString();
    if (completedAt !== obj.completedAt) {
      recovered = true;
    }
  } else {
    completedAt = null;
  }

  const session: GuestQuizSession = {
    guestSessionId,
    attemptId,
    questionVersion,
    draftAnswers: safeDraftAnswers,
    submittedAnswers: safeSubmittedAnswers,
    currentQuestionIndex,
    status,
    score,
    startedAt,
    completedAt,
  };

  return { session, recovered, unrecoverable: false };
}

/**
 * Defensive sanitizer wrapper returning a guaranteed valid GuestQuizSession.
 */
export function sanitizeGuestSession(session: unknown): GuestQuizSession {
  const res = sanitizeAndRecoverSession(session);
  if (res.session) {
    return res.session;
  }
  return createNewGuestSession();
}

/**
 * Initialize a brand new guest quiz session
 */
export function createNewGuestSession(existingGuestId?: string): GuestQuizSession {
  return {
    guestSessionId: existingGuestId || generateUid('guest'),
    attemptId: generateUid('att_m1'),
    questionVersion: SOAL_VERSION,
    draftAnswers: {},
    submittedAnswers: {},
    currentQuestionIndex: 0,
    status: 'in_progress',
    score: null, // Distinct from final score
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

/**
 * Load active guest session from localStorage safely.
 * Returns error if storage is unavailable, denied, or contains corrupt JSON.
 */
export function loadGuestSession(): StorageOperationResult<GuestQuizSession> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: null,
      error: 'Penyimpanan lokal perangkat tidak tersedia atau akses ditolak oleh peramban.',
      isStorageAvailable: false,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
    if (!raw) {
      return {
        success: true,
        data: null,
        isStorageAvailable: true,
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        success: false,
        data: null,
        error: 'Data sesi tersimpan rusak dan tidak dapat dipulihkan. Sesi kuis baru telah dimulai.',
        isStorageAvailable: true,
      };
    }

    const { session, recovered, unrecoverable } = sanitizeAndRecoverSession(parsed);

    if (unrecoverable || !session) {
      return {
        success: false,
        data: null,
        error: 'Data sesi tersimpan rusak dan gagal dipulihkan. Sesi kuis baru telah dimulai.',
        isStorageAvailable: true,
      };
    }

    // If session was healed from corrupted/null fields, persist the clean version
    if (recovered) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, JSON.stringify(session));
      } catch {
        // Non-blocking write error
      }
    }

    return {
      success: true,
      data: session,
      isStorageAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      error: `Gagal membaca sesi: ${err instanceof Error ? err.message : 'Kesalahan format'}`,
      isStorageAvailable: true,
    };
  }
}

/**
 * Persist active guest session to localStorage.
 * Crucial rule: Does not claim success if storage is denied or fails.
 */
export function saveGuestSession(
  session: GuestQuizSession
): StorageOperationResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: false,
      error: 'Penyimpanan lokal ditolak atau tidak didukung oleh browser Anda.',
      isStorageAvailable: false,
    };
  }

  try {
    // Defensively sanitize before serializing to guarantee no null or array answers
    const cleanSession = sanitizeGuestSession(session);
    const payload = JSON.stringify(cleanSession);
    window.localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, payload);
    return {
      success: true,
      data: true,
      isStorageAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      data: false,
      error: `Penyimpanan gagal: ${err instanceof Error ? err.message : 'Kuota penyimpanan penuh'}`,
      isStorageAvailable: true,
    };
  }
}

/**
 * Load completed past attempts history from device storage.
 */
export function loadQuizHistory(): StorageOperationResult<QuizAttemptHistoryItem[]> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: [],
      error: 'Penyimpanan lokal tidak tersedia.',
      isStorageAvailable: false,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.GUEST_HISTORY);
    if (!raw) {
      return {
        success: true,
        data: [],
        isStorageAvailable: true,
      };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        data: [],
        error: 'Riwayat tersimpan memiliki format data korup.',
        isStorageAvailable: true,
      };
    }

    const sanitizedHistory: QuizAttemptHistoryItem[] = parsed
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => {
        const safeAnswers: Record<string, SubmittedAnswer> = {};
        if (item.answers && typeof item.answers === 'object' && !Array.isArray(item.answers)) {
          for (const [k, v] of Object.entries(item.answers as Record<string, unknown>)) {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
              const ansObj = v as Record<string, unknown>;
              if (typeof ansObj.selectedOption === 'string') {
                safeAnswers[k] = {
                  questionId: typeof ansObj.questionId === 'string' ? ansObj.questionId : k,
                  selectedOption: ansObj.selectedOption,
                  isCorrect: Boolean(ansObj.isCorrect),
                  answeredAt:
                    typeof ansObj.answeredAt === 'string'
                      ? ansObj.answeredAt
                      : new Date().toISOString(),
                };
              }
            }
          }
        }
        return {
          attemptId: typeof item.attemptId === 'string' ? item.attemptId : generateUid('att_m1'),
          guestSessionId:
            typeof item.guestSessionId === 'string' ? item.guestSessionId : generateUid('guest'),
          questionVersion:
            typeof item.questionVersion === 'string' ? item.questionVersion : SOAL_VERSION,
          totalQuestions:
            typeof item.totalQuestions === 'number' ? item.totalQuestions : TOTAL_QUESTIONS,
          correctCount:
            typeof item.correctCount === 'number'
              ? item.correctCount
              : Object.values(safeAnswers).filter((a) => a.isCorrect).length,
          score: typeof item.score === 'number' ? item.score : 0,
          startedAt:
            typeof item.startedAt === 'string' ? item.startedAt : new Date().toISOString(),
          completedAt:
            typeof item.completedAt === 'string' ? item.completedAt : new Date().toISOString(),
          answers: safeAnswers,
        };
      });

    return {
      success: true,
      data: sanitizedHistory,
      isStorageAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      error: `Gagal memuat riwayat: ${err instanceof Error ? err.message : 'Kesalahan format'}`,
      isStorageAvailable: true,
    };
  }
}

/**
 * Save quiz history array to device storage.
 */
export function saveQuizHistory(
  history: QuizAttemptHistoryItem[]
): StorageOperationResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: false,
      error: 'Penyimpanan lokal tidak tersedia.',
      isStorageAvailable: false,
    };
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.GUEST_HISTORY, JSON.stringify(history));
    return {
      success: true,
      data: true,
      isStorageAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      data: false,
      error: `Gagal menyimpan riwayat: ${err instanceof Error ? err.message : 'Error'}`,
      isStorageAvailable: true,
    };
  }
}

/**
 * Clear only the device attempt history (requires separate explicit confirmation dialog)
 */
export function clearDeviceHistory(): StorageOperationResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: false,
      error: 'Penyimpanan lokal tidak tersedia.',
      isStorageAvailable: false,
    };
  }

  try {
    window.localStorage.removeItem(STORAGE_KEYS.GUEST_HISTORY);
    return {
      success: true,
      data: true,
      isStorageAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      data: false,
      error: `Gagal menghapus riwayat perangkat: ${err instanceof Error ? err.message : 'Error'}`,
      isStorageAvailable: true,
    };
  }
}

/**
 * Reset current in-progress drafts without destroying completed answers
 */
export function resetCurrentDraft(session: GuestQuizSession): GuestQuizSession {
  const safeSession = sanitizeGuestSession(session);
  return {
    ...safeSession,
    draftAnswers: {},
  };
}

/**
 * Reset current question's draft selection only
 */
export function resetDraftForQuestion(
  session: GuestQuizSession,
  questionId: string
): GuestQuizSession {
  const safeSession = sanitizeGuestSession(session);
  const updatedDrafts = { ...safeSession.draftAnswers };
  delete updatedDrafts[questionId];
  return {
    ...safeSession,
    draftAnswers: updatedDrafts,
  };
}

/**
 * Retake quiz: archive current session to history if completed,
 * and instantiate a fresh session with a NEW unique attemptId.
 */
export function retakeQuizWithNewAttempt(
  currentSession: GuestQuizSession,
  history: QuizAttemptHistoryItem[]
): {
  newSession: GuestQuizSession;
  updatedHistory: QuizAttemptHistoryItem[];
} {
  const safeSession = sanitizeGuestSession(currentSession);
  const updatedHistory = Array.isArray(history) ? [...history] : [];

  // If current session was completed, ensure it is archived in history
  if (safeSession.status === 'completed' && safeSession.score !== null) {
    const existingIndex = updatedHistory.findIndex(
      (h) => h.attemptId === safeSession.attemptId
    );
    if (existingIndex === -1) {
      const correctCount = Object.values(safeSession.submittedAnswers).filter(
        (a) => a?.isCorrect
      ).length;

      updatedHistory.unshift({
        attemptId: safeSession.attemptId,
        guestSessionId: safeSession.guestSessionId,
        questionVersion: safeSession.questionVersion,
        totalQuestions: TOTAL_QUESTIONS,
        correctCount,
        score: safeSession.score,
        startedAt: safeSession.startedAt,
        completedAt: safeSession.completedAt || new Date().toISOString(),
        answers: safeSession.submittedAnswers,
      });
    }
  }

  // Create a brand new session with a new attempt ID, preserving guest ID
  const newSession = createNewGuestSession(safeSession.guestSessionId);

  return {
    newSession,
    updatedHistory,
  };
}
