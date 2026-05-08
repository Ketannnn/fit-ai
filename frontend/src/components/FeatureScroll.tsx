import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ─── Visuals ────────────────────────────────────────────────────────────────

function BMIVisual() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);
  const category =
    bmi < 18.5 ? { label: 'Underweight', color: '#00c8ff' }
    : bmi < 25 ? { label: 'Normal', color: '#00F5A0' }
    : bmi < 30 ? { label: 'Overweight', color: '#f59e0b' }
    : { label: 'Obese', color: '#ef4444' };

  const pct = Math.min(Math.max((bmi - 10) / 30, 0), 1) * 100;

  return (
    <div style={{ padding: 32, borderRadius: '1.5rem', background: 'rgba(12,22,44,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,245,160,0.12)', width: '100%', maxWidth: 380 }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>BMI Calculator</p>

      {[{ label: 'Height (cm)', value: height, setter: setHeight, min: 140, max: 220 },
        { label: 'Weight (kg)', value: weight, setter: setWeight, min: 30, max: 180 }].map(s => (
        <div key={s.label} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#8a9bb0', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem' }}>{s.label}</span>
            <span style={{ color: '#e8f4ff', fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>{s.value}</span>
          </div>
          <input type="range" min={s.min} max={s.max} value={s.value}
            onChange={e => s.setter(+e.target.value)}
            style={{ width: '100%', accentColor: '#00F5A0', cursor: 'pointer', height: 4 }} />
        </div>
      ))}

      {/* BMI gauge bar */}
      <div style={{ marginTop: 28, padding: '20px 20px', background: 'rgba(5,12,25,0.7)', borderRadius: '1rem', border: '1px solid rgba(0,245,160,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <span style={{ color: '#6a7a8e', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem' }}>Your BMI</span>
          <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '2.4rem', color: category.color, lineHeight: 1, transition: 'color 0.4s ease' }}>{bmi}</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden', marginBottom: 10 }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: 9999, background: `linear-gradient(90deg, #00c8ff, ${category.color})` }} />
        </div>
        {/* Category pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[{ l: 'Under', c: '#00c8ff' }, { l: 'Normal', c: '#00F5A0' }, { l: 'Over', c: '#f59e0b' }, { l: 'Obese', c: '#ef4444' }].map(t => (
            <span key={t.l} style={{ fontSize: '0.68rem', fontFamily: 'Inter,sans-serif', color: category.label.startsWith(t.l) ? t.c : '#2e3f52', fontWeight: category.label.startsWith(t.l) ? 700 : 400, transition: 'color 0.3s' }}>{t.l}</span>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 12, fontFamily: 'Manrope,sans-serif', fontWeight: 700, color: category.color, fontSize: '0.95rem', transition: 'color 0.4s' }}>{category.label}</p>
      </div>
    </div>
  );
}

function PoseVisual() {
  const joints = [
    { id: 'head', cx: 100, cy: 40, r: 14 },
    { id: 'lshoulder', cx: 70, cy: 80 }, { id: 'rshoulder', cx: 130, cy: 80 },
    { id: 'lelbow', cx: 50, cy: 125 }, { id: 'relbow', cx: 150, cy: 125 },
    { id: 'lwrist', cx: 38, cy: 170 }, { id: 'rwrist', cx: 162, cy: 170 },
    { id: 'lhip', cx: 80, cy: 155 }, { id: 'rhip', cx: 120, cy: 155 },
    { id: 'lknee', cx: 75, cy: 220 }, { id: 'rknee', cx: 125, cy: 220 },
    { id: 'lankle', cx: 70, cy: 280 }, { id: 'rankle', cx: 130, cy: 280 },
  ];
  const bones = [
    ['head','lshoulder'],['head','rshoulder'],['lshoulder','rshoulder'],
    ['lshoulder','lelbow'],['lelbow','lwrist'],
    ['rshoulder','relbow'],['relbow','rwrist'],
    ['lshoulder','lhip'],['rshoulder','rhip'],['lhip','rhip'],
    ['lhip','lknee'],['lknee','lankle'],
    ['rhip','rknee'],['rknee','rankle'],
  ];
  const jMap = Object.fromEntries(joints.map(j => [j.id, j]));

  return (
    <div style={{ padding: 28, borderRadius: '1.5rem', background: 'rgba(12,22,44,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,245,160,0.12)', width: '100%', maxWidth: 380 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pose Detection</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 7, height: 7, borderRadius: '50%', background: '#00F5A0', display: 'inline-block', boxShadow: '0 0 8px #00F5A0' }} />
          <span style={{ color: '#00F5A0', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      <div style={{ background: 'rgba(5,12,25,0.7)', borderRadius: '1rem', padding: 16, border: '1px solid rgba(0,245,160,0.06)', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 200 310" width="180" height="280">
          {bones.map(([a, b]) => {
            const ja = jMap[a]; const jb = jMap[b];
            return <motion.line key={`${a}-${b}`} 
              x1={ja.cx} y1={ja.cy} x2={jb.cx} y2={jb.cy}
              initial={{ opacity: 0.5 }}
              stroke="#00F5A0" strokeWidth={2} strokeLinecap="round"
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 2.5, delay: Math.random() * 1 }} />;
          })}
          {joints.map(j => (
            <motion.circle key={j.id} 
              cx={j.cx} cy={j.cy} 
              initial={{ r: j.r ?? 5, opacity: 0.7 }}
              r={j.r ?? 5} fill="#00F5A0"
              animate={{ 
                r: j.r ? [j.r, j.r + 2, j.r] : [5, 7, 5], 
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ repeat: Infinity, duration: 1.8, delay: Math.random() * 1.5 }} />
          ))}
          {/* confidence score labels */}
          {[{x:155,y:82,v:'0.97'},{x:30,y:80,v:'0.95'},{x:145,y:128,v:'0.92'},{x:60,y:225,v:'0.98'}].map((t,i) =>
            <text key={i} x={t.x} y={t.y} fill="#00c8ff" fontSize="9" fontFamily="Inter,sans-serif">{t.v}</text>
          )}
        </svg>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[{l:'Joints Tracked',v:'13'},{l:'Confidence',v:'96%'},{l:'FPS',v:'30'},{l:'Latency',v:'12ms'}].map(s => (
          <div key={s.l} style={{ background: 'rgba(5,12,25,0.7)', borderRadius: '0.75rem', padding: '10px 14px', border: '1px solid rgba(0,245,160,0.06)' }}>
            <div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, color: '#00F5A0', fontSize: '1.2rem' }}>{s.v}</div>
            <div style={{ fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RepVisual() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (running && count < 15) {
      t = setTimeout(() => setCount(c => c + 1), 600);
    } else if (count >= 15) {
      setRunning(false);
    }
    return () => clearTimeout(t);
  }, [running, count]);

  const exercises = [
    { name: 'Bicep Curl', icon: '💪', target: 15, done: count },
    { name: 'Push Up', icon: '🏋️', target: 20, done: 20 },
    { name: 'Squat', icon: '🦵', target: 10, done: 10 },
  ];

  return (
    <div style={{ padding: 28, borderRadius: '1.5rem', background: 'rgba(12,22,44,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,245,160,0.12)', width: '100%', maxWidth: 380 }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Rep Counter</p>

      {/* Big live counter */}
      <div style={{ textAlign: 'center', padding: '24px 0', background: 'rgba(5,12,25,0.7)', borderRadius: '1rem', marginBottom: 20, border: '1px solid rgba(0,245,160,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Current Exercise: Bicep Curl</div>
        <motion.div
          key={count}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '6rem', color: '#00F5A0', lineHeight: 1, textShadow: '0 0 40px rgba(0,245,160,0.4)' }}
        >{count}</motion.div>
        <div style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem' }}>of 15 reps</div>
        {/* Progress */}
        <div style={{ margin: '16px 20px 0', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 9999, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${(count / 15) * 100}%` }} transition={{ ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #00F5A0, #00c8ff)', borderRadius: 9999 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={() => { setCount(0); setRunning(true); }}
          style={{ flex: 1, padding: '10px 0', borderRadius: 9999, background: 'linear-gradient(135deg,#00F5A0,#00ec9a)', color: '#002e1e', fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,245,160,0.3)' }}>
          {running ? '⏸ Pause' : '▶ Start Demo'}
        </button>
        <button onClick={() => { setCount(0); setRunning(false); }}
          style={{ padding: '10px 18px', borderRadius: 9999, background: 'transparent', color: '#8a9bb0', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: '0.85rem', border: '1px solid rgba(138,155,176,0.2)', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      {exercises.map(e => (
        <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>{e.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#8a9bb0', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem' }}>{e.name}</span>
              <span style={{ color: e.done >= e.target ? '#00F5A0' : '#e8f4ff', fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>{e.done}/{e.target}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 9999 }}>
              <div style={{ height: '100%', borderRadius: 9999, width: `${Math.min((e.done/e.target)*100,100)}%`, background: e.done >= e.target ? '#00F5A0' : 'rgba(0,245,160,0.4)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormVisual() {
  const [mode, setMode] = useState<'bad' | 'good'>('bad');
  const joints = [
    { id: 'head', cx: 100, cy: 38, r: 12 },
    { id: 'ls', cx: 72, cy: 78 }, { id: 'rs', cx: 128, cy: 78 },
    { id: 'le', cx: 48, cy: 122 }, { id: 're', cx: 152, cy: 122 },
    { id: 'lw', cx: 36, cy: 160 }, { id: 'rw', cx: 164, cy: 160 },
    { id: 'lh', cx: mode === 'bad' ? 82 : 80, cy: mode === 'bad' ? 148 : 155 },
    { id: 'rh', cx: mode === 'bad' ? 118 : 120, cy: mode === 'bad' ? 148 : 155 },
    { id: 'lk', cx: mode === 'bad' ? 68 : 78, cy: mode === 'bad' ? 208 : 218 },
    { id: 'rk', cx: mode === 'bad' ? 132 : 122, cy: mode === 'bad' ? 208 : 218 },
    { id: 'la', cx: mode === 'bad' ? 60 : 74, cy: 275 },
    { id: 'ra', cx: mode === 'bad' ? 140 : 126, cy: 275 },
  ];
  const jMap = Object.fromEntries(joints.map(j => [j.id, j]));
  const badJoints = ['lk','rk','lh','rh'];
  const bones = [['head','ls'],['head','rs'],['ls','rs'],['ls','le'],['le','lw'],['rs','re'],['re','rw'],['ls','lh'],['rs','rh'],['lh','rh'],['lh','lk'],['lk','la'],['rh','rk'],['rk','ra']];

  return (
    <div style={{ padding: 28, borderRadius: '1.5rem', background: 'rgba(12,22,44,0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${mode === 'bad' ? 'rgba(239,68,68,0.25)' : 'rgba(0,245,160,0.2)'}`, width: '100%', maxWidth: 380, transition: 'border-color 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Form Correction</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['bad','good'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '5px 14px', borderRadius: 9999, border: `1px solid ${mode === m ? (m === 'bad' ? 'rgba(239,68,68,0.5)' : 'rgba(0,245,160,0.5)') : 'rgba(255,255,255,0.08)'}`, background: mode === m ? (m === 'bad' ? 'rgba(239,68,68,0.1)' : 'rgba(0,245,160,0.08)') : 'transparent', color: mode === m ? (m === 'bad' ? '#ef4444' : '#00F5A0') : '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s', textTransform: 'capitalize' }}>{m}</button>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(5,12,25,0.7)', borderRadius: '1rem', padding: 16, border: `1px solid rgba(${mode === 'bad' ? '239,68,68' : '0,245,160'},0.08)`, display: 'flex', justifyContent: 'center', transition: 'border-color 0.5s' }}>
        <svg viewBox="0 0 200 300" width="160" height="240">
          {bones.map(([a, b]) => {
            const ja = jMap[a]; const jb = jMap[b];
            const bad = mode === 'bad' && (badJoints.includes(a) || badJoints.includes(b));
            return <motion.line key={`${a}-${b}`} 
              initial={{ x1: ja.cx, y1: ja.cy, x2: jb.cx, y2: jb.cy }}
              x1={ja.cx} y1={ja.cy} x2={jb.cx} y2={jb.cy}
              animate={{ x1: ja.cx, y1: ja.cy, x2: jb.cx, y2: jb.cy }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              stroke={bad ? '#ef4444' : '#00F5A0'} strokeWidth={2} strokeLinecap="round" />;
          })}
          {joints.map(j => {
            const bad = mode === 'bad' && badJoints.includes(j.id);
            const radius = j.r ?? 5;
            return <motion.circle key={j.id} 
              initial={{ cx: j.cx, cy: j.cy }}
              animate={{ cx: j.cx, cy: j.cy }} 
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              cx={j.cx} cy={j.cy} r={radius} fill={bad ? '#ef4444' : '#00F5A0'}
              style={{ filter: bad ? 'drop-shadow(0 0 6px #ef4444)' : 'drop-shadow(0 0 4px #00F5A0)' }} />;
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
          style={{ marginTop: 16, padding: '14px 16px', borderRadius: '0.85rem', background: mode === 'bad' ? 'rgba(239,68,68,0.07)' : 'rgba(0,245,160,0.07)', border: `1px solid ${mode === 'bad' ? 'rgba(239,68,68,0.18)' : 'rgba(0,245,160,0.15)'}` }}>
          {mode === 'bad' ? (
            <>
              <p style={{ color: '#ef4444', fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>⚠ Form Issues Detected</p>
              <p style={{ color: '#8a9bb0', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', lineHeight: 1.6 }}>Knees extending beyond toes. Hip alignment is off. Adjust your stance.</p>
            </>
          ) : (
            <>
              <p style={{ color: '#00F5A0', fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>✓ Perfect Form!</p>
              <p style={{ color: '#8a9bb0', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', lineHeight: 1.6 }}>Joint alignment is excellent. Great depth and knee tracking.</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WorkoutVisual() {
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const plans: Record<string, { ex: string; sets: string; rest: string; color: string }[]> = {
    Beginner: [
      { ex: 'Bodyweight Squat', sets: '3 × 10', rest: '90s', color: '#00F5A0' },
      { ex: 'Wall Push-Up', sets: '3 × 12', rest: '60s', color: '#00c8ff' },
      { ex: 'Glute Bridge', sets: '3 × 15', rest: '60s', color: '#00F5A0' },
    ],
    Intermediate: [
      { ex: 'Barbell Squat', sets: '4 × 8', rest: '120s', color: '#f59e0b' },
      { ex: 'Push-Up', sets: '4 × 15', rest: '60s', color: '#00F5A0' },
      { ex: 'Dumbbell Row', sets: '4 × 10', rest: '90s', color: '#00c8ff' },
    ],
    Advanced: [
      { ex: 'Deadlift', sets: '5 × 5', rest: '180s', color: '#ef4444' },
      { ex: 'Weighted Pull-Up', sets: '4 × 6', rest: '120s', color: '#f59e0b' },
      { ex: 'Box Jump', sets: '4 × 8', rest: '90s', color: '#00F5A0' },
    ],
  };

  return (
    <div style={{ padding: 28, borderRadius: '1.5rem', background: 'rgba(12,22,44,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,245,160,0.12)', width: '100%', maxWidth: 380 }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Workout Planner</p>

      {/* Level selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(5,12,25,0.7)', borderRadius: 9999, padding: 4 }}>
        {(['Beginner','Intermediate','Advanced'] as const).map(l => (
          <button key={l} onClick={() => setLevel(l)}
            style={{ flex: 1, padding: '7px 0', borderRadius: 9999, border: 'none', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', background: level === l ? 'linear-gradient(135deg,#00F5A0,#00ec9a)' : 'transparent', color: level === l ? '#002e1e' : '#4a5a6a', transition: 'all 0.25s' }}
          >{l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={level} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
          {plans[level].map((p, i) => (
            <motion.div key={p.ex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', marginBottom: 8, background: 'rgba(5,12,25,0.7)', borderRadius: '0.85rem', borderLeft: `3px solid ${p.color}` }}>
              <div>
                <div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 700, color: '#e8f4ff', fontSize: '0.9rem', marginBottom: 2 }}>{p.ex}</div>
                <div style={{ fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '0.75rem' }}>Rest: {p.rest}</div>
              </div>
              <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, color: p.color, fontSize: '0.95rem', background: `rgba(0,245,160,0.06)`, padding: '4px 10px', borderRadius: 9999 }}>{p.sets}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: '0.85rem', background: 'rgba(0,245,160,0.05)', border: '1px solid rgba(0,245,160,0.12)', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Inter,sans-serif', color: '#00F5A0', fontSize: '0.82rem', fontWeight: 600 }}>✓ AI-generated for your profile</span>
      </div>
    </div>
  );
}

// ─── Feature scroll sections ─────────────────────────────────────────────────

const FEATURES = [
  {
    tag: 'Health Metrics',
    title: 'Know Your Body,\nInside Out.',
    desc: 'FitAI calculates your BMI in real-time and maps you onto a health spectrum. Instantly know where you stand and what to work on.',
    Visual: BMIVisual,
  },
  {
    tag: 'Computer Vision',
    title: 'AI Eyes That\nNever Miss.',
    desc: 'MediaPipe-powered pose detection tracks 13 body joints at 30 FPS. Your movements are analyzed with 96%+ confidence, in real-time.',
    Visual: PoseVisual,
  },
  {
    tag: 'Auto Counting',
    title: 'Every Rep.\nCounted. Perfectly.',
    desc: 'No buttons. No guessing. FitAI detects each repetition automatically — bicep curls, push-ups, squats — all with motion analysis.',
    Visual: RepVisual,
  },
  {
    tag: 'Form Analysis',
    title: 'Perfect Form.\nEvery Time.',
    desc: 'Bad posture is detected in milliseconds and flagged on the skeleton overlay. Green for good. Red for fix it — before you get injured.',
    Visual: FormVisual,
  },
  {
    tag: 'Smart Planning',
    title: 'Your Plan.\nNo One Else\'s.',
    desc: 'Tell FitAI your fitness level and it generates a full workout schedule — sets, reps, rest periods — updated as you improve.',
    Visual: WorkoutVisual,
  },
];

// ─── Single feature section ───────────────────────────────────────────────────

function FeatureSection({ feature, index }: { feature: typeof FEATURES[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.1, 0.3], [60, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0.92, 1, 1, 0.95]);
  const xVisual = useTransform(scrollYProgress, [0.1, 0.35], [index % 2 === 0 ? 80 : -80, 0]);

  return (
    <section ref={ref} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
      {/* Ambient glow per section */}
      <div style={{ position: 'absolute', top: '50%', left: index % 2 === 0 ? '-5%' : '75%', transform: 'translateY(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,160,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        {/* Text (left or right based on index) */}
        <motion.div style={{ opacity, y, order: index % 2 === 0 ? 0 : 1 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', color: '#00F5A0', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20, fontWeight: 600 }}>
            0{index + 1} — {feature.tag}
          </p>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#e8f4ff', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24, whiteSpace: 'pre-line' }}>
            {feature.title}
          </h2>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '1.05rem', color: '#6a7a8e', lineHeight: 1.78, maxWidth: 440 }}>
            {feature.desc}
          </p>

          {/* Scroll cue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 40 }}>
            <div style={{ width: 32, height: 1, background: 'rgba(0,245,160,0.3)' }} />
            <span style={{ color: '#2e3f52', fontFamily: 'Inter,sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SCROLL TO EXPLORE</span>
          </div>
        </motion.div>

        {/* Visual (opposite side) */}
        <motion.div style={{ scale, opacity, x: xVisual, order: index % 2 === 0 ? 1 : 0, display: 'flex', justifyContent: 'center' }}>
          <feature.Visual />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div style={{ position: 'fixed', top: 72, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #00F5A0, #00c8ff)', scaleX, transformOrigin: '0%', zIndex: 100, boxShadow: '0 0 12px rgba(0,245,160,0.5)' }} />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FeatureScroll() {
  return (
    <>
      <ScrollProgressBar />
      <div style={{ background: '#0a0f1e', position: 'relative' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', padding: '100px 24px 60px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,245,160,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <p style={{ fontFamily: 'Inter,sans-serif', color: '#00F5A0', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>The Full Toolkit</p>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#e8f4ff', letterSpacing: '-0.03em', maxWidth: 700, margin: '0 auto' }}>
            Five Ways AI Makes You Fit
          </h2>
        </div>

        {FEATURES.map((f, i) => (
          <FeatureSection key={f.tag} feature={f} index={i} />
        ))}
      </div>
    </>
  );
}
