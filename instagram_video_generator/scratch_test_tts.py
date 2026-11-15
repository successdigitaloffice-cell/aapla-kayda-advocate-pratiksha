# -*- coding: utf-8 -*-
import sys
import os
import re
import asyncio
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

def normalize_marathi_for_speech(text: str) -> str:
    """
    Expands English acronyms, numbers, land terms, and legal sections
    into natural Marathi Devanagari phonetics for flawless TTS pronunciation.
    """
    if not text:
        return ""
        
    s = text

    # 1. Land & Revenue Terms & Abbreviations
    # 7/12 & 8-A
    s = re.sub(r'7\s*/\s*12|७\s*/\s*१२', 'सातबारा', s)
    s = re.sub(r'8\s*[-/]?\s*[Aa]|८\s*[-/]?\s*[अaA]', 'आठ-अ', s)
    s = re.sub(r'\bCTS\b|\bसीटीएस\b', 'सिटी सर्व्हे', s, flags=re.I)
    s = re.sub(r'\bPOA\b|\bपीओए\b', 'पॉवर ऑफ ॲटर्नी', s, flags=re.I)
    s = re.sub(r'\bNOC\b|\bएनओसी\b', 'ना हरकत प्रमाणपत्र', s, flags=re.I)
    s = re.sub(r'\bNA\b|\bN\.A\.|\bएनए\b', 'एन.ए. अकृषिक', s, flags=re.I)
    s = re.sub(r'\bGR\b|\bजीआर\b', 'शासन निर्णय जी.आर.', s, flags=re.I)
    s = re.sub(r'\bSDO\b|\bएसडीओ\b', 'उपविभागीय अधिकारी एस.डी.ओ.', s, flags=re.I)
    s = re.sub(r'\bRTI\b|\bआरटीआय\b', 'माहिती अधिकार', s, flags=re.I)
    s = re.sub(r'\bRERA\b|\bमहारेरा\b|\bरेरा\b', 'महारेरा', s, flags=re.I)

    # 2. Criminal Law & New Sanhitas
    s = re.sub(r'\bBNSS\b|\bबीएनएसएस\b', 'भारतीय नागरिक सुरक्षा संहिता बी.एन.एस.एस.', s, flags=re.I)
    s = re.sub(r'\bBNS\b|\bबीएनएस\b', 'भारतीय न्याय संहिता बी.एन.एस.', s, flags=re.I)
    s = re.sub(r'\bBSA\b|\bबीएसए\b', 'भारतीय साक्ष अधिनियम बी.एस.ए.', s, flags=re.I)
    s = re.sub(r'\bCrPC\b|\bसीआरपीसी\b', 'सी.आर.पी.सी.', s, flags=re.I)
    s = re.sub(r'\bIPC\b|\bआयपीसी\b', 'आय.पी.सी.', s, flags=re.I)
    s = re.sub(r'\bFIR\b|\bएफआयआर\b', 'एफ.आय.आर.', s, flags=re.I)
    s = re.sub(r'\bMLRC\b|\bएमएलआरसी\b', 'महाराष्ट्र जमीन महसूल संहिता', s, flags=re.I)

    # 3. Special Helplines & Numbers
    s = re.sub(r'\b1930\b|\b१९३०\b', 'एकोणीस तीस', s)
    s = re.sub(r'\b112\b|\b११२\b', 'एक एक दोन', s)
    s = re.sub(r'\b100\b|\b१००\b', 'शंभर', s)
    s = re.sub(r'\b1090\b|\b१०९०\b', 'दहा नव्वद', s)
    s = re.sub(r'\b1091\b|\b१०९१\b', 'दहा एक्क्याण्णव', s)

    # 4. Percentages & Units
    s = re.sub(r'100\s*%|१००\s*%', 'शंभर टक्के', s)
    s = re.sub(r'50\s*%|५०\s*%', 'पन्नास टक्के', s)
    s = re.sub(r'(\d+)\s*%', r'\1 टक्के', s)
    s = re.sub(r'(\d+)\s*sq\s*ft|(\d+)\s*स्क्वेअर\s*फूट', r'\1 चौरस फूट', s, flags=re.I)
    s = re.sub(r'(\d+)\s*sq\s*mtr|(\d+)\s*चौ\.?\s*मी\.?', r'\1 चौरस मीटर', s, flags=re.I)

    # 5. Common Range & Quantity Expressions
    s = re.sub(r'1\s*ते\s*3|१\s*ते\s*३', 'एक ते तीन', s)
    s = re.sub(r'1\s*ते\s*2|१\s*ते\s*२', 'एक ते दोन', s)
    s = re.sub(r'2\s*ते\s*3|२\s*ते\s*३', 'दोन ते तीन', s)
    s = re.sub(r'3\s*ते\s*5|३\s*ते\s*५', 'तीन ते पाच', s)
    s = re.sub(r'1\s*गुंठा|१\s*गुंठा', 'एक गुंठा', s)
    s = re.sub(r'2\s*गुंठे|२\s*गुंठे', 'दोन गुंठे', s)
    s = re.sub(r'3\s*गुंठे|३\s*गुंठे', 'तीन गुंठे', s)

    # 6. Specific Historical & Law Years
    s = re.sub(r'\b1882\b|\b१८८२\b', 'अठराशे ब्याऐंशी', s)
    s = re.sub(r'\b1908\b|\b१९०८\b', 'एकोणीसशे आठ', s)
    s = re.sub(r'\b1947\b|\b१९४७\b', 'एकोणीसशे सेहेचाळीस', s)
    s = re.sub(r'\b1956\b|\b१९५६\b', 'एकोणीसशे छप्पन्न', s)
    s = re.sub(r'\b1966\b|\b१९६६\b', 'एकोणीसशे छासष्ट', s)
    s = re.sub(r'\b2000\b|\b२०००\b', 'दोन हजार', s)
    s = re.sub(r'\b2001\b|\b२००१\b', 'दोन हजार एक', s)
    s = re.sub(r'\b2005\b|\b२००५\b', 'दोन हजार पाच', s)
    s = re.sub(r'\b2016\b|\b२०१६\b', 'दोन हजार सोळा', s)
    s = re.sub(r'\b2020\b|\b२०२०\b', 'दोन हजार वीस', s)
    s = re.sub(r'\b2021\b|\b२०२१\b', 'दोन हजार एकवीस', s)
    s = re.sub(r'\b2022\b|\b२०२२\b', 'दोन हजार बावीस', s)
    s = re.sub(r'\b2023\b|\b२०२३\b', 'दोन हजार तेवीस', s)
    s = re.sub(r'\b2024\b|\b२०२४\b', 'दोन हजार चोवीस', s)
    s = re.sub(r'\b2025\b|\b२०२५\b', 'दोन हजार पंचवीस', s)
    s = re.sub(r'\b2026\b|\b२०२६\b', 'दोन हजार सव्वीस', s)

    # 7. Common Sections (कलम)
    section_map = {
        '35': 'पस्तीस', '३५': 'पस्तीस',
        '41A': 'पंचेचाळीस-अ', '४१A': 'पंचेचाळीस-अ',
        '54': 'चोपन्न', '५४': 'चोपन्न',
        '17': 'सतरा', '१७': 'सतरा',
        '6': 'सहा', '६': 'सहा',
        '8': 'आठ', '८': 'आठ',
        '8b': 'आठ-ब', '८ब': 'आठ-ब', '8B': 'आठ-ब',
        '18': 'अठरा', '१८': 'अठरा',
        '138': 'एकशे अडतीस', '१३८': 'एकशे अडतीस',
        '149': 'एकशे एकोणपन्नास', '१४९': 'एकशे एकोणपन्नास',
        '150': 'एकशे पन्नास', '१५०': 'एकशे पन्नास',
        '247': 'दोनशे सत्तेचाळीस', '२४७': 'दोनशे सत्तेचाळीस',
        '318': 'तीनशे अठरा', '३१८': 'तीनशे अठरा',
        '420': 'चारशे वीस', '४२०': 'चारशे वीस',
        '457': 'चारशे सत्तावन्न', '४५७': 'चारशे सत्तावन्न',
        '503': 'पाचशे तीन', '५०३': 'पाचशे तीन'
    }
    for sec_num, sec_mr in section_map.items():
        s = re.sub(rf'\bकलम\s*{sec_num}\b', f'कलम {sec_mr}', s, flags=re.I)

    # 8. English digits to Marathi word mappings for small numbers (0 to 20)
    num_to_mr = {
        '1': 'एक', '१': 'एक',
        '2': 'दोन', '२': 'दोन',
        '3': 'तीन', '३': 'तीन',
        '4': 'चार', '४': 'चार',
        '5': 'पाच', '५': 'पाच',
        '6': 'सहा', '६': 'सहा',
        '7': 'सात', '७': 'सात',
        '8': 'आठ', '८': 'आठ',
        '9': 'नऊ', '९': 'नऊ',
        '10': 'दहा', '१०': 'दहा',
        '15': 'पंधरा', '१५': 'पंधरा',
        '30': 'तीस', '३०': 'तीस',
        '60': 'साठ', '६०': 'साठ',
        '90': 'नव्वद', '९०': 'नव्वद'
    }
    # Match standalone numbers in contexts like "२ तासांत" or "3 महिने" or "15 दिवसांत"
    for n_k, n_v in num_to_mr.items():
        s = re.sub(rf'(?<!\d){n_k}\s*(तास|दिवस|महिने|वर्षे|महिन्या|वर्षां|लाख|हजार)', f'{n_v} \\1', s)

    return s

test_input = "७/१२ वर १ ते ३ गुंठे जमिनीची नोंद तुकडेबंदी कायदा १९४७ आणि BNSS २०२३ कलम ३५ नुसार होते. सायबर फसवणूक झाल्यास १९३० वर पहिल्या २ तासांत कॉल करा. कलम ३१८ अन्वये गुन्हा नोंदवला जातो."
normalized = normalize_marathi_for_speech(test_input)
print("Original  :", test_input)
print("Normalized:", normalized)
