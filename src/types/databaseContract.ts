/**
 * Database & API Synchronization Contracts
 * Adheres to PRD.md Bab 4 (User Persona Siswa & Guru) & Bab 24 / 28
 */

import type { QuizAttemptHistoryItem } from './quiz';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  schoolName?: string;
  classGrade?: string; // e.g. "XI-MIPA-1"
  createdAt: string;
  updatedAt: string;
}

export interface AuthLoginRequest {
  email: string;
  password?: string;
  googleToken?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

/**
 * Payload to migrate an anonymous guest session and attempts to a newly authenticated student account
 */
export interface GuestMigrationPayload {
  guestSessionId: string;
  targetUserId: string;
  attempts: QuizAttemptHistoryItem[];
  deviceMetadata?: {
    userAgent: string;
    screenResolution?: string;
    migratedAt: string;
  };
}

export interface GuestMigrationResponse {
  success: boolean;
  migratedAttemptsCount: number;
  syncedAttemptIds: string[];
  message: string;
}

/**
 * Payload for periodic or on-complete attempt synchronization
 */
export interface SyncQuizAttemptPayload {
  attemptId: string;
  moduleId: string; // "modul-1-konsep-dasar"
  questionVersion: string;
  userId?: string | null;
  guestSessionId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt: string;
  itemResponses: Array<{
    questionId: string;
    conceptTag: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    answeredAt: string;
  }>;
}

export interface SyncQuizAttemptResponse {
  success: boolean;
  attemptId: string;
  syncedAt: string;
  serverMasterySummary?: {
    conceptStrengths: string[];
    conceptWeaknesses: string[];
  };
}

/**
 * Teacher analytics dashboard report per Bab 4.2
 */
export interface TeacherClassAnalyticsReport {
  classGrade: string;
  totalStudents: number;
  quizAttemptCount: number;
  averageScore: number;
  misconceptionsByConcept: Record<
    string,
    {
      conceptName: string;
      errorRatePercentage: number;
      commonWrongOption: string;
    }
  >;
}
