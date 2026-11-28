import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useFocusTrap } from '../hooks/useFocusTrap';
import atomMolecule from '../assets/images/atom-molecule.svg';
import {
  fetchTeacherClassSubmissions,
  calculateItemAnalysis,
  saveTeacherEssayGrading,
} from '../services/firestoreQuizService';
import { getQuestionsForAttempt } from '../data/soalHidrolisisGaram';
import { soalEsaiHidrolisisGaram } from '../data/soalEsaiHidrolisisGaram';
import './TeacherDashboard.css';

/**
 * Teacher Dashboard (Panel Guru) — The Secret of Salt
 * Comprehensive diagnostic analytics, student submissions, item analysis,
 * pedagogical follow-up, and class filter per PRD Bab 4.2 & Bab 24.
 */

export default function TeacherDashboard() {
  const { user } = useAuth();

  // Filter & View States
  const [selectedClass, setSelectedClass] = useState('all');
  const [attemptRule, setAttemptRule] = useState('latest'); // 'latest' | 'best' | 'all'
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'items'

  // Data Loading & Status States
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Single Attempt Inspection Modal States
  const [inspectingAttempt, setInspectingAttempt] = useState(null);
  const [modalTab, setModalTab] = useState('essay'); // 'essay' | 'pg'
  const [gradingScores, setGradingScores] = useState({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(null);

  // Open modal and initialize grading form states
  const handleOpenInspectModal = useCallback((sub) => {
    setInspectingAttempt(sub);
    const hasEssay = Boolean(
      sub.essayAnswers && Object.keys(sub.essayAnswers).length > 0
    );
    setModalTab(hasEssay ? 'essay' : 'pg');

    const initialScores = {};
    const initialFeedbacks = {};
    soalEsaiHidrolisisGaram.forEach((q) => {
      const existingScoreObj = sub.essayGrading?.questionScores?.[q.id];
      initialScores[q.id] =
        typeof existingScoreObj?.score === 'number' ? existingScoreObj.score : 0;
      initialFeedbacks[q.id] = existingScoreObj?.feedback || '';
    });
    setGradingScores(initialScores);
    setGradingFeedbacks(initialFeedbacks);
    setGeneralFeedback(sub.essayGrading?.feedback || '');
    setSaveSuccessNotice(null);
  }, []);

  const handleScoreChange = (qId, val) => {
    const num = Math.max(0, Math.min(20, Math.round(Number(val) || 0)));
    setGradingScores((prev) => ({
      ...prev,
      [qId]: num,
    }));
  };

  const handleQuestionFeedbackChange = (qId, val) => {
    setGradingFeedbacks((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  const handleSaveGrading = async () => {
    if (!inspectingAttempt) return;
    setSavingGrade(true);
    try {
      const totalEssayScore = Object.values(gradingScores).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0
      );
      const pgScore = inspectingAttempt.score || 0;
      const finalCompositeScore = Math.round(0.5 * pgScore + 0.5 * totalEssayScore);

      const questionScores = {};
      for (const [qId, sc] of Object.entries(gradingScores)) {
        questionScores[qId] = {
          score: sc,
          feedback: gradingFeedbacks[qId] || '',
        };
      }

      const prevHistory = inspectingAttempt.essayGrading?.history || [];
      const newEntry = {
        gradedAt: new Date().toISOString(),
        gradedBy: user?.fullName || 'Ibu Guru',
        totalEssayScore,
        questionScores,
        feedback: generalFeedback,
      };

      const payload = {
        totalEssayScore,
        questionScores,
        feedback: generalFeedback,
        finalCompositeScore,
        history: [...prevHistory, newEntry],
      };

      const res = await saveTeacherEssayGrading(
        inspectingAttempt.attemptId,
        inspectingAttempt.userId,
        payload,
        user?.fullName || 'Ibu Guru'
      );

      if (res.success) {
        const updatedAttempt = {
          ...inspectingAttempt,
          essayGrading: res.gradingRecord,
          finalCompositeScore,
        };
        setInspectingAttempt(updatedAttempt);
        setSubmissions((prev) =>
          prev.map((sub) => (sub.attemptId === updatedAttempt.attemptId ? updatedAttempt : sub))
        );
        setSaveSuccessNotice('✓ Nilai dan umpan balik esai berhasil disimpan!');
        setTimeout(() => setSaveSuccessNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error saving teacher grading:', err);
      alert('Gagal menyimpan penilaian: ' + err.message);
    } finally {
      setSavingGrade(false);
    }
  };

  // W3C ARIA focus trap for Inspection Modal (AD18-08)
  const inspectModalRef = useFocusTrap({
    isOpen: Boolean(inspectingAttempt),
    onClose: () => setInspectingAttempt(null),
    initialFocusSelector: '.teacher-modal-close',
    restoreFocus: true,
  });

  // Load submissions from Firestore or Local Cache
  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTeacherClassSubmissions(selectedClass);
      setSubmissions(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load teacher submissions:', err);
      setError('Gagal memuat daftar hasil kuis siswa dari server. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const data = await fetchTeacherClassSubmissions(selectedClass);
        if (!ignore) {
          setSubmissions(data);
          setLastUpdated(new Date());
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load teacher submissions:', err);
          setError('Gagal memuat daftar hasil kuis siswa dari server. Silakan coba beberapa saat lagi.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedClass]);

  // Aggregate Class Statistics
  const classStats = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return {
        totalReceived: 0,
        uniqueStudents: 0,
        averageScore: 0,
        passingRate: 0,
      };
    }

    const uniqueStudents = new Set(submissions.map((s) => s.userId || s.userFullName)).size;
    const totalScore = submissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avgScore = Math.round(totalScore / submissions.length);
    const passedCount = submissions.filter((s) => (s.score || 0) >= 75).length;
    const passingRate = Math.round((passedCount / submissions.length) * 100);

    return {
      totalReceived: submissions.length,
      uniqueStudents,
      averageScore: avgScore,
      passingRate,
    };
  }, [submissions]);

  // Item Analysis & Pedagogical Insight
  const itemAnalysis = useMemo(() => {
    return calculateItemAnalysis(submissions, attemptRule);
  }, [submissions, attemptRule]);

  // Strict Authorization: ONLY khoirun.nisa.2403316@students.um.ac.id
  const isAuthorizedTeacher =
    user?.email?.toLowerCase().trim() === 'khoirun.nisa.2403316@students.um.ac.id' &&
    user?.role === 'teacher';

  if (!isAuthorizedTeacher) {
    return (
      <div className="teacher-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          style={{
            maxWidth: '32rem',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            border: '1.5px solid #FECACA',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#991B1B', marginBottom: '0.75rem' }}>
            Akses Panel Guru Terkunci
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Halaman Panel Guru dikhususkan secara eksklusif untuk Guru Pengampu resmi (<strong>khoirun.nisa.2403316@students.um.ac.id</strong>). Akun Anda ({user?.email || 'Tamu'}) terdaftar sebagai Siswa dan tidak memiliki izin akses ke halaman ini.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                backgroundColor: '#0F766E',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Kembali ke Dashboard Siswa
            </Link>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                fontWeight: '700',
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Kembali ke Beranda Media
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-page">
      {/* 1. Header Banner */}
      <header className="teacher-header">
        <div className="teacher-header-inner">
          <div className="teacher-brand-group">
            <div className="teacher-logo-box">
              <img src={atomMolecule} alt="Logo Kimia" />
            </div>
            <div className="teacher-title-area">
              <h1>
                <span>Panel Pengampu Guru</span>
                <span className="teacher-badge-pill">Fase F • Kimia XI</span>
              </h1>
              <p className="teacher-subtitle">
                Pengampu: <strong>Khoirun Nisa' Rakhma, S.Pd.</strong> ({user?.email})
              </p>
            </div>
          </div>

          <div className="teacher-nav-actions">
            <Link to="/" className="teacher-btn-back">
              <span>← Beranda Media</span>
            </Link>
            <Link to="/dashboard" className="teacher-btn-back">
              <span>👤 Dashboard Belajar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Main Teacher Work Area */}
      <main className="teacher-main">
        {/* Controls, Filter & Data Status */}
        <section className="teacher-controls-card">
          <div className="teacher-filter-group">
            <label htmlFor="filter-class-select" className="teacher-select-label">
              Pilih Rombel / Kelas:
            </label>
            <select
              id="filter-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="teacher-select"
            >
              <option value="all">Semua Rombongan Belajar (Agregat)</option>
              <option value="XI-MIPA-1">Kelas XI-MIPA-1 (Fase F Kimia)</option>
              <option value="XI-MIPA-2">Kelas XI-MIPA-2 (Fase F Kimia)</option>
              <option value="XI Fase F-A">Kelas XI Fase F-A</option>
            </select>
          </div>

          <div className="teacher-meta-status">
            <span>
              <strong>Status Data:</strong>{' '}
              {loading ? (
                <span style={{ color: '#0F766E' }}>Memuat data...</span>
              ) : error ? (
                <span style={{ color: '#DC2626' }}>Gagal memuat</span>
              ) : submissions.length === 0 ? (
                <span style={{ color: '#64748B' }}>Kosong</span>
              ) : (
                <span style={{ color: '#16A34A', fontWeight: '700' }}>
                  {classStats.totalReceived} Hasil Diterima ({classStats.uniqueStudents} Siswa)
                </span>
              )}
            </span>

            {lastUpdated && (
              <span style={{ color: '#64748B' }}>
                Diperbarui: {lastUpdated.toLocaleTimeString('id-ID')} WIB
              </span>
            )}

            <button
              type="button"
              onClick={loadSubmissions}
              disabled={loading}
              className="teacher-btn-refresh"
              title="Segarkan data pengumpulan kuis dari server"
            >
              <span>🔄</span>
              <span>{loading ? 'Menyinkronkan...' : 'Segarkan Data'}</span>
            </button>
          </div>
        </section>

        {/* Global Error Notice */}
        {error && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={loadSubmissions}
              style={{
                textDecoration: 'underline',
                fontWeight: '700',
                background: 'none',
                border: 'none',
                color: '#DC2626',
                cursor: 'pointer',
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Aggregate Stats Cards */}
        <section className="teacher-stats-grid">
          <div className="teacher-stat-card">
            <p className="stat-label">Total Hasil Masuk</p>
            <p className="stat-val">{classStats.totalReceived}</p>
            <p className="stat-subtext">Dari {classStats.uniqueStudents} siswa terdata</p>
          </div>
          <div className="teacher-stat-card">
            <p className="stat-label">Rata-rata Nilai Kelas</p>
            <p className="stat-val" style={{ color: classStats.averageScore >= 75 ? '#0F766E' : '#D97706' }}>
              {classStats.averageScore}
            </p>
            <p className="stat-subtext">Skala Penilaian 0 - 100</p>
          </div>
          <div className="teacher-stat-card">
            <p className="stat-label">Ketuntasan KKTP (≥ 75)</p>
            <p className="stat-val">{classStats.passingRate}%</p>
            <p className="stat-subtext">Kriteria Ketercapaian Kurikulum Merdeka</p>
          </div>
          <div className="teacher-stat-card">
            <p className="stat-label">Butir Paling Kritis</p>
            <p className="stat-val" style={{ fontSize: '1.25rem', color: '#DC2626', paddingTop: '0.2rem' }}>
              {itemAnalysis.mostDifficultQuestion
                ? `${itemAnalysis.mostDifficultQuestion.id.toUpperCase()}`
                : '-'}
            </p>
            <p className="stat-subtext">
              {itemAnalysis.mostDifficultQuestion
                ? `Error Rate: ${itemAnalysis.mostDifficultQuestion.errorRate}%`
                : 'Belum ada data'}
            </p>
          </div>
        </section>

        {/* 4. Tindak Lanjut Pembelajaran (Pedagogical Insights) */}
        {itemAnalysis.pedagogicalInsight && (
          <section className="teacher-insight-card">
            <div className="teacher-insight-header">
              <span>💡</span>
              <span>Tindak Lanjut & Interpretasi Pembelajaran Guru</span>
            </div>
            <p className="teacher-insight-desc">
              {itemAnalysis.pedagogicalInsight.conceptInterpretation}
            </p>
            <div className="teacher-insight-action-box">
              <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#0F766E', fontWeight: '800', marginBottom: '0.2rem' }}>
                Rekomendasi Satu Kegiatan Belajar Berikutnya:
              </span>
              <span>{itemAnalysis.pedagogicalInsight.nextLearningActivity}</span>
            </div>
          </section>
        )}

        {/* 5. Navigation Tabs (Daftar Pengumpulan vs Rekap Analisis Butir) */}
        <div className="teacher-tabs-strip">
          <button
            type="button"
            className={`teacher-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            📋 Daftar Hasil Diterima ({submissions.length})
          </button>
          <button
            type="button"
            className={`teacher-tab-btn ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            📊 Rekap Analisis Butir & Frekuensi (10 Butir)
          </button>
        </div>

        {/* TAB 1: Daftar Hasil Diterima */}
        {activeTab === 'submissions' && (
          <section className="teacher-table-card">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                <p>Sedang memuat data pengumpulan kuis siswa...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                <h4 style={{ color: '#1E293B', fontWeight: '700', marginBottom: '0.25rem' }}>Belum Ada Hasil Diterima</h4>
                <p style={{ fontSize: '0.875rem' }}>
                  Belum ada siswa pada rombel {selectedClass} yang menyelesaikan kuis modul ini.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Alias / Siswa</th>
                      <th>Kelas</th>
                      <th>Jenis Percobaan</th>
                      <th>Skor PG</th>
                      <th>Status Esai</th>
                      <th>Nilai Akhir</th>
                      <th>Waktu Server / Diterima</th>
                      <th style={{ textAlign: 'center' }}>Aksi Evaluasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => {
                      const scoreClass =
                        sub.score >= 75 ? 'high' : sub.score >= 60 ? 'medium' : 'low';
                      const formattedDate = sub.serverReceivedAt || sub.completedAt
                        ? new Date(sub.serverReceivedAt || sub.completedAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-';

                      const hasEssay = Boolean(
                        sub.essayAnswers && Object.keys(sub.essayAnswers).length > 0
                      );
                      const isGraded = sub.essayGrading?.status === 'graded';
                      const composite =
                        typeof sub.finalCompositeScore === 'number'
                          ? sub.finalCompositeScore
                          : isGraded && sub.essayGrading
                          ? Math.round(
                              0.5 * (sub.score || 0) + 0.5 * (sub.essayGrading.totalEssayScore || 0)
                            )
                          : null;

                      return (
                        <tr key={sub.attemptId}>
                          <td>
                            <div className="student-name-cell">
                              <div className="student-avatar-pill">
                                {(sub.userFullName || 'S')[0].toUpperCase()}
                              </div>
                              <div>
                                <span>{sub.userFullName || 'Siswa Tanpa Nama'}</span>
                                {sub.userId && (
                                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8' }}>
                                    ID: {sub.userId.substring(0, 10)}...
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: '600', color: '#475569' }}>
                              {sub.classGrade || 'XI-MIPA-1'}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '0.35rem',
                                fontSize: '0.725rem',
                                fontWeight: '700',
                                backgroundColor: sub.attemptType?.includes('Remedial')
                                  ? '#FEF3C7'
                                  : '#F1F5F9',
                                color: sub.attemptType?.includes('Remedial') ? '#B45309' : '#475569',
                              }}
                            >
                              {sub.attemptType || 'Percobaan Siswa'}
                            </span>
                          </td>
                          <td>
                            <span className={`score-badge ${scoreClass}`}>
                              {sub.score} / 100
                            </span>
                          </td>
                          <td>
                            {!hasEssay ? (
                              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                                Hanya PG
                              </span>
                            ) : isGraded && sub.essayGrading ? (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  color: '#16A34A',
                                  backgroundColor: '#DCFCE7',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '0.35rem',
                                }}
                              >
                                ✓ Dinilai ({sub.essayGrading.totalEssayScore}/100)
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  color: '#D97706',
                                  backgroundColor: '#FEF3C7',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '0.35rem',
                                }}
                              >
                                ⏳ Perlu Dinilai
                              </span>
                            )}
                          </td>
                          <td>
                            {composite !== null ? (
                              <strong
                                style={{
                                  fontSize: '0.9rem',
                                  color: composite >= 75 ? '#16A34A' : '#DC2626',
                                }}
                              >
                                {composite}
                              </strong>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>-</span>
                            )}
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              {formattedDate} WIB
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn-detail-action"
                              onClick={() => handleOpenInspectModal(sub)}
                              title="Periksa lembar jawaban, berikan nilai esai, dan umpan balik"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                              }}
                            >
                              <span>{hasEssay ? '✏️ Periksa & Nilai' : '🔍 Detail PG'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Rekap Per Butir & Frekuensi Pilihan */}
        {activeTab === 'items' && (
          <section className="item-analysis-card">
            {/* Rule Selector */}
            <div className="item-rule-bar">
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#134E4A', margin: '0 0 0.25rem 0' }}>
                  Rekapitulasi Butir Soal & Sebaran Pilihan
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                  Dievaluasi dari {itemAnalysis.evaluatedAttemptsCount} percobaan ({itemAnalysis.uniqueStudentsCount} siswa unik)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569' }}>
                  Aturan Percobaan Siswa:
                </span>
                <div className="item-rule-buttons">
                  <button
                    type="button"
                    className={`item-rule-btn ${attemptRule === 'latest' ? 'active' : ''}`}
                    onClick={() => setAttemptRule('latest')}
                    title="Hanya mengambil percobaan kuis paling mutakhir per siswa"
                  >
                    Percobaan Terakhir
                  </button>
                  <button
                    type="button"
                    className={`item-rule-btn ${attemptRule === 'best' ? 'active' : ''}`}
                    onClick={() => setAttemptRule('best')}
                    title="Mengambil skor tertinggi per siswa"
                  >
                    Skor Terbaik
                  </button>
                  <button
                    type="button"
                    className={`item-rule-btn ${attemptRule === 'all' ? 'active' : ''}`}
                    onClick={() => setAttemptRule('all')}
                    title="Menghitung semua riwayat percobaan kuis"
                  >
                    Semua Percobaan
                  </button>
                </div>
              </div>
            </div>

            {/* Item Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="teacher-table">
                <thead>
                  <tr>
                    <th style={{ width: '4%' }}>No</th>
                    <th style={{ width: '12%' }}>Kode & Konsep</th>
                    <th style={{ width: '38%' }}>Frekuensi Pilihan (A / B / C / D)</th>
                    <th style={{ width: '15%' }}>Kunci Jawaban</th>
                    <th style={{ width: '15%' }}>Ketuntasan (Benar / Salah)</th>
                    <th style={{ width: '16%' }}>Tingkat Kesulitan</th>
                  </tr>
                </thead>
                <tbody>
                  {itemAnalysis.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>📭</div>
                        <strong style={{ color: '#1E293B' }}>Belum Ada Data Pengumpulan Kuis Asli</strong>
                        <p style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>
                          Analisis butir soal dan sebaran frekuensi pilihan akan otomatis dihitung setelah responden siswa menyelesaikan kuis formatif.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    itemAnalysis.items.map((item) => {
                      const diffBadgeColor =
                        item.difficulty === 'Mudah'
                          ? '#16A34A'
                          : item.difficulty === 'Sedang'
                          ? '#D97706'
                          : '#DC2626';

                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: '800', textAlign: 'center' }}>{item.index}</td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#0F766E' }}>
                              {item.id}
                            </span>
                            <span style={{ display: 'block', fontSize: '0.725rem', color: '#64748B' }}>
                              {item.konsep}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                                const isKey = opt === item.jawabanBenar;
                                const isDistractorHigh =
                                  !isKey && item.mostPickedDistractor === opt && item.frequencies[opt].count > 0;
                                let pillClass = isKey ? 'freq-pill key' : 'freq-pill distractor';
                                if (isDistractorHigh) pillClass = 'freq-pill distractor-high';

                                return (
                                  <span key={opt} className={pillClass} title={`Opsi ${opt}: ${item.frequencies[opt].count} siswa`}>
                                    <strong>{opt}:</strong> {item.frequencies[opt].percentage}%
                                    {isKey && ' ✓'}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '0.35rem' }}>
                              Opsi {item.jawabanBenar}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem' }}>
                              <span style={{ color: '#16A34A', fontWeight: '700' }}>{item.correctCount} Benar</span>
                              {' / '}
                              <span style={{ color: '#DC2626' }}>{item.wrongCount} Salah</span>
                              <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B' }}>
                                ({item.correctPercentage}% Tuntas)
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '9999px',
                                fontSize: '0.725rem',
                                fontWeight: '800',
                                color: diffBadgeColor,
                                border: `1px solid ${diffBadgeColor}`,
                                backgroundColor: '#FFFFFF',
                              }}
                            >
                              {item.difficulty}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* 6. Inspection Modal (Rincian Satu Percobaan Siswa & Penilaian Esai) */}
      {inspectingAttempt && (() => {
        const hasEssay = Boolean(
          inspectingAttempt.essayAnswers && Object.keys(inspectingAttempt.essayAnswers).length > 0
        );
        const currentTotalEssay = Object.values(gradingScores).reduce(
          (acc, val) => acc + (Number(val) || 0),
          0
        );
        const currentComposite = Math.round(
          0.5 * (inspectingAttempt.score || 0) + 0.5 * currentTotalEssay
        );
        const isGraded = inspectingAttempt.essayGrading?.status === 'graded';

        return (
          <div className="teacher-modal-backdrop" onClick={() => setInspectingAttempt(null)}>
            <div
              ref={inspectModalRef}
              className="teacher-modal-dialog"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="attempt-modal-title"
              tabIndex={-1}
              style={{ maxWidth: '850px' }}
            >
              <div className="teacher-modal-header">
                <div>
                  <h3 id="attempt-modal-title">
                    Lembar Kerja: {inspectingAttempt.userFullName || 'Siswa'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#CCFBF1' }}>
                    {inspectingAttempt.classGrade || 'XI-MIPA-1'} • Skor PG: {inspectingAttempt.score}/100 •{' '}
                    Skor Esai:{' '}
                    {isGraded ? `${inspectingAttempt.essayGrading.totalEssayScore}/100` : 'Menunggu Penilaian'} •{' '}
                    Nilai Akhir Terpadu:{' '}
                    {inspectingAttempt.finalCompositeScore ?? (isGraded ? currentComposite : '-')}/100
                  </span>
                </div>
                <button
                  type="button"
                  className="teacher-modal-close"
                  onClick={() => setInspectingAttempt(null)}
                  aria-label="Tutup lembar rincian"
                >
                  ✕
                </button>
              </div>

              <div className="teacher-modal-body">
                {/* Save Success Notice */}
                {saveSuccessNotice && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                      color: '#166534',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                    }}
                  >
                    {saveSuccessNotice}
                  </div>
                )}

                {/* Sub-Tabs: Quiz Esai vs Pilihan Ganda */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    borderBottom: '2px solid #E2E8F0',
                    paddingBottom: '0.5rem',
                  }}
                >
                  {hasEssay && (
                    <button
                      type="button"
                      onClick={() => setModalTab('essay')}
                      style={{
                        padding: '0.55rem 1.15rem',
                        borderRadius: '0.5rem',
                        border: modalTab === 'essay' ? '2px solid #0F766E' : '1px solid #CBD5E1',
                        backgroundColor: modalTab === 'essay' ? '#F0FDFA' : '#FFFFFF',
                        color: modalTab === 'essay' ? '#0F766E' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span>✍️</span>
                      <span>Penilaian Quiz Esai (5 Soal)</span>
                      {isGraded ? (
                        <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 900 }}>✓ Dinilai</span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 900 }}>⏳ Perlu Nilai</span>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setModalTab('pg')}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: '0.5rem',
                      border: modalTab === 'pg' ? '2px solid #0F766E' : '1px solid #CBD5E1',
                      backgroundColor: modalTab === 'pg' ? '#F0FDFA' : '#FFFFFF',
                      color: modalTab === 'pg' ? '#0F766E' : '#64748B',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>📝</span>
                    <span>Rincian Pilihan Ganda (10 Soal)</span>
                  </button>
                </div>

                {/* TAB 1: PENILAIAN QUIZ ESAI */}
                {modalTab === 'essay' && hasEssay && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Live Score Summary Banner */}
                    <div
                      style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                          Kalkulasi Nilai Terpadu:
                        </span>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '0.2rem' }}>
                          Nilai Akhir: <span style={{ color: '#0F766E', fontSize: '1.2rem' }}>{currentComposite}</span> / 100
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          (50% PG: {inspectingAttempt.score || 0} pt) + (50% Esai: {currentTotalEssay} pt)
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            textAlign: 'right',
                          }}
                        >
                          <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Total Skor Esai</span>
                          <strong style={{ fontSize: '1.15rem', color: '#0F766E' }}>{currentTotalEssay}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}> / 100</span>
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveGrading}
                          disabled={savingGrade}
                          style={{
                            padding: '0.65rem 1.25rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            backgroundColor: '#0F766E',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(15, 118, 110, 0.25)',
                          }}
                        >
                          {savingGrade ? 'Menyimpan...' : '💾 Simpan Penilaian'}
                        </button>
                      </div>
                    </div>

                    {/* 5 Essay Questions */}
                    {soalEsaiHidrolisisGaram.map((q, idx) => {
                      const studentAnswer = inspectingAttempt.essayAnswers?.[q.id] || '';
                      const currentScore = gradingScores[q.id] ?? 0;
                      const currentFeedback = gradingFeedbacks[q.id] || '';

                      return (
                        <div
                          key={q.id}
                          style={{
                            padding: '1.25rem',
                            borderRadius: '0.875rem',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F766E', backgroundColor: '#CCFBF1', padding: '0.2rem 0.5rem', borderRadius: '0.35rem' }}>
                                Soal No. {idx + 1}
                              </span>
                              <h4 style={{ margin: '0.35rem 0 0 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                                {q.judul}
                              </h4>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '0.35rem' }}>
                              Maksimal {q.maxScore} Poin
                            </span>
                          </div>

                          {/* Pertanyaan */}
                          <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem' }}>
                            <strong>Pertanyaan:</strong>
                            <div style={{ marginTop: '0.25rem' }}>{q.pertanyaan}</div>
                          </div>

                          {/* Jawaban Siswa */}
                          <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#FFFDF5', border: '1px solid #FDE68A' }}>
                            <strong style={{ fontSize: '0.8rem', color: '#92400E', display: 'block', marginBottom: '0.35rem' }}>
                              ✍️ Jawaban Siswa ({inspectingAttempt.userFullName || 'Siswa'}):
                            </strong>
                            <div style={{ fontSize: '0.875rem', color: '#1E293B', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                              {studentAnswer.trim() ? studentAnswer : <em style={{ color: '#DC2626' }}>(Siswa tidak mengisi jawaban untuk nomor ini)</em>}
                            </div>
                          </div>

                          {/* Kunci Jawaban Resmi */}
                          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC' }}>
                            <strong style={{ fontSize: '0.8rem', color: '#166534', display: 'block', marginBottom: '0.25rem' }}>
                              🔑 Kunci Jawaban Resmi:
                            </strong>
                            <div style={{ fontSize: '0.825rem', color: '#14532D', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                              {q.kunciJawaban}
                            </div>
                          </div>

                          {/* Rubrik Penilaian */}
                          <div style={{ padding: '0.65rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', fontSize: '0.775rem', color: '#475569' }}>
                            <strong style={{ color: '#0F766E', display: 'block', marginBottom: '0.2rem' }}>
                              📋 Panduan Rubrik:
                            </strong>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                              {q.rubrik.map((r, rIdx) => (
                                <li key={rIdx}>
                                  <strong>{r.deskripsi}</strong>: {r.poin} poin
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Input Nilai & Feedback per Nomor */}
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.25rem', backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <label htmlFor={`score-input-${q.id}`} style={{ fontSize: '0.825rem', fontWeight: 800, color: '#1E293B' }}>
                                Nilai (0 – {q.maxScore}):
                              </label>
                              <input
                                id={`score-input-${q.id}`}
                                type="number"
                                min={0}
                                max={q.maxScore}
                                value={currentScore}
                                onChange={(e) => handleScoreChange(q.id, e.target.value)}
                                style={{
                                  width: '70px',
                                  padding: '0.4rem 0.5rem',
                                  borderRadius: '0.35rem',
                                  border: '2px solid #0F766E',
                                  fontWeight: 800,
                                  fontSize: '0.95rem',
                                  textAlign: 'center',
                                  color: '#0F766E',
                                  backgroundColor: '#FFFFFF',
                                }}
                              />
                              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>/ {q.maxScore} pt</span>
                            </div>

                            <div style={{ flex: 1, minWidth: '220px' }}>
                              <input
                                type="text"
                                placeholder="Catatan koreksi untuk butir ini (opsional)..."
                                value={currentFeedback}
                                onChange={(e) => handleQuestionFeedbackChange(q.id, e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem 0.65rem',
                                  borderRadius: '0.35rem',
                                  border: '1px solid #CBD5E1',
                                  fontSize: '0.8rem',
                                  boxSizing: 'border-box',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Catatan / Feedback Umum Guru */}
                    <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '0.75rem' }}>
                      <label htmlFor="general-feedback-input" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', display: 'block', marginBottom: '0.35rem' }}>
                        💬 Catatan & Umpan Balik Guru Secara Keseluruhan:
                      </label>
                      <textarea
                        id="general-feedback-input"
                        rows={3}
                        value={generalFeedback}
                        onChange={(e) => setGeneralFeedback(e.target.value)}
                        placeholder="Berikan arahan evaluasi, saran perbaikan, atau penguatan konsep untuk siswa ini..."
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* History Penilaian Sebelumnya (Audit Log) */}
                    {inspectingAttempt.essayGrading?.history && inspectingAttempt.essayGrading.history.length > 0 && (
                      <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#64748B' }}>
                        <strong>Riwayat Perubahan Penilaian:</strong>
                        <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem' }}>
                          {inspectingAttempt.essayGrading.history.map((h, hIdx) => (
                            <li key={hIdx}>
                              {new Date(h.gradedAt).toLocaleString('id-ID')} WIB oleh {h.gradedBy || 'Guru'} • Skor Esai: {h.totalEssayScore}/100
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Bottom Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setInspectingAttempt(null)}
                        style={{
                          padding: '0.65rem 1.25rem',
                          borderRadius: '0.75rem',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          color: '#475569',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                        }}
                      >
                        Tutup
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveGrading}
                        disabled={savingGrade}
                        style={{
                          padding: '0.65rem 1.5rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          backgroundColor: '#0F766E',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 4px 10px rgba(15, 118, 110, 0.25)',
                        }}
                      >
                        <span>💾</span>
                        <span>{savingGrade ? 'Menyimpan...' : 'Simpan Penilaian Esai'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: RINCIAN PILIHAN GANDA */}
                {(modalTab === 'pg' || !hasEssay) && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '0.75rem',
                        marginBottom: '1rem',
                        fontSize: '0.8rem',
                        color: '#475569',
                      }}
                    >
                      <span>
                        <strong>ID Percobaan:</strong> {inspectingAttempt.attemptId}
                      </span>
                      <span>
                        <strong>Versi Soal:</strong> v{inspectingAttempt.questionVersion || '1.0.0'}
                        {Array.isArray(inspectingAttempt.questionSnapshot) && inspectingAttempt.questionSnapshot.length > 0 && (
                          <span style={{ marginLeft: 6, fontSize: '0.725rem', color: '#0D9488', fontWeight: 600 }}>
                            (Snapshot Tersimpan)
                          </span>
                        )}
                      </span>
                      <span>
                        <strong>Jawaban Benar:</strong> {inspectingAttempt.correctCount} dari 10 soal
                      </span>
                    </div>

                    {getQuestionsForAttempt(inspectingAttempt).map((q, idx) => {
                      const answer = inspectingAttempt.answers?.[q.id];
                      const selectedOpt = answer?.selectedOption || '-';
                      const isCorrect = Boolean(answer?.isCorrect);
                      const selectedOptionObj = q.opsi?.find((o) => o.id === selectedOpt);
                      const correctOptionObj = q.opsi?.find((o) => o.id === q.jawabanBenar);

                      return (
                        <div
                          key={q.id}
                          className={`attempt-question-card ${isCorrect ? 'correct' : 'wrong'}`}
                        >
                          <div className="attempt-q-header">
                            <span style={{ fontWeight: '800', fontSize: '0.825rem', color: '#134E4A' }}>
                              Soal No. {idx + 1} ({q.id})
                            </span>
                            <span
                              style={{
                                fontWeight: '800',
                                fontSize: '0.75rem',
                                color: isCorrect ? '#16A34A' : '#DC2626',
                                backgroundColor: isCorrect ? '#DCFCE7' : '#FEE2E2',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '0.35rem',
                              }}
                            >
                              {isCorrect ? '✓ Benar (+10)' : '✕ Salah (0)'}
                            </span>
                          </div>

                          <p className="attempt-q-text">{q.pertanyaan}</p>

                          <div className="attempt-answer-box">
                            <div>
                              <strong style={{ color: isCorrect ? '#166534' : '#DC2626' }}>
                                Jawaban Siswa:{' '}
                              </strong>
                              <span>
                                Opsi {selectedOpt}: {selectedOptionObj?.teks || 'Tidak Menjawab'}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div>
                                <strong style={{ color: '#166534' }}>Kunci yang Benar: </strong>
                                <span>
                                  Opsi {q.jawabanBenar}: {correctOptionObj?.teks || '-'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="attempt-explanation-box">
                            <strong>Pembahasan Konsep: </strong>
                            <span>{q.pembahasan}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
