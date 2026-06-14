// ============================================================================
// NibrasApp.jsx — قسم "نبراس" (المساعد الذكي للمذاكرة) داخل مرن
// ملف مستقل بالكامل. الربط في App.jsx (مثل فتوى/المجموعات):
//   import NibrasApp from './NibrasApp.jsx';
//   {appView === 'nibras' && <NibrasApp onClose={() => setAppView('chat')} />}
//   وزر في EmptyState:  onClick={() => onOpenView('nibras')}
//
// الهوية: مرن الداكنة (#070C1A / أزرق #4A8FFF) + لمسة ذهبية #E2B14A توقيع نبراس
// لا إيموجي — أيقونات SVG مضمّنة — عربي RTL — بدون أي مكتبة خارجية
// كل ميزات الذكاء تستخدم نفس /api/ask الحالي. عدّل callApi() فقط لو لزم.
// ============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ---------------------------------------------------------------------------
// أيقونات SVG مضمّنة (بدون مكتبات)
// ---------------------------------------------------------------------------
const mk = (children) => function Icon({ size = 20, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
  );
};
const LayoutGrid = mk(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>);
const Calendar = mk(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>);
const MessageCircle = mk(<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />);
const ClipboardList = mk(<><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></>);
const BookOpen = mk(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>);
const Gamepad2 = mk(<><line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" /><line x1="15" y1="12" x2="15.01" y2="12" /><line x1="18" y1="10" x2="18.01" y2="10" /><rect x="2" y="6" width="20" height="12" rx="2" /></>);
const Video = mk(<><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" /></>);
const FileUp = mk(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5" /><path d="M12 18v-6" /><path d="m9 15 3-3 3 3" /></>);
const BarChart3 = mk(<><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>);
const Settings = mk(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>);
const LogOut = mk(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>);
const Menu = mk(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>);
const X = mk(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>);
const ChevronLeft = mk(<polyline points="15 18 9 12 15 6" />);
const ChevronDown = mk(<polyline points="6 9 12 15 18 9" />);
const ArrowRight = mk(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
const Plus = mk(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>);
const Check = mk(<polyline points="20 6 9 17 4 12" />);
const Send = mk(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>);
const Loader2 = mk(<path d="M21 12a9 9 0 1 1-6.219-8.56" />);
const Trash2 = mk(<><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>);
const Sparkles = mk(<path d="m12 3 1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8L4.3 10.7l5.8-1.9z" />);
const Trophy = mk(<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>);
const Target = mk(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>);
const Link2 = mk(<><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" y1="12" x2="16" y2="12" /></>);
const RotateCw = mk(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>);
const Upload = mk(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>);
const GraduationCap = mk(<><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></>);
const CheckCircle2 = mk(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);
const Clock = mk(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>);
const FileText = mk(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></>);
const Star = mk(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />);

// ---------------------------------------------------------------------------
// الهوية
// ---------------------------------------------------------------------------
const T = {
  bg: '#0F0A04', surface: '#1A1308', surfaceAlt: '#211910', border: '#3A2C16', borderSoft: '#2C2012',
  text: '#F6EEDD', textDim: '#BBA079', textFaint: '#7D6A4C',
  accent: '#E2B14A', accentSoft: 'rgba(226,177,74,0.14)', accentLine: 'rgba(226,177,74,0.34)',
  gold: '#E2B14A', goldSoft: 'rgba(226,177,74,0.14)', goldLine: 'rgba(226,177,74,0.34)',
  good: '#5BBF86', goodSoft: 'rgba(91,191,134,0.13)',
  purple: '#C79BE8', purpleSoft: 'rgba(199,155,232,0.12)',
  rose: '#E89B6F', roseSoft: 'rgba(232,155,111,0.12)',
  red: '#F0876B',
};
const FONT = "'Tajawal','Segoe UI',system-ui,sans-serif";

// ---------------------------------------------------------------------------
// التخزين المحلي
// ---------------------------------------------------------------------------
const STORE_KEY = 'marn_nibras_v1';
const DEFAULT_STORE = { subjects: [], tasks: [], quizResults: [], decks: [], files: [], videos: [], study: {}, settings: { name: '', dailyGoal: 60 }, pendingContent: '' };
function loadStore() {
  try { return { ...DEFAULT_STORE, ...(JSON.parse(localStorage.getItem(STORE_KEY) || '{}')) }; }
  catch { return { ...DEFAULT_STORE }; }
}
function profileName() {
  try { return JSON.parse(localStorage.getItem('marn_profile_v1') || '{}')?.name || ''; } catch { return ''; }
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
const uid = () => Math.random().toString(36).slice(2, 9);

// ---------------------------------------------------------------------------
// الذكاء الاصطناعي — نفس /api/ask
// ---------------------------------------------------------------------------
const NIBRAS_SYSTEM = 'أنت "نبراس"، مساعد ذكي للمذاكرة والتعلّم باللغة العربية. تشرح بوضوح وتبسيط، وتعطي أمثلة، وتراعي مستوى الطالب. التزم بالعربية الفصحى المبسطة.';

function extractText(d) {
  if (d == null) return '';
  if (typeof d === 'string') return d;
  const direct = d.content ?? d.text ?? d.answer ?? d.reply ?? d.message ?? d.output ?? d.result ?? d.response ?? d.completion;
  if (typeof direct === 'string') return direct;
  if (Array.isArray(d.choices) && d.choices.length) {
    const c = d.choices[0];
    const t = c?.message?.content ?? c?.text ?? c?.delta?.content;
    if (typeof t === 'string') return t;
  }
  if (Array.isArray(d.content)) {
    const t = d.content.map((b) => (typeof b === 'string' ? b : b?.text || '')).join('').trim();
    if (t) return t;
  }
  const nested = d.data ?? d.body ?? d.result ?? (direct && typeof direct === 'object' ? direct : null);
  return nested && nested !== d ? extractText(nested) : '';
}
async function ask(userPrompt, system) {
  const body = { question: userPrompt, system: system || NIBRAS_SYSTEM, mode: 'raw', agent: 'nibras', lang: 'ar' };
  const res = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('network');
  const data = await res.json();
  return data?.text || '';
}
function parseJSON(raw) {
  let t = (raw || '').trim().replace(/```json/gi, '').replace(/```/g, '').trim();
  const fa = t.indexOf('['), fo = t.indexOf('{');
  let start = -1, close = ']';
  if (fa >= 0 && (fo < 0 || fa < fo)) { start = fa; close = ']'; }
  else if (fo >= 0) { start = fo; close = '}'; }
  if (start >= 0) { const end = t.lastIndexOf(close); if (end > start) t = t.slice(start, end + 1); }
  try { return JSON.parse(t); } catch { return null; }
}
async function genJSON(userPrompt) {
  let r = parseJSON(await ask(userPrompt));
  if (!r) r = parseJSON(await ask(userPrompt + '\n\nمهم: أعد JSON صالحاً فقط بدون أي نص قبله أو بعده وبدون أسوار كود.'));
  return r;
}

/* ===== استخراج نص من صورة عبر Gemini ===== */
async function scanImageText(imageBase64, mimeType) {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'استخرج كل النصوص والمعادلات والأرقام من هذه الصورة كاملاً بدون أي تعليق أو تنسيق.',
      agent: 'nibras', lang: 'ar', mode: 'raw',
      imageBase64, imageMimeType: mimeType,
    }),
  });
  if (!res.ok) throw new Error('network');
  const data = await res.json();
  const text = (data?.text || '').trim();
  if (!text) throw new Error(data?.error || 'no text');
  return text;
}

/* ===== تصغير الصورة قبل الرفع — يمنع تجاوز حد Vercel (413) ===== */
async function downscaleImage(file, maxDim = 1600, quality = 0.72) {
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = dataUrl;
  });
  let width = img.width, height = img.height;
  if (width > maxDim || height > maxDim) {
    const s = maxDim / Math.max(width, height);
    width = Math.round(width * s); height = Math.round(height * s);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  const out = canvas.toDataURL('image/jpeg', quality);
  return { base64: out.split(',')[1] || '', mime: 'image/jpeg' };
}

/* ===== زر مسح الصور — مشترك بين الاختبارات والبطاقات والألعاب ===== */
function ImageScanButton({ onText, label = 'صوّر الدرس', disabled }) {
  const ref = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 25 * 1024 * 1024) { setErr('الصورة كبيرة جداً (الحد 25 ميجابايت)'); return; }
    setScanning(true); setErr('');
    try {
      const { base64, mime } = await downscaleImage(file, 1600, 0.72);
      if (!base64) { setErr('تعذّر قراءة الصورة'); setScanning(false); return; }
      const text = await scanImageText(base64, mime);
      if (text) { onText(text); }
      else setErr('لم يُتعرف على نص في الصورة — جرّب صورة أوضح');
    } catch { setErr('تعذّر معالجة الصورة — تأكد من مفتاح Gemini'); }
    finally { setScanning(false); }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <input ref={ref} type="file" accept="image/*" onChange={pick} style={{ display: 'none' }} />
      <button
        onClick={() => ref.current?.click()}
        disabled={disabled || scanning}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          background: scanning ? T.goldSoft : `${T.gold}18`,
          border: `1px solid ${T.goldLine}`,
          color: scanning ? T.textDim : T.gold,
          borderRadius: 12, padding: '12px 16px',
          fontSize: 14, fontWeight: 700, cursor: scanning ? 'default' : 'pointer',
          fontFamily: FONT, transition: 'all .15s',
          opacity: disabled ? 0.5 : 1,
        }}>
        {scanning
          ? <Loader2 size={16} style={{ animation: 'nspin 1s linear infinite' }} />
          : <Upload size={16} />}
        {scanning ? 'جاري استخراج النص...' : label}
      </button>
      {err && <div style={{ color: '#f87171', fontSize: 12, marginTop: 5, textAlign: 'center' }}>{err}</div>}
    </div>
  );
}


