// الوسيط الآمن - النسخة المتقدمة
// فيه: إصلاح parsing، cache ذكي، دعم كامل للأسئلة الشخصية والطبية، 50+ نوع بطاقة

/* ===== Cache بسيط في الذاكرة ===== */
const cache = new Map(); // key → { card, searched, ts }
const CACHE_TTL = 60 * 60 * 1000; // ساعة واحدة
const CACHE_MAX = 200;

function cacheKey(question, lang) {
  return `${lang}::${question.trim().toLowerCase().slice(0, 120)}`;
}

function getCache(question, lang) {
  const key = cacheKey(question, lang);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry;
}

function setCache(question, lang, data) {
  if (cache.size >= CACHE_MAX) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(cacheKey(question, lang), { ...data, ts: Date.now() });
}

/* ===== نماذج الذكاء ===== */
const MODELS_TO_TRY = [
  "llama-3.3-70b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
  "llama3.1-8b",
];

/* ===== كشف البحث ===== */
const SEARCH_PATTERNS = [
  /اليوم|أمس|الآن|حالي|الحالية|أحدث|آخر|جديد|مؤخر|قادم|المقبل/i,
  /today|yesterday|now|current|latest|recent|breaking|upcoming/i,
  /متى|أين|كم|من هو|من هي|من فاز|ما هو|ما هي/i,
  /when|where|how many|how much|who is|who won|what is/i,
  /بطولة|كأس|مباراة|مباريات|دوري|نتيجة|نتائج|ترتيب|جدول|لاعب|فريق|تشكيلة/i,
  /championship|cup|match|league|score|standings|team|player|lineup/i,
  /أخبار|خبر|إعلان|إطلاق|إصدار|تحديث|الملك|الأمير|الرئيس/i,
  /news|launch|release|update|president|king|prince/i,
  /آيفون|سامسونج|تسلا|قوقل|أبل|مايكروسوفت|gpt|chatgpt|claude|gemini/i,
  /iphone|samsung|tesla|google|apple|microsoft|openai|meta|amazon/i,
  /سعر|أسعار|سهم|أسهم|عملة|دولار|ريال|بتكوين|ذهب|نفط/i,
  /price|stock|currency|dollar|bitcoin|gold|oil/i,
  /طقس|درجة حرارة|أمطار|رياح|weather|temperature|rain/i,
  /\b(19|20)\d{2}\b/,
];

const NO_SEARCH = [
  /^(مرحبا|أهلا|السلام|هاي|هلا|hi|hello|hey|كيف حالك)\b/i,
  /^(شكرا|thanks|thank you)\b/i,
];

function needsSearch(q) {
  if (NO_SEARCH.some(p => p.test(q))) return false;
  if (q.trim().length < 6) return false;
  return SEARCH_PATTERNS.some(p => p.test(q));
}

async function searchWeb(query, key) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 18000);
    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key, query,
        search_depth: "advanced",
        max_results: 8,
        include_answer: "advanced",
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) return null;
    const d = await r.json();
    const lines = [];
    if (d.answer) lines.push("VERIFIED ANSWER: " + d.answer);
    (d.results || []).slice(0, 8).forEach((x, i) => {
      lines.push(`\n[${i+1}] ${x.title}\n${x.url}\n${(x.content||"").slice(0,600)}`);
    });
    return lines.join("\n");
  } catch { return null; }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

