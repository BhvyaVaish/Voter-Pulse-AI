import { type IntentDictionary } from './chatEngine';

const labels = {
  ELIGIBILITY_CHECK: { en: 'Eligibility Check', hi: 'पात्रता जाँच', ta: 'தகுதி சோதனை', bn: 'যোগ্যতা পরীক্ষা', mr: 'पात्रता तपासणी' },
  REGISTRATION_HELP: { en: 'Registration Help', hi: 'पंजीकरण सहायता', ta: 'பதிவு உதவி', bn: 'নিবন্ধন সাহায্য', mr: 'नोंदणी मदत' },
  BOOTH_LOOKUP: { en: 'Booth Lookup', hi: 'बूथ खोज', ta: 'சாவடி தேடல்', bn: 'বুথ অনুসন্ধান', mr: 'बूथ शोध' },
  CANDIDATE_INFO: { en: 'Candidate Info', hi: 'उम्मीदवार जानकारी', ta: 'வேட்பாளர் தகவல்', bn: 'প্রার্থী তথ্য', mr: 'उमेदवार माहिती' },
  COMPLAINT_SUPPORT: { en: 'Complaint Support', hi: 'शिकायत सहायता', ta: 'புகார் ஆதரவு', bn: 'অভিযোগ সহায়তা', mr: 'तक्रार सहाय्य' },
  VOTING_EXPLANATION: { en: 'Voting Process', hi: 'मतदान प्रक्रिया', ta: 'வாக்களிப்பு செயல்முறை', bn: 'ভোটদান প্রক্রিয়া', mr: 'मतदान प्रक्रिया' },
  FACT_CHECK: { en: 'Fact Check', hi: 'तथ्य जाँच', ta: 'உண்மை சோதனை', bn: 'তথ্য যাচাই', mr: 'तथ्य तपासणी' },
  DOCUMENT_HELP: { en: 'Document Help', hi: 'दस्तावेज़ सहायता', ta: 'ஆவண உதவி', bn: 'নথি সাহায্য', mr: 'कागदपत्र मदत' },
  CORRECTION_TRANSFER: { en: 'Correction / Transfer', hi: 'सुधार / स्थानांतरण', ta: 'திருத்தம் / மாற்றம்', bn: 'সংশোধন / স্থানান্তর', mr: 'सुधारणा / हस्तांतरण' },
  ELECTION_SCHEDULE: { en: 'Election Schedule', hi: 'चुनाव कार्यक्रम', ta: 'தேர்தல் அட்டவணை', bn: 'নির্বাচন সূচি', mr: 'निवडणूक वेळापत्रक' },
  RESULT_INFO: { en: 'Election Results', hi: 'चुनाव परिणाम', ta: 'தேர்தல் முடிவுகள்', bn: 'নির্বাচনের ফলাফল', mr: 'निवडणूक निकाल' },
  GENERAL_CIVIC: { en: 'Civic Education', hi: 'नागरिक शिक्षा', ta: 'குடிமை கல்வி', bn: 'নাগরিক শিক্ষা', mr: 'नागरी शिक्षण' },
  GREETING: { en: 'Greeting', hi: 'अभिवादन', ta: 'வாழ்த்து', bn: 'অভিবাদন', mr: 'अभिवादन' },
  GENERAL: { en: '', hi: '', ta: '', bn: '', mr: '' },
};

function mkIntent(id: keyof typeof labels, keywords: string[], phrases: string[]): [string, { keywords: string[]; phrases: string[]; label: string; labelLocalized: Record<string, string> }] {
  return [id, { keywords, phrases, label: labels[id].en, labelLocalized: labels[id] }];
}

