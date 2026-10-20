const steps = [
  { num: '01', title: 'Open the App', desc: 'Launch FitAI on any device. No gym, no equipment required.', icon: '⚡' },
  { num: '02', title: 'Follow AI Coach', desc: 'The camera tracks every joint. Real-time feedback. Zero latency.', icon: '🎯' },
  { num: '03', title: 'Track Progress', desc: 'Review stats, reps, form score, and nutrition plan post-session.', icon: '📈' },
];

export default function HowItWorks() {
  return (
    <section style={{ background: 'rgba(6, 12, 26, 0.95)', padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', color: '#00F5A0', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>Simple by Design</p>
          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#e8f4ff', letterSpacing: '-0.03em' }}>
            How It Works
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40, position: 'relative' }}>
          {/* Dashed connector line (desktop only) */}
          <div style={{ position: 'absolute', top: 60, left: '18%', right: '18%', height: 1, background: 'repeating-linear-gradient(90deg, rgba(0,245,160,0.2) 0, rgba(0,245,160,0.2) 8px, transparent 8px, transparent 18px)', pointerEvents: 'none' }} />

          {steps.map((s) => (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
              {/* Ghosted big number */}
              <div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '5rem', color: 'rgba(0,245,160,0.07)', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.04em', userSelect: 'none' }}>{s.num}</div>

              {/* Icon circle */}
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,245,160,0.07)', border: '1px solid rgba(0,245,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: '1.4rem' }}>{s.icon}</div>

              <h3 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#e8f4ff', marginBottom: 12, letterSpacing: '-0.01em' }}>{s.title}</h3>
              <p style={{ fontFamily: 'Inter,sans-serif', color: '#6a7a8e', lineHeight: 1.75, fontSize: '0.9rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
