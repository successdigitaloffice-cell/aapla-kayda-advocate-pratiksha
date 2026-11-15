import db from '../db/database.js';

/**
 * Legal Accuracy Engine (Section 5 of Master Prompt)
 * Truth, statutory verification, official source citations.
 * Specialized Land, Gunthewari, Tukdebandi & Property Law Rules.
 */

// Official Primary Sources Directory
export const OFFICIAL_SOURCES = {
  INDIA_CODE: {
    name: 'India Code (National Repository of Central & State Acts)',
    url: 'https://www.indiacode.nic.in/',
    description: 'अधिकृत केंद्रीय व महाराष्ट्र राज्य कायदे आणि नियम'
  },
  SUPREME_COURT: {
    name: 'Supreme Court of India (Official Portal & Judgements)',
    url: 'https://www.sci.gov.in/',
    description: 'सर्वोच्च न्यायालयाचे अधिकृत निकाल आणि संविधानात्मक खंडपीठ आदेश'
  },
  BOMBAY_HIGH_COURT: {
    name: 'Bombay High Court (Official Judgement & Orders)',
    url: 'https://bombayhighcourt.nic.in/',
    description: 'मुंबई उच्च न्यायालयाचे अधिकृत न्यायनिर्णय (जमीन व तुकडेबंदी निकाल)'
  },
  MAHARASHTRA_GOVT: {
    name: 'Government of Maharashtra (Official Portal & GRs)',
    url: 'https://www.maharashtra.gov.in/',
    description: 'अधिकृत शासन निर्णय (GRs), गुंठेवारी अधिसूचना आणि महसूल परिपत्रके'
  },
  MAHABHUMI: {
    name: 'Bhulekh Mahabhumi (Land Records Department, Maharashtra)',
    url: 'https://bhulekh.mahabhumi.gov.in/',
    description: 'डिजिटल 7/12, 8A, ई-फेरफार, ई-हक्क आणि गाव नमुने'
  },
  IGR_MAHARASHTRA: {
    name: 'Inspector General of Registration & Stamps (IGR Maharashtra)',
    url: 'https://igrmaharashtra.gov.in/',
    description: 'नोंदणी व मुद्रांक विभाग, ई-नोंदणी, सर्च रिपोर्ट, इंडेक्स 2'
  },
  MAHARERA: {
    name: 'MahaRERA (Maharashtra Real Estate Regulatory Authority)',
    url: 'https://maharera.maharashtra.gov.in/',
    description: 'मंजूर लेआउट्स, बिल्डर प्लॉट्स आणि रेरा नोंदणी पडताळणी'
  },
  CYBER_PORTAL: {
    name: 'National Cyber Crime Reporting Portal & Helpline 1930',
    url: 'https://cybercrime.gov.in/',
    description: 'गृह मंत्रालय भारत सरकार सायबर क्राईम तक्रार पोर्टल'
  },
  E_DAAKHIL: {
    name: 'E-Daakhil Consumer Grievance Portal',
    url: 'https://edaakhil.nic.in/',
    description: 'ग्राहक संरक्षण कायदा 2019 अंतर्गत ई-फायलिंग'
  }
};