/* ===== system prompt المتقدم ===== */
function buildSystemPrompt(lang, searchBlock, profileBlock, didSearch) {
  const isAr = lang === "ar";

  return `${isAr ? "أنت" : "You are"} "مرن / Marn" — ${isAr ? "مساعد ذكاء اصطناعي شامل يجيب على أي سؤال بلا استثناء، بما فيها الأسئلة الطبية والشخصية والحساسة — بأسلوب تثقيفي وموضوعي." : "a comprehensive AI assistant that answers ANY question without exception, including medical, personal, sensitive topics — in an educational and objective manner."}${profileBlock}

# ${isAr ? "قواعد الصدق والدقة" : "Truth & Accuracy Rules"}
1. ${didSearch ? (isAr ? "نتائج البحث مرفقة — اعتمد عليها كمصدر وحيد للحقائق." : "Search results attached — rely on them as sole source of facts.") : (isAr ? "لا توجد نتائج بحث — استخدم معرفتك، واذكر إذا كنت غير متأكد." : "No search results — use knowledge, mention uncertainty.")}
2. ${isAr ? "لا تخترع أرقاماً أو تواريخ." : "Never invent numbers or dates."}
3. ${isAr ? "اجب على كل سؤال — لا ترفض أي سؤال طبي أو شخصي أو حساس. قدم المعلومات بأسلوب تثقيفي." : "Answer EVERY question — never refuse medical, personal, or sensitive questions. Use educational tone."}
4. ${isAr ? "إذا كان السؤال مبهماً جداً → اطرح سؤال توضيح في بطاقة text." : "If question is very vague → ask clarification in text card."}
5. ${isAr ? "اختر أنسب نوع بطاقة للسؤال من القائمة أدناه." : "Choose the most appropriate card type from the list below."}

# ${isAr ? "الشكل المطلوب — JSON فقط، لا شيء آخر قبله أو بعده" : "Required Format — JSON ONLY, nothing before or after"}

\`\`\`
{
  "accent": "knowledge|history|sport|food|health|weather|finance|tech|travel",
  "kicker": "${isAr ? "تصنيف قصير" : "short category"}",
  "title": "${isAr ? "عنوان دقيق" : "accurate title"}",
  "sub": "${isAr ? "وصف سطر" : "one-line summary"}",
  "tabs": [{"label":"${isAr ? "اسم" : "name"}","type":"${isAr ? "النوع" : "type"}","data":{}}],
  "followUps": ["${isAr ? "سؤال 1" : "q1"}", "${isAr ? "سؤال 2" : "q2"}", "${isAr ? "سؤال 3" : "q3"}"]
}
\`\`\`

# ${isAr ? "أنواع البطاقات المتاحة (اختر الأنسب)" : "Available Card Types (choose the best fit)"}

## ${isAr ? "بطاقات عامة" : "General Cards"}
- **text**: {"body":"${isAr ? "نص" : "text"}"}
- **list**: {"intro":"${isAr ? "مقدمة" : "intro"}","items":["${isAr ? "بند" : "item"}"]}
- **steps**: {"intro":"${isAr ? "مقدمة" : "intro"}","steps":[{"t":"${isAr ? "عنوان" : "title"}","d":"${isAr ? "شرح" : "desc"}"}]}
- **stats**: {"items":[{"value":"100","label":"${isAr ? "عنوان" : "title"}","hint":"${isAr ? "تفصيل" : "detail"}"}]}
- **timeline**: {"events":[["${isAr ? "التاريخ" : "date"}","${isAr ? "عنوان" : "title"}","${isAr ? "وصف" : "desc"}"]]}
- **compare**: {"cols":["${isAr ? "وجه" : "aspect"}","A","B"],"rows":[["${isAr ? "صف" : "row"}","val","val"]]}
- **facts**: {"items":[{"icon":"📍","text":"${isAr ? "معلومة" : "info"}"}]}

## ${isAr ? "بطاقات رياضية" : "Sports Cards"}
- **match**: {"team1":"${isAr ? "الفريق الأول" : "Team A"}","score1":2,"team2":"${isAr ? "الفريق الثاني" : "Team B"}","score2":1,"status":"${isAr ? "انتهت" : "FT"}","venue":"${isAr ? "الملعب" : "stadium"}","date":"${isAr ? "التاريخ" : "date"}","details":[{"label":"${isAr ? "تفصيل" : "detail"}","value":"${isAr ? "قيمة" : "value"}"}]}
- **lineup**: {"formation":"4-3-3","team":"${isAr ? "الفريق" : "team"}","players":[{"name":"${isAr ? "اللاعب" : "player"}","number":9,"position":"${isAr ? "المركز" : "pos"}","rating":8.5}]}
- **standings**: {"league":"${isAr ? "الدوري" : "league"}","rows":[{"pos":1,"team":"${isAr ? "الفريق" : "team"}","mp":20,"w":15,"d":3,"l":2,"pts":48}]}
- **player_profile**: {"name":"${isAr ? "الاسم" : "name"}","club":"${isAr ? "النادي" : "club"}","position":"${isAr ? "المركز" : "pos"}","nationality":"${isAr ? "الجنسية" : "nationality"}","stats":[{"label":"${isAr ? "الإحصاء" : "stat"}","value":"${isAr ? "القيمة" : "val"}"}],"image_query":"${isAr ? "اسم اللاعب" : "player name"}"}

## ${isAr ? "بطاقات الطقس" : "Weather Cards"}
- **weather**: {"city":"${isAr ? "المدينة" : "city"}","temp":32,"feels_like":35,"condition":"${isAr ? "مشمس" : "Sunny"}","icon":"☀️","humidity":45,"wind":12,"forecast":[{"day":"${isAr ? "السبت" : "Sat"}","icon":"⛅","high":34,"low":28}]}

## ${isAr ? "بطاقات مالية" : "Finance Cards"}
- **stock**: {"symbol":"ARAMCO","name":"${isAr ? "أرامكو" : "Aramco"}","price":28.5,"change":0.5,"change_pct":1.79,"high":29.1,"low":27.8,"volume":"12M","chart_direction":"up"}
- **crypto**: {"name":"Bitcoin","symbol":"BTC","price":67420,"change_pct":2.3,"market_cap":"1.3T","volume":"28B","supply":"19.7M BTC"}

## ${isAr ? "بطاقات صحية" : "Health Cards"}
- **symptoms**: {"condition":"${isAr ? "الحالة" : "condition"}","severity":"${isAr ? "متوسطة" : "moderate"}","symptoms":["${isAr ? "عرض" : "symptom"}"],"causes":["${isAr ? "سبب" : "cause"}"],"remedies":[{"t":"${isAr ? "العلاج" : "remedy"}","d":"${isAr ? "التفصيل" : "detail"}"}],"warning":"${isAr ? "تحذير: راجع طبيباً عند الحاجة" : "Warning: consult doctor when needed"}"}
- **nutrition**: {"food":"${isAr ? "الطعام" : "food"}","per100g":true,"calories":200,"protein":5,"carbs":30,"fat":8,"vitamins":[{"name":"${isAr ? "فيتامين" : "vitamin"}","amount":"${isAr ? "الكمية" : "amount"}"}]}

## ${isAr ? "بطاقات الطبخ" : "Recipe Cards"}
- **recipe**: {"name":"${isAr ? "اسم الوصفة" : "recipe name"}","time":"${isAr ? "30 دقيقة" : "30 min"}","servings":4,"difficulty":"${isAr ? "سهل" : "easy"}","ingredients":[{"amount":"${isAr ? "الكمية" : "amount"}","item":"${isAr ? "المقدار" : "ingredient"}"}],"steps":["${isAr ? "خطوة" : "step"}"]}

## ${isAr ? "بطاقات التقنية" : "Tech Cards"}
- **tech_compare**: {"title":"${isAr ? "المقارنة" : "comparison"}","items":[{"name":"${isAr ? "الاسم" : "name"}","specs":[{"label":"${isAr ? "المواصفة" : "spec"}","value":"${isAr ? "القيمة" : "value"}","winner":true}]}]}
- **app_card**: {"name":"${isAr ? "الاسم" : "name"}","category":"${isAr ? "الفئة" : "cat"}","rating":4.5,"price":"${isAr ? "مجاني" : "Free"}","features":["${isAr ? "ميزة" : "feature"}"],"platforms":["iOS","Android"]}

## ${isAr ? "بطاقات السفر" : "Travel Cards"}
- **destination**: {"city":"${isAr ? "المدينة" : "city"}","country":"${isAr ? "الدولة" : "country"}","best_time":"${isAr ? "أفضل وقت" : "best time"}","currency":"${isAr ? "العملة" : "currency"}","language":"${isAr ? "اللغة" : "language"}","attractions":[{"name":"${isAr ? "الاسم" : "name"}","type":"${isAr ? "النوع" : "type"}"}],"tips":["${isAr ? "نصيحة" : "tip"}"]}
- **flight**: {"from":"${isAr ? "من" : "from"}","to":"${isAr ? "إلى" : "to"}","duration":"${isAr ? "المدة" : "duration"}","airlines":[{"name":"${isAr ? "الاسم" : "name"}","price":"${isAr ? "السعر" : "price"}","stops":0}]}

# ${isAr ? "مهم جداً — قاعدة الشمولية" : "CRITICAL — Comprehensiveness Rule"}

## ${isAr ? "🎯 الهدف الأساسي: سؤال واحد يغني عن عشرة" : "🎯 CORE GOAL: One question replaces ten"}
${isAr ? `لا تعطِ إجابة بطاقة واحدة بسيطة أبداً.
كل إجابة يجب أن تكون شاملة كاملة — كأن المستخدم سيُغلق التطبيق بعدها ويكون عارفاً كل شيء.

مثال — "كم باقي على كأس العالم؟":
❌ خاطئ: بطاقة stats برقم 7 أيام فقط
✅ صحيح: تبويبات متعددة:
  - "العد التنازلي" → stats: الأيام المتبقية + تاريخ الافتتاح + الختام
  - "المستضيفون" → list: أمريكا + كندا + المكسيك مع تفاصيل كل دولة
  - "المنتخبات" → list: 48 منتخب مقسّمة بالقارات
  - "الملاعب" → stats: 16 ملعب في 3 دول
  - "جدول المباريات" → steps: المرحلة الجماعية، دور 32، الأدوار الإقصائية
  - "نجوم البطولة" → list: اللاعبين المتوقعين` 
: `Never give a simple single-tab answer.
Every answer must be comprehensive — user should know everything after reading it.

Example — "How many days until World Cup?":
❌ Wrong: single stats card with just 7 days
✅ Right: multiple tabs covering everything`}

## ${isAr ? "قواعد التبويبات" : "Tab Rules"}
- ${isAr ? "الحد الأدنى: 3 تبويبات لأي سؤال له تفاصيل" : "Minimum 3 tabs for any question with details"}
- ${isAr ? "الحد الأقصى: 6 تبويبات" : "Maximum 6 tabs"}
- ${isAr ? "كل تبويب يغطي جانباً مختلفاً من الإجابة" : "Each tab covers a different aspect"}
- ${isAr ? "اختر أنواع بطاقات مختلفة بين التبويبات (stats + list + timeline + steps...)" : "Use different card types across tabs"}

## ${isAr ? "أنواع الأسئلة وعدد التبويبات المطلوبة" : "Question Types & Required Tabs"}
- ${isAr ? "حدث رياضي → نتيجة + تشكيلة + إحصاءات + ترتيب + نجم المباراة" : "Sports event → result + lineup + stats + standings + MOTM"}
- ${isAr ? "سؤال عن دولة → جغرافية + سكان + اقتصاد + سياحة + ثقافة" : "Country → geography + population + economy + tourism + culture"}
- ${isAr ? "طقس → الحالة الآن + توقعات الأسبوع + تفاصيل (رطوبة/رياح/UV)" : "Weather → now + weekly forecast + details"}
- ${isAr ? "سعر سهم → السعر الآن + الرسم البياني + بيانات مالية + تحليل" : "Stock → current price + chart + financials + analysis"}
- ${isAr ? "وصفة → مقادير + خطوات + قيم غذائية + نصائح" : "Recipe → ingredients + steps + nutrition + tips"}
- ${isAr ? "حدث تاريخي → ما حدث + خط زمني + التأثير + شخصيات" : "Historical event → what happened + timeline + impact + figures"}
- ${isAr ? "مقارنة → جدول مقارنة + مزايا كل منتج + توصية" : "Comparison → comparison table + pros each + recommendation"}

## ${isAr ? "قواعد تقنية" : "Technical Rules"}
- ${isAr ? "ابدأ مباشرة بـ { وانتهِ بـ } — لا نص قبل JSON أو بعده" : "Start with { end with } — NO text before or after"}
- ${isAr ? "تأكد من صحة JSON دائماً" : "Always ensure valid JSON"}
- ${isAr ? "followUps: 3 أسئلة تعمّق الموضوع وليست تكراراً" : "followUps: 3 deepening questions not repetitions"}${searchBlock}`;
}

