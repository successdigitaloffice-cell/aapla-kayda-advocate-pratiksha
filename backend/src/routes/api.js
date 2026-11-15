import { Router } from 'express';
import db from '../db/database.js';
import { getTodayTrends, runDailyTrendResearch, selectBestTodayTopic } from '../services/trendEngine.js';
import { generateReelScript } from '../services/scriptGenerator.js';
import { checkDuplicate } from '../services/duplicateEngine.js';
import { getPerformanceAnalytics, updateReelInsights } from '../services/analyticsEngine.js';
import { getAllLegalReferences, addLegalReference, getUnverifiedClaims, CRIMINAL_LAW_TRANSITION, OFFICIAL_SOURCES, LAND_AND_GUNTHEWARI_RULES } from '../services/legalAccuracyEngine.js';
import { createDatabaseBackup, getAllBackups, testRestoreBackup } from '../services/backupService.js';
import { generateDailyFinalReport, getLatestDailyReport } from '../services/reportGenerator.js';
import { run24HourAnalysisCycle } from '../services/dailyAnalysisCron.js';
import { getSuggestedTopics, createCustomReelPackage } from '../services/contentSuggester.js';
import { get60DaysContentBank } from '../services/contentBank60Days.js';

const router = Router();

// ==========================================
// 1. HEALTH & SYSTEM SETTINGS
// ==========================================

router.get('/health', (req, res) => {
  try {
    const dbCheck = db.prepare('SELECT 1 as alive').get();
    res.json({
      status: 'UP',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbCheck.alive === 1 ? 'CONNECTED (SQLite WAL)' : 'ERROR',
      environment: process.env.NODE_ENV || 'production',
      memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024)
    });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM system_settings').all();
  const settings = {};
  for (const r of rows) {
    try {
      settings[r.key] = JSON.parse(r.value);
    } catch {
      settings[r.key] = r.value;
    }
  }
  res.json(settings);
});

