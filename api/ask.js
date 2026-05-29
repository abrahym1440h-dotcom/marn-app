// الوسيط الآمن - نسخة محسّنة بنظام بحث ذكي موسّع
// يبحث في الإنترنت لمعظم الأسئلة اللي تحتاج معلومات دقيقة

const MODELS_TO_TRY = [
  "llama-3.3-70b",
  "llama3.1-8b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
];

/* =========================================================
   نظام كشف "متى يبحث" - موسّع وذكي
   يبحث في كل سؤال يحتوي على:
   - أرقام (تواريخ، سنوات، إحصاءات)
   - أسماء أعلام، أحداث، مؤسسات
   - بطولات، رياضة، أخبار، تقنية
   - أسعار، اقتصاد، طقس
   - أي سؤال "متى/أين/من/كم"
   - الإنجليزية أيضاً
   ========================================================= */

const TIME_WORDS = /اليوم|أمس|الآن|حالي|الحالي|الحالية|أحدث|آخر|جديد|مؤخر|قادم|المقبل|next|today|yesterday|now|current|latest|recent|breaking|upcoming/i;
const QUESTION_WORDS = /متى|أين|كم|كيف|من هو|من هي|من فاز|أي\s|ما هو|ما هي|when|where|how many|how much|who is|who won|what is/i;
const ENTITY_WORDS = /بطولة|كأس|مباراة|مباريات|دوري|نتيجة|نتائج|ترتيب|جدول|تشكيلة|لاعب|فريق|نادي|منتخب|championship|cup|match|league|score|standings|team|player/i;
const NEWS_WORDS = /أخبار|خبر|إعلان|إطلاق|صدر|نزل|إصدار|تحديث|إيلون|ترامب|محمد بن سلمان|الملك|الأمير|الرئيس|news|launch|release|update|announcement|trump|elon|president|king|prince/i;
const TECH_WORDS = /آيفون|سامسونج|تسلا|قوقل|أبل|مايكروسوفت|أوبن|gpt|chatgpt|claude|gemini|iphone|samsung|tesla|google|apple|microsoft|openai|meta|amazon/i;
const MONEY_WORDS = /سعر|أسعار|تكلفة|راتب|أرباح|دخل|قيمة|سهم|أسهم|عملة|دولار|ريال|يورو|بتكوين|price|cost|salary|earnings|revenue|stock|currency|dollar|riyal|euro|bitcoin/i;
const WEATHER_WORDS = /طقس|درجة|حرارة|أمطار|رياح|temperature|weather|rain|wind/i;
const GEO_WORDS = /دولة|مدينة|عاصمة|سكان|مساحة|تعداد|country|city|capital|population|area/i;

// أرقام: سنوات (1900-2099) أو أرقام كبيرة
const HAS_NUMBERS = /\b(19|20)\d{2}\b|\b\d{4,}\b/;

// أسماء علم (حروف كبيرة في الإنجليزية أو ال + اسم)
const PROPER_NOUNS_EN = /\b[A-Z][a-z]{3,}\b/;

const SEARCH_PATTERNS = [
  TIME_WORDS, QUESTION_WORDS, ENTITY_WORDS, NEWS_WORDS,
  TECH_WORDS, MONEY_WORDS, WEATHER_WORDS, GEO_WORDS,
  HAS_NUMBERS, PROPER_NOUNS_EN,
];

// أسئلة لا تحتاج بحث (محادثة عامة، إبداع، تعريفات بسيطة)
const NO_SEARCH_PATTERNS = [
  /^(مرحبا|أهلا|السلام|هاي|هلا|hi|hello|hey)\b/i,
  /^(شكرا|thanks|thank you)\b/i,
  /اكتب لي|اقترح لي|أعطني فكرة|ابتكر|اخترع|write me|suggest me|give me an idea/i,
  /ترجم|translate/i,
  /ما معنى|what does .* mean|meaning of/i,
];

