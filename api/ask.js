// الوسيط الآمن - نسخة "الالتزام بالحقائق"
// تجبر الذكاء على استخدام نتائج البحث كحقائق نهائية

const MODELS_TO_TRY = [
  "llama-3.3-70b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
  "llama3.1-8b",
];

const TIME_WORDS = /اليوم|أمس|الآن|حالي|الحالي|الحالية|أحدث|آخر|جديد|مؤخر|قادم|المقبل|next|today|yesterday|now|current|latest|recent|breaking|upcoming/i;
const QUESTION_WORDS = /متى|أين|كم|كيف|من هو|من هي|من فاز|أي\s|ما هو|ما هي|when|where|how many|how much|who is|who won|what is/i;
const ENTITY_WORDS = /بطولة|كأس|مباراة|مباريات|دوري|نتيجة|نتائج|ترتيب|جدول|تشكيلة|لاعب|فريق|نادي|منتخب|championship|cup|match|league|score|standings|team|player/i;
const NEWS_WORDS = /أخبار|خبر|إعلان|إطلاق|صدر|نزل|إصدار|تحديث|إيلون|ترامب|محمد بن سلمان|الملك|الأمير|الرئيس|news|launch|release|update|announcement|trump|elon|president|king|prince/i;
const TECH_WORDS = /آيفون|سامسونج|تسلا|قوقل|أبل|مايكروسوفت|أوبن|gpt|chatgpt|claude|gemini|iphone|samsung|tesla|google|apple|microsoft|openai|meta|amazon/i;
const MONEY_WORDS = /سعر|أسعار|تكلفة|راتب|أرباح|دخل|قيمة|سهم|أسهم|عملة|دولار|ريال|يورو|بتكوين|price|cost|salary|earnings|revenue|stock|currency|dollar|riyal|euro|bitcoin/i;
const WEATHER_WORDS = /طقس|درجة|حرارة|أمطار|رياح|temperature|weather|rain|wind/i;
const GEO_WORDS = /دولة|مدينة|عاصمة|سكان|مساحة|تعداد|country|city|capital|population|area/i;
const HAS_NUMBERS = /\b(19|20)\d{2}\b|\b\d{4,}\b/;
const PROPER_NOUNS_EN = /\b[A-Z][a-z]{3,}\b/;

const SEARCH_PATTERNS = [
  TIME_WORDS, QUESTION_WORDS, ENTITY_WORDS, NEWS_WORDS,
  TECH_WORDS, MONEY_WORDS, WEATHER_WORDS, GEO_WORDS,
  HAS_NUMBERS, PROPER_NOUNS_EN,
];

const NO_SEARCH_PATTERNS = [
  /^(مرحبا|أهلا|السلام|هاي|هلا|hi|hello|hey)\b/i,
  /^(شكرا|thanks|thank you)\b/i,
  /اكتب لي|اقترح لي|أعطني فكرة|ابتكر|اخترع|write me|suggest me|give me an idea/i,
];

function needsLiveSearch(question) {
  if (NO_SEARCH_PATTERNS.some(p => p.test(question))) return false;
  if (question.trim().length < 8) return false;
  return SEARCH_PATTERNS.some(p => p.test(question));
}

