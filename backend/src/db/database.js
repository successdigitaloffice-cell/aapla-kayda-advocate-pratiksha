import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'aapla_kayda.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency & integrity
db.exec(`PRAGMA journal_mode = WAL;`);
db.exec(`PRAGMA foreign_keys = ON;`);

export function initDatabase() {
  console.log(`[DB] Initializing SQLite Database at: ${dbPath}`);

  // 1. Reels / Content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reels (
      id TEXT PRIMARY KEY,
      day_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subtopic TEXT,
      legal_question TEXT NOT NULL,
      applicable_law TEXT NOT NULL,
      applicable_section TEXT,
      hook TEXT NOT NULL,
      script_format_a TEXT NOT NULL,
      script_format_b TEXT NOT NULL,
      legal_takeaway TEXT NOT NULL,
      actionable_step TEXT NOT NULL,
      call_to_action TEXT NOT NULL,
      caption TEXT NOT NULL,
      keywords TEXT,
      hashtags TEXT,
      on_screen_text TEXT,
      official_sources TEXT, -- JSON array
      verification_status TEXT DEFAULT 'Verified',
      verification_notes TEXT,
      target_audience TEXT,
      selection_reason TEXT,
      status TEXT DEFAULT 'New', -- New, Researching, Verification Required, Verified, Ready to Record, Recorded, Published, Rejected
      published_url TEXT,
      published_date TEXT,
      recording_date TEXT,
      views INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      avg_watch_time REAL DEFAULT 0.0,
      likes INTEGER DEFAULT 0,
      sends INTEGER DEFAULT 0,
      saves INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      profile_visits INTEGER DEFAULT 0,
      follows_attributed INTEGER DEFAULT 0,
      non_follower_reach INTEGER DEFAULT 0,
      cover_text TEXT,
      pinned_comment TEXT,
      share_prompt TEXT,
      recommended_posting_time TEXT,
      trend_score INTEGER DEFAULT 85,
      algorithm_insights TEXT, -- JSON
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrate existing tables if missing new columns
  migrateTableColumns();

  // 2. Daily Trends table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      topic_name TEXT NOT NULL,
      category TEXT NOT NULL,
      why_important_today TEXT NOT NULL,
      search_signals TEXT,
      maharashtra_relevance TEXT,
      target_audience TEXT,
      viral_potential TEXT DEFAULT 'Medium', -- Low, Medium, High
      trend_evidence TEXT,
      primary_legal_sources TEXT,
      similarity_with_past TEXT,
      selection_rank INTEGER DEFAULT 0, -- 1: Best Today, 2-3: Top 3, 4+: Evaluated
      is_evergreen INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Evaluated', -- Evaluated, Selected, Rejected
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Legal References Repository
  db.exec(`
    CREATE TABLE IF NOT EXISTS legal_references (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_name TEXT NOT NULL,
      act_title TEXT NOT NULL,
      category TEXT NOT NULL,
      section_or_rule TEXT NOT NULL,
      key_provision TEXT NOT NULL,
      practical_marathi_explanation TEXT NOT NULL,
      official_url TEXT NOT NULL,
      last_verified_date TEXT NOT NULL,
      is_amended INTEGER DEFAULT 0,
      amendment_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Daily Reports Table (17-point Daily Audit)
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_date TEXT UNIQUE NOT NULL,
      content_json TEXT NOT NULL,
      markdown_text TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. System Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Audit Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Backups
  db.exec(`
    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      backup_type TEXT DEFAULT 'Manual',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Multi-User Authentication & Friend Access (Phase 4)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'friend',
      is_active INTEGER DEFAULT 1,
      invited_by TEXT,
      invitation_code TEXT,
      videos_generated_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT
    );
  `);

  // 9. Admin Invitations for Friends
  db.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      code TEXT PRIMARY KEY,
      created_by TEXT NOT NULL,
      recipient_name TEXT,
      recipient_email TEXT,
      max_uses INTEGER DEFAULT 5,
      used_count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      expires_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. User Workspace Projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      category TEXT,
      script_data TEXT,
      status TEXT DEFAULT 'draft',
      video_folder TEXT,
      video_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default settings and initial admin account
  seedDefaultSettings();
  seedInitialAdmin();
}

function seedInitialAdmin() {
  const checkAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (!checkAdmin) {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, is_active, created_at)
      VALUES (?, ?, ?, ?, 'admin', 1, CURRENT_TIMESTAMP)
    `).run(
      'admin_pratiksha',
      'Advocate Pratiksha (Admin)',
      'advocate.pratiksha.legal@gmail.com',
      'pratiksha@2026'
    );
    console.log('[DB] Seeded initial Admin user: advocate.pratiksha.legal@gmail.com');
  }

  // Seed default VIP friend invitation code
  const checkInvite = db.prepare("SELECT code FROM invitations WHERE code = 'PRATIKSHA-VIP-2026'").get();
  if (!checkInvite) {
    db.prepare(`
      INSERT INTO invitations (code, created_by, recipient_name, max_uses, is_active)
      VALUES ('PRATIKSHA-VIP-2026', 'admin_pratiksha', 'VIP Friends Access', 50, 1)
    `).run();
    console.log('[DB] Seeded default invitation code: PRATIKSHA-VIP-2026');
  }
}

function seedDefaultSettings() {
  const defaults = [
    ['brand_name', 'आपला कायदा – Advocate Pratiksha'],
    ['target_followers', '100000'],
    ['total_reels_goal', '60'],
    ['daily_research_time', '09:00 AM'],
    ['posting_slots', JSON.stringify(['12:30 PM', '07:00 PM', '08:30 PM'])],
    ['current_calendar_day', '8'],
    ['auto_backup_enabled', 'true'],
    ['pin_auth_enabled', 'false'],
    ['security_pin', '1234'],
    ['api_meta_status', 'Configured (OAuth Ready)'],
    ['api_trends_status', 'Active (Maharashtra Region Search)']
  ];

  const checkStmt = db.prepare('SELECT key FROM system_settings WHERE key = ?');
  const insertStmt = db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)');

  for (const [key, value] of defaults) {
    const existing = checkStmt.get(key);
    if (!existing) {
      insertStmt.run(key, value);
    }
  }
}

function migrateTableColumns() {
  const getColumns = (tableName) => {
    try {
      const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
      return new Set(rows.map(r => r.name));
    } catch {
      return new Set();
    }
  };

  const reelCols = getColumns('reels');
  const reelNewCols = [
    ['cover_text', 'TEXT'],
    ['pinned_comment', 'TEXT'],
    ['share_prompt', 'TEXT'],
    ['recommended_posting_time', 'TEXT'],
    ['trend_score', 'INTEGER DEFAULT 85'],
    ['algorithm_insights', 'TEXT']
  ];
  for (const [col, type] of reelNewCols) {
    if (reelCols.size > 0 && !reelCols.has(col)) {
      try { db.exec(`ALTER TABLE reels ADD COLUMN ${col} ${type};`); } catch (e) {}
    }
  }

  const trendCols = getColumns('daily_trends');
  const trendNewCols = [
    ['trend_score', 'INTEGER DEFAULT 85'],
    ['score_breakdown', 'TEXT'],
    ['competition_saturation', 'TEXT'],
    ['real_life_scenario', 'TEXT']
  ];
  for (const [col, type] of trendNewCols) {
    if (trendCols.size > 0 && !trendCols.has(col)) {
      try { db.exec(`ALTER TABLE daily_trends ADD COLUMN ${col} ${type};`); } catch (e) {}
    }
  }
}

export default db;
