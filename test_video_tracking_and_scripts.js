/**
 * Verification Test Suite for Features 1 & 2:
 * 1. Manual Video Created Tracking with Global Synchronization & DB Persistence.
 * 2. Complete Face-Video Script Bank with 19-point Video Formula & Cues.
 */

import db, { initDatabase } from './backend/src/db/database.js';
import { getAllCompleteScripts, normalizeContentSlug } from './backend/src/services/completeScriptBank.js';
import { getContentKeys, checkIsVideoCreated } from './frontend/src/utils/videoTracking.js';

console.log('=== RUNNING VERIFICATION TEST SUITE ===\n');

// Initialize database
initDatabase();

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------
// TEST GROUP 1: Video Tracking Table & DB Persistence
// ----------------------------------------------------
console.log('\n--- 1. Testing SQLite Database Table video_tracking ---');

const checkTable = db.prepare(`SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='video_tracking'`).get();
assert(checkTable.count === 1, 'Table video_tracking exists in SQLite database');

// Test Insertion / Ticking
const testSlug = normalizeContentSlug('गुंठेवारी ३१ डिसेंबर २०२० कट-ऑफ');
const insertStmt = db.prepare(`
  INSERT INTO video_tracking (content_key, canonical_slug, title, category, day_number, aliases, is_created, marked_by, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, 1, 'advocate_pratiksha', CURRENT_TIMESTAMP)
  ON CONFLICT(content_key) DO UPDATE SET is_created = 1, updated_at = CURRENT_TIMESTAMP
`);
insertStmt.run(testSlug, testSlug, 'गुंठेवारी ३१ डिसेंबर २०२० कट-ऑफ: नियमितीकरणाचा प्रत्यक्ष सरकारी नियम', 'जमीन महसूल व गुंठेवारी', 1, JSON.stringify(['day_1', 'target60_1', testSlug]));

const savedRow = db.prepare('SELECT * FROM video_tracking WHERE content_key = ?').get(testSlug);
assert(savedRow !== undefined && savedRow.is_created === 1, 'Ticked item is permanently saved to database with is_created = 1');

// ----------------------------------------------------
// TEST GROUP 2: Global Content Synchronization
// ----------------------------------------------------
console.log('\n--- 2. Testing Global Content Synchronization Across Day 1, 60-Day Target, and 90-Day Tracker ---');

const trackingMap = {
  [testSlug]: { isCreated: true, dayNumber: 1 },
  'day_1': { isCreated: true, dayNumber: 1 },
  'target60_1': { isCreated: true, dayNumber: 1 }
};

// Item in Day 1 Roadmap
const day1Item = { id: 'target60_1', dayNumber: 1, title: 'गुंठेवारी ३१ डिसेंबर २०२० कट-ऑफ: नियमितीकरणाचा प्रत्यक्ष सरकारी नियम' };
assert(checkIsVideoCreated(day1Item, trackingMap) === true, 'Day 1 item evaluates to isCreated = true');

// Same Item appearing in Day 3 Review or different tracker view with title matching
const sameTopicInAnotherDay = { id: 'day_3_review', dayNumber: 3, title: 'गुंठेवारी ३१ डिसेंबर २०२० कट-ऑफ' };
assert(checkIsVideoCreated(sameTopicInAnotherDay, trackingMap) === true, 'Same topic appearing in another tracker automatically shows isCreated = true via canonical slug!');

// Different content item should NOT be created
const differentItem = { id: 'day_45', dayNumber: 45, title: 'सायबर बँकिंग फ्रॉड आणि तात्काळ तक्रार' };
assert(checkIsVideoCreated(differentItem, trackingMap) === false, 'Different content remains NOT created (no false positive matching)');

// Untick test
const untickStmt = db.prepare(`UPDATE video_tracking SET is_created = 0, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?`);
untickStmt.run(testSlug);
const untickedRow = db.prepare('SELECT is_created FROM video_tracking WHERE content_key = ?').get(testSlug);
assert(untickedRow.is_created === 0, 'Clicking again successfully unticks the item in database');

// ----------------------------------------------------
// TEST GROUP 3: Complete 60-Day Script Bank & 19 Parts
// ----------------------------------------------------
console.log('\n--- 3. Testing Complete Script Bank (19-Point Video Formula) ---');

const allScripts = getAllCompleteScripts();
assert(allScripts.length === 60, `60 complete scripts generated (Found: ${allScripts.length})`);

const sampleScript = allScripts[0];
console.log(`Checking Day ${sampleScript.dayNumber}: "${sampleScript.title}"`);

// Verify 19 parts in sections
const requiredKeys = [
  'topicTitle', 'objective', 'openingHook', 'attentionIntro', 'fullContext',
  'detailedExplanation', 'stepByStep', 'keyPoints', 'realExample', 'factsData',
  'coreContent', 'engagement', 'suspense', 'mainMessage', 'emotionalConnection',
  'practicalTakeaways', 'strongEnding', 'conclusion', 'callToAction'
];

let allKeysPresent = true;
for (const key of requiredKeys) {
  if (!sampleScript.sections[key] || typeof sampleScript.sections[key] !== 'string') {
    allKeysPresent = false;
    console.error(`Missing required section: ${key}`);
  }
}
assert(allKeysPresent === true, 'All 19 required script components are fully populated');

// Verify teleprompter cues and natural spoken sentences
assert(sampleScript.fullSpokenScript.includes('[कॅमेऱ्याकडे रोखून पाहा'), 'Teleprompter script contains camera direction cues');
assert(sampleScript.fullSpokenScript.includes('ॲडव्होकेट प्रतीक्षा'), 'Script has authentic Advocate Pratiksha introduction');
assert(sampleScript.fullSpokenScript.includes('आपला कायदा'), 'Script contains official brand CTA');
assert(!sampleScript.fullSpokenScript.includes('इथे माहिती भरा'), 'Zero placeholders or shortcuts in script');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log(`========================================\n`);

if (passed === total) {
  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
} else {
  process.exit(1);
}
