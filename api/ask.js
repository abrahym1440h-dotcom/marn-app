const MODELS_TO_TRY = [
  "llama-3.3-70b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
  "llama3.1-8b",
];

const SEARCH_PATTERNS = [
  /اليوم|أمس|الآن|حالي|الحالية|أحدث|آخر|جديد|مؤخر|قادم|المقبل/i,
  /today|yesterday|now|current|latest|recent|breaking|upcoming/i,
  /متى|أين|كم|من هو|من هي|من فاز|ما هو|ما هي/i,
  /when|where|how many|how much|who is|who won|what is/i,
  /بطولة|كأس|مباراة|مباريات|دوري|نتيجة|نتائج|ترتيب|جدول|لاعب|فريق|نادي|منتخب/i,
  /championship|cup|match|league|score|standings|team|player/i,
  /أخبار|خبر|إعلان|إطلاق|إصدار|تحديث|ترامب|محمد بن سلمان|الملك|الأمير|الرئيس/i,
  /news|launch|release|update|trump|elon|president|king|prince/i,
  /آيفون|سامسونج|تسلا|قوقل|أبل|مايكروسوفت|gpt|chatgpt|claude|gemini/i,
  /iphone|samsung|tesla|google|apple|microsoft|openai|meta|amazon/i,
  /سعر|أسعار|تكلفة|راتب|سهم|أسهم|عملة|دولار|ريال|بتكوين/i,
  /price|cost|salary|stock|currency|dollar|bitcoin/i,
  /طقس|درجة حرارة|أمطار|weather|temperature|rain/i,
  /\b(19|20)\d{2}\b/,
  /\b[A-Z][a-z]{3,}\s[A-Z][a-z]{3,}\b/,
];

const NO_SEARCH = [
  /^(مرحبا|أهلا|السلام|هاي|هلا|hi|hello|hey|كيف حالك|كيف الحال)\b/i,
  /^(شكرا|thanks|thank you)\b/i,
  /اكتب لي قصيدة|اكتب لي قصة|ترجم هذا|write me a poem|translate this/i,
];

