"""
Marathi Text Normalization & Legal Pronunciation Engine
Project: Aapla Kayda - Advocate Pratiksha
Converts complex legal terms, English acronyms, land records (7/12),
acts (BNSS, BNS, BSA, IPC, CrPC), section numbers (कलमे), dates,
years, currency (रुपये), durations, and numbers into 100% natural,
accurate phonetic Devanagari for Edge-TTS and speech synthesis.
"""

import re
from typing import Dict, List, Tuple

# ============================================================
# 1. COMPREHENSIVE MARATHI NUMBERS DICTIONARY (1 TO 100)
# ============================================================
MARATHI_NUMS_1_TO_100: Dict[int, str] = {
    0: 'शून्य', 1: 'एक', 2: 'दोन', 3: 'तीन', 4: 'चार', 5: 'पाच', 6: 'सहा', 7: 'सात', 8: 'आठ', 9: 'नऊ', 10: 'दहा',
    11: 'अकरा', 12: 'बारा', 13: 'तेरा', 14: 'चौदा', 15: 'पंधरा', 16: 'सोळा', 17: 'सतरा', 18: 'अठरा', 19: 'एकोणीस', 20: 'वीस',
    21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस', 26: 'सव्वीस', 27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस', 30: 'तीस',
    31: 'एकतीस', 32: 'बत्तीस', 33: 'तेहेतीस', 34: 'चौतीस', 35: 'पस्तीस', 36: 'छत्तीस', 37: 'सदतीस', 38: 'अडतीस', 39: 'एकेचाळीस', 40: 'चाळीस',
    41: 'एकचाळीस', 42: 'बेचाळीस', 43: 'त्रेचाळीस', 44: 'चव्वेचाळीस', 45: 'पंचेचाळीस', 46: 'शेहेचाळीस', 47: 'सत्तेचाळीस', 48: 'अठ्ठेचाळीस', 49: 'एकोणपन्नास', 50: 'पन्नास',
    51: 'एक्कावन्न', 52: 'बावन्न', 53: 'त्रेपन्न', 54: 'चोपन्न', 55: 'पंचावन्न', 56: 'छप्पन्न', 57: 'सत्तावन्न', 58: 'अठ्ठावन्न', 59: 'एकोणसाठ', 60: 'साठ',
    61: 'एकसष्ठ', 62: 'बासष्ठ', 63: 'त्रेसष्ठ', 64: 'चौसष्ठ', 65: 'पासष्ठ', 66: 'सहासष्ठ', 67: 'सदुसष्ठ', 68: 'अडुसष्ठ', 69: 'एकोणसत्तर', 70: 'सत्तर',
    71: 'एकाहत्तर', 72: 'बाहत्तर', 73: 'त्र्याहत्तर', 74: 'चौऱ्याहत्तर', 75: 'पंच्याहत्तर', 76: 'शहात्तर', 77: 'सत्त्याहत्तर', 78: 'अठ्ठ्याहत्तर', 79: 'एकोणऐंशी', 80: 'ऐंशी',
    81: 'एक्याऐंशी', 82: 'ब्याऐंशी', 83: 'त्र्याऐंशी', 84: 'चौऱ्याऐंशी', 85: 'पंच्याऐंशी', 86: 'शहाऐंशी', 87: 'सत्त्याऐंशी', 88: 'अठ्ठ्याऐंशी', 89: 'एकोणनव्वद', 90: 'नव्वद',
    91: 'एक्याण्णव', 92: 'ब्याण्णव', 93: 'त्र्याण्णव', 94: 'चौऱ्याण्णव', 95: 'पंच्याण्णव', 96: 'शहाण्णव', 97: 'सत्त्याण्णव', 98: 'अठ्ठ्याण्णव', 99: 'नव्व्याण्णव', 100: 'शंभर'
}

HUNDREDS_PREFIX: Dict[int, str] = {
    1: 'एकशे', 2: 'दोनशे', 3: 'तीनशे', 4: 'चारशे', 5: 'पाचशे',
    6: 'सहाशे', 7: 'सातशे', 8: 'आठशे', 9: 'नऊशे'
}

