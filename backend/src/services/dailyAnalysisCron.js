import db from '../db/database.js';
import { runDailyTrendResearch, getTodayTrends } from './trendEngine.js';
import { getPerformanceAnalytics } from './analyticsEngine.js';
import { createDatabaseBackup } from './backupService.js';
import { generateDailyFinalReport } from './reportGenerator.js';

/**
 * 24-Hour Automated Engine (Section 13, 14 & User Prompt)
 * Runs continuous 24-hour analysis cycles:
 *   1. 24-Hour Performance & Retention Audit
 *   2. Land & Gunthewari Trend Refresh
 *   3. 17-Point Final Report Generation
 *   4. Persistent SQLite Snapshot Backup
 *   5. Queue Validation for Advocate Pratiksha
 */

export async function run24HourAnalysisCycle() {
  const cycleStartTime = new Date().toISOString();
  console.log(`[24h Engine] Starting 24-Hour Automated Analysis Cycle at: ${cycleStartTime}`);

  try {
    // 1. Performance Audit
    const analytics = getPerformanceAnalytics();
    console.log(`[24h Engine] Audited ${analytics.overview.totalPublished} published reels.`);

    // 2. Refresh Land & Gunthewari Trends
    const trends = runDailyTrendResearch();
    console.log(`[24h Engine] Refreshed 10 daily topics. Top 1: "${trends.bestToday?.topic_name}"`);

    // 3. Generate 21-Point Daily Final Report (Section 11)
    const report = generateDailyFinalReport();
    console.log(`[24h Engine] Generated 21-point Daily Final Report for date: ${report.report_date}`);

    // 4. Create Persistent Backup Snapshot
    const backup = createDatabaseBackup('24h_Cycle_Auto');
    console.log(`[24h Engine] Snapshot backup created: ${backup.filename} (${backup.fileSizeKb} KB)`);

    // 5. Check and ensure next Reel in queue is 'Ready to Record'
    const nextUnpublished = db.prepare(`
      SELECT id, day_number, title, status FROM reels
      WHERE status != 'Published'
      ORDER BY day_number ASC
      LIMIT 1
    `).get();

    if (nextUnpublished && nextUnpublished.status === 'New') {
      db.prepare(`UPDATE reels SET status = 'Ready to Record', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(nextUnpublished.id);
      console.log(`[24h Engine] Activated Day ${nextUnpublished.day_number} (${nextUnpublished.title}) to Ready to Record.`);
    }

    // 6. Log audit trail
    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('24H_CYCLE_SUCCESS', 'SYSTEM', 'CRON', ?)
    `).run(`२४-तासांचे संपूर्ण स्वयंचलित विश्लेषण पूर्ण: ${analytics.overview.totalPublished} Reels तपासले, नवीन ट्रेंड्स अद्ययावत, बॅकअप यशस्वी.`);

    // Update system settings with last run time
    db.prepare(`
      INSERT INTO system_settings (key, value, updated_at)
      VALUES ('last_24h_cycle_run', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(cycleStartTime);

    return {
      success: true,
      cycleStartTime,
      completedAt: new Date().toISOString(),
      analyticsSummary: {
        totalPublished: analytics.overview.totalPublished,
        totalViews: analytics.overview.totalViews,
        totalSends: analytics.overview.totalSends,
        totalSaves: analytics.overview.totalSaves,
        currentFollowers: analytics.followerGrowth.currentFollowers,
        progressTo100kPct: analytics.followerGrowth.followerProgressPct
      },
      topLandTopic: trends.bestToday?.topic_name,
      backupFile: backup.filename,
      activeReelDay: nextUnpublished ? nextUnpublished.day_number : 60
    };
  } catch (error) {
    console.error('[24h Engine] Error during 24-hour cycle:', error);
    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, details)
      VALUES ('24H_CYCLE_ERROR', 'SYSTEM', 'CRON', ?)
    `).run(`२४-तास सायकल त्रुटी: ${error.message}`);
    throw error;
  }
}

/**
 * Initialize 24-Hour Timer Loop
 */
export function init24HourCronScheduler() {
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  // Run on server startup after 10 seconds grace period
  setTimeout(() => {
    run24HourAnalysisCycle().catch(err => console.error('[24h Cron Startup]', err.message));
  }, 10000);

  // Set recurring 24-hour interval
  setInterval(() => {
    run24HourAnalysisCycle().catch(err => console.error('[24h Recurring Cron]', err.message));
  }, TWENTY_FOUR_HOURS_MS);

  console.log('[24h Cron] 24-Hour Automated Analysis & Snapshot engine initialized.');
}