function needsLiveSearch(question) {
  // لو محادثة عامة، لا نبحث
  if (NO_SEARCH_PATTERNS.some(p => p.test(question))) return false;
  // طول السؤال - الأسئلة القصيرة جداً غالباً محادثة
  if (question.trim().length < 8) return false;
  // لو فيه أي نمط من أنماط البحث، نبحث
  return SEARCH_PATTERNS.some(p => p.test(question));
}

async function searchWeb(query, tavilyKey) {
  if (!tavilyKey) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey, query,
        search_depth: "advanced",  // متقدم - نتائج أفضل
        max_results: 7,
        include_answer: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const lines = [];
    if (data.answer) lines.push("Quick Answer: " + data.answer);
    if (Array.isArray(data.results)) {
      data.results.slice(0, 7).forEach((r, i) => {
        lines.push(`[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content?.slice(0, 500) || ""}`);
      });
    }
    return lines.join("\n\n");
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

  // قرار البحث
  let searchContext = "";
  let didSearch = false;
  const shouldSearch = forceSearch || (tavilyKey && needsLiveSearch(question));

  if (shouldSearch && tavilyKey) {
    const results = await searchWeb(question, tavilyKey);
    if (results) {
      searchContext = "\n\n# نتائج بحث الإنترنت (اعتمد عليها بشكل أساسي - هذي حقائق من مصادر حية):\n" + results;
      didSearch = true;
    }
  }

  const systemPromptAr = `أنت "مرن" - مساعد ذكاء اصطناعي ذكي ودقيق يردّ باللغة العربية الفصحى السهلة.

# قواعد الدقة (مهمة جداً)
1. **إذا وُجدت نتائج بحث مرفقة في الأسفل**: اعتمد عليها بشكل أساسي، ولا تخترع أي معلومة لا توجد فيها
2. **إذا لم توجد نتائج بحث**: استخدم معرفتك بحذر، واذكر في "sub" أن المعلومات قد لا تكون محدّثة
3. **لا تخترع أرقاماً أو تواريخ** - إذا لم تكن متأكداً، قل ذلك صراحة
4. **افهم السياق من المحادثة السابقة** - إذا سأل المستخدم سؤال متابعة، اربطه بالسؤال الأصلي

# هدفك
إعطاء إجابة شاملة دقيقة في بطاقة منظّمة. قسّم المعلومات لأجزاء مرئية واضحة، لا فقرات طويلة.

# قواعد الجودة
- كن دقيقاً جداً: استخدم أرقاماً وحقائق محددة من نتائج البحث
- غطّ السؤال من 2-4 زوايا مختلفة (تبويبات)
- استخدم العربية الفصحى الواضحة

# الشكل المطلوب - JSON فقط بدون أي نص آخر
{
  "accent": "knowledge | history | sport | food",
  "kicker": "تصنيف قصير",
  "title": "عنوان قوي (3-8 كلمات)",
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

ابدأ مباشرة بـ { وانتهِ بـ }. لا تكتب أي شي قبل أو بعد JSON.${searchContext}`;

  const systemPromptEn = `You are "Marn" - an intelligent, accurate AI assistant. Respond in clear English.

# Accuracy Rules (critical)
1. **If search results are attached below**: Rely on them as primary source. Do NOT invent any info not in them.
2. **If no search results**: Use your knowledge cautiously, and mention in "sub" if info may not be current.
3. **Don't invent numbers or dates** - if unsure, say so explicitly.
4. **Understand context from conversation history** - link follow-up questions to original topic.

# Goal
Give comprehensive, accurate answer in structured card. Split info into clear visual sections, not long paragraphs.

# Quality Rules
- Be very accurate: use specific numbers and facts from search results
- Cover question from 2-4 angles (tabs)
- Use clear, professional English

# Required Format - JSON only
{
  "accent": "knowledge | history | sport | food",
  "kicker": "short category",
  "title": "strong title (3-8 words)",
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

Start immediately with { and end with }. No text before/after JSON.${searchContext}`;

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
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 2500 }),
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
