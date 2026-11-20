"""
TTS Engine for Marathi Voiceover
Advocate Pratiksha - आपला कायदा
Uses edge-tts (Microsoft Cognitive Services Neural Voices)
Voice Options:
- mr-IN-AarohiNeural (Female, Advocate Pratiksha) - Default
- mr-IN-ManoharNeural (Male, Legal Expert)
Speed Control:
- 0.85x (-15% Slow)
- 1.00x (+0% Normal)
- 1.10x (+10% Recommended Natural Marathi Default)
- 1.20x (+20% Fast)
- 1.30x (+30% Very Fast)
"""

import os
import re
import asyncio
import subprocess
import json
import time
import edge_tts
import imageio_ffmpeg
from engine.marathi_normalizer import normalize_marathi_text, number_to_marathi_words

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

VOICE_MAP = {
    "aarohi": "mr-IN-AarohiNeural",
    "manohar": "mr-IN-ManoharNeural",
    "female": "mr-IN-AarohiNeural",
    "male": "mr-IN-ManoharNeural"
}

def speed_to_rate(speed) -> str:
    """
    Converts numeric speed multipliers (0.85, 0.95, 1.0, 1.05, 1.10, 1.15, 1.25)
    to edge_tts percentage string (e.g. "-5%", "+0%", "+5%", "+10%", "+15%").
    Default is 1.05x (+5%) for crystal-clear, articulate, natural Marathi pace.
    """
    if speed is None:
        return "+5%"
    try:
        val = float(speed)
    except (ValueError, TypeError):
        return "+5%"
    
    # Calculate percentage offset from 1.0
    pct = int(round((val - 1.0) * 100))
    # Bound between -30% and +50% for audio intelligibility
    pct = max(-30, min(50, pct))
    return f"{pct:+d}%"

def get_audio_duration(file_path):
    """
    Get duration in seconds using ffmpeg probe or basic ffmpeg info
    """
    cmd = [
        FFMPEG_EXE,
        "-i", file_path,
        "-f", "null", "-"
    ]
    result = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, errors="replace")
    for line in result.stderr.splitlines():
        if "Duration:" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = parts.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 5.0 # fallback

def _num_to_mr_word(n: int) -> str:
    """
    Converts numbers (1 to 999) to Marathi words
    """
    units = {
        0: 'शून्य', 1: 'एक', 2: 'दोन', 3: 'तीन', 4: 'चार', 5: 'पाच', 6: 'सहा', 7: 'सात', 8: 'आठ', 9: 'नऊ', 10: 'दहा',
        11: 'अकरा', 12: 'बारा', 13: 'तेरा', 14: 'चौदा', 15: 'पंधरा', 16: 'सोळा', 17: 'सतरा', 18: 'अठरा', 19: 'एकोणीस', 20: 'वीस',
        21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस', 26: 'सव्वीस', 27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस', 30: 'तीस',
        31: 'एकतीस', 32: 'बत्तीस', 33: 'तेहेतीस', 34: 'चौतीस', 35: 'पस्तीस', 36: 'छत्तीस', 37: 'सदतीस', 38: 'अडतीस', 39: 'एकेचाळीस', 40: 'चाळीस',
        41: 'एक्केचाळीस', 42: 'बेचाळीस', 43: 'त्रेचाळीस', 44: 'चव्वेचाळीस', 45: 'पंचेचाळीस', 46: 'शेहेचाळीस', 47: 'सत्तेचाळीस', 48: 'अठ्ठेचाळीस', 49: 'एकोणपन्नास', 50: 'पन्नास',
        51: 'एक्कावन्न', 52: 'बावन्न', 53: 'त्रेपन्न', 54: 'चोपन्न', 55: 'पंचावन्न', 56: 'छप्पन्न', 57: 'सत्तावन्न', 58: 'अठ्ठावन्न', 59: 'एकोणसाठ', 60: 'साठ',
        61: 'एकसष्ठ', 62: 'बासष्ठ', 63: 'त्रेसष्ठ', 64: 'चौसष्ठ', 65: 'पासष्ठ', 66: 'सहासष्ठ', 67: 'सदुसष्ठ', 68: 'अडुसष्ठ', 69: 'एकोणसत्तर', 70: 'सत्तर',
        71: 'एकाहत्तर', 72: 'बाहत्तर', 73: 'त्र्याहत्तर', 74: 'चौऱ्याहत्तर', 75: 'पंच्याहत्तर', 76: 'शहात्तर', 77: 'सत्त्याहत्तर', 78: 'अठ्ठ्याहत्तर', 79: 'एकोणऐंशी', 80: 'ऐंशी',
        81: 'एक्याऐंशी', 82: 'ब्याऐंशी', 83: 'त्र्याऐंशी', 84: 'चौऱ्याऐंशी', 85: 'पंच्याऐंशी', 86: 'शहाऐंशी', 87: 'सत्त्याऐंशी', 88: 'अठ्ठ्याऐंशी', 89: 'एकोणनव्वद', 90: 'नव्वद',
        91: 'एक्याण्णव', 92: 'ब्याण्णव', 93: 'त्र्याण्णव', 94: 'चौऱ्याण्णव', 95: 'पंच्याण्णव', 96: 'शहाण्णव', 97: 'सत्त्याण्णव', 98: 'अठ्ठ्याण्णव', 99: 'नव्व्याण्णव', 100: 'शंभर'
    }
    if n in units:
        return units[n]
    if 101 <= n < 1000:
        h = n // 100
        rem = n % 100
        prefix = {1: 'एकशे', 2: 'दोनशे', 3: 'तीनशे', 4: 'चारशे', 5: 'पाचशे', 6: 'सहाशे', 7: 'सातशे', 8: 'आठशे', 9: 'नऊशे'}.get(h, f'{h}शे')
        return prefix if rem == 0 else f'{prefix} {units.get(rem, str(rem))}'
    return str(n)

