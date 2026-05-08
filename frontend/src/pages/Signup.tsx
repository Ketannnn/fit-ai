import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type SignupData } from '../context/AuthContext';

// ── Styling helpers ───────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(5, 15, 35, 0.7)',
  border: '1px solid rgba(0,245,160,0.14)',
  borderRadius: '0.75rem', padding: '0.8rem 1rem',
  color: '#e8f4ff', fontSize: '0.92rem', outline: 'none',
  transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif',
};

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#8a9bb0', fontSize: '0.77rem',
  fontWeight: 600, marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none', WebkitAppearance: 'none',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300F5A0' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
  paddingRight: '2.5rem',
};

function onFocusBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(0,245,160,0.45)';
}
function onBlurBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(0,245,160,0.14)';
}

// ── Step indicators ───────────────────────────────────────────────────────────
const STEPS = ['Account', 'Physical Stats', 'Goals'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<{
    username: string; password: string; confirmPassword: string;
    age: string; gender: string; height_cm: string; weight_kg: string;
    fitness_goal: string; activity_level: string; injuries: string; workout_days: string;
  }>({
    username: '', password: '', confirmPassword: '',
    age: '', gender: '', height_cm: '', weight_kg: '',
    fitness_goal: '', activity_level: '', injuries: '', workout_days: '',
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  // ── Validation per step ──────────────────────────────────────────────────
  const validateStep = (): string => {
    if (step === 0) {
      if (!form.username.trim()) return 'Username is required.';
      if (form.username.trim().length < 3) return 'Username must be at least 3 characters.';
      if (!form.password) return 'Password is required.';
      if (form.password.length < 6) return 'Password must be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 1) {
      if (!form.age) return 'Age is required.';
      const age = parseInt(form.age);
      if (age < 10 || age > 100) return 'Age must be between 10 and 100.';
      if (!form.gender) return 'Please select your gender.';
      if (!form.height_cm) return 'Height is required.';
      if (!form.weight_kg) return 'Weight is required.';
    }
    if (step === 2) {
      if (!form.fitness_goal) return 'Please select a fitness goal.';
      if (!form.activity_level) return 'Please select your activity level.';
      if (!form.workout_days) return 'Workout days per week is required.';
      const days = parseInt(form.workout_days);
      if (days < 1 || days > 7) return 'Workout days must be between 1 and 7.';
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleBack = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const data: SignupData = {
        username: form.username.trim(),
        password: form.password,
        age: parseInt(form.age),
        gender: form.gender,
        height_cm: parseFloat(form.height_cm),
        weight_kg: parseFloat(form.weight_kg),
        fitness_goal: form.fitness_goal,
        activity_level: form.activity_level,
        injuries: form.injuries,
        workout_days: parseInt(form.workout_days),
      };
      await signup(data);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step progress bar ─────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i <= step ? 'linear-gradient(135deg,#00F5A0,#00c8ff)' : 'rgba(0,245,160,0.08)',
              border: i <= step ? 'none' : '1px solid rgba(0,245,160,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: i <= step ? '#002e1e' : '#4a5a6a',
              fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '0.75rem',
              transition: 'all 0.3s',
            }}>{i < step ? '✓' : i + 1}</div>
            <span style={{ fontSize: '0.68rem', color: i === step ? '#00F5A0' : '#4a5a6a', marginTop: 5, fontWeight: i === step ? 600 : 400, letterSpacing: '0.04em', textAlign: 'center' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      {/* connector line */}
      <div style={{ position: 'relative', height: 2, background: 'rgba(0,245,160,0.08)', borderRadius: 4, marginTop: -36, zIndex: -1, marginLeft: 14, marginRight: 14 }}>
        <div style={{ height: '100%', width: `${(step / (STEPS.length - 1)) * 100}%`, background: 'linear-gradient(90deg, #00F5A0, #00c8ff)', borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0f1e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'Inter, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,160,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,160,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,160,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(12, 25, 48, 0.78)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(0,245,160,0.12)',
        borderRadius: '1.5rem', padding: '44px 44px', width: '100%', maxWidth: 480,
        boxShadow: '0 0 80px rgba(0,245,160,0.06), 0 40px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00F5A0, #00c8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 16, color: '#002e1e' }}>F</div>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#e8f4ff' }}>FitAI</span>
        </a>

        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.65rem', color: '#e8f4ff', marginBottom: 4, letterSpacing: '-0.02em' }}>
          Create your account
        </h1>
        <p style={{ color: '#5a6f85', fontSize: '0.88rem', marginBottom: 28 }}>
          Build your personalized AI fitness profile.
        </p>

        <ProgressBar />

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} noValidate>

          {/* ── STEP 0: Account ─────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Username</label>
                <input id="signup-username" type="text" value={form.username} onChange={e => set('username', e.target.value)}
                  placeholder="Choose a username" style={inputStyle} onFocus={onFocusBorder} onBlur={onBlurBorder} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input id="signup-password" type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters"
                    style={{ ...inputStyle, paddingRight: '3.5rem' }} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a6f85', fontSize: '0.78rem' }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input id="signup-confirm-password" type={showPassword ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat your password"
                  style={inputStyle} onFocus={onFocusBorder} onBlur={onBlurBorder} />
              </div>
            </div>
          )}

          {/* ── STEP 1: Physical Stats ────────────────────────────────── */}
          {step === 1 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input id="signup-age" type="number" value={form.age} onChange={e => set('age', e.target.value)}
                    placeholder="e.g. 25" min={10} max={100} style={inputStyle} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select id="signup-gender" value={form.gender} onChange={e => set('gender', e.target.value)}
                    style={selectStyle} onFocus={onFocusBorder} onBlur={onBlurBorder}>
                    <option value="" disabled>Select…</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input id="signup-height" type="number" value={form.height_cm} onChange={e => set('height_cm', e.target.value)}
                    placeholder="e.g. 175" style={inputStyle} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                </div>
                <div>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input id="signup-weight" type="number" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)}
                    placeholder="e.g. 70" style={inputStyle} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Goals ─────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Fitness Goal</label>
                <select id="signup-goal" value={form.fitness_goal} onChange={e => set('fitness_goal', e.target.value)}
                  style={selectStyle} onFocus={onFocusBorder} onBlur={onBlurBorder}>
                  <option value="" disabled>Select your goal…</option>
                  <option>Lose Weight</option>
                  <option>Build Muscle</option>
                  <option>Improve Endurance</option>
                  <option>Stay Active</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Activity Level</label>
                <select id="signup-activity" value={form.activity_level} onChange={e => set('activity_level', e.target.value)}
                  style={selectStyle} onFocus={onFocusBorder} onBlur={onBlurBorder}>
                  <option value="" disabled>Select level…</option>
                  <option>Sedentary</option>
                  <option>Lightly Active</option>
                  <option>Moderately Active</option>
                  <option>Very Active</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Injuries / Limitations</label>
                  <textarea id="signup-injuries" value={form.injuries} onChange={e => set('injuries', e.target.value)}
                    placeholder="e.g. Left knee pain, lower back issues (or leave blank)"
                    rows={2}
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 } as React.CSSProperties}
                    onFocus={onFocusBorder as any} onBlur={onBlurBorder as any}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Workout Days / Week</label>
                  <input id="signup-workout-days" type="number" value={form.workout_days} onChange={e => set('workout_days', e.target.value)}
                    placeholder="1–7" min={1} max={7} style={inputStyle} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(255,80,80,0.09)', border: '1px solid rgba(255,80,80,0.22)', borderRadius: '0.65rem', padding: '10px 14px', marginBottom: 18, color: '#ff7070', fontSize: '0.84rem' }}>
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            {step > 0 && (
              <button type="button" onClick={handleBack}
                style={{ flex: 1, background: 'transparent', border: '1px solid rgba(0,245,160,0.2)', borderRadius: 9999, padding: '0.85rem', color: '#8a9bb0', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,160,0.4)'; (e.currentTarget as HTMLElement).style.color = '#e8f4ff'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,160,0.2)'; (e.currentTarget as HTMLElement).style.color = '#8a9bb0'; }}
              >← Back</button>
            )}
            <button
              id={step === 2 ? 'signup-submit' : 'signup-next'}
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                background: loading ? 'rgba(0,245,160,0.4)' : 'linear-gradient(135deg, #00F5A0, #00ec9a)',
                color: '#002e1e', fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                fontSize: '0.95rem', padding: '0.88rem', borderRadius: 9999,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 28px rgba(0,245,160,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 48px rgba(0,245,160,0.5)'; }}
              onMouseOut={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(0,245,160,0.3)'; }}
            >
              {loading ? 'Creating account…' : step === 2 ? 'Create Account →' : 'Continue →'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: 26, color: '#4a5a6a', fontSize: '0.86rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00F5A0', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
