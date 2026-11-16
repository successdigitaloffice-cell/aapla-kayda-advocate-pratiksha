import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Clapperboard,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Image as ImageIcon,
  Volume2,
  Share2,
  Download,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Clock,
  ArrowRight,
  ArrowLeft,
  Eye,
  AlertCircle,
  RefreshCw,
  Music,
  Check
} from 'lucide-react';
import { resolveMediaUrl, downloadFileFromUrl } from '../utils/api';

export default function Tab3VideoStudio({
  selectedTopic,
  onNavigateTab
}) {
  // Mode: 'recording' (Live Camera & Teleprompter) vs 'creative' (AI Generated Avatar & Video)
  const [studioMode, setStudioMode] = useState('creative');
  const [currentStep, setCurrentStep] = useState(1);

  // Workflow State
  const [topicTitle, setTopicTitle] = useState('');
  const [topicCategory, setTopicCategory] = useState('महाराष्ट्र जमीन महसूल व गुंठेवारी');
  const [videoDuration, setVideoDuration] = useState(45); // 30, 45, 60
  const [voiceSpeed, setVoiceSpeed] = useState('normal'); // 'slow', 'normal', 'fast'
  const [selectedVoice, setSelectedVoice] = useState('aarohi'); // 'aarohi', 'manohar'
  const [selectedMusic, setSelectedMusic] = useState('legal_ambient');
  const [selectedFormat, setSelectedFormat] = useState('A'); // Format A (Dramatic Hook) vs Format B (Educational Step-by-Step)

  // Generated Script & Assets
  const [scriptData, setScriptData] = useState({
    hook: '',
    bodyFormatA: '',
    bodyFormatB: '',
    legalSection: '',
    callToAction: '',
    fullText: ''
  });

  const [verificationData, setVerificationData] = useState({
    applicableLaw: 'महाराष्ट्र जमीन महसूल संहिता १९६६ व गुंठेवारी नियम',
    sections: 'कलम १५० (फेरफार) व कलम १७५(३) BNSS',
    citation: 'AIR 2024 SC / Bombay High Court',
    isCompliant: true
  });

  const [visualPrompt, setVisualPrompt] = useState('');
  const [selectedVisualAsset, setSelectedVisualAsset] = useState('land_records');

  // SEO & Captions
  const [captionText, setCaptionText] = useState('');
  const [hashtags, setHashtags] = useState('#आपलाकायदा #AdvocatePratiksha #LandLaws #Maharashtra #BNSS2023 #Satbara');
  const [seoKeywords, setSeoKeywords] = useState('गुंठेवारी, तुकडेबंदी, ७/१२ फेरफार, Advocate Pratiksha');

  // Video Rendering & Export State
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatusMessage, setRenderStatusMessage] = useState('');
  const [renderJobId, setRenderJobId] = useState(null);
  const [renderError, setRenderError] = useState(null);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState(null);
  const [downloadVideoUrl, setDownloadVideoUrl] = useState(null);
  const [historyReels, setHistoryReels] = useState([]);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const audioPreviewRef = useRef(null);

  // Prepopulate if topic was selected from dashboard/trends
  useEffect(() => {
    if (selectedTopic) {
      const title = selectedTopic.topic_name || selectedTopic.title || '';
      setTopicTitle(title);
      setTopicCategory(selectedTopic.category || 'महाराष्ट्र जमीन महसूल');
      generateWorkflowScript(selectedTopic, selectedTopic.category);
    } else {
      const defaultTitle = 'गुंठेवारी ३१ डिसेंबर २०२० चा नियम आणि नियमितीकरण शुल्क समजून घ्या!';
      setTopicTitle(defaultTitle);
      generateWorkflowScript(defaultTitle, 'महाराष्ट्र जमीन महसूल व गुंठेवारी');
    }
    loadReelsHistory();
  }, [selectedTopic]);

  const loadReelsHistory = async () => {
    try {
      const res = await fetch('/api/video-engine/history');
      if (res.ok) {
        const data = await res.json();
        const reels = data.reels || [];
        setHistoryReels(reels);
        if (reels.length > 0 && !renderedVideoUrl) {
          // Pre-load latest completed reel into Step 8 preview
          const latest = reels[0];
          setRenderedVideoUrl(resolveMediaUrl(latest.preview_url));
          setDownloadVideoUrl(resolveMediaUrl(latest.download_url));
        }
      }
    } catch (e) {
      console.error('Failed to load reels history:', e);
    }
  };

  const generateWorkflowScript = (topicInput, categoryInput) => {
    let title = typeof topicInput === 'string' ? topicInput : (topicInput?.topic_name || topicInput?.title || '');
    let category = categoryInput || (typeof topicInput === 'object' ? topicInput?.category : '') || 'महाराष्ट्र जमीन महसूल व गुंठेवारी';

    // If pre-existing rich verified script exists in the topic object
    if (typeof topicInput === 'object' && topicInput?.script_format_a && topicInput?.hook) {
      const hook = topicInput.hook;
      const formatA = topicInput.script_format_a;
      const formatB = topicInput.script_format_b || formatA;
      const cta = topicInput.call_to_action || `हा सविस्तर कायदेशीर व्हिडिओ आत्ताच सेव्ह करा, मित्रांना शेअर करा आणि अधिकृत सल्ल्यासाठी फॉलो करा आपला कायदा – ॲडव्होकेट प्रतीक्षा!`;
      const legalSection = topicInput.applicable_section ? `${topicInput.applicable_law || ''} (कलम ${topicInput.applicable_section})` : (topicInput.applicable_law || 'महाराष्ट्र शासन अधिकृत कायदे');
      setScriptData({
        hook,
        bodyFormatA: formatA,
        bodyFormatB: formatB,
        legalSection,
        callToAction: cta,
        fullText: `${hook}\n\n${formatA}\n\n${cta}`
      });
      setCaptionText(`${title} ⚖️📜\n\n${topicInput.caption || formatA}\n\n${topicInput.hashtags || '#आपलाकायदा #AdvocatePratiksha #LandLaws #Maharashtra'}`);
      setVisualPrompt(`100% Text & Topic Documentary Visual Explainer: Cadastral Survey Blueprint, 7/12 Ferfar Register, and Registered Sale Deed Stamps.`);
      return;
    }

    const tLower = (title + ' ' + category).toLowerCase();

    let hook = '';
    let formatA = '';
    let formatB = '';
    let legalSection = '';
    let visualPromptCue = '';

    if (tLower.includes('गुंठेवारी') || tLower.includes('gunthewari') || tLower.includes('नियमितीकरण')) {
      legalSection = 'महाराष्ट्र गुंठेवारी विकास अधिनियम २००१ (सुधारित शासन निर्णय २०२१) कलम ३ व ४';
      hook = `तुम्ही १ किंवा २ गुंठे अनधिकृत प्लॉटवर घर बांधले आहे? मनपा किंवा नगरपालिकेकडून नोटीस येण्यापूर्वी हा एक गुंठेवारी नियम त्वरित समजून घ्या!`;
      formatA = `समजा, तुम्ही १ ते ३ गुंठे अनधिकृत प्लॉटवर घर बांधले आहे किंवा खरेदीखत केले आहे, तर केवळ नोटरीवर किंवा साध्या स्टॅम्पवर बँकेचे कर्ज मिळत नाही आणि ७/१२ वर स्वतंत्र मालकी हक्क सिद्ध करताना मोठी कायदेशीर अडचण येते.\n\n` +
        `महाराष्ट्र गुंठेवारी विकास अधिनियम २००१ (२०२१ सुधारित शासन निर्णय) नुसार ३१ डिसेंबर २०२० पूर्वी झालेले ५०० चौरस मीटर आतील भूखंड अधिकृत कम्पाउंडिंग शुल्क भरून महापालिकेत किंवा प्राधिकरणात नियमित करून घेता येतात.\n\n` +
        `यासाठी परवानाधारक वास्तुविशारदाकडून (Architect) लेआउट व मोजणी नकाशा मंजूर करून घ्या आणि सक्षम प्राधिकरणाकडे (मनपा/नगरपरिषद/PMDRA/CIDCO) आवश्यक कागदपत्रांसह अधिकृत नियमितीकरण दाखल्यासाठी अर्ज करा.\n\n` +
        `दाखला मिळताच तलाठ्याकडे ई-हक्क (e-Haqq) पोर्टलद्वारे अर्ज करून ७/१२ उताऱ्यावर स्वतंत्र मालकीची व बिनशेती (NA) नोंद करून घ्या; काम प्रलंबित ठेवल्यास लोकसेवा हक्क कायद्यान्वये तहसीलदारांकडे प्रथम अपील करा.`;
      formatB = `गुंठेवारी प्लॉट नियमित करताना या ३ महत्त्वाच्या कायदेशीर पायऱ्या त्वरित पूर्ण करा:\n\n` +
        `पायरी १: जागेचे ३० वर्षांचे जुने खरेदीखत, इंडेक्स २ आणि मूळ ७/१२ उतारा काढून ३१ डिसेंबर २०२० पूर्वीची नोंद व ताबा तपासा.\n\n` +
        `पायरी २: सक्षम प्राधिकरणाकडे अधिकृत मोजणी नकाशासह गुंठेवारी शुल्क भरून कायदेशीर नियमितीकरण आदेश (Regularization Certificate) प्राप्त करा.\n\n` +
        `पायरी ३: दाखल्याच्या आधारे तलाठ्याकडे फेरफार नोंद प्रमाणित करून घ्या; तलाठ्याने अडवल्यास लोकसेवा हक्क कायद्यान्वये उपविभागीय अधिकाऱ्यांकडे (SDO) दाद मागा.`;
      visualPromptCue = 'Plot layout map with Gunthewari compounding fee receipt, cadastral survey blueprint, and official Municipal Corporation seal';
    } else if (tLower.includes('तुकडेबंदी') || tLower.includes('tukdebandi') || tLower.includes('८ब') || tLower.includes('8b')) {
      legalSection = 'मुंबई तुकडे प्रतिबंध व एकत्रीकरण कायदा १९४७ कलम ८-ब व उच्च न्यायालय निकाल';
      hook = `शेतजमिनीचा १ ते ३ गुंठे तुकडा खरेदी केलाय, पण तलाठी ७/१२ वर नाव लावायला नकार देतोय? मुंबई उच्च न्यायालयाचा हा महत्त्वाचा निकाल नक्की ऐका!`;
      formatA = `समजा, तुम्ही शेतजमिनीचा १ किंवा २ गुंठ्यांचा तुकडा खरेदी केला आणि निबंधकांकडे रीतसर दस्त नोंदवला, तरी तुकडेबंदी कायद्यामुळे तलाठी फेरफार नोंद नामंजूर करतो आणि खरेदीदाराचे नाव अडकून राहते.\n\n` +
        `मुंबई तुकडे प्रतिबंध व एकत्रीकरण कायदा १९४७ कलम ८-ब नुसार अकृषिक (NA) मंजुरी किंवा सक्षम अधिकाऱ्याचे रेखांकन असल्याशिवाय शेतजमिनीच्या लहान तुकड्यांची स्वतंत्र नोंद घेण्यास मनाई आहे.\n\n` +
        `जर जमिनीचा तुकडा प्राधिकरणाच्या हद्दीत असेल तर गुंठेवारी अंतर्गत नियमित करून घ्या किंवा शेतजमिनीचे अधिकृत पोटहिस्सा मोजणी (Hissa Mojani) करून घेऊन सहहिस्सेदार म्हणून नोंद करा.\n\n` +
        `नोंदणीकृत दस्त असताना तलाठ्याने मनमानी नकार दिल्यास महाराष्ट्र जमीन महसूल संहिता कलम १५० व २४७ अन्वये उपविभागीय अधिकाऱ्यांकडे (SDO) ६० दिवसांत अपील दाखल करा.`;
      formatB = `तुकडेबंदी जागेचा फेरफार मंजूर करण्यासाठी या ३ कायदेशीर पायऱ्या अमलात आणा:\n\n` +
        `पायरी १: नोंदणीकृत खरेदीखतासोबत उपअधीक्षक भूमी अभिलेख (DySLR) कार्यालयाकडून अधिकृत मोजणी नकाशा व क वर्ग प्रत मिळवा.\n\n` +
        `पायरी २: ई-हक्क प्रणालीवरून फेरफार नोंदीसाठी ऑनलाईन अर्ज करा आणि महसूल मंडळाधिकाऱ्यांसमोर (Circle Officer) कागदपत्रे सादर करा.\n\n` +
        `पायरी ३: चुकीचा शेरा मारल्यास थेट उपविभागीय अधिकारी (SDO) यांच्या न्यायालयात कलम २४७ अंतर्गत महसुली अपील दाखल करा.`;
      visualPromptCue = 'Tukdebandi prevention act official gazette, 1 to 3 guntha agricultural plot survey map with sub-division boundary markings';
    } else if (tLower.includes('बोजा') || tLower.includes('कर्ज') || tLower.includes('boja') || tLower.includes('noc')) {
      legalSection = 'महाराष्ट्र जमीन महसूल संहिता १९६६ कलम १४९ व १५० आणि ई-हक्क नियमावली';
      hook = `बँकेचे शेती किंवा गृहकर्ज पूर्ण फिटले, पण ७/१२ वरील इतर हक्कातील बोजा अजूनही हटलेला नाही? हा एक अर्ज करा, बोजा लगेच कमी होईल!`;
      formatA = `समजा, तुम्ही बँकेचे संपूर्ण कर्ज वेळेत फेडले, तरी तलाठी दप्तरी आपोआप नोंद होत नाही आणि इतर हक्कातील बोजा कायम राहिल्याने जमीन विकताना किंवा वारस नोंद करताना मोठी कायदेशीर अडचण येते.\n\n` +
        `महाराष्ट्र जमीन महसूल संहिता कलम १४९ व १५० नुसार बँकेकडून मिळणारे मूळ 'ना-हरकत प्रमाणपत्र' (NOC) आणि विहित नमुन्यातील फॉर्म १६/२२ घेऊन ई-हक्क (e-Haqq) पोर्टलवर बोजा कमी करण्यासाठी ऑनलाईन अर्ज दाखल करा.\n\n` +
        `मूळ कागदपत्रांची प्रत तलाठ्याकडे जमा केल्यानंतर तलाठ्याला १५ दिवसांच्या आत फेरफार नोंद घालून बोजा कमी करणे कायद्याने बंधनकारक आहे.\n\n` +
        `तलाठ्याने मुदतीत नोंद न दिल्यास थेट लोकसेवा हक्क कायद्यान्वये तहसीलदारांकडे प्रथम अपील दाखल करून त्वरित आदेश मिळवा.`;
      formatB = `७/१२ वरून बोजा हटवण्याची अधिकृत ३ टप्प्यांची पद्धत:\n\n` +
        `पायरी १: बँकेतून संपूर्ण कर्ज निल (No Dues Certificate) झाल्याचे प्रमाणपत्र व तलाठ्याच्या नावे असलेले बँक रिलीज लेटर घ्या.\n\n` +
        `पायरी २: महाभूमी ई-हक्क पोर्टलवर जाऊन 'बोजा कमी करणे' हा पर्याय निवडून अर्ज करा व पोहोच पावती डाऊनलोड करा.\n\n` +
        `पायरी ३: तलाठ्याकडून १५ दिवसांत कच्चा फेरफार व मंजुरी मिळवा; विलंब झाल्यास तहसीलदारांकडे लोकसेवा हक्क कायद्यान्वये तक्रार नोंदवा.`;
      visualPromptCue = 'Satbara 7/12 document with Bank Loan encumbrance removal stamp, Bank No Objection Certificate NOC, and e-Haqq receipt';
    } else if (tLower.includes('फेरफार') || tLower.includes('७/१२') || tLower.includes('7/12') || tLower.includes('तलाठी') || tLower.includes('satbara')) {
      legalSection = 'महाराष्ट्र जमीन महसूल संहिता १९६६ कलम १४९, १५० व २४७ (अपील अधिकार)';
      hook = `वडिलोपार्जित शेतीवर किंवा खरेदी केलेल्या जमिनीवर तलाठी ७/१२ फेरफार नोंद प्रमाणित करत नाहीये? तुमचे कायदेशीर अधिकार जाणून घ्या!`;
      formatA = `समजा, तुम्ही कायदेशीर खरेदीखत केले किंवा कुटुंबप्रमुखांच्या निधनानंतर वारस नोंदीसाठी अर्ज केला, परंतु तलाठ्याकडून विनाकारण फेरफार प्रलंबित ठेवला जात आहे.\n\n` +
        `महाराष्ट्र जमीन महसूल संहिता १९६६ कलम १५० नुसार तलाठ्याने १५ दिवसांच्या आत नोटीस जारी करून हरकती मागवणे आणि हरकत नसल्यास फेरफार प्रमाणित करणे अनिवार्य आहे.\n\n` +
        `जर कोणी खोटी हरकत घेतली असेल, तर प्रकरण वादग्रस्त फेरफार नोंदवहीत (Register of Disputed Cases) वर्ग होते आणि मंडळ अधिकाऱ्यांसमोर (Circle Officer) दोन्ही बाजूंची रीतसर सुनावणी होते.\n\n` +
        `मंडळ अधिकाऱ्यांचा निर्णय अमान्य असल्यास कलम २४७ अन्वये उपविभागीय अधिकाऱ्यांकडे (SDO) ६० दिवसांच्या आत अपील दाखल करून न्याय मिळवता येतो.`;
      formatB = `७/१२ फेरफार अडकल्यास कायदेशीर हक्क मिळवण्याच्या ३ पायऱ्या:\n\n` +
        `पायरी १: ई-हक्क प्रणालीवरून ऑनलाईन अर्ज करून अर्जाची पावती व आवश्यक कागदपत्रे (खरेदीखत/मृत्यू दाखला/वारस प्रतिज्ञापत्र) तलाठ्याकडे जमा करा.\n\n` +
        `पायरी २: १५ दिवसांनंतर तलाठ्याकडून नोटीस व कच्चा फेरफार क्रमांक मागून घ्या आणि हरकतींची स्थिती तपासा.\n\n` +
        `पायरी ३: तलाठ्याने विनाकारण अडवणूक केल्यास लोकसेवा हक्क कायद्यानुसार तहसीलदारांकडे प्रथम अपील दाखल करा.`;
      visualPromptCue = 'Maharashtra Land Record Register of Ferfar Mutations, 7/12 Extract, Talathi official office record and Section 150 notice';
    } else if (tLower.includes('वारस') || tLower.includes('मुलगी') || tLower.includes('बहीण') || tLower.includes('वडिलोपार्जित') || tLower.includes('वाटप')) {
      legalSection = 'हिंदू वारसा सुधारणा कायदा २००५ कलम ६ व सर्वोच्च न्यायालय निकाल २०२० (विनीता शर्मा विरुद्ध राकेश शर्मा)';
      hook = `वडिलोपार्जित शेतजमिनीत लग्न झालेल्या बहिणीला वाटा नाकारला जातोय? सर्वोच्च न्यायालयाचा हा ऐतिहासिक निकाल भावांना दाखवा!`;
      formatA = `समजा, वडिलोपार्जित शेतजमीन किंवा घराचे वाटप करताना लग्न २००५ पूर्वी झाले या कारणावरून बहिणीला किंवा मुलीला हक्क देण्यास नकार दिला जात आहे.\n\n` +
        `सर्वोच्च न्यायालयाच्या विनीता शर्मा विरुद्ध राकेश शर्मा (२०२०) या ऐतिहासिक निकालानुसार आणि हिंदू वारसा कायदा कलम ६ अन्वये मुलीला जन्मापासून मुलाइतकाच समान वारसा हक्क आहे.\n\n` +
        `बहिणीची लेखी संमती किंवा स्वाक्षरी असल्याशिवाय ७/१२ वर झालेले परस्पर वाटप अथवा जमिनीची विक्री कायद्याच्या नजरेत बेकायदेशीर ठरते.\n\n` +
        `हक्क नाकारल्यास सक्षम दिवाणी न्यायालयात फाळणी व स्वतंत्र वाटपाचा (Partition Suit) दावा दाखल करून स्वतःचा कायदेशीर हिस्सा आणि महसुली नोंद मिळवता येते.`;
      formatB = `वडिलोपार्जित जमिनीत मुलींचा हक्क सिद्ध करण्याच्या ३ पायऱ्या:\n\n` +
        `पायरी १: जमिनीचा मूळ ७/१२ उतारा, पूर्वजांचे फेरफार नोंदी आणि अधिकृत कौटुंबिक वंशावळ (Pedigree Tree) तयार करा.\n\n` +
        `पायरी २: तलाठ्याकडे ई-हक्क प्रणालीद्वारे वारस नोंदीत मुलीचे/बहिणीचे नाव समाविष्ट करण्याचा अधिकृत अर्ज सादर करा.\n\n` +
        `पायरी ३: सहहिस्सेदारांनी नकार दिल्यास दिवाणी न्यायालयात दावा दाखल करून मनाई हुकूम (Injunction Order) मिळवा.`;
      visualPromptCue = 'Supreme Court of India judgment book, family pedigree genealogical tree, and equal coparcenary rights legal deed';
    } else if (tLower.includes('पोलीस') || tLower.includes('अटक') || tLower.includes('bnss') || tLower.includes('bns') || tLower.includes('fir')) {
      legalSection = 'भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS 2023) कलम ३५ व कलम १७५(३)';
      hook = `पोलीस ठाण्यातून फोन आला की लगेच हजर राहा, नाहीतर अटक करू अशी भीती वाटतेय? नवीन BNSS २०२३ कायद्यातील तुमचे अधिकार जाणून घ्या!`;
      formatA = `समजा, एखाद्या अदखलपात्र किंवा सामान्य तक्रारीवरून पोलीस तुम्हाला थेट पोलीस ठाण्यात बोलावून अटकेची धमकी देत असतील, तर घाबरून जाऊ नका.\n\n` +
        `भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS 2023) कलम ३५ नुसार ७ वर्षांपेक्षा कमी शिक्षा असलेल्या गुन्ह्यांमध्ये पोलिसांना कोणालाही थेट अटक करता येत नाही; लेखी कायदेशीर नोटीस देणे अनिवार्य आहे.\n\n` +
        `नोटीस मिळाल्यावर घाबरून न जाता वकिलामार्फत अधिकृत कायदेशीर जबाब नोंदवा आणि अटकेचे कारण लेखी स्वरूपात मागण्याचा नागरिकांना पूर्ण अधिकार आहे.\n\n` +
        `विनाकारण त्रास दिल्यास पोलीस अधीक्षकांकडे (SP) किंवा सक्षम दंडाधिकाऱ्यांकडे BNSS कलम १७५(३) अन्वये तक्रार दाखल करता येते.`;
      formatB = `पोलीस कारवाई आणि अटकेपासून संरक्षणाच्या ३ कायदेशीर पायऱ्या:\n\n` +
        `पायरी १: पोलिसांना अटकेचे कारण आणि BNSS कलम ३५ अन्वये अधिकृत लेखी नोटीस देण्याची लेखी मागणी करा.\n\n` +
        `पायरी २: नोटीस मिळाल्यानंतर स्वतः एकटे न जाता कायदेशीर सल्लागारांच्या (Advocate) मार्गदर्शनाखाली जबाब नोंदवा.\n\n` +
        `पायरी ३: बेकायदेशीर अटकेची भीती असल्यास सत्र न्यायालयात अटकपूर्व जामीन (Anticipatory Bail) अर्ज तातडीने दाखल करा.`;
      visualPromptCue = 'BNSS 2023 Law Book, Section 35 Legal Notice format, Police Station legal rights declaration poster';
    } else if (tLower.includes('चेक') || tLower.includes('cheque') || tLower.includes('बाउन्स') || tLower.includes('138')) {
      legalSection = 'निगोशिएबल इन्स्ट्रुमेंट्स ॲक्ट १८८१ कलम १३८ व भारतीय न्याय संहिता (BNS 2023)';
      hook = `कोणाला उसने किंवा व्यवसायात दिलेले पैसे परत मिळवण्यासाठी घेतलेला चेक बँकेत बाउन्स झाला? या ३० दिवसांच्या मुदतीत हे पाऊल उचला!`;
      formatA = `समजा, समोरच्या व्यक्तीने दिलेला चेक बँकेत 'अपूरा निधी' (Insufficient Funds) असल्यामुळे बाउन्स झाला आणि बँक मेमो मिळाला, तर वेळ वाया घालवू नका.\n\n` +
        `निगोशिएबल इन्स्ट्रुमेंट्स ॲक्ट १८८१ कलम १३८ नुसार बँक मेमो मिळाल्यापासून ३० दिवसांच्या आत वकिलामार्फत १५ दिवसांची कायदेशीर नोटीस पाठवणे बंधनकारक आहे.\n\n` +
        `नोटीस मिळाल्यापासून १५ दिवसांत समोरील व्यक्तीने पैसे न दिल्यास, पुढील ३० दिवसांच्या आत न्यायालयात फौजदारी खटला दाखल करावा लागतो.\n\n` +
        `न्यायालयात गुन्हा सिद्ध झाल्यास चेकच्या रकमेच्या दुप्पट दंड आणि २ वर्षांपर्यंतच्या तुरुंगवासाची कायद्यात कडक तरतूद आहे.`;
      formatB = `चेक बाउन्स झाल्यास पैसे वसूल करण्याच्या ३ महत्त्वाच्या पायऱ्या:\n\n` +
        `पायरी १: बँकेतून मिळालेला मूळ बाउन्स झालेला चेक आणि बँक रिटर्न मेमो सुरक्षित ठेवा.\n\n` +
        `पायरी २: ३० दिवसांच्या आत सक्षम वकिलामार्फत रजिस्टर्ड पोस्टाने १५ दिवसांची डिमांड नोटीस पाठवा.\n\n` +
        `पायरी ३: नोटीस मुदत संपताच पुढील ३० दिवसांच्या आत न्यायदंडाधिकारी न्यायालयात फौजदारी तक्रार दाखल करा.`;
      visualPromptCue = 'Dishonored bank cheque with Insufficient Funds memo, Legal Demand Notice, and Court Summons';
    } else if (tLower.includes('सायबर') || tLower.includes('cyber') || tLower.includes('1930') || tLower.includes('ओटीपी')) {
      legalSection = 'राष्ट्रीय सायबर सुरक्षा हेल्पलाईन १९३० व भारतीय न्याय संहिता (BNS 2023) कलम ३१८(४)';
      hook = `ऑनलाइन लिंकवर क्लिक करून किंवा ओटीपी शेअर होऊन बँक खात्यातून पैसे कट झाले? पहिल्या 'गोल्डन अवर' मध्ये हे काम लगेच करा!`;
      formatA = `समजा, वीज बिल, लॉटरी किंवा बँक केवायसीच्या खोट्या मेसेजवर क्लिक करून तुमच्या खात्यातून परस्पर पैसे कापले गेले, तर वेळ अजिबात वाया घालवू नका.\n\n` +
        `फसवणूक झाल्यापासून पहिल्या १ ते २ तासांत (Golden Hour) राष्ट्रीय सायबर हेल्पलाइन १९३० वर त्वरित कॉल करा किंवा cybercrime.gov.in वर तक्रार नोंदवा.\n\n` +
        `यामुळे पैसे ट्रान्सफर झालेले संशयित बँक खाते त्वरित फ्रीज केले जाते आणि तुमची रक्कम सुरक्षित राहण्याची शक्यता ९०% वाढते.\n\n` +
        `तात्काळ बँक स्टेटमेंटसह जवळच्या सायबर पोलीस ठाण्यात भारतीय न्याय संहिता (BNS 2023) कलम ३१८(४) नुसार रीतसर तक्रार दाखल करा.`;
      formatB = `सायबर फसवणुकीत पैसे परत मिळवण्याच्या ३ तात्काळ पायऱ्या:\n\n` +
        `पायरी १: त्वरित १९३० क्रमांकावर कॉल करून ट्रान्झॅक्शन आयडी, बँक खाते क्रमांक व फसवणुकीची वेळ सांगा.\n\n` +
        `पायरी २: बँकेला फोन करून संबंधित डेबिट कार्ड/नेट बँकिंग तात्काळ ब्लॉक करा आणि बँक स्टेटमेंट मिळवा.\n\n` +
        `पायरी ३: नॅशनल सायबर क्राईम पोर्टलवरून मिळालेली पोचपावती घेऊन स्थानिक सायबर सेलमध्ये लेखी एफआयआर नोंदवा.`;
      visualPromptCue = 'Cyber Crime Portal helpline 1930 logo, frozen bank account alert, and digital transaction security guide';
    } else {
      // General comprehensive legal explainer
      legalSection = 'महाराष्ट्र शासन कायदे, महसूल संहिता व भारतीय न्याय संहिता २०२३';
      hook = `${title.replace(/[?!।]/g, '')} या समस्येत अडकला आहात? कायद्याची ही महत्त्वाची तरतूद तुम्हाला माहिती असायलाच हवी!`;
      formatA = `समजा, ${title} या विषयाबाबत तुमच्यावर किंवा तुमच्या कुटुंबावर अन्याय होत असेल, तर घाबरून न जाता कायद्याची अचूक माहिती जाणून घेणे गरजेचे आहे.\n\n` +
        `महाराष्ट्र शासन नियम आणि भारतीय कायद्यानुसार सामान्य नागरिकांना त्यांच्या हक्कांचे संपूर्ण कायदेशीर संरक्षण देण्यात आले आहे.\n\n` +
        `यासाठी संबंधित मूळ दस्तऐवज, अर्ज व पुरावे गोळा करा आणि तोंडी चर्चेवर अवलंबून न राहता सक्षम प्राधिकरणाकडे अधिकृत लेखी नोटीस किंवा तक्रार दाखल करा.\n\n` +
        `संबंधित अधिकाऱ्याने मुदतीत काम न केल्यास किंवा दाद न दिल्यास वरिष्ठ अपील अधिकारी अथवा न्यायालयात कायदेशीर दाद मिळवण्याचा नागरिकांना पूर्ण अधिकार आहे.`;
      formatB = `या विषयातील कायदेशीर उपाययोजना आणि अधिकृत ३ पायऱ्या:\n\n` +
        `पायरी १: प्रकरणाशी संबंधित सर्व मूळ कागदपत्रे, नोंदी व पुरावे सुरक्षित गोळा करा.\n\n` +
        `पायरी २: संबंधित शासकीय कार्यालयात किंवा सक्षम प्राधिकरणाकडे विहित नमुन्यात लेखी अर्ज सादर करून पोचपावती घ्या.\n\n` +
        `पायरी ३: विहित मुदतीत न्याय न मिळाल्यास कायद्यातील तरतुदींनुसार वरिष्ठ प्राधिकरणाकडे तात्काळ अपील दाखल करा.`;
      visualPromptCue = 'Official Law Books, Maharashtra Government Gazette notification, Courtroom scales and verified citizen rights charter';
    }

    const cta = `हा सविस्तर कायदेशीर व्हिडिओ आत्ताच सेव्ह करा, मित्रांना शेअर करा आणि अधिकृत सल्ल्यासाठी फॉलो करा आपला कायदा – ॲडव्होकेट प्रतीक्षा!`;

    setScriptData({
      hook,
      bodyFormatA: formatA,
      bodyFormatB: formatB,
      legalSection,
      callToAction: cta,
      fullText: `${hook}\n\n${formatA}\n\n${cta}`
    });

    setCaptionText(`${title} ⚖️📜\n\nAdvocate Pratiksha यांच्याकडून सोप्या मराठीत सविस्तर कायदेशीर मार्गदर्शन.\n\n📌 लागू कायदा व तरतूद: ${legalSection}\n\n💡 महत्त्वाचा सल्ला:\n${formatA}\n\n👉 ही अत्यंत महत्त्वाची कायदेशीर माहिती आपल्या कुटुंबियांना व मित्रांना नक्की शेअर करा!\nफॉलो करा 👉 @aaplakayda\n\n#आपलाकायदा #AdvocatePratiksha #MarathiLaw #कायदेशीरहक्क #महाराष्ट्र #जमीनकायदे #Satbara #Gunthewari`);
    setVisualPrompt(visualPromptCue);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handlePreviewVoice = async () => {
    setIsPreviewPlaying(true);
    try {
      const speedMap = { slow: 0.95, normal: 1.10, fast: 1.25 };
      const sample = `प्लॉट खरेदी करताना हा एक कागद तपासला नाही, तर तुमचे लाखो रुपये अडकू शकतात!`;
      const res = await fetch('/api/video-engine/preview-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sample,
          voice: selectedVoice,
          speed: speedMap[voiceSpeed] || 1.10
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio_url) {
          const directUrl = data.audio_url.replace('/api/', '/api/video-engine/');
          const resolvedAudio = resolveMediaUrl(directUrl);
          const audio = new Audio(resolvedAudio);
          audioPreviewRef.current = audio;
          audio.play();
          audio.onended = () => setIsPreviewPlaying(false);
          audio.onerror = () => setIsPreviewPlaying(false);
        } else {
          setIsPreviewPlaying(false);
        }
      } else {
        setIsPreviewPlaying(false);
      }
    } catch (e) {
      console.error('Voice preview failed:', e);
      setIsPreviewPlaying(false);
    }
  };

  // REAL VIDEO GENERATION DISPATCH
  const handleStartRealVideoGeneration = async () => {
    setIsGenerating(true);
    setRenderError(null);
    setRenderProgress(10);
    setRenderStatusMessage('100% Text & Topic Visual Explainer Engine सुरू होत आहे...');

    try {
      const scriptBody = selectedFormat === 'A' ? scriptData.bodyFormatA : scriptData.bodyFormatB;
      const fullScript = `${scriptData.hook}\n\n${scriptBody}\n\n${scriptData.callToAction}`;

      const speedMap = { slow: 0.95, normal: 1.10, fast: 1.25 };
      const chosenSpeed = speedMap[voiceSpeed] || 1.10;

      const payload = {
        script_text: fullScript,
        script_title: topicTitle,
        duration: String(videoDuration),
        speed: chosenSpeed,
        voice: selectedVoice,
        bg_music: selectedMusic,
        force_regenerate: true
      };

      const res = await fetch('/api/video-engine/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'व्हिडिओ निर्मिती सुरू करताना त्रुटी आली.');
      }

      const initData = await res.json();
      const jobId = initData.job_id;
      setRenderJobId(jobId);

      // Check if finished immediately from cache
      if (initData.already_completed && initData.result) {
        setRenderProgress(100);
        setRenderStatusMessage('व्हिडिओ तयार आहे!');
        const folder = initData.result.folder_name;
        setRenderedVideoUrl(resolveMediaUrl(`/api/video-engine/preview/${folder}/final_reel.mp4`));
        setDownloadVideoUrl(resolveMediaUrl(`/api/video-engine/download/${folder}/final_reel.mp4`));
        setIsGenerating(false);
        setCurrentStep(8);
        loadReelsHistory();
        return;
      }

      // Poll video job status
      const pollTimer = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/video-engine/video-status/${jobId}`);
          if (!pollRes.ok) return;

          const pollData = await pollRes.json();
          if (!pollData.success || !pollData.job) return;

          const job = pollData.job;
          setRenderProgress(job.progress || 25);
          if (job.message) {
            setRenderStatusMessage(job.message);
          }

          if (job.status === 'completed') {
            clearInterval(pollTimer);
            setIsGenerating(false);
            setRenderProgress(100);
            setRenderStatusMessage('अभिनंदन! तुमचा व्हिडिओ यशस्वीरीत्या तयार झाला आहे.');
            const folder = job.result?.folder_name;
            if (folder) {
              setRenderedVideoUrl(resolveMediaUrl(`/api/video-engine/preview/${folder}/final_reel.mp4`));
              setDownloadVideoUrl(resolveMediaUrl(`/api/video-engine/download/${folder}/final_reel.mp4`));
            }
            setCurrentStep(8);
            loadReelsHistory();
          } else if (job.status === 'failed') {
            clearInterval(pollTimer);
            setIsGenerating(false);
            setRenderError(job.error || 'व्हिडिओ रेंडरिंग अयशस्वी झाले.');
          }
        } catch (pollErr) {
          console.error('Polling error:', pollErr);
        }
      }, 1500);

    } catch (err) {
      console.error('Render trigger error:', err);
      setIsGenerating(false);
      setRenderError(err.message);
    }
  };

  const stepsList = [
    { num: 1, label: 'विषय निवड' },
    { num: 2, label: 'स्क्रिप्ट निर्मिती' },
    { num: 3, label: 'कायदेशीर पडताळणी' },
    { num: 4, label: 'AI व्हिज्युअल प्रॉम्ट' },
    { num: 5, label: 'ॲडव्होकेट फोटो' },
    { num: 6, label: 'व्हिडिओ व ऑडिओ' },
    { num: 7, label: 'कॅप्शन व SEO' },
    { num: 8, label: 'प्रिव्ह्यू व एक्सपोर्ट' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-850 border border-navy-700/80 p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white">एकात्मिक व्हिडिओ स्टुडिओ (Unified Video Studio)</h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Google Flow & Neural HD
              </span>
            </div>
            <p className="text-xs text-slate-400">स्क्रिप्ट, कायदेशीर पडताळणी, AI फोटो व थेट MP4 व्हिडिओ रेंडरिंग एकाच ठिकाणी</p>
          </div>
        </div>

        {/* 2 Primary Modes */}
        <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
          <button
            onClick={() => setStudioMode('creative')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              studioMode === 'creative'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>क्रिएटिव्ह AI व्हिडिओ</span>
          </button>
          <button
            onClick={() => setStudioMode('recording')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              studioMode === 'recording'
                ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>रेकॉर्डिंग व्हिडिओ (Teleprompter)</span>
          </button>
        </div>
      </div>

      {/* 8-Step Progress Stepper Bar (Horizontal Scrollable for Mobile) */}
      <div className="bg-navy-850/80 border border-navy-700/80 rounded-2xl p-3 sm:p-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px]">
          {stepsList.map((step, idx) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center space-x-2 text-xs font-semibold py-1.5 px-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
                      : isCompleted
                      ? 'text-emerald-400 hover:bg-navy-800'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-navy-950 text-gold-400'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-navy-900 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
                {idx < stepsList.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${currentStep > idx + 1 ? 'bg-emerald-500/50' : 'bg-navy-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-navy-850 border border-navy-700 rounded-2xl p-5 sm:p-6 shadow-xl">

        {/* STEP 1: TOPIC SELECT */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">1</span>
              <span>विषय निवडा किंवा प्रविष्ट करा (Select or Enter Legal Topic)</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">व्हिडिओचा कायदेशीर विषय (Topic Title):</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  placeholder="उदा. गुंठेवारी ३१ डिसेंबर २०२० चा नियम आणि नियमितीकरण..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">कायदेशीर प्रवर्ग (Legal Category):</label>
                  <select
                    value={topicCategory}
                    onChange={(e) => setTopicCategory(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                  >
                    <option value="महाराष्ट्र जमीन महसूल व गुंठेवारी">महाराष्ट्र जमीन महसूल व गुंठेवारी</option>
                    <option value="तुकडेबंदी व खरेदीखत">तुकडेबंदी व खरेदीखत</option>
                    <option value="७/१२ फेरफार व वारस नोंद">७/१२ फेरफार व वारस नोंद</option>
                    <option value="भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS)">भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS)</option>
                    <option value="महिलांचे कायदेशीर अधिकार">महिलांचे कायदेशीर अधिकार</option>
                    <option value="सायबर गुन्हे व डिजिटल सुरक्षा">सायबर गुन्हे व डिजिटल सुरक्षा</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">व्हिडिओची अपेक्षित लांबी (Duration):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { dur: 30, label: '३० सेकंद (संक्षिप्त)' },
                      { dur: 45, label: '४५ सेकंद (सविस्तर)' },
                      { dur: 60, label: '६० सेकंद (संपूर्ण सखोल)' }
                    ].map((item) => (
                      <button
                        key={item.dur}
                        onClick={() => setVideoDuration(item.dur)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                          videoDuration === item.dur
                            ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                            : 'bg-navy-900 text-slate-400 border-navy-750 hover:border-slate-600'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab && onNavigateTab('trends')}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <span>Trending Topics मधून निवडा</span>
              </button>
              <button
                onClick={() => {
                  generateWorkflowScript(topicTitle, topicCategory);
                  setCurrentStep(2);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>पुढील: स्क्रिप्ट निर्मिती</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SCRIPT GENERATION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>मराठी कायदेशीर स्क्रिप्ट (Marathi Legal Script Engine)</span>
              </h2>

              <div className="flex items-center space-x-2 bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
                <button
                  onClick={() => setSelectedFormat('A')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedFormat === 'A' ? 'bg-gold-500 text-navy-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Format A (सविस्तर अडचण व उपाय)
                </button>
                <button
                  onClick={() => setSelectedFormat('B')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedFormat === 'B' ? 'bg-gold-500 text-navy-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Format B (३ टप्प्यांचे कायदेशीर मार्गदर्शन)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Hook Box */}
              <div className="bg-navy-900 rounded-xl p-3.5 border border-gold-500/30">
                <label className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block mb-1">
                  पहिल्या ३ सेकंदांचा हाय-इम्पॅक्ट हुक (Viral Hook):
                </label>
                <textarea
                  rows={2}
                  value={scriptData.hook}
                  onChange={(e) => setScriptData({ ...scriptData, hook: e.target.value })}
                  className="w-full bg-transparent text-sm text-white font-medium focus:outline-none resize-none"
                />
              </div>

              {/* Main Body */}
              <div className="bg-navy-900 rounded-xl p-3.5 border border-navy-750">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    सखोल कायदेशीर मुद्दे व संपूर्ण मार्गदर्शन (Legal Body & Solution):
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    कलमे, शासन निर्णय व प्रत्यक्ष उपाय
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={selectedFormat === 'A' ? scriptData.bodyFormatA : scriptData.bodyFormatB}
                  onChange={(e) => {
                    if (selectedFormat === 'A') {
                      setScriptData({ ...scriptData, bodyFormatA: e.target.value });
                    } else {
                      setScriptData({ ...scriptData, bodyFormatB: e.target.value });
                    }
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none leading-relaxed min-h-[190px]"
                />
              </div>

              {/* Call to Action */}
              <div className="bg-navy-900 rounded-xl p-3.5 border border-navy-750">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  कॉल टू ॲक्शन (Call To Action):
                </label>
                <input
                  type="text"
                  value={scriptData.callToAction}
                  onChange={(e) => setScriptData({ ...scriptData, callToAction: e.target.value })}
                  className="w-full bg-transparent text-xs text-gold-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागील</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>पुढील: कायदेशीर पडताळणी</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LEGAL VERIFICATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>कायदेशीर पडताळणी (Supreme Court & Gazette Verification)</span>
            </h2>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>अधिकृत कायदेशीर पडताळणी यशस्वी (100% Verified)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-navy-900/80 border border-navy-750">
                  <span className="text-slate-400 block mb-0.5">लागू कायदा (Applicable Law):</span>
                  <span className="font-bold text-white">{verificationData.applicableLaw}</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-900/80 border border-navy-750">
                  <span className="text-slate-400 block mb-0.5">कलम (Sections):</span>
                  <span className="font-bold text-gold-400">{verificationData.sections}</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-900/80 border border-navy-750 sm:col-span-2">
                  <span className="text-slate-400 block mb-0.5">न्यायालयीन दाखला / शासन निर्णय (Citation / GR):</span>
                  <span className="font-semibold text-slate-200">
                    महाराष्ट्र शासन राजपत्रातील अधिकृत तरतूद व उच्च न्यायालय खंडपीठ निर्णय.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागील</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>पुढील: AI व्हिज्युअल प्रॉम्ट</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AI VISUAL PROMPT */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">4</span>
              <span>AI व्हिज्युअल प्रॉम्ट (AI Visual Prompt Generator)</span>
            </h2>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-750 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold-400">Google Flow & Midjourney Cinematic Prompt:</span>
                <button
                  onClick={() => copyToClipboard(visualPrompt, 'prompt')}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedField === 'prompt' ? 'कॉपी झाले!' : 'प्रॉम्ट कॉपी करा'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={visualPrompt}
                onChange={(e) => setVisualPrompt(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-gold-500 font-mono"
              />
              <div className="text-[11px] text-slate-400">
                वैशिष्ट्ये: काळा कोट, पांढरा शर्ट व कॉलर नेकबँड, भारतीय न्यायालयीन कार्यालय, ९:१६ वर्टिकल रील प्रमाण.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागील</span>
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>पुढील: कायदेशीर व्हिज्युअल्स व पुरावे</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TOPIC-SPECIFIC LEGAL VISUAL ASSETS */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">5</span>
              <span>कायदेशीर कागदपत्रे व व्हिज्युअल्स (Topic Visual Assets)</span>
            </h2>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-750 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  या Reel साठी खालील विषयाशी संबंधित अधिकृत व्हिज्युअल्स व देवनागरी टायपोग्राफी आपोआप सिंक केली जाईल:
                </p>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                  ✓ Zero Avatar / 100% Topic Visuals
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-navy-950 border border-gold-500/50 shadow-md">
                  <div className="text-[10px] uppercase font-bold text-gold-400 mb-1">सीन १ (0-3s Hook)</div>
                  <div className="font-bold text-xs text-white mb-1">प्लॉट सीमांकन ड्रोण व्हिज्युअल</div>
                  <p className="text-[10px] text-slate-400">लेआउट सीमा, धोक्याचा इशारा बॅनर</p>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-gold-500/50 shadow-md">
                  <div className="text-[10px] uppercase font-bold text-gold-400 mb-1">सीन २ (Problem/Risk)</div>
                  <div className="font-bold text-xs text-white mb-1">७/१२ व फेरफार रजिस्टर</div>
                  <p className="text-[10px] text-slate-400">गाव नमुना ७ व १२, तलाठी नोंद</p>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-gold-500/50 shadow-md">
                  <div className="text-[10px] uppercase font-bold text-gold-400 mb-1">सीन ३ (The Law)</div>
                  <div className="font-bold text-xs text-white mb-1">भूमी अभिलेख मोजणी नकाशा</div>
                  <p className="text-[10px] text-slate-400">तुकडेबंदी कलम ८ब, अधिकृत नकाशा</p>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-gold-500/50 shadow-md">
                  <div className="text-[10px] uppercase font-bold text-gold-400 mb-1">सीन ४ (Action/CTA)</div>
                  <div className="font-bold text-xs text-white mb-1">नोंदणीकृत खरेदीखत</div>
                  <p className="text-[10px] text-slate-400">दुय्यम निबंधक स्टॅम्प, न्यायदेवता हमी</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागील</span>
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>पुढील: व्हिडिओ निर्मिती (Render Reel)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: VIDEO & VOICE SYNTHESIS */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">6</span>
              <span>व्हिडिओ व व्हॉईस निर्मिती (Real Video & Marathi Voice Engine)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Marathi Voice Selector */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Volume2 className="w-4 h-4 text-gold-400 mr-1.5" />
                  <span>मराठी आवाज (Voice):</span>
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedVoice('aarohi')}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                      selectedVoice === 'aarohi'
                        ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                        : 'bg-navy-950 text-slate-400 border-navy-800'
                    }`}
                  >
                    <span>आरोही (स्त्री आवाज - Pratiksha)</span>
                    {selectedVoice === 'aarohi' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setSelectedVoice('manohar')}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border text-left flex items-center justify-between transition-all ${
                      selectedVoice === 'manohar'
                        ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                        : 'bg-navy-950 text-slate-400 border-navy-800'
                    }`}
                  >
                    <span>मनोहर (पुरुष आवाज)</span>
                    {selectedVoice === 'manohar' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  onClick={handlePreviewVoice}
                  disabled={isPreviewPlaying}
                  className="mt-2 w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 text-[11px] text-gold-400 font-semibold border border-gold-500/30"
                >
                  {isPreviewPlaying ? <RotateCcw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  <span>{isPreviewPlaying ? 'आवाज ऐकवत आहे...' : 'आवाज ऐका (Preview)'}</span>
                </button>
              </div>

              {/* Voice Speed */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Sliders className="w-4 h-4 text-purple-400 mr-1.5" />
                  <span>आवाज गती (Speed):</span>
                </label>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {['slow', 'normal', 'fast'].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setVoiceSpeed(spd)}
                      className={`py-2 rounded-lg font-bold border transition-all ${
                        voiceSpeed === spd
                          ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                          : 'bg-navy-950 text-slate-400 border-navy-800'
                      }`}
                    >
                      {spd === 'slow' ? 'संथ' : spd === 'normal' ? '1.10x' : '1.25x'}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-2">
                  Instagram Reels साठी 1.10x वेग अत्यंत प्रभावी मानला जातो.
                </div>
              </div>

              {/* Background Music */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Music className="w-4 h-4 text-emerald-400 mr-1.5" />
                  <span>पार्श्वसंगीत (BG Music):</span>
                </label>
                <select
                  value={selectedMusic}
                  onChange={(e) => setSelectedMusic(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="legal_ambient">कायदेशीर वातावरण (Legal Ambient)</option>
                  <option value="corporate_law">गंभीर व अधिकृत (Corporate)</option>
                  <option value="none">संगीत नको (Voice Only)</option>
                </select>
                <div className="text-[10px] text-slate-400 mt-2">
                  व्हॉइस-ओव्हर स्पष्ट राहण्यासाठी पार्श्वसंगीत आपोआप -18dB डक (Ducking) केले जाते.
                </div>
              </div>

              {/* Resolution & Format */}
              <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Clock className="w-4 h-4 text-blue-400 mr-1.5" />
                  <span>आउटपुट दर्जा:</span>
                </label>
                <div className="text-xs font-bold text-white mt-1">
                  1080 x 1920 Full HD (9:16 Reel)
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  कालावधी: {videoDuration} सेकंद
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span>FFmpeg 7.1 + PIL High-Res Engine</span>
                </div>
              </div>
            </div>

            {/* Live Generation Progress Card */}
            {isGenerating && (
              <div className="p-5 rounded-xl bg-navy-900 border border-gold-500/40 text-center space-y-3 shadow-xl">
                <div className="flex items-center justify-center space-x-2 text-gold-400 font-bold text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{renderStatusMessage || 'व्हिडिओ रेंडरिंग सुरू आहे...'}</span>
                  <span>({renderProgress}%)</span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden max-w-lg mx-auto">
                  <div
                    className="bg-gradient-to-r from-gold-500 via-amber-400 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  मराठी ऑडिओ, सीन इमेजेस, हाय-इम्पॅक्ट टेक्स्ट आणि बॅकग्राउंड म्युझिक एकत्रित केले जात आहे...
                </p>
              </div>
            )}

            {renderError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{renderError}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(5)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागील</span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  कॅप्शन व SEO तपासा
                </button>
                <button
                  onClick={handleStartRealVideoGeneration}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'रेंडरिंग सुरू आहे...' : 'व्हिडिओ रेंडर करा (Render Real Video)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: CAPTIONS + SEO */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">7</span>
              <span>कॅप्शन व व्हायरल SEO (Captions & Hashtags)</span>
            </h2>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Instagram कॅप्शन (Caption):</label>
                  <button
                    onClick={() => copyToClipboard(captionText, 'caption')}
                    className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedField === 'caption' ? 'कॉपी झाले!' : 'कॅप्शन कॉपी करा'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">व्हायरल हॅशटॅग्ज (Hashtags):</label>
                  <button
                    onClick={() => copyToClipboard(hashtags, 'hashtags')}
                    className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedField === 'hashtags' ? 'कॉपी झाले!' : 'हॅशटॅग्ज कॉपी करा'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs text-slate-300"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(6)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागील</span>
              </button>
              <button
                onClick={() => {
                  if (renderedVideoUrl) {
                    setCurrentStep(8);
                  } else {
                    handleStartRealVideoGeneration();
                  }
                }}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>{renderedVideoUrl ? 'प्रिव्ह्यू व एक्सपोर्ट पहा' : 'व्हिडिओ रेंडर करा व एक्सपोर्ट पहा'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: PREVIEW & DOWNLOAD / TELEPROMPTER */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">8</span>
                <span>Advocate Pratiksha टॉकिंग अवतार प्रिव्ह्यू व डाऊनलोड (Talking Avatar Video)</span>
              </h2>
              {renderedVideoUrl && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real Talking Avatar MP4 • Lip-Synced</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Reel Video Player */}
              <div className="lg:col-span-5 bg-navy-900 rounded-2xl p-4 border border-navy-750 flex flex-col items-center justify-center text-center">
                {renderedVideoUrl ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-2xl bg-black mb-3">
                      <video
                        key={resolveMediaUrl(renderedVideoUrl)}
                        controls
                        playsInline
                        crossOrigin="anonymous"
                        autoPlay
                        src={resolveMediaUrl(renderedVideoUrl)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs font-bold text-white max-w-xs">{topicTitle}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                      <span>1080 x 1920 Full HD</span>
                      <span>•</span>
                      <span>मराठी व्हॉइस-ओव्हर सिंक</span>
                    </div>

                    {downloadVideoUrl && (
                      <button
                        type="button"
                        onClick={() => downloadFileFromUrl(downloadVideoUrl, `Advocate_Pratiksha_${(topicTitle || 'Reel').replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_')}.mp4`)}
                        className="mt-3 w-full max-w-[260px] flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-extrabold text-xs shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Reel MP4 डाऊनलोड करा</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-[260px] aspect-[9/16] rounded-2xl bg-navy-950 border border-dashed border-navy-700 flex flex-col items-center justify-center p-4 text-slate-500 text-xs">
                    <Video className="w-10 h-10 mb-2 text-slate-600" />
                    <span>व्हिडिओ अद्याप रेंडर केलेला नाही</span>
                    <button
                      onClick={handleStartRealVideoGeneration}
                      disabled={isGenerating}
                      className="mt-3 px-4 py-2 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs"
                    >
                      आत्ता रेंडर करा
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Instagram Ready Toolkit & Teleprompter */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                {/* Teleprompter Script Card */}
                <div className="p-4 rounded-xl bg-navy-900/90 border border-navy-750">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gold-400">टेलिप्रॉम्प्टर स्क्रिप्ट (Teleprompter Script):</span>
                    <button
                      onClick={() => copyToClipboard(scriptData.fullText, 'fullScript')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'fullScript' ? 'कॉपी झाले!' : 'स्क्रिप्ट कॉपी करा'}</span>
                    </button>
                  </div>
                  <div className="max-h-44 overflow-y-auto text-xs text-slate-200 leading-relaxed font-sans pr-2 space-y-2 border-t border-navy-800 pt-2">
                    <p className="font-bold text-gold-300">"{scriptData.hook}"</p>
                    <p>{selectedFormat === 'A' ? scriptData.bodyFormatA : scriptData.bodyFormatB}</p>
                    <p className="text-slate-400 italic">"{scriptData.callToAction}"</p>
                  </div>
                </div>

                {/* Instagram Share Box */}
                <div className="p-4 rounded-xl bg-navy-900 border border-navy-750 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Instagram कॅप्शन आणि हॅशटॅग्ज:</span>
                    <button
                      onClick={() => {
                        copyToClipboard(`${captionText}\n\n${hashtags}`, 'allInstagram');
                        alert('Instagram कॅप्शन आणि हॅशटॅग्ज कॉपी झाले आहेत!');
                      }}
                      className="text-[11px] text-gold-400 hover:text-gold-300 font-bold flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'allInstagram' ? 'कॉपी झाले!' : 'सर्व एकत्र कॉपी करा'}</span>
                    </button>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-lg text-xs text-slate-300 max-h-24 overflow-y-auto font-mono">
                    <p className="whitespace-pre-line">{captionText}</p>
                    <p className="text-gold-400 mt-1">{hashtags}</p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {downloadVideoUrl && (
                    <button
                      type="button"
                      onClick={() => downloadFileFromUrl(downloadVideoUrl, `Advocate_Pratiksha_${(topicTitle || 'Reel').replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_')}.mp4`)}
                      className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs sm:text-sm shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>व्हिडिओ डाऊनलोड (.MP4)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const blob = new Blob([`${topicTitle}\n\n${scriptData.fullText}\n\nकॅप्शन:\n${captionText}\n\nहॅशटॅग्स:\n${hashtags}`], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Advocate_Pratiksha_Script_${Date.now()}.txt`;
                      a.click();
                    }}
                    className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs sm:text-sm border border-navy-700 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4 text-gold-400" />
                    <span>स्क्रिप्ट फाईल (.TXT)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Previous Reels History Drawer */}
            {historyReels.length > 0 && (
              <div className="mt-6 pt-4 border-t border-navy-800">
                <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center space-x-1.5">
                  <Clapperboard className="w-4 h-4 text-gold-400" />
                  <span>मागील तयार झालेले व्हिडिओ (Recent Rendered Reels Archive):</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {historyReels.slice(0, 6).map((reel, rIdx) => (
                    <div
                      key={reel.folder_name || rIdx}
                      className="p-3 rounded-xl bg-navy-900 border border-navy-750 flex flex-col justify-between hover:border-gold-500/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>{reel.created_at || 'Reel MP4'}</span>
                          <span className="text-gold-400 font-bold">{reel.size_mb ? `${reel.size_mb} MB` : '1080p'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{reel.title || 'Advocate Pratiksha Reel'}</h4>
                      </div>
                      <div className="mt-2.5 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRenderedVideoUrl(resolveMediaUrl(reel.preview_url));
                            setDownloadVideoUrl(resolveMediaUrl(reel.download_url));
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-[11px] font-bold text-gold-400 flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>पहा</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadFileFromUrl(reel.download_url, `${(reel.title || 'Reel').replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_')}.mp4`)}
                          className="p-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 cursor-pointer"
                          title="Download Reel MP4"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-navy-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4 text-gold-400" />
                <span>नवीन व्हिडिओ तयार करा</span>
              </button>
              <button
                onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-750 text-white px-5 py-2 rounded-xl font-bold text-xs"
              >
                <span>डॅशबोर्डवर परत जा</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
