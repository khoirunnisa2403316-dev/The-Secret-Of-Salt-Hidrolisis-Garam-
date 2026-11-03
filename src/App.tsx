import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import TopicCards from './TopicCards.jsx';
import QuizModule1 from './components/assessment/QuizModule1';
import './App.css';

export default function App() {
  const handleStartLearning = () => {
    const target = document.getElementById('topik-prasyarat');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      {/* 1. Navbar dengan Identitas Media & Navigasi Kuis */}
      <Navbar onStartClick={handleStartLearning} />

      {/* 2. Main Area Pembelajaran */}
      <main>
        {/* Hero Section dengan Lab Maya & Fenomena Pemantik */}
        <HeroSection onStartClick={handleStartLearning} />

        {/* 3 Pilar Materi Prasyarat Hidrolisis Garam */}
        <TopicCards />

        {/* Kuis Formatif Modul 1: 10 Soal Terverifikasi Hidrolisis Garam */}
        <QuizModule1 />
      </main>

      {/* Footer Akademis & Identitas Kurikulum */}
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
