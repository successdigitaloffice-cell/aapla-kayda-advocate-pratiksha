import React, { useState } from 'react';
import {
  Settings, Database, ShieldCheck, HardDrive, FileText, Download,
  Copy, Check, Clock, Server, Lock, RefreshCw, Key
} from 'lucide-react';

export default function Tab6Settings({
  settings = {},
  backups = [],
  systemHealth = {},
  latestReport = null,
  auditLogs = [],
  onUpdateSettings,
  onCreateBackup,
  onTestRestore,
  onGenerateReport,
  onNotify
}) {
  const [researchTime, setResearchTime] = useState(settings.daily_research_time || '09:00 AM');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await onUpdateSettings({ daily_research_time: researchTime });
      onNotify('सेटिंग्ज यशस्वीरीत्या अद्ययावत झाल्या!');
    } catch (err) {
      onNotify('सेव्ह करताना त्रुटी: ' + err.message);
    }
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    try {
      const result = await onCreateBackup('Manual');
      onNotify(`बॅकअप यशस्वी: ${result.filename} (${result.fileSizeKb} KB)`);
    } catch (err) {
      onNotify('बॅकअप त्रुटी: ' + err.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreTest = async (backupId) => {
    try {
      const result = await onTestRestore(backupId);
      onNotify(result.message);
    } catch (err) {
      onNotify('चाचणी त्रुटी: ' + err.message);
    }
  };

  const handleRefreshReport = async () => {
    setIsGeneratingReport(true);
    try {
      await onGenerateReport();
      onNotify('आजचा 17-मुद्द्यांचा अंतिम अहवाल तयार झाला!');
    } catch (err) {
      onNotify('अहवाल त्रुटी: ' + err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCopyReport = () => {
    if (!latestReport?.markdownReport) return;
    navigator.clipboard.writeText(latestReport.markdownReport);
    setCopiedReport(true);
    onNotify('दैनिक अहवाल क्लिपबोर्डवर कॉपी झाला!');
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 17-Point Daily Final Report Section (Section 16 of Master Prompt) */}
      <div className="glass-card" style={{ borderColor: 'var(--gold-primary)', boxShadow: 'var(--gold-glow)' }}>
        <div className="card-header">
          <div className="card-title">
            <FileText size={20} color="#D4AF37" />
            <span>TAB 8: दैनिक २१ मुद्द्यांचा अंतिम अहवाल (21-Point Daily Report — Section 11)</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleRefreshReport}
              disabled={isGeneratingReport}
              className="btn btn-outline btn-sm"
            >
              <RefreshCw size={14} className={isGeneratingReport ? 'animate-spin' : ''} />
              <span>{isGeneratingReport ? 'तयार होत आहे...' : 'नवीन अहवाल तयार करा'}</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="btn btn-gold btn-sm"
            >
              {copiedReport ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedReport ? 'कॉपी झाला!' : 'Copy Daily Report'}</span>
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>
          मास्टर सिस्टम प्रॉम्प्टच्या कलम 11 नुसार Advocate Pratiksha आणि सोशल मीडिया ग्रोथ टीमसाठी दररोज तयार होणारा अधिकृत २१ मुद्द्यांचा अहवाल (Daily 21-Point Report).
        </p>

        <div style={{
          background: 'rgba(7, 11, 20, 0.85)',
          padding: '1.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border-glass)',
          fontFamily: 'monospace',
          fontSize: '0.88rem',
          lineHeight: '1.6',
          color: '#E2E8F0',
          whiteSpace: 'pre-wrap',
          maxHeight: '380px',
          overflowY: 'auto'
        }}>
          {latestReport?.markdownReport || 'अहवाल लोड होत आहे...'}
        </div>
      </div>

      <div className="grid-2-col">
        {/* System Settings & Automation Timing */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Settings size={20} className="icon-accent" />
              <span>दैनिक स्वयंचलित वेळापत्रक (Daily Automation)</span>
            </div>
            <span className="badge badge-gold">Active Schedule</span>
          </div>

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">दररोजचे संशोधन वेळ (Daily Research Time)</label>
              <input
                type="text"
                className="form-control"
                value={researchTime}
                onChange={(e) => setResearchTime(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>उदा. 09:00 AM दररोज सकाळी</span>
            </div>

            <div className="form-group">
              <label className="form-label">चाचणीसाठी सुचवलेल्या 3 प्रकाशन वेळा (Posting Slots)</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">12:30 PM (दुपारी)</span>
                <span className="badge badge-gold">07:00 PM (संध्याकाळी)</span>
                <span className="badge badge-cyan">08:30 PM (रात्री)</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-gold">
                सेटिंग्ज जतन करा
              </button>
            </div>
          </form>
        </div>

        {/* Server Health & Connection Status */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Server size={20} className="icon-accent" />
              <span>सर्व्हर आरोग्य व API स्थिती (Server Health & APIs)</span>
            </div>
            <span className="badge badge-emerald">
              {systemHealth.status === 'UP' ? 'Server Healthy' : 'Degraded'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: '#94A3B8' }}>डेटाबेस:</span>
              <strong style={{ color: '#10B981' }}>{systemHealth.database || 'SQLite WAL Active'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: '#94A3B8' }}>अपटाईम (Uptime):</span>
              <strong style={{ color: '#FFF' }}>{systemHealth.uptimeSeconds || 0} सेकंद</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: '#94A3B8' }}>मेमरी वापर (RAM):</span>
              <strong style={{ color: '#38BDF8' }}>{systemHealth.memoryMb || 0} MB</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: '#94A3B8' }}>Meta Instagram API:</span>
              <strong style={{ color: '#FCD34D' }}>अधिकृत OAuth रेडी (No Scraping)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#94A3B8' }}>स्थानिक डेटा पाथ:</span>
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>backend/data/aapla_kayda.db</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Persistent Storage & Backups (Section 14 of Master Prompt) */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <HardDrive size={20} color="#D4AF37" />
            <span>Persistent Database & स्वयंचलित बॅकअप (Storage & Backup Engine)</span>
          </div>

          <button
            onClick={handleBackupNow}
            disabled={isBackingUp}
            className="btn btn-gold btn-sm"
          >
            <Database size={16} />
            <span>{isBackingUp ? 'बॅकअप होत आहे...' : 'तात्काळ बॅकअप तयार करा (Backup Now)'}</span>
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>
          सर्व डेटाबेस नोंदी (Reels, कायदे, अहवाल) कायमस्वरूपी सुरक्षित ठेवण्यासाठी नियमित स्वयंचलित बॅकअप स्नॅपशॉट घेतले जातात.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94A3B8' }}>
                <th style={{ padding: '0.65rem' }}>बॅकअप फाईलचे नाव</th>
                <th style={{ padding: '0.65rem' }}>प्रकार</th>
                <th style={{ padding: '0.65rem' }}>आकार</th>
                <th style={{ padding: '0.65rem' }}>तयार दिनांक</th>
                <th style={{ padding: '0.65rem' }}>पुनर्प्राप्ती चाचणी (Test Restore)</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '0.75rem 0.65rem', fontWeight: 600, color: '#FFF' }}>
                    {b.filename}
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{b.backup_type}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem', color: '#38BDF8' }}>
                    {(b.file_size_bytes / 1024).toFixed(1)} KB
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem', color: '#CBD5E1' }}>
                    {b.created_at}
                  </td>
                  <td style={{ padding: '0.75rem 0.65rem' }}>
                    <button
                      onClick={() => handleRestoreTest(b.id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <ShieldCheck size={12} color="#10B981" />
                      <span>चाचणी करा</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Security & Audit Logs (Section 15 of Master Prompt) */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Lock size={20} className="icon-accent" />
            <span>सुरक्षा व Audit Logs (Account Access & Activity Trail)</span>
          </div>
          <span className="badge badge-emerald">Audit Trail Active</span>
        </div>

        <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                background: 'rgba(10, 16, 29, 0.5)',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
            >
              <div>
                <strong style={{ color: '#D4AF37' }}>[{log.action}]</strong> {log.details}
              </div>
              <span style={{ color: '#64748B' }}>{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
