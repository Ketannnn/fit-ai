import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CTAFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* ── CTA Section ─────────────────────────────────────── */}
      <section ref={ref} style={{ background: '#060c1a', padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,245,160,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,245,160,0.2), transparent)' }} />

        <motion.div style={{ y, opacity, position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', color: '#00F5A0', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>
            Ready to Begin?
          </p>

          <h2 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', color: '#e8f4ff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24, maxWidth: 700, margin: '0 auto 24px' }}>
            Start Your Fitness<br />
            <span style={{ background: 'linear-gradient(90deg, #00F5A0, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Journey Today.
            </span>
          </h2>

          <p style={{ fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
            Your AI trainer is ready. No gym. No excuses.
          </p>

          {/* CTA Button */}
          {user ? (
            <motion.button
              id="cta-launch-app-btn"
              onClick={() => navigate('/trainer')}
              whileHover={{ scale: 1.04, boxShadow: '0 0 70px rgba(0,245,160,0.5)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'linear-gradient(135deg, #00F5A0, #00ec9a)',
                color: '#002e1e', fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '1.15rem',
                padding: '1.1rem 3.5rem', borderRadius: 9999,
                boxShadow: '0 0 40px rgba(0,245,160,0.35)',
                letterSpacing: '0.04em', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
            >
              🚀 LAUNCH LIVE TRAINER →
            </motion.button>
          ) : (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <motion.button
                id="cta-start-btn"
                whileHover={{ scale: 1.04, boxShadow: '0 0 70px rgba(0,245,160,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                style={{
                  background: 'linear-gradient(135deg, #00F5A0, #00ec9a)',
                  color: '#002e1e', fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: '1.15rem',
                  padding: '1.1rem 3rem', borderRadius: 9999, border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(0,245,160,0.35)',
                  letterSpacing: '0.04em',
                }}
              >
                START TODAY →
              </motion.button>

              <motion.button
                id="cta-launch-app-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/trainer')}
                style={{
                  background: 'rgba(0,245,160,0.1)',
                  color: '#00F5A0', fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.1rem',
                  padding: '1.1rem 2.8rem', borderRadius: 9999,
                  border: '1px solid rgba(0,245,160,0.35)', cursor: 'pointer',
                  letterSpacing: '0.04em',
                  display: 'inline-flex', alignItems: 'center', gap: 8
                }}
              >
                🚀 LAUNCH APP →
              </motion.button>
            </div>
          )}

          <p style={{ marginTop: 24, color: '#2e3f52', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', letterSpacing: '0.02em' }}>
            <span style={{ color: '#00F5A0' }}>✓</span> Free forever plan &nbsp;&nbsp;
            <span style={{ color: '#00F5A0' }}>✓</span> No credit card &nbsp;&nbsp;
            <span style={{ color: '#00F5A0' }}>✓</span> Works on any device
          </p>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        background: 'rgba(4, 8, 20, 0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,245,160,0.06)',
        padding: '48px 40px 36px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#00F5A0,#00c8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope,sans-serif', fontWeight: 900, fontSize: 15, color: '#002e1e' }}>F</div>
                <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#e8f4ff' }}>FitAI</span>
              </div>
              <p style={{ fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 240, fontStyle: 'italic' }}>
                Elevate your fitness journey. AI-powered, human-driven.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 700, color: '#e8f4ff', fontSize: '0.85rem', marginBottom: 14, letterSpacing: '0.04em' }}>Product</p>
                {[
                  { label: 'Features', action: () => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/#features');
                  }},
                  { label: 'BMI Calculator', action: () => navigate('/dashboard') },
                  { label: 'Workout Plans', action: () => navigate('/trainer') },
                  { label: 'Live AI Trainer', action: () => navigate('/trainer') },
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{ display: 'block', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '0.82rem', marginBottom: 9, transition: 'color 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#00F5A0')}
                    onMouseOut={e => (e.currentTarget.style.color = '#4a5a6a')}
                  >{item.label}</button>
                ))}
              </div>

              <div>
                <p style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 700, color: '#e8f4ff', fontSize: '0.85rem', marginBottom: 14, letterSpacing: '0.04em' }}>Company</p>
                {['About', 'Contact', 'Privacy', 'Terms'].map(l => (
                  <a key={l} href="#" style={{ display: 'block', fontFamily: 'Inter,sans-serif', color: '#4a5a6a', fontSize: '0.82rem', marginBottom: 9, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#00F5A0')}
                    onMouseOut={e => (e.currentTarget.style.color = '#4a5a6a')}
                  >{l}</a>
                ))}
              </div>
            </div>

            {/* Social icons */}
            <div>
              <p style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 700, color: '#e8f4ff', fontSize: '0.85rem', marginBottom: 14, letterSpacing: '0.04em' }}>Follow Us</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ icon: '𝕏', label: 'Twitter' }, { icon: 'in', label: 'LinkedIn' }, { icon: 'GH', label: 'GitHub' }].map(s => (
                  <a key={s.label} href="#" title={s.label}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(0,245,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5a6a', textDecoration: 'none', fontSize: '0.75rem', fontFamily: 'Manrope,sans-serif', fontWeight: 700, transition: 'all 0.2s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,160,0.4)'; (e.currentTarget as HTMLElement).style.color = '#00F5A0'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,160,0.12)'; (e.currentTarget as HTMLElement).style.color = '#4a5a6a'; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(0,245,160,0.06)', marginBottom: 24 }} />

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: 'Inter,sans-serif', color: '#1e2d40', fontSize: '0.78rem' }}>
              © {new Date().getFullYear()} FitAI Inc. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <a key={l} href="#" style={{ fontFamily: 'Inter,sans-serif', color: '#2e3f52', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#4a5a6a')}
                  onMouseOut={e => (e.currentTarget.style.color = '#2e3f52')}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
