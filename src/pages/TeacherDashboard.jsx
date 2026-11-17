import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import atomMolecule from '../assets/images/atom-molecule.svg';
import {
  fetchTeacherClassSubmissions,
  calculateItemAnalysis,
} from '../services/firestoreQuizService';
import { soalHidrolisisGaram } from '../data/soalHidrolisisGaram';
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

  // Single Attempt Inspection Modal
  const [inspectingAttempt, setInspectingAttempt] = useState(null);

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
                      <th>Aktivitas</th>
                      <th>Jenis Percobaan</th>
                      <th>Versi Soal</th>
                      <th>Skor</th>
                      <th>Waktu Server / Diterima</th>
                      <th style={{ textAlign: 'center' }}>Rincian Jawaban</th>
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
                            <span style={{ fontSize: '0.825rem' }}>
                              {sub.activityName || 'Kuis Formatif Modul 1'}
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
                                backgroundColor: sub.attemptType?.includes('Remedial') ? '#FEF3C7' : '#F1F5F9',
                                color: sub.attemptType?.includes('Remedial') ? '#B45309' : '#475569',
                              }}
                            >
                              {sub.attemptType || 'Percobaan Siswa'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>
                              v{sub.questionVersion || '1.0.0'}
                            </span>
                          </td>
                          <td>
                            <span className={`score-badge ${scoreClass}`}>
                              {sub.score} / 100
                            </span>
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
                              onClick={() => setInspectingAttempt(sub)}
                              title="Lihat lembar jawaban asli dan pembahasan per butir"
                            >
                              Detail Jawaban
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
                  {itemAnalysis.items.map((item) => {
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
                            {['A', 'B', 'C', 'D'].map((opt) => {
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
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* 6. Inspection Modal (Rincian Satu Percobaan Siswa) */}
      {inspectingAttempt && (
        <div className="teacher-modal-backdrop" onClick={() => setInspectingAttempt(null)}>
          <div
            className="teacher-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="attempt-modal-title"
          >
            <div className="teacher-modal-header">
              <div>
                <h3 id="attempt-modal-title">
                  Lembar Kerja: {inspectingAttempt.userFullName || 'Siswa'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#CCFBF1' }}>
                  {inspectingAttempt.classGrade || 'XI-MIPA-1'} • Skor: {inspectingAttempt.score}/100 •{' '}
                  {inspectingAttempt.attemptType || 'Percobaan Siswa'}
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
                </span>
                <span>
                  <strong>Jawaban Benar:</strong> {inspectingAttempt.correctCount} dari 10 soal
                </span>
              </div>

              {soalHidrolisisGaram.map((q, idx) => {
                const answer = inspectingAttempt.answers?.[q.id];
                const selectedOpt = answer?.selectedOption || '-';
                const isCorrect = Boolean(answer?.isCorrect);
                const selectedOptionObj = q.opsi.find((o) => o.id === selectedOpt);
                const correctOptionObj = q.opsi.find((o) => o.id === q.jawabanBenar);

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
          </div>
        </div>
      )}
    </div>
  );
}
