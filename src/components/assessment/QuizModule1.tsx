import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { saveQuizAttemptToFirestore, enqueueAccountAttempt } from '../../services/firestoreQuizService';
import { isFirebaseConfigured } from '../../services/firebase';
import {
  soalHidrolisisGaram,
  SOAL_VERSION,
} from '../../data/soalHidrolisisGaram';
import type {
  GuestQuizSession,
  QuizAttemptHistoryItem,
  SubmittedAnswer,
  EssayGradingResult,
} from '../../types/quiz';
import { QuizEsaiSection } from './QuizEsaiSection';
import { soalEsaiHidrolisisGaram } from '../../data/soalEsaiHidrolisisGaram';
import {
  loadQuizSession,
  saveQuizSession,
  loadQuizHistory,
  saveQuizHistory,
  clearDeviceHistory,
  createNewGuestSession,
  resetDraftForQuestion,
  retakeQuizWithNewAttempt,
  isLocalStorageAvailable,
  sanitizeGuestSession,
} from '../../services/storageAdapter';
import './QuizModule1.css';

/**
 * Safely load initial session based on active user identity (AD18-06)
 */
function getInitialSessionLoad(userId?: string) {
  const available = isLocalStorageAvailable();
  if (!available) {
    return {
      session: createNewGuestSession(undefined, userId),
      isAvailable: false,
      error: 'Penyimpanan lokal perangkat Anda tidak aktif atau ditolak oleh peramban.',
    };
  }
  const loaded = loadQuizSession(userId);
  if (loaded.success && loaded.data) {
    return {
      session: loaded.data,
      isAvailable: true,
      error: undefined,
    };
  }
  return {
    session: createNewGuestSession(undefined, userId),
    isAvailable: true,
    error: loaded.error,
  };
}

