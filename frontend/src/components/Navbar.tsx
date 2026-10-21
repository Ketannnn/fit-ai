import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isTrainerActive = location.pathname.startsWith('/trainer') || location.pathname.startsWith('/app');
  const isDashboardActive = location.pathname === '/dashboard';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10, 15, 30, 0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(0, 245, 160, 0.08)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 17, color: '#002e1e',
            boxShadow: '0 0 20px rgba(0,245,160,0.3)'
          }}>F</div>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#e8f4ff', letterSpacing: '-0.02em' }}>
            FitAI
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button
            onClick={() => handleNavClick('home')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: hovered === 'home' || location.pathname === '/' ? '#00F5A0' : '#8a9bb0',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem',
              transition: 'color 0.2s ease', padding: '4px 0',
              borderBottom: hovered === 'home' ? '1px solid rgba(0,245,160,0.6)' : '1px solid transparent',
            }}
            onMouseOver={() => setHovered('home')}
            onMouseOut={() => setHovered(null)}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('features')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: hovered === 'features' ? '#00F5A0' : '#8a9bb0',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem',
              transition: 'color 0.2s ease', padding: '4px 0',
              borderBottom: hovered === 'features' ? '1px solid rgba(0,245,160,0.6)' : '1px solid transparent',
            }}
            onMouseOver={() => setHovered('features')}
            onMouseOut={() => setHovered(null)}
          >
            Features
          </button>

          <button
            onClick={() => handleNavClick('how-to-start')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: hovered === 'how' ? '#00F5A0' : '#8a9bb0',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem',
              transition: 'color 0.2s ease', padding: '4px 0',
              borderBottom: hovered === 'how' ? '1px solid rgba(0,245,160,0.6)' : '1px solid transparent',
            }}
            onMouseOver={() => setHovered('how')}
            onMouseOut={() => setHovered(null)}
          >
            How It Works
          </button>

          {user ? (
            /* ── Logged in: username badge + Dashboard + Launch App + Logout ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,245,160,0.08)', border: '1px solid rgba(0,245,160,0.2)', borderRadius: 9999, padding: '4px 12px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#00F5A0', fontWeight: 600 }}>
                  👤 {user.username}
                </span>
              </div>

              {/* Dashboard Button */}
              <Link to="/dashboard" style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                color: isDashboardActive ? '#00F5A0' : '#e8f4ff',
                padding: '0.5rem 1.1rem', borderRadius: 9999, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.2s ease',
                border: isDashboardActive ? '1px solid rgba(0,245,160,0.3)' : '1px solid rgba(255,255,255,0.1)',
                background: isDashboardActive || hovered === 'dash' ? 'rgba(0,245,160,0.08)' : 'transparent',
              }}
              onMouseOver={() => setHovered('dash')}
              onMouseOut={() => setHovered(null)}
              >
                📊 Dashboard
              </Link>

              {/* Launch App / Live Trainer button */}
              <Link
                id="launch-app-btn"
                to="/trainer"
                style={{
                  padding: '0.5rem 1.3rem', borderRadius: 9999, cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
                  color: '#002e1e', textDecoration: 'none',
                  boxShadow: hovered === 'launch' || isTrainerActive ? '0 0 28px rgba(0,245,160,0.45)' : '0 0 12px rgba(0,245,160,0.2)',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
                onMouseOver={() => setHovered('launch')}
                onMouseOut={() => setHovered(null)}
              >
                🚀 Launch App
              </Link>

              {/* Logout */}
              <button
                id="logout-btn"
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1.1rem', borderRadius: 9999, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                  color: '#8a9bb0', background: 'transparent',
                  border: '1px solid rgba(138,155,176,0.2)',
                  transition: 'all 0.25s ease',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,100,100,0.35)'; (e.currentTarget as HTMLElement).style.color = '#ff8080'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(138,155,176,0.2)'; (e.currentTarget as HTMLElement).style.color = '#8a9bb0'; }}
              >
                Logout
              </button>
            </div>
          ) : (
            /* ── Logged out: Launch App + Login + Sign Up ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link
                id="launch-app-btn"
                to="/trainer"
                style={{
                  padding: '0.5rem 1.2rem', borderRadius: 9999, cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.85rem',
                  background: 'rgba(0,245,160,0.12)', border: '1px solid rgba(0,245,160,0.35)',
                  color: '#00F5A0', textDecoration: 'none',
                  boxShadow: hovered === 'launch' || isTrainerActive ? '0 0 20px rgba(0,245,160,0.35)' : 'none',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
                onMouseOver={() => setHovered('launch')}
                onMouseOut={() => setHovered(null)}
              >
                🚀 Launch App
              </Link>

              <Link to="/login"
                style={{
                  padding: '0.5rem 1.2rem', borderRadius: 9999,
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                  color: '#8a9bb0', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none', transition: 'all 0.25s ease',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#e8f4ff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = '#8a9bb0'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >Login</Link>

              <Link to="/signup"
                style={{
                  padding: '0.5rem 1.3rem', borderRadius: 9999,
                  fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.88rem',
                  color: '#002e1e', background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
                  textDecoration: 'none', transition: 'all 0.25s ease',
                  boxShadow: hovered === 'signup' ? '0 0 22px rgba(0,245,160,0.4)' : '0 0 10px rgba(0,245,160,0.15)',
                }}
                onMouseOver={() => setHovered('signup')}
                onMouseOut={() => setHovered(null)}
              >Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
