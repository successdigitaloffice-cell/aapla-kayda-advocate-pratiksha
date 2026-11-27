import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Clapperboard,
  FileText,
  Settings,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function NavTabs({ activeTab, setActiveTab, counts = {} }) {
  const tabs = [
    {
      id: 'dashboard',
      number: '१',
      label: 'Dashboard',
      marathi: 'डॅशबोर्ड',
      icon: LayoutDashboard,
      badge: counts.activeReels || 'Live'
    },
    {
      id: 'trends',
      number: '२',
      label: 'Trending Topics',
      marathi: 'कायदेशीर ट्रेंड्स',
      icon: Flame,
      badge: counts.trendsCount || '10 नवीन'
    },
    {
      id: 'studio',
      number: '३',
      label: 'Video Studio',
      marathi: 'व्हिडिओ स्टुडिओ',
      icon: Clapperboard,
      badge: '1-Click'
    },
    {
      id: 'only-content',
      number: '४',
      label: 'Only Content',
      marathi: 'फक्त कंटेंट',
      icon: BookOpen,
      badge: '६० स्क्रिप्ट्स'
    },
    {
      id: 'photo',
      number: '५',
      label: 'Document Library',
      marathi: 'कायदेशीर कागदपत्रे',
      icon: FileText,
      badge: 'अधिकृत'
    },
    {
      id: 'settings',
      number: '६',
      label: 'Settings & Cloud',
      marathi: 'सेटिंग्ज व डिप्लॉय',
      icon: Settings
    }
  ];

  return (
    <nav className="border-b border-navy-700 bg-navy-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Horizontal scroll container for mobile responsiveness */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 border-gold-500/40 shadow-lg shadow-gold-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/60 border-transparent'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-gold-500/20 text-gold-400' : 'bg-navy-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight text-xs sm:text-sm">{tab.marathi}</span>
                  <span className="text-[10px] text-slate-400 font-sans tracking-wide hidden sm:inline">{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-sans font-semibold ${
                      isActive
                        ? 'bg-gold-500 text-navy-950'
                        : 'bg-navy-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
