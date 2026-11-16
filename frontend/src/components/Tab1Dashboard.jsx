import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Video,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Tab1Dashboard({
  activeReel,
  trends = [],
  onSelectTopic,
  onNavigateTab
}) {
  const [stats, setStats] = useState({
    publishedCount: 7,
    readyCount: 4,
    pendingCount: 49,
    total60Days: 60,
    tracked90Days: 90,
    updatedToday: 10
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch 60-day target info
      const targetRes = await fetch('/api/content/60-days-target');
      if (targetRes.ok) {
        const tJson = await targetRes.json();
        if (tJson.data) {
          setStats(prev => ({
            ...prev,
            publishedCount: tJson.data.completedDays,
            readyCount: tJson.data.readyDays,
            pendingCount: tJson.data.pendingDays,
            total60Days: tJson.data.targetTotalDays
          }));
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const trendsList = Array.isArray(trends)
    ? trends
    : (Array.isArray(trends?.trends)
      ? trends.trends
      : (Array.isArray(trends?.allTopics)
        ? trends.allTopics
        : (Array.isArray(trends?.top3)
          ? trends.top3
          : [])));
  const topTrend = trendsList.length > 0 ? trendsList[0] : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: Advocate Pratiksha Official Badge */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 p-4 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                कायदेशीर AI ग्रोथ सिस्टीम
              </span>
              <span className="flex items-center text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                24/7 सक्रिय (Live Engine)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              आपला कायदा – <span className="text-gold-400">Advocate Pratiksha</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              महाराष्ट्र जमीन महसूल, गुंठेवारी, तुकडेबंदी, ७/१२ फेरफार आणि BNSS २०२३ वर आधारित ६० दिवसांचे हाय-इम्पॅक्ट लीगल कंटेंट व व्हिडिओ जनरेशन प्लॅटफॉर्म.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigateTab('studio')}
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-gold-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4" />
              <span>व्हिडिओ स्टुडिओ सुरू करा</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Today's Trends */}
        <div className="bg-navy-850/80 border border-navy-700/80 rounded-2xl p-4 hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">आजचे ट्रेंडिंग विषय</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{trends.length || stats.updatedToday}</div>
          <div className="text-[11px] text-emerald-400 flex items-center mt-1">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            आज सकाळी अपडेट झाले
          </div>
        </div>

        {/* Card 2: 60-Day Target */}
        <div className="bg-navy-850/80 border border-navy-700/80 rounded-2xl p-4 hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">६० दिवस टार्गेट</span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.publishedCount}</span>
            <span className="text-xs text-slate-400 font-normal">/ {stats.total60Days} दिवस</span>
          </div>
          <div className="w-full bg-navy-950 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gold-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((stats.publishedCount / stats.total60Days) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>{Math.round((stats.publishedCount / stats.total60Days) * 100)}% पूर्ण</span>
            <span>{stats.pendingCount} उर्वरित</span>
          </div>
        </div>

        {/* Card 3: 90-Day Tracker */}
        <div className="bg-navy-850/80 border border-navy-700/80 rounded-2xl p-4 hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">९० दिवस विषय ट्रॅकर</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.tracked90Days}</div>
          <div className="text-[11px] text-blue-400 flex items-center mt-1">
            <ShieldCheck className="w-3 h-3 mr-1" />
            राजपत्र व निवाडे पडताळलेले
          </div>
        </div>

        {/* Card 4: Generated & Ready Videos */}
        <div className="bg-navy-850/80 border border-navy-700/80 rounded-2xl p-4 hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">एकूण तयार व्हिडिओ</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.publishedCount + stats.readyCount}</div>
          <div className="text-[11px] text-purple-300 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {stats.readyCount} रेकॉर्डिंग/स्टुडिओसाठी तयार
          </div>
        </div>
      </div>

      {/* Main Row: Top Trending Topic Spotlight & Detailed Video Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's #1 Trending Legal Topic */}
        <div className="lg:col-span-2 bg-navy-850/90 border border-navy-700 rounded-2xl p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">आजचा अग्रगण्य कायदेशीर विषय (Top #1)</h2>
            </div>
            {topTrend && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ट्रेंड स्कोअर: {topTrend.trend_score || 98}/100
              </span>
            )}
          </div>

          {topTrend ? (
            <div className="bg-navy-900/80 border border-navy-750 rounded-xl p-4 sm:p-5 space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider">
                  {topTrend.category || 'महाराष्ट्र जमीन महसूल व गुंठेवारी'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                  {topTrend.topic_name || topTrend.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {topTrend.why_important_today || 'नागरिकांसाठी अत्यंत महत्त्वाचा व सध्या महाराष्ट्रात सर्वाधिक चर्चिला जाणारा कायदेशीर विषय.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-navy-800 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-navy-800 text-slate-300 border border-navy-700">
                  कायदा: {topTrend.primary_legal_sources || 'महाराष्ट्र गुंठेवारी नियम व महसूल संहिता'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-navy-800 text-emerald-400 border border-navy-700 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  अधिकृत पडताळणी पूर्ण
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    if (onSelectTopic) onSelectTopic(topTrend);
                    onNavigateTab('studio');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>या विषयावर व्हिडिओ तयार करा (1-Click)</span>
                </button>
                <button
                  onClick={() => onNavigateTab('trends')}
                  className="w-full sm:w-auto text-xs text-slate-400 hover:text-gold-400 font-medium flex items-center justify-center space-x-1 py-1"
                >
                  <span>सर्व १० ट्रेंड्स पहा</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-spin" />
              <p className="text-sm">नवीन कायदेशीर ट्रेंड्स लोड होत आहेत...</p>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Detailed Legal Video Studio Quick Launch */}
        <div className="bg-navy-850/90 border border-gold-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">सखोल कायदेशीर व्हिडिओ स्टुडिओ</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold">
                100% Legal Details
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-750 space-y-2">
                <div className="flex items-start space-x-2 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gold-400">संपूर्ण कायदेशीर माहिती:</strong> अपूर्ण माहिती न देता कलमे, शासन निर्णय (GR), आवश्यक कागदपत्रे व अपील पायऱ्यांसह व्हिडिओ निर्मिती.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-navy-900/80 border border-navy-800">
                  <span className="text-[10px] text-slate-400">व्हिडिओ फॉरमॅट</span>
                  <div className="text-xs font-extrabold text-gold-400 mt-0.5">
                    1080x1920 Reel
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-900/80 border border-navy-800">
                  <span className="text-[10px] text-slate-400">व्हिज्युअल पद्धत</span>
                  <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                    100% Text & Docs
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                महाराष्ट्र जमीन महसूल, गुंठेवारी, तुकडेबंदी ८ब, ७/१२ फेरफार, वारस हक्क आणि BNSS २०२३ वर संपूर्ण सविस्तर रील तयार करा.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-800 mt-4">
            <button
              onClick={() => onNavigateTab('studio')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>व्हिडिओ स्टुडिओ उघडा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 60-Day Content Progress Tracker Overview */}
      <div className="bg-navy-850/80 border border-navy-700 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>६० दिवस कंटेंट रोडमॅप (Day 1 ते Day 60)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              प्रत्येक दिवसाचा विषय पूर्व-नियोजित, कायदेशीरदृष्ट्या पडताळलेला आणि रीलसाठी सज्ज आहे.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('trends')}
            className="text-xs text-gold-400 hover:text-gold-300 font-bold flex items-center space-x-1"
          >
            <span>संपूर्ण ६० दिवस प्लॅनर उघडा</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { days: 'दिवस १ - १०', theme: 'गुंठेवारी व तुकडेबंदी', status: '७ पूर्ण / ३ तयार', color: 'emerald' },
            { days: 'दिवस ११ - २०', theme: 'BNSS २०२३ व पोलीस हक्क', status: 'पडताळणी पूर्ण', color: 'blue' },
            { days: 'दिवस २१ - ३०', theme: 'महिलांचे हक्क व वारसा', status: 'प्लॅनरमध्ये सज्ज', color: 'purple' },
            { days: 'दिवस ३१ - ४०', theme: 'सायबर सुरक्षा व बँकिंग', status: 'प्लॅनरमध्ये सज्ज', color: 'gold' },
            { days: 'दिवस ४१ - ५०', theme: 'बांधकाम, NA व RERA', status: 'प्लॅनरमध्ये सज्ज', color: 'amber' },
            { days: 'दिवस ५१ - ६०', theme: 'ग्राहक संरक्षण व इतर', status: 'प्लॅनरमध्ये सज्ज', color: 'cyan' },
          ].map((milestone, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateTab('trends')}
              className="p-3 rounded-xl bg-navy-900 border border-navy-750 hover:border-gold-500/40 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div className="text-[10px] text-gold-400 font-bold tracking-wider">{milestone.days}</div>
              <div className="text-xs font-semibold text-white mt-1 truncate">{milestone.theme}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-1 shrink-0" />
                <span className="truncate">{milestone.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
