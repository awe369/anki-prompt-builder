(function () {
  var D = window.APB_DATA;
  var PREV = window.APB_PREV || "prev/";
  var $ = function (id) { return document.getElementById(id); };
  var KEY = "anki-prompt-builder-v8";
  var ids = ["date", "size", "exam", "lang", "deck", "topic", "wish", "cstyle"];
  var checks = ["x-ncert", "x-wiki", "x-ca", "x-pib", "pyq"];
  var GRP = {
    smartbasic: { name: "✦ Smart Basic", rep: "sb-compare", best: "Sabse versatile basic card — 10 modes ek saath (Q/A, list, steps, compare, MCQ, T/F, case, article, date, vocab). AI har fact ke liye sahi mode khud chunega.", subj: ["All subjects"] },
    smartcloze: { name: "✦ Smart Cloze", rep: "sc-timeline", best: "Sabse versatile cloze — 11 layouts ek saath (notes, focus, timeline, list, table, flow, mind map, article, viva, formula, map). AI har topic ke liye sahi layout khud chunega.", subj: ["All subjects"] }
  };
  function gk(g) { return D.types.filter(function (x) { return x.grp === g; }).map(function (x) { return x.k; }); }
  var DEF_SEL = gk("smartbasic").concat(gk("smartcloze"), ["cloze"]);
  var EXP = { smartbasic: false, smartcloze: false };
  var DEFAULTS = { size: "auto", exam: "UPSC Prelims + UPPSC PCS", lang: "English, Hindi terms in brackets; memory tricks may be in Hinglish", deck: "UPSC::Polity", topic: "", wish: "", cstyle: "focus", "x-ncert": true, "x-wiki": true, "x-ca": true, "x-pib": true, pyq: true, deckmode: "ask", sel: DEF_SEL };
  var BYK = {}; D.types.forEach(function (t) { BYK[t.k] = t; });
  function BYK0(k) { return BYK[k] || { name: k }; }
  var LIVE = {"comeback": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl y\">Trigger</span>\n  <div class=\"cue\">{{Situation}}</div>\n  <div class=\"said\">“{{They Said}}”</div>\n  <div class=\"do\">🗣️ 5 second — apna jawab zor se bolo, phir flip</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl y\">Trigger</span>\n  <div class=\"cue\">{{Situation}}</div>\n  <div class=\"said\">“{{They Said}}”</div>\n  <hr class=\"sep\">\n  <span class=\"lbl g\">Move — {{Move}}</span>\n  <div class=\"lines\">{{Lines}}</div>\n  <div class=\"box\"><b>Kyun chalta hai:</b> {{Why It Works}}</div>\n  {{#Trap}}<div class=\"box bad\"><b>⚠ Trap:</b> {{Trap}}</div>{{/Trap}}\n  {{#Memory}}<details class=\"pop\"><summary>🧠 Memory hook</summary><div class=\"in\">{{Memory}}</div></details>{{/Memory}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Situation": "Rishtedaar, family function", "They Said": "Itni age ho gayi, shaadi kab karoge?", "Move": "Agree &amp; Amplify", "Lines": "“Sahi keh rahe ho, age to ho gayi — abhi karte hain, bas 2 ghante me. Time ho to aa jaana.”<br>“Haan ji, itni der ho gayi ki ab to seedha pota chahiye.”", "Why It Works": "Insult ko accept karke itna <b>exaggerate</b> kar do ki wo bethuka lage — ab mazaak tumhare control me hai, unke nahi.", "Trap": "Zara bhi safai di (“abhi time hai, dekhte hain”) to defensive dikh gaye aur move mar gaya.", "Memory": "Agree » Amplify » Absurd.", "Source": "Sense of humour frameworks (YouTube)"}}, "framework": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl\">Framework</span>\n  <div class=\"said\">{{Framework}}</div>\n  <div class=\"do\">Steps, kaam karne ki wajah, aur kab fail hota hai — bolo</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl\">Framework</span>\n  <div class=\"said\">{{Framework}}</div>\n  <div class=\"ans\"><span class=\"hl\">{{Hook}}</span></div>\n  <hr class=\"sep\">\n  <div class=\"cue\">Steps</div>\n  <div class=\"lines\">{{Steps}}</div>\n  <div class=\"box\"><b>Kyun chalta hai:</b> {{Works Because}}</div>\n  <div class=\"box bad\"><b>⚠ Fail kab hota hai:</b> {{Fails When}}</div>\n  {{#Example}}<details class=\"pop\"><summary>🎬 Example</summary><div class=\"in\">{{Example}}</div></details>{{/Example}}\n  {{#Memory}}<details class=\"pop\"><summary>🧠 Memory hook</summary><div class=\"in\">{{Memory}}</div></details>{{/Memory}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Framework": "Role Play", "Hook": "Apni normal personality se ulta character 2 minute ke liye odh lo.", "Steps": "1. Apni default quality pehchano (shaant, humble, formal).<br>2. Uska <b>ulta</b> character chuno (loud, arrogant, over-confident).<br>3. Thodi der usi me bolo, phir normal par aa jao.", "Works Because": "Humour surprise par chalta hai. Jitna zyada contrast tumhari asli personality se, utna zyada entertainment — log tumhe predict nahi kar paate.", "Fails When": "Character tumhari normal personality jaisa hi ho (koi contrast nahi), ya tum usme phans kar sach me arrogant lagne lago.", "Example": "Dwayne Johnson normally humble hai, par “The Rock” hyper-confident, loud aur attention-seeker hai — isliye har entry par surprise milta hai.", "Memory": "Ulta character = surprise. Shaant ho to loud bano.", "Source": "Sense of humour frameworks (YouTube)"}}, "weakstrong": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl y\">Situation</span>\n  <div class=\"cue\">{{Situation}}</div>\n  <div class=\"box bad\"><span class=\"lbl r\">Weak</span><div class=\"ans\">{{Weak Reply}}</div></div>\n  <div class=\"do\">Isme kya mara? Ab strong version bolo</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl y\">Situation</span>\n  <div class=\"cue\">{{Situation}}</div>\n  <div class=\"box bad\"><span class=\"lbl r\">Weak</span><div class=\"ans\">{{Weak Reply}}</div></div>\n  <div class=\"box good\"><span class=\"lbl g\">Strong</span><div class=\"ans\">{{Strong Reply}}</div></div>\n  <hr class=\"sep\">\n  <div class=\"cue\">Farak kya hai</div>\n  <div class=\"lines\">{{What Changed}}</div>\n  <div class=\"box\"><b>Rule:</b> {{Principle}}</div>\n  {{#Extra}}<details class=\"pop\"><summary>💡 Why</summary><div class=\"in\">{{Extra}}</div></details>{{/Extra}}\n  {{#Memory}}<details class=\"pop\"><summary>🧠 Memory hook</summary><div class=\"in\">{{Memory}}</div></details>{{/Memory}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Situation": "Doston ke group ne tumpe point maar diya", "Weak Reply": "“Yaar aisa mat bolo, bura lagta hai.”", "Strong Reply": "Halke se hansna aur wahi baat unke hi kisi dikhte hue nuks par laut ke maar dena — ya baat ko hawa me uda dena.", "What Changed": "Response me <b>request</b> khatam — ab dikh raha hai ki tumhe farak hi nahi padta.", "Principle": "Jo cheez tumhe matter karti dikhti hai, wahi agla target banti hai.", "Extra": "Bura lagna dikhane se group ko pata chal jaata hai ki button kahan hai, aur wahi button baar baar dabta hai.<br>🧠 <b>Trick:</b> Request dikhi = target bani.", "Memory": "Farak nahi padta — yahi poora jawab hai.", "Source": "SRK sense of humour secrets (YouTube)"}}, "scene": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl y\">Clip</span>\n  <div class=\"cue\">{{Clip}}</div>\n  <div class=\"said\" style=\"font-size:19px\">{{cloze:Text}}</div>\n  <div class=\"do\">🗣️ Line bolo — phir flip</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl y\">Clip</span>\n  <div class=\"cue\">{{Clip}}</div>\n  <div class=\"said\" style=\"font-size:19px\">{{cloze:Text}}</div>\n  <hr class=\"sep\">\n  {{#Move}}<span class=\"lbl g\">Move — {{Move}}</span>{{/Move}}\n  {{#Extra}}<div class=\"box\"><b>Usne kiya kya:</b> {{Extra}}</div>{{/Extra}}\n  {{#Memory}}<details class=\"pop\"><summary>🧠 Memory hook</summary><div class=\"in\">{{Memory}}</div></details>{{/Memory}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Clip": "SRK, Ask SRK — ek banda umar aur daadhi par taunt karta hai", "Text": "<b>Fan:</b> Teri kya umar hai? Daadhi ko dye kiya na tune?<br><b>SRK:</b> {{c1::“Dye ki na daadhi tune, phir kya bol raha hai mujhse.”::Usne taunt ko kaise palat diya?}}", "Move": "Target the visible quirk", "Extra": "Safai dene ke bajaye saamne wale ki apni dikhti hui cheez par wahi baat laut ke maar di — poora exchange 2 second me unke paale me chala gaya.", "Memory": "Jo nuks dikh raha hai, wahi laut ke maaro.", "Source": "SRK sense of humour secrets (YouTube)"}}, "rep": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl y\">Aaj ka rep</span>\n  <div class=\"said\">{{Rep}}</div>\n  <div class=\"cue\">Trigger — {{Trigger}}</div>\n  {{#How Long}}<div class=\"cue\">Kitna — {{How Long}}</div>{{/How Long}}\n  <div class=\"do\">✅ Aaj karo, phir flip karke check karo</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl y\">Aaj ka rep</span>\n  <div class=\"said\">{{Rep}}</div>\n  <hr class=\"sep\">\n  <div class=\"box good\"><span class=\"lbl g\">Hua ya nahi</span><div class=\"ans\">{{Success Looks Like}}</div></div>\n  <div class=\"box\"><b>Kyun:</b> {{Why}}</div>\n  {{#Extra}}<details class=\"pop\"><summary>⚠ Pehli baar me kya bigadta hai</summary><div class=\"in\">{{Extra}}</div></details>{{/Extra}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Rep": "Jab bhi koi tumpe point maare ya tease kare, bolne se pehle 2 second <b>face muscles consciously relax</b> karo — phir jawab do.", "Trigger": "Koi taunt, mazaak ya unexpected sawal", "How Long": "Aaj bhar, har baar", "Success Looks Like": "Jawab dete waqt saans normal thi aur line tumhare control me nikli — jhatke me nahi.", "Why": "Video ka claim: chehre ki 43 muscles se saamne wala subconsciously tumhara state padhta hai. Relaxed face “mujhe farak nahi padta” signal bhejta hai, aur tumhara apna brain bhi defence mode se bahar aata hai.", "Extra": "Pehli baar me yaad hi nahi aata — isliye ek physical cue chuno (jabda dheela karna) jo trigger ke saath juda ho.<br>🧠 <b>Trick:</b> Pehle chehra dheela, phir mooh chalu.", "Source": "SRK sense of humour secrets (YouTube)"}}, "linebank": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl y\">Line</span>\n  <div class=\"said\" style=\"font-size:21px\">{{cloze:Text}}</div>\n  <div class=\"do\">🗣️ Poori line bolo</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl y\">Line</span>\n  <div class=\"said\" style=\"font-size:21px\">{{cloze:Text}}</div>\n  <hr class=\"sep\">\n  {{#Extra}}<div class=\"box\">{{Extra}}</div>{{/Extra}}\n  {{#Memory}}<details class=\"pop\"><summary>🧠 Memory hook</summary><div class=\"in\">{{Memory}}</div></details>{{/Memory}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Text": "Boring topic se apne wale topic par aane ke liye sabse easy line hai — {{c1::“X ke baare me tumhari kya rai hai?”::Kaunsi line?}}", "Extra": "<b>Kab:</b> Jab baat mausam, cricket ya “ghar par sab kaise hain” me atak jaaye.<br><b>Kyun:</b> Logon ko apni rai dena pasand hai, isliye ye sawal kabhi reject nahi hota — aur X me tum apna interest daal dete ho.", "Memory": "Rai maango, topic ghuma lo.", "Source": "Small talk for introverts (YouTube)"}}, "convladder": {"pal": "std", "front": "<div class=\"pp\">\n  <span class=\"lbl y\">Goal</span>\n  <div class=\"cue\">{{Goal}}</div>\n  <div class=\"said\">“{{Their Line 1}}”</div>\n  <div class=\"do\">🗣️ Teri pehli line?</div>\n</div>", "back": "<div class=\"pp back\">\n  <span class=\"lbl y\">Goal</span>\n  <div class=\"cue\">{{Goal}}</div>\n  <div class=\"said\">“{{Their Line 1}}”</div>\n  <div class=\"box good\"><span class=\"lbl g\">Move 1</span><div class=\"ans\">{{Your Move 1}}</div></div>\n  {{#Their Line 2}}<details class=\"pop\"><summary>▸ Ab unhone kaha…</summary><div class=\"in\">\n    <div class=\"said\" style=\"font-size:19px\">“{{Their Line 2}}”</div>\n    <div class=\"do\">🗣️ Teri dusri line?</div>\n    <details class=\"pop\"><summary>Move 2 dikhao</summary><div class=\"in\">{{Your Move 2}}</div></details>\n  </div></details>{{/Their Line 2}}\n  <div class=\"box\"><b>Rule:</b> {{Principle}}</div>\n  {{#Memory}}<details class=\"pop\"><summary>🧠 Memory hook</summary><div class=\"in\">{{Memory}}</div></details>{{/Memory}}\n  {{#Source}}<div class=\"src\">📚 {{Source}}</div>{{/Source}}\n</div>", "sample": {"Goal": "Closed-ended boring sawal se ek asli topic tak pahunchna", "Their Line 1": "Aur sunao, movies waghera dekhne jaate ho kabhi?", "Your Move 1": "“Haan, par aajkal main theatre se zyada ek hi scene baar baar dekhta hoon…” — chhote sawal ka <b>lamba</b> jawab, taaki baat pakadne ke liye kuch mile.", "Their Line 2": "Achha? Woh kaise?", "Your Move 2": "“Ek cheez batao, tumhari kya rai hai — ______?” — ab jaanbujh kar apne interest wale topic par pivot.", "Principle": "Log bore sawal poochte hain; tumhara kaam un par rukna nahi, unhe apne interesting topic tak le jaana hai.", "Memory": "Chhota sawal » lamba jawab » apna topic.", "Source": "Small talk for introverts (YouTube)"}}, "mentalmodel": {"pal": "mm", "front": "<div class=\"mm\">\n  <span class=\"mml\">Mental model</span>\n  <div class=\"mmt\">{{Model}}</div>\n  <div class=\"mmdo\">Ye lens kya kehta hai? Kab lagta hai? Tab karna kya hai — bolo</div>\n</div>", "back": "<div class=\"mm back\">\n  <span class=\"mml\">Mental model</span>\n  <div class=\"mmt\">{{Model}}</div>\n  <div class=\"mmkey\">{{In One Line}}</div>\n  <div class=\"mmrule\"></div>\n  <div class=\"mmlab\">Idea</div>\n  <div class=\"mmtx\">{{The Idea}}</div>\n  <div class=\"mmrow\">\n    <div class=\"mmcell\"><div class=\"mmlab\">Kab pehchano</div><div class=\"mmtx\">{{Spot It}}</div></div>\n    <div class=\"mmcell\"><div class=\"mmlab\">Tab karo</div><div class=\"mmtx\">{{Use It}}</div></div>\n  </div>\n  {{#Example}}<details class=\"mmp\"><summary>Example</summary><div class=\"mmin\">{{Example}}</div></details>{{/Example}}\n  {{#Flip Side}}<details class=\"mmp warn\"><summary>Flip side — kab dhokha deta hai</summary><div class=\"mmin\">{{Flip Side}}</div></details>{{/Flip Side}}\n  {{#Memory}}<div class=\"mmmem\">{{Memory}}</div>{{/Memory}}\n  {{#Source}}<div class=\"mmsrc\">{{Source}}</div>{{/Source}}\n</div>", "sample": {"Model": "Defence Mode", "In One Line": "Jo cheez bachani hai, wahi dimaag band kar deti hai.", "The Idea": "Jaise hi izzat khatre me lagti hai, dimaag defend karne me lag jaata hai — aur us waqt koi jawab nahi sujhta. Pressure hatte hi wahi saare jawab apne aap aa jaate hain. Matlab talent ki kami nahi thi, mode galat tha.", "Spot It": "Koi baat chubhi aur tumhara pehla reflex safai dena ya chup ho jaana tha — aur sahi line 10 minute baad yaad aayi.", "Use It": "Jawab dhoondhne se pehle daav hatao: maan lo ki is ek line se kuch nahi bigadta. Chehra dheela, ek saans — phir bolo.", "Example": "Jo log apne upar mazaak nahi sah paate, group unhi ko sabse zyada target karta hai — kyunki wo hamesha defence mode me rehte hain.", "Flip Side": "Har jagah defence galat nahi hota. Jahan sach me line paar ho rahi ho, wahan “farak nahi padta” wala mode nahi, seedhi baat chahiye.", "Your Case": "Pichle hafte kis ek baat par tum defence mode me gaye the? Wahi situation dobara aaye to pehla kadam kya hoga?", "Memory": "Daav hatao, dimaag khulega.", "Source": "SRK sense of humour secrets (YouTube)"}}, "playbook": {"pal": "ap", "front": "<div class=\"ap\">\n  <span class=\"apl\">Situation</span>\n  <div class=\"apw\">{{When}}</div>\n  <div class=\"apdo\">Ab exactly kya karoge? Steps bolo</div>\n</div>", "back": "<div class=\"ap back\">\n  <span class=\"apl\">Situation</span>\n  <div class=\"apw sm\">{{When}}</div>\n  <div class=\"aprule\"></div>\n  <div class=\"apm\">{{Move}}</div>\n  <div class=\"apsteps\">{{Steps}}</div>\n  {{#Say This}}<div class=\"apsay\"><span class=\"apk\">Bolo</span>{{Say This}}</div>{{/Say This}}\n  {{#Avoid}}<div class=\"apno\"><span class=\"apk r\">Mat karo</span>{{Avoid}}</div>{{/Avoid}}\n  {{#Check}}<div class=\"apchk\">✔ {{Check}}</div>{{/Check}}\n  {{#Why It Works}}<details class=\"app\"><summary>Kyun chalta hai</summary><div class=\"apin\">{{Why It Works}}</div></details>{{/Why It Works}}\n  {{#Source}}<div class=\"apsrc\">{{Source}}</div>{{/Source}}\n</div>", "sample": {"Move": "X + 1", "When": "Kisi bhi interaction me — lift, cashier, chai wala, naya banda party me", "Steps": "1. Pehchano ki yahan ka <b>minimum</b> kya hai (lift me chuppi, cashier ko thank you).<br>2. Us minimum ko poora karo — normal raho.<br>3. Usme <b>ek</b> chhoti cheez jodo: ek observation, ek tareef, ya ek chhota sawal.<br>4. Reaction ka intezaar mat karo — jodna hi kaafi hai, aage badh jao.", "Say This": "“Ye jacket mast hai — kahan se li?” &nbsp;·&nbsp; “Aaj to bheed kam hai, chain mili hogi aapko.”", "Avoid": "Plus one ko bada mat banao — lambi baat, joke sunana, ya tareef ke baad reaction ghoorna. Chhota hi rehna chahiye.", "Why It Works": "Log wo yaad nahi rakhte jo zaroori tha; wo yaad rakhte hain jo zaroori se <b>thoda zyada</b> tha. 100% nahi, 101% yaad rehta hai.", "Check": "Din khatam hone tak kam se kam 3 jagah tumne ek-ek cheez jodi.", "Source": "Charisma = X + 1 (YouTube)"}}, "mantra": {"pal": "mn", "front": "<div class=\"mn\">\n  <span class=\"mnl\">Kab</span>\n  <div class=\"mnw\">{{Say It When}}</div>\n  <div class=\"mndo\">Apna mantra bolo</div>\n</div>", "back": "<div class=\"mn back\">\n  <div class=\"mnbig\">{{Mantra}}</div>\n  {{#Means}}<div class=\"mnmean\">{{Means}}</div>{{/Means}}\n  <div class=\"mnrule\"></div>\n  <span class=\"mnl\">Kab</span>\n  <div class=\"mnw sm\">{{Say It When}}</div>\n  {{#Where From}}<details class=\"mnp\"><summary>Idea</summary><div class=\"mnin\">{{Where From}}</div></details>{{/Where From}}\n  {{#Source}}<div class=\"mnsrc\">{{Source}}</div>{{/Source}}\n</div>", "sample": {"Mantra": "Ready nahi aata. Shuru karne se aata hai.", "Means": "Taiyaar mehsoos hone ka intezaar mat karo — wo feeling shuru karne ke baad aati hai.", "Say It When": "Kaam saamne hai aur mann keh raha hai “thoda aur taiyaari kar lun, phir shuru karunga”", "Where From": "Procrastination laziness nahi hai — wo dimaag ka bachav hai. Kaam poora kar liya to pata chal jaayega ki tum kaafi ho ya nahi; adhoora rakhne se sapna zinda rehta hai.", "Source": "Procrastination is identity protection (YouTube)"}}};
  var LIVECSS = {"std": ".card{background:#faf7f0;color:#15171c;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",system-ui,sans-serif;font-size:19px;line-height:1.55;padding:12px;text-align:left}\n.card.night_mode,.night_mode .card{background:#faf7f0;color:#15171c}\n.pp{max-width:720px;margin:0 auto;background:#fff;border:3px solid #15171c;border-radius:18px;padding:18px;box-shadow:5px 5px 0 #15171c}\n.lbl{display:inline-block;background:#15171c;color:#fff;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:4px 11px;border-radius:999px}\n.lbl.y{background:#ffd400;color:#15171c}\n.lbl.g{background:#15803d;color:#fff}\n.lbl.r{background:#b91c1c;color:#fff}\n.cue{font-size:13.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#5b6472;margin-top:10px}\n.said{font-size:23px;font-weight:800;line-height:1.35;margin-top:8px}\n.ans{font-size:20px;font-weight:800;margin-top:6px}\n.hl{background:#ffe95c;padding:0 3px;border-radius:3px;font-weight:800}\n.sep{border:0;border-top:3px solid #15171c;margin:16px 0}\n.lines{font-size:19px;font-weight:700;line-height:1.6;margin-top:10px}\n.box{border:2px dashed #15171c;border-radius:12px;padding:12px 14px;margin-top:12px;font-size:17px}\n.box.bad{border-style:solid;background:#ffe7e7}\n.box.good{border-style:solid;background:#dff5e3}\n.do{margin-top:16px;background:#15171c;color:#fff;border-radius:12px;padding:11px 14px;font-weight:800;font-size:16px;text-align:center}\ndetails.pop{border:2px solid #15171c;border-radius:12px;margin-top:10px;overflow:hidden}\ndetails.pop>summary{list-style:none;cursor:pointer;background:#15171c;color:#fff;font-size:11.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:9px 13px}\ndetails.pop>summary::-webkit-details-marker{display:none}\ndetails.pop>summary::after{content:\" \\25BE\"}\ndetails.pop[open]>summary::after{content:\" \\25B4\"}\ndetails.pop .in{padding:12px 14px;font-size:17px}\n.src{margin-top:14px;font-size:12.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#5b6472}\n.cloze{color:#d32020;font-weight:800}\n.back .cloze{color:#15803d;background:#dff5e3;border-radius:4px;padding:0 4px}\n@media (max-width:430px){.pp{padding:14px;box-shadow:4px 4px 0 #15171c}.said{font-size:20px}}", "mm": ".card{background:#0b1220;color:#e8eef7;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",system-ui,sans-serif;font-size:19px;line-height:1.55;padding:12px;text-align:left}\n.card.night_mode,.night_mode .card{background:#0b1220;color:#e8eef7}\n.mm{max-width:720px;margin:0 auto;background:#101b2e;border:1px solid rgba(146,180,255,.22);border-radius:16px;padding:20px;background-image:linear-gradient(rgba(146,180,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(146,180,255,.06) 1px,transparent 1px);background-size:26px 26px}\n.mml{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#0b1220;background:#ffb020;padding:3px 10px;border-radius:4px}\n.mml.t{background:#5ad1c4}\n.mmt{font-size:27px;font-weight:800;letter-spacing:-.01em;margin-top:12px;color:#fff;line-height:1.2}\n.mmq{font-size:21px;font-weight:700;margin-top:12px;color:#fff;line-height:1.35}\n.mmkey{font-size:20px;font-weight:700;color:#ffb020;margin-top:12px;border-left:3px solid #ffb020;padding-left:12px}\n.mmrule{border-top:1px solid rgba(146,180,255,.22);margin:16px 0}\n.mmlab{font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#7f9bc4;margin-bottom:5px}\n.mmtx{font-size:17px;color:#dce6f5}\n.mmrow{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}\n.mmcell{flex:1 1 210px;min-width:0;background:rgba(146,180,255,.08);border-radius:12px;padding:12px 14px}\ndetails.mmp{margin-top:12px;border:1px solid rgba(146,180,255,.22);border-radius:12px;overflow:hidden}\ndetails.mmp>summary{list-style:none;cursor:pointer;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#7f9bc4;padding:11px 14px}\ndetails.mmp>summary::-webkit-details-marker{display:none}\ndetails.mmp>summary::after{content:\" +\"}\ndetails.mmp[open]>summary::after{content:\" \\2013\"}\ndetails.mmp.warn>summary{color:#ff9f8a}\ndetails.mmp.act>summary{color:#5ad1c4}\n.mmin{padding:0 14px 14px;font-size:16.5px;color:#dce6f5}\n.mmmem{margin-top:16px;font-size:16px;font-weight:700;color:#5ad1c4}\n.mmsrc{margin-top:14px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#64799c}\n.mmdo{margin-top:18px;border:1px dashed rgba(146,180,255,.35);border-radius:10px;padding:11px 14px;font-size:15px;font-weight:600;color:#9fb7da;text-align:center}\n@media (max-width:430px){.mm{padding:15px}.mmt{font-size:23px}.mmq{font-size:19px}}", "ap": ".card{background:#f2f1ec;color:#15171c;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",system-ui,sans-serif;font-size:19px;line-height:1.55;padding:12px;text-align:left}\n.card.night_mode,.night_mode .card{background:#f2f1ec;color:#15171c}\n.ap{max-width:720px;margin:0 auto;background:#fff;border-radius:14px;padding:20px;border:1px solid #d8d6cd;border-top:6px solid #1f7a4d;box-shadow:0 2px 0 #d8d6cd}\n.apl{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#1f7a4d}\n.apw{font-size:22px;font-weight:800;line-height:1.35;margin-top:6px}\n.apw.sm{font-size:17px;font-weight:600;color:#4a5160}\n.apdo{margin-top:18px;background:#1f7a4d;color:#fff;border-radius:10px;padding:11px 14px;font-weight:700;font-size:15.5px;text-align:center}\n.aprule{border-top:2px solid #e6e4db;margin:16px 0}\n.apm{font-size:21px;font-weight:800;color:#15171c;background:#d9f2e3;display:inline-block;padding:4px 12px;border-radius:8px}\n.apsteps{margin-top:14px;font-size:18px;line-height:1.75;font-weight:600}\n.apsay{margin-top:14px;background:#f4f7ff;border-left:4px solid #2f5bd3;border-radius:0 10px 10px 0;padding:11px 14px;font-size:17.5px;font-weight:600}\n.apno{margin-top:12px;background:#fff0ef;border-left:4px solid #c0392b;border-radius:0 10px 10px 0;padding:11px 14px;font-size:17px}\n.apk{display:block;font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#2f5bd3;margin-bottom:3px}\n.apk.r{color:#c0392b}\n.apchk{margin-top:14px;font-size:16px;font-weight:700;color:#1f7a4d}\ndetails.app{margin-top:12px;border:1px solid #d8d6cd;border-radius:10px;overflow:hidden}\ndetails.app>summary{list-style:none;cursor:pointer;font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#6a7280;padding:10px 13px;background:#f7f6f2}\ndetails.app>summary::-webkit-details-marker{display:none}\ndetails.app>summary::after{content:\" +\"}\ndetails.app[open]>summary::after{content:\" \\2013\"}\n.apin{padding:12px 13px;font-size:16.5px}\n.apsrc{margin-top:14px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8a8f99}\n@media (max-width:430px){.ap{padding:15px}.apw{font-size:19px}.apsteps{font-size:17px}}", "mn": ".card{background:#14110f;color:#f3ead9;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",system-ui,sans-serif;font-size:19px;line-height:1.55;padding:12px;text-align:left}\n.card.night_mode,.night_mode .card{background:#14110f;color:#f3ead9}\n.mn{max-width:720px;margin:0 auto;background:#1b1714;border:1px solid #3a3129;border-radius:16px;padding:26px 22px}\n.mnl{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#e8b23a}\n.mnw{font-size:20px;font-weight:600;margin-top:8px;color:#efe3cd;line-height:1.4}\n.mnw.sm{font-size:16.5px;color:#bfae92}\n.mnbig{font-size:34px;font-weight:800;line-height:1.22;color:#e8b23a;letter-spacing:-.01em;text-align:center;padding:10px 0}\n.mnmean{margin-top:12px;font-size:17px;color:#d9cbb2;text-align:center}\n.mnrule{border-top:1px solid #3a3129;margin:20px 0 16px}\n.mndo{margin-top:22px;border:1px dashed #5a4c3c;border-radius:10px;padding:11px 14px;font-size:15px;font-weight:600;color:#bfae92;text-align:center}\ndetails.mnp{margin-top:14px;border:1px solid #3a3129;border-radius:10px;overflow:hidden}\ndetails.mnp>summary{list-style:none;cursor:pointer;font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#a8906a;padding:10px 13px}\ndetails.mnp>summary::-webkit-details-marker{display:none}\ndetails.mnp>summary::after{content:\" +\"}\ndetails.mnp[open]>summary::after{content:\" \\2013\"}\n.mnin{padding:0 13px 13px;font-size:16.5px;color:#d9cbb2}\n.mnsrc{margin-top:16px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#7a6a55}\n@media (max-width:430px){.mn{padding:20px 16px}.mnbig{font-size:27px}}"};

  function scopeCSS(css, pal) {
    var out = [];
    css.split("\n").forEach(function (line) {
      line = line.trim();
      if (!line || line.indexOf("@media") === 0) return;
      var i = line.indexOf("{"); if (i < 0) return;
      var sel = line.slice(0, i), rest = line.slice(i);
      out.push(sel.split(",").map(function (x) {
        x = x.trim();
        if (x === ".card" || x === ".card.night_mode" || x === ".night_mode .card") return ".ank." + pal;
        return ".ank." + pal + " " + x;
      }).join(",") + rest);
    });
    return out.join("\n");
  }
  (function () {
    var css = "";
    for (var p in LIVECSS) css += scopeCSS(LIVECSS[p], p) + "\n";
    css += ".ank{border-radius:10px;overflow:hidden;padding:10px 8px}";
    css += ".shot.live{display:block;cursor:zoom-in;background:var(--panel);padding:0}";
    css += ".shot.live .lvs{width:172%;transform:scale(.58);transform-origin:top left;pointer-events:none}";
    css += ".mv-live{border:1px solid var(--line);border-radius:10px;overflow:auto;max-height:62vh}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  })();
  function liveRender(k, side) {
    var L = LIVE[k]; if (!L) return "";
    var tpl = side === "a" ? L.back : L.front, f = L.sample;
    var out = tpl.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, function (m, n, b) { return (f[n.trim()] || "") ? b : ""; });
    out = out.replace(/\{\{cloze:([^}]+)\}\}/g, function (m, n) {
      return (f[n.trim()] || "").replace(/\{\{c\d+::(.*?)(?:::(.*?))?\}\}/g, function (mm, a, h) {
        return side === "a" ? '<span class="cloze">' + a + '</span>' : '<span class="cloze">[' + (h || "...") + ']</span>';
      });
    });
    out = out.replace(/\{\{([^#\/][^}]*)\}\}/g, function (m, n) { return f[n.trim()] || ""; });
    return '<div class="ank ' + L.pal + '">' + out + '</div>';
  }
  function liveBox(id, html) {
    var im = $(id), box = $(id + "-live");
    if (!box) { box = document.createElement("div"); box.id = id + "-live"; box.className = "mv-live"; im.parentNode.appendChild(box); }
    box.innerHTML = html; box.hidden = false; im.hidden = true;
  }
  function liveOff(id) { var b = $(id + "-live"); if (b) b.hidden = true; $(id).hidden = false; }

  var SEL = DEF_SEL.slice();
  var STYLE_LABEL = { focus: "Focus", zen: "zen", grade: "Grade", sidhu: "Sidhu Bhai" };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function niceDate(v) { if (!v) return ""; var p = v.split("-"); var m = ["January","February","March","April","May","June","July","August","September","October","November","December"]; return parseInt(p[2], 10) + " " + m[parseInt(p[1], 10) - 1] + " " + p[0]; }
  function mode() { var r = document.querySelector('input[name="deckmode"]:checked'); return r ? r.value : "ask"; }

  /* resolved type: the cloze-style entry takes its name / fields from the dropdown */
  function R(t) {
    if (t.k !== "cloze") return t;
    var cs = D.cstyles[$("cstyle").value] || D.cstyles.focus, f = cs.fields;
    var hasMn = f.indexOf("Mnemonics") > -1, hasSrc = f.indexOf("Source") > -1;
    var o = {}; for (var x in t) o[x] = t[x];
    o.name = cs.name; o.fields = f; o.tr = hasMn ? "Mnemonics" : "Extra";
    o.spec = ["- Text: ONE blank `{{c1::answer::hint}}` per note. **Mix two styles 50 / 50** (alternate them through the deck):",
      "  - **Question style (half the notes):** a direct question, then the blank as its answer on the next line — `Q: Which Article of the Constitution abolishes untouchability?<br>{{c1::Article 17::Article number?}}`.",
      "  - **Fill-in-the-blank style (other half):** one full, self-contained sentence with the blank inside it — `Untouchability is abolished by {{c1::Article 17::Article number?}} of the Constitution.`",
      "- **The back is never empty.** Extra always has: `<b>Context:</b>` where this fact belongs (topic / Act / chapter, and why exams ask it) · `<b>Explanation:</b>` 2–3 simple lines a first-timer understands · " + (hasMn ? "and the memory trick goes in **Mnemonics** (never empty)." : "`🧠 <b>Trick:</b>` the memory trick (never empty)."),
      "- " + (hasSrc ? "Source: book / chapter." : "Put `📚 <source>` as the last line of Extra (no Source field).")];
    var ex = {}; f.forEach(function (k) { if (t.ex.f[k] !== undefined) ex[k] = t.ex.f[k]; });
    if (!hasMn) ex.Extra = (ex.Extra || "") + "<br>🧠 <b>Trick:</b> " + t.ex.f.Mnemonics;
    if (!hasSrc) ex.Extra = (ex.Extra || "") + "<br>📚 " + t.ex.f.Source;
    o.ex = { tags: t.ex.tags, f: ex };
    var ex2 = {}; for (var y in ex) ex2[y] = ex[y];
    ex2.Text = "Q: Which organelle is called the <b>powerhouse of the cell</b>?<br>{{c1::Mitochondrion::Which organelle?}}";
    o.ex2 = { tags: t.ex.tags, f: ex2 };
    return o;
  }
  function label(t) { if (t.grp) return t.name + " · " + t.mlabel; return t.k === "cloze" ? "❤️ Cloze (" + STYLE_LABEL[$("cstyle").value] + ")" : t.name; }

  /* ---------------- picker ---------------- */
  var VIEW = "gallery";
  function pk(t) { return t.k === "cloze" ? "cloze-" + ($("cstyle").value || "focus") : t.k; }
  function src(k) { return (window.APB_IMG && window.APB_IMG[k]) || (PREV + k + ".webp"); }
  function img(t, s) { return src(pk(t) + "-" + s); }
  function row(t) {
    var subs = t.subj.length >= 9 ? ["All subjects"] : t.subj.slice(0, 4);
    var on = SEL.indexOf(t.k) > -1;
    var star = t.star ? '<span class="star" title="Recommended">★</span>' : "";
    var pills = '<span class="tsub">' + subs.map(function (s) { return '<span class="pill">' + esc(s) + '</span>'; }).join("") + '</span>';
    if (VIEW === "gallery") {
      var shot = t.np
        ? '<button type="button" class="shot live" data-view="' + t.k + '" aria-label="Preview ' + esc(label(t)) + '"><div class="lvs">' + liveRender(t.k, "q") + '</div><span class="zoom">👁 Front / Back</span></button>'
        : '<button type="button" class="shot" data-view="' + t.k + '" aria-label="Preview ' + esc(label(t)) + '"><img loading="lazy" src="' + img(t, "q") + '" alt="' + esc(label(t)) + ' front side"><span class="zoom">👁 Front / Back</span></button>';
      return '<div class="tile' + (on ? " on" : "") + '" data-tile="' + t.k + '">' + shot +
        '<label class="tpick"><input type="checkbox" data-k="' + t.k + '"' + (on ? " checked" : "") + '><span class="tname">' + esc(label(t)) + star + '</span></label>' +
        '<span class="tbest">' + esc(t.best) + '</span>' + (t.np ? '<span class="tbest mono">' + esc(R(t).fields.join(" · ")) + '</span>' : '') + pills + gbtn(t.k) + dlbtn(t) + '</div>';
    }
    return '<div class="trow"><label class="tpick"><input type="checkbox" data-k="' + t.k + '"' + (on ? " checked" : "") + '>' +
      '<span class="tname">' + esc(label(t)) + star + '</span></label>' +
      '<button type="button" class="eye" data-view="' + t.k + '" aria-label="Preview ' + esc(label(t)) + '">👁</button>' +
      '<span class="tbest">' + esc(t.best) + '</span>' + pills + gbtn(t.k) + dlbtn(t) + '</div>';
  }
  function gstate(g) { var ks = gk(g), n = ks.filter(function (k) { return SEL.indexOf(k) > -1; }).length; return { n: n, all: ks.length, ks: ks }; }
  function grow(g) {
    var G = GRP[g], s = gstate(g), on = s.n === s.all, part = s.n > 0 && !on;
    var cnt = on ? "Saare " + s.all + " " + (g === "smartbasic" ? "modes" : "layouts") : part ? s.n + " / " + s.all + " chune" : "Off";
    var btn = '<button type="button" class="mini xbtn' + (EXP[g] ? " on" : "") + '" data-exp="' + g + '" aria-expanded="' + EXP[g] + '">' + (EXP[g] ? "▴ Modes band karo" : "🔧 Specific " + (g === "smartbasic" ? "modes" : "layouts") + " chuno") + '</button>';
    var head = '<label class="tpick"><input type="checkbox" data-g="' + g + '"' + (on ? " checked" : "") + '><span class="tname">' + esc(G.name) + ' <span class="gcount">' + cnt + '</span><span class="star">★</span></span></label>';
    if (VIEW === "gallery") {
      return '<div class="tile gtile' + (s.n ? " on" : "") + '" data-gtile="' + g + '">' +
        '<button type="button" class="shot" data-view="' + G.rep + '" data-viewg="' + g + '" aria-label="Preview ' + esc(G.name) + '"><img loading="lazy" src="' + src(G.rep + '-q') + '" alt="' + esc(G.name) + ' front side"><span class="zoom">👁 Front / Back</span></button>' +
        head + '<span class="tbest">' + esc(G.best) + '</span>' + btn + gbtn(G.rep) + '</div>';
    }
    return '<div class="trow gtile" data-gtile="' + g + '">' + head + '<button type="button" class="eye" data-view="' + G.rep + '" data-viewg="' + g + '" aria-label="Preview ' + esc(G.name) + '">👁</button><span class="tbest">' + esc(G.best) + '</span>' + btn + '</div>';
  }
  var VIEWG = null;
  function openView(k) {
    var t = BYK[k]; if (!t) return;
    $("mv-title").textContent = label(t);
    $("mv-best").textContent = t.best;
    if (t.np) { liveBox("mv-q", liveRender(t.k, "q")); liveBox("mv-a", liveRender(t.k, "a")); }
    else { liveOff("mv-q"); liveOff("mv-a"); $("mv-q").src = img(t, "q"); $("mv-a").src = img(t, "a"); }
    $("mv-fields").textContent = "Fields: " + R(t).fields.join(" · ");
    var sel1 = VIEWG ? gstate(VIEWG).n === gstate(VIEWG).all : SEL.indexOf(k) > -1;
    if (VIEWG) { $("mv-title").textContent = GRP[VIEWG].name + " (example: " + t.mlabel + ")"; $("mv-best").textContent = GRP[VIEWG].best; }
    $("mv-pick").setAttribute("data-k2", VIEWG ? "g:" + VIEWG : k);
    $("mv-pick").textContent = sel1 ? "✓ Selected — hatao" : (VIEWG ? "+ Saare modes chuno" : "+ Ye card chuno");
    $("mv-pick").classList.toggle("done", sel1);
    fillGuide(k);
    var d = $("mv"); if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
  }
  function drawPicker() {
    $("unirows").innerHTML = D.types.filter(function (t) { return t.cat === "uni" && !t.grp; }).map(row).join("");
    $("grprows").innerHTML = grow("smartbasic") + grow("smartcloze");
    ["smartbasic", "smartcloze"].forEach(function (g) { $("mp-" + g).hidden = !EXP[g]; });
    $("sbrows").innerHTML = D.types.filter(function (t) { return t.grp === "smartbasic"; }).map(row).join("");
    $("scrows").innerHTML = D.types.filter(function (t) { return t.grp === "smartcloze"; }).map(row).join("");
    $("cats").innerHTML = D.cats.filter(function (c) { return c.k !== "uni"; }).map(function (c) {
      var ts = D.types.filter(function (t) { return t.cat === c.k; });
      var n = ts.filter(function (t) { return SEL.indexOf(t.k) > -1; }).length;
      return '<details class="cat" data-c="' + c.k + '"><summary><b>' + esc(c.label) + '</b><span>' + esc(c.desc) + '</span><span class="n">' + ts.length + ' types' + (n ? ' · ' + n + ' chune' : '') + '</span></summary><div class="rows">' + ts.map(row).join("") + '</div></details>';
    }).join("");
  }
  function syncChecks() {
    Array.prototype.forEach.call(document.querySelectorAll("input[data-k]"), function (i) { i.checked = SEL.indexOf(i.getAttribute("data-k")) > -1; });
    Array.prototype.forEach.call(document.querySelectorAll("details.cat"), function (d) {
      var c = d.getAttribute("data-c"), ts = D.types.filter(function (t) { return t.cat === c; });
      var n = ts.filter(function (t) { return SEL.indexOf(t.k) > -1; }).length;
      d.querySelector(".n").textContent = ts.length + " types" + (n ? " · " + n + " chune" : "");
    });
    ["smartbasic", "smartcloze"].forEach(function (g) {
      var s = gstate(g);
      Array.prototype.forEach.call(document.querySelectorAll('input[data-g="' + g + '"]'), function (i) { i.checked = s.n === s.all; i.indeterminate = s.n > 0 && s.n < s.all; });
      Array.prototype.forEach.call(document.querySelectorAll('[data-gtile="' + g + '"]'), function (el) { el.classList.toggle("on", s.n > 0); var c = el.querySelector(".gcount"); if (c) c.textContent = s.n === s.all ? "Saare " + s.all + " " + (g === "smartbasic" ? "modes" : "layouts") : s.n ? s.n + " / " + s.all + " chune" : "Off"; });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-tile]'), function (el) { el.classList.toggle('on', SEL.indexOf(el.getAttribute('data-tile')) > -1); });
    var chips = [], seenG = {};
    ordered().forEach(function (t) {
      if (t.grp) { if (seenG[t.grp]) return; seenG[t.grp] = 1; var s = gstate(t.grp); chips.push('<span class="tchip">' + esc(GRP[t.grp].name) + (s.n === s.all ? " (all)" : " · " + s.n + " " + (t.grp === "smartbasic" ? "modes" : "layouts")) + '<button type="button" data-rm="g:' + t.grp + '" aria-label="Remove ' + esc(GRP[t.grp].name) + '">×</button></span>'); return; }
      chips.push('<span class="tchip">' + esc(label(t)) + '<button type="button" data-rm="' + t.k + '" aria-label="Remove ' + esc(label(t)) + '">×</button></span>');
    });
    $("tray").innerHTML = '<span class="count">' + chips.length + ' chune:</span>' + (chips.length ? chips.join("") : '<span class="empty">Koi type nahi chuna — Universal se shuru karo.</span>');
    ["smartbasic", "smartcloze"].forEach(function (g) { var ks = D.types.filter(function (x) { return x.grp === g; }); var n = ks.filter(function (x) { return SEL.indexOf(x.k) > -1; }).length; $("n-" + g).textContent = n + " / " + ks.length + " chune"; $("all-" + g).textContent = n === ks.length ? "Sab hatao" : "Sab chuno"; });
    $("manywarn").hidden = ordered().filter(function (t) { return !t.grp; }).length + (ordered().some(function (t) { return t.grp === "smartbasic"; }) ? 1 : 0) + (ordered().some(function (t) { return t.grp === "smartcloze"; }) ? 1 : 0) <= 12;
    $("cstylefield").hidden = SEL.indexOf("cloze") < 0;
    Array.prototype.forEach.call(document.querySelectorAll("[data-preset]"), function (b) {
      var p = D.presets[b.getAttribute("data-preset")];
      b.classList.toggle("on", p.length === SEL.length && p.every(function (k) { return SEL.indexOf(k) > -1; }));
    });
  }
  function ordered() { return D.types.filter(function (t) { return SEL.indexOf(t.k) > -1; }); }
  function toggle(k, on) {
    var i = SEL.indexOf(k);
    if (on && i < 0) SEL.push(k); else if (!on && i > -1) SEL.splice(i, 1);
    syncChecks(); render();
  }

  /* ---------------- search ---------------- */
  var SYN = {
    saal: "year date", tarikh: "date year", varsh: "year", samay: "time chronology", kram: "order sequence", pehle: "first earlier before",
    naksha: "map", jagah: "place location", rajya: "state", nadi: "river", seema: "border",
    anuchhed: "article", dhara: "section", kanoon: "law act", adhiniyam: "act", sanvidhan: "constitution article", nyay: "judgment case",
    aankde: "data numbers statistics", sankhya: "number", pratishat: "percentage", ganana: "census",
    suchi: "list", prakriya: "process steps", charan: "steps stages", chakra: "cycle", kaaran: "causes reasons",
    tulna: "compare", antar: "difference compare", jodi: "match pairs", paribhasha: "definition terms", shabd: "word vocabulary",
    yojana: "scheme", khabar: "news current", nibandh: "essay", uttar: "answer mains", sawal: "question",
    dates: "date year", years: "year date", rivers: "river", states: "state", numbers: "number", stats: "statistics", maps: "map",
    articles: "article", sections: "section", cases: "case judgment", causes: "causes", steps: "steps", lists: "list",
    statements: "statement", mcqs: "mcq", quotes: "quote", words: "word", schemes: "scheme", reports: "report",
    battles: "date events", dynasty: "dynasty reign", kings: "ruler reign", rulers: "ruler reign", treaties: "convention treaty",
    agreements: "convention treaty", samkaleen: "contemporaries contemporary overlap", kiska: "match pairs", sthan: "place location", ghatna: "events date", karan: "causes reasons", parinaam: "effect", mahina: "month", din: "days month", vyakti: "who person", kathan: "statement", galti: "error mistake", jaal: "trap", fark: "difference compare", parks: "national park", lakes: "lake", passes: "pass", mountains: "height scale map"
  };
  function words(s) { return s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ ]+/g, " ").split(/\s+/).filter(function (w) { return w.length > 1; }); }
  function toks(s) { return s.toLowerCase().split(/[^a-z0-9\u0900-\u097f]+/).filter(Boolean); }
  function hit(list, a) {
    return list.some(function (w) { return w === a || (w.indexOf(a) === 0 && w.length - a.length <= 2 && a.length >= 3) || (a.indexOf(w) === 0 && a.length - w.length <= 2 && w.length >= 4); });
  }
  var HAY = {};
  function hay(t) {
    var c = (D.cats.filter(function (x) { return x.k === t.cat; })[0] || {}).label || "";
    return { name: toks(label(t)), kw: toks(t.kw), best: toks(t.best + " " + t.hunt), subj: toks(t.subj.join(" ")), cat: toks(c) };
  }
  function score(t, q) {
    var h = hay(t), s = 0, matched = 0;
    q.forEach(function (w) {
      var alts = [w].concat(SYN[w] ? SYN[w].split(" ") : []);
      var best = 0, extra = 0;
      alts.forEach(function (a) {
        var v = 0;
        if (hit(h.name, a)) v = Math.max(v, 6);
        if (hit(h.kw, a)) v = Math.max(v, 4);
        if (hit(h.subj, a)) v = Math.max(v, 3);
        if (hit(h.cat, a)) v = Math.max(v, 2);
        if (hit(h.best, a)) v = Math.max(v, 2);
        if (v) extra += 0.5;
        best = Math.max(best, v);
      });
      if (best) matched++;
      s += best + Math.max(0, extra - 0.5);
    });
    if (!s) return 0;
    return s + matched * 2 + (t.star ? 0.5 : 0) - (t.cat === "uni" ? 3 : 0);
  }
  function search() {
    var q = words($("q").value);
    if (!q.length) { $("results").hidden = true; return; }
    var r = D.types.map(function (t) { return { t: t, s: score(t, q) }; }).filter(function (x) { return x.s > 2; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, 12);
    $("results").hidden = false;
    $("rcount").textContent = r.length ? r.length + " match — sabse upar wala sabse best" : "kuch nahi mila — dusre shabd try karo (dates, map, article, numbers, process)";
    $("rrows").innerHTML = r.map(function (x) { return row(x.t); }).join("");
  }

  /* ---------------- prompt ---------------- */
  var ONLY_TL = ["**Build the timelines like this:**",
    "  1. One **master timeline** note for the whole source (its 6\u20138 most important events), then **focused timelines** per era / theme / dynasty / person (4\u20138 events each). Use `# ` era headings to split eras inside a note.",
    "  2. Strict chronological order, one date format everywhere (`1857`, `15 Aug 1947`, `c. 1500 BCE`). Never invent or guess a date; undated items are left out and listed in the summary.",
    "  3. Keep each event TITLE short and self-contained (who + what + where), about 3\u201310 words \u2014 the real detail belongs in `w` and `why` inside Data, never in the title.",
    "  4. Cloze BOTH halves of every row \u2014 the date and the event \u2014 each with its own number and each starting with `#`.",
    "  5. An event may appear in at most 2 notes, and is clozed in only one of them.",
    "  6. Fill `why` for EVERY row. A timeline card without reasons is a half-made card: the dates stick only when the student knows what caused them.",
    "  7. Extra holds one trick line per event, and Data holds one object per event, in the same order \u2014 check the counts match before you finish."];
  var ONLY_TLC = ["**Build the timelines like this:**",
    "  1. One **master timeline** note for the whole source (its 8–12 most important events), then **focused timelines** per theme / era / person / place (4–12 events each). Use `# ` era headings to split eras.",
    "  2. Strict chronological order, one date format everywhere (`1857`, `15 Aug 1947`, `c. 1500 BCE`). Never invent or guess a date; undated items are left out and listed in the summary.",
    "  3. Each event line short and self-contained (who + what + where), max ~12 words. Cloze the **date** for landmark events, the **name** when the date is the famous part. Mix both. Each hint is a question: `{{c1::1526::Year?}}`, `{{c2::Sher Shah Suri::Which Afghan ruler?}}`.",
    "  4. An event may appear in at most 2 notes; cloze it in only one of them.",
    "  5. Extra = cause → effect between the events, then the trick (rhythm / gap pattern / story)."];
  var TLK = ["tlclassic", "ruler", "lanes", "sc-timeline"];
  var DATEK = ["sc-timeline", "tlclassic", "tlcontrast", "ruler", "lanes", "tapsorter", "order", "whichfirst", "duel", "tlbuilder", "chronocode", "timepin", "gantt", "contemp", "inkseq"];
  var MCQK = ["umcq", "sb-mcq", "sb-tf", "mcq", "elim", "ladder", "judge", "inkstat", "chronocode", "context", "whosaid", "slot"];

  function build() {
    var v = {}; ids.forEach(function (k) { v[k] = $(k).value.trim(); });
    var m = mode(), pyq = $("pyq").checked;
    var X = { ncert: $("x-ncert").checked, wiki: $("x-wiki").checked, ca: $("x-ca").checked, pib: $("x-pib").checked };
    var extra = X.ncert || X.wiki || X.ca || X.pib;
    var xNames = [X.ncert && "NCERT", X.wiki && "Wikipedia", X.ca && "current affairs", X.pib && "PIB"].filter(Boolean);
    var sel = ordered().map(R);
    if (!sel.length) sel = DEF_SEL.map(function (k) { return R(BYK[k]); });
    var NT = [], byName = {};
    sel.forEach(function (t) {
      if (!t.grp) { NT.push(t); return; }
      var g = byName[t.name];
      if (!g) { g = { k: t.grp, name: t.name, fields: t.fields, tr: t.tr, cz: t.cz, cat: t.cat, modes: [], hunt: "", spec: [] }; byName[t.name] = g; NT.push(g); }
      g.modes.push(t);
    });
    var uq = function (a) { var s = {}; return a.filter(function (t) { if (s[t.name]) return false; s[t.name] = 1; return true; }); };
    var has = function (k) { return sel.some(function (t) { return t.k === k; }); };
    var cz = function (kind) { return NT.filter(function (t) { return t.cz === kind; }); };
    var normalCloze = NT.filter(function (t) { return t.cz === "one" || t.cz === "multi"; });
    var tlcT = NT.filter(function (t) { return t.cz === "tlc"; });
    var noCloze = NT.filter(function (t) { return t.cz === "none"; });
    var dateT = uq(sel.filter(function (t) { return DATEK.indexOf(t.k) > -1; }));
    var tlT = uq(sel.filter(function (t) { return TLK.indexOf(t.k) > -1; }));
    var withSubj = NT.filter(function (t) { return t.fields.indexOf("Subject") > -1; });
    var noExtra = NT.filter(function (t) { return t.fields.indexOf("Extra") < 0; });
    var smart = NT.filter(function (t) { return t.modes; });
    var soft = NT.filter(function (t) { return t.cat === "soft"; });
    var softOnly = soft.length === NT.length;
    var deck = v.deck || "My Deck";
    var nm = function (t) { return "`" + t.name + "`"; };
    var sizeTxt = { auto: "auto — small topic 30–50 cards, medium 50–90, large 100–150+; never pad, never cut real facts", few: "only the most important facts, about 30 cards", medium: "about 50–90 cards", max: "maximum coverage — every testable fact, no matter how many cards" }[v.size];
    var deckSetting = m === "ask" ? "EMPTY — I will choose the deck in Anki while importing" : m === "sub" ? deck + " — this is the PARENT deck; create topic sub-decks under it (rules in Part E)" : deck + " — put ALL cards in exactly this deck";
    var L = [];
    L.push("You are an expert teacher and Anki card designer. Turn the attached material into the **best possible Anki cards** for my **existing note types** (listed exactly below — never create a new note type). Imagine a student who has **never studied this topic** and learns it **only from these cards**. That student must understand every card and remember it. Quality matters more than speed.");
    L.push("");
    L.push("## MY SETTINGS");
    L.push("- **Today's date:** " + (niceDate(v.date) || "[not given]") + " (current-affairs cards must be up to this date)");
    L.push("- **Deck:** " + deckSetting);
    L.push("- **Exam / purpose:** " + (v.exam || "general understanding"));
    L.push("- **Language:** " + (v.lang || "English"));
    L.push("- **Note types:** " + (NT.length === 1 ? "ONLY " : "") + NT.map(function (t) { return t.name + (t.modes ? " (modes: " + t.modes.map(function (x) { return x.mlabel; }).join(", ") + ")" : ""); }).join(", "));
    L.push("- **Amount:** " + sizeTxt);
    L.push("- **Extra cards:** " + (extra ? "yes — from " + xNames.join(", ") : "no"));
    if (v.topic) L.push("- **Source / topic:** " + v.topic);
    if (v.wish) L.push("- **Special instructions:** " + v.wish);
    L.push("");
    L.push("## PART A — Read the source properly (works for ANY input)");
    L.push("- **PDF (text):** read every page incl. tables, boxes, footnotes, captions; ignore headers/footers/page numbers.");
    L.push("- **PDF (scanned) / image / screenshot:** read (OCR) all text; also read diagrams, maps, charts and tables and turn what they show into facts. List any unreadable word in the summary — never guess it.");
    L.push(soft.length
      ? "- **YouTube / lecture transcript:** ignore filler and repetition, but KEEP every joke, comeback, clip and exact line — in a behaviour video the lines ARE the content, not decoration. Quote them as spoken; put timestamps (if any) in the source."
      : "- **YouTube / lecture transcript:** ignore filler, repetition and jokes; keep only teachable content; put timestamps (if any) in the source.");

    L.push("- **Book chapter / long notes:** go section by section, don't skip the middle or the end. With more than ~40 pages, finish part 1 and ask me to say “continue” rather than rushing.");
    L.push("- **Question bank / MCQs / PYQs:** extract the **fact** each one tests" + (pyq ? " and record exam + year." : "."));
    L.push("- **Web article / mixed:** keep facts, drop opinion and ads.");
    L.push("");
    L.push("**Before writing any card, show me:** the topics you found, the planned number of notes of each type (with titles), and any part that is unclear or unreadable. Then continue without waiting.");
    L.push("");
    if (soft.length) {
      L.push("");
      L.push("## PART A2 — This source teaches BEHAVIOUR, not facts (" + soft.map(nm).join(", ") + ")");
      L.push("- The video itself is the only source of truth. Do **not** fact-check it against NCERT / Laxmikanth, do not add exam angles, and never invent a framework, secret or clip the source does not actually teach.");
      L.push("- Quote the speaker's own lines **verbatim** (Hinglish as spoken) — the exact wording is the asset, not a paraphrase of it.");
      L.push("- The learner must be able to USE this tomorrow, so for every framework the source teaches, produce: **1** " + nm(BYK0("framework")) + ", **3–6** " + nm(BYK0("comeback")) + " with NEW Indian triggers, and at least **1** " + nm(BYK0("weakstrong")) + " built from the mistake that framework fixes.");
      L.push("- The deliverable is **what he will DO**, so " + nm(BYK0("playbook")) + " is the backbone: turn every usable piece of advice into one note with a real situation on the front and exact, executable steps on the back. A video of tips becomes a deck of plays, not a deck of summaries.");
      L.push("- Coin **2–4** " + nm(BYK0("mantra")) + " notes per video — no more. Each one short, Hinglish, with rhythm, and tied to the moment it should fire.");
      L.push("- Pull **3–8** " + nm(BYK0("mentalmodel")) + " notes from the video: the reusable thinking behind the advice, not the advice itself. These are what still work a year later, so write them even when the video is motivational, a tips list or a story.");
      L.push("- Per video make only **1–3** " + nm(BYK0("rep")) + " notes — the smallest actions that actually change behaviour, each doable today.");
      L.push("- Triggers, situations and examples must sit in an Indian 20–30 year old's life (rishtedaar, hostel, office, chai, shaadi ka pressure, result, salary). Rewrite every foreign example into that world.");
      L.push("");
      L.push("**Tags — this is how the deck gets used, so get it exactly right.** Every note carries:");
      L.push("1. **One to three `C::` context tags**, chosen ONLY from this fixed list — never invent a new one: `C::Daily` (roz ka action) · `C::Social` (koi bhi gathering, naye log) · `C::Family` (ghar, rishtedaar, function) · `C::Date` (kisi se milna, dating) · `C::Office` (kaam, colleagues) · `C::Interview` · `C::Speaking` (stage, presentation, awaaz) · `C::Conflict` (taana, criticism, ladai) · `C::Study` (padhai, nayi skill) · `C::Focus` (procrastination, deep work) · `C::Trading` · `C::Health` · `C::Mind` (shaanti, present rehna, decision).");
      L.push("   Ask for each note: **in which situation would he want this card in front of him?** That is the tag. A card that fits nowhere on this list should not exist — rewrite it until it does.");
      L.push("2. **One `T::<Topic>` tag** — the skill: `T::Humour`, `T::Charisma`, `T::BodyLanguage`, `T::SmallTalk`, `T::Discipline`, `T::Learning`, `T::Voice`, `T::Relationship`, `T::Mind`, `T::Trading`, `T::Health`. One word after `T::`, no spaces.");
      L.push("3. **One `Src::<ShortVideoName>`** tag so a bad card can be traced back, and `Move::<Name>` where a note belongs to a named framework.");
      L.push("Use `C::Daily` sparingly — only for what he should act on today, never as a second tag on everything.");
      L.push("- If the source quotes a statistic or a study (“43 face muscles”, “97 % log insecure hain”), write it as what the video CLAIMS, never as a checked fact, and never build a card whose whole point is that number.");
      L.push("");
    }
    if (softOnly) L.push("**Never invent anything** — no invented clips, quotes, frameworks, names or research claims. If you are not sure the source actually said something, leave it out and list it in the summary.");
    else L.push("**Fact-check every fact** against standard books (NCERT, Laxmikanth, Spectrum, bare acts…). If the source is wrong: write the **correct** fact, mention the wrong version as a trap, and add the tag `Src::Corrected`. Facts that change over time: write “as of <month year>”. Never invent anything — no invented dates, numbers, coordinates, quotes or cases; if unsure, leave it out and list it in the summary.");
    L.push("");
    L.push("## PART B — My note types (use these EXACT names and field orders)");
    L.push((NT.length === 1 ? "Use ONLY **1 note type**." : "Use ONLY these **" + NT.length + " note types**.") + " Copy each name **exactly, including the emoji and spaces**. Field order matters — every line must have the fields in this order.");
    L.push("");
    NT.forEach(function (t, n) {
      if (t.modes) {
        var isB = t.k === "smartbasic";
        var whole = t.modes.length === gk(t.k).length;
        L.push("### " + (n + 1) + ") " + nm(t) + " — one note type, " + (whole ? "ALL " + t.modes.length + " " + (isB ? "modes" : "layouts") + " (pick the best one for each fact)" : t.modes.length + " " + (isB ? "mode" : "layout") + (t.modes.length > 1 ? "s" : "") + " chosen by a tag"));
        L.push("Fields in order: **" + t.fields.join(" | ") + "**");
        L.push("Use ONLY these " + (isB ? "modes" : "layouts") + ". Put the mode tag in the Tags column (exactly one per note" + (t.modes.some(function (x) { return !x.mtag; }) ? "; the one marked “no mode tag” needs none" : "") + "):");
        t.modes.forEach(function (x) { L.push("- **" + x.mlabel + "** — " + (x.mtag ? "tag `" + x.mtag + "`" : "no mode tag") + " — for " + x.hunt + ". " + x.spec[0]); });
        L.push(isB ? "- Every mode: Extra = Why/How + trap + related; Memory = the memory trick (shown behind a button); Source = book / chapter. No cloze. Never use any other mode tag (no `type`)." : "- Every layout: blanks `{{c1::answer::hint}}`, `{{c2::…}}` … (one number per blank); `{{cN::#answer}}` keeps that answer visible as context. Extra = explanation; Memory = the trick; Source = book. Never use any other layout tag.");
      } else {
        L.push("### " + (n + 1) + ") " + nm(t) + " — for " + t.hunt);
        L.push("Fields in order: **" + t.fields.join(" | ") + "**");
        t.spec.forEach(function (x) { L.push(x); });
      }
      L.push("");
    });
    if (NT.length === 1) {
      var t0 = NT[0];
      L.push("**ONLY-ONE-TYPE MODE — important:** make EVERY card a " + nm(t0) + " note. Mine the whole source for " + (t0.modes ? t0.modes.map(function (x) { return x.hunt + " (" + x.mlabel + ")"; }).join("; ") : t0.hunt) + ". Content that does not fit this type is skipped (say how much in the summary) — never forced into a bad card.");
      if (t0.k === "tlcontrast") ONLY_TL.forEach(function (x) { L.push(x); });
      if (t0.k === "tlclassic") ONLY_TLC.forEach(function (x) { L.push(x); });
      if (smart.length && t0.modes.length > 1) L.push("For each fact pick the mode that fits it best; mix the chosen modes across the deck.");
      L.push("Do NOT use any other note type.");
    } else {
      L.push("**Which type to use (pick the most specific one that fits each piece of information):**");
      sel.forEach(function (t) { L.push("- " + t.hunt + " → " + nm(t) + (t.grp ? (t.mtag ? " with tag `" + t.mtag + "`" : " (no mode tag)") : "")); });
      if (NT.some(function (t) { return t.cat === "uni"; }) && NT.some(function (t) { return t.cat !== "uni"; })) L.push("The universal types (" + NT.filter(function (t) { return t.cat === "uni"; }).map(nm).join(", ") + ") are for whatever does not fit a specialised type.");
      if (dateT.length > 1) L.push("**Chronology:** put each set of dated events into ONE of " + dateT.map(nm).join(" / ") + "; reuse the same events in a second type only when it tests something new.");
      L.push("Spread the content: don't put the same fact in two types. Do NOT use any note type not listed here.");
    }
    L.push("");
    var tw = {}; NT.forEach(function (t) { (tw[t.tr] = tw[t.tr] || []).push(t.name); });
    var r = 1;
    L.push("## PART C — Card quality rules (every card)");
    L.push((r++) + ". **First-timer test:** every question / line carries its own context (“In the Indian Constitution, …”). Never write “which of the above”, “statement 2” or “as discussed”.");
    L.push((r++) + ". **One fact per card** for basic/cloze notes; grouped notes (timelines, lists, tables, maps, boards) hold ONE connected set. Never ask the same fact twice." + (pyq ? " If a fact appears many times, make ONE card and list all its PYQs (exam + year) in Extra." : ""));
    if (sel.some(function (t) { return MCQK.indexOf(t.k) < 0; })) L.push((r++) + ". **No MCQ wording** in normal cards — turn every MCQ into a direct question" + (sel.some(function (t) { return MCQK.indexOf(t.k) > -1; }) ? " (MCQ-style cards like " + uq(sel.filter(function (t) { return MCQK.indexOf(t.k) > -1; })).map(nm).join(", ") + " keep their exam format, with realistic wrong options)" : "") + ".");
    L.push((r++) + ". **Extra teaches** (lines joined with `<br>`, under ~80 words; drop empty parts): `<b>Why/How:</b>` 2–3 simple lines a 14-year-old understands · `⚠ <b>Trap:</b>` common confusion · `🔗 <b>Related:</b>` one linked fact" + (pyq ? " · `<b>PYQ:</b>` exam year" : "") + "." + (noExtra.length ? " " + noExtra.map(nm).join(", ") + " have no Extra field — put that teaching in their own fields." : "") + (tlcT.length ? " " + tlcT.map(nm).join(", ") + "’s Extra is the tricks block instead — its teaching goes into `w` and `why` inside Data." : ""));
    L.push((r++) + ". **Memory trick on every note — never empty:** acronym, funny story/image, word link (“**Sc**urvy → vitamin **C**”), number hook, contrast pair or Hindi/English sound-alike; accurate and one line. It goes in: " + Object.keys(tw).map(function (f) { return "**" + f + "** (" + tw[f].join(", ") + ")"; }).join("; ") + (tw.Extra ? " — inside Extra write it as `🧠 <b>Trick:</b> …`" : "") + ".");
    if (normalCloze.length) L.push((r++) + ". **Cloze rules (zero exceptions)** for " + normalCloze.map(nm).join(", ") + ": every blank is `{{cN::answer::hint}}` — a blank without a hint is an ERROR. The hint is a short QUESTION that tells a first-timer exactly what to recall, without giving it away (`::Which year?`, `::Which organ?`, `::Which Article?`, `::Which state?`, `::Which Mughal emperor?`). Never one-word hints like `::who`, `::name`, `::year`. The answer must not appear elsewhere in the note." + (cz("one").length ? " " + cz("one").map(nm).join(", ") + " use ONLY c1." : "") + (cz("multi").length ? " " + cz("multi").map(nm).join(", ") + " use c1, c2, c3… (one number per blank; the same number twice = asked together)." : ""));
    if (tlcT.length) L.push((r++) + ". **Cloze rules** for " + tlcT.map(nm).join(", ") + ": every blank is `{{cN::#answer}}` — or `{{cN::#answer::short clue}}` for an event — with the `#` always there and one number per blank (c1, c2, c3 …, never reused)." + " This card writes its own question, so a DATE blank carries no hint at all; only event blanks take a clue, and the clue is never a question. The answer must not appear anywhere else in the note.");
    if (tlT.length) L.push((r++) + ". **Timeline hints** (" + tlT.map(function (x) { return nm(x) + (x.grp ? " timeline layout" : ""); }).join(", ") + "): every blank is asked as a clear question. Date blank → `::Which year?` / `::Which year BCE?` / `::Exact date?` / `::Which century?` / `::Which decade?`. Keep date hints to 2–3 words; in `🪜 Timeline classic` the date column is very narrow, so there use only `::Year?` / `::Year BCE?` / `::Date?` / `::Century?`. Name hints may be 3–6 words. Name blank → say what KIND of name: `::Which Mughal emperor?`, `::Which battle?`, `::Which Act?`, `::Which treaty?`, `::Which mission?`, `::Who led it?`, `::Which place?`. The rest of the line must make the question answerable on its own (who + what + where). No initials, no first letters, no answer words in the hint.");
    if (cz("trap").length) L.push((r++) + ". " + cz("trap").map(nm).join(", ") + ": `{{cN::REAL::TRAP}}` — the part after the second `::` is the commonly confused WRONG value, not a hint.");
    if (cz("slot").length) L.push((r++) + ". " + cz("slot").map(nm).join(", ") + ": `{{cN::ANSWER::wrong1|wrong2|wrong3}}` — after the second `::` come 3 plausible wrong options separated by `|`.");
    if (cz("tfv").length) L.push((r++) + ". " + cz("tfv").map(nm).join(", ") + ": each statement is one cloze `{{c1:: … }}`; inside it `[[right|wrong|wrong]]` (first = correct) and `[[A~B~C]]` for neutral swaps.");
    if (noCloze.length && (normalCloze.length || tlcT.length || cz("trap").length || cz("slot").length || cz("tfv").length)) L.push((r++) + ". **No cloze markers** `{{c1::…}}` in " + noCloze.map(nm).join(", ") + ".");
    if (!normalCloze.length && !tlcT.length && !cz("trap").length && !cz("slot").length && !cz("tfv").length) L.push((r++) + ". **No cloze markers** `{{c1::…}}` anywhere — these note types don't use them.");
    if (dateT.length) L.push((r++) + ". **Dates:** exact, one format everywhere (`1857`, `15 Aug 1947`, `c. 1500 BCE`, `1556-1605`); never guess a date — leave the item out and list it in the summary.");
    if (sel.some(function (t) { return ["mappin", "postcard", "bearing", "sc-map"].indexOf(t.k) > -1; })) L.push((r++) + ". **Coordinates:** decimal `lat, lon` (e.g. `24.55, 93.80`), accurate to 2 decimals; state names spelled in full as on the official map.");
    if (withSubj.length) L.push((r++) + ". **Subject field** (" + withSubj.map(nm).join(", ") + "): one word — Polity, History, Geography, Economy, Environment, Science, Culture, Law or Current Affairs" + (has("umcq") ? " (Universal MCQ also takes GS, Maths, Reasoning, English, Hindi or Computer)" : "") + ".");
    if (smart.length) L.push((r++) + ". " + smart.map(nm).join(" and ") + ": each note gets exactly ONE of its chosen mode tags (" + smart.map(function (g) { return g.modes.map(function (x) { return x.mtag ? "`" + x.mtag + "`" : "none"; }).join(" / "); }).join("; ") + ") in the Tags column, next to the topic tags.");
    L.push((r++) + ". **No typed-answer cards** — never make a card where the learner has to type the answer.");
    if (soft.length) {
      L.push((r++) + ". **Say-it-out-loud cards** (" + soft.map(nm).join(", ") + "): the front must be answerable only by SPEAKING a reply — no part of the answer, the move's name or the framework may appear in any front field.");
      L.push((r++) + ". **Real mouth-feel:** every line must be short enough to actually say in conversation. If it needs a comma-heavy clause or a big English word, rewrite it the way people really talk.");
      L.push((r++) + ". **Every note is tagged for retrieval** (the `C::` / `T::` / `Src::` scheme above). Before finishing, imagine him opening Anki before a family function, a date, an interview or a trade — each of those filters must return a useful set, and nothing irrelevant.");
      L.push((r++) + ". **No group generalisations and no manipulation.** Never write a card that teaches what “women”, “men” or any group are like, and never one whose move depends on deceiving someone or engineering their emotions. If the source teaches that, keep only the part about his own behaviour and say in the summary what you dropped.");
      if (softOnly) L.push((r++) + ". Ignore exam framing completely — no Prelims/Mains angles, no PYQs, no “as per NCERT”.");
    }

    L.push((r++) + ". **Bold** key words; add Hindi names in brackets where useful.");
    L.push("");
    if (extra) {
      L.push("## PART D — EXTRA cards");
      L.push("Add **15–25 %** extra cards beyond the source, in the SAME chosen note types and rules, each also tagged `Extra`:");
      if (X.ncert) L.push("- **NCERT** — tag `Src::NCERT`, source “NCERT Class X Subject – Chapter”. Key related facts the source misses.");
      if (X.wiki) L.push("- **Wikipedia / standard references** — tag `Src::Wiki`; only stable, well-established facts (discoverers, records, firsts, Indian context).");
      if (X.ca) L.push("- **Current affairs up to TODAY'S DATE (" + (niceDate(v.date) || "today") + ")** — tag `Src::CA::<YYYY>`; topic-linked news of the last 12–18 months (schemes, missions, laws, reports, rankings, awards, days/themes). Write the date inside every card (“In March 2026, …”).");
      if (X.pib) L.push("- **PIB (pib.gov.in) up to TODAY'S DATE** — tag `Src::PIB`; official Government of India releases linked to the topic: schemes, missions, cabinet decisions, launches, MoUs, official data, awards, days and themes. Exact official names, numbers and dates; release date on the card; source `PIB, <release date>`.");
      if (X.ca || X.pib) L.push("- For current affairs and PIB: if you have web search, USE it to verify the latest status; if not, say up to which date your knowledge goes. Never invent news or releases.");
      if (m !== "ask") L.push("- Put the extra cards in the sub-deck `" + deck + "::Extra`.");
      L.push("");
    }
    L.push("## PART E — OUTPUT FORMAT (follow exactly)");
    L.push("Give me **one plain-text file named `anki_import.txt`** (or one code block I can save as .txt). It starts with this header:");
    L.push("```"); L.push("#separator:tab"); L.push("#html:true"); L.push("#notetype column:1");
    if (m === "ask") L.push("#tags column:2"); else { L.push("#deck column:2"); L.push("#tags column:3"); }
    L.push("```");
    L.push(m === "ask" ? "Then one note per line: `NoteType <TAB> Tags <TAB> Field1 <TAB> Field2 <TAB> …` (fields in the exact order from Part B). Do NOT add a deck column — I choose the deck while importing." : "Then one note per line: `NoteType <TAB> Deck <TAB> Tags <TAB> Field1 <TAB> Field2 <TAB> …` (fields in the exact order from Part B).");
    if (m === "fixed") L.push("- The Deck column is ALWAYS exactly `" + deck + "`" + (extra ? " (extra cards: `" + deck + "::Extra`)." : "."));
    if (m === "sub") L.push("- **Sub-decks:** Deck = `" + deck + "::<Topic>`, exactly ONE level below. <Topic> from the source's own headings, Title Case, 1–4 words. 3–8 sub-decks in total; merge tiny topics; spell each identically on every line." + (extra ? " Extra cards → `" + deck + "::Extra`." : ""));
    L.push("- Column 1 = exact note type name. Tags are space-separated, `::` for levels (e.g. `Polity::FR Src::NCERT HY" + (pyq ? " PYQ::UPSC::2017" : "") + "`), never a space inside one tag.");
    L.push("- Keep every field in its position; an empty middle field still needs its TAB (two TABs in a row). Empty fields at the end can be dropped.");
    L.push("- No real line breaks or TABs inside a field — use `<br>` between lines. Inside fields, `|` is used ONLY as the column separator the note type expects.");
    L.push("- Never start a field with a double quote `\"` (use “ ” or ' instead); a starting `\"` breaks the import.");
    L.push("- HTML only for formatting: `<b> <i> <u> <br> <ol><li> <sub> <sup>`. No `<table>`, no CSS, no images." + (tlcT.length ? " The one exception is " + tlcT.map(nm).join(", ") + ", whose Extra field uses exactly the `<div class=\"xh\">` / `<div class=\"xr\">` block shown in Part B, and whose Data field holds raw JSON." : ""));
    L.push("");
    L.push("### Example lines (→ means a TAB)");
    L.push("```");
    sel.forEach(function (t) {
      var row = [t.name];
      var tg = t.ex.tags || "Topic";
      if (m === "fixed") row.push(deck); else if (m === "sub") row.push(deck + "::" + (tg.split(" ")[0].split("::")[1] || "Topic").replace(/_/g, " "));
      row.push(tg);
      [t.ex].concat(t.ex2 ? [t.ex2] : []).forEach(function (e) {
        var f = t.fields.map(function (k) { return e.f[k] || ""; });
        while (f.length && !f[f.length - 1]) f.pop();
        L.push(row.concat(f).join("→"));
      });
    });
    L.push("```");
    L.push("(Examples show the layout only — write your own content from MY source.)");
    L.push("");
    L.push("## PART F — Final check (do it and report it)");
    L.push("- [ ] Header exactly as in Part E; every line starts with " + (NT.length === 1 ? "exactly " + nm(NT[0]) : "one of: " + NT.map(nm).join(", ")) + ".");
    L.push("- [ ] Field count and order match Part B for each type; no TAB/newline inside a field; no field starts with `\"`.");
    if (normalCloze.length) L.push("- [ ] EVERY normal cloze has a hint; no answer leaks.");
    if (has("cloze")) L.push("- [ ] Simple cloze notes: about half question style, half fill-in-the-blank; every back has Context + Explanation + Trick.");
    if (tlcT.length) L.push("- [ ] " + tlcT.map(nm).join(", ") + ": every blank starts with `#`; both halves of every row are clozed; Extra rows and Data objects match the event rows one-for-one, in the same order; every `why` is filled.");
    if (dateT.length) L.push("- [ ] Dated notes: correct order, one date format, no invented dates.");
    L.push("- [ ] Each piece of information sits in the most fitting type; no fact repeated across types.");
    L.push("- [ ] Every card passes the first-timer test; every note has a memory trick in the right field.");
    L.push("- [ ] Facts checked; corrections tagged" + (pyq ? "; PYQs merged." : "."));
    L.push("- [ ] Every topic of the source is covered (compare with your plan).");
    if (extra) L.push("- [ ] Extra cards present only from: " + xNames.join(", ") + "; each tagged `Extra` + its source tag" + ((X.ca || X.pib) ? "; current-affairs/PIB cards dated." : "."));
    L.push("");
    L.push("**Then give me a short summary:** notes per note type and per topic" + (extra ? ", number of extra cards, the date up to which current affairs are verified" : "") + ", source errors you corrected, and anything unreadable, undated or uncertain.");
    return L.join("\n");
  }


  /* ---------------- universal prompt (Anki's built-in Basic / Cloze) ---------------- */
  var PM = "mine";
  var UT = { cloze: true, basic: true, table: false };
  var UEX = {
    cloze: [["Biology::Cell", ["Cloze", "The organelle that makes most of a cell's energy (ATP) is the {{c1::mitochondrion::Which organelle?}}.", "<b>Context:</b> Cell organelles — NCERT Class 11 Biology, <i>Cell: The Unit of Life</i>; a regular Prelims fact.<br><b>Explanation:</b> Mitochondria carry out aerobic respiration and release energy as ATP. They even have their own DNA and ribosomes.<br>🧠 <b>Trick:</b> Mighty-chondria = mighty power.<br>📚 NCERT XI Biology"]],
            ["Polity::FR", ["Cloze", "Q: Which Article of the Constitution abolishes <b>untouchability</b>?<br>{{c1::Article 17::Article number?}}", "<b>Context:</b> Right to Equality block (Articles 14–18), Part III.<br><b>Explanation:</b> Article 17 abolishes untouchability and forbids its practice in any form; it is enforced through the Protection of Civil Rights Act, 1955.<br>🧠 <b>Trick:</b> 14–18 = equality; 17 sits just before 18 (abolition of titles).<br>📚 Laxmikanth"]]],
    basic: [["Polity::Parliament", ["Basic", "Who presides over a <b>joint sitting</b> of the two Houses of Parliament?", "<b>The Speaker of the Lok Sabha</b> (Art 108)<hr><b>Context:</b> Joint sittings resolve a deadlock on an ordinary bill.<br><b>Explanation:</b> If the Speaker is absent, the Deputy Speaker presides, then the Deputy Chairman of the Rajya Sabha. Not available for Money Bills or Constitution Amendment Bills.<br>🧠 <b>Trick:</b> Lok Sabha is bigger, so its Speaker runs the joint show.<br>📚 Laxmikanth"]]],
    table: [["Polity::Writs", ["Cloze", "<b>Writs and their meaning</b><br><table><tr><th>Writ</th><th>Literal meaning</th><th>Lies against</th></tr><tr><td>Habeas corpus</td><td>{{c1::To have the body::Literal meaning?}}</td><td>Public authorities and private persons</td></tr><tr><td>Mandamus</td><td>{{c2::We command::Literal meaning?}}</td><td>Public officials, not the President or Governors</td></tr><tr><td>Quo warranto</td><td>{{c3::By what authority::Literal meaning?}}</td><td>Holders of a public office</td></tr></table>", "<b>Context:</b> Writ jurisdiction — Article 32 (Supreme Court) and Article 226 (High Courts).<br><b>Explanation:</b> Each writ is a court order for a specific wrong: unlawful detention, a public duty not done, or an office held without authority.<br>🧠 <b>Trick:</b> Body → Command → Authority: “Habeas holds, Mandamus makes, Quo questions”.<br>📚 Laxmikanth"]]]
  };
  function drawUni() {
    var U = [["cloze", "Simple cloze", "Ek blank — aadhe cards sawal (Q: …?) aur aadhe fill-in-the-blank. Back par context, explanation, trick."],
             ["basic", "Basic", "Sawal → bold jawab; neeche context, explanation, trick."],
             ["table", "Table cloze", "Table ke cells blank — comparisons, Article/year groups ke liye."]];
    $("urows").innerHTML = U.map(function (u) {
      return '<div class="tile' + (UT[u[0]] ? " on" : "") + '"><button type="button" class="shot" data-uview="' + u[0] + '" aria-label="Preview ' + u[1] + '"><img loading="lazy" src="' + src("u-" + u[0] + "-q") + '" alt="' + u[1] + ' front side"><span class="zoom">👁 Front / Back</span></button>' +
        '<label class="tpick"><input type="checkbox" id="u-' + u[0] + '" data-u="' + u[0] + '"' + (UT[u[0]] ? " checked" : "") + '><span class="tname">' + u[1] + '</span></label><span class="tbest">' + u[2] + '</span><span class="tsub"><span class="pill">Any Anki</span><span class="pill">All subjects</span></span><button type="button" class="ibtn" data-guide-u="' + u[0] + '">ℹ️ Kaise banayein</button></div>';
    }).join("");
  }
  function buildU() {
    var v = {}; ids.forEach(function (k) { v[k] = $(k).value.trim(); });
    var m = mode(), pyq = $("pyq").checked;
    var X = { ncert: $("x-ncert").checked, wiki: $("x-wiki").checked, ca: $("x-ca").checked, pib: $("x-pib").checked };
    var extra = X.ncert || X.wiki || X.ca || X.pib;
    var xNames = [X.ncert && "NCERT", X.wiki && "Wikipedia", X.ca && "current affairs", X.pib && "PIB"].filter(Boolean);
    var on = ["cloze", "basic", "table"].filter(function (k) { return UT[k]; }); if (!on.length) on = ["cloze", "basic"];
    var useCloze = on.indexOf("cloze") > -1 || on.indexOf("table") > -1, useBasic = on.indexOf("basic") > -1;
    var deck = v.deck || "My Deck";
    var LBL = { cloze: "simple cloze", basic: "basic Q → A", table: "table cloze" };
    var sizeTxt = { auto: "auto — small topic 30–50 cards, medium 50–90, large 100–150+; never pad, never cut real facts", few: "only the most important facts, about 30 cards", medium: "about 50–90 cards", max: "maximum coverage — every testable fact" }[v.size];
    var L = [];
    L.push("You are an expert teacher and Anki card designer. Turn the attached material into the **best possible Anki cards**. Imagine a student who has **never studied this topic** and learns it **only from these cards** — every card must make sense on its own and be easy to remember.");
    L.push("");
    L.push("## MY SETTINGS");
    L.push("- **Today's date:** " + (niceDate(v.date) || "[not given]"));
    L.push("- **Exam / purpose:** " + (v.exam || "general understanding") + " · **Language:** " + (v.lang || "English"));
    L.push("- **Card kinds:** " + on.map(function (k) { return LBL[k]; }).join(", "));
    L.push("- **Amount:** " + sizeTxt);
    L.push("- **Deck:** " + (m === "ask" ? "I will choose it while importing" : m === "sub" ? deck + " (parent) with topic sub-decks" : deck));
    L.push("- **Extra cards:** " + (extra ? "yes — from " + xNames.join(", ") : "no"));
    if (v.topic) L.push("- **Source / topic:** " + v.topic);
    if (v.wish) L.push("- **Special instructions:** " + v.wish);
    L.push("");
    L.push("## 1. Read and check");
    L.push("- Read the WHOLE source (PDF, image, transcript, book, notes). For images/scans read every label and table. For transcripts ignore filler. For MCQs/PYQs extract the fact being tested" + (pyq ? " and note exam + year." : "."));
    L.push("- First show me the topics you found and how many cards of each kind you plan, then continue without waiting.");
    L.push("- Fact-check everything against standard books (NCERT etc.). If the source is wrong, write the correct fact and tag `Src::Corrected`. Never invent anything; list doubts in the summary.");
    L.push("");
    L.push("## 2. Note types — Anki's built-in ones (every Anki has them)");
    if (useBasic) L.push("- **`Basic`** — fields **Front | Back**.");
    if (useCloze) L.push("- **`Cloze`** — fields **Text | Back Extra**.");
    L.push("");
    L.push("## 3. How to write each card");
    if (on.indexOf("cloze") > -1) {
      L.push("### Simple cloze → note type `Cloze`");
      L.push("- ONE blank per note: `{{c1::answer::hint}}`. The hint is a short question saying what to recall (`::Which organelle?`, `::Article number?`, `::Which year?`), never the answer itself or its first letter.");
      L.push("- **Mix two styles 50 / 50:** half the notes as a **direct question** with the blank as the answer — `Q: Which Article abolishes untouchability?<br>{{c1::Article 17::Article number?}}` — and half as a **fill-in-the-blank sentence** — `Untouchability is abolished by {{c1::Article 17::Article number?}}.`");
      L.push("- **Back Extra is never empty**: `<b>Context:</b> …<br><b>Explanation:</b> …<br>🧠 <b>Trick:</b> …<br>📚 source`.");
      L.push("");
    }
    if (useBasic) {
      L.push("### Basic → note type `Basic`");
      L.push("- **Front:** a clear, self-contained question (context inside it — “In the Indian Constitution, …”). Mix What / Why / How / Which-is-not questions.");
      L.push("- **Back:** the answer in **bold** on the first line, then `<hr>`, then `<b>Context:</b> …<br><b>Explanation:</b> …<br>🧠 <b>Trick:</b> …<br>📚 source`.");
      L.push("");
    }
    if (on.indexOf("table") > -1) {
      L.push("### Table cloze → note type `Cloze`");
      L.push("- **Text:** a bold title line, then an HTML table on ONE line: `<table><tr><th>…</th><th>…</th></tr><tr><td>row label</td><td>{{c1::cell::hint}}</td></tr>…</table>`.");
      L.push("- First row = headers (`<th>`). Keep the row labels visible; blank the answer cells — each cell its own number (c1, c2, c3 …), every blank with a question hint. 3–6 rows, 2–4 columns. Use it for comparisons and “X → its Article / year / state” groups.");
      L.push("- **Back Extra:** `<b>Context:</b> …<br><b>Explanation:</b> …<br>🧠 <b>Trick:</b> …` for the whole table.");
      L.push("");
    }
    L.push("### Rules for every card");
    L.push("- **Context, explanation and memory trick on the back of EVERY card** — never empty. Explanation in 2–3 simple lines; trick = acronym, story, word link, number hook or Hindi/English sound-alike, accurate and one line.");
    L.push("- One fact per card (a table holds one connected group). No “which of the above”, no MCQ wording, no typed-answer cards. Never ask the same fact twice" + (pyq ? "; merge repeats and list all PYQs on the back (`<b>PYQ:</b> UPSC 2019, UPPSC 2021`)." : "."));
    L.push("- **Bold** the key words; add Hindi names in brackets where useful. Facts that change over time: write “as of <month year>”.");
    L.push("");
    if (extra) {
      L.push("## 4. Extra cards");
      L.push("Add **15–25 %** extra cards beyond the source (same rules, tag `Extra`): " + [X.ncert && "**NCERT** (tag `Src::NCERT`)", X.wiki && "**Wikipedia** stable facts (tag `Src::Wiki`)", X.ca && "**current affairs** up to " + (niceDate(v.date) || "today") + " with the date written in the card (tag `Src::CA::<YYYY>`)", X.pib && "**PIB** releases with exact names, numbers and release date (tag `Src::PIB`)"].filter(Boolean).join("; ") + "." + ((X.ca || X.pib) ? " Use web search if you have it; never invent news." : "") + (m !== "ask" ? " Put them in `" + deck + "::Extra`." : ""));
      L.push("");
    }
    L.push("## " + (extra ? "5" : "4") + ". Output — one file `anki_import.txt` (or one code block)");
    L.push("```"); L.push("#separator:tab"); L.push("#html:true"); L.push("#notetype column:1");
    if (m === "ask") L.push("#tags column:2"); else { L.push("#deck column:2"); L.push("#tags column:3"); }
    L.push("```");
    L.push("One note per line: `NoteType <TAB> " + (m === "ask" ? "" : "Deck <TAB> ") + "Tags <TAB> fields…`. " + (m === "fixed" ? "Deck is always `" + deck + "`. " : m === "sub" ? "Deck = `" + deck + "::<Topic>` (3–8 short topic sub-decks). " : "No deck column. ") + "Tags space-separated, `::` for levels. No real line breaks or TABs inside a field (use `<br>`); never start a field with `\"`. HTML only `<b> <i> <u> <br> <hr> <sub> <sup>`" + (on.indexOf("table") > -1 ? " and, for table cloze, `<table> <tr> <th> <td>` (no style attributes)." : "."));
    L.push("");
    L.push("Example lines (→ means a TAB):");
    L.push("```");
    on.forEach(function (k) {
      UEX[k].forEach(function (e) {
        var row = [e[1][0]];
        if (m === "fixed") row.push(deck); else if (m === "sub") row.push(deck + "::" + (e[0].split("::")[1] || "Topic"));
        row.push(e[0]);
        L.push(row.concat(e[1].slice(1)).join("→"));
      });
    });
    L.push("```");
    L.push("");
    L.push("## " + (extra ? "6" : "5") + ". Final check, then a short summary");
    L.push("- Every line starts with `" + (useBasic && useCloze ? "Basic` or `Cloze" : useBasic ? "Basic" : "Cloze") + "`; field count right; every blank has a question hint; no answer leaks." + (on.indexOf("cloze") > -1 ? " Simple cloze ≈ half question style, half fill-in-the-blank." : "") + " Every back has Context + Explanation + Trick.");
    L.push("- Summary: cards per kind and topic" + (extra ? ", extra cards and the date current affairs are verified up to" : "") + ", errors corrected, anything unclear.");
    L.push("");
    L.push("_Import: Anki → File → Import → `anki_import.txt`. If your Anki is in another language, rename `Basic` / `Cloze` in the file to your built-in names._");
    return L.join("\n");
  }

  /* ---------------- state ---------------- */
  function render() {
    $("deckfield").hidden = mode() === "ask";
    var t = PM === "uni" ? buildU() : build();
    $("preview").textContent = t;
    $("stats").textContent = t.split(/\s+/).length.toLocaleString() + " words · " + (PM === "uni" ? "universal prompt" : SEL.length + " note types");
    $("mineWrap").hidden = PM === "uni"; $("uniWrap").hidden = PM !== "uni";
    Array.prototype.forEach.call(document.querySelectorAll("[data-pm]"), function (b) { b.classList.toggle("on", b.getAttribute("data-pm") === PM); b.setAttribute("aria-pressed", b.getAttribute("data-pm") === PM); });
    ["cloze", "basic", "table"].forEach(function (k) { var i = $("u-" + k); if (i) { i.checked = UT[k]; i.closest(".tile").classList.toggle("on", UT[k]); } });
    var un = {}; D.types.forEach(function (x) { if (x.name) un[x.name] = 1; }); $("ntcount").textContent = "· " + (Object.keys(un).length + Object.keys(D.cstyles).length) + " note types · " + D.types.filter(function (x) { return x.grp; }).length + " Smart modes";
    save();
  }
  function save() {
    try {
      var s = { deckmode: mode(), sel: SEL, view: VIEW, exp: EXP, pm: PM, ut: UT };
      ids.forEach(function (k) { if (k !== "date") s[k] = $(k).value; });
      checks.forEach(function (k) { s[k] = $(k).checked; });
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }
  function load(s) {
    ids.forEach(function (k) { if (k !== "date" && s[k] !== undefined) $(k).value = s[k]; });
    checks.forEach(function (k) { if (s[k] !== undefined) $(k).checked = s[k]; });
    var r = document.querySelector('input[name="deckmode"][value="' + (s.deckmode || "ask") + '"]'); if (r) r.checked = true;
    if (s.sel) SEL = s.sel.filter(function (k) { return BYK[k]; });
    if (s.view) VIEW = s.view;
    if (s.pm) PM = s.pm;
    if (s.ut) UT = { cloze: !!s.ut.cloze, basic: !!s.ut.basic, table: !!s.ut.table };
    if (s.exp) { EXP.smartbasic = !!s.exp.smartbasic; EXP.smartcloze = !!s.exp.smartcloze; }
  }

  $("cstyle").innerHTML = Object.keys(D.cstyles).map(function (k) { return '<option value="' + k + '">' + esc(D.cstyles[k].name) + ' (' + D.cstyles[k].fields.join(" · ") + ')</option>'; }).join("");
  $("presets").innerHTML += Object.keys(D.presets).map(function (p) { return '<button type="button" class="mini" data-preset="' + esc(p) + '">' + esc(p) + '</button>'; }).join("") + '<button type="button" class="mini" id="clearsel">Clear</button>';
  $("date").value = today();
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved) load(saved); } catch (e) {}
  setView(); drawPicker(); syncChecks(); drawUni();

  document.addEventListener("change", function (e) {
    var uk = e.target.getAttribute && e.target.getAttribute("data-u");
    if (uk) { UT[uk] = e.target.checked; render(); return; }
    var g = e.target.getAttribute && e.target.getAttribute("data-g");
    if (g) { setGroup(g, e.target.checked); return; }
    var k = e.target.getAttribute && e.target.getAttribute("data-k");
    if (k) toggle(k, e.target.checked);
  });
  function setGroup(g, on) { gk(g).forEach(function (k) { var i = SEL.indexOf(k); if (on && i < 0) SEL.push(k); if (!on && i > -1) SEL.splice(i, 1); }); syncChecks(); render(); }
  $("tray").addEventListener("click", function (e) { var k = e.target.getAttribute("data-rm"); if (!k) return; if (k.indexOf("g:") === 0) setGroup(k.slice(2), false); else toggle(k, false); });
  $("presets").addEventListener("click", function (e) {
    var p = e.target.getAttribute("data-preset");
    if (p) { SEL = D.presets[p].slice(); syncChecks(); render(); }
    if (e.target.id === "clearsel") { SEL = []; syncChecks(); render(); }
  });
  $("q").addEventListener("input", search);
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-view]") : null;
    if (b) { VIEWG = b.getAttribute("data-viewg"); openView(b.getAttribute("data-view")); return; }
    var xb = e.target.closest ? e.target.closest("[data-exp]") : null;
    if (xb) { var xg = xb.getAttribute("data-exp"); EXP[xg] = !EXP[xg]; drawPicker(); syncChecks(); save(); if (EXP[xg]) $("mp-" + xg).scrollIntoView({ behavior: "smooth", block: "nearest" }); return; }
    if (e.target.id === "mv-pick" && e.target.getAttribute("data-k2").indexOf("u:") === 0) { var u2 = e.target.getAttribute("data-k2").slice(2); UT[u2] = !UT[u2]; render(); e.target.textContent = UT[u2] ? "✓ Selected — hatao" : "+ Ye card chuno"; e.target.classList.toggle("done", UT[u2]); return; }
    if (e.target.id === "mv-pick") { var k = e.target.getAttribute("data-k2"); if (k.indexOf("g:") === 0) { var gg = k.slice(2), st = gstate(gg); setGroup(gg, st.n < st.all); VIEWG = gg; openView(GRP[gg].rep); } else { toggle(k, SEL.indexOf(k) < 0); VIEWG = null; openView(k); } return; }
    if (e.target.id === "mv-close" || e.target.id === "mv") { var d = $("mv"); if (d.close) d.close(); else d.removeAttribute("open"); }
    var pmb = e.target.closest ? e.target.closest("[data-pm]") : null;
    if (pmb) { PM = pmb.getAttribute("data-pm"); render(); return; }
    var uv = e.target.closest ? e.target.closest("[data-uview]") : null;
    if (uv) { var uk2 = uv.getAttribute("data-uview"), UL = { cloze: "Universal · Simple cloze (Anki Cloze)", basic: "Universal · Basic (Anki Basic)", table: "Universal · Table cloze (Anki Cloze)" };
      $("mv-title").textContent = UL[uk2]; $("mv-best").textContent = "Anki ka built-in note type — kisi bhi Anki mein chalega."; $("mv-fields").textContent = "Fields: " + (uk2 === "basic" ? "Front · Back" : "Text · Back Extra");
      $("mv-q").src = src("u-" + uk2 + "-q"); $("mv-a").src = src("u-" + uk2 + "-a"); $("mv-pick").setAttribute("data-k2", "u:" + uk2); $("mv-pick").textContent = UT[uk2] ? "✓ Selected — hatao" : "+ Ye card chuno"; $("mv-pick").classList.toggle("done", !!UT[uk2]);
      var dd = $("mv"); if (dd.showModal) { if (!dd.open) dd.showModal(); } else dd.setAttribute("open", ""); return; }
    var ga = e.target.getAttribute && e.target.getAttribute("data-grpall");
    if (ga) { var ks = D.types.filter(function (x) { return x.grp === ga; }).map(function (x) { return x.k; }); var all = ks.every(function (k) { return SEL.indexOf(k) > -1; }); ks.forEach(function (k) { var i = SEL.indexOf(k); if (all && i > -1) SEL.splice(i, 1); if (!all && i < 0) SEL.push(k); }); syncChecks(); render(); return; }
    var vb = e.target.closest ? e.target.closest("[data-v]") : null;
    if (vb) { VIEW = vb.getAttribute("data-v"); setView(); drawPicker(); syncChecks(); search(); save(); }
  });
  function setView() { Array.prototype.forEach.call(document.querySelectorAll("[data-v]"), function (b) { b.classList.toggle("on", b.getAttribute("data-v") === VIEW); b.setAttribute("aria-pressed", b.getAttribute("data-v") === VIEW); }); document.body.classList.toggle("gal", VIEW === "gallery"); }
  $("cstyle").addEventListener("change", function () { drawPicker(); syncChecks(); search(); render(); });
  $("form").addEventListener("input", render);
  $("form").addEventListener("change", render);
  $("form").addEventListener("submit", function (e) { e.preventDefault(); });
  $("reset").addEventListener("click", function () { load(DEFAULTS); $("date").value = today(); drawPicker(); syncChecks(); render(); });
  $("copy").addEventListener("click", function () {
    var t = $("preview").textContent, btn = $("copy");
    function ok() { btn.textContent = "Copied ✓"; btn.classList.add("done"); $("msg").textContent = "Prompt copy ho gaya — AI mein paste karo aur apni file attach karo."; setTimeout(function () { btn.textContent = "Copy prompt"; btn.classList.remove("done"); }, 2200); }
    function fallback() { var r = document.createRange(); r.selectNodeContents($("preview")); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); $("msg").textContent = "Auto-copy blocked hai — poora text select kar diya hai, ab Cmd/Ctrl + C dabao."; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fallback); else fallback();
  });
    if ($("dl")) $("dl").addEventListener("click", function () {
    var txt = $("preview").textContent;
    var names = []; var seen = {};
    ordered().forEach(function (t) { var n = t.grp ? t.grp : t.k; if (!seen[n]) { seen[n] = 1; names.push(n); } });
    var fn = "Anki_Prompt_" + (names.length > 4 ? names.length + "_types" : names.join("_")) + "_" + ($("date").value || today()) + ".txt";
    try {
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" })); a.download = fn;
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      $("msg").textContent = fn + " download ho gaya.";
    } catch (e) { $("msg").textContent = "Download nahi ho paya — Copy prompt use karo."; }
  });

  /* ================= 📘 CARD-MAKING GUIDE ================= */
  var CZTIP = {
    none: "Is note type mein cloze <code>{{c1::…}}</code> <b>nahi</b> lagta — bas fields bharo, card khud ban jayega.",
    one: "Sirf <b>ek</b> blank: answer select karo → <kbd>Ctrl/Cmd + Shift + C</kbd>. Fir <code>::</code> ke baad hint likho (sawal ki tarah).",
    multi: "Har blank alag number: pehla blank <kbd>Ctrl/Cmd + Shift + C</kbd> (c1), agla bhi wahi shortcut (c2, c3…). Har blank ke baad <code>::hint?</code> likho. Har number ka ek alag card banta hai.",
    trap: "<code>{{c1::SAHI::GALAT}}</code> — doosre <code>::</code> ke baad wo <b>galat value</b> likho jisse log confuse hote hain (hint nahi). Card kabhi sahi, kabhi galat dikhata hai.",
    slot: "<code>{{c1::ANSWER::galat1|galat2|galat3}}</code> — doosre <code>::</code> ke baad 3 galat options <code>|</code> se alag karke.",
    tfv: "Har statement ek cloze mein: <code>{{c1:: … }}</code>. Andar <code>[[sahi|galat|galat]]</code> (pehla = sahi) aur <code>[[A~B~C]]</code> (koi bhi chalega).",
    tlc: "Har answer <b><code>#</code></b> se shuru: <code>{{c1::#1526}}</code>. Date aur event dono ko alag number do. Date blank par hint nahi."
  };
  function dec(s) { var x = document.createElement("textarea"); x.innerHTML = s; return x.value; }
  function isRich(v) { return /<(ol|ul|li|table|div|hr)\b/i.test(v); }
  function readable(v) { return dec(String(v).replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")); }
  function code(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); }
  var GCOPY = [];
  function gcopy(txt) { GCOPY.push(txt); return GCOPY.length - 1; }
  function guideHTML(o) {
    GCOPY = [];
    var h = '<div class="gd-head"><h3>🛠 Khud kaise banayein</h3><span class="hint">Anki mein ye card haath se banane ka tareeka — example ke saath.</span></div>';
    h += '<ol class="gd-steps">' +
      (o.dl ? '<li>Pehli baar? Note type download karke Anki mein import karo (double-click): <a class="btn ghost" href="' + esc(o.dl) + '" download>⬇ ' + esc(o.name) + ' (.apkg)</a></li>' : '') +
      '<li>Anki kholo → <b>Add</b> (<kbd>A</kbd>) dabao.</li>' +
      '<li><b>Type</b> mein ye note type chuno: <code class="nt">' + esc(o.name) + '</code> <button type="button" class="mini gcp" data-gc="' + gcopy(o.name) + '">Copy naam</button></li>' +
      '<li>Neeche diye example ki tarah har <b>field</b> bharo. Nayi line ke liye <kbd>Enter</kbd> dabao.</li>' +
      '<li><b>Tags</b> mein likho: <code>' + esc(o.tags || "Topic") + '</code>' + (o.mtag ? ' — <b><code>' + esc(o.mtag) + '</code> tag zaroori hai</b>, isi se card ka roop (mode) badalta hai.' : ' (topic ke hisaab se).') + '</li>' +
      '<li><b>Add</b> dabao. Card ready!</li></ol>';
    h += '<p class="gd-tip">💡 ' + (CZTIP[o.cz] || CZTIP.none) + '</p>';
    h += '<div class="gd-fields">';
    o.fields.forEach(function (f, i) {
      var v = o.ex[f] || "";
      var rich = isRich(v);
      h += '<div class="gd-f"><div class="gd-fn"><b>' + (i + 1) + '. ' + esc(f) + '</b>' + (v ? '<button type="button" class="mini gcp" data-gc="' + gcopy(v) + '">Copy HTML</button>' : '<span class="hint">khaali chhod sakte ho</span>') + '</div>' +
        (v ? '<pre class="gd-v">' + esc(rich ? v : readable(v)) + '</pre>' + (rich ? '<span class="hint">Is field mein HTML hai — field par click karo, <kbd>Ctrl/Cmd + Shift + X</kbd> (HTML editor) kholo aur “Copy HTML” wala text paste karo.</span>' : '') : '') + '</div>';
    });
    h += '</div>';
    if (o.spec && o.spec.length) h += '<details class="gd-rules"><summary>📏 Format ke rules (detail)</summary><div>' + o.spec.map(function (s) { return '<p>' + code(s.replace(/^\s*-\s*/, "")) + '</p>'; }).join("") + '</div></details>';
    if (o.modes) h += '<div class="gd-modes"><b>Is note type ke saare modes</b> <span class="hint">— tag badlo, card ka roop badal jayega. Kisi par tap karke uska example dekho:</span><div class="gd-mlist">' + o.modes.map(function (m) { return '<button type="button" class="mini" data-guide="' + m.k + '">' + esc(m.mlabel) + (m.mtag ? ' · <code>' + esc(m.mtag) + '</code>' : ' · no tag') + '</button>'; }).join("") + '</div></div>';
    var line = [o.name, o.tags || "Topic"].concat(o.fields.map(function (f) { return (o.ex[f] || "").replace(/\t/g, " "); }));
    while (line.length > 2 && !line[line.length - 1]) line.pop();
    var file = "#separator:tab\n#html:true\n#notetype column:1\n#tags column:2\n" + line.join("\t") + "\n";
    h += '<div class="gd-imp"><button type="button" class="btn ghost gcp" data-gc="' + gcopy(file) + '">📋 Example ko import-file ki tarah copy karo</button><span class="hint">Text editor mein paste karke <code>.txt</code> save karo → Anki → File → Import. Card turant dikh jayega.</span></div>';
    h += '<p class="gd-tip">✍️ <b>Bold</b> = <kbd>Ctrl/Cmd + B</kbd> · Upar <b>Front</b> / <b>Back</b> image = yahi example Anki mein kaisa dikhta hai.</p>';
    return h;
  }
  function guideFor(k) {
    var t = BYK[k]; if (!t) return null;
    var r = R(t), o = { name: r.name, fields: r.fields, ex: r.ex.f, tags: r.ex.tags, spec: r.spec, cz: r.cz, mtag: t.mtag || "", dl: t.dl || "" };
    if (t.grp) o.modes = D.types.filter(function (x) { return x.grp === t.grp; });
    return o;
  }
  function fillGuide(k) { var o = guideFor(k); $("mv-guide").innerHTML = o ? guideHTML(o) : ""; }
  function fillGuideU(u) {
    var e = UEX[u][UEX[u].length - 1], f = e[1];
    var o = { name: f[0], tags: e[0], fields: f[0] === "Basic" ? ["Front", "Back"] : ["Text", "Back Extra"], ex: {}, cz: u === "basic" ? "none" : (u === "table" ? "multi" : "one"), spec: [] };
    o.ex[o.fields[0]] = f[1]; o.ex[o.fields[1]] = f[2];
    if (u === "table") o.spec = ["Table banane ke liye: field par click → `Ctrl/Cmd + Shift + X` (HTML editor) → `<table>` code paste karo; ya Anki ke editor mein table bana kar har answer-cell ko select karke cloze (Ctrl/Cmd + Shift + C, phir agla number) lagao. Row ke naam (pehla column) visible rakho."];
    if (u === "cloze") o.spec = ["Aadhe cards sawal ki tarah: `Q: …?` phir nayi line par blank. Aadhe normal sentence ke andar blank.", "Back Extra kabhi khaali nahi: Context + Explanation + 🧠 Trick."];
    if (u === "basic") o.spec = ["Front: saaf sawal. Back: pehli line mein bold jawab, phir `<hr>`, phir Context + Explanation + 🧠 Trick."];
    $("mv-guide").innerHTML = guideHTML(o);
  }
  function openGuide(k) { VIEWG = null; openView(k); setTimeout(function () { $("mv-guide").scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); }
  function dlbtn(t) { return t.dl ? '<a class="ibtn" href="' + esc(t.dl) + '" download title="Note type ko Anki mein import karo">⬇ Note type (.apkg)</a>' : ""; }
  function gbtn(k) { return '<button type="button" class="ibtn" data-guide="' + k + '" title="Ye card khud kaise banayein">ℹ️ Kaise banayein</button>'; }

  function drawGuideSection() {
    var box = $("guidelist"); if (!box) return;
    var h = '<div class="gsec"><h3>🌐 Universal (Anki built-in)</h3><div class="glist">' +
      [["cloze", "Simple cloze"], ["basic", "Basic"], ["table", "Table cloze"]].map(function (u) { return '<button type="button" class="gitem" data-guide-u="' + u[0] + '"><img loading="lazy" src="' + src("u-" + u[0] + "-q") + '" alt=""><span><b>' + u[1] + '</b><small>Kisi bhi Anki mein</small></span></button>'; }).join("") + '</div></div>';
    var groups = [["✦ Smart Basic — modes", D.types.filter(function (t) { return t.grp === "smartbasic"; })], ["✦ Smart Cloze — layouts", D.types.filter(function (t) { return t.grp === "smartcloze"; })]];
    D.cats.forEach(function (c) { groups.push([c.label, D.types.filter(function (t) { return t.cat === c.k && !t.grp; })]); });
    groups.forEach(function (g) {
      if (!g[1].length) return;
      h += '<div class="gsec"><h3>' + esc(g[0]) + '</h3><div class="glist">' + g[1].map(function (t) {
        return '<button type="button" class="gitem" data-guide="' + t.k + '"><img loading="lazy" src="' + img(t, "q") + '" alt=""><span><b>' + esc(t.grp ? t.mlabel : label(t)) + '</b><small>' + esc(t.best) + '</small></span></button>';
      }).join("") + '</div></div>';
    });
    box.innerHTML = h;
  }
  function gfilter() {
    var q = ($("gq").value || "").toLowerCase().trim();
    Array.prototype.forEach.call(document.querySelectorAll("#guidelist .gitem"), function (b) { b.hidden = q && b.textContent.toLowerCase().indexOf(q) < 0; });
    Array.prototype.forEach.call(document.querySelectorAll("#guidelist .gsec"), function (s) { s.hidden = !s.querySelector(".gitem:not([hidden])"); });
  }
  document.addEventListener("click", function (e) {
    var c = e.target.closest ? e.target.closest(".gcp") : null;
    if (c) { var txt = GCOPY[+c.getAttribute("data-gc")], old = c.textContent;
      var done = function () { c.textContent = "Copied ✓"; setTimeout(function () { c.textContent = old; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { window.prompt("Copy:", txt); }); else window.prompt("Copy:", txt);
      return; }
    var g = e.target.closest ? e.target.closest("[data-guide]") : null;
    if (g) { openGuide(g.getAttribute("data-guide")); return; }
    var gu = e.target.closest ? e.target.closest("[data-guide-u]") : null;
    if (gu) { var u = gu.getAttribute("data-guide-u"), sh = document.querySelector('.shot[data-uview="' + u + '"]'); if (sh) sh.click(); setTimeout(function () { $("mv-guide").scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); return; }
    var uv = e.target.closest ? e.target.closest("[data-uview]") : null;
    if (uv) fillGuideU(uv.getAttribute("data-uview"));
  });
  if ($("gq")) $("gq").addEventListener("input", gfilter);
  drawGuideSection();

  render();
})();
