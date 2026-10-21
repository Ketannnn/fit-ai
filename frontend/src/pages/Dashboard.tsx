import { useState, useEffect } from 'react';
import type React from 'react';
import { useAuth, type BmiHistoryPoint } from '../context/AuthContext';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Scale, TrendingUp, Save, 
  Target, Flame, Calendar, Info, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import EmbeddedTrainer from '../components/EmbeddedTrainer';
import Navbar from '../components/Navbar';

interface DashboardProps {
  defaultTab?: 'analytics' | 'trainer';
}

export default function Dashboard({ defaultTab }: DashboardProps) {
  const { user, updateStats, getBmiHistory } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryTab = searchParams.get('tab') || searchParams.get('view');
  const isTrainerRoute = location.pathname.startsWith('/trainer') ||
    location.pathname.startsWith('/app') ||
    location.pathname.startsWith('/live-trainer') ||
    location.pathname.startsWith('/workout') ||
    location.pathname.startsWith('/exercise-tracker');

  const [activeTab, setActiveTab] = useState<'analytics' | 'trainer'>(
    isTrainerRoute || queryTab === 'trainer' ? 'trainer' : (defaultTab || 'analytics')
  );
  const [height, setHeight] = useState(user?.height_cm || 170);
  const [weight, setWeight] = useState(user?.weight_kg || 70);
  const [history, setHistory] = useState<BmiHistoryPoint[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Sync tab state whenever route changes (SPA back/forward navigation support)
  useEffect(() => {
    if (isTrainerRoute || queryTab === 'trainer') {
      setActiveTab('trainer');
    } else if (location.pathname === '/dashboard' || queryTab === 'analytics') {
      setActiveTab('analytics');
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.pathname, queryTab, defaultTab, isTrainerRoute]);

  // Auth requirement: Analytics requires login, Trainer allows Guest preview
  useEffect(() => {
    if (!user && activeTab === 'analytics') {
      navigate('/login?redirect=/dashboard');
    }
  }, [user, activeTab, navigate]);

  const switchTab = (tab: 'analytics' | 'trainer') => {
    if (tab === 'analytics' && !user) {
      navigate('/login?redirect=/dashboard');
      return;
    }
    setActiveTab(tab);
    if (tab === 'trainer') {
      navigate('/trainer');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (user) {
      setHeight(user.height_cm);
      setWeight(user.weight_kg);
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const data = await getBmiHistory();
    setHistory(data);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateStats(height, weight);
      await fetchHistory();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateBMI = (h: number, w: number) => {
    const bmiVal = (w / ((h / 100) ** 2));
    return isNaN(bmiVal) ? "0.0" : bmiVal.toFixed(1);
  };

  const bmi = parseFloat(calculateBMI(height, weight));

  const getBMICategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (bmiVal < 25) return { label: 'Normal', color: '#00F5A0' };
    if (bmiVal < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const category = getBMICategory(bmi);

  if (!user && activeTab === 'analytics') return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0f1e', 
      color: '#e8f4ff', 
      fontFamily: 'Inter, sans-serif'
    }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 40px' }}>
        
        {/* Guest mode notification banner */}
        {!user && activeTab === 'trainer' && (
          <div style={{
            marginBottom: 24,
            padding: '14px 20px',
            borderRadius: 14,
            background: 'rgba(0, 200, 255, 0.08)',
            border: '1px solid rgba(0, 200, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <span style={{ color: '#cde9ff', fontSize: '0.9rem' }}>
                <strong>Guest Mode:</strong> AI Vision tracking is active inline. Log in or sign up to save your workout streaks and health metrics.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login?redirect=/trainer" style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#e8f4ff', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>Log In</Link>
              <Link to="/signup" style={{ padding: '6px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #00F5A0, #00c8ff)', color: '#002e1e', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>Sign Up Free</Link>
            </div>
          </div>
        )}

        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 style={{ 
              fontFamily: 'Manrope, sans-serif', 
              fontSize: '2rem', 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8
            }}>
              {user ? `Welcome back, ${user.username}!` : 'FitAI Live Exercise Trainer'}
            </h1>
            <p style={{ color: '#8a9bb0', fontSize: '0.95rem' }}>
              {activeTab === 'trainer'
                ? 'Real-time joint tracking, rep counting & posture coaching running inline.'
                : 'Track your fitness journey and health metrics.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Link
              to="/"
              style={{
                padding: '0.75rem 1.3rem', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                background: 'rgba(255,255,255,0.05)',
                color: '#8a9bb0', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.25s ease',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
              onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8f4ff'; }}
              onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8a9bb0'; }}
            >
              ← Back to Home
            </Link>
            <button
              id="dashboard-view-toggle-btn"
              onClick={() => switchTab(activeTab === 'trainer' ? 'analytics' : 'trainer')}
              style={{
                padding: '0.75rem 1.6rem', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                background: activeTab === 'trainer'
                  ? 'rgba(0, 245, 160, 0.12)'
                  : 'linear-gradient(135deg, #00F5A0, #00c8ff)',
                color: activeTab === 'trainer' ? '#00F5A0' : '#002e1e',
                border: activeTab === 'trainer' ? '1px solid rgba(0, 245, 160, 0.3)' : 'none',
                boxShadow: activeTab === 'trainer' ? 'none' : '0 8px 24px rgba(0,245,160,0.25)',
                transition: 'all 0.25s ease',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              {activeTab === 'trainer' ? (
                <><TrendingUp size={18} /> View Analytics Hub</>
              ) : (
                <><Activity size={18} /> Launch AI Trainer</>
              )}
            </button>
          </div>
        </header>

        {/* Inline View Switcher Tabs */}
        <div style={{
          display: 'inline-flex',
          padding: 5,
          background: 'rgba(18, 25, 45, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 28,
          gap: 6
        }}>
          <button
            id="tab-analytics-btn"
            onClick={() => switchTab('analytics')}
            style={{
              padding: '9px 20px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: activeTab === 'analytics' ? 'rgba(0, 245, 160, 0.16)' : 'transparent',
              color: activeTab === 'analytics' ? '#00F5A0' : '#8a9bb0',
              boxShadow: activeTab === 'analytics' ? '0 0 16px rgba(0, 245, 160, 0.18)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <TrendingUp size={16} /> Health Analytics
          </button>

          <button
            id="tab-trainer-btn"
            onClick={() => switchTab('trainer')}
            style={{
              padding: '9px 20px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: activeTab === 'trainer' ? 'rgba(0, 200, 255, 0.18)' : 'transparent',
              color: activeTab === 'trainer' ? '#00c8ff' : '#8a9bb0',
              boxShadow: activeTab === 'trainer' ? '0 0 16px rgba(0, 200, 255, 0.2)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Zap size={16} /> Live AI Trainer
          </button>
        </div>

        {/* View Content (Inline SPA) */}
        <AnimatePresence mode="wait">
          {activeTab === 'trainer' ? (
            <motion.div
              key="trainer-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <EmbeddedTrainer username={user ? user.username : 'Guest'} />
            </motion.div>
          ) : (
            <motion.div
              key="analytics-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}
            >
          
          {/* Left Column: Stats & Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* BMI Calculator Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(18, 25, 45, 0.6)',
                backdropFilter: 'blur(16px)',
                borderRadius: 24,
                padding: 32,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ 
                  background: 'rgba(0, 245, 160, 0.1)', 
                  padding: 8, 
                  borderRadius: 10,
                  color: '#00F5A0'
                }}>
                  <Scale size={20} />
                </div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>BMI Calculator</h2>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: '#8a9bb0', fontSize: '0.9rem' }}>Height</span>
                  <span style={{ fontWeight: 700, color: '#e8f4ff' }}>{height} <span style={{ color: '#4a5568', fontWeight: 400 }}>cm</span></span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="250" 
                  value={height} 
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    height: 6, 
                    borderRadius: 3, 
                    background: 'rgba(255,255,255,0.1)',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: '#8a9bb0', fontSize: '0.9rem' }}>Weight</span>
                  <span style={{ fontWeight: 700, color: '#e8f4ff' }}>{weight} <span style={{ color: '#4a5568', fontWeight: 400 }}>kg</span></span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="200" 
                  value={weight} 
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    height: 6, 
                    borderRadius: 3, 
                    background: 'rgba(255,255,255,0.1)',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: 20, 
                padding: 24, 
                textAlign: 'center',
                marginBottom: 24,
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <span style={{ color: '#8a9bb0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Your BMI</span>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 900, 
                  color: category.color,
                  margin: '8px 0',
                  textShadow: `0 0 20px ${category.color}44`
                }}>
                  {bmi}
                </div>
                <div style={{ 
                  color: category.color, 
                  fontWeight: 600, 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: category.color }} />
                  {category.label}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isUpdating}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 14,
                  border: '1px solid rgba(0,245,160,0.2)',
                  background: isUpdating ? 'rgba(0,245,160,0.2)' : 'rgba(0,245,160,0.1)',
                  color: '#00F5A0',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'all 0.2s ease',
                }}
              >
                {isUpdating ? 'Saving...' : <><Save size={18} /> Save Stats</>}
              </button>
            </motion.div>

            {/* Profile Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'rgba(18, 25, 45, 0.4)',
                borderRadius: 24,
                padding: 24,
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Target size={18} color="#00c8ff" />
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem' }}>Fitness Profile</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Goal</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.fitness_goal || 'General Fitness'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Activity</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.activity_level || 'Moderate'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Age</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.age || '--'} yrs</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Gender</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.gender || 'Not specified'}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Graph & Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* BMI History Graph */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'rgba(18, 25, 45, 0.6)',
                backdropFilter: 'blur(16px)',
                borderRadius: 24,
                padding: 32,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                height: 480,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ 
                    background: 'rgba(0, 200, 255, 0.1)', 
                    padding: 8, 
                    borderRadius: 10,
                    color: '#00c8ff'
                  }}>
                    <TrendingUp size={20} />
                  </div>
                  <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>BMI Progress</h2>
                </div>
                <div style={{ color: '#8a9bb0', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20 }}>
                  Last {history.length} updates
                </div>
              </div>

              <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history.map(p => ({
                    ...p,
                    date: new Date(p.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }))}>
                    <defs>
                      <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00F5A0" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#4a5568', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#4a5568', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: '#1a2235', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: 12,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                      }}
                      itemStyle={{ color: '#00F5A0', fontWeight: 600 }}
                      labelStyle={{ color: '#8a9bb0', marginBottom: 4 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bmi" 
                      stroke="#00F5A0" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorBmi)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Quick Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: 'rgba(18, 25, 45, 0.4)',
                  borderRadius: 24,
                  padding: 24,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{ background: 'rgba(255, 107, 107, 0.1)', padding: 12, borderRadius: 16, color: '#ff6b6b' }}>
                  <Flame size={24} />
                </div>
                <div>
                  <div style={{ color: '#8a9bb0', fontSize: '0.85rem' }}>Daily Calories</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>2,450 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#4a5568' }}>kcal</span></div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(18, 25, 45, 0.4)',
                  borderRadius: 24,
                  padding: 24,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{ background: 'rgba(0, 245, 160, 0.1)', padding: 12, borderRadius: 16, color: '#00F5A0' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <div style={{ color: '#8a9bb0', fontSize: '0.85rem' }}>Workout Days</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{user?.workout_days || 0} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#4a5568' }}>/ week</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#00F5A0',
              color: '#002e1e',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 10px 30px rgba(0,245,160,0.3)',
              zIndex: 1000
            }}
          >
            <Info size={18} /> Stats updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: #00F5A0;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,245,160,0.5);
          border: 2px solid #0a0f1e;
        }
      `}} />
    </div>
  );
}
