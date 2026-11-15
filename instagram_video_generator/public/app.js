/**
 * आपला कायदा – Advocate Pratiksha
 * Standalone Instagram Video Generator Frontend Application Logic
 */

// Application State
const state = {
  activeTab: 'tab-script',
  currentScript: null,
  currentReelFolder: null,
  customAudioFile: null,
  customAudioPath: null,
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  recordInterval: null,
  recordSeconds: 0,
  activeJobId: null,
  pollInterval: null
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initScriptStudio();
  initVideoGenerator();
  initAudioRecorder();
  initMediaUploader();
  initCaptionsAndSEO();
  loadHistory();
  
  // Load default script initially
  document.getElementById('btnGenerateScript').click();
});

// ==================== TABS SWITCHING ====================
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
  });
  
  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === tabId);
  });

  if (tabId === 'tab-history') {
    loadHistory();
  }
  if (tabId === 'tab-60days') {
    load60DaysIdeas();
  }
  if (tabId === 'tab-contentstudio') {
    loadContentSuggestions();
  }
}

// ==================== TAB 1: SCRIPT STUDIO ====================
function initScriptStudio() {
  const btnGen = document.getElementById('btnGenerateScript');
  const btnProceed = document.getElementById('btnProceedToVideo');
  
  btnGen.addEventListener('click', async () => {
    const topicId = document.getElementById('topicSelect').value;
    const customQuery = document.getElementById('customTopicInput').value.trim();
    const duration = document.querySelector('input[name="scriptDuration"]:checked').value;
    
    btnGen.disabled = true;
    btnGen.textContent = '⏳ स्क्रिप्ट तयार होत आहे...';
    
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: topicId,
          custom_query: customQuery,
          duration: duration
        })
      });
      const data = await res.json();
      if (data.success) {
        state.currentScript = data.script;
        renderScriptPreview(data.script);
        showToast('मराठी कायदेशीर स्क्रिप्ट तयार झाली!');
      }
    } catch (err) {
      console.error(err);
      showToast('स्क्रिप्ट लोड करण्यात त्रुटी आली.');
    } finally {
      btnGen.disabled = false;
      btnGen.textContent = '✨ मराठी स्क्रिप्ट तयार करा (Generate Script)';
    }
  });

  btnProceed.addEventListener('click', () => {
    if (!state.currentScript) {
      showToast('कृपया आधी स्क्रिप्ट तयार करा.');
      return;
    }
    switchTab('tab-generate');
  });
}

function renderScriptPreview(script) {
  document.getElementById('scriptCategoryBadge').textContent = script.category || 'Land Laws';
  document.getElementById('scriptSourceBadge').textContent = script.official_source || 'अधिकृत स्रोत';
  document.getElementById('displayScriptTitle').textContent = script.title_mr || '';
  document.getElementById('displayScriptHook').textContent = `"${script.hook}"`;

  // Render scenes
  const scenesContainer = document.getElementById('displayScenesList');
  scenesContainer.innerHTML = '';

  const sceneTypeNames = {
    hook: '१. हुक (लक्षवेधी इशारा)',
    problem: '२. अडचण (सामान्य समस्या)',
    law_solution: '३. कायदा (अधिकृत निकाल व तरतूद)',
    cta: '४. कृती (फॉलो आणि सल्ला)'
  };

  (script.scenes || []).forEach(sc => {
    const item = document.createElement('div');
    item.className = 'scene-timeline-item';
    const typeLabel = sceneTypeNames[sc.type] || `सीन #${sc.scene_num}`;
    
    item.innerHTML = `
      <div class="scene-top-row">
        <span class="scene-num-badge">${typeLabel}</span>
        <strong style="color: #F5D76E; font-size: 13px;">${sc.title || ''}</strong>
      </div>
      <p class="scene-speech-text">${sc.text || ''}</p>
    `;
    scenesContainer.appendChild(item);
  });

  // Also update Captions tab
  document.getElementById('captionTextArea').value = script.caption || '';
  document.getElementById('hashtagsTextArea').value = script.hashtags || '';
  document.getElementById('displayBestPostingTime').textContent = script.best_posting_time || 'संध्याकाळी ०७:०० PM ते ०८:३० PM';
}

