import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Universal API routing: on GitHub Pages, automatically route API and Uploads to the live Cloudflare backend
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  if (typeof input === 'string') {
    if (window.location.hostname.includes('github.io') || window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vercel.app')) {
      const liveBackend = window.__AK_BACKEND_URL__ || 'https://powers-segments-measurements-lenders.trycloudflare.com';
      if (input.startsWith('/api') || input.startsWith('/uploads')) {
        input = `${liveBackend}${input}`;
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
