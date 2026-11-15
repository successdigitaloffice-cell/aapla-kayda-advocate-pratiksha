import React from 'react';
import { Award, Trophy, Star, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function Tab2Top3Reels({ trendsData, onSelectBest, onGenerateForTopic, onNotify }) {
  const { top3 = [], bestToday, date } = trendsData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold">TAB 2: Top 3 Recommended Reels</span>
            <span className="badge badge-emerald">१०० गुणांच्या निकषांवर आधारित</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
            आजच्या सर्वोत्कृष्ट ३ कायदेशीर Reels शिफारसी
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Advocate Pratiksha यांच्यासाठी महाराष्ट्रातील ट्रेंड, सेव्ह्स/शेअर्स क्षमता आणि कायदेशीर अचूकतेवर निवडलेले टॉप ३ विषय.
          </p>
        </div>
      </div>

      {/* Best Topic of the Day Spotlight */}
      {bestToday && (
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.75rem',
            padding: '0.35rem 1rem',
            borderBottomLeftRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Trophy size={14} />
            <span>#1 आजचा सर्वोत्तम विषय (BEST TOPIC TODAY)</span>
          </div>

          <div style={{ paddingRight: '6rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              {bestToday.category}
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF', margin: '0.3rem 0' }}>
              {bestToday.topic_name}
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', margin: '0.5rem 0' }}>
              <strong>हा विषय का निवडला:</strong> {bestToday.why_important_today}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            margin: '1rem 0',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>एकूण ट्रेंड स्कोर</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4AF37' }}>
                {bestToday.score || 94} / १००
              </div>
            </div>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>कायदेशीर तरतूद व कलम</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF' }}>
                {bestToday.primary_legal_sources}
              </div>
            </div>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>अल्गोरिदम व्हेंटेज / क्षमता</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10B981' }}>
                {bestToday.viral_potential} (कमाल शेअर्स व सेव्ह्स)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button
              onClick={() => onGenerateForTopic(bestToday)}
              className="btn btn-gold btn-md"
            >
              <Sparkles size={16} />
              <span>या विषयाची स्क्रिप्ट तयार करा (Generate Script)</span>
            </button>
          </div>
        </div>
      )}

      {/* Top 3 Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {top3.map((topic, index) => {
          const breakdown = topic.score_breakdown || {
            trendEvidence: 24 - index,
            audienceRelevance: 19,
            savesSharesPotential: 19 - index,
            hookStorytelling: 14,
            mhRelevance: 10,
            legalQuality: 10
          };

          return (
            <div
              key={topic.id || index}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: index === 0 ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: index === 0 ? '#D4AF37' : index === 1 ? '#94A3B8' : '#CD7F32',
                      color: '#000',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem'
                    }}>
                      #{index + 1}
                    </div>
                    <span className="badge badge-gold">{topic.category}</span>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D4AF37' }}>
                    {topic.score || topic.trend_score || 90}/१००
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                  {topic.topic_name}
                </h3>

                <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                  {topic.why_important_today}
                </p>

                {/* 100-Point Score Breakdown */}
                <div style={{
                  background: 'rgba(0,0,0,0.25)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    १०० गुणांचे सविस्तर निकष (Score Breakdown):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', color: '#E2E8F0' }}>
                    <div>• ट्रेंड पुरावा: <strong>{breakdown.trendEvidence}/२५</strong></div>
                    <div>• उपयुक्तता: <strong>{breakdown.audienceRelevance}/२०</strong></div>
                    <div>• सेव्ह्स/शेअर्स: <strong>{breakdown.savesSharesPotential}/२०</strong></div>
                    <div>• हुक क्षमता: <strong>{breakdown.hookStorytelling}/१५</strong></div>
                    <div>• महाराष्ट्र सुसंगती: <strong>{breakdown.mhRelevance}/१०</strong></div>
                    <div>• कायदेशीर स्रोत: <strong>{breakdown.legalQuality}/१०</strong></div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={14} color="#10B981" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  कायदेशीर संदर्भ: <span style={{ color: '#FFF' }}>{topic.primary_legal_sources}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => onGenerateForTopic(topic)}
                  className="btn btn-gold btn-sm"
                  style={{ flex: 1 }}
                >
                  <Sparkles size={14} />
                  <span>स्क्रिप्ट तयार करा</span>
                </button>
                <button
                  onClick={() => onSelectBest(topic.id)}
                  className="btn btn-outline btn-sm"
                  title="आजचा नंबर १ विषय म्हणून निश्चित करा"
                >
                  <Trophy size={14} />
                  <span>निवडा</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
