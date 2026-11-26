const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

process.on('uncaughtException', (err) => {
  console.error('[AaplaKaydaTunnel] Trapped Uncaught Exception:', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[AaplaKaydaTunnel] Trapped Unhandled Rejection:', reason?.message || reason);
});

// Dedicated Port for Aapla Kayda (Zero conflict with Port 5000)
const PORT = parseInt(process.env.PORT, 10) || 5050;
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CLOUDFLARED_BIN = path.join(ROOT_DIR, 'bin', 'cloudflared.exe');
const TUNNEL_FILE = path.join(DATA_DIR, 'tunnel_info.json');
const TUNNEL_TXT = path.join(ROOT_DIR, 'PUBLIC_HOST_URL.txt');
const CF_TXT = path.join(ROOT_DIR, 'CLOUDFLARE_URL.txt');
const LOCK_FILE = path.join(DATA_DIR, 'tunnel.pid');
const DESKTOP_DIR = path.join(process.env.USERPROFILE || 'C:\\Users\\user', 'Desktop');

let activeCloudflareUrl = '';
let cachedPublicIp = '127.0.0.1';

if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (_) {}
}

async function fetchPublicIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3500) });
    const data = await res.json();
    if (data && data.ip) {
      cachedPublicIp = data.ip;
      return cachedPublicIp;
    }
  } catch (_) {}
  return cachedPublicIp;
}

function isPidAlive(pid) {
  if (!pid) return false;
  try {
    const list = execSync(`tasklist /FI "PID eq ${pid}" /NH`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
    return list.includes(String(pid));
  } catch (_) {
    return false;
  }
}

// Single-instance mutex for Aapla Kayda tunnel
if (fs.existsSync(LOCK_FILE)) {
  try {
    const existingPid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
    if (existingPid && existingPid !== process.pid && isPidAlive(existingPid)) {
      console.log(`[AaplaKaydaTunnel] Another Aapla Kayda Tunnel process is already active (PID ${existingPid}). Exiting duplicate.`);
      process.exit(0);
    }
  } catch (_) {}
}
try {
  fs.writeFileSync(LOCK_FILE, String(process.pid), 'utf8');
} catch (_) {}

function removeLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const pidInFile = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (pidInFile === process.pid) fs.unlinkSync(LOCK_FILE);
    }
  } catch (_) {}
}
process.on('exit', removeLock);

