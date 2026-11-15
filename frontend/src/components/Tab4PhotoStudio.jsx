import React, { useState, useEffect } from 'react';
import {
  Upload,
  UserCheck,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  Sparkles,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function Tab4PhotoStudio() {
  const [avatars, setAvatars] = useState([]);
  const [defaultAvatar, setDefaultAvatarState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/avatar/list');
      if (res.ok) {
        const data = await res.json();
        setAvatars(data.avatars || []);
        setDefaultAvatarState(data.defaultAvatar || null);
      }
    } catch (e) {
      console.error('Error fetching avatars:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('कृपया वैध फोटो फाईल (JPG, PNG, WEBP) निवडा.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        const res = await fetch('/api/avatar/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: reader.result,
            filename: file.name
          })
        });

        const json = await res.json();
        if (json.success) {
          setStatusMessage('Advocate Pratiksha यांचा फोटो कायमस्वरूपी सुरक्षित साठवण्यात आला आहे!');
          fetchAvatars();
        } else {
          alert('अपलोड अयशस्वी: ' + (json.error || 'अनोळखी त्रुटी'));
        }
      } catch (err) {
        alert('अपलोड त्रुटी: ' + err.message);
      } finally {
        setUploading(false);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSetDefault = async (filename) => {
    try {
      const res = await fetch('/api/avatar/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      const json = await res.json();
      if (json.success) {
        fetchAvatars();
      }
    } catch (err) {
      alert('Error setting default avatar: ' + err.message);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('हा फोटो कायमस्वरूपी डिलीट करायचा आहे का?')) return;
    try {
      const res = await fetch(`/api/avatar/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        fetchAvatars();
      }
    } catch (err) {
      alert('Error deleting photo: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-navy-850 border border-navy-700/80 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              माझा फोटो / ॲडव्होकेट अवतार स्टुडिओ (My Photo Studio)
            </h1>
            <p className="text-xs text-slate-400">
              Advocate Pratiksha यांचा मूळ चेहरा कायम ठेवून AI व्हिडिओ तयार करण्यासाठी सुरक्षित फोटो व्यवस्थापन
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div>
          <label className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'अपलोड होत आहे...' : 'नवीन फोटो अपलोड करा'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Active Default Reference vs Photo Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Default Reference & AI Identity Rules */}
        <div className="bg-navy-850 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-gold-400" />
              <span>सक्रिय रेफरन्स फोटो (Active Identity)</span>
            </h3>
            {defaultAvatar && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                सक्रिय (Active)
              </span>
            )}
          </div>

          {defaultAvatar ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-xl bg-navy-950 aspect-[3/4] flex items-center justify-center">
              <img
                src={defaultAvatar.url}
                alt="Default Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent p-4">
                <span className="text-[10px] text-gold-400 font-extrabold uppercase tracking-wider">
                  अधिकृत चेहरा ओळख
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Advocate Pratiksha</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{defaultAvatar.filename}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-[3/4] rounded-2xl bg-navy-900 border border-dashed border-navy-750 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-300">कोणताही फोटो अपलोड केलेला नाही.</p>
              <p className="text-[11px] text-slate-500 mt-1">उजवीकडील बटणावरून तुमचा स्पष्ट पासपोर्ट किंवा पोर्ट्रेट फोटो अपलोड करा.</p>
            </div>
          )}

          {/* Strict Rules Box */}
          <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-750 space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 text-gold-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>चेहरा सुरक्षेचे नियम (Zero Alteration):</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
              <li>केवळ अपलोड केलेल्या मूळ चेहऱ्याची ओळख व्हिडिओमध्ये वापरली जाईल.</li>
              <li>कोणतेही अवास्तव ब्युटिफिकेशन किंवा बनावट चेहरा बदल केला जात नाही.</li>
              <li>काळा ॲडव्होकेट कोट, पांढरा शर्ट व कॉलर बँड आपोआप व्यावसायिकरित्या जोडले जातील.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Uploaded Photos Management (Gallery) */}
        <div className="lg:col-span-2 bg-navy-850 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">माझे सुरक्षित फोटो संग्रह (Saved Photos)</h3>
              <p className="text-xs text-slate-400">एकूण {avatars.length} फोटो साठवले आहेत</p>
            </div>
            <button
              onClick={fetchAvatars}
              className="p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {avatars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {avatars.map((av) => (
                <div
                  key={av.filename}
                  className={`bg-navy-900 rounded-xl border overflow-hidden transition-all group flex flex-col justify-between ${
                    av.isDefault
                      ? 'border-gold-500/60 shadow-lg shadow-gold-500/10'
                      : 'border-navy-750 hover:border-slate-600'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-navy-950">
                    <img
                      src={av.url}
                      alt="Avatar"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {av.isDefault && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-gold-500 text-navy-950 shadow">
                        Active Default
                      </span>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="text-[11px] font-bold text-white truncate" title={av.filename}>
                      {av.filename}
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{av.sizeKb} KB</span>
                      <span>{new Date(av.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-2 border-t border-navy-800 flex items-center justify-between gap-1">
                      {!av.isDefault ? (
                        <button
                          onClick={() => handleSetDefault(av.filename)}
                          className="px-2 py-1 rounded-lg bg-navy-800 hover:bg-gold-500/20 text-gold-400 text-[10px] font-bold transition-all"
                        >
                          रेफरन्स बनवा
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          निवडलेला आहे
                        </span>
                      )}

                      <button
                        onClick={() => handleDelete(av.filename)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-navy-900 rounded-xl border border-dashed border-navy-750 text-slate-400 space-y-2">
              <Upload className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs font-semibold">कोणताही फोटो सेव्ह नाही.</p>
              <p className="text-[11px] text-slate-500">तुमचा चांगला फोटो येथे अपलोड करा जेणेकरून तो कायमस्वरूपी वापरता येईल.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
