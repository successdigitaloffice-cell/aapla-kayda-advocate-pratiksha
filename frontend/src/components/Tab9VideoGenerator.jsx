import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  RotateCw,
  Download,
  Mic,
  Square,
  Upload,
  CheckCircle2,
  Sparkles,
  Layers,
  ExternalLink,
  Music,
  Clock,
  AlertCircle,
  Volume2,
  Copy,
  Check,
  Trash2,
  FileText,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { resolveMediaUrl, downloadFileFromUrl } from '../utils/api';

const VIDEO_API_BASE = '/api/video-engine';

const toVideoUrl = (p) => {
  if (!p) return '';
  return resolveMediaUrl(p);
};

const SAMPLE_SCRIPTS = [
  {
    id: 'gunthewari',
    title: 'गुंठेवारी नियमितीकरण २०२६',
    text: `तुमचे घर १ किंवा २ गुंठे अनधिकृत प्लॉटवर आहे? मनपा किंवा नगरपालिकेकडून नोटीस येण्यापूर्वी हा एक अर्ज त्वरित करा!
गुंठेवारी नियमितीकरणासाठी महाराष्ट्र शासनाने सुधारित नियमावली जारी केली आहे.
यासाठी ७/१२ उतारा, खरेदीखत, मोजणी नकाशा आणि आर्किटेक्टचा लेआउट प्लॅन सादर करावा लागतो.
अनधिकृत प्लॉट अधिकृत करून घराची कायदेशीर सुरक्षितता मिळवा. अधिक माहितीसाठी फॉलो करा आपला कायदा.`
  },
  {
    id: 'tukdebandi',
    title: 'तुकडेबंदी व ७/१२ फेरफार नोंद',
    text: `तुकडेबंदीमुळे तुमच्या १ ते ३ गुंठे जमिनीचा फेरफार अडकलाय? महसूल विभागाचा नवा शासन निर्णय नक्की पहा!
मुंबई तुकडे प्रतिबंध व एकत्रीकरण कायदा १९४७ कलम ८ब नुसार लहान तुकड्यांची खरेदी व दस्त नोंदणीची नवी नियमावली आली आहे.
ज्यांनी विहित नियमानुसार खरेदीखत केले आहे, त्यांना फेरफार नोंदीसाठी ई-हक्क प्रणालीवरून अर्ज करता येतो.
अडचणी असल्यास तलाठी किंवा प्रांताधिकाऱ्यांकडे अपील करता येते. अधिक माहितीसाठी फॉलो करा आपला कायदा.`
  },
  {
    id: 'bnss_rights',
    title: 'BNSS 2023: पोलिसांना थेट अटक करण्याचा अधिकार',
    text: `भारतीय नागरिक सुरक्षा संहिता २०२३ नुसार पोलिसांना कोणालाही थेट अटक करता येते का? तुमचे कायदेशीर अधिकार जाणून घ्या!
BNSS कलम ३५ नुसार ७ वर्षांपेक्षा कमी शिक्षा असलेल्या गुन्ह्यांत थेट अटक न करता कायदेशीर नोटीस देणे अनिवार्य आहे.
अटक करताना अटकेचे कारण लेखी देणे आणि नातेवाईकांना माहिती देणे कायदेशीर बंधनकारक आहे.
कायद्याची योग्य माहिती हीच खरी ताकद आहे! अधिक माहितीसाठी फॉलो करा आपला कायदा – ॲडव्होकेट प्रतीक्षा.`
  }
];

