import { useState, useEffect } from 'react';
import type React from 'react';
import { useAuth, type BmiHistoryPoint } from '../context/AuthContext';
import { STREAMLIT_URL } from '../config';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Scale, TrendingUp, Save, 
  Target, Flame, Calendar, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, updateStats, getBmiHistory } = useAuth();
  const [height, setHeight] = useState(user?.height_cm || 170);
  const [weight, setWeight] = useState(user?.weight_kg || 70);
  const [history, setHistory] = useState<BmiHistoryPoint[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user) {
      setHeight(user.height_cm);
      setWeight(user.weight_kg);
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    const data = await getBmiHistory();
    setHistory(data);
  };

  const handleSave = async () => {
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

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { label: 'Normal', color: '#00F5A0' };
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const category = getBMICategory(bmi);

  if (!user) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0f1e', 
      color: '#e8f4ff', 
      padding: '100px 24px 40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 40 
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
              Welcome back, {user.username}!
            </h1>
            <p style={{ color: '#8a9bb0', fontSize: '0.95rem' }}>
              Track your fitness journey and health metrics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link
              to="/"
              style={{
                padding: '0.8rem 1.4rem', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem',
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
            <a
              href={`${STREAMLIT_URL}?username=${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.8rem 1.8rem', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #00F5A0, #00c8ff)',
                color: '#002e1e', textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,245,160,0.25)',
                transition: 'all 0.25s ease',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <Activity size={18} /> Launch Trainer
            </a>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
          
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
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.fitness_goal}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Activity</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.activity_level}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Age</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.age} yrs</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12 }}>
                  <div style={{ color: '#8a9bb0', fontSize: '0.75rem', marginBottom: 4 }}>Gender</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.gender}</div>
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
                  <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{user.workout_days} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#4a5568' }}>/ week</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
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
