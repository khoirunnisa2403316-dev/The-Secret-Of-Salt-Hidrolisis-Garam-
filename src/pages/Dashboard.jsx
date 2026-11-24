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
 * Dashboard Page — Media Pembelajaran Kimia
 * Protected learning dashboard for authenticated students & teachers.
 * Displays user profile, Firebase connection status, module progress,
 * Cloud Firestore synchronized quiz records, and learning shortcuts.
 */

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  // Guest Migration States
  const [unmigratedGuests, setUnmigratedGuests] = useState([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [migrating, setMigrating] = useState(false);
  const [migrationNotice, setMigrationNotice] = useState('');

  // Account Sync Queue States
  const [accountQueue, setAccountQueue] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false);
  const [queueNotice, setQueueNotice] = useState('');

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
        const isPermission = err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission');
        if (!isPermission) {
          console.warn('Firestore history load notice:', err?.message || err);
        }
      }
    }

    setQuizHistory(localAttempts);
    setLoadingHistory(false);

    const guestItems = getUnmigratedGuestAttempts(user.id);
    setUnmigratedGuests(guestItems);
    setSelectedGuestIds(guestItems.map((g) => g.attemptId));

    const queue = getAccountQueue(user.id);
    setAccountQueue(queue);
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
          const isPermission = err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission');
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
        const queue = getAccountQueue(user.id);
        setAccountQueue(queue);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [user]);

  // Handle selective migration
  const handleToggleGuestSelect = (attemptId) => {
    setSelectedGuestIds((prev) =>
      prev.includes(attemptId) ? prev.filter((id) => id !== attemptId) : [...prev, attemptId]
    );
  };

  const handleDismissGuest = () => {
    if (!user?.id || unmigratedGuests.length === 0) return;
    const idsToDismiss = unmigratedGuests.map((g) => g.attemptId);
    dismissGuestAttemptsForUser(user.id, idsToDismiss);
    setUnmigratedGuests([]);
    setSelectedGuestIds([]);
    setMigrationNotice('Penggabungan riwayat tamu telah dilewati. Riwayat akun Anda tidak diubah.');
  };

  const handleMigrateSelected = async () => {
    if (!user?.id || selectedGuestIds.length === 0 || migrating) return;
    setMigrating(true);
    setMigrationNotice('');

    try {
      const res = await migrateSelectedGuestAttempts(selectedGuestIds, user.id, user.fullName);
      if (res.success) {
        setMigrationNotice(`Berhasil menautkan ${res.migratedCount} hasil kuis tamu ke akun Anda!`);
        await reloadData();
      }
    } catch (err) {
      setMigrationNotice(`Gagal migrasi: ${err.message}`);
    } finally {
      setMigrating(false);
    }
  };

  // Handle process account sync queue
  const handleProcessQueue = async () => {
    if (!user?.id || processingQueue) return;
    setProcessingQueue(true);
    setQueueNotice('');

    try {
      const res = await processAccountSyncQueue(user.id);
      if (res.processed > 0) {
        setQueueNotice(`Berhasil mengirimkan ${res.processed} percobaan kuis ke Cloud Firestore!`);
      } else if (res.failed > 0) {
        setQueueNotice(`Terdapat ${res.failed} pengiriman gagal. Pastikan koneksi internet aktif.`);
      }
      await reloadData();
    } catch (err) {
      setQueueNotice(`Gagal memproses antrean: ${err.message}`);
    } finally {
      setProcessingQueue(false);
    }
  };

  const latestAttempt = quizHistory[0] || null;
  const isCloudActive = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-[#F0FDFA] flex flex-col font-sans text-[#134E4A] selection:bg-[#5EEAD4]">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0F766E] to-[#164E63] flex items-center justify-center shadow-md shadow-[#0F766E]/20">
              <img src={atomMolecule} alt="Logo" className="w-6 h-6" />
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
            {user?.role === 'teacher' && user?.email?.toLowerCase().trim() === 'khoirun.nisa.2403316@students.um.ac.id' && (
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
              <span>🧪 Lab & Materi</span>
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#CCFBF1] text-[#0F766E] font-extrabold text-sm flex items-center justify-center border border-[#5EEAD4]">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-sm font-bold text-[#134E4A] truncate max-w-[150px]">
                  {user?.fullName || 'Siswa Kimia'}
                </span>
                <span className="block text-xs text-[#64748B]">{user?.classGrade || 'XI Fase F'}</span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="py-1.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Keluar dari akun Anda"
              >
                <span>Keluar</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Firebase Status Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {isCloudActive ? '🔥' : '⚙️'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-[#134E4A]">
                  {isCloudActive
                    ? 'Firebase Authentication & Cloud Firestore Aktif'
                    : 'Modul Sesi & Database Siap'}
                </strong>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCloudActive
                      ? 'bg-[#DCFCE7] text-[#16A34A]'
                      : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  {isCloudActive ? 'Terhubung ke Cloud' : 'Kunci .env.local Diperlukan'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {isCloudActive
                  ? 'Data pendaftaran akun, login, dan riwayat kuis tersinkronisasi langsung ke koleksi Firestore.'
                  : 'Sistem siap terhubung ke Firebase Console Anda melalui file .env.local.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfigGuide((prev) => !prev)}
            className="text-xs font-bold text-[#0F766E] hover:text-[#115E59] bg-[#F0FDFA] px-3 py-1.5 rounded-xl border border-[#CCFBF1] transition-colors"
          >
            {showConfigGuide ? 'Tutup Panduan ▲' : 'Panduan Kunci Firebase ▼'}
          </button>
        </div>

        {/* Migration Success / Error Notice */}
        {migrationNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-sm font-semibold flex items-center justify-between">
            <span>{migrationNotice}</span>
            <button type="button" onClick={() => setMigrationNotice('')} className="text-xs underline cursor-pointer">
              Tutup
            </button>
          </div>
        )}

        {/* Account Sync Queue Notice */}
        {queueNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-sm font-semibold flex items-center justify-between">
            <span>{queueNotice}</span>
            <button type="button" onClick={() => setQueueNotice('')} className="text-xs underline cursor-pointer">
              Tutup
            </button>
          </div>
        )}

        {/* 1. Selective Guest Quiz Migration Card (PRD Bab 4 & Issue #08) */}
        {unmigratedGuests.length > 0 && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#F0FDFA] to-[#FFFFFF] border-2 border-[#5EEAD4] shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[#0F766E]">
              <span className="text-xl">📥</span>
              <h3 className="font-extrabold text-base sm:text-lg">
                Tautkan Hasil Kuis Sesi Tamu ke Akun Anda
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] mb-4">
              Ditemukan <strong>{unmigratedGuests.length} percobaan kuis</strong> dari sesi tamu di perangkat ini. Pilih hasil kuis yang ingin Anda sinkronkan ke akun <strong>{user?.fullName}</strong>:
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
                          Kuis Modul 1 (v{attempt.questionVersion || '1.0.0'})
                        </span>
                        <span className="block text-xs text-[#64748B]">
                          Diselesaikan: {formattedDate} WIB • ID: {attempt.attemptId.substring(0, 12)}...
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
                {migrating ? 'Menautkan Data...' : `Tautkan ${selectedGuestIds.length} Hasil Terpilih`}
              </button>
              <button
                type="button"
                onClick={handleDismissGuest}
                disabled={migrating}
                className="py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors cursor-pointer"
                title="Jangan tautkan hasil tamu ini ke akun saya"
              >
                Abaikan / Jangan Tautkan
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

        {/* 2. Account-Scoped Sync Queue Banner */}
        {accountQueue.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📤</span>
              <div>
                <strong className="text-sm text-[#1E40AF]">
                  Antrean Sinkronisasi Akun ({accountQueue.length} Tertunda)
                </strong>
                <p className="text-xs text-[#3B82F6]">
                  Terdapat hasil kuis yang belum terkirim ke Cloud Firestore. Data akan dikirim tanpa duplikasi (idempoten).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleProcessQueue}
              disabled={processingQueue}
              className="py-2 px-3.5 rounded-xl text-xs font-bold bg-[#1D4ED8] text-white hover:bg-[#1E40AF] transition-colors cursor-pointer"
            >
              {processingQueue ? 'Mengirim...' : 'Kirim Sekarang'}
            </button>
          </div>
        )}

        {/* Collapsible Firebase Setup Guide */}
        {showConfigGuide && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FFFFFF] border-2 border-[#5EEAD4] shadow-md animate-fadeIn">
            <h3 className="text-base font-extrabold text-[#134E4A] flex items-center gap-2 mb-2">
              <span>🔥</span>
              <span>Langkah Menghubungkan Firebase Console ke Proyek Ini</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mb-4">
              Buka <strong>Firebase Console</strong> Anda di{' '}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#0F766E] font-bold underline"
              >
                console.firebase.google.com
              </a>
              , buka <em>Project Settings</em> &gt; <em>General</em> &gt; <em>Your apps</em> (Web app), lalu salin kunci ke file <code>.env.local</code> pada direktori utama:
            </p>

            <pre className="p-4 rounded-xl bg-slate-900 text-[#5EEAD4] text-xs font-mono overflow-x-auto select-all leading-relaxed">
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nama-proyek.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nama-proyek
VITE_FIREBASE_STORAGE_BUCKET=nama-proyek.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...`}
            </pre>

            <p className="text-xs text-[#164E63] mt-3 font-medium">
              💡 <em>Tips Firestore:</em> Pastikan Anda telah membuat database di tab <strong>Firestore Database</strong> (mode <code>Production</code> atau <code>Test</code>) dan mengaktifkan <strong>Authentication &gt; Sign-in method &gt; Email/Password</strong>.
            </p>
          </div>
        )}

        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl bg-linear-to-r from-[#0F766E] via-[#115E59] to-[#164E63] text-white p-6 sm:p-10 shadow-lg overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-[#5EEAD4] mb-3">
              <span>👋 Selamat Datang Kembali</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Halo, {user?.fullName || 'Siswa Kimia'}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#E6FFFA] leading-relaxed">
              Selamat datang di pusat petualangan belajar kimia Anda. Seluruh progres belajar, simulasi laboratorium maya, dan evaluasi kuis Anda tersimpan secara terstruktur di database.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="py-2.5 px-5 rounded-xl font-bold text-sm bg-white text-[#0F766E] hover:bg-[#F0FDFA] shadow-md transition-all flex items-center gap-2"
              >
                <span>🚀 Lanjutkan Pembelajaran</span>
              </Link>
              <a
                href="/#kuis-modul-1"
                className="py-2.5 px-5 rounded-xl font-bold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <span>📝 Uji Kuis Modul 1</span>
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

        {/* 3 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* Card 1: User Profile & School */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center text-2xl shrink-0">
              🎓
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Identitas Siswa
              </span>
              <strong className="text-base text-[#134E4A] block mt-0.5">
                {user?.fullName}
              </strong>
              <p className="text-xs text-[#64748B] mt-1">
                {user?.schoolName || 'SMA / MA Laboratorium'} • {user?.classGrade || 'Kelas XI'}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0369A1]">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Card 2: Latest Quiz Score */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-2xl shrink-0">
              📊
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Skor Kuis Terakhir
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#134E4A]">
                  {latestAttempt ? latestAttempt.score : (loadingHistory ? '...' : 'Belum Ada')}
                </span>
                {latestAttempt && <span className="text-xs text-[#64748B]">/ 100</span>}
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                {latestAttempt
                  ? `Selesai ${new Date(latestAttempt.completedAt).toLocaleDateString('id-ID')}`
                  : 'Selesaikan kuis untuk melihat skor Anda.'}
              </p>
              <a
                href="/#kuis-modul-1"
                className="inline-block mt-2 text-xs font-bold text-[#0F766E] hover:underline"
              >
                Buka Kuis Modul 1 →
              </a>
            </div>
          </div>

          {/* Card 3: Module Status */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center text-2xl shrink-0">
              🧪
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Status Modul Aktif
              </span>
              <strong className="text-base text-[#134E4A] block mt-0.5">
                Modul 1: Hidrolisis Garam
              </strong>
              <p className="text-xs text-[#64748B] mt-1">
                3 Pilar Prasyarat, Lab Maya Partikel, & 10 Soal Teruji
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                Fase F Terbuka
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Firestore Synchronized Quiz Records */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-bold text-[#134E4A]">
                Riwayat Evaluasi Kuis di Database Cloud ({quizHistory.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                Data percobaan kuis formatif tersinkronisasi dengan akun Firestore Anda.
              </p>
            </div>
            <a
              href="/#kuis-modul-1"
              className="py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors"
            >
              + Coba Kuis Baru
            </a>
          </div>

          {quizHistory.length === 0 ? (
            <div className="py-8 text-center text-[#64748B] text-sm">
              <span className="text-2xl block mb-2">📝</span>
              <p>Belum ada riwayat kuis tersimpan di akun Anda.</p>
              <a href="/#kuis-modul-1" className="text-[#0F766E] font-bold hover:underline mt-1 inline-block text-xs">
                Mulai kerjakan Kuis Modul 1 sekarang →
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                    <th className="py-2.5 px-3 font-semibold">Percobaan ID</th>
                    <th className="py-2.5 px-3 font-semibold">Tanggal Selesai</th>
                    <th className="py-2.5 px-3 font-semibold">Butir Benar</th>
                    <th className="py-2.5 px-3 font-semibold">Skor Akhir</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizHistory.map((item) => (
                    <tr key={item.attemptId || item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#164E63]">
                        {item.attemptId ? item.attemptId.slice(0, 16) : 'att_m1'}
                      </td>
                      <td className="py-2.5 px-3 text-[#64748B]">
                        {new Date(item.completedAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        {item.correctCount} / {item.totalQuestions || 10}
                      </td>
                      <td className="py-2.5 px-3 font-extrabold">
                        <span
                          className={
                            item.score >= 75 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                          }
                        >
                          {item.score}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.score >= 75
                              ? 'bg-[#DCFCE7] text-[#16A34A]'
                              : 'bg-[#FEE2E2] text-[#DC2626]'
                          }`}
                        >
                          {item.score >= 75 ? 'Tuntas' : 'Perlu Penguatan'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
