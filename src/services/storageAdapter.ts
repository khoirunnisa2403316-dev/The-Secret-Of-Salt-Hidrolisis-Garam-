import type {
  GuestQuizSession,
  QuizAttemptHistoryItem,
  StorageOperationResult,
} from '../types/quiz';
import { SOAL_VERSION } from '../data/soalHidrolisisGaram';

const STORAGE_KEYS = {
  GUEST_SESSION: 'secret_of_salt_guest_m1_session',
  GUEST_HISTORY: 'secret_of_salt_guest_m1_history',
  CANARY: 'secret_of_salt_canary_test',
};

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

    const parsed = JSON.parse(raw) as GuestQuizSession;

    // Validate essential session structure
    if (
      !parsed.guestSessionId ||
      !parsed.attemptId ||
      typeof parsed.draftAnswers !== 'object' ||
      typeof parsed.submittedAnswers !== 'object'
    ) {
      return {
        success: false,
        data: null,
        error: 'Data sesi tersimpan rusak atau memiliki format yang tidak valid.',
        isStorageAvailable: true,
      };
    }

    return {
      success: true,
      data: parsed,
      isStorageAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      error: `Gagal membaca sesi: ${err instanceof Error ? err.message : 'Kesalahan JSON'}`,
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
    const payload = JSON.stringify(session);
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

    return {
      success: true,
      data: parsed as QuizAttemptHistoryItem[],
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
  return {
    ...session,
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
  const updatedDrafts = { ...session.draftAnswers };
  delete updatedDrafts[questionId];
  return {
    ...session,
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
  const updatedHistory = [...history];

  // If current session was completed, ensure it is archived in history
  if (currentSession.status === 'completed' && currentSession.score !== null) {
    const existingIndex = updatedHistory.findIndex(
      (h) => h.attemptId === currentSession.attemptId
    );
    if (existingIndex === -1) {
      const correctCount = Object.values(currentSession.submittedAnswers).filter(
        (a) => a.isCorrect
      ).length;

      updatedHistory.unshift({
        attemptId: currentSession.attemptId,
        guestSessionId: currentSession.guestSessionId,
        questionVersion: currentSession.questionVersion,
        totalQuestions: 10,
        correctCount,
        score: currentSession.score,
        startedAt: currentSession.startedAt,
        completedAt: currentSession.completedAt || new Date().toISOString(),
        answers: currentSession.submittedAnswers,
      });
    }
  }

  // Create a brand new session with a new attempt ID, preserving guest ID
  const newSession = createNewGuestSession(currentSession.guestSessionId);

  return {
    newSession,
    updatedHistory,
  };
}
