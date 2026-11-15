import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Tag,
  Hash,
  MessageSquare,
  Share2,
  BookOpen,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function Tab4CaptionsAndSEO({ activeReel, onNotify }) {
  const [copiedSection, setCopiedSection] = useState('');

  if (!activeReel) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <FileText size={48} color="#D4AF37" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>कोणतीही सक्रिय Reel निवडलेली नाही</h3>
        <p style={{ color: '#94A3B8', marginTop: '0.5rem' }}>
          कॅप्शन आणि SEO डेटा पाहण्यासाठी आधी Tab 1 किंवा Tab 2 मधून Reel निवडा.
        </p>
      </div>
    );
  }

  const copyToClipboard = (text, sectionKey, label) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    onNotify(`${label} क्लिपबोर्डवर कॉपी झाले!`);
    setTimeout(() => setCopiedSection(''), 2500);
  };

  const sourcesList = activeReel.official_sources ? JSON.parse(activeReel.official_sources) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold">TAB 4: Captions, SEO Keywords, Hashtags, and Pinned Comments</span>
            <span className="badge badge-emerald">Copy-Paste Ready Deliverables</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
            {activeReel.title}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Instagram वरील प्रकाशनासाठी सर्व A ते I आवश्यक विभाग थेट कॉपी करण्यासाठी उपलब्ध.
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(activeReel.caption, 'full_caption_btn', 'संपूर्ण कॅप्शन')}
          className="btn btn-gold btn-md"
        >
          {copiedSection === 'full_caption_btn' ? <Check size={16} color="#000" /> : <Copy size={16} />}
          <span>COPY CAPTION</span>
        </button>
      </div>

      {/* Grid of Deliverables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        
        {/* A. Reel Title & B. Cover Text */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>
                A. REEL TITLE (मराठी शोधयोग्य शीर्षक)
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.title, 'title', 'शीर्षक')}
                className="btn btn-outline btn-xs"
              >
                {copiedSection === 'title' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>कॉपी</span>
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', color: '#FFF', fontWeight: 600 }}>
              {activeReel.title}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8' }}>
                B. COVER TEXT (३ ते ७ शब्द कव्हर हेडलाईन)
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.cover_text || 'गुंठेवारी नियम: १ चूक करू नका!', 'cover', 'कव्हर मजकूर')}
                className="btn btn-outline btn-xs"
              >
                {copiedSection === 'cover' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>कॉपी</span>
              </button>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(0, 0, 0, 0.4))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.85rem',
              borderRadius: '6px',
              color: '#38BDF8',
              fontWeight: 800,
              fontSize: '1.05rem',
              textAlign: 'center'
            }}>
              "{activeReel.cover_text || 'गुंठेवारी नियम: १ चूक करू नका!'}"
            </div>
          </div>

          {/* F. Pinned Comment */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MessageSquare size={14} />
                <span>F. PINNED COMMENT (चर्चा सुरू करणारी पहिली कमेंट)</span>
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.pinned_comment, 'pinned', 'पिन केलेली कमेंट')}
                className="btn btn-outline btn-xs"
              >
                {copiedSection === 'pinned' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>कॉपी</span>
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.88rem' }}>
              {activeReel.pinned_comment || 'तुम्ही किंवा तुमच्या कुटुंबातील कोणाची जमीन खरेदी किंवा गुंठेवारीमध्ये अडचण झाली आहे का? खालील कमेंटमध्ये सांगा.'}
            </div>
          </div>

          {/* G. Share Prompt */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Share2 size={14} />
                <span>G. SHARE PROMPT (शेअर करण्यासाठी नैसर्गिक वाक्य)</span>
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.share_prompt, 'share', 'शेअर वाक्य')}
                className="btn btn-outline btn-xs"
              >
                {copiedSection === 'share' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>कॉपी</span>
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.88rem' }}>
              {activeReel.share_prompt || 'हा व्हिडिओ तुमच्या शेतकरी आणि जमीन किंवा प्लॉट खरेदी करणाऱ्या नातेवाईकांना लगेच शेअर करा, त्यांचे लाखो रुपयांचे नुकसान वाचू शकते!'}
            </div>
          </div>

          {/* I. Posting Recommendation */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EC4899', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                <span>I. POSTING RECOMMENDATION (शिफारस केलेली वेळ)</span>
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.88rem' }}>
              <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem' }}>
                {activeReel.recommended_posting_time || '07:00 PM IST (पर्यायी: 12:30 PM IST)'}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {activeReel.posting_time_evidence || 'महाराष्ट्रातील नोकरदार, शेतकरी व कौटुंबिक प्रेक्षकांचा संध्याकाळी सर्वाधिक ॲक्टिव्ह वेळ.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: C. Caption, D. Keywords, E. Hashtags, H. Sources */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* C. Complete Caption */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>
                C. INSTAGRAM DESCRIPTION / CAPTION
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.caption, 'caption_main', 'कॅप्शन')}
                className="btn btn-gold btn-xs"
              >
                {copiedSection === 'caption_main' ? <Check size={12} color="#000" /> : <Copy size={12} />}
                <span>COPY CAPTION</span>
              </button>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '6px',
              color: '#F1F5F9',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              maxHeight: '260px',
              overflowY: 'auto',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              {activeReel.caption}
            </div>
          </div>

          {/* D. SEO Keywords */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Tag size={14} />
                <span>D. SEO KEYWORDS (५ ते १० शोध वाक्यांश - हॅशटॅगपेक्षा वेगळे)</span>
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.keywords, 'keywords', 'कीवर्ड्स')}
                className="btn btn-outline btn-xs"
              >
                {copiedSection === 'keywords' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>कॉपी</span>
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.85rem' }}>
              {activeReel.keywords}
            </div>
          </div>

          {/* E. Hashtags */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Hash size={14} />
                <span>E. HASHTAGS (३ ते ८ संबंधित हॅशटॅग्स)</span>
              </span>
              <button
                onClick={() => copyToClipboard(activeReel.hashtags, 'hashtags', 'हॅशटॅग्स')}
                className="btn btn-outline btn-xs"
              >
                {copiedSection === 'hashtags' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>कॉपी</span>
              </button>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
              {activeReel.hashtags}
            </div>
          </div>

          {/* H. Official Sources */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A855F7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={14} />
                <span>H. SOURCES (अधिकृत कायदेशीर स्रोत व कलमे)</span>
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}>
              <div style={{ color: '#FFF', fontWeight: 600, marginBottom: '0.35rem' }}>
                कायदा: {activeReel.applicable_law} {activeReel.applicable_section && `(कलम ${activeReel.applicable_section})`}
              </div>
              {sourcesList.map((src, i) => (
                <div key={i} style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ExternalLink size={12} />
                  <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8', textDecoration: 'none' }}>
                    {src}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