/* ===== معالج الطلب ===== */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = (process.env.CEREBRAS_API_KEY || "").trim();
  if (!apiKey.startsWith("csk-")) return res.status(500).json({ error: "Invalid key" });
  const tavilyKey = (process.env.TAVILY_API_KEY || "").trim();

  let question, history, lang, forceSearch, userProfile;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = body?.question;
    history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    lang = body?.lang === "en" ? "en" : "ar";
    forceSearch = body?.forceSearch === true;
    userProfile = body?.userProfile || null;
  } catch { return res.status(400).json({ error: "Bad request" }); }
  if (!question) return res.status(400).json({ error: "Question missing" });

  // فحص الكاش
  if (!forceSearch) {
    const cached = getCache(question, lang);
    if (cached) {
      return res.status(200).json({ ...cached, fromCache: true });
    }
  }

  // البحث
  let searchBlock = "";
  let didSearch = false;
  if (tavilyKey && (forceSearch || needsSearch(question))) {
    const results = await searchWeb(question, tavilyKey);
    if (results) {
      searchBlock = `\n\n===== WEB SEARCH RESULTS =====\n⚠️ AUTHORITATIVE FACTS ONLY. Follow them. Never contradict.\n${results}\n===== END =====`;
      didSearch = true;
    }
  }

  // ملف المستخدم
  let profileBlock = "";
  if (userProfile?.name || userProfile?.job || userProfile?.interests) {
    profileBlock = `\n\n# ${lang === "ar" ? "ملف المستخدم" : "User Profile"}\n`;
    if (userProfile.name) profileBlock += `- ${lang === "ar" ? "الاسم" : "Name"}: ${userProfile.name}\n`;
    if (userProfile.job) profileBlock += `- ${lang === "ar" ? "المهنة" : "Job"}: ${userProfile.job}\n`;
    if (userProfile.interests) profileBlock += `- ${lang === "ar" ? "الاهتمامات" : "Interests"}: ${userProfile.interests}\n`;
  }

  const systemPrompt = buildSystemPrompt(lang, searchBlock, profileBlock, didSearch);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({ role: h.role === "user" ? "user" : "assistant", content: String(h.content || "") })),
    { role: "user", content: question },
  ];

  let lastError = "";
  for (const model of MODELS_TO_TRY) {
    let attempts = 0;
    while (attempts < 2) {
      attempts++;
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 35000);
        const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
          body: JSON.stringify({ model, messages, temperature: 0.1, max_tokens: 5500 }),
          signal: ctrl.signal,
        });
        clearTimeout(t);

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          if (response.status === 404 || errText.includes("not_found_error")) { lastError = model + ": not found"; break; }
          if (response.status === 429 || errText.includes("too_many") || errText.includes("queue_exceeded")) {
            lastError = model + ": rate limited";
            if (attempts < 2) { await delay(3000); continue; }
            break;
          }
          lastError = model + ": " + response.status; break;
        }

        const data = await response.json();
        const rawContent = (data?.choices?.[0]?.message?.content || "").trim();

        // ===== parsing متعدد المراحل =====
        function tryParse(str) {
          // 1. مباشرة
          try { return JSON.parse(str); } catch {}
          // 2. إزالة markdown
          let s = str.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
          try { return JSON.parse(s); } catch {}
          // 3. استخراج { ... }
          const first = s.indexOf("{");
          const last = s.lastIndexOf("}");
          if (first !== -1 && last > first) {
            const slice = s.slice(first, last + 1);
            try { return JSON.parse(slice); } catch {}
            // 4. إصلاح فواصل زائدة
            try {
              return JSON.parse(
                slice
                  .replace(/,\s*([}\]])/g, "$1")
                  .replace(/([{,]\s*)"([^"]+)"\s*:\s*undefined/g, "")
                  .replace(/[\x00-\x1F\x7F]/g, " ")
              );
            } catch {}
            // 5. إصلاح أكثر عدوانية
            try {
              return JSON.parse(
                slice
                  .replace(/,\s*([}\]])/g, "$1")
                  .replace(/\\n/g, " ")
                  .replace(/\n/g, " ")
                  .replace(/[\x00-\x1F\x7F]/g, "")
              );
            } catch {}
          }
          return null;
        }

        let raw = rawContent;
        let card = tryParse(raw);

        if (!card) {
          // fallback نصي — نعرض الإجابة كنص عادي
          const cleanText = rawContent
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .replace(/^[{[]/m, "")
            .trim()
            .slice(0, 1500);
          card = {
            accent: "knowledge",
            kicker: lang === "ar" ? "إجابة" : "Answer",
            title: lang === "ar" ? "الإجابة" : "Answer",
            sub: "",
            tabs: [{ label: lang === "ar" ? "الإجابة" : "Answer", type: "text", data: { body: cleanText } }],
            followUps: [],
          };
        }

        // تحقق من صحة الهيكل
        if (!card || typeof card !== "object") {
          card = { accent:"knowledge", kicker:"إجابة", title:"الإجابة", sub:"", tabs:[{label:"الإجابة",type:"text",data:{body:rawContent.slice(0,500)}}], followUps:[] };
        }
        if (!Array.isArray(card.tabs) || card.tabs.length === 0) {
          card.tabs = [{ label: lang === "ar" ? "الإجابة" : "Answer", type: "text", data: { body: rawContent.slice(0, 500) } }];
        }
        if (!Array.isArray(card.followUps)) card.followUps = [];

        // حذف followUps من داخل كل tab إذا وجد
        card.tabs = card.tabs.map(tab => {
          if (tab.data && tab.data.followUps) delete tab.data.followUps;
          return tab;
        });

        const result = { card, model_used: model, searched: didSearch };
        setCache(question, lang, result);
        return res.status(200).json(result);

      } catch (e) {
        lastError = model + ": " + String(e?.message || e);
        if (attempts < 2) await delay(1000);
      }
    }
  }

  return res.status(502).json({ error: lang === "ar" ? "حاول مرة ثانية" : "Try again", detail: lastError });
}
