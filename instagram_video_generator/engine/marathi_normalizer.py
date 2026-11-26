"""
Marathi Text Normalization & Legal Pronunciation Engine
Project: Aapla Kayda - High Accuracy Marathi Speech Engine
Converts complex legal terms, English acronyms, land records (7/12 inflections),
acts (BNSS, BNS, BSA, IPC, CrPC), section numbers (कलमे व उपकलमे), dates,
years, currency (रुपये), durations, ranges, and numbers into 100% natural,
accurate phonetic Devanagari for Edge-TTS and speech synthesis.
"""

import re
from typing import Dict, List, Tuple

# ============================================================
# 1. COMPREHENSIVE MARATHI NUMBERS DICTIONARY (0 TO 100)
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

    # Brand
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
    '1906': 'एकोणीसशे सहा',
    '1908': 'एकोणीसशे आठ',
    '1947': 'एकोणीसशे सेहेचाळीस',
    '1950': 'एकोणीसशे पन्नास',
    '1954': 'एकोणीसशे चोपन्न',
    '1955': 'एकोणीसशे पंचावन्न',
    '1956': 'एकोणीसशे छप्पन्न',
    '1966': 'एकोणीसशे छासष्ट',
    '1973': 'एकोणीसशे त्र्याहत्तर',
    '1981': 'एकोणीसशे एक्क्याऐंशी',
    '2000': 'दोन हजार',
    '2001': 'दोन हजार एक',
    '2005': 'दोन हजार पाच',
    '2011': 'दोन हजार अकरा',
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

def mr_word(pattern_word: str) -> str:
    """Helper to enforce strict Devanagari boundary to prevent prefix/suffix mangling."""
    return r'(?<![\u0900-\u097F])' + pattern_word + r'(?![\u0900-\u097F])'

def mr_stem(stem: str) -> str:
    """Helper for Devanagari prefix boundary while capturing all inflected suffixes."""
    return r'(?<![\u0900-\u097F])' + stem + r'([ा-्\u0900-\u097F]*)'

