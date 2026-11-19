import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { getApiUrl, getActiveBackendUrl } from './utils/api.js';

// Universal API routing: on GitHub Pages, automatically route API and Uploads to the live Cloudflare backend
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const isHosted = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('vercel.app')
  );

  if (isHosted) {
    const liveBackend = getActiveBackendUrl();
    if (typeof input === 'string') {
      if (input.startsWith('/api') || input.startsWith('/uploads') || input.startsWith('/video-api')) {
        input = `${liveBackend}${input}`;
      }
    } else if (input && typeof input.url === 'string') {
      if (input.url.startsWith('/api') || input.url.startsWith('/uploads') || input.url.startsWith('/video-api')) {
        input = new Request(`${liveBackend}${input.url}`, input);
      }
    }
  }
  return originalFetch.call(this, input, init);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