def number_to_marathi_words(num: int) -> str:
    """
    Converts any positive integer (0 to 99,99,99,999) into accurate Marathi words.
    E.g. 7 -> 'सात', 420 -> 'चारशे वीस', 2026 -> 'दोन हजार सव्वीस', 50000 -> 'पन्नास हजार'.
    """
    if num in MARATHI_NUMS_1_TO_100:
        return MARATHI_NUMS_1_TO_100[num]
    
    if num < 0:
        return 'ऋण ' + number_to_marathi_words(abs(num))

    # Hundreds (101 to 999)
    if num < 1000:
        h = num // 100
        rem = num % 100
        prefix = HUNDREDS_PREFIX.get(h, f'{number_to_marathi_words(h)}शे')
        return prefix if rem == 0 else f"{prefix} {number_to_marathi_words(rem)}"

    # Thousands (1,000 to 99,999)
    if num < 100000:
        th = num // 1000
        rem = num % 1000
        th_word = f"{number_to_marathi_words(th)} हजार"
        if rem == 0:
            return th_word
        return f"{th_word} {number_to_marathi_words(rem)}"

    # Lakhs (1,00,000 to 99,99,999)
    if num < 10000000:
        lakh = num // 100000
        rem = num % 100000
        lakh_word = f"{number_to_marathi_words(lakh)} लाख"
        if rem == 0:
            return lakh_word
        return f"{lakh_word} {number_to_marathi_words(rem)}"

    # Crores (1,00,00,000+)
    cr = num // 10000000
    rem = num % 10000000
    cr_word = f"{number_to_marathi_words(cr)} कोटी"
    if rem == 0:
        return cr_word
    return f"{cr_word} {number_to_marathi_words(rem)}"

