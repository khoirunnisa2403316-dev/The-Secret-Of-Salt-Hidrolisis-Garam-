import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import TopicCards from './TopicCards.jsx';
import QuizModule1 from './components/assessment/QuizModule1';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import './App.css';

/**
 * Public Home Page — Preserving the complete existing learning media:
 * HeroSection (with beaker simulation), 3 Prerequisite TopicCards,
 * Formative Quiz Module 1, and Footer.
 */
function HomePage() {
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

      {/* 2. Main Chemistry Learning Area */}
      <main>
        {/* Hero Section with Virtual Lab & Curiosity Phenomenon */}
        <HeroSection onStartClick={handleStartLearning} />

        {/* 3 Pillars of Prerequisite Mastery */}
        <TopicCards />

        {/* Formative Quiz Module 1: 10 Verified Salt Hydrolysis Questions */}
        <QuizModule1 />
      </main>

      {/* Academic Footer */}
      <footer className="app-footer" id="tentang">
        <div className="container footer-inner">
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

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
