/**
 * 24/7 Watchdog Supervisor for Aapla Kayda AI System & Host Tunnel
 * Ensures:
 * 1. Node.js Backend (Port 5050) is continuously active.
 * 2. Python Video Generator (Port 5055) is continuously active.
 * 3. Cloudflare Tunnel Host is continuously connected with public link updated.
 * 4. Automatic recovery and silent restart on PC boot/reboot.
 * 5. ZERO interference with Port 5000 or Share Market project.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LOGS_DIR = path.join(ROOT_DIR, 'logs');
const WATCHDOG_PID = path.join(DATA_DIR, 'watchdog.pid');

process.on('uncaughtException', (err) => {
  console.error('[Watchdog] Uncaught Exception:', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Watchdog] Unhandled Rejection:', reason?.message || reason);
});

[DATA_DIR, LOGS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
  }
});

function isPidAlive(pid) {
  if (!pid) return false;
  try {
    const list = execSync(`tasklist /FI "PID eq ${pid}" /NH`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
    return list.includes(String(pid));
  } catch (_) {
    return false;
  }
}

// Stale PID cleanup from previous reboot
if (fs.existsSync(WATCHDOG_PID)) {
  try {
    const oldPid = parseInt(fs.readFileSync(WATCHDOG_PID, 'utf8').trim(), 10);
    if (oldPid && oldPid !== process.pid && isPidAlive(oldPid)) {
      console.log(`[Watchdog] Another Watchdog instance is already running (PID ${oldPid}). Exiting duplicate.`);
      process.exit(0);
    }
  } catch (_) {}
}

try {
  fs.writeFileSync(WATCHDOG_PID, String(process.pid), 'utf8');
} catch (_) {}

function removeWatchdogLock() {
  try {
    if (fs.existsSync(WATCHDOG_PID)) {
      const pidInFile = parseInt(fs.readFileSync(WATCHDOG_PID, 'utf8').trim(), 10);
      if (pidInFile === process.pid) fs.unlinkSync(WATCHDOG_PID);
    }
  } catch (_) {}
}
process.on('exit', removeWatchdogLock);

function createLogStream(filename) {
  const logFile = path.join(LOGS_DIR, filename);
  return fs.createWriteStream(logFile, { flags: 'a' });
}

let backendProcess = null;
let videoProcess = null;
let tunnelProcess = null;
let isShuttingDown = false;

async function checkPortOnline(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(2000) });
    return res.status < 500;
  } catch (_) {
    return false;
  }
}

async function waitForInternet(maxRetries = 20) {
  console.log('[Watchdog] Checking network connectivity on boot...');
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        console.log(`[Watchdog] Internet connection confirmed (Attempt ${i}).`);
        return true;
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('[Watchdog] Internet check timed out. Proceeding with best-effort initialization.');
  return false;
}

function startBackend() {
  if (isShuttingDown || backendProcess) return;
  console.log('[Watchdog] Launching Aapla Kayda Backend on Port 5050...');
  const serverJs = path.join(ROOT_DIR, 'backend', 'src', 'server.js');
  const logStream = createLogStream('backend.log');

  backendProcess = spawn('node', [serverJs], {
    cwd: path.join(ROOT_DIR, 'backend'),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });

  backendProcess.stdout?.pipe(logStream);
  backendProcess.stderr?.pipe(logStream);

  backendProcess.on('exit', (code) => {
    console.log(`[Watchdog] Backend process exited with code ${code}.`);
    backendProcess = null;
  });
}

function startVideoGenerator() {
  if (isShuttingDown || videoProcess) return;
  console.log('[Watchdog] Launching Python Video Generator on Port 5055...');
  const serverPy = path.join(ROOT_DIR, 'instagram_video_generator', 'server.py');
  const logStream = createLogStream('video_generator.log');

  videoProcess = spawn('python', [serverPy], {
    cwd: path.join(ROOT_DIR, 'instagram_video_generator'),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });

  videoProcess.stdout?.pipe(logStream);
  videoProcess.stderr?.pipe(logStream);

  videoProcess.on('exit', (code) => {
    console.log(`[Watchdog] Video generator exited with code ${code}.`);
    videoProcess = null;
  });
}

function startTunnel() {
  if (isShuttingDown || tunnelProcess) return;
  console.log('[Watchdog] Launching Cloudflare Tunnel Host...');
  const tunnelJs = path.join(__dirname, 'host_tunnel.js');
  const logStream = createLogStream('tunnel.log');

  tunnelProcess = spawn('node', [tunnelJs], {
    cwd: ROOT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });

  tunnelProcess.stdout?.pipe(logStream);
  tunnelProcess.stderr?.pipe(logStream);

  tunnelProcess.on('exit', (code) => {
    console.log(`[Watchdog] Tunnel process exited with code ${code}.`);
    tunnelProcess = null;
  });
}

async function supervise() {
  if (isShuttingDown) return;

  // 1. Check Port 5050 (Backend)
  const is5050Up = await checkPortOnline(5050);
  if (!is5050Up && !backendProcess) {
    console.log('[Watchdog] Port 5050 is not responding. Starting Backend...');
    startBackend();
  }

  // 2. Check Port 5055 (Video Studio)
  const is5055Up = await checkPortOnline(5055);
  if (!is5055Up && !videoProcess) {
    console.log('[Watchdog] Port 5055 is not responding. Starting Video Studio...');
    startVideoGenerator();
  }

  // 3. Check Tunnel
  if (!tunnelProcess) {
    console.log('[Watchdog] Tunnel process missing. Starting Cloudflare Tunnel...');
    startTunnel();
  }
}

async function init() {
  // 1. Initial boot: start local servers first
  startBackend();
  startVideoGenerator();

  // 2. Wait for internet connectivity (important after cold reboot)
  await waitForInternet(10);

  // 3. Start Cloudflare Tunnel
  startTunnel();

  // 4. Continual supervision every 8 seconds
  setInterval(supervise, 8000);
  console.log('[Watchdog] 24/7 Watchdog initialized. Monitoring all services.');
}

init();

function shutdown() {
  isShuttingDown = true;
  console.log('[Watchdog] Clean shutdown requested. Stopping child processes...');
  if (backendProcess) { try { backendProcess.kill(); } catch (_) {} }
  if (videoProcess) { try { videoProcess.kill(); } catch (_) {} }
  if (tunnelProcess) { try { tunnelProcess.kill(); } catch (_) {} }
  removeWatchdogLock();
  console.log('[Watchdog] All services safely stopped.');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
