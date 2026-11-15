import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FlipHorizontal, Type, X, Clock, FileText } from 'lucide-react';

export default function TeleprompterModal({ isOpen, onClose, reel }) {
  if (!isOpen || !reel) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(3); // 1 to 10
  const [fontSize, setFontSize] = useState(38); // in px
  const [isMirrored, setIsMirrored] = useState(false);
  const [activeFormat, setActiveFormat] = useState('A'); // 'A' or 'B'

  const stageRef = useRef(null);
  const animFrameRef = useRef(null);

  const textToRead = activeFormat === 'A' ? reel.script_format_a : reel.script_format_b;
  const wordCount = textToRead ? textToRead.split(/\s+/).length : 0;
  const estSeconds = Math.round(wordCount / 2.3);

  // Handle Spacebar for play/pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Smooth Auto-Scroll Loop
  useEffect(() => {
    let lastTime = performance.now();

    const scrollStep = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && stageRef.current) {
        // Speed scaling: 25px/sec at speed 1, 150px/sec at speed 10
        const pixelsPerSec = scrollSpeed * 20;
        stageRef.current.scrollTop += pixelsPerSec * delta;

        // Auto pause at the end
        if (
          stageRef.current.scrollTop + stageRef.current.clientHeight >=
          stageRef.current.scrollHeight - 20
        ) {
          setIsPlaying(false);
        }
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(scrollStep);
      }
    };

    if (isPlaying) {
      lastTime = performance.now();
      animFrameRef.current = requestAnimationFrame(scrollStep);
    } else {
      cancelAnimationFrame(animFrameRef.current);
    }

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, scrollSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    if (stageRef.current) {
      stageRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="teleprompter-overlay">
      {/* Top Controls HUD */}
      <div className="teleprompter-hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 800, color: '#D4AF37', fontSize: '1.1rem' }}>
            TELEPROMPTER — Advocate Pratiksha
          </span>
          <span className="badge badge-gold">Day {reel.day_number}</span>

          {/* Format Switcher */}
          <div style={{ display: 'flex', background: '#1E293B', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => { setActiveFormat('A'); handleReset(); }}
              style={{
                padding: '0.35rem 0.85rem',
                border: 'none',
                borderRadius: '6px',
                background: activeFormat === 'A' ? '#D4AF37' : 'transparent',
                color: activeFormat === 'A' ? '#000' : '#CBD5E1',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Format A (30-40s)
            </button>
            <button
              onClick={() => { setActiveFormat('B'); handleReset(); }}
              style={{
                padding: '0.35rem 0.85rem',
                border: 'none',
                borderRadius: '6px',
                background: activeFormat === 'B' ? '#D4AF37' : 'transparent',
                color: activeFormat === 'B' ? '#000' : '#CBD5E1',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Format B (50-60s)
            </button>
          </div>
        </div>

        {/* Playback & View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-gold"
            style={{ minWidth: '120px' }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'थांबवा (Pause)' : 'सुरू करा (Play)'}</span>
          </button>

          {/* Reset */}
          <button onClick={handleReset} className="btn btn-outline btn-sm" title="सुरुवातीला जा">
            <RotateCcw size={16} />
          </button>

          {/* Speed slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="#94A3B8" />
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>गती: {scrollSpeed}x</span>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              style={{ width: '80px', accentColor: '#D4AF37' }}
            />
          </div>

          {/* Font Size slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Type size={16} color="#94A3B8" />
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{fontSize}px</span>
            <input
              type="range"
              min="28"
              max="58"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{ width: '80px', accentColor: '#D4AF37' }}
            />
          </div>

          {/* Mirror Mode */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`btn btn-sm ${isMirrored ? 'btn-gold' : 'btn-outline'}`}
            title="मिरर मोड (काचेसाठी)"
          >
            <FlipHorizontal size={16} />
            <span>मिरर</span>
          </button>

          {/* Info stats */}
          <div style={{ fontSize: '0.85rem', color: '#6EE7B7', fontWeight: 600 }}>
            {wordCount} शब्द (~{estSeconds} से.)
          </div>

          {/* Close */}
          <button onClick={onClose} className="btn btn-danger btn-sm" title="बंद करा (Esc)">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Center Reading Guide Line */}
      <div className="teleprompter-center-guide"></div>

      {/* Teleprompter Scrolling Stage */}
      <div className="teleprompter-stage" ref={stageRef}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#D4AF37', fontSize: '1.25rem', marginBottom: '2rem', fontWeight: 700 }}>
            {reel.title}
          </div>

          <div
            className={`teleprompter-text ${isMirrored ? 'mirrored' : ''}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {textToRead}
          </div>

          <div style={{ marginTop: '5rem', color: '#64748B', fontSize: '1rem' }}>
            — व्हिडिओ समाप्ती (आपला कायदा) —
          </div>
        </div>
      </div>
    </div>
  );
}
