"""
Direct Text-Based & AI Visual Explainer Video Renderer for Instagram Reels (9:16 Vertical 1080x1920)
Advocate Pratiksha - आपला कायदा

Architecture:
- 100% Text & Visual Explainer (ZERO cartoon avatars, ZERO fake talking faces).
- 3-Second Scroll-Stopping Hook rule for high retention.
- Topic-specific visual documentary backdrops (Plotting Drone, 7/12 & Ferfar desk, Cadastral survey blueprints, Registered Sale Deeds).
- Chromium Headless Devanagari typography rendering (Mukta font, golden borders, glassmorphism badges).
- Ken Burns dynamic camera motion (pan/zoom) on each scene clip.
- Synchronized Edge-TTS Marathi voiceover + Marathi Legal Normalizer.
- Background legal ambient score ducked at 12% volume.
"""

import os
import time
import math
import json
import textwrap
import subprocess
from typing import Dict, List, Optional, Tuple
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
VISUALS_DIR = os.path.join(ASSETS_DIR, "visuals")
BG_AUDIO_DIR = os.path.join(ASSETS_DIR, "bg_audio")

FONT_BOLD = os.path.join(FONTS_DIR, "Mukta-Bold.ttf")
FONT_REGULAR = os.path.join(FONTS_DIR, "Mukta-Regular.ttf")

CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]

def get_browser_exe() -> Optional[str]:
    for p in CHROME_PATHS:
        if os.path.exists(p):
            return p
    return None