function needsSearch(q) {
  if (NO_SEARCH.some(p => p.test(q))) return false;
  if (q.trim().length < 8) return false;
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = (process.env.CEREBRAS_API_KEY || "").trim();
  if (!apiKey.startsWith("csk-")) return res.status(500).json({ error: "Invalid Cerebras key" });

  const tavilyKey = (process.env.TAVILY_API_KEY || "").trim();

  let question, history, lang, forceSearch;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = body?.question;
    history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    lang = body?.lang === "en" ? "en" : "ar";
    forceSearch = body?.forceSearch === true;
  } catch { return res.status(400).json({ error: "Bad request" }); }
  if (!question) return res.status(400).json({ error: "Question missing" });

  // البحث
  let searchBlock = "";
  let didSearch = false;
  if (tavilyKey && (forceSearch || needsSearch(question))) {
    const results = await searchWeb(question, tavilyKey);
    if (results) {
      searchBlock = `

===== WEB SEARCH RESULTS (AUTHORITATIVE) =====
⚠️ USE THESE AS YOUR ONLY SOURCE OF FACTS.
⚠️ If your training memory contradicts these → IGNORE memory, use these results.
⚠️ Do NOT invent dates, names, numbers, or places not present below.
⚠️ If info is not found below → say "غير متوفر في المصادر" (not available in sources).

${results}
===== END OF WEB RESULTS =====`;
      didSearch = true;
    }
  }

  const SYSTEM_AR = `أنت "مرن" — مساعد ذكاء اصطناعي ذكي ودقيق يجيب باللغة العربية.

# قواعد أساسية لا تُكسر
1. إذا كان السؤال مبهماً أو ناقصاً → اطرح سؤال توضيح واحد قصير للمستخدم واعرضه في بطاقة من نوع "text"، ولا تخمن.
   مثال: "وش أفضل API؟" → اسأل: "أفضل API لأي غرض؟ (ذكاء اصطناعي، دفع، خرائط، ...؟)"
2. إذا وُجدت نتائج بحث مرفقة → استخدمها كمصدر وحيد للحقائق، لا تخترع معلومة غير موجودة فيها.
3. إذا لم تجد إجابة في نتائج البحث → قل ذلك صراحة في الإجابة.
4. لا تخترع أرقاماً أو تواريخ أو أسماء أو أماكن.
5. افهم سياق المحادثة — ربط الأسئلة المتابعة بالسياق السابق.

# أمثلة على الأسئلة المبهمة التي تحتاج توضيح
- "وش أفضل؟" → اسأل: "أفضل ماذا؟"
- "كيف أبدأ؟" → اسأل: "تبدأ في أي مجال؟"
- "وين أروح؟" → اسأل: "تقصد سياحة في أي بلد؟"

# الشكل — JSON فقط لا شيء آخر
{
  "accent": "knowledge|history|sport|food",
  "kicker": "تصنيف",
  "title": "عنوان",
  "sub": "وصف سطر",
  "tabs": [{"label":"اسم","type":"النوع","data":{}}]
}

# الأنواع
- "stats": {"items":[{"value":"100","label":"عنوان","hint":"تفصيل"}]}
- "steps": {"intro":"مقدمة","steps":[{"t":"عنوان","d":"شرح"}]}
- "list": {"intro":"مقدمة","items":["بند"]}
- "timeline": {"events":[["1932","عنوان","وصف"]]}
- "compare": {"cols":["وجه","أ","ب"],"rows":[["صف","قيمة","قيمة"]]}
- "facts": {"items":[{"icon":"📍","text":"معلومة"}]}
- "text": {"body":"نص"}

ابدأ فوراً بـ { وانتهِ بـ }.${searchBlock}`;

  const SYSTEM_EN = `You are "Marn" — a smart, accurate AI assistant. Respond in English.

# Core rules (never break)
1. If question is vague/incomplete → ask ONE clarifying question in a "text" card. Never guess.
   Example: "What's the best API?" → ask: "Best API for what? (AI, payments, maps, ...?)"
2. If web search results are attached → use them as sole source of facts.
3. If info not found in search results → say so explicitly.
4. Never invent numbers, dates, names, or places.
5. Understand conversation context — link follow-ups to prior topics.

# Format — JSON only
{
  "accent": "knowledge|history|sport|food",
  "kicker": "category",
  "title": "title",
  "sub": "one-line summary",
  "tabs": [{"label":"name","type":"type","data":{}}]
}

# Types
- "stats": {"items":[{"value":"100","label":"title","hint":"detail"}]}
- "steps": {"intro":"intro","steps":[{"t":"title","d":"desc"}]}
- "list": {"intro":"intro","items":["item"]}
- "timeline": {"events":[["1932","title","desc"]]}
- "compare": {"cols":["aspect","A","B"],"rows":[["row","val","val"]]}
- "facts": {"items":[{"icon":"📍","text":"info"}]}
- "text": {"body":"text"}

Start immediately with { end with }.${searchBlock}`;

  const messages = [
    { role: "system", content: lang === "en" ? SYSTEM_EN : SYSTEM_AR },
    ...history.map(h => ({ role: h.role === "user" ? "user" : "assistant", content: String(h.content || "") })),
    { role: "user", content: question },
  ];

  const delay = ms => new Promise(r => setTimeout(r, ms));
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
          body: JSON.stringify({ model, messages, temperature: 0.1, max_tokens: 3000 }),
          signal: ctrl.signal,
        });
        clearTimeout(t);

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          // موديل غير موجود → جرب الثاني
          if (response.status === 404 || errText.includes("not_found_error")) {
            lastError = model + ": not found"; break;
          }
          // ضغط زائد → انتظر وأعد المحاولة مرة واحدة
          if (response.status === 429 || errText.includes("too_many") || errText.includes("queue_exceeded")) {
            lastError = model + ": rate limited";
            if (attempts < 2) { await delay(3000); continue; }
            break;
          }
          lastError = model + ": " + response.status;
          break;
        }

        const data = await response.json();
        let raw = (data?.choices?.[0]?.message?.content || "")
          .replace(/```json/gi, "").replace(/```/g, "").trim();
        const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
        if (s !== -1 && e > s) raw = raw.slice(s, e + 1);

        let card;
        try { card = JSON.parse(raw); } catch {
          card = { accent:"knowledge", kicker:lang==="en"?"Answer":"إجابة", title:lang==="en"?"Answer":"الإجابة", sub:"", tabs:[{label:lang==="en"?"Answer":"الإجابة",type:"text",data:{body:raw||""}}] };
        }
        if (!card?.tabs) {
          card = { accent:"knowledge", kicker:lang==="en"?"Answer":"إجابة", title:lang==="en"?"Answer":"الإجابة", sub:"", tabs:[{label:lang==="en"?"Answer":"الإجابة",type:"text",data:{body:String(raw||"")}}] };
        }

        return res.status(200).json({ card, model_used: model, searched: didSearch });

      } catch (e) {
        lastError = model + ": " + String(e?.message || e);
        if (attempts < 2) await delay(1000);
      }
    }
  }

  return res.status(502).json({ error: "لا يوجد موديل متاح حالياً، حاول مرة ثانية", detail: lastError });
}
