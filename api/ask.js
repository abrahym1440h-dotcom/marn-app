// الوسيط الآمن — نسخة محدثة فيها تشخيص دقيق للأخطاء
// تكشف السبب الحقيقي لأي مشكلة بدل ما تطلع رسالة عامة

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1) فحص المفتاح
  const rawKey = process.env.CEREBRAS_API_KEY;
  if (!rawKey) {
    return res.status(500).json({
      error: "المفتاح غير موجود في إعدادات الخادم",
      hint: "أضف CEREBRAS_API_KEY في Environment Variables في Vercel",
    });
  }
  const apiKey = rawKey.trim();
  if (!apiKey.startsWith("csk-")) {
    return res.status(500).json({
      error: "المفتاح غير صالح",
      hint: `المفتاح يجب أن يبدأ بـ csk- لكنه يبدأ بـ ${apiKey.slice(0, 4)}`,
    });
  }

  // 2) فحص السؤال
  let question;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = body?.question;
  } catch {
    return res.status(400).json({ error: "صيغة الطلب غير صحيحة" });
  }
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "السؤال مفقود" });
  }

  // 3) تجهيز التعليمات
  const systemPrompt = `أنت محرك إجابات ذكي اسمه "مرن" يردّ باللغة العربية فقط.
مهمتك أن تختار أنسب شكل لعرض الإجابة ثم تنتجها كبطاقة منظّمة فيها أقسام (تبويبات).

أرجِع JSON فقط بدون أي نص إضافي ولا علامات Markdown، بهذا الشكل:
{
  "accent": "knowledge",
  "kicker": "تصنيف قصير",
  "title": "عنوان مختصر",
  "sub": "وصف سطر واحد",
  "tabs": [
    { "label": "اسم القسم", "type": "نوع المحتوى", "data": {} }
  ]
}

قيمة accent: "knowledge" أو "history" أو "sport" أو "food".

أنواع المحتوى:
- "steps": {"steps":[{"t":"عنوان الخطوة","d":"شرح"}]}
- "list": {"items":["عنصر","عنصر"]}
- "timeline": {"events":[["التاريخ","العنوان","الوصف"]]}
- "compare": {"cols":["الوجه","أ","ب"],"rows":[["خلية","خلية","خلية"]]}
- "text": {"body":"نص الإجابة"}

اجعل البطاقة 2 إلى 3 تبويبات. أجب باللغة العربية فقط.`;

  // 4) الاتصال بـ Cerebras (مع مهلة زمنية)
  let cerebrasResponse;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    cerebrasResponse = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.6,
        max_tokens: 1500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (e) {
    return res.status(500).json({
      error: "فشل الاتصال بخادم الذكاء الاصطناعي",
      detail: String(e?.message || e),
    });
  }

  // 5) فحص الرد
  if (!cerebrasResponse.ok) {
    let errText = "";
    try { errText = await cerebrasResponse.text(); } catch {}
    return res.status(cerebrasResponse.status).json({
      error: `الذكاء الاصطناعي رفض الطلب (${cerebrasResponse.status})`,
      detail: errText.slice(0, 500),
    });
  }

  // 6) قراءة المحتوى
  let data;
  try {
    data = await cerebrasResponse.json();
  } catch (e) {
    return res.status(500).json({ error: "تعذّر قراءة الإجابة", detail: String(e) });
  }

  let raw = data?.choices?.[0]?.message?.content || "";
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  // استخراج JSON من الرد
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    raw = raw.slice(start, end + 1);
  }

  // 7) محاولة التحويل
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

  // ضمان وجود الحقول المطلوبة
  if (!card || typeof card !== "object" || !card.tabs) {
    card = {
      accent: "knowledge",
      kicker: "إجابة",
      title: "الإجابة",
      sub: "",
      tabs: [{ label: "الإجابة", type: "text", data: { body: String(raw || "") } }],
    };
  }

  return res.status(200).json({ card });
}