def resolve_scene_visual(scene_info: dict, overall_title: str, scene_idx: int) -> Optional[str]:
    """
    Selects the most accurate topic-specific documentary visual asset for the scene.
    Ensures every legal video topic (Marriage, Land, Police/BNSS, Farm Road, Cheque Bounce, Women's Rights, Cyber)
    displays authentic, context-matching background imagery.
    """
    text_content = (
        scene_info.get("text", "") + " " +
        scene_info.get("title", "") + " " +
        scene_info.get("visual_cue", "") + " " +
        overall_title
    ).lower()
    
    # Check if specific visual is provided in scene_info
    if scene_info.get("custom_bg") and os.path.exists(scene_info["custom_bg"]):
        return scene_info["custom_bg"]
        
    land_dir = os.path.join(VISUALS_DIR, "land_records")
    cyber_dir = os.path.join(VISUALS_DIR, "cyber_crime")
    women_dir = os.path.join(VISUALS_DIR, "womens_rights")
    court_marriage_dir = os.path.join(VISUALS_DIR, "court_marriage")
    police_dir = os.path.join(VISUALS_DIR, "police_bnss")
    cheque_dir = os.path.join(VISUALS_DIR, "cheque_bounce")
    farm_road_dir = os.path.join(VISUALS_DIR, "farm_road")
    court_dir = os.path.join(VISUALS_DIR, "general_court")

    # 1. Court Marriage, Love Life, Special Marriage Act, Inter-caste Marriage, Police Protection for Couples
    if any(k in text_content for k in [
        "कोर्ट मॅरेज", "मॅरेज", "court marriage", "लग्न", "विवाह", "special marriage", "स्पेशल मॅरेज",
        "प्रेमविवाह", "आंतरजातीय", "अंतरधर्मीय", "लता सिंग", "जोडीदार", "पती", "पत्नी", "लव्ह"
    ]):
        if os.path.exists(court_marriage_dir):
            if scene_idx % 2 == 0:
                p = os.path.join(court_marriage_dir, "court_marriage_registrar.jpg")
            else:
                p = os.path.join(court_marriage_dir, "special_marriage_act.jpg")
            if os.path.exists(p): return p

    # 2. Police, BNSS 2023, FIR, Arrest Rights, Bail, Police Protection, Criminal Law
    if any(k in text_content for k in [
        "पोलीस", "police", "bnss", "bns", "बीएनएसएस", "एफआयआर", "fir", "अटक", "arrest",
        "जामीन", "bail", "कलम ३५", "कलम १७३", "कलम १७५", "फौजदारी", "गुन्हा", "४२०", "318", "३१८", "दंडाधिकारी"
    ]):
        if os.path.exists(police_dir):
            if scene_idx % 2 == 0:
                p = os.path.join(police_dir, "bnss_2023_police_justice.jpg")
            else:
                p = os.path.join(police_dir, "police_rights_notice_35.jpg")
            if os.path.exists(p): return p

    # 3. Cyber Crime / 1930 Helpline / Online Bank Fraud
    if any(k in text_content for k in [
        "सायबर", "cyber", "१९३०", "1930", "ओटीपी", "otp", "बँक फ्रॉड", "खात्यातून पैसे",
        "डिजिटल अरेस्ट", "हॅकिंग", "ऑनलाइन फसवणूक"
    ]):
        cyber_img = os.path.join(cyber_dir, "cyber_fraud_1930.jpg")
        if os.path.exists(cyber_img): return cyber_img

    # 4. Cheque Bounce, NI Act Section 138, Dishonoured Cheque, Return Memo
    if any(k in text_content for k in [
        "चेक", "धनादेश", "बाऊन्स", "बाउन्स", "bounce", "१३८", "138", "ni act",
        "बँक मेमो", "अपुऱ्या निधी", "चेक अनादर", "धनादेश अनादर"
    ]):
        if os.path.exists(cheque_dir):
            p = os.path.join(cheque_dir, "cheque_bounce_memo_138.jpg")
            if os.path.exists(p): return p

    # 5. Farm Road, Sheti Vahiwat, Mamlatdar Court Section 5, Land Boundaries, E-Mojani
    if any(k in text_content for k in [
        "रस्ता", "शेतरस्ता", "शेत रस्ता", "वहिवाट", "मामलतदार", "मामलेदार", "mlrc 143", "बांध", "सीमावाद", "मोजणी", "पांदण"
    ]):
        if os.path.exists(farm_road_dir):
            p = os.path.join(farm_road_dir, "rural_farm_road_vahiwat.jpg")
            if os.path.exists(p): return p

    # 6. Women's Rights, Stridhan, Domestic Violence, Daughter's Equal Inheritance
    if any(k in text_content for k in ["स्त्रीधन", "stridhan", "दागिने", "कौटुंबिक हिंसाचार", "घरगुती हिंसाचार", "पोटगी", "maintenance", "dv act"]):
        p = os.path.join(women_dir, "stridhan_legal_protection.jpg")
        if os.path.exists(p): return p
    if any(k in text_content for k in ["मुलगी", "मुलींचा", "बहीण", "वारसा", "वारस", "हिंदू वारसा", "वडिलोपार्जित"]):
        women_img = os.path.join(women_dir, "daughter_inheritance_sec6.jpg")
        if os.path.exists(women_img): return women_img

    # 7. Land Records, Gunthewari, Tukdebandi, 7/12, Ferfar, Plotting, Registered Deeds
    if any(k in text_content for k in [
        "सातबारा", "7/12", "फेरफार", "गुंठेवारी", "तुकडेबंदी", "प्लॉट", "जमीन", "खरेदीखत", "नोंदणी",
        "तलाठी", "मुद्रांक", "सर्च रिपोर्ट", "इंडेक्स २", "बिनशेती", "na जमीन"
    ]):
        if os.path.exists(land_dir):
            land_cycle = [
                "scene_1_hook_plot_fraud.jpg",
                "scene_2_problem_satbara_ferfar.jpg",
                "scene_3_solution_survey_map.jpg",
                "scene_4_cta_registered_deed.jpg"
            ]
            chosen = land_cycle[scene_idx % len(land_cycle)]
            p = os.path.join(land_dir, chosen)
            if os.path.exists(p): return p

    # 8. High Court, Constitution, General Legal Justice (High-Quality Default)
    if os.path.exists(court_dir):
        p = os.path.join(court_dir, "high_court_constitution_scales.jpg")
        if os.path.exists(p): return p

    # Fallback to land records if available
    if os.path.exists(land_dir):
        p = os.path.join(land_dir, "scene_2_problem_satbara_ferfar.jpg")
        if os.path.exists(p): return p

    return None

