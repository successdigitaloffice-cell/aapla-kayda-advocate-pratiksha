import React, { useState } from 'react';
import {
  Film, Copy, Check, Tv, CheckCircle2, Video, Send, ArrowRight,
  ShieldCheck, AlertTriangle, ExternalLink, Edit3, Save, Sparkles, BookOpen
} from 'lucide-react';

export default function Tab2ReadyReels({
  activeReel,
  onApprove,
  onMarkRecorded,
  onOpenPublishModal,
  onGenerateNext,
  onUpdateReel,
  onOpenTeleprompter,
  onNotify
}) {
  if (!activeReel) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <Film size={48} color="#D4AF37" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>कोणतीही सक्रिय Reel स्क्रिप्ट उपलब्ध नाही</h3>
        <p style={{ color: '#94A3B8', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          कॅलेंडरमधील पुढील विषयाची स्क्रिप्ट तयार करण्यासाठी खालील बटणावर क्लिक करा.
        </p>
        <button onClick={onGenerateNext} className="btn btn-gold btn-lg">
          <Sparkles size={18} />
          <span>पुढील Reel तयार करा (Generate Next Reel)</span>
        </button>
      </div>
    );
  }

  const [activeFormat, setActiveFormat] = useState('A'); // 'A' or 'B'
  const [isEditing, setIsEditing] = useState(false);
  const [editedScriptA, setEditedScriptA] = useState(activeReel.script_format_a);
  const [editedScriptB, setEditedScriptB] = useState(activeReel.script_format_b);
  const [editedHook, setEditedHook] = useState(activeReel.hook);
  const [copiedKey, setCopiedKey] = useState('');

  const currentScript = activeFormat === 'A' ? editedScriptA : editedScriptB;
  const wordCount = currentScript ? currentScript.split(/\s+/).length : 0;
  const estDuration = Math.round(wordCount / 2.3);

  const copyToClipboard = (text, key, message) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onNotify(message || 'कॉपी झाले!');
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const handleSaveEdits = async () => {
    try {
      await onUpdateReel(activeReel.id, {
        script_format_a: editedScriptA,
        script_format_b: editedScriptB,
        hook: editedHook
      });
      setIsEditing(false);
      onNotify('स्क्रिप्ट मधील बदल यशस्वीरीत्या जतन झाले!');
    } catch (err) {
      onNotify('जतन करताना त्रुटी: ' + err.message);
    }
  };

  const sourcesList = activeReel.official_sources ? JSON.parse(activeReel.official_sources) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Workflow Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
            Day {activeReel.day_number} / 60
          </span>
          <span className="badge badge-emerald">{activeReel.category}</span>
          <span className={`badge ${activeReel.status === 'Ready to Record' ? 'badge-gold' : 'badge-cyan'}`}>
            स्थिती: {activeReel.status}
          </span>
          <span className="badge badge-emerald">
            <ShieldCheck size={14} />
            <span>{activeReel.verification_status}</span>
          </span>
        </div>

        {/* Workflow Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Teleprompter Button */}
          <button
            onClick={() => onOpenTeleprompter(activeReel)}
            className="btn btn-gold"
            title="कॅमेऱ्यासमोर थेट वाचण्यासाठी टेलिप्रॉम्प्टर सुरू करा"
          >
            <Tv size={18} />
            <span>Open Teleprompter</span>
          </button>

          {/* Approve Button */}
          {activeReel.status !== 'Ready to Record' && activeReel.status !== 'Recorded' && activeReel.status !== 'Published' && (
            <button
              onClick={() => onApprove(activeReel.id)}
              className="btn btn-emerald"
            >
              <CheckCircle2 size={16} />
              <span>Approve Script</span>
            </button>
          )}

          {/* Mark Recorded Button */}
          {activeReel.status === 'Ready to Record' && (
            <button
              onClick={() => onMarkRecorded(activeReel.id)}
              className="btn btn-outline"
            >
              <Video size={16} />
              <span>Mark as Recorded</span>
            </button>
          )}

          {/* Mark Published Button */}
          <button
            onClick={() => onOpenPublishModal(activeReel)}
            className="btn btn-emerald"
          >
            <Send size={16} />
            <span>Mark as Published</span>
          </button>

          {/* Generate Next Reel */}
          <button
            onClick={onGenerateNext}
            className="btn btn-outline"
            title="कॅलेंडरमधील पुढील विषय निवडा"
          >
            <ArrowRight size={16} />
            <span>Generate Next Reel</span>
          </button>
        </div>
      </div>

      {/* Main Script & Teleprompter Workspace */}
      <div className="grid-2-col">
        {/* Left Column: Teleprompter-Ready Marathi Script */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div>
              <div style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700 }}>
                कॅमेऱ्यासमोर थेट वाचता येईल अशी मराठी स्क्रिप्ट (Advocate Pratiksha)
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
                {activeReel.title}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline btn-sm"
              >
                <Edit3 size={14} />
                <span>{isEditing ? 'रद्द करा' : 'संपादित करा'}</span>
              </button>
            </div>
          </div>

          {/* Format Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(10, 16, 29, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveFormat('A')}
                className={`btn btn-sm ${activeFormat === 'A' ? 'btn-gold' : 'btn-outline'}`}
              >
                Format A (30–40 सेकंद)
              </button>
              <button
                onClick={() => setActiveFormat('B')}
                className={`btn btn-sm ${activeFormat === 'B' ? 'btn-gold' : 'btn-outline'}`}
              >
                Format B (50–60 सेकंद)
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#6EE7B7', fontWeight: 700 }}>
              {wordCount} शब्द • अंदाजित वेळ: ~{estDuration} सेकंद
            </div>
          </div>

          {/* Hook Box */}
          <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
              🎯 Hook (पहिल्या 1-2 सेकंदांत प्रेक्षकांचे लक्ष वेधणारे वाक्य):
            </div>
            {isEditing ? (
              <textarea
                className="form-control"
                value={editedHook}
                onChange={(e) => setEditedHook(e.target.value)}
                style={{ marginTop: '0.5rem', minHeight: '60px' }}
              />
            ) : (
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFF', marginTop: '0.35rem', lineHeight: '1.5' }}>
                "{editedHook}"
              </div>
            )}
          </div>

          {/* Script Content Area */}
          <div style={{ flex: 1, marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.35rem' }}>
              संपूर्ण मराठी मजकूर (थेट वाचनासाठी):
            </div>
            {isEditing ? (
              <textarea
                className="form-control"
                value={activeFormat === 'A' ? editedScriptA : editedScriptB}
                onChange={(e) => activeFormat === 'A' ? setEditedScriptA(e.target.value) : setEditedScriptB(e.target.value)}
                style={{ minHeight: '260px', fontSize: '1.05rem', lineHeight: '1.8' }}
              />
            ) : (
              <div style={{
                background: 'rgba(7, 11, 20, 0.75)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                fontSize: '1.1rem',
                lineHeight: '1.9',
                color: '#FFFFFF',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-marathi)'
              }}>
                {currentScript}
              </div>
            )}
          </div>

          {/* Edit Save / Copy Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
            {isEditing ? (
              <button onClick={handleSaveEdits} className="btn btn-emerald">
                <Save size={16} />
                <span>बदल सेव्ह करा</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => copyToClipboard(currentScript, 'script', 'स्क्रिप्ट क्लिपबोर्डवर कॉपी झाली!')}
                  className="btn btn-gold"
                >
                  {copiedKey === 'script' ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedKey === 'script' ? 'कॉपी झाली!' : 'Copy Script'}</span>
                </button>
                <button
                  onClick={() => onOpenTeleprompter(activeReel)}
                  className="btn btn-outline"
                >
                  <Tv size={16} />
                  <span>टेलिप्रॉम्प्टर</span>
                </button>
              </div>
            )}

            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              लवचिक मराठी • थेट वाचन योग्य
            </div>
          </div>
        </div>

        {/* Right Column: Legal Verification, Captions, Keywords & CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Legal Accuracy & Primary Sources Card */}
          <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div className="card-header">
              <div className="card-title">
                <ShieldCheck size={20} color="#10B981" />
                <span>Legal Accuracy Engine (कायदेशीर पडताळणी)</span>
              </div>
              <span className="badge badge-emerald">{activeReel.verification_status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: '#D4AF37' }}>लागू कायदा:</strong> {activeReel.applicable_law}
              </div>
              <div>
                <strong style={{ color: '#D4AF37' }}>कलम / नियम:</strong> {activeReel.applicable_section}
              </div>
              <div>
                <strong style={{ color: '#D4AF37' }}>मुख्य कायदेशीर प्रश्न:</strong> {activeReel.legal_question}
              </div>
              <div>
                <strong style={{ color: '#D4AF37' }}>प्रेक्षकांसाठी कायदेशीर निष्कर्ष:</strong> {activeReel.legal_takeaway}
              </div>
              <div>
                <strong style={{ color: '#D4AF37' }}>प्रत्यक्ष कृती (Actionable Step):</strong> {activeReel.actionable_step}
              </div>

              {/* Official Source Links */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.35rem' }}>अधिकृत स्रोत लिंक्स:</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {sourcesList.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <ExternalLink size={12} />
                      <span>{url.replace('https://', '').split('/')[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reel Caption & Hashtags Card */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <BookOpen size={20} className="icon-accent" />
                <span>Instagram Caption & SEO Hashtags</span>
              </div>
              <button
                onClick={() => copyToClipboard(activeReel.caption, 'caption', 'कॅपशन क्लिपबोर्डवर कॉपी झाले!')}
                className="btn btn-outline btn-sm"
              >
                {copiedKey === 'caption' ? <Check size={14} /> : <Copy size={14} />}
                <span>Copy Caption</span>
              </button>
            </div>

            <div style={{ background: 'rgba(7, 11, 20, 0.75)', padding: '1rem', borderRadius: '8px', fontSize: '0.88rem', color: '#CBD5E1', whiteSpace: 'pre-wrap', maxHeight: '160px', overflowY: 'auto' }}>
              {activeReel.caption}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.3rem' }}>हॅशटॅग्ज:</div>
              <div style={{ fontSize: '0.82rem', color: '#D4AF37', wordBreak: 'break-word' }}>
                {activeReel.hashtags}
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.3rem' }}>स्क्रीनवर दिसणारा मजकूर (On-Screen Text):</div>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                {activeReel.on_screen_text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
