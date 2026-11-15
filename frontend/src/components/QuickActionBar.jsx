import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Video,
  Send,
  ArrowRight,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function QuickActionBar({
  activeReel,
  onRefreshTrends,
  onGenerateScript,
  onVerifySources,
  onCopyScript,
  onCopyCaption,
  onMarkRecorded,
  onOpenPublishModal,
  onGenerateNext,
  onAnalyzePerformance,
  onOpenVideoStudio,
  onOpenContentStudio,
  onOpenContentBank,
  isRefreshing,
  isAnalyzing
}) {
  const [copiedKey, setCopiedKey] = useState('');

  const handleCopy = (type) => {
    if (type === 'script') {
      onCopyScript();
      setCopiedKey('script');
    } else if (type === 'caption') {
      onCopyCaption();
      setCopiedKey('caption');
    }
    setTimeout(() => setCopiedKey(''), 2500);
  };

  return (
    <div className="quick-actions-bar" style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      padding: '0.6rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.6rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#D4AF37',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'rgba(212, 175, 55, 0.15)',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px'
        }}>
          ९ आवश्यक कृती बटणे (9 Required Actions):
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.45rem'
      }}>
        {/* 1. FIND TODAY'S TRENDS */}
        <button
          onClick={onRefreshTrends}
          disabled={isRefreshing}
          className="btn btn-gold btn-xs"
          title="आजच्या १० कायदेशीर विषयांचे संशोधन करा"
        >
          <Flame size={13} />
          <span>FIND TODAY'S TRENDS</span>
        </button>

        {/* 2. GENERATE SCRIPT */}
        <button
          onClick={onGenerateScript}
          className="btn btn-outline btn-xs"
          title="सक्रिय विषयाची ३०-४०s व ५०-६०s मराठी स्क्रिप्ट तयार करा"
        >
          <Sparkles size={13} color="#D4AF37" />
          <span>GENERATE SCRIPT</span>
        </button>

        {/* 2B. DIRECT VIDEO STUDIO */}
        <button
          onClick={onOpenVideoStudio}
          className="btn btn-gold btn-xs"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', color: '#FFF', fontWeight: 800 }}
          title="थेट 9:16 Instagram Reel व्हिडिओ बनवा (Tab 9)"
        >
          <Video size={13} />
          <span>🎬 MAKE VIDEO (Tab 9)</span>
        </button>

        {/* 2C. AI CONTENT STUDIO & SUGGESTER */}
        <button
          onClick={onOpenContentStudio}
          className="btn btn-gold btn-xs"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', border: 'none', color: '#FFF', fontWeight: 800 }}
          title="नवीन कायदेशीर विषय सुचवा किंवा स्वतःची स्क्रिप्ट बनवा (Tab 10)"
        >
          <Sparkles size={13} />
          <span>✨ AI CREATE (Tab 10)</span>
        </button>

        {/* 2D. 60-DAY CONTENT ROADMAP & SEO */}
        <button
          onClick={onOpenContentBank}
          className="btn btn-gold btn-xs"
          style={{ background: 'linear-gradient(135deg, #EC4899, #BE185D)', border: 'none', color: '#FFF', fontWeight: 800 }}
          title="६० दिवसांचा संपूर्ण कायदेशीर रोडमॅप व SEO कीवर्ड्स (Tab 11)"
        >
          <Calendar size={13} />
          <span>📅 60-DAY IDEAS (Tab 11)</span>
        </button>

        {/* 3. VERIFY LEGAL SOURCES */}
        <button
          onClick={onVerifySources}
          className="btn btn-outline btn-xs"
          title="अधिकृत महसूल कायदे व कलमांची पडताळणी तपासा"
        >
          <ShieldCheck size={13} color="#10B981" />
          <span>VERIFY LEGAL SOURCES</span>
        </button>

        {/* 4. COPY SCRIPT */}
        <button
          onClick={() => handleCopy('script')}
          className="btn btn-outline btn-xs"
          title="मराठी स्क्रिप्ट क्लिपबोर्डवर कॉपी करा"
        >
          {copiedKey === 'script' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>COPY SCRIPT</span>
        </button>

        {/* 5. COPY CAPTION */}
        <button
          onClick={() => handleCopy('caption')}
          className="btn btn-outline btn-xs"
          title="संपूर्ण Instagram कॅप्शन कॉपी करा"
        >
          {copiedKey === 'caption' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>COPY CAPTION</span>
        </button>

        {/* 6. MARK AS RECORDED */}
        <button
          onClick={() => onMarkRecorded(activeReel?.id)}
          disabled={!activeReel || activeReel.status === 'Recorded' || activeReel.status === 'Published'}
          className="btn btn-cyan btn-xs"
          title="ही Reel रेकॉर्ड झाली म्हणून चिन्हांकित करा"
        >
          <Video size={13} />
          <span>MARK AS RECORDED</span>
        </button>

        {/* 7. MARK AS PUBLISHED */}
        <button
          onClick={() => onOpenPublishModal(activeReel)}
          disabled={!activeReel || activeReel.status === 'Published'}
          className="btn btn-emerald btn-xs"
          title="Reel URL नोंदवून प्रकाशित अर्काइव्हमध्ये हलवा"
        >
          <Send size={13} />
          <span>MARK AS PUBLISHED</span>
        </button>

        {/* 8. GENERATE NEXT REEL */}
        <button
          onClick={onGenerateNext}
          className="btn btn-outline btn-xs"
          title="कॅलेंडरमधील पुढील Reel तयार करा"
        >
          <ArrowRight size={13} color="#38BDF8" />
          <span>GENERATE NEXT REEL</span>
        </button>

        {/* 9. ANALYZE PERFORMANCE */}
        <button
          onClick={onAnalyzePerformance}
          disabled={isAnalyzing}
          className="btn btn-purple btn-xs"
          style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #A855F7', color: '#E9D5FF' }}
          title="२४ तासांचे अल्गोरिदम विश्लेषण व मेट्रिक्स री-कॅल्क्युलेट करा"
        >
          <BarChart3 size={13} />
          <span>ANALYZE PERFORMANCE</span>
        </button>
      </div>
    </div>
  );
}