export const dictionary: IntentDictionary = Object.fromEntries([
  mkIntent('ELIGIBILITY_CHECK', [
    // English
    'eligible','eligibility','qualify','age','old enough','18','seventeen','can i vote','voter age','minimum age','age limit','age requirement','criteria','who can vote','first time','young voter','allowed','vote',
    // Hindi
    'पात्र','पात्रता','योग्य','योग्यता','उम्र','आयु','क्या मैं वोट','मतदान कर सकता','मतदान कर सकती','पहली बार','नया मतदाता','कितने साल','18 साल','अठारह',
    // Tamil
    'தகுதி','தகுதியான','வயது','வாக்களிக்க முடியுமா','முதல் முறை','புதிய வாக்காளர்','18 வயது',
    // Bengali
    'যোগ্য','যোগ্যতা','বয়স','ভোট দিতে পারি','প্রথমবার','নতুন ভোটার','১৮ বছর',
    // Marathi
    'पात्र','पात्रता','वय','मतदान करू शकतो','पहिल्यांदा','नवीन मतदार','१८ वर्षे'
  ], [
    'can i vote','am i eligible','am i old enough','check my eligibility','voter eligibility','who is eligible',
    'क्या मैं वोट दे सकता हूँ','क्या मैं पात्र हूँ','मेरी पात्रता जाँचें','मतदान के लिए पात्र',
    'நான் வாக்களிக்க முடியுமா','தகுதி சரிபார்க்க','என் தகுதி என்ன',
    'আমি কি ভোট দিতে পারি','আমি কি যোগ্য','আমার যোগ্যতা যাচাই',
    'मी मतदान करू शकतो का','मी पात्र आहे का'
  ]),

  mkIntent('REGISTRATION_HELP', [
    'register','registration','registraton','form 6','enroll','enrol','sign up','signup','apply','new voter','voter id','epic','voter card','how to register','voter list','electoral roll','name add',
    'पंजीकरण','पंजीकृत','रजिस्टर','फॉर्म 6','नामांकन','नाम जोड़ें','वोटर आईडी','मतदाता पहचान पत्र','वोटर कार्ड','वोटर लिस्ट','मतदाता सूची','नया पंजीकरण',
    'பதிவு','பதிவு செய்','படிவம் 6','புதிய வாக்காளர்','வாக்காளர் அட்டை','வாக்காளர் பட்டியல்',
    'নিবন্ধন','রেজিস্টার','ফর্ম ৬','ভোটার আইডি','ভোটার কার্ড','ভোটার তালিকা','নাম যোগ',
    'नोंदणी','रजिस्टर','फॉर्म ६','मतदार ओळखपत्र','मतदार यादी','नाव जोडा'
  ], [
    'how to register','how do i register','how can i enroll','voter registration','new voter registration','get voter id','apply for voter id','add my name',
    'पंजीकरण कैसे करें','वोटर आईडी कैसे बनवाएं','नाम कैसे जोड़ें','मतदाता सूची में नाम',
    'பதிவு செய்வது எப்படி','வாக்காளர் அட்டை பெறுவது எப்படி',
    'কিভাবে নিবন্ধন করব','ভোটার আইডি কিভাবে পাব',
    'नोंदणी कशी करावी','मतदार ओळखपत्र कसे मिळवावे'
  ]),

  mkIntent('BOOTH_LOOKUP', [
    'booth','polling station','polling booth','where to vote','voting center','voting centre','station','locate','find booth','my booth','assigned','which booth','nearest',
    'बूथ','मतदान केंद्र','कहाँ वोट','कहां वोट','मेरा बूथ','निकटतम','नजदीकी',
    'சாவடி','வாக்குச்சாவடி','எங்கே வாக்களிப்பது','என் சாவடி',
    'বুথ','ভোটকেন্দ্র','কোথায় ভোট','আমার বুথ',
    'बूथ','मतदान केंद्र','कुठे मतदान','माझा बूथ'
  ], [
    'where do i vote','where is my booth','find my polling station','which polling station','where to go to vote','where should i vote',
    'मैं कहाँ वोट दूँ','मेरा मतदान केंद्र कहाँ है','बूथ कैसे खोजें',
    'நான் எங்கே வாக்களிப்பது','என் வாக்குச்சாவடி எங்கே',
    'আমি কোথায় ভোট দেব','আমার বুথ কোথায়',
    'मी कुठे मतदान करू','माझा बूथ कुठे आहे'
  ]),

  mkIntent('CANDIDATE_INFO', [
    'candidate','candidates','party','parties','who to vote','profile','contestant','contesting','standing','nominee','running','political','leader','mp','mla','mla candidate',
    'उम्मीदवार','प्रत्याशी','पार्टी','दल','किसे वोट दूं','नेता','सांसद','विधायक',
    'வேட்பாளர்','கட்சி','யாருக்கு வாக்களிப்பது','தலைவர்',
    'প্রার্থী','দল','কাকে ভোট দেব','নেতা','সাংসদ','বিধায়ক',
    'उमेदवार','पक्ष','कोणाला मत द्यावे','नेता','खासदार','आमदार'
  ], [
    'who is contesting','who are the candidates','tell me about candidates','candidate list','candidate profile','which party',
    'उम्मीदवार कौन हैं','किसे वोट दें','प्रत्याशियों की जानकारी',
    'வேட்பாளர்கள் யார்','வேட்பாளர் பட்டியல்',
    'প্রার্থীরা কারা','কাদের মধ্যে প্রতিদ্বন্দ্বিতা',
    'उमेदवार कोण आहेत','उमेदवार यादी'
  ]),

  mkIntent('COMPLAINT_SUPPORT', [
    'complaint','violation','report','cvigil','c-vigil','grievance','bribery','bribe','money distribution','booth capture','intimidation','threat','rigging','malpractice','illegal',
    'शिकायत','उल्लंघन','रिपोर्ट','सीविजिल','रिश्वत','धन वितरण','बूथ कब्जा','धमकी','गड़बड़ी','अवैध',
    'புகார்','மீறல்','சிவிஜில்','லஞ்சம்','அச்சுறுத்தல்','முறைகேடு',
    'অভিযোগ','লঙ্ঘন','সিভিজিল','ঘুষ','ভয়ভীতি','অনিয়ম',
    'तक्रार','उल्लंघन','सीव्हिजिल','लाच','धमकी','गैरव्यवहार'
  ], [
    'report a violation','file a complaint','election violation','lodge complaint','how to report','report malpractice',
    'शिकायत कैसे करें','उल्लंघन की रिपोर्ट','शिकायत दर्ज',
    'புகார் செய்வது எப்படி','மீறலை புகாரளிக்க',
    'অভিযোগ কিভাবে করব','লঙ্ঘন রিপোর্ট করতে',
    'तक्रार कशी करावी','उल्लंघनाची तक्रार'
  ]),

  mkIntent('VOTING_EXPLANATION', [
    'how to vote','evm','vvpat','machine','ballot','button','press','cast vote','casting','process','procedure','step','voting day','election day','ink','indelible',
    'कैसे वोट करें','ईवीएम','वीवीपैट','मशीन','बटन','मतदान कैसे','मतदान प्रक्रिया','स्याही',
    'எப்படி வாக்களிப்பது','இவிஎம்','வாக்குப்பதிவு இயந்திரம்','பொத்தான்','மை',
    'কিভাবে ভোট দেব','ইভিএম','ভোটদান প্রক্রিয়া','বোতাম','কালি',
    'कसे मतदान करावे','ईव्हीएम','मतदान प्रक्रिया','बटण','शाई'
  ], [
    'how do i vote','how to use evm','what is vvpat','voting process','how does voting work','how to cast vote','explain voting','step by step voting',
    'वोट कैसे दें','ईवीएम कैसे काम करता है','मतदान प्रक्रिया क्या है',
    'வாக்களிப்பது எப்படி','இவிஎம் எப்படி வேலை செய்கிறது',
    'ভোট কিভাবে দেব','ইভিএম কিভাবে কাজ করে',
    'मतदान कसे करायचे','ईव्हीएम कसे काम करते'
  ]),

  mkIntent('FACT_CHECK', [
    'fake','rumor','rumour','misinformation','true','false','myth','hoax','verify','fact','propaganda','misleading','disinformation','claim',
    'झूठ','अफवाह','गलत जानकारी','सच','झूठा','प्रचार','भ्रामक',
    'பொய்','வதந்தி','தவறான தகவல்','உண்மை','பிரச்சாரம்',
    'মিথ্যা','গুজব','ভুল তথ্য','সত্য','প্রচার',
    'खोटे','अफवा','चुकीची माहिती','खरे','प्रचार'
  ], [
    'is this true','fact check','is it fake','verify this claim','check this news',
    'क्या यह सच है','तथ्य जाँच','यह झूठ है क्या',
    'இது உண்மையா','உண்மை சோதனை',
    'এটা কি সত্য','তথ্য যাচাই',
    'हे खरे आहे का','तथ्य तपासणी'
  ]),

  mkIntent('DOCUMENT_HELP', [
    'document','documents','id proof','identity','aadhaar','aadhar','passport','pan card','driving license','id card','photo id','proof','marksheet','birth certificate',
    'दस्तावेज़','पहचान पत्र','आधार','पासपोर्ट','पैन कार्ड','ड्राइविंग लाइसेंस','प्रमाण पत्र','जन्म प्रमाणपत्र',
    'ஆவணம்','அடையாள அட்டை','ஆதார்','பாஸ்போர்ட்','பான் கார்டு','பிறப்பு சான்றிதழ்',
    'নথি','পরিচয়পত্র','আধার','পাসপোর্ট','প্যান কার্ড','জন্ম সনদ',
    'कागदपत्र','ओळखपत्र','आधार','पासपोर्ट','पॅन कार्ड','जन्म प्रमाणपत्र'
  ], [
    'what documents do i need','which id to carry','documents required','id proof for voting','what to bring',
    'कौन से दस्तावेज़ चाहिए','कौन सा आईडी लाना है','वोट के लिए क्या चाहिए',
    'என்ன ஆவணங்கள் தேவை','எந்த அடையாள அட்டை',
    'কোন নথি লাগবে','কোন আইডি আনতে হবে',
    'कोणती कागदपत्रे लागतात','कोणते ओळखपत्र'
  ]),

  mkIntent('CORRECTION_TRANSFER', [
    'correction','correct','change','update','transfer','shift','form 8','form 7','modify','edit','wrong','mistake','spelling','address change','name change','delete',
    'सुधार','बदलें','स्थानांतरण','फॉर्म 8','फॉर्म 7','गलत','गलती','पता बदलें','नाम बदलें',
    'திருத்தம்','மாற்றம்','படிவம் 8','படிவம் 7','தவறு','முகவரி மாற்றம்',
    'সংশোধন','পরিবর্তন','স্থানান্তর','ফর্ম ৮','ফর্ম ৭','ভুল','ঠিকানা পরিবর্তন',
    'सुधारणा','बदल','हस्तांतरण','फॉर्म ८','फॉर्म ७','चूक','पत्ता बदल'
  ], [
    'change my address','correct my name','transfer my vote','wrong details','update voter id','delete my name',
    'पता कैसे बदलें','नाम कैसे सुधारें','वोटर आईडी में सुधार',
    'முகவரி மாற்றுவது எப்படி','பெயர் திருத்தம்',
    'ঠিকানা পরিবর্তন করতে','নাম সংশোধন করতে',
    'पत्ता कसा बदलावा','नाव कसे सुधारावे'
  ]),

  mkIntent('ELECTION_SCHEDULE', [
    'election date','election schedule','when','next election','election time','upcoming','schedule','dates','phase','polling date','election calendar',
    'चुनाव कब','चुनाव तारीख','अगला चुनाव','चुनाव कार्यक्रम',
    'தேர்தல் எப்போது','தேர்தல் தேதி','அடுத்த தேர்தல்',
    'নির্বাচন কবে','নির্বাচনের তারিখ','পরবর্তী নির্বাচন',
    'निवडणूक कधी','निवडणूक तारीख','पुढील निवडणूक'
  ], [
    'when is the next election','election date','upcoming elections','election schedule','when do we vote',
    'अगला चुनाव कब है','चुनाव की तारीख','आगामी चुनाव',
    'அடுத்த தேர்தல் எப்போது','தேர்தல் அட்டவணை',
    'পরবর্তী নির্বাচন কবে','নির্বাচনের সময়সূচি',
    'पुढील निवडणूक कधी','निवडणूक वेळापत्रक'
  ]),

  mkIntent('RESULT_INFO', [
    'result','results','who won','winner','count','counting','tally','victory','margin','seat','seats',
    'परिणाम','कौन जीता','विजेता','गिनती','मतगणना',
    'முடிவு','யார் வென்றார்','வெற்றி','எண்ணிக்கை',
    'ফলাফল','কে জিতেছে','বিজয়ী','গণনা',
    'निकाल','कोण जिंकले','विजेता','मतमोजणी'
  ], [
    'election results','who won the election','counting of votes',
    'चुनाव परिणाम','कौन जीता','मतगणना कब',
    'தேர்தல் முடிவுகள்','யார் வென்றார்',
    'নির্বাচনের ফলাফল','কে জিতেছে',
    'निवडणूक निकाल','कोण जिंकले'
  ]),

  mkIntent('GENERAL_CIVIC', [
    'democracy','right','rights','constitution','fundamental','duty','duties','citizen','citizenship','parliament','lok sabha','rajya sabha','assembly','legislature',
    'लोकतंत्र','अधिकार','संविधान','मौलिक','कर्तव्य','नागरिक','संसद','लोक सभा','राज्य सभा','विधानसभा',
    'ஜனநாயகம்','உரிமை','அரசியலமைப்பு','கடமை','குடிமகன்','நாடாளுமன்றம்',
    'গণতন্ত্র','অধিকার','সংবিধান','কর্তব্য','নাগরিক','সংসদ',
    'लोकशाही','अधिकार','संविधान','कर्तव्य','नागरिक','संसद'
  ], [
    'what is democracy','my rights','fundamental rights','duties of citizen',
    'लोकतंत्र क्या है','मेरे अधिकार','नागरिक कर्तव्य',
    'ஜனநாயகம் என்றால் என்ன','என் உரிமைகள்',
    'গণতন্ত্র কি','আমার অধিকার',
    'लोकशाही म्हणजे काय','माझे अधिकार'
  ]),

  mkIntent('GREETING', [
    'hello','hi','hey','good morning','good evening','good afternoon','namaste','namaskar','thanks','thank you','help','assist',
    'नमस्ते','नमस्कार','धन्यवाद','शुक्रिया','मदद',
    'வணக்கம்','நன்றி','உதவி',
    'নমস্কার','ধন্যবাদ','সাহায্য',
    'नमस्कार','धन्यवाद','मदत'
  ], [
    'hello there','hi there','good morning','i need help','can you help',
    'नमस्ते जी','मदद चाहिए','कृपया मदद करें',
    'வணக்கம்','உதவி தேவை',
    'নমস্কার','সাহায্য দরকার',
    'नमस्कार','मदत हवी'
  ]),

  mkIntent('GENERAL', [], []),
]) as IntentDictionary;