export default function Tab9VideoGenerator({ activeReel, onNotify }) {
  // Script Input Mode: 'paste' (Default Direct Paste) or 'topic' (Pre-built Legal Topics)
  const [scriptMode, setScriptMode] = useState('paste');

  // Direct Script Paste State
  const [pastedScript, setPastedScript] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [copiedScriptNotice, setCopiedScriptNotice] = useState(false);

  // Topics and AI script state
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('gunthewari_2024');
  const [customQuery, setCustomQuery] = useState('');
  const [duration, setDuration] = useState('45'); // Default 45s for in-depth legal reels
  const [currentScript, setCurrentScript] = useState(null);
  const [isLoadingScript, setIsLoadingScript] = useState(false);

  // Voice Settings & Speed Control
  const [voice, setVoice] = useState('aarohi'); // 'aarohi' (Female Advocate Pratiksha) default
  const [speakingSpeed, setSpeakingSpeed] = useState('1.10'); // Default 1.10x
  const [bgMusic, setBgMusic] = useState('legal_ambient');
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null);

  // Video Generation Progress & State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [activeJobId, setActiveJobId] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  // Completed video state & history
  const [videoResult, setVideoResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [customAudioPath, setCustomAudioPath] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const previewAudioRef = useRef(null);

  // Load topics and history on mount
  useEffect(() => {
    fetchTopics();
    fetchHistory();
  }, []);

  // When activeReel prop changes, preload into paste box or script structure
  useEffect(() => {
    if (activeReel) {
      const fullText = activeReel.script_format_a || activeReel.script_format_b || activeReel.hook || '';
      if (fullText && !pastedScript) {
        setPastedScript(fullText);
        setCustomTitle(activeReel.title || '');
      }

      // Also build structured script
      const scList = [
        {
          scene_num: 1,
          type: 'hook',
          title: activeReel.hook || 'महत्त्वाची कायदेशीर सूचना',
          text: activeReel.hook || '',
          visual_cue: activeReel.applicable_law || 'महाराष्ट्र शासन परिपत्रक'
        },
        {
          scene_num: 2,
          type: 'problem',
          title: 'सामान्य अडचण व समस्या',
          text: activeReel.why_important_today || 'नागरिकांना योग्य प्रक्रियेची माहिती नसल्याने आर्थिक नुकसान होऊ शकते.',
          visual_cue: '7/12 land record notice'
        },
        {
          scene_num: 3,
          type: 'law_solution',
          title: 'कायदा आणि अधिकृत तरतूद',
          text: activeReel.script_format_a || activeReel.title,
          visual_cue: activeReel.applicable_law || 'शासन निर्णय'
        },
        {
          scene_num: 4,
          type: 'cta',
          title: 'कायदेशीर सल्ला व कृती',
          text: 'कायद्याची योग्य माहिती हीच खरी ताकद आहे! अधिक माहितीसाठी फॉलो करा आपला कायदा.',
          visual_cue: 'Advocate Pratiksha CTA'
        }
      ];

      setCurrentScript({
        id: 'reel_' + (activeReel.id || 'active'),
        category: activeReel.category || 'जमीन आणि मालमत्ता कायदे',
        title_mr: activeReel.title,
        official_source: activeReel.applicable_law || 'महाराष्ट्र शासन',
        duration: duration,
        hook: activeReel.hook,
        scenes: scList,
        caption: activeReel.caption,
        hashtags: activeReel.hashtags,
        best_posting_time: activeReel.best_posting_time || 'संध्याकाळी ०७:०० PM'
      });
    } else {
      generateDefaultScript();
    }
  }, [activeReel]);

  const fetchTopics = async () => {
    try {
      const res = await fetch(`${VIDEO_API_BASE}/topics`);
      const data = await res.json();
      if (data.success) {
        setTopics(data.topics || []);
      }
    } catch (e) {
      console.warn('Could not connect to video engine port 5055:', e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${VIDEO_API_BASE}/history`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.reels || []);
        if (data.reels?.length > 0 && !videoResult) {
          const latest = data.reels[0];
          setVideoResult({
            folder_name: latest.folder_name,
            final_video_url: toVideoUrl(latest.preview_url),
            download_url: toVideoUrl(latest.download_url),
            duration: latest.duration,
            size_mb: latest.size_mb,
            clips: latest.clips || []
          });
        }
      }
    } catch (e) {
      console.warn('Could not fetch history:', e);
    }
  };

  const generateDefaultScript = async () => {
    setIsLoadingScript(true);
    try {
      const res = await fetch(`${VIDEO_API_BASE}/generate-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          custom_query: customQuery,
          duration: duration
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentScript(data.script);
      }
    } catch (e) {
      onNotify?.('व्हिडिओ इंजिन लोड करताना त्रुटी.');
    } finally {
      setIsLoadingScript(false);
    }
  };

  // Clipboard Paste Helper
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 0) {
        setPastedScript(text.trim());
        onNotify?.('क्लिपबोर्डवरील मराठी स्क्रिप्ट यशस्वीरीत्या पेस्ट झाली!');
      } else {
        onNotify?.('क्लिपबोर्ड रिकामा आहे किंवा त्यात मजकूर सापडला नाही.');
      }
    } catch (e) {
      onNotify?.('क्लिपबोर्ड वाचता आला नाही. कृपया बॉक्समध्ये थेट Ctrl+V करून पेस्ट करा.');
    }
  };

  // Clear Script Helper
  const handleClearScript = () => {
    setPastedScript('');
    setCustomTitle('');
    onNotify?.('स्क्रिप्ट मजकूर पुसला गेला.');
  };

  // Load Sample Script Helper
  const handleLoadSample = (sample) => {
    setPastedScript(sample.text);
    setCustomTitle(sample.title);
    onNotify?.(`"${sample.title}" ची तयार स्क्रिप्ट लोड केली!`);
  };

  // Voice Preview Action
  const handlePreviewVoice = async () => {
    setIsPreviewingVoice(true);
    const textToSample = pastedScript.trim() ||
      currentScript?.scenes?.[0]?.text ||
      'नमस्कार, मी ॲडव्होकेट प्रतीक्षा. आपला कायदा मध्ये आपले स्वागत आहे. आज आपण गुंठेवारी, तुकडेबंदी आणि सातबारा विषयी महत्त्वाची माहिती जाणून घेणार आहोत.';

    try {
      const res = await fetch(`${VIDEO_API_BASE}/preview-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSample.slice(0, 160),
          voice: voice,
          speed: parseFloat(speakingSpeed)
        })
      });
      const data = await res.json();
      if (data.success && data.audio_url) {
        const fullUrl = toVideoUrl(data.audio_url);
        setPreviewAudioUrl(fullUrl);
        if (previewAudioRef.current) {
          previewAudioRef.current.src = fullUrl;
          previewAudioRef.current.load();
          previewAudioRef.current.play().catch(() => {});
        }
        onNotify?.(`आवाज प्रिव्ह्यू तयार (${speakingSpeed}x वेग)!`);
      } else {
        throw new Error(data.error || 'Preview failed');
      }
    } catch (err) {
      onNotify?.('आवाज प्रिव्ह्यू करताना अडचण: ' + err.message);
    } finally {
      setIsPreviewingVoice(false);
    }
  };

  // Start Video Generation (Works with Pasted Script OR Structured Script)
  const handleStartGeneration = async (forceRegen = false) => {
    setGenerationError(null);

    // Validate Script
    const scriptToUse = scriptMode === 'paste' ? pastedScript.trim() : currentScript;
    if (!scriptToUse || (typeof scriptToUse === 'string' && scriptToUse.length < 15)) {
      onNotify?.('कृपया व्हिडिओ बनवण्यासाठी किमान १५ अक्षरांची वैध मराठी स्क्रिप्ट टाका.');
      return;
    }

    setIsGenerating(true);
    setProgress(5);
    setProgressMessage('व्हिडिओ निर्मितीची तयारी सुरू होत आहे...');

    try {
      const payload = {
        voice: voice,
        speed: parseFloat(speakingSpeed),
        duration: duration,
        bg_music: bgMusic,
        custom_audio_path: voice === 'custom' ? customAudioPath : null,
        force_regenerate: forceRegen
      };

      if (scriptMode === 'paste') {
        payload.script_text = pastedScript.trim();
        payload.script_title = customTitle.trim() || undefined;
      } else {
        payload.script = currentScript;
      }

      const res = await fetch(`${VIDEO_API_BASE}/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      if (data.already_completed && data.result) {
        setIsGenerating(false);
        setVideoResult({
          ...data.result,
          final_video_url: toVideoUrl(data.result.final_video_url),
          download_url: toVideoUrl(data.result.download_url)
        });
        onNotify?.('हा व्हिडिओ आधीच तयार आहे! प्रिव्ह्यू स्क्रीनवर लोड केला.');
        return;
      }

      if (data.success && data.job_id) {
        setActiveJobId(data.job_id);
        pollProgress(data.job_id);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (e) {
      setIsGenerating(false);
      setGenerationError(e.message);
      onNotify?.('व्हिडिओ निर्मिती अयशस्वी: ' + e.message);
    }
  };

  const pollProgress = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${VIDEO_API_BASE}/video-status/${jobId}`);
        const data = await res.json();
        if (data.success && data.job) {
          const job = data.job;
          setProgress(job.progress || 0);
          setProgressMessage(job.message || '');

          if (job.status === 'completed') {
            clearInterval(interval);
            setIsGenerating(false);
            setVideoResult({
              ...job.result,
              final_video_url: toVideoUrl(job.result.final_video_url),
              download_url: toVideoUrl(job.result.download_url)
            });
            onNotify?.('अभिनंदन! 9:16 Instagram Reel MP4 व्हिडिओ यशस्वीरीत्या तयार झाला!');
            fetchHistory();
          } else if (job.status === 'failed') {
            clearInterval(interval);
            setIsGenerating(false);
            setGenerationError(job.message || 'Rendering failed');
            onNotify?.('रेंडरिंग अयशस्वी: ' + job.message);
          }
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 1200);
  };

  // Regenerate Single Clip
  const handleRegenerateClip = async (folderName, sceneNum, newText) => {
    onNotify?.(`क्लिप #${sceneNum} पुन्हा रेंडर होत आहे...`);
    try {
      const res = await fetch(`${VIDEO_API_BASE}/regenerate-clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_name: folderName,
          scene_num: sceneNum,
          text: newText,
          voice: voice,
          speed: parseFloat(speakingSpeed)
        })
      });
      const data = await res.json();
      if (data.success) {
        onNotify?.(data.message);
        setVideoResult(prev => ({
          ...prev,
          final_video_url: toVideoUrl(data.final_video_url),
          download_url: toVideoUrl(data.download_url),
          duration: data.duration,
          size_mb: data.size_mb
        }));
        if (videoPlayerRef.current) {
          videoPlayerRef.current.src = toVideoUrl(data.final_video_url);
          videoPlayerRef.current.load();
          videoPlayerRef.current.play().catch(() => {});
        }
      }
    } catch (e) {
      onNotify?.('क्लिप री-जनरेट करताना त्रुटी आली.');
    }
  };

  // Combine Clips
  const handleCombineClips = async (folderName) => {
    onNotify?.('सर्व क्लिप्स पुन्हा जोडत आहे...');
    try {
      const res = await fetch(`${VIDEO_API_BASE}/combine-clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_name: folderName,
          bg_music: bgMusic
        })
      });
      const data = await res.json();
      if (data.success) {
        onNotify?.(data.message);
        setVideoResult(prev => ({
          ...prev,
          final_video_url: toVideoUrl(data.final_video_url),
          download_url: toVideoUrl(data.download_url),
          duration: data.duration,
          size_mb: data.size_mb
        }));
      }
    } catch (e) {
      onNotify?.('क्लिप्स जोडण्यात अडचण आली.');
    }
  };

  // Mic Recording
  const handleStartRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setRecordedAudioUrl(URL.createObjectURL(audioBlob));

        const formData = new FormData();
        formData.append('file', audioBlob, 'pratiksha_voice.mp3');

        try {
          const res = await fetch(`${VIDEO_API_BASE}/upload-media`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            setCustomAudioPath(data.file_path);
            setVoice('custom');
            onNotify?.('ॲडव्होकेट प्रतीक्षा यांचा आवाज सेव्ह झाला!');
          }
        } catch (err) {
          onNotify?.('ऑडिओ अपलोड करताना त्रुटी आली.');
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } catch (e) {
      alert('मायक्रोफोन ॲक्सेस मिळाला नाही.');
    }
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Metrics for Pasted Script
  const scriptWordCount = pastedScript ? pastedScript.trim().split(/\s+/).length : 0;
  const scriptCharCount = pastedScript.length;
  const estSpeakingSecs = Math.round((scriptWordCount / 2.3) / parseFloat(speakingSpeed || 1.10));

  return (
    <div className="tab9-video-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner with Service Indicators */}
      <div className="glass-card" style={{
        padding: '1.25rem 1.75rem',
        background: 'linear-gradient(135deg, rgba(20, 26, 42, 0.95), rgba(10, 14, 22, 0.98))',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            fontSize: '2rem',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🎬
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F5D76E', margin: 0 }}>
                आपला कायदा — Direct Script-to-Video Studio
              </h2>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>v2.5 Enhanced</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '3px 0 0' }}>
              कोणतीही मराठी स्क्रिप्ट पेस्ट करा आणि अचूक देवनगरी टायपोग्राफी, 1.10x व्हॉइस-ओव्हर व पार्श्वसंगीतासह थेट 9:16 Reel MP4 बनवा!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            padding: '6px 12px',
            borderRadius: '20px'
          }}>
            ⚡ Video Engine Port 5055 Active
          </span>
          <a
            href="/studio"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>फुलस्क्रीन स्टुडिओ</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Main Grid: Controls vs Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)', gap: '1.5rem' }}>
        
        {/* Left Column: Script Input & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SCRIPT INPUT CARD (Core Requirement 5) */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0, fontWeight: 700 }}>
                  १. मराठी स्क्रिप्ट इनपुट (Paste or Enter Script)
                </h3>
              </div>

              {/* Mode Toggle Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setScriptMode('paste')}
                  className={`btn btn-sm ${scriptMode === 'paste' ? 'btn-gold' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                >
                  📝 थेट स्क्रिप्ट पेस्ट करा (Direct Paste)
                </button>
                <button
                  type="button"
                  onClick={() => setScriptMode('topic')}
                  className={`btn btn-sm ${scriptMode === 'topic' ? 'btn-gold' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                >
                  📜 विषय निवडीवरून (Pre-built)
                </button>
              </div>
            </div>

            {/* SCRIPT PASTE MODE (Primary) */}
            {scriptMode === 'paste' ? (
              <div>
                {/* Title Input (Optional) */}
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="व्हिडिओचे शीर्षक (उदा. गुंठेवारी नियमितीकरण २०२६ / तुकडेबंदी ७/१२ नोंद)"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(11, 15, 25, 0.85)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      color: '#F5D76E',
                      fontSize: '0.92rem',
                      fontWeight: 600
                    }}
                  />
                </div>

                {/* Main Large Multiline Script Textarea */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={pastedScript}
                    onChange={(e) => setPastedScript(e.target.value)}
                    placeholder="येथे तुमची संपूर्ण मराठी कायदेशीर स्क्रिप्ट पेस्ट करा किंवा लिहा...

उदा. 
तुमचे घर १ किंवा २ गुंठे अनधिकृत प्लॉटवर आहे? मनपाकडून नोटीस येण्यापूर्वी हा एक अर्ज त्वरित करा!
गुंठेवारी नियमितीकरणासाठी नगरविकास विभागाने शासन निर्णय जारी केला आहे.
यासाठी ७/१२ उतारा, खरेदीखत, मोजणी नकाशा आणि आर्किटेक्टचा लेआउट प्लॅन आवश्यक आहे.
अधिक माहितीसाठी फॉलो करा आपला कायदा."
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'rgba(7, 10, 18, 0.95)',
                      border: '2px solid rgba(212, 175, 55, 0.4)',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      fontFamily: "'Mukta', 'Nirmala UI', sans-serif",
                      resize: 'vertical',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)'
                    }}
                  />
                </div>

                {/* Toolbar for Script Box */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {/* Left: Quick Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="btn btn-secondary btn-sm"
                      title="क्लिपबोर्डवरून मजकूर पेस्ट करा"
                    >
                      <Copy size={13} />
                      <span>Paste from Clipboard</span>
                    </button>

                    {activeReel && (
                      <button
                        type="button"
                        onClick={() => {
                          const t = activeReel.script_format_a || activeReel.script_format_b || activeReel.hook || '';
                          setPastedScript(t);
                          setCustomTitle(activeReel.title || '');
                          onNotify?.('सक्रिय Reel ची स्क्रिप्ट पेस्ट बॉक्समध्ये लोड झाली!');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#F5D76E' }}
                        title="Tab 3 मधील सक्रिय Reel ची स्क्रिप्ट येथे वापरा"
                      >
                        <FileText size={13} />
                        <span>Load Active Reel Script</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleClearScript}
                      className="btn btn-secondary btn-sm"
                      title="मजकूर पुसा"
                    >
                      <Trash2 size={13} />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Right: Metrics */}
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span>शब्द: <strong style={{ color: '#FFF' }}>{scriptWordCount}</strong></span>
                    <span>अक्षरे: <strong style={{ color: '#FFF' }}>{scriptCharCount}</strong></span>
                    <span>अंदाजे वेळ: <strong style={{ color: '#34D399' }}>~{estSpeakingSecs}s</strong></span>
                  </div>
                </div>

                {/* Quick 1-Click Legal Samples */}
                <div style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>
                    💡 चाचणीसाठी तयार कायदेशीर स्क्रिप्ट्स:
                  </span>
                  {SAMPLE_SCRIPTS.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleLoadSample(s)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>

                {/* Preserved-Text Guarantee Badge */}
                <div style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <ShieldCheck size={14} />
                  <span>
                    <strong>100% शब्द संरक्षण हमी:</strong> तुम्ही पेस्ट केलेल्या स्क्रिप्टमधील एकही शब्द गुपचूप बदलला किंवा वगळला जात नाही. स्क्रिप्ट जशी आहे तशीच व्हिडिओमध्ये वापरली जाते.
                  </span>
                </div>
              </div>
            ) : (
              /* PRE-BUILT TOPIC SELECTOR MODE */
              <div>
                <label style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  कायदेशीर विषय निवडा:
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="custom-select"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0B0F19',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#FFF',
                    marginBottom: '10px'
                  }}
                >
                  <option value="gunthewari_2024">गुंठेवारी नियमितीकरणाचे नवे नियम आणि अर्ज कसा करावा?</option>
                  <option value="tukdebandi_satbara_2024">तुकडेबंदी कायदा: १ ते ३ गुंठे जमिनीची खरेदी आणि ७/१२ नोंद</option>
                  <option value="ferfar_varas_nond">वडिलोपार्जित जमिनीवर मुलींचा आणि बहिणींचा समान वाटा कायदेशीर कसा मिळवायचा?</option>
                  <option value="bnss_arrest_rights">BNSS 2023: पोलिसांना कोणालाही थेट अटक करण्याचा अधिकार आहे का?</option>
                  <option value="cyber_fraud_1930">बँक खात्यातून ऑनलाईन पैसे कापले गेले? पहिल्या २ तासांत 'हे' करा!</option>
                </select>

                {currentScript && (
                  <div style={{
                    background: 'rgba(11, 15, 25, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '10px',
                    padding: '12px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, marginBottom: '4px' }}>
                      {currentScript.category} • {currentScript.official_source}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', color: '#FFF', margin: '0 0 6px' }}>{currentScript.title_mr}</h4>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderLeft: '3px solid #EF4444',
                      padding: '8px 12px',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.82rem',
                      color: '#FECACA'
                    }}>
                      <strong>🎣 Hook:</strong> {currentScript.hook}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DURATION SELECTION CARD (Core Requirement 6) */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#D4AF37" />
                <h4 style={{ fontSize: '0.95rem', color: '#FFF', margin: 0 }}>
                  २. व्हिडिओ कालावधी (Duration)
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                सविस्तर कायदेशीर रील्ससाठी ४५ किंवा ६० सेकंद निवडा
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { val: '30', label: '३० सेकंद (Fast Tip)', desc: 'महत्त्वाची सूचना व अलर्ट' },
                { val: '45', label: '४५ सेकंद (Standard)', desc: 'कायदा, नियम व प्रक्रिया (शिफारस)' },
                { val: '60', label: '६० सेकंद (In-Depth)', desc: 'सविस्तर निकाल व अटी' }
              ].map(d => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => setDuration(d.val)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: duration === d.val ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1.5px solid ${duration === d.val ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: duration === d.val ? '#F5D76E' : '#CBD5E1',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{d.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* VOICE & SPEED CONTROLS (Core Requirements 3 & 4) */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0, fontWeight: 700 }}>
                  ३. मराठी आवाज, गती (Speed) व पार्श्वसंगीत
                </h3>
              </div>

              {/* Preview Voice Button */}
              <button
                type="button"
                onClick={handlePreviewVoice}
                disabled={isPreviewingVoice}
                className="btn btn-secondary btn-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.35))',
                  border: '1px solid #D4AF37',
                  color: '#F5D76E',
                  fontWeight: 700
                }}
              >
                <Volume2 size={14} />
                <span>{isPreviewingVoice ? 'तयार होत आहे...' : '🔊 Preview Voice (आवाज ऐका)'}</span>
              </button>
            </div>

            {/* Hidden audio element for preview */}
            <audio ref={previewAudioRef} style={{ display: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.25rem', marginBottom: '1rem' }}>
              {/* Voice Options */}
              <div>
                <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  मराठी व्हॉइस निवडा:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: voice === 'aarohi' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${voice === 'aarohi' ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="voiceOption"
                      value="aarohi"
                      checked={voice === 'aarohi'}
                      onChange={() => setVoice('aarohi')}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>👩‍⚖️ ॲडव्होकेट प्रतीक्षा (Aarohi)</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>मराठी न्यूरल आवाज • शिफारस केलेला</div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: voice === 'manohar' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${voice === 'manohar' ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="voiceOption"
                      value="manohar"
                      checked={voice === 'manohar'}
                      onChange={() => setVoice('manohar')}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>👨‍⚖️ मनोहर (Manohar - Male)</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>गंभीर कायदेशीर व्याख्याता आवाज</div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: voice === 'custom' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${voice === 'custom' ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="voiceOption"
                      value="custom"
                      checked={voice === 'custom'}
                      onChange={() => setVoice('custom')}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>🎤 स्वतःचा रेकॉर्ड केलेला आवाज</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>माईक किंवा ऑडिओ फाईल अपलोड</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Music & Mic */}
              <div>
                <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  रॉयल्टी-फ्री पार्श्वसंगीत (Background Music):
                </label>
                <select
                  value={bgMusic}
                  onChange={(e) => setBgMusic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0B0F19',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#FFF',
                    marginBottom: '10px',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="legal_ambient">🏛️ कायदेशीर व शांत (Legal Ambient)</option>
                  <option value="dramatic_suspense">⚠️ सावधगिरी व इशारा (Dramatic Suspense)</option>
                  <option value="inspirational_success">✨ यशोगाथा व दिलासा (Inspirational)</option>
                  <option value="none">🔇 संगीत नको (Only Voice)</option>
                </select>

                {/* Mic Recorder */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>थेट आवाज रेकॉर्ड करा:</span>
                    {isRecording && <span style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 700 }}>🔴 {recordSeconds}s</span>}
                  </div>
                  {!isRecording ? (
                    <button type="button" onClick={handleStartRecord} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                      <Mic size={14} color="#EF4444" />
                      <span>माईक सुरू करा</span>
                    </button>
                  ) : (
                    <button type="button" onClick={handleStopRecord} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                      <Square size={14} />
                      <span>थांबवा आणि सेव्ह करा</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SPEAKING SPEED SELECTOR (Core Requirement 4) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 14px',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#F5D76E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={14} />
                  <span>बोलण्याची गती (Speaking Speed Control):</span>
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '12px' }}>
                  {speakingSpeed}x गती
                </span>
              </div>

              {/* Discrete Speed Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[
                  { speed: '0.85', label: '0.85x', desc: 'हळू' },
                  { speed: '1.00', label: '1.00x', desc: 'सामान्य' },
                  { speed: '1.10', label: '1.10x', desc: 'शिफारस' },
                  { speed: '1.20', label: '1.20x', desc: 'वेगवान' },
                  { speed: '1.30', label: '1.30x', desc: 'अधिक वेगवान' }
                ].map(s => (
                  <button
                    key={s.speed}
                    type="button"
                    onClick={() => setSpeakingSpeed(s.speed)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '6px',
                      background: speakingSpeed === s.speed ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1.5px solid ${speakingSpeed === s.speed ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: speakingSpeed === s.speed ? '#FFF' : '#94A3B8',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: speakingSpeed === s.speed ? '#F5D76E' : '#CBD5E1' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', marginTop: '2px' }}>{s.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '8px' }}>
                * टीप: 1.10x हा मराठी कायद्याच्या स्पष्ट उच्चारांसाठी आणि Instagram Reel च्या जलद आकर्षक प्रवाहासाठी शिफारस केलेला वेग आहे.
              </div>
            </div>

            {/* Error Banner with Retry */}
            {generationError && (
              <div style={{
                marginTop: '14px',
                padding: '12px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FECACA', fontSize: '0.85rem' }}>
                  <AlertCircle size={18} color="#EF4444" />
                  <span>{generationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGeneration(true)}
                  className="btn btn-sm btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={12} />
                  <span>पुन्हा प्रयत्न करा (Retry)</span>
                </button>
              </div>
            )}

            {/* BIG ACTION BUTTON (Generate Video) */}
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => handleStartGeneration(false)}
                disabled={isGenerating}
                className="btn btn-gold btn-lg"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                <Sparkles size={22} />
                <span>{isGenerating ? 'व्हिडिओ रेंडर होत आहे...' : '🎬 Generate Video (थेट व्हिडिओ बनवा)'}</span>
              </button>

              {/* Progress tracker */}
              {isGenerating && (
                <div style={{ marginTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: '#F5D76E', fontWeight: 600 }}>{progressMessage}</span>
                    <span style={{ fontWeight: 800, color: '#10B981' }}>{progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #D4AF37, #10B981)',
                      transition: 'width 0.4s'
                    }} />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: 9:16 Video Player & Clips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* VIDEO PREVIEW CARD */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>
                🎥 ४. तयार Reel प्रिव्ह्यू व डाऊनलोड
              </h3>
              {videoResult?.duration && (
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  {videoResult.duration}s Reel MP4
                </span>
              )}
            </div>

            {/* 9:16 Phone Frame */}
            <div style={{
              width: '280px',
              height: '497px', // 9:16 aspect ratio scaled
              background: '#000',
              borderRadius: '28px',
              border: '3px solid #334155',
              boxShadow: '0 14px 34px rgba(0,0,0,0.85)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {videoResult?.final_video_url ? (
                <video
                  ref={videoPlayerRef}
                  src={videoResult.final_video_url}
                  controls
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                  <Video size={52} style={{ opacity: 0.35, margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>व्हिडिओ प्रिव्ह्यू स्क्रीन</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    डाव्या बाजूला मराठी स्क्रिप्ट पेस्ट करा आणि 'Generate Video' बटण दाबा.
                  </p>
                </div>
              )}
            </div>

            {/* Download Button */}
            {videoResult?.download_url && (
              <div style={{ width: '280px', marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => downloadFileFromUrl(videoResult.download_url, `Advocate_Pratiksha_Reel_${Date.now()}.mp4`)}
                  className="btn btn-download btn-block"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#FFF',
                    fontWeight: 700,
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Download size={18} />
                  <span>Download Final MP4</span>
                </button>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                  कालावधी: <strong style={{ color: '#FFF' }}>{videoResult.duration}s</strong> | आकार: <strong style={{ color: '#FFF' }}>{videoResult.size_mb} MB</strong> | गती: <strong style={{ color: '#34D399' }}>{videoResult.speed || speakingSpeed}x</strong>
                </div>
              </div>
            )}
          </div>

          {/* SCENES & CLIPS MANAGEMENT CARD */}
          {videoResult?.clips?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#F5D76E', margin: 0 }}>
                  🎬 सीन्स व क्लिप्स व्यवस्थापन ({videoResult.clips.length} Clips)
                </h4>
                <button
                  type="button"
                  onClick={() => handleCombineClips(videoResult.folder_name)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  <Layers size={12} />
                  <span>पुन्हा जोडा</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {videoResult.clips.map(cl => (
                  <div key={cl.scene_num} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <strong style={{ color: '#FFF' }}>क्लिप #{cl.scene_num}:</strong> {cl.title}
                      <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{cl.duration}s</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newTxt = prompt('सुधारित मजकूर टाका:', cl.text);
                        if (newTxt) handleRegenerateClip(videoResult.folder_name, cl.scene_num, newTxt);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                    >
                      <RotateCw size={12} />
                      <span>बदला</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GENERATION HISTORY CARD */}
          {history.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#F5D76E', margin: '0 0 10px' }}>
                📜 तयार व्हिडिओ इतिहास (Generated History)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {history.slice(0, 5).map((h, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem'
                  }}>
                    <div>
                      <div style={{ color: '#FFF', fontWeight: 600 }}>{h.title || h.folder_name}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                        {h.duration}s • {h.size_mb} MB • {h.created_at || 'Recently'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoResult({
                          folder_name: h.folder_name,
                          final_video_url: toVideoUrl(h.preview_url),
                          download_url: toVideoUrl(h.download_url),
                          duration: h.duration,
                          size_mb: h.size_mb,
                          clips: h.clips || []
                        });
                        onNotify?.('व्हिडिओ प्रिव्ह्यू स्क्रीनवर लोड केला!');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                    >
                      प्रिव्ह्यू पहा
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
