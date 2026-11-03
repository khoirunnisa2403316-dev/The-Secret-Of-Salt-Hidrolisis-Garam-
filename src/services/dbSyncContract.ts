/**
 * Database & API Synchronization Service Contract
 * Implements integration layer for Guest-to-Student data migration
 * and backend persistence following PRD Bab 4 and Bab 24.
 */

import type {
  AuthLoginRequest,
  AuthResponse,
  GuestMigrationPayload,
  GuestMigrationResponse,
  SyncQuizAttemptPayload,
  SyncQuizAttemptResponse,
} from '../types/databaseContract';
import type { GuestQuizSession } from '../types/quiz';
import { soalHidrolisisGaram } from '../data/soalHidrolisisGaram';

export interface IDatabaseSyncService {
  login(credentials: AuthLoginRequest): Promise<AuthResponse>;
  migrateGuestSession(payload: GuestMigrationPayload): Promise<GuestMigrationResponse>;
  syncQuizAttempt(payload: SyncQuizAttemptPayload): Promise<SyncQuizAttemptResponse>;
}

/**
 * Helper to transform a completed client GuestQuizSession into backend sync payload
 */
export function buildSyncPayloadFromSession(
  session: GuestQuizSession,
  userId: string | null = null
): SyncQuizAttemptPayload {
  const itemResponses = Object.entries(session.submittedAnswers).map(
    ([qId, ans]) => {
      const qMeta = soalHidrolisisGaram.find((q) => q.id === qId);
      return {
        questionId: qId,
        conceptTag: qMeta?.konsep || 'konsep-hidrolisis-garam',
        selectedOption: ans.selectedOption,
        correctOption: qMeta?.jawabanBenar || 'B',
        isCorrect: ans.isCorrect,
        answeredAt: ans.answeredAt,
      };
    }
  );

  const correctCount = itemResponses.filter((i) => i.isCorrect).length;

  return {
    attemptId: session.attemptId,
    moduleId: 'modul-1-konsep-dasar',
    questionVersion: session.questionVersion,
    userId,
    guestSessionId: session.guestSessionId,
    score: session.score ?? Math.round((correctCount / 10) * 100),
    totalQuestions: 10,
    correctCount,
    startedAt: session.startedAt,
    completedAt: session.completedAt || new Date().toISOString(),
    itemResponses,
  };
}

/**
 * Production-ready mock implementation conforming to Bab 4 contract.
 * Ready to connect to real REST / GraphQL endpoint when backend is deployed.
 */
export class DatabaseSyncContractService implements IDatabaseSyncService {
  public readonly apiBaseUrl: string;

  constructor(apiBaseUrl: string = '/api/v1') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async login(credentials: AuthLoginRequest): Promise<AuthResponse> {
    // In guest mode, this illustrates the contract structure
    return {
      token: `jwt_token_${Date.now()}`,
      refreshToken: `refresh_token_${Date.now()}`,
      user: {
        id: 'usr_student_01',
        email: credentials.email,
        fullName: 'Siswa Kimia XI',
        role: 'student',
        classGrade: 'XI Fase F',
        schoolName: 'SMA / MA Laboratorium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  async migrateGuestSession(
    payload: GuestMigrationPayload
  ): Promise<GuestMigrationResponse> {
    return {
      success: true,
      migratedAttemptsCount: payload.attempts.length,
      syncedAttemptIds: payload.attempts.map((a) => a.attemptId),
      message: `${payload.attempts.length} riwayat kuis dari sesi guest berhasil ditautkan ke akun Anda via ${this.apiBaseUrl}.`,
    };
  }

  async syncQuizAttempt(
    payload: SyncQuizAttemptPayload
  ): Promise<SyncQuizAttemptResponse> {
    const conceptWeaknesses: string[] = [];
    const conceptStrengths: string[] = [];

    payload.itemResponses.forEach((item) => {
      if (item.isCorrect) {
        conceptStrengths.push(item.conceptTag);
      } else {
        conceptWeaknesses.push(item.conceptTag);
      }
    });

    return {
      success: true,
      attemptId: payload.attemptId,
      syncedAt: new Date().toISOString(),
      serverMasterySummary: {
        conceptStrengths: [...new Set(conceptStrengths)],
        conceptWeaknesses: [...new Set(conceptWeaknesses)],
      },
    };
  }
}

export const dbSyncService = new DatabaseSyncContractService();
