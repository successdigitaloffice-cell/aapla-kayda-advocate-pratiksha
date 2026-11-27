import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { ALL_COMPLETE_SCRIPTS } from '../data/completeScriptsData';
import VideoCreatedCheckbox from './VideoCreatedCheckbox';
import { useVideoTracking } from '../context/VideoTrackingContext';

export default function Tab6OnlyContent({ notify }) {
  const { isVideoCreated } = useVideoTracking();

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'created' | 'pending'

  // Teleprompter Reading View Options
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: sm, 1: base, 2: lg, 3: xl
  const [lineSpacing, setLineSpacing] = useState('relaxed'); // 'normal' | 'relaxed' | 'loose'
  const [expandedSectionCards, setExpandedSectionCards] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const fontSizes = [
    { label: 'लहान (A-)', class: 'text-sm sm:text-base leading-relaxed' },
    { label: 'मध्यम (A)', class: 'text-base sm:text-lg leading-relaxed' },
    { label: 'मोठे (A+)', class: 'text-lg sm:text-xl leading-loose font-medium' },
    { label: 'अतिमोठे (A++)', class: 'text-xl sm:text-2xl leading-loose font-medium' }
  ];

  // Filtered Scripts
  const filteredScripts = useMemo(() => {
    return ALL_COMPLETE_SCRIPTS.filter((script) => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        const cat = (script.category || '').toLowerCase();
        if (!cat.includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all') {
        const created = isVideoCreated(script);
        if (statusFilter === 'created' && !created) return false;
        if (statusFilter === 'pending' && created) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (script.title || '').toLowerCase().includes(q);
        const lawMatch = (script.applicableLaw || '').toLowerCase().includes(q);
        const sectionMatch = (script.applicableSection || '').toLowerCase().includes(q);
        const categoryMatch = (script.category || '').toLowerCase().includes(q);
        const scriptMatch = (script.fullSpokenScript || '').toLowerCase().includes(q);
        return titleMatch || lawMatch || sectionMatch || categoryMatch || scriptMatch;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, statusFilter, isVideoCreated]);

  // Overall Statistics
  const totalCount = ALL_COMPLETE_SCRIPTS.length;
  const createdCount = ALL_COMPLETE_SCRIPTS.filter((s) => isVideoCreated(s)).length;
  const pendingCount = totalCount - createdCount;
  const percentageCompleted = Math.round((createdCount / totalCount) * 100) || 0;

  // Toggle 19-Section breakdown for a script
  const toggleSectionExpand = (id) => {
    setExpandedSectionCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy Full Script to Clipboard
  const handleCopyScript = (script) => {
    const textToCopy = script.fullSpokenScript || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(script.contentKey || script.dayNumber);
      if (notify) {
        notify(`दिवस ${script.dayNumber} ची संपूर्ण स्क्रिप्ट क्लिपबोर्डवर कॉपी झाली!`);
      }
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 p-4 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>स्वतंत्र फेस व्हिडिओ स्क्रिप्ट बँक</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                १९-मुद्दे परिपूर्ण फॉर्म्युला
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              फक्त कंटेंट – <span className="text-gold-400">Complete Scripts</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              कॅमेऱ्यासमोर थेट वाचून फेस व्हिडिओ (Face Video) रेकॉर्ड करण्यासाठी तयार केलेल्या परिपूर्ण कायदेशीर संवाद स्क्रिप्ट्स. 
              कोणतेही अतिरिक्त कंट्रोल्स नाहीत — फक्त वाचण्यासाठी व रेकॉर्ड करण्यासाठी सज्ज!
            </p>
          </div>

          {/* Overall Progress Widget */}
          <div className="bg-navy-950/80 border border-navy-750 rounded-2xl p-3.5 sm:p-4 shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">व्हिडिओ निर्मिती प्रगती</span>
              <span className="text-gold-400 font-extrabold">{percentageCompleted}% पूर्ण</span>
            </div>
            <div className="w-full bg-navy-900 rounded-full h-2 overflow-hidden border border-navy-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-gold-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentageCompleted}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] mt-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold">✓ {createdCount} बनवलेले</span>
              <span className="text-amber-400 font-medium">{pendingCount} बाकी (६० पैकी)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reading Preferences & Font Scaling Bar */}
      <div className="bg-navy-900/90 border border-navy-750 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-bold">
          <Eye className="w-4 h-4 text-gold-400" />
          <span>वाचनासाठी अक्षरांचा आकार (Font Size):</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-navy-950 p-1 rounded-xl border border-navy-800">
          <button
            onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
            disabled={fontSizeLevel === 0}
            className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-750 text-slate-300 disabled:opacity-40 transition-all"
            title="अक्षरे लहान करा"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {fontSizes.map((f, idx) => (
            <button
              key={idx}
              onClick={() => setFontSizeLevel(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                fontSizeLevel === idx
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}

          <button
            onClick={() => setFontSizeLevel(Math.min(3, fontSizeLevel + 1))}
            disabled={fontSizeLevel === 3}
            className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-750 text-slate-300 disabled:opacity-40 transition-all"
            title="अक्षरे मोठे करा"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Search and Filtering Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="स्क्रिप्ट, कलम, शासन निर्णय किंवा विषय शोधा..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-gold-500"
          >
            <option value="all">सर्व कायदेशीर प्रवर्ग (All Topics)</option>
            <option value="जमीन">जमीन महसूल व गुंठेवारी</option>
            <option value="तुकडेबंदी">तुकडेबंदी व खरेदीखत</option>
            <option value="७/१२">७/१२ फेरफार व वारस नोंद</option>
            <option value="BNSS">BNSS २०२३ व पोलीस अधिकार</option>
            <option value="महिला">महिलांचे हक्क व कौटुंबिक कायदे</option>
            <option value="सायबर">सायबर सुरक्षा व बँकिंग</option>
          </select>
        </div>

        {/* Status Toggle Buttons */}
        <div className="sm:col-span-3 flex bg-navy-900 border border-navy-700/80 rounded-xl p-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-gold-500 text-navy-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            सर्व ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-gold-500 text-navy-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            शिल्लक ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('created')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'created'
                ? 'bg-emerald-500 text-navy-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            पूर्ण ({createdCount})
          </button>
        </div>
      </div>

      {/* 4. Complete Scripts Feed */}
      <div className="space-y-6">
        {filteredScripts.map((script) => {
          const isCreated = isVideoCreated(script);
          const isExpanded = !!expandedSectionCards[script.contentKey || script.dayNumber];
          const isCopied = copiedId === (script.contentKey || script.dayNumber);

          return (
            <div
              key={script.contentKey || script.dayNumber}
              className={`rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden ${
                isCreated
                  ? 'bg-navy-900/90 border-emerald-500/40 shadow-emerald-500/5'
                  : 'bg-navy-850/95 border-navy-700/90 hover:border-gold-500/40'
              }`}
            >
              {/* Card Header: Day, Category, Title & Action Checkbox */}
              <div className="p-4 sm:p-5 border-b border-navy-800/80 bg-navy-900/60">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-gold-500 text-navy-950 shadow-sm">
                        दिवस {script.dayNumber}
                      </span>
                      <span className="text-xs font-extrabold text-gold-400 uppercase tracking-wider">
                        {script.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {script.estimatedDuration} | ~{script.wordCount} शब्द
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-snug">
                      {script.title}
                    </h2>

                    <div className="flex items-center space-x-2 text-xs text-slate-400 pt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{script.applicableLaw} {script.applicableSection ? `(${script.applicableSection})` : ''}</span>
                    </div>
                  </div>

                  {/* Actions: Copy Full Script & Feature 1 Checkbox */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyScript(script)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-navy-800 hover:bg-navy-750 text-gold-400 border-gold-500/30'
                      }`}
                      title="कॅमेऱ्यासमोर वाचण्यासाठी संपूर्ण स्क्रिप्ट कॉपी करा"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'कॉपी झाली!' : 'स्क्रिप्ट कॉपी करा'}</span>
                    </button>

                    {/* FEATURE 1: Manual Video Created Checkbox */}
                    <VideoCreatedCheckbox
                      item={script}
                      onNotify={notify}
                      className="shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Main Script Reading Body (Teleprompter Optimized View) */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Spoken Teleprompter Dialogue Box */}
                <div className="bg-navy-950/90 border border-gold-500/20 rounded-2xl p-4 sm:p-6 shadow-inner font-sans">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-2.5 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gold-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>थेट कॅमेरा फेस-व्हिडिओ संवाद (Natural Spoken Marathi)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Face-Video Teleprompter Mode
                    </span>
                  </div>

                  {/* Complete Spoken Script with Cues */}
                  <div className={`${fontSizes[fontSizeLevel].class} text-slate-100 whitespace-pre-wrap select-text`}>
                    {script.fullSpokenScript}
                  </div>
                </div>

                {/* 19-Section Detailed Accordion Toggle */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleSectionExpand(script.contentKey || script.dayNumber)}
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-navy-900/60 hover:bg-navy-900 text-xs font-semibold text-slate-300 hover:text-white border border-navy-800 transition-all"
                  >
                    <span className="flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-gold-400" />
                      <span>१९-मुद्द्यांचे सविस्तर कायदेशीर विभाजन (१९-Part Breakdown)</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* 19 Detailed Sections Breakdown */}
                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-navy-950 border border-navy-750 space-y-3.5 text-xs text-slate-200 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">१. Video Topic / Title:</strong>
                          <span>{script.sections.topicTitle}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">२. Video Objective:</strong>
                          <span>{script.sections.objective}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 md:col-span-2">
                          <strong className="text-amber-400 block mb-1">३. Opening Hook (सुरुवातीची आकर्षक ओळ):</strong>
                          <span className="italic text-amber-200">{script.sections.openingHook}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 md:col-span-2">
                          <strong className="text-gold-400 block mb-1">४. Attention Grabbing Introduction:</strong>
                          <span>{script.sections.attentionIntro}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">५. पूर्ण Background / Context:</strong>
                          <span>{script.sections.fullContext}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">६. मुख्य विषयाचे सविस्तर स्पष्टीकरण:</strong>
                          <span>{script.sections.detailedExplanation}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 md:col-span-2">
                          <strong className="text-emerald-400 block mb-1">७. Step-by-Step Explanation (प्रत्यक्ष पायऱ्या):</strong>
                          <span className="whitespace-pre-line">{script.sections.stepByStep}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">८. प्रत्येक महत्त्वाचा मुद्दा आणि स्पष्टीकरण:</strong>
                          <span className="whitespace-pre-line">{script.sections.keyPoints}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">९. उदाहरणे आणि वास्तविक संदर्भ:</strong>
                          <span>{script.sections.realExample}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">१०. आवश्यक Facts, Data आणि Details:</strong>
                          <span>{script.sections.factsData}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">११. मुख्य Content मधील सर्व महत्त्वाचे मुद्दे:</strong>
                          <span>{script.sections.coreContent}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-blue-400 block mb-1">१२. Audience Engagement:</strong>
                          <span>{script.sections.engagement}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-purple-400 block mb-1">१३. योग्य ठिकाणी प्रश्न आणि Suspense:</strong>
                          <span>{script.sections.suspense}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">१४. Main Message / Core Learning:</strong>
                          <span>{script.sections.mainMessage}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-pink-400 block mb-1">१५. Emotional Connection:</strong>
                          <span>{script.sections.emotionalConnection}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-emerald-400 block mb-1">१६. Practical Takeaways:</strong>
                          <span>{script.sections.practicalTakeaways}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">१७. Strong Ending:</strong>
                          <span>{script.sections.strongEnding}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800">
                          <strong className="text-gold-400 block mb-1">१८. प्रभावी Conclusion:</strong>
                          <span>{script.sections.conclusion}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 md:col-span-2">
                          <strong className="text-amber-400 block mb-1">१९. योग्य Call To Action (CTA):</strong>
                          <span>{script.sections.callToAction}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredScripts.length === 0 && (
          <div className="p-12 text-center bg-navy-850 rounded-2xl border border-navy-750 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <p className="text-sm">कोणतीही जुळणारी कायदेशीर स्क्रिप्ट आढळली नाही.</p>
          </div>
        )}
      </div>
    </div>
  );
}
