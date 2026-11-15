import React from 'react';
import {
  Flame,
  Award,
  Film,
  FileText,
  ShieldCheck,
  Archive,
  BarChart3,
  Settings,
  Video,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function NavTabs({ activeTab, setActiveTab, counts = {} }) {
  const tabs = [
    {
      id: 'tab1',
      number: '१',
      label: "Today's Trends",
      marathi: "दैनिक ट्रेंड्स",
      icon: Flame,
      badge: counts.trends || 10
    },
    {
      id: 'tab2',
      number: '२',
      label: "Top 3 Recommended",
      marathi: "Top 3 शिफारसी",
      icon: Award,
      badge: "Top 3"
    },
    {
      id: 'tab3',
      number: '३',
      label: "Ready-to-Record Scripts",
      marathi: "रेकॉर्डिंग स्क्रिप्ट्स",
      icon: Film,
      badge: counts.activeStatus || "Active"
    },
    {
      id: 'tab4',
      number: '४',
      label: "Captions & SEO",
      marathi: "कॅप्शन व SEO",
      icon: FileText
    },
    {
      id: 'tab5',
      number: '५',
      label: "Legal Verification",
      marathi: "कायदेशीर पडताळणी",
      icon: ShieldCheck,
      badge: "Verified"
    },
    {
      id: 'tab6',
      number: '६',
      label: "Published Archive",
      marathi: "प्रकाशित अर्काइव्ह",
      icon: Archive,
      badge: counts.published || 7
    },
    {
      id: 'tab7',
      number: '७',
      label: "Performance Analytics",
      marathi: "कामगिरी विश्लेषण",
      icon: BarChart3
    },
    {
      id: 'tab8',
      number: '८',
      label: "Settings & Security",
      marathi: "सेटिंग्ज व अहवाल",
      icon: Settings
    },
    {
      id: 'tab9',
      number: '९',
      label: "Direct Video Generator",
      marathi: "व्हिडिओ निर्मिती (Reels)",
      icon: Video,
      badge: "NEW"
    },
    {
      id: 'tab10',
      number: '१०',
      label: "AI Content Studio",
      marathi: "कंटेंट सुचना व निर्मिती",
      icon: Sparkles,
      badge: "AI ✨"
    },
    {
      id: 'tab11',
      number: '११',
      label: "60-Day Trend Ideas",
      marathi: "६० दिवस SEO आयडिया",
      icon: Calendar,
      badge: "60 Reels"
    }
  ];

  return (
    <nav className="nav-tabs-wrapper">
      <div className="nav-tabs-container">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              title={`${tab.marathi} (${tab.label})`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? '#0F172A' : '#D4AF37'} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                <span style={{ fontWeight: isActive ? 800 : 600, color: isActive ? '#0F172A' : '#F8FAFC' }}>
                  <strong style={{ color: isActive ? '#0F172A' : '#D4AF37', marginRight: '4px' }}>Tab {tab.number}:</strong>
                  {tab.marathi}
                </span>
                <span style={{ fontSize: '0.68rem', color: isActive ? '#0F172A' : '#94A3B8' }}>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
