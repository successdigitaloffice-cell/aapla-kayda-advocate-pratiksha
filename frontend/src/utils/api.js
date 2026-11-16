// Centralized API Base configuration
// When hosted on GitHub Pages or custom domain, route API calls to the live Cloudflare HTTPS backend
export const LIVE_BACKEND_URL = 'https://powers-segments-measurements-lenders.trycloudflare.com';

export function getApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const isGitHubPages = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('vercel.app')
  );
  if (isGitHubPages) {
    const backend = (typeof window !== 'undefined' && window.__AK_BACKEND_URL__) || LIVE_BACKEND_URL;
    return `${backend}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
}

export function resolveMediaUrl(path) {
  return getApiUrl(path);
}

export async function downloadFileFromUrl(url, defaultFilename = 'Advocate_Pratiksha_Reel.mp4') {
  if (!url) return;
  const fullUrl = resolveMediaUrl(url);
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
  } catch (e) {
    // Direct open fallback if blob download encounters network/CORS issues
    window.open(fullUrl, '_blank');
  }
}

export async function apiFetch(path, options = {}) {
  const url = getApiUrl(path);
  return fetch(url, options);
}
