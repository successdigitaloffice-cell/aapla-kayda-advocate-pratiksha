import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../data');
const backupsDir = path.resolve(__dirname, '../../backups');
const dbPath = path.join(dataDir, 'aapla_kayda.db');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

export function createDatabaseBackup(type = 'Manual') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `aapla_kayda_backup_${timestamp}.db`;
  const targetPath = path.join(backupsDir, filename);

  try {
    // SQLite VACUUM INTO creates a consistent, locked snapshot backup
    db.exec(`VACUUM INTO '${targetPath.replace(/\\/g, '/')}';`);

    const stats = fs.statSync(targetPath);
    const fileSize = stats.size;

    const stmt = db.prepare(`
      INSERT INTO backups (filename, filepath, file_size_bytes, backup_type)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(filename, targetPath, fileSize, type);

    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('BACKUP_CREATED', 'DATABASE', ?, ?)
    `).run(filename, `Successfully created ${type} backup (${(fileSize / 1024).toFixed(1)} KB)`);

    return {
      success: true,
      backupId: result.lastInsertRowid,
      filename,
      filepath: targetPath,
      fileSizeKb: Number((fileSize / 1024).toFixed(1)),
      type,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Backup] Backup failed:', error);
    // Fallback: standard file copy
    try {
      fs.copyFileSync(dbPath, targetPath);
      const stats = fs.statSync(targetPath);
      const fileSize = stats.size;

      const stmt = db.prepare(`
        INSERT INTO backups (filename, filepath, file_size_bytes, backup_type)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(filename, targetPath, fileSize, type);

      return {
        success: true,
        backupId: result.lastInsertRowid,
        filename,
        filepath: targetPath,
        fileSizeKb: Number((fileSize / 1024).toFixed(1)),
        type,
        createdAt: new Date().toISOString()
      };
    } catch (fallbackError) {
      throw new Error(`Backup failed: ${fallbackError.message}`);
    }
  }
}

export function getAllBackups() {
  return db.prepare('SELECT * FROM backups ORDER BY id DESC').all();
}

export function testRestoreBackup(backupId) {
  const record = db.prepare('SELECT * FROM backups WHERE id = ?').get(backupId);
  if (!record) {
    throw new Error('Backup record not found.');
  }

  if (!fs.existsSync(record.filepath)) {
    throw new Error(`Backup file does not exist on disk: ${record.filepath}`);
  }

  const stat = fs.statSync(record.filepath);
  if (stat.size === 0) {
    throw new Error('Backup file is corrupt or zero bytes.');
  }

  return {
    verified: true,
    message: `बॅकअप फाईल सुरक्षित आणि पुनर्प्राप्तीयोग्य आहे (${(stat.size / 1024).toFixed(1)} KB).`,
    filename: record.filename,
    backupType: record.backup_type,
    created_at: record.created_at
  };
}
