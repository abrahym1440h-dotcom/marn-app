// الوسيط الآمن - يدعم اللغتين (عربي/إنجليزي)

const MODELS_TO_TRY = [
  "llama-3.3-70b",
  "llama3.1-8b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
];

const NEEDS_SEARCH_PATTERNS = [
  /اليوم|أمس|الآن|حالي|الحالي|الحالية|أحدث|آخر|جديد|مؤخر/,
  /today|yesterday|now|current|latest|recent|breaking/i,
  /\d{4}/,
  /سعر|أسعار|نتيجة|نتائج|مباراة|مباريات|طقس|أخبار/,
  /price|score|match|weather|news|stock/i,
];

function needsLiveSearch(question) {
  return NEEDS_SEARCH_PATTERNS.some(p => p.test(question));
}

async function searchWeb(query, tavilyKey) {
  if (!tavilyKey) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey, query,
        search_depth: "basic", max_results: 5, include_answer: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const lines = [];
    if (data.answer) lines.push("Answer: " + data.answer);
    if (Array.isArray(data.results)) {
      data.results.slice(0, 5).forEach((r, i) => {
        lines.push(`[${i + 1}] ${r.title}\n${r.content?.slice(0, 400) || ""}`);
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

  let question, history, lang;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = body?.question;
    history = Array.isArray(body?.history) ? body.history.slice(-6) : [];
    lang = body?.lang === "en" ? "en" : "ar";
  } catch {
    return res.status(400).json({ error: "Bad request" });
  }
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Question missing" });
  }

  let searchContext = "";
  let didSearch = false;
  if (tavilyKey && needsLiveSearch(question)) {
    const results = await searchWeb(question, tavilyKey);
    if (results) {
      searchContext = "\n\n# Live search results (use these in your answer):\n" + results;
      didSearch = true;
    }
  }

  const systemPromptAr = `أنت "مرن" - مساعد ذكاء اصطناعي ذكي ومثقف يردّ باللغة العربية الفصحى السهلة.

# المبدأ الأساسي
هدفك إعطاء إجابة شاملة دقيقة في بطاقة منظّمة. قسّم المعلومات لأجزاء مرئية واضحة، لا فقرات طويلة.

# قواعد الجودة
- كن دقيقاً جداً: استخدم أرقاماً وحقائق محددة
- إن وُجدت نتائج بحث مرفقة، اعتمد عليها بشكل أساسي
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

  const systemPromptEn = `You are "Marn" - an intelligent, knowledgeable AI assistant. Respond in clear English.

# Core principle
Your goal is to give a comprehensive, accurate answer in a structured card. Split info into clear visual sections, not long paragraphs.

# Quality rules
- Be very accurate: use specific numbers and facts
- If search results are provided, rely on them primarily
- Cover the question from 2-4 angles (tabs)
- Use clear, professional English

# Required format - JSON only, nothing else
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
      const timeout = setTimeout(() => controller.abort(), 28000);

      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 2500 }),
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
