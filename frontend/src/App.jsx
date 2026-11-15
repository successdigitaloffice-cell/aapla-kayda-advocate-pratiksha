import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavTabs from './components/NavTabs';

// 5 Consolidated Professional Tabs matching Master Execution Prompt
import Tab1Dashboard from './components/Tab1Dashboard';
import Tab2TrendingTopics from './components/Tab2TrendingTopics';
import Tab3VideoStudio from './components/Tab3VideoStudio';
import Tab4PhotoStudio from './components/Tab4PhotoStudio';
import Tab5Settings from './components/Tab5Settings';

import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [trends, setTrends] = useState([]);
  const [activeReel, setActiveReel] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [hasAvatarPhoto, setHasAvatarPhoto] = useState(false);

  // Security PIN Verification State for Mobile Access
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    // Check if remote domain and requires PIN
    const isRemote = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
    const isVerified = sessionStorage.getItem('ak_pin_verified') === 'true';
    if (isRemote && !isVerified) {
      setIsAuthenticated(false);
    }

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // 1. Fetch today's trends
      fetch('/api/trends/today')
        .then(r => r.json())
        .then(data => {
          if (data && data.trends) setTrends(data.trends);
        })
        .catch(() => {});

      // 2. Fetch active reel
      fetch('/api/reels/active')
        .then(r => r.json())
        .then(data => {
          if (data && data.id) setActiveReel(data);
        })
        .catch(() => {});

      // 3. Check avatar presence
      fetch('/api/avatar/list')
        .then(r => r.json())
        .then(data => {
          if (data && data.avatars && data.avatars.length > 0) {
            setHasAvatarPhoto(true);
          }
        })
        .catch(() => {});
    } catch (e) {
      console.error('Initial data load error:', e);
    }
  };

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    setPinError('');
    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('ak_pin_verified', 'true');
        setIsAuthenticated(true);
      } else {
        setPinError(data.error || 'अवैध पिन कोड. कृपया बरोबर पिन टाका.');
      }
    } catch (err) {
      setPinError('पिन पडताळणीमध्ये त्रुटी आली.');
    }
  };

  const handleRefreshTrends = async () => {
    try {
      const res = await fetch('/api/trends/refresh', { method: 'POST' });
      const data = await res.json();
      if (data.trends) {
        setTrends(data.trends);
        notify('नवीन कायदेशीर ट्रेंड्स यशस्वीरीत्या अपडेट झाले!');
      }
    } catch (e) {
      notify('ट्रेंड्स रिफ्रेश करताना त्रुटी: ' + e.message);
    }
  };

  const handleSelectTopicForStudio = (topic) => {
    setSelectedTopic(topic);
    setActiveTab('studio');
    notify(`"${topic.topic_name || topic.title}" हा विषय स्टुडिओमध्ये लोड केला आहे.`);
  };

  // If remote and not authenticated, render PIN Unlock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-navy-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold-500 to-amber-500 mx-auto flex items-center justify-center text-navy-950 shadow-xl shadow-gold-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-400">
              सुरक्षित मोबाईल ॲक्सेस
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              आपला कायदा – <span className="text-gold-400">Advocate Pratiksha</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              डॅशबोर्ड उघडण्यासाठी कृपया तुमचा ४ अंकी सिक्युरिटी पिन टाका (Default: 2026).
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="पिन कोड प्रविष्ट करा"
                autoFocus
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-2xl px-4 py-3.5 text-center text-xl font-mono text-white tracking-widest focus:outline-none"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 font-semibold">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-gold-500/20 transition-all"
            >
              <span>डॅशबोर्ड अनलॉक करा</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Secured Cloudflare Deployment</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-gold-500 selection:text-navy-950">
      {/* 1. Header */}
      <Header
        activeDay={activeReel?.day_number || 8}
        totalPublished={7}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* 2. Modern 5-Tab Navigation Bar */}
      <NavTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          trendsCount: trends.length || '10',
          hasPhoto: hasAvatarPhoto,
          activeReels: 'Live'
        }}
      />

      {/* 3. Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'dashboard' && (
          <Tab1Dashboard
            activeReel={activeReel}
            trends={trends}
            onSelectTopic={handleSelectTopicForStudio}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'trends' && (
          <Tab2TrendingTopics
            trends={trends}
            onRefreshTrends={handleRefreshTrends}
            onSelectTopic={handleSelectTopicForStudio}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'studio' && (
          <Tab3VideoStudio
            selectedTopic={selectedTopic}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'photo' && (
          <Tab4PhotoStudio />
        )}

        {activeTab === 'settings' && (
          <Tab5Settings />
        )}
      </main>

      {/* 4. Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-2xl animate-bounce flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