// ==================== TAB 2: DIRECT VIDEO GENERATOR ====================
function initVideoGenerator() {
  const btnStart = document.getElementById('btnStartVideoGeneration');
  
  btnStart.addEventListener('click', async () => {
    if (!state.currentScript) {
      showToast('कृपया प्रथम स्क्रिप्ट निवडा किंवा तयार करा.');
      switchTab('tab-script');
      return;
    }

    const voice = document.querySelector('input[name="voiceSelect"]:checked').value;
    const bgMusic = document.getElementById('musicSelect').value;
    
    if (voice === 'custom' && !state.customAudioPath) {
      showToast('कृपया Tab 4 मध्ये आधी स्वतःचा ऑडिओ रेकॉर्ड किंवा अपलोड करा.');
      switchTab('tab-upload');
      return;
    }

    btnStart.disabled = true;
    showProgressTracker();

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: state.currentScript,
          voice: voice,
          bg_music: bgMusic,
          custom_audio_path: voice === 'custom' ? state.customAudioPath : null
        })
      });
      const data = await res.json();
      if (data.success && data.job_id) {
        state.activeJobId = data.job_id;
        startProgressPolling(data.job_id);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      console.error(err);
      hideProgressTracker();
      btnStart.disabled = false;
      showToast('व्हिडिओ सुरू करण्यात अडचण आली: ' + err.message);
    }
  });
}

function showProgressTracker() {
  const pBox = document.getElementById('videoProgressContainer');
  pBox.style.display = 'block';
  updateProgress(5, 'प्रक्रियेची सुरुवात होत आहे...');
  document.getElementById('progressStepsLog').innerHTML = '';
}

function hideProgressTracker() {
  document.getElementById('videoProgressContainer').style.display = 'none';
}

function updateProgress(pct, msg) {
  document.getElementById('progressPercentText').textContent = pct + '%';
  document.getElementById('progressBarFill').style.width = pct + '%';
  document.getElementById('progressStatusText').textContent = msg;

  const logBox = document.getElementById('progressStepsLog');
  const logItem = document.createElement('div');
  logItem.className = 'step-log-item active';
  logItem.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logBox.prepend(logItem);
}

