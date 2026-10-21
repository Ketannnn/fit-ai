import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import FeatureScroll from './components/FeatureScroll';
import HowToStart from './components/HowToStart';
import CTAFooter from './components/CTAFooter';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0f1e' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <StatsBar />
        <FeatureScroll />
        <HowToStart />
      </main>
      <CTAFooter />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard defaultTab="analytics" />} />
          <Route path="/trainer" element={<Dashboard defaultTab="trainer" />} />
          <Route path="/app" element={<Dashboard defaultTab="trainer" />} />
          <Route path="/live-trainer" element={<Dashboard defaultTab="trainer" />} />
          <Route path="/workout" element={<Dashboard defaultTab="trainer" />} />
          <Route path="/exercise-tracker" element={<Dashboard defaultTab="trainer" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

