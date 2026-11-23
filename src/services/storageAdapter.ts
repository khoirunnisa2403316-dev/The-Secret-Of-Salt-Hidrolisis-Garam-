import type {
  GuestQuizSession,
  QuizAttemptHistoryItem,
  SubmittedAnswer,
  StorageOperationResult,
  QuizQuestion,
} from '../types/quiz';
import {
  SOAL_VERSION,
  soalHidrolisisGaram,
  QUESTION_BANKS_BY_VERSION,
} from '../data/soalHidrolisisGaram';

const STORAGE_KEYS = {
  GUEST_SESSION: 'secret_of_salt_guest_m1_session',
  USER_SESSION_PREFIX: 'secret_of_salt_user_m1_session_',
  GUEST_HISTORY: 'secret_of_salt_guest_m1_history',
  CANARY: 'secret_of_salt_canary_test',
};

/**
 * Compute the isolated localStorage key for a given user or guest (AD18-06).
 * Prevents draft answer and attemptId cross-talk between user accounts.
 */
export function getQuizSessionStorageKey(userId?: string): string {
  if (userId && typeof userId === 'string' && userId.trim()) {
    return `${STORAGE_KEYS.USER_SESSION_PREFIX}${userId.trim()}`;
  }
  return STORAGE_KEYS.GUEST_SESSION;
}

const TOTAL_QUESTIONS = soalHidrolisisGaram.length || 10;

/**
 * List of known supported question bank versions.
 */
export const KNOWN_QUESTION_VERSIONS = Object.keys(QUESTION_BANKS_BY_VERSION);

/**
 * Check whether a version string is recognized and compatible with the current SOAL_VERSION.
 */
export function isVersionCompatible(version?: string): boolean {
  if (!version || typeof version !== 'string') return false;
  const clean = version.replace(/^v/i, '').trim();
  if (clean === SOAL_VERSION) return true;
  return KNOWN_QUESTION_VERSIONS.includes(clean);
}

/**
 * Validates whether draft/session data can be safely migrated to the current question bank.
 * Migration is ONLY permitted if:
 * 1. The version is recognized as compatible OR is an unversioned legacy draft.
 * 2. All question IDs in draftAnswers and submittedAnswers correspond to questions in the current bank.
 */
