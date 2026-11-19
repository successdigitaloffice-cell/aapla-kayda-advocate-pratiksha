// Centralized API Base configuration
// When hosted on GitHub Pages or custom domain, route API calls to the live Cloudflare HTTPS backend
export const DEFAULT_LIVE_BACKEND_URL = 'https://reasonable-notified-expressions-britain.trycloudflare.com';

export function getActiveBackendUrl() {
  if (typeof window === 'undefined') return DEFAULT_LIVE_BACKEND_URL;
  return (
    localStorage.getItem('AK_CUSTOM_BACKEND_URL') ||
    window.__AK_BACKEND_URL__ ||
    DEFAULT_LIVE_BACKEND_URL
  );
}

export function setCustomBackendUrl(url) {
  if (!url || typeof window === 'undefined') return;
  const cleanUrl = url.trim().replace(/\/$/, '');
  localStorage.setItem('AK_CUSTOM_BACKEND_URL', cleanUrl);
  window.__AK_BACKEND_URL__ = cleanUrl;
}

export function resetBackendUrl() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('AK_CUSTOM_BACKEND_URL');
  window.__AK_BACKEND_URL__ = DEFAULT_LIVE_BACKEND_URL;
}

// Auto-discovery of latest tunnel URL on GitHub Pages
if (typeof window !== 'undefined') {
  const isHosted =
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('vercel.app');

  if (isHosted && !localStorage.getItem('AK_CUSTOM_BACKEND_URL')) {
    // Attempt to discover latest tunnel endpoint from repository manifest
    const manifestUrls = [
      './tunnel_info.json',
      'https://raw.githubusercontent.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha/main/data/tunnel_info.json'
    ];

    (async () => {
      for (const manifestUrl of manifestUrls) {
        try {
          const res = await window.fetch(manifestUrl, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            const liveUrl = (data.cloudflareUrl || data.url || '').trim().replace(/\/$/, '');
            if (liveUrl && liveUrl.startsWith('https://')) {
              window.__AK_BACKEND_URL__ = liveUrl;
              console.log('[API] Auto-discovered live Cloudflare backend:', liveUrl);
              break;
            }
          }
        } catch (_) {}
      }
    })();
  }
}

export function getApiUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  const isHosted =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') ||
      window.location.hostname.includes('netlify.app') ||
      window.location.hostname.includes('vercel.app'));

  if (isHosted) {
    const backend = getActiveBackendUrl().replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${backend}${cleanPath}`;
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
    const res = await window.fetch(fullUrl);
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
  return window.fetch(url, options);
}

// Global fetch interceptor so ANY relative /api/ fetch in the app
// automatically routes to the live backend when on GitHub Pages
if (typeof window !== 'undefined' && !window.__AK_FETCH_INTERCEPTED__) {
  window.__AK_FETCH_INTERCEPTED__ = true;
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string') {
      if (input.startsWith('/api/') || input.startsWith('api/')) {
        input = getApiUrl(input);
      }
    } else if (
      input &&
      typeof input === 'object' &&
      typeof input.url === 'string' &&
      (input.url.startsWith('/api/') || input.url.startsWith('api/'))
    ) {
      try {
        input = new Request(getApiUrl(input.url), input);
      } catch (_) {}
    }
    return originalFetch.call(this, input, init);
  };
}
