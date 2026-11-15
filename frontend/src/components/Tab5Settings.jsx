import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  Cloud,
  Smartphone,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock,
  Download,
  AlertTriangle,
  Sliders,
  Volume2,
  Users,
  UserPlus,
  Copy,
  Check,
  UserCheck,
  UserX,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function Tab5Settings({ currentUser, authToken, notify }) {
  const [settings, setSettings] = useState({
    gemini_api_key: '',
    instagram_access_token: '',
    instagram_account_id: '',
    default_voice_speed: 'normal',
    default_duration: '45',
    dashboard_access_pin: '2026'
  });

  const [publicUrl, setPublicUrl] = useState('');
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [backupStatus, setBackupStatus] = useState(null);

  // Multi-user & Friend Access Management State (Admin only)
  const [usersList, setUsersList] = useState([]);
  const [invitationsList, setInvitationsList] = useState([]);
  const [newInviteRecipient, setNewInviteRecipient] = useState('');
  const [newInviteMaxUses, setNewInviteMaxUses] = useState(5);
  const [inviteCreating, setInviteCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    loadSettings();
    loadBackups();
    loadPublicUrl();
    if (currentUser?.role === 'admin') {
      loadAdminData();
    }
  }, [currentUser]);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
          ...prev,
          gemini_api_key: data.gemini_api_key || '',
          instagram_access_token: data.instagram_access_token || '',
          instagram_account_id: data.instagram_account_id || '',
          default_voice_speed: data.default_voice_speed || 'normal',
          default_duration: String(data.default_duration || '45'),
          dashboard_access_pin: data.dashboard_access_pin || '2026'
        }));
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  };

  const loadBackups = async () => {
    try {
      const res = await fetch('/api/backups');
      if (res.ok) {
        const data = await res.json();
        setBackups(data.backups || []);
      }
    } catch (e) {
      console.error('Error loading backups:', e);
    }
  };

  const loadPublicUrl = () => {
    // Current host or public tunnel URL
    if (window.location.hostname.includes('trycloudflare.com')) {
      setPublicUrl(window.location.origin);
    } else {
      setPublicUrl('https://occasion-situated-adapted-eating.trycloudflare.com');
    }
  };

  const loadAdminData = async () => {
    try {
      const token = authToken || localStorage.getItem('ak_auth_token') || 'admin_token_default_local';
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsersList(data.users);
        if (data.invitations) setInvitationsList(data.invitations);
      }
    } catch (e) {
      console.error('Error loading admin users data:', e);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('सेटिंग्ज यशस्वीरीत्या सेव्ह करण्यात आल्या आहेत!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (e) {
      alert('सेटिंग्ज सेव्ह करताना त्रुटी: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setBackupStatus('डेटाबेसचा सुरक्षित बॅकअप तयार होत आहे...');
      const res = await fetch('/api/backups/create', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBackupStatus(`बॅकअप यशस्वी: ${data.filename} (${Math.round(data.sizeBytes / 1024)} KB)`);
        loadBackups();
        setTimeout(() => setBackupStatus(null), 4000);
      }
    } catch (e) {
      setBackupStatus('बॅकअप त्रुटी: ' + e.message);
    }
  };

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    if (!newInviteRecipient.trim()) return;
    setInviteCreating(true);
    try {
      const token = authToken || localStorage.getItem('ak_auth_token') || 'admin_token_default_local';
      const res = await fetch('/api/admin/create-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient_name: newInviteRecipient.trim(),
          max_uses: Number(newInviteMaxUses) || 5
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewInviteRecipient('');
        loadAdminData();
        if (notify) notify(`नवीन इनव्हिटेशन कोड ${data.code} तयार झाला!`);
      } else {
        alert(data.error || 'इनव्हिटेशन तयार करता आले नाही.');
      }
    } catch (err) {
      alert('त्रुटी: ' + err.message);
    } finally {
      setInviteCreating(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      const token = authToken || localStorage.getItem('ak_auth_token') || 'admin_token_default_local';
      const res = await fetch('/api/admin/toggle-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData();
        if (notify) notify(data.message);
      } else {
        alert(data.error || 'क्रिया अयशस्वी.');
      }
    } catch (err) {
      alert('त्रुटी: ' + err.message);
    }
  };

  const copyToClipboard = (text, codeId) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(''), 3000);
    if (notify) notify('इनव्हिटेशन कोड क्लिपबोर्डवर कॉपी झाला!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-navy-850 border border-navy-700/80 p-4 sm:p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              सिस्टीम सेटिंग्ज, सुरक्षा व क्लाउड डिप्लॉयमेंट
            </h1>
            <p className="text-xs text-slate-400">
              API जोडणी, मोबाईल ॲक्सेस, युझर मॅनेजमेंट आणि डेटाबेस बॅकअप व्यवस्थापन
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'सेव्ह होत आहे...' : 'सेटिंग्ज सेव्ह करा'}</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Cloud Hosting & 24/7 Remote Mobile Access */}
        <div className="bg-navy-850 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>क्लाउड होस्टिंग व मोबाईल ॲक्सेस (Mobile Dashboard)</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              24/7 Live
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            हा डॅशबोर्ड सुरक्षित Cloudflare HTTPS द्वारे लाईव्ह करण्यात आला आहे. तुम्ही कॉम्प्युटर बंद असला तरी मोबाईलवरून वापरू शकता.
          </p>

          <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-750 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">थेट मोबाईल ॲक्सेस लिंक (Secure HTTPS URL):</span>
            <div className="flex items-center justify-between bg-navy-950 p-2.5 rounded-lg border border-navy-800">
              <span className="text-xs font-mono text-gold-400 truncate select-all">{publicUrl}</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md bg-navy-800 hover:bg-gold-500/20 text-gold-400 ml-2"
                title="Open Public Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* QR Code & Mobile Security PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-navy-900 border border-navy-750 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">मोबाईलसाठी QR कोड</span>
              <div className="bg-white p-1.5 rounded-lg shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=2&data=${encodeURIComponent(publicUrl)}`}
                  alt="Mobile Access QR"
                  className="w-24 h-24 block"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5">मोबाईल कॅमेऱ्याने स्कॅन करा</span>
            </div>

            <div className="p-3 rounded-xl bg-navy-900 border border-navy-750 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center space-x-1 mb-1">
                  <Lock className="w-3.5 h-3.5 text-gold-400" />
                  <span>मोबाईल सिक्युरिटी पिन:</span>
                </span>
                <p className="text-[11px] text-slate-400 mb-2">
                  मोबाईलवरून डॅशबोर्ड उघडताना सुरक्षेसाठी हा पिन विचारला जाईल.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={settings.dashboard_access_pin}
                  onChange={(e) => setSettings({ ...settings, dashboard_access_pin: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-800 rounded-lg px-3 py-2 text-sm font-mono text-center text-gold-400 font-bold focus:outline-none focus:border-gold-500"
                  placeholder="2026"
                />
              </div>
              <span className="text-[10px] text-emerald-400 mt-2">✓ अनधिकृत ॲक्सेस प्रतिबंधित</span>
            </div>
          </div>
        </div>

        {/* Card 2: API Keys Configuration */}
        <div className="bg-navy-850 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Key className="w-4 h-4 text-gold-400" />
              <span>API जोडणी (AI & Instagram)</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Google Gemini API Key (कायदेशीर स्क्रिप्ट व AI जनरेशन):
              </label>
              <input
                type="password"
                value={settings.gemini_api_key}
                onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                className="w-full bg-navy-900 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-gold-500"
                placeholder="AIzaSy..."
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                aistudio.google.com वरून मोफत API Key मिळवता येते.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Instagram Graph API Access Token (थेट फॉलोअर्स व रीच):
              </label>
              <input
                type="password"
                value={settings.instagram_access_token}
                onChange={(e) => setSettings({ ...settings, instagram_access_token: e.target.value })}
                className="w-full bg-navy-900 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-gold-500"
                placeholder="EAA..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Instagram Business Account ID:
              </label>
              <input
                type="text"
                value={settings.instagram_account_id}
                onChange={(e) => setSettings({ ...settings, instagram_account_id: e.target.value })}
                className="w-full bg-navy-900 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-gold-500"
                placeholder="178414..."
              />
            </div>
          </div>
        </div>

        {/* Card 3: Video & Audio Defaults */}
        <div className="bg-navy-850 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">व्हिडिओ व व्हॉईस डीफॉल्ट सेटिंग्ज</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">डीफॉल्ट आवाज गती:</label>
              <select
                value={settings.default_voice_speed}
                onChange={(e) => setSettings({ ...settings, default_voice_speed: e.target.value })}
                className="w-full bg-navy-900 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="slow">संथ (0.85x)</option>
                <option value="normal">मध्यम (1.0x)</option>
                <option value="fast">वेगवान (1.15x)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">डीफॉल्ट लांबी:</label>
              <select
                value={settings.default_duration}
                onChange={(e) => setSettings({ ...settings, default_duration: e.target.value })}
                className="w-full bg-navy-900 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="30">३० सेकंद (Short Hook)</option>
                <option value="45">४५ सेकंद (Standard Reel)</option>
                <option value="60">६० सेकंद (Full Legal Explanation)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-900 border border-navy-750 text-xs text-slate-400 space-y-1">
            <p><strong>भाषा:</strong> मराठी (Marathi - Official Legal Tone)</p>
            <p><strong>आस्पेक्ट रेशो:</strong> 9:16 Vertical Instagram Reel (1080x1920)</p>
            <p><strong>व्हिज्युअल मॉडेल:</strong> १००% कायदेशीर दस्तऐवज व पुरावे (Documentary Explainer)</p>
          </div>
        </div>

        {/* Card 4: Database & Safety Backups */}
        <div className="bg-navy-850 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>डेटाबेस सुरक्षितता व बॅकअप (Safety Backups)</span>
            </h3>
            <button
              onClick={handleCreateBackup}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
            >
              नवीन बॅकअप घ्या
            </button>
          </div>

          {backupStatus && (
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
              {backupStatus}
            </div>
          )}

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {backups.map((bk, i) => (
              <div
                key={bk.id || i}
                className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between text-xs"
              >
                <div className="truncate mr-2">
                  <span className="font-mono text-white block truncate">{bk.filename}</span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round(bk.file_size_bytes / 1024)} KB | {new Date(bk.created_at).toLocaleString()}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-navy-950 text-slate-400 border border-navy-750">
                  {bk.backup_type || 'Manual'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 5: Full Width - Multi-User Friend Access & User Management */}
      <div className="bg-navy-850 border border-gold-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-navy-750 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>मित्र व सहकारी ॲक्सेस व्यवस्थापन (Friend & Multi-User Access)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30">
                  Secure Isolation
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                मित्रांना त्यांच्या स्वतंत्र वर्कस्पेस, स्क्रिप्ट व व्हिडिओ जनरेशनसाठी इनव्हिटेशन कोड द्या.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">
              एकूण युझर्स: <strong className="text-gold-400 font-mono">{usersList.length || 1}</strong>
            </span>
          </div>
        </div>

        {/* Generate New Invitation Code Form */}
        {currentUser?.role === 'admin' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-navy-900 border border-navy-750 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 text-gold-400">
                <UserPlus className="w-4 h-4" />
                <span>नवीन इनव्हिटेशन कोड तयार करा</span>
              </h3>

              <form onSubmit={handleGenerateInvite} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    मित्राचे / वकिलाचे नाव:
                  </label>
                  <input
                    type="text"
                    required
                    value={newInviteRecipient}
                    onChange={(e) => setNewInviteRecipient(e.target.value)}
                    placeholder="उदा. ॲड. सचिन मोरे"
                    className="w-full bg-navy-950 border border-navy-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    कमाल वापर मर्यादा (Max Uses):
                  </label>
                  <select
                    value={newInviteMaxUses}
                    onChange={(e) => setNewInviteMaxUses(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                  >
                    <option value="1">१ व्यक्ती (Single Use)</option>
                    <option value="5">५ व्यक्ती (Small Team)</option>
                    <option value="10">१० व्यक्ती (Law Firm)</option>
                    <option value="50">५० व्यक्ती (VIP Batch)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={inviteCreating}
                  className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 text-navy-950 py-2 rounded-lg font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{inviteCreating ? 'कोड तयार होत आहे...' : 'कोड जनरेट करा'}</span>
                </button>
              </form>
            </div>

            {/* Active Invitations List */}
            <div className="bg-navy-900 border border-navy-750 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 text-gold-400">
                <Key className="w-4 h-4" />
                <span>सक्रिय इनव्हिटेशन कोड्स ({invitationsList.length})</span>
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {invitationsList.map((inv) => (
                  <div
                    key={inv.code}
                    className="p-2.5 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-gold-400">{inv.code}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-850 text-slate-400">
                          {inv.used_count}/{inv.max_uses} वापरले
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{inv.recipient_name}</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(inv.code, inv.code)}
                      className="p-1.5 rounded-lg bg-navy-850 hover:bg-gold-500/20 text-slate-300 hover:text-gold-400 border border-navy-750 transition-colors"
                      title="कोड कॉपी करा"
                    >
                      {copiedCode === inv.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Registered Table */}
            <div className="bg-navy-900 border border-navy-750 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 text-emerald-400">
                <UserCheck className="w-4 h-4" />
                <span>नोंदणीकृत युझर्स ({usersList.length})</span>
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {usersList.map((usr) => (
                  <div
                    key={usr.id}
                    className="p-2.5 rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white truncate">{usr.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${usr.role === 'admin' ? 'bg-gold-500/20 text-gold-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {usr.role === 'admin' ? 'ॲडमिन' : 'मित्र'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{usr.email}</span>
                      <span className="text-[9px] text-slate-500">व्हिडिओ: {usr.videos_generated_count || 0}</span>
                    </div>

                    {usr.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleUser(usr.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                          usr.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400'
                            : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-emerald-500/20 hover:text-emerald-400'
                        }`}
                        title={usr.is_active ? 'खाते तात्पुरते बंद करा' : 'खाते पुन्हा सक्रिय करा'}
                      >
                        {usr.is_active ? 'सक्रिय' : 'बंद'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-navy-900 border border-navy-750 rounded-xl p-4 text-center space-y-2">
            <p className="text-xs text-slate-300">
              तुम्ही <strong>मित्र (Friend / Guest)</strong> म्हणून लॉगिन आहात.
            </p>
            <p className="text-[11px] text-slate-400">
              तुमची जनरेट केलेली सर्व स्क्रिप्ट्स व व्हिडिओ पूर्णपणे सुरक्षित व वेगळे (Isolated) ठेवले आहेत.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