export function canSafelyMigrateSession(
  rawVersion: string | undefined,
  draftAnswers: Record<string, unknown> | null | undefined,
  submittedAnswers: Record<string, unknown> | null | undefined
): { canMigrate: boolean; reason?: string } {
  const cleanVer = typeof rawVersion === 'string' ? rawVersion.replace(/^v/i, '').trim() : '';

  // If a version is explicitly specified but not recognized or incompatible
  if (cleanVer && !isVersionCompatible(cleanVer)) {
    return {
      canMigrate: false,
      reason: `Versi draf kuis (${rawVersion}) tidak dikenal atau tidak kompatibel dengan bank soal saat ini (v${SOAL_VERSION}). Draf tidak dapat dimigrasikan secara aman dan sesi baru telah dimulai.`,
    };
  }

  const validQuestionIds = new Set(soalHidrolisisGaram.map((q) => q.id));

  // Check draft answers question keys
  if (draftAnswers && typeof draftAnswers === 'object' && !Array.isArray(draftAnswers)) {
    for (const qId of Object.keys(draftAnswers)) {
      if (qId && !validQuestionIds.has(qId)) {
        return {
          canMigrate: false,
          reason: `Draf berisi butir soal (${qId}) yang tidak cocok dengan bank soal saat ini (v${SOAL_VERSION}). Draf tidak dapat dimigrasikan secara aman.`,
        };
      }
    }
  }

  // Check submitted answers question keys
  if (submittedAnswers && typeof submittedAnswers === 'object' && !Array.isArray(submittedAnswers)) {
    for (const qId of Object.keys(submittedAnswers)) {
      if (qId && !validQuestionIds.has(qId)) {
        return {
          canMigrate: false,
          reason: `Jawaban tersimpan berisi butir soal (${qId}) yang tidak cocok dengan bank soal saat ini (v${SOAL_VERSION}).`,
        };
      }
    }
  }

  return { canMigrate: true };
}

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
export function sanitizeAndRecoverSession(raw: unknown, expectedUserId?: string): {
  session: GuestQuizSession | null;
  recovered: boolean;
  unrecoverable: boolean;
  reason?: string;
  versionIncompatible?: boolean;
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

  // Security check: validate user ownership
  const rawUserId =
    typeof obj.userId === 'string' && obj.userId.trim() ? obj.userId.trim() : undefined;
  if (expectedUserId && rawUserId && rawUserId !== expectedUserId) {
    return {
      session: null,
      recovered: false,
      unrecoverable: true,
      reason: `Sesi milik akun (${rawUserId}) tidak cocok dengan pengguna aktif (${expectedUserId}).`,
    };
  }

  // 1. Validate version and check safe migration before applying current question bank
  const rawVersion =
    typeof obj.questionVersion === 'string' && obj.questionVersion.trim()
      ? obj.questionVersion.trim()
      : undefined;

  const migrationCheck = canSafelyMigrateSession(
    rawVersion,
    obj.draftAnswers as Record<string, unknown> | undefined,
    obj.submittedAnswers as Record<string, unknown> | undefined
  );

  if (!migrationCheck.canMigrate) {
    return {
      session: null,
      recovered: false,
      unrecoverable: true,
      reason: migrationCheck.reason,
      versionIncompatible: true,
    };
  }

  let recovered = false;
  let questionVersion = SOAL_VERSION;

  if (rawVersion && isVersionCompatible(rawVersion)) {
    questionVersion = rawVersion.replace(/^v/i, '').trim();
  } else {
    // Unversioned legacy session safely migrated
    recovered = true;
  }

  // 2. Validate guestSessionId and attemptId
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
    userId: expectedUserId || rawUserId,
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
export function sanitizeGuestSession(
  session: unknown,
  expectedUserId?: string
): GuestQuizSession {
  const res = sanitizeAndRecoverSession(session, expectedUserId);
  if (res.session) {
    return res.session;
  }
  return createNewGuestSession(undefined, expectedUserId);
}

/**
 * Initialize a brand new guest or authenticated quiz session
 */
export function createNewGuestSession(
  existingGuestId?: string,
  userId?: string
): GuestQuizSession {
  return {
    userId: userId && typeof userId === 'string' && userId.trim() ? userId.trim() : undefined,
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
 * Load active quiz session from localStorage safely.
 * When userId is provided, loads the user-namespaced session.
 * When omitted, loads the isolated guest session.
 */
export function loadQuizSession(userId?: string): StorageOperationResult<GuestQuizSession> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: null,
      error: 'Penyimpanan lokal perangkat tidak tersedia atau akses ditolak oleh peramban.',
      isStorageAvailable: false,
    };
  }

  const key = getQuizSessionStorageKey(userId);
  try {
    const raw = window.localStorage.getItem(key);
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

    const { session, recovered, unrecoverable, reason } = sanitizeAndRecoverSession(parsed, userId);

    if (unrecoverable || !session) {
      return {
        success: false,
        data: null,
        error:
          reason ||
          'Data sesi tersimpan rusak dan gagal dipulihkan. Sesi kuis baru telah dimulai.',
        isStorageAvailable: true,
      };
    }

    // Security check: if loading for a specific userId, verify it matches
    if (userId && session.userId && session.userId !== userId) {
      return {
        success: false,
        data: null,
        error: 'Draf jawaban milik akun lain tidak dapat dipulihkan.',
        isStorageAvailable: true,
      };
    }

    // If session was healed from corrupted/null fields, persist the clean version
    if (recovered) {
      try {
        window.localStorage.setItem(key, JSON.stringify(session));
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
 * Alias for loadQuizSession (backward-compatibility)
 */
export function loadGuestSession(userId?: string): StorageOperationResult<GuestQuizSession> {
  return loadQuizSession(userId);
}

/**
 * Persist active quiz session to localStorage safely.
 * When session.userId or userId is provided, persists to the user-namespaced storage key.
 * Otherwise, persists to the guest storage key.
 */
export function saveQuizSession(
  session: GuestQuizSession,
  userId?: string
): StorageOperationResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      data: false,
      error: 'Penyimpanan lokal ditolak atau tidak didukung oleh browser Anda.',
      isStorageAvailable: false,
    };
  }

  const effectiveUserId = userId || session.userId;
  const key = getQuizSessionStorageKey(effectiveUserId);

  try {
    const sessionToSave: GuestQuizSession = {
      ...session,
      userId: effectiveUserId,
    };
    // Defensively sanitize before serializing to guarantee no null or array answers
    const cleanSession = sanitizeGuestSession(sessionToSave, effectiveUserId);
    const payload = JSON.stringify(cleanSession);
    window.localStorage.setItem(key, payload);
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
 * Alias for saveQuizSession (backward-compatibility)
 */
export function saveGuestSession(
  session: GuestQuizSession,
  userId?: string
): StorageOperationResult<boolean> {
  return saveQuizSession(session, userId);
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
          questionSnapshot: Array.isArray(item.questionSnapshot)
            ? (item.questionSnapshot as QuizQuestion[])
            : undefined,
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

export const MOCK_QUOTA_HISTORY_KEY = '__test_mock_quota_history__';

/**
 * Check whether the simulated QuotaExceededError for history is enabled.
 * Used exclusively for testing bug AD18-05 without filling device storage.
 */
export function isMockQuotaHistoryEnabled(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return (
      window.sessionStorage.getItem(MOCK_QUOTA_HISTORY_KEY) === 'true' ||
      window.localStorage.getItem(MOCK_QUOTA_HISTORY_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

/**
 * Set or unset the simulated QuotaExceededError for history.
 */
export function setMockQuotaHistorySimulation(enable: boolean): void {
  try {
    if (typeof window === 'undefined') return;
    if (enable) {
      window.sessionStorage.setItem(MOCK_QUOTA_HISTORY_KEY, 'true');
    } else {
      window.sessionStorage.removeItem(MOCK_QUOTA_HISTORY_KEY);
      window.localStorage.removeItem(MOCK_QUOTA_HISTORY_KEY);
    }
  } catch {
    // Ignore storage errors in test toggle
  }
}

// Expose browser console helper for QA and manual simulation
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__simulateHistoryQuotaError = (enable: boolean) => {
    setMockQuotaHistorySimulation(enable);
    if (enable) {
      console.warn(
        '🧪 [SIMULASI AD18-05] Simulasi QuotaExceededError pada persistHistory DIAKTIFKAN.\n' +
        'Penyimpanan history sekarang akan gagal, sedangkan penyimpanan sesi aktif tetap berjalan normal.\n' +
        'Untuk menonaktifkan, ketik di konsol: window.__simulateHistoryQuotaError(false)'
      );
    } else {
      console.log(
        '✅ [SIMULASI AD18-05] Simulasi QuotaExceededError DINONAKTIFKAN.\n' +
        'Penyimpanan history kembali normal.'
      );
    }
  };

  (window as unknown as Record<string, unknown>).__seedCompletedQuizSession = (targetScore = 100) => {
    try {
      const now = new Date().toISOString();
      const submittedAnswers: Record<string, SubmittedAnswer> = {};
      soalHidrolisisGaram.forEach((q) => {
        submittedAnswers[q.id] = {
          questionId: q.id,
          selectedOption: q.jawabanBenar,
          isCorrect: true,
          answeredAt: now,
        };
      });
      const completedSession: GuestQuizSession = {
        guestSessionId: generateUid('guest'),
        attemptId: generateUid('att_m1_test'),
        questionVersion: SOAL_VERSION,
        draftAnswers: {},
        submittedAnswers,
        currentQuestionIndex: 9,
        status: 'completed',
        score: targetScore,
        startedAt: now,
        completedAt: now,
      };
      saveGuestSession(completedSession);
      console.log(
        `🧪 [SIMULASI AD18-05] Sesi kuis selesai berhasil di-seed (Skor: ${targetScore}, ID: ${completedSession.attemptId}).\n` +
        'Silakan refresh halaman (F5) untuk melihat sesi kuis selesai aktif.'
      );
      return completedSession;
    } catch (e) {
      console.error('Gagal seed sesi kuis:', e);
    }
  };
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

  // AD18-05 Test Simulation: Simulate QuotaExceededError on history without filling storage
  if (isMockQuotaHistoryEnabled()) {
    return {
      success: false,
      data: false,
      error: 'Gagal menyimpan riwayat karena penyimpanan penuh. Hasil ini belum tersimpan di riwayat.',
      isStorageAvailable: true,
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
  history: QuizAttemptHistoryItem[],
  userId?: string
): {
  newSession: GuestQuizSession;
  updatedHistory: QuizAttemptHistoryItem[];
} {
  const effectiveUserId = userId || currentSession.userId;
  const safeSession = sanitizeGuestSession(currentSession, effectiveUserId);
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
        questionSnapshot: soalHidrolisisGaram,
      });
    }
  }

  // Create a brand new session with a new attempt ID, preserving guest ID and userId
  const newSession = createNewGuestSession(safeSession.guestSessionId, effectiveUserId);

  return {
    newSession,
    updatedHistory,
  };
}
