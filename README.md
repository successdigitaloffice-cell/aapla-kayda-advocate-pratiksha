# ⚖️ आपला कायदा – Advocate Pratiksha
### AI Legal Content, Teleprompter & Social Media Growth Agent

> **अधिकृत Instagram ब्रँड:** आपला कायदा – Advocate Pratiksha  
> **मुख्य ध्येय:** 60 दिवसांत 60 उच्च-गुणवत्तेच्या कायदेशीर Reels तयार करणे आणि 1 लाख Instagram Followers च्या लक्ष्याकडे डेटा-आधारित प्रगती करणे.  
> **कायदेशीर अचूकता:** 100% अधिकृत सरकारी कायदे, सर्वोच्च न्यायालय न्यायनिर्णय आणि शासन निर्णयांवर आधारित.

---

## 🏛️ १. सिस्टीमची वैशिष्ट्ये (System Highlights)

1. **दररोजचे Trend Research Engine (Tab 1):**
   - रोज 10 संभाव्य कायदेशीर विषयांचे सखोल संशोधन (Google Trends Maharashtra, Mahabhumi Circulars, Supreme Court Decisions).
   - Top 3 अंतिम निवडलेले विषय आणि #1 आजचा सर्वोत्तम विषय.
   - व्हायरल न वाटणाऱ्या विषयांसाठी विश्वसनीय **Evergreen Legal Guide** लेबलिंग.

2. **Reel Script Generator & Teleprompter (Tab 2):**
   - **Format A (30–40 सेकंद):** ~75–100 शब्द, जलद व थेट माहिती.
   - **Format B (50–60 सेकंद):** ~125–155 शब्द, सविस्तर कायदेशीर बारकावे.
   - **Fullscreen Teleprompter Mode:** Advocate Pratiksha यांच्यासाठी कॅमेऱ्यासमोर थेट वाचण्यासाठी ऑटो-स्क्रोल, मिरर मोड (Beam Splitter Glass), फॉन्ट साईझ आणि स्पीड ऍडजस्टमेंट.
   - 1-क्लिक **Copy Script**, **Copy Caption**, आणि **Copy Hashtags**.

3. **Duplicate Prevention Engine & Published Archive (Tab 3):**
   - शीर्षकाव्यतिरिक्त मुख्य कायदेशीर प्रश्न, वापरलेले कलम, Hook आणि कीवर्ड्सची तुलना.
   - 60 दिवसांचा दृश्यमान रोडमॅप आणि शोधण्यायोग्य अर्काइव्ह.
   - कायमस्वरूपी डेटा जतन (Published Archive मधून कोणतीही नोंद हटवली जात नाही).

4. **Performance Analytics & 100K Follower Tracker (Tab 4):**
   - Views, Reach, Average Watch Time, Likes, Comments, Profile Visits.
   - **Sends/Reach %** आणि **Saves/Reach %** (Instagram Algorithm चा मुख्य आधार).
   - वस्तुनिष्ठ डेटा ट्रॅकिंग (कोणत्याही खोट्या हमीशिवाय प्रत्यक्ष आकडेवारीवर आधारित प्रगती).
   - **Posting Time Optimization:** दुपारी 12:30 PM, संध्याकाळी 07:00 PM, आणि रात्री 08:30 PM चाचणी निष्कर्ष.

5. **Legal Accuracy Engine (Tab 5):**
   - अधिकृत प्राथमिक स्रोत: India Code, Supreme Court, Bhulekh Mahabhumi, IGR Maharashtra, E-Daakhil, Cybercrime Portal (1930).
   - **CrPC/IPC ➡️ BNSS/BNS 2023 संक्रमण तक्ता:** नवीन फौजदारी कायद्यांतील कलमांची अचूक तुलना.
   - Unverified Claims Tracker.

