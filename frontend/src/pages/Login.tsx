import { useState, type FormEvent } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0f1e', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,160,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,160,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,160,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(12, 25, 48, 0.75)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(0,245,160,0.12)',
        borderRadius: '1.5rem', padding: '48px 44px', width: '100%', maxWidth: 440,
        boxShadow: '0 0 80px rgba(0,245,160,0.06), 0 40px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 16, color: '#002e1e',
          }}>F</div>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#e8f4ff' }}>FitAI</span>
        </Link>

        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#e8f4ff', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Welcome back
        </h1>
        <p style={{ color: '#5a6f85', fontSize: '0.9rem', marginBottom: 32, lineHeight: 1.5 }}>
          Log in to continue your fitness journey.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: '#8a9bb0', fontSize: '0.8rem', fontWeight: 600, marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Username
            </label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. yash_fit"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(5, 15, 35, 0.7)',
                border: '1px solid rgba(0,245,160,0.14)',
                borderRadius: '0.75rem', padding: '0.8rem 1rem',
                color: '#e8f4ff', fontSize: '0.95rem', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(0,245,160,0.45)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,245,160,0.14)')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: '#8a9bb0', fontSize: '0.8rem', fontWeight: 600, marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(5, 15, 35, 0.7)',
                  border: '1px solid rgba(0,245,160,0.14)',
                  borderRadius: '0.75rem', padding: '0.8rem 3rem 0.8rem 1rem',
                  color: '#e8f4ff', fontSize: '0.95rem', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(0,245,160,0.45)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,245,160,0.14)')}
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a6f85', fontSize: '0.8rem', padding: 4 }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', borderRadius: '0.65rem', padding: '10px 14px', marginBottom: 20, color: '#ff7070', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(0,245,160,0.4)' : 'linear-gradient(135deg, #00F5A0, #00ec9a)',
              color: '#002e1e', fontFamily: 'Manrope, sans-serif', fontWeight: 800,
              fontSize: '1rem', padding: '0.9rem', borderRadius: 9999,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 30px rgba(0,245,160,0.35)',
              transition: 'all 0.3s ease', letterSpacing: '0.04em',
            }}
            onMouseOver={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,245,160,0.55)'; }}
            onMouseOut={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0,245,160,0.35)'; }}
          >
            {loading ? 'Logging in…' : 'Log In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, color: '#4a5a6a', fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#00F5A0', fontWeight: 600, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