function startProgressPolling(jobId) {
  if (state.pollInterval) clearInterval(state.pollInterval);

  state.pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/video-status/${jobId}`);
      const data = await res.json();
      if (data.success && data.job) {
        const job = data.job;
        updateProgress(job.progress, job.message);

        if (job.status === 'completed') {
          clearInterval(state.pollInterval);
          document.getElementById('btnStartVideoGeneration').disabled = false;
          showToast('अभिनंदन! व्हिडिओ यशस्वीरीत्या तयार झाला!');
          
          state.currentReelFolder = job.result.folder_name;
          onVideoReady(job.result);
          
          // Switch to Preview tab
          setTimeout(() => {
            switchTab('tab-preview');
          }, 1200);
        } else if (job.status === 'failed') {
          clearInterval(state.pollInterval);
          document.getElementById('btnStartVideoGeneration').disabled = false;
          showToast('व्हिडिओ रेंडरिंग अयशस्वी: ' + job.message);
        }
      }
    } catch (e) {
      console.error('Polling error', e);
    }
  }, 1000);
}

// ==================== TAB 3: VIDEO PREVIEW & CLIPS STUDIO ====================
function onVideoReady(result) {
  const videoPlayer = document.getElementById('finalReelVideoPlayer');
  const emptyPlaceholder = document.getElementById('emptyVideoPlaceholder');
  const downloadBtn = document.getElementById('btnDirectDownloadMp4');
  const fileInfo = document.getElementById('videoFileInfoText');

  emptyPlaceholder.style.display = 'none';
  videoPlayer.style.display = 'block';
  videoPlayer.src = result.final_video_url;
  videoPlayer.load();

  downloadBtn.href = result.download_url;
  downloadBtn.classList.remove('disabled');

  fileInfo.style.display = 'block';
  document.getElementById('infoDur').textContent = result.duration;
  document.getElementById('infoSize').textContent = result.size_mb;

  // Render multi-clips cards
  renderClipsStudio(result.clips, result.folder_name);
}

function renderClipsStudio(clips, folderName) {
  const container = document.getElementById('clipsCardsContainer');
  container.innerHTML = '';

  if (!clips || clips.length === 0) {
    container.innerHTML = '<div class="empty-clips-note">कोणतीही क्लिप उपलब्ध नाही.</div>';
    return;
  }

  clips.forEach(cl => {
    const card = document.createElement('div');
    card.className = 'clip-card';
    card.innerHTML = `
      <img src="/api/preview/${folderName}/images/${cl.image_file}" class="clip-thumb" alt="Clip ${cl.scene_num}">
      <div class="clip-info">
        <h4>क्लिप #${cl.scene_num}: ${cl.title}</h4>
        <textarea class="clip-text-input" rows="3" id="clipText_${cl.scene_num}">${cl.text}</textarea>
        <small style="color: #9CA3AF;">कालावधी: ${cl.duration} सेकंद</small>
      </div>
      <div class="clip-actions">
        <button class="btn btn-secondary btn-sm" onclick="previewClip('/api/preview/${folderName}/clips/${cl.clip_file}')">
          ▶️ Play Clip
        </button>
        <button class="btn btn-outline-gold btn-sm" onclick="regenerateClip('${folderName}', ${cl.scene_num})">
          🔄 Regenerate
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Re-combine clips listener
  document.getElementById('btnRecombineAllClips').onclick = () => recombineClips(folderName);
}

window.previewClip = function(clipUrl) {
  const videoPlayer = document.getElementById('finalReelVideoPlayer');
  videoPlayer.src = clipUrl;
  videoPlayer.play();
  showToast('क्लिप सुरू केली!');
};

window.regenerateClip = async function(folderName, sceneNum) {
  const newText = document.getElementById(`clipText_${sceneNum}`).value;
  const voice = document.querySelector('input[name="voiceSelect"]:checked').value;

  showToast(`क्लिप #${sceneNum} पुन्हा रेंडर होत आहे...`);
  try {
    const res = await fetch('/api/regenerate-clip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folder_name: folderName,
        scene_num: sceneNum,
        text: newText,
        voice: voice
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
      // Reload final video
      const videoPlayer = document.getElementById('finalReelVideoPlayer');
      videoPlayer.src = data.final_video_url;
      videoPlayer.load();
      videoPlayer.play();
      document.getElementById('infoDur').textContent = data.duration;
      document.getElementById('infoSize').textContent = data.size_mb;
    }
  } catch (err) {
    console.error(err);
    showToast('क्लिप री-जनरेट करताना त्रुटी आली.');
  }
};

async function recombineClips(folderName) {
  const bgMusic = document.getElementById('musicSelect').value;
  showToast('सर्व क्लिप्स पुन्हा जोडत आहे...');
  try {
    const res = await fetch('/api/combine-clips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folder_name: folderName,
        bg_music: bgMusic
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
      const videoPlayer = document.getElementById('finalReelVideoPlayer');
      videoPlayer.src = data.final_video_url;
      videoPlayer.load();
      videoPlayer.play();
      document.getElementById('infoDur').textContent = data.duration;
      document.getElementById('infoSize').textContent = data.size_mb;
    }
  } catch (err) {
    console.error(err);
    showToast('क्लिप्स जोडण्यात अडचण आली.');
  }
}

