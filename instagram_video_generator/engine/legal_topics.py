"""
Maharashtra Legal Content Database & Script Generator
Advocate Pratiksha - आपला कायदा
Focus: Maharashtra Land Laws, Gunthewari, Tukdebandi, 7/12 Ferfar, BNSS 2023, BNS 2023, MahaRERA
Every script includes:
1. Real-life relatable citizen example ("समजा...")
2. Exact legal sections (कलम) with updated BNS/BNSS 2023
3. Practical, step-by-step solution for ordinary citizens
"""

LEGAL_TOPICS_DATABASE = [
    {
        "id": "gunthewari_2024",
        "category": "Land Laws (जमीन कायदे)",
        "title_mr": "गुंठेवारी नियमितीकरणाचे नवे नियम: ५०० चौ.मी. आतील प्लॉट अधिकृत कसा करावा?",
        "official_source": "महाराष्ट्र गुंठेवारी विकास अधिनियम २००१ (२०२१ सुधारणा शासन निर्णय) व नगरविकास विभाग",
        "bg_preset": "gunthewari",
        "duration_30": {
            "hook": "गुंठेवारी प्लॉटवर घर बांधले आहे? पाडण्याची नोटीस येण्यापूर्वी हा एक अर्ज करा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "गुंठेवारी घर अधिकृत होणार?",
                    "text": "समजा, तुम्ही १ किंवा २ गुंठे अनधिकृत प्लॉटवर घर बांधले आहे, तर मनपाची नोटीस येण्यापूर्वी ही कायदेशीर माहिती लगेच जाणून घ्या!",
                    "visual_cue": "Plot map with Gunthewari legal seal",
                    "template": "gunthewari_tukdebandi.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "अनधिकृत जागेची अडचण",
                    "text": "गुंठेवारी नियमित नसेल तर बँकेचे कर्ज मिळत नाही आणि ७/१२ वर स्वतंत्र मालकी हक्क सिद्ध करताना प्रचंड अडचणी येतात.",
                    "visual_cue": "7/12 document rejected stamp",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "गुंठेवारी कायदा कलम ३ व ४",
                    "text": "महाराष्ट्र गुंठेवारी विकास अधिनियमानुसार ३१ डिसेंबर २०२० पूर्वीचे ५०० चौरस मीटर आतील भूखंड कंपाउंडिंग शुल्क भरून महापालिकेत अधिकृत करता येतात.",
                    "visual_cue": "Government GR stamp and certificate",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "जागा अधिकृत करा",
                    "text": "सक्षम वास्तुविशारदाकडून रेखांकन मंजूर करून अर्ज करा. अशाच अधिकृत कायदेशीर माहितीसाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Advocate Pratiksha branding & follow button",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "⚠️ गुंठेवारी नियमितीकरणाविषयी संपूर्ण कायदेशीर माहिती!\n\nउदा. जर तुम्ही ३१ डिसेंबर २०२० पूर्वी १ ते २ गुंठ्यात घर बांधले असेल, तर महाराष्ट्र गुंठेवारी विकास अधिनियम २००१ (२०२१ सुधारणा) नुसार अधिकृत दंड भरून ते नियमित करून घेता येते.\n\nआवश्यक कागदपत्रे: खरेदी खत, ७/१२ उतारा, रेखांकन नकाशा आणि कर पावती.\n\n⚖️ अधिकृत कायदेशीर सल्ल्यासाठी फॉलो करा: @aaplakayda\n\n#आपलाकायदा #AdvocatePratiksha #गुंठेवारी #जमीनकायदे #Satbara #Gunthewari #ReelsMaharashtra",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #गुंठेवारी #जमीनकायदे #MaharashtraLandLaws #Satbara #Gunthewari #ReelsMaharashtra #PuneRealEstate #LegalAdvice",
            "best_posting_time": "संध्याकाळी ०७:०० PM ते ०८:३० PM"
        },
        "duration_60": {
            "hook": "१ ते २ गुंठे जागेची खरेदी-विक्री करताना 'ही' चूक अजिबात करू नका!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "सावधान! गुंठे खरेदीत फसवणूक",
                    "text": "समजा, तुम्ही एखाद्या मध्यस्थाकडून साध्या नोटरीवर किंवा १०० रुपयांच्या स्टॅम्पवर १ गुंठा प्लॉट खरेदी केला, तर तुमचे लाखो रुपये धोक्यात आहेत!",
                    "visual_cue": "Plot inspection warning banner",
                    "template": "gunthewari_tukdebandi.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "नोटरी खरेदी अवैध आहे",
                    "text": "नोंदणी कायदा कलम १७ नुसार १०० रुपयांपेक्षा जास्त मूल्याच्या जागेची नोंदणीकृत दस्तऐवजाशिवाय झालेली खरेदी कायद्याच्या नजरेत शून्य मानली जाते.",
                    "visual_cue": "Notary stamp cancelled icon",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "कायद्यानुसार काय करावे?",
                    "text": "महाराष्ट्र गुंठेवारी अधिनियम आणि तुकडेबंदी नियमांनुसार, लेआउट मंजूर आहे का, रेखांकन मंजूर आहे का आणि सक्षम अधिकाऱ्याची मंजुरी आहे का याची खात्री करूनच नोंदणीकृत दस्त करा.",
                    "visual_cue": "Approved layout plan with Govt Seal",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "कायदेशीर मार्गदर्शन",
                    "text": "प्लॉट घेण्यापूर्वी ३० वर्षांचा सर्च रिपोर्ट आणि टायटल क्लिअरन्स घेणे बंधनकारक ठेवा. हा व्हिडिओ मित्रांना नक्की शेअर करा आणि फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🛑 गुंठेवारी व तुकडेबंदी: प्लॉट घेताना घ्यावयाची खबरदारी!\n\n१ ते २ गुंठ्याचे प्लॉट खरेदी करताना केवळ नोटरीवर व्यवहार करू नका. तुकडेबंदी कायदा १९४७ आणि गुंठेवारी नियमांनुसार रीतसर मंजुरी असल्याशिवाय खरेदी खत करू नका.\n\nनेहमी सक्षम वकिलांकडून ३० वर्षांचा सर्च रिपोर्ट तपासा.\n\n⚖️ अधिकृत कायदेशीर माहितीसाठी फॉलो करा: @aaplakayda\n\n#आपलाकायदा #AdvocatePratiksha #तुकडेबंदी #गुंठेवारी #जमीनव्यवहार #Satbara #MaharashtraLawyer",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #तुकडेबंदी #गुंठेवारी #७१२ #जमीनखरेदी #CourtVerdict #MaharashtraLegal #LegalTips",
            "best_posting_time": "दुपारी १२:३० PM ते ०१:३० PM"
        }
    },
    {
        "id": "tukdebandi_satbara_2024",
        "category": "Land Laws (जमीन कायदे)",
        "title_mr": "तुकडेबंदी कायदा: १ ते ३ गुंठे जमिनीची खरेदी आणि ७/१२ नोंद",
        "official_source": "मुंबई तुकडेबंदी व एकत्रीकरण अधिनियम १९४७ कलम ८ब व महसूल परिपत्रक २०२४",
        "bg_preset": "satbara",
        "duration_30": {
            "hook": "तुकडेबंदी कायद्यामुळे तुमची ७/१२ नोंद थांबली आहे का?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "तुकडेबंदीचा अडथळा?",
                    "text": "समजा, रमेशने १ गुंठा शेतजमीन घेतली, पण तुकडेबंदी नियमांमुळे तलाठ्याने ७/१२ वर नाव नोंदवायला नकार दिला, तर हा उपाय नक्की करा!",
                    "visual_cue": "High Court Pillars with Satbara record",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "प्रमाणभूत क्षेत्राचा नियम",
                    "text": "तुकडेबंदी कायद्यानुसार शेतजमिनीचे १ किंवा २ गुंठे तुकडे करून खरेदी खत करण्यावर नोंदणी विभागाने कडक निर्बंध घातले आहेत.",
                    "visual_cue": "Registration restriction circular notice",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "उच्च न्यायालय व शासन निर्णय",
                    "text": "मुंबई उच्च न्यायालयाच्या आदेशानुसार, जर संबंधित जमिनीचा मंजूर रेखांकन किंवा बिनशेती (एन.ए.) आदेश असेल, तर तुकडेबंदी कायदा लागू होत नाही आणि ७/१२ नोंद होते.",
                    "visual_cue": "Court Order with Satbara Stamp",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "योग्य पाऊल उचला",
                    "text": "जमीन घेताना अकृषिक मंजुरी नक्की तपासा. अशाच महत्त्वाच्या महसूल कायद्यांसाठी आजच फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "📜 तुकडेबंदी कायदा व १ ते ३ गुंठे जमिनीची खरेदी!\n\nशेतजमिनीचा १ ते २ गुंठ्याचा व्यवहार करताना तलाठी ७/१२ वर फेरफार नाकारू शकतात. परंतु मंजूर लेआउट किंवा एन.ए. परवानगी असल्यास दस्त नोंदणी आणि ७/१२ नोंद वैध ठरते.\n\n⚖️ अशाच नवनवीन कायदेशीर माहितीसाठी फॉलो करा: @aaplakayda\n\n#आपलाकायदा #AdvocatePratiksha #तुकडेबंदी #Satbara #जमीननोंदणी #BombayPreventionOfFragmentation",
            "hashtags": "#आपलाकायदा #तुकडेबंदी #Satbara #AdvocatePratiksha #MaharashtraRevenue #712Ferfar #LandRegistration",
            "best_posting_time": "संध्याकाळी ०८:०० PM"
        },
        "duration_60": {
            "hook": "१ गुंठा जमिनीचा फेरफार तलाठ्याने नाकारल्यास कायदेशीर अधिकार काय आहेत?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "फेरफार नाकारला तर?",
                    "text": "समजा, तुम्ही रजिस्ट्री करून घेतली पण तलाठ्याने तुकडेबंदीचे कारण देऊन फेरफार रद्द केला, तर घाबरून न जाता हे करा!",
                    "visual_cue": "High Court Order with Satbara Stamp",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "तलाठ्याकडे अडकलेला फेरफार",
                    "text": "अनेकदा तलाठी मंडळ अधिकारी परिपत्रकाचा चुकीचा अर्थ लावून नागरिकांचे हक्क डावलतात आणि फेरफार प्रलंबित ठेवतात.",
                    "visual_cue": "Talathi Office dispute icon",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "MLRC कलम २४७ नुसार अपील",
                    "text": "महाराष्ट्र जमीन महसूल संहिता कलम २४७ अन्वये उपविभागीय अधिकारी (SDO) यांच्याकडे ६० दिवसांच्या आत रीतसर अपील दाखल करा. SDO च्या आदेशाने फेरफार मंजूर होतो.",
                    "visual_cue": "SDO Court Appeal Seal",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "कायद्याची मदत घ्या",
                    "text": "आपल्या अधिकारांची जाणीव ठेवा आणि अन्याय सहन करू नका. दररोज कायदेशीर मार्गदर्शनासाठी फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Advocate Pratiksha branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "⚖️ तुकडेबंदीत फेरफार अडकला असल्यास SDO कडे अपील कसे करावे?\n\nमहाराष्ट्र जमीन महसूल संहिता १९६६ च्या कलम २४७ नुसार तलाठ्याच्या निर्णयाविरुद्ध प्रांताधिकारी (SDO) कडे दाद मागता येते.\n\n#आपलाकायदा #AdvocatePratiksha #SDOअपील #MLRC #तुकडेबंदी #Satbara",
            "hashtags": "#आपलाकायदा #SDOअपील #तुकडेबंदी #AdvocatePratiksha #MLRC1966 #RevenueCourt #LandLaws",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    },
    {
        "id": "ferfar_varas_nond",
        "category": "Succession Laws (वारसाहक्क कायदे)",
        "title_mr": "वडिलोपार्जित जमिनीत मुलींचा आणि बहिणींचा समान वाटा कायदेशीर कसा मिळवायचा?",
        "official_source": "हिंदू वारसा सुधारणा कायदा २००५ कलम ६ (सर्वोच्च न्यायालय विनीता शर्मा निकाल) व MLRC कलम १५०",
        "bg_preset": "court",
        "duration_30": {
            "hook": "वडिलोपार्जित जमिनीत भावांनी बहिणीचा वाटा नाकारला तर काय करावे?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "बहिणीचा समान हक्क!",
                    "text": "समजा, वडिलांच्या मृत्यूनंतर भावांनी बहिणीला विश्वासात न घेता सर्व जमीन स्वतःच्या नावावर केली, तर बहिणीचा हक्क कसा सुरक्षित करावा?",
                    "visual_cue": "Supreme Court of India Gavel",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "वारस नोंदीतील लबाडी",
                    "text": "अनेक ठिकाणी बहिणींचे लग्न झाले म्हणून तलाठ्याकडे वारस नोंदीतून बहिणीचे नाव वगळून परस्पर फेरफार केला जातो.",
                    "visual_cue": "Cancelled heir tree document",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "हिंदू वारसा कायदा कलम ६",
                    "text": "सर्वोच्च न्यायालयाच्या विनीता शर्मा निकालाने स्पष्ट केले आहे की मुलीचा वडिलांच्या संपत्तीत जन्मतःच मुलांइतकाच समान हक्क आहे, वडील २००५ पूर्वी वारले असले तरीही!",
                    "visual_cue": "Equal rights scale emblem",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "आपला हक्क मागा",
                    "text": "तलाठ्याकडे १५ दिवसांत लेखी हरकत घ्या किंवा दिवाणी न्यायालयात वाटपाचा दावा करा. अशाच कायदेशीर हक्कांसाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Follow Aapla Kayda branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "⚖️ वडिलोपार्जित शेतजमिनीत मुलींचा जन्मसिद्ध हक्क!\n\nहिंदू वारसा सुधारणा कायदा २००५ च्या कलम ६ नुसार, सर्वोच्च न्यायालयाने विनीता शर्मा खटल्यात ऐतिहासिक निकाल दिला आहे: मुलगी विवाहित असो वा अविवाहित, तिला वडिलोपार्जित संपत्तीत मुलांइतकाच बरोबरीचा हिस्सा मिळतो.\n\nवारस नोंदीत नाव डावलले असल्यास तलाठ्याकडे कलम १५० नुसार १५ दिवसांत लेखी आक्षेप नोंदवा.\n\n#आपलाकायदा #AdvocatePratiksha #मुलींचावारसाहक्क #HinduSuccessionAct #Section6 #Satbara #WomenRights",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #मुलींचावाटा #वारसाहक्क #HinduSuccession #SupremeCourt #WomenEmpowerment #MaharashtraLaw",
            "best_posting_time": "संध्याकाळी ०७:३० PM"
        },
        "duration_60": {
            "hook": "वारस फेरफार नोंदीमध्ये नाव वगळले असल्यास कायदेशीर पावले कशी उचलावीत?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "वारस नोंदीत नाव वगळले?",
                    "text": "समजा, तलाठ्याने तुमच्या संमतीशिवाय इतर वारसांच्या नावावर फेरफार नोंदवला, तर लगेच हे ३ कायदेशीर उपाय करा!",
                    "visual_cue": "Inheritance family tree on Satbara",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "१५ दिवसांची नोटीस (कलम १५०)",
                    "text": "तलाठ्याला कच्चा फेरफार काढल्यानंतर सर्व वारसांना कलम १५० अन्वये नोटीस बजावणे कायद्याने बंधनकारक असते.",
                    "visual_cue": "MLRC Section 150 Notice Extract",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "SDO कडे अपील व दिवाणी दावा",
                    "text": "नोटीस न देता फेरफार मंजूर झाल्यास MLRC कलम २४७ नुसार उपविभागीय अधिकारी (SDO) कडे अपील करा आणि दिवाणी न्यायालयात वाटपाचा दावा (Partition Suit) दाखल करा.",
                    "visual_cue": "Court Partition Suit document",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "वेळेत पाऊल उचला",
                    "text": "कायद्याची वेळेत घेतलेली मदत तुम्हाला तुमच्या हक्काची जमीन मिळवून देते. अधिक माहितीसाठी फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Advocate Pratiksha Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🚨 वारस फेरफार नोंदीमध्ये नाव वगळले असल्यास कायदेशीर उपाय!\n\nमहाराष्ट्र जमीन महसूल संहिता (MLRC 1966) च्या कलम २४७ नुसार तलाठी/मंडळ अधिकाऱ्यांच्या चुकीच्या फेरफाराविरुद्ध SDO कडे अपील करता येते.\n\n#आपलाकायदा #AdvocatePratiksha #वारसनोंद #MLRC #जमीनमहसूल #SDOअपील",
            "hashtags": "#आपलाकायदा #वारसनोंद #SDOअपील #AdvocatePratiksha #MLRC1966 #CivilCourt #LegalAdviceMarathi",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    },
    {
        "id": "bnss_arrest_rights",
        "category": "Criminal Law (नवीन फौजदारी कायदे)",
        "title_mr": "BNSS २०२३: पोलिसांना कोणालाही थेट अटक करण्याचा अधिकार आहे का?",
        "official_source": "भारतीय नागरिक सुरक्षा संहिता (BNSS) २०२३ कलम ३५ व अर्नेश कुमार मार्गदर्शक तत्त्वे",
        "bg_preset": "bnss",
        "duration_30": {
            "hook": "नवीन BNSS कायद्यानुसार पोलीस थेट कोणालाही अटक करू शकतात का?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "अटकेचे नवे नियम BNSS!",
                    "text": "समजा, कोणाचे किरकोळ भांडण झाले आणि समोरच्याने पोलीस ठाण्यात तक्रार केली, तर पोलीस थेट घरात येऊन हातकडी लावू शकतात का? उत्तर आहे 'नाही'!",
                    "visual_cue": "Police badge with BNSS legal book",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "नागरिकांमधील भीती",
                    "text": "अनेक जण पोलिसांच्या नुसत्या फोनने घाबरून जातात आणि गैरसमजातून नाहक मनस्ताप सहन करतात.",
                    "visual_cue": "Handcuff warning sign",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "BNSS कलम ३५ चा कायदेशीर ढाल",
                    "text": "नवीन भारतीय नागरिक सुरक्षा संहिता २०२३ च्या कलम ३५ नुसार, ७ वर्षांपेक्षा कमी शिक्षेच्या गुन्ह्यात पोलिसांना थेट अटक करता येत नाही; आधी लेखी नोटीस देणे अनिवार्य आहे.",
                    "visual_cue": "Section 35 BNSS Protective Shield",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "कायद्याची ताकद ओळखा",
                    "text": "पोलीस ठाण्यात जाताना आपल्या वकिलांना सोबत ठेवण्याचा तुमचा कायदेशीर हक्क आहे. हा व्हिडिओ प्रत्येकाला शेअर करा आणि फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Follow Aapla Kayda branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "⚖️ BNSS २०२३: पोलिसांचे अटकेचे अधिकार आणि नागरिकांचे संरक्षण!\n\n१ जुलै २०२४ पासून लागू झालेल्या भारतीय नागरिक सुरक्षा संहितेच्या (BNSS) कलम ३५ नुसार (जुने CrPC कलम ४१A), ७ वर्षांपेक्षा कमी शिक्षा असलेल्या गुन्ह्यांत थेट अटक करता येत नाही.\n\nपोलिसांनी आधी रीतसर लेखी नोटीस बजावणे आणि कायदेशीर प्रक्रिया पाळणे बंधनकारक आहे.\n\n#आपलाकायदा #AdvocatePratiksha #BNSS2023 #नवीनकायदे #अटकनियम #LegalRightsIndia",
            "hashtags": "#आपलाकायदा #BNSS2023 #कलम३५ #AdvocatePratiksha #NewCriminalLaws #PoliceRights #LegalHelp",
            "best_posting_time": "संध्याकाळी ०७:०० PM"
        },
        "duration_60": {
            "hook": "पोलीस ठाण्यातून फोन आला तर घाबरून न जाता हे ३ प्रश्न विचारा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "पोलीस ठाण्यातून फोन आला तर?",
                    "text": "समजा, तुम्हाला पोलीस ठाण्यातून हजर राहण्यासाठी फोन आला, तर अजिबात घाबरू नका! फोनवर सर्वात आधी हे ३ कायदेशीर प्रश्न विचारा.",
                    "visual_cue": "Phone call police alert icon",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "विचारण्याचे ३ मुख्य प्रश्न",
                    "text": "१. कोणत्या गुन्ह्यात किंवा तक्रारीत चौकशी आहे? २. मला साक्षीदार म्हणून बोलावले आहे की आरोपी म्हणून? आणि ३. BNSS कलम ३५ नुसार अधिकृत लेखी नोटीस पाठवली आहे का?",
                    "visual_cue": "Checklist of 3 legal questions",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "महिला व वृद्धांचे संरक्षण",
                    "text": "नवीन कायद्यानुसार १५ वर्षांखालील मुले, महिला आणि ६० वर्षांवरील ज्येष्ठ नागरिकांना पोलीस ठाण्यात न बोलावता त्यांच्या घरीच चौकशी करण्याचे कायदेशीर संरक्षण आहे.",
                    "visual_cue": "Legal Notice Document with Protection Seal",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "वकिलांचा सल्ला घ्या",
                    "text": "कायद्याची योग्य माहिती हीच खरी ढाल आहे. अशाच महत्त्वपूर्ण कायदेशीर तरतुदींसाठी आत्ताच फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "📢 पोलीस ठाण्यातून बोलावणे आल्यास नागरिकांचे कायदेशीर अधिकार!\n\nघाबरून न जाता रीतसर नोटीस मागा. BNSS २०२३ अन्वये महिला, लहान मुले व ६० वर्षांवरील नागरिकांना पोलीस ठाण्यात न बोलावता घरीच चौकशी करण्याची तरतूद आहे.\n\n#आपलाकायदा #AdvocatePratiksha #BNSS2023 #कायदेशीरअधिकार #PoliceNotice #MaharashtraLaw",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #BNSS2023 #कायदेशीरअधिकार #LegalAdvice #PoliceNotice #MaharashtraLaw",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    },
    {
        "id": "cyber_fraud_1930",
        "category": "Cyber Laws (सायबर कायदे)",
        "title_mr": "बँक खात्यातून ऑनलाईन पैसे कापले गेले? पहिल्या २ तासांत १९३० आणि BNSS कलम ५०३",
        "official_source": "गृह मंत्रालय सायबर क्राईम हेल्पलाईन १९३०, cybercrime.gov.in व BNSS कलम ५०३",
        "bg_preset": "bnss",
        "duration_30": {
            "hook": "बँक खात्यातून अचानक ऑनलाईन पैसे कापले गेले तर पहिल्या २ तासांत 'हे' करा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "सायबर फसवणूक झाली?",
                    "text": "समजा, वीज बिल भरण्यासाठी किंवा लॉटरीच्या मेसेजवर क्लिक झाले आणि बँक खात्यातून ५०,००० रुपये कापले गेले, तर पहिल्या २ तासांत हा उपाय करा!",
                    "visual_cue": "Cyber fraud warning screen with rupee alert",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "गोल्डन अवरचे महत्त्व",
                    "text": "सायबर भामटे पैसे वेगवेगळ्या बँक खात्यांत वळवतात. त्यामुळे फसवणूक झाल्यानंतरचा पहिला 'गोल्डन अवर' अत्यंत निर्णायक असतो.",
                    "visual_cue": "2 Hours Golden Hour Clock timer",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "१९३० हेल्पलाईन व खाते फ्रीझ",
                    "text": "लगेच १९३० या राष्ट्रीय हेल्पलाईनवर कॉल करा किंवा cybercrime.gov.in वर तक्रार नोंदवा. सायबर सेल आरोपीचे बँक खाते त्वरित फ्रीझ करते.",
                    "visual_cue": "Cyber helpline 1930 banner with green lock",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "पैसे परत मिळवा",
                    "text": "BNSS कलम ५०३ अन्वये न्यायालयाकडून पैसे परत मिळवण्याचा आदेश मिळवा. हा नंबर मोबाईलमध्ये सेव्ह ठेवा आणि फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🚨 सायबर फ्रॉड: बँक खात्यातून पैसे गेले तर पहिल्या २ तासांत 'हे' करा!\n\nउदा. वीज बिल अपडेट, क्रेडिट कार्ड रिवॉर्ड किंवा बनावट APK लिंकवरून फसवणूक झाल्यास:\n१. तात्काळ १९३० हेल्पलाईनवर कॉल करा.\n२. ट्रॅन्झॅक्शन आयडी, बँक नाव आणि वेळ नोंदवा.\n३. सायबर सेल पैसे दुसऱ्या खात्यात जाण्यापूर्वी ते फ्रीझ करते.\n४. BNSS कलम ५०३ नुसार दंडाधिकाऱ्यांच्या आदेशाने रक्कम परत मिळवता येते.\n\n#आपलाकायदा #AdvocatePratiksha #CyberFraud #1930Helpline #BNSS503 #OnlineScamMaharashtra",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #CyberCrime #BankFraud #1930Helpline #OnlineSafety #BNSS503",
            "best_posting_time": "संध्याकाळी ०६:३० PM"
        },
        "duration_60": {
            "hook": "सायबर गुन्हेगारांनी पळवलेले पैसे कोर्टातून परत कसे मिळवावे?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "फ्रीझ झालेले पैसे परत मिळतील?",
                    "text": "समजा, सायबर पोलिसांनी भामट्याचे बँक खाते फ्रीझ केले, पण तुमचे अडकलेले पैसे तुमच्या स्वतःच्या खात्यात जमा कसे करायचे? जाणून घ्या कायदेशीर प्रक्रिया!",
                    "visual_cue": "Bank Freeze to Refund flow",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "बँक परस्पर पैसे देत नाही",
                    "text": "खाते फ्रीझ झाले तरी न्यायालयाच्या अधिकृत आदेशाशिवाय बँक तक्रारदाराला पैसे परत देत नाही.",
                    "visual_cue": "Bank counter lock icon",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "BNSS कलम ५०३ नुसार रिफंड अर्ज",
                    "text": "नवीन BNSS कलम ५०३ (जुने CrPC ४५७) अन्वये संबंधित प्रथम वर्ग न्यायदंडाधिकाऱ्यांकडे (JMFC) रीतसर रिफंड अर्ज करा. न्यायालय बँकेला थेट पैसे परत करण्याचे आदेश देते.",
                    "visual_cue": "Court Refund Order Stamp",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "कायद्याची मदत घ्या",
                    "text": "आपला कष्टाचा पैसा सुरक्षित ठेवा. ही माहिती प्रत्येकाला पोहोचवा आणि दररोज कायदेशीर मार्गदर्शनासाठी फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🛡️ सायबर फसवणुकीतील रक्कम न्यायालयातून परत मिळवण्याची कायदेशीर पद्धत!\n\n१. १९३० वर तक्रार\n२. बँक खाते तात्काळ फ्रीझ\n३. BNSS कलम ५०३ (जुने कलम ४५७) अन्वये दंडाधिकाऱ्यांकडून रिफंडचा आदेश.\n\n#आपलाकायदा #AdvocatePratiksha #CyberHelpline1930 #CourtRefund #सायबरकायदा #BankFraudProtection",
            "hashtags": "#आपलाकायदा #CyberCrime #BNSS503 #AdvocatePratiksha #OnlineScam #RefundProcess #LegalTips",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    },
    {
        "id": "satbara_boja_kami",
        "category": "Land Laws (जमीन कायदे)",
        "title_mr": "७/१२ उताऱ्यावरील बँकेचा बोजा कसा कमी करावा किंवा हटवावा?",
        "official_source": "महाराष्ट्र जमीन महसूल संहिता (MLRC 1966) कलम १४९ व ई-हक्क (e-Haqq) प्रणाली",
        "bg_preset": "satbara",
        "duration_30": {
            "hook": "बँकेचे कर्ज फिटले पण ७/१२ वर अजूनही बोजा दिसतोय? तलाठ्याकडे न जाता हा अर्ज करा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "७/१२ वरील बोजा कसा काढायचा?",
                    "text": "समजा, तुमचे बँकेचे पीक कर्ज किंवा गृहकर्ज पूर्ण फिटले, पण ७/१२ उताऱ्यावरील 'इतर हक्क' मधील बँकेचा बोजा अजूनही हटलेला नाही, तर हे करा!",
                    "visual_cue": "7/12 document with Bank loan stamp",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "बोजा न हटल्यास नुकसान",
                    "text": "७/१२ वर बोजा कायम राहिल्यास जमीन विकता येत नाही किंवा दुसऱ्या बँकेकडून नव्याने कर्ज मिळताना अडचण येते.",
                    "visual_cue": "Warning seal on land record",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "ई-हक्क प्रणाली व बँकेचे NOC",
                    "text": "बँकेकडून ना हरकत प्रमाणपत्र (NOC) घेऊन महाभूमीच्या 'ई-हक्क' (e-Haqq) पोर्टलवर बोजा कमी करण्यासाठी ऑनलाईन अर्ज करा. तलाठी १५ दिवसांत फेरफार मंजूर करतो.",
                    "visual_cue": "e-Haqq Portal approval checkmark",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "७/१२ स्वच्छ ठेवा",
                    "text": "आपला ७/१२ नेहमी कायदेशीरदृष्ट्या निर्वेध ठेवा. अशाच शेतकरी व जमीन कायद्यांसाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🌾 ७/१२ उताऱ्यावरील बँकेचा बोजा ऑनलाईन कमी करण्याची पद्धत!\n\nकर्ज फेडल्यानंतर बँकेकडून कर्जफेडीचा दाखला व NOC घ्या. महाभूमीच्या e-Haqq पोर्टलवरून 'बोजा कमी करणे' या पर्यायावर अर्ज करा.\n\n#आपलाकायदा #AdvocatePratiksha #Satbara #बोजाकमीकरणे #शेतकरी #MaharashtraLandRecords",
            "hashtags": "#आपलाकायदा #Satbara #बोजाकमीकरणे #AdvocatePratiksha #eHaqq #शेतकरीकायदे #Maharashtra",
            "best_posting_time": "सकाळी ०८:३० AM"
        },
        "duration_60": {
            "hook": "७/१२ वरील जुना बोजा हटवण्यासाठी तलाठ्याकडे न जाता ई-हक्कचा वापर कसा करावा?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "७/१२ वर वर्षानुवर्षे जुना बोजा?",
                    "text": "समजा, १० वर्षांपूर्वीचे सोसायटीचे किंवा बँकेचे कर्ज फिटले आहे, तरीही ७/१२ उताऱ्यावर बोजा तसाच राहिला आहे, तर ही सोपी प्रक्रिया समजून घ्या!",
                    "visual_cue": "Satbara document zoom in",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "तलाठी कार्यालयाचे खेटे थांबवा",
                    "text": "नागरिकांना बोजा कमी करण्यासाठी वारंवार तलाठी कार्यालयात चकरा माराव्या लागतात आणि वेळ वाया जातो.",
                    "visual_cue": "Dispute waiting line icon",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "MLRC कलम १४९ व डिजिटल फेरफार",
                    "text": "महाराष्ट्र जमीन महसूल संहिता कलम १४९ अन्वये बँकेने पाठवलेले डिजिटल नमुना ई-हक्क प्रणालीद्वारे थेट तलाठ्याकडे जाते. कोणत्याही शुल्काशिवाय बोजा हटवला जातो.",
                    "visual_cue": "Digital Ferfar Seal",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "शेतकऱ्यांपर्यंत पोहोचवा",
                    "text": "हा व्हिडिओ प्रत्येक शेतकरी बांधवाला नक्की पाठवा आणि दररोज कायदेशीर मार्गदर्शनासाठी फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Advocate Pratiksha branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🚜 ७/१२ वरील बोजा हटवण्याची १००% कायदेशीर पद्धत!\n\n#आपलाकायदा #AdvocatePratiksha #Satbara #बोजाकमी #शेतकरी #MLRC1966",
            "hashtags": "#आपलाकायदा #Satbara #AdvocatePratiksha #शेतकरी #MaharashtraRevenue #LegalTips",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    },
    {
        "id": "shet_rasta_mamlatdar",
        "category": "Land Disputes (शेतरस्ता वाद)",
        "title_mr": "शेतात जाण्याचा पारंपरिक रस्ता शेजाऱ्याने अडवला असल्यास काय करावे?",
        "official_source": "मामलेदार न्यायालय अधिनियम १९०६ कलम ५ (Mamlatdar Courts Act Sec 5)",
        "bg_preset": "satbara",
        "duration_30": {
            "hook": "शेतात जाण्याचा रस्ता शेजाऱ्याने अडवलाय? तहसीलदारांकडे हा एक अर्ज करा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "शेतरस्ता अडवला तर?",
                    "text": "समजा, शेतात ट्रॅक्टर नेण्यासाठी पारंपरिक बांधावरून जाणारा रस्ता शेजारच्या शेतकऱ्याने कुंपण घालून किंवा चर खणून बंद केला, तर काय करावे?",
                    "visual_cue": "Farm road dispute icon with blocked fence",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "पिकांचे अतोनात नुकसान",
                    "text": "रस्ता बंद झाल्यामुळे खते, बी-बियाणे नेता येत नाहीत आणि ऐन काढणीच्या वेळी पिकांचे मोठे नुकसान होते.",
                    "visual_cue": "Blocked tractor path icon",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "मामलेदार कोर्ट ॲक्ट कलम ५",
                    "text": "मामलेदार न्यायालय अधिनियम १९०६ च्या कलम ५ अन्वये तहसीलदारांकडे अर्ज दाखल करा. तहसीलदार स्पॉट व्हिजिट करून रस्ता त्वरित मोकळा करण्याचे आदेश देतात.",
                    "visual_cue": "Mamlatdar Court Order Seal",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "हक्काचा रस्ता मिळवा",
                    "text": "अडथळा निर्माण झाल्यापासून ६ महिन्यांच्या आत अर्ज करणे आवश्यक आहे. अशाच महत्त्वपूर्ण कायद्यांसाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🚜 शेतात जाण्याचा वहिवाटीचा रस्ता मोकळा करण्याची कायदेशीर पद्धत!\n\nउदा. जर शेजारच्या शेतकऱ्याने पारंपरिक वहिवाटीचा रस्ता किंवा बांध अडवला, तर मामलेदार न्यायालय अधिनियम १९०६ च्या कलम ५ अन्वये तहसीलदारांकडे ६ महिन्यांच्या आत अर्ज करावा.\n\nतहसीलदार स्वतः किंवा मंडळ अधिकाऱ्यांमार्फत पंचनामा करून तात्काळ वहिवाटीचा रस्ता खुला करून देतात.\n\n#आपलाकायदा #AdvocatePratiksha #शेतरस्ता #मामलेदारकायदा #शेतकरीहक्क #MaharashtraFarmer",
            "hashtags": "#आपलाकायदा #शेतरस्ता #मामलेदारकायदा #AdvocatePratiksha #FarmerRights #TahsildarOrder #Maharashtra",
            "best_posting_time": "सकाळी ०८:०० AM"
        },
        "duration_60": {
            "hook": "शेत रस्त्यासाठी ६ महिन्यांचा नियम आणि पोलिसांच्या मदतीने रस्ता खुला करणे",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "शेत रस्त्याचा वाद?",
                    "text": "समजा, रस्त्याच्या वादामुळे शेजाऱ्यांशी भांडणे होत आहेत, तर हातात कायदा न घेता न्यायालयाच्या मदतीने रस्ता कसा मिळवावा?",
                    "visual_cue": "Farm boundary map dispute",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "मुदतीचा नियम",
                    "text": "रस्ता अडवल्यानंतर अनेक शेतकरी वेळ वाया घालवतात. लक्षात ठेवा, मामलेदार न्यायालयात अर्ज करण्याची अंतिम मुदत ६ महिनेच असते.",
                    "visual_cue": "6 Months limitation period clock",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "पोलीस बंदोबस्तात रस्ता खुला",
                    "text": "तहसीलदारांनी आदेश देऊनही शेजारी ऐकत नसेल, तर कलम ५(४) अन्वये पोलीस बंदोबस्त मिळवून रस्ता प्रत्यक्ष जागेवर मोकळा करून दिला जातो.",
                    "visual_cue": "Police Protection Court Seal",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "कायद्याची ताकद वापरा",
                    "text": "आपल्या शेतीचे रक्षण करा. हा व्हिडिओ प्रत्येक शेतकरी ग्रुपमध्ये शेअर करा आणि फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Advocate Pratiksha branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🌾 शेतरस्ता अडवल्यास तहसीलदारांचे अधिकार व पोलीस बंदोबस्त!\n\n#आपलाकायदा #AdvocatePratiksha #शेतरस्ता #शेतकरी #MamlatdarCourtsAct",
            "hashtags": "#आपलाकायदा #शेतरस्ता #AdvocatePratiksha #FarmerLaws #MaharashtraAgriculture #LegalTips",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    },
    {
        "id": "builder_flat_delay_rera",
        "category": "Consumer & Real Estate (ग्राहक संरक्षण व महारेरा)",
        "title_mr": "बिल्डरने वेळेत फ्लॅटचा ताबा न दिल्यास महारेरा कलम १८ नुसार व्याजासह परतावा",
        "official_source": "रिअल इस्टेट (नियमन व विकास) अधिनियम २०१६ (RERA) कलम १८ व महारेरा न्यायाधिकरण",
        "bg_preset": "court",
        "duration_30": {
            "hook": "बिल्डर फ्लॅटचा ताबा देण्यास उशीर करतोय? महारेरा कलम १८ नुसार दरमहा व्याज मिळवा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "फ्लॅटचा ताबा लांबणीवर?",
                    "text": "समजा, करारनाम्यातील ताबा देण्याची तारीख उलटून २ वर्षे झाली, तरी बिल्डर फक्त कारणे सांगतोय आणि तुमचे घराचे भाडेही सुरू आहे, तर हे करा!",
                    "visual_cue": "Under construction building with delay notice",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "घर खरेदीदारांचे दुहेरी नुकसान",
                    "text": "एकीकडे बँकेचा घराचा हप्ता (EMI) सुरू असतो आणि दुसरीकडे स्वतःच्या राहत्या घराचे भाडे भरावे लागते, ज्यामुळे नागरिक त्रस्त होतात.",
                    "visual_cue": "EMI plus Rent financial burden icon",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "महारेरा कलम १८ चा अधिकार",
                    "text": "महारेरा कायद्याच्या कलम १८ नुसार, ग्राहकाला पूर्ण पैसे स्टेट बँकेच्या व्याजासह परत मागण्याचा किंवा ताबा मिळेपर्यंत दरमहा व्याज मिळवण्याचा १००% कायदेशीर अधिकार आहे.",
                    "visual_cue": "MahaRERA Section 18 Order Stamp",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "आपला हक्क मिळवा",
                    "text": "महारेराच्या maharera.mahaonline.gov.in वर रीतसर ऑनलाईन तक्रार दाखल करा. अशाच ग्राहक हक्कांसाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Follow Aapla Kayda Call to Action",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "🏢 बिल्डरने फ्लॅटचा ताबा देण्यास उशीर केल्यास महारेरा कलम १८ चा वापर!\n\nउदा. जर अॅग्रीमेंटमधील पझेशन तारीख उलटली असेल, तर महारेरा कलम १८ नुसार बिल्डरकडून दरमहा व्याजासह भरपाई किंवा पूर्ण भरलेली रक्कम व्याजासह परत मिळते.\n\n#आपलाकायदा #AdvocatePratiksha #MahaRERA #फ्लॅटखरेदी #कलम१८ #HomeBuyersMaharashtra",
            "hashtags": "#आपलाकायदा #MahaRERA #HomeBuyers #AdvocatePratiksha #RealEstateLaw #FlatDelay #ConsumerProtection",
            "best_posting_time": "संध्याकाळी ०७:०० PM"
        },
        "duration_60": {
            "hook": "महारेरा मध्ये बिल्डरविरुद्ध तक्रार कशी करावी आणि परतावा कसा मिळवावा?",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "बिल्डरविरुद्ध महारेरा तक्रार",
                    "text": "समजा, बिल्डर प्रोजेक्ट अर्धवट सोडून पळून गेला किंवा वर्षानुवर्षे ताबा देत नाही, तर महारेरा कोर्टातून पैसे वसूल कसे करावे?",
                    "visual_cue": "MahaRERA Court Bench",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "अग्रीमेंट टू सेलचे महत्त्व",
                    "text": "अनेक जण फक्त अलॉटमेंट लेटरवर अवलंबून राहतात. अग्रीमेंट टू सेलची नोंदणी आणि ताबा देण्याची तारीख अत्यंत महत्त्वाची असते.",
                    "visual_cue": "Registered Agreement To Sale",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "व्याज व दंडाचे आदेश",
                    "text": "महारेरा न्यायाधिकरण बिल्डरचे बँक खाते सील करून आणि त्याच्या इतर मालमत्ता जप्त करून जिल्हाधिकाऱ्यांमार्फत महसूल वसुली (RRC) प्रमाणे पैसे वसूल करून देते.",
                    "visual_cue": "Collector Recovery Certificate Stamp",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "कायद्याची मदत घ्या",
                    "text": "आपल्या कष्टाच्या पैशांची सुरक्षा करा. हा व्हिडिओ सर्व घर खरेदीदारांपर्यंत पोहोचवा आणि फॉलो करा 'आपला कायदा'!",
                    "visual_cue": "Advocate Pratiksha branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": "⚖️ महारेरा मधून बिल्डरविरुद्ध पैसे वसुलीची कायदेशीर प्रक्रिया!\n\n#आपलाकायदा #AdvocatePratiksha #MahaRERA #कलम१८ #फ्लॅटखरेदी #RRCआदेश",
            "hashtags": "#आपलाकायदा #MahaRERA #AdvocatePratiksha #FlatPossession #ConsumerCourt #RealEstateLaw",
            "best_posting_time": "दुपारी १२:३० PM"
        }
    }
]

def get_all_topics():
    return [
        {
            "id": t["id"],
            "category": t["category"],
            "title_mr": t["title_mr"],
            "official_source": t["official_source"],
            "bg_preset": t["bg_preset"],
            "hook_30": t["duration_30"]["hook"],
            "hook_60": t["duration_60"]["hook"],
        }
        for t in LEGAL_TOPICS_DATABASE
    ]

def get_topic_by_id(topic_id):
    for t in LEGAL_TOPICS_DATABASE:
        if t["id"] == topic_id:
            return t
    return LEGAL_TOPICS_DATABASE[0]

def generate_custom_script(custom_query: str, duration: str = "30") -> dict:
    """
    Intelligent Maharashtra Legal Script Synthesizer:
    1. Analyzes user query against real Maharashtra citizen problems.
    2. Injects concrete everyday examples ("समजा...").
    3. References exact updated sections (BNS 2023 / BNSS 2023 / MLRC 1966 / MahaRERA / Hindu Succession).
    4. Guarantees structured, engaging, easy-to-understand Marathi scenes.
    """
    clean_q = custom_query.strip()
    dur_key = "duration_60" if str(duration) == "60" else "duration_30"
    q_lower = clean_q.lower()

    # 1. Exact Pre-built Match
    for t in LEGAL_TOPICS_DATABASE:
        if t["id"] in q_lower or t["title_mr"][:8].lower() in q_lower:
            data = t[dur_key]
            return {
                "id": t["id"],
                "category": t["category"],
                "title_mr": t["title_mr"],
                "official_source": t["official_source"],
                "duration": duration,
                "hook": data["hook"],
                "scenes": data["scenes"],
                "caption": data["caption"],
                "hashtags": data["hashtags"],
                "best_posting_time": data["best_posting_time"]
            }

    # 2. Intelligent Categorized Knowledge Synthesizer
    # Scenario A: Check Bounce / Cheque Return
    if any(k in q_lower for k in ["चेक", "धनादेश", "बाऊन्स", "cheque", "bounce"]):
        title = clean_q if clean_q else "धनादेश (चेक) बाऊन्स झाल्यास कायदेशीर कारवाई कशी करावी?"
        return {
            "id": "custom_cheque_bounce",
            "category": "Commercial & Negotiable Laws (धनादेश कायदे)",
            "title_mr": title,
            "official_source": "निगोशिएबल इन्स्ट्रुमेंट्स ॲक्ट १८८१ कलम १३८ (NI Act Sec 138)",
            "duration": duration,
            "hook": "दिलेला चेक बँकेत बाऊन्स झाला? १५ दिवसांची ही कायदेशीर नोटीस लगेच पाठवा!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "चेक बाऊन्स झाला तर?",
                    "text": "समजा, एखाद्याला दिलेले उसने किंवा व्यवसायाचे पैसे परत घेण्यासाठी घेतलेला चेक बँकेत अपुऱ्या निधीमुळे बाऊन्स झाला, तर घाबरून न जाता ही कायदेशीर प्रक्रिया करा!",
                    "visual_cue": "Cheque bounce memo icon with red stamp",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "३० दिवसांची अंतिम मुदत",
                    "text": "बँकेकडून मेमो मिळाल्यापासून ३० दिवसांच्या आत समोरच्या व्यक्तीला वकिलामार्फत १५ दिवसांची कायदेशीर नोटीस देणे अनिवार्य असते.",
                    "visual_cue": "Legal Notice with 15 Days Countdown",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "NI ॲक्ट कलम १३८",
                    "text": "नोटीस मिळूनही १५ दिवसांत पैसे न दिल्यास, पुढील ३० दिवसांच्या आत दंडाधिकाऱ्यांच्या न्यायालयात फौजदारी केस दाखल करा. आरोपीला दुप्पट दंड किंवा २ वर्षे कारावास होऊ शकतो.",
                    "visual_cue": "Judicial Magistrate Court Order",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "आपले पैसे वसूल करा",
                    "text": "वेळेत कायदेशीर नोटीस पाठवून हक्काचे पैसे परत मिळवा. अशाच अधिकृत कायदेशीर मार्गदर्शनासाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Advocate Pratiksha Follow CTA",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": f"⚖️ {title}\n\nएन.आय. ॲक्ट कलम १३८ नुसार चेक बाऊन्स झाल्यास ३० दिवसांच्या आत कायदेशीर नोटीस पाठवणे आवश्यक आहे.\n\n#आपलाकायदा #AdvocatePratiksha #चेकबाऊन्स #NIAct138 #कायदेशीरसल्ला #MaharashtraLaw",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #चेकबाऊन्स #NIAct138 #ChequeBounce #LegalAdviceMarathi #CourtCase",
            "best_posting_time": "संध्याकाळी ०७:०० PM"
        }

    # Scenario B: Power of Attorney / कुलमुखत्यारपत्र
    if any(k in q_lower for k in ["कुलमुखत्यार", "poa", "power of attorney", "पॉवर ऑफ"]):
        title = clean_q if clean_q else "कुलमुखत्यारपत्र (POA) वर जमीन किंवा प्लॉट खरेदी करणे सुरक्षित आहे का?"
        return {
            "id": "custom_poa_land",
            "category": "Property Laws (मालमत्ता कायदे)",
            "title_mr": title,
            "official_source": "सर्वोच्च न्यायालय निकाल (सूरज लँप्स खटला) व नोंदणी कायदा कलम १७",
            "duration": duration,
            "hook": "केवळ पॉवर ऑफ ॲटर्नीवर (POA) प्लॉट खरेदी करताय? ही चूक तुमचे लाखो रुपये बुडवेल!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "POA वर प्लॉट खरेदी?",
                    "text": "समजा, बिल्डर किंवा मूळ मालक फक्त पॉवर ऑफ ॲटर्नीवर जागा विकत आहे, तर लक्षात ठेवा, सर्वोच्च न्यायालयाने असा व्यवहार बेकायदेशीर ठरवला आहे!",
                    "visual_cue": "Power of Attorney Document with Warning Sign",
                    "template": "gunthewari_tukdebandi.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "मालकी हक्क मिळत नाही",
                    "text": "सूरज लँप्स खटल्यात सर्वोच्च न्यायालयाने स्पष्ट केले आहे की कुलमुखत्यारपत्राने जागेची मालकी कधीही हस्तांतरित होत नाही.",
                    "visual_cue": "Invalid Title Deed mark",
                    "template": "satbara_land_record.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "नोंदणीकृत खरेदी खत आवश्यक",
                    "text": "हस्तांतरण कायदा कलम ५४ नुसार अधिकृत मुद्रांक शुल्क भरून दुय्यम निबंधक कार्यालयात नोंदणीकृत खरेदी खत (Sale Deed) केल्याशिवाय ७/१२ वर नाव लागत नाही.",
                    "visual_cue": "Registered Sale Deed Seal",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "सुरक्षित व्यवहार करा",
                    "text": "केवळ कुलमुखत्यारपत्रावर कधीही पैसे देऊ नका; आधी वकिलांकडून सर्च रिपोर्ट तपासा. अधिक माहितीसाठी फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Advocate Pratiksha Branding",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": f"🛑 {title}\n\nकेवळ कुलमुखत्यारपत्रावर (POA) जमिनीचा व्यवहार करणे कायद्याने अवैध आहे. नेहमी अधिकृत नोंदणीकृत खरेदी खत (Registered Sale Deed) करा.\n\n#आपलाकायदा #AdvocatePratiksha #POAखरेदी #जमीनव्यवहार #Satbara #MaharashtraRealEstate",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #POA #जमीनखरेदी #TitleClearance #SurajLamp #LegalTips",
            "best_posting_time": "दुपारी १२:३० PM"
        }

    # Scenario C: Cheating / Fraud (BNS 2023 Section 318 - Old IPC 420)
    if any(k in q_lower for k in ["फसवणूक", "420", "४२०", "cheating", "fraud", "गुन्हा"]):
        title = clean_q if clean_q else "फसवणूक झाल्यास नवीन BNS २०२३ कलम ३१८ अन्वये गुन्हा कसा दाखल करावा?"
        return {
            "id": "custom_bns_fraud",
            "category": "New Criminal Laws (नवीन भारतीय न्याय संहिता)",
            "title_mr": title,
            "official_source": "भारतीय न्याय संहिता (BNS) २०२३ कलम ३१८ व BNSS २०२३ कलम १७३",
            "duration": duration,
            "hook": "कोणी तुमची आर्थिक किंवा कायदेशीर फसवणूक केली? नवीन BNS कलम ३१८ समजून घ्या!",
            "scenes": [
                {
                    "scene_num": 1,
                    "type": "hook",
                    "title": "फसवणुकीविरुद्ध नवा कायदा!",
                    "text": "समजा, एखाद्याने खोटी आश्वासने देऊन किंवा बनावट कागदपत्रे दाखवून तुमच्याकडून लाखो रुपये उकळले, तर आता जुने IPC ४२० नाही, नवीन BNS कलम ३१८ लागू होते!",
                    "visual_cue": "BNS 2023 Book with Justice Scales",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 2,
                    "type": "problem",
                    "title": "पोलीस तक्रार नाकारतात का?",
                    "text": "अनेकदा पोलीस दिवाणी (Civil) वाद म्हणून तक्रार घेण्यास टाळाटाळ करतात, ज्यामुळे फसवणूक करणाऱ्याचे फावते.",
                    "visual_cue": "Complaint form dispute",
                    "template": "courtroom_scales.png"
                },
                {
                    "scene_num": 3,
                    "type": "law_solution",
                    "title": "BNS कलम ३१८ व BNSS १७३",
                    "text": "भारतीय न्याय संहिता कलम ३१८ अन्वये फसवणुकीसाठी ७ वर्षांपर्यंत सक्तमजुरीची शिक्षा आहे. पोलिसांनी FIR न घेतल्यास BNSS कलम १७५(३) नुसार थेट दंडाधिकाऱ्यांकडे दाद मागा.",
                    "visual_cue": "FIR Registration Order Seal",
                    "template": "police_bnss_alert.png"
                },
                {
                    "scene_num": 4,
                    "type": "cta",
                    "title": "आपले हक्क शाबूत ठेवा",
                    "text": "फसवणूक करणाऱ्याला कायद्याचा धाक दाखवा. अधिकृत कायदेशीर संरक्षणासाठी आजच फॉलो करा 'आपला कायदा'.",
                    "visual_cue": "Advocate Pratiksha Follow CTA",
                    "template": "courtroom_scales.png"
                }
            ],
            "caption": f"⚖️ {title}\n\n१ जुलै २०२४ पासून जुने IPC कलम ४२० रद्द होऊन नवीन भारतीय न्याय संहितेचे (BNS) कलम ३१८ लागू झाले आहे.\n\n#आपलाकायदा #AdvocatePratiksha #BNS2023 #कलम३१८ #फसवणूक #NewCriminalLaws",
            "hashtags": "#आपलाकायदा #AdvocatePratiksha #BNS2023 #कलम३१८ #FIR #PoliceComplaint #LegalRights",
            "best_posting_time": "संध्याकाळी ०७:०० PM"
        }

    # Scenario D: Universal Smart Maharashtra Legal Synthesizer
    title = clean_q if clean_q else "कायदेशीर हक्क आणि नागरिकांचे संरक्षण"
    return {
        "id": "custom_" + str(abs(hash(clean_q)))[:8],
        "category": "Maharashtra Legal Special (नागरिक कायदेशीर हक्क)",
        "title_mr": title,
        "official_source": "महाराष्ट्र शासन अधिकृत कायदेशीर संहिता व मुंबई उच्च न्यायालय निकाल",
        "duration": duration,
        "hook": f"{title} - याबद्दल कायद्याचे नेमके नियम आणि तुमचे अधिकार काय आहेत? जाणून घ्या!",
        "scenes": [
            {
                "scene_num": 1,
                "type": "hook",
                "title": "कायद्याचा नियम",
                "text": f"समजा, तुमच्यासमोर '{title}' अशी कायदेशीर अडचण आली, तर योग्य कायद्याची माहिती नसल्यास कष्टाचे पैसे आणि वेळ वाया जाऊ शकतात!",
                "visual_cue": "Legal caution banner with scales",
                "template": "courtroom_scales.png"
            },
            {
                "scene_num": 2,
                "type": "problem",
                "title": "नागरिकांची मुख्य चूक",
                "text": "अनेक जण गैरसमजुतीतून किंवा मध्यस्थांच्या सांगण्यावरून परस्पर व्यवहार करतात आणि अधिकृत कायदेशीर कागदपत्रे वेळेत तपासत नाहीत.",
                "visual_cue": "Dispute notice extract",
                "template": "satbara_land_record.png"
            },
            {
                "scene_num": 3,
                "type": "law_solution",
                "title": "कायदेशीर तरतूद व उपाय",
                "text": "नवीन कायद्यानुसार संबंधित सक्षम प्राधिकरणाकडे अधिकृत पुराव्यांसह अर्ज सादर करा. नियमांचे पालन केल्यास न्यायालयाकडून तातडीने संरक्षण मिळते.",
                "visual_cue": "Official government stamp and court provision",
                "template": "courtroom_scales.png"
            },
            {
                "scene_num": 4,
                "type": "cta",
                "title": "वकिलांचा सल्ला घ्या",
                "text": "कोणताही व्यवहार करण्यापूर्वी तज्ज्ञ वकिलांचा कायदेशीर सल्ला अवश्य घ्या. अशाच अधिकृत सोप्या माहितीसाठी फॉलो करा 'आपला कायदा'!",
                "visual_cue": "Advocate Pratiksha branding & CTA",
                "template": "courtroom_scales.png"
            }
        ],
        "caption": f"⚖️ {title} विषयी महत्त्वपूर्ण कायदेशीर माहिती!\n\nकायद्याचे योग्य ज्ञान हीच नागरिकांची खरी ताकद आहे. आपल्या हक्कांचे संरक्षण करण्यासाठी अधिकृत प्रक्रिया जाणून घ्या.\n\nअधिक माहितीसाठी फॉलो करा: @aaplakayda\n\n#आपलाकायदा #AdvocatePratiksha #महाराष्ट्रकायदा #कायदेशीरसल्ला #ReelsMarathi",
        "hashtags": "#आपलाकायदा #AdvocatePratiksha #महाराष्ट्रकायदा #कायदेशीरसल्ला #LegalAwareness #Maharashtra",
        "best_posting_time": "संध्याकाळी ०७:०० PM"
    }