function ErrBox({ msg, onRetry }) {
  if (!msg) return null;
  return (<div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 14px', margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
    <span style={{ color: '#f87171', fontSize: 13.5, fontWeight: 600 }}>{msg}</span>
    {onRetry && <button onClick={onRetry} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, fontSize: 12.5 }}>أعد المحاولة</button>}
  </div>);
}

// ---------------------------------------------------------------------------
// عناصر واجهة
// ---------------------------------------------------------------------------
const field = { width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: '13px 14px', color: T.text, fontSize: 15, fontFamily: FONT, textAlign: 'right', outline: 'none', boxSizing: 'border-box' };

function Btn({ children, onClick, variant = 'primary', disabled, full, style }) {
  const v = {
    primary: { bg: `linear-gradient(135deg, ${T.gold}, ${T.gold}cc)`, fg: '#0F0A04', bd: T.gold },
    gold: { bg: `linear-gradient(135deg, ${T.gold}, ${T.rose})`, fg: '#0F0A04', bd: T.gold },
    ghost: { bg: 'transparent', fg: T.text, bd: T.border },
    danger: { bg: 'transparent', fg: T.red, bd: `${T.red}55` },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} className="ncard" style={{
      background: disabled ? T.surfaceAlt : v.bg, color: disabled ? T.textFaint : v.fg,
      border: `1px solid ${disabled ? T.border : v.bd}`, borderRadius: 13, padding: '13px 18px',
      fontWeight: 800, fontSize: 15, cursor: disabled ? 'default' : 'pointer', fontFamily: FONT,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : 'auto', transition: 'transform .12s', ...style,
    }}>{children}</button>
  );
}
function Heading({ title, subtitle }) {
  return (<div style={{ textAlign: 'right', marginBottom: 18, position: 'relative', paddingInlineStart: 14 }}>
    <div style={{ position: 'absolute', insetInlineStart: 0, top: 3, bottom: 3, width: 4, borderRadius: 4, background: `linear-gradient(${T.accent}, ${T.good})` }} />
    <div style={{ fontWeight: 800, fontSize: 21, color: T.text, letterSpacing: '-0.3px' }}>{title}</div>
    {subtitle && <div style={{ color: T.textDim, fontSize: 13, marginTop: 4 }}>{subtitle}</div>}
  </div>);
}
function Empty({ Icon, text }) {
  return (<div style={{ textAlign: 'center', padding: '44px 16px' }}>
    {Icon && <div style={{ display: 'inline-flex', marginBottom: 12 }}><Icon size={36} color={T.textFaint} /></div>}
    <div style={{ color: T.textDim, fontSize: 14 }}>{text}</div>
  </div>);
}
function Spinner({ text }) {
  return (<div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', padding: 24 }}>
    <Loader2 size={18} color={T.accent} style={{ animation: 'nspin 1s linear infinite' }} />
    <span style={{ color: T.textDim, fontSize: 14 }}>{text || 'جاري المعالجة...'}</span>
  </div>);
}
function StatCard({ Icon, value, label, tint, tintSoft }) {
  return (<div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, textAlign: 'right' }}>
    <div style={{ width: 40, height: 40, borderRadius: 11, background: tintSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginInlineStart: 'auto' }}><Icon size={20} color={tint} /></div>
    <div style={{ fontWeight: 800, fontSize: 26, color: T.text, marginTop: 10 }}>{value}</div>
    <div style={{ color: T.textDim, fontSize: 12, marginTop: 2 }}>{label}</div>
  </div>);
}
function FeatureCard({ Icon, title, desc, tint, tintSoft, onClick }) {
  return (<button onClick={onClick} className="listrow" style={{ textAlign: 'right', background: 'transparent', border: 'none', borderBottom: `1px solid ${T.borderSoft}`, padding: '15px 4px', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 13, transition: 'background .15s' }}>
    <div style={{ width: 40, height: 40, borderRadius: 11, background: `${tint}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={19} color={tint} /></div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, color: T.text, fontSize: 15.5 }}>{title}</div>
      {desc && <div style={{ color: T.textFaint, fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{desc}</div>}
    </div>
    <ChevronLeft size={17} color={T.textFaint} />
  </button>);
}

// ---------------------------------------------------------------------------
// لوحة التحكم
// ---------------------------------------------------------------------------
function Dashboard({ store, go, name }) {
  const done = store.tasks.filter((t) => t.done).length;
  const tiles = [
    { id: 'quizzes', title: 'الاختبارات', desc: 'اختبر معلوماتك', Icon: ClipboardList, tint: T.purple, tintSoft: T.purpleSoft },
    { id: 'chat', title: 'الشات التعليمي', desc: 'اسأل الذكاء الاصطناعي', Icon: MessageCircle, tint: T.good, tintSoft: T.goodSoft },
    { id: 'plan', title: 'الخطة الدراسية', desc: 'نظّم وقتك وتابع تقدمك', Icon: Calendar, tint: T.accent, tintSoft: T.accentSoft },
    { id: 'videos', title: 'الفيديوهات التعليمية', desc: 'حوّل دروسك إلى فيديو', Icon: Video, tint: T.rose, tintSoft: T.roseSoft },
    { id: 'games', title: 'ألعاب نبراس', desc: 'العب وتعلّم في نفس الوقت', Icon: Gamepad2, tint: T.gold, tintSoft: T.goldSoft },
    { id: 'cards', title: 'بطاقات نبراس', desc: 'مراجعة سريعة وحفظ ذكي', Icon: BookOpen, tint: T.good, tintSoft: T.goodSoft },
    { id: 'stats', title: 'الإحصائيات', desc: 'تابع تقدمك الأكاديمي', Icon: BarChart3, tint: T.purple, tintSoft: T.purpleSoft },
    { id: 'files', title: 'الملفات المرفوعة', desc: 'ارفع ملفاتك ولخّصها', Icon: FileUp, tint: T.accent, tintSoft: T.accentSoft },
  ];
  return (<div style={{ padding: 18 }} className="nfadeup">
    <div style={{ position: 'relative', overflow: 'hidden', background: `radial-gradient(130% 120% at 100% -10%, ${T.goldSoft}, transparent 55%), ${T.surface}`, border: `1px solid ${T.border}`, borderRadius: 20, padding: '24px 22px', marginBottom: 18 }}>
      <div style={{ position: 'absolute', insetInlineEnd: -10, top: -10, width: 90, height: 90, borderRadius: '50%', background: `radial-gradient(circle, ${T.gold}22, transparent 70%)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(145deg, ${T.gold}, ${T.rose})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles size={24} color="#0F0A04" /></div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: T.text }}>{name ? `أهلاً ${name}` : 'أهلاً بك في نبراس'}</div>
          <div style={{ color: T.textDim, fontSize: 13.5, marginTop: 3 }}>مساعدك الذكي للتعلّم والتفوّق الأكاديمي</div>
        </div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
      <StatCard Icon={Video} value={store.videos.length} label="الفيديوهات" tint={T.gold} tintSoft={T.goldSoft} />
      <StatCard Icon={Trophy} value={store.quizResults.length} label="الاختبارات" tint={T.purple} tintSoft={T.purpleSoft} />
      <StatCard Icon={CheckCircle2} value={done} label="المهام المنجزة" tint={T.good} tintSoft={T.goodSoft} />
      <StatCard Icon={BookOpen} value={store.tasks.length} label="المهام الدراسية" tint={T.accent} tintSoft={T.accentSoft} />
    </div>
    <div style={{ fontWeight: 800, fontSize: 18, color: T.text, marginBottom: 10 }}>الوصول السريع</div>
    <div style={{ borderTop: `1px solid ${T.borderSoft}` }}>
      {tiles.map((t) => <FeatureCard key={t.id} {...t} onClick={() => go(t.id)} />)}
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// الخطة الدراسية
// ---------------------------------------------------------------------------
function PlanView({ store, setStore }) {
  const [subject, setSubject] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [busy, setBusy] = useState(false);
  const tasks = store.tasks;
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const addTask = () => {
    if (!taskTitle.trim()) return;
    setStore((s) => ({ ...s, tasks: [...s.tasks, { id: uid(), subject: subject.trim() || 'عام', title: taskTitle.trim(), done: false, at: Date.now() }] }));
    setTaskTitle('');
  };
  const toggle = (id) => setStore((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) }));
  const remove = (id) => setStore((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));

  const [perr, setPerr] = useState('');
  const generate = async () => {
    if (!subject.trim() || busy) return;
    setBusy(true); setPerr('');
    try {
      const arr = await genJSON(`أنشئ خطة مذاكرة لمادة "${subject}"${goal.trim() ? ` بهدف: ${goal}` : ''}. أعد JSON فقط بالشكل: [{"title":"اسم المهمة"}] من 5 إلى 8 مهام مرتبة منطقياً. بدون أي نص خارج JSON.`);
      if (Array.isArray(arr)) {
        const newTasks = arr.filter((x) => x && x.title).map((x) => ({ id: uid(), subject: subject.trim(), title: String(x.title), done: false, at: Date.now() }));
        setStore((s) => ({ ...s, tasks: [...s.tasks, ...newTasks] }));
      } else { setPerr('تعذّر توليد الخطة — جرّب صياغة أوضح وأعد المحاولة.'); }
    } catch { setPerr('تعذّر الاتصال بالخادم — تأكد من الإنترنت وأعد المحاولة.'); } finally { setBusy(false); }
  };

  const grouped = useMemo(() => {
    const g = {};
    for (const t of tasks) { const k = t.subject || 'عام'; (g[k] = g[k] || []).push(t); }
    return g;
  }, [tasks]);
  const [showGen, setShowGen] = useState(tasks.length === 0);

  return (<div style={{ padding: 0 }} className="nfadeup">
    {/* شريط التقدّم العلوي النظيف */}
    <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${T.borderSoft}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 30, color: T.accent }}>{pct}<span style={{ fontSize: 16 }}>%</span></span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>الخطة الدراسية</div>
          <div style={{ color: T.textFaint, fontSize: 12 }}>{done} من {tasks.length} مكتملة</div>
        </div>
      </div>
      <div style={{ height: 8, background: T.surfaceAlt, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${T.accent}, ${T.good})`, borderRadius: 999, transition: 'width .4s' }} />
      </div>
    </div>

    <ErrBox msg={perr} onRetry={generate} />

    {/* المهام مجمّعة حسب المادة — قوائم مسطّحة نظيفة */}
    {tasks.length ? (
      <div style={{ padding: '6px 0 90px' }}>
        {Object.entries(grouped).map(([subj, items]) => {
          const sd = items.filter((x) => x.done).length;
          const sp = Math.round((sd / items.length) * 100);
          return (
            <div key={subj} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 8px' }}>
                <span style={{ color: sp === 100 ? T.good : T.textDim, fontSize: 12.5, fontWeight: 800 }}>{sd}/{items.length}</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: T.text }}>{subj}</span>
              </div>
              {items.map((t, i) => (
                <div key={t.id} className="listrow" style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 18px', borderTop: i === 0 ? `1px solid ${T.borderSoft}` : 'none', borderBottom: `1px solid ${T.borderSoft}`, transition: 'background .15s' }}>
                  <button onClick={() => toggle(t.id)} style={{ width: 24, height: 24, borderRadius: 999, border: `2px solid ${t.done ? T.good : T.border}`, background: t.done ? T.good : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>{t.done && <Check size={13} color="#0F0A04" />}</button>
                  <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, color: t.done ? T.textFaint : T.text, fontSize: 14.5, textDecoration: t.done ? 'line-through' : 'none' }}>
                    {t.title}
                    {t.fromChat && <span style={{ fontSize: 10, color: T.accent, background: `${T.accent}1a`, padding: '1px 7px', borderRadius: 999, marginInlineStart: 7, fontWeight: 700, verticalAlign: 'middle' }}>من الشات</span>}
                  </div>
                  <button onClick={() => remove(t.id)} style={iconBtn}><Trash2 size={15} color={T.textFaint} /></button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    ) : (
      <div style={{ padding: '30px 18px' }}>
        <Empty Icon={Clock} text="لا توجد مهام بعد — ولّد خطة ذكية أو اطلبها من شات نبراس مباشرة!" />
      </div>
    )}

    {/* زر عائم لإضافة/توليد */}
    <button onClick={() => setShowGen(true)} style={{ position: 'fixed', insetInlineStart: 20, bottom: 20, width: 54, height: 54, borderRadius: 17, background: `linear-gradient(135deg, ${T.gold}, ${T.rose})`, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 8px 24px ${T.gold}44`, zIndex: 20 }}>
      <Plus size={26} color="#0F0A04" />
    </button>

    {/* لوحة التوليد/الإضافة كـ Sheet منزلق */}
    {showGen && (
      <div onClick={() => setShowGen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'flex-end', animation: 'nFadeUp .2s ease' }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: T.bg, borderRadius: '22px 22px 0 0', borderTop: `1px solid ${T.border}`, padding: 20, maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: T.border, margin: '0 auto 18px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Sparkles size={19} color={T.accent} />
            <span style={{ fontWeight: 800, color: T.text, fontSize: 17 }}>توليد خطة ذكية</span>
          </div>
          <ImageScanButton
            label="صوّر جدول المحتوى أو فهرس الكتاب"
            onText={(t) => { const lines = t.split('\n').filter(Boolean); setSubject(lines[0]?.slice(0,40)||t.slice(0,40)); if (lines.length > 1) setGoal(lines.slice(1).join('، ').slice(0,80)); }}
          />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="المادة (مثال: الرياضيات)" style={{ ...field, marginBottom: 10 }} />
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="الهدف (اختياري: الاستعداد للاختبار)" style={{ ...field, marginBottom: 12 }} />
          <Btn variant="gold" full onClick={async () => { await generate(); setShowGen(false); }} disabled={!subject.trim() || busy}>
            {busy ? <Loader2 size={18} style={{ animation: 'nspin 1s linear infinite' }} /> : <Sparkles size={18} />} ولّد خطتي
          </Btn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: T.borderSoft }} /><span style={{ color: T.textFaint, fontSize: 12 }}>أو يدوياً</span><div style={{ flex: 1, height: 1, background: T.borderSoft }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={() => { addTask(); }} disabled={!taskTitle.trim()}><Plus size={18} /></Btn>
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} placeholder="عنوان مهمة (تُنسب لآخر مادة)" style={{ ...field, flex: 1 }} />
          </div>
        </div>
      </div>
    )}
  </div>);
}
const iconBtn = { width: 34, height: 34, borderRadius: 9, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 };