# ============================================================
# 2. LEGAL MARATHI PRONUNCIATION DICTIONARY
# Maps written legal phrases to exact phonetic speech
# ============================================================
LEGAL_PRONUNCIATION_DICT: List[Tuple[str, str]] = [
    # Land & Revenue
    (r'\b7\s*/\s*12\b|\b७\s*/\s*१२\b|\b7\s*बारा\b|\b७\s*बारा\b', 'सातबारा'),
    (r'\b8\s*[-/]?\s*[Aa]\b|\b८\s*[-/]?\s*[अaA]\b', 'आठ-अ'),
    (r'\b7\s*/\s*12\s*उतारा\b', 'सातबारा उतारा'),
    (r'\bफेरफार\b', 'फेरफार'),
    (r'\bवारस\s*नोंद\b', 'वारस नोंद'),
    (r'\bजमिनीचा\s*मालकी\s*हक्क\b', 'जमिनीचा मालकी हक्क'),
    (r'\bतुकडेबंदी\b', 'तुकडेबंदी'),
    (r'\bगुंठेवारी\b', 'गुंठेवारी'),
    (r'\bनियमितीकरण\b', 'नियमितीकरण'),
    (r'\bखरेदीखत\b', 'खरेदीखत'),
    (r'\bतलाठी\b', 'तलाठी'),
    (r'\bतहसीलदार\b', 'तहसीलदार'),
    (r'\bदस्तऐवज\b', 'दस्तऐवज'),
    (r'\bकुलमुखत्यारपत्र\b', 'कुलमुखत्यारपत्र'),
    (r'\bबक्षीसपत्र\b', 'बक्षीसपत्र'),
    (r'\bहक्कसोडपत्र\b', 'हक्कसोडपत्र'),
    (r'\bअकृषिक\b', 'अकृषिक'),
    (r'\bसक्षम\s*प्राधिकरण\b', 'सक्षम प्राधिकरण'),
    (r'\bलोकसेवा\s*हक्क\s*कायदा\b', 'लोकसेवा हक्क कायदा'),
    (r'\bसिटी\s*सर्व्हे\b|\bCTS\b', 'सिटी सर्व्हे'),
    (r'\bना\s*हरकत\s*प्रमाणपत्र\b|\bNOC\b', 'ना हरकत प्रमाणपत्र एन.ओ.सी.'),

    # Courts & Justice System
    (r'\bSupreme\s+Court\b|\bसुप्रीम\s*कोर्ट\b', 'सर्वोच्च न्यायालय'),
    (r'\bHigh\s+Court\b|\bहायकोर्ट\b|\bहाय\s*कोर्ट\b', 'उच्च न्यायालय'),
    (r'\bDistrict\s+Court\b|\bजिल्हा\s*न्यायालय\b', 'जिल्हा न्यायालय'),
    (r'\bSessions\s+Court\b|\bसत्र\s*न्यायालय\b', 'सत्र न्यायालय'),
    (r'\bन्यायाधीश\b', 'न्यायाधीश'),
    (r'\bन्यायालय\b', 'न्यायालय'),
    (r'\bसंविधान\b', 'संविधान'),
    (r'\bअधिनियम\b', 'अधिनियम'),
    (r'\bजामीन\b', 'जामीन'),
    (r'\bअटकपूर्व\s*जामीन\b', 'अटकपूर्व जामीन'),
    (r'\bअटक\b', 'अटक'),
    (r'\bफौजदारी\b', 'फौजदारी'),
    (r'\bदिवाणी\b', 'दिवाणी'),
    (r'\bदोषारोपपत्र\b|\bचार्जशीट\b', 'दोषारोपपत्र'),
    (r'\bतक्रारदार\b', 'तक्रारदार'),
    (r'\bआरोपी\b', 'आरोपी'),
    (r'\bसमन्स\b', 'समन्स'),
    (r'\bवारंट\b', 'वारंट'),
    (r'\bमनाई\s*हुकूम\b|\bइंजंक्शन\b', 'मनाई हुकूम'),
    (r'\bस्थगिती\s*आदेश\b|\bस्टे\s*ऑर्डर\b', 'स्थगिती आदेश'),
    (r'\bकॅव्हेएट\b', 'कॅव्हेएट अर्ज'),
    (r'\bप्रतिज्ञापत्र\b|\bअ‍ॅफिडेव्हिट\b', 'प्रतिज्ञापत्र'),

    # Brand & Advocate Identity
    (r'\bAdvocate\s+Pratiksha\b|\bAdv\.\s*Pratiksha\b|\bॲडव्होकेट\s*प्रतीक्षा\b', 'ॲडव्होकेट प्रतीक्षा'),
    (r'\bAdvocate\b|\bAdv\.\b', 'ॲडव्होकेट'),
    (r'\bAapla\s+Kayda\b|\bआपला\s*कायदा\b', 'आपला कायदा'),

    # New Criminal Sanhitas 2023 & Old Acts
    (r'\bBNSS\b|\bबीएनएसएस\b|\bबी\.?एन\.?एस\.?एस\.?\b', 'भारतीय नागरिक सुरक्षा संहिता बी.एन.एस.एस.'),
    (r'\bBNS\b|\bबीएनएस\b|\bबी\.?एन\.?एस\.?\b', 'भारतीय न्याय संहिता बी.एन.एस.'),
    (r'\bBSA\b|\bबीएसए\b|\bबी\.?एस\.?ए\.?\b', 'भारतीय साक्ष्य अधिनियम बी.एस.ए.'),
    (r'\bIPC\b|\bआयपीसी\b|\bआय\.?पी\.?सी\.?\b', 'आय.पी.सी. भारतीय दंड विधान'),
    (r'\bCrPC\b|\bसीआरपीसी\b|\bसी\.?आर\.?पी\.?सी\.?\b', 'सी.आर.पी.सी. फौजदारी प्रक्रिया संहिता'),
    (r'\bCPC\b|\bसीपीसी\b|\bसी\.?पी\.?सी\.?\b', 'सी.पी.सी. दिवाणी प्रक्रिया संहिता'),
    (r'\bFIR\b|\bएफआयआर\b|\bएफ\.?आय\.?आर\.?\b', 'एफ.आय.आर. प्रथम माहिती अहवाल'),
    (r'\bRTI\b|\bआरटीआय\b|\bआर\.?टी\.?आय\.?\b', 'माहिती अधिकार आर.टी.आय.'),
    (r'\bRERA\b|\bमहारेरा\b|\bरेरा\b', 'महारेरा'),
    (r'\bMLRC\b|\bएमएलआरसी\b', 'महाराष्ट्र जमीन महसूल संहिता')
]

