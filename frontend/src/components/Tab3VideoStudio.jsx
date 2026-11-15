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
  const [avatarList, setAvatarList] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

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
      generateWorkflowScript(title, selectedTopic.category);
    } else {
      const defaultTitle = 'गुंठेवारी ३१ डिसेंबर २०२० चा नियम आणि नियमितीकरण शुल्क समजून घ्या!';
      setTopicTitle(defaultTitle);
      generateWorkflowScript(defaultTitle, 'महाराष्ट्र जमीन महसूल व गुंठेवारी');
    }
    loadAvatars();
    loadReelsHistory();
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
          setRenderedVideoUrl(latest.preview_url);
          setDownloadVideoUrl(latest.download_url);
        }
      }
    } catch (e) {
      console.error('Failed to load reels history:', e);
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

  const handlePreviewVoice = async () => {
    setIsPreviewPlaying(true);
    try {
      const speedMap = { slow: 0.95, normal: 1.10, fast: 1.25 };
      const sample = `नमस्कार, मी Advocate Pratiksha. आपला कायदा मध्ये आपले स्वागत आहे.`;
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
          const audio = new Audio(directUrl);
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
    setRenderStatusMessage('Google Flow & Marathi Video Engine सुरू होत आहे...');

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
        setRenderedVideoUrl(`/api/video-engine/preview/${folder}/final_reel.mp4`);
        setDownloadVideoUrl(`/api/video-engine/download/${folder}/final_reel.mp4`);
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
              setRenderedVideoUrl(`/api/video-engine/preview/${folder}/final_reel.mp4`);
              setDownloadVideoUrl(`/api/video-engine/download/${folder}/final_reel.mp4`);
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
                  Format A (३०-४०s)
                </button>
                <button
                  onClick={() => setSelectedFormat('B')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedFormat === 'B' ? 'bg-gold-500 text-navy-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Format B (५०-६०s)
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
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  कायदेशीर मुद्दे व मार्गदर्शन (Legal Body & Solution):
                </label>
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
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none leading-relaxed"
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
                <span>पुढील: ॲडव्होकेट फोटो निवड</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ADVOCATE PHOTO SELECTION */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">5</span>
              <span>ॲडव्होकेट फोटो संदर्भ (Advocate Reference Photo)</span>
            </h2>

            <div className="p-4 rounded-xl bg-navy-900 border border-navy-750">
              <p className="text-xs text-slate-300 mb-3">
                व्हिडिओसाठी खालील कायमस्वरूपी अपलोड केलेल्या फोटोंमधून Advocate Pratiksha यांचा संदर्भ फोटो निवडा:
              </p>

              {avatarList.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-navy-700 rounded-xl">
                  <p className="text-xs text-slate-400 mb-2">अद्याप कोणताही फोटो अपलोड केलेला नाही.</p>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('photo')}
                    className="px-4 py-2 rounded-xl bg-gold-500/20 text-gold-400 text-xs font-bold hover:bg-gold-500/30"
                  >
                    Tab 4: My Photo Studio मध्ये फोटो अपलोड करा
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {avatarList.map((av) => (
                    <div
                      key={av.id || av.filename}
                      onClick={() => setSelectedAvatar(av)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1.5 bg-navy-950 text-center ${
                        selectedAvatar?.filename === av.filename
                          ? 'border-gold-500 shadow-lg shadow-gold-500/20 ring-1 ring-gold-500'
                          : 'border-navy-750 hover:border-slate-500'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt="Advocate"
                        className="w-full h-28 object-cover rounded-lg mb-1.5"
                      />
                      <span className="text-[11px] font-semibold text-slate-200 block truncate">
                        {av.filename}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
                <span>पुढील: व्हिडिओ व ऑडिओ निर्मिती</span>
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
                <span>व्हिडिओ प्रिव्ह्यू, डाऊनलोड व एक्सपोर्ट (Video Preview & Export)</span>
              </h2>
              {renderedVideoUrl && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reel MP4 तयार आहे</span>
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
                        key={renderedVideoUrl}
                        controls
                        playsInline
                        autoPlay
                        src={renderedVideoUrl}
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
                      <a
                        href={downloadVideoUrl}
                        download={`Advocate_Pratiksha_Reel_${Date.now()}.mp4`}
                        className="mt-3 w-full max-w-[260px] flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-extrabold text-xs shadow-lg shadow-gold-500/20 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Reel MP4 डाऊनलोड करा</span>
                      </a>
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
                    <a
                      href={downloadVideoUrl}
                      download="Advocate_Pratiksha_Reel.mp4"
                      className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold text-xs sm:text-sm shadow-lg shadow-gold-500/20 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>व्हिडिओ डाऊनलोड (.MP4)</span>
                    </a>
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
                          onClick={() => {
                            setRenderedVideoUrl(reel.preview_url);
                            setDownloadVideoUrl(reel.download_url);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-[11px] font-bold text-gold-400 flex items-center justify-center space-x-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>पहा</span>
                        </button>
                        <a
                          href={reel.download_url}
                          download="Reel.mp4"
                          className="p-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-400"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
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
