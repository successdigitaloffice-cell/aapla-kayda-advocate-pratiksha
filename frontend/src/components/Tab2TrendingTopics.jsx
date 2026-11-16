import React, { useState, useEffect } from 'react';
import {
  Flame,
  Search,
  Filter,
  RefreshCw,
  Video,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export default function Tab2TrendingTopics({
  trends = [],
  onRefreshTrends,
  onSelectTopic,
  onNavigateTab
}) {
  const [subView, setSubView] = useState('daily'); // 'daily', 'target60', 'tracker90'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [target60Data, setTarget60Data] = useState([]);
  const [tracker90Data, setTracker90Data] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    loadExtraTrackers();
  }, []);

  const loadExtraTrackers = async () => {
    setLoadingExtra(true);
    try {
      const [res60, res90] = await Promise.all([
        fetch('/api/content/60-days-target'),
        fetch('/api/content/90-days-tracker')
      ]);

      if (res60.ok) {
        const d60 = await res60.json();
        setTarget60Data(d60.data?.topics || []);
      }
      if (res90.ok) {
        const d90 = await res90.json();
        setTracker90Data(d90.tracker || []);
      }
    } catch (e) {
      console.error('Error fetching trackers:', e);
    } finally {
      setLoadingExtra(false);
    }
  };

  // Determine which list to display
  let currentList = [];
  if (subView === 'daily') {
    const dailyTrendsList = Array.isArray(trends)
      ? trends
      : (Array.isArray(trends?.trends)
        ? trends.trends
        : (Array.isArray(trends?.allTopics)
          ? trends.allTopics
          : (Array.isArray(trends?.top3)
            ? trends.top3
            : [])));

    currentList = dailyTrendsList.map((t, idx) => ({
      id: t.id || idx,
      title: t.topic_name || t.title,
      category: t.category || 'महाराष्ट्र जमीन महसूल',
      score: t.trend_score || 95,
      priority: idx < 3 ? 'उच्च (High)' : 'मध्यम (Medium)',
      statute: t.primary_legal_sources || 'महाराष्ट्र जमीन महसूल संहिता व गुंठेवारी',
      why: t.why_important_today || 'नागरिकांसाठी अत्यंत महत्त्वाचा आणि ज्वलंत कायदेशीर प्रश्न.',
      officialSource: 'https://mahabhumi.gov.in/',
      raw: t
    }));
  } else if (subView === 'target60') {
    currentList = target60Data.map(t => ({
      id: t.dayNumber,
      dayNumber: t.dayNumber,
      title: t.title,
      category: t.category,
      score: t.trendingScore || 90,
      priority: t.priority,
      statute: `${t.applicableLaw} (${t.applicableSection || ''})`,
      why: t.videoIdea,
      officialSource: t.officialSource,
      status: t.status,
      raw: t
    }));
  } else {
    currentList = tracker90Data.map(t => ({
      id: t.day,
      dayNumber: t.day,
      title: t.title,
      category: t.category,
      score: t.relevanceIndex || 88,
      priority: 'सत्यापित (Verified)',
      statute: `${t.statute} - ${t.section}`,
      why: `राजपत्र तारीख: ${t.gazetteDate} | संदर्भ: ${t.officialCitation}`,
      officialSource: t.officialPortal,
      status: t.complianceStatus,
      raw: t
    }));
  }

  // Filter list
  const filteredList = currentList.filter(item => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.statute && item.statute.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || (item.category && item.category.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header with Sub-View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-850 border border-navy-700/80 p-4 sm:p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                कायदेशीर ट्रेंड्स व विषय ट्रॅकर
              </h1>
              <p className="text-xs text-slate-400">
                महाराष्ट्र व भारतीय कायदे, सुप्रीम कोर्ट निवाडे व अधिकृत राजपत्रावर आधारित खरे विषय
              </p>
            </div>
          </div>
        </div>

        {/* 3 View Tabs */}
        <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
          <button
            onClick={() => setSubView('daily')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              subView === 'daily'
                ? 'bg-gold-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            दैनिक ट्रेंड्स ({trends.length})
          </button>
          <button
            onClick={() => setSubView('target60')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              subView === 'target60'
                ? 'bg-gold-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ६० दिवस टार्गेट ({target60Data.length})
          </button>
          <button
            onClick={() => setSubView('tracker90')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              subView === 'tracker90'
                ? 'bg-gold-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ९० दिवस ट्रॅकर ({tracker90Data.length})
          </button>
        </div>
      </div>

      {/* Controls: Search, Category Filter & Refresh Button */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="विषय, कलम किंवा कायद्याचे नाव शोधा..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-gold-500"
          >
            <option value="all">सर्व कायदेशीर प्रवर्ग (All Categories)</option>
            <option value="जमीन">जमीन महसूल व गुंठेवारी</option>
            <option value="तुकडेबंदी">तुकडेबंदी व खरेदीखत</option>
            <option value="७/१२">७/१२ फेरफार व वारस नोंद</option>
            <option value="BNSS">BNSS २०२३ व पोलीस अधिकार</option>
            <option value="महिला">महिलांचे हक्क व कौटुंबिक कायदे</option>
            <option value="सायबर">सायबर सुरक्षा व बँकिंग</option>
            <option value="ग्राहक">ग्राहक संरक्षण अधिकार</option>
          </select>
        </div>

        {/* Refresh Action */}
        <div className="sm:col-span-2">
          <button
            onClick={() => {
              if (onRefreshTrends) onRefreshTrends();
              loadExtraTrackers();
            }}
            className="w-full h-full flex items-center justify-center space-x-1.5 bg-navy-800 hover:bg-navy-750 text-gold-400 border border-gold-500/30 px-3 py-2.5 rounded-xl font-bold text-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>रिफ्रेश करा</span>
          </button>
        </div>
      </div>

      {/* Topics Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-navy-850 border border-navy-700/80 hover:border-gold-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-all hover:-translate-y-0.5 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  {item.dayNumber && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                      दिवस {item.dayNumber}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    स्कोअर: {item.score}
                  </span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-gold-300 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {item.why}
              </p>

              <div className="mt-3 pt-3 border-t border-navy-800 flex flex-wrap items-center gap-2 text-[11px]">
                <div className="text-slate-400 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400 mr-1 shrink-0" />
                  <span className="truncate max-w-[240px]">{item.statute}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between gap-2">
              {item.officialSource ? (
                <a
                  href={item.officialSource}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-gold-400 flex items-center space-x-1"
                >
                  <span>अधिकृत स्रोत</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => {
                  if (onSelectTopic) onSelectTopic(item.raw || item);
                  onNavigateTab('studio');
                }}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span>व्हिडिओ बनवा</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="p-12 text-center bg-navy-850 rounded-2xl border border-navy-750 text-slate-400">
          <p className="text-sm">कोणताही जुळणारा कायदेशीर विषय आढळला नाही.</p>
        </div>
      )}
    </div>
  );
}