def build_scene_html(scene_info: dict, overall_title: str, bg_image_path: Optional[str] = None) -> str:
    """
    Constructs high-definition 1080x1920 HTML layout with topic visual backdrop and sharp Devanagari typography
    """
    sc_type = scene_info.get("type", "hook")
    sc_title = scene_info.get("title", overall_title)
    speech_text = scene_info.get("text", "")
    vis_cue = scene_info.get("visual_cue", "महाराष्ट्र अधिकृत कायदेशीर तरतूद")
    
    badge_colors = {
        "hook": "linear-gradient(135deg, #DC2626, #991B1B)",
        "problem": "linear-gradient(135deg, #EA580C, #9A3412)",
        "law_solution": "linear-gradient(135deg, #16A34A, #166534)",
        "procedure": "linear-gradient(135deg, #0284C7, #0369A1)",
        "remedy": "linear-gradient(135deg, #7C3AED, #5B21B6)",
        "cta": "linear-gradient(135deg, #2563EB, #1E40AF)"
    }
    badge_labels = {
        "hook": "🚨 महत्त्वाची कायदेशीर सूचना (Legal Alert)",
        "problem": "⚠️ सामान्य अडचण व फसवणूक (The Risk)",
        "law_solution": "🏛️ कायदा आणि शासन निर्णय (The Law)",
        "procedure": "📋 अधिकृत पायऱ्या व कागदपत्रे (Procedure)",
        "remedy": "⚖️ कायदेशीर उपाय व दाद (Legal Remedy)",
        "cta": "📢 कायदेशीर सल्ला व पुढील कृती (Action)"
    }
    badge_bg = badge_colors.get(sc_type, "linear-gradient(135deg, #D4AF37, #B8860B)")
    badge_text = badge_labels.get(sc_type, "⚖️ कायदेशीर माहिती")

    # Responsive typography for detailed multi-sentence legal advice
    text_len = len(speech_text)
    if text_len > 250:
        speech_font_size = "32px"
        speech_line_height = "1.45"
    elif text_len > 160:
        speech_font_size = "37px"
        speech_line_height = "1.5"
    elif text_len > 90:
        speech_font_size = "43px"
        speech_line_height = "1.52"
    else:
        speech_font_size = "48px"
        speech_line_height = "1.55"
    
    # Prepare background style
    bg_style = ""
    if bg_image_path and os.path.exists(bg_image_path):
        clean_bg = os.path.abspath(bg_image_path).replace("\\", "/")
        bg_style = f"""
        .bg-layer {{
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: url('file:///{clean_bg}');
          background-size: cover;
          background-position: center;
          filter: brightness(0.88) contrast(1.08);
          z-index: 1;
        }}
        .bg-overlay {{
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(180deg, 
            rgba(9, 13, 22, 0.45) 0%, 
            rgba(9, 13, 22, 0.60) 45%, 
            rgba(9, 13, 22, 0.82) 100%);
          z-index: 1;
        }}
        """
    else:
        bg_style = """
        .bg-layer {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #090D16;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.22) 0%, transparent 45%);
          z-index: 1;
        }
        .bg-overlay { display: none; }
        """

    html = f"""<!DOCTYPE html>
<html lang="mr">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}
  body {{
    width: 1080px;
    height: 1920px;
    background: #090D16;
    color: #FFFFFF;
    font-family: 'Mukta', 'Nirmala UI', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 70px 50px 90px;
    position: relative;
    overflow: hidden;
  }}

  {bg_style}

  /* Grid overlay */
  .grid-pattern {{
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 1;
  }}

  .header-card {{
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(20px);
    border: 3px solid #D4AF37;
    border-radius: 28px;
    padding: 24px 36px;
    text-align: center;
    box-shadow: 0 15px 35px rgba(0,0,0,0.7), 0 0 25px rgba(212, 175, 55, 0.25);
    z-index: 2;
  }}
  .brand-title {{
    font-size: 46px;
    font-weight: 800;
    background: linear-gradient(90deg, #FFFFFF 0%, #F5D76E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }}
  .brand-sub {{
    font-size: 24px;
    color: #94A3B8;
    font-weight: 600;
    letter-spacing: 0.5px;
  }}

  .center-content {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    z-index: 2;
  }}

  .scene-badge {{
    background: {badge_bg};
    color: #FFFFFF;
    font-size: 32px;
    font-weight: 800;
    padding: 12px 38px;
    border-radius: 40px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.6);
    border: 2px solid rgba(255,255,255,0.7);
    letter-spacing: 0.5px;
  }}

  .headline-card {{
    background: rgba(14, 20, 32, 0.82);
    backdrop-filter: blur(20px);
    border: 3px solid rgba(212, 175, 55, 0.7);
    border-radius: 36px;
    padding: 40px 45px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 35px rgba(212, 175, 55, 0.1);
  }}
  .headline-text {{
    font-size: 54px;
    font-weight: 900;
    color: #FFDF55;
    line-height: 1.35;
    text-shadow: 0 4px 18px rgba(0,0,0,0.9);
    margin-bottom: 20px;
  }}
  .visual-cue-tag {{
    display: inline-block;
    background: rgba(30, 41, 59, 0.88);
    border: 1px solid rgba(148, 163, 184, 0.5);
    border-radius: 18px;
    padding: 10px 28px;
    font-size: 26px;
    color: #BAE6FD;
    font-weight: 700;
  }}

  .speech-card {{
    background: rgba(10, 15, 26, 0.84);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 32px;
    padding: 44px 50px;
    width: 100%;
    box-shadow: 0 15px 40px rgba(0,0,0,0.85);
    position: relative;
  }}
  .speech-tag {{
    position: absolute;
    top: -22px;
    left: 44px;
    background: #D4AF37;
    color: #0F172A;
    font-weight: 900;
    font-size: 22px;
    padding: 6px 22px;
    border-radius: 12px;
    letter-spacing: 0.5px;
  }}
  .speech-text {{
    font-size: {speech_font_size};
    font-weight: 600;
    line-height: {speech_line_height};
    color: #FFFFFF;
    text-shadow: 0 2px 10px rgba(0,0,0,0.9);
  }}
  .speech-quote {{
    color: #F5D76E;
    font-size: 54px;
    font-weight: 900;
  }}

  .footer-card {{
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(20px);
    border: 2px solid #D4AF37;
    border-radius: 26px;
    padding: 22px 36px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    z-index: 2;
  }}
  .footer-main {{
    font-size: 34px;
    font-weight: 800;
    color: #F5D76E;
    margin-bottom: 6px;
  }}
  .footer-sub {{
    font-size: 24px;
    color: #94A3B8;
    font-weight: 600;
    letter-spacing: 0.5px;
  }}
</style>
</head>
<body>
  <div class="bg-layer"></div>
  <div class="bg-overlay"></div>
  <div class="grid-pattern"></div>

  <div class="header-card">
    <div class="brand-title">⚖️ आपला कायदा (Aapla Kayda)</div>
    <div class="brand-sub">महाराष्ट्र अधिकृत कायदेशीर मार्गदर्शन व नागरिक हक्क</div>
  </div>

  <div class="center-content">
    <div class="scene-badge">{badge_text}</div>
    
    <div class="headline-card">
      <div class="headline-text">{sc_title}</div>
      <div class="visual-cue-tag">📌 {vis_cue}</div>
    </div>

    <div class="speech-card">
      <div class="speech-tag">🎙️ अधिकृत माहिती व सल्ला</div>
      <div class="speech-text">
        <span class="speech-quote">“</span>{speech_text}<span class="speech-quote">”</span>
      </div>
    </div>
  </div>

  <div class="footer-card">
    <div class="footer-main">👉 अधिक कायदेशीर माहितीसाठी आत्ताच फॉलो करा!</div>
    <div class="footer-sub">@aaplakayda • जनहितार्थ कायदेशीर जनजागृती • Like & Share ↗️</div>
  </div>
</body>
</html>"""
    return html

