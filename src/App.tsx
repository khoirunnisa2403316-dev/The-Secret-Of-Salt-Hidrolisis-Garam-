import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { isTeacherEmail } from './services/authService';
import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import SearchBar from './components/search/SearchBar';
import TopicCards from './TopicCards.jsx';
import MateriHidrolisis from './MateriHidrolisis.jsx';
import QuizModule1 from './components/assessment/QuizModule1';
import OnboardingTour from './components/tour/OnboardingTour';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './App.css';

/**
 * Public Home Page — Preserving the complete existing learning media:
 * HeroSection (with beaker simulation), 3 Prerequisite TopicCards,
 * Formative Quiz Module 1, and Footer.
 */
function HomePage() {
  const { user } = useAuth();
  const handleStartLearning = () => {
    const target = document.getElementById('topik-prasyarat');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      {/* 1. Global Navbar with Media Identity & Auth Entrypoints */}
      <Navbar onStartClick={handleStartLearning} />

      {/* Interactive Onboarding Tour Guide */}
      <OnboardingTour />

      {/* 2. Main Chemistry Learning Area */}
      <main id="main-content">
        {/* Search Bar: Kolom Pencarian Konsep & Materi Hidrolisis Garam */}
        <div className="beranda-search-wrapper container" id="pencarian-materi">
          <SearchBar />
        </div>

        {/* Hero Section with Virtual Lab & Curiosity Phenomenon */}
        <HeroSection onStartClick={handleStartLearning} />

        {/* 3 Pillars of Prerequisite Mastery */}
        <TopicCards />

        {/* Materi Hidrolisis Garam Lengkap (Pengertian, 4 Jenis, Johnstone, Rumus Kh & pH, Kalkulator, Penerapan) */}
        <MateriHidrolisis />

        {/* Formative Quiz Module 1: Isolated by active user account namespace (AD18-06) */}
        <QuizModule1 key={user?.id || user?.uid || 'guest'} />
      </main>

      {/* Academic Footer */}
      <footer className="app-footer" id="tentang">
        <div className="container footer-content-wrap">
          {/* Bagian Sumber Materi & Referensi Ilmiah */}
          <section className="footer-references-section" aria-labelledby="references-heading">
            <div className="footer-ref-header">
              <span className="footer-ref-icon">📚</span>
              <div>
                <h3 id="references-heading" className="footer-ref-title">Sumber Materi &amp; Referensi</h3>
                <p className="footer-ref-subtitle">
                  Rujukan ilmiah terverifikasi dan kurikulum resmi yang menjadi landasan materi, perumusan reaksi, dan kalkulasi pH:
                </p>
              </div>
            </div>

            <ul className="footer-ref-list">
              <li className="footer-ref-item">
                <span className="footer-ref-bullet">📘</span>
                <div>
                  <strong>Buku Kimia SMA/MA Kelas XI</strong>, Kementerian Pendidikan dan Kebudayaan (Kurikulum Merdeka) — <em>Bab Larutan Garam &amp; Hidrolisis</em>
                </div>
              </li>
              <li className="footer-ref-item">
                <span className="footer-ref-bullet">🔬</span>
                <div>
                  <strong>Chang, R. &amp; Goldsby, K.A.</strong> <em>Chemistry</em> (12th Edition) — <em>Bab Acid-Base Equilibria &amp; Salt Hydrolysis</em>
                </div>
              </li>
              <li className="footer-ref-item">
                <span className="footer-ref-bullet">🧪</span>
                <div>
                  <strong>Brown, T.L. et al.</strong> <em>Chemistry: The Central Science</em> — <em>Bab Aqueous Equilibrium</em>
                </div>
              </li>
              <li className="footer-ref-item">
                <span className="footer-ref-bullet">⚖️</span>
                <div>
                  Nilai <em>K</em><sub>a</sub> CH₃COOH = 1,8 × 10⁻⁵ dan <em>K</em><sub>b</sub> NH₃ = 1,8 × 10⁻⁵ diambil dari tabel tetapan ionisasi standar pada suhu 25°C (<em>K</em><sub>w</sub> = 1,0 × 10⁻¹⁴)
                </div>
              </li>
              <li className="footer-ref-item">
                <span className="footer-ref-bullet">🏛️</span>
                <div>
                  Disusun sesuai Kurikulum Merdeka dengan pendekatan Pembelajaran Mendalam (Deep Learning) berdasarkan Permendikdasmen No. 13 Tahun 2025 tentang Kurikulum Nasional, dengan prinsip Mindful, Meaningful, dan Joyful.
                </div>
              </li>
            </ul>
          </section>

          <hr className="footer-divider" />

          {/* Identitas Aplikasi */}
          <div className="footer-inner">
            <div className="footer-info">
              <strong>Hydrolysis Adventure: Explore the Ions, Discover the pH!</strong>
              <p>
                Media Pembelajaran Kimia Interaktif SMA/MA Kelas XI • Berbasis Konsep, Anti-Miskonsepsi, dan Kurikulum Merdeka.
              </p>
            </div>
            <div className="footer-badges">
              <span className="footer-tag">🧪 SMA/MA Kelas XI</span>
              <span className="footer-tag">✨ Kimia Interaktif</span>
              <span className="footer-tag">📘 Kurikulum Merdeka</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Protected Route Wrapper — PRD Section 9
 * Restricts access to authenticated students & teachers only.
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/**
 * Strict Teacher Route Wrapper
 * Exclusively allows khoirun.nisa.2403316@students.um.ac.id to access the Teacher Panel.
 * Any other account (students, unauthenticated) is immediately redirected.
 */
function TeacherRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const isAuthorizedTeacher =
    Boolean(user?.email && isTeacherEmail(user.email)) &&
    user?.role === 'teacher';

  if (!isAuthorizedTeacher) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

/**
 * Public Auth Route Wrapper — PRD Section 9
 * Redirects already authenticated users directly to /dashboard.
 */
function PublicAuthRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

/**
 * Root Application with React Router DOM & AuthProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Chemistry Learning Media */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication Routes */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <Register />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicAuthRoute>
                <ForgotPassword />
              </PublicAuthRoute>
            }
          />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Teacher Analytics & Management Route */}
          <Route
            path="/teacher"
            element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            }
          />
          <Route path="/panel-guru" element={<Navigate to="/teacher" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
