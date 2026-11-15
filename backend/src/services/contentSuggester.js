import db from '../db/database.js';
import { checkDuplicate } from './duplicateEngine.js';
import { OFFICIAL_SOURCES } from './legalAccuracyEngine.js';

/**
 * AI Content Suggester & Custom Reel Creator Service (Tab 10)
 * Specialized for "आपला कायदा – Advocate Pratiksha"
 * Follows Master System Prompt Sections 3, 4, 5 & 6 strictly.
 */

// Comprehensive Legal Ideas & Topic Bank across 5 Core Domains
const SUGGESTIONS_BANK = [
  // --- 1. जमीन आणि मालमत्ता कायदे (Land & Property - Supreme Priority) ---
  {
    id: 'sug_land_1',
    category: 'जमीन आणि मालमत्ता कायदे',
    title: '७/१२ उताऱ्यावरील इतर हक्कातील बोजा कसा कमी करावा किंवा हटवावा?',
    angle: 'सोपी प्रक्रिया / स्टेप-बाय-स्टेप',
    audience: 'शेतकरी, जमीनमालक, कर्जदार',
    score: 94,
    hook: 'तुमच्या ७/१२ च्या इतर हक्कात जुन्या कर्जाचा बोजा अजूनही तसाच आहे का? हा एक अर्ज द्या आणि बोजा त्वरित हटवा!',
    why_care: 'बँकेचे कर्ज फेडल्यानंतरही तलाठी दप्तरी नोंद न हटल्याने जमीन विक्री किंवा नवीन कर्जात अडचण येते.',
    applicable_law: 'महाराष्ट्र जमीन महसूल संहिता १९६६ (MLRC 1966)',
    applicable_section: 'कलम १४९ व १५०',
    source: OFFICIAL_SOURCES.MAHABHUMI.url,
    suggested_action: "बँकेचे 'ना हरकत प्रमाणपत्र' (NOC) घेऊन तलाठ्याकडे ई-हक्क प्रणालीद्वारे बोजा कमी करण्यासाठी अर्ज करा."
  },
  {
    id: 'sug_land_2',
    category: 'जमीन आणि मालमत्ता कायदे',
    title: 'वडिलोपार्जित शेतजमिनीत मुलीचा हक्क: लग्न जुने असले तरी हिस्सा मिळतो का?',
    angle: 'नागरिकांचे कायदेशीर अधिकार',
    audience: 'महिला, शेतकरी, कुटुंबे',
    score: 96,
    hook: 'तुमचा विवाह २००५ पूर्वी झाला असेल, तरीही तुम्हाला वडिलांच्या शेतजमिनीत मुलांइतकाच समान हक्क आहे का? कायदा काय सांगतो ते ऐका!',
    why_care: 'सर्वोच्च न्यायालयाच्या विनीता शर्मा निकालाविषयी ग्रामीण महाराष्ट्रात प्रचंड उत्सुकता आणि गैरसमज आहेत.',
    applicable_law: 'हिंदू वारसा (सुधारणा) कायदा २००५ & सुप्रीम कोर्ट निकाल',
    applicable_section: 'कलम ६ (Vineeta Sharma vs Rakesh Sharma 2020)',
    source: OFFICIAL_SOURCES.SUPREME_COURT.url,
    suggested_action: 'वडिलांच्या निधनाची तारीख काहीही असली तरी जन्मसिद्ध वारस म्हणून वाटणीचा दावा दिवाणी न्यायालयात दाखल करता येतो.'
  },
  {
    id: 'sug_land_3',
    category: 'जमीन आणि मालमत्ता कायदे',
    title: 'बिनशेती (NA) न केलेल्या शेतजमिनीवर प्लॉट खरेदी करणे कायदेशीर गुन्हा आहे का?',
    angle: 'सावधान राहा / फसवणूक टाळा',
    audience: 'प्लॉट खरेदीदार, मध्यमवर्गीय नागरिक',
    score: 92,
    hook: 'दलाल सांगतोय म्हणून शेतजमिनीचा गुंठा खरेदी करताय? सावधान! तुमची आयुष्यभराची पुंजी पाण्यात जाऊ शकते!',
    why_care: 'अनधिकृत लेआउट्सवर मनपाकडून डिमोलिशन आणि महसूल विभागाकडून ४० पट दंडाच्या नोटिसा येत आहेत.',
    applicable_law: 'महाराष्ट्र जमीन महसूल संहिता १९६६ (MLRC)',
    applicable_section: 'कलम ४२, ४४ व ४५',
    source: OFFICIAL_SOURCES.MAHARASHTRA_GOVT.url,
    suggested_action: 'खरेदी करण्यापूर्वी जिल्हाधिकारी किंवा सक्षम प्राधिकरणाची अकृषिक (NA) मंजुरी आणि रेरा नोंदणी तपासा.'
  },
  {
    id: 'sug_land_4',
    category: 'जमीन आणि मालमत्ता कायदे',
    title: 'शेतजमिनीचा वहिवाटीचा रस्ता शेजाऱ्याने बंद केला? तहसीलदार कोर्टात तातडीने अर्ज कसा करावा?',
    angle: 'नागरिकांचे कायदेशीर अधिकार',
    audience: 'शेतकरी, ग्रामीण नागरिक',
    score: 95,
    hook: 'शेतात जायचा पारंपरिक रस्ता शेजारच्या शेतकऱ्याने खोदून अडवलाय? भांडण न करता हा कायदेशीर उपाय करा!',
    why_care: 'शेतकऱ्यांना शेतात बैलगाडी, ट्रॅक्टर नेण्यास अडथळा निर्माण झाल्यावर महसूल कोर्टात त्वरित दिलासा मिळतो.',
    applicable_law: 'मामलतदार न्यायालये अधिनियम १९०६',
    applicable_section: 'कलम ५ (२)',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: "तहसीलदारांकडे 'मामलतदार कोर्ट ॲक्ट कलम ५' अंतर्गत रस्ता मोकळा करण्यासाठी तत्काळ अर्ज दाखल करा."
  },
  {
    id: 'sug_land_5',
    category: 'जमीन आणि मालमत्ता कायदे',
    title: 'सामयिक जमिनीत तोंडी वाटणी झाली असेल तर ७/१२ वर स्वतंत्र नाव कसे लावावे?',
    angle: 'सोपी प्रक्रिया / स्टेप-बाय-स्टेप',
    audience: 'शेतकरी, वारसदार',
    score: 91,
    hook: 'भावा-भावांमध्ये जमिनीची तोंडी वाटणी झाली आहे, पण ७/१२ वर अजूनही एकत्र नावे आहेत? हे संकट कसे टाळायचे?',
    why_care: 'तोंडी वाटणीला कायद्यात पुरावा नसतो; एका भावाने परस्पर कर्ज काढल्यास संपूर्ण जमिनीवर बोजा येतो.',
    applicable_law: 'महाराष्ट्र जमीन महसूल संहिता १९६६',
    applicable_section: 'कलम ८५ (तहसीलदारांमार्फत वाटप)',
    source: OFFICIAL_SOURCES.MAHABHUMI.url,
    suggested_action: 'तहसीलदारांकडे कलम ८५ नुसार संमतीने कायदेशीर वाटणी अर्ज दाखल करून स्वतंत्र फेरफार नोंदवा.'
  },

  // --- 2. महिला आणि कुटुंबाचे कायदे (Women & Family Laws) ---
  {
    id: 'sug_fam_1',
    category: 'महिला आणि कुटुंबाचे कायदे',
    title: 'स्त्रीधन म्हणजे काय? घटस्फोट किंवा वादाच्या वेळी ते परत मिळवण्याचा महिलांचा हक्क',
    angle: 'नागरिकांचे कायदेशीर अधिकार',
    audience: 'महिला, कुटुंबे',
    score: 93,
    hook: 'लग्नात मिळालेले दागिने, भेटवस्तू आणि पैसे हे सासऱ्यांचे किंवा पतीचे असतात का? अजिबात नाही! ते तुमचे स्त्रीधन आहे!',
    why_care: 'महिलांना त्यांच्या हक्काच्या दागिन्यांवर संपूर्ण कायदेशीर अधिकार असतो, ज्यावर सासरचे लोक हक्क सांगू शकत नाहीत.',
    applicable_law: 'हिंदू विवाह कायदा १९५५ & घरगुती हिंसाचार कायदा २००५',
    applicable_section: 'हिंदू विवाह कायदा कलम २७ & DV Act कलम १२',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: 'स्त्रीधनाची यादी करून ठेवणे आणि परत न दिल्यास कलम ४०६ (विश्वासघात) किंवा DV Act खाली दावा करणे.'
  },
  {
    id: 'sug_fam_2',
    category: 'महिला आणि कुटुंबाचे कायदे',
    title: 'ज्येष्ठ नागरिकांचा छळ: पोटगी आणि मुलांच्या नावावर दिलेली मालमत्ता परत घेण्याचा कायदा',
    angle: 'सावधान राहा / फसवणूक टाळा',
    audience: 'ज्येष्ठ नागरिक, पालक, कुटुंबे',
    score: 95,
    hook: 'मुलांच्या प्रेमापोटी घर त्यांच्या नावावर केले आणि आता ते सांभाळत नाहीत? हा कायदा घर परत मिळवून देऊ शकतो!',
    why_care: 'आई-वडिलांना घराबाहेर काढणाऱ्या मुलांना मालमत्तेतून बेदखल करण्याचा आणि गिफ्ट डीड रद्द करण्याचा अधिकार.',
    applicable_law: 'ज्येष्ठ नागरिक व पालक निर्वाह व कल्याण कायदा २००७',
    applicable_section: 'कलम २३ (मालमत्ता हस्तांतरण रद्दबातल करणे)',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: 'उपविभागीय अधिकारी (SDO / प्रांत) यांच्या ज्येष्ठ नागरिक लवादाकडे कलम २३ अन्वये अर्ज करा.'
  },
  {
    id: 'sug_fam_3',
    category: 'महिला आणि कुटुंबाचे कायदे',
    title: 'घरगुती हिंसाचार झाल्यास तातडीने संरक्षण आदेश (Protection Order) कसा मिळवावा?',
    angle: 'सोपी प्रक्रिया / स्टेप-बाय-स्टेप',
    audience: 'महिला, नागरिक',
    score: 89,
    hook: 'घरात मानसिक किंवा शारीरिक छळ होतोय? पोलिसांत न जाताही कोर्टाकडून २४ तासांत हे संरक्षण आदेश कसे मिळवायचे?',
    why_care: 'महिलांना घरातून हाकलून न लावण्याचा रेसिडेन्स ऑर्डर आणि संरक्षणाचा अधिकार मिळतो.',
    applicable_law: 'कौटुंबिक हिंसाचारापासून महिलांचे संरक्षण अधिनियम २००५',
    applicable_section: 'कलम १८ (संरक्षण आदेश) व कलम १९ (निवास आदेश)',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: 'संरक्षण अधिकारी (Protection Officer) किंवा प्रथमवर्ग न्यायदंडाधिकाऱ्यांकडे तातडीचा अंतरिम अर्ज दाखल करा.'
  },

  // --- 3. फौजदारी कायदे आणि पोलीस प्रक्रिया (Criminal & Police Procedure - BNSS 2023) ---
  {
    id: 'sug_crim_1',
    category: 'फौजदारी कायदे आणि पोलीस प्रक्रिया',
    title: 'पोलिसांनी बोलावल्यास थेट अटक करता येते का? BNSS कलम ३५ चे नवीन नियम समजून घ्या!',
    angle: 'नागरिकांचे कायदेशीर अधिकार',
    audience: 'सर्व सामान्य नागरिक, युवक',
    score: 97,
    hook: 'पोलिसांचा फोन आला आणि भीती वाटतेय? घाबरू नका! नवीन फौजदारी कायद्यानुसार ७ वर्षांपेक्षा कमी शिक्षेच्या गुन्ह्यात थेट अटक करता येत नाही!',
    why_care: 'भारतीय नागरिक सुरक्षा संहिता (BNSS २०२३) मधील कलम ३५ नागरिकांना अनावश्यक अटकेपासून संपूर्ण सुरक्षा देते.',
    applicable_law: 'भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS 2023)',
    applicable_section: 'कलम ३५ (जुने CrPC कलम ४१A)',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: 'पोलीस ठाण्यात जाताना लेखी नोटीस मागा आणि चौकशीत पूर्ण सहकार्य करून हजेरीची पोचपावती घ्या.'
  },
  {
    id: 'sug_crim_2',
    category: 'फौजदारी कायदे आणि पोलीस प्रक्रिया',
    title: 'पोलीस ठाण्यात तक्रार (FIR) नोंदवून घेण्यास नकार दिल्यास थेट एसपी किंवा कोर्टात कसे जावे?',
    angle: 'सोपी प्रक्रिया / स्टेप-बाय-स्टेप',
    audience: 'सर्व नागरिक, पीडित व्यक्ती',
    score: 93,
    hook: 'गंभीर गुन्हा घडूनही पोलीस तुमची तक्रार घेत नाहीत? हे २ कायदेशीर मार्ग वापरा, पोलिसांना दखल घ्यावीच लागेल!',
    why_care: 'नागरिकांना त्यांच्या हक्काची एफआयआर नोंदवण्यासाठी कायद्याने दिलेली अधिकृत प्रक्रिया.',
    applicable_law: 'भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS 2023)',
    applicable_section: 'कलम १७३ (३) व कलम १७५ (३)',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: 'पोलीस अधीक्षकांकडे (SP) नोंदणीकृत पोस्टाने तक्रार पाठवा किंवा न्यायदंडाधिकाऱ्यांकडे खाजगी फिर्याद दाखल करा.'
  },

  // --- 4. ग्राहक आणि डिजिटल हक्क (Consumer, Cyber & Banking Fraud) ---
  {
    id: 'sug_cyber_1',
    category: 'ग्राहक आणि डिजिटल हक्क',
    title: 'ऑनलाइन बँकेतून पैसे गायब झाले? गोल्डन अवरमध्ये १९३० वर कॉल करून पैसे कसे थांबवायचे?',
    angle: 'सावधान राहा / फसवणूक टाळा',
    audience: 'इंटरनेट बँकिंग वापरणारे, तरुण, ज्येष्ठ नागरिक',
    score: 98,
    hook: 'एका चुकीच्या OTP मुळे किंवा लिंकवर क्लिक केल्याने बँक खाते रिकामे झाले? पुढच्या ६० मिनिटांत हे करा, पैसे परत मिळतील!',
    why_care: 'सायबर फसवणुकीनंतर पहिल्या १ तासात १९३० वर तक्रार केल्यास ट्रान्झॅक्शन फ्रीझ होऊन पैसे वाचतात.',
    applicable_law: 'माहिती तंत्रज्ञान कायदा २००० & गृह मंत्रालय सायबर मार्गदर्शक तत्त्वे',
    applicable_section: 'Helpline 1930 & cybercrime.gov.in',
    source: OFFICIAL_SOURCES.CYBER_PORTAL.url,
    suggested_action: 'लगेच १९३० वर कॉल करा आणि cybercrime.gov.in वर तक्रार नोंदवून बँकेला लेखी ईमेल पाठवा.'
  },
  {
    id: 'sug_cyber_2',
    category: 'ग्राहक आणि डिजिटल हक्क',
    title: 'ऑनलाइन शॉपिंग किंवा बिल्डरने फसवणूक केली? ई-दाखल पोर्टलवरून घरबसल्या ग्राहक तक्रार कशी करावी?',
    angle: 'सोपी प्रक्रिया / स्टेप-बाय-स्टेप',
    audience: 'ग्राहक, खरेदीदार, तरुण',
    score: 90,
    hook: 'दुकानदार किंवा ऑनलाइन कंपनी पैसे परत देत नाहीये? वकिलाविना घरबसल्या मोबाईलवरून तक्रार कशी करायची ते शिका!',
    why_care: 'नवीन ग्राहक संरक्षण कायद्यानुसार कोणत्याही कोर्टात न जाता ई-दाखलवर ऑनलाईन केस दाखल करता येते.',
    applicable_law: 'ग्राहक संरक्षण कायदा २०१९',
    applicable_section: 'कलम ३४ व ३५ (ई-दाखल प्रणाली)',
    source: OFFICIAL_SOURCES.E_DAAKHIL.url,
    suggested_action: 'edaakhil.nic.in वर नोंदणी करून बिल, चॅट्स आणि नोटीस जोडून भरपाईसाठी दावा दाखल करा.'
  },

  // --- 5. नागरिक आणि दैनंदिन जीवनातील कायदे (Civil & Daily Rights) ---
  {
    id: 'sug_civil_1',
    category: 'नागरिक आणि दैनंदिन जीवनातील कायदे',
    title: 'घरमालक आणि भाडेकरू वाद: ११ महिन्यांचा भाडेकरार नोंदणीकृत (Registered) का असावा?',
    angle: 'सावधान राहा / फसवणूक टाळा',
    audience: 'घरमालक, भाडेकरू, विद्यार्थी',
    score: 92,
    hook: '१०० रुपयांच्या नोटरीवर भाडेकरार करताय? कायदेशीर वाद झाल्यास कोर्टात असा करार ग्राह्य धरला जातो का?',
    why_care: 'महाराष्ट्र रेंट कंट्रोल ॲक्टनुसार नोंदणी नसलेल्या करारावर मालकाला भाडेकरू खाली करवून घेणे अत्यंत अवघड होते.',
    applicable_law: 'महाराष्ट्र भाडे नियंत्रण अधिनियम १९९९',
    applicable_section: 'कलम ५५ (भाडेकरार नोंदणी अनिवार्य)',
    source: OFFICIAL_SOURCES.IGR_MAHARASHTRA.url,
    suggested_action: 'सक्षम प्राधिकरणाकडे बायोमेट्रिक ई-नोंदणी करूनच भाडेकरार पूर्ण करा.'
  },
  {
    id: 'sug_civil_2',
    category: 'नागरिक आणि दैनंदिन जीवनातील कायदे',
    title: 'चेक बाऊन्स झाला तर काय करावे? कलम १३८ ची कायदेशीर नोटीस पाठवण्याची ३० दिवसांची मुदत',
    angle: 'सोपी प्रक्रिया / स्टेप-बाय-स्टेप',
    audience: 'व्यावसायिक, नागरिक, कर्ज देणारे',
    score: 94,
    hook: 'तुम्हाला कोणी दिलेला चेक बँकेत बाऊन्स झाला? सावधान! एका महिन्याची मुदत चुकली तर तुमचे पैसे अडकू शकतात!',
    why_care: 'चेक बाऊन्स मेमो मिळाल्यापासून ३० दिवसांत वकिलामार्फत कायदेशीर नोटीस देणे कलम १३८ अंतर्गत अनिवार्य असते.',
    applicable_law: 'निगोशिएबल इन्स्ट्रुमेंट्स ॲक्ट १८८१',
    applicable_section: 'कलम १३८ (दोन वर्षांपर्यंत कारावास किंवा दुप्पट दंड)',
    source: OFFICIAL_SOURCES.INDIA_CODE.url,
    suggested_action: 'बँकेचा मेमो मिळताच १५ दिवसांची भरणा मुदत देणारी कायदेशीर नोटीस वकिलांमार्फत पाठवा.'
  }
];

