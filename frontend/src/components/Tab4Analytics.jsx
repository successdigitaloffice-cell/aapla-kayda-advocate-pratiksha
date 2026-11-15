import React from 'react';
import {
  BarChart3, Users, Eye, Send, Bookmark, Heart, Clock, TrendingUp,
  Compass, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function Tab4Analytics({ analyticsData }) {
  if (!analyticsData) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>डेटा लोड होत आहे...</div>;
  }

  const { overview = {}, followerGrowth = {}, categoryStats = {}, postingSlotBenchmark = [], videoComparison = [] } = analyticsData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 100K Followers Goal Progress Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 22, 38, 0.95) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-emerald">डेटा-आधारित प्रगती ट्रॅकर</span>
              <span className="badge badge-gold">ध्येय: 1,00,000 Instagram Followers</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
              Followers प्रगती: {followerGrowth.currentFollowers?.toLocaleString('en-IN')} / 1,00,000
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-display)' }}>
              {followerGrowth.followerProgressPct}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              उर्वरित: {followerGrowth.remainingFollowers?.toLocaleString('en-IN')} फॉलोअर्स
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: `${followerGrowth.followerProgressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981 0%, #D4AF37 100%)',
              borderRadius: '9999px',
              transition: 'width 0.6s ease'
            }}
          ></div>
        </div>

        {/* Realistic Empirical Disclaimer as strictly mandated by prompt Section 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
          <ShieldCheck size={16} color="#10B981" />
          <span>
            <strong>वस्तुनिष्ठ नोंद:</strong> {followerGrowth.honestDisclaimer} (Reel सरासरी वाढ: ~{followerGrowth.avgFollowsPerReel} फॉलोअर्स प्रति Reel).
          </span>
        </div>
      </div>

      {/* Aggregate Metric Stats Grid */}
      <div className="grid-4-col">
        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className="metric-label">एकूण व्ह्यूज (Total Views)</span>
            <Eye size={18} color="#D4AF37" />
          </div>
          <div className="metric-value">{overview.totalViews?.toLocaleString('en-IN')}</div>
          <div className="metric-sub">एकूण पोहोच (Reach): {overview.totalReach?.toLocaleString('en-IN')}</div>
        </div>

        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className="metric-label">शेअर्स (Sends / Shares)</span>
            <Send size={18} color="#10B981" />
          </div>
          <div className="metric-value" style={{ color: '#10B981' }}>{overview.totalSends?.toLocaleString('en-IN')}</div>
          <div className="metric-sub">Sends per Reach: <strong>{overview.avgSendsPerReach}%</strong> (कमाल वितरण)</div>
        </div>

        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className="metric-label">सेव्ह्स (Saves)</span>
            <Bookmark size={18} color="#F59E0B" />
          </div>
          <div className="metric-value" style={{ color: '#FCD34D' }}>{overview.totalSaves?.toLocaleString('en-IN')}</div>
          <div className="metric-sub">Saves per Reach: <strong>{overview.avgSavesPerReach}%</strong> (रेफरन्स व्हॅल्यू)</div>
        </div>

        <div className="metric-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className="metric-label">सरासरी वॉच टाईम</span>
            <Clock size={18} color="#38BDF8" />
          </div>
          <div className="metric-value" style={{ color: '#38BDF8' }}>{overview.avgWatchTime} से.</div>
          <div className="metric-sub">प्रोफाईल भेटी: {overview.totalProfileVisits?.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Posting Time Optimizer (Empirical Testing) */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={20} className="icon-accent" />
            <span>Posting Time Optimization (महाराष्ट्रातील प्रेक्षक चाचणी वेळा)</span>
          </div>
          <span className="badge badge-gold">Algorithm Testing Strategy</span>
        </div>

        <div className="grid-3-col">
          {postingSlotBenchmark.map((slot, idx) => (
            <div key={idx} style={{ background: 'rgba(10, 16, 29, 0.7)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem' }}>{slot.slot}</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>{slot.avgEngagementRate} Eng.</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.5rem' }}>{slot.description}</div>
              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.25rem' }}>
                <strong>शेअर्स दर 1k पोहोच:</strong> {slot.avgSendsPer1k}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#D4AF37' }}>
                <strong>शिफारस:</strong> {slot.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video by Video Comparison Table */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={20} className="icon-accent" />
            <span>व्हिडिओनुसार कामगिरी तुलना (Reel by Reel Metric Breakdown)</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            सध्या प्रकाशित {videoComparison.length} Reels ची तुलना
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94A3B8' }}>
                <th style={{ padding: '0.75rem' }}>Reel</th>
                <th style={{ padding: '0.75rem' }}>विषय</th>
                <th style={{ padding: '0.75rem' }}>व्ह्यूज</th>
                <th style={{ padding: '0.75rem' }}>वॉच टाईम</th>
                <th style={{ padding: '0.75rem' }}>शेअर्स (Sends)</th>
                <th style={{ padding: '0.75rem' }}>सेव्ह्स (Saves)</th>
                <th style={{ padding: '0.75rem' }}>मिळालेले Followers</th>
                <th style={{ padding: '0.75rem' }}>अल्गोरिदम दर्जा</th>
              </tr>
            </thead>
            <tbody>
              {videoComparison.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 800, color: '#D4AF37' }}>
                    Day {item.day_number}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: '#FFF' }}>
                    {item.title}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>
                    {item.views.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#38BDF8' }}>
                    {item.avg_watch_time}s
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#10B981', fontWeight: 700 }}>
                    {item.sends.toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({item.sendsRate})</span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#FCD34D', fontWeight: 700 }}>
                    {item.saves.toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({item.savesRate})</span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: '#6EE7B7', fontWeight: 700 }}>
                    +{item.follows_attributed.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span className={`badge ${item.viralityBadge === 'Viral Breakout' ? 'badge-gold' : 'badge-emerald'}`}>
                      {item.viralityBadge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