async function searchWeb(query, tavilyKey) {
  if (!tavilyKey) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey, query,
        search_depth: "advanced",
        max_results: 8,
        include_answer: "advanced",
        include_raw_content: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const out = { answer: data.answer || "", results: [] };
    if (Array.isArray(data.results)) {
      data.results.slice(0, 8).forEach(r => {
        out.results.push({
          title: r.title || "",
          url: r.url || "",
          content: (r.content || "").slice(0, 600),
        });
      });
    }
    return out;
  } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const rawKey = process.env.CEREBRAS_API_KEY;
  if (!rawKey) return res.status(500).json({ error: "API key missing" });
  const apiKey = rawKey.trim();
  if (!apiKey.startsWith("csk-")) return res.status(500).json({ error: "Invalid key" });

  const tavilyKey = (process.env.TAVILY_API_KEY || "").trim();

  let question, history, lang, forceSearch;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = body?.question;
    history = Array.isArray(body?.history) ? body.history.slice(-6) : [];
    lang = body?.lang === "en" ? "en" : "ar";
    forceSearch = body?.forceSearch === true;
  } catch {
    return res.status(400).json({ error: "Bad request" });
  }
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Question missing" });
  }

  let searchData = null;
  let didSearch = false;
  const shouldSearch = forceSearch || (tavilyKey && needsLiveSearch(question));

  if (shouldSearch && tavilyKey) {
    searchData = await searchWeb(question, tavilyKey);
    if (searchData) didSearch = true;
  }

  // بناء جزء البحث في system prompt
  let searchBlock = "";
  if (searchData) {
    const lines = [];
    lines.push("\n\n===== FACTS FROM WEB SEARCH =====");
    lines.push("⚠️ CRITICAL: These are the ONLY authoritative facts. Use them as primary source.");
    lines.push("⚠️ If your training memory contradicts these facts, IGNORE your memory and use these.");
    lines.push("⚠️ Do NOT invent details not present in these results.");
    lines.push("");
    if (searchData.answer) {
      lines.push("📌 Verified summary:");
      lines.push(searchData.answer);
      lines.push("");
    }
    if (searchData.results.length) {
      lines.push("📚 Detailed sources:");
      searchData.results.forEach((r, i) => {
        lines.push(`\n[Source ${i + 1}] ${r.title}`);
        lines.push(`URL: ${r.url}`);
        lines.push(r.content);
      });
    }
    lines.push("\n===== END OF FACTS =====");
    searchBlock = lines.join("\n");
  }

  const systemPromptAr = `أنت "مرن" - مساعد ذكاء اصطناعي دقيق يردّ باللغة العربية الفصحى.

# 🚨 قواعد الصدق المطلقة (لا يجوز كسرها)
1. ${searchData ? "هناك حقائق من بحث الإنترنت مرفقة في الأسفل. هذه الحقائق هي **المصدر الوحيد المعتمد**. التزم بها حرفياً." : "لا توجد نتائج بحث متاحة. استخدم معرفتك، وإذا لم تكن متأكداً قل ذلك صراحة في الإجابة."}
2. **لا تخترع أبداً**: لا تواريخ، لا أرقام، لا أسماء، لا أماكن. إذا لم تجد المعلومة في نتائج البحث، اكتب "غير متوفر في المصادر" بدلاً من التخمين.
3. **إذا تعارضت معرفتك مع نتائج البحث**: ✋ توقف فوراً عن استخدام معرفتك واتبع نتائج البحث.
4. **اقتبس بدقة من نتائج البحث**: التواريخ، الأسماء، الأماكن، الأرقام - كلها يجب أن تكون كما وردت في المصادر.
5. ${searchData ? "اذكر في 'sub' أن المعلومات مستندة على بحث حي حديث." : "اذكر في 'sub' أن المعلومات من المعرفة العامة وقد لا تكون محدّثة."}

# المهمة
إعطاء إجابة منظّمة في بطاقة JSON. غطّ السؤال من 2-4 زوايا (تبويبات).

# الشكل المطلوب - JSON فقط
{
  "accent": "knowledge | history | sport | food",
  "kicker": "تصنيف قصير",
  "title": "عنوان دقيق",
  "sub": "ملخص في سطر واحد",
  "tabs": [
    { "label": "اسم القسم", "type": "النوع", "data": {} }
  ]
}

# الأنواع
- "stats": {"items":[{"value":"1932","label":"عنوان","hint":"تفاصيل"}]}
- "steps": {"intro":"تمهيد","steps":[{"t":"عنوان","d":"شرح"}]}
- "list": {"intro":"تمهيد","items":["نقطة"]}
- "timeline": {"events":[["1932","العنوان","الوصف"]]}
- "compare": {"cols":["الوجه","أ","ب"],"rows":[["صف","قيمة","قيمة"]]}
- "facts": {"items":[{"icon":"📍","text":"معلومة"}]}
- "text": {"body":"نص"}

ابدأ مباشرة بـ { وانتهِ بـ }. لا تكتب أي شي قبل أو بعد JSON.${searchBlock}`;

  const systemPromptEn = `You are "Marn" - an accurate AI assistant. Respond in clear English.

# 🚨 STRICT TRUTH RULES (never break)
1. ${searchData ? "Web search facts are attached below. These are the **ONLY authoritative source**. Follow them literally." : "No search results available. Use your knowledge, and explicitly state when uncertain."}
2. **Never invent**: no dates, no numbers, no names, no places. If info isn't in search results, write "not available in sources" instead of guessing.
3. **If your memory contradicts search**: ✋ STOP using memory, follow search results.
4. **Quote precisely from sources**: dates, names, places, numbers - all must match sources exactly.
5. ${searchData ? "Mention in 'sub' that info is based on live web search." : "Mention in 'sub' that info is from general knowledge and may not be current."}

# Task
Give structured JSON card answer. Cover question from 2-4 angles (tabs).

# Required Format - JSON only
{
  "accent": "knowledge | history | sport | food",
  "kicker": "short category",
  "title": "accurate title",
  "sub": "one-line summary",
  "tabs": [
    { "label": "section name", "type": "type", "data": {} }
  ]
}

# Types
- "stats": {"items":[{"value":"1932","label":"title","hint":"details"}]}
- "steps": {"intro":"intro","steps":[{"t":"title","d":"description"}]}
- "list": {"intro":"intro","items":["point"]}
- "timeline": {"events":[["1932","title","desc"]]}
- "compare": {"cols":["aspect","A","B"],"rows":[["row","val","val"]]}
- "facts": {"items":[{"icon":"📍","text":"info"}]}
- "text": {"body":"text"}

Start immediately with { and end with }. No text before/after JSON.${searchBlock}`;

  const systemPrompt = lang === "en" ? systemPromptEn : systemPromptAr;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({ role: h.role || "user", content: String(h.content || "") })),
    { role: "user", content: question },
  ];

  let lastError = "";
  for (const model of MODELS_TO_TRY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.1,  // أقل حرارة = أكثر التزاماً بالحقائق
          max_tokens: 3000,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        if (errText.includes("not_found_error") || response.status === 404) {
          lastError = model + ": not found";
          continue;
        }
        return res.status(response.status).json({
          error: "AI request failed (" + response.status + ")",
          detail: errText.slice(0, 300),
        });
      }

      const data = await response.json();
      let raw = data?.choices?.[0]?.message?.content || "";
      raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) raw = raw.slice(start, end + 1);

      let card;
      try {
        card = JSON.parse(raw);
      } catch {
        card = {
          accent: "knowledge",
          kicker: lang === "en" ? "Answer" : "إجابة",
          title: lang === "en" ? "Answer" : "الإجابة",
          sub: "",
          tabs: [{ label: lang === "en" ? "Answer" : "الإجابة", type: "text", data: { body: raw || "" } }],
        };
      }

      if (!card || typeof card !== "object" || !Array.isArray(card.tabs)) {
        card = {
          accent: "knowledge",
          kicker: lang === "en" ? "Answer" : "إجابة",
          title: lang === "en" ? "Answer" : "الإجابة",
          sub: "",
          tabs: [{ label: lang === "en" ? "Answer" : "الإجابة", type: "text", data: { body: String(raw || "") } }],
        };
      }

      return res.status(200).json({ card, model_used: model, searched: didSearch });
    } catch (e) {
      lastError = model + ": " + String(e?.message || e);
      continue;
    }
  }

  return res.status(502).json({ error: "No model available", detail: lastError });
}
