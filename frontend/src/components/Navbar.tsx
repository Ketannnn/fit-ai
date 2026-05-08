import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10, 15, 30, 0.6)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(0, 245, 160, 0.06)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Home', 'Features', 'How It Works'].map(link => (
            <a key={link} href="#"
              style={{
                color: hovered === link ? '#00F5A0' : '#8a9bb0',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem',
                textDecoration: 'none', transition: 'color 0.2s ease',
                paddingBottom: 2,
                borderBottom: hovered === link ? '1px solid rgba(0,245,160,0.6)' : '1px solid transparent',
              }}
              onMouseOver={() => setHovered(link)}
              onMouseOut={() => setHovered(null)}
            >{link}</a>
          ))}

          {user ? (
            /* ── Logged in: username badge + Launch App + Logout ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,245,160,0.08)', border: '1px solid rgba(0,245,160,0.2)', borderRadius: 9999, padding: '4px 12px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#00F5A0', fontWeight: 600 }}>
                  👤 {user.username}
                </span>
              </div>

              {/* Dashboard Button */}
              <Link to="/dashboard" style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#e8f4ff',
                padding: '0.5rem 1.1rem', borderRadius: 9999, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.2s ease',
                border: '1px solid rgba(255,255,255,0.1)',
                background: hovered === 'dash' ? 'rgba(255,255,255,0.05)' : 'transparent',
              }}
              onMouseOver={() => setHovered('dash')}
              onMouseOut={() => setHovered(null)}
              >
                📊 Dashboard
              </Link>

              {/* Launch App button */}
              <a
                id="launch-app-btn"
                href={`http://localhost:8501?username=${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.5rem 1.3rem', borderRadius: 9999, cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
                  color: '#002e1e', textDecoration: 'none',
                  boxShadow: hovered === 'launch' ? '0 0 28px rgba(0,245,160,0.45)' : '0 0 12px rgba(0,245,160,0.2)',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
                onMouseOver={() => setHovered('launch')}
                onMouseOut={() => setHovered(null)}
              >
                🚀 Launch App
              </a>

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
            /* ── Logged out: Login + Sign Up ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/login"
                style={{
                  padding: '0.5rem 1.3rem', borderRadius: 9999,
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                  color: '#00F5A0', background: 'rgba(0,245,160,0.04)',
                  border: '1px solid rgba(0,245,160,0.3)',
                  textDecoration: 'none', transition: 'all 0.25s ease',
                  boxShadow: hovered === 'login' ? '0 0 16px rgba(0,245,160,0.2)' : 'none',
                }}
                onMouseOver={() => setHovered('login')}
                onMouseOut={() => setHovered(null)}
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
