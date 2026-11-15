"""
Pronunciation Test Suite - 50 Legal Terms + 30 Numbers/Dates
Validates normalization and Edge-TTS synthesis for Advocate Pratiksha
"""

import os
import sys
import asyncio
import edge_tts

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

from marathi_normalizer import (
    normalize_marathi_text,
    LEGAL_TEST_CASES_50,
    NUMBER_TEST_CASES_30
)

async def test_single_tts(text: str, voice: str = "mr-IN-AarohiNeural") -> bool:
    try:
        comm = edge_tts.Communicate(text, voice)
        async for chunk in comm.stream():
            pass
        return True
    except Exception as e:
        return False

def run_audit():
    print("=" * 90)
    print("     AAPLA KAYDA - MARATHI LEGAL PRONUNCIATION AUDIT SUITE")
    print("     Advocate Pratiksha - 50 Legal Terms + 30 Numbers/Sections Test")
    print("=" * 90)

    results = []

    # 1. Test 50 Legal Terms
    print("\n[PART A] Testing 50 Legal Terms...")
    legal_passed = 0
    for idx, (orig, exp) in enumerate(LEGAL_TEST_CASES_50, 1):
        norm = normalize_marathi_text(orig)
        # Check match
        matched = (norm.strip() == exp.strip()) or (exp in norm)
        status = "PASS" if matched else "FAIL"
        if matched:
            legal_passed += 1
        results.append({
            "category": "Legal Term",
            "id": f"L-{idx:02d}",
            "original": orig,
            "normalized": norm,
            "expected": exp,
            "status": status
        })

    # 2. Test 30 Numbers / Sections / Dates
    print("[PART B] Testing 30 Numbers, Sections, Dates, Currencies...")
    num_passed = 0
    for idx, (orig, exp) in enumerate(NUMBER_TEST_CASES_30, 1):
        norm = normalize_marathi_text(orig)
        matched = (norm.strip() == exp.strip()) or (exp in norm)
        status = "PASS" if matched else "FAIL"
        if matched:
            num_passed += 1
        results.append({
            "category": "Number/Date",
            "id": f"N-{idx:02d}",
            "original": orig,
            "normalized": norm,
            "expected": exp,
            "status": status
        })

    # Print Formatted Markdown Table
    print("\n" + "-" * 90)
    print(f"{'ID':<6} | {'Original Text':<22} | {'Normalized Text':<35} | {'Status'}")
    print("-" * 90)
    for r in results:
        print(f"{r['id']:<6} | {r['original']:<22} | {r['normalized']:<35} | {r['status']}")

    print("-" * 90)
    print(f"Total Legal Terms Tested: {len(LEGAL_TEST_CASES_50)} | Passed: {legal_passed}/{len(LEGAL_TEST_CASES_50)}")
    print(f"Total Numbers/Dates Tested: {len(NUMBER_TEST_CASES_30)} | Passed: {num_passed}/{len(NUMBER_TEST_CASES_30)}")
    overall_pass = (legal_passed == len(LEGAL_TEST_CASES_50)) and (num_passed == len(NUMBER_TEST_CASES_30))
    print(f"Overall Pronunciation Engine Status: {'100% PASS' if overall_pass else 'ISSUES FOUND'}")
    print("=" * 90)

    # 3. Live TTS Voice Synthesis Test
    print("\n[PART C] Live Edge-TTS Voice Synthesis Test...")
    test_phrase = normalize_marathi_text("7/12 उतारा, कलम 420 आणि 498A अंतर्गत 2026 मधील सर्वोच्च न्यायालय निकाल.")
    print(f"Synthesizing test phrase: '{test_phrase}'")
    out_dir = os.path.join(CURRENT_DIR, "..", "uploads")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "pronunciation_test_out.mp3")

    async def generate_sample():
        comm = edge_tts.Communicate(test_phrase, "mr-IN-AarohiNeural")
        await comm.save(out_file)

    asyncio.run(generate_sample())
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        print(f"✓ Audio file generated successfully: {out_file} ({os.path.getsize(out_file)} bytes)")
    else:
        print("✗ Audio synthesis failed!")

    return results

if __name__ == '__main__':
    run_audit()
