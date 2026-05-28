// الوسيط الآمن — يستقبل سؤال المستخدم، يكلّم Cerebras بالمفتاح المخفي، ويرجّع بطاقة منظّمة
// المفتاح يبقى سرّياً في إعدادات Vercel (ما يظهر أبداً في كود الواجهة)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "المفتاح غير موجود في إعدادات الخادم" });
  }

  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "السؤال مفقود" });
    }

    const systemPrompt = `أنت محرك إجابات ذكي اسمه "مرن" يردّ باللغة العربية فقط.
مهمتك أن تختار أنسب شكل لعرض الإجابة ثم تنتجها كبطاقة منظّمة فيها أقسام (تبويبات).

أرجِع JSON فقط بدون أي نص إضافي ولا علامات Markdown، بهذا الشكل بالضبط:
{
  "accent": "knowledge",
  "kicker": "تصنيف قصير مثل: معرفة عامة، تاريخ، طبخ، علوم",
  "title": "عنوان مختصر للإجابة",
  "sub": "وصف سطر واحد",
  "tabs": [
    { "label": "اسم القسم", "type": "نوع المحتوى", "data": {...} }
  ]
}

قيمة accent اختر واحدة: "knowledge" أو "history" أو "sport" أو "food".

أنواع المحتوى (type) لكل تبويب وبياناته:
- "steps": {"steps":[{"t":"عنوان الخطوة","d":"شرح"}]}
- "list": {"items":["عنصر","عنصر"]}
- "timeline": {"events":[["التاريخ","العنوان","الوصف"]]}
- "compare": {"cols":["الوجه","أ","ب"],"rows":[["خلية","خلية","خلية"]]}
- "text": {"body":"نص الإجابة في فقرات قصيرة"}

اجعل البطاقة فيها 2 إلى 3 تبويبات كحد أقصى، تغطّي السؤال من زوايا مختلفة.
اجعل الإجابة دقيقة ومفيدة ومختصرة وباللغة العربية.`;

    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.6,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(502).json({ error: "تعذّر الاتصال بالذكاء الاصطناعي", detail: txt });
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

    return res.status(200).json({ card });
  } catch (e) {
    return res.status(500).json({ error: "خطأ غير متوقع", detail: String(e) });
  }
}
