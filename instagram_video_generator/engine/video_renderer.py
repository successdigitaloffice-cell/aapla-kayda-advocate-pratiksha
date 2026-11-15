"""
Direct Video Renderer for Instagram Reels (9:16 Vertical 1080x1920)
Advocate Pratiksha - आपला कायदा
Uses PIL for rich Devanagari typography and FFmpeg for video rendering & stitching.
"""

import os
import textwrap
import subprocess
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(BASE_DIR, "assets", "fonts")
TEMPLATES_DIR = os.path.join(BASE_DIR, "assets", "templates")
BG_AUDIO_DIR = os.path.join(BASE_DIR, "assets", "bg_audio")

FONT_BOLD = os.path.join(FONTS_DIR, "Mukta-Bold.ttf")
FONT_REGULAR = os.path.join(FONTS_DIR, "Mukta-Regular.ttf")

SCENE_BADGES = {
    "hook": "🚨 महत्त्वाची कायदेशीर सूचना",
    "problem": "⚠️ सामान्य अडचण व फसवणूक",
    "law_solution": "🏛️ कायदा आणि न्यायालयीन निकाल",
    "cta": "⚖️ कायदेशीर सल्ला व मार्गदर्शन"
}

CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]

def get_browser_exe():
    for p in CHROME_PATHS:
        if os.path.exists(p):
            return p
    return None

def build_scene_html(scene_info, overall_title):
    sc_type = scene_info.get("type", "hook")
    sc_title = scene_info.get("title", overall_title)
    speech_text = scene_info.get("text", "")
    vis_cue = scene_info.get("visual_cue", "महाराष्ट्र अधिकृत कायदेशीर तरतूद")
    
    badge_colors = {
        "hook": "linear-gradient(135deg, #DC2626, #991B1B)",
        "problem": "linear-gradient(135deg, #EA580C, #9A3412)",
        "law_solution": "linear-gradient(135deg, #16A34A, #166534)",
        "cta": "linear-gradient(135deg, #2563EB, #1E40AF)"
    }
    badge_labels = {
        "hook": "🚨 महत्त्वाची कायदेशीर सूचना (Legal Alert)",
        "problem": "⚠️ सामान्य अडचण व फसवणूक (The Risk)",
        "law_solution": "🏛️ कायदा आणि शासन निर्णय (The Law)",
        "cta": "⚖️ कायदेशीर सल्ला व मार्गदर्शन (Action)"
    }
    badge_bg = badge_colors.get(sc_type, "linear-gradient(135deg, #D4AF37, #B8860B)")
    badge_text = badge_labels.get(sc_type, "⚖️ कायदेशीर माहिती")
    
    html = f"""<!DOCTYPE html>
<html lang="mr">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
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
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.12) 0%, transparent 45%);
    color: #FFFFFF;
    font-family: 'Mukta', 'Nirmala UI', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 60px 100px;
    position: relative;
    overflow: hidden;
  }}
  
  body::before {{
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }}

  .header-card {{
    background: rgba(18, 24, 38, 0.88);
    backdrop-filter: blur(20px);
    border: 3px solid #D4AF37;
    border-radius: 28px;
    padding: 24px 36px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 25px rgba(212, 175, 55, 0.25);
    z-index: 2;
  }}
  .brand-title {{
    font-size: 48px;
    font-weight: 800;
    background: linear-gradient(90deg, #FFFFFF, #F5D76E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }}
  .brand-sub {{
    font-size: 26px;
    color: #94A3B8;
    font-weight: 500;
    letter-spacing: 1px;
  }}

  .center-content {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
    z-index: 2;
  }}

  .scene-badge {{
    background: {badge_bg};
    color: #FFFFFF;
    font-size: 32px;
    font-weight: 700;
    padding: 12px 36px;
    border-radius: 40px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    border: 2px solid rgba(255,255,255,0.6);
    letter-spacing: 0.5px;
  }}

  .headline-card {{
    background: rgba(14, 20, 32, 0.92);
    backdrop-filter: blur(20px);
    border: 3px solid rgba(212, 175, 55, 0.6);
    border-radius: 36px;
    padding: 44px 50px;
    width: 100%;
    text-align: center;
    box-shadow: 0 15px 40px rgba(0,0,0,0.7), inset 0 0 30px rgba(212, 175, 55, 0.08);
  }}
  .headline-text {{
    font-size: 58px;
    font-weight: 800;
    color: #FFDF55;
    line-height: 1.35;
    text-shadow: 0 4px 15px rgba(0,0,0,0.8);
    margin-bottom: 24px;
  }}
  .visual-cue-tag {{
    display: inline-block;
    background: rgba(30, 41, 59, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.4);
    border-radius: 18px;
    padding: 10px 28px;
    font-size: 26px;
    color: #BAE6FD;
    font-weight: 600;
  }}

  .speech-card {{
    background: rgba(11, 15, 25, 0.95);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 32px;
    padding: 44px 50px;
    width: 100%;
    box-shadow: 0 12px 35px rgba(0,0,0,0.8);
    position: relative;
  }}
  .speech-tag {{
    position: absolute;
    top: -22px;
    left: 44px;
    background: #D4AF37;
    color: #0F172A;
    font-weight: 800;
    font-size: 22px;
    padding: 6px 22px;
    border-radius: 12px;
    letter-spacing: 0.5px;
  }}
  .speech-text {{
    font-size: 46px;
    font-weight: 600;
    line-height: 1.55;
    color: #FFFFFF;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  }}
  .speech-quote {{
    color: #F5D76E;
    font-size: 54px;
    font-weight: 800;
  }}

  .footer-card {{
    background: rgba(18, 24, 38, 0.9);
    border: 2px solid #D4AF37;
    border-radius: 26px;
    padding: 22px 36px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0,0,0,0.6);
    z-index: 2;
  }}
  .footer-main {{
    font-size: 34px;
    font-weight: 800;
    color: #F5D76E;
    margin-bottom: 6px;
  }}
  .footer-sub {{
    font-size: 26px;
    color: #94A3B8;
    font-weight: 600;
    letter-spacing: 0.5px;
  }}
</style>
</head>
<body>
  <div class="header-card">
    <div class="brand-title">⚖️ आपला कायदा – ॲडव्होकेट प्रतीक्षा</div>
    <div class="brand-sub">महाराष्ट्र कायदेशीर मार्गदर्शन व हक्क जागृती</div>
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
    <div class="footer-main">👉 अधिक कायदेशीर सल्ल्यासाठी आत्ताच फॉलो करा!</div>
    <div class="footer-sub">@aaplakayda • Advocate Pratiksha • Like & Share ↗️</div>
  </div>
</body>
</html>"""
    return html