// Specialized Land, Gunthewari & Tukdebandi Rules Repository
export const LAND_AND_GUNTHEWARI_RULES = [
  {
    ruleCode: 'GUNTHEWARI-ACT-2001-2021',
    actTitle: 'महाराष्ट्र गुंठेवारी विकास (नियमितीकरण, श्रेणीवाढ व नियंत्रण) अधिनियम, २००१ (सुधारणा २०२१ GR)',
    applicableSections: 'कलम ३ व ४ (प्रशम शुल्क व नियमितीकरण)',
    keyMarathiSummary: '३१ डिसेंबर २०२० पूर्वी झालेल्या अनधिकृत गुंठेवारी भूखंड व बांधकामांचे नियमितीकरण करणे. महानगरपालिका / प्राधिकरणाकडे विकास शुल्क व प्रशम शुल्क भरून नियमितीकरण प्रमाणपत्र (Regularisation Certificate) मिळते.',
    criticalWarning: 'नियमितीकरण न केल्यास बांधकाम अनधिकृत मानले जाऊन 7/12 वर खरेदीदाराचे नाव लागण्यात कायदेशीर अडचण येते.',
    authority: 'महानगरपालिका आयुक्त / नगररचना विभाग / जिल्हाधिकारी'
  },
  {
    ruleCode: 'TUKDEBANDI-ACT-1947',
    actTitle: 'मुंबई तुकडेबंदी आणि तुकडे जोड अधिनियम, १९४७ (Bombay Prevention of Fragmentation Act)',
    applicableSections: 'कलम ७, ८ आणि ८B (प्रमाणभूत क्षेत्रापेक्षा कमी तुकड्यावर बंदी)',
    keyMarathiSummary: 'शेतजमिनीचा तुकडा पाडून विक्री करण्यास बंदी आहे. जिरायतसाठी २०/४० गुंठे आणि बागायतसाठी १०/२० गुंठे प्रमाणभूत क्षेत्र असते. यापेक्षा कमी क्षेत्र (उदा. १ किंवा २ गुंठे) शेतजमीन म्हणून विकल्यास कलम ८B अन्वये व्यवहार अवैध ठरतो व फेरफार रद्द होतो.',
    criticalWarning: '१ किंवा २ गुंठे प्लॉट खरेदी करताना तो शेतजमीन नसावा; सक्षम प्राधिकरणाने मंजूर केलेला NA किंवा अकृषिक लेआउट असावा.',
    authority: 'नोंदणी महानिरीक्षक (IGR) व महसूल अधिकारी'
  },
  {
    ruleCode: 'MLRC-1966-NA-RULES',
    actTitle: 'महाराष्ट्र जमीन महसूल संहिता, १९६६ (MLRC 1966)',
    applicableSections: 'कलम ४२, ४२A, ४२B, ४२C, ४२D (अकृषिक वापर व डीम्ड NA)',
    keyMarathiSummary: 'शेतजमिनीवर घरे, उद्योग किंवा दुकाने बांधण्यासाठी जिल्हाधिकारी किंवा सक्षम प्राधिकरणाची अकृषिक (NA) परवानगी अनिवार्य असते. वर्ग १ जमिनीसाठी आता डीम्ड एनए (Deemed NA) प्रक्रिया लागू आहे.',
    criticalWarning: 'एनए न करता शेतजमिनीवर केलेले बांधकाम महसूल कायद्यानुसार अनधिकृत ठरून ४० पट महसूल दंड होऊ शकतो.',
    authority: 'जिल्हाधिकारी / उपविभागीय अधिकारी (SDO)'
  },
  {
    ruleCode: 'DUE-DILIGENCE-30YR',
    actTitle: 'Transfer of Property Act, 1882 & Registration Act, 1908',
    applicableSections: 'कलम ५४ (खरेदीखत नोंदणी) व कलम १७',
    keyMarathiSummary: 'जमीन खरेदी करताना मागील ३० वर्षांचा सर्च रिपोर्ट, इंडेक्स २, मूळ फेरफार नोंदींची साखळी, प्रत्यक्ष जागेचा ताबा आणि स्थानिक वर्तमानपत्रात जाहीर नोटीस देणे अनिवार्य आहे. केवळ नोटरी खरेदीखत कायद्याने पूर्णपणे अवैध आहे.',
    criticalWarning: 'नोंदणीकृत खरेदीखताशिवाय १०० रुपयांच्या स्टॅम्पवर केलेला खरेदी करार कोर्टात मालकी हक्क सिद्ध करू शकत नाही.',
    authority: 'दुय्यम निबंधक कार्यालय (Sub-Registrar)'
  },
  {
    ruleCode: 'ROAD-DISPUTE-SEC5',
    actTitle: 'मामलेदार कोर्ट ऍक्ट, १९०६ (Mamlatdars Courts Act, 1906)',
    applicableSections: 'कलम ५ आणि MLRC कलम १४३',
    keyMarathiSummary: 'शेतात जाण्याचा पारंपरिक वहिवाटीचा रस्ता शेजाऱ्याने अडवला असल्यास तहसीलदारांकडे कलम ५ अन्वये अर्ज करून तात्काळ रस्ता मोकळा करून मिळवता येतो.',
    criticalWarning: 'रस्ता अडवल्याची तारीख आणि घटना सिद्ध करण्यासाठी तलाठ्याचा पंचनामा व फोटो तात्काळ जोडावेत.',
    authority: 'तहसीलदार कार्यालय'
  }
];

