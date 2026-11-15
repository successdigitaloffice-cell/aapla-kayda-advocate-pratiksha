import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, AlertTriangle, Plus, Search, CheckCircle, Landmark, MapPin } from 'lucide-react';

export default function Tab5LegalResearch({
  legalRefs = [],
  transitions = [],
  officialSources = {},
  gunthewariRules = [],
  unverifiedClaims = [],
  onAddReference,
  onNotify
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Ref Form State
  const [newCodeName, setNewCodeName] = useState('');
  const [newActTitle, setNewActTitle] = useState('');
  const [newCategory, setNewCategory] = useState('जमीन आणि मालमत्ता');
  const [newSection, setNewSection] = useState('');
  const [newProvision, setNewProvision] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const filteredRefs = legalRefs.filter(ref => {
    const matchesCat = selectedCategory === 'ALL' || ref.category.includes(selectedCategory);
    const matchesSearch = !searchTerm ||
      ref.act_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.section_or_rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.practical_marathi_explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newActTitle || !newSection || !newExplanation) {
      onNotify('कृपया कायद्याचे नाव, कलम आणि मराठी स्पष्टीकरण भरा.');
      return;
    }

    try {
      await onAddReference({
        code_name: newCodeName || `${newActTitle.slice(0, 4)}-${newSection}`,
        act_title: newActTitle,
        category: newCategory,
        section_or_rule: newSection,
        key_provision: newProvision,
        practical_marathi_explanation: newExplanation,
        official_url: newUrl || 'https://www.indiacode.nic.in/'
      });
      setShowAddModal(false);
      setNewCodeName('');
      setNewActTitle('');
      setNewSection('');
      setNewProvision('');
      setNewExplanation('');
      setNewUrl('');
      onNotify('नवीन कायदेशीर संदर्भ यशस्वीरीत्या नोंदवला गेला!');
    } catch (err) {
      onNotify('नोंदवताना त्रुटी: ' + err.message);
    }
  };

  const sourcesList = Object.values(officialSources);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Official Government Portals Hub */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={20} color="#10B981" />
            <span>अधिकृत प्राथमिक कायदेशीर स्रोत (Official Government Legal Portals)</span>
          </div>
          <span className="badge badge-emerald">Primary Ground Truth</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {sourcesList.map((src, i) => (
            <div key={i} style={{ background: 'rgba(10, 16, 29, 0.7)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 800, color: '#D4AF37', fontSize: '0.95rem' }}>{src.name}</span>
                <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#10B981' }}>
                  <ExternalLink size={16} />
                </a>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{src.description}</p>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                {src.url}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SPECIALIZED LAND & GUNTHEWARI RULES SECTION */}
      <div className="glass-card" style={{ borderColor: 'var(--gold-primary)', boxShadow: 'var(--gold-glow)' }}>
        <div className="card-header">
          <div className="card-title">
            <Landmark size={20} color="#D4AF37" />
            <span>महाराष्ट्र गुंठेवारी, तुकडेबंदी व जमीन खरेदी-विक्री कायदे (Land, Gunthewari & Tukdebandi Rules)</span>
          </div>
          <span className="badge badge-gold">सर्वोच्च प्राधान्य (Supreme Priority)</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1.25rem' }}>
          Advocate Pratiksha यांच्या Reels साठी आवश्यक असणारे गुंठेवारी विकास कायदा, तुकडेबंदी निर्बंध, अकृषिक (NA) नियम आणि खरेदी-विक्रीची ३० वर्षांची पडताळणी नियमावली.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(gunthewariRules.length > 0 ? gunthewariRules : [
            {
              ruleCode: 'GUNTHEWARI-ACT-2001-2021',
              actTitle: 'महाराष्ट्र गुंठेवारी विकास (नियमितीकरण, श्रेणीवाढ व नियंत्रण) अधिनियम, २००१ (सुधारणा २०२१)',
              applicableSections: 'कलम ३ व ४ (प्रशम शुल्क व नियमितीकरण)',
              keyMarathiSummary: '३१ डिसेंबर २०२० पूर्वी झालेल्या अनधिकृत गुंठेवारी भूखंड व बांधकामांचे नियमितीकरण करणे. महानगरपालिका / प्राधिकरणाकडे विकास शुल्क व प्रशम शुल्क भरून नियमितीकरण प्रमाणपत्र (Regularisation Certificate) मिळते.',
              criticalWarning: 'नियमितीकरण न केल्यास बांधकाम अनधिकृत मानले जाऊन 7/12 वर खरेदीदाराचे नाव लागण्यात कायदेशीर अडचण येते.',
              authority: 'महानगरपालिका आयुक्त / नगररचना विभाग / जिल्हाधिकारी'
            },
            {
              ruleCode: 'TUKDEBANDI-ACT-1947',
              actTitle: 'मुंबई तुकडेबंदी आणि तुकडे जोड अधिनियम, १९४७ (Bombay Prevention of Fragmentation Act)',
              applicableSections: 'कलम ७, ८ आणि ८B (प्रमाणभूत क्षेत्रापेक्षा कमी तुकड्यावर बंदी)',
              keyMarathiSummary: 'शेतजमिनीचा तुकडा पाडून विक्री करण्यास बंदी आहे. जिरायतसाठी २०/४० गुंठे आणि बागायतसाठी १०/२० गुंठे प्रमाणभूत क्षेत्र असते. यापेक्षा कमी क्षेत्र (उदा. १ किंवा २ गुंठे) शेतजमीन म्हणून विकल्यास कलम ८B अन्वये व्यवहार अवैध ठरतो व फेरफार रद्द होतो.',
              criticalWarning: '१ किंवा २ गुंठे प्लॉट खरेदी करताना तो शेतजमीन नसावा; सक्षम प्राधिकरणाने मंजूर केलेला NA किंवा अकृषिक लेआउट असावा.',
              authority: 'नोंदणी महानिरीक्षक (IGR) व महसूल अधिकारी'
            },
            {
              ruleCode: 'MLRC-1966-NA-RULES',
              actTitle: 'महाराष्ट्र जमीन महसूल संहिता, १९६६ (MLRC 1966)',
              applicableSections: 'कलम ४२, ४२A, ४२B, ४२C, ४२D (अकृषिक वापर व डीम्ड NA)',
              keyMarathiSummary: 'शेतजमिनीवर घरे, उद्योग किंवा दुकाने बांधण्यासाठी जिल्हाधिकारी किंवा सक्षम प्राधिकरणाची अकृषिक (NA) परवानगी अनिवार्य असते. वर्ग १ जमिनीसाठी आता डीम्ड एनए (Deemed NA) प्रक्रिया लागू आहे.',
              criticalWarning: 'एनए न करता शेतजमिनीवर केलेले बांधकाम महसूल कायद्यानुसार अनधिकृत ठरून ४० पट महसूल दंड होऊ शकतो.',
              authority: 'जिल्हाधिकारी / उपविभागीय अधिकारी (SDO)'
            },
            {
              ruleCode: 'DUE-DILIGENCE-30YR',
              actTitle: 'Transfer of Property Act, 1882 & Registration Act, 1908',
              applicableSections: 'कलम ५४ (खरेदीखत नोंदणी) व कलम १७',
              keyMarathiSummary: 'जमीन खरेदी करताना मागील ३० वर्षांचा सर्च रिपोर्ट, इंडेक्स २, मूळ फेरफार नोंदींची साखळी, प्रत्यक्ष जागेचा ताबा आणि स्थानिक वर्तमानपत्रात जाहीर नोटीस देणे अनिवार्य आहे. केवळ नोटरी खरेदीखत कायद्याने पूर्णपणे अवैध आहे.',
              criticalWarning: 'नोंदणीकृत खरेदीखताशिवाय १०० रुपयांच्या स्टॅम्पवर केलेला खरेदी करार कोर्टात मालकी हक्क सिद्ध करू शकत नाही.',
              authority: 'दुय्यम निबंधक कार्यालय (Sub-Registrar)'
            },
            {
              ruleCode: 'ROAD-DISPUTE-SEC5',
              actTitle: 'मामलेदार कोर्ट ऍक्ट, १९०६ (Mamlatdars Courts Act, 1906)',
              applicableSections: 'कलम ५ आणि MLRC कलम १४३',
              keyMarathiSummary: 'शेतात जाण्याचा पारंपरिक वहिवाटीचा रस्ता शेजाऱ्याने अडवला असल्यास तहसीलदारांकडे कलम ५ अन्वये अर्ज करून तात्काळ रस्ता मोकळा करून मिळवता येतो.',
              criticalWarning: 'रस्ता अडवल्याची तारीख आणि घटना सिद्ध करण्यासाठी तलाठ्याचा पंचनामा व फोटो तात्काळ जोडावेत.',
              authority: 'तहसीलदार कार्यालय'
            }
          ]).map((rule, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(10, 16, 29, 0.75)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '1.15rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-gold">{rule.applicableSections}</span>
                  <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem' }}>{rule.actTitle}</span>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>{rule.authority}</span>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: '1.6', marginTop: '0.4rem' }}>
                {rule.keyMarathiSummary}
              </div>

              <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '0.82rem', color: '#FCA5A5' }}>
                ⚠️ <strong>महत्त्वाची कायदेशीर ताकीद:</strong> {rule.criticalWarning}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Criminal Law Transition Matrix: CrPC/IPC vs BNSS/BNS */}
      <div className="glass-card" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={20} className="icon-accent" />
            <span>नवीन फौजदारी कायदे संक्रमण तक्ता (CrPC/IPC ➡️ BNSS/BNS Transition Matrix)</span>
          </div>
          <span className="badge badge-gold">लागू दिनांक: 1 जुलै 2024 पासून</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94A3B8' }}>
                <th style={{ padding: '0.75rem' }}>जुना कायदा व कलम (CrPC / IPC)</th>
                <th style={{ padding: '0.75rem' }}>नवीन लागू कायदा व कलम (BNSS / BNS 2023)</th>
                <th style={{ padding: '0.75rem' }}>मराठी कायदेशीर विषय व तरतूद</th>
                <th style={{ padding: '0.75rem' }}>कायदेशीर स्थिती</th>
              </tr>
            </thead>
            <tbody>
              {transitions.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '0.75rem', color: '#F87171', fontWeight: 600 }}>
                    {item.oldLaw}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6EE7B7', fontWeight: 700 }}>
                    {item.newLaw}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#FFFFFF' }}>
                    {item.subjectMarathi}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Legal References Repository */}
      <div className="glass-card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="card-title">
            <BookOpen size={20} className="icon-accent" />
            <span>पडताळणीकृत कायदेशीर भांडार (Verified Legal Repository — {filteredRefs.length} नोंदी)</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control"
              style={{ width: '200px' }}
              placeholder="कलम किंवा विषय शोधा..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="form-control"
              style={{ width: '160px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">सर्व विभाग</option>
              <option value="जमीन">जमीन आणि मालमत्ता</option>
              <option value="महिला">महिला आणि कुटुंब</option>
              <option value="फौजदारी">फौजदारी कायदे</option>
              <option value="ग्राहक">ग्राहक संरक्षण</option>
              <option value="नागरिक">नागरिक हक्क</option>
            </select>

            <button onClick={() => setShowAddModal(true)} className="btn btn-gold btn-sm">
              <Plus size={16} />
              <span>नवीन संदर्भ जोडा</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredRefs.map((ref) => (
            <div
              key={ref.id}
              style={{
                background: 'rgba(10, 16, 29, 0.6)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-gold">{ref.section_or_rule}</span>
                  <span className="badge badge-emerald">{ref.category}</span>
                  <span style={{ fontWeight: 800, color: '#FFF' }}>{ref.act_title}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  पडताळणी दिनांक: {ref.last_verified_date}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 600, marginBottom: '0.35rem' }}>
                तरतूद: {ref.key_provision}
              </div>

              <div style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                {ref.practical_marathi_explanation}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748B' }}>
                <a href={ref.official_url} target="_blank" rel="noopener noreferrer" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={12} />
                  <span>अधिकृत गॅझेट पहा ({ref.official_url})</span>
                </a>
                <span>{ref.amendment_notes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unverified Claims Tracker Card */}
      {unverifiedClaims.length > 0 && (
        <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={20} color="#EF4444" />
              <span>अपडताळणीकृत दावे ट्रॅकर (Unverified Claims Tracker — {unverifiedClaims.length})</span>
            </div>
            <span className="badge badge-ruby">पडताळणी होईपर्यंत रिलीज ब्लॉक</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {unverifiedClaims.map((item) => (
              <div key={item.id} style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.75rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Day {item.day_number}: {item.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>
                    कायदेशीर आधार: {item.applicable_law} ({item.applicable_section})
                  </div>
                </div>
                <span className="badge badge-ruby">{item.verification_status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Legal Reference Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem' }}>
              नवीन कायदेशीर संदर्भ जोडा (Add Legal Reference)
            </h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">कायद्याचे नाव (Act Title) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="उदा. Maharashtra Land Revenue Code, 1966"
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2-col">
                <div className="form-group">
                  <label className="form-label">कलम किंवा नियम (Section/Rule) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="उदा. कलम 150"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">विभाग (Category)</label>
                  <select
                    className="form-control"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="जमीन आणि मालमत्ता कायदे">जमीन आणि मालमत्ता कायदे</option>
                    <option value="महिला आणि कुटुंबाचे कायदे">महिला आणि कुटुंबाचे कायदे</option>
                    <option value="फौजदारी कायदे आणि पोलीस प्रक्रिया">फौजदारी कायदे आणि पोलीस प्रक्रिया</option>
                    <option value="ग्राहक आणि डिजिटल हक्क">ग्राहक आणि डिजिटल हक्क</option>
                    <option value="नागरिक आणि दैनंदिन जीवनातील कायदे">नागरिक आणि दैनंदिन जीवनातील कायदे</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">तरतूद / शीर्षक (Key Provision)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="उदा. फेरफार नोंदीची नोटीस बजावणे"
                  value={newProvision}
                  onChange={(e) => setNewProvision(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">सोपे मराठी स्पष्टीकरण (Practical Marathi Explanation) *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="नागरिकांना समजेल अशा सोप्या मराठी भाषेत..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">अधिकृत URL (India Code / Bhulekh)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://www.indiacode.nic.in/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  रद्द करा
                </button>
                <button type="submit" className="btn btn-gold">
                  जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
