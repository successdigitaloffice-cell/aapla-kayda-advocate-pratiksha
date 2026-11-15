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

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

VOICE_MAP = {
    "aarohi": "mr-IN-AarohiNeural",
    "manohar": "mr-IN-ManoharNeural",
    "female": "mr-IN-AarohiNeural",
    "male": "mr-IN-ManoharNeural"
}

def speed_to_rate(speed) -> str:
    """
    Converts numeric speed multipliers (0.85, 1.0, 1.10, 1.20, 1.30)
    to edge_tts percentage string (e.g. "-15%", "+0%", "+10%", "+20%", "+30%").
    Default is 1.10x (+10%) for natural Marathi pace.
    """
    if speed is None:
        return "+10%"
    try:
        val = float(speed)
    except (ValueError, TypeError):
        return "+10%"
    
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
    land records, and numbers into natural Devanagari Marathi phonetics.
    Guarantees that Edge-TTS speaks 7/12 as 'सातबारा', BNSS as 'भारतीय नागरिक सुरक्षा संहिता',
    कलम 318(4) as 'कलम तीनशे अठरा उपकलम चार', etc., with natural pauses and clean intonation.
    """
    if not text:
        return ""
        
    s = text

    # Strip visual emojis from spoken audio to prevent TTS glitches
    s = re.sub(r'[\U00010000-\U0010ffff]', ' ', s)
    s = re.sub(r'[🚨⚠️🏛️⚖️👉🎙️✨🎬📌🎣🔴📢✅❌💯🔹🔸💡⏱️]', ' ', s)

    # Convert Devanagari numerals to standard digits for rule matching
    d2e = str.maketrans('०१२३४५६७८९', '0123456789')
    
    # 1. Land & Revenue Terms & Abbreviations
    s = re.sub(r'7\s*/\s*12|७\s*/\s*१२', 'सातबारा', s)
    s = re.sub(r'(?:\b8[-/\s]*[Aa]\b|\b८[-/\s]*[अaA]\b)', 'आठ-अ', s)
    s = re.sub(r'\bCTS\b|\bसीटीएस\b', 'सिटी सर्व्हे नंबर', s, flags=re.I)
    s = re.sub(r'\bPOA\b|\bपीओए\b', 'पॉवर ऑफ ॲटर्नी कुलमुखत्यारपत्र', s, flags=re.I)
    s = re.sub(r'\bNOC\b|\bएनओसी\b', 'ना हरकत प्रमाणपत्र', s, flags=re.I)
    s = re.sub(r'\bNA\b|\bN\.A\.|\bएनए\b', 'एन.ए. अकृषिक', s, flags=re.I)
    s = re.sub(r'\bGR\b|\bजीआर\b', 'शासन निर्णय जी.आर.', s, flags=re.I)
    s = re.sub(r'\bSDO\b|\bएसडीओ\b', 'उपविभागीय अधिकारी एस.डी.ओ.', s, flags=re.I)
    s = re.sub(r'\bRTI\b|\bआरटीआय\b', 'माहिती अधिकार आर.टी.आय.', s, flags=re.I)
    s = re.sub(r'\bRERA\b|\bमहारेरा\b|\bरेरा\b', 'महारेरा', s, flags=re.I)
    s = re.sub(r'\bMLRC\b|\bएमएलआरसी\b', 'महाराष्ट्र जमीन महसूल संहिता', s, flags=re.I)
    s = re.sub(r'\be-?haqq\b|\be-?हक्क\b', 'ई-हक्क प्रणाली', s, flags=re.I)
    s = re.sub(r'\be-?ferfar\b|\be-?फेरफार\b', 'ई-फेरफार', s, flags=re.I)

    # 2. Advocate & Brand Names
    s = re.sub(r'\bAdvocate\s+Pratiksha\b|\bAdv\.\s*Pratiksha\b', 'ॲडव्होकेट प्रतीक्षा', s, flags=re.I)
    s = re.sub(r'\bAdvocate\b|\bAdv\.\b', 'ॲडव्होकेट', s, flags=re.I)
    s = re.sub(r'\bAapla\s+Kayda\b', 'आपला कायदा', s, flags=re.I)

    # 3. Criminal Law & New Sanhitas (BNSS, BNS, BSA)
    s = re.sub(r'\bBNSS\b|\bबीएनएसएस\b', 'भारतीय नागरिक सुरक्षा संहिता बी.एन.एस.एस.', s, flags=re.I)
    s = re.sub(r'\bBNS\b|\bबीएनएस\b', 'भारतीय न्याय संहिता बी.एन.एस.', s, flags=re.I)
    s = re.sub(r'\bBSA\b|\bबीएसए\b', 'भारतीय साक्ष्य अधिनियम बी.एस.ए.', s, flags=re.I)
    s = re.sub(r'\bCrPC\b|\bसीआरपीसी\b', 'फौजदारी प्रक्रिया संहिता सी.आर.पी.सी.', s, flags=re.I)
    s = re.sub(r'\bIPC\b|\bआयपीसी\b', 'भारतीय दंड विधान आय.पी.सी.', s, flags=re.I)
    s = re.sub(r'\bCPC\b|\bसीपीसी\b', 'दिवाणी प्रक्रिया संहिता सी.पी.सी.', s, flags=re.I)
    s = re.sub(r'\bFIR\b|\bएफआयआर\b', 'एफ.आय.आर. प्रथम माहिती अहवाल', s, flags=re.I)

    # 4. Courts, Procedures & Legal English Terms
    s = re.sub(r'\bSupreme Court\b|\bसुप्रीम कोर्ट\b', 'सर्वोच्च न्यायालय सुप्रीम कोर्ट', s, flags=re.I)
    s = re.sub(r'\bHigh Court\b|\bहायकोर्ट\b', 'उच्च न्यायालय हायकोर्ट', s, flags=re.I)
    s = re.sub(r'\bDistrict Court\b', 'जिल्हा न्यायालय', s, flags=re.I)
    s = re.sub(r'\bSessions Court\b', 'सत्र न्यायालय', s, flags=re.I)
    s = re.sub(r'\bPolice Station\b', 'पोलीस ठाणे', s, flags=re.I)
    s = re.sub(r'\bAnticipatory Bail\b', 'अटकपूर्व जामीन', s, flags=re.I)
    s = re.sub(r'\bBail\b', 'जामीन', s, flags=re.I)
    s = re.sub(r'\bStay Order\b|\bस्टे ऑर्डर\b', 'स्थगिती आदेश स्टे ऑर्डर', s, flags=re.I)
    s = re.sub(r'\bInjunction\b', 'मनाई हुकूम', s, flags=re.I)
    s = re.sub(r'\bCaveat\b|\bकॅव्हेएट\b', 'कॅव्हेएट अर्ज', s, flags=re.I)
    s = re.sub(r'\bSummons\b', 'समन्स', s, flags=re.I)
    s = re.sub(r'\bWarrant\b', 'वारंट', s, flags=re.I)
    s = re.sub(r'\bCharge Sheet\b|\bचार्जशीट\b', 'दोषारोपपत्र चार्जशीट', s, flags=re.I)
    s = re.sub(r'\bLegal Notice\b', 'कायदेशीर नोटीस', s, flags=re.I)
    s = re.sub(r'\bAffidavit\b', 'प्रतिज्ञापत्र', s, flags=re.I)
    s = re.sub(r'\bAgreement\b', 'करारनामा', s, flags=re.I)
    s = re.sub(r'\bSale Deed\b', 'खरेदीखत', s, flags=re.I)
    s = re.sub(r'\bGift Deed\b', 'बक्षीसपत्र', s, flags=re.I)

    # 5. Helplines & Important Contact Numbers
    s = re.sub(r'\b1930\b|\b१९३०\b', 'एकोणीस तीस', s)
    s = re.sub(r'\b112\b|\b११२\b', 'एक एक दोन', s)
    s = re.sub(r'\b100\b|\b१००\b', 'शंभर', s)
    s = re.sub(r'\b1090\b|\b१०९०\b', 'दहा नव्वद', s)
    s = re.sub(r'\b1091\b|\b१०९१\b', 'दहा एक्क्याण्णव', s)
    s = re.sub(r'\b181\b|\b१८१\b', 'एक आठ एक', s)

    # 6. Currency, Percentages & Units
    s = re.sub(r'₹\s*(\d+)|Rs\.?\s*(\d+)', r'\1 रुपये', s)
    s = re.sub(r'100\s*%|१००\s*%', 'शंभर टक्के', s)
    s = re.sub(r'50\s*%|५०\s*%', 'पन्नास टक्के', s)
    s = re.sub(r'(\d+)\s*%', r'\1 टक्के', s)
    s = re.sub(r'(\d+)\s*sq\s*ft|(\d+)\s*स्क्वेअर\s*फूट', r'\1 चौरस फूट', s, flags=re.I)
    s = re.sub(r'(\d+)\s*sq\s*mtr|(\d+)\s*चौ\.?\s*मी\.?', r'\1 चौरस मीटर', s, flags=re.I)

    # 7. Common Range & Quantity Expressions
    s = re.sub(r'1\s*ते\s*3|१\s*ते\s*३', 'एक ते तीन', s)
    s = re.sub(r'1\s*ते\s*2|१\s*ते\s*२', 'एक ते दोन', s)
    s = re.sub(r'2\s*ते\s*3|२\s*ते\s*३', 'दोन ते तीन', s)
    s = re.sub(r'3\s*ते\s*5|३\s*ते\s*५', 'तीन ते पाच', s)
    s = re.sub(r'1\s*गुंठा|१\s*गुंठा', 'एक गुंठा', s)
    s = re.sub(r'2\s*गुंठे|२\s*गुंठे', 'दोन गुंठे', s)
    s = re.sub(r'3\s*गुंठे|३\s*गुंठे', 'तीन गुंठे', s)

    # 8. Law & Historical Years
    years_map = {
        '1882': 'अठराशे ब्याऐंशी', '1908': 'एकोणीसशे आठ', '1947': 'एकोणीसशे सेहेचाळीस',
        '1956': 'एकोणीसशे छप्पन्न', '1966': 'एकोणीसशे छासष्ट', '2000': 'दोन हजार',
        '2001': 'दोन हजार एक', '2005': 'दोन हजार पाच', '2016': 'दोन हजार सोळा',
        '2020': 'दोन हजार वीस', '2021': 'दोन हजार एकवीस', '2022': 'दोन हजार बावीस',
        '2023': 'दोन हजार तेवीस', '2024': 'दोन हजार चोवीस', '2025': 'दोन हजार पंचवीस',
        '2026': 'दोन हजार सव्वीस'
    }
    for y_k, y_v in years_map.items():
        s = re.sub(rf'\b{y_k}\b', y_v, s)

    # 9. Dynamic Section (कलम) Expansion
    # Matches: कलम 318(4), कलम 41A, कलम ३५, कलम 138, etc.
    def replace_kalam(match):
        raw = match.group(1).translate(d2e).strip()
        # Check sub-section e.g. 318(4)
        sub_match = re.match(r'^(\d+)\((\d+)\)$', raw)
        if sub_match:
            main_sec = int(sub_match.group(1))
            sub_sec = int(sub_match.group(2))
            return f"कलम {_num_to_mr_word(main_sec)} उपकलम {_num_to_mr_word(sub_sec)}"
        # Check sub-clause with letter e.g. 41A or 41-A or 8B
        sub_letter = re.match(r'^(\d+)[-]?([a-zA-Z])$', raw)
        if sub_letter:
            main_sec = int(sub_letter.group(1))
            letter = sub_letter.group(2).upper()
            letter_mr = {'A': 'अ', 'B': 'ब', 'C': 'क', 'D': 'ड'}.get(letter, letter)
            return f"कलम {_num_to_mr_word(main_sec)}-{letter_mr}"
        # Pure numeric section e.g. 35, 138, 302, 420
        if raw.isdigit():
            val = int(raw)
            if val <= 999:
                return f"कलम {_num_to_mr_word(val)}"
        return f"कलम {raw}"

    s = re.sub(r'कलम\s*([०-९\d]+(?:\([०-९\d]+\)|[-][a-zA-Zअ-ह]|(?=[a-zA-Z])\w+)?)', replace_kalam, s)

    # 10. Small digits to Marathi in time contexts (उदा. २ तासांत, 15 दिवसांत, 3 महिने)
    num_to_mr = {
        '1': 'एक', '2': 'दोन', '3': 'तीन', '4': 'चार', '5': 'पाच',
        '6': 'सहा', '7': 'सात', '8': 'आठ', '9': 'नऊ', '10': 'दहा',
        '15': 'पंधरा', '30': 'तीस', '60': 'साठ', '90': 'नव्वद'
    }
    for n_k, n_v in num_to_mr.items():
        s = re.sub(rf'(?<!\d){n_k}\s*(तास|दिवस|महिने|वर्षे|महिन्या|वर्षां|लाख|हजार)', f'{n_v} \\1', s)

    # 11. Normalize Punctuation for Natural Pausing
    # Replace multiple exclamation marks or question marks with clean single pauses
    s = re.sub(r'!+', '.', s)
    s = re.sub(r'\?+', '?', s)
    s = re.sub(r'\s{2,}', ' ', s)

    return s.strip()

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
