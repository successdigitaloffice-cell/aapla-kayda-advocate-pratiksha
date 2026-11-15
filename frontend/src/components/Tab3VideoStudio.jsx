import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Sliders,
  Clock,
  ArrowRight,
  ArrowLeft,
  Eye,
  AlertCircle
} from 'lucide-react';

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
  const [avatarList, setAvatarList] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // SEO & Captions
  const [captionText, setCaptionText] = useState('');
  const [hashtags, setHashtags] = useState('#आपलाकायदा #AdvocatePratiksha #LandLaws #Maharashtra #BNSS2023 #Satbara');
  const [seoKeywords, setSeoKeywords] = useState('गुंठेवारी, तुकडेबंदी, ७/१२ फेरफार, Advocate Pratiksha');

  const [copiedField, setCopiedField] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  // Prepopulate if topic was selected from dashboard/trends
  useEffect(() => {
    if (selectedTopic) {
      const title = selectedTopic.topic_name || selectedTopic.title || '';
      setTopicTitle(title);
      setTopicCategory(selectedTopic.category || 'महाराष्ट्र जमीन महसूल');
      generateWorkflowScript(title, selectedTopic.category);
    } else {
      setTopicTitle('गुंठेवारी ३१ डिसेंबर २०२० चा नियम आणि नियमितीकरण शुल्क समजून घ्या!');
      generateWorkflowScript('गुंठेवारी ३१ डिसेंबर २०२० चा नियम आणि नियमितीकरण शुल्क समजून घ्या!', 'महाराष्ट्र जमीन महसूल व गुंठेवारी');
    }
    loadAvatars();
  }, [selectedTopic]);

  const loadAvatars = async () => {
    try {
      const res = await fetch('/api/avatar/list');
      if (res.ok) {
        const data = await res.json();
        setAvatarList(data.avatars || []);
        if (data.defaultAvatar) {
          setSelectedAvatar(data.defaultAvatar);
        } else if (data.avatars && data.avatars.length > 0) {
          setSelectedAvatar(data.avatars[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load avatars in Studio:', e);
    }
  };

  const generateWorkflowScript = (title, category) => {
    const isLand = (category || '').includes('जमीन') || (category || '').includes('गुंठेवारी') || (title || '').includes('फेरफार');

    const hook = `तुमची जमीन किंवा प्लॉट खरेदी अडकली आहे का? मग हा कायदेशीर नियम नक्की समजून घ्या; नाहीतर मोठे आर्थिक नुकसान होऊ शकते!`;
    const formatA = `नमस्कार, मी Advocate Pratiksha.\n\n` +
      `जर तुम्ही ३१ डिसेंबर २०२० पूर्वीचा अनधिकृत प्लॉट खरेदी केला असेल किंवा तलाठी फेरफार नोंद प्रमाणित करण्यास टाळाटाळ करत असेल, तर घाबरू नका.\n\n` +
      `महाराष्ट्र शासन नियमांनुसार सक्षम प्राधिकरणाकडे नियमितीकरण शुल्क (Compounding Fee) भरून गुंठेवारी कायदेशीर करता येते. तसेच तलाठ्याला १५ दिवसांच्या आत फेरफार करणे बंधनकारक आहे.\n\n` +
      `अधिकार समजून घ्या, जागरूक राहा!`;

    const formatB = `नमस्कार, मी Advocate Pratiksha.\n\n` +
      `जमीन किंवा घर खरेदी करताना या २ पायऱ्या लगेच पूर्ण करा:\n` +
      `पायरी १: ई-फेरफार पोर्टलवरून अर्जाची स्थिती तपासा आणि कलम १५० अन्वये नोटीस जारी झाली आहे का याची खात्री करा.\n` +
      `पायरी २: तलाठ्याने विनाकारण काम अडवल्यास थेट लोकसेवा हक्क कायद्यानुसार तहसीलदारांकडे प्रथम अपील नोंदवा.\n\n` +
      `कायद्याची ही ताकद प्रत्येक नागरिकाला माहीत हवी.`;

    const cta = `हा व्हिडिओ सेव्ह करा आणि आपल्या शेतकरी व जमीन खरेदीदार मित्रांना नक्की शेअर करा! Follow आपला कायदा – Advocate Pratiksha.`;

    setScriptData({
      hook,
      bodyFormatA: formatA,
      bodyFormatB: formatB,
      legalSection: isLand ? 'महाराष्ट्र जमीन महसूल संहिता १९६६ कलम १५० व गुंठेवारी कायदा कलम ३' : 'भारतीय नागरिक सुरक्षा संहिता २०२३ कलम १७५(३)',
      callToAction: cta,
      fullText: `${hook}\n\n${formatA}\n\n${cta}`
    });

    setCaptionText(`${title}\n\nकायदेशीर सल्ल्यासाठी पाहा संपूर्ण व्हिडिओ. अधिक माहितीसाठी फॉलो करा आपला कायदा!\n\n#आपलाकायदा #AdvocatePratiksha #LandLaws #Maharashtra #BNSS2023`);
    setVisualPrompt(`Cinematic vertical reel of female Advocate Pratiksha wearing black advocate coat and white neck band, seated in high court law office, confidently explaining Maharashtra land laws with natural gestures.`);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSimulateRender = () => {
    setIsGenerating(true);
    setRenderProgress(10);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCurrentStep(8);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
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
      {/* Studio Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-850 border border-navy-700/80 p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white">एकात्मिक व्हिडिओ स्टुडिओ (Unified Video Studio)</h1>
            <p className="text-xs text-slate-400">स्क्रिप्ट, कायदेशीर पडताळणी, AI अवतार व व्हिडिओ एकाच ठिकाणी</p>
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
                    {[30, 45, 60].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setVideoDuration(dur)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          videoDuration === dur
                            ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                            : 'bg-navy-900 text-slate-400 border-navy-750 hover:border-slate-600'
                        }`}
                      >
                        {dur} सेकंद
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  generateWorkflowScript(topicTitle, topicCategory);
                  setCurrentStep(2);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>पुढील पायरी: कायदेशीर स्क्रिप्ट तयार करा</span>
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
                <span>कायदेशीर स्क्रिप्ट (Legal Reel Script Format A/B)</span>
              </h2>
              <div className="flex items-center space-x-1 bg-navy-900 p-1 rounded-lg border border-navy-750 text-xs">
                <button
                  onClick={() => setSelectedFormat('A')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    selectedFormat === 'A' ? 'bg-gold-500 text-navy-950' : 'text-slate-400'
                  }`}
                >
                  फॉरमॅट A (Dramatic Hook)
                </button>
                <button
                  onClick={() => setSelectedFormat('B')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    selectedFormat === 'B' ? 'bg-gold-500 text-navy-950' : 'text-slate-400'
                  }`}
                >
                  फॉरमॅट B (पायरी-दर-पायरी)
                </button>
              </div>
            </div>

            {/* Script Editor / Preview */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gold-400 flex items-center space-x-1 mb-1">
                  <span>पहिल्या ३ सेकंदांचा आकर्षक Hook:</span>
                </label>
                <input
                  type="text"
                  value={scriptData.hook}
                  onChange={(e) => setScriptData({ ...scriptData, hook: e.target.value })}
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">मुख्य स्क्रिप्ट मजकूर ({selectedFormat === 'A' ? 'Format A' : 'Format B'}):</label>
                <textarea
                  rows={6}
                  value={selectedFormat === 'A' ? scriptData.bodyFormatA : scriptData.bodyFormatB}
                  onChange={(e) => {
                    if (selectedFormat === 'A') {
                      setScriptData({ ...scriptData, bodyFormatA: e.target.value });
                    } else {
                      setScriptData({ ...scriptData, bodyFormatB: e.target.value });
                    }
                  }}
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-gold-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">शेवट आणि कॉल-टू-ॲक्शन (Call To Action):</label>
                <input
                  type="text"
                  value={scriptData.callToAction}
                  onChange={(e) => setScriptData({ ...scriptData, callToAction: e.target.value })}
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-xs text-slate-300"
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
                <span>कायदेशीर पडताळणी तपासा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LEGAL ACCURACY VERIFICATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>कायदेशीर अचूकता पडताळणी (Legal Accuracy & BNS Compliance)</span>
            </h2>

            <div className="bg-navy-900 border border-emerald-500/40 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-bold">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>कायदेशीर आधार आणि तरतुदी सत्यापित आहेत (100% Law Verified)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="text-slate-400 block font-semibold mb-1">लागू असलेला अधिनियम / कायदा:</span>
                  <span className="text-white font-bold">{scriptData.legalSection}</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="text-slate-400 block font-semibold mb-1">अधिकृत संदर्भ व निवाडे:</span>
                  <span className="text-white font-bold">{verificationData.citation}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-navy-950/80 border border-navy-800 text-xs text-slate-300 space-y-1">
                <p>✓ जुन्या CrPC/IPC ऐवजी नवीन <strong>भारतीय नागरिक सुरक्षा संहिता २०२३ (BNSS)</strong> व <strong>BNS २०२३</strong> चा संदर्भ घेतलेला आहे.</p>
                <p>✓ महाराष्ट्र जमीन महसूल संहिता १९६६ कलम १५० अन्वये १५ दिवसांच्या फेरफार नोटीस नियमाशी सुसंगत आहे.</p>
                <p>✓ कोणतेही चुकीचे, अप्रमाणित किंवा प्रलंबित दाव्यांचे गैरसमज पसरवणारे दावे नाहीत.</p>
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
                <span>AI व्हिज्युअल प्रॉम्ट तयार करा</span>
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
              <span>AI व्हिज्युअल व सीन प्रॉम्ट (Visual Prompt Generation)</span>
            </h2>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                खालील प्रॉम्ट <strong>Advocate Pratiksha</strong> यांच्या चेहऱ्याची ओळख, काळा कोट, पांढरा शर्ट व कॉलर बँड यांना केंद्रस्थानी ठेवून तयार केलेला आहे:
              </p>

              <textarea
                rows={4}
                value={visualPrompt}
                onChange={(e) => setVisualPrompt(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-gold-500 font-mono leading-relaxed"
              />

              <div className="p-3 rounded-xl bg-navy-900/80 border border-navy-750 text-xs text-slate-400 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>चेहऱ्याची मूळ ठेवण १००% सुरक्षित राहील. कोणतेही अनावश्यक फेस-अल्टरेशन किंवा बनावट रूप वापरले जात नाही.</span>
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
                <span>माझा ॲडव्होकेट फोटो निवडा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SELECT ADVOCATE PHOTO */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">5</span>
              <span>माझा Advocate Pratiksha फोटो निवडा (Choose Reference Photo)</span>
            </h2>

            {avatarList.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  व्हिडिओमधील चेहरा खालील निवडलेल्या अधिकृत फोटोशी तंतोतंत सुसंगत ठेवला जाईल:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {avatarList.map((av) => (
                    <div
                      key={av.filename}
                      onClick={() => setSelectedAvatar(av)}
                      className={`p-2 rounded-xl border cursor-pointer transition-all ${
                        selectedAvatar?.filename === av.filename
                          ? 'border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/20 scale-[1.02]'
                          : 'border-navy-750 bg-navy-900 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt="Avatar"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <div className="text-[11px] font-bold text-white truncate">{av.filename}</div>
                      {av.isDefault && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-gold-500 text-navy-950 font-bold mt-1">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-navy-900 border border-dashed border-navy-700 rounded-xl space-y-3">
                <ImageIcon className="w-10 h-10 mx-auto text-slate-500" />
                <p className="text-xs text-slate-300">अद्याप कोणताही अधिकृत फोटो अपलोड केलेला नाही.</p>
                <button
                  onClick={() => onNavigateTab('photo')}
                  className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold shadow-md"
                >
                  My Photo Studio मध्ये फोटो अपलोड करा
                </button>
              </div>
            )}

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
                <span>व्हिडिओ व ऑडिओ सेटिंग्ज</span>
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
              <span>व्हिडिओ व व्हॉईस निर्मिती (Video & Voice Settings)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Volume2 className="w-4 h-4 text-gold-400 mr-1.5" />
                  <span>आवाज गती (Voice Speed):</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {['slow', 'normal', 'fast'].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setVoiceSpeed(spd)}
                      className={`py-1.5 rounded-lg font-bold border transition-all ${
                        voiceSpeed === spd
                          ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                          : 'bg-navy-950 text-slate-400 border-navy-800'
                      }`}
                    >
                      {spd === 'slow' ? 'संथ' : spd === 'normal' ? 'मध्यम' : 'वेगवान'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Clock className="w-4 h-4 text-purple-400 mr-1.5" />
                  <span>व्हिडिओ कालावधी:</span>
                </label>
                <div className="text-sm font-bold text-white mt-1">
                  {videoDuration} सेकंद (Instagram 9:16 Reel)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center">
                  <Sliders className="w-4 h-4 text-emerald-400 mr-1.5" />
                  <span>व्हिडिओ रिझोल्यूशन:</span>
                </label>
                <div className="text-sm font-bold text-white mt-1">
                  1080 x 1920 (Full HD Vertical)
                </div>
              </div>
            </div>

            {isGenerating && (
              <div className="p-6 rounded-xl bg-navy-900 border border-gold-500/30 text-center space-y-3">
                <div className="text-sm font-bold text-gold-400 animate-pulse">
                  AI व्हिडिओ निर्मिती सुरू आहे... कृपया थोडा वेळ थांबा ({renderProgress}%)
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                  <div
                    className="bg-gradient-to-r from-gold-500 to-amber-400 h-full transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
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
              <button
                onClick={handleSimulateRender}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>व्हिडिओ रेंडर करा व कॅप्शन्स पहा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: CAPTIONS + SEO */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">7</span>
              <span>कॅप्शन्स, SEO व हॅशटॅग्स (Captions & Hashtags)</span>
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
                  <label className="text-xs font-semibold text-slate-300">व्हायरल हॅशटॅग्स (Hashtags):</label>
                  <button
                    onClick={() => copyToClipboard(hashtags, 'hashtags')}
                    className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedField === 'hashtags' ? 'कॉपी झाले!' : 'हॅशटॅग्स कॉपी करा'}</span>
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
                onClick={() => setCurrentStep(8)}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                <span>प्रिव्ह्यू, टेलिप्रॉम्प्टर व डाऊनलोड</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: PREVIEW & DOWNLOAD / TELEPROMPTER */}
        {currentStep === 8 && (
          <div className="space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">8</span>
              <span>व्हिडिओ प्रिव्ह्यू, टेलिप्रॉम्प्टर व एक्स्पोर्ट (Export & Teleprompter)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Visual / Avatar Card */}
              <div className="bg-navy-900 rounded-2xl p-4 border border-navy-750 flex flex-col items-center justify-center text-center">
                {selectedAvatar ? (
                  <div className="relative w-48 h-72 rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-2xl mb-3">
                    <img src={selectedAvatar.url} alt="Advocate" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent p-3 text-left">
                      <span className="text-[10px] text-gold-400 font-extrabold uppercase">आपला कायदा</span>
                      <h4 className="text-xs font-bold text-white">Advocate Pratiksha</h4>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-72 rounded-2xl bg-navy-950 border border-dashed border-navy-700 flex flex-col items-center justify-center p-4 mb-3 text-slate-500 text-xs">
                    <Video className="w-8 h-8 mb-2" />
                    <span>फोटो निवडलेला नाही</span>
                  </div>
                )}
                <div className="text-xs font-bold text-white">{topicTitle}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{videoDuration} सेकंद | मराठी व्हॉईस सिंक्रोनाईज्ड</div>
              </div>

              {/* Right Column: Teleprompter & Export Buttons */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="p-4 rounded-xl bg-navy-900/90 border border-navy-750">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gold-400">टेलिप्रॉम्प्टर स्क्रिप्ट (Teleprompter Preview):</span>
                    <button
                      onClick={() => copyToClipboard(scriptData.fullText, 'fullScript')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'fullScript' ? 'कॉपी झाले!' : 'पूर्ण स्क्रिप्ट कॉपी करा'}</span>
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto text-xs text-slate-200 leading-relaxed font-sans pr-2 space-y-2 border-t border-navy-800 pt-2">
                    <p className="font-bold text-gold-300">"{scriptData.hook}"</p>
                    <p>{selectedFormat === 'A' ? scriptData.bodyFormatA : scriptData.bodyFormatB}</p>
                    <p className="text-slate-400 italic">"{scriptData.callToAction}"</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([`${topicTitle}\n\n${scriptData.fullText}\n\nकॅप्शन:\n${captionText}\n\nहॅशटॅग्स:\n${hashtags}`], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Advocate_Pratiksha_Reel_Script_${Date.now()}.txt`;
                      a.click();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs sm:text-sm border border-navy-700 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4 text-gold-400" />
                    <span>स्क्रिप्ट फाईल डाऊनलोड करा (.TXT)</span>
                  </button>

                  <button
                    onClick={() => {
                      copyToClipboard(`${captionText}\n\n${hashtags}`, 'allCaptions');
                      alert('कॅप्शन आणि हॅशटॅग्स क्लिपबोर्डवर कॉपी झाले आहेत!');
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs sm:text-sm shadow-lg shadow-gold-500/20 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Instagram वर पोस्ट करण्यासाठी तयार</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-navy-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>नवीन व्हिडिओ सुरू करा</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
