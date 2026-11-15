"""
Standalone Backend Server for Instagram Video Generator Module
Advocate Pratiksha - आपला कायदा
Runs strictly on dedicated Port 5055 to ensure ZERO conflict with Port 5050 (Aapla Kayda backend),
Port 3000 (Vite frontend), and Port 5000 (external systems).
"""

import os
import sys
import json
import time
import uuid
import threading
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Ensure stdout can print Unicode Devanagari on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add current folder to path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

from engine.legal_topics import get_all_topics, get_topic_by_id, generate_custom_script
from engine.tts_engine import generate_voiceover, generate_scenes_audio, get_audio_duration, speed_to_rate, normalize_marathi_for_speech
from engine.video_renderer import create_scene_image, render_scene_clip, combine_clips_with_music, BG_AUDIO_DIR

app = Flask(__name__, static_folder="public", static_url_path="")
CORS(app)

PORT = 5055
OUTPUT_REELS_DIR = os.path.join(CURRENT_DIR, "output_reels")
UPLOADS_DIR = os.path.join(CURRENT_DIR, "uploads")
os.makedirs(OUTPUT_REELS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# In-memory jobs status store
JOBS = {}

def parse_pasted_script(raw_text: str, custom_title: str = None, duration: str = "45") -> dict:
    """
    Intelligently parses ANY raw pasted Marathi legal script directly into coherent reel scenes.
    CRITICAL RULE: NEVER rewrite, summarize, or alter the user's words!
    Preserves exact Devanagari text, citations, section numbers, and line breaks.
    """
    import re
    text = (raw_text or "").strip()
    if len(text) < 15:
        raise ValueError("कृपया किमान १५ अक्षरांची वैध मराठी कायदेशीर स्क्रिप्ट टाका.")

    # 1. Check for explicit bracketed scene tags (e.g. [HOOK], [PROBLEM], [LAW], [CTA], [सीन्स १])
    tagged = re.split(r'\[(?:HOOK|PROBLEM|LAW|SOLUTION|CTA|SCENE\s*\d*|सीन्स?\s*\d*|मुद्दा\s*\d*)\]', text, flags=re.I)
    chunks = [c.strip() for c in tagged if c.strip()]

    # 2. Check for numbered points (e.g. 1. किंवा १. किंवा (१))
    if len(chunks) < 2:
        numbered = re.split(r'(?:\n|^)\s*(?:[१-९\d]+[\.\)]|\([१-९\d]+\))\s*', text)
        chunks = [c.strip() for c in numbered if c.strip()]

    # 3. Check for distinct paragraphs
    if len(chunks) < 2:
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        if len(paragraphs) >= 2:
            chunks = paragraphs

    # 4. Check for distinct single lines
    if len(chunks) < 2:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if len(lines) >= 3:
            chunks = lines

    # 5. Sentence endings (Devanagari danda । or . or ?)
    if len(chunks) < 2:
        sentences = re.split(r'(?<=[।\.\?])\s+', text)
        chunks = [s.strip() for s in sentences if s.strip()]

    if not chunks:
        chunks = [text]

    # Target number of scenes based on chosen duration
    dur_str = str(duration)
    if dur_str == "30":
        t_count = 3
    elif dur_str == "60":
        t_count = 5
    else:
        t_count = 4

    # Merge shortest adjacent chunks if there are too many
    while len(chunks) > t_count:
        min_idx = 0
        min_len = len(chunks[0]) + len(chunks[1])
        for i in range(1, len(chunks) - 1):
            cur_len = len(chunks[i]) + len(chunks[i + 1])
            if cur_len < min_len:
                min_len = cur_len
                min_idx = i
        chunks[min_idx] = chunks[min_idx] + "\n" + chunks[min_idx + 1]
        chunks.pop(min_idx + 1)

    types = ["hook", "problem", "law_solution", "cta", "cta"]
    badge_titles = {
        "hook": "महत्त्वाची कायदेशीर सूचना",
        "problem": "सामान्य अडचण व जोखीम",
        "law_solution": "कायदा आणि अधिकृत तरतूद",
        "cta": "कायदेशीर सल्ला व पुढील कृती"
    }

    # Detect legal source hints from text
    official_source = "महाराष्ट्र शासन कायदे व परिपत्रके"
    if "7/12" in text or "सातबारा" in text or "तुकडेबंदी" in text or "गुंठेवारी" in text:
        official_source = "महाराष्ट्र जमीन महसूल संहिता व तुकडेबंदी अधिनियम"
    elif "BNSS" in text or "BNS" in text or "बीएनएसएस" in text:
        official_source = "भारतीय नागरिक सुरक्षा संहिता (BNSS 2023)"
    elif "1930" in text or "सायबर" in text:
        official_source = "राष्ट्रीय सायबर सुरक्षा हेल्पलाईन १९३०"

    scenes = []
    for idx, c in enumerate(chunks):
        sc_type = types[min(idx, len(types) - 1)]
        if idx == len(chunks) - 1 and len(chunks) > 1:
            sc_type = "cta"

        words = c.split()
        short_title = " ".join(words[:6]) if len(words) > 6 else c
        if len(short_title) > 40:
            short_title = short_title[:38] + "..."

        scenes.append({
            "scene_num": idx + 1,
            "type": sc_type,
            "title": short_title or badge_titles.get(sc_type, "कायदेशीर तरतूद"),
            "text": c,
            "visual_cue": official_source
        })

    title_words = chunks[0].split()
    calc_title = custom_title if custom_title else (" ".join(title_words[:8]) + ("..." if len(title_words) > 8 else ""))

    return {
        "id": f"script_{int(time.time())}",
        "category": "जमीन, मालमत्ता व फौजदारी कायदे",
        "title_mr": calc_title,
        "official_source": official_source,
        "duration": dur_str,
        "hook": chunks[0][:150],
        "scenes": scenes,
        "caption": f"{calc_title}\n\nअधिकृत कायदेशीर माहितीसाठी फॉलो करा आपला कायदा – ॲडव्होकेट प्रतीक्षा.",
        "hashtags": "#आपलाकायदा #AdvocatePratiksha #MaharashtraLaw #कायदेशीरमाहिती #Reels #LegalAdvice",
        "best_posting_time": "संध्याकाळी ०७:०० PM ते ०८:३० PM"
    }

@app.route("/")
def index():
    resp = send_from_directory("public", "index.html")
    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    return resp

@app.route("/<path:path>")
def static_files(path):
    resp = send_from_directory("public", path)
    if path.endswith(".html") or path.endswith(".js") or path.endswith(".css"):
        resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return resp

@app.route("/api/content/60-days-ideas", methods=["GET"])
def get_60_days_ideas():
    json_path = os.path.join(CURRENT_DIR, "engine", "content_bank_60_days.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            ideas = json.load(f)
        return jsonify({"success": True, "count": len(ideas), "ideas": ideas})
    return jsonify({"success": False, "ideas": []})

@app.route("/api/content/suggestions", methods=["GET"])
def get_content_suggestions():
    suggestions = [
        {
            "id": "sug_1",
            "title": "गुंठेवारी नियमितीकरणाची अंतिम मुदत: अनधिकृत प्लॉटवर घर असेल तर कोणती कागदपत्रे लागतील?",
            "category": "जमीन आणि मालमत्ता कायदे",
            "hook": "तुमचे घर १ किंवा २ गुंठे अनधिकृत प्लॉटवर आहे? मनपाकडून नोटीस येण्यापूर्वी हा एक अर्ज त्वरित करा!",
            "whyImportant": "गुंठेवारी नियमितीकरणासाठी नागरिकांची धावपळ सुरू आहे; Google Search वर 500%+ सर्च वाढ.",
            "applicableLaw": "महाराष्ट्र गुंठेवारी विकास अधिनियम २००१ (२०२१ सुधारणा)",
            "seoKeywords": "gunthewari regularization 2026, gunthewari dastavej, 1 guntha plot registry",
            "estimatedReach": "75,000+ Views",
            "recommendedDuration": "30-40s"
        },
        {
            "id": "sug_2",
            "title": "तुकडेबंदी कायदा शिथिल: १ ते ३ गुंठे जमिनीची खरेदी आणि ७/१२ नोंद अधिकृत कशी करावी?",
            "category": "जमीन आणि मालमत्ता कायदे",
            "hook": "तुकडेबंदीमुळे तुमच्या १ गुंठा जमिनीचा फेरफार अडकलाय? महसूल विभागाचा नवा शासन निर्णय नक्की पहा!",
            "whyImportant": "१ ते ३ गुंठे खरेदीदारांमध्ये ७/१२ नोंदीबाबत सर्वात जास्त संभ्रम आहे.",
            "applicableLaw": "मुंबई तुकडे प्रतिबंध व एकत्रीकरण कायदा १९४७ (कलम ८ब)",
            "seoKeywords": "tukdebandi kayda 2026, 1 guntha 7/12 nond, tukdebandi gr maharashtra",
            "estimatedReach": "90,000+ Views",
            "recommendedDuration": "30-40s"
        },
        {
            "id": "sug_3",
            "title": "वडिलोपार्जित शेतजमिनीत मुलींचा आणि बहिणींचा समान हक्क कसा मिळवायचा?",
            "category": "वारसाहक्क आणि कौटुंबिक कायदे",
            "hook": "भाऊ शेतात वाटा द्यायला नकार देतोय? २००५ च्या सर्वोच्च न्यायालयाच्या निकालाने बहिणींचे हक्क कसे सुरक्षित केले?",
            "whyImportant": "वारसा नोंदी आणि बहिणींच्या हक्काबाबत महिलांमध्ये प्रचंड जनजागृतीची मागणी आहे.",
            "applicableLaw": "हिंदू वारसा सुधारणा कायदा २००५ (कलम ६)",
            "seoKeywords": "vadiloparjit jamin mulincha vata, hindu succession act section 6, varas nond maharashtra",
            "estimatedReach": "1,10,000+ Views",
            "recommendedDuration": "50-60s"
        },
        {
            "id": "sug_4",
            "title": "७/१२ वरील बोजा कसा कमी करावा? बँकेचे कर्ज फिटल्यानंतर तलाठ्याकडे करावयाचा सोपा अर्ज",
            "category": "जमीन आणि मालमत्ता कायदे",
            "hook": "बँकेचे कर्ज फिटले पण ७/१२ वर अजूनही बँकेचे नाव दिसतेय? तलाठ्याकडे न जाता ई-हक्क वरून हे काम २ दिवसांत करा!",
            "whyImportant": "शेतकऱ्यांचे कर्ज फेडूनही ७/१२ वरील बोजा वर्षानुवर्षे तसाच राहण्याच्या अनेक तक्रारी आहेत.",
            "applicableLaw": "महाराष्ट्र जमीन महसूल संहिता १९६६ (कलम १४९ व १५०)",
            "seoKeywords": "satbara boja kami karne, e-haqq portal maharashtra, bank noc 7 12",
            "estimatedReach": "65,000+ Views",
            "recommendedDuration": "30-40s"
        },
        {
            "id": "sug_5",
            "title": "सायबर फ्रॉड: बँक खात्यातून पैसे गेले तर पहिल्या २ तासांत 'हे' करा — १९३० हेल्पलाईन",
            "category": "सायबर गुन्हे व डिजिटल सुरक्षा",
            "hook": "एका चुकीच्या लिंकवर क्लिक झाले आणि बँकेतून पैसे कापले गेले? घाबरू नका! पहिल्या २ तासांत हा नंबर फिरवला तर पैसे परत मिळू शकतात!",
            "whyImportant": "ऑनलाइन फसवणुकीच्या घटनांमध्ये वाढ; पहिल्या गोल्डन अवर्समध्ये १९३० हेल्पलाईनचा वापर महत्त्वाचा आहे.",
            "applicableLaw": "भारतीय न्याय संहिता २०२३ (BNSS 2023) व माहिती तंत्रज्ञान कायदा २०००",
            "seoKeywords": "cyber fraud complaint 1930, bank account fraud refund, cyber helpline maharashtra",
            "estimatedReach": "1,20,000+ Views",
            "recommendedDuration": "30-40s"
        }
    ]
    return jsonify({"success": True, "suggestions": suggestions})

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify({
        "status": "online",
        "module": "Aapla Kayda - Instagram Video Generator",
        "advocate": "Advocate Pratiksha",
        "port": PORT,
        "engine": "FFmpeg 7.1 + Edge-TTS Neural Marathi + PIL Devanagari",
        "voices": [
            {"id": "aarohi", "name": "ॲडव्होकेट प्रतीक्षा (Aarohi - Female Marathi)", "recommended": True},
            {"id": "manohar", "name": "मनोहर (Manohar - Male Marathi)", "recommended": False},
            {"id": "custom", "name": "स्वतःचा रेकॉर्ड केलेला आवाज (Custom Upload)", "recommended": False}
        ],
        "speed_presets": [
            {"id": "0.85", "name": "0.85x — हळू (Slow)"},
            {"id": "1.00", "name": "1.00x — सामान्य (Normal)"},
            {"id": "1.10", "name": "1.10x — किंचित वेगवान (Default)", "default": True},
            {"id": "1.20", "name": "1.20x — वेगवान (Fast)"},
            {"id": "1.30", "name": "1.30x — अधिक वेगवान (Very Fast)"}
        ],
        "default_speed": "1.10",
        "default_voice": "aarohi",
        "durations": ["30", "45", "60"],
        "bg_music_presets": [
            {"id": "legal_ambient", "name": "कायदेशीर व शांत पार्श्वसंगीत (Legal Ambient)", "file": "legal_ambient_bg.mp3"},
            {"id": "dramatic_suspense", "name": "सावधगिरी व इशारा (Dramatic Suspense)", "file": "dramatic_suspense_bg.mp3"},
            {"id": "inspirational_success", "name": "यशोगाथा व दिलासा (Inspirational)", "file": "inspirational_success_bg.mp3"},
            {"id": "none", "name": "संगीत नको (No Music - Only Voice)", "file": ""}
        ]
    })

@app.route("/api/topics", methods=["GET"])
def get_topics_list():
    return jsonify({
        "success": True,
        "topics": get_all_topics()
    })

@app.route("/api/generate-script", methods=["POST"])
def api_generate_script():
    data = request.json or {}
    topic_id = data.get("topic_id", "")
    custom_query = data.get("custom_query", "")
    duration = str(data.get("duration", "30"))
    
    if custom_query and custom_query.strip():
        script = generate_custom_script(custom_query, duration)
    else:
        topic = get_topic_by_id(topic_id)
        dur_key = "duration_60" if duration == "60" else "duration_30"
        t_data = topic.get(dur_key, topic["duration_30"])
        script = {
            "id": topic["id"],
            "category": topic["category"],
            "title_mr": topic["title_mr"],
            "official_source": topic["official_source"],
            "duration": duration,
            "hook": t_data["hook"],
            "scenes": t_data["scenes"],
            "caption": t_data["caption"],
            "hashtags": t_data["hashtags"],
            "best_posting_time": t_data["best_posting_time"]
        }
        
    return jsonify({
        "success": True,
        "script": script
    })

def run_video_generation_job(job_id, script_data, voice_key, bg_music_preset, custom_audio_file, speed=1.10):
    try:
        JOBS[job_id]["status"] = "processing"
        JOBS[job_id]["progress"] = 10
        JOBS[job_id]["message"] = f"मराठी व्हॉइस-ओव्हर ({speed:.2f}x वेग) आणि दृश्यांची तयारी सुरू आहे..."
        
        # 1. Create dedicated reel folder
        reel_title_slug = secure_filename(script_data.get("id", "reel"))
        timestamp = int(time.time())
        folder_name = f"reel_{timestamp}_{reel_title_slug}"
        reel_dir = os.path.join(OUTPUT_REELS_DIR, folder_name)
        clips_dir = os.path.join(reel_dir, "clips")
        images_dir = os.path.join(reel_dir, "images")
        os.makedirs(clips_dir, exist_ok=True)
        os.makedirs(images_dir, exist_ok=True)
        
        # Save script JSON & metadata
        with open(os.path.join(reel_dir, "script.json"), "w", encoding="utf-8") as f:
            json.dump(script_data, f, ensure_ascii=False, indent=2)
            
        with open(os.path.join(reel_dir, "caption.txt"), "w", encoding="utf-8") as f:
            f.write(script_data.get("caption", "") + "\n\n" + script_data.get("hashtags", ""))
            
        scenes = script_data.get("scenes", [])
        total_scenes = len(scenes)
        
        # 2. Audio Generation with custom speaking speed & Marathi phonetic dictionary
        JOBS[job_id]["progress"] = 25
        JOBS[job_id]["message"] = f"मराठी ऑडिओ ({speed:.2f}x) तयार होत आहे... (एकूण सीन्स: {total_scenes})"
        
        scenes_with_audio = []
        if custom_audio_file and os.path.exists(custom_audio_file):
            # User uploaded full audio
            overall_dur = get_audio_duration(custom_audio_file)
            per_scene_dur = max(round(overall_dur / total_scenes, 2), 3.5)
            for sc in scenes:
                sc_c = dict(sc)
                sc_c["audio_file"] = custom_audio_file
                sc_c["duration"] = per_scene_dur
                scenes_with_audio.append(sc_c)
        else:
            scenes_with_audio = generate_scenes_audio(scenes, voice_key=voice_key, speed=speed, output_dir=reel_dir)
            
        # 3. Render individual scene clips
        clip_paths = []
        clip_meta = []
        
        for idx, sc in enumerate(scenes_with_audio):
            s_num = sc.get("scene_num", idx + 1)
            pct = 35 + int((idx / total_scenes) * 45)
            JOBS[job_id]["progress"] = pct
            JOBS[job_id]["message"] = f"क्लिप #{s_num} चे 9:16 दृश्य व अ‍ॅनिमेशन रेंडर होत आहे ({idx+1}/{total_scenes})..."
            
            # Create Scene Image
            img_path = os.path.join(images_dir, f"scene_{s_num}.png")
            create_scene_image(sc, script_data.get("title_mr", ""), img_path)
            
            # Render MP4 Clip
            clip_path = os.path.join(clips_dir, f"clip_{s_num:02d}.mp4")
            render_scene_clip(img_path, sc["audio_file"], sc["duration"], clip_path)
            clip_paths.append(clip_path)
            
            clip_meta.append({
                "scene_num": s_num,
                "title": sc.get("title", ""),
                "text": sc.get("text", ""),
                "duration": sc["duration"],
                "clip_file": f"clip_{s_num:02d}.mp4",
                "image_file": f"scene_{s_num}.png"
            })
            
        # 4. Stitch Clips & Add Background Music
        JOBS[job_id]["progress"] = 85
        JOBS[job_id]["message"] = "सर्व क्लिप्स एकत्र जोडून पार्श्वसंगीत (Music Mix) सिंक केले जात आहे..."
        
        bg_audio_path = None
        if bg_music_preset and bg_music_preset != "none":
            preset_files = {
                "legal_ambient": "legal_ambient_bg.mp3",
                "dramatic_suspense": "dramatic_suspense_bg.mp3",
                "inspirational_success": "inspirational_success_bg.mp3"
            }
            fname = preset_files.get(bg_music_preset, "legal_ambient_bg.mp3")
            bg_audio_path = os.path.join(BG_AUDIO_DIR, fname)
            
        final_mp4_path = os.path.join(reel_dir, "final_reel.mp4")
        combine_clips_with_music(clip_paths, bg_audio_path, final_mp4_path)
        
        # Calculate final reel duration and size
        final_dur = get_audio_duration(final_mp4_path)
        final_size_mb = round(os.path.getsize(final_mp4_path) / (1024 * 1024), 2)
        
        manifest = {
            "folder_name": folder_name,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "title": script_data.get("title_mr", ""),
            "duration": round(final_dur, 1),
            "size_mb": final_size_mb,
            "voice": voice_key,
            "speed": speed,
            "bg_music": bg_music_preset,
            "clips": clip_meta,
            "final_video": "final_reel.mp4"
        }
        with open(os.path.join(reel_dir, "manifest.json"), "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
            
        JOBS[job_id]["progress"] = 100
        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["message"] = "अभिनंदन! तुमचा संपूर्ण व्हिडिओ (Reel MP4) यशस्वीरीत्या तयार झाला आहे."
        JOBS[job_id]["result"] = {
            "folder_name": folder_name,
            "final_video_url": f"/api/preview/{folder_name}/final_reel.mp4",
            "download_url": f"/api/download/{folder_name}/final_reel.mp4",
            "duration": round(final_dur, 1),
            "size_mb": final_size_mb,
            "speed": speed,
            "clips": clip_meta
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["message"] = f"त्रुटी: {str(e)}"

@app.route("/api/preview-voice", methods=["POST"])
def api_preview_voice():
    """
    Generates a fast voice preview MP3 at selected speed and voice
    """
    try:
        data = request.json or {}
        sample_text = data.get("text", "").strip() or "नमस्कार, मी ॲडव्होकेट प्रतीक्षा. आपला कायदा मध्ये आपले स्वागत आहे. आज आपण गुंठेवारी आणि सातबारा विषयी महत्त्वाची कायदेशीर माहिती जाणून घेणार आहोत."
        voice_key = data.get("voice", "aarohi")
        try:
            speed = float(data.get("speed", 1.10))
        except (ValueError, TypeError):
            speed = 1.10
        
        timestamp = int(time.time() * 1000)
        filename = f"preview_{voice_key}_{int(speed * 100)}_{timestamp}.mp3"
        out_path = os.path.join(UPLOADS_DIR, filename)
        
        info = generate_voiceover(sample_text, voice_key=voice_key, out_mp3=out_path, speed=speed)
        return jsonify({
            "success": True,
            "audio_url": f"/api/preview-audio/{filename}",
            "duration": round(info["duration"], 2),
            "voice": voice_key,
            "speed": speed,
            "rate": info.get("rate", "+10%")
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/preview-audio/<path:filename>")
def serve_preview_audio(filename):
    return send_from_directory(UPLOADS_DIR, filename)

@app.route("/api/generate-video", methods=["POST"])
def api_generate_video():
    import hashlib
    data = request.json or {}
    raw_script = data.get("script")
    script_text = data.get("script_text")
    script_title = data.get("script_title")
    duration = str(data.get("duration", "45"))
    try:
        speed = float(data.get("speed", 1.10))
    except (ValueError, TypeError):
        speed = 1.10
    voice_key = data.get("voice", "aarohi")
    bg_music = data.get("bg_music", "legal_ambient")
    custom_audio = data.get("custom_audio_path", None)
    force_regenerate = bool(data.get("force_regenerate", False))
    
    # 1. Parse or validate script data
    script_data = None
    if script_text and str(script_text).strip():
        try:
            script_data = parse_pasted_script(script_text, custom_title=script_title, duration=duration)
        except Exception as pe:
            return jsonify({"success": False, "error": str(pe)}), 400
    elif isinstance(raw_script, str) and raw_script.strip():
        try:
            script_data = parse_pasted_script(raw_script, custom_title=script_title, duration=duration)
        except Exception as pe:
            return jsonify({"success": False, "error": str(pe)}), 400
    elif isinstance(raw_script, dict) and raw_script.get("scenes"):
        script_data = raw_script
    elif isinstance(raw_script, dict) and raw_script.get("script_format_a"):
        try:
            script_data = parse_pasted_script(raw_script.get("script_format_a"), custom_title=raw_script.get("title"), duration=duration)
        except Exception as pe:
            return jsonify({"success": False, "error": str(pe)}), 400
    else:
        return jsonify({"success": False, "error": "कृपया व्हिडिओ बनवण्यासाठी वैध मराठी मजकूर किंवा स्क्रिप्ट टाका."}), 400

    # 2. Duplicate Prevention: Unique fingerprint of script + voice + speed + music
    scenes_text_hash = "".join([s.get("text", "") for s in script_data.get("scenes", [])])
    hash_payload = f"{scenes_text_hash}_{voice_key}_{speed:.2f}_{bg_music}_{duration}"
    cache_key = hashlib.md5(hash_payload.encode("utf-8")).hexdigest()

    if not force_regenerate:
        # Check active queued or processing jobs to prevent duplicate threads
        for j_id, j_info in JOBS.items():
            if j_info.get("cache_key") == cache_key and j_info.get("status") in ["queued", "processing"]:
                return jsonify({
                    "success": True,
                    "job_id": j_id,
                    "status": j_info.get("status"),
                    "message": "याच स्क्रिप्टचा व्हिडिओ आधीच तयार होत आहे..."
                })
        # Check recently completed video
        for j_id, j_info in JOBS.items():
            if j_info.get("cache_key") == cache_key and j_info.get("status") == "completed":
                res = j_info.get("result", {})
                if res and os.path.exists(os.path.join(OUTPUT_REELS_DIR, res.get("folder_name", ""), "final_reel.mp4")):
                    return jsonify({
                        "success": True,
                        "job_id": j_id,
                        "already_completed": True,
                        "result": res,
                        "message": "हा व्हिडिओ आधीच तयार आहे!"
                    })

    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "job_id": job_id,
        "cache_key": cache_key,
        "script_title": script_data.get("title_mr", ""),
        "status": "queued",
        "progress": 0,
        "message": "व्हिडिओ रेंडरिंग प्रोसेस सुरू होत आहे...",
        "created_at": time.time()
    }
    
    # Launch in background thread
    t = threading.Thread(target=run_video_generation_job, args=(job_id, script_data, voice_key, bg_music, custom_audio, speed))
    t.daemon = True
    t.start()
    
    return jsonify({
        "success": True,
        "job_id": job_id,
        "script": script_data
    })

@app.route("/api/video-status/<job_id>", methods=["GET"])
def get_video_status(job_id):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"success": False, "error": "Job not found"}), 404
    return jsonify({"success": True, "job": job})

@app.route("/api/regenerate-clip", methods=["POST"])
def api_regenerate_clip():
    """
    Regenerates a single clip in a reel folder and re-stitches final video
    """
    data = request.json or {}
    folder_name = data.get("folder_name")
    scene_num = int(data.get("scene_num", 1))
    new_text = data.get("text", "")
    new_title = data.get("title", "")
    voice_key = data.get("voice", "aarohi")
    try:
        speed = float(data.get("speed", 1.10))
    except (ValueError, TypeError):
        speed = 1.10
    
    reel_dir = os.path.join(OUTPUT_REELS_DIR, folder_name)
    if not os.path.exists(reel_dir):
        return jsonify({"success": False, "error": "Reel folder not found"}), 404
        
    clips_dir = os.path.join(reel_dir, "clips")
    images_dir = os.path.join(reel_dir, "images")
    
    # Load script.json
    script_path = os.path.join(reel_dir, "script.json")
    with open(script_path, "r", encoding="utf-8") as f:
        script_data = json.load(f)
        
    # Find scene
    sc_found = None
    for sc in script_data.get("scenes", []):
        if sc.get("scene_num") == scene_num:
            if new_text:
                sc["text"] = new_text
            if new_title:
                sc["title"] = new_title
            sc_found = sc
            break
            
    if not sc_found:
        return jsonify({"success": False, "error": "Scene not found"}), 404
        
    # Re-save script
    with open(script_path, "w", encoding="utf-8") as f:
        json.dump(script_data, f, ensure_ascii=False, indent=2)
        
    # 1. Re-generate TTS for this scene
    out_mp3 = os.path.join(reel_dir, f"scene_{scene_num}_voice.mp3")
    audio_info = generate_voiceover(sc_found["text"], voice_key=voice_key, out_mp3=out_mp3, speed=speed)
    duration = max(round(audio_info["duration"] + 0.6, 2), 3.5)
    
    # 2. Re-create Image
    img_path = os.path.join(images_dir, f"scene_{scene_num}.png")
    create_scene_image(sc_found, script_data.get("title_mr", ""), img_path)
    
    # 3. Re-render Clip
    clip_path = os.path.join(clips_dir, f"clip_{scene_num:02d}.mp4")
    render_scene_clip(img_path, out_mp3, duration, clip_path)
    
    # 4. Re-combine all clips
    all_clips = sorted([os.path.join(clips_dir, f) for f in os.listdir(clips_dir) if f.endswith(".mp4") and f.startswith("clip_")])
    final_mp4_path = os.path.join(reel_dir, "final_reel.mp4")
    
    # Load manifest to check bg_music
    manifest_path = os.path.join(reel_dir, "manifest.json")
    bg_audio_path = None
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            man = json.load(f)
            bg_preset = man.get("bg_music", "legal_ambient")
            if bg_preset and bg_preset != "none":
                fname = f"{bg_preset}_bg.mp3"
                bg_audio_path = os.path.join(BG_AUDIO_DIR, fname)
                
    combine_clips_with_music(all_clips, bg_audio_path, final_mp4_path)
    
    final_dur = get_audio_duration(final_mp4_path)
    final_size_mb = round(os.path.getsize(final_mp4_path) / (1024 * 1024), 2)
    
    return jsonify({
        "success": True,
        "message": f"क्लिप #{scene_num} आणि संपूर्ण फायनल Reel यशस्वीरीत्या अपडेट झाली!",
        "final_video_url": f"/api/preview/{folder_name}/final_reel.mp4?t={int(time.time())}",
        "download_url": f"/api/download/{folder_name}/final_reel.mp4",
        "duration": round(final_dur, 1),
        "size_mb": final_size_mb
    })

@app.route("/api/combine-clips", methods=["POST"])
def api_combine_clips():
    data = request.json or {}
    folder_name = data.get("folder_name")
    reel_dir = os.path.join(OUTPUT_REELS_DIR, folder_name)
    if not os.path.exists(reel_dir):
        return jsonify({"success": False, "error": "Reel folder not found"}), 404
        
    clips_dir = os.path.join(reel_dir, "clips")
    all_clips = sorted([os.path.join(clips_dir, f) for f in os.listdir(clips_dir) if f.endswith(".mp4") and f.startswith("clip_")])
    if not all_clips:
        return jsonify({"success": False, "error": "No clips found"}), 400
        
    final_mp4_path = os.path.join(reel_dir, "final_reel.mp4")
    
    bg_preset = data.get("bg_music", "legal_ambient")
    bg_audio_path = None
    if bg_preset and bg_preset != "none":
        fname = f"{bg_preset}_bg.mp3"
        bg_audio_path = os.path.join(BG_AUDIO_DIR, fname)
        
    combine_clips_with_music(all_clips, bg_audio_path, final_mp4_path)
    final_dur = get_audio_duration(final_mp4_path)
    final_size_mb = round(os.path.getsize(final_mp4_path) / (1024 * 1024), 2)
    
    return jsonify({
        "success": True,
        "message": "सर्व क्लिप्स एकत्र जोडून फायनल व्हिडिओ तयार झाला!",
        "final_video_url": f"/api/preview/{folder_name}/final_reel.mp4?t={int(time.time())}",
        "download_url": f"/api/download/{folder_name}/final_reel.mp4",
        "duration": round(final_dur, 1),
        "size_mb": final_size_mb
    })

@app.route("/api/upload-media", methods=["POST"])
def api_upload_media():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No selected file"}), 400
        
    filename = secure_filename(file.filename)
    unique_name = f"{int(time.time())}_{filename}"
    save_path = os.path.join(UPLOADS_DIR, unique_name)
    file.save(save_path)
    
    return jsonify({
        "success": True,
        "filename": unique_name,
        "file_path": save_path,
        "url": f"/api/uploads/{unique_name}"
    })

@app.route("/api/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOADS_DIR, filename)

@app.route("/api/preview/<folder>/<path:filename>")
def preview_file(folder, filename):
    folder_path = os.path.join(OUTPUT_REELS_DIR, folder)
    return send_from_directory(folder_path, filename)

@app.route("/api/download/<folder>/<path:filename>")
def download_file(folder, filename):
    folder_path = os.path.join(OUTPUT_REELS_DIR, folder)
    file_path = os.path.join(folder_path, filename)
    if not os.path.exists(file_path):
        return "File not found", 404
    return send_file(file_path, as_attachment=True, download_name=filename)

@app.route("/api/history", methods=["GET"])
def get_history():
    reels = []
    if os.path.exists(OUTPUT_REELS_DIR):
        for fname in sorted(os.listdir(OUTPUT_REELS_DIR), reverse=True):
            fpath = os.path.join(OUTPUT_REELS_DIR, fname)
            if os.path.isdir(fpath):
                man_path = os.path.join(fpath, "manifest.json")
                if os.path.exists(man_path):
                    try:
                        with open(man_path, "r", encoding="utf-8") as f:
                            man = json.load(f)
                            man["preview_url"] = f"/api/preview/{fname}/final_reel.mp4"
                            man["download_url"] = f"/api/download/{fname}/final_reel.mp4"
                            reels.append(man)
                    except Exception:
                        pass
    return jsonify({"success": True, "reels": reels})

@app.route("/api/google-flow-status", methods=["GET"])
def google_flow_status():
    return jsonify({
        "status": "transparent_assessment",
        "tool_name": "Google Flow / Google Veo Video Generation",
        "analysis": {
            "current_reality": "Google Flow आणि Google Veo हे सध्या Google Labs / Vertex AI Enterprise वरील प्रायोगिक व सशुल्क (Paid API) मॉडेल आहेत. त्यामध्ये प्रति-सेकंद व्हिडिओ रेंडरिंगसाठी थेट क्लाउड बिलिंग किंवा गुगल लॅब्सची विशेष अनुमती लागते.",
            "prompt_vs_direct": "इंटरनेटवरील अनेक टूल्स फक्त 'Prompt' तयार करतात, प्रत्यक्ष व्हिडिओ देत नाहीत. परंतु आपल्या या स्वतंत्र मॉड्यूलमध्ये आम्ही 'डायरेक्ट व्हिडिओ जनरेटर' दिला आहे जो तुमच्या मशीनवर पूर्णपणे मोफत, हाय-डेफिनिशन 1080x1920 MP4 व्हिडिओ, मराठी व्हॉइस-ओव्हर आणि म्युझिकसह थेट डाउनलोडसाठी तयार करतो!",
            "external_api_integration": "जर तुमच्याकडे भविष्यात Google Cloud Vertex AI Veo किंवा इतर कोणत्याही AI Video API Key (उदा. Luma, Runway, Kling) उपलब्ध असतील, तर त्यासाठी खाली दिलेल्या कॉन्फिगरेशन बॉक्समध्ये API Key भरून बाह्य व्हिडिओ मॉडेल थेट जोडता येईल.",
            "cost_warning": "तुमच्या स्पष्ट पूर्वपरवानगीशिवाय कोणताही सशुल्क प्लॅन, सब्सक्रिप्शन किंवा क्रेडिट कार्ड शुल्क आकारले जाणार नाही."
        }
    })

if __name__ == "__main__":
    print("=" * 70)
    print("  AAPLA KAYDA - INSTAGRAM VIDEO GENERATOR")
    print("  Advocate Pratiksha - High Impact Legal Reels Generator")
    print(f"  Running on dedicated Port: http://localhost:{PORT}")
    print("=" * 70)
    app.run(host="127.0.0.1", port=PORT, debug=False)
