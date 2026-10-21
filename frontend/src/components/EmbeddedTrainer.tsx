import { useState, useRef } from 'react';
import { STREAMLIT_URL } from '../config';
import { Maximize2, Minimize2, RotateCw, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmbeddedTrainerProps {
  username: string;
  onClose?: () => void;
}

export default function EmbeddedTrainer({ username, onClose }: EmbeddedTrainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const iframeSrc = `${STREAMLIT_URL}/?embed=true&username=${encodeURIComponent(username)}`;

  const handleRefresh = () => {
    setIsLoading(true);
    setReloadKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        background: '#070c18',
        borderRadius: isFullscreen ? 0 : 20,
        border: isFullscreen ? 'none' : '1px solid rgba(0, 245, 160, 0.22)',
        boxShadow: isFullscreen 
          ? 'none' 
          : '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 160, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Status / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 245, 160, 0.12)',
            padding: '5px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(0, 245, 160, 0.3)'
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00F5A0',
              boxShadow: '0 0 10px #00F5A0',
              display: 'inline-block',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#00F5A0',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              AI Vision Engine Active
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#7a8fa8',
            fontSize: '0.82rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            <ShieldCheck size={14} color="#00c8ff" />
            <span>Camera & Voice Stream Protected</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleRefresh}
            title="Reload Trainer Session"
            style={{
              padding: '7px 13px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e8f4ff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
          >
            <RotateCw size={14} />
            <span>Restart Session</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Workout Mode"}
            style={{
              padding: '7px 13px',
              borderRadius: 10,
              background: isFullscreen ? 'linear-gradient(135deg, #00F5A0, #00c8ff)' : 'rgba(255, 255, 255, 0.06)',
              border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isFullscreen ? '#002e1e' : '#e8f4ff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen Workout"}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close Trainer"
              style={{
                padding: '7px 12px',
                borderRadius: 10,
                background: 'rgba(255, 80, 80, 0.12)',
                border: '1px solid rgba(255, 80, 80, 0.25)',
                color: '#ff8080',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.82rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 80, 80, 0.2)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 80, 80, 0.12)'; }}
            >
              <X size={14} />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: isFullscreen ? 'calc(100vh - 54px)' : 'clamp(620px, 80vh, 880px)' }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#070c18',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                gap: 16
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '3px solid rgba(0, 245, 160, 0.15)',
                borderTopColor: '#00F5A0',
                borderRightColor: '#00c8ff',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#e8f4ff',
                  marginBottom: 6
                }}>
                  Connecting to FitAI Vision Engine
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem',
                  color: '#65788d'
                }}>
                  Loading MediaPipe Pose Estimator & Bi-LSTM Neural Classifier...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          key={reloadKey}
          src={iframeSrc}
          title="FitAI Streamlit Trainer"
          onLoad={() => setIsLoading(false)}
          allow="camera; microphone; display-capture; autoplay"
          style={{
            width: '100%',
            height: isFullscreen ? 'calc(100vh - 54px)' : 'clamp(620px, 80vh, 880px)',
            border: 'none',
            background: '#0e1117',
            display: 'block'
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