# Historical Law Years Mapping
YEARS_MAP: Dict[str, str] = {
    '1860': 'अठराशे साठ',
    '1872': 'अठराशे बहात्तर',
    '1882': 'अठराशे ब्याऐंशी',
    '1908': 'एकोणीसशे आठ',
    '1947': 'एकोणीसशे सेहेचाळीस',
    '1950': 'एकोणीसशे पन्नास',
    '1956': 'एकोणीसशे छप्पन्न',
    '1966': 'एकोणीसशे छासष्ट',
    '1973': 'एकोणीसशे त्र्याहत्तर',
    '2000': 'दोन हजार',
    '2001': 'दोन हजार एक',
    '2005': 'दोन हजार पाच',
    '2016': 'दोन हजार सोळा',
    '2020': 'दोन हजार वीस',
    '2021': 'दोन हजार एकवीस',
    '2022': 'दोन हजार बावीस',
    '2023': 'दोन हजार तेवीस',
    '2024': 'दोन हजार चोवीस',
    '2025': 'दोन हजार पंचवीस',
    '2026': 'दोन हजार सव्वीस'
}

MONTHS_MARATHI: Dict[str, str] = {
    'jan': 'जानेवारी', 'feb': 'फेब्रुवारी', 'mar': 'मार्च', 'apr': 'एप्रिल',
    'may': 'मे', 'jun': 'जून', 'jul': 'जुलै', 'aug': 'ऑगस्ट',
    'sep': 'सप्टेंबर', 'oct': 'ऑक्टोबर', 'nov': 'नोव्हेंबर', 'dec': 'डिसेंबर',
    'जानेवारी': 'जानेवारी', 'फेब्रुवारी': 'फेब्रुवारी', 'मार्च': 'मार्च',
    'एप्रिल': 'एप्रिल', 'मे': 'मे', 'जून': 'जून', 'जुलै': 'जुलै',
    'ऑगस्ट': 'ऑगस्ट', 'सप्टेंबर': 'सप्टेंबर', 'ऑक्टोबर': 'ऑक्टोबर',
    'नोव्हेंबर': 'नोव्हेंबर', 'डिसेंबर': 'डिसेंबर'
}

DEVANAGARI_DIGITS = '०१२३४५६७८९'
STANDARD_DIGITS = '0123456789'
D2E_TRANS = str.maketrans(DEVANAGARI_DIGITS, STANDARD_DIGITS)

