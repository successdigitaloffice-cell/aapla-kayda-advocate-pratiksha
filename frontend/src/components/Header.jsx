import React from 'react';
import { Scale, ShieldCheck, Flame, Users, Calendar } from 'lucide-react';

export default function Header({ systemHealth, activeDay = 8, totalPublished = 7, targetFollowers = 100000, currentFollowers = 27890 }) {
  const followerPct = Math.min(100, ((currentFollowers / targetFollowers) * 100).toFixed(1));

  return (
    <header className="top-header">
      <div className="header-content">
        <div className="brand-badge-group">
          <div className="brand-logo-icon">
            <Scale size={26} strokeWidth={2.3} />
          </div>
          <div className="brand-titles">
            <h1 className="brand-name">
              आपला कायदा <span className="gold-text">– Advocate Pratiksha</span>
            </h1>
            <span className="brand-sub">
              Chief AI Legal Researcher & Instagram Growth Agent • 60 Days Legal Mastery
            </span>
          </div>
        </div>

        <div className="header-actions">
          {/* Calendar Day Progress */}
          <div className="metric-box" style={{ padding: '0.4rem 0.9rem', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={18} color="#D4AF37" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>कॅलेंडर दिवस</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
                Day {activeDay} <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/ 60</span>
              </div>
            </div>
          </div>

          {/* 100K Followers Goal Progress */}
          <div className="metric-box" style={{ padding: '0.4rem 0.9rem', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={18} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>1 लाख Followers ध्येय</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981' }}>
                {followerPct}% <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({currentFollowers.toLocaleString('en-IN')})</span>
              </div>
            </div>
          </div>

          {/* 24-Hour Land Engine Status */}
          <div className="status-indicator-pill" style={{ background: 'rgba(212, 175, 55, 0.12)', borderColor: 'rgba(212, 175, 55, 0.4)', color: '#F3E5AB' }}>
            <span className="pulse-dot" style={{ background: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }}></span>
            <span>24h Land & Gunthewari Engine: Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
