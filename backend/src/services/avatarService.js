import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const AVATARS_DIR = path.join(DATA_DIR, 'uploads', 'avatars');

if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

export function getAvatarsList() {
  if (!fs.existsSync(AVATARS_DIR)) return [];

  const defaultSetting = db.prepare("SELECT value FROM system_settings WHERE key = 'default_avatar_filename'").get();
  const defaultFilename = defaultSetting ? defaultSetting.value : null;

  const files = fs.readdirSync(AVATARS_DIR);
  const avatars = [];

  for (const file of files) {
    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      const filePath = path.join(AVATARS_DIR, file);
      const stats = fs.statSync(filePath);
      avatars.push({
        filename: file,
        url: `/uploads/avatars/${encodeURIComponent(file)}`,
        sizeBytes: stats.size,
        sizeKb: Math.round(stats.size / 1024),
        isDefault: file === defaultFilename,
        uploadedAt: stats.mtime.toISOString()
      });
    }
  }

  // Sort newest first
  avatars.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  
  // If no default explicitly set and we have at least one, make the first default
  if (avatars.length > 0 && !avatars.some(a => a.isDefault)) {
    avatars[0].isDefault = true;
    setDefaultAvatar(avatars[0].filename);
  }

  return avatars;
}

export function saveAvatarPhoto(base64Data, originalName = 'advocate_pratiksha.jpg') {
  if (!base64Data) {
    throw new Error('फोटो डेटा (Base64) आवश्यक आहे.');
  }

  // Clean data URL prefix if present
  let cleanBase64 = base64Data;
  let ext = 'jpg';
  const match = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (match) {
    ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    cleanBase64 = match[2];
  }

  const timestamp = Date.now();
  const safeBaseName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/\.[^/.]+$/, '');
  const filename = `pratiksha_avatar_${timestamp}_${safeBaseName}.${ext}`;
  const targetPath = path.join(AVATARS_DIR, filename);

  const buffer = Buffer.from(cleanBase64, 'base64');
  fs.writeFileSync(targetPath, buffer);

  // Set as default if it's the only one or requested
  const list = getAvatarsList();
  if (list.length === 1) {
    setDefaultAvatar(filename);
  }

  db.prepare(`
    INSERT INTO audit_logs (action, entity_type, entity_id, details)
    VALUES ('AVATAR_UPLOAD', 'PHOTO', ?, ?)
  `).run(filename, `Advocate Pratiksha नवीन फोटो अपलोड केला: ${filename} (${Math.round(buffer.length / 1024)} KB)`);

  return {
    filename,
    url: `/uploads/avatars/${encodeURIComponent(filename)}`,
    sizeKb: Math.round(buffer.length / 1024),
    uploadedAt: new Date().toISOString()
  };
}

export function setDefaultAvatar(filename) {
  const filePath = path.join(AVATARS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`फोटो फाईल अस्तित्वात नाही: ${filename}`);
  }

  db.prepare(`
    INSERT INTO system_settings (key, value, updated_at)
    VALUES ('default_avatar_filename', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(filename);

  return { success: true, defaultFilename: filename };
}

export function deleteAvatarPhoto(filename) {
  const filePath = path.join(AVATARS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // If this was the default, unset it
  const defaultSetting = db.prepare("SELECT value FROM system_settings WHERE key = 'default_avatar_filename'").get();
  if (defaultSetting && defaultSetting.value === filename) {
    const remaining = getAvatarsList();
    if (remaining.length > 0) {
      setDefaultAvatar(remaining[0].filename);
    } else {
      db.prepare("DELETE FROM system_settings WHERE key = 'default_avatar_filename'").run();
    }
  }

  return { success: true };
}

export function getDefaultAvatar() {
  const avatars = getAvatarsList();
  const def = avatars.find(a => a.isDefault);
  if (def) return def;
  if (avatars.length > 0) return avatars[0];
  return null;
}

export function generateAdvocateVisualPrompt(scriptTitle, legalTopic, options = {}) {
  const { durationSec = 45, voiceSpeed = 'normal' } = options;
  const avatar = getDefaultAvatar();

  return {
    character: "Advocate Pratiksha (Verified Reference Photo Identity)",
    photoReferenceUrl: avatar ? avatar.url : null,
    hasPhotoUploaded: Boolean(avatar),
    appearance: {
      gender: "Female Advocate",
      attire: "Formal Indian Advocate Black Coat, Crisp White Shirt, White Advocate Neck Band",
      demeanor: "Confident, articulate, professional, approachable, authoritative legal counselor"
    },
    setting: {
      environment: "Premium Law Chamber / Legal Office",
      backgroundDetails: "Warm mahogany wood bookshelves with Law Reporter volumes, Indian Constitution emblem, subtle golden 'आपला कायदा – Advocate Pratiksha' branded studio backdrop",
      lighting: "Soft cinematic three-point studio lighting with subtle gold rim glow"
    },
    performanceInstructions: {
      posture: "Direct upright seated posture facing camera at eye level (9:16 vertical Instagram reel framing)",
      expressions: "Engaging natural eye contact, realistic eye blinking, micro-expressions synced to legal seriousness",
      gestures: "Natural subtle hand gestures emphasizing key legal points (e.g., pointing out 7/12 notice, Section 175(3))",
      lipSync: "Crisp Marathi phonetic lip-synchronization matching speech audio waveform"
    },
    fullPromptText: `Ultra-realistic 8k cinematic portrait of Indian female Advocate Pratiksha, wearing black advocate coat, crisp white collared shirt, and legal white neck band. Seated in an elegant High Court legal chamber with legal books in the background and subtle 'आपला कायदा' branding. Natural head movement, realistic eye blinking, and expressive Marathi speaking gestures. Clear focus on facial identity matching uploaded reference photo with zero artificial alteration. 9:16 vertical ratio.`
  };
}