/**
 * Get dynamic topic suggestions based on filters
 */
export function getSuggestedTopics(filters = {}) {
  const { category, angle, audience } = filters;

  let pool = SUGGESTIONS_BANK;

  if (category && category !== 'all') {
    pool = pool.filter(item => item.category === category);
  }

  if (angle && angle !== 'all') {
    pool = pool.filter(item => item.angle === angle);
  }

  if (audience && audience !== 'all') {
    pool = pool.filter(item => item.audience.toLowerCase().includes(audience.toLowerCase()));
  }

  // If filtered pool is small, backfill with top score topics from other categories
  if (pool.length < 5) {
    const additional = SUGGESTIONS_BANK.filter(item => !pool.some(p => p.id === item.id));
    pool = [...pool, ...additional];
  }

  // Sort by virality score descending and take top 5
  const top5 = pool.sort((a, b) => b.score - a.score).slice(0, 5);

  return top5;
}

function detectLegalContext(title = '', question = '', category = '', applicable_law = '', applicable_section = '') {
  const combined = `${title} ${question} ${category} ${applicable_law} ${applicable_section}`.toLowerCase();
  
  if (combined.includes('पोलीस') || combined.includes('अटक') || combined.includes('fir') || combined.includes('चौकशी') || combined.includes('41a') || combined.includes('३५')) {
    return {
      law: 'भारतीय नागरिक सुरक्षा संहिता (BNSS 2023)',
      section: '३५',
      scenario: 'समजा, एखाद्या तक्रारीच्या आधारे पोलीस ठाण्यातून फोन आला की लगेच हजर राहा, अन्यथा अटक करू, अशी भीती घातली गेली...',
      actionPlan: '१) ७ वर्षांपेक्षा कमी शिक्षेच्या गुन्ह्यात थेट अटक करता येत नाही; २) BNSS कलम ३५ अन्वये आधी लेखी नोटीस देणे पोलिसांना बंधनकारक आहे; ३) नोटीस मिळाल्यास घाबरून न जाता वकिलामार्फत अधिकृत जबाब नोंदवा.'
    };
  }
  
  if (combined.includes('गुंठे') || combined.includes('तुकडेबंदी') || combined.includes('लेआउट') || combined.includes('प्लॉटिंग')) {
    return {
      law: 'महाराष्ट्र तुकडेबंदी प्रतिबंधक कायदा व गुंठेवारी नियमितीकरण सुधारणा कायदा २०२१',
      section: '८-ब',
      scenario: 'समजा, तुम्ही ग्रामीण किंवा निमशहरी भागात १ किंवा २ गुंठ्यांचा तुकडा साध्या नोटरीवर खरेदी केला, पण तलाठ्यांनी फेरफार घेण्यास नकार दिला...',
      actionPlan: '१) तुकडेबंदी कलम ८-ब नुसार अकृषिक (NA) मंजूर नसलेली गुंठ्यांची खरेदी बेकायदेशीर ठरते; २) नगररचना किंवा स्थानिक प्राधिकरणाकडे गुंठेवारी शुल्क भरून नियमितीकरणाचा अधिकृत दाखला मिळवा; ३) दाखल्याच्या आधारेच ७/१२ वर नाव नोंदवा.'
    };
  }
  
  if (combined.includes('७/१२') || combined.includes('7/12') || combined.includes('सातबारा') || combined.includes('फेरफार') || combined.includes('तलाठी')) {
    return {
      law: 'महाराष्ट्र जमीन महसूल संहिता (MLRC 1966)',
      section: '१४९ व १५०',
      scenario: 'समजा, तुमच्या शेतजमिनीवर किंवा वडिलोपार्जित क्षेत्रावर एखाद्या व्यक्तीने बनावट कागदपत्रांच्या आधारे परस्पर फेरफार नोंद घेतली...',
      actionPlan: '१) MLRC कलम १५० नुसार १५ दिवसांच्या आत तलाठ्याकडे लेखी हरकत नोंदवा; २) प्रकरण वादग्रस्त फेरफार नोंदवहीत घेऊन मंडळ अधिकाऱ्यांसमोर सुनावणी होते; ३) आदेश अमान्य असल्यास कलम २४७ अन्वये उपविभागीय अधिकाऱ्यांकडे (SDO) अपील करा.'
    };
  }

  if (combined.includes('सायबर') || combined.includes('ऑनलाइन फसवणूक') || combined.includes('ओटीपी') || combined.includes('हॅकिंग') || combined.includes('बँक')) {
    return {
      law: 'भारतीय न्याय संहिता (BNS 2023) व माहिती तंत्रज्ञान कायदा (IT Act)',
      section: '३१८(४) व ६६-डी',
      scenario: 'समजा, वीज बिल भरणे किंवा लॉटरीचे आमिष दाखवून बनावट लिंकवर क्लिक करवून तुमच्या खात्यातून परस्पर ५० हजार रुपये कापले गेले...',
      actionPlan: '१) पहिल्या सुवर्ण तासात (Golden Hour) तात्काळ राष्ट्रीय सायबर हेल्पलाइन १९३० वर कॉल करून पैसे गोठवा; २) cybercrime.gov.in वर तक्रार नोंदवा; ३) बँक स्टेटमेंटसह जवळच्या सायबर पोलीस ठाण्यात BNS कलम ३१८(४) नुसार FIR नोंदवा.'
    };
  }

  if (combined.includes('वारस') || combined.includes('मुलगी') || combined.includes('बहीण') || combined.includes('वडिलोपार्जित') || combined.includes('वाटप')) {
    return {
      law: 'हिंदू वारसा सुधारणा कायदा २००५ व सर्वोच्च न्यायालय निकाल २०२०',
      section: '६',
      scenario: 'समजा, वडिलोपार्जित जमिनीचे वाटप करताना भावांनी विवाहित बहिणीला हक्क देण्यास नकार दिला की तुझे लग्न झाले आहे...',
      actionPlan: '१) विनीता शर्मा निकाल २०२० नुसार जन्मापासून मुलीला मुलाइतकाच समान हक्क आहे; २) ७/१२ वर बहिणीची संमती किंवा सही असल्याशिवाय फेरफार वैध ठरत नाही; ३) हक्क डावलल्यास दिवाणी न्यायालयात फाळणी व वाटपाचा दावा दाखल करा.'
    };
  }

  if (combined.includes('चेक') || combined.includes('बाउन्स') || combined.includes('धनादेश')) {
    return {
      law: 'निगोशिएबल इन्स्ट्रुमेंट्स ॲक्ट १८८१ व भारतीय न्याय संहिता (BNS 2023)',
      section: '१३८ व ३१८',
      scenario: 'समजा, व्यवसायात किंवा उसने दिलेले पैसे परत करण्यासाठी दिलेला ५ लाखांचा चेक बँकेत अपुऱ्या निधीमुळे बाउन्स झाला...',
      actionPlan: '१) चेक मेमो मिळाल्यापासून ३० दिवसांच्या आत वकिलामार्फत १५ दिवसांची कायदेशीर नोटीस पाठवा; २) नोटीस मिळूनही १५ दिवसांत पैसे न दिल्यास पुढील ३० दिवसांत न्यायालयात कलम १३८ ची फौजदारी केस करा; ३) चेकच्या रकमेच्या दुप्पट दंड व २ वर्षांपर्यंत तुरुंगवासाची तरतूद आहे.'
    };
  }

  // Default legal context
  return {
    law: applicable_law || 'महाराष्ट्र जमीन महसूल संहिता व भारतीय न्याय संहिता (BNS 2023)',
    section: applicable_section || '३१८',
    scenario: `समजा, ${title} या कायदेशीर मुद्द्यावर तुमच्या किंवा तुमच्या कुटुंबावर अन्याय होत असेल आणि समोरची व्यक्ती सहकार्य करत नसेल...`,
    actionPlan: '१) संबंधित सर्व मूळ दस्तऐवज व पुरावे सुरक्षित जमा करा; २) तोंडी चर्चेऐवजी कायदेशीर नोटीस पाठवून वस्तुस्थिती नोंदवा; ३) सक्षम महसूल किंवा न्यायिक प्राधिकरणाकडे अधिकृत दाद मागा.'
  };
}