// ==================== TAB 4: AUDIO RECORDER & MEDIA UPLOAD ====================
function initAudioRecorder() {
  const btnStart = document.getElementById('btnStartRecord');
  const btnStop = document.getElementById('btnStopRecord');
  const btnUse = document.getElementById('btnUseRecordedAudio');
  const timer = document.getElementById('recordTimer');
  const micCircle = document.getElementById('micPulseCircle');
  const micLabel = document.getElementById('micStateLabel');
  const previewAudio = document.getElementById('recordedAudioPreview');

  btnStart.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaRecorder = new MediaRecorder(stream);
      state.audioChunks = [];

      state.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) state.audioChunks.push(e.data);
      };

      state.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(state.audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        previewAudio.src = audioUrl;
        previewAudio.style.display = 'block';

        // Upload to server
        const formData = new FormData();
        formData.append('file', audioBlob, 'advocate_pratiksha_voice.mp3');

        try {
          const res = await fetch('/api/upload-media', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            state.customAudioFile = data.filename;
            state.customAudioPath = data.file_path;
            btnUse.disabled = false;
            showToast('आवाज सर्व्हरवर सेव्ह झाला!');
          }
        } catch (e) {
          console.error(e);
          showToast('ऑडिओ अपलोड करताना त्रुटी आली.');
        }
      };

      state.mediaRecorder.start();
      state.isRecording = true;
      btnStart.disabled = true;
      btnStop.disabled = false;
      micCircle.classList.add('recording');
      micLabel.textContent = '🔴 आवाज रेकॉर्ड होत आहे...';

      state.recordSeconds = 0;
      state.recordInterval = setInterval(() => {
        state.recordSeconds++;
        const mins = String(Math.floor(state.recordSeconds / 60)).padStart(2, '0');
        const secs = String(state.recordSeconds % 60).padStart(2, '0');
        timer.textContent = `${mins}:${secs}`;
      }, 1000);

    } catch (err) {
      console.error(err);
      alert('मायक्रोफोन ॲक्सेस मिळाला नाही. कृपया ब्राऊझर परमिशन तपासा.');
    }
  });

  btnStop.addEventListener('click', () => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop();
      state.mediaRecorder.stream.getTracks().forEach(t => t.stop());
      state.isRecording = false;
      clearInterval(state.recordInterval);
      btnStart.disabled = false;
      btnStop.disabled = true;
      micCircle.classList.remove('recording');
      micLabel.textContent = 'रेकॉर्डिंग पूर्ण झाले!';
    }
  });

  btnUse.addEventListener('click', () => {
    document.getElementById('radioCustomVoice').checked = true;
    showToast('हा आवाज व्हिडिओसाठी निवडला गेला आहे!');
    switchTab('tab-generate');
  });
}

function initMediaUploader() {
  const dropzone = document.getElementById('mediaDropzone');
  const fileInput = document.getElementById('mediaFileInput');
  const fileBanner = document.getElementById('uploadedFileBanner');
  const fileNameDisplay = document.getElementById('uploadedFileName');

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file', file);

      showToast('अपलोड सुरू आहे...');
      try {
        const res = await fetch('/api/upload-media', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          state.customAudioPath = data.file_path;
          state.customAudioFile = data.filename;
          fileBanner.style.display = 'flex';
          fileNameDisplay.textContent = file.name;
          document.getElementById('radioCustomVoice').checked = true;
          showToast('फाईल यशस्वीरीत्या अपलोड झाली!');
        }
      } catch (e) {
        console.error(e);
        showToast('अपलोड करण्यात अडचण आली.');
      }
    }
  });
}

