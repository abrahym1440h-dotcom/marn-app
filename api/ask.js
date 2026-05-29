// الوسيط الآمن - النسخة المطوّرة
// ذكاء أعمق، إجابات أكمل، بطاقات أغنى

const MODELS_TO_TRY = [
  "llama3.1-8b",
  "llama-3.3-70b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
  "qwen-3-32b",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawKey = process.env.CEREBRAS_API_KEY;
  if (!rawKey) {
    return res.status(500).json({ error: "المفتاح غير موجود في إعدادات الخادم" });
  }
  const apiKey = rawKey.trim();
  if (!apiKey.startsWith("csk-")) {
    return res.status(500).json({
      error: "المفتاح غير صالح",
      hint: "يبدأ بـ " + apiKey.slice(0, 4) + " - يجب أن يبدأ بـ csk-",
    });
  }

  let question, history;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = body?.question;
    history = Array.isArray(body?.history) ? body.history.slice(-6) : [];
  } catch {
    return res.status(400).json({ error: "صيغة الطلب غير صحيحة" });
  }
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "السؤال مفقود" });
  }

  const systemPrompt = `أنت "مرن" - مساعد ذكاء اصطناعي ذكي ومثقف يردّ باللغة العربية الفصحى السهلة.

# المبدأ الأساسي
هدفك إعطاء إجابة شاملة ومُلمّة في بطاقة منظّمة. لا تكتب فقرات طويلة - بل قسّم المعلومات لأجزاء مرئية واضحة.

# قواعد الجودة
- كن دقيقاً: استخدم أرقاماً وحقائق محددة (تواريخ، أعداد، إحصاءات معروفة)
- كن شاملاً: غطّ السؤال من 2-3 زوايا مختلفة (تبويبات)
- كن موجزاً: كل تبويب فيه معلومات مكثفة بدون حشو
- استخدم العربية الفصحى الواضحة
- إذا كان السؤال يتعلق ببيانات لحظية (نتائج رياضية حالية، أسعار، طقس)، اذكر بصراحة في sub أن المعلومات قد لا تكون محدّثة

# الشكل المطلوب - JSON فقط بدون أي نص آخر
{
  "accent": "knowledge | history | sport | food",
  "kicker": "تصنيف من 1-2 كلمة",
  "title": "عنوان قوي ومحدد (3-7 كلمات)",
  "sub": "وصف ملخص في سطر واحد",
  "tabs": [
    { "label": "اسم القسم القصير", "type": "نوع المحتوى", "data": {...} }
  ]
}

# أنواع التبويبات وبياناتها

## "stats" - إحصاءات ورقم (الأفضل للمعلومات الرقمية)
{"items": [
  {"value": "1932", "label": "سنة التأسيس", "hint": "وحدت المملكة"},
  {"value": "35M+", "label": "عدد السكان", "hint": "تقديري"}
]}

## "steps" - خطوات (للوصفات والإرشادات)
{"intro": "تمهيد قصير", "steps": [{"t": "العنوان", "d": "الشرح"}]}

## "list" - قائمة (لنقاط متعددة)
{"intro": "تمهيد", "items": ["نقطة 1", "نقطة 2"]}

## "timeline" - خط زمني (للأحداث التاريخية)
{"events": [["1932", "العنوان", "الوصف"]]}

## "compare" - مقارنة (للمقابلة بين أشياء)
{"cols": ["الوجه", "أ", "ب"], "rows": [["صف", "قيمة", "قيمة"]]}

## "facts" - حقائق سريعة (نقاط معلوماتية مفيدة)
{"items": [
  {"icon": "📍", "text": "العاصمة: الرياض"},
  {"icon": "🌍", "text": "ثاني أكبر دولة عربية مساحة"}
]}

## "text" - نص (آخر خيار، فقط إن لم يناسب الباقي)
{"body": "النص في فقرات قصيرة"}

# اختيار accent
- "knowledge": علوم، تقنية، تعريفات، تعليم
- "history": تاريخ، أحداث، تواريخ
- "sport": رياضة، مباريات
- "food": طبخ، وصفات، مشروبات

# مثال على إجابة ممتازة لسؤال "متى تأسست الدولة السعودية؟"
{
  "accent": "history",
  "kicker": "تاريخ",
  "title": "تأسيس الدولة السعودية",
  "sub": "ثلاث دول سعودية متتالية امتدت 300 عام",
  "tabs": [
    {
      "label": "نظرة سريعة",
      "type": "stats",
      "data": {"items": [
        {"value": "1727", "label": "الدولة الأولى", "hint": "في الدرعية"},
        {"value": "1932", "label": "التوحيد الحديث", "hint": "الملك عبدالعزيز"},
        {"value": "300+", "label": "سنة من التاريخ"}
      ]}
    },
    {
      "label": "الخط الزمني",
      "type": "timeline",
      "data": {"events": [
        ["1727", "الدولة الأولى", "تأسست في الدرعية على يد الإمام محمد بن سعود"],
        ["1818", "السقوط الأول", "حملة محمد علي باشا على الدرعية"],
        ["1824", "الدولة الثانية", "عادت من جديد وعاصمتها الرياض"],
        ["1902", "استعادة الرياض", "الملك عبدالعزيز يبدأ مسيرة التوحيد"],
        ["1932", "المملكة الحديثة", "إعلان قيام المملكة العربية السعودية"]
      ]}
    },
    {
      "label": "حقائق",
      "type": "facts",
      "data": {"items": [
        {"icon": "🏛", "text": "العاصمة الأولى: الدرعية"},
        {"icon": "📅", "text": "اليوم الوطني: 23 سبتمبر"},
        {"icon": "👑", "text": "المؤسس الحديث: الملك عبدالعزيز"},
        {"icon": "🌍", "text": "ثاني أكبر دولة عربية مساحة"}
      ]}
    }
  ]
}

اجعل إجاباتك بهذه الجودة دائماً. ابدأ مباشرة بـ JSON.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({ role: h.role || "user", content: String(h.content || "") })),
    { role: "user", content: question },
  ];

  let lastError = "";
  for (const model of MODELS_TO_TRY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.5,
          max_tokens: 2500,
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
          error: "الذكاء الاصطناعي رفض الطلب (" + response.status + ")",
          detail: errText.slice(0, 300),
          model,
        });
      }

      const data = await response.json();
      let raw = data?.choices?.[0]?.message?.content || "";
      raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        raw = raw.slice(start, end + 1);
      }

      let card;
      try {
        card = JSON.parse(raw);
      } catch {
        card = {
          accent: "knowledge",
          kicker: "إجابة",
          title: "الإجابة",
          sub: "",
          tabs: [{ label: "الإجابة", type: "text", data: { body: raw || "تعذّر تجهيز الإجابة." } }],
        };
      }

      if (!card || typeof card !== "object" || !Array.isArray(card.tabs)) {
        card = {
          accent: "knowledge",
          kicker: "إجابة",
          title: "الإجابة",
          sub: "",
          tabs: [{ label: "الإجابة", type: "text", data: { body: String(raw || "") } }],
        };
      }

      return res.status(200).json({ card, model_used: model });
    } catch (e) {
      lastError = model + ": " + String(e?.message || e);
      continue;
    }
  }

  return res.status(502).json({
    error: "لا يوجد موديل متاح",
    detail: lastError,
  });
}
