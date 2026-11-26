import urllib.request
import urllib.parse
import re

url = 'https://successdigitaloffice-cell.github.io/aapla-kayda-advocate-pratiksha/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='replace')
    print("Full HTML length:", len(html))
    print(html)
    scripts = re.findall(r'src=["\']([^"\']+)["\']', html)
    links = re.findall(r'href=["\']([^"\']+)["\']', html)
    print("\nScripts:", scripts)
    print("Links:", links)

    for s in scripts:
        full_s = urllib.parse.urljoin(url, s)
        try:
            with urllib.request.urlopen(full_s, timeout=10) as s_resp:
                b = s_resp.read()
                print(f"FETCH OK: {full_s} ({len(b)} bytes)")
        except Exception as e:
            print(f"FETCH FAILED: {full_s} -> {e}")
