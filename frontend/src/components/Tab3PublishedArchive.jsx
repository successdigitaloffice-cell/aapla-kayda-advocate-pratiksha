import React, { useState } from 'react';
import {
  Archive, Search, Filter, ExternalLink, Calendar, Eye, Send, Bookmark,
  ShieldCheck, AlertCircle, ScanLine, ArrowRight
} from 'lucide-react';

export default function Tab3PublishedArchive({ archiveList = [], calendarList = [], onRunDuplicateScan, onNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('archive'); // 'archive' or 'roadmap'

  // Duplicate Scanner State
  const [scanTitle, setScanTitle] = useState('');
  const [scanSection, setScanSection] = useState('');
  const [scanQuestion, setScanQuestion] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const filteredArchive = archiveList.filter(item => {
    const matchesCategory = categoryFilter === 'ALL' || item.category.includes(categoryFilter);
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.legal_question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicable_law.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDuplicateScan = async (e) => {
    e.preventDefault();
    if (!scanTitle) {
      onNotify('कृपया तपासण्यासाठी किमान विषय किंवा शीर्षक प्रविष्ट करा.');
      return;
    }

    setIsScanning(true);
    try {
      const res = await fetch('/api/duplicate/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scanTitle,
          applicable_section: scanSection,
          legal_question: scanQuestion
        })
      });
      const data = await res.json();
      setScanResult(data);
      onNotify(`डुप्लिकेट तपासणी पूर्ण: सर्वोच्च साम्य ${data.highestScore}%`);
    } catch (err) {
      onNotify('स्कॅनिंग त्रुटी: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const totalPublishedCount = archiveList.length;
  const roadmapProgressPct = Math.round((totalPublishedCount / 60) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 60-Day Visual Roadmap Progress */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              60 दिवसांचा Content Calendar प्रवास
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              60 पैकी {totalPublishedCount} Reels यशस्वीरीत्या प्रकाशित • {60 - totalPublishedCount} दिवस उर्वरित
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('archive')}
              className={`btn btn-sm ${viewMode === 'archive' ? 'btn-gold' : 'btn-outline'}`}
            >
              प्रकाशित अर्काइव्ह ({totalPublishedCount})
            </button>
            <button
              onClick={() => setViewMode('roadmap')}
              className={`btn btn-sm ${viewMode === 'roadmap' ? 'btn-gold' : 'btn-outline'}`}
            >
              संपूर्ण 60-दिवस कॅलेंडर (60)
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${roadmapProgressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #D4AF37 0%, #10B981 100%)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease'
            }}
          ></div>
        </div>
      </div>

      {/* Duplicate Prevention Scanner Bar */}
      <div className="glass-card" style={{ background: 'rgba(14, 22, 38, 0.85)', borderColor: 'rgba(212, 175, 55, 0.25)' }}>
        <div className="card-header">
          <div className="card-title">
            <ScanLine size={20} color="#D4AF37" />
            <span>Duplicate Prevention Scanner (डुप्लिकेट विषय तपासणी रडार)</span>
          </div>
          <span className="badge badge-gold">Multi-Factor Semantic Matching</span>
        </div>

        <form onSubmit={handleDuplicateScan} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>नवीन विषय / शीर्षक *</label>
            <input
              type="text"
              className="form-control"
              placeholder="उदा. 7/12 फेरफार नोंद..."
              value={scanTitle}
              onChange={(e) => setScanTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>वापरलेले कलम</label>
            <input
              type="text"
              className="form-control"
              placeholder="उदा. कलम 150"
              value={scanSection}
              onChange={(e) => setScanSection(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>मुख्य कायदेशीर प्रश्न</label>
            <input
              type="text"
              className="form-control"
              placeholder="उदा. तलाठ्याने नोटीस न दिल्यास..."
              value={scanQuestion}
              onChange={(e) => setScanQuestion(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isScanning} className="btn btn-gold" style={{ height: '42px' }}>
            <ScanLine size={16} />
            <span>{isScanning ? 'तपासत आहे...' : 'डुप्लिकेट स्कॅन करा'}</span>
          </button>
        </form>

        {/* Scan Results Panel */}
        {scanResult && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: scanResult.isDuplicate ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${scanResult.isDuplicate ? '#EF4444' : '#10B981'}`, borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: scanResult.isDuplicate ? '#F87171' : '#6EE7B7' }}>
              {scanResult.isDuplicate ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
              <span>{scanResult.message} (सर्वोच्च साम्य स्कोर: {scanResult.highestScore}%)</span>
            </div>

            {scanResult.matches.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 700 }}>सापडलेले पूर्वीचे कंटेंट:</div>
                {scanResult.matches.slice(0, 3).map((m, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>Day {m.dayNumber} ({m.matchedId}):</strong> {m.title}
                      <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '2px' }}>{m.recommendation}</div>
                    </div>
                    <span className={`badge ${m.totalScore >= 70 ? 'badge-ruby' : 'badge-amber'}`}>
                      {m.totalScore}% साम्य
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main View: Archive List or Roadmap Calendar */}
      {viewMode === 'archive' ? (
        <div className="glass-card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div className="card-title">
              <Archive size={20} className="icon-accent" />
              <span>कायमस्वरूपी प्रकाशित अर्काइव्ह (Published Archive — {filteredArchive.length} Reels)</span>
            </div>

            {/* Search & Category Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94A3B8' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '32px', width: '220px' }}
                  placeholder="विषय किंवा कायदा शोधा..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: '180px' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">सर्व विभाग (All)</option>
                <option value="जमीन">जमीन आणि मालमत्ता</option>
                <option value="महिला">महिला आणि कुटुंब</option>
                <option value="फौजदारी">फौजदारी कायदे</option>
                <option value="ग्राहक">ग्राहक आणि डिजिटल</option>
                <option value="नागरिक">नागरिक हक्क</option>
              </select>
            </div>
          </div>

          {/* Archive Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94A3B8' }}>
                  <th style={{ padding: '0.75rem' }}>दिवस</th>
                  <th style={{ padding: '0.75rem' }}>विषय व कायदेशीर प्रश्न</th>
                  <th style={{ padding: '0.75rem' }}>विभाग</th>
                  <th style={{ padding: '0.75rem' }}>प्रकाशन दिनांक</th>
                  <th style={{ padding: '0.75rem' }}>व्ह्यूज (Views)</th>
                  <th style={{ padding: '0.75rem' }}>शेअर्स (Sends)</th>
                  <th style={{ padding: '0.75rem' }}>सेव्ह्स (Saves)</th>
                  <th style={{ padding: '0.75rem' }}>Reel लिंक</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchive.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 800, color: '#D4AF37' }}>
                      Day {item.day_number}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                        {item.applicable_law} ({item.applicable_section})
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        {item.category.split(' ')[0]}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', color: '#CBD5E1', fontSize: '0.82rem' }}>
                      {item.published_date || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#FFF' }}>
                      {item.views ? item.views.toLocaleString('en-IN') : '0'}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', color: '#6EE7B7' }}>
                      {item.sends ? item.sends.toLocaleString('en-IN') : '0'}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem', color: '#FCD34D' }}>
                      {item.saves ? item.saves.toLocaleString('en-IN') : '0'}
                    </td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      {item.published_url ? (
                        <a
                          href={item.published_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <ExternalLink size={12} />
                          <span>पहा</span>
                        </a>
                      ) : (
                        <span style={{ color: '#64748B', fontSize: '0.75rem' }}>उपलब्ध नाही</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Full 60-Day Content Roadmap View */
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Calendar size={20} className="icon-accent" />
              <span>60-दिवस संपूर्ण कायदेशीर कंटेंट रोडमॅप (Master Content Plan)</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              प्रत्येक दिवसासाठी स्वतंत्र व युनिक कायदेशीर विषय
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {calendarList.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(10, 16, 29, 0.7)',
                  border: item.status === 'Published' ? '1px solid rgba(16, 185, 129, 0.4)' : (item.status === 'Ready to Record' ? '1px solid var(--gold-primary)' : '1px solid var(--border-glass)'),
                  borderRadius: '8px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: '#D4AF37', fontSize: '0.85rem' }}>
                    Day {item.day_number}
                  </span>
                  <span className={`badge ${item.status === 'Published' ? 'badge-emerald' : (item.status === 'Ready to Record' ? 'badge-gold' : 'badge-cyan')}`} style={{ fontSize: '0.7rem' }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', minHeight: '44px', lineHeight: '1.4' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  {item.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