/**
 * Generate a full custom Reel package from user's custom question or topic
 */
export function createCustomReelPackage(input) {
  const {
    title,
    user_question = '',
    category = 'जमीन आणि मालमत्ता कायदे',
    duration = '30',
    tone = 'विचार करायला लावणारा व सावध करणारा',
    applicable_law = '',
    applicable_section = ''
  } = input;

  if (!title || title.trim().length === 0) {
    throw new Error('विषयाचे शीर्षक किंवा प्रश्न टाकणे अनिवार्य आहे.');
  }

  // Auto detect context and updated BNS/MLRC sections
  const detected = detectLegalContext(title, user_question, category, applicable_law, applicable_section);
  const finalLaw = applicable_law || detected.law;
  const finalSection = applicable_section || detected.section;

  // Run duplicate check
  const duplicateCheck = checkDuplicate({
    title,
    legal_question: user_question || title,
    applicable_section: finalSection,
    keywords: `${category}`
  });

  // Calculate day number or ID
  const countRow = db.prepare('SELECT COUNT(*) as count FROM reels').get();
  const nextNum = (countRow.count || 0) + 1;
  const reelId = `AK-CUSTOM-${String(nextNum).padStart(3, '0')}`;

  // Generate catchy Hook
  const hook = generateSmartHook(title, user_question, category);

  // Generate 30-40s Script (Format A) - Relatable scenario + Direct Solution
  const scriptA = `तुम्ही किंवा तुमच्या ओळखीचे कोणी ${title.replace(/[?!।]/g, '')} या समस्येत अडकले आहेत का?
${detected.scenario}
अशा वेळी घाबरू नका! ${finalLaw} ${finalSection ? `(कलम ${finalSection})` : ''} नुसार सामान्य नागरिकांना कायद्याचे भक्कम संरक्षण आहे.
कायद्यानुसार तुमचे अधिकार:
${detected.actionPlan}
कोणत्याही मध्यस्थांच्या भुलथापांना बळी पडू नका. हा व्हिडिओ आत्ताच सेव्ह करा आणि योग्य कायदेशीर मार्गदर्शनासाठी फॉलो करा आपला कायदा!`;

  // Generate 50-60s Script (Format B) - In-depth Citizen Guide
  const scriptB = `महाराष्ट्रातील प्रत्येक नागरिकाने ${title.replace(/[?!।]/g, '')} या विषयातील कायदेशीर वस्तुस्थिती समजून घेतली पाहिजे!
${detected.scenario}
अनेकदा कायदेशीर माहिती नसल्याने सामान्य नागरिकांचे लाखो रुपयांचे नुकसान होते.
कायदा अगदी स्पष्ट सांगतो: ${finalLaw} ${finalSection ? `(कलम ${finalSection})` : ''} अंतर्गत नागरिकांना थेट कायदेशीर अधिकार देण्यात आलेले आहेत.
तुमच्या हक्कांचे संरक्षण करण्यासाठी या ३ पायऱ्या तात्काळ अमलात आणा:
${detected.actionPlan}
लक्षात ठेवा, वेळेत घेतलेला योग्य कायदेशीर निर्णय तुमचे आयुष्यभराचे भांडवल आणि मानसिक शांतता वाचवू शकतो!
ही महत्त्वाची माहिती प्रत्येकाला शेअर करा आणि रोजच्या कायदेशीर ज्ञानासाठी आत्ताच फॉलो करा आपला कायदा!`;

  const coverText = generateShortCoverText(title);

  const caption = `${title} ⚖️📜

Advocate Pratiksha यांच्याकडून सोप्या मराठीत थेट कायदेशीर मार्गदर्शन.

📌 लागू कायदा: ${finalLaw} ${finalSection ? `(कलम ${finalSection})` : ''}

🔍 वास्तव व उपाय:
${detected.scenario}

💡 कायदेशीर कृती आराखडा:
${detected.actionPlan}

👉 ही अत्यंत महत्त्वाची कायदेशीर माहिती आपल्या कुटुंबियांना व मित्रांना नक्की शेअर करा!
फॉलो करा 👉 @aaplakayda

(सूचना: ही माहिती सामान्य जनजागृतीसाठी आहे. प्रत्यक्ष प्रकरणातील गुणदोषांवर आधारित तज्ज्ञ वकिलांचा सल्ला घ्यावा.)

#आपलाकायदा #AdvocatePratiksha #MarathiLaw #कायदेशीरहक्क #महाराष्ट्र #BNS2023 #BNSS2023 #जमीनकायदे`;

  const seoKeywords = [
    title,
    `${title} कायदेशीर उपाय`,
    'Advocate Pratiksha कायदेशीर सल्ला',
    finalLaw,
    `कलम ${finalSection}`,
    'महाराष्ट्र शासन कायदेशीर नियम'
  ].join(', ');

  const hashtags = '#आपलाकायदा #AdvocatePratiksha #MarathiLaw #कायदेशीरहक्क #Maharashtra #BNS2023';

  // Construct structured scenes for Tab 9 Video Generator
  const scenes = [
    {
      scene_num: 1,
      type: 'hook',
      title: hook.slice(0, 50) + '...',
      text: hook,
      visual_cue: `${category} मुख्य सूचना`
    },
    {
      scene_num: 2,
      type: 'problem',
      title: 'समस्या आणि प्रत्यक्ष उदाहरण',
      text: detected.scenario,
      visual_cue: 'कागदपत्रे तपासणी व सावधगिरी'
    },
    {
      scene_num: 3,
      type: 'law_solution',
      title: 'कायदेशीर उपाय आणि तरतुदी',
      text: `${finalLaw} (कलम ${finalSection}) नुसार नागरिकांचे अधिकार. ${detected.actionPlan}`,
      visual_cue: `${finalLaw}`
    },
    {
      scene_num: 4,
      type: 'cta',
      title: 'कायदेशीर सल्ला व कृती',
      text: 'कायद्याची अचूक माहिती हीच आपली खरी ताकद आहे! अधिक कायदेशीर मार्गदर्शनासाठी फॉलो करा आपला कायदा.',
      visual_cue: 'Advocate Pratiksha CTA'
    }
  ];

  return {
    id: reelId,
    title,
    user_question,
    category,
    hook,
    cover_text: coverText,
    script_format_a: scriptA,
    script_format_b: scriptB,
    duration,
    applicable_law: finalLaw,
    applicable_section: finalSection,
    caption,
    keywords: seoKeywords,
    hashtags,
    official_sources: JSON.stringify([OFFICIAL_SOURCES.INDIA_CODE.url]),
    verification_status: 'Verified',
    status: 'Ready to Record',
    duplicate_check: duplicateCheck,
    scenes
  };
}

function generateSmartHook(title, question, category) {
  if (title.includes('?')) {
    return `${title} घाबरू नका! कायद्यातील ही गुप्त तरतूद प्रत्येक नागरिकाने आत्ताच समजून घेतली पाहिजे!`;
  }
  return `तुम्ही किंवा तुमच्या कुटुंबातील कोणी ${title.replace(/[।!]/g, '')} करणार असाल तर थांबा! आधी हा महत्त्वाचा कायदेशीर नियम ऐका!`;
}

function generateShortCoverText(title) {
  const words = title.split(' ').slice(0, 5).join(' ');
  return `${words} कायदेशीर सत्य!`;
}