// Criminal Law Transition Matrix (CrPC/IPC -> BNSS/BNS)
export const CRIMINAL_LAW_TRANSITION = [
  {
    oldLaw: 'CrPC 1973 - Section 154',
    newLaw: 'BNSS 2023 - Section 173',
    subjectMarathi: 'माहिती नोंदवणे (FIR), Zero FIR आणि Electronic e-FIR तरतूद',
    status: 'In Force since 1 July 2024'
  },
  {
    oldLaw: 'CrPC 1973 - Section 41A',
    newLaw: 'BNSS 2023 - Section 35(3)',
    subjectMarathi: '7 वर्षांखालील शिक्षेच्या गुन्ह्यांत अटकेपूर्वी नोटीस बजावणे बंधनकारक',
    status: 'In Force since 1 July 2024'
  },
  {
    oldLaw: 'CrPC 1973 - Section 156(3)',
    newLaw: 'BNSS 2023 - Section 175(3)',
    subjectMarathi: 'मॅजिस्ट्रेट कोर्टातून पोलिसांना FIR नोंदवण्याचे आदेश देण्याची प्रक्रिया',
    status: 'In Force since 1 July 2024'
  },
  {
    oldLaw: 'CrPC 1973 - Section 125',
    newLaw: 'BNSS 2023 - Section 144',
    subjectMarathi: 'पत्नी, मुले व वृद्ध आई-वडिलांच्या पोटगीचा अधिकार',
    status: 'In Force since 1 July 2024'
  },
  {
    oldLaw: 'IPC 1860 - Section 420',
    newLaw: 'BNS 2023 - Section 318',
    subjectMarathi: 'फसवणूक आणि बेईमानीने मालमत्ता देण्यास प्रवृत्त करणे (Cheating)',
    status: 'In Force since 1 July 2024'
  },
  {
    oldLaw: 'IPC 1860 - Section 506',
    newLaw: 'BNS 2023 - Section 351',
    subjectMarathi: 'गुन्हेगारी स्वरूपाची धमकी (Criminal Intimidation)',
    status: 'In Force since 1 July 2024'
  }
];

export function getAllLegalReferences() {
  return db.prepare('SELECT * FROM legal_references ORDER BY category ASC, id ASC').all();
}

export function addLegalReference(refData) {
  const stmt = db.prepare(`
    INSERT INTO legal_references (
      code_name, act_title, category, section_or_rule, key_provision,
      practical_marathi_explanation, official_url, last_verified_date, is_amended, amendment_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    refData.code_name,
    refData.act_title,
    refData.category,
    refData.section_or_rule,
    refData.key_provision,
    refData.practical_marathi_explanation,
    refData.official_url,
    refData.last_verified_date || new Date().toISOString().split('T')[0],
    refData.is_amended ? 1 : 0,
    refData.amendment_notes || ''
  );

  return { success: true, id: result.lastInsertRowid };
}

export function getUnverifiedClaims() {
  return db.prepare(`
    SELECT id, day_number, title, applicable_law, applicable_section, verification_status, verification_notes
    FROM reels
    WHERE verification_status != 'Verified'
    ORDER BY day_number ASC
  `).all();
}