def render_scene_html_to_png(scene_info: dict, overall_title: str, out_png_path: str, bg_image_path: Optional[str] = None) -> str:
    browser_exe = get_browser_exe()
    if not browser_exe:
        raise RuntimeError("No Chromium/Edge browser found for high-quality Devanagari rendering")
        
    temp_html = out_png_path.replace(".png", "_temp.html")
    html_content = build_scene_html(scene_info, overall_title, bg_image_path=bg_image_path)
    
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    file_url = "file:///" + os.path.abspath(temp_html).replace("\\", "/")
    
    cmd = [
        browser_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--screenshot={os.path.abspath(out_png_path)}",
        "--window-size=1080,1920",
        "--default-background-color=00000000",
        file_url
    ]
    
    subprocess.run(cmd, check=True, capture_output=True)
    
    if os.path.exists(temp_html):
        try:
            os.remove(temp_html)
        except Exception:
            pass
            
    return out_png_path

def create_scene_image(scene_info: dict, overall_title: str, out_path: str, custom_bg: Optional[str] = None) -> str:
    """
    Renders high-definition 1080x1920 scene with topic visual backdrop and Marathi Devanagari typography
    """
    try:
        return render_scene_html_to_png(scene_info, overall_title, out_path, bg_image_path=custom_bg)
    except Exception as e:
        print(f"[RENDER WARNING] Chromium renderer error: {e}. Falling back to PIL...")
        # Fallback to PIL
        w, h = 1080, 1920
        base_img = Image.new("RGB", (w, h), (18, 22, 34))
        draw = ImageDraw.Draw(base_img)
        try:
            font_title = ImageFont.truetype(FONT_BOLD, 52)
        except Exception:
            font_title = ImageFont.load_default()
        draw.text((w // 2, h // 2), scene_info.get("title", overall_title), font=font_title, fill=(255, 223, 85), anchor="mm")
        base_img.save(out_path, quality=95)
        return out_path

def render_scene_clip(scene_img_path: str, audio_file: str, duration: float, output_clip_path: str, scene_idx: int = 0) -> str:
    """
    Renders an individual MP4 clip with smooth cinematic Ken Burns motion (pan/zoom) and synced audio
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_clip_path)), exist_ok=True)
    
    total_frames = max(int(duration * 30), 60)
    
    # Alternating Ken Burns motion:
    # Scene 0 (Hook): Zoom in from 1.00 to 1.05 (pushes into viewer)
    # Scene 1 (Problem): Slow zoom in 1.00 to 1.04
    # Scene 2 (Solution): Pan center-out
    # Scene 3 (CTA): Smooth center push
    if scene_idx % 2 == 0:
        vf_filter = f"zoompan=z='min(zoom+0.0007,1.05)':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30"
    else:
        vf_filter = f"zoompan=z='min(zoom+0.0005,1.04)':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30"

    cmd = [
        FFMPEG_EXE, "-y",
        "-loop", "1", "-i", scene_img_path,
        "-i", audio_file,
        "-vf", vf_filter,
        "-c:v", "libx264",
        "-t", str(duration),
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_clip_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    if result.returncode != 0:
        # Fallback to simple static scale without zoompan if filter fails
        cmd_fallback = [
            FFMPEG_EXE, "-y",
            "-loop", "1", "-i", scene_img_path,
            "-i", audio_file,
            "-vf", "scale=1080:1920",
            "-c:v", "libx264",
            "-t", str(duration),
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            output_clip_path
        ]
        subprocess.run(cmd_fallback, check=True)
        
    return output_clip_path

def combine_clips_with_music(clips_list: List[str], bg_music_path: Optional[str], output_final_mp4: str, ducking_vol: float = 0.12) -> str:
    """
    Concatenates clips and cleanly layers background legal music with smooth 3s fade-out
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_final_mp4)), exist_ok=True)
    temp_dir = os.path.dirname(os.path.abspath(output_final_mp4))
    
    # 1. Create concat file list
    concat_txt_path = os.path.join(temp_dir, "concat_clips.txt")
    with open(concat_txt_path, "w", encoding="utf-8") as f:
        for clip in clips_list:
            clean_path = clip.replace("\\", "/")
            f.write(f"file '{clean_path}'\n")
            
    temp_combined = os.path.join(temp_dir, "temp_stitched_video.mp4")
    
    # 2. Concat demuxer
    concat_cmd = [
        FFMPEG_EXE, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_txt_path,
        "-c", "copy",
        temp_combined
    ]
    subprocess.run(concat_cmd, check=True, capture_output=True)
    
    # 3. Layer background music if available
    if bg_music_path and os.path.exists(bg_music_path):
        video_dur = 30.0
        try:
            cmd_probe = [FFMPEG_EXE, "-i", temp_combined, "-f", "null", "-"]
            p_res = subprocess.run(cmd_probe, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, errors="replace")
            for line in p_res.stderr.splitlines():
                if "Duration:" in line:
                    parts = line.split("Duration:")[1].split(",")[0].strip()
                    h, m, s = parts.split(":")
                    video_dur = float(h) * 3600 + float(m) * 60 + float(s)
                    break
        except Exception:
            pass

        fade_start = max(1.0, round(video_dur - 3.0, 1))

        # Audio filter: duck bg music and mix with voiceover
        mix_cmd = [
            FFMPEG_EXE, "-y",
            "-i", temp_combined,
            "-stream_loop", "-1", "-i", bg_music_path,
            "-filter_complex",
            f"[1:a]volume={ducking_vol},afade=t=out:st={fade_start}:d=3[bg];[0:a][bg]amix=inputs=2:duration=first:weights=1.0 0.8[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            "-shortest",
            output_final_mp4
        ]
        res = subprocess.run(mix_cmd, capture_output=True, text=True, errors="replace")
        if res.returncode != 0:
            if os.path.exists(temp_combined):
                if os.path.exists(output_final_mp4):
                    os.remove(output_final_mp4)
                fs_cmd = [FFMPEG_EXE, "-y", "-i", temp_combined, "-c", "copy", "-movflags", "+faststart", output_final_mp4]
                subprocess.run(fs_cmd, check=True)
    else:
        if os.path.exists(temp_combined):
            if os.path.exists(output_final_mp4):
                os.remove(output_final_mp4)
            fs_cmd = [FFMPEG_EXE, "-y", "-i", temp_combined, "-c", "copy", "-movflags", "+faststart", output_final_mp4]
            subprocess.run(fs_cmd, check=True)
            
    # Cleanup temp
    if os.path.exists(temp_combined):
        try:
            os.remove(temp_combined)
        except Exception:
            pass
            
    return output_final_mp4