export default function QuizModule1() {
  const { user } = useAuth();
  const currentUserId = user?.id || user?.uid || undefined;

  // Track previous user to detect login, logout, and account-switching (AD18-06)
  const [prevUserId, setPrevUserId] = useState<string | undefined>(currentUserId);

  const [initialLoadResult, setInitialLoadResult] = useState(() =>
    getInitialSessionLoad(currentUserId)
  );

  const [session, setSession] = useState<GuestQuizSession>(initialLoadResult.session);

  const [history, setHistory] = useState<QuizAttemptHistoryItem[]>(() => {
    const loaded = loadQuizHistory();
    const loadedHistory = loaded.data || [];
    const loadedSession = initialLoadResult.session;

    // If loaded active session was completed but not in history, attempt to archive it safely on boot
    if (
      loadedSession &&
      loadedSession.status === 'completed' &&
      loadedSession.score !== null &&
      loadedSession.attemptId &&
      !loadedHistory.some((item) => item.attemptId === loadedSession.attemptId)
    ) {
      const finalCorrect = Object.values(loadedSession.submittedAnswers || {}).filter(
        (a) => a?.isCorrect
      ).length;
      const itemToArchive: QuizAttemptHistoryItem = {
        attemptId: loadedSession.attemptId,
        guestSessionId: loadedSession.guestSessionId,
        questionVersion: loadedSession.questionVersion || SOAL_VERSION,
        totalQuestions: soalHidrolisisGaram.length,
        correctCount: finalCorrect,
        score: loadedSession.score,
        startedAt: loadedSession.startedAt,
        completedAt: loadedSession.completedAt || new Date().toISOString(),
        answers: loadedSession.submittedAnswers || {},
        questionSnapshot: soalHidrolisisGaram,
      };

      const updatedHistory = [itemToArchive, ...loadedHistory];
      const saveRes = saveQuizHistory(updatedHistory);
      if (saveRes.success) {
        return updatedHistory;
      }
    }

    return loadedHistory;
  });

  const [storageStatus, setStorageStatus] = useState<{
    isAvailable: boolean;
    error?: string;
  }>({
    isAvailable: initialLoadResult.isAvailable,
    error: initialLoadResult.error,
  });

  // Separate state for history archive failures (AD18-05: decoupled from storageStatus)
  const [archiveError, setArchiveError] = useState<string | null>(() => {
    // If loaded session is completed, check if it's missing from history on mount / refresh
    const s = initialLoadResult.session;
    if (s && s.status === 'completed' && s.score !== null && s.attemptId) {
      const currentHistory = loadQuizHistory().data || [];
      const exists = currentHistory.some((item) => item.attemptId === s.attemptId);
      if (!exists) {
        return 'Gagal menyimpan riwayat karena penyimpanan penuh. Hasil ini belum tersimpan di riwayat.';
      }
    }
    return null;
  });

  const [hasExported, setHasExported] = useState(false);
  const [isUnarchivedRetakeConfirmOpen, setIsUnarchivedRetakeConfirmOpen] = useState(false);
  const [showStudentEssayReview, setShowStudentEssayReview] = useState(false);

  // Synchronously adjust state during render when account changes (standard React pattern - AD18-06)
  if (prevUserId !== currentUserId) {
    setPrevUserId(currentUserId);
    const freshLoaded = getInitialSessionLoad(currentUserId);
    setInitialLoadResult(freshLoaded);
    setSession(freshLoaded.session);
    setStorageStatus({
      isAvailable: freshLoaded.isAvailable,
      error: freshLoaded.error,
    });
    setHasExported(false);
    setIsUnarchivedRetakeConfirmOpen(false);

    // Recheck unarchived status for the newly loaded user session
    const s = freshLoaded.session;
    const h = loadQuizHistory().data || [];
    if (s && s.status === 'completed' && s.score !== null && s.attemptId) {
      const exists = h.some((item) => item.attemptId === s.attemptId);
      setArchiveError(
        exists
          ? null
          : 'Gagal menyimpan riwayat karena penyimpanan penuh. Hasil ini belum tersimpan di riwayat.'
      );
    } else {
      setArchiveError(null);
    }
  }

  const [rulesOpen, setRulesOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // W3C ARIA Focus Trap for Clear History and Unarchived Retake Modals (AD18-08)
  const clearConfirmModalRef = useFocusTrap<HTMLDivElement>({
    isOpen: isClearConfirmOpen,
    onClose: () => setIsClearConfirmOpen(false),
    initialFocusSelector: '.btn-modal-cancel',
    restoreFocus: true,
  });

  const unarchivedModalRef = useFocusTrap<HTMLDivElement>({
    isOpen: isUnarchivedRetakeConfirmOpen,
    onClose: () => setIsUnarchivedRetakeConfirmOpen(false),
    initialFocusSelector: '.btn-modal-cancel',
    restoreFocus: true,
  });

  // Sync session changes to localStorage safely in the user's isolated namespace (AD18-06)
  const persistSession = useCallback(
    (updatedSession: GuestQuizSession) => {
      const cleanSession = sanitizeGuestSession(updatedSession, currentUserId);
      setSession(cleanSession);
      const saveRes = saveQuizSession(cleanSession, currentUserId);
      if (!saveRes.success) {
        setStorageStatus({
          isAvailable: false,
          error: saveRes.error || 'Gagal menyimpan draf kuis ke memori perangkat.',
        });
      } else {
        setStorageStatus({
          isAvailable: true,
        });
      }
    },
    [currentUserId]
  );

  // Sync history changes to localStorage safely - completely decoupled from storageStatus
  const persistHistory = useCallback((updatedHistory: QuizAttemptHistoryItem[]) => {
    setHistory(updatedHistory);
    const saveRes = saveQuizHistory(updatedHistory);
    if (!saveRes.success) {
      setArchiveError(
        saveRes.error ||
          'Gagal menyimpan riwayat karena penyimpanan penuh. Hasil ini belum tersimpan di riwayat.'
      );
      return false;
    } else {
      setArchiveError(null);
      return true;
    }
  }, []);

  const totalQuestions = soalHidrolisisGaram.length;

  const safeDraftAnswers =
    session.draftAnswers && typeof session.draftAnswers === 'object' && !Array.isArray(session.draftAnswers)
      ? session.draftAnswers
      : {};
  const safeSubmittedAnswers =
    session.submittedAnswers && typeof session.submittedAnswers === 'object' && !Array.isArray(session.submittedAnswers)
      ? session.submittedAnswers
      : {};

  const safeIndex =
    typeof session.currentQuestionIndex === 'number' &&
    Number.isInteger(session.currentQuestionIndex) &&
    session.currentQuestionIndex >= 0 &&
    session.currentQuestionIndex < totalQuestions
      ? session.currentQuestionIndex
      : 0;

  const currentIndex = safeIndex;
  const currentQuestion = soalHidrolisisGaram[currentIndex] || soalHidrolisisGaram[0];

  const submittedAnswer: SubmittedAnswer | undefined =
    safeSubmittedAnswers[currentQuestion.id];
  const isFrozen = Boolean(submittedAnswer);
  const currentDraft = safeDraftAnswers[currentQuestion.id] || '';
  const effectiveOption = isFrozen ? submittedAnswer?.selectedOption : currentDraft;

  const answeredCount = Object.keys(safeSubmittedAnswers).length;
  const correctCount = Object.values(safeSubmittedAnswers).filter((a) => a?.isCorrect).length;
  const isAllAnswered = answeredCount === totalQuestions;

  // Jump to specific question index
  const handleSelectQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        persistSession({
          ...session,
          currentQuestionIndex: index,
        });
      }
    },
    [persistSession, session, totalQuestions]
  );

  // Select an option draft
  const handlePickOption = useCallback(
    (optionId: string) => {
      if (isFrozen) return; // Frozen diagnostic answer cannot be changed
      const currentDrafts =
        session.draftAnswers && typeof session.draftAnswers === 'object' && !Array.isArray(session.draftAnswers)
          ? session.draftAnswers
          : {};
      persistSession({
        ...session,
        draftAnswers: {
          ...currentDrafts,
          [currentQuestion.id]: optionId,
        },
      });
    },
    [currentQuestion.id, isFrozen, persistSession, session]
  );

  // Submit and freeze answer
  const handleSubmitAnswer = useCallback(() => {
    if (isFrozen || !currentDraft) {
      return; // "Sebelum jawaban dipilih, tombol kirim tidak boleh menyelesaikan soal"
    }

    const isCorrect = currentDraft === currentQuestion.jawabanBenar;
    const newSubmittedAnswer: SubmittedAnswer = {
      questionId: currentQuestion.id,
      selectedOption: currentDraft,
      isCorrect,
      answeredAt: new Date().toISOString(),
    };

    const currentSubmitted =
      session.submittedAnswers && typeof session.submittedAnswers === 'object' && !Array.isArray(session.submittedAnswers)
        ? session.submittedAnswers
        : {};

    const updatedSubmitted = {
      ...currentSubmitted,
      [currentQuestion.id]: newSubmittedAnswer,
    };

    const currentDrafts =
      session.draftAnswers && typeof session.draftAnswers === 'object' && !Array.isArray(session.draftAnswers)
        ? session.draftAnswers
        : {};

    const updatedDrafts = { ...currentDrafts };
    delete updatedDrafts[currentQuestion.id];

    persistSession({
      ...session,
      submittedAnswers: updatedSubmitted,
      draftAnswers: updatedDrafts,
    });
  }, [
    currentDraft,
    currentQuestion.id,
    currentQuestion.jawabanBenar,
    isFrozen,
    persistSession,
    session,
  ]);

  // Handle Essay Answer Change
  const handleEssayAnswerChange = useCallback(
    (questionId: string, text: string) => {
      const updatedAnswers = {
        ...(session.essayAnswers || {}),
        [questionId]: text,
      };
      persistSession({
        ...session,
        essayAnswers: updatedAnswers,
      });
    },
    [persistSession, session]
  );

  // Submit all evaluations (PG + Essay)
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const handleFinalSubmitAll = useCallback(() => {
    setIsSubmittingAll(true);
    try {
      const currentSubmitted = session.submittedAnswers || {};
      const finalCorrect = Object.values(currentSubmitted).filter((a) => a?.isCorrect).length;
      const finalScore = Math.round((finalCorrect / totalQuestions) * 100);
      const completedAt = new Date().toISOString();

      const essayAnswers = session.essayAnswers || {};
      const essayGrading: EssayGradingResult = session.essayGrading || {
        status: 'pending',
        totalEssayScore: 0,
        questionScores: {},
      };

      const finalCompositeScore =
        essayGrading.status === 'graded'
          ? Math.round(0.5 * finalScore + 0.5 * essayGrading.totalEssayScore)
          : null;

      const completedSession: GuestQuizSession = {
        ...session,
        status: 'completed',
        score: finalScore,
        completedAt,
        essayAnswers,
        essayGrading,
        finalCompositeScore,
      };

      persistSession(completedSession);

      // Automatically archive into history
      const newHistoryItem: QuizAttemptHistoryItem = {
        attemptId: session.attemptId,
        guestSessionId: session.guestSessionId,
        questionVersion: session.questionVersion || SOAL_VERSION,
        totalQuestions,
        correctCount: finalCorrect,
        score: finalScore,
        essayAnswers,
        essayGrading,
        finalCompositeScore,
        startedAt: session.startedAt,
        completedAt,
        answers: currentSubmitted,
        questionSnapshot: soalHidrolisisGaram,
        essaySnapshot: soalEsaiHidrolisisGaram,
      };

      const existingIdx = history.findIndex((h) => h.attemptId === session.attemptId);
      const updatedHistoryList =
        existingIdx >= 0
          ? history.map((h, i) => (i === existingIdx ? newHistoryItem : h))
          : [newHistoryItem, ...history];

      persistHistory(updatedHistoryList);

      // Save to Cloud Firestore & Account-Scoped Sync Queue if student is authenticated
      if (user?.id) {
        const enrichedItem = {
          ...newHistoryItem,
          userFullName: user.fullName || 'Siswa Kimia',
          classGrade: user.classGrade || 'XI-MIPA-1',
          schoolName: user.schoolName || 'SMA Negeri 1 Pembelajaran',
          activityName: 'Kuis Formatif Modul 1: Konsep Dasar Hidrolisis Garam',
          attemptType:
            updatedHistoryList.length > 1
              ? `Percobaan Ke-${updatedHistoryList.length} (Remedial)`
              : 'Percobaan Ke-1 (Utama)',
          questionSnapshot: soalHidrolisisGaram,
          essaySnapshot: soalEsaiHidrolisisGaram,
        };

        // 1. Save to user's personal storage
        try {
          const userHistKey = `chem_user_history_${user.id}`;
          const prevUserHist = JSON.parse(localStorage.getItem(userHistKey) || '[]');
          const deduplicated = prevUserHist.filter(
            (p: { attemptId: string }) => p.attemptId !== enrichedItem.attemptId
          );
          localStorage.setItem(userHistKey, JSON.stringify([enrichedItem, ...deduplicated]));
        } catch {
          // ignore
        }

        // 2. Sync to Firestore (idempotent) or Enqueue
        if (isFirebaseConfigured()) {
          saveQuizAttemptToFirestore(enrichedItem, user.id).then((res) => {
            if (!res.success) {
              enqueueAccountAttempt(user.id, enrichedItem);
            }
          });
        } else {
          enqueueAccountAttempt(user.id, enrichedItem);
        }
      }
    } finally {
      setIsSubmittingAll(false);
    }
  }, [history, persistHistory, persistSession, session, totalQuestions, user]);

  // Reset active draft only
  const handleResetActiveDraft = () => {
    if (isFrozen || !currentDraft) return;
    const updated = resetDraftForQuestion(session, currentQuestion.id);
    persistSession(updated);
  };

  // Check if current completed attempt is unarchived in history (AD18-05)
  const isCurrentAttemptUnarchived =
    session.status === 'completed' &&
    session.score !== null &&
    (Boolean(archiveError) || !history.some((h) => h.attemptId === session.attemptId));

  // Retry archiving active completed session to history
  const handleRetryArchive = useCallback(() => {
    const finalCorrect = Object.values(session.submittedAnswers || {}).filter(
      (a) => a?.isCorrect
    ).length;
    const finalScore =
      session.score !== null ? session.score : Math.round((finalCorrect / totalQuestions) * 100);

    const itemToArchive: QuizAttemptHistoryItem = {
      attemptId: session.attemptId,
      guestSessionId: session.guestSessionId,
      questionVersion: session.questionVersion || SOAL_VERSION,
      totalQuestions,
      correctCount: finalCorrect,
      score: finalScore,
      startedAt: session.startedAt,
      completedAt: session.completedAt || new Date().toISOString(),
      answers: session.submittedAnswers || {},
      questionSnapshot: soalHidrolisisGaram,
    };

    const existingIdx = history.findIndex((h) => h.attemptId === session.attemptId);
    const updatedHistoryList =
      existingIdx >= 0
        ? history.map((h, i) => (i === existingIdx ? itemToArchive : h))
        : [itemToArchive, ...history];

    const saveRes = saveQuizHistory(updatedHistoryList);
    if (saveRes.success) {
      setHistory(updatedHistoryList);
      setArchiveError(null);
      setIsUnarchivedRetakeConfirmOpen(false);
    } else {
      setArchiveError(
        saveRes.error ||
          'Gagal menyimpan riwayat karena penyimpanan penuh. Hasil ini belum tersimpan di riwayat.'
      );
    }
  }, [history, session, totalQuestions]);

  // Export quiz result to JSON so student score is never lost
  const handleExportResult = useCallback(() => {
    const finalCorrect = Object.values(session.submittedAnswers || {}).filter(
      (a) => a?.isCorrect
    ).length;
    const finalScore =
      session.score !== null ? session.score : Math.round((finalCorrect / totalQuestions) * 100);

    const exportData = {
      title: 'Hasil Kuis Formatif Modul 1 - Hidrolisis Garam',
      attemptId: session.attemptId,
      guestSessionId: session.guestSessionId,
      questionVersion: session.questionVersion || SOAL_VERSION,
      score: finalScore,
      correctCount: finalCorrect,
      totalQuestions,
      startedAt: session.startedAt,
      completedAt: session.completedAt || new Date().toISOString(),
      answers: session.submittedAnswers,
      exportedAt: new Date().toISOString(),
    };

    try {
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `Hasil_Kuis_Modul1_${session.attemptId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setHasExported(true);
    } catch (err) {
      console.error('Gagal mengekspor hasil kuis:', err);
    }
  }, [session, totalQuestions]);

  // Execute retake and start fresh attempt in the active user's namespace (AD18-06)
  const executeRetake = useCallback(() => {
    setIsUnarchivedRetakeConfirmOpen(false);
    setArchiveError(null);
    setHasExported(false);
    const { newSession, updatedHistory } = retakeQuizWithNewAttempt(
      session,
      history,
      currentUserId
    );
    const saveRes = saveQuizHistory(updatedHistory);
    if (saveRes.success) {
      setHistory(updatedHistory);
    }
    persistSession(newSession);
  }, [currentUserId, history, persistSession, session]);

  // Retake quiz with brand new attempt ID, protected against losing unarchived score (AD18-05)
  const handleRetakeQuiz = useCallback(() => {
    if (isCurrentAttemptUnarchived && !hasExported) {
      setIsUnarchivedRetakeConfirmOpen(true);
      return;
    }
    executeRetake();
  }, [executeRetake, hasExported, isCurrentAttemptUnarchived]);

  // Clear device history with confirmation
  const handleConfirmClearHistory = () => {
    const res = clearDeviceHistory();
    if (res.success) {
      setHistory([]);
      setIsClearConfirmOpen(false);
    } else {
      setStorageStatus({
        isAvailable: false,
        error: res.error || 'Gagal menghapus riwayat dari perangkat.',
      });
      setIsClearConfirmOpen(false);
    }
  };

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in essay phase, user is inside an input, textarea, or a modal is open
      if (
        session.currentPhase === 'essay' ||
        isClearConfirmOpen ||
        isUnarchivedRetakeConfirmOpen ||
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Arrow navigation
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          e.preventDefault();
          handleSelectQuestion(currentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < totalQuestions - 1) {
          e.preventDefault();
          handleSelectQuestion(currentIndex + 1);
        }
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        if (!isFrozen) {
          e.preventDefault();
          const optionMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
          handlePickOption(optionMap[e.key]);
        }
      } else if (['a', 'b', 'c', 'd', 'e'].includes(e.key.toLowerCase())) {
        if (!isFrozen) {
          e.preventDefault();
          handlePickOption(e.key.toUpperCase());
        }
      } else if (e.key === 'Enter') {
        if (!isFrozen && currentDraft) {
          e.preventDefault();
          handleSubmitAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentIndex,
    isFrozen,
    currentDraft,
    isClearConfirmOpen,
    isUnarchivedRetakeConfirmOpen,
    session.currentPhase,
    totalQuestions,
    handleSelectQuestion,
    handlePickOption,
    handleSubmitAnswer,
  ]);

  return (
    <section className="quiz-section" id="kuis-modul-1" aria-labelledby="quiz-main-heading">
      <div className="quiz-container">
        {/* Section Header */}
        <header className="quiz-header">
          <div className="quiz-badge-pill">
            <span aria-hidden="true">📝</span>
            <span>Kuis Formatif • Fase F Kelas XI</span>
          </div>
          <h2 id="quiz-main-heading" className="quiz-title">
            Uji Kompetensi: <span className="highlight-teal">Modul 1 Hidrolisis Garam</span>
          </h2>
          <p className="quiz-subtitle">
            Uji pemahaman konsep dasar, sifat larutan, reaksi hidrolisis kation-anion, tetapan Kh, dan
            perhitungan pH secara interaktif dengan pembahasan ilmiah terverifikasi.
          </p>

          {/* Session Metadata & Storage Indicators */}
          <div className="quiz-session-meta">
            {user ? (
              <span className="meta-chip chip-storage-ok" title="Tersinkronisasi ke Akun Siswa">
                👤 Siswa: <strong>{user.fullName?.split(' ')[0]}</strong>
                {isFirebaseConfigured() && <span style={{ marginLeft: 4 }}>🔥 (Firestore Cloud)</span>}
              </span>
            ) : (
              <span className="meta-chip" title="ID Sesi Tamu Anda">
                👤 Sesi Guest: <code>{session.guestSessionId.slice(0, 14)}...</code>
              </span>
            )}
            <span className="meta-chip" title="ID Percobaan Kuis Aktif">
              🔖 Percobaan ID: <code>{session.attemptId.slice(0, 16)}</code>
            </span>
            <span className="meta-chip" title="Versi Bank Soal">
              🏷️ Versi Soal: v{session.questionVersion || SOAL_VERSION}
            </span>
            <span
              className={`meta-chip ${
                archiveError
                  ? 'chip-storage-warn'
                  : storageStatus.isAvailable && !storageStatus.error
                  ? 'chip-storage-ok'
                  : 'chip-storage-warn'
              }`}
            >
              {archiveError
                ? '⚠️ Gagal Arsip Riwayat'
                : storageStatus.isAvailable && !storageStatus.error
                ? '💾 Penyimpanan Lokal Aktif'
                : '⚠️ Storage Bermasalah'}
            </span>
          </div>
        </header>

        {/* Persistent Archive Failure Warning Banner (AD18-05) */}
        {archiveError && (
          <div
            className="storage-alert-banner archive-failure-banner"
            role="alert"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: 'var(--color-coral, #FF887A)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }} aria-hidden="true">
                ⚠️
              </span>
              <div style={{ flex: 1 }}>
                <strong
                  style={{
                    color: '#991B1B',
                    fontSize: '1rem',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Peringatan: Gagal Menyimpan Riwayat
                </strong>
                <p style={{ color: '#7F1D1D', margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {archiveError}
                </p>
                {hasExported && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      color: '#065F46',
                      backgroundColor: '#D1FAE5',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Hasil percobaan telah berhasil diekspor ke file JSON
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginLeft: '36px' }}>
              <button
                type="button"
                className="btn-retry-archive"
                onClick={handleRetryArchive}
                style={{
                  backgroundColor: 'var(--color-fresh-teal, #20B8AA)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🔄</span>
                <span>Coba Lagi / Retry</span>
              </button>

              <button
                type="button"
                className="btn-export-result"
                onClick={handleExportResult}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-deep-navy, #243B64)',
                  border: '1.5px solid var(--color-deep-navy, #243B64)',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📥</span>
                <span>Ekspor Hasil</span>
              </button>
            </div>
          </div>
        )}

        {/* Storage / Session Alert Banner */}
        {(!storageStatus.isAvailable || storageStatus.error) && (
          <div className="storage-alert-banner" role="alert">
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <div>
              <strong>Peringatan Akses Penyimpanan:</strong>
              <p>
                {storageStatus.error ||
                  'Penyimpanan lokal ditolak atau dibatasi oleh browser Anda. Kuis tetap dapat dikerjakan, namun draf tidak akan tersimpan jika Anda menutup halaman.'}
              </p>
            </div>
          </div>
        )}

        {/* Collapsible Rules & Scoring Guide */}
        <div className="quiz-rules-box">
          <button
            type="button"
            className="rules-header"
            onClick={() => setRulesOpen(!rulesOpen)}
            aria-expanded={rulesOpen}
            aria-controls="quiz-rules-content"
          >
            <div className="rules-title-group">
              <span aria-hidden="true">📋</span>
              <span>Panduan Aturan Berpindah Soal & Sistem Penilaian</span>
            </div>
            <span className={`rules-toggle-icon ${rulesOpen ? 'expanded' : ''}`} aria-hidden="true">
              ▼
            </span>
          </button>

          {rulesOpen && (
            <div className="rules-content" id="quiz-rules-content">
              <div className="rule-item">
                <span className="rule-icon">🔀</span>
                <div>
                  <strong>Navigasi & Berpindah Soal Bebas:</strong>
                  <p>
                    Anda dapat berpindah nomor soal kapan saja dengan menekan nomor 1–10 pada panel
                    navigasi, tombol "Sebelumnya / Selanjutnya", atau tombol panah keyboard (← / →).
                    Soal yang belum dikerjakan dapat ditinjau kembali sewaktu-waktu.
                  </p>
                </div>
              </div>

              <div className="rule-item">
                <span className="rule-icon">🔒</span>
                <div>
                  <strong>Validasi Pilihan & Pembekuan Jawaban:</strong>
                  <p>
                    Tombol <em>Kirim Jawaban</em> baru aktif setelah Anda memilih salah satu opsi.
                    Setelah dikirim, jawaban diagnostik langsung dibekukan (tidak dapat diubah) agar
                    evaluasi pemahaman Anda murni sebelum membaca pembahasan saintifik.
                  </p>
                </div>
              </div>

              <div className="rule-item">
                <span className="rule-icon">💯</span>
                <div>
                  <strong>Perhitungan Skor Kuis (100 Poin):</strong>
                  <p>
                    Tiap butir soal bernilai 10 poin (10 soal = total 100 poin). Tidak ada pengurangan
                    skor jika salah. Skor akhir resmi diterbitkan dan dicatat setelah seluruh butir soal
                    selesai dikerjakan. Draf yang sedang berjalan tidak tercampur dengan nilai akhir.
                  </p>
                </div>
              </div>

              <div className="rule-item">
                <span className="rule-icon">🔄</span>
                <div>
                  <strong>Percobaan Ulang & Reset:</strong>
                  <p>
                    Tersedia tombol "Reset Draf" untuk membatalkan pilihan yang belum dikirim. Percobaan
                    ulang akan menghasilkan ID percobaan baru dan menyimpan riwayat lama di perangkat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase Navigation Tabs */}
        {session.status !== 'completed' && (
          <div
            id="quiz-phase-tabs"
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => persistSession({ ...session, currentPhase: 'pg' })}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '0.875rem',
                border: session.currentPhase !== 'essay' ? '2px solid #0F766E' : '1px solid #CBD5E1',
                backgroundColor: session.currentPhase !== 'essay' ? '#F0FDFA' : '#FFFFFF',
                color: session.currentPhase !== 'essay' ? '#0F766E' : '#475569',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: session.currentPhase !== 'essay' ? '0 2px 8px rgba(15, 118, 110, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>📝</span>
              <span>Bagian 1: Pilihan Ganda (10 Soal)</span>
              {isAllAnswered && <span style={{ color: '#16A34A', fontWeight: 900 }}>✓ Selesai</span>}
            </button>

            <button
              type="button"
              onClick={() => persistSession({ ...session, currentPhase: 'essay' })}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '0.875rem',
                border: session.currentPhase === 'essay' ? '2px solid #0F766E' : '1px solid #CBD5E1',
                backgroundColor: session.currentPhase === 'essay' ? '#F0FDFA' : '#FFFFFF',
                color: session.currentPhase === 'essay' ? '#0F766E' : '#475569',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: session.currentPhase === 'essay' ? '0 2px 8px rgba(15, 118, 110, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>✍️</span>
              <span>Bagian 2: Quiz Esai (5 Soal)</span>
              {Object.keys(session.essayAnswers || {}).length > 0 && (
                <span style={{ color: '#0D9488', fontWeight: 900 }}>
                  ({Object.keys(session.essayAnswers || {}).length}/5 Terisi)
                </span>
              )}
            </button>
          </div>
        )}

        {/* Conditional View: Quiz Esai Section vs Pilihan Ganda Workspace */}
        {session.status !== 'completed' && session.currentPhase === 'essay' ? (
          <QuizEsaiSection
            answers={session.essayAnswers || {}}
            onAnswerChange={handleEssayAnswerChange}
            onSubmitAll={handleFinalSubmitAll}
            onBackToPg={() => persistSession({ ...session, currentPhase: 'pg' })}
            isSubmitting={isSubmittingAll}
          />
        ) : session.status !== 'completed' ? (
          <>
            {/* Question Palette & Progress Bar */}
            <div className="quiz-nav-card" id="kuis-pg-area">
              <div className="nav-header-row">
                <div className="progress-info-group">
                  <span className="progress-text">
                    Progres: {answeredCount} dari {totalQuestions} Soal Terjawab
                  </span>
                  <div
                    className="progress-bar-track"
                    role="progressbar"
                    aria-valuenow={answeredCount}
                    aria-valuemin={0}
                    aria-valuemax={totalQuestions}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="nav-legend" aria-hidden="true">
                  <span className="legend-item">
                    <span className="legend-dot dot-correct"></span> Benar
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-wrong"></span> Salah
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-draft"></span> Draf Dipilih
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot dot-empty"></span> Belum
                  </span>
                </div>
              </div>

              {/* Palette Grid Buttons 1-10 */}
              <div className="palette-grid" role="group" aria-label="Daftar Nomor Soal Kuis">
                {soalHidrolisisGaram.map((q, idx) => {
                  const ans = safeSubmittedAnswers[q.id];
                  const isCurrent = idx === currentIndex;
                  const hasDraft = !ans && Boolean(safeDraftAnswers[q.id]);

                  let statusClass = '';
                  if (ans) {
                    statusClass = ans.isCorrect ? 'btn-correct' : 'btn-wrong';
                  } else if (hasDraft) {
                    statusClass = 'btn-draft';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`palette-btn ${statusClass} ${isCurrent ? 'active' : ''}`}
                      onClick={() => handleSelectQuestion(idx)}
                      aria-label={`Nomor Soal ${idx + 1}${
                        ans ? (ans.isCorrect ? ' (Benar)' : ' (Salah)') : hasDraft ? ' (Draf)' : ''
                      }`}
                      aria-current={isCurrent ? 'true' : undefined}
                    >
                      <span>{idx + 1}</span>
                      {ans && (
                        <span
                          className="palette-status-pill"
                          style={{
                            backgroundColor: ans.isCorrect
                              ? 'var(--color-fresh-teal)'
                              : 'var(--color-coral)',
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Question Workspace */}
            <article className="question-workspace-card" aria-labelledby="question-item-title">
              {/* Top Bar: Number & Concept Badge */}
              <div className="question-top-bar">
                <span className="q-number-badge" id="question-item-title">
                  <span>Soal Nomor {currentIndex + 1}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>
                    / {totalQuestions}
                  </span>
                </span>

                <span className="q-concept-tag" title="Fokus Konsep Kimia">
                  <span>🔬</span>
                  <span>{currentQuestion.konsep.replace(/-/g, ' ')}</span>
                </span>
              </div>

              {/* Question Text */}
              <div className="question-text-area">
                <p className="question-text">{currentQuestion.pertanyaan}</p>
              </div>

              {/* Options Radiogroup */}
              <div
                className="options-list"
                role="radiogroup"
                aria-labelledby="question-item-title"
                aria-disabled={isFrozen}
              >
                {currentQuestion.opsi.map((opt) => {
                  const isSelected = effectiveOption === opt.id;
                  const isCorrectKey = isFrozen && opt.id === currentQuestion.jawabanBenar;
                  const isWrongChoice = isFrozen && isSelected && !isCorrectKey;

                  let optionClass = '';
                  if (isFrozen) {
                    optionClass += ' frozen';
                    if (isCorrectKey) optionClass += ' option-correct-key';
                    if (isWrongChoice) optionClass += ' option-wrong-choice';
                  } else if (isSelected) {
                    optionClass += ' selected';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`option-item ${optionClass}`}
                      onClick={() => handlePickOption(opt.id)}
                      disabled={isFrozen}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Opsi ${opt.id}: ${opt.teks}`}
                    >
                      <span className="option-key-badge" aria-hidden="true">
                        {opt.id}
                      </span>
                      <span className="option-text">{opt.teks}</span>

                      {isFrozen && isCorrectKey && (
                        <span className="option-frozen-tag tag-correct" aria-label="Kunci Jawaban Benar">
                          ✓ Kunci Benar
                        </span>
                      )}
                      {isFrozen && isWrongChoice && (
                        <span className="option-frozen-tag tag-wrong" aria-label="Pilihan Anda Salah">
                          ✕ Pilihan Anda
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Action Controls */}
              <div className="question-actions-bar">
                <div className="nav-btn-group">
                  <button
                    type="button"
                    className="btn-nav-step"
                    onClick={() => handleSelectQuestion(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    aria-label="Ke Soal Sebelumnya"
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    type="button"
                    className="btn-nav-step"
                    onClick={() => handleSelectQuestion(currentIndex + 1)}
                    disabled={currentIndex === totalQuestions - 1}
                    aria-label="Ke Soal Selanjutnya"
                  >
                    Selanjutnya →
                  </button>
                </div>

                <div className="submission-btn-group">
                  {/* Reset Draft Button */}
                  {!isFrozen && (
                    <button
                      type="button"
                      className="btn-reset-draft"
                      onClick={handleResetActiveDraft}
                      disabled={!currentDraft}
                      title="Kosongkan pilihan draf pada butir soal ini"
                    >
                      Reset Draf
                    </button>
                  )}

                  {/* Submit & Freeze Button: DISABLED until an option is picked */}
                  <button
                    type="button"
                    className="btn-submit-answer"
                    onClick={handleSubmitAnswer}
                    disabled={isFrozen || !currentDraft}
                    title={
                      isFrozen
                        ? 'Jawaban soal ini telah dikirim dan dibekukan'
                        : !currentDraft
                        ? 'Pilih salah satu jawaban terlebih dahulu sebelum mengirim'
                        : 'Kirim dan periksa kebenaran jawaban'
                    }
                  >
                    {isFrozen ? '✓ Jawaban Terkirim' : 'Kirim Jawaban'}
                  </button>

                  {/* Tombol Lanjut ke Quiz Esai setelah soal nomor 10 dikerjakan atau seluruh soal dijawab */}
                  {(isFrozen && (currentIndex === totalQuestions - 1 || isAllAnswered)) && (
                    <button
                      type="button"
                      className="btn-next-essay-phase"
                      onClick={() => {
                        persistSession({
                          ...session,
                          currentPhase: 'essay',
                        });
                      }}
                      style={{
                        backgroundColor: '#0F766E',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        borderRadius: '0.75rem',
                        padding: '0.65rem 1.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
                      }}
                      title="Lanjutkan ke bagian Quiz Esai"
                    >
                      <span>Lanjut ke Quiz Esai</span>
                      <span>✍️ →</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Instant Feedback & Pembahasan Panel (Frozen Diagnostic Output) */}
              {isFrozen && submittedAnswer && (
                <div
                  className={`feedback-panel ${
                    submittedAnswer.isCorrect ? 'feedback-correct' : 'feedback-wrong'
                  }`}
                  role="region"
                  aria-live="polite"
                  aria-label="Umpan Balik dan Pembahasan Soal"
                >
                  <div className="feedback-banner-header">
                    <span className="feedback-title-text">
                      {submittedAnswer.isCorrect ? (
                        <>
                          <span>🎉</span>
                          <span>Jawaban Anda Benar!</span>
                        </>
                      ) : (
                        <>
                          <span>⚠️</span>
                          <span>
                            Jawaban Belum Tepat (Kunci Jawaban: {currentQuestion.jawabanBenar})
                          </span>
                        </>
                      )}
                    </span>
                    <span className="feedback-frozen-badge">Jawaban Terkunci</span>
                  </div>

                  <div className="feedback-body">
                    <h4>Pembahasan Saintifik:</h4>
                    <p>{currentQuestion.pembahasan}</p>
                  </div>
                </div>
              )}

              {/* Transition Banner to Essay after Question 10 or all PG answered */}
              {(isFrozen && (currentIndex === totalQuestions - 1 || isAllAnswered)) && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: '#F0FDFA',
                    border: '2px solid #0D9488',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, color: '#134E4A', fontSize: '1.05rem', fontWeight: 800 }}>
                      🎉 {isAllAnswered ? 'Seluruh 10 Soal Pilihan Ganda Selesai!' : 'Soal No. 10 Selesai Dijawab!'}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#0F766E', fontSize: '0.875rem' }}>
                      Lanjutkan ke bagian Quiz Esai untuk melengkapi evaluasi kompetensi kimia hidrolisis garam.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      persistSession({
                        ...session,
                        currentPhase: 'essay',
                      });
                    }}
                    style={{
                      backgroundColor: '#0F766E',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(15, 118, 110, 0.3)',
                    }}
                  >
                    <span>Lanjut ke Quiz Esai</span>
                    <span>✍️ →</span>
                  </button>
                </div>
              )}
            </article>
          </>
        ) : null}

        {/* Completion Summary Card (Shown when quiz evaluation is completed) */}
        {session.status === 'completed' && session.score !== null && (
          <div className="quiz-summary-card" role="region" aria-label="Hasil Akhir Kuis">
            <div className="summary-score-circle">
              <span className="score-number">{session.score}</span>
              <span className="score-max-label">/ 100</span>
            </div>

            <h3 className="summary-title">
              {session.score >= 75
                ? 'Luar Biasa! Evaluasi Pembelajaran Selesai 🎉'
                : 'Evaluasi Selesai! Tetap Semangat Belajar 💡'}
            </h3>

            <p className="summary-text">
              {session.score >= 75
                ? 'Selamat! Pemahaman Anda mengenai konsep hidrolisis garam, penentuan sifat larutan, persamaan reaksi, dan tetapan Kh sangat baik.'
                : 'Anda telah menyelesaikan kuis formatif. Pelajari kembali butir soal yang keliru melalui pembahasan di atas untuk memantapkan konsep kimia Anda.'}
            </p>

            <div className="summary-stats-grid">
              <div className="stat-box">
                <div className="stat-box-val" style={{ color: 'var(--color-fresh-teal)' }}>
                  {correctCount}
                </div>
                <div className="stat-box-label">Butir Benar (PG)</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-val" style={{ color: 'var(--color-coral)' }}>
                  {totalQuestions - correctCount}
                </div>
                <div className="stat-box-label">Butir Salah (PG)</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-val" style={{ color: 'var(--color-deep-navy)' }}>
                  {session.score}%
                </div>
                <div className="stat-box-label">Akurasi PG</div>
              </div>
            </div>

            {/* Bagian Evaluasi Esai & Nilai Akhir */}
            <div
              style={{
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
                padding: '1.25rem',
                borderRadius: '1rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>✍️</span>
                  <span>Evaluasi Bagian 2: Quiz Esai</span>
                </h4>
                {session.essayGrading?.status === 'graded' ? (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#16A34A',
                      backgroundColor: '#DCFCE7',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    ✓ Selesai Dinilai oleh {session.essayGrading.gradedBy || 'Guru'}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#D97706',
                      backgroundColor: '#FEF3C7',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    ⏳ Menunggu Penilaian Guru
                  </span>
                )}
              </div>

              {session.essayGrading?.status === 'graded' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0',
                        flex: 1,
                        minWidth: '140px',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                        Skor Esai (Maks 100)
                      </span>
                      <strong style={{ fontSize: '1.35rem', color: '#0F766E' }}>
                        {session.essayGrading.totalEssayScore}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}> / 100</span>
                    </div>

                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#F0FDF4',
                        borderRadius: '0.75rem',
                        border: '1px solid #86EFAC',
                        flex: 1,
                        minWidth: '140px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#166534',
                          display: 'block',
                          fontWeight: 700,
                        }}
                      >
                        Nilai Akhir Terpadu (50% PG + 50% Esai)
                      </span>
                      <strong style={{ fontSize: '1.35rem', color: '#15803D' }}>
                        {session.finalCompositeScore ??
                          Math.round(
                            0.5 * (session.score || 0) + 0.5 * session.essayGrading.totalEssayScore
                          )}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#166534' }}> / 100</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#475569',
                      backgroundColor: '#FFFFFF',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <strong>Formula Perhitungan:</strong> Nilai Akhir = (0,5 × Skor PG:{' '}
                    {session.score}) + (0,5 × Skor Esai: {session.essayGrading.totalEssayScore}) ={' '}
                    <strong>
                      {session.finalCompositeScore ??
                        Math.round(
                          0.5 * (session.score || 0) + 0.5 * session.essayGrading.totalEssayScore
                        )}
                    </strong>
                  </div>

                  {session.essayGrading.feedback && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '0.8rem',
                          color: '#334155',
                          display: 'block',
                          marginBottom: '0.25rem',
                        }}
                      >
                        💬 Catatan & Umpan Balik Guru:
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                        {session.essayGrading.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFBEB',
                    borderRadius: '0.75rem',
                    border: '1px solid #FDE68A',
                    fontSize: '0.85rem',
                    color: '#92400E',
                    lineHeight: 1.5,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    5 butir jawaban esai Anda telah tersimpan dan terkirim ke sistem. Guru akan
                    memeriksa jawaban Anda berdasarkan rubrik saintifik. Nilai akhir gabungan (Bobot
                    50% Pilihan Ganda + 50% Esai) akan otomatis ditampilkan setelah proses penilaian
                    selesai.
                  </p>
                </div>
              )}

              {/* Toggle to view student's submitted essay answers */}
              {session.essayAnswers && Object.keys(session.essayAnswers).length > 0 && (
                <div style={{ marginTop: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowStudentEssayReview(!showStudentEssayReview)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F766E',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {showStudentEssayReview
                      ? '▲ Sembunyikan Lembar Jawaban Esai'
                      : '▼ Lihat Lembar Jawaban Esai yang Dikirim'}
                  </button>

                  {showStudentEssayReview && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      {soalEsaiHidrolisisGaram.map((q, idx) => (
                        <div
                          key={q.id}
                          style={{
                            padding: '0.75rem',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '0.5rem',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: '#0F766E',
                            }}
                          >
                            Soal {idx + 1}: {q.judul}
                          </span>
                          <p
                            style={{
                              fontSize: '0.8rem',
                              color: '#334155',
                              margin: '0.25rem 0',
                            }}
                          >
                            {q.pertanyaan}
                          </p>
                          <div
                            style={{
                              marginTop: '0.5rem',
                              padding: '0.5rem',
                              backgroundColor: '#F8FAFC',
                              borderRadius: '0.35rem',
                              fontSize: '0.8rem',
                              color: '#1E293B',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            <strong>Jawaban Anda:</strong>
                            <div style={{ marginTop: '0.25rem' }}>
                              {session.essayAnswers?.[q.id] || '(Kosong)'}
                            </div>
                          </div>
                          {session.essayGrading?.questionScores?.[q.id] && (
                            <div
                              style={{
                                marginTop: '0.35rem',
                                fontSize: '0.75rem',
                                color: '#16A34A',
                                fontWeight: 700,
                              }}
                            >
                              Nilai: {session.essayGrading.questionScores[q.id].score} / 20 poin
                              {session.essayGrading.questionScores[q.id].feedback &&
                                ` • Catatan: ${session.essayGrading.questionScores[q.id].feedback}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {archiveError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  margin: '16px 0',
                  color: '#991B1B',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  lineHeight: 1.5,
                }}
              >
                <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
                  ⚠️
                </span>
                <span>
                  Hasil kuis ini belum tersimpan di riwayat karena kuota penyimpanan penuh. Silakan lakukan ekspor atau coba lagi sebelum memulai percobaan baru.
                </span>
              </div>
            )}

            <div className="summary-actions-row">
              <button
                type="button"
                className="btn-retake-quiz"
                onClick={handleRetakeQuiz}
                title="Mulai sesi kuis baru dengan ID percobaan baru"
              >
                <span>🔄</span>
                <span>Mulai Percobaan Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* Device Attempt History Section & Clear History Modal */}
        <div className="device-history-card">
          <div className="history-header">
            <div className="history-title-group">
              <span aria-hidden="true">📜</span>
              <span>Riwayat Percobaan di Perangkat Ini ({history.length})</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-clear-history-trigger"
                onClick={() => setIsClearConfirmOpen(true)}
                disabled={history.length === 0}
                title="Hapus seluruh riwayat perangkat dengan konfirmasi terpisah"
              >
                🗑️ Hapus Riwayat Perangkat
              </button>

              <button
                type="button"
                className="btn-nav-step"
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={() => setHistoryOpen(!historyOpen)}
              >
                {historyOpen ? 'Sembunyikan ▲' : 'Lihat Rekap ▼'}
              </button>
            </div>
          </div>

          {historyOpen && (
            <div>
              {history.length === 0 ? (
                <p className="history-empty-text">
                  Belum ada riwayat kuis selesai yang tersimpan di perangkat ini.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Percobaan ID</th>
                        <th>Waktu Selesai</th>
                        <th>Skor PG</th>
                        <th>Status Esai</th>
                        <th>Nilai Akhir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => {
                        const hasEssay = Boolean(item.essayAnswers && Object.keys(item.essayAnswers).length > 0);
                        const isGraded = item.essayGrading?.status === 'graded';
                        const composite = item.finalCompositeScore ?? (isGraded && item.essayGrading ? Math.round(0.5 * item.score + 0.5 * item.essayGrading.totalEssayScore) : null);

                        return (
                          <tr key={item.attemptId}>
                            <td>
                              <code>{item.attemptId.slice(0, 16)}</code>
                            </td>
                            <td>{new Date(item.completedAt).toLocaleString('id-ID')}</td>
                            <td>
                              <strong
                                style={{
                                  color:
                                    item.score >= 75 ? 'var(--color-fresh-teal)' : 'var(--color-coral)',
                                }}
                              >
                                {item.score}
                              </strong>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                {' '}
                                ({item.correctCount}/{item.totalQuestions})
                              </span>
                            </td>
                            <td>
                              {!hasEssay ? (
                                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Hanya PG</span>
                              ) : isGraded && item.essayGrading ? (
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    color: '#16A34A',
                                    backgroundColor: '#DCFCE7',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '0.35rem',
                                  }}
                                >
                                  Dinilai ({item.essayGrading.totalEssayScore}/100)
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    color: '#D97706',
                                    backgroundColor: '#FEF3C7',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '0.35rem',
                                  }}
                                >
                                  ⏳ Menunggu
                                </span>
                              )}
                            </td>
                            <td>
                              {composite !== null ? (
                                <strong style={{ color: composite >= 75 ? '#16A34A' : '#DC2626' }}>
                                  {composite}
                                </strong>
                              ) : (
                                <span style={{ color: '#64748B' }}>{item.score} (PG)</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Separate Confirmation Modal for Clearing Device History */}
        {isClearConfirmOpen && (
          <div
            className="modal-confirm-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-modal-title"
          >
            <div ref={clearConfirmModalRef} className="modal-confirm-box" tabIndex={-1}>
              <div className="modal-confirm-icon" aria-hidden="true">
                ⚠️
              </div>
              <h3 id="clear-modal-title" className="modal-confirm-title">
                Konfirmasi Hapus Riwayat Perangkat
              </h3>
              <p className="modal-confirm-desc">
                Apakah Anda yakin ingin menghapus seluruh riwayat kuis Modul 1 pada perangkat ini?
                Data riwayat percobaan lampau akan dihapus permanen dari memori browser lokal.
              </p>
              <div className="modal-confirm-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsClearConfirmOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn-modal-danger"
                  onClick={handleConfirmClearHistory}
                >
                  Ya, Hapus Riwayat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Separate Confirmation Modal for Unarchived Retake Quiz (AD18-05) */}
        {isUnarchivedRetakeConfirmOpen && (
          <div
            className="modal-confirm-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unarchived-modal-title"
          >
            <div ref={unarchivedModalRef} className="modal-confirm-box" style={{ maxWidth: '480px' }} tabIndex={-1}>
              <div className="modal-confirm-icon" aria-hidden="true" style={{ fontSize: '2.5rem' }}>
                🚨
              </div>
              <h3 id="unarchived-modal-title" className="modal-confirm-title" style={{ color: '#991B1B' }}>
                Hasil Kuis Belum Tersimpan di Riwayat!
              </h3>
              <p className="modal-confirm-desc" style={{ textAlign: 'left', lineHeight: 1.6 }}>
                Hasil percobaan Anda saat ini (<strong>Skor: {session.score} / 100</strong>) <strong>belum berhasil disimpan ke riwayat perangkat</strong> karena kuota penyimpanan penuh.
                <br /><br />
                Jika Anda memulai percobaan baru sekarang tanpa mengekspor atau mencoba simpan lagi, sesi aktif akan direset dan <strong>hasil kuis sebelumnya akan hilang permanen</strong>.
              </p>

              <div
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  margin: '14px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-deep-navy)' }}>
                    Amankan hasil kuis Anda:
                  </span>
                  <button
                    type="button"
                    onClick={handleExportResult}
                    style={{
                      backgroundColor: 'var(--color-fresh-teal, #20B8AA)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    📥 Ekspor Hasil Sekarang
                  </button>
                </div>
                {hasExported && (
                  <span style={{ color: '#065F46', fontSize: '0.8rem', fontWeight: 600 }}>
                    ✓ Berhasil diekspor! Data Anda aman.
                  </span>
                )}
              </div>

              <div className="modal-confirm-actions" style={{ flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    style={{ flex: 1 }}
                    onClick={() => setIsUnarchivedRetakeConfirmOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      backgroundColor: 'var(--color-deep-navy, #243B64)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={handleRetryArchive}
                  >
                    🔄 Coba Simpan Lagi
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-modal-danger"
                  style={{ width: '100%', backgroundColor: '#EF4444' }}
                  onClick={executeRetake}
                >
                  Saya Paham Risikonya, Tetap Mulai Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