function updateDesktopShortcuts(url) {
  try {
    const primaryUrl = url || `http://localhost:${PORT}`;

    // 1. Desktop URL shortcut specifically for Aapla Kayda AI Studio (Never overwrites Market bot)
    if (fs.existsSync(DESKTOP_DIR)) {
      const mobileShortcutPath = path.join(DESKTOP_DIR, 'AAPLA KAYDA AI STUDIO.url');
      const shortcutContent = `[InternetShortcut]\nURL=${primaryUrl}\nIconIndex=0\n`;
      fs.writeFileSync(mobileShortcutPath, shortcutContent, 'utf8');
    }

    // 2. Permanent Launcher HTML portal (Mobile QR code, 1-Click Access)
    const portalHtml = `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <title>⚖️ आपला कायदा – Advocate Pratiksha (Live Mobile Host)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Mukta', 'Outfit', sans-serif;
      background: radial-gradient(circle at 50% 10%, #1e1b4b 0%, #030712 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 20px;
      padding: 2.2rem;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 25px rgba(212, 175, 55, 0.2);
      text-align: center;
      backdrop-filter: blur(12px);
    }
    .badge-gold {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37, #f59e0b);
      color: #000;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 1.65rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.25rem;
    }
    .gold-text { color: #d4af37; }
    p {
      color: #94a3b8;
      font-size: 0.92rem;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }
    .qr-wrap {
      background: #ffffff;
      padding: 12px;
      border-radius: 14px;
      display: inline-block;
      margin: 0.75rem auto 1.25rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .qr-wrap img { display: block; width: 170px; height: 170px; }
    .btn-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.25rem; }
    .btn-primary {
      display: block;
      background: linear-gradient(135deg, #d4af37, #b45309);
      color: #000;
      padding: 14px 20px;
      border-radius: 12px;
      font-weight: 800;
      text-decoration: none;
      font-size: 1.05rem;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
      transition: transform 0.15s;
    }
    .btn-primary:hover { transform: translateY(-2px); }
    .btn-video {
      display: block;
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      color: #fff;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.98rem;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
      transition: transform 0.15s;
    }
    .btn-video:hover { transform: translateY(-2px); }
    .btn-alt {
      display: block;
      background: #1e293b;
      color: #cbd5e1;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.88rem;
      border: 1px solid #334155;
    }
    .info-box {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px;
      text-align: left;
      font-size: 0.82rem;
      color: #94a3b8;
      line-height: 1.6;
    }
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      margin-right: 6px;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge-gold">⚖️ आपला कायदा – थेट मोबाईल ॲक्सेस</span>
    <h1>आपला कायदा <span class="gold-text">– Advocate Pratiksha</span></h1>
    <p>मोबाईल किंवा संगणकावरून 4G/5G वर थेट उघडण्यासाठी खालील लिंक किंवा QR कोड स्कॅन करा:</p>

    <div class="qr-wrap">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(primaryUrl)}" alt="Scan QR for Mobile Access" />
    </div>

    <div class="btn-group">
      <a class="btn-primary" href="${primaryUrl}" target="_blank">
        🚀 थेट डॅशबोर्ड उघडा (Main AI Growth Dashboard)
      </a>
      <a class="btn-video" href="${primaryUrl}/studio" target="_blank">
        🎬 डायरेक्ट Instagram व्हिडिओ स्टुडिओ (Reel Generator Studio)
      </a>
      <a class="btn-alt" href="http://localhost:5050" target="_blank">
        💻 लोकल PC लिंक (http://localhost:5050)
      </a>
    </div>

    <div class="info-box">
      <div><span class="status-dot"></span> <strong>होस्ट स्थिती:</strong> स्वतंत्र Cloudflare हाय-स्पीड टनेल सक्रिय</div>
      <div>🔒 <strong>पोर्ट्स:</strong> Dashboard (5050) | Video Studio (5055) | मार्केट बॉटशी शून्य वाद</div>
      <div>📱 <strong>टीप:</strong> ही लिंक तुमच्या मोबाईलवर सेव्ह करून तुम्ही कधीही Reels तयार करू शकता.</div>
    </div>
  </div>
</body>
</html>`;

    // Write to root
    fs.writeFileSync(path.join(ROOT_DIR, 'AAPLA_KAYDA_PORTAL_PERMANENT.html'), portalHtml, 'utf8');

    // Write to Desktop (Dedicated file for Aapla Kayda)
    if (fs.existsSync(DESKTOP_DIR)) {
      fs.writeFileSync(path.join(DESKTOP_DIR, 'AAPLA_KAYDA_PORTAL_PERMANENT.html'), portalHtml, 'utf8');
    }
  } catch (err) {
    console.error('[AaplaKaydaTunnel] Failed to update desktop shortcuts:', err.message);
  }
}

function updateTunnelStatus() {
  try {
    const primaryUrl = activeCloudflareUrl || `http://localhost:${PORT}`;
    const info = {
      status: 'connected',
      name: 'Aapla Kayda AI Legal & Video Studio',
      port: PORT,
      videoPort: 5055,
      url: primaryUrl,
      cloudflareUrl: activeCloudflareUrl || null,
      publicIp: cachedPublicIp,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(TUNNEL_FILE, JSON.stringify(info, null, 2), 'utf8');
    fs.writeFileSync(TUNNEL_TXT, primaryUrl, 'utf8');
    if (activeCloudflareUrl) fs.writeFileSync(CF_TXT, activeCloudflareUrl, 'utf8');

    // Also write to docs/tunnel_info.json so GitHub Pages can discover it directly
    const docsDir = path.join(ROOT_DIR, 'docs');
    if (fs.existsSync(docsDir)) {
      fs.writeFileSync(path.join(docsDir, 'tunnel_info.json'), JSON.stringify(info, null, 2), 'utf8');
    }

    // Keep frontend/src/utils/api.js updated with activeCloudflareUrl if present
    if (activeCloudflareUrl) {
      const apiJsPath = path.join(ROOT_DIR, 'frontend', 'src', 'utils', 'api.js');
      if (fs.existsSync(apiJsPath)) {
        let content = fs.readFileSync(apiJsPath, 'utf8');
        content = content.replace(/DEFAULT_LIVE_BACKEND_URL\s*=\s*['"][^'"]+['"]/, `DEFAULT_LIVE_BACKEND_URL = '${activeCloudflareUrl}'`);
        fs.writeFileSync(apiJsPath, content, 'utf8');
      }
    }

    updateDesktopShortcuts(primaryUrl);

    // Auto-sync tunnel URL to GitHub repository so GitHub Pages never goes out of sync
    if (activeCloudflareUrl) {
      setTimeout(() => {
        try {
          execSync('git add data/tunnel_info.json docs/tunnel_info.json CLOUDFLARE_URL.txt PUBLIC_HOST_URL.txt AAPLA_KAYDA_PORTAL_PERMANENT.html', { cwd: ROOT_DIR, stdio: 'ignore', windowsHide: true });
          execSync(`git commit -m "chore: Sync active live Cloudflare tunnel ${activeCloudflareUrl}"`, { cwd: ROOT_DIR, stdio: 'ignore', windowsHide: true });
          execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'ignore', windowsHide: true });
          console.log('[AaplaKaydaTunnel] Live tunnel successfully pushed to GitHub Pages!');
        } catch (_) {}
      }, 1500);
    }
  } catch (e) {
    console.error('[AaplaKaydaTunnel] Error updating tunnel status:', e.message);
  }
}