// ---------------------------------------------------------------------------
// الشات التعليمي
// ---------------------------------------------------------------------------
function ChatView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const starters = ['اشرح لي قانون نيوتن الأول', 'لخّص لي الثورة الصناعية', 'ما الفرق بين الخلية النباتية والحيوانية؟'];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  const send = async (text) => {
    const q = (text ?? input).trim(); if (!q || loading) return;
    setInput(''); const next = [...messages, { role: 'user', text: q }]; setMessages(next); setLoading(true);
    try { const a = await ask(q); setMessages([...next, { role: 'assistant', text: a }]); }
    catch { setMessages([...next, { role: 'assistant', text: 'تعذّر الاتصال بالخادم. حاول مرة أخرى.' }]); }
    finally { setLoading(false); }
  };
  return (<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
      {messages.length === 0 && (
        <div>
          <div style={{ color: T.textDim, fontSize: 14, marginBottom: 12 }}>اسألني عن أي درس أو مفهوم، أو ابدأ بـ:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {starters.map((s) => <button key={s} onClick={() => send(s)} style={{ background: T.accentSoft, color: T.accent, border: `1px solid ${T.accentLine}`, borderRadius: 999, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600, fontFamily: FONT }}>{s}</button>)}
          </div>
        </div>
      )}
      {messages.map((m, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-start' : 'flex-end', marginBottom: 14 }}>
          <div style={{ maxWidth: '88%', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '12px 16px', fontSize: 15, lineHeight: 1.9, whiteSpace: 'pre-wrap', background: m.role === 'user' ? T.accent : T.surface, color: m.role === 'user' ? '#fff' : T.text, border: m.role === 'user' ? 'none' : `1px solid ${T.border}`, fontWeight: m.role === 'user' ? 600 : 400 }}>{m.text}</div>
        </div>
      ))}
      {loading && <Spinner text="نبراس يكتب..." />}
      <div ref={endRef} />
    </div>
    <div style={{ padding: 14, borderTop: `1px solid ${T.borderSoft}`, background: T.surface, display: 'flex', gap: 10, alignItems: 'center' }}>
      <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 46, height: 46, borderRadius: 14, background: input.trim() ? T.accent : T.surfaceAlt, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Send size={20} color={input.trim() ? '#fff' : T.textFaint} /></button>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="اكتب سؤالك هنا..." style={{ ...field, flex: 1 }} />
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// الاختبارات
// ---------------------------------------------------------------------------
function QuizView({ store, setStore }) {
  const [mode, setMode] = useState('home'); // home | setup | loading | play | result
  const [topic, setTopic] = useState(store.pendingContent || '');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [picks, setPicks] = useState([]);

  useEffect(() => { if (store.pendingContent) { setTopic(store.pendingContent); setMode('setup'); setStore((s) => ({ ...s, pendingContent: '' })); } }, []);

  const [err, setErr] = useState('');
  const start = async () => {
    if (!topic.trim()) return; setMode('loading'); setErr('');
    try {
      const arr = await genJSON(`أنشئ اختباراً من ${count} أسئلة اختيار من متعدد حول: "${topic}". أعد JSON فقط بالشكل: [{"q":"السؤال","options":["خيار1","خيار2","خيار3","خيار4"],"answer":0}] حيث answer رقم الخيار الصحيح يبدأ من 0. بدون أي نص خارج JSON.`);
      const valid = Array.isArray(arr) ? arr.filter((x) => x && x.q && Array.isArray(x.options) && x.options.length >= 2) : [];
      if (!valid.length) { setErr('تعذّر توليد الأسئلة — جرّب موضوعاً أوضح أو أعد المحاولة.'); setMode('setup'); return; }
      setQuestions(valid); setPicks(Array(valid.length).fill(-1)); setCur(0); setMode('play');
    } catch { setErr('تعذّر الاتصال بالخادم — تأكد من الإنترنت وأعد المحاولة.'); setMode('setup'); }
  };
  const pick = (qi, oi) => setPicks((p) => { const n = [...p]; n[qi] = oi; return n; });
  const score = questions.reduce((s, q, i) => s + (picks[i] === (q.answer ?? 0) ? 1 : 0), 0);
  const finish = () => {
    setStore((s) => ({ ...s, quizResults: [...s.quizResults, { id: uid(), title: topic.slice(0, 40), score, total: questions.length, at: Date.now() }] }));
    setMode('result');
  };

  if (mode === 'home') {
    return (<div style={{ padding: 18 }}>
      <Heading title="الاختبارات" subtitle="أنشئ اختبارات ذكية واختبر معلوماتك" />
      {store.quizResults.length > 0 && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {store.quizResults.slice().reverse().slice(0, 5).map((r) => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px' }}>
              <span style={{ fontWeight: 800, color: r.score / r.total >= 0.6 ? T.good : T.gold }}>{r.score}/{r.total}</span>
              <span style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>{r.title || 'اختبار'}</span>
            </div>
          ))}
        </div>
      )}
      <Btn variant="gold" full onClick={() => setMode('setup')}><Plus size={18} /> إنشاء اختبار</Btn>
      {store.quizResults.length === 0 && <Empty Icon={ClipboardList} text="لم يتم إنشاء أي اختبارات بعد" />}
    </div>);
  }
  if (mode === 'setup') {
    return (<div style={{ padding: 18 }}>
      <button onClick={() => setMode('home')} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
      <div style={{ height: 12 }} />
      <Heading title="إنشاء اختبار" />
      <ErrBox msg={err} onRetry={start} />
      <ImageScanButton
        label="صوّر ورقة الأسئلة أو الدرس"
        onText={(t) => setTopic(prev => prev ? prev + '\n' + t : t)}
        disabled={false}
      />
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="أو اكتب الموضوع / الصق نص الدرس..." rows={5} style={{ ...field, resize: 'vertical', marginBottom: 12 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ color: T.textDim, fontSize: 14 }}>عدد الأسئلة:</span>
        {[5, 8, 10].map((n) => <button key={n} onClick={() => setCount(n)} style={{ width: 44, height: 40, borderRadius: 10, border: `1px solid ${count === n ? T.accent : T.border}`, background: count === n ? T.accentSoft : T.surface, color: count === n ? T.accent : T.textDim, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{n}</button>)}
      </div>
      <Btn variant="gold" full onClick={start} disabled={!topic.trim()}><Sparkles size={18} /> ابدأ التوليد</Btn>
    </div>);
  }
  if (mode === 'loading') return <div style={{ padding: 40 }}><Spinner text="جاري إنشاء الأسئلة..." /></div>;
  if (mode === 'play') {
    const q = questions[cur]; const picked = picks[cur];
    return (<div style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: T.textDim, fontSize: 13, marginBottom: 14 }}>
        <span>{cur + 1} / {questions.length}</span><span>الاختبار</span>
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: T.text, fontSize: 17, lineHeight: 1.8, marginBottom: 16, textAlign: 'right' }}>{q.q}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((o, oi) => {
            const sel = picked === oi;
            return <button key={oi} onClick={() => pick(cur, oi)} style={{ textAlign: 'right', background: sel ? T.accentSoft : T.surfaceAlt, border: `1px solid ${sel ? T.accent : T.border}`, borderRadius: 12, padding: '13px 16px', color: T.text, fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: sel ? 700 : 400 }}>{o}</button>;
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {cur > 0 && <Btn variant="ghost" onClick={() => setCur(cur - 1)}>السابق</Btn>}
        {cur < questions.length - 1
          ? <Btn full onClick={() => setCur(cur + 1)} disabled={picked < 0}>التالي</Btn>
          : <Btn variant="gold" full onClick={finish} disabled={picked < 0}>إنهاء</Btn>}
      </div>
    </div>);
  }
  // result
  const pc = Math.round((score / questions.length) * 100);
  return (<div style={{ padding: 18 }}>
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, textAlign: 'center', marginBottom: 18 }}>
      <Trophy size={40} color={pc >= 60 ? T.gold : T.textDim} style={{ margin: '0 auto' }} />
      <div style={{ fontWeight: 800, fontSize: 36, color: pc >= 60 ? T.good : T.gold, marginTop: 10 }}>{score}/{questions.length}</div>
      <div style={{ color: T.textDim, fontSize: 14, marginTop: 4 }}>{pc}% — {pc >= 80 ? 'ممتاز!' : pc >= 60 ? 'جيد، واصل' : 'راجع الدرس وحاول مجدداً'}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
      {questions.map((q, i) => {
        const ok = picks[i] === (q.answer ?? 0);
        return <div key={i} style={{ background: T.surface, border: `1px solid ${ok ? T.good + '44' : T.red + '44'}`, borderRadius: 12, padding: 14, textAlign: 'right' }}>
          <div style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{q.q}</div>
          <div style={{ color: T.good, fontSize: 13 }}>الإجابة: {q.options[q.answer ?? 0]}</div>
          {!ok && picks[i] >= 0 && <div style={{ color: T.red, fontSize: 13 }}>إجابتك: {q.options[picks[i]]}</div>}
        </div>;
      })}
    </div>
    <Btn full variant="gold" onClick={() => { setMode('home'); }}>تم</Btn>
  </div>);
}
const backLink = { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: T.accent, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, padding: 0 };

