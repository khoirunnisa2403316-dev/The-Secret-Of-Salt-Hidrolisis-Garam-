import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import atomMolecule from '../assets/images/atom-molecule.svg';
import { fetchUserQuizHistoryFromFirestore } from '../services/firestoreQuizService';
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

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      setLoadingHistory(true);

      // 1. Initial load from local cache
      let localAttempts = [];
      if (user?.id) {
        try {
          const raw = localStorage.getItem(`chem_user_history_${user.id}`) ||
                      localStorage.getItem('secret_of_salt_guest_m1_history');
          if (raw) localAttempts = JSON.parse(raw);
        } catch {
          // ignore
        }
      }

      if (isMounted && localAttempts.length > 0) {
        setQuizHistory(localAttempts);
      }

      // 2. Fetch live from Cloud Firestore if configured
      if (isFirebaseConfigured() && user?.id) {
        try {
          const firestoreAttempts = await fetchUserQuizHistoryFromFirestore(user.id);
          if (isMounted && firestoreAttempts.length > 0) {
            setQuizHistory(firestoreAttempts);
          }
        } catch (err) {
          console.warn('Firestore history load notice:', err);
        }
      }

      if (isMounted) setLoadingHistory(false);
    }

    loadHistory();
    return () => { isMounted = false; };
  }, [user]);

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
