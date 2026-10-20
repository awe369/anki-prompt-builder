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
    o.spec = ["- Text: one full, self-contained sentence with ONE blank `{{c1::answer::hint}}`. Extra: the explanation" + (hasMn ? ". Mnemonics: the memory trick only." : ", ending with `🧠 <b>Trick:</b> …`.") + (hasSrc ? " Source: book / chapter." : " Put `📚 <source>` as the last line of Extra (no Source field).")];
    var ex = {}; f.forEach(function (k) { if (t.ex.f[k] !== undefined) ex[k] = t.ex.f[k]; });
    if (!hasMn) ex.Extra = (ex.Extra || "") + "<br>🧠 <b>Trick:</b> " + t.ex.f.Mnemonics;
    if (!hasSrc) ex.Extra = (ex.Extra || "") + "<br>📚 " + t.ex.f.Source;
    o.ex = { tags: t.ex.tags, f: ex };
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
      return '<div class="tile' + (on ? " on" : "") + '" data-tile="' + t.k + '">' +
        '<button type="button" class="shot" data-view="' + t.k + '" aria-label="Preview ' + esc(label(t)) + '"><img loading="lazy" src="' + img(t, "q") + '" alt="' + esc(label(t)) + ' front side"><span class="zoom">👁 Front / Back</span></button>' +
        '<label class="tpick"><input type="checkbox" data-k="' + t.k + '"' + (on ? " checked" : "") + '><span class="tname">' + esc(label(t)) + star + '</span></label>' +
        '<span class="tbest">' + esc(t.best) + '</span>' + pills + '</div>';
    }
    return '<div class="trow"><label class="tpick"><input type="checkbox" data-k="' + t.k + '"' + (on ? " checked" : "") + '>' +
      '<span class="tname">' + esc(label(t)) + star + '</span></label>' +
      '<button type="button" class="eye" data-view="' + t.k + '" aria-label="Preview ' + esc(label(t)) + '">👁</button>' +
      '<span class="tbest">' + esc(t.best) + '</span>' + pills + '</div>';
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
        head + '<span class="tbest">' + esc(G.best) + '</span>' + btn + '</div>';
    }
    return '<div class="trow gtile" data-gtile="' + g + '">' + head + '<button type="button" class="eye" data-view="' + G.rep + '" data-viewg="' + g + '" aria-label="Preview ' + esc(G.name) + '">👁</button><span class="tbest">' + esc(G.best) + '</span>' + btn + '</div>';
  }
  var VIEWG = null;
  function openView(k) {
    var t = BYK[k]; if (!t) return;
    $("mv-title").textContent = label(t);
    $("mv-best").textContent = t.best;
    $("mv-q").src = img(t, "q"); $("mv-a").src = img(t, "a");
    $("mv-fields").textContent = "Fields: " + R(t).fields.join(" · ");
    var sel1 = VIEWG ? gstate(VIEWG).n === gstate(VIEWG).all : SEL.indexOf(k) > -1;
    if (VIEWG) { $("mv-title").textContent = GRP[VIEWG].name + " (example: " + t.mlabel + ")"; $("mv-best").textContent = GRP[VIEWG].best; }
    $("mv-pick").setAttribute("data-k2", VIEWG ? "g:" + VIEWG : k);
    $("mv-pick").textContent = sel1 ? "✓ Selected — hatao" : (VIEWG ? "+ Saare modes chuno" : "+ Ye card chuno");
    $("mv-pick").classList.toggle("done", sel1);
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
  var MCQK = ["sb-mcq", "sb-tf", "mcq", "elim", "ladder", "judge", "inkstat", "chronocode", "context", "whosaid", "slot"];

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
    L.push("- **YouTube / lecture transcript:** ignore filler, repetition and jokes; keep only teachable content; put timestamps (if any) in the source.");
    L.push("- **Book chapter / long notes:** go section by section, don't skip the middle or the end. With more than ~40 pages, finish part 1 and ask me to say “continue” rather than rushing.");
    L.push("- **Question bank / MCQs / PYQs:** extract the **fact** each one tests" + (pyq ? " and record exam + year." : "."));
    L.push("- **Web article / mixed:** keep facts, drop opinion and ads.");
    L.push("");
    L.push("**Before writing any card, show me:** the topics you found, the planned number of notes of each type (with titles), and any part that is unclear or unreadable. Then continue without waiting.");
    L.push("");
    L.push("**Fact-check every fact** against standard books (NCERT, Laxmikanth, Spectrum, bare acts…). If the source is wrong: write the **correct** fact, mention the wrong version as a trap, and add the tag `Src::Corrected`. Facts that change over time: write “as of <month year>”. Never invent anything — no invented dates, numbers, coordinates, quotes or cases; if unsure, leave it out and list it in the summary.");
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
    if (withSubj.length) L.push((r++) + ". **Subject field** (" + withSubj.map(nm).join(", ") + "): one word — Polity, History, Geography, Economy, Environment, Science, Culture, Law or Current Affairs.");
    if (smart.length) L.push((r++) + ". " + smart.map(nm).join(" and ") + ": each note gets exactly ONE of its chosen mode tags (" + smart.map(function (g) { return g.modes.map(function (x) { return x.mtag ? "`" + x.mtag + "`" : "none"; }).join(" / "); }).join("; ") + ") in the Tags column, next to the topic tags.");
    L.push((r++) + ". **No typed-answer cards** — never make a card where the learner has to type the answer.");
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
      var f = t.fields.map(function (k) { return t.ex.f[k] || ""; });
      while (f.length && !f[f.length - 1]) f.pop();
      L.push(row.concat(f).join("→"));
    });
    L.push("```");
    L.push("(Examples show the layout only — write your own content from MY source.)");
    L.push("");
    L.push("## PART F — Final check (do it and report it)");
    L.push("- [ ] Header exactly as in Part E; every line starts with " + (NT.length === 1 ? "exactly " + nm(NT[0]) : "one of: " + NT.map(nm).join(", ")) + ".");
    L.push("- [ ] Field count and order match Part B for each type; no TAB/newline inside a field; no field starts with `\"`.");
    if (normalCloze.length) L.push("- [ ] EVERY normal cloze has a hint; no answer leaks.");
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

  /* ---------------- state ---------------- */
  function render() {
    $("deckfield").hidden = mode() === "ask";
    var t = build();
    $("preview").textContent = t;
    $("stats").textContent = t.split(/\s+/).length.toLocaleString() + " words · " + SEL.length + " note types";
    var un = {}; D.types.forEach(function (x) { if (x.name) un[x.name] = 1; }); $("ntcount").textContent = "· " + (Object.keys(un).length + Object.keys(D.cstyles).length) + " note types · " + D.types.filter(function (x) { return x.grp; }).length + " Smart modes";
    save();
  }
  function save() {
    try {
      var s = { deckmode: mode(), sel: SEL, view: VIEW, exp: EXP };
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
    if (s.exp) { EXP.smartbasic = !!s.exp.smartbasic; EXP.smartcloze = !!s.exp.smartcloze; }
  }

  $("cstyle").innerHTML = Object.keys(D.cstyles).map(function (k) { return '<option value="' + k + '">' + esc(D.cstyles[k].name) + ' (' + D.cstyles[k].fields.join(" · ") + ')</option>'; }).join("");
  $("presets").innerHTML += Object.keys(D.presets).map(function (p) { return '<button type="button" class="mini" data-preset="' + esc(p) + '">' + esc(p) + '</button>'; }).join("") + '<button type="button" class="mini" id="clearsel">Clear</button>';
  $("date").value = today();
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved) load(saved); } catch (e) {}
  setView(); drawPicker(); syncChecks();

  document.addEventListener("change", function (e) {
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
    if (e.target.id === "mv-pick") { var k = e.target.getAttribute("data-k2"); if (k.indexOf("g:") === 0) { var gg = k.slice(2), st = gstate(gg); setGroup(gg, st.n < st.all); VIEWG = gg; openView(GRP[gg].rep); } else { toggle(k, SEL.indexOf(k) < 0); VIEWG = null; openView(k); } return; }
    if (e.target.id === "mv-close" || e.target.id === "mv") { var d = $("mv"); if (d.close) d.close(); else d.removeAttribute("open"); }
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
  render();
})();
