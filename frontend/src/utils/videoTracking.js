/**
 * Central Video Tracking Utility for "आपला कायदा – Advocate Pratiksha"
 * Provides canonical topic matching, local/cloud persistence, and synchronization.
 */

export function normalizeContentSlug(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[^\u0900-\u097F\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Extracts all matching keys and aliases for a topic/content item
 * to guarantee that Day 1, Day 3, 60-day roadmap, 90-day tracker, and daily trends synchronize.
 */
export function getContentKeys(item) {
  if (!item) return { primaryKey: '', canonicalSlug: '', aliases: [] };

  if (typeof item === 'string') {
    const slug = normalizeContentSlug(item);
    return { primaryKey: slug, canonicalSlug: slug, aliases: [slug, item] };
  }

  const title = (item.title || item.topic_name || item.name || '').trim();
  const canonicalSlug = normalizeContentSlug(title);
  const dayNum = item.day_number || item.dayNumber || item.day || null;
  const rawId = item.id ? String(item.id).trim() : null;
  const contentKey = item.content_key || item.contentKey || canonicalSlug || rawId;

  const aliases = [];
  if (canonicalSlug) aliases.push(canonicalSlug);
  if (rawId) aliases.push(rawId);
  if (dayNum) {
    aliases.push(`day_${dayNum}`);
    aliases.push(`reel_day_${dayNum}`);
    aliases.push(`target60_${dayNum}`);
  }
  if (contentKey && !aliases.includes(contentKey)) {
    aliases.push(contentKey);
  }

  return {
    primaryKey: contentKey,
    canonicalSlug,
    dayNumber: dayNum,
    title,
    category: item.category || 'जमीन महसूल',
    aliases
  };
}

const STORAGE_KEY = 'aapla_kayda_video_tracking';

export function getLocalTrackingMap() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading local video tracking:', e);
  }
  return {};
}

export function saveLocalTrackingMap(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Error saving local video tracking:', e);
  }
}

/**
 * Checks whether an item is marked as Video Created in the tracking map.
 */
export function checkIsVideoCreated(item, trackingMap = {}) {
  if (!item || !trackingMap) return false;
  const { primaryKey, canonicalSlug, aliases } = getContentKeys(item);

  // 1. Check primary key
  if (trackingMap[primaryKey]?.isCreated || trackingMap[primaryKey] === true) {
    return true;
  }

  // 2. Check canonical slug
  if (canonicalSlug && (trackingMap[canonicalSlug]?.isCreated || trackingMap[canonicalSlug] === true)) {
    return true;
  }

  // 3. Check any aliases
  for (const alias of aliases) {
    if (trackingMap[alias]?.isCreated || trackingMap[alias] === true) {
      return true;
    }
  }

  return false;
}
