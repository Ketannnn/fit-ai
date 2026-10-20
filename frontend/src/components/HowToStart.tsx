import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ─── Card Visuals ─────────────────────────────────────────────────────────────

function AuthVisual() {
  return (
    <div style={{ padding: '20px 24px', background: 'rgba(5,12,25,0.9)', borderRadius: '1rem', width: '100%' }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>FitAI — Sign In</p>
      {['Email Address', 'Password'].map(p => (
        <div key={p} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '0.72rem', color: '#4a5a6a', fontFamily: 'Inter,sans-serif', marginBottom: 6 }}>{p}</div>
          <div style={{ height: 36, borderRadius: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,245,160,0.12)', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
            <span style={{ color: '#2e3f52', fontSize: '0.8rem', fontFamily: 'Inter,sans-serif' }}>{p === 'Email Address' ? 'you@example.com' : '••••••••'}</span>
          </div>
        </div>
      ))}
      <div style={{ height: 36, marginTop: 16, borderRadius: 9999, background: 'linear-gradient(135deg,#00F5A0,#00ec9a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#002e1e' }}>Continue →</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <span style={{ color: '#2e3f52', fontFamily: 'Inter,sans-serif', fontSize: '0.72rem' }}>Or continue with Google</span>
      </div>
    </div>
  );
}

function GoalsVisual() {
  const stats = [{ l: 'Height', v: '175 cm' }, { l: 'Weight', v: '72 kg' }, { l: 'Goal', v: 'Fat Loss' }, { l: 'Level', v: 'Beginner' }];
  return (
    <div style={{ padding: '20px 24px', background: 'rgba(5,12,25,0.9)', borderRadius: '1rem', width: '100%' }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Your Profile</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {stats.map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '12px 14px', border: '1px solid rgba(0,245,160,0.08)' }}>
            <div style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.l}</div>
            <div style={{ color: '#00F5A0', fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '62%', background: 'linear-gradient(90deg,#00F5A0,#00c8ff)', borderRadius: 9999 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ color: '#2e3f52', fontSize: '0.68rem', fontFamily: 'Inter,sans-serif' }}>BMI: 23.5 — Normal</span>
        <span style={{ color: '#00F5A0', fontSize: '0.68rem', fontFamily: 'Inter,sans-serif' }}>62%</span>
      </div>
    </div>
  );
}

