import React, { useState } from 'react';
import {
  Film,
  Copy,
  Check,
  Tv,
  CheckCircle2,
  Video,
  Send,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Edit3,
  Save,
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';

export default function Tab3ReadyScripts({
  activeReel,
  onApprove,
  onMarkRecorded,
  onOpenPublishModal,
  onGenerateNext,
  onUpdateReel,
  onOpenTeleprompter,
  onNavigateToVideo,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Reel Workflow Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold">TAB 3: Ready-to-Record Scripts</span>
            <span className="badge badge-cyan">Day {activeReel.day_number} of 60</span>
            <span className={`badge ${activeReel.status === 'Published' ? 'badge-emerald' : activeReel.status === 'Recorded' ? 'badge-cyan' : 'badge-gold'}`}>
              स्थिती: {activeReel.status}
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>
            {activeReel.title}
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            Advocate Pratiksha यांच्यासाठी थेट कॅमेरा वाचनासाठी नैसर्गिक मराठी भाषेतील स्क्रिप्ट.
          </div>
        </div>

        {/* Workflow Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenTeleprompter(activeReel)}
            className="btn btn-gold btn-md"
            title="टेलिप्रॉम्प्टर सुरू करा"
          >
            <Tv size={16} />
            <span>टेलिप्रॉम्प्टर (Teleprompter)</span>
          </button>

          <button
            onClick={onNavigateToVideo}
            className="btn btn-gold btn-md"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', color: '#FFF', fontWeight: 700 }}
            title="या स्क्रिप्टचा थेट व्हिडिओ बनवा"
          >
            <Video size={16} />
            <span>🎬 थेट व्हिडिओ बनवा (Make Video)</span>
          </button>

          <button
            onClick={() => copyToClipboard(currentScript, 'script', 'स्क्रिप्ट क्लिपबोर्डवर कॉपी झाली!')}
            className="btn btn-outline btn-md"
            title="सध्याची स्क्रिप्ट कॉपी करा"
          >
            {copiedKey === 'script' ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
            <span>COPY SCRIPT</span>
          </button>

          {activeReel.status !== 'Recorded' && activeReel.status !== 'Published' && (
            <button
              onClick={() => onMarkRecorded(activeReel.id)}
              className="btn btn-cyan btn-md"
            >
              <Video size={16} />
              <span>MARK AS RECORDED</span>
            </button>
          )}

          {activeReel.status !== 'Published' && (
            <button
              onClick={() => onOpenPublishModal(activeReel)}
              className="btn btn-emerald btn-md"
            >
              <Send size={16} />
              <span>MARK AS PUBLISHED</span>
            </button>
          )}

          <button
            onClick={onGenerateNext}
            className="btn btn-outline btn-md"
            title="पुढील Reel तयार करा"
          >
            <ArrowRight size={16} />
            <span>GENERATE NEXT REEL</span>
          </button>
        </div>
      </div>

      {/* Script Format Toggle & Metrics */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveFormat('A')}
            className={`btn ${activeFormat === 'A' ? 'btn-gold' : 'btn-outline'} btn-md`}
          >
            <Layers size={16} />
            <span>Version A: 30–40 सेकंद (Fast-Paced Hook)</span>
          </button>
          <button
            onClick={() => setActiveFormat('B')}
            className={`btn ${activeFormat === 'B' ? 'btn-gold' : 'btn-outline'} btn-md`}
          >
            <Layers size={16} />
            <span>Version B: 50–60 सेकंद (In-Depth Case Law)</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            एकूण शब्द: <strong style={{ color: '#FFF' }}>{wordCount} शब्द</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            अंदाजित कालावधी: <strong style={{ color: '#D4AF37' }}>~{estDuration} सेकंद</strong>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-outline btn-sm"
          >
            <Edit3 size={14} />
            <span>{isEditing ? 'बदल रद्द करा' : 'स्क्रिप्ट एडिट करा'}</span>
          </button>
          {isEditing && (
            <button
              onClick={handleSaveEdits}
              className="btn btn-emerald btn-sm"
            >
              <Save size={14} />
              <span>जतन करा (Save)</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Step Structure Overview */}
      <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.45)' }}>
        <div style={{ fontWeight: 700, color: '#D4AF37', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
          📐 ५-टप्प्यांची उच्च-रिटेन्शन रचना (High-Retention Structure):
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ color: '#D4AF37', fontWeight: 700 }}>१. HOOK (१-२ से):</span> थेट समस्या किंवा धक्कादायक सत्य
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>२. PROBLEM:</span> दररोजची खरी अडचण
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>३. LEGAL TRUTH:</span> कलम व नियमांचे स्पष्टीकरण
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>४. ACTION:</span> प्रत्यक्ष काय करावे (३०-वर्षे सर्च)
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
            <span style={{ color: '#EC4899', fontWeight: 700 }}>५. CTA:</span> सेव्ह, शेअर आणि फॉलो
          </div>
        </div>
      </div>

      {/* Spoken Teleprompter Script Area */}
      <div className="glass-card" style={{ border: '1.5px solid rgba(212, 175, 55, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tv size={18} color="#D4AF37" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
              थेट कॅमेऱ्यासमोर वाचायची मराठी स्क्रिप्ट ({activeFormat === 'A' ? 'Version A: 30–40 सेकंद' : 'Version B: 50–60 सेकंद'})
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(currentScript, 'script_box', 'स्क्रिप्ट कॉपी झाली!')}
            className="btn btn-outline btn-sm"
          >
            {copiedKey === 'script_box' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            <span>COPY SCRIPT</span>
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={activeFormat === 'A' ? editedScriptA : editedScriptB}
            onChange={(e) => {
              if (activeFormat === 'A') setEditedScriptA(e.target.value);
              else setEditedScriptB(e.target.value);
            }}
            rows={12}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#0B0F17',
              color: '#FFF',
              border: '1px solid #D4AF37',
              borderRadius: '8px',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              fontFamily: "'Mukta', sans-serif"
            }}
          />
        ) : (
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1.5rem',
            borderRadius: '8px',
            fontSize: '1.18rem',
            lineHeight: 1.85,
            color: '#F8FAFC',
            whiteSpace: 'pre-line',
            fontFamily: "'Mukta', sans-serif",
            borderLeft: '4px solid #D4AF37'
          }}>
            {currentScript}
          </div>
        )}
      </div>
    </div>
  );
}
