// Centralized API Base configuration
// When hosted on GitHub Pages or custom domain, route API calls to the live Cloudflare HTTPS backend
export const LIVE_BACKEND_URL = 'https://geography-cartoons-soon-incentives.trycloudflare.com';

export function getApiUrl(path) {
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  if (isGitHubPages) {
    return `${LIVE_BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
}

export async function apiFetch(path, options = {}) {
  const url = getApiUrl(path);
  return fetch(url, options);
}
