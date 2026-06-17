// dataapi.js — تكامل RapidAPI (مفتاح واحد، عدة مصادر بيانات حقيقية)
// الفلسفة: نمرّر بيانات الـ API الحقيقية للنموذج كمصدر موثوق أعلى من البحث.
// أي فشل (مفتاح ناقص/شبكة/شكل غير متوقع) => نُرجع null والتطبيق يكمل بالبحث العادي.

const RAPID_KEY = (process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY || "").trim();

const HOSTS = {
  sports:   "sportapi7.p.rapidapi.com",
  movies:   "imdb236.p.rapidapi.com",
  weather:  "open-weather13.p.rapidapi.com",
  news:     "real-time-news-data.p.rapidapi.com",
  finance:  "twelve-data1.p.rapidapi.com",
  flights:  "aerodatabox.p.rapidapi.com",
  exercise: "exercisedb.p.rapidapi.com",
};

// طلب عام مع مهلة وحماية كاملة
async function rapidGet(host, path, timeoutMs = 6500) {
  if (!RAPID_KEY) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`https://${host}${path}`, {
      headers: { "x-rapidapi-key": RAPID_KEY, "x-rapidapi-host": host, "Content-Type": "application/json" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) { console.log(`[rapidGet] ${host}${path.slice(0, 60)} → HTTP ${res.status}`); return null; }
    const txt = await res.text();
    if (!txt) { console.log(`[rapidGet] ${host} → رد فارغ`); return null; }
    try { return JSON.parse(txt); } catch { return txt; }
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

function trim(obj, n = 3800) {
  try { return typeof obj === "string" ? obj.slice(0, n) : JSON.stringify(obj).slice(0, n); }
  catch { return ""; }
}
function hasData(o) {
  if (!o) return false;
  if (typeof o === "string") return o.trim().length > 2;
  if (Array.isArray(o)) return o.length > 0;
  if (typeof o === "object") return Object.keys(o).length > 0;
  return false;
}
function todayRiyadh() {
  const d = new Date(Date.now() + 3 * 3600 * 1000); // UTC+3
  return d.toISOString().slice(0, 10);
}
const enc = encodeURIComponent;

// ===== كاشفات النية =====
const IS = {
  sports:   /مبارا|مباريات|نتيجة|الدوري|كأس|هدّاف|هدف|يلعب|ضد|تشكيل|ترتيب الدوري|match|score|league|fixture/i,
  movies:   /فيلم|أفلام|مسلسل|مسلسلات|ممثل|مخرج|تقييم فيلم|movie|series|imdb|actor|film/i,
  weather:  /طقس|الجو|حرارة|درجة الحرارة|مطر|الأمطار|رطوبة|الطقس|weather|temperature|forecast/i,
  finance:  /سهم|أسهم|سعر السهم|البورصة|بورصة|مؤشر|عملة|عملات|دولار|يورو|ريال|بيتكوين|عملة رقمية|stock|forex|crypto|bitcoin|price of/i,
  flights:  /رحلة|رحلات|طيران|طائرة|مطار|إقلاع|هبوط|flight|airport/i,
  exercise: /تمرين|تمارين|عضلة|عضلات|تمرين رياضي|كمال أجسام|exercise|workout|muscle/i,
};

// استخراج رمز سهم/عملة بسيط
function extractSymbol(q) {
  const m = q.match(/\b([A-Z]{2,5})\b/);
  if (m) return m[1];
  if (/بيتكوين|bitcoin|btc/i.test(q)) return "BTC/USD";
  if (/ايثيريوم|ethereum|eth/i.test(q)) return "ETH/USD";
  if (/دولار.*ريال|ريال.*دولار|usd.*sar/i.test(q)) return "USD/SAR";
  return null;
}
// استخراج اسم مدينة (تقريبي)
function extractCity(q) {
  const cities = { "الرياض":"Riyadh","جدة":"Jeddah","مكة":"Mecca","المدينة":"Medina","الدمام":"Dammam","الخبر":"Khobar","أبها":"Abha","الطائف":"Taif","تبوك":"Tabuk","حائل":"Hail","بريدة":"Buraidah","نجران":"Najran","جازان":"Jazan","الباحة":"Al Bahah","عرعر":"Arar","سكاكا":"Sakaka","لندن":"London","دبي":"Dubai","القاهرة":"Cairo","باريس":"Paris","نيويورك":"New York","اسطنبول":"Istanbul" };
  for (const k of Object.keys(cities)) if (q.includes(k)) return cities[k];
  const m = q.match(/(?:في|بـ|طقس)\s+([\u0621-\u064A]{3,})/);
  return m ? m[1] : "Riyadh";
}

// ===== جالبو كل مجال =====
async function getSports(q) {
  const date = /غد|بكرة|tomorrow/i.test(q)
    ? new Date(Date.now() + 27 * 3600 * 1000).toISOString().slice(0, 10)
    : todayRiyadh();
  const targetDate = date; // yyyy-mm-dd

  // هل السؤال عن نتيجة مباراة محددة سابقة؟ (مو "اليوم/الغد")
  const isPastResult = /نتيجة|انتهت|كم سجّل|من فاز|خسر|فاز|result|score of|ended/i.test(q) && !/اليوم|الغد|بكرة|today|tomorrow/i.test(q);

  let data = null;
  if (isPastResult) {
    // ابحث في آخر 3 أيام بالتوازي (مو متسلسل) لتجنّب تجاوز مهلة Vercel
    const teams = q.replace(/[^\u0621-\u064Aa-zA-Z\s]/g, " ").trim().split(/\s+/).filter(w => w.length > 2);
    const days = [0, 1, 2, 3].map(back =>
      new Date(Date.now() + 3 * 3600 * 1000 - back * 86400000).toISOString().slice(0, 10)
    );
    const results = await Promise.all(
      days.map(d => rapidGet(HOSTS.sports, `/api/v1/sport/football/scheduled-events/${d}`, 4000).catch(() => null))
    );
    const allEvents = [];
    for (const dd of results) {
      const evs = (dd && Array.isArray(dd.events)) ? dd.events : null;
      if (evs) allEvents.push(...evs);
    }
    if (allEvents.length && teams.length) {
      const matched = allEvents.filter(e => {
        const names = `${e?.homeTeam?.name || ""} ${e?.awayTeam?.name || ""} ${e?.homeTeam?.nameTranslation?.ar || ""} ${e?.awayTeam?.nameTranslation?.ar || ""}`;
        return teams.some(t => names.includes(t));
      });
      if (matched.length) data = { events: matched };
    }
    if (!data) return null; // ما لقى المباراة → يرجع للبحث
  } else {
    data = await rapidGet(HOSTS.sports, `/api/v1/sport/football/scheduled-events/${date}`, 5500);
  }

  const events = (data && Array.isArray(data.events)) ? data.events : (Array.isArray(data) ? data : null);
  if (!events || !events.length) return null;

  const fmtTime = (ts) => {
    if (!ts) return "";
    try { return new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" }).format(new Date(ts * 1000)); }
    catch { return ""; }
  };
  const tsToDate = (ts) => {
    if (!ts) return "";
    try { return new Date(ts * 1000).toISOString().slice(0, 10); } catch { return ""; }
  };

  // فلتر التاريخ: لمباريات اليوم نشدّد على تاريخ اليوم؛ لنتيجة سابقة نقبل كما هي
  const todayEvents = isPastResult ? events : events.filter(e => {
    const d = tsToDate(e?.startTimestamp);
    return d === targetDate;
  });

  // لو الـ API أرجع بيانات قديمة كلها → لا نرسلها للنموذج
  if (!todayEvents.length) {
    console.log(`[dataapi] sports: كل ${events.length} مباراة بتواريخ غير اليوم (${targetDate}) → رُفضت`);
    return null;
  }

  const lines = todayEvents.slice(0, 20).map((e) => {
    const home = e?.homeTeam?.name || e?.home?.name || "";
    const away = e?.awayTeam?.name || e?.away?.name || "";
    const hs = e?.homeScore?.current; const as2 = e?.awayScore?.current;
    const score = (hs != null && as2 != null) ? `${hs}-${as2}` : "";
    const status = e?.status?.description || e?.status?.type || "";
    const tour = e?.tournament?.name || "";
    const time = fmtTime(e?.startTimestamp);
    return `- ${home} ضد ${away}${score ? ` | النتيجة: ${score}` : ""}${status ? ` | ${status}` : ""}${time ? ` | ${time}` : ""}${tour ? ` | ${tour}` : ""}`;
  });
  const text = `التاريخ: ${targetDate}\nعدد المباريات اليوم: ${todayEvents.length}\n${lines.join("\n")}`;
  return { label: `مباريات حقيقية من SportAPI (${targetDate})`, text: text.slice(0, 4500), url: `https://${HOSTS.sports}` };
}
async function getMovies(q) {
  const term = q.replace(/فيلم|أفلام|مسلسل|معلومات|عن|movie|series|about/gi, " ").trim().slice(0, 60) || q.slice(0, 60);
  let data = await rapidGet(HOSTS.movies, `/api/imdb/search?query=${enc(term)}`);
  if (!hasData(data)) data = await rapidGet(HOSTS.movies, `/imdb/autocomplete?query=${enc(term)}`);
  return hasData(data) ? { label: "بيانات أفلام (IMDb)", text: trim(data, 3800), url: `https://${HOSTS.movies}` } : null;
}
async function getWeather(q) {
  const city = extractCity(q);
  let data = await rapidGet(HOSTS.weather, `/city/${enc(city)}/EN`);
  if (!hasData(data)) data = await rapidGet(HOSTS.weather, `/city?city=${enc(city)}`);
  return hasData(data) ? { label: `طقس حيّ — ${city} (OpenWeather)`, text: trim(data, 3000), url: `https://${HOSTS.weather}` } : null;
}
async function getNews(q) {
  const data = await rapidGet(HOSTS.news, `/search?query=${enc(q.slice(0, 80))}&limit=6&country=SA&lang=ar&time_published=anytime`);
  return hasData(data) ? { label: "أخبار حيّة (Real-Time News)", text: trim(data, 4200), url: `https://${HOSTS.news}` } : null;
}
async function getFinance(q) {
  const sym = extractSymbol(q);
  if (!sym) return null;
  let data = await rapidGet(HOSTS.finance, `/quote?symbol=${enc(sym)}`);
  if (!hasData(data)) data = await rapidGet(HOSTS.finance, `/price?symbol=${enc(sym)}`);
  return hasData(data) ? { label: `بيانات مالية حيّة — ${sym} (Twelve Data)`, text: trim(data, 2600), url: `https://${HOSTS.finance}` } : null;
}
async function getFlights(q) {
  const m = q.match(/\b([A-Z]{2}\d{1,4}|[A-Z]{3}\d{1,4})\b/i);
  if (!m) return null;
  const data = await rapidGet(HOSTS.flights, `/flights/number/${enc(m[1].toUpperCase())}`);
  return hasData(data) ? { label: `رحلة جوية ${m[1].toUpperCase()} (AeroDataBox)`, text: trim(data, 3000), url: `https://${HOSTS.flights}` } : null;
}
async function getExercise(q) {
  const map = { "صدر":"chest","ظهر":"back","أكتاف":"shoulders","كتف":"shoulders","بطن":"waist","معدة":"waist","رجل":"upper legs","أرجل":"upper legs","ساق":"lower legs","ذراع":"upper arms","باي":"upper arms","تراي":"upper arms","سمانة":"lower legs" };
  let part = null;
  for (const k of Object.keys(map)) if (q.includes(k)) { part = map[k]; break; }
  const path = part ? `/exercises/bodyPart/${enc(part)}?limit=8` : `/exercises?limit=8`;
  const data = await rapidGet(HOSTS.exercise, path);
  return hasData(data) ? { label: "تمارين (ExerciseDB)", text: trim(data, 3600), url: `https://${HOSTS.exercise}` } : null;
}

// ===== الموزّع الرئيسي =====
// يُرجع { block, sources } أو null
async function getStructuredData(question) {
  if (!RAPID_KEY) { console.log("[dataapi] لا يوجد RAPIDAPI_KEY"); return null; }
  const q = String(question || "");
  let fn = null, kind = null;
  if (IS.sports.test(q)) { fn = getSports; kind = "sports"; }
  else if (IS.movies.test(q)) { fn = getMovies; kind = "movies"; }
  else if (IS.weather.test(q)) { fn = getWeather; kind = "weather"; }
  else if (IS.finance.test(q)) { fn = getFinance; kind = "finance"; }
  else if (IS.flights.test(q)) { fn = getFlights; kind = "flights"; }
  else if (IS.exercise.test(q)) { fn = getExercise; kind = "exercise"; }
  else if (IS.news.test(q)) { fn = getNews; kind = "news"; }
  if (!fn) { console.log("[dataapi] لا مجال مطابق لـ:", q.slice(0, 40)); return null; }
  let r = null;
  try {
    // سباق: إمّا تنتهي الدالة، أو تنقطع بعد 8 ثوانٍ (أقل من حد Vercel) → لا تعليق أبداً
    r = await Promise.race([
      fn(q),
      new Promise(resolve => setTimeout(() => resolve(null), 8000)),
    ]);
  } catch (e) { console.log("[dataapi] خطأ", kind, e && e.message); r = null; }
  if (!r) { console.log(`[dataapi] ${kind}: الـ API رجّع فاضي/فشل → سيرجع للبحث`); return null; }
  console.log(`[dataapi] ${kind}: نجح ✓ طول البيانات=${(r.text || "").length} | عيّنة:`, (r.text || "").slice(0, 220));
  const block = `\n\n===== ${r.label} — مصدر موثوق رسمي (استخدم هذه الأرقام والأسماء حرفياً) =====\n⚠️ هذه بيانات حقيقية رسمية (JSON). **انسخ منها حرفياً** أسماء الفرق والتواريخ والنتائج والبطولات كما هي تماماً — ممنوع تغيير أي اسم أو تاريخ أو ترجمة خاطئة أو خلط بين المباريات. كل مباراة لها homeTeam وawayTeam وstartTimestamp في نفس العنصر؛ لا تخلط بينها. إن لم تجد تفصيلاً هنا فاحذفه ولا تخترعه. تجاهل أي مصدر آخر يخالف هذه البيانات.\n${r.text}\n===== END =====`;
  return { block, sources: [{ title: r.label, url: r.url }] };
}

export { getStructuredData };
export const RAPID_HAS_KEY = !!RAPID_KEY;