let cloudflareChild = null;
let isShuttingDown = false;
let cfReconnectTimer = null;
let cfBackoffMs = 5000;

function startCloudflareTunnel() {
  if (isShuttingDown) return;
  if (!fs.existsSync(CLOUDFLARED_BIN)) {
    console.error(`[AaplaKaydaTunnel] cloudflared binary not found at: ${CLOUDFLARED_BIN}`);
    return;
  }

  console.log(`[AaplaKaydaTunnel] Launching Cloudflare Tunnel for Port ${PORT}...`);
  try {
    cloudflareChild = spawn(CLOUDFLARED_BIN, ['tunnel', '--url', `http://127.0.0.1:${PORT}`], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    });

    const urlRegex = /https:\/\/(?!api\.)[a-zA-Z0-9-]+\.trycloudflare\.com/;

    function handleData(chunk) {
      const text = chunk.toString();
      const match = text.match(urlRegex);
      if (match && match[0] && !match[0].includes('api.trycloudflare.com')) {
        const detectedUrl = match[0];
        if (detectedUrl !== activeCloudflareUrl) {
          activeCloudflareUrl = detectedUrl;
          cfBackoffMs = 5000;
          console.log('\n======================================================================');
          console.log('🎉 AAPLA KAYDA SEPARATE HOST IS LIVE!');
          console.log(`🌐 Public Tunnel URL: ${activeCloudflareUrl}`);
          console.log(`🎬 Direct Video Studio URL: ${activeCloudflareUrl}/studio`);
          console.log('======================================================================\n');
          updateTunnelStatus();
        }
      }
    }

    cloudflareChild.stdout.on('data', handleData);
    cloudflareChild.stderr.on('data', handleData);

    cloudflareChild.on('close', (code) => {
      console.log(`[AaplaKaydaTunnel] Cloudflare process exited with code ${code}.`);
      cloudflareChild = null;
      if (!isShuttingDown) {
        console.log(`[AaplaKaydaTunnel] Reconnecting Cloudflare tunnel in ${cfBackoffMs / 1000}s...`);
        clearTimeout(cfReconnectTimer);
        cfReconnectTimer = setTimeout(startCloudflareTunnel, cfBackoffMs);
        cfBackoffMs = Math.min(cfBackoffMs * 1.5, 60000);
      }
    });

    cloudflareChild.on('error', (err) => {
      console.error('[AaplaKaydaTunnel] Cloudflare process spawn error:', err.message);
    });
  } catch (err) {
    console.error('[AaplaKaydaTunnel] Exception in startCloudflareTunnel:', err.message);
  }
}

function shutdown() {
  isShuttingDown = true;
  clearTimeout(cfReconnectTimer);
  if (cloudflareChild) {
    try { cloudflareChild.kill('SIGTERM'); } catch (_) {}
    cloudflareChild = null;
  }
  removeLock();
  console.log('[AaplaKaydaTunnel] Clean shutdown complete.');
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Initialize
fetchPublicIp().then(() => {
  startCloudflareTunnel();
  // Keep-alive heartbeat
  setInterval(() => {
    updateTunnelStatus();
  }, 30000);
});