// ---------------------------------------------------------------------------
// بطاقات نبراس
// ---------------------------------------------------------------------------
function CardsView({ store, setStore }) {
  const [mode, setMode] = useState('home'); // home | setup | loading | view
  const [topic, setTopic] = useState('');
  const [deck, setDeck] = useState(null);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);

  const start = async () => {
    if (!topic.trim()) return; setMode('loading');
    try {
      const arr = await genJSON(`أنشئ 8 بطاقات مراجعة حول: "${topic}". أعد JSON فقط بالشكل: [{"front":"المصطلح أو السؤال","back":"الشرح أو الإجابة"}]. بدون أي نص خارج JSON.`);
      const valid = Array.isArray(arr) ? arr.filter((x) => x && x.front && x.back) : [];
      if (!valid.length) { setMode('setup'); return; }
      const d = { id: uid(), title: topic.slice(0, 40), cards: valid, at: Date.now() };
      setStore((s) => ({ ...s, decks: [...s.decks, d] }));
      setDeck(d); setIdx(0); setFlip(false); setMode('view');
    } catch { setMode('setup'); }
  };
  const openDeck = (d) => { setDeck(d); setIdx(0); setFlip(false); setMode('view'); };

  if (mode === 'home') {
    return (<div style={{ padding: 18 }}>
      <Heading title="بطاقات نبراس" subtitle="بطاقات مراجعة ذكية للحفظ السريع" />
      <Btn variant="gold" full onClick={() => setMode('setup')} style={{ marginBottom: 16 }}><Sparkles size={18} /> إنشاء بطاقات</Btn>
      {store.decks.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {store.decks.slice().reverse().map((d) => (
            <button key={d.id} onClick={() => openDeck(d)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '15px 16px', cursor: 'pointer' }}>
              <ChevronLeft size={18} color={T.textDim} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: T.text }}>{d.title}</div>
                <div style={{ color: T.textDim, fontSize: 12 }}>{d.cards.length} بطاقة</div>
              </div>
            </button>
          ))}
        </div>
      ) : <Empty Icon={BookOpen} text="لم يتم إنشاء أي بطاقات بعد" />}
    </div>);
  }
  if (mode === 'setup') {
    return (<div style={{ padding: 18 }}>
      <button onClick={() => setMode('home')} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
      <div style={{ height: 12 }} />
      <Heading title="إنشاء بطاقات" />
      <ImageScanButton
        label="صوّر ملاحظاتك أو الكتاب"
        onText={(t) => setTopic(prev => prev ? prev + '\n' + t : t)}
      />
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="أو اكتب الموضوع / الصق نص الدرس..." rows={5} style={{ ...field, resize: 'vertical', marginBottom: 14 }} />
      <Btn variant="gold" full onClick={start} disabled={!topic.trim()}><Sparkles size={18} /> توليد البطاقات</Btn>
    </div>);
  }
  if (mode === 'loading') return <div style={{ padding: 40 }}><Spinner text="جاري إنشاء البطاقات..." /></div>;
  const c = deck.cards[idx];
  return (<div style={{ padding: 18 }}>
    <button onClick={() => setMode('home')} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
    <div style={{ color: T.textDim, fontSize: 13, textAlign: 'center', margin: '10px 0 14px' }}>{idx + 1} / {deck.cards.length}</div>
    <button onClick={() => setFlip(!flip)} style={{ width: '100%', minHeight: 220, background: flip ? T.goldSoft : T.surface, border: `1px solid ${flip ? T.goldLine : T.border}`, borderRadius: 18, padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <span style={{ color: flip ? T.gold : T.accent, fontSize: 12, fontWeight: 700 }}>{flip ? 'الإجابة' : 'اضغط للقلب'}</span>
      <span style={{ color: T.text, fontSize: 18, fontWeight: 700, lineHeight: 1.9, textAlign: 'center' }}>{flip ? c.back : c.front}</span>
    </button>
    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
      <Btn variant="ghost" onClick={() => { setIdx(Math.max(0, idx - 1)); setFlip(false); }} disabled={idx === 0}>السابق</Btn>
      <Btn full onClick={() => { setIdx(Math.min(deck.cards.length - 1, idx + 1)); setFlip(false); }} disabled={idx === deck.cards.length - 1}>التالي</Btn>
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// ألعاب نبراس
// ---------------------------------------------------------------------------
function GamesView() {
  const [content, setContent] = useState('');
  const [game, setGame] = useState(null);
  const games = [
    { id: 'terms', title: 'كلمات المصطلحات', desc: 'خمّن المصطلحات من التعريفات', Icon: FileText },
    { id: 'relation', title: 'تحدي العلاقة', desc: 'هل الكلمة مرتبطة بالموضوع؟', Icon: Link2 },
    { id: 'hidden', title: 'الإجابات المخفية', desc: 'خمّن الإجابات المتعددة لسؤال واحد', Icon: Target },
  ];
  if (game === 'terms') return <TermsGame content={content} onExit={() => setGame(null)} />;
  if (game === 'relation') return <RelationGame content={content} onExit={() => setGame(null)} />;
  if (game === 'hidden') return <HiddenGame content={content} onExit={() => setGame(null)} />;
  return (<div style={{ padding: 18 }}>
    <Heading title="ألعاب نبراس" subtitle="العب وتعلّم في نفس الوقت — أدخل محتوى الدرس" />
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 18 }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 10 }}>محتوى الدرس</div>
      <ImageScanButton
        label="صوّر صفحة الكتاب أو الملاحظات"
        onText={(t) => setContent(prev => prev ? prev + '\n' + t : t)}
      />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="أو الصق نص الدرس هنا..." rows={5} style={{ ...field, resize: 'vertical' }} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {games.map((g) => (
        <div key={g.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', marginBottom: 4 }}>
            <span style={{ fontWeight: 800, color: T.text, fontSize: 16 }}>{g.title}</span>
            <g.Icon size={22} color={T.gold} />
          </div>
          <div style={{ color: T.textDim, fontSize: 13, textAlign: 'right', marginBottom: 14 }}>{g.desc}</div>
          <Btn full onClick={() => setGame(g.id)} disabled={!content.trim()}>العب الآن</Btn>
        </div>
      ))}
    </div>
    {!content.trim() && <div style={{ color: T.textFaint, fontSize: 12, textAlign: 'center', marginTop: 14 }}>الصق محتوى الدرس أولاً لتفعيل الألعاب</div>}
  </div>);
}
function GameShell({ title, onExit, children }) {
  return (<div style={{ padding: 18 }}>
    <button onClick={onExit} style={backLink}><ChevronLeft size={16} color={T.accent} /> الألعاب</button>
    <div style={{ height: 10 }} />
    <Heading title={title} />
    {children}
  </div>);
}
function norm(s) { return (s || '').trim().replace(/\s+/g, ' ').toLowerCase(); }

function TermsGame({ content, onExit }) {
  const [items, setItems] = useState(null);
  const [i, setI] = useState(0);
  const [val, setVal] = useState('');
  const [score, setScore] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => { (async () => {
    const arr = await genJSON(`استخرج 6 مصطلحات وتعريفاتها من النص التالي. أعد JSON فقط: [{"term":"المصطلح","definition":"التعريف"}]. بدون نص خارج JSON.\n\nالنص:\n${content}`);
    setItems(Array.isArray(arr) ? arr.filter((x) => x && x.term && x.definition) : []);
  })(); }, []);
  if (!items) return <GameShell title="كلمات المصطلحات" onExit={onExit}><Spinner text="جاري تجهيز اللعبة..." /></GameShell>;
  if (!items.length) return <GameShell title="كلمات المصطلحات" onExit={onExit}><Empty Icon={FileText} text="تعذّر توليد الأسئلة من هذا المحتوى." /></GameShell>;
  if (i >= items.length) return <GameShell title="كلمات المصطلحات" onExit={onExit}><Result score={score} total={items.length} onExit={onExit} /></GameShell>;
  const it = items[i];
  const check = () => {
    if (norm(val) === norm(it.term)) setScore((s) => s + 1);
    setShown(true);
  };
  const next = () => { setShown(false); setVal(''); setI(i + 1); };
  return (<GameShell title="كلمات المصطلحات" onExit={onExit}>
    <div style={{ color: T.textDim, fontSize: 13, marginBottom: 12 }}>{i + 1} / {items.length} — النقاط: {score}</div>
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 14 }}>
      <div style={{ color: T.textDim, fontSize: 12, marginBottom: 6 }}>التعريف</div>
      <div style={{ color: T.text, fontSize: 16, lineHeight: 1.9, textAlign: 'right' }}>{it.definition}</div>
    </div>
    <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !shown && check()} placeholder="اكتب المصطلح..." style={{ ...field, marginBottom: 12 }} disabled={shown} />
    {shown && <div style={{ background: norm(val) === norm(it.term) ? T.goodSoft : T.roseSoft, border: `1px solid ${norm(val) === norm(it.term) ? T.good + '55' : T.rose + '55'}`, borderRadius: 12, padding: 14, marginBottom: 12, textAlign: 'right' }}>
      <span style={{ color: norm(val) === norm(it.term) ? T.good : T.rose, fontWeight: 700 }}>{norm(val) === norm(it.term) ? 'إجابة صحيحة!' : 'الإجابة الصحيحة: '}</span>
      {norm(val) !== norm(it.term) && <span style={{ color: T.text }}>{it.term}</span>}
    </div>}
    {shown ? <Btn variant="gold" full onClick={next}>التالي</Btn> : <Btn full onClick={check} disabled={!val.trim()}>تحقق</Btn>}
  </GameShell>);
}