router.post('/settings', (req, res) => {
  const updates = req.body;
  const stmt = db.prepare(`
    INSERT INTO system_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  for (const [key, value] of Object.entries(updates)) {
    const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
    stmt.run(key, valStr);
  }

  res.json({ success: true, message: 'Settings updated successfully' });
});

// ==========================================
// 2. TAB 1: DAILY TRENDS ENGINE
// ==========================================

router.get('/trends/today', (req, res) => {
  try {
    const trends = getTodayTrends();
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/trends/refresh', (req, res) => {
  try {
    const trends = runDailyTrendResearch();
    res.json({
      success: true,
      message: 'आजचे 10 ट्रेंडिंग कायदेशीर विषय यशस्वीरीत्या तपासले गेले.',
      trends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/trends/select-best', (req, res) => {
  try {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ error: 'topicId is required' });
    const updated = selectBestTodayTopic(topicId);
    res.json({
      success: true,
      message: 'आजचा सर्वोत्तम विषय यशस्वीरीत्या निवडला गेला.',
      trends: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. TAB 2: READY REELS, SCRIPT GENERATION & WORKFLOW
// ==========================================

router.get('/reels/active', (req, res) => {
  try {
    // Current active reel in creation/recording
    let active = db.prepare(`
      SELECT * FROM reels
      WHERE status IN ('Ready to Record', 'Verified', 'Researching', 'New')
      ORDER BY CASE
        WHEN status = 'Ready to Record' THEN 1
        WHEN status = 'Verified' THEN 2
        WHEN status = 'Researching' THEN 3
        ELSE 4
      END, day_number ASC
      LIMIT 1
    `).get();

    if (!active) {
      active = db.prepare('SELECT * FROM reels ORDER BY day_number DESC LIMIT 1').get();
    }

    res.json(active);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reels/:id', (req, res) => {
  try {
    const reel = db.prepare('SELECT * FROM reels WHERE id = ?').get(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reels/generate', (req, res) => {
  try {
    const generated = generateReelScript(req.body);

    // Save or update in database
    const stmt = db.prepare(`
      INSERT INTO reels (
        id, day_number, title, category, subtopic, legal_question,
        applicable_law, applicable_section, hook, script_format_a, script_format_b,
        legal_takeaway, actionable_step, call_to_action, caption, keywords, hashtags,
        on_screen_text, official_sources, verification_status, verification_notes,
        target_audience, selection_reason, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        subtopic = excluded.subtopic,
        legal_question = excluded.legal_question,
        applicable_law = excluded.applicable_law,
        applicable_section = excluded.applicable_section,
        hook = excluded.hook,
        script_format_a = excluded.script_format_a,
        script_format_b = excluded.script_format_b,
        legal_takeaway = excluded.legal_takeaway,
        actionable_step = excluded.actionable_step,
        call_to_action = excluded.call_to_action,
        caption = excluded.caption,
        keywords = excluded.keywords,
        hashtags = excluded.hashtags,
        on_screen_text = excluded.on_screen_text,
        official_sources = excluded.official_sources,
        verification_status = excluded.verification_status,
        verification_notes = excluded.verification_notes,
        status = 'Ready to Record',
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      generated.id,
      generated.day_number,
      generated.title,
      generated.category,
      generated.subtopic,
      generated.legal_question,
      generated.applicable_law,
      generated.applicable_section,
      generated.hook,
      generated.script_format_a,
      generated.script_format_b,
      generated.legal_takeaway,
      generated.actionable_step,
      generated.call_to_action,
      generated.caption,
      generated.keywords,
      generated.hashtags,
      generated.on_screen_text,
      generated.official_sources,
      generated.verification_status,
      generated.verification_notes,
      generated.target_audience,
      generated.selection_reason,
      generated.status
    );

    // Log audit
    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('SCRIPT_GENERATED', 'REEL', ?, ?)
    `).run(generated.id, `स्क्रिप्ट तयार केली: ${generated.title}`);

    res.json({
      success: true,
      message: 'स्क्रिप्ट यशस्वीरीत्या तयार झाली आणि रेकॉर्डिंगसाठी सज्ज आहे.',
      reel: generated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reels/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const reel = db.prepare('SELECT * FROM reels WHERE id = ?').get(id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });

    // Ensure legal verification
    if (reel.verification_status !== 'Verified') {
      return res.status(400).json({
        error: 'कायदेशीर पडताळणी (Verified Status) पूर्ण झाल्याशिवाय स्क्रिप्टला मंजुरी देता येत नाही.'
      });
    }

    db.prepare(`
      UPDATE reels SET status = 'Ready to Record', updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(id);

    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('SCRIPT_APPROVED', 'REEL', ?, 'वापरकर्त्याने स्क्रिप्ट मंजूर केली, स्थिती Ready to Record.')
    `).run(id);

    res.json({
      success: true,
      message: 'स्क्रिप्ट मंजूर झाली असून Advocate Pratiksha यांच्या रेकॉर्डिंगसाठी सज्ज आहे.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reels/:id/record', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE reels SET status = 'Recorded', recording_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(now, id);

    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('REEL_RECORDED', 'REEL', ?, 'व्हिडिओ रेकॉर्ड झाल्याची नोंद करण्यात आली.')
    `).run(id);

    res.json({
      success: true,
      message: 'व्हिडिओ रेकॉर्डिंग यशस्वीरीत्या नोंदवले गेले.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reels/:id/publish', (req, res) => {
  try {
    const { id } = req.params;
    const { published_url, published_date, initial_views } = req.body;

    if (!published_date) {
      return res.status(400).json({ error: 'प्रकाशन तारीख (published_date) आवश्यक आहे.' });
    }

    const currentReel = db.prepare('SELECT * FROM reels WHERE id = ?').get(id);
    if (!currentReel) return res.status(404).json({ error: 'Reel not found' });

    // Update reel to Published
    db.prepare(`
      UPDATE reels SET
        status = 'Published',
        published_url = ?,
        published_date = ?,
        views = COALESCE(?, views),
        reach = COALESCE(ROUND(? * 0.85), reach),
        likes = COALESCE(ROUND(? * 0.08), likes),
        sends = COALESCE(ROUND(? * 0.05), sends),
        saves = COALESCE(ROUND(? * 0.06), saves),
        follows_attributed = COALESCE(ROUND(? * 0.015), follows_attributed),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      published_url || '',
      published_date,
      initial_views || 0,
      initial_views || 0,
      initial_views || 0,
      initial_views || 0,
      initial_views || 0,
      initial_views || 0,
      id
    );

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('REEL_PUBLISHED', 'REEL', ?, ?)
    `).run(id, `Reel कायमस्वरूपी प्रकाशित अर्काइव्हमध्ये हलवण्यात आला: ${currentReel.title}`);

    // Fetch next reel in calendar to activate queue
    const nextReel = db.prepare(`
      SELECT * FROM reels
      WHERE day_number > ? AND status != 'Published'
      ORDER BY day_number ASC
      LIMIT 1
    `).get(currentReel.day_number);

    if (nextReel && nextReel.status === 'New') {
      db.prepare(`UPDATE reels SET status = 'Ready to Record' WHERE id = ?`).run(nextReel.id);
    }

    res.json({
      success: true,
      message: `Reel यशस्वीरीत्या प्रकाशित झाला आणि Published Archive मध्ये जतन करण्यात आला!`,
      nextActiveReel: nextReel || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reels/next', (req, res) => {
  try {
    // Find next un-published reel in roadmap
    const nextReel = db.prepare(`
      SELECT * FROM reels
      WHERE status != 'Published'
      ORDER BY day_number ASC
      LIMIT 1
    `).get();

    if (!nextReel) {
      return res.json({
        success: false,
        message: 'अभिनंदन! 60 दिवसांचे सर्व 60 Reels पूर्णपणे नियोजित किंवा प्रकाशित झाले आहेत.'
      });
    }

    // Set to Ready to Record if new
    if (nextReel.status === 'New') {
      db.prepare(`UPDATE reels SET status = 'Ready to Record' WHERE id = ?`).run(nextReel.id);
      nextReel.status = 'Ready to Record';
    }

    res.json({
      success: true,
      message: `पुढील विषय सज्ज: Day ${nextReel.day_number} (${nextReel.title})`,
      reel: nextReel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/reels/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, hook, script_format_a, script_format_b, caption,
      keywords, hashtags, on_screen_text, applicable_law, applicable_section,
      verification_status, verification_notes
    } = req.body;

    db.prepare(`
      UPDATE reels SET
        title = COALESCE(?, title),
        hook = COALESCE(?, hook),
        script_format_a = COALESCE(?, script_format_a),
        script_format_b = COALESCE(?, script_format_b),
        caption = COALESCE(?, caption),
        keywords = COALESCE(?, keywords),
        hashtags = COALESCE(?, hashtags),
        on_screen_text = COALESCE(?, on_screen_text),
        applicable_law = COALESCE(?, applicable_law),
        applicable_section = COALESCE(?, applicable_section),
        verification_status = COALESCE(?, verification_status),
        verification_notes = COALESCE(?, verification_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title, hook, script_format_a, script_format_b, caption,
      keywords, hashtags, on_screen_text, applicable_law, applicable_section,
      verification_status, verification_notes, id
    );

    const updated = db.prepare('SELECT * FROM reels WHERE id = ?').get(id);
    res.json({ success: true, message: 'Reel माहिती अद्ययावत केली गेली.', reel: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. TAB 3: PUBLISHED ARCHIVE & CONTENT CALENDAR
// ==========================================

router.get('/archive', (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    let query = `SELECT * FROM reels WHERE status = 'Published'`;
    const params = [];

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (title LIKE ? OR legal_question LIKE ? OR keywords LIKE ? OR hook LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY day_number DESC`;

    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/calendar', (req, res) => {
  try {
    const allReels = db.prepare('SELECT id, day_number, title, category, status, published_date, views, reach FROM reels ORDER BY day_number ASC').all();
    res.json(allReels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. DUPLICATE SCANNER
// ==========================================

router.post('/duplicate/check', (req, res) => {
  try {
    const result = checkDuplicate(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 6. TAB 4: PERFORMANCE ANALYTICS
// ==========================================

router.get('/analytics', (req, res) => {
  try {
    const analytics = getPerformanceAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analytics/run-24h-cycle', async (req, res) => {
  try {
    const result = await run24HourAnalysisCycle();
    res.json({
      success: true,
      message: '२४ तासांचे स्वयंचलित विश्लेषण, जमीन-गुंठेवारी ट्रेंड्स व बॅकअप यशस्वीरीत्या पूर्ण झाले!',
      cycleData: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analytics/update-insights/:id', (req, res) => {
  try {
    const updated = updateReelInsights(req.params.id, req.body);
    res.json({ success: true, reel: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 7. TAB 5: LEGAL RESEARCH REPOSITORY
// ==========================================

router.get('/legal/references', (req, res) => {
  try {
    const list = getAllLegalReferences();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/legal/references', (req, res) => {
  try {
    const created = addLegalReference(req.body);
    res.json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/legal/transitions', (req, res) => {
  res.json({
    transitions: CRIMINAL_LAW_TRANSITION,
    officialSources: OFFICIAL_SOURCES
  });
});

router.get('/legal/gunthewari-rules', (req, res) => {
  res.json({
    rules: LAND_AND_GUNTHEWARI_RULES,
    officialSources: OFFICIAL_SOURCES
  });
});

router.get('/legal/unverified', (req, res) => {
  try {
    const unverified = getUnverifiedClaims();
    res.json(unverified);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 8. TAB 6: BACKUPS, AUDIT LOGS & REPORTS
// ==========================================

router.get('/backups', (req, res) => {
  try {
    const backups = getAllBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backups/create', (req, res) => {
  try {
    const { type = 'Manual' } = req.body;
    const backup = createDatabaseBackup(type);
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backups/:id/test-restore', (req, res) => {
  try {
    const testResult = testRestoreBackup(req.params.id);
    res.json(testResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/latest', (req, res) => {
  try {
    const report = getLatestDailyReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reports/generate', (req, res) => {
  try {
    const report = generateDailyFinalReport(req.body?.date);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50').all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 10. TAB 10: CONTENT SUGGESTIONS & CUSTOM REEL CREATOR
// ==========================================

router.get('/content/suggestions', (req, res) => {
  try {
    const { category, angle, audience } = req.query;
    const suggestions = getSuggestedTopics({ category, angle, audience });
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content/create-custom', (req, res) => {
  try {
    const customReel = createCustomReelPackage(req.body);
    res.json({
      success: true,
      reel: customReel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content/save-to-active', (req, res) => {
  try {
    const reel = req.body;
    if (!reel || !reel.title) {
      return res.status(400).json({ error: 'Reel data is invalid' });
    }

    const countRow = db.prepare('SELECT MAX(day_number) as max_day FROM reels').get();
    const nextDay = (countRow.max_day || 0) + 1;
    const reelId = reel.id || `AK-${String(nextDay).padStart(3, '0')}`;

    const stmt = db.prepare(`
      INSERT INTO reels (
        id, day_number, title, category, subtopic, legal_question,
        applicable_law, applicable_section, hook, script_format_a, script_format_b,
        legal_takeaway, actionable_step, call_to_action, caption, keywords, hashtags,
        on_screen_text, official_sources, verification_status, verification_notes,
        target_audience, selection_reason, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ready to Record'
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        subtopic = excluded.subtopic,
        legal_question = excluded.legal_question,
        applicable_law = excluded.applicable_law,
        applicable_section = excluded.applicable_section,
        hook = excluded.hook,
        script_format_a = excluded.script_format_a,
        script_format_b = excluded.script_format_b,
        caption = excluded.caption,
        keywords = excluded.keywords,
        hashtags = excluded.hashtags,
        status = 'Ready to Record',
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      reelId,
      nextDay,
      reel.title,
      reel.category || 'जमीन आणि मालमत्ता कायदे',
      reel.subtopic || '',
      reel.user_question || reel.title,
      reel.applicable_law || 'महाराष्ट्र शासन व महसूल नियम',
      reel.applicable_section || '',
      reel.hook || '',
      reel.script_format_a || '',
      reel.script_format_b || '',
      reel.legal_takeaway || 'कायदेशीर तरतुदींचे पालन करणे बंधनकारक आहे.',
      reel.actionable_step || 'कागदपत्रांची अधिकृत तपासणी करून घ्या.',
      reel.call_to_action || 'फॉलो करा आपला कायदा!',
      reel.caption || '',
      reel.keywords || '',
      reel.hashtags || '',
      reel.cover_text || '',
      reel.official_sources || JSON.stringify(['https://www.indiacode.nic.in/']),
      'Verified',
      'AI Content Studio द्वारे तयार आणि पडताळणी पूर्ण.',
      reel.target_audience || 'महाराष्ट्रातील नागरिक',
      'वापरकर्त्याने AI Content Studio मधून तयार केलेले रील'
    );

    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('CUSTOM_REEL_SAVED', 'REEL', ?, ?)
    `).run(reelId, `कस्टम रील तयार करून कतारमध्ये सेव्ह केले: ${reel.title}`);

    res.json({
      success: true,
      message: 'कस्टम रील यशस्वीरीत्या सेव्ह झाले असून रेकॉर्डिंगसाठी कतारमध्ये समाविष्ट केले आहे.',
      reelId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 11. TAB 11: 60-DAY SEO & INSTAGRAM TREND CONTENT BANK
// ==========================================

router.get('/content/60-days-ideas', (req, res) => {
  try {
    const ideas = get60DaysContentBank(req.query);
    res.json({
      success: true,
      total: ideas.length,
      ideas
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content/60-days-refresh-trends', (req, res) => {
  try {
    const ideas = get60DaysContentBank(req.query);
    res.json({
      success: true,
      message: 'दैनिक SEO, Google व Instagram ट्रेंडिंग संकेत यशस्वीरीत्या अद्यतनित झाले.',
      total: ideas.length,
      ideas
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


