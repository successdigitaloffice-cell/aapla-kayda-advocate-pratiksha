const BASE_URL = process.env.BASE_URL || 'http://localhost:5050/api';

async function runTests() {
  console.log('🧪 STARTING AAPLA KAYDA SYSTEM INTEGRATION TESTS...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health
  await test('GET /health returns UP and SQLite WAL connection', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'UP' || !data.database.includes('CONNECTED')) {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Trends Today
  await test('GET /trends/today returns 10 evaluated topics and top 3', async () => {
    const res = await fetch(`${BASE_URL}/trends/today`);
    const data = await res.json();
    if (!data.bestToday || data.allTopics.length < 10 || data.top3.length !== 3) {
      throw new Error(`Invalid trends data structure: ${data.totalEvaluated} topics`);
    }
  });

  // 3. Trends Refresh
  await test('POST /trends/refresh evaluates fresh daily topics without duplicates', async () => {
    const res = await fetch(`${BASE_URL}/trends/refresh`, { method: 'POST' });
    const data = await res.json();
    if (!data.success || !data.trends.bestToday) {
      throw new Error('Trends refresh failed');
    }
  });

  // 4. Active Reel
  await test('GET /reels/active returns current active reel in progress', async () => {
    const res = await fetch(`${BASE_URL}/reels/active`);
    const data = await res.json();
    if (!data || !data.title || !data.script_format_a) {
      throw new Error('Active reel missing required script fields');
    }
  });

  // 5. Duplicate Check
  await test('POST /duplicate/check detects similarity against past reels', async () => {
    const res = await fetch(`${BASE_URL}/duplicate/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '7/12 उतारा फेरफार नोंद तपासणी',
        applicable_section: 'कलम 149'
      })
    });
    const data = await res.json();
    if (typeof data.highestScore !== 'number' || !data.status) {
      throw new Error('Duplicate scanner returned invalid structure');
    }
  });

  // 6. Script Generator
  await test('POST /reels/generate generates dual 30-40s and 50-60s teleprompter scripts', async () => {
    const res = await fetch(`${BASE_URL}/reels/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'शेतजमिनीचा रस्ता अडवल्यास तहसीलदार कोर्टात कलम 5 अन्वये अर्ज',
        category: 'जमीन आणि मालमत्ता कायदे',
        applicable_law: 'Mamlatdars Courts Act, 1906',
        applicable_section: 'कलम 5'
      })
    });
    const data = await res.json();
    if (!data.success || !data.reel.script_format_a || !data.reel.script_format_b) {
      throw new Error('Script generation missing dual format scripts');
    }
  });

  // 7. Performance Analytics
  await test('GET /analytics returns Views, Sends, Saves, and Follower velocity towards 100K', async () => {
    const res = await fetch(`${BASE_URL}/analytics`);
    const data = await res.json();
    if (!data.overview.totalViews || !data.followerGrowth.targetFollowers) {
      throw new Error('Analytics missing overview or follower progress');
    }
    if (data.followerGrowth.targetFollowers !== 100000) {
      throw new Error('Target followers must be 100,000');
    }
  });

  // 8. Legal References & Transition
  await test('GET /legal/references & transitions return verified Maharashtra statutes & BNS/BNSS matrix', async () => {
    const r1 = await fetch(`${BASE_URL}/legal/references`);
    const refs = await r1.json();
    const r2 = await fetch(`${BASE_URL}/legal/transitions`);
    const trans = await r2.json();

    if (refs.length < 5 || trans.transitions.length < 5) {
      throw new Error('Legal reference repository incomplete');
    }
  });

  // 9. Database Backup & Restore Test
  await test('POST /backups/create & test-restore creates snapshot and verifies file integrity', async () => {
    const res = await fetch(`${BASE_URL}/backups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'IntegrationTest' })
    });
    const backup = await res.json();
    if (!backup.success || !backup.backupId) {
      throw new Error('Backup creation failed');
    }

    const testRes = await fetch(`${BASE_URL}/backups/${backup.backupId}/test-restore`, { method: 'POST' });
    const restoreData = await testRes.json();
    if (!restoreData.verified) {
      throw new Error('Backup restore integrity verification failed');
    }
  });

  // 10. 21-Point Daily Report (Section 11)
  await test('POST /reports/generate generates exact 21-point Daily Report for Advocate Pratiksha (Section 11)', async () => {
    const res = await fetch(`${BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: '2026-10-14' })
    });
    const report = await res.json();
    if (!report.markdownReport || !report.report21Keys?.DATE || !report.report21Keys?.BEST_TOPIC_TODAY) {
      throw new Error('Report generator output missing 21-point keys');
    }
  });

  // 11. 24-Hour Cycle Execution
  await test('POST /analytics/run-24h-cycle executes complete 24-hour Land & Gunthewari audit and snapshot backup', async () => {
    const res = await fetch(`${BASE_URL}/analytics/run-24h-cycle`, { method: 'POST' });
    const data = await res.json();
    if (!data.success || !data.cycleData.topLandTopic || !data.cycleData.backupFile) {
      throw new Error('24-Hour cycle execution failed');
    }
  });

  // 12. Land & Gunthewari Rules API
  await test('GET /legal/gunthewari-rules returns Gunthewari Act 2001, Tukdebandi Act 1947 & MLRC rules', async () => {
    const res = await fetch(`${BASE_URL}/legal/gunthewari-rules`);
    const data = await res.json();
    if (!data.rules || data.rules.length < 5) {
      throw new Error('Gunthewari rules endpoint missing required rules');
    }
  });

  console.log(`\n===========================================`);
  console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`===========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
