import React, { useState } from 'react';
import {
  soalEsaiHidrolisisGaram,
  type EssayQuestionData,
} from '../../data/soalEsaiHidrolisisGaram';
import './QuizEsaiSection.css';

interface QuizEsaiSectionProps {
  essayQuestions?: EssayQuestionData[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, text: string) => void;
  onSubmitAll: () => void;
  onBackToPg: () => void;
  isSubmitting?: boolean;
}

export const QuizEsaiSection: React.FC<QuizEsaiSectionProps> = ({
  essayQuestions = soalEsaiHidrolisisGaram,
  answers,
  onAnswerChange,
  onSubmitAll,
  onBackToPg,
  isSubmitting = false,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentQ = essayQuestions[currentIdx] || essayQuestions[0];
  const currentText = answers[currentQ.id] || '';

  // Calculate answer progress
  const answeredCount = essayQuestions.filter((q) => (answers[q.id] || '').trim().length > 0).length;
  const isAllAnswered = answeredCount === essayQuestions.length;

  const handleNext = () => {
    if (currentIdx < essayQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerChange(currentQ.id, e.target.value);
  };

  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
  const charCount = currentText.length;

  return (
    <div className="quiz-esai-wrapper" id="bagian-esai">
      {/* 1. Header Banner */}
      <div className="quiz-esai-header">
        <div className="quiz-esai-pill">
          <span>✍️</span>
          <span>Bagian 2 dari 2: Evaluasi Esai</span>
        </div>
        <h2 className="quiz-esai-title">Quiz Esai: Penalaran & Konsep Hidrolisis Garam</h2>
        <p className="quiz-esai-subtitle">
          Tuliskan penjelasan ilmiah dan langkah perhitungan Anda secara runut pada kolom yang disediakan.
          Setiap butir soal bernilai maksimal 20 poin (Total 100 poin). Penilaian akhir akan dievaluasi oleh Guru.
        </p>
        <div className="quiz-esai-meta-row">
          <span className="quiz-esai-meta-tag">
            <span>📝</span>
            <span>5 Butir Soal Teruji</span>
          </span>
          <span className="quiz-esai-meta-tag">
            <span>⚖️</span>
            <span>Bobot 50% Nilai Akhir</span>
          </span>
          <span className="quiz-esai-meta-tag">
            <span>🎯</span>
            <span>Progres Terisi: {answeredCount} dari {essayQuestions.length} Soal</span>
          </span>
        </div>
      </div>

      {/* 2. Question Switcher Tabs */}
      <div className="quiz-esai-nav-tabs" role="tablist" aria-label="Navigasi Butir Soal Esai">
        {essayQuestions.map((q, idx) => {
          const isFilled = (answers[q.id] || '').trim().length > 0;
          const isActive = idx === currentIdx;
          return (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`quiz-esai-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentIdx(idx)}
            >
              <span>Soal {idx + 1}</span>
              <span className={`quiz-esai-tab-badge ${isFilled ? 'filled' : ''}`}>
                {isFilled ? '✓ Terisi' : 'Kosong'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Question Card */}
      <div className="quiz-esai-card">
        <div className="quiz-esai-card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="quiz-esai-badge-nomor">Nomor {currentIdx + 1} dari {essayQuestions.length}</span>
              <span className="quiz-esai-badge-bobot">Maksimal 20 Poin</span>
            </div>
            <h3 className="quiz-esai-question-title">{currentQ.judul}</h3>
          </div>
          <span className="quiz-esai-concept">
            <span>🔬</span>
            <span>{currentQ.konsep}</span>
          </span>
        </div>

        {/* Question Text */}
        <div className="quiz-esai-question-text" id={`esai-question-text-${currentQ.id}`}>
          {currentQ.pertanyaan}
        </div>

        {/* Rubric Guidance Box */}
        <div className="quiz-esai-rubric-box">
          <div className="quiz-esai-rubric-title">
            <span>📋</span>
            <span>Panduan Rubrik Penilaian Guru (Total: {currentQ.maxScore} Poin):</span>
          </div>
          <ul className="quiz-esai-rubric-list">
            {currentQ.rubrik.map((r, rIdx) => (
              <li key={rIdx}>
                <strong>{r.deskripsi}</strong>: {r.poin} poin
              </li>
            ))}
          </ul>
        </div>

        {/* Textarea Input */}
        <div className="quiz-esai-input-container">
          <div className="quiz-esai-textarea-label">
            <label htmlFor={`esai-textarea-${currentQ.id}`}>
              Kolom Jawaban Anda:
            </label>
            <span style={{ fontSize: '0.75rem', color: currentText.trim() ? '#0D9488' : '#94A3B8' }}>
              {currentText.trim() ? '💾 Draft tersimpan otomatis' : 'Belum diisi'}
            </span>
          </div>

          <textarea
            id={`esai-textarea-${currentQ.id}`}
            className="quiz-esai-textarea"
            placeholder="Tuliskan jawaban Anda secara rinci, terstruktur, dan sertakan alasan ilmiah atau langkah perhitungan di sini..."
            value={currentText}
            onChange={handleTextChange}
            rows={8}
            aria-describedby={`esai-question-text-${currentQ.id}`}
          />

          <div className="quiz-esai-counter-row">
            <span>{wordCount} kata • {charCount} karakter</span>
            <span>Penilaian manual oleh Guru</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="quiz-esai-actions">
          <button
            type="button"
            className="quiz-esai-btn-secondary"
            onClick={onBackToPg}
            title="Tinjau kembali jawaban 10 soal pilihan ganda"
          >
            <span>←</span>
            <span>Tinjau Pilihan Ganda</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {currentIdx > 0 && (
              <button
                type="button"
                className="quiz-esai-btn-secondary"
                onClick={handlePrev}
              >
                <span>← Soal Sebelumnya</span>
              </button>
            )}

            {currentIdx < essayQuestions.length - 1 ? (
              <button
                type="button"
                className="quiz-esai-btn-primary"
                onClick={handleNext}
              >
                <span>Soal Selanjutnya →</span>
              </button>
            ) : (
              <button
                type="button"
                className="quiz-esai-btn-submit-all"
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting}
              >
                <span>🚀</span>
                <span>{isSubmitting ? 'Mengirim Jawaban...' : 'Kirim Semua Jawaban'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="quiz-esai-modal-backdrop"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="quiz-esai-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-confirm-title"
          >
            <div className="quiz-esai-modal-header">
              <div className="quiz-esai-modal-icon">
                <span>⚠️</span>
              </div>
              <h4 id="modal-confirm-title" className="quiz-esai-modal-title">
                Konfirmasi Pengiriman Evaluasi
              </h4>
            </div>

            <div className="quiz-esai-modal-body">
              <p style={{ margin: '0 0 0.5rem 0' }}>
                Apakah Anda yakin ingin mengirim semua jawaban evaluasi sekarang?
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: '#475569' }}>
                <li>10 Soal Pilihan Ganda telah selesai dikerjakan.</li>
                <li>
                  {answeredCount} dari {essayQuestions.length} Soal Esai telah Anda isi.
                  {!isAllAnswered && (
                    <strong style={{ color: '#DC2626', display: 'block', marginTop: '0.25rem' }}>
                      Peringatan: Terdapat {essayQuestions.length - answeredCount} soal esai yang masih kosong!
                    </strong>
                  )}
                </li>
                <li>Setelah dikirim, seluruh jawaban pilihan ganda dan esai akan dibekukan untuk penilaian.</li>
              </ul>
            </div>

            <div className="quiz-esai-modal-actions">
              <button
                type="button"
                className="quiz-esai-btn-secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                className="quiz-esai-btn-submit-all"
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitAll();
                }}
                disabled={isSubmitting}
              >
                <span>Ya, Kirim Semua Jawaban</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