def normalize_marathi_text(raw_text: str) -> str:
    """
    Main entry point for normalizing Marathi text before passing to Edge-TTS.
    Applies regex substitutions, context-aware number reading, section (कलम)
    expansion, year reading, currency formatting, and phonetics.
    """
    if not raw_text:
        return ""

    s = raw_text

    # 1. Clean emoji artifacts that crash or distort TTS
    s = re.sub(r'[\U00010000-\U0010ffff]', ' ', s)
    s = re.sub(r'[🚨⚠️🏛️⚖️👉🎙️✨🎬📌🎣🔴📢✅❌💯🔹🔸💡⏱️•]', ' ', s)

    # 2. Convert Devanagari numerals to standard digits for uniform matching
    s = s.translate(D2E_TRANS)

    # 3. Land Record: 7/12 (सातबारा) and 7 बारा
    s = re.sub(r'(?:(?<=\s)|^)[7७]\s*[/]\s*(?:12|१२)(?=\s|$|[.,?!])', 'सातबारा', s)
    s = re.sub(r'(?:(?<=\s)|^)[7७]\s*बारा(?=\s|$|[.,?!])', 'सातबारा', s)
    s = re.sub(r'(?:(?<=\s)|^)[8८]\s*[-/]?\s*[Aaअ](?=\s|$|[.,?!])', 'आठ-अ', s)

    # 4. Special Case: Section 498A (अत्यंत महत्त्वाचा कायदेशीर संदर्भ)
    s = re.sub(r'\b498\s*[-]?\s*[Aa]\b|\b४९८\s*[-]?\s*[अaA]\b', 'चारशे अठ्ठ्याण्णव ए', s)

    # 5. Acronyms & Sanhitas (Order matters: BNSS before BNS, negative lookahead)
    s = re.sub(r'\bBNSS\b|\bबीएनएसएस\b|\bबी\.?एन\.?एस\.?एस\.?\b', 'भारतीय नागरिक सुरक्षा संहिता बी.एन.एस.एस.', s, flags=re.I)
    s = re.sub(r'\bBNS\b|\bबीएनएस\b|\bबी\.?एन\.?एस\.?(?![.एस])\b', 'भारतीय न्याय संहिता बी.एन.एस.', s, flags=re.I)
    s = re.sub(r'\bBSA\b|\bबीएसए\b|\bबी\.?एस\.?ए\.?\b', 'भारतीय साक्ष्य अधिनियम बी.एस.ए.', s, flags=re.I)

    # 6. Apply remaining Legal Dictionary terms
    for pattern, replacement in LEGAL_PRONUNCIATION_DICT:
        if 'BNSS' in pattern or 'BNS' in pattern or 'BSA' in pattern or '7' in pattern:
            continue
        s = re.sub(pattern, replacement, s, flags=re.IGNORECASE)

    # 7. Percentages: e.g. 100%, 50%, 10% (Must run before standalone numbers)
    def replace_percent(m):
        n = int(m.group(1))
        return f"{number_to_marathi_words(n)} टक्के"

    s = re.sub(r'\b(\d+)\s*%', replace_percent, s)

    # 6. Currency (₹ and Rs.)
    def replace_currency(m):
        amt_str = m.group(1).replace(',', '')
        try:
            amt = int(amt_str)
            return f"{number_to_marathi_words(amt)} रुपये"
        except ValueError:
            return f"{amt_str} रुपये"

    s = re.sub(r'[₹Rs\.]{1,3}\s*([\d,]+)', replace_currency, s)
    s = re.sub(r'([\d,]+)\s*रुपये', replace_currency, s)

    # 7. Helplines & Emergency Numbers
    s = re.sub(r'\b1930\b', 'एकोणीस तीस सायबर हेल्पलाईन', s)
    s = re.sub(r'\b112\b', 'एक एक दोन', s)
    s = re.sub(r'\b100\b', 'शंभर', s)
    s = re.sub(r'\b1090\b', 'दहा नव्वद', s)
    s = re.sub(r'\b1091\b', 'दहा एक्क्याण्णव', s)
    s = re.sub(r'\b181\b', 'एक आठ एक', s)

    # 8. Section (कलम) Number Expansion
    # Examples: कलम 420 -> कलम चारशे वीस, कलम 318(4) -> कलम तीनशे अठरा उपकलम चार, कलम 175(3) -> कलम एकशे पंच्याहत्तर उपकलम तीन
    def replace_kalam(m):
        raw_sec = m.group(1).strip()
        # Sub-clause: e.g. 318(4) or 175(3)
        sub_m = re.match(r'^(\d+)\((\d+)\)$', raw_sec)
        if sub_m:
            sec_num = int(sub_m.group(1))
            sub_num = int(sub_m.group(2))
            return f"कलम {number_to_marathi_words(sec_num)} उपकलम {number_to_marathi_words(sub_num)}"
        
        # Letter clause: e.g. 41A, 41-A
        sub_l = re.match(r'^(\d+)[-]?([a-zA-Z])$', raw_sec)
        if sub_l:
            sec_num = int(sub_l.group(1))
            letter = sub_l.group(2).upper()
            letter_map = {'A': 'ए', 'B': 'बी', 'C': 'सी', 'D': 'डी'}
            return f"कलम {number_to_marathi_words(sec_num)} {letter_map.get(letter, letter)}"

        # Pure numeric section
        if raw_sec.isdigit():
            val = int(raw_sec)
            return f"कलम {number_to_marathi_words(val)}"
        return f"कलम {raw_sec}"

    s = re.sub(r'कलम\s*(\d+(?:\(\d+\)|[-][a-zA-Z]|[a-zA-Z])?)', replace_kalam, s)

    # 9. Dates: e.g. 31 डिसेंबर 2020, 1 जुलै 2024, 15 ऑगस्ट 1947
    def replace_date(m):
        day = int(m.group(1))
        month = m.group(2)
        year = m.group(3) if m.group(3) else ""
        day_word = number_to_marathi_words(day)
        year_word = f" {YEARS_MAP.get(year, number_to_marathi_words(int(year)))}" if year and year.isdigit() else ""
        return f"{day_word} {month}{year_word}"

    months_regex = r'(जानेवारी|फेब्रुवारी|मार्च|एप्रिल|मे|जून|जुलै|ऑगस्ट|सप्टेंबर|ऑक्टोबर|नोव्हेंबर|डिसेंबर)'
    s = re.sub(rf'\b(\d{{1,2}})\s*{months_regex}(?:\s*(\d{{4}}))?', replace_date, s)

    # 10. Years (standalone 4-digit years)
    for y_k, y_v in YEARS_MAP.items():
        s = re.sub(rf'\b{y_k}\b', y_v, s)

    # 11. Durations & Quantities: e.g. 15 दिवस, 30 दिवस, 24 तास, 2 तास, 3 महिने
    def replace_duration(m):
        n = int(m.group(1))
        unit = m.group(2)
        return f"{number_to_marathi_words(n)} {unit}"

    s = re.sub(r'\b(\d+)\s*(दिवस|दिवसांत|दिवसांच्या|तास|तासांत|महिने|महिन्यांत|वर्षे|वर्षांत|गुंठा|गुंठे)', replace_duration, s)

    # 12. Land Area measurements: e.g. 1000 sq ft, 500 चौ. फूट
    def replace_area(m):
        n = int(m.group(1))
        return f"{number_to_marathi_words(n)} चौरस फूट"

    s = re.sub(r'\b(\d+)\s*(?:sq\s*ft|स्क्वेअर\s*फूट|चौ\.?\s*फूट)', replace_area, s, flags=re.IGNORECASE)

    # 13. Percentages: e.g. 100%, 50%, 10%
    def replace_percent(m):
        n = int(m.group(1))
        return f"{number_to_marathi_words(n)} टक्के"

    s = re.sub(r'\b(\d+)\s*%', replace_percent, s)

    # 14. Remaining Standalone Numbers (1 to 999) in context
    def replace_standalone_num(m):
        val = int(m.group(0))
        return number_to_marathi_words(val)

    # Only replace numbers that are standalone (bounded by spaces/punctuation)
    s = re.sub(r'\b\d{1,3}\b', replace_standalone_num, s)

    # 15. Clean punctuation for natural speech pauses
    s = re.sub(r'[!]+', '.', s)
    s = re.sub(r'[?]+', '?', s)
    s = re.sub(r'[,]+', ',', s)
    s = re.sub(r'\s{2,}', ' ', s)

    return s.strip()

