import db from '../db/database.js';

/**
 * Duplicate Prevention Engine (Section 7 of Master Prompt)
 * Checks for similarity against Published Archive and Active Queue.
 * Compares: Title, Legal Question, Applicable Section, Hook, Keywords.
 */
export function checkDuplicate(candidate) {
  const { title = '', legal_question = '', applicable_section = '', hook = '', keywords = '', excludeId = null } = candidate;

  // Fetch all existing reels except current candidate
  let query = 'SELECT id, day_number, title, legal_question, applicable_section, hook, keywords, status, published_date, published_url FROM reels';
  const params = [];
  if (excludeId) {
    query += ' WHERE id != ?';
    params.push(excludeId);
  }

  const existingReels = db.prepare(query).all(...params);

  const results = [];

  for (const item of existingReels) {
    const similarityBreakdown = {
      titleScore: calculateTextSimilarity(title, item.title),
      questionScore: calculateTextSimilarity(legal_question, item.legal_question),
      sectionScore: calculateSectionMatch(applicable_section, item.applicable_section),
      hookScore: calculateTextSimilarity(hook, item.hook),
      keywordScore: calculateKeywordOverlap(keywords, item.keywords)
    };

    // Weighted composite similarity
    // Section match: 30%, Legal Question: 30%, Title: 20%, Hook: 10%, Keywords: 10%
    const totalScore = Math.round(
      similarityBreakdown.sectionScore * 0.30 +
      similarityBreakdown.questionScore * 0.30 +
      similarityBreakdown.titleScore * 0.20 +
      similarityBreakdown.hookScore * 0.10 +
      similarityBreakdown.keywordScore * 0.10
    );

    if (totalScore >= 35) {
      results.push({
        matchedId: item.id,
        dayNumber: item.day_number,
        title: item.title,
        status: item.status,
        publishedDate: item.published_date,
        publishedUrl: item.published_url,
        totalScore,
        similarityBreakdown,
        isWarning: totalScore >= 70,
        recommendation: totalScore >= 70
          ? 'उच्च साम्य (High Duplicate Risk) - हा विषय आधी हाताळला गेला आहे. नवीन कायदेशीर दुरुस्ती किंवा न्यायालयीन निकालाचे ठोस कारण असल्याशिवाय टाळा.'
          : 'मध्यम साम्य (Moderate Overlap) - आधीच्या व्हिडिओपेक्षा वेगळा कायदेशीर पैलू किंवा वेगळा प्रश्न स्पष्ट करा.'
      });
    }
  }

  // Sort descending by highest similarity score
  results.sort((a, b) => b.totalScore - a.totalScore);

  const highestScore = results.length > 0 ? results[0].totalScore : 0;
  const isDuplicate = highestScore >= 70;

  return {
    isDuplicate,
    highestScore,
    status: isDuplicate ? 'DUPLICATE_DETECTED' : (highestScore >= 35 ? 'PARTIAL_OVERLAP' : 'UNIQUE_VERIFIED'),
    message: isDuplicate
      ? `सावधान: या विषयाशी अत्यंत मिळतेजुळते कंटेंट आधी सापडले आहे (साम्य: ${highestScore}%).`
      : (highestScore >= 35 ? `सूचना: काही कायदेशीर पैलूंमध्ये अंशतः साम्य आहे (साम्य: ${highestScore}%).` : 'अभिनंदन: कोणताही डुप्लिकेट आढळला नाही, विषय पूर्णपणे युनिक आहे.'),
    matches: results
  };
}

/**
 * Simple Token-based Jaccard similarity for Marathi & English text
 */
function calculateTextSimilarity(textA, textB) {
  if (!textA || !textB) return 0;
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }
  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return Math.round((intersectionCount / unionSize) * 100);
}

function calculateSectionMatch(secA, secB) {
  if (!secA || !secB) return 0;
  const sA = cleanSection(secA);
  const sB = cleanSection(secB);
  if (!sA || !sB) return 0;
  if (sA === sB) return 100;
  if (sA.includes(sB) || sB.includes(sA)) return 80;
  return 0;
}

function calculateKeywordOverlap(kwA, kwB) {
  if (!kwA || !kwB) return 0;
  const listA = kwA.toLowerCase().split(/[,\s]+/).filter(w => w.length > 2);
  const listB = kwB.toLowerCase().split(/[,\s]+/).filter(w => w.length > 2);
  if (listA.length === 0 || listB.length === 0) return 0;

  const setB = new Set(listB);
  let overlap = 0;
  for (const word of listA) {
    if (setB.has(word)) overlap++;
  }
  return Math.min(100, Math.round((overlap / Math.max(listA.length, listB.length)) * 100));
}

function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function cleanSection(sec) {
  return sec
    .toLowerCase()
    .replace(/(कलम|section|sec|rule|नियम|\s)/gi, '')
    .trim();
}
