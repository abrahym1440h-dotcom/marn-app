// الوسيط الآمن — يجرب عدة موديلات تلقائياً حتى يلقى واحد متاح

const MODELS_TO_TRY = [
  "llama3.1-8b",
  "llama-3.3-70b",
  "llama-4-scout-17b-16e-instruct",
  "gpt-oss-120b",
  "qwen-3-32b",
  "deepseek-r1-distill-llama-70b",
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
      hint: `يبدأ بـ ${apiKey.slice(0, 4)} - يجب أن يبدأ بـ csk-`,
    });
  }

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

  let lastError = "";
  for (const model of MODELS_TO_TRY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
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

      if (!card || typeof card !== "object" || !card.tabs) {
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
    error: "لا يوجد موديل متاح في حسابك",
    detail: lastError,
    hint: "تحقق من الموديلات المتاحة في cloud.cerebras.ai/playground",
  });
}
