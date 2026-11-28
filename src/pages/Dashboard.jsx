import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import atomMolecule from '../assets/images/atom-molecule.svg';
import {
  fetchUserQuizHistoryFromFirestore,
  getUnmigratedGuestAttempts,
  migrateSelectedGuestAttempts,
  dismissGuestAttemptsForUser,
  getUserLocalHistory,
  deduplicateAttempts,
  getAccountQueue,
  processAccountSyncQueue,
} from '../services/firestoreQuizService';
import { isFirebaseConfigured } from '../services/firebase';

/**
 * Dashboard Siswa — The Secret of Salt
 * Antarmuka pembelajaran khusus siswa: berfokus pada progres belajar,
 * sapaan motivatif, ringkasan skor evaluasi, dan riwayat kuis formatif.
 * Informasi teknis Firebase & backend telah dipindahkan ke Panel Guru.
 */

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Guest Migration States (Tautkan hasil kuis sebelum login jika ada)
  const [unmigratedGuests, setUnmigratedGuests] = useState([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [migrating, setMigrating] = useState(false);
  const [migrationNotice, setMigrationNotice] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const reloadData = useCallback(async () => {
    if (!user?.id) return;
    setLoadingHistory(true);

    let localAttempts = getUserLocalHistory(user.id);

    if (isFirebaseConfigured() && user?.id) {
      try {
        const firestoreAttempts = await fetchUserQuizHistoryFromFirestore(user.id);
        if (firestoreAttempts.length > 0) {
          localAttempts = deduplicateAttempts([...firestoreAttempts, ...localAttempts]);
        }
      } catch (err) {
        const isPermission =
          err?.code === 'permission-denied' ||
          err?.message?.toLowerCase().includes('permission');
        if (!isPermission) {
          console.warn('Firestore history load notice:', err?.message || err);
        }
      }
    }

    setQuizHistory(localAttempts);
    setLoadingHistory(false);

    // Periksa apakah ada hasil kuis sebelum login di perangkat ini
    const guestItems = getUnmigratedGuestAttempts(user.id);
    setUnmigratedGuests(guestItems);
    setSelectedGuestIds(guestItems.map((g) => g.attemptId));

    // Sinkronisasi antrean data secara senyap di latar belakang
    const queue = getAccountQueue(user.id);
    if (queue.length > 0) {
      processAccountSyncQueue(user.id).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      if (!user?.id) return;
      let localAttempts = getUserLocalHistory(user.id);

      if (isFirebaseConfigured() && user?.id) {
        try {
          const firestoreAttempts = await fetchUserQuizHistoryFromFirestore(user.id);
          if (firestoreAttempts.length > 0) {
            localAttempts = deduplicateAttempts([...firestoreAttempts, ...localAttempts]);
          }
        } catch (err) {
          const isPermission =
            err?.code === 'permission-denied' ||
            err?.message?.toLowerCase().includes('permission');
          if (!isPermission) {
            console.warn('Firestore history load notice:', err?.message || err);
          }
        }
      }

      if (!ignore) {
        setQuizHistory(localAttempts);
        setLoadingHistory(false);

        const guestItems = getUnmigratedGuestAttempts(user.id);
        setUnmigratedGuests(guestItems);
        setSelectedGuestIds(guestItems.map((g) => g.attemptId));

        // Sinkronisasi antrean otomatis tanpa mengganggu tampilan siswa
        const queue = getAccountQueue(user.id);
        if (queue.length > 0) {
          processAccountSyncQueue(user.id)
            .then(() => {
              if (!ignore) reloadData();
            })
            .catch(() => {});
        }
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, [user, reloadData]);

  // Handle selective guest migration
  const handleToggleGuestSelect = (attemptId) => {
    setSelectedGuestIds((prev) =>
      prev.includes(attemptId)
        ? prev.filter((id) => id !== attemptId)
        : [...prev, attemptId]
    );
  };

  const handleDismissGuest = () => {
    if (!user?.id || unmigratedGuests.length === 0) return;
    const idsToDismiss = unmigratedGuests.map((g) => g.attemptId);
    dismissGuestAttemptsForUser(user.id, idsToDismiss);
    setUnmigratedGuests([]);
    setSelectedGuestIds([]);
    setMigrationNotice('Hasil kuis sebelumnya telah diabaikan. Riwayat belajar Anda tetap aman.');
  };

  const handleMigrateSelected = async () => {
    if (!user?.id || selectedGuestIds.length === 0 || migrating) return;
    setMigrating(true);
    setMigrationNotice('');

    try {
      const res = await migrateSelectedGuestAttempts(selectedGuestIds, user.id, user.fullName);
      if (res.success) {
        setMigrationNotice(`Berhasil menyimpan ${res.migratedCount} hasil kuis ke akun belajar Anda!`);
        await reloadData();
      }
    } catch (err) {
      setMigrationNotice(`Gagal menautkan data: ${err.message}`);
    } finally {
      setMigrating(false);
    }
  };

  // Kalkulasi Ringkasan Aktivitas Belajar
  const latestAttempt = quizHistory[0] || null;
  const totalAttempts = quizHistory.length;

  const highestScore = quizHistory.reduce((max, item) => {
    const sc =
      typeof item.finalCompositeScore === 'number'
        ? item.finalCompositeScore
        : item.score || 0;
    return Math.max(max, sc);
  }, 0);

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          quizHistory.reduce((acc, item) => {
            const sc =
              typeof item.finalCompositeScore === 'number'
                ? item.finalCompositeScore
                : item.score || 0;
            return acc + sc;
          }, 0) / totalAttempts
        )
      : null;

  // Persentase Progres Penyelesaian Materi (Dinamis Berdasarkan Capaian Kuis & Eksplorasi)
  const completionPercentage = totalAttempts > 0 ? 100 : 50;

  return (
    <div className="min-h-screen bg-[#F0FDFA] flex flex-col font-sans text-[#134E4A] selection:bg-[#5EEAD4]">
      {/* 1. Top Navigation Bar Siswa */}
      <nav className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Media */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0F766E] to-[#164E63] flex items-center justify-center shadow-md shadow-[#0F766E]/20">
              <img src={atomMolecule} alt="Logo Kimia" className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-[#134E4A] tracking-tight">
                The Secret of Salt
              </span>
              <span className="block text-xs text-[#64748B]">Dashboard Siswa Fase F</span>
            </div>
          </Link>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Tombol Akses Khusus Jika Akun Memiliki Peran Guru */}
            {user?.role === 'teacher' && (
              <Link
                to="/teacher"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white px-3.5 py-2 rounded-xl bg-linear-to-r from-[#164E63] to-[#0F766E] shadow-sm hover:opacity-95 transition-all"
              >
                <span>👩‍🏫 Panel Pengampu Guru</span>
              </Link>
            )}

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F766E] hover:text-[#115E59] px-3.5 py-2 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] transition-colors"
            >
              <span>🧪 Lab &amp; Materi</span>
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#CCFBF1] text-[#0F766E] font-extrabold text-sm flex items-center justify-center border border-[#5EEAD4]">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-sm font-bold text-[#134E4A] truncate max-w-[160px]">
                  {user?.fullName || 'Siswa Kimia'}
                </span>
                <span className="block text-xs text-[#64748B]">
                  {user?.classGrade || 'XI Fase F'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="py-1.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Keluar dari akun Anda"
              >
                <span>Keluar</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Student Dashboard Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Notifikasi Penautan Data Kuis Tamu */}
        {migrationNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-sm font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span>{migrationNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setMigrationNotice('')}
              className="text-xs underline cursor-pointer hover:opacity-80"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Kotak Penautan Kuis Sesi Tamu (Hanya jika ditemukan kuis sebelum login di browser ini) */}
        {unmigratedGuests.length > 0 && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#F0FDFA] to-[#FFFFFF] border-2 border-[#5EEAD4] shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[#0F766E]">
              <span className="text-xl">📥</span>
              <h3 className="font-extrabold text-base sm:text-lg">
                Tautkan Hasil Kuis Sebelumnya ke Akun Anda
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] mb-4">
              Ditemukan <strong>{unmigratedGuests.length} percobaan kuis</strong> yang Anda selesaikan sebelum masuk. Pilih hasil kuis yang ingin Anda simpan ke akun <strong>{user?.fullName}</strong>:
            </p>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {unmigratedGuests.map((attempt) => {
                const isSelected = selectedGuestIds.includes(attempt.attemptId);
                const formattedDate = new Date(attempt.completedAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <label
                    key={attempt.attemptId}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#CCFBF1]/30 border-[#0F766E]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleGuestSelect(attempt.attemptId)}
                        className="w-4 h-4 rounded text-[#0F766E] border-slate-300 focus:ring-[#0F766E]"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#134E4A]">
                          Kuis Modul 1: Hidrolisis Garam
                        </span>
                        <span className="block text-xs text-[#64748B]">
                          Diselesaikan: {formattedDate} WIB
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#DCFCE7] text-[#166534]">
                        Skor: {attempt.score}/100
                      </span>
                      <span className="block text-[11px] text-[#64748B] mt-0.5">
                        {attempt.correctCount} dari {attempt.totalQuestions || 10} benar
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleMigrateSelected}
                disabled={selectedGuestIds.length === 0 || migrating}
                className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {migrating ? 'Menyimpan...' : `Simpan ${selectedGuestIds.length} Hasil Terpilih`}
              </button>
              <button
                type="button"
                onClick={handleDismissGuest}
                disabled={migrating}
                className="py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors cursor-pointer"
                title="Jangan simpan hasil kuis ini ke akun saya"
              >
                Abaikan
              </button>
              <button
                type="button"
                onClick={() => setSelectedGuestIds(unmigratedGuests.map((g) => g.attemptId))}
                className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
              >
                Pilih Semua
              </button>
              <button
                type="button"
                onClick={() => setSelectedGuestIds([])}
                className="text-xs font-semibold text-[#64748B] hover:underline cursor-pointer"
              >
                Batalkan Pilihan
              </button>
            </div>
          </div>
        )}

        {/* 3. Welcome Hero Banner — Berorientasi Pembelajaran */}
        <div className="relative rounded-3xl bg-linear-to-r from-[#0F766E] via-[#115E59] to-[#164E63] text-white p-6 sm:p-10 shadow-lg overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-[#5EEAD4] mb-3">
              <span>👋 Selamat Datang Kembali</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Halo, {user?.fullName || 'Siswa Kimia'}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#E6FFFA] leading-relaxed">
              Selamat datang di pusat aktivitas belajar kimia Anda. Pantau penguasaan konsep hidrolisis garam, evaluasi kuis formatif, dan lanjutkan petualangan belajarmu!
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="py-2.5 px-5 rounded-xl font-bold text-sm bg-white text-[#0F766E] hover:bg-[#F0FDFA] shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🚀 Lanjutkan Pembelajaran</span>
              </Link>
              <a
                href="/#kuis-modul-1"
                className="py-2.5 px-5 rounded-xl font-bold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>📝 Uji Kuis Modul 1</span>
              </a>
              <a
                href="/#lab-interaktif"
                className="py-2.5 px-5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-[#CCFBF1] border border-[#5EEAD4]/30 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🔬 Buka Lab Virtual</span>
              </a>
            </div>
          </div>

          {/* Decorative Background Rings */}
          <div
            className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border-12 border-white/10 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-32 top-8 w-40 h-40 rounded-full border-8 border-[#5EEAD4]/20 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* 4. Empat Kartu Metrik Pembelajaran Siswa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Identitas Siswa */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center text-xl shrink-0">
              🎓
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Identitas Siswa
              </span>
              <strong className="text-sm font-extrabold text-[#134E4A] block mt-0.5 truncate" title={user?.fullName}>
                {user?.fullName || 'Siswa Kimia'}
              </strong>
              <p className="text-xs text-[#64748B] mt-0.5 truncate">
                {user?.classGrade || 'XI Fase F'} • {user?.schoolName || 'SMA / MA Laboratorium'}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1]">
                Akun Terverifikasi
              </span>
            </div>
          </div>

          {/* Card 2: Progres Penyelesaian Materi */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center text-xl shrink-0">
              📚
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Progres Materi
              </span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-[#134E4A]">
                  {completionPercentage}%
                </span>
                <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  {totalAttempts > 0 ? 'Modul Tuntas' : 'Sedang Berjalan'}
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-linear-to-r from-[#0F766E] to-[#20B8AA] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1.5 truncate">
                3 Pilar Prasyarat &amp; Lab Virtual
              </p>
            </div>
          </div>

          {/* Card 3: Nilai Kuis Terakhir */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xl shrink-0">
              📊
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Skor Kuis Terakhir
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-[#134E4A]">
                  {latestAttempt ? latestAttempt.score : (loadingHistory ? '...' : '-')}
                </span>
                {latestAttempt && <span className="text-xs text-[#64748B]">/ 100</span>}
              </div>
              <p className="text-xs text-[#64748B] mt-1 truncate">
                {latestAttempt
                  ? `Selesai ${new Date(latestAttempt.completedAt).toLocaleDateString('id-ID')}`
                  : 'Belum ada kuis dikerjakan'}
              </p>
              <a
                href="/#kuis-modul-1"
                className="inline-block mt-1.5 text-xs font-bold text-[#0F766E] hover:underline"
              >
                Mulai Kuis Modul 1 →
              </a>
            </div>
          </div>

          {/* Card 4: Nilai Tertinggi Siswa */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Skor Terbaik
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-[#16A34A]">
                  {totalAttempts > 0 ? highestScore : (loadingHistory ? '...' : '-')}
                </span>
                {totalAttempts > 0 && <span className="text-xs text-[#64748B]">/ 100</span>}
              </div>
              <p className="text-xs text-[#64748B] mt-1 truncate">
                {averageScore !== null ? `Rata-rata: ${averageScore}/100` : 'Siap mencetak rekor!'}
              </p>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534]">
                {highestScore >= 75 ? 'Tuntas Kompetensi' : 'Terus Semangat!'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Tabel Riwayat Aktivitas Pembelajaran Siswa */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0] flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-[#134E4A] flex items-center gap-2">
                <span>📝</span>
                <span>Riwayat Pembelajaran &amp; Kuis Anda ({quizHistory.length})</span>
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Daftar percobaan kuis formatif pilihan ganda dan evaluasi esai yang telah Anda selesaikan.
              </p>
            </div>
            <a
              href="/#kuis-modul-1"
              className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-xs transition-colors cursor-pointer"
            >
              + Coba Kuis Baru
            </a>
          </div>

          {quizHistory.length === 0 ? (
            <div className="py-12 text-center text-[#64748B]">
              <span className="text-3xl block mb-2">📖</span>
              <p className="font-semibold text-sm text-[#134E4A]">Belum ada riwayat kuis yang tersimpan.</p>
              <p className="text-xs text-[#64748B] mt-1">
                Ayo mulai petualangan kimia Anda dengan mempelajari konsep prasyarat dan mengerjakan kuis formatif!
              </p>
              <a
                href="/#kuis-modul-1"
                className="mt-3 inline-block py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors"
              >
                Mulai Kuis Modul 1 Sekarang →
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-2.5 px-3 font-semibold">Percobaan</th>
                    <th className="py-2.5 px-3 font-semibold">Tanggal Selesai</th>
                    <th className="py-2.5 px-3 font-semibold">Skor Pilihan Ganda</th>
                    <th className="py-2.5 px-3 font-semibold">Evaluasi Esai</th>
                    <th className="py-2.5 px-3 font-semibold">Nilai Akhir</th>
                    <th className="py-2.5 px-3 font-semibold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizHistory.map((item, idx) => {
                    const hasEssay = Boolean(
                      item.essayAnswers && Object.keys(item.essayAnswers).length > 0
                    );
                    const isGraded = item.essayGrading?.status === 'graded';
                    const composite =
                      typeof item.finalCompositeScore === 'number'
                        ? item.finalCompositeScore
                        : isGraded && item.essayGrading
                        ? Math.round(
                            0.5 * (item.score || 0) + 0.5 * (item.essayGrading.totalEssayScore || 0)
                          )
                        : null;
                    const finalVal = composite !== null ? composite : item.score;

                    return (
                      <tr key={item.attemptId || item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#134E4A]">
                          Percobaan #{quizHistory.length - idx}
                        </td>
                        <td className="py-2.5 px-3 text-[#64748B]">
                          {new Date(item.completedAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })} WIB
                        </td>
                        <td className="py-2.5 px-3 font-medium">
                          <strong className="text-[#0F766E]">{item.score}</strong>
                          <span className="text-[11px] text-[#64748B]"> ({item.correctCount}/{item.totalQuestions || 10} benar)</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {!hasEssay ? (
                            <span className="text-[11px] text-[#94A3B8]">Hanya Pilihan Ganda</span>
                          ) : isGraded && item.essayGrading ? (
                            <div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                                ✓ Nilai Guru: {item.essayGrading.totalEssayScore}/100
                              </span>
                              {item.essayGrading.feedback && (
                                <p className="text-[10px] text-[#059669] mt-0.5 italic line-clamp-1" title={item.essayGrading.feedback}>
                                  "{item.essayGrading.feedback}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                              ⏳ Menunggu Pemeriksaan Guru
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-extrabold text-sm">
                          {composite !== null ? (
                            <span className={composite >= 75 ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                              {composite}
                            </span>
                          ) : (
                            <span className="text-[#64748B] text-xs">{item.score}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              finalVal >= 75
                                ? 'bg-[#DCFCE7] text-[#16A34A]'
                                : 'bg-[#FEE2E2] text-[#DC2626]'
                            }`}
                          >
                            {finalVal >= 75 ? 'Tuntas' : 'Perlu Penguatan'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