function DietVisual() {
  const meals = [
    { name: 'Oatmeal + Berries', cal: '320 kcal', tag: 'Breakfast', color: '#00F5A0' },
    { name: 'Grilled Chicken Wrap', cal: '480 kcal', tag: 'Lunch', color: '#00c8ff' },
    { name: 'Salmon + Veggies', cal: '410 kcal', tag: 'Dinner', color: '#f59e0b' },
  ];
  return (
    <div style={{ padding: '20px 24px', background: 'rgba(5,12,25,0.9)', borderRadius: '1rem', width: '100%' }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Today's Meal Plan</p>
      {meals.map(m => (
        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', borderLeft: `3px solid ${m.color}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#e8f4ff', fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>{m.name}</div>
            <div style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.7rem', marginTop: 2 }}>{m.tag}</div>
          </div>
          <span style={{ color: m.color, fontFamily: 'Manrope,sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>{m.cal}</span>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: '0.75rem', background: 'rgba(0,245,160,0.05)', border: '1px solid rgba(0,245,160,0.1)', textAlign: 'center' }}>
        <span style={{ color: '#00F5A0', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', fontWeight: 600 }}>Total: 1,210 kcal / 1,800 target</span>
      </div>
    </div>
  );
}

function WorkoutLiveVisual() {
  return (
    <div style={{ padding: '20px 24px', background: 'rgba(5,12,25,0.9)', borderRadius: '1rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI Coach</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00F5A0', display: 'inline-block' }} />
          <span style={{ color: '#00F5A0', fontSize: '0.68rem', fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(2,8,18,0.8)', borderRadius: '0.75rem', padding: '12px 0', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg,transparent,#00F5A0,transparent)', animation: 'scanLine 2.5s ease-in-out infinite', opacity: 0.8 }} />
        <svg viewBox="0 0 120 190" width="90" height="140" style={{ opacity: 0.85 }}>
          <circle cx="60" cy="18" r="8" fill="none" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="60" y1="26" x2="60" y2="72" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="60" y1="42" x2="38" y2="62" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="60" y1="42" x2="82" y2="62" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="38" y1="62" x2="30" y2="84" stroke="#00ec9a" strokeWidth="1.5"/>
          <line x1="82" y1="62" x2="90" y2="84" stroke="#00ec9a" strokeWidth="1.5"/>
          <line x1="60" y1="72" x2="48" y2="120" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="60" y1="72" x2="72" y2="120" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="48" y1="120" x2="45" y2="168" stroke="#00F5A0" strokeWidth="1.5"/>
          <line x1="72" y1="120" x2="75" y2="168" stroke="#00F5A0" strokeWidth="1.5"/>
          {[[38,62],[82,62],[48,120],[72,120]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="3.5" fill="#00F5A0"/>)}
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[{l:'Reps',v:'8'},{l:'Form',v:'92%'}].map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.65rem', padding: '10px 12px', border: '1px solid rgba(0,245,160,0.06)' }}>
            <div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, color: '#00F5A0', fontSize: '1.3rem' }}>{s.v}</div>
            <div style={{ fontFamily: 'Inter,sans-serif', color: '#2e3f52', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes scanLine{0%,100%{top:5%;opacity:0}20%{opacity:1}80%{opacity:1}98%{top:92%;opacity:0}}`}</style>
    </div>
  );
}

function ProgressVisual() {
  const weeks = [40, 55, 48, 68, 72, 80, 85];
  const maxV = 100;
  return (
    <div style={{ padding: '20px 24px', background: 'rgba(5,12,25,0.9)', borderRadius: '1rem', width: '100%' }}>
      <p style={{ color: '#4a5a6a', fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Weekly Progress</p>
      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, marginBottom: 8 }}>
        {weeks.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(v / maxV) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              style={{ width: '100%', borderRadius: '4px 4px 0 0', background: i === weeks.length - 1 ? 'linear-gradient(180deg,#00F5A0,#00ec9a)' : 'rgba(0,245,160,0.25)', boxShadow: i === weeks.length - 1 ? '0 0 12px rgba(0,245,160,0.4)' : 'none' }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        {['W1','W2','W3','W4','W5','W6','W7'].map(w => (
          <span key={w} style={{ color: '#2e3f52', fontFamily: 'Inter,sans-serif', fontSize: '0.62rem', flex: 1, textAlign: 'center' }}>{w}</span>
        ))}
      </div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[{l:'Calories',v:'18.4k'},{l:'Workouts',v:'21'},{l:'Streak',v:'7d 🔥'}].map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.65rem', padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(0,245,160,0.06)' }}>
            <div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, color: '#00F5A0', fontSize: '1rem' }}>{s.v}</div>
            <div style={{ fontFamily: 'Inter,sans-serif', color: '#2e3f52', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Steps data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    title: 'Create Your Account',
    desc: 'Quick login to unlock your personal AI fitness dashboard.',
    Visual: AuthVisual,
    accent: '#00F5A0',
  },
  {
    num: '02',
    title: 'Set Your Fitness Goals',
    desc: 'Enter your height, weight, and target. FitAI builds your profile instantly.',
    Visual: GoalsVisual,
    accent: '#00c8ff',
  },
  {
    num: '03',
    title: 'Personalized Diet Plan',
    desc: 'AI suggests meals matched to your calorie target and body goals.',
    Visual: DietVisual,
    accent: '#f59e0b',
  },
  {
    num: '04',
    title: 'AI Guided Workouts',
    desc: 'Real-time exercise tracking with live form feedback and rep counting.',
    Visual: WorkoutLiveVisual,
    accent: '#00F5A0',
  },
  {
    num: '05',
    title: 'Track Your Progress',
    desc: 'Monitor weekly reps, calories, and fitness improvements over time.',
    Visual: ProgressVisual,
    accent: '#00c8ff',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HowToStart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Cards move left as scroll goes down — shift enough to reveal all 5 cards
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-72%']);

  return (
    // Outer scroll container — tall enough for the scroll hijack
    <div ref={containerRef} style={{ height: '500vh', position: 'relative' }}>
      {/* Sticky inner viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#060c1a', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '20%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,160,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Section header */}
        <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 32, position: 'relative', zIndex: 2 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', color: '#00F5A0', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Onboarding</p>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#e8f4ff', letterSpacing: '-0.03em', margin: 0 }}>
            How to Get Started
          </h2>
          <p style={{ fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '0.9rem', marginTop: 10 }}>Five steps. Five minutes. Infinite results.</p>
        </div>

        {/* Horizontal card track */}
        <div style={{ overflow: 'hidden', padding: '0 0 0 8vw', flex: 1, display: 'flex', alignItems: 'center' }}>
          <motion.div style={{ display: 'flex', gap: 24, x }}>
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} scrollYProgress={scrollYProgress} totalSteps={STEPS.length} />
            ))}
          </motion.div>
        </div>

        {/* Progress dots */}
        <ProgressDots scrollYProgress={scrollYProgress} count={STEPS.length} />

        {/* Scroll hint */}
        <div style={{ textAlign: 'center', paddingBottom: 28, position: 'relative', zIndex: 2 }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <p style={{ color: '#2e3f52', fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em' }}>↓ SCROLL TO NAVIGATE</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({ step, index, scrollYProgress, totalSteps }: {
  step: typeof STEPS[number];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  totalSteps: number;
}) {
  const segStart = index / totalSteps;
  const segEnd = (index + 1) / totalSteps;
  const midPoint = (segStart + segEnd) / 2;

  const scale = useTransform(scrollYProgress, [segStart, midPoint, segEnd], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [segStart, midPoint, segEnd], [0.5, 1, 0.5]);
  const borderGlow = useTransform(scrollYProgress, [segStart, midPoint, segEnd], ['rgba(0,245,160,0.05)', `${step.accent}30`, 'rgba(0,245,160,0.05)']);

  return (
    <motion.div style={{
      width: 300, minWidth: 300, scale, opacity,
      background: 'rgba(12,22,44,0.75)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      border: `1px solid`,
      borderColor: borderGlow,
      padding: 28,
      boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      flexShrink: 0,
    }}>
      {/* Step number */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '2.5rem', color: `${step.accent}18`, letterSpacing: '-0.04em', lineHeight: 1 }}>{step.num}</span>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${step.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: step.accent, fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '0.75rem' }}>{parseInt(step.num)}</span>
        </div>
      </div>

      {/* Visual */}
      <step.Visual />

      {/* Text */}
      <div style={{ marginTop: 20 }}>
        <div style={{ width: 28, height: 2, background: step.accent, borderRadius: 9999, marginBottom: 12 }} />
        <h3 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#e8f4ff', marginBottom: 8, lineHeight: 1.3 }}>{step.title}</h3>
        <p style={{ fontFamily: 'Inter,sans-serif', color: '#6a7a8e', fontSize: '0.85rem', lineHeight: 1.65 }}>{step.desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────

function ProgressDots({ scrollYProgress, count }: { scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; count: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, paddingBottom: 8, position: 'relative', zIndex: 2 }}>
      {Array.from({ length: count }).map((_, i) => {
        const segStart = i / count;
        const segEnd = (i + 1) / count;
        return (
          <Dot key={i} scrollYProgress={scrollYProgress} segStart={segStart} segEnd={segEnd} />
        );
      })}
    </div>
  );
}

function Dot({ scrollYProgress, segStart, segEnd }: { scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; segStart: number; segEnd: number }) {
  const scale = useTransform(scrollYProgress, [segStart, (segStart + segEnd) / 2, segEnd], [1, 2.2, 1]);
  const bg = useTransform(scrollYProgress, [segStart, (segStart + segEnd) / 2, segEnd], ['#1e2d40', '#00F5A0', '#1e2d40']);
  return (
    <motion.div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: bg, scaleX: scale, originX: 0.5 }} />
  );
}