def render_advocate_explainer_reel(
    scenes_with_audio: List[dict],
    bg_music_preset: str = "legal_ambient",
    output_dir: Optional[str] = None,
    overall_title: str = "आपला कायदा – कायदेशीर माहिती",
    progress_callback=None
) -> Tuple[str, List[dict]]:
    """
    Complete Professional Text-Based & AI Visual Explainer Reel Pipeline
    - Matches topic visuals for each scene.
    - Chromium Devanagari typography rendering.
    - FFmpeg Ken Burns pan/zoom clips.
    - Background music layering.
    """
    if not output_dir:
        output_dir = os.path.join(BASE_DIR, "output_reels", f"reel_{int(time.time())}")
    os.makedirs(output_dir, exist_ok=True)
    
    clips_dir = os.path.join(output_dir, "clips")
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(clips_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)
    
    clip_paths = []
    clip_meta = []
    total_scenes = len(scenes_with_audio)
    
    for idx, sc in enumerate(scenes_with_audio):
        s_num = sc.get("scene_num", idx + 1)
        audio_file = sc.get("audio_file")
        text = sc.get("text", "")
        title = sc.get("title", overall_title)
        duration = float(sc.get("duration", 5.0))
        
        # 1. Resolve topic-specific visual asset
        bg_asset = resolve_scene_visual(sc, overall_title, idx)
        
        # 2. Render high-definition scene graphic
        scene_img_path = os.path.join(images_dir, f"scene_{s_num}.png")
        create_scene_image(sc, overall_title, scene_img_path, custom_bg=bg_asset)
        
        # 3. Render dynamic motion clip
        out_clip_name = f"clip_{s_num:02d}.mp4"
        out_clip_path = os.path.join(clips_dir, out_clip_name)
        render_scene_clip(scene_img_path, audio_file, duration, out_clip_path, scene_idx=idx)
        
        clip_paths.append(out_clip_path)
        clip_meta.append({
            "scene_num": s_num,
            "title": title[:40],
            "text": text,
            "clip_file": out_clip_name,
            "visual_asset": os.path.basename(bg_asset) if bg_asset else "Devanagari Studio",
            "duration": round(duration, 2)
        })
        
        if progress_callback:
            pct = 40 + int((idx + 1) / total_scenes * 45)
            progress_callback(pct, f"सीन #{s_num} व्हिज्युअल व मोशन क्लिप तयार झाली ({idx+1}/{total_scenes})")
            
    # 4. Resolve background music
    bg_audio_path = None
    if bg_music_preset and bg_music_preset != "none":
        candidate1 = os.path.join(BG_AUDIO_DIR, f"{bg_music_preset}_bg.mp3")
        candidate2 = os.path.join(BG_AUDIO_DIR, f"{bg_music_preset}.mp3")
        if os.path.exists(candidate1):
            bg_audio_path = candidate1
        elif os.path.exists(candidate2):
            bg_audio_path = candidate2
            
    # 5. Combine clips and mix music
    final_reel_path = os.path.join(output_dir, "final_reel.mp4")
    combine_clips_with_music(clip_paths, bg_audio_path, final_reel_path, ducking_vol=0.12)
    
    # 6. Generate inspection thumbnail at 2.0s
    thumb_path = os.path.join(output_dir, "thumbnail.jpg")
    thumb_cmd = [
        FFMPEG_EXE, "-y",
        "-ss", "00:00:02",
        "-i", final_reel_path,
        "-vframes", "1",
        "-q:v", "2",
        thumb_path
    ]
    subprocess.run(thumb_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    return final_reel_path, clip_meta