// ==================== TAB 5: CAPTION & SEO ====================
function initCaptionsAndSEO() {
  document.getElementById('btnCopyCaption').addEventListener('click', () => {
    const text = document.getElementById('captionTextArea').value;
    navigator.clipboard.writeText(text);
    showToast('कॅप्शन कॉपी झाले! (Copied to Clipboard)');
  });

  document.getElementById('btnCopyHashtags').addEventListener('click', () => {
    const text = document.getElementById('hashtagsTextArea').value;
    navigator.clipboard.writeText(text);
    showToast('हॅशटॅग्स कॉपी झाले! (Copied to Clipboard)');
  });
}

// ==================== TAB 6: HISTORY ====================
async function loadHistory() {
  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">लोड होत आहे...</td></tr>';

  try {
    const res = await fetch('/api/history');
    const data = await res.json();
    if (data.success && data.reels && data.reels.length > 0) {
      tbody.innerHTML = '';
      data.reels.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.created_at || '--'}</td>
          <td style="font-weight: 600; color: #F5D76E;">${r.title || 'Legal Reel'}</td>
          <td>${r.duration} सेकंद</td>
          <td>${r.size_mb} MB</td>
          <td>
            <a href="${r.preview_url}" target="_blank" class="btn btn-secondary btn-sm" style="margin-right: 6px;">
              👁️ प्रिव्ह्यू
            </a>
            <a href="${r.download_url}" class="btn btn-download btn-sm" download>
              ⬇️ डाउनलोड
            </a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9CA3AF;">अद्याप कोणतीही Reel तयार केलेली नाही.</td></tr>';
    }
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #EF4444;">इतिहास लोड करण्यात अडचण आली.</td></tr>';
  }
}

// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById('toastMessage');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ==================== TAB 8: 60-DAY CONTENT BANK ====================
let cached60Days = [];

async function load60DaysIdeas() {
  const container = document.getElementById('container60Days');
  if (!container) return;
  container.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-muted);"><span class="spin">⏳</span> ६० दिवसांच्या आयडिया लोड होत आहेत...</div>';
  
  try {
    let res;
    try {
      res = await fetch('/api/content/60-days-ideas');
    } catch (e1) {
      res = await fetch('http://localhost:5050/api/content/60-days-ideas');
    }
    const data = await res.json();
    if (data.success && data.ideas) {
      cached60Days = data.ideas;
      render60DaysCards(cached60Days);
    } else {
      throw new Error(data.error || 'Failed');
    }
  } catch (e) {
    console.warn('Could not load 60-day ideas:', e);
    container.innerHTML = '<div style="padding: 30px; text-align: center; color: #F59E0B;">मुख्य बॅकएंड (Port 5050) शी संपर्क होत आहे... कृपया <a href="http://localhost:5050" target="_blank" style="color: #D4AF37;">http://localhost:5050</a> वरून सर्व ११ टॅब्स पहा.</div>';
  }
}

function render60DaysCards(list) {
  const container = document.getElementById('container60Days');
  if (!container) return;
  
  if (list.length === 0) {
    container.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-muted);">कोणताही विषय सापडला नाही.</div>';
    return;
  }
  
  container.innerHTML = list.map(item => `
    <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="background: var(--gold-primary); color: #000; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 6px;">DAY ${String(item.day_number).padStart(2, '0')}</span>
          <span style="font-size: 12px; color: #34D399; font-weight: 700;">🔥 SEO: ${item.seo_score}/100</span>
        </div>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin: 0 0 8px 0; line-height: 1.4;">${item.title}</h4>
        <div style="background: rgba(0,0,0,0.3); padding: 8px 10px; border-radius: 6px; border-left: 3px solid var(--gold-bright); margin-bottom: 8px; font-size: 13px; color: #E2E8F0; font-style: italic;">
          "${item.hook}"
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">
          <strong>SEO:</strong> ${item.seo_keywords}
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
          <strong>कायदा:</strong> ${item.applicable_law} (${item.applicable_section})
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="useIdeaForVideo('${item.title.replace(/'/g, "\\'")}')">🎬 यावर व्हिडिओ बनवा</button>
        <button class="btn btn-secondary btn-sm" onclick="copyText('${item.title} - ${item.hook}')">📋 कॉपी</button>
      </div>
    </div>
  `).join('');
}

