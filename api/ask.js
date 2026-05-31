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
  /أخبار|خبر|إعلان|إطلاق|إصدار|تحديث|ترامب|الملك|الأمير|الرئيس/i,
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
  /^(مرحبا|أهلا|السلام|هاي|هلا|hi|hello|hey|كيف حالك)\b/i,
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

const delay = ms => new Promise(r => setTimeout(r, ms));

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
    userProfile = body?.userProfile || null; // { name, job, interests }
  } catch { return res.status(400).json({ error: "Bad request" }); }
  if (!question) return res.status(400).json({ error: "Question missing" });

  // البحث
  let searchBlock = "";
  let didSearch = false;
  if (tavilyKey && (forceSearch || needsSearch(question))) {
    const results = await searchWeb(question, tavilyKey);
    if (results) {
      searchBlock = `\n\n===== WEB SEARCH RESULTS (AUTHORITATIVE) =====\n⚠️ Use ONLY these facts. Ignore memory if contradicted.\n⚠️ Never invent dates, names, numbers not present below.\n\n${results}\n===== END =====`;
      didSearch = true;
    }
  }

  // ملف المستخدم
  let profileBlock = "";
  if (userProfile && (userProfile.name || userProfile.job || userProfile.interests)) {
    profileBlock = `\n\n# معلومات المستخدم (استخدمها لتخصيص إجاباتك)\n`;
    if (userProfile.name) profileBlock += `- الاسم: ${userProfile.name}\n`;
    if (userProfile.job) profileBlock += `- المهنة: ${userProfile.job}\n`;
    if (userProfile.interests) profileBlock += `- الاهتمامات: ${userProfile.interests}\n`;
    profileBlock += `خاطب المستخدم باسمه إذا كان مناسباً، وربط إجاباتك باهتماماته ومهنته.`;
  }

  const SYSTEM_AR = `أنت "مرن" — مساعد ذكاء اصطناعي ذكي ودقيق يجيب باللغة العربية.${profileBlock}

# قواعد أساسية
1. إذا كان السؤال مبهماً → اطرح سؤال توضيح واحد في بطاقة "text".
2. إذا وجدت نتائج بحث → استخدمها كمصدر وحيد، لا تخترع.
3. لا تخترع أرقاماً أو تواريخ أو أسماء.
4. في نهاية كل إجابة، أضف حقل "followUps" فيه 3 أسئلة متابعة ذكية مرتبطة بالموضوع.

# الشكل — JSON فقط
{
  "accent": "knowledge|history|sport|food",
  "kicker": "تصنيف",
  "title": "عنوان",
  "sub": "وصف سطر",
  "tabs": [{"label":"اسم","type":"النوع","data":{}}],
  "followUps": ["سؤال متابعة 1", "سؤال متابعة 2", "سؤال متابعة 3"]
}

# الأنواع
- "stats": {"items":[{"value":"100","label":"عنوان","hint":"تفصيل"}]}
- "steps": {"intro":"مقدمة","steps":[{"t":"عنوان","d":"شرح"}]}
- "list": {"intro":"مقدمة","items":["بند"]}
- "timeline": {"events":[["1932","عنوان","وصف"]]}
- "compare": {"cols":["وجه","أ","ب"],"rows":[["صف","قيمة","قيمة"]]}
- "facts": {"items":[{"icon":"📍","text":"معلومة"}]}
- "text": {"body":"نص"}

ابدأ بـ { وانتهِ بـ }.${searchBlock}`;

  const SYSTEM_EN = `You are "Marn" — a smart, accurate AI assistant. Respond in English.${profileBlock ? profileBlock.replace(/العربية/g,"English") : ""}

# Core rules
1. If question is vague → ask ONE clarifying question in a "text" card.
2. If search results attached → use as sole source of facts.
3. Never invent numbers, dates, names.
4. At end of every answer, add "followUps" with 3 smart follow-up questions.

# Format — JSON only
{
  "accent": "knowledge|history|sport|food",
  "kicker": "category",
  "title": "title",
  "sub": "summary",
  "tabs": [{"label":"name","type":"type","data":{}}],
  "followUps": ["follow-up 1", "follow-up 2", "follow-up 3"]
}

# Types
- "stats": {"items":[{"value":"100","label":"title","hint":"detail"}]}
- "steps": {"intro":"intro","steps":[{"t":"title","d":"desc"}]}
- "list": {"intro":"intro","items":["item"]}
- "timeline": {"events":[["1932","title","desc"]]}
- "compare": {"cols":["aspect","A","B"],"rows":[["row","val","val"]]}
- "facts": {"items":[{"icon":"📍","text":"info"}]}
- "text": {"body":"text"}

Start with { end with }.${searchBlock}`;

  const messages = [
    { role: "system", content: lang === "en" ? SYSTEM_EN : SYSTEM_AR },
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
          body: JSON.stringify({ model, messages, temperature: 0.1, max_tokens: 3000 }),
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
        let raw = (data?.choices?.[0]?.message?.content || "").replace(/```json/gi,"").replace(/```/g,"").trim();
        const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
        if (s !== -1 && e > s) raw = raw.slice(s, e + 1);

        let card;
        try { card = JSON.parse(raw); } catch {
          card = { accent:"knowledge", kicker:"إجابة", title:"الإجابة", sub:"", tabs:[{label:"الإجابة",type:"text",data:{body:raw||""}}], followUps:[] };
        }
        if (!card?.tabs) card = { accent:"knowledge", kicker:"إجابة", title:"الإجابة", sub:"", tabs:[{label:"الإجابة",type:"text",data:{body:String(raw||"")}}], followUps:[] };
        if (!Array.isArray(card.followUps)) card.followUps = [];

        return res.status(200).json({ card, model_used: model, searched: didSearch });
      } catch (e) {
        lastError = model + ": " + String(e?.message || e);
        if (attempts < 2) await delay(1000);
      }
    }
  }

  return res.status(502).json({ error: "حاول مرة ثانية", detail: lastError });
}