function RelationGame({ content, onExit }) {
  const [items, setItems] = useState(null);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => { (async () => {
    const arr = await genJSON(`بناءً على النص التالي، أعطني 8 كلمات بعضها مرتبط بموضوع النص وبعضها غير مرتبط. أعد JSON فقط: [{"word":"الكلمة","related":true}]. بدون نص خارج JSON.\n\nالنص:\n${content}`);
    setItems(Array.isArray(arr) ? arr.filter((x) => x && x.word && typeof x.related === 'boolean') : []);
  })(); }, []);
  if (!items) return <GameShell title="تحدي العلاقة" onExit={onExit}><Spinner text="جاري تجهيز اللعبة..." /></GameShell>;
  if (!items.length) return <GameShell title="تحدي العلاقة" onExit={onExit}><Empty Icon={Link2} text="تعذّر توليد الأسئلة." /></GameShell>;
  if (i >= items.length) return <GameShell title="تحدي العلاقة" onExit={onExit}><Result score={score} total={items.length} onExit={onExit} /></GameShell>;
  const it = items[i];
  const answer = (guess) => { if (guess === it.related) setScore((s) => s + 1); setShown(true); };
  const next = () => { setShown(false); setI(i + 1); };
  return (<GameShell title="تحدي العلاقة" onExit={onExit}>
    <div style={{ color: T.textDim, fontSize: 13, marginBottom: 12 }}>{i + 1} / {items.length} — النقاط: {score}</div>
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, textAlign: 'center', marginBottom: 16 }}>
      <div style={{ color: T.textDim, fontSize: 12, marginBottom: 8 }}>هل هذه الكلمة مرتبطة بالموضوع؟</div>
      <div style={{ color: T.text, fontSize: 24, fontWeight: 800 }}>{it.word}</div>
    </div>
    {!shown ? (
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn full variant="ghost" onClick={() => answer(false)}>غير مرتبطة</Btn>
        <Btn full onClick={() => answer(true)}>مرتبطة</Btn>
      </div>
    ) : (<>
      <div style={{ background: T.goodSoft, border: `1px solid ${T.good}44`, borderRadius: 12, padding: 14, marginBottom: 12, textAlign: 'center', color: T.good, fontWeight: 700 }}>
        {it.related ? 'مرتبطة بالموضوع' : 'غير مرتبطة بالموضوع'}
      </div>
      <Btn variant="gold" full onClick={next}>التالي</Btn>
    </>)}
  </GameShell>);
}