# ============================================================
# 2.5 MARATHI JODSHABDH & CONJUNCT PHONETIC RULES
# Enhanced articulation for compound words, double consonants,
# halants, deed names, tenures, court titles and inflected forms.
# ============================================================
JODSHABDH_PHONETIC_RULES: List[Tuple[str, str]] = [
    # 1. Court / Legal hierarchy (Longest first)
    (r'प्रथमवर्ग\s*न्यायदंडाधिकारी', 'प्रथम वर्ग न्याय दंडाधिकारी'),
    (r'उपविभागीय\s*दंडाधिकारी', 'उप विभागीय दंडाधिकारी'),
    (r'उपविभागीय\s*अधिकारी', 'उप विभागीय अधिकारी'),
    (r'न्यायदंडाधिकारी', 'न्याय दंडाधिकारी'),
    (r'दंडाधिकारी', 'दंडा धिकारी'),
    (r'न्यायनिवाडा', 'न्याय निवाडा'),
    (r'न्यायप्रविष्ट', 'न्याय प्रविष्ट'),
    (r'लोकन्यायालय', 'लोक न्यायालय'),
    (r'कौटुंबिक\s*न्यायालय', 'कौटुंबिक न्यायालय'),

    # 2. Deeds & Documents (पत्र/नामा)
    (r'कुलमुखत्यारपत्र', 'कुल मुखत्यार पत्र'),
    (r'हक्कसोडपत्र', 'हक्क सोड पत्र'),
    (r'मृत्युपत्र', 'मृत्यू पत्र'),
    (r'बक्षीसपत्र', 'बक्षीस पत्र'),
    (r'वाटपपत्र', 'वाटप पत्र'),
    (r'संमतीपत्र', 'संमती पत्र'),
    (r'शपथपत्र', 'शपथ पत्र'),
    (r'प्रतिज्ञापत्र', 'प्रतिज्ञा पत्र'),
    (r'दोषारोपपत्र', 'दोषारोप पत्र'),
    (r'वारसदारपत्र', 'वारसदार पत्र'),
    (r'प्राधिकारपत्र', 'प्राधिकार पत्र'),
    (r'अधिकारपत्र', 'अधिकार पत्र'),
    (r'आदेशपत्र', 'आदेश पत्र'),
    (r'मागणीपत्र', 'मागणी पत्र'),
    (r'सूचनापत्र', 'सूचना पत्र'),
    (r'हमीपत्र', 'हमी पत्र'),
    (r'प्रशस्तिपत्र', 'प्रशस्ति पत्र'),
    (r'दत्तकपत्र', 'दत्तक पत्र'),
    (r'वाटणीपत्र', 'वाटणी पत्र'),

    # 3. Agreements & Decrees (नामा)
    (r'करारनामा', 'करार नामा'),
    (r'मुखत्यारनामा', 'मुखत्यार नामा'),
    (r'हुकूमनामा', 'हुकूम नामा'),
    (r'राजीनामा', 'राजी नामा'),
    (r'वसीयतनामा', 'वसीयत नामा'),
    (r'जाहीरनामा', 'जाहीर नामा'),
    (r'पंचनामा', 'पंच नामा'),
    (r'भाडेकरार', 'भाडे करार'),

    # 4. Property, Rights & Tenancy
    (r'वारसाहक्क', 'वारसा हक्क'),
    (r'वारसहक्क', 'वारसा हक्क'),
    (r'मालकीहक्क', 'मालकी हक्क'),
    (r'हक्काधिकार', 'हक्क अधिकार'),
    (r'भोगवटादार', 'भोगवटा दार'),
    (r'ताबेदार', 'ताबे दार'),
    (r'खातेदार', 'खाते दार'),
    (r'जमीनदार', 'जमीन दार'),
    (r'सहहिस्सेदार', 'सह हिस्सेदार'),
    (r'हिस्सेदार', 'हिस्से दार'),
    (r'वारसदार', 'वारस दार'),
    (r'भाडेकरू', 'भाडे करू'),
    (r'भाडेकरु', 'भाडे करू'),
    (r'शेतजमीन', 'शेत जमीन'),
    (r'शेतजमिनी', 'शेत जमिनी'),
    (r'पोटहिस्सा', 'पोट हिस्सा'),
    (r'पोटहिश्श्या', 'पोट हिश्श्या'),
    (r'पोटखराबा', 'पोट खराबा'),
    (r'बिनशेती', 'बिन शेती'),
    (r'घरपट्टी', 'घर पट्टी'),
    (r'पाणीपट्टी', 'पाणी पट्टी'),
    (r'कुळकायदा', 'कुळ कायदा'),
    (r'कुळवहिवाट', 'कुळ वहिवाट'),
    (r'नोंदणीकृत', 'नोंदणी कृत'),
    (r'हद्दपार', 'हद्द पार'),

    # 5. Penal & Legal attributes
    (r'अधिकारक्षेत्र', 'अधिकार क्षेत्र'),
    (r'कार्यक्षेत्र', 'कार्य क्षेत्र'),
    (r'अटकपूर्व', 'अटक पूर्व'),
    (r'जामीनपात्र', 'जामीन पात्र'),
    (r'अजामीनपात्र', 'अजामीन पात्र'),
    (r'दखलपात्र', 'दखल पात्र'),
    (r'अदखलपात्र', 'अदखल पात्र'),
    (r'कायदेशीर', 'कायदे शीर'),
    (r'बेकायदेशीर', 'बेकायदे शीर'),
    (r'गैरकायदेशीर', 'गैर कायदेशीर'),
    (r'नियमबाह्य', 'नियम बाह्य'),
    (r'रद्दबातल', 'रद्द बाथल'),
    (r'तक्रारदार', 'तक्रार दार'),
    (r'अर्जदार', 'अर्ज दार'),
    (r'प्रत्युत्तरदार', 'प्रत्युत्तर दार'),
    (r'साक्षीदार', 'साक्षी दार'),
    (r'गुन्हेगार', 'गुन्हे गार'),

    # 6. Local Civic Administration
    (r'ग्रामपंचायत', 'ग्राम पंचायत'),
    (r'नगरपंचायत', 'नगर पंचायत'),
    (r'नगरपरिषद', 'नगर परिषद'),
    (r'जिल्हापरिषद', 'जिल्हा परिषद'),
    (r'पंचायतसमिती', 'पंचायत समिती'),
    (r'महानगरपालिका', 'महानगर पालिका'),
    (r'जिल्हाधिकारी', 'जिल्हा धिकारी'),

    # 7. Family & Social
    (r'स्त्रीधन', 'स्त्री धन'),
    (r'नातेसंबंध', 'नाते संबंध'),
    (r'दत्तक\s*विधान', 'दत्तक विधान'),

    # 8. English / Loanword clusters
    (r'ॲडव्होकेट|अ‍ॅडव्होकेट|एडव्होकेट', 'ॲड व्होकेट'),
    (r'चार्जशीट', 'चार्ज शीट')
]

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
    s = re.sub(r'[🚨⚠️🏛️⚖️👉🎙️✨🎬📌🎣🔴📢✅❌💯🔹🔸💡⏱️•|*#]', ' ', s)

    # 2. Convert Devanagari numerals to standard digits for uniform matching
    s = s.translate(D2E_TRANS)

    # 3. Clean rhythm breaks (em-dash, multiple exclamation/question marks) for natural breathing pauses
    s = re.sub(r'—|–|[-]{2,}', ', ', s)
    s = re.sub(r'[;:]+', ', ', s)

    # 4. SATBARA INFLECTION (विभक्ती आणि सामान्यरूप): Crucial for 100% natural native Marathi speech!
    satbara_pattern = r'(?:(?<!\d)[7७]\s*[/]\s*(?:12|१२)|(?<![\u0900-\u097F])[7७]\s*बारा)'
    s = re.sub(satbara_pattern + r'\s*वरील', 'सातबाऱ्यावरील', s)
    s = re.sub(satbara_pattern + r'\s*वरून', 'सातबाऱ्यावरून', s)
    s = re.sub(satbara_pattern + r'\s*वर', 'सातबाऱ्यावर', s)
    s = re.sub(satbara_pattern + r'\s*च्या', 'सातबाऱ्याच्या', s)
    s = re.sub(satbara_pattern + r'\s*चा', 'सातबाऱ्याचा', s)
    s = re.sub(satbara_pattern + r'\s*ची', 'सातबाऱ्याची', s)
    s = re.sub(satbara_pattern + r'\s*चे', 'सातबाऱ्याचे', s)
    s = re.sub(satbara_pattern + r'\s*ला', 'सातबाऱ्याला', s)
    s = re.sub(satbara_pattern + r'\s*त', 'सातबाऱ्यात', s)
    s = re.sub(satbara_pattern + r'\s*उतारा', 'सातबारा उतारा', s)
    s = re.sub(satbara_pattern, 'सातबारा', s)

    # 8-A inflections
    s = re.sub(r'\b8\s*[-/]?\s*[Aaअ]\s*वरील', 'आठ-अ वरील', s)
    s = re.sub(r'\b8\s*[-/]?\s*[Aaअ]\s*वर', 'आठ-अ वर', s)
    s = re.sub(r'\b8\s*[-/]?\s*[Aaअ]\b', 'आठ-अ', s)

    # 5. MUNICIPAL & ADMINISTRATIVE ABBREVIATIONS (Longer matched first with Devanagari boundary)
    s = re.sub(mr_word('मनपाची'), 'महापालिकेची', s)
    s = re.sub(mr_word('मनपाने'), 'महापालिकेने', s)
    s = re.sub(mr_word('मनपाकडे'), 'महापालिकेकडे', s)
    s = re.sub(mr_word('मनपाला'), 'महापालिकेला', s)
    s = re.sub(mr_word('मनपात'), 'महापालिकेत', s)
    s = re.sub(mr_word('मनपा'), 'महापालिका', s)

    s = re.sub(mr_word('नपाची'), 'नगरपालिकेची', s)
    s = re.sub(mr_word('नपाने'), 'नगरपालिकेने', s)
    s = re.sub(mr_word('नपाकडे'), 'नगरपालिकेकडे', s)
    s = re.sub(mr_word('नपाला'), 'नगरपालिकेला', s)
    s = re.sub(mr_word('नपात'), 'नगरपालिकेत', s)
    s = re.sub(mr_word('नपा'), 'नगरपालिका', s)

    s = re.sub(mr_word(r'जि\.?प\.?'), 'जिल्हा परिषद', s)
    s = re.sub(mr_word(r'पं\.?स\.?'), 'पंचायत समिती', s)
    s = re.sub(mr_word(r'ग्रा\.?पं\.?'), 'ग्रामपंचायत', s)

    # Officers and departments
    s = re.sub(r'(\bउपअधीक्षक\s*भूमी\s*अभिलेख[^\(\n]{0,35})\(\s*DySLR\s*\)', r'\1(डी.वाय.एस.एल.आर.)', s, flags=re.I)
    s = re.sub(r'\bDySLR\b|\bडीवायएसएलआर\b', 'उपअधीक्षक भूमी अभिलेख डी.वाय.एस.एल.आर.', s, flags=re.I)
    s = re.sub(r'\bSLR\b', 'अधीक्षक भूमी अभिलेख', s, flags=re.I)
    s = re.sub(r'\bSDO\b|\bएसडीओ\b', 'उपविभागीय अधिकारी एस.डी.ओ.', s, flags=re.I)
    s = re.sub(r'\bPMRDA\b|\bपीएमआरडीए\b', 'पी.एम.आर.डी.ए.', s, flags=re.I)
    s = re.sub(r'\bCIDCO\b|\bसिडको\b', 'सिडको', s, flags=re.I)
    s = re.sub(r'\bMHADA\b|\bम्हाडा\b', 'म्हाडा', s, flags=re.I)
    s = re.sub(r'\bIGR\b|\bआयजीआर\b', 'नोंदणी व मुद्रांक विभाग आय.जी.आर.', s, flags=re.I)
    s = re.sub(r'\bRTS\b|\bआर\.?टी\.?एस\.?\b', 'लोकसेवा हक्क कायदा आर.टी.एस.', s, flags=re.I)
    s = re.sub(r'\bCTS\b|\bसीटीएस\b', 'नगर भूमापन क्रमांक सी.टी.एस.', s, flags=re.I)
    s = re.sub(r'\bETS\b', 'ई.टी.एस. मोजणी यंत्र', s, flags=re.I)

    # Land Tenures & Status
    s = re.sub(r'\bDeemed\s+NA\b|\bडीम्ड\s*एनए\b', 'डीम्ड अकृषिक एन.ए.', s, flags=re.I)
    s = re.sub(r'\bNA\b|\bN\.A\.\b|\bएनए\b', 'अकृषिक एन.ए.', s, flags=re.I)
    s = re.sub(r'\bवर्ग\s*2\b|\bवर्ग\s*२\b', 'वर्ग दोन', s)
    s = re.sub(r'\bवर्ग\s*1\b|\bवर्ग\s*१\b', 'वर्ग एक', s)
    s = re.sub(r'\bभोगवटादार\s*वर्ग\s*दोन\b', 'भोगवटादार वर्ग दोन', s)
    s = re.sub(r'\bIndex\s*2\b|\bइंडेक्स\s*2\b|\bइंडेक्स\s*२\b', 'इंडेक्स दोन', s, flags=re.I)
    s = re.sub(r'\bPOA\b|\bपीओए\b', 'कुलमुखत्यारपत्र पॉवर ऑफ ॲटर्नी', s, flags=re.I)
    s = re.sub(r'\bGPA\b', 'कुलमुखत्यारपत्र जी.पी.ए.', s, flags=re.I)
    s = re.sub(r'\bPower\s+of\s+Attorney\b', 'कुलमुखत्यारपत्र पॉवर ऑफ ॲटर्नी', s, flags=re.I)
    s = re.sub(r'\bSearch\s+Report\b', 'सर्च रिपोर्ट', s, flags=re.I)
    s = re.sub(r'\bTitle\s+Clear(?:ance)?\b', 'टायटल क्लिअर दाखला', s, flags=re.I)

    # 6. DUPLICATE PREVENTION FOR SANHITAS & HELPLINES
    s = re.sub(r'(\bभारतीय\s*नागरिक\s*सुरक्षा\s*संहिता[^\(\n]{0,35})\(\s*BNSS\s*\)', r'\1(बी.एन.एस.एस.)', s, flags=re.I)
    s = re.sub(r'(\bभारतीय\s*नागरिक\s*सुरक्षा\s*संहिता[^\(\n]{0,35})\bBNSS\b', r'\1 बी.एन.एस.एस.', s, flags=re.I)
    s = re.sub(r'\bBNSS\b|\bबीएनएसएस\b', 'भारतीय नागरिक सुरक्षा संहिता बी.एन.एस.एस.', s, flags=re.I)

    s = re.sub(r'(\bभारतीय\s*न्याय\s*संहिता[^\(\n]{0,35})\(\s*BNS\s*\)', r'\1(बी.एन.एस.)', s, flags=re.I)
    s = re.sub(r'(\bभारतीय\s*न्याय\s*संहिता[^\(\n]{0,35})\bBNS\b', r'\1 बी.एन.एस.', s, flags=re.I)
    s = re.sub(r'\bBNS\b|\bबीएनएस\b', 'भारतीय न्याय संहिता बी.एन.एस.', s, flags=re.I)

    s = re.sub(r'(\bभारतीय\s*साक्ष्य\s*अधिनियम[^\(\n]{0,35})\(\s*BSA\s*\)', r'\1(बी.एस.ए.)', s, flags=re.I)
    s = re.sub(r'(\bभारतीय\s*साक्ष्य\s*अधिनियम[^\(\n]{0,35})\bBSA\b', r'\1 बी.एस.ए.', s, flags=re.I)
    s = re.sub(r'\bBSA\b|\bबीएसए\b', 'भारतीय साक्ष्य अधिनियम बी.एस.ए.', s, flags=re.I)

    # Percentages: Run before helplines/standalone numbers to avoid 100% matching 100
    def replace_percent(m):
        n = int(m.group(1))
        return f"{number_to_marathi_words(n)} टक्के"

    s = re.sub(r'\b(\d+)\s*%', replace_percent, s)

    # Helplines: Avoid "हेल्पलाइन एकोणीस तीस सायबर हेल्पलाइन"
    s = re.sub(r'(\bसायबर\s*हेल्पला)[ईइ](न[^\d\n]{0,20})1930', r'\1ई\2क्रमांक एकोणीस तीस', s)
    s = re.sub(r'\b1930\b', 'राष्ट्रीय सायबर हेल्पलाईन क्रमांक एकोणीस तीस', s)
    s = re.sub(r'\b112\b', 'एक एक दोन', s)
    s = re.sub(r'\b100\b(?!\s*%)', 'शंभर', s)
    s = re.sub(r'\b1090\b', 'दहा नव्वद', s)
    s = re.sub(r'\b1091\b', 'दहा एक्क्याण्णव', s)
    s = re.sub(r'\b181\b', 'एक आठ एक', s)

    # 7. SPECIAL CASE: Section 498A
    s = re.sub(r'\b498\s*[-]?\s*[Aaअ]\b', 'चारशे अठ्ठ्याण्णव ए', s)

    # 8. SECTION (कलम) NUMBER & SUB-CLAUSE EXPANSION
    # Sub-clause: e.g. कलम 175(3), कलम 318(4), कलम 5(2), कलम 19(8)
    def replace_sub_kalam(m):
        sec = int(m.group(1))
        sub = int(m.group(2))
        return f"कलम {number_to_marathi_words(sec)} उपकलम {number_to_marathi_words(sub)}"

    s = re.sub(r'कलम\s*(\d+)\s*\(\s*(\d+)\s*\)', replace_sub_kalam, s)

    # Letter section: e.g. कलम 8-ब, कलम 8B, कलम 41A, कलम 66D
    def replace_letter_kalam(m):
        sec = int(m.group(1))
        letter = m.group(2).upper()
        letter_map = {'A': 'ए', 'B': 'बी', 'C': 'सी', 'D': 'डी', 'F': 'एफ', 'ब': 'ब', 'अ': 'अ', 'क': 'क', 'ड': 'ड'}
        return f"कलम {number_to_marathi_words(sec)} {letter_map.get(letter, letter)}"

    s = re.sub(r'कलम\s*(\d+)\s*[-]?\s*([a-zA-Zबअकड])\b', replace_letter_kalam, s)
    s = re.sub(r'कलम\s*(\d+)\s*\(\s*([a-zA-Z])\s*\)', lambda m: f"कलम {number_to_marathi_words(int(m.group(1)))} उपकलम {m.group(2).upper()}", s)

    # Pure numeric section: e.g. कलम 420, कलम 138, कलम 35
    def replace_plain_kalam(m):
        sec = int(m.group(1))
        return f"कलम {number_to_marathi_words(sec)}"

    s = re.sub(r'कलम\s*(\d+)\b', replace_plain_kalam, s)

    # 9. STEPS & ORDINALS (उदा. पायरी १, पायरी २, फॉर्म १६)
    s = re.sub(r'\bपायरी\s*(\d+)', lambda m: f"पायरी क्रमांक {number_to_marathi_words(int(m.group(1)))}", s)
    s = re.sub(r'\bफॉर्म\s*(\d+)', lambda m: f"फॉर्म क्रमांक {number_to_marathi_words(int(m.group(1)))}", s)

    # 10. NUMBER RANGES: e.g. 1 ते 2 गुंठे, 1 ते 3 गुंठे, 1 ते 2 तास, 15 ते 30 दिवस
    def replace_range(m):
        n1 = int(m.group(1))
        n2 = int(m.group(2))
        unit = m.group(3)
        return f"{number_to_marathi_words(n1)} ते {number_to_marathi_words(n2)} {unit}"

    range_units = r'(गुंठे|गुंठा|एकर|दिवस|दिवसांत|दिवसांच्या|तास|तासांत|महिने|महिन्यांत|वर्षे|वर्षांत|लाख|हजार|टक्के|रुपये)'
    s = re.sub(rf'\b(\d+)\s*(?:ते|-)\s*(\d+)\s*{range_units}', replace_range, s)

    # 11. PERCENTAGES & CURRENCIES
    def replace_percent(m):
        n = int(m.group(1))
        return f"{number_to_marathi_words(n)} टक्के"

    s = re.sub(r'\b(\d+)\s*%', replace_percent, s)

    def replace_currency(m):
        amt_str = m.group(1).replace(',', '')
        try:
            amt = int(amt_str)
            return f"{number_to_marathi_words(amt)} रुपये"
        except ValueError:
            return f"{amt_str} रुपये"

    s = re.sub(r'[₹Rs\.]{1,3}\s*([\d,]+)', replace_currency, s)
    s = re.sub(r'([\d,]+)\s*रुपये', replace_currency, s)

    # 12. DATES & YEARS
    def replace_date(m):
        day = int(m.group(1))
        month = m.group(2)
        year = m.group(3) if m.group(3) else ""
        day_word = number_to_marathi_words(day)
        year_word = f" {YEARS_MAP.get(year, number_to_marathi_words(int(year)))}" if year and year.isdigit() else ""
        return f"{day_word} {month}{year_word}"

    months_regex = r'(जानेवारी|फेब्रुवारी|मार्च|एप्रिल|मे|जून|जुलै|ऑगस्ट|सप्टेंबर|ऑक्टोबर|नोव्हेंबर|डिसेंबर)'
    s = re.sub(rf'\b(\d{{1,2}})\s*{months_regex}(?:\s*(\d{{4}}))?', replace_date, s)

    # 4-digit years
    for y_k, y_v in YEARS_MAP.items():
        s = re.sub(rf'\b{y_k}\b', y_v, s)

    # 13. QUANTITIES & MEASUREMENTS (उदा. १५ दिवसांची, ६० दिवसांत, २ वर्षांपर्यंत, ७ वर्षांपेक्षा)
    def replace_quantities(m):
        n = int(m.group(1))
        unit = m.group(2)
        return f"{number_to_marathi_words(n)} {unit}"

    quantity_words = r'(दिवस|दिवसांत|दिवसांच्या|दिवसांची|तास|तासांत|महिने|महिन्यांत|वर्षे|वर्षांत|वर्षांचा|वर्षांचे|वर्षांपर्यंत|वर्षांखालील|वर्षांपेक्षा|गुंठा|गुंठे|एकर|तोळे|पट|रुपये|साक्षीदार|साक्षीदारांसह|साक्षीदारांच्या|पायऱ्या|पायऱ्यांचा|कागदपत्रे|अधिकार|नियम|मुद्दे)'
    s = re.sub(rf'\b(\d+)\s*{quantity_words}', replace_quantities, s)
    s = re.sub(r'\b(\d+)\s*(?:sq\s*ft|स्क्वेअर\s*फूट|चौ\.?\s*फूट)', lambda m: f"{number_to_marathi_words(int(m.group(1)))} चौरस फूट", s, flags=re.I)
    s = re.sub(r'\b(\d+)\s*(?:चौ\.?\s*मीटर|चौरस\s*मीटर)', lambda m: f"{number_to_marathi_words(int(m.group(1)))} चौरस मीटर", s, flags=re.I)

    # 14. ENGLISH LOANWORDS PHONETIC POLISHING
    s = re.sub(r'\b\(Golden\s+Hour\)', '(गोल्डन अवर म्हणजेच पहिल्या एका तासात)', s, flags=re.I)
    s = re.sub(r'\bGolden\s+Hour\b', 'गोल्डन अवर म्हणजेच पहिला एक तास', s, flags=re.I)
    s = re.sub(r'\bDemolition\b|\bडिमोलिशन\b|\bडिमॉलिशन\b', 'पाडकाम डिमॉलिशन', s, flags=re.I)
    s = re.sub(r'\bCompounding\b|\bकम्पाउंडिंग\b', 'कंपाउंडिंग', s, flags=re.I)
    s = re.sub(r'\bRegularization\b|\bरेग्युलरायझेशन\b', 'नियमितीकरण', s, flags=re.I)
    s = re.sub(r'\bCheque\s*Bounce\b|\bचेक\s*बाऊन्स\b|\bचेक\s*बाउन्स\b', 'धनादेश बाऊन्स', s, flags=re.I)
    s = re.sub(r'\bCyber\s*Fraud\b|\bसायबर\s*फ्रॉड\b', 'सायबर फसवणूक', s, flags=re.I)
    s = re.sub(r'\bFreeze\b|\bफ्रीज\s*करा\b', 'तात्काळ फ्रीज करा', s, flags=re.I)
    s = re.sub(r'\bNotice\b|\bनोटीस\b', 'नोटीस', s, flags=re.I)
    s = re.sub(r'\bNI\s+Act\b|\bएनआय\s*ॲक्ट\b|\bएन\.?आय\.?\s*ॲक्ट\b', 'निगोशिएबल इन्स्ट्रुमेंट्स ॲक्ट धनादेश कायदा', s, flags=re.I)

    # 15. APPLY LEGAL DICTIONARY
    for pattern, replacement in LEGAL_PRONUNCIATION_DICT:
        if any(k in pattern for k in ['BNSS', 'BNS', 'BSA', '7', '8']):
            continue
        s = re.sub(pattern, replacement, s, flags=re.IGNORECASE)

    # 16. REMAINING STANDALONE NUMBERS (1 to 999)
    s = re.sub(r'\b\d{1,3}\b', lambda m: number_to_marathi_words(int(m.group(0))), s)

    # 17. SANSKRIT/MARATHI COMPOUND WORDS & JODSHABDH PHONETIC CLARITY
    for pat, repl in JODSHABDH_PHONETIC_RULES:
        s = re.sub(mr_stem(pat), repl + r'\1', s)

    # 18. CLEAN PUNCTUATION FOR NATURAL BREATH PAUSES
    s = re.sub(r'[!]+', '! ', s)
    s = re.sub(r'[?]+', '? ', s)
    s = re.sub(r'[,]+', ', ', s)
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
    ("कुलमुखत्यारपत्र", "कुल मुखत्यार पत्र"),
    ("बक्षीसपत्र", "बक्षीस पत्र"),
    ("हक्कसोडपत्र", "हक्क सोड पत्र"),
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
    ("अटकपूर्व जामीन", "अटक पूर्व जामीन"),
    ("अटक", "अटक"),
    ("फौजदारी", "फौजदारी"),
    ("दिवाणी", "दिवाणी"),
    ("दोषारोपपत्र", "दोषारोप पत्र"),
    ("तक्रारदार", "तक्रार दार"),
    ("आरोपी", "आरोपी"),
    ("समन्स", "समन्स"),
    ("वारंट", "वारंट"),
    ("मनाई हुकूम", "मनाई हुकूम"),
    ("स्थगिती आदेश", "स्थगिती आदेश"),
    ("कॅव्हेएट", "कॅव्हेएट अर्ज"),
    ("प्रतिज्ञापत्र", "प्रतिज्ञा पत्र"),
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
    ("1930", "राष्ट्रीय सायबर हेल्पलाईन क्रमांक एकोणीस तीस")
]

