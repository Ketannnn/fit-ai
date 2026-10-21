import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import EmbeddedTrainer from './EmbeddedTrainer';

export default function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 72 }}>
      {/* Layered background glows */}
      <div style={{ position: 'absolute', inset: 0, background: '#0a0f1e', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,160,0.07) 0%, transparent 65%)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 65%)', zIndex: 0 }} />
      {/* Grid texture overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,160,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: 0 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Left: Hero Text */}
        <div>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, background: 'rgba(0,245,160,0.08)', borderRadius: 9999, padding: '6px 16px', border: '1px solid rgba(0,245,160,0.18)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00F5A0', display: 'inline-block', boxShadow: '0 0 8px #00F5A0' }} />
            <span style={{ color: '#00F5A0', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI-Powered Coaching</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 'clamp(3rem, 5.5vw, 5rem)', lineHeight: 1.04, color: '#e8f4ff', marginBottom: 28, letterSpacing: '-0.03em' }}>
            Train Smarter.<br />
            <span style={{ background: 'linear-gradient(90deg, #00F5A0, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Live Better.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#7a8fa8', lineHeight: 1.75, marginBottom: 44, maxWidth: 460 }}>
            Your AI-powered coach that corrects your posture, tracks reps, and builds you a plan — all in real-time.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {user ? (
              /* ── Logged-in CTA ── */
              <>
                <button
                  id="hero-launch-app-btn"
                  onClick={() => navigate('/trainer')}
                  style={{
                    background: 'linear-gradient(135deg, #00F5A0, #00ec9a)',
                    color: '#002e1e', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem',
                    padding: '0.9rem 2.2rem', borderRadius: 9999, border: 'none', cursor: 'pointer',
                    boxShadow: '0 0 32px rgba(0,245,160,0.4)', transition: 'all 0.3s ease',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,245,160,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(0,245,160,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >🚀 Launch Live Trainer →</button>

                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#e8f4ff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                    padding: '0.9rem 1.8rem', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,160,0.3)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >📊 Dashboard</button>
              </>
            ) : (
              /* ── Logged-out CTA ── */
              <>
                <button
                  id="hero-get-started-btn"
                  onClick={() => navigate('/signup')}
                  style={{
                    background: 'linear-gradient(135deg, #00F5A0, #00ec9a)',
                    color: '#002e1e', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem',
                    padding: '0.9rem 2.2rem', borderRadius: 9999, border: 'none', cursor: 'pointer',
                    boxShadow: '0 0 32px rgba(0,245,160,0.4)', transition: 'all 0.3s ease',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,245,160,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(0,245,160,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >Get Started Free →</button>

                <button
                  id="hero-launch-app-btn"
                  onClick={() => navigate('/trainer')}
                  style={{
                    background: 'rgba(0,245,160,0.1)',
                    color: '#00F5A0', fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                    padding: '0.9rem 1.8rem', borderRadius: 9999, border: '1px solid rgba(0,245,160,0.3)',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,160,0.18)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,160,0.1)'; }}
                >🚀 Launch App</button>
              </>
            )}

            <button
              id="hero-watch-demo-btn"
              onClick={() => setShowDemoModal(true)}
              style={{
                background: 'transparent', color: '#8a9bb0', fontFamily: 'Inter, sans-serif',
                fontWeight: 600, fontSize: '0.95rem', padding: '0.9rem 1.8rem', borderRadius: 9999,
                border: '1px solid rgba(138,155,176,0.25)', cursor: 'pointer', transition: 'all 0.25s ease',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,160,0.3)'; (e.currentTarget as HTMLElement).style.color = '#d9e7fc'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(138,155,176,0.25)'; (e.currentTarget as HTMLElement).style.color = '#8a9bb0'; }}
            >
              <span>⚡ Watch Demo</span>
            </button>
          </div>

          {/* Trust text */}
          <p style={{ marginTop: 24, color: '#4a5a6a', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}>
            <span style={{ color: '#00F5A0' }}>✓</span> No credit card required &nbsp;&nbsp;
            <span style={{ color: '#00F5A0' }}>✓</span> Works instantly inline
          </p>
        </div>

        {/* Right: AI Tracking Card */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Pulsing ring */}
          <div style={{ position: 'absolute', width: 440, height: 440, borderRadius: '50%', border: '1px solid rgba(0,245,160,0.1)', animation: 'pulseRing 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: '1px dashed rgba(0,245,160,0.15)', animation: 'pulseRing 3s ease-in-out infinite 1.5s' }} />

          {/* Glass card */}
          <div style={{
            background: 'rgba(12, 25, 48, 0.7)',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '1.75rem', padding: 32, width: 340, position: 'relative', zIndex: 5,
            border: '1px solid rgba(0,245,160,0.12)',
            boxShadow: '0 0 60px rgba(0,245,160,0.08), 0 30px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00F5A0', display: 'inline-block', boxShadow: '0 0 10px #00F5A0', animation: 'blink 2s infinite' }} />
                <span style={{ color: '#00F5A0', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Tracking Active</span>
              </div>
              <span style={{ color: '#4a5a6a', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem' }}>LIVE</span>
            </div>

            {/* Skeleton scan */}
            <div style={{ height: 190, background: 'rgba(5,15,30,0.8)', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,245,160,0.08)' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #00F5A0, transparent)', animation: 'scanLine 2.5s ease-in-out infinite', opacity: 0.8 }} />
              <svg viewBox="0 0 100 160" width={72} style={{ opacity: 0.75 }}>
                <circle cx={50} cy={20} r={8} fill="none" stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={50} y1={28} x2={50} y2={80} stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={50} y1={45} x2={25} y2={65} stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={50} y1={45} x2={75} y2={65} stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={25} y1={65} x2={20} y2={85} stroke="#00ec9a" strokeWidth={1.5}/>
                <line x1={75} y1={65} x2={80} y2={85} stroke="#00ec9a" strokeWidth={1.5}/>
                <line x1={50} y1={80} x2={35} y2={120} stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={50} y1={80} x2={65} y2={120} stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={35} y1={120} x2={32} y2={155} stroke="#00F5A0" strokeWidth={1.5}/>
                <line x1={65} y1={120} x2={68} y2={155} stroke="#00F5A0" strokeWidth={1.5}/>
                {[{cx:25,cy:65},{cx:75,cy:65},{cx:35,cy:120},{cx:65,cy:120},{cx:50,cy:45}].map((p,i) => (
                  <circle key={i} cx={p.cx} cy={p.cy} r={3.5} fill="#00F5A0" opacity={0.9}/>
                ))}
              </svg>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Reps', value: '12' },
                { label: 'Form Score', value: '94%' },
                { label: 'Calories', value: '318' },
                { label: 'Posture', value: '✓ Good' }
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(5,15,30,0.7)', borderRadius: '0.85rem', padding: '12px 14px', border: '1px solid rgba(0,245,160,0.06)' }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, color: '#00F5A0', fontSize: '1.5rem', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', color: '#4a5a6a', fontSize: '0.72rem', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Demo / Workout Preview Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(5, 10, 22, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
            }}
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                maxWidth: 1040,
                maxHeight: '92vh',
                background: '#070c18',
                borderRadius: 20,
                border: '1px solid rgba(0, 245, 160, 0.25)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 245, 160, 0.15)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={e => e.stopPropagation()}
            >
              <EmbeddedTrainer
                username={user ? user.username : 'Guest'}
                onClose={() => setShowDemoModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scanLine { 0%,100%{top:8%;opacity:0} 20%{opacity:1} 80%{opacity:1} 98%{top:88%;opacity:0} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.04);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </section>
  );
}
