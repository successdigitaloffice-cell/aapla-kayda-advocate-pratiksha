import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/api.js';
import { initDatabase } from './db/database.js';
import { createDatabaseBackup } from './services/backupService.js';
import { init24HourCronScheduler } from './services/dailyAnalysisCron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Initialize Database & Tables
initDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api', apiRouter);

// Static frontend serving with aggressive no-cache on HTML to prevent stale tabs
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Fallback handler for client routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(indexPath);
  }
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>Aapla Kayda AI API</title></head>
      <body style="font-family:sans-serif;padding:40px;background:#0b132b;color:#fff;">
        <h2>आपला कायदा – Advocate Pratiksha Backend API is Running!</h2>
        <p>Access the API at <code>/api/health</code></p>
      </body>
    </html>
  `);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Automated scheduled backup runner (Runs every 12 hours)
setInterval(() => {
  try {
    console.log('[AutoBackup] Triggering automated database backup...');
    createDatabaseBackup('Automated');
  } catch (err) {
    console.error('[AutoBackup] Error during automated backup:', err.message);
  }
}, 12 * 60 * 60 * 1000);

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AAPLA KAYDA AI LEGAL SYSTEM BACKEND RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏛️  Brand: आपला कायदा – Advocate Pratiksha`);
  console.log(`⏰ 24-Hour Automated Land Analysis Engine: ACTIVE`);
  console.log(`=======================================================`);

  // Initialize 24-hour continuous analysis scheduler
  init24HourCronScheduler();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[Shutdown] Gracefully closing server...');
  server.close(() => {
    console.log('[Shutdown] Server closed.');
    process.exit(0);
  });
});