# ============================================================
# 3. VERIFICATION & AUDIT TEST CASES (50 Legal + 30 Numbers)
# ============================================================
LEGAL_TEST_CASES_50 = [
    ("7/12", "सातबारा"),
    ("७/१२", "सातबारा"),
    ("7 बारा", "सातबारा"),
    ("७ बारा", "सातबारा"),
    ("7/12 उतारा", "सातबारा उतारा"),
    ("फेरफार", "फेरफार"),
    ("वारस नोंद", "वारस नोंद"),
    ("जमिनीचा मालकी हक्क", "जमिनीचा मालकी हक्क"),
    ("तुकडेबंदी", "तुकडेबंदी"),
    ("गुंठेवारी", "गुंठेवारी"),
    ("नियमितीकरण", "नियमितीकरण"),
    ("खरेदीखत", "खरेदीखत"),
    ("तलाठी", "तलाठी"),
    ("तहसीलदार", "तहसीलदार"),
    ("दस्तऐवज", "दस्तऐवज"),
    ("कुलमुखत्यारपत्र", "कुलमुखत्यारपत्र"),
    ("बक्षीसपत्र", "बक्षीसपत्र"),
    ("हक्कसोडपत्र", "हक्कसोडपत्र"),
    ("अकृषिक", "अकृषिक"),
    ("सक्षम प्राधिकरण", "सक्षम प्राधिकरण"),
    ("लोकसेवा हक्क कायदा", "लोकसेवा हक्क कायदा"),
    ("Supreme Court", "सर्वोच्च न्यायालय"),
    ("High Court", "उच्च न्यायालय"),
    ("District Court", "जिल्हा न्यायालय"),
    ("Sessions Court", "सत्र न्यायालय"),
    ("न्यायाधीश", "न्यायाधीश"),
    ("न्यायालय", "न्यायालय"),
    ("संविधान", "संविधान"),
    ("अधिनियम", "अधिनियम"),
    ("जामीन", "जामीन"),
    ("अटकपूर्व जामीन", "अटकपूर्व जामीन"),
    ("अटक", "अटक"),
    ("फौजदारी", "फौजदारी"),
    ("दिवाणी", "दिवाणी"),
    ("दोषारोपपत्र", "दोषारोपपत्र"),
    ("तक्रारदार", "तक्रारदार"),
    ("आरोपी", "आरोपी"),
    ("समन्स", "समन्स"),
    ("वारंट", "वारंट"),
    ("मनाई हुकूम", "मनाई हुकूम"),
    ("स्थगिती आदेश", "स्थगिती आदेश"),
    ("कॅव्हेएट", "कॅव्हेएट अर्ज"),
    ("प्रतिज्ञापत्र", "प्रतिज्ञापत्र"),
    ("BNSS", "भारतीय नागरिक सुरक्षा संहिता बी.एन.एस.एस."),
    ("BNS", "भारतीय न्याय संहिता बी.एन.एस."),
    ("BSA", "भारतीय साक्ष्य अधिनियम बी.एस.ए."),
    ("IPC", "आय.पी.सी. भारतीय दंड विधान"),
    ("CrPC", "सी.आर.पी.सी. फौजदारी प्रक्रिया संहिता"),
    ("CPC", "सी.पी.सी. दिवाणी प्रक्रिया संहिता"),
    ("FIR", "एफ.आय.आर. प्रथम माहिती अहवाल")
]