function filter60DaysCards() {
  const query = (document.getElementById('input60DaysSearch')?.value || '').toLowerCase().trim();
  if (!query) {
    render60DaysCards(cached60Days);
    return;
  }
  const filtered = cached60Days.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.hook.toLowerCase().includes(query) ||
    item.seo_keywords.toLowerCase().includes(query) ||
    String(item.day_number).includes(query)
  );
  render60DaysCards(filtered);
}

function useIdeaForVideo(title) {
  document.getElementById('customTopicInput').value = title;
  switchTab('tab-script');
  document.getElementById('btnGenerateScript').click();
  showToast('विषय स्क्रिप्ट स्टुडिओमध्ये लोड केला!');
}

function copyText(str) {
  navigator.clipboard.writeText(str);
  showToast('क्लिपबोर्डवर कॉपी झाले!');
}

// ==================== TAB 9: AI CONTENT STUDIO ====================
let cachedSuggestions = [];

function setStudioMode(mode) {
  const btnSuggest = document.getElementById('btnModeSuggest');
  const btnCreate = document.getElementById('btnModeCreate');
  const pSuggest = document.getElementById('panelSuggest');
  const pCreate = document.getElementById('panelCreate');

  if (mode === 'suggest') {
    btnSuggest.className = 'btn btn-primary';
    btnCreate.className = 'btn btn-secondary';
    pSuggest.style.display = 'block';
    pCreate.style.display = 'none';
    if (cachedSuggestions.length === 0) loadContentSuggestions();
  } else {
    btnSuggest.className = 'btn btn-secondary';
    btnCreate.className = 'btn btn-primary';
    pSuggest.style.display = 'none';
    pCreate.style.display = 'block';
  }
}