def normalize_marathi_for_speech(text: str) -> str:
    """
    Transforms English legal terms, acronyms, court names, sections (कलमे),
    land records (7/12 -> सातबारा), acts (BNSS, BNS, BSA, IPC, CrPC), dates,
    and numbers into 100% natural Devanagari Marathi phonetics via marathi_normalizer.
    """
    return normalize_marathi_text(text)

async def _synthesize_async(text, voice, out_mp3, out_vtt=None, rate="+10%", pitch="+0Hz"):
    clean_text = text.strip() if text else "अधिक माहितीसाठी आपला कायदा फॉलो करा."
    # Pre-process with phonetic Marathi legal normalization
    spoken_text = normalize_marathi_for_speech(clean_text)
    
    communicate = edge_tts.Communicate(spoken_text, voice, rate=rate, pitch=pitch)
    if out_vtt:
        submaker = edge_tts.SubMaker()
        with open(out_mp3, "wb") as file:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    file.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    submaker.feed(chunk)
        with open(out_vtt, "w", encoding="utf-8") as f:
            f.write(submaker.get_srt())
    else:
        await communicate.save(out_mp3)

def generate_voiceover(text, voice_key="aarohi", out_mp3="voice.mp3", out_vtt=None, speed=1.10, pitch="+0Hz"):
    voice = VOICE_MAP.get(voice_key.lower(), "mr-IN-AarohiNeural")
    rate_str = speed_to_rate(speed)
    os.makedirs(os.path.dirname(os.path.abspath(out_mp3)), exist_ok=True)
    
    clean_text = text.strip() if (text and text.strip()) else "अधिकृत माहितीसाठी आपला कायदा फॉलो करा."
    
    success = False
    for attempt in range(3):
        try:
            asyncio.run(_synthesize_async(clean_text, voice, out_mp3, out_vtt, rate=rate_str, pitch=pitch))
            if os.path.exists(out_mp3) and os.path.getsize(out_mp3) > 1000:
                success = True
                break
        except Exception as e:
            print(f"[TTS WARNING] Attempt {attempt+1} failed: {e}")
            time.sleep(1)
            
    if not success:
        # If edge-tts failed, generate fallback silent placeholder audio with ffmpeg
        print(f"[TTS FALLBACK] Generating fallback audio for: {clean_text[:30]}")
        cmd = [
            FFMPEG_EXE, "-y",
            "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
            "-t", "4.0",
            "-c:a", "libmp3lame", "-b:a", "128k",
            out_mp3
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        
    duration = get_audio_duration(out_mp3)
    return {
        "mp3_path": out_mp3,
        "vtt_path": out_vtt,
        "duration": duration,
        "voice": voice,
        "rate": rate_str
    }

def generate_scenes_audio(scenes, voice_key="aarohi", speed=1.10, output_dir="output"):
    """
    Generate audio for each individual scene and return list with durations
    """
    os.makedirs(output_dir, exist_ok=True)
    results = []
    
    for sc in scenes:
        s_num = sc.get("scene_num", 1)
        text = sc.get("text", "")
        out_mp3 = os.path.join(output_dir, f"scene_{s_num}_voice.mp3")
        out_srt = os.path.join(output_dir, f"scene_{s_num}_sub.srt")
        
        info = generate_voiceover(text, voice_key, out_mp3, out_srt, speed=speed)
        sc_copy = dict(sc)
        sc_copy["audio_file"] = out_mp3
        sc_copy["srt_file"] = out_srt
        # Minimum scene length 3.5s for video pacing
        sc_copy["duration"] = max(round(info["duration"] + 0.6, 2), 3.5)
        results.append(sc_copy)
        
    return results