def render_scene_html_to_png(scene_info, overall_title, out_png_path):
    browser_exe = get_browser_exe()
    if not browser_exe:
        raise RuntimeError("No Chromium/Edge browser found for high-quality Devanagari rendering")
        
    temp_html = out_png_path.replace(".png", "_temp.html")
    html_content = build_scene_html(scene_info, overall_title)
    
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

def create_scene_image(scene_info, overall_title, out_path, custom_bg=None):
    """
    Renders high-definition 1080x1920 scene with 100% accurate Marathi Devanagari typography
    """
    try:
        return render_scene_html_to_png(scene_info, overall_title, out_path)
    except Exception as e:
        print(f"[RENDER WARNING] Chromium renderer error: {e}. Falling back to PIL...")
        # Fallback to PIL
        w, h = 1080, 1920
        base_img = Image.new("RGB", (w, h), (18, 22, 34))
        draw = ImageDraw.Draw(base_img)
        font_title = load_font(FONT_BOLD, 52)
        draw.text((w // 2, h // 2), scene_info.get("title", overall_title), font=font_title, fill=(255, 223, 85), anchor="mm")
        base_img.save(out_path, quality=95)
        return out_path

def render_scene_clip(scene_img_path, audio_file, duration, output_clip_path):
    """
    Renders an individual MP4 clip with subtle zoom and synced audio
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_clip_path)), exist_ok=True)
    
    # Zoompan effect over duration frames (30 fps)
    total_frames = max(int(duration * 30), 60)
    
    cmd = [
        FFMPEG_EXE, "-y",
        "-loop", "1", "-i", scene_img_path,
        "-i", audio_file,
        "-vf", f"zoompan=z='min(zoom+0.0006,1.04)':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
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

def combine_clips_with_music(clips_list, bg_music_path, output_final_mp4, ducking_vol=0.14):
    """
    Concatenates clips and softly layers background legal music
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
            "-shortest",
            output_final_mp4
        ]
        res = subprocess.run(mix_cmd, capture_output=True, text=True, errors="replace")
        if res.returncode != 0:
            # If complex filter errors, copy temp
            if os.path.exists(temp_combined):
                if os.path.exists(output_final_mp4):
                    os.remove(output_final_mp4)
                os.rename(temp_combined, output_final_mp4)
    else:
        if os.path.exists(temp_combined):
            if os.path.exists(output_final_mp4):
                os.remove(output_final_mp4)
            os.rename(temp_combined, output_final_mp4)
            
    # Cleanup temp
    if os.path.exists(temp_combined):
        try:
            os.remove(temp_combined)
        except Exception:
            pass
            
    return output_final_mp4
