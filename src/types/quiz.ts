/**
 * Type definitions for Quiz Module 1 (The Secret of Salt)
 * Compliant with PRD.md Bab 21, 23, 24, 29 & AGENTS.md
 */

import type { EssayQuestionData } from '../data/soalEsaiHidrolisisGaram';

export interface QuizOption {
  id: string; // "A" | "B" | "C" | "D" | "E"
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
  selectedOption: string; // "A" | "B" | "C" | "D" | "E"
  isCorrect: boolean;
  answeredAt: string; // ISO 8601 string
}

/**
 * Essay Question Evaluation Types
 */
export interface EssayQuestionScore {
  score: number; // 0 - 20
  feedback?: string;
}

export interface EssayGradingHistoryEntry {
  gradedAt: string;
  gradedBy?: string;
  totalEssayScore: number;
  questionScores: Record<string, EssayQuestionScore>;
  feedback?: string;
}

export interface EssayGradingResult {
  status: 'pending' | 'graded'; // 'pending' = Menunggu Penilaian Guru, 'graded' = Selesai Dinilai
  totalEssayScore: number; // 0 - 100
  questionScores: Record<string, EssayQuestionScore>;
  gradedBy?: string;
  gradedAt?: string;
  feedback?: string;
  history?: EssayGradingHistoryEntry[];
}

/**
 * Active in-progress guest or authenticated quiz session
 */
export interface GuestQuizSession {
  userId?: string; // Authenticated user ID (or undefined for isolated guest session)
  guestSessionId: string;
  attemptId: string;
  questionVersion: string;
  currentPhase?: 'pg' | 'essay'; // Current quiz phase (defaults to 'pg')
  draftAnswers: Record<string, string>; // questionId -> selected option before submit
  submittedAnswers: Record<string, SubmittedAnswer>; // questionId -> frozen response
  currentQuestionIndex: number;
  essayAnswers?: Record<string, string>; // essayQuestionId -> student's answer text
  essayGrading?: EssayGradingResult;
  status: 'in_progress' | 'completed';
  score: number | null; // Final PG score 0 - 100 once completed; null while in draft/progress
  finalCompositeScore?: number | null; // (0.5 * score) + (0.5 * essayScore) once graded
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
  score: number; // PG score (0 - 100)
  essayAnswers?: Record<string, string>; // essay answers
  essayGrading?: EssayGradingResult; // teacher grading status & scores
  finalCompositeScore?: number | null; // composite 50% PG + 50% Essay
  startedAt: string;
  completedAt: string;
  answers: Record<string, SubmittedAnswer>;
  questionSnapshot?: QuizQuestion[];
  essaySnapshot?: EssayQuestionData[];
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