JODSHABDH_TEST_CASES_40 = [
    ("हक्कसोडपत्र", "हक्क सोड पत्र"),
    ("हक्कसोडपत्राची", "हक्क सोड पत्राची"),
    ("मृत्युपत्र", "मृत्यू पत्र"),
    ("मृत्युपत्रात", "मृत्यू पत्रात"),
    ("वारसाहक्क", "वारसा हक्क"),
    ("वारसाहक्काने", "वारसा हक्काने"),
    ("मालकीहक्क", "मालकी हक्क"),
    ("कुलमुखत्यारपत्र", "कुल मुखत्यार पत्र"),
    ("बक्षीसपत्र", "बक्षीस पत्र"),
    ("वाटपपत्र", "वाटप पत्र"),
    ("संमतीपत्र", "संमती पत्र"),
    ("शपथपत्र", "शपथ पत्र"),
    ("प्रतिज्ञापत्र", "प्रतिज्ञा पत्र"),
    ("दोषारोपपत्र", "दोषारोप पत्र"),
    ("करारनामा", "करार नामा"),
    ("हुकूमनामा", "हुकूम नामा"),
    ("राजीनामा", "राजी नामा"),
    ("पंचनामा", "पंच नामा"),
    ("भोगवटादार", "भोगवटा दार"),
    ("शेतजमीन", "शेत जमीन"),
    ("शेतजमिनीचा", "शेत जमिनीचा"),
    ("पोटहिस्सा", "पोट हिस्सा"),
    ("पोटखराबा", "पोट खराबा"),
    ("बिनशेती", "बिन शेती"),
    ("घरपट्टी", "घर पट्टी"),
    ("पाणीपट्टी", "पाणी पट्टी"),
    ("कुळकायदा", "कुळ कायदा"),
    ("कुळवहिवाट", "कुळ वहिवाट"),
    ("अधिकारक्षेत्र", "अधिकार क्षेत्र"),
    ("जामीनपात्र", "जामीन पात्र"),
    ("अजामीनपात्र", "अजामीन पात्र"),
    ("दखलपात्र", "दखल पात्र"),
    ("अदखलपात्र", "अदखल पात्र"),
    ("ग्रामपंचायत", "ग्राम पंचायत"),
    ("जिल्हापरिषद", "जिल्हा परिषद"),
    ("पंचायतसमिती", "पंचायत समिती"),
    ("महानगरपालिका", "महानगर पालिका"),
    ("ॲडव्होकेट", "ॲड व्होकेट"),
    ("स्त्रीधन", "स्त्री धन"),
    ("रद्दबातल", "रद्द बाथल")
]

if __name__ == '__main__':
    print("Testing Marathi Normalizer...")
    for raw, expected in LEGAL_TEST_CASES_50[:5]:
        got = normalize_marathi_text(raw)
        print(f"[{raw}] -> [{got}] (Expected: [{expected}])")
