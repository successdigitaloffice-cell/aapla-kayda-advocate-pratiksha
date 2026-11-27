import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { useVideoTracking } from '../context/VideoTrackingContext';

/**
 * Reusable Manual Video Tracking Checkbox (Feature 1)
 * Label: ☑ यावर व्हिडिओ बनवलेला आहे (Video Created)
 * 100% manual toggle, persistent in Database/LocalStorage, globally synchronized across all views.
 */
export default function VideoCreatedCheckbox({ item, onNotify, compact = false, className = '' }) {
  const { isVideoCreated, toggleVideoCreated } = useVideoTracking();
  const checked = isVideoCreated(item);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleVideoCreated(item, onNotify);
  };

  return (
    <div
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl cursor-pointer select-none transition-all duration-200 border ${
        checked
          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10 hover:border-emerald-400'
          : 'bg-navy-900/80 border-navy-700/80 text-slate-300 hover:border-gold-500/50 hover:text-white'
      } ${className}`}
      title={checked ? 'या कंटेंटवर व्हिडिओ बनवलेला आहे (क्लिक करून Untick करू शकता)' : 'व्हिडिओ बनवल्यानंतर येथे क्लिक करून खूण करा'}
    >
      {/* Custom styled checkbox box */}
      <div
        className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
          checked
            ? 'bg-emerald-500 text-navy-950 font-black shadow-sm'
            : 'border border-slate-500 bg-navy-950/80 group-hover:border-gold-400'
        }`}
      >
        {checked && <Check className="w-3 h-3 stroke-[3]" />}
      </div>

      {/* Label specified in prompt */}
      <div className="flex items-center space-x-1.5">
        <span className={`text-[11px] sm:text-xs font-bold leading-tight ${checked ? 'text-emerald-300' : 'text-slate-300'}`}>
          यावर व्हिडिओ बनवलेला आहे
        </span>
        <span className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:inline">
          (Video Created)
        </span>
      </div>

      {/* Subtle Completed Status Badge if checked */}
      {checked && (
        <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center space-x-0.5">
          <CheckCircle2 className="w-2.5 h-2.5" />
          <span>पूर्ण</span>
        </span>
      )}
    </div>
  );
}
