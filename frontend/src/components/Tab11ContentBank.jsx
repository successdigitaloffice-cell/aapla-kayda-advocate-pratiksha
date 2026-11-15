import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Search,
  RefreshCw,
  Copy,
  Check,
  Video,
  PenTool,
  Hash,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  FileText,
  Filter
} from 'lucide-react';

export default function Tab11ContentBank({ onNavigateToVideo, onNavigateToTab10, onNotify }) {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedDay, setCopiedDay] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async (search = searchTerm, cat = selectedCategory, ph = selectedPhase) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      if (cat !== 'all') q.append('category', cat);
      if (ph !== 'all') q.append('phase', ph);

      const res = await fetch(`/api/content/60-days-ideas?${q.toString()}`);
      const data = await res.json();
      if (data.success) {
        setIdeas(data.ideas || []);
      }
    } catch (err) {
      console.error('Error fetching 60-day ideas:', err);
      if (onNotify) onNotify('आयडिया बँक लोड करताना त्रुटी: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshDailyTrends = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/content/60-days-refresh-trends', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIdeas(data.ideas || []);
        if (onNotify) onNotify('🔥 दैनिक SEO, Google व Instagram ट्रेंड्स यशस्वीरीत्या अद्यतनित झाले!');
      }
    } catch (err) {
      if (onNotify) onNotify('ट्रेंड्स रिफ्रेश करताना त्रुटी: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    fetchIdeas(val, selectedCategory, selectedPhase);
  };

  const handlePhaseChange = (phase) => {
    setSelectedPhase(phase);
    fetchIdeas(searchTerm, selectedCategory, phase);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    fetchIdeas(searchTerm, cat, selectedPhase);
  };

  const handleCopyIdea = (item) => {
    const text = `📌 दिवस क्र. ${item.day_number}: ${item.title}
🎯 Hook: "${item.hook}"
📱 स्क्रीनवरील मजकूर: ${item.screen_text}
⚖️ लागू कायदा: ${item.applicable_law} (${item.applicable_section})
🔍 SEO Keywords: ${item.seo_keywords}
🏷️ Hashtags: ${item.hashtags}
📈 Trend Signal: ${item.trend_signal}`;

    navigator.clipboard.writeText(text);
    setCopiedDay(item.day_number);
    if (onNotify) onNotify(`दिवस ${item.day_number} ची संपूर्ण आयडिया व SEO कॉपी झाले!`);
    setTimeout(() => setCopiedDay(null), 2500);
  };

  const handleSendToVideo = (item) => {
    if (onNavigateToVideo) {
      // Map to video format
      const structuredScript = {
        id: `reel_day_${item.day_number}`,
        title: item.title,
        hook: item.hook,
        category: item.category,
        applicable_law: item.applicable_law,
        script_format_a: `${item.hook} ${item.applicable_law} ${item.applicable_section} नुसार नागरिकांनी अधिकृत कागदपत्रांची तपासणी करावी. ही माहिती जमीन किंवा प्लॉट खरेदी करणाऱ्या व्यक्तीला नक्की शेअर करा आणि कायदेशीर मार्गदर्शनासाठी फॉलो करा आपला कायदा!`,
        caption: `${item.title}\n\nAdvocate Pratiksha कायदेशीर सल्ला.\n\nकायदा: ${item.applicable_law} (${item.applicable_section})\n\n${item.hashtags}`
      };
      onNavigateToVideo(structuredScript);
      if (onNotify) onNotify(`🎬 दिवस ${item.day_number} चा विषय Tab 9 (व्हिडिओ निर्मिती) मध्ये लोड केला!`);
    }
  };

  const handleSendToScriptCreator = (item) => {
    if (onNavigateToTab10) {
      onNavigateToTab10(item);
      if (onNotify) onNotify(`✍️ दिवस ${item.day_number} चा विषय Tab 10 मध्ये लोड केला!`);
    }
  };

  return (
    <div className="tab-pane active" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(212,175,55,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
                <Calendar size={26} color="#D4AF37" />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                Tab ११: ६० दिवसांच्या कायदेशीर आयडिया व SEO ट्रेंड्स (60-Day Content Bank)
              </h1>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              ६० दिवसांत ६० मूळ कायदेशीर Reels आणि १ लाख Instagram Followers च्या उद्दिष्टासाठी तयार केलेला दैनिक कीवर्ड्स, हुक्स आणि ट्रेंड्स रोडमॅप.
            </p>
          </div>

          <button
            onClick={handleRefreshDailyTrends}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
              color: '#0F172A',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(212,175,55,0.25)'
            }}
          >
            <RefreshCw size={17} className={isLoading ? 'spin' : ''} />
            {isLoading ? 'ट्रेंड्स तपासत आहे...' : '🔄 दैनिक SEO व Instagram ट्रेंड्स अपडेट करा'}
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>एकूण विषय (Goal)</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC' }}>६० दिवस / ६० रील्स</span>
          </div>
          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>🌾 जमीन व मालमत्ता</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D4AF37' }}>३० रील्स (५०%)</span>
          </div>
          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>👩 महिला व कुटुंब</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F472B6' }}>१० रील्स</span>
          </div>
          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>⚖️ फौजदारी (BNSS)</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60A5FA' }}>८ रील्स</span>
          </div>
          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>🛡️ सायबर व ग्राहक</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399' }}>७ रील्स</span>
          </div>
          <div style={{ background: '#0F172A', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>📜 नागरी हक्क</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#A78BFA' }}>५ रील्स</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#1E293B', border: '1px solid #334155', borderRadius: '14px', padding: '1.25rem' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="कोणताही शब्द शोधा... (उदा. फेरफार, गुंठेवारी, तुकडेबंदी, सायबर, मुलगी, Day 5, BNSS)"
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '8px',
              background: '#0F172A',
              border: '1px solid #334155',
              color: '#F8FAFC',
              fontSize: '0.92rem'
            }}
          />
        </div>

        {/* Phase Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.6rem', marginBottom: '0.75rem' }}>
          {[
            { id: 'all', label: '🌟 सर्व ६० दिवस (All 60 Days)' },
            { id: 'दिवस १-१०', label: '🌾 दिवस १-१० (जमीन व ७/१२)' },
            { id: 'दिवस ११-२०', label: '📜 दिवस ११-२० (वाटणी व महिला हक्क)' },
            { id: 'दिवस २१-३०', label: '⚖️ दिवस २१-३० (पोलीस व सायबर)' },
            { id: 'दिवस ३१-४०', label: '🏛️ दिवस ३१-४० (नवीन कायदे)' },
            { id: 'दिवस ४१-५०', label: '🔍 दिवस ४१-५० (मिथक vs सत्य)' },
            { id: 'दिवस ५१-६०', label: '🚀 दिवस ५१-६० (टॉप अपडेट्स)' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handlePhaseChange(p.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: selectedPhase === p.id ? '1px solid #D4AF37' : '1px solid #334155',
                background: selectedPhase === p.id ? 'rgba(212,175,55,0.15)' : '#0F172A',
                color: selectedPhase === p.id ? '#D4AF37' : '#94A3B8',
                fontWeight: selectedPhase === p.id ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'सर्व प्रवर्ग' },
            { id: 'जमीन आणि मालमत्ता कायदे', label: '🌾 जमीन व मालमत्ता' },
            { id: 'महिला आणि कुटुंबाचे कायदे', label: '👩 महिला व कुटुंब' },
            { id: 'फौजदारी कायदे आणि पोलीस प्रक्रिया', label: '⚖️ फौजदारी (BNSS)' },
            { id: 'ग्राहक आणि डिजिटल हक्क', label: '🛡️ ग्राहक व सायबर' },
            { id: 'नागरिक आणि दैनंदिन जीवनातील कायदे', label: '📜 नागरिक हक्क' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                border: selectedCategory === c.id ? '1px solid #4ADE80' : '1px solid #334155',
                background: selectedCategory === c.id ? 'rgba(74,222,128,0.1)' : 'transparent',
                color: selectedCategory === c.id ? '#4ADE80' : '#94A3B8',
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 60 DAYS IDEAS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(370px, 1fr))', gap: '1.25rem' }}>
        {ideas.map((item) => (
          <div
            key={item.day_number}
            className="card"
            style={{
              background: '#1E293B',
              border: item.day_number <= 3 ? '1px solid #D4AF37' : '1px solid #334155',
              borderRadius: '14px',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = item.day_number <= 3 ? '#D4AF37' : '#334155'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div>
              {/* Card Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', color: '#0F172A', fontWeight: 900, fontSize: '0.78rem', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    DAY {String(item.day_number).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {item.phase.split('(')[0]}
                  </span>
                </div>

                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: item.seo_score >= 95 ? '#4ADE80' : '#FACC15', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Flame size={14} color="#D4AF37" /> SEO: {item.seo_score}/100
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                {item.title}
              </h3>

              {/* Hook Box */}
              <div style={{ background: '#0F172A', padding: '0.75rem 0.9rem', borderRadius: '8px', borderLeft: '3px solid #D4AF37', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                  🎯 HOOK (पहिल्या २ सेकंदांत लक्ष वेधणारे वाक्य):
                </span>
                <p style={{ fontSize: '0.86rem', color: '#E2E8F0', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{item.hook}"
                </p>
              </div>

              {/* Screen Text Box */}
              <div style={{ background: 'rgba(212,175,55,0.06)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px dashed rgba(212,175,55,0.25)', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#CBD5E1', fontWeight: 700 }}>
                  📱 स्क्रीनवरील मजकूर:
                </span>
                <span style={{ fontSize: '0.82rem', color: '#F8FAFC', marginLeft: '0.4rem', fontWeight: 500 }}>
                  {item.screen_text}
                </span>
              </div>

              {/* SEO Keywords & Trend Signal */}
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.4rem' }}>
                <span style={{ color: '#CBD5E1', fontWeight: 600 }}>🔍 SEO Keywords: </span>
                <span style={{ color: '#E2E8F0' }}>{item.seo_keywords}</span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.4rem' }}>
                <span style={{ color: '#CBD5E1', fontWeight: 600 }}>📈 ट्रेंड संकेत: </span>
                <span style={{ color: '#4ADE80' }}>{item.trend_signal}</span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.75rem' }}>
                <span style={{ color: '#CBD5E1', fontWeight: 600 }}>⚖️ कायदा: </span>
                {item.applicable_law} ({item.applicable_section})
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
              <button
                onClick={() => handleSendToVideo(item)}
                style={{
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
                title="थेट 9:16 व्हिडिओ बनवा (Tab 9)"
              >
                <Video size={14} /> व्हिडिओ बनवा
              </button>

              <button
                onClick={() => handleSendToScriptCreator(item)}
                style={{
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(212,175,55,0.4)',
                  background: 'rgba(212,175,55,0.12)',
                  color: '#F8FAFC',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
                title="Tab 10 मध्ये सविस्तर स्क्रिप्ट लिहा"
              >
                <PenTool size={14} /> स्क्रिप्ट बनवा
              </button>

              <button
                onClick={() => handleCopyIdea(item)}
                style={{
                  padding: '0.55rem',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  background: '#0F172A',
                  color: copiedDay === item.day_number ? '#4ADE80' : '#CBD5E1',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
                title="आयडिया व SEO कीवर्ड्स कॉपी करा"
              >
                {copiedDay === item.day_number ? <Check size={14} /> : <Copy size={14} />}
                {copiedDay === item.day_number ? 'कॉपी' : 'कॉपी'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
