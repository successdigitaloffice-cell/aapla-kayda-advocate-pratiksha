import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuickActionBar from './components/QuickActionBar';
import NavTabs from './components/NavTabs';

// 8 Dedicated Tabs matching Section 10 of Master Prompt
import Tab1Trends from './components/Tab1Trends';
import Tab2Top3Reels from './components/Tab2Top3Reels';
import Tab3ReadyScripts from './components/Tab3ReadyScripts';
import Tab4CaptionsAndSEO from './components/Tab4CaptionsAndSEO';
import Tab5LegalResearch from './components/Tab5LegalResearch';
import Tab3PublishedArchive from './components/Tab3PublishedArchive';
import Tab4Analytics from './components/Tab4Analytics';
import Tab6Settings from './components/Tab6Settings';
import Tab9VideoGenerator from './components/Tab9VideoGenerator';
import Tab10ContentCreator from './components/Tab10ContentCreator';
import Tab11ContentBank from './components/Tab11ContentBank';

import TeleprompterModal from './components/TeleprompterModal';
import PublishModal from './components/PublishModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [modalReel, setModalReel] = useState(null);

  // App Data
  const [activeReel, setActiveReel] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [archiveList, setArchiveList] = useState([]);
  const [calendarList, setCalendarList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [legalRefs, setLegalRefs] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [officialSources, setOfficialSources] = useState({});
  const [gunthewariRules, setGunthewariRules] = useState([]);
  const [unverifiedClaims, setUnverifiedClaims] = useState([]);
  const [settings, setSettings] = useState({});
  const [backups, setBackups] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [latestReport, setLatestReport] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Loading States for Actions
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Toast Notification Trigger
  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial Data Fetching
  const loadAllData = async () => {
    try {
      fetch('/api/health').then(r => r.json()).then(setSystemHealth).catch(() => {});
      fetch('/api/trends/today').then(r => r.json()).then(setTrendsData).catch(() => {});
      fetch('/api/reels/active').then(r => r.json()).then(setActiveReel).catch(() => {});
      fetch('/api/archive').then(r => r.json()).then(setArchiveList).catch(() => {});
      fetch('/api/calendar').then(r => r.json()).then(setCalendarList).catch(() => {});
      fetch('/api/analytics').then(r => r.json()).then(setAnalyticsData).catch(() => {});
      fetch('/api/legal/references').then(r => r.json()).then(setLegalRefs).catch(() => {});
      fetch('/api/legal/transitions').then(r => r.json()).then(data => {
        setTransitions(data.transitions || []);
        setOfficialSources(data.officialSources || {});
      }).catch(() => {});
      fetch('/api/legal/gunthewari-rules').then(r => r.json()).then(data => {
        setGunthewariRules(data.rules || []);
      }).catch(() => {});
      fetch('/api/legal/unverified').then(r => r.json()).then(setUnverifiedClaims).catch(() => {});
      fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
      fetch('/api/backups').then(r => r.json()).then(setBackups).catch(() => {});
      fetch('/api/reports/latest').then(r => r.json()).then(setLatestReport).catch(() => {});
      fetch('/api/audit-logs').then(r => r.json()).then(setAuditLogs).catch(() => {});
    } catch (err) {
      console.error('Data load error:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // 1. Action: FIND TODAY'S TRENDS
  const handleRefreshTrends = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/trends/refresh', { method: 'POST' });
      const data = await res.json();
      setTrendsData(data.trends);
      notify('नवीन १० ट्रेंडिंग कायदेशीर विषयांचे संशोधन यशस्वी!');
    } catch (err) {
      notify('ट्रेंड शोधताना त्रुटी: ' + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 2. Action: GENERATE SCRIPT
  const handleGenerateScriptForActive = async () => {
    const topicToUse = activeReel || trendsData?.bestToday || trendsData?.top3?.[0];
    if (!topicToUse) {
      notify('स्क्रिप्ट तयार करण्यासाठी कोणताही विषय उपलब्ध नाही.');
      return;
    }
    try {
      notify('कायदेशीर मराठी स्क्रिप्ट तयार होत आहे...');
      const res = await fetch('/api/reels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topicToUse.topic_name || topicToUse.title,
          category: topicToUse.category || 'जमीन आणि मालमत्ता कायदे',
          applicable_law: topicToUse.primary_legal_sources || topicToUse.applicable_law,
          selection_reason: topicToUse.why_important_today || topicToUse.selection_reason,
          target_audience: topicToUse.target_audience || 'महाराष्ट्रातील शेतकरी व नागरिक'
        })
      });
      const data = await res.json();
      setActiveReel(data.reel);
      setActiveTab('tab3'); // Switch to Ready-to-Record Scripts
      notify('स्क्रिप्ट यशस्वीरीत्या तयार झाली आणि Tab 3 मध्ये उपलब्ध आहे!');
    } catch (err) {
      notify('स्क्रिप्ट तयार करताना त्रुटी: ' + err.message);
    }
  };

  const handleGenerateForTopic = async (topic) => {
    try {
      notify('या विषयासाठी कायदेशीर मराठी स्क्रिप्ट तयार होत आहे...');
      const res = await fetch('/api/reels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic.topic_name,
          category: topic.category,
          applicable_law: topic.primary_legal_sources,
          selection_reason: topic.why_important_today,
          target_audience: topic.target_audience
        })
      });
      const data = await res.json();
      setActiveReel(data.reel);
      setActiveTab('tab3'); // Switch to Ready Scripts
      notify('स्क्रिप्ट तयार झाली! (Ready-to-Record Tab 3)');
    } catch (err) {
      notify('स्क्रिप्ट तयार करताना त्रुटी: ' + err.message);
    }
  };

  // 3. Action: VERIFY LEGAL SOURCES
  const handleVerifySources = () => {
    setActiveTab('tab5'); // Navigate to Tab 5 Legal Verification
    notify('कायदेशीर पडताळणी व अधिकृत स्रोतांचे पृष्ठ उघडले.');
  };

  // 4. Action: COPY SCRIPT
  const handleCopyScript = () => {
    if (!activeReel?.script_format_a) {
      notify('सक्रिय स्क्रिप्ट उपलब्ध नाही!');
      return;
    }
    navigator.clipboard.writeText(activeReel.script_format_a);
    notify('मराठी स्क्रिप्ट (Format A) क्लिपबोर्डवर यशस्वीरीत्या कॉपी झाली!');
  };

  // 5. Action: COPY CAPTION
  const handleCopyCaption = () => {
    if (!activeReel?.caption) {
      notify('सक्रिय कॅप्शन उपलब्ध नाही!');
      return;
    }
    navigator.clipboard.writeText(activeReel.caption);
    notify('संपूर्ण Instagram कॅप्शन क्लिपबोर्डवर यशस्वीरीत्या कॉपी झाले!');
  };

  // 6. Action: MARK AS RECORDED
  const handleMarkRecorded = async (reelId) => {
    const targetId = reelId || activeReel?.id;
    if (!targetId) return;
    try {
      const res = await fetch(`/api/reels/${targetId}/record`, { method: 'POST' });
      const data = await res.json();
      notify(data.message || 'Reel रेकॉर्ड झाली म्हणून नोंदवली!');
      const activeRes = await fetch('/api/reels/active');
      setActiveReel(await activeRes.json());
    } catch (err) {
      notify('त्रुटी: ' + err.message);
    }
  };

  // 7. Action: MARK AS PUBLISHED
  const handleOpenPublishModal = (reel) => {
    setModalReel(reel || activeReel);
    setIsPublishModalOpen(true);
  };

  const handlePublishSuccess = async (publishResult) => {
    notify(publishResult.message);
    loadAllData();
  };

  // 8. Action: GENERATE NEXT REEL
  const handleGenerateNext = async () => {
    try {
      const res = await fetch('/api/reels/next', { method: 'POST' });
      const data = await res.json();
      if (data.reel) {
        setActiveReel(data.reel);
        setActiveTab('tab3');
        notify(data.message || 'पुढील Reel तयार केली!');
      } else {
        notify(data.message || 'सर्व Reels पूर्ण झाल्या आहेत.');
      }
    } catch (err) {
      notify('त्रुटी: ' + err.message);
    }
  };

  // 9. Action: ANALYZE PERFORMANCE (24h Cycle)
  const handleRun24HourCycle = async () => {
    setIsAnalyzing(true);
    notify('२४ तासांचे स्वयंचलित विश्लेषण, शेअर्स/सेव्ह्स दर व बॅकअप प्रक्रिया सुरू...');
    try {
      const res = await fetch('/api/analytics/run-24h-cycle', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '२४-तास सायकल त्रुटी');
      await loadAllData();
      setActiveTab('tab7'); // Navigate to Tab 7 Analytics
      notify('कामगिरी विश्लेषण यशस्वीरीत्या पूर्ण झाले!');
      return data;
    } catch (err) {
      notify('कामगिरी विश्लेषण त्रुटी: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectBest = async (topicId) => {
    const res = await fetch('/api/trends/select-best', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId })
    });
    const data = await res.json();
    setTrendsData(data.trends);
    notify('आजचा सर्वोत्तम विषय निवडला गेला!');
  };

  const handleApproveScript = async (reelId) => {
    try {
      const res = await fetch(`/api/reels/${reelId}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notify(data.message);
      const activeRes = await fetch('/api/reels/active');
      setActiveReel(await activeRes.json());
    } catch (err) {
      notify(err.message);
    }
  };

  const handleUpdateReel = async (reelId, updates) => {
    const res = await fetch(`/api/reels/${reelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.reel) {
      setActiveReel(data.reel);
    }
    return data;
  };

  const handleOpenTeleprompter = (reel) => {
    setModalReel(reel || activeReel);
    setIsTeleprompterOpen(true);
  };

  const handleAddReference = async (refData) => {
    const res = await fetch('/api/legal/references', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refData)
    });
    const data = await res.json();
    const refsRes = await fetch('/api/legal/references');
    setLegalRefs(await refsRes.json());
    return data;
  };

  const handleCreateBackup = async (type) => {
    const res = await fetch('/api/backups/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    const data = await res.json();
    const bRes = await fetch('/api/backups');
    setBackups(await bRes.json());
    return data;
  };

  const handleTestRestore = async (backupId) => {
    const res = await fetch(`/api/backups/${backupId}/test-restore`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  };

  const handleGenerateReport = async () => {
    const res = await fetch('/api/reports/generate', { method: 'POST' });
    const data = await res.json();
    setLatestReport(data);
    return data;
  };

  const handleUpdateSettings = async (updates) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    const setRes = await fetch('/api/settings');
    setSettings(await setRes.json());
    return data;
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        systemHealth={systemHealth}
        activeDay={activeReel ? activeReel.day_number : 8}
        totalPublished={archiveList.length}
        targetFollowers={100000}
        currentFollowers={analyticsData?.followerGrowth?.currentFollowers || 27890}
      />

      {/* 9 Required Actions Persistent Toolbar */}
      <QuickActionBar
        activeReel={activeReel}
        onRefreshTrends={handleRefreshTrends}
        onGenerateScript={handleGenerateScriptForActive}
        onVerifySources={handleVerifySources}
        onCopyScript={handleCopyScript}
        onCopyCaption={handleCopyCaption}
        onMarkRecorded={handleMarkRecorded}
        onOpenPublishModal={handleOpenPublishModal}
        onGenerateNext={handleGenerateNext}
        onAnalyzePerformance={handleRun24HourCycle}
        onOpenVideoStudio={() => setActiveTab('tab9')}
        onOpenContentStudio={() => setActiveTab('tab10')}
        onOpenContentBank={() => setActiveTab('tab11')}
        isRefreshing={isRefreshing}
        isAnalyzing={isAnalyzing}
      />

      {/* 8 Tabs Navigation Bar */}
      <NavTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          trends: trendsData?.totalEvaluated || 10,
          published: archiveList.length,
          activeStatus: activeReel?.status || 'Ready'
        }}
      />

      {/* Main Workspace Content Area */}
      <main className="main-content">
        {/* TAB 1: Today's Trending Legal Topics */}
        {activeTab === 'tab1' && (
          <Tab1Trends
            trendsData={trendsData}
            onRefreshTrends={handleRefreshTrends}
            onSelectBest={handleSelectBest}
            onGenerateForTopic={handleGenerateForTopic}
            onRun24HourCycle={handleRun24HourCycle}
            onNotify={notify}
          />
        )}

        {/* TAB 2: Top 3 Recommended Reels */}
        {activeTab === 'tab2' && (
          <Tab2Top3Reels
            trendsData={trendsData}
            onSelectBest={handleSelectBest}
            onGenerateForTopic={handleGenerateForTopic}
            onNotify={notify}
          />
        )}

        {/* TAB 3: Ready-to-Record Scripts */}
        {activeTab === 'tab3' && (
          <Tab3ReadyScripts
            activeReel={activeReel}
            onApprove={handleApproveScript}
            onMarkRecorded={handleMarkRecorded}
            onOpenPublishModal={handleOpenPublishModal}
            onGenerateNext={handleGenerateNext}
            onUpdateReel={handleUpdateReel}
            onOpenTeleprompter={handleOpenTeleprompter}
            onNavigateToVideo={() => setActiveTab('tab9')}
            onNotify={notify}
          />
        )}

        {/* TAB 4: Captions, SEO Keywords, Hashtags, and Pinned Comments */}
        {activeTab === 'tab4' && (
          <Tab4CaptionsAndSEO
            activeReel={activeReel}
            onNotify={notify}
          />
        )}

        {/* TAB 5: Legal Verification and Official Sources */}
        {activeTab === 'tab5' && (
          <Tab5LegalResearch
            legalRefs={legalRefs}
            transitions={transitions}
            officialSources={officialSources}
            gunthewariRules={gunthewariRules}
            unverifiedClaims={unverifiedClaims}
            onAddReference={handleAddReference}
            onNotify={notify}
          />
        )}

        {/* TAB 6: Published Content Archive */}
        {activeTab === 'tab6' && (
          <Tab3PublishedArchive
            archiveList={archiveList}
            calendarList={calendarList}
            onNotify={notify}
          />
        )}

        {/* TAB 7: Instagram Performance Analytics */}
        {activeTab === 'tab7' && (
          <Tab4Analytics
            analyticsData={analyticsData}
            onRun24HourCycle={handleRun24HourCycle}
            onNotify={notify}
          />
        )}

        {/* TAB 8: Settings, Hosting, Backups, and Security */}
        {activeTab === 'tab8' && (
          <Tab6Settings
            settings={settings}
            backups={backups}
            systemHealth={systemHealth}
            latestReport={latestReport}
            auditLogs={auditLogs}
            onUpdateSettings={handleUpdateSettings}
            onCreateBackup={handleCreateBackup}
            onTestRestore={handleTestRestore}
            onGenerateReport={handleGenerateReport}
            onRun24HourCycle={handleRun24HourCycle}
            onNotify={notify}
          />
        )}

        {/* TAB 9: Direct Video Generator */}
        {activeTab === 'tab9' && (
          <Tab9VideoGenerator
            activeReel={activeReel}
            onNotify={notify}
          />
        )}

        {/* TAB 10: AI Content Studio & Topic Suggester */}
        {activeTab === 'tab10' && (
          <Tab10ContentCreator
            onNavigateToVideo={(customReel) => {
              if (customReel) setActiveReel(customReel);
              setActiveTab('tab9');
            }}
            onNavigateToTab3={() => {
              fetch('/api/reels/active').then(r => r.json()).then(setActiveReel).catch(() => {});
              setActiveTab('tab3');
            }}
            onNotify={notify}
          />
        )}

        {/* TAB 11: 60-Day SEO & Instagram Trending Content Bank */}
        {activeTab === 'tab11' && (
          <Tab11ContentBank
            onNavigateToVideo={(customReel) => {
              if (customReel) setActiveReel(customReel);
              setActiveTab('tab9');
            }}
            onNavigateToTab10={(idea) => {
              setActiveTab('tab10');
            }}
            onNotify={notify}
          />
        )}
      </main>

      {/* Teleprompter Fullscreen Modal */}
      <TeleprompterModal
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        reel={modalReel || activeReel}
      />

      {/* Mark As Published Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        reel={modalReel || activeReel}
        onPublishSuccess={handlePublishSuccess}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