6. **Settings, Persistent Storage & रोजचा Final Report (Tab 6):**
   - **रोजचा 17-Point Final Report Generator:** मास्टर प्रॉम्प्टच्या कलम 16 नुसार संपूर्ण दैनिक अहवाल.
   - **Persistent SQLite Database:** Node.js 24 च्या बिल्ट-इन `node:sqlite` वर आधारित WAL मोड, शून्य बाह्य C++ डिपेंडन्सी.
   - **Automated & Manual Backups:** दर 12 तासांनी स्वयंचलित स्नॅपशॉट आणि 1-क्लिक रिस्टोअर टेस्ट.

---

## 🚀 २. स्थानिक रन करणे (How to Run Locally)

### पद्धत A: 1-Click Windows ऑटो-स्टार्ट (सर्वात सोपे)
फक्त रूट डिरेक्टरीमधील `start-aapla-kayda.bat` वर डबल-क्लिक करा.
- डेटाबेस तपासला जाईल आणि सिस्टीम सुरू होईल.
- सिस्टीम URL: **`http://localhost:5000`**

### पद्धत B: टर्मिनलवरून चालवणे
```bash
# 1. बॅकएंड डिरेक्टरीमध्ये जा
cd backend

# 2. डेटाबेस सीड करा (पहिल्या वेळेस)
node src/db/seed.js

# 3. सर्व्हर सुरू करा
node src/server.js
```
सर्व्हर सुरू झाल्यावर ब्राउझरमध्ये उघडा:
👉 **http://localhost:5000**  
👉 आरोग्य तपासणी: **http://localhost:5000/api/health**

---

## 🌐 ३. VPS / Cloud Hosting वर सुरक्षित HTTPS सह चालवणे (Production Deployment)

### पर्याय १: Docker Compose (शिफारस केलेला मार्ग)
```bash
# कंटेनर तयार करून बॅकग्राउंडमध्ये चालवा
docker compose up -d --build

# कंटेनरचे स्टेटस तपासा
docker compose ps
```

### पर्याय २: PM2 Process Manager
```bash
cd /d/INSTA\ SCRIPT\ AI
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### सुरक्षित Nginx रिव्हर्स प्रॉक्सी आणि मोफत HTTPS (Let's Encrypt SSL)
`/etc/nginx/sites-available/aaplakayda.conf`:
```nginx
server {
    server_name aaplakayda.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
SSL सर्टिफिकेट सक्रिय करा:
```bash
sudo certbot --nginx -d aaplakayda.yourdomain.com
```

---

## 📋 ४. दैनिक कार्यप्रवाह (Daily Workflow for Advocate Pratiksha)

1. **सकाळी 09:00 AM:** **TAB 1 (Today's Trends)** उघडा आणि `Find Today's Trending Topics` वर क्लिक करा.
2. **विषय निवड:** Top 3 पैकी #1 विषयाची किंवा तुमच्या पसंतीच्या विषयाची `स्क्रिप्ट बनवा` वर क्लिक करा.
3. **कायदेशीर पडताळणी:** **TAB 2 (Ready Reels)** मध्ये कलम, कायदा आणि भारत सरकारच्या अधिकृत लिंक्स तपासा.
4. **स्क्रिप्ट मंजुरी:** `Approve Script` वर क्लिक करा (स्थिती *Ready to Record* होईल).
5. **व्हिडिओ रेकॉर्डिंग:** कॅमेरा ऑन करा आणि डॅशबोर्डवरील `Open Teleprompter` बटण दाबा. स्पेसबार दाबून स्पीड आणि फॉन्ट ऍडजस्ट करा आणि थेट वाचून व्हिडिओ रेकॉर्ड करा.
6. **रेकॉर्ड पूर्ण:** `Mark as Recorded` दाबा.
7. **प्रकाशन:** Reel इन्स्टाग्रामवर पोस्ट झाल्यावर `Mark as Published` दाबा. Reel ची लिंक व तारीख टाका.
8. **अहवाल:** **TAB 6** मध्ये जावून `Copy Final Report` द्वारे 17-मुद्द्यांचा दैनिक अहवाल सेव्ह करा!

---

*आपला कायदा – Advocate Pratiksha © 2026. All rights reserved.*
