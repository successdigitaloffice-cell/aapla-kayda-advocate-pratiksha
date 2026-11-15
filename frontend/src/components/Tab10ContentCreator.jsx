import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lightbulb,
  PenTool,
  Film,
  Video,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Layers,
  Clock,
  Send,
  RefreshCw,
  Hash,
  AlertCircle,
  HelpCircle,
  BookmarkPlus
} from 'lucide-react';

export default function Tab10ContentCreator({ onNavigateToVideo, onNavigateToTab3, onNotify }) {
  // Mode selection: 'suggest' or 'create'
  const [activeMode, setActiveMode] = useState('suggest');

  // Filters for Suggest Mode
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [angleFilter, setAngleFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');

  // Suggested topics state
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Custom Creation State
  const [customTitle, setCustomTitle] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCategory, setCustomCategory] = useState('जमीन आणि मालमत्ता कायदे');
  const [customDuration, setCustomDuration] = useState('30');
  const [customLaw, setCustomLaw] = useState('महाराष्ट्र जमीन महसूल संहिता १९६६');
  const [customSection, setCustomSection] = useState('');

  // Generated Result State
  const [generatedReel, setGeneratedReel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  // Fetch initial suggestions on mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async (cat = categoryFilter, ang = angleFilter, aud = audienceFilter) => {
    setIsLoadingSuggestions(true);
    try {
      const q = new URLSearchParams();
      if (cat !== 'all') q.append('category', cat);
      if (ang !== 'all') q.append('angle', ang);
      if (aud !== 'all') q.append('audience', aud);

      const res = await fetch(`/api/content/suggestions?${q.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      if (onNotify) onNotify('आयडिया लोड करताना अडचण आली: ' + err.message);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleFilterChange = (type, val) => {
    let newCat = categoryFilter;
    let newAng = angleFilter;
    let newAud = audienceFilter;

    if (type === 'category') {
      newCat = val;
      setCategoryFilter(val);
    } else if (type === 'angle') {
      newAng = val;
      setAngleFilter(val);
    } else if (type === 'audience') {
      newAud = val;
      setAudienceFilter(val);
    }

    fetchSuggestions(newCat, newAng, newAud);
  };

  const handleSelectSuggestedTopic = (topic) => {
    setCustomTitle(topic.title);
    setCustomQuestion(topic.why_care || '');
    setCustomCategory(topic.category);
    setCustomLaw(topic.applicable_law);
    setCustomSection(topic.applicable_section || '');
    setActiveMode('create');
    handleGenerateCustom(topic.title, topic.why_care, topic.category, topic.applicable_law, topic.applicable_section);
  };

  const handleGenerateCustom = async (
    title = customTitle,
    question = customQuestion,
    category = customCategory,
    law = customLaw,
    section = customSection
  ) => {
    if (!title || title.trim().length === 0) {
      if (onNotify) onNotify('कृपया आधी विषयाचे नाव किंवा कायदेशीर प्रश्न टाका.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/content/create-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          user_question: question,
          category,
          duration: customDuration,
          applicable_law: law,
          applicable_section: section
        })
      });
      const data = await res.json();
      if (data.success && data.reel) {
        setGeneratedReel(data.reel);
        if (onNotify) onNotify('✨ नवीन कायदेशीर रील स्क्रिप्ट यशस्वीरीत्या तयार झाली!');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      if (onNotify) onNotify('स्क्रिप्ट तयार करताना त्रुटी: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToActiveQueue = async () => {
    if (!generatedReel) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/content/save-to-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedReel)
      });
      const data = await res.json();
      if (data.success) {
        if (onNotify) onNotify('✅ रील मुख्य कतारमध्ये सेव्ह झाले असून Tab 3 मध्ये जोडले गेले आहे!');
        if (onNavigateToTab3) onNavigateToTab3();
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err) {
      if (onNotify) onNotify('सेव्ह करताना त्रुटी: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendToVideoStudio = () => {
    if (!generatedReel) return;
    if (onNavigateToVideo) {
      onNavigateToVideo(generatedReel);
      if (onNotify) onNotify('🎬 स्क्रिप्ट Tab 9 (व्हिडिओ निर्मिती) मध्ये पाठवली आहे!');
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    if (onNotify) onNotify('क्लिपबोर्डवर कॉपी झाले!');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="tab-pane active" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(212,175,55,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
                <Sparkles size={26} color="#D4AF37" />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                Tab १०: AI कंटेंट निर्मिती आणि सुचना (Content Creator & Suggester)
              </h1>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              Advocate Pratiksha यांच्यासाठी ट्रेंडिंग कायदेशीर विषयांच्या नव्या कल्पना, हाय-इम्पॅक्ट हुक्स, मराठी स्क्रिप्ट्स आणि थेट व्हिडिओ निर्मिती.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: 'rgba(15,23,42,0.8)', padding: '4px', borderRadius: '12px', border: '1px solid #334155' }}>
            <button
              onClick={() => setActiveMode('suggest')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: activeMode === 'suggest' ? 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)' : 'transparent',
                color: activeMode === 'suggest' ? '#0F172A' : '#94A3B8',
                fontWeight: activeMode === 'suggest' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Lightbulb size={18} />
              💡 कायदेशीर आयडिया सुचवा (Suggest Me Content)
            </button>
            <button
              onClick={() => setActiveMode('create')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: activeMode === 'create' ? 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)' : 'transparent',
                color: activeMode === 'create' ? '#0F172A' : '#94A3B8',
                fontWeight: activeMode === 'create' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <PenTool size={18} />
              ✍️ माझ्या विषयावर रील बनवा (Create Custom)
            </button>
          </div>
        </div>
      </div>

      {/* QUICK INSPIRATION PILLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, whiteSpace: 'nowrap' }}>
          ⚡ झटपट प्रेरणा:
        </span>
        {[
          { label: '🌾 ७/१२ वरील बोजा हटवणे', title: '७/१२ उताऱ्यावरील इतर हक्कातील बोजा कसा कमी करावा किंवा हटवावा?', cat: 'जमीन आणि मालमत्ता कायदे' },
          { label: '👩 वडिलोपार्जित जमिनीत मुलीचा हक्क', title: 'वडिलोपार्जित शेतजमिनीत मुलीचा हक्क: लग्न जुने असले तरी हिस्सा मिळतो का?', cat: 'जमीन आणि मालमत्ता कायदे' },
          { label: '🛡️ सायबर फ्रॉड: Helpline 1930', title: 'ऑनलाइन बँकेतून पैसे गायब झाले? गोल्डन अवरमध्ये १९३० वर कॉल करा!', cat: 'ग्राहक आणि डिजिटल हक्क' },
          { label: '⚖️ BNSS कलम ३५: थेट अटक बंदी', title: 'पोलिसांनी बोलावल्यास थेट अटक करता येते का? BNSS कलम ३५ चे नवीन नियम', cat: 'फौजदारी कायदे आणि पोलीस प्रक्रिया' },
          { label: '🚜 शेतातील वहिवाटीचा रस्ता', title: 'शेतातील वहिवाटीचा रस्ता शेजाऱ्याने बंद केला? तहसीलदार कोर्टात कलम ५ चा अर्ज', cat: 'जमीन आणि मालमत्ता कायदे' }
        ].map((pill, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCustomTitle(pill.title);
              setCustomCategory(pill.cat);
              setActiveMode('create');
              handleGenerateCustom(pill.title, '', pill.cat);
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#CBD5E1',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#F8FAFC'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#CBD5E1'; }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* MODE 1: SUGGEST ME CONTENT (AI TOPIC SUGGESTER) */}
      {/* ======================================================== */}
      {activeMode === 'suggest' && (
        <div>
          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                  📂 कायदेशीर प्रवर्ग (Category)
                </label>
                <select
                  value={categoryFilter}
                  onChange={e => handleFilterChange('category', e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.9rem' }}
                >
                  <option value="all">सर्व प्रवर्ग (All Categories)</option>
                  <option value="जमीन आणि मालमत्ता कायदे">🌾 जमीन आणि मालमत्ता कायदे (Supreme Priority)</option>
                  <option value="महिला आणि कुटुंबाचे कायदे">👩 महिला आणि कुटुंबाचे कायदे</option>
                  <option value="फौजदारी कायदे आणि पोलीस प्रक्रिया">⚖️ फौजदारी कायदे आणि पोलीस प्रक्रिया</option>
                  <option value="ग्राहक आणि डिजिटल हक्क">🛡️ ग्राहक आणि डिजिटल हक्क</option>
                  <option value="नागरिक आणि दैनंदिन जीवनातील कायदे">📜 नागरिक आणि दैनंदिन जीवनातील कायदे</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                  🎯 कंटेंटची दिशा (Angle / Format)
                </label>
                <select
                  value={angleFilter}
                  onChange={e => handleFilterChange('angle', e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.9rem' }}
                >
                  <option value="all">सर्व अँगल (All Angles)</option>
                  <option value="सावधान राहा / फसवणूक टाळा">🚨 सावधान राहा / फसवणूक टाळा (High Shares)</option>
                  <option value="नागरिकांचे कायदेशीर अधिकार">💡 नागरिकांचे कायदेशीर अधिकार (High Saves)</option>
                  <option value="सोपी प्रक्रिया / स्टेप-बाय-स्टेप">📋 सोपी प्रक्रिया / स्टेप-बाय-स्टेप (High Bookmarks)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                  👥 कोणासाठी (Target Audience)
                </label>
                <select
                  value={audienceFilter}
                  onChange={e => handleFilterChange('audience', e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.9rem' }}
                >
                  <option value="all">सर्व प्रेक्षक (All Audiences)</option>
                  <option value="शेतकरी">शेतकरी बांधव (Farmers)</option>
                  <option value="प्लॉट खरेदीदार">प्लॉट व घर खरेदीदार (Buyers)</option>
                  <option value="महिला">महिला व कुटुंबे (Women & Families)</option>
                  <option value="नागरिक">सामान्य नागरिक (General Citizens)</option>
                </select>
              </div>

              <div>
                <button
                  onClick={() => fetchSuggestions()}
                  disabled={isLoadingSuggestions}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                    color: '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingSuggestions ? 'spin' : ''} />
                  {isLoadingSuggestions ? 'शोधत आहे...' : '✨ नवीन विषय सुचवा'}
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {suggestions.map((item, idx) => (
              <div
                key={item.id || idx}
                className="card"
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, border-color 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.78rem', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', padding: '0.25rem 0.65rem', borderRadius: '12px', fontWeight: 600 }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: item.score >= 95 ? '#4ADE80' : '#FACC15', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <TrendingUp size={14} /> Score: {item.score}/100
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    {item.title}
                  </h3>

                  {/* Hook preview */}
                  <div style={{ background: '#0F172A', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid #D4AF37', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                      🎯 Hook (सुरुवात):
                    </span>
                    <p style={{ fontSize: '0.88rem', color: '#E2E8F0', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{item.hook}"
                    </p>
                  </div>

                  {/* Legal Law details */}
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#CBD5E1', fontWeight: 600 }}>लागू कायदा: </span>
                    {item.applicable_law} {item.applicable_section && `(${item.applicable_section})`}
                  </div>

                  {/* Why Citizens Care */}
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem', lineHeight: 1.4 }}>
                    <span style={{ color: '#CBD5E1', fontWeight: 600 }}>महत्त्व: </span>
                    {item.why_care}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => handleSelectSuggestedTopic(item)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(212,175,55,0.4)',
                    background: 'rgba(212,175,55,0.1)',
                    color: '#F8FAFC',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#0F172A'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.color = '#F8FAFC'; }}
                >
                  <PenTool size={16} /> हा विषय निवडून स्क्रिप्ट बनवा
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: CREATE CUSTOM REEL CONTENT */}
      {/* ======================================================== */}
      {activeMode === 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: generatedReel ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
          {/* Left Column: Input Form */}
          <div className="card" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PenTool size={20} color="#D4AF37" />
              माझा विषय / प्रश्न टाका
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                  विषयाचे नाव किंवा नागरिकांची शंका (Topic Title) *
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="उदा. ७/१२ वरून नाव काढण्यासाठी काय करावे?"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                  नेमकी काय अडचण किंवा समस्या आहे? (Problem / Context)
                </label>
                <textarea
                  rows={3}
                  value={customQuestion}
                  onChange={e => setCustomQuestion(e.target.value)}
                  placeholder="उदा. भावाने परस्पर फसवणूक करून खरेदीखत केले आणि ७/१२ वर नाव लावले..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                    कायदेशीर प्रवर्ग (Category)
                  </label>
                  <select
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.9rem' }}
                  >
                    <option value="जमीन आणि मालमत्ता कायदे">🌾 जमीन आणि मालमत्ता कायदे</option>
                    <option value="महिला आणि कुटुंबाचे कायदे">👩 महिला आणि कुटुंबाचे कायदे</option>
                    <option value="फौजदारी कायदे आणि पोलीस प्रक्रिया">⚖️ फौजदारी कायदे व पोलीस (BNSS)</option>
                    <option value="ग्राहक आणि डिजिटल हक्क">🛡️ ग्राहक व डिजिटल/सायबर हक्क</option>
                    <option value="नागरिक आणि दैनंदिन जीवनातील कायदे">📜 नागरिक व दैनंदिन कायदे</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                    रील कालावधी (Reel Duration)
                  </label>
                  <select
                    value={customDuration}
                    onChange={e => setCustomDuration(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.9rem' }}
                  >
                    <option value="30">३०–४० सेकंद (Short & Punchy)</option>
                    <option value="60">५०–६० सेकंद (Detailed Explanation)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                    लागू कायदा (Applicable Law)
                  </label>
                  <input
                    type="text"
                    value={customLaw}
                    onChange={e => setCustomLaw(e.target.value)}
                    placeholder="उदा. महाराष्ट्र जमीन महसूल संहिता १९६६"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '0.4rem', fontWeight: 600 }}>
                    कलम / नियम (Section)
                  </label>
                  <input
                    type="text"
                    value={customSection}
                    onChange={e => setCustomSection(e.target.value)}
                    placeholder="उदा. कलम १४९, १५०"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleGenerateCustom()}
                disabled={isGenerating}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                  color: '#0F172A',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
                }}
              >
                <Sparkles size={20} className={isGenerating ? 'spin' : ''} />
                {isGenerating ? 'स्क्रिप्ट तयार होत आहे...' : '⚡ संपूर्ण रील पॅकेज तयार करा (Generate Reel)'}
              </button>
            </div>
          </div>

          {/* Right Column: Generated Reel Output */}
          {generatedReel && (
            <div className="card" style={{ background: '#1E293B', border: '1px solid #D4AF37', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Output Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#4ADE80', fontWeight: 700, background: 'rgba(74,222,128,0.1)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                    ✅ कायदेशीर पडताळणी पूर्ण (Verified)
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', margin: '0.4rem 0 0 0' }}>
                    {generatedReel.title}
                  </h3>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
                  ⏱️ {customDuration === '30' ? '३०-४० सेकंद' : '५०-६० सेकंद'}
                </span>
              </div>

              {/* Catchy Hook */}
              <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #D4AF37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 800 }}>
                    🔥 HOOK (पहिल्या २ सेकंदांत लक्ष वेधणारे वाक्य):
                  </span>
                  <button
                    onClick={() => handleCopy(generatedReel.hook, 'hook')}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                  >
                    {copiedType === 'hook' ? <Check size={14} color="#4ADE80" /> : <Copy size={14} />}
                    {copiedType === 'hook' ? 'कॉपी झाले' : 'कॉपी'}
                  </button>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#F8FAFC', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                  "{generatedReel.hook}"
                </p>
              </div>

              {/* Spoken Teleprompter Script */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700 }}>
                    🎙️ कॅमेऱ्यासमोर वाचण्याची मराठी स्क्रिप्ट (Teleprompter Script):
                  </label>
                  <button
                    onClick={() => handleCopy(customDuration === '30' ? generatedReel.script_format_a : generatedReel.script_format_b, 'script')}
                    style={{ background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    {copiedType === 'script' ? <Check size={14} color="#4ADE80" /> : <Copy size={14} />}
                    {copiedType === 'script' ? 'स्क्रिप्ट कॉपी झाली' : 'स्क्रिप्ट कॉपी करा'}
                  </button>
                </div>
                <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '10px', border: '1px solid #334155', maxHeight: '180px', overflowY: 'auto' }}>
                  <p style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
                    {customDuration === '30' ? generatedReel.script_format_a : generatedReel.script_format_b}
                  </p>
                </div>
              </div>

              {/* Instagram Caption & Hashtags */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 700 }}>
                    📝 Instagram Caption & Hashtags:
                  </label>
                  <button
                    onClick={() => handleCopy(generatedReel.caption, 'caption')}
                    style={{ background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    {copiedType === 'caption' ? <Check size={14} color="#4ADE80" /> : <Copy size={14} />}
                    {copiedType === 'caption' ? 'कॅप्शन कॉपी झाले' : 'कॅप्शन कॉपी करा'}
                  </button>
                </div>
                <div style={{ background: '#0F172A', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #334155', maxHeight: '120px', overflowY: 'auto' }}>
                  <pre style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {generatedReel.caption}
                  </pre>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid #334155' }}>
                <button
                  onClick={handleSendToVideoStudio}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                  }}
                >
                  <Video size={18} /> 🎬 थेट व्हिडिओ बनवा (Tab 9)
                </button>

                <button
                  onClick={handleSaveToActiveQueue}
                  disabled={isSaving}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(212,175,55,0.4)',
                    background: 'rgba(212,175,55,0.15)',
                    color: '#F8FAFC',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <BookmarkPlus size={18} /> {isSaving ? 'सेव्ह होत आहे...' : '📋 कतारमध्ये सेव्ह करा (Tab 3)'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
