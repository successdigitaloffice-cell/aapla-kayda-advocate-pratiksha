import React from 'react';
import { Scale, ShieldCheck, Calendar, Sparkles, Smartphone, User, LogOut } from 'lucide-react';

export default function Header({ activeDay = 8, totalPublished = 7, onNavigateTab, currentUser, onLogout }) {
  return (
    <header className="border-b border-navy-750 bg-navy-950/95 backdrop-blur-md relative z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
        {/* Brand Title & Logo */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('dashboard')}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-gold-600 to-amber-400 p-0.5 shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center text-gold-400">
              <Scale className="w-5 h-5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none group-hover:text-gold-300 transition-colors">
                आपला कायदा <span className="text-gold-400">– Advocate Pratiksha</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-none font-medium">
              कायदेशीर AI व्हिडिओ व Instagram ग्रोथ प्लॅटफॉर्म
            </p>
          </div>
        </div>

        {/* Right Badges / Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* User Profile Pill */}
          {currentUser && (
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-gold-500/30 text-xs text-gold-300">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-bold max-w-[110px] sm:max-w-[140px] truncate">{currentUser.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gold-500/20 rounded font-semibold text-gold-400">
                  {currentUser.role === 'admin' ? 'ॲडमिन' : 'मित्र'}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="लॉगआउट करा"
                  className="p-1.5 rounded-lg bg-navy-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-navy-750 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* 60-Day Progress Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-750 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-slate-300 font-medium">दिवस:</span>
            <span className="text-white font-bold">{totalPublished}</span>
            <span className="text-slate-400">/ ६०</span>
          </div>

          {/* 24/7 Engine Status */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">24/7 Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