function HiddenGame({ content, onExit }) {
  const [data, setData] = useState(null);
  const [val, setVal] = useState('');
  const [found, setFound] = useState([]);
  useEffect(() => { (async () => {
    const obj = await genJSON(`حوّل النص التالي إلى سؤال واحد له عدة إجابات صحيحة (3-6 إجابات). أعد JSON فقط: {"question":"السؤال","answers":["إجابة1","إجابة2"]}. بدون نص خارج JSON.\n\nالنص:\n${content}`);
    setData(obj && obj.question && Array.isArray(obj.answers) ? obj : { question: '', answers: [] });
  })(); }, []);
  if (!data) return <GameShell title="الإجابات المخفية" onExit={onExit}><Spinner text="جاري تجهيز اللعبة..." /></GameShell>;
  if (!data.answers.length) return <GameShell title="الإجابات المخفية" onExit={onExit}><Empty Icon={Target} text="تعذّر توليد السؤال." /></GameShell>;
  const tryGuess = () => {
    const g = norm(val);
    const hit = data.answers.findIndex((a, idx) => norm(a).includes(g) && g.length > 1 && !found.includes(idx));
    if (hit >= 0) setFound((f) => [...f, hit]);
    setVal('');
  };
  const allFound = found.length === data.answers.length;
  return (<GameShell title="الإجابات المخفية" onExit={onExit}>
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
      <div style={{ color: T.text, fontSize: 17, fontWeight: 700, lineHeight: 1.9, textAlign: 'right' }}>{data.question}</div>
    </div>
    <div style={{ color: T.textDim, fontSize: 13, marginBottom: 10 }}>وجدت {found.length} من {data.answers.length}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
      {data.answers.map((a, idx) => (
        <div key={idx} style={{ background: found.includes(idx) ? T.goodSoft : T.surfaceAlt, border: `1px solid ${found.includes(idx) ? T.good + '55' : T.border}`, borderRadius: 12, padding: '13px 16px', textAlign: 'right', color: found.includes(idx) ? T.text : T.textFaint, fontWeight: found.includes(idx) ? 700 : 400 }}>
          {found.includes(idx) ? a : '••••••••'}
        </div>
      ))}
    </div>
    {!allFound ? (
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn onClick={tryGuess} disabled={!val.trim()}>تحقق</Btn>
        <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryGuess()} placeholder="اكتب إجابة..." style={{ ...field, flex: 1 }} />
      </div>
    ) : <Result score={found.length} total={data.answers.length} onExit={onExit} />}
    {!allFound && <button onClick={() => setFound(data.answers.map((_, k) => k))} style={{ ...backLink, marginTop: 14, color: T.textDim }}>كشف الإجابات</button>}
  </GameShell>);
}
function Result({ score, total, onExit }) {
  const pc = Math.round((score / total) * 100);
  return (<div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, textAlign: 'center' }}>
    <Trophy size={40} color={pc >= 60 ? T.gold : T.textDim} style={{ margin: '0 auto' }} />
    <div style={{ fontWeight: 800, fontSize: 34, color: pc >= 60 ? T.good : T.gold, marginTop: 10 }}>{score}/{total}</div>
    <div style={{ color: T.textDim, fontSize: 14, margin: '4px 0 18px' }}>{pc}%</div>
    <Btn variant="gold" full onClick={onExit}>انتهى</Btn>
  </div>);
}

