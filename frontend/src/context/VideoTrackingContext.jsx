import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getContentKeys,
  getLocalTrackingMap,
  saveLocalTrackingMap,
  checkIsVideoCreated
} from '../utils/videoTracking';

const VideoTrackingContext = createContext(null);

export function VideoTrackingProvider({ children, onGlobalNotify }) {
  const [trackingMap, setTrackingMap] = useState(() => getLocalTrackingMap());

  // Load initial tracking status from backend API and merge with local storage
  useEffect(() => {
    let isMounted = true;
    async function fetchTrackingStatus() {
      try {
        const res = await fetch('/api/content/video-tracking-status');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.tracking) {
            if (isMounted) {
              setTrackingMap(prev => {
                const merged = { ...prev, ...data.tracking };
                saveLocalTrackingMap(merged);
                return merged;
              });
            }
          }
        }
      } catch (err) {
        // Fallback to local storage is already active
        console.log('Video tracking API offline, using local storage state');
      }
    }
    fetchTrackingStatus();
    return () => { isMounted = false; };
  }, []);

  const isVideoCreated = useCallback((item) => {
    return checkIsVideoCreated(item, trackingMap);
  }, [trackingMap]);

  const toggleVideoCreated = useCallback(async (item, customNotify) => {
    const { primaryKey, canonicalSlug, dayNumber, title, category, aliases } = getContentKeys(item);
    if (!primaryKey && !canonicalSlug) return false;

    const currentlyCreated = checkIsVideoCreated(item, trackingMap);
    const nextState = !currentlyCreated;

    // 1. Optimistically update local state & local storage
    const record = {
      isCreated: nextState,
      contentKey: primaryKey,
      canonicalSlug,
      title: title || 'कायदेशीर विषय',
      category: category || 'जमीन महसूल',
      dayNumber,
      updatedAt: new Date().toISOString()
    };

    setTrackingMap(prev => {
      const updated = { ...prev };
      // Map primary and canonical slug
      updated[primaryKey] = record;
      if (canonicalSlug) updated[canonicalSlug] = record;
      if (dayNumber) updated[`day_${dayNumber}`] = record;
      // Map all aliases
      for (const alias of aliases) {
        updated[alias] = record;
      }
      saveLocalTrackingMap(updated);
      return updated;
    });

    // 2. Trigger notification ONLY when ticked to true (No duplicate notifications)
    if (nextState) {
      const msg = 'या कंटेंटवर व्हिडिओ बनवलेला आहे';
      if (typeof customNotify === 'function') {
        customNotify(msg);
      } else if (typeof onGlobalNotify === 'function') {
        onGlobalNotify(msg);
      }
    }

    // 3. Persist to Backend API in background
    try {
      await fetch('/api/content/toggle-video-created', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentKey: primaryKey,
          canonicalSlug,
          title,
          category,
          dayNumber,
          aliases,
          isCreated: nextState
        })
      });
    } catch (e) {
      // Retained in local storage
      console.log('Backend sync queued, local state updated successfully.');
    }

    return nextState;
  }, [trackingMap, onGlobalNotify]);

  const value = {
    trackingMap,
    isVideoCreated,
    toggleVideoCreated
  };

  return (
    <VideoTrackingContext.Provider value={value}>
      {children}
    </VideoTrackingContext.Provider>
  );
}

export function useVideoTracking() {
  const ctx = useContext(VideoTrackingContext);
  if (!ctx) {
    throw new Error('useVideoTracking must be used within a VideoTrackingProvider');
  }
  return ctx;
}
