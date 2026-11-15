import React, { useState } from 'react';
import { Flame, RefreshCw, Trophy, ShieldCheck, Sparkles, Clock, CheckCircle2, MapPin } from 'lucide-react';

export default function Tab1Trends({ trendsData, onRefreshTrends, onSelectBest, onGenerateForTopic, onRun24HourCycle, onNotify }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRunning24h, setIsRunning24h] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const { date, totalEvaluated, bestToday, top3 = [], allTopics = [] } = trendsData || {};

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshTrends();
      onNotify('नवीन १० ट्रेंडिंग जमीन व गुंठेवारी विषयांचे संशोधन पूर्ण!');
    } catch (err) {
      onNotify('संशोधन करताना त्रुटी आली: ' + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRun24h = async () => {
    if (!onRun24HourCycle) return;
    setIsRunning24h(true);
    try {
      const res = await onRun24HourCycle();
      onNotify(res.message || '२४ तासांचे संपूर्ण स्वयंचलित विश्लेषण व बॅकअप यशस्वी!');
    } catch (err) {
      onNotify('२४-तास सायकल त्रुटी: ' + err.message);
    } finally {
      setIsRunning24h(false);
    }
  };

  const filteredTopics = allTopics.filter(t => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'EVERGREEN') return t.is_evergreen === 1;
    if (filterCategory === 'गुंठेवारी') return t.topic_name.includes('गुंठेवारी') || t.category.includes('गुंठेवारी');
    if (filterCategory === 'तुकडेबंदी') return t.topic_name.includes('तुकडेबंदी') || t.topic_name.includes('तुकडा');
    if (filterCategory === 'अकृषिक') return t.topic_name.includes('अकृषिक') || t.topic_name.includes('NA') || t.topic_name.includes('रस्ता');
    return t.category.includes(filterCategory);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Action */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span className="badge badge-gold">दैनिक संशोधन दिनांक: {date || 'आज'}</span>
            <span className="badge badge-emerald">एकूण तपासलेले: {totalEvaluated || 10} विषय</span>
            <span className="badge badge-cyan" style={{ border: '1px solid #38BDF8' }}>
              विशेष लक्ष: जमीन खरेदी-विक्री, गुंठेवारी नियम व तुकडेबंदी
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
            महाराष्ट्र जमीन व गुंठेवारी कायदेशीर ट्रेंड्स (Daily Land & Property Trend Engine)
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Google Trends Maharashtra, नगररचना गुंठेवारी शासन निर्णय, मुंबई उच्च न्यायालयाचे तुकडेबंदी निकाल आणि महसूल परिपत्रके.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* 24-Hour Cycle Trigger Button */}
          <button
            onClick={handleRun24h}
            disabled={isRunning24h}
            className="btn btn-emerald btn-lg"
            title="मागील २४ तासांचे विश्लेषण, बॅकअप आणि ट्रेंड्स तात्काळ चालवा"
          >
            <Clock size={18} className={isRunning24h ? 'animate-spin' : ''} />
            <span>{isRunning24h ? '२४-तास सायकल सुरू...' : 'Run 24h Cycle Now'}</span>
          </button>

          {/* Refresh Trends Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-gold btn-lg"
            style={{ boxShadow: 'var(--gold-glow)' }}
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'संशोधन सुरू आहे...' : "Find Today's Trending Topics"}</span>
          </button>
        </div>
      </div>

      {/* Today's #1 Best Topic Spotlight */}
      {bestToday && (
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(14, 22, 38, 0.95) 100%)',
            borderColor: 'var(--gold-primary)',
            boxShadow: 'var(--gold-glow)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                <Trophy size={16} color="#D4AF37" />
                <span>#1 आजचा सर्वोत्तम निवडलेला विषय (Recommended For Today's Reel)</span>
              </span>
              <span className="badge badge-emerald">{bestToday.category}</span>
              {bestToday.is_evergreen === 1 && (
                <span className="badge badge-cyan">कायम उपयोगी (Evergreen Legal Guide)</span>
              )}
            </div>

            <button
              onClick={() => onGenerateForTopic(bestToday)}
              className="btn btn-emerald"
            >
              <Sparkles size={16} />
              <span>या विषयाची स्क्रिप्ट तयार करा</span>
            </button>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            {bestToday.topic_name}
          </h3>

          <div className="grid-3-col" style={{ marginTop: '1rem' }}>
            <div className="metric-box">
              <span className="metric-label">आज का महत्त्वाचा आहे?</span>
              <p style={{ fontSize: '0.88rem', color: '#E2E8F0', marginTop: '0.25rem' }}>
                {bestToday.why_important_today}
              </p>
            </div>

            <div className="metric-box">
              <span className="metric-label">शोध / ट्रेंड संकेत (Search Signals)</span>
              <p style={{ fontSize: '0.88rem', color: '#E2E8F0', marginTop: '0.25rem' }}>
                {bestToday.search_signals || 'स्थानिक महसूल व वृत्त संदर्भ'}
              </p>
            </div>

            <div className="metric-box">
              <span className="metric-label">अधिकृत कायदेशीर स्रोत (India Code / GR)</span>
              <p style={{ fontSize: '0.88rem', color: '#E2E8F0', marginTop: '0.25rem' }}>
                {bestToday.primary_legal_sources}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.82rem', color: '#94A3B8', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <strong>महाराष्ट्रातील उपयुक्तता:</strong> {bestToday.maharashtra_relevance}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>पडताळणी पुरावा: {bestToday.trend_evidence}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium Highlights */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={18} color="#D4AF37" />
          <span>Top 3 प्राधान्यक्रम विषय (Top 3 Daily Land & Property Finalists)</span>
        </h3>
        <div className="grid-3-col">
          {top3.map((item, idx) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                position: 'relative',
                border: item.selection_rank === 1 ? '1px solid var(--gold-primary)' : '1px solid var(--border-glass)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-gold">Rank #{item.selection_rank || idx + 1}</span>
                <span className={`badge ${item.viral_potential === 'High' ? 'badge-emerald' : 'badge-amber'}`}>
                  {item.viral_potential} Viral Potential
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', minHeight: '52px', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                {item.topic_name}
              </h4>

              <div style={{ fontSize: '0.82rem', color: '#D4AF37', marginBottom: '0.35rem', fontWeight: 600 }}>
                {item.category}
              </div>

              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '1rem' }}>
                {item.why_important_today}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {item.selection_rank !== 1 && (
                  <button
                    onClick={() => onSelectBest(item.id)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    आजचा सर्वोत्तम बनवा
                  </button>
                )}
                <button
                  onClick={() => onGenerateForTopic(item)}
                  className="btn btn-gold btn-sm"
                  style={{ flex: 1 }}
                >
                  स्क्रिप्ट बनवा
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full 10 Topics Evaluation Table / Cards */}
      <div className="glass-card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="card-title">
            <Flame size={20} className="icon-accent" />
            <span>आज तपासलेले सर्व १० कायदेशीर विषय (Complete Evaluation List — {filteredTopics.length})</span>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'गुंठेवारी', 'तुकडेबंदी', 'जमीन', 'अकृषिक', 'EVERGREEN'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`btn btn-sm ${filterCategory === cat ? 'btn-gold' : 'btn-outline'}`}
              >
                {cat === 'ALL' ? 'सर्व (१०)' : cat === 'EVERGREEN' ? 'कायम उपयोगी' : cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTopics.map((topic, index) => (
            <div
              key={topic.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(10, 16, 29, 0.6)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '300px' }}>
                <span style={{ fontWeight: 800, color: '#D4AF37', fontSize: '1.1rem', minWidth: '24px' }}>
                  #{index + 1}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{topic.category}</span>
                    {topic.is_evergreen === 1 ? (
                      <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Evergreen Guide</span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>Live Trend Signal</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {topic.similarity_with_past}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFF', marginBottom: '0.3rem' }}>
                    {topic.topic_name}
                  </h5>

                  <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                    <strong>स्रोत:</strong> {topic.primary_legal_sources} • <strong>प्रेक्षक:</strong> {topic.target_audience}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={`badge ${topic.viral_potential === 'High' ? 'badge-emerald' : 'badge-amber'}`}>
                  {topic.viral_potential}
                </span>

                <button
                  onClick={() => onGenerateForTopic(topic)}
                  className="btn btn-outline btn-sm"
                >
                  <Sparkles size={14} />
                  <span>स्क्रिप्ट बनवा</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