// ---------------------------------------------------------------------------
// الفيديوهات التعليمية (سيناريو/قصة مصوّرة)
// ---------------------------------------------------------------------------
function VideosView({ store, setStore }) {
  const [mode, setMode] = useState('home');
  const [topic, setTopic] = useState('');
  const [video, setVideo] = useState(null);

  const start = async () => {
    if (!topic.trim()) return; setMode('loading');
    try {
      const arr = await genJSON(`حوّل الدرس التالي إلى سيناريو فيديو تعليمي من 4 إلى 6 مشاهد. أعد JSON فقط: [{"title":"عنوان المشهد","narration":"نص الشرح للمشهد"}]. بدون نص خارج JSON.\n\nالدرس:\n${topic}`);
      const valid = Array.isArray(arr) ? arr.filter((x) => x && x.title && x.narration) : [];
      if (!valid.length) { setMode('setup'); return; }
      const v = { id: uid(), title: topic.slice(0, 40), scenes: valid, at: Date.now() };
      setStore((s) => ({ ...s, videos: [...s.videos, v] }));
      setVideo(v); setMode('view');
    } catch { setMode('setup'); }
  };

  if (mode === 'home') {
    return (<div style={{ padding: 18 }}>
      <Heading title="الفيديوهات التعليمية" subtitle="حوّل دروسك إلى سيناريو فيديو تعليمي مرتّب" />
      <Btn variant="gold" full onClick={() => setMode('setup')} style={{ marginBottom: 16 }}><Sparkles size={18} /> إنشاء سيناريو فيديو</Btn>
      {store.videos.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {store.videos.slice().reverse().map((v) => (
            <button key={v.id} onClick={() => { setVideo(v); setMode('view'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '15px 16px', cursor: 'pointer' }}>
              <ChevronLeft size={18} color={T.textDim} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: T.text }}>{v.title}</div>
                <div style={{ color: T.textDim, fontSize: 12 }}>{v.scenes.length} مشاهد</div>
              </div>
            </button>
          ))}
        </div>
      ) : <Empty Icon={Video} text="لم تُنشأ أي فيديوهات بعد" />}
    </div>);
  }
  if (mode === 'setup') {
    return (<div style={{ padding: 18 }}>
      <button onClick={() => setMode('home')} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
      <div style={{ height: 12 }} />
      <Heading title="إنشاء سيناريو فيديو" />
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="الصق نص الدرس أو الموضوع..." rows={6} style={{ ...field, resize: 'vertical', marginBottom: 14 }} />
      <Btn variant="gold" full onClick={start} disabled={!topic.trim()}><Sparkles size={18} /> توليد المشاهد</Btn>
    </div>);
  }
  if (mode === 'loading') return <div style={{ padding: 40 }}><Spinner text="جاري بناء السيناريو..." /></div>;
  return (<div style={{ padding: 18 }}>
    <button onClick={() => setMode('home')} style={backLink}><ChevronLeft size={16} color={T.accent} /> رجوع</button>
    <div style={{ height: 12 }} />
    <Heading title={video.title} subtitle={`${video.scenes.length} مشاهد`} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {video.scenes.map((sc, i) => (
        <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: T.text, fontSize: 15 }}>{sc.title}</span>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: T.goldSoft, color: T.gold, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
          </div>
          <div style={{ color: T.textDim, fontSize: 14, lineHeight: 1.9 }}>{sc.narration}</div>
        </div>
      ))}
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// الملفات المرفوعة
// ---------------------------------------------------------------------------
function FilesView({ store, setStore, go }) {
  const inputRef = useRef(null);
  const [summary, setSummary] = useState(null);
  const [busy, setBusy] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const meta = { id: uid(), name: f.name, size: f.size, text: '', at: Date.now() };
    if (f.type.startsWith('text') || /\.(txt|md|csv)$/i.test(f.name)) {
      const r = new FileReader();
      r.onload = () => { meta.text = String(r.result || '').slice(0, 20000); setStore((s) => ({ ...s, files: [meta, ...s.files] })); };
      r.readAsText(f);
    } else { setStore((s) => ({ ...s, files: [meta, ...s.files] })); }
    e.target.value = '';
  };
  const remove = (id) => setStore((s) => ({ ...s, files: s.files.filter((f) => f.id !== id) }));

  const useFor = (file, action) => {
    const text = file.text?.trim();
    if (!text) { alert('هذا الملف لا يحتوي نصاً قابلاً للقراءة. استخدم ملف نصي (txt) أو الصق المحتوى في الشاشة المطلوبة.'); return; }
    if (action === 'summary') { doSummary(text); return; }
    setStore((s) => ({ ...s, pendingContent: text }));
    go(action); // 'quizzes' | 'cards' | 'videos'
  };
  const doSummary = async (text) => {
    setBusy(true); setSummary(null);
    try { setSummary(await ask(`لخّص النص التالي في نقاط واضحة ومرتبة بالعربية:\n\n${text}`)); }
    catch { setSummary('تعذّر التلخيص. حاول مرة أخرى.'); } finally { setBusy(false); }
  };

  const chips = [
    { k: 'summary', label: 'ملخص' }, { k: 'quizzes', label: 'اختبار' },
    { k: 'cards', label: 'بطاقات' }, { k: 'videos', label: 'فيديو' },
  ];
  return (<div style={{ padding: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <Btn variant="gold" onClick={() => inputRef.current?.click()}><Upload size={18} /> رفع ملف</Btn>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: T.text }}>الملفات الدراسية</div>
        <div style={{ color: T.textDim, fontSize: 13, marginTop: 4 }}>ارفع ملفاً نصياً ثم اختر القالب المناسب</div>
      </div>
    </div>
    <input ref={inputRef} type="file" onChange={onFile} style={{ display: 'none' }} accept=".txt,.md,.csv,.pdf,.doc,.docx,.ppt,.pptx" />

    <button onClick={() => inputRef.current?.click()} style={{ width: '100%', border: `2px dashed ${T.border}`, background: T.surface, borderRadius: 16, padding: '32px 16px', cursor: 'pointer', textAlign: 'center', marginBottom: 18 }}>
      <Upload size={32} color={T.textDim} style={{ margin: '0 auto' }} />
      <div style={{ color: T.text, fontWeight: 700, marginTop: 10 }}>اضغط لرفع ملف</div>
      <div style={{ color: T.textFaint, fontSize: 13, marginTop: 4 }}>أفضل دعم للملفات النصية (txt) — حتى 100MB</div>
    </button>

    {busy && <Spinner text="جاري التلخيص..." />}
    {summary && (
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 16, textAlign: 'right' }}>
        <div style={{ fontWeight: 700, color: T.gold, marginBottom: 8 }}>الملخص</div>
        <div style={{ color: T.text, fontSize: 14, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{summary}</div>
      </div>
    )}

    {store.files.length ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {store.files.map((f) => (
          <div key={f.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
              <button onClick={() => remove(f.id)} style={iconBtn}><Trash2 size={16} color={T.textFaint} /></button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: T.text, fontSize: 14, wordBreak: 'break-all' }}>{f.name}</div>
                  <div style={{ color: T.textFaint, fontSize: 12 }}>{(f.size / 1024).toFixed(0)} KB {f.text ? '· نص جاهز' : '· بدون نص'}</div>
                </div>
                <FileText size={20} color={T.accent} />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              {chips.map((c) => <button key={c.k} onClick={() => useFor(f, c.k)} style={{ background: T.accentSoft, color: T.accent, border: `1px solid ${T.accentLine}`, borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{c.label}</button>)}
            </div>
          </div>
        ))}
      </div>
    ) : <Empty Icon={FileUp} text="لم يتم رفع أي ملفات بعد" />}
  </div>);
}

