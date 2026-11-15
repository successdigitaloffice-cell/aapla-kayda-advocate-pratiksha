import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Eye,
  MapPin,
  Scale,
  Landmark,
  AlertTriangle,
  FolderLock,
  ExternalLink,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Tab4PhotoStudio() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const legalDocuments = [
    {
      id: 'doc_1',
      title: 'भूमी अभिलेख मोजणी नकाशा (Cadastral Survey Map & Blueprint)',
      category: 'जमीन मोजणी व नगररचना',
      actReference: 'तुकडेबंदी अधिनियम १९४७ कलम ८ब व MLRC १९६६',
      badge: 'अधिकृत मोजणी',
      color: 'from-blue-500/20 to-sky-500/10 text-sky-400 border-sky-500/40',
      description: '१ ते ३ गुंठे जमिनीचे सीमांकन, उपअधीक्षक भूमी अभिलेख कार्यालयाचा अधिकृत प्रमाणित मोजणी नकाशा व डीपी रस्ता आराखडा.',
      keyPoints: [
        'तुकडेबंदी कायद्यातील शिथिलतेनुसार ई-मोजणी नकाशा आवश्यक.',
        '९ मीटर रस्ता व भूखंड सीमांकन नकाशावर नमूद असणे बंधनकारक.',
        'तलाठ्याकडे फेरफार अर्जासोबत जोडण्यासाठी प्राथमिक पुरावा.'
      ],
      icon: MapPin,
      previewUrl: '/api/video-engine/preview/test_explainer_reel/frame_scene3_survey.jpg'
    },
    {
      id: 'doc_2',
      title: 'गाव नमुना सात व बारा आणि फेरफार रजिस्टर (7/12 Extract & Ferfar)',
      category: 'महसूल अभिलेख व मालकी हक्क',
      actReference: 'महाराष्ट्र जमीन महसूल संहिता १९६६ (कलम १४९ व १५०)',
      badge: 'महसूल नोंद',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/40',
      description: 'गाव नमुना सात व बारा, गाव नमुना ६ फेरफार नोंद, भोगवटादार वर्ग-२ कायदेशीर तरतुदी व बँकेचा बोजा कमी करण्याची पद्धत.',
      keyPoints: [
        'केवळ खरेदीखत मालकी हक्क देत नाही, ७/१२ वर नाव लागणे आवश्यक.',
        'कलम १५० अन्वये १५ दिवसांची जाहीर नोटीस प्रक्रिया.',
        'ई-हक्क (e-Haqq) पोर्टलवरून घरबसल्या फेरफार नोंद करण्याची सुविधा.'
      ],
      icon: Landmark,
      previewUrl: '/api/video-engine/preview/test_explainer_reel/frame_scene2_satbara.jpg'
    },
    {
      id: 'doc_3',
      title: 'नोंदणीकृत खरेदीखत (Registered Sale Deed & Stamp Paper)',
      category: 'नोंदणी व मुद्रांक विभाग',
      actReference: 'नोंदणी अधिनियम १९०८ (कलम १७) व महाराष्ट्र मुद्रांक कायदा',
      badge: 'नोंदणीकृत दस्त',
      color: 'from-gold-500/20 to-yellow-500/10 text-gold-400 border-gold-500/40',
      description: 'दुय्यम निबंधक कार्यालयातील ₹५०० चे अधिकृत नॉन-ज्युडिशियल स्टॅम्प पेपर, ई-मुद्रांक पडताळणी आणि न्यायदेवता तराजू सुरक्षा हमी.',
      keyPoints: [
        '१०० रुपयांपेक्षा अधिक मूल्याच्या अचल मालमत्तेची खरेदी केवळ नोंदणीकृत खरेदीखतानेच वैध.',
        'कच्च्या नोटरी किंवा साध्या १०० रुपयांच्या स्टॅम्पवर पैसे देणे अवैध.',
        'Sub-Registrar कार्यालयाचा अधिकृत दस्त क्रमांक व ई-चलन पावतर.'
      ],
      icon: Scale,
      previewUrl: '/api/video-engine/preview/test_explainer_reel/frame_scene4_deed.jpg'
    },
    {
      id: 'doc_4',
      title: 'प्लॉट सीमांकन व अनधिकृत लेआउट इशारा (Plot Demarcation Aerial)',
      category: 'गुंठेवारी व प्लॉटिंग कायदे',
      actReference: 'महाराष्ट्र गुंठेवारी विकास (नियमनाधीन करणे) कायदा २००१',
      badge: 'हाय-स्टेक अलर्ट',
      color: 'from-red-500/20 to-rose-500/10 text-red-400 border-red-500/40',
      description: 'खुले प्लॉट लेआउट, सीमांकन झेंडे व ३१ डिसेंबर २०२० पूर्वीच्या गुंठेवारी नियमितीकरण शुल्काची अधिकृत माहिती.',
      keyPoints: [
        '३१ डिसेंबर २०२० पूर्वीच्या बांधकामांनाच नियमितीकरणाची मुभा.',
        'सक्षम प्राधिकरणाची परवानगी नसलेल्या लेआउटमध्ये लाखो रुपयांची फसवणूक टाळा.',
        'प्लॉट खरेदीपूर्वी महसूल विभागाचा एन.ए. (Non-Agricultural) आदेश तपासा.'
      ],
      icon: AlertTriangle,
      previewUrl: '/api/video-engine/preview/test_explainer_reel/frame_scene1_hook.jpg'
    },
    {
      id: 'doc_5',
      title: 'सायबर सुरक्षा व १९३० हेल्पलाईन (Cyber Crime 1930 Alert)',
      category: 'सायबर गुन्हे व डिजिटल सुरक्षा',
      actReference: 'भारतीय न्याय संहिता २०२३ (BNSS) व माहिती तंत्रज्ञान कायदा २०००',
      badge: 'सायबर अलर्ट',
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/40',
      description: 'बँक खात्यातून परस्पर पैसे कापले गेल्यास पहिल्या २ तासांतील गोल्डन अवर नियम व १९३० राष्ट्रीय सायबर हेल्पलाईन.',
      keyPoints: [
        'पैसे कापल्यापासून पहिल्या २ तासांत १९३० वर कॉल केल्यास बँक ट्रॅन्झॅक्शन तातडीने फ्रीझ होते.',
        'cybercrime.gov.in वर ई-तक्रार नोंदवणे बंधनकारक.',
        'RBI मार्गदर्शक तत्त्वानुसार ग्राहकाची चूक नसल्यास संपूर्ण रक्कम परतावा मिळण्याचा हक्क.'
      ],
      icon: FolderLock,
      previewUrl: '/api/video-engine/preview/test_explainer_reel/frame_scene1_hook.jpg'
    },
    {
      id: 'doc_6',
      title: 'वडिलोपार्जित संपत्तीत मुलींचा समान हक्क (Daughter Inheritance)',
      category: 'वारसाहक्क आणि कौटुंबिक कायदे',
      actReference: 'हिंदू वारसा सुधारणा कायदा २००५ (कलम ६) व सर्वोच्च न्यायालय निकाल',
      badge: 'महिला हक्क',
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/40',
      description: 'सर्वोच्च न्यायालयाचा विनीता शर्मा वि. राकेश शर्मा निकाल: जन्मतः मुलाच्या बरोबरीने शेती व संपत्तीत समान हिस्सा.',
      keyPoints: [
        'मुलीचा जन्म २००५ पूर्वी झालेला असो वा नंतर, तिला जन्मतः सहदायिका (Coparcener) अधिकार.',
        'भाऊ किंवा वडील संमती देत नसले तरी न्यायालयात वाटणीचा दावा (Partition Suit) दाखल करता येतो.',
        'तहसीलदारांकडे वारसा फेरफार नोंद करताना मुलीचे नाव वगळणे बेकायदेशीर.'
      ],
      icon: BookOpen,
      previewUrl: '/api/video-engine/preview/test_explainer_reel/frame_scene2_satbara.jpg'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% अधिकृत कायदेशीर कागदपत्रे व व्हिज्युअल्स</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            कायदेशीर कागदपत्रे व व्हिज्युअल लायब्ररी
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Advocate Pratiksha यांच्या व्हिडिओ स्टुडिओमध्ये वापरण्यात येणारे अधिकृत ७/१२, मोजणी नकाशे, नोंदणीकृत खरेदीखत आणि शासन निर्णय.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-navy-950/80 border border-gold-500/30 px-4 py-2.5 rounded-xl">
          <Sparkles className="w-5 h-5 text-gold-400" />
          <div className="text-left">
            <div className="text-[11px] text-slate-400">व्हिडिओ निर्मिती पद्धत</div>
            <div className="text-xs font-extrabold text-gold-400">100% Text & Topic Visual Explainer</div>
          </div>
        </div>
      </div>

      {/* 2. Notice Card on Zero Fake Avatars */}
      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start space-x-3 text-xs text-emerald-200">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-300 font-bold">व्यावसायिक कायदेशीर दर्जा (Legal Documentary Standard):</strong>
          <span className="text-slate-300 ml-1">
            आपल्या या सिस्टीममध्ये कोणतेही बनावट/व्यंगचित्र कार्टून अवतार वापरले जात नाहीत. प्रत्येक Instagram Reel थेट विषयाशी संबंधित अधिकृत कागदपत्रे, सरकारी कायदे, मोजणी नकाशे व स्पष्ट देवनागरी फॉन्टसह तयार होते.
          </span>
        </div>
      </div>

      {/* 3. Grid of Legal Document Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {legalDocuments.map((doc) => {
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              className="bg-navy-900 border border-navy-750 hover:border-gold-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-gold-500/5 group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-gradient-to-r ${doc.color}`}>
                    {doc.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {doc.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-2 mb-2">
                  {doc.title}
                </h3>

                {/* Act Reference */}
                <div className="text-[11px] font-semibold text-gold-400/90 mb-2.5 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{doc.actReference}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 mb-3 line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>

                {/* Bullet Key Points */}
                <div className="space-y-1.5 pt-2 border-t border-navy-800">
                  {doc.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-[11px] text-slate-400">
                      <span className="text-gold-500 font-bold">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-navy-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-slate-200 font-bold text-xs transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>दस्तऐवज पहा (Preview)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-500/60 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-gold-400">
                  {selectedDoc.category}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  अधिकृत कायदा: {selectedDoc.actReference}
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-lg bg-navy-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Document Image Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-navy-700 bg-navy-950 aspect-[9/14] flex items-center justify-center">
              <img
                src={selectedDoc.previewUrl}
                alt={selectedDoc.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-navy-950/90 backdrop-blur-md border border-gold-500/40 rounded-xl p-3 text-xs text-slate-200">
                <div className="font-bold text-gold-400 mb-1">📌 कायदेशीर वापर:</div>
                <div>{selectedDoc.description}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs transition-colors"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
