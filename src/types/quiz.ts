/**
 * Type definitions for Quiz Module 1 (The Secret of Salt)
 * Compliant with PRD.md Bab 21, 23, 24, 29 & AGENTS.md
 */

export interface QuizOption {
  id: string; // "A" | "B" | "C" | "D"
  teks: string;
}

export interface QuizQuestion {
  id: string;
  konsep: string;
  pertanyaan: string;
  opsi: QuizOption[];
  jawabanBenar: string;
  pembahasan: string;
}

/**
 * Diagnostic answer frozen upon submission
 */
export interface SubmittedAnswer {
  questionId: string;
  selectedOption: string; // "A" | "B" | "C" | "D"
  isCorrect: boolean;
  answeredAt: string; // ISO 8601 string
}

/**
 * Active in-progress guest quiz session
 */
export interface GuestQuizSession {
  guestSessionId: string;
  attemptId: string;
  questionVersion: string;
  draftAnswers: Record<string, string>; // questionId -> selected option before submit
  submittedAnswers: Record<string, SubmittedAnswer>; // questionId -> frozen response
  currentQuestionIndex: number;
  status: 'in_progress' | 'completed';
  score: number | null; // Final score 0 - 100 once completed; null while in draft/progress
  startedAt: string;
  completedAt?: string | null;
}

/**
 * Persisted attempt history item in device storage
 */
export interface QuizAttemptHistoryItem {
  attemptId: string;
  guestSessionId: string;
  questionVersion: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  startedAt: string;
  completedAt: string;
  answers: Record<string, SubmittedAnswer>;
}

/**
 * Storage execution response wrapper for safe storage access
 */
export interface StorageOperationResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
  isStorageAvailable: boolean;
}