NUMBER_TEST_CASES_30 = [
    ("7/12", "सातबारा"),
    ("2026", "दोन हजार सव्वीस"),
    ("2020", "दोन हजार वीस"),
    ("1966", "एकोणीसशे छासष्ट"),
    ("15 दिवस", "पंधरा दिवस"),
    ("30 दिवस", "तीस दिवस"),
    ("60 दिवस", "साठ दिवस"),
    ("90 दिवस", "नव्वद दिवस"),
    ("2 तास", "दोन तास"),
    ("24 तास", "चोवीस तास"),
    ("498A", "चारशे अठ्ठ्याण्णव ए"),
    ("कलम 420", "कलम चारशे वीस"),
    ("कलम 150", "कलम एकशे पन्नास"),
    ("कलम 318(4)", "कलम तीनशे अठरा उपकलम चार"),
    ("कलम 175(3)", "कलम एकशे पंच्याहत्तर उपकलम तीन"),
    ("कलम 41A", "कलम एकचाळीस ए"),
    ("कलम 138", "कलम एकशे अडतीस"),
    ("₹50,000", "पन्नास हजार रुपये"),
    ("₹5,000", "पाच हजार रुपये"),
    ("₹10,000", "दहा हजार रुपये"),
    ("₹1,00,000", "एक लाख रुपये"),
    ("100%", "शंभर टक्के"),
    ("50%", "पन्नास टक्के"),
    ("10%", "दहा टक्के"),
    ("1 गुंठा", "एक गुंठा"),
    ("2 गुंठे", "दोन गुंठे"),
    ("1000 sq ft", "एक हजार चौरस फूट"),
    ("31 डिसेंबर 2020", "एकतीस डिसेंबर दोन हजार वीस"),
    ("1 जुलै 2024", "एक जुलै दोन हजार चोवीस"),
    ("1930", "एकोणीस तीस सायबर हेल्पलाईन")
]

if __name__ == '__main__':
    print("Testing Marathi Normalizer...")
    for raw, expected in LEGAL_TEST_CASES_50[:5]:
        got = normalize_marathi_text(raw)
        print(f"[{raw}] -> [{got}] (Expected: [{expected}])")
