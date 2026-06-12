// api/nibras.js — نقطة نهاية خفيفة مخصصة لنبراس (نص عادي)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  res.setHeader("Content-Type", "application/json");

  const apiKey = (
    process.env.CEREBRAS_KEY_NIBRAS ||
    process.env.CEREBRAS_API_KEY || ""
  ).trim();
  if (!apiKey.startsWith("csk-"))
    return res.status(500).json({ error: "no_key" });

  let question, system, messages;
  try {
    const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    question = String(b?.question || b?.prompt || "").trim();
    system   = String(b?.system || "أنت نبراس، مساعد تعليمي ذكي باللغة العربية. اجب بعربية واضحة مبسّطة.").trim();
    messages = Array.isArray(b?.messages) ? b.messages : null;
  } catch { return res.status(400).json({ error: "bad_request" }); }

  const msgs = messages || [
    { role: "system", content: system },
    { role: "user",   content: question },
  ];

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 28000);
    const r = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({ model: "llama-3.3-70b", messages: msgs, temperature: 0.3, max_tokens: 4000 }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) return res.status(502).json({ error: "ai_error" });
    const d = await r.json();
    const text = d?.choices?.[0]?.message?.content || "";
    return res.json({ text });
  } catch (e) {
    return res.status(503).json({ error: "timeout" });
  }
}