async function loadContentSuggestions() {
  const container = document.getElementById('containerSuggestions');
  if (!container) return;
  container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">⏳ AI कायदेशीर सुचना लोड होत आहेत...</div>';

  try {
    let res;
    try {
      res = await fetch('/api/content/suggestions');
    } catch (e1) {
      res = await fetch('http://localhost:5050/api/content/suggestions');
    }
    const data = await res.json();
    if (data.success && data.suggestions) {
      cachedSuggestions = data.suggestions;
      renderSuggestionsCards(cachedSuggestions);
    } else {
      throw new Error('Could not load suggestions');
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div style="padding: 20px; color: #F59E0B; text-align: center;">सुचना लोड करण्यात अडचण आली. कृपया रीफ्रेश करा.</div>';
  }
}

function renderSuggestionsCards(list) {
  const container = document.getElementById('containerSuggestions');
  if (!container) return;

  container.innerHTML = list.map(item => `
    <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="background: rgba(212, 175, 55, 0.2); color: var(--gold-bright); font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 6px;">${item.category}</span>
          <span style="font-size: 11px; color: #34D399; font-weight: 700;">👁️ ${item.estimatedReach}</span>
        </div>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin: 0 0 8px 0; line-height: 1.4;">${item.title}</h4>
        <div style="background: rgba(0,0,0,0.3); padding: 8px 10px; border-radius: 6px; border-left: 3px solid var(--gold-bright); margin-bottom: 8px; font-size: 13px; color: #E2E8F0; font-style: italic;">
          "${item.hook}"
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">
          <strong>कायदा:</strong> ${item.applicableLaw}
        </div>
        <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">
          <strong>महत्त्व:</strong> ${item.whyImportant}
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="useSuggestionForScript('${item.title.replace(/'/g, "\\'")}')">🎬 या विषयावर स्क्रिप्ट व व्हिडिओ बनवा</button>
        <button class="btn btn-secondary btn-sm" onclick="copyText('${item.title} - ${item.hook}')">📋 कॉपी</button>
      </div>
    </div>
  `).join('');
}

function useSuggestionForScript(title) {
  document.getElementById('customTopicInput').value = title;
  switchTab('tab-script');
  document.getElementById('btnGenerateScript').click();
  showToast('विषय स्क्रिप्ट स्टुडिओमध्ये लोड केला!');
}

async function generateStudioCustomScript() {
  const title = (document.getElementById('studioCustomTitle')?.value || '').trim();
  const category = document.getElementById('studioCustomCategory')?.value || 'जमीन आणि मालमत्ता कायदे';
  const duration = document.querySelector('input[name="studioDuration"]:checked')?.value || '30';
  const outDiv = document.getElementById('studioScriptOutput');
  const btn = document.getElementById('btnStudioGenerate');

  if (!title) {
    alert('कृपया तुमच्या विषयाचे नाव किंवा कायदेशीर प्रश्न प्रविष्ट करा!');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ AI मराठी स्क्रिप्ट तयार होत आहे...';
  outDiv.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--gold-bright);"><span class="spin">⏳</span> कायदेशीर तरतुदी आणि मराठी व्हॉइस-ओव्हर तयार होत आहे...</div>';

  try {
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom_query: title,
        duration: duration
      })
    });
    const data = await res.json();
    if (data.success && data.script) {
      const s = data.script;
      state.currentScript = s;
      
      outDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 14px;">
          <div>
            <span style="background: var(--gold-primary); color: #000; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">CUSTOM SCRIPT</span>
            <span style="margin-left: 8px; color: #94A3B8; font-size: 12px;">कालावधी: ${s.duration}s</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="sendStudioScriptToVideo()">🎬 या स्क्रिप्टवर व्हिडिओ बनवा ➔</button>
        </div>
        <h3 style="font-size: 16px; color: #FFF; margin: 0 0 10px 0;">${s.title_mr}</h3>
        <div style="background: rgba(212,175,55,0.1); border-left: 3px solid var(--gold-bright); padding: 10px; border-radius: 6px; margin-bottom: 14px;">
          <strong style="color: var(--gold-bright);">वायरल हुक:</strong>
          <p style="margin: 4px 0 0 0; color: #FFF; font-size: 14px;">"${s.hook}"</p>
        </div>
        <div style="margin-bottom: 14px;">
          <strong style="color: #94A3B8; font-size: 13px;">दृश्य व व्हॉइस-ओव्हर (${s.scenes.length} दृश्ये):</strong>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            ${s.scenes.map((sc, i) => `
              <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 8px 12px;">
                <span style="color: var(--gold-bright); font-size: 11px; font-weight: 700;">दृश्य ${i+1}: [${sc.scene_type}]</span>
                <p style="margin: 2px 0; font-size: 13px; color: #E2E8F0;">${sc.voiceover_mr}</p>
                <small style="color: #64748B;">स्क्रीन मजकूर: ${sc.screen_text_mr}</small>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <button class="btn btn-secondary btn-sm" onclick="copyText('${s.title_mr.replace(/'/g, "\\'")}')">📋 शीर्षक कॉपी करा</button>
          <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="sendStudioScriptToVideo()">🎬 थेट व्हिडिओ जनरेटरवर जा ➔</button>
        </div>
      `;
      showToast('सानुकूल कायदेशीर स्क्रिप्ट तयार झाली!');
    }
  } catch (err) {
    console.error(err);
    outDiv.innerHTML = '<div style="color: #EF4444; padding: 20px;">स्क्रिप्ट तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.</div>';
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ AI कायदेशीर स्क्रिप्ट तयार करा (Generate Script)';
  }
}

function sendStudioScriptToVideo() {
  if (state.currentScript) {
    renderScriptPreview(state.currentScript);
    switchTab('tab-generate');
    showToast('स्क्रिप्ट व्हिडिओ जनरेटरमध्ये लोड केली!');
  }
}