// ---------------------------------------------------------------------------
// الإحصائيات
// ---------------------------------------------------------------------------
function StatsView({ store }) {
  const done = store.tasks.filter((t) => t.done).length;
  const planPct = store.tasks.length ? Math.round((done / store.tasks.length) * 100) : 0;
  const avg = store.quizResults.length ? Math.round(store.quizResults.reduce((s, r) => s + (r.score / r.total) * 100, 0) / store.quizResults.length) : 0;
  const hours = Math.round(Object.values(store.study).reduce((a, b) => a + (b || 0), 0) / 60);

  const week = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.toISOString().slice(0, 10); week.push({ label: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'][d.getDay()], h: Math.round(((store.study[k] || 0) / 60) * 10) / 10 }); }
  const maxH = Math.max(1, ...week.map((w) => w.h));

  const bySubject = {};
  store.tasks.forEach((t) => { bySubject[t.subject] = (bySubject[t.subject] || 0) + 1; });
  const subs = Object.entries(bySubject).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxS = Math.max(1, ...subs.map((s) => s[1]));

  return (<div style={{ padding: 18 }}>
    <Heading title="الإحصائيات والتقدم" subtitle="تابع تقدمك الأكاديمي وحقق أهدافك" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
      <StatCard Icon={Video} value={store.videos.length} label="الفيديوهات المنشأة" tint={T.gold} tintSoft={T.goldSoft} />
      <StatCard Icon={Trophy} value={`${avg}%`} label="متوسط درجات الاختبارات" tint={T.purple} tintSoft={T.purpleSoft} />
      <StatCard Icon={CheckCircle2} value={`${planPct}%`} label="نسبة إنجاز الخطة" tint={T.good} tintSoft={T.goodSoft} />
      <StatCard Icon={Clock} value={hours} label="ساعات المذاكرة" tint={T.accent} tintSoft={T.accentSoft} />
    </div>

    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 16, textAlign: 'right' }}>المذاكرة خلال الأسبوع</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110 }}>
        {week.map((w, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: '100%', height: 84, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', height: `${(w.h / maxH) * 100}%`, minHeight: w.h > 0 ? 4 : 0, background: T.accent, borderRadius: 6 }} />
            </div>
            <span style={{ fontSize: 10, color: T.textFaint }}>{w.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 14, textAlign: 'right' }}>أداء الاختبارات</div>
      {store.quizResults.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {store.quizResults.slice().reverse().slice(0, 6).map((r) => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: r.score / r.total >= 0.6 ? T.good : T.gold }}>{Math.round((r.score / r.total) * 100)}%</span>
              <span style={{ color: T.textDim, fontSize: 14 }}>{r.title || 'اختبار'}</span>
            </div>
          ))}
        </div>
      ) : <div style={{ color: T.textFaint, fontSize: 14, textAlign: 'center', padding: 12 }}>لا توجد نتائج اختبارات بعد</div>}
    </div>

    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 14, textAlign: 'right' }}>توزيع المواد</div>
      {subs.length ? subs.map(([name, n]) => (
        <div key={name} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.textDim, marginBottom: 6 }}><span>{n} مهمة</span><span style={{ color: T.text, fontWeight: 600 }}>{name}</span></div>
          <div style={{ height: 7, background: T.surfaceAlt, borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${(n / maxS) * 100}%`, height: '100%', background: T.gold, borderRadius: 999 }} /></div>
        </div>
      )) : <div style={{ color: T.textFaint, fontSize: 14, textAlign: 'center', padding: 12 }}>أضف مهام في الخطة لعرض التوزيع</div>}
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// الإعدادات
// ---------------------------------------------------------------------------
function SettingsView({ store, setStore }) {
  const [name, setName] = useState(store.settings.name || '');
  const [goal, setGoal] = useState(store.settings.dailyGoal || 60);
  const save = () => setStore((s) => ({ ...s, settings: { ...s.settings, name: name.trim(), dailyGoal: Number(goal) || 60 } }));
  const clearAll = () => { if (confirm('سيتم حذف كل بيانات نبراس على هذا الجهاز. متابعة؟')) setStore({ ...DEFAULT_STORE }); };
  return (<div style={{ padding: 18 }}>
    <Heading title="الإعدادات" />
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
      <label style={{ color: T.textDim, fontSize: 13, display: 'block', marginBottom: 8, textAlign: 'right' }}>الاسم</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" style={{ ...field, marginBottom: 16 }} />
      <label style={{ color: T.textDim, fontSize: 13, display: 'block', marginBottom: 8, textAlign: 'right' }}>هدف المذاكرة اليومي (دقائق)</label>
      <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} style={{ ...field, marginBottom: 16 }} />
      <Btn variant="gold" full onClick={save}>حفظ</Btn>
    </div>
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 4, textAlign: 'right' }}>إدارة البيانات</div>
      <div style={{ color: T.textDim, fontSize: 13, marginBottom: 14, textAlign: 'right' }}>تُحفظ بيانات نبراس محلياً على جهازك فقط.</div>
      <Btn variant="danger" full onClick={clearAll}><Trash2 size={16} /> مسح كل بيانات نبراس</Btn>
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// القائمة الجانبية
// ---------------------------------------------------------------------------
const NAV = [
  { id: 'dashboard', label: 'لوحة التحكم', Icon: LayoutGrid },
  { id: 'plan', label: 'الخطة الدراسية', Icon: Calendar },
  { id: 'chat', label: 'الشات التعليمي', Icon: MessageCircle },
  { id: 'quizzes', label: 'الاختبارات', Icon: ClipboardList },
  { id: 'cards', label: 'بطاقات نبراس', Icon: BookOpen },
  { id: 'games', label: 'ألعاب نبراس', Icon: Gamepad2 },
  { id: 'videos', label: 'الفيديوهات التعليمية', Icon: Video },
  { id: 'files', label: 'الملفات المرفوعة', Icon: FileUp },
  { id: 'stats', label: 'الإحصائيات', Icon: BarChart3 },
  { id: 'settings', label: 'الإعدادات', Icon: Settings },
];
function Drawer({ open, view, onSelect, onClose, onExit }) {
  if (!open) return null;
  return (<div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 300, maxWidth: '82%', background: T.surface, borderLeft: `1px solid ${T.border}`, padding: 18, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button onClick={onClose} style={iconBtn}><X size={22} color={T.text} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.text }}>نبراس</div>
            <div style={{ color: T.gold, fontSize: 12 }}>منصة التعلّم الذكي</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={20} color={T.gold} /></div>
        </div>
      </div>
      {NAV.map((n) => {
        const active = view === n.id;
        return <button key={n.id} onClick={() => { onSelect(n.id); onClose(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, background: active ? T.gold : 'transparent', color: active ? '#0B1020' : T.text, border: 'none', borderRadius: 12, padding: '13px 14px', marginBottom: 4, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
          {n.label}<n.Icon size={20} color={active ? '#0B1020' : T.textDim} />
        </button>;
      })}
      <div style={{ borderTop: `1px solid ${T.borderSoft}`, marginTop: 12, paddingTop: 12 }}>
        <button onClick={onExit} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, background: 'transparent', color: T.red, border: 'none', borderRadius: 12, padding: '13px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
          العودة إلى مرن<LogOut size={20} color={T.red} />
        </button>
      </div>
    </div>
  </div>);
}

// ---------------------------------------------------------------------------
// المكوّن الرئيسي
// ---------------------------------------------------------------------------
export default function NibrasApp({ onClose, marnT, marnF, dark, initialScreen }) {
  const [view, setView] = useState(initialScreen || 'dashboard');
  const [drawer, setDrawer] = useState(false);
  const [store, setStoreRaw] = useState(loadStore);
  const setStore = (updater) => setStoreRaw((prev) => { const next = typeof updater === 'function' ? updater(prev) : updater; try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* ignore */ } return next; });
  // إعادة تحميل المتجر عند إضافة خطة من شات نبراس + عند العودة للنافذة
  useEffect(() => {
    const reload = () => { try { setStoreRaw(loadStore()); } catch {} };
    window.addEventListener('nibras-plan-updated', reload);
    window.addEventListener('focus', reload);
    return () => { window.removeEventListener('nibras-plan-updated', reload); window.removeEventListener('focus', reload); };
  }, []);
  const name = store.settings.name || profileName();

  // مطابقة نظام مرن (الثيم/الوضع فاتح-داكن) — تجعل نبراس جزءاً من مرن لا تطبيقاً منفصلاً
  if (marnT) {
    Object.assign(T, {
      bg: marnT.pageBg, surface: marnT.cardBg, surfaceAlt: marnT.inputBg || marnT.pillFill,
      border: marnT.line, borderSoft: marnT.line,
      text: marnT.text, textDim: marnT.sub, textFaint: marnT.faint,
      accent: '#D9A93C', accentSoft: 'rgba(217,169,60,0.12)', accentLine: 'rgba(217,169,60,0.30)',
      gold: '#D9A93C', goldSoft: 'rgba(217,169,60,0.14)', goldLine: 'rgba(217,169,60,0.32)',
    });
    Object.assign(field, { background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.text });
    Object.assign(backLink, { color: T.accent });
  }

  const meta = {
    dashboard: { title: 'لوحة التحكم', Icon: LayoutGrid },
    plan: { title: 'الخطة الدراسية', Icon: Calendar },
    chat: { title: 'الشات التعليمي', Icon: MessageCircle },
    quizzes: { title: 'الاختبارات', Icon: ClipboardList },
    cards: { title: 'بطاقات نبراس', Icon: BookOpen },
    games: { title: 'ألعاب نبراس', Icon: Gamepad2 },
    videos: { title: 'الفيديوهات التعليمية', Icon: Video },
    files: { title: 'الملفات المرفوعة', Icon: FileUp },
    stats: { title: 'الإحصائيات', Icon: BarChart3 },
    settings: { title: 'الإعدادات', Icon: Settings },
  }[view];

  return (<div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: 40, background: T.bg, color: T.text, fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
    <style>{`@keyframes nspin{to{transform:rotate(360deg)}} .nbr-scroll::-webkit-scrollbar{width:0} .ncard:active{transform:scale(.97)} .ncard:hover{border-color:${T.accentLine}!important} .listrow:active{background:${T.surface}!important} .listrow:hover{background:${T.surfaceAlt}!important} @keyframes nFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} .nfadeup{animation:nFadeUp .35s ease both}`}</style>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: `1px solid ${T.border}`, background: `linear-gradient(180deg, ${T.gold}14, ${T.surface} 80%)`, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ width: 40 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: `${T.gold}1c`, border: `1px solid ${T.gold}33`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><meta.Icon size={17} color={T.gold} /></span>
        <span style={{ fontWeight: 800, color: T.text, fontSize: 17 }}>{meta.title}</span>
      </div>
      <button onClick={onClose} style={iconBtn}><ArrowRight size={22} color={T.text} /></button>
    </div>
    <div className="nbr-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      {view === 'dashboard' && <Dashboard store={store} go={setView} name={name} />}
      {view === 'plan' && <PlanView store={store} setStore={setStore} />}
      {view === 'chat' && <ChatView />}
      {view === 'quizzes' && <QuizView store={store} setStore={setStore} />}
      {view === 'cards' && <CardsView store={store} setStore={setStore} />}
      {view === 'games' && <GamesView />}
      {view === 'videos' && <VideosView store={store} setStore={setStore} />}
      {view === 'files' && <FilesView store={store} setStore={setStore} go={setView} />}
      {view === 'stats' && <StatsView store={store} />}
      {view === 'settings' && <SettingsView store={store} setStore={setStore} />}
    </div>
  </div>);
}
