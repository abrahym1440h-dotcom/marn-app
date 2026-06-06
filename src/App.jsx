import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { TRANSLATIONS } from "./i18n.js";


/* ===== شعار مرن ===== */




/* ============ ثوابت ============ */
/* ===== شعارات مرن - فاتح للداكن، داكن للفاتح ===== */
const LOGO_LIGHT_XS = "data:image/png;base64,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";  // أبيض/فاتح → يظهر على خلفية داكنة
const LOGO_LIGHT_SM = "data:image/png;base64,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";
const LOGO_DARK_XS = "data:image/png;base64,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";   // أزرق داكن → يظهر على خلفية فاتحة
const LOGO_DARK_SM = "data:image/png;base64,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";

const STORAGE_KEY = "marn_chats_v2";
const SETTINGS_KEY = "marn_settings_v2";
const FAV_KEY = "marn_favs_v2";
const PROFILE_KEY = "marn_profile_v1";
const VERSION = "3.0";

const ACCENTS = {
  sport: "#34c759",
  knowledge: "#0a84ff",
  history: "#bf5af2",
  food: "#ff9500",
};

/* ============ الثيمات الاحترافية ============ */
const THEMES = {
  light: {
    // Clean Navy — فاتح
    pageBg:      "#F7F9FF",
    sidebarBg:   "#FFFFFF",
    text:        "#0B1A3D",
    sub:         "#5B7AAA",
    faint:       "#9BBAD8",
    glassFill:   "#FFFFFF",
    glassEdge:   "rgba(27,47,107,0.06)",
    glassBorder: "#D4E0FA",
    glassShadow: "0 4px 32px rgba(27,47,107,0.08)",
    headerBg:    "rgba(255,255,255,0.97)",
    composerBg:  "rgba(255,255,255,0.97)",
    userFill:    "linear-gradient(135deg,#0F2060,#1E4BB8)",
    userText:    "#ffffff",
    pillFill:    "#F0F4FF",
    pillActive:  "#FFFFFF",
    line:        "#D4E0FA",
    hover:       "#F0F4FF",
    dotIdle:     "#C5D5EE",
    modalBg:     "rgba(11,26,61,0.35)",
    cardBg:      "#FFFFFF",
    inputBg:     "#F7F9FF",
    accent:      "#0F2060",
    accentBlue:  "#2A5ED8",
    stat:        "#F0F4FF",
    statBorder:  "#D4E0FA",
    // ألوان هوية Clean Navy
    navy:        "#0F2060",
    blue:        "#2A5ED8",
    ice:         "#1B2F6B",
    gradBtn:     "linear-gradient(135deg,#0F2060,#2A5ED8)",
  },
  dark: {
    // Clean Navy — داكن
    pageBg:      "#090F22",
    sidebarBg:   "#0A1228",
    text:        "#EFF5FF",
    sub:         "#7A9CC4",
    faint:       "#3A5A84",
    glassFill:   "#0E1730",
    glassEdge:   "rgba(74,143,255,0.06)",
    glassBorder: "#162450",
    glassShadow: "0 4px 32px rgba(0,0,0,0.5)",
    headerBg:    "rgba(9,15,34,0.97)",
    composerBg:  "rgba(9,15,34,0.97)",
    userFill:    "linear-gradient(135deg,#0F2060,#1E4BB8)",
    userText:    "#ffffff",
    pillFill:    "#0E1730",
    pillActive:  "#162450",
    line:        "#162450",
    hover:       "#0E1730",
    dotIdle:     "#2A4070",
    modalBg:     "rgba(0,0,0,0.7)",
    cardBg:      "#0E1730",
    inputBg:     "#0E1730",
    accent:      "#EFF5FF",
    accentBlue:  "#4A8FFF",
    stat:        "#0E1730",
    statBorder:  "#162450",
    // ألوان هوية Clean Navy
    navy:        "#1B2F6B",
    blue:        "#4A8FFF",
    ice:         "#C8DEFF",
    gradBtn:     "linear-gradient(135deg,#0F2060,#2A5ED8)",
  },
};

const FONT_SIZES = {
  small: { base: 13, h1: 22, h2: 18, label: 11 },
  medium: { base: 14.5, h1: 24, h2: 20, label: 12 },
  large: { base: 16, h1: 27, h2: 22, label: 13 },
};

/* ============ مكوّن البطاقة الاحترافية ============ */
function Glass({ T, children, style, radius = 12, onClick, className = "" }) {
  return (
    <div onClick={onClick} className={`card-surface ${className}`} style={{
      position: "relative", borderRadius: radius,
      background: T.cardBg || T.glassFill,
      border: `1px solid ${T.glassBorder}`,
      boxShadow: T.glassShadow,
      overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

/* ============ الأيقونات ============ */
const Icon = {
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chat: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Star: ({ filled }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>,
  Sun: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Type: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Refresh: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Search2: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Web: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Mic: ({ active }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Groups: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="7" r="3"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg>,
};

/* ============ التطبيق الرئيسي ============ */
export default function App() {
  // الإعدادات
  const [settings, setSettings] = useState({
    mode: "auto",        // light | dark | auto
    lang: "ar",          // ar | en
    fontSize: "medium",  // small | medium | large
    showSuggestions: true,
  });

  // الحالة
  const [systemDark, setSystemDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("chats");
  const [appView, setAppView] = useState("chat"); // "chat" | "groups"
  const [showAppMenu, setShowAppMenu] = useState(false); // قائمة التطبيقات
  const [isMobile, setIsMobile] = useState(false);
  const [chats, setChats] = useState({});
  const [userProfile, setUserProfile] = useState({ name:"", job:"", interests:"" });
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [favs, setFavs] = useState([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null); // {chatId, index, text}
  const [renameDialog, setRenameDialog] = useState(null); // {id, currentTitle}
  const [forceSearch, setForceSearch] = useState(false);
  const [chatSearch, setChatSearch] = useState("");

  const endRef = useRef(null);
  const inputRef = useRef(null);

  // الوضع الفعلي
  const effectiveMode = settings.mode === "auto" ? (systemDark ? "dark" : "light") : settings.mode;
  const T = THEMES[effectiveMode];
  const t = TRANSLATIONS[settings.lang];
  const F = FONT_SIZES[settings.fontSize];
  const isRTL = settings.lang === "ar";

  /* ===== التحميل ===== */
  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) setSettings(prev => ({ ...prev, ...JSON.parse(s) }));
      const c = localStorage.getItem(STORAGE_KEY);
      if (c) setChats(JSON.parse(c));
      const f = localStorage.getItem(FAV_KEY);
      if (f) setFavs(JSON.parse(f));
      const p = localStorage.getItem(PROFILE_KEY);
      if (p) { const parsed = JSON.parse(p); setUserProfile(parsed); }
      else { setTimeout(() => setShowProfileSetup(true), 800); }
    } catch {}
  }, []);

  /* ===== الحفظ ===== */
  useEffect(() => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {} }, [settings]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); } catch {} }, [chats]);
  useEffect(() => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch {} }, [favs]);
  useEffect(() => { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile)); } catch {} }, [userProfile]);

  /* ===== تحديث html element ===== */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveMode);
    document.documentElement.setAttribute("lang", settings.lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [effectiveMode, settings.lang, isRTL]);

  /* ===== كشف وضع النظام ===== */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const handler = e => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ===== حجم الشاشة ===== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===== التمرير ===== */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChat, thinking, chats]);

  /* ===== Toast ===== */
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  /* ===== الإجراءات ===== */
  const currentMessages = activeChat ? (chats[activeChat]?.messages || []) : [];
  const empty = currentMessages.length === 0;
  const sortedChats = useMemo(() => {
    let list = Object.values(chats).sort((a, b) => b.createdAt - a.createdAt);
    if (chatSearch.trim()) {
      const q = chatSearch.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some(m => (m.text || "").toLowerCase().includes(q))
      );
    }
    return list;
  }, [chats, chatSearch]);

  const newChat = useCallback(() => {
    setActiveChat(null);
    setDraft("");
    if (isMobile) setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isMobile]);

  const openChat = useCallback((id) => {
    setActiveChat(id);
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const askConfirm = useCallback((title, action) => {
    setConfirmDialog({ title, action });
  }, []);

  const deleteChat = useCallback((id) => {
    askConfirm(t.confirmDelete, () => {
      setChats(prev => { const n = { ...prev }; delete n[id]; return n; });
      if (activeChat === id) setActiveChat(null);
    });
  }, [activeChat, t, askConfirm]);

  const clearAllChats = useCallback(() => {
    askConfirm(t.confirmDeleteAll, () => {
      setChats({});
      setActiveChat(null);
      showToast(isRTL ? "✓ تم الحذف" : "✓ Deleted");
    });
  }, [t, askConfirm, isRTL, showToast]);

  const clearAllFavs = useCallback(() => {
    askConfirm(t.confirmDeleteFavs, () => {
      setFavs([]);
      showToast(isRTL ? "✓ تم الحذف" : "✓ Deleted");
    });
  }, [t, askConfirm, isRTL, showToast]);

  const toggleFav = useCallback((q, chatId) => {
    setFavs(prev => {
      const exists = prev.find(f => f.q === q);
      if (exists) return prev.filter(f => f.q !== q);
      return [{ q, chatId, at: Date.now() }, ...prev];
    });
  }, []);

  const isFav = useCallback((q) => favs.some(f => f.q === q), [favs]);

  const exportChats = useCallback(() => {
    const text = sortedChats.map(c => {
      const lines = [`### ${c.title}`, `📅 ${new Date(c.createdAt).toLocaleString(settings.lang)}`, ""];
      c.messages.forEach(m => {
        if (m.role === "user") lines.push(`👤 ${m.text}`);
        else if (m.role === "card") {
          lines.push(`🤖 ${m.card?.title || ""}`);
          if (m.card?.sub) lines.push(`   ${m.card.sub}`);
        }
      });
      lines.push("\n---\n");
      return lines.join("\n");
    }).join("\n");

    try {
      navigator.clipboard.writeText(text);
      showToast(isRTL ? "✓ تم النسخ" : "✓ Copied");
    } catch {
      showToast(isRTL ? "تعذر النسخ" : "Copy failed");
    }
  }, [sortedChats, settings.lang, isRTL, showToast]);

  const copyCard = useCallback((card) => {
    const lines = [card.title];
    if (card.sub) lines.push(card.sub);
    lines.push("");
    (card.tabs || []).forEach(tab => {
      lines.push(`## ${tab.label}`);
      const d = tab.data || {};
      if (d.intro) lines.push(d.intro);
      if (d.items) {
        d.items.forEach(it => {
          if (typeof it === "string") lines.push("• " + it);
          else if (it.value) lines.push(`• ${it.value} — ${it.label}${it.hint ? ` (${it.hint})` : ""}`);
          else if (it.text) lines.push(`${it.icon || "•"} ${it.text}`);
        });
      }
      if (d.steps) d.steps.forEach((s, i) => lines.push(`${i+1}. ${s.t}${s.d ? ": " + s.d : ""}`));
      if (d.events) d.events.forEach(e => lines.push(`${e[0]} — ${e[1]}${e[2] ? ": " + e[2] : ""}`));
      if (d.body) lines.push(d.body);
      lines.push("");
    });
    try {
      navigator.clipboard.writeText(lines.join("\n"));
      showToast(t.copied);
    } catch {
      showToast(isRTL ? "تعذر النسخ" : "Copy failed");
    }
  }, [t, isRTL, showToast]);

  /* ===== الإرسال ===== */
  const sendMessage = async (q, opts = {}) => {
    const { chatId: targetChatId, replaceFromIndex, forceWebSearch } = opts;
    if (!q || thinking) return;

    let chatId = targetChatId || activeChat;
    let isNewChat = false;
    if (!chatId) {
      chatId = "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      isNewChat = true;
      setChats(prev => ({
        ...prev,
        [chatId]: { id: chatId, title: q.slice(0, 40), messages: [], createdAt: Date.now() }
      }));
      setActiveChat(chatId);
    }

    // لو فيه replaceFromIndex - نحذف الرسائل من هذا الفهرس فما بعد
    setChats(prev => {
      const cur = prev[chatId] || { id: chatId, title: q.slice(0, 40), messages: [], createdAt: Date.now() };
      let msgs = [...cur.messages];
      if (typeof replaceFromIndex === "number") {
        msgs = msgs.slice(0, replaceFromIndex);
      }
      msgs.push({ role: "user", text: q, at: Date.now() });
      return { ...prev, [chatId]: { ...cur, messages: msgs } };
    });
    setDraft("");
    setEditingMsg(null);
    setThinking(true);

    // التاريخ
    const baseMessages = (chats[chatId]?.messages || []);
    const trimmed = typeof replaceFromIndex === "number" ? baseMessages.slice(0, replaceFromIndex) : baseMessages;
    const history = trimmed.slice(-6).map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.role === "user" ? m.text : (m.card?.title || ""),
    }));

    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          history,
          lang: settings.lang,
          forceSearch: forceWebSearch === true,
        }),
      });
      let data = null;
      try { data = await r.json(); } catch {}

      setChats(prev => {
        const cur = prev[chatId];
        if (!cur) return prev;
        let newMsg;
        if (r.ok && data?.card) {
          newMsg = { role: "card", card: data.card, searched: data.searched, at: Date.now(), forSearchQuery: q, followUps: Array.isArray(data.card?.followUps) ? data.card.followUps : [] };
        } else {
          const errMsg = (data && (data.error || data.detail))
            ? `${data.error || ""}${data.detail ? " — " + data.detail : ""}`
            : `${t.error} ${r.status}`;
          newMsg = { role: "error", text: errMsg, at: Date.now() };
        }
        return { ...prev, [chatId]: { ...cur, messages: [...cur.messages, newMsg] } };
      });
    } catch (e) {
      setChats(prev => {
        const cur = prev[chatId];
        if (!cur) return prev;
        return {
          ...prev,
          [chatId]: { ...cur, messages: [...cur.messages, { role: "error", text: t.errorNetwork, at: Date.now() }] }
        };
      });
    } finally {
      setThinking(false);
      setForceSearch(false);
    }
  };

  const send = (text) => {
    const q = (text ?? draft).trim();
    sendMessage(q, { forceWebSearch: forceSearch });
  };

  const editAndResend = (chatId, index, newText) => {
    sendMessage(newText.trim(), { chatId, replaceFromIndex: index });
  };

  const regenerate = (chatId, cardIndex) => {
    // نلاقي رسالة المستخدم السابقة قبل البطاقة
    const msgs = chats[chatId]?.messages || [];
    let userIndex = cardIndex - 1;
    while (userIndex >= 0 && msgs[userIndex]?.role !== "user") userIndex--;
    if (userIndex < 0) return;
    const userMsg = msgs[userIndex];
    // نحذف من فهرس البطاقة فأكثر، ونعيد إرسال السؤال
    sendMessage(userMsg.text, { chatId, replaceFromIndex: cardIndex });
  };

  const renameChat = (id, newTitle) => {
    setChats(prev => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle.slice(0, 60) || prev[id].title }
    }));
  };

  /* ===== العرض ===== */
  // لو في وضع المجموعات، نعرض GroupsApp كاملاً
  if (appView === "groups") {
    return (
      <GroupsApp
        T={T} t={t} F={F} isRTL={isRTL}
        dark={effectiveMode === "dark"}
        onBack={() => setAppView("chat")}
      />
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{
      height: "100dvh", display: "flex", position: "relative",
      background: T.pageBg, color: T.text,
      fontFamily: "'Noto Sans Arabic','SF Pro Text','Segoe UI',sans-serif",
      WebkitFontSmoothing: "antialiased",
      transition: "background .5s ease, color .4s ease",
      overflow: "hidden",
      fontSize: F.base,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* الشريط الجانبي */}
      <Sidebar
        T={T} t={t} F={F} isMobile={isMobile} isRTL={isRTL}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        tab={tab} setTab={setTab}
        onOpenGroups={() => setAppView("groups")}
        showAppMenu={showAppMenu} setShowAppMenu={setShowAppMenu}
        sortedChats={sortedChats} activeChat={activeChat}
        openChat={openChat} deleteChat={deleteChat}
        favs={favs} send={send}
        newChat={newChat}
        settings={settings} setSettings={setSettings}
        effectiveMode={effectiveMode}
        clearAllChats={clearAllChats} clearAllFavs={clearAllFavs}
        exportChats={exportChats}
        chatSearch={chatSearch} setChatSearch={setChatSearch}
        onRename={(id) => setRenameDialog({ id, currentTitle: chats[id]?.title || "" })}
        userProfile={userProfile} setUserProfile={setUserProfile}
        onEditProfile={() => setShowProfileSetup(true)}
      />

      {/* المنطقة الرئيسية */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* الهيدر */}
        <header style={{
          flexShrink: 0, position: "relative", zIndex: 5,
          background: T.headerBg,
          borderBottom: `1px solid ${T.line}`,
        }}>
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={iconBtnStyle(T)}>
                <Icon.Menu />
              </button>
            )}
            <div style={{ flex: 1, fontSize: F.base, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeChat ? chats[activeChat]?.title : t.appName}
            </div>
            <button onClick={newChat} style={{
              ...iconBtnStyle(T),
              background: T.gradBtn||"linear-gradient(135deg,#0F2060,#2A5ED8)",
              color: "#fff",
              border: "none",
              boxShadow: "none",
              borderRadius: 9,
            }} title={t.newChat}>
              <Icon.Plus />
            </button>
          </div>
        </header>

        {/* خيط الرسائل */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 14px", position: "relative" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 0 16px" }}>
            {empty && (
              <EmptyState T={T} t={t} F={F} send={send} settings={settings} userProfile={userProfile} />
            )}

            {currentMessages.map((m, i) => (
              <MessageItem key={i} m={m} idx={i} T={T} t={t} F={F}
                isRTL={isRTL} lang={settings.lang}
                isFav={isFav} toggleFav={() => toggleFav(m.text, activeChat)}
                copyCard={copyCard} activeChat={activeChat}
                editingMsg={editingMsg} setEditingMsg={setEditingMsg}
                onEditSend={(newText) => editAndResend(activeChat, i, newText)}
                onRegenerate={() => regenerate(activeChat, i)}
                onSelect={(q) => send(q)}
                thinking={thinking}
              />
            ))}

            {thinking && (
              <div style={{ display: "flex", gap: 6, padding: "6px 4px 20px" }}>
                {[0, 0.16, 0.32].map((d, i) => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: T.dotIdle,
                    animation: `bd 1.3s ${d}s infinite ease-in-out`,
                  }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* مربع الكتابة */}
        <div style={{
          flexShrink: 0, position: "relative", zIndex: 5,
          background: T.composerBg, borderTop: `1px solid ${T.line}`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "12px 14px" }}>
            {settings.showSuggestions && currentMessages.length > 0 && (
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
                {t.suggestions.slice(0, 3).map(s => (
                  <Glass key={s} T={T} radius={999} onClick={() => send(s)} className="press"
                    style={{ cursor: thinking ? "default" : "pointer", padding: "7px 13px", flexShrink: 0 }}>
                    <span style={{ fontSize: F.base - 2, fontWeight: 500, color: T.sub, whiteSpace: "nowrap" }}>{s}</span>
                  </Glass>
                ))}
              </div>
            )}
            <div style={{
              background: T.inputBg || T.glassFill,
              border: `1.5px solid ${T.line}`,
              borderRadius: 14,
              padding: "10px 10px 10px 14px",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "border-color .15s",
            }}>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                  if (e.key === "Escape") { setDraft(""); setEditingMsg(null); }
                }}
                placeholder={forceSearch ? (isRTL ? "ابحث في الإنترنت..." : "Search the web...") : t.placeholder}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: T.text, fontSize: F.base, padding: "2px 4px", fontFamily: "inherit",
                  direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left",
                  minWidth: 0,
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <MicButton T={T} isRTL={isRTL} onResult={(text) => setDraft(prev => prev + text)} />
                <button onClick={() => setForceSearch(s => !s)}
                  title={isRTL ? "بحث في الإنترنت" : "Search the web"}
                  style={{
                    background: forceSearch ? "rgba(10,132,255,0.1)" : "transparent",
                    color: forceSearch ? "#0a84ff" : T.faint,
                    border: "none", borderRadius: 8,
                    width: 32, height: 32, cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .15s",
                  }}>
                  <Icon.Web />
                </button>
                <button onClick={() => send()} disabled={!draft.trim() || thinking}
                  style={{
                    background: draft.trim() ? (T.gradBtn||"linear-gradient(135deg,#0F2060,#2A5ED8)") : T.pillFill,
                    color: draft.trim() ? "#fff" : T.faint,
                    border: draft.trim() ? "none" : `1px solid ${T.line}`, borderRadius: 9,
                    width: 34, height: 34,
                    cursor: draft.trim() ? "pointer" : "default",
                    fontFamily: "inherit", transition: "all .15s", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: isRTL ? "scaleX(-1)" : "none",
                    boxShadow: "none",
                  }}>
                  <Icon.Send />
                </button>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: F.label - 1, color: T.faint, marginTop: 8 }}>
              {t.appName} {t.mayMakeMistakes}
            </div>
          </div>
        </div>
      </main>

      {/* خلفية الـ overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0, background: T.modalBg, zIndex: 25, backdropFilter: "blur(4px)",
        }} />
      )}

      {/* نافذة التأكيد */}
      {confirmDialog && (
        <ConfirmModal T={T} t={t} F={F}
          title={confirmDialog.title}
          onConfirm={() => { confirmDialog.action(); setConfirmDialog(null); }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* نافذة إعادة التسمية */}
      {renameDialog && (
        <RenameModal T={T} t={t} F={F} isRTL={isRTL}
          currentTitle={renameDialog.currentTitle}
          onSave={(newTitle) => { renameChat(renameDialog.id, newTitle); setRenameDialog(null); }}
          onCancel={() => setRenameDialog(null)}
        />
      )}

      {/* نافذة إعداد الملف الشخصي */}
      {showProfileSetup && (
        <ProfileSetup T={T} F={F} isRTL={isRTL}
          onSave={(profile) => {
            setUserProfile(profile);
            setShowProfileSetup(false);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)",
          background: effectiveMode === "dark" ? "rgba(40,40,46,0.95)" : "rgba(255,255,255,0.98)",
          color: T.text, padding: "11px 22px", borderRadius: 12,
          fontSize: F.base - 0.5, fontWeight: 600,
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          zIndex: 100, animation: "toastIn .3s",
          backdropFilter: "blur(20px)",
          border: `1px solid ${T.line}`,
        }}>{toast}</div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        .card-surface { transition: box-shadow .15s ease; }
        .press { transition: opacity .15s ease; }
        .press:active { opacity: 0.7; }
        .card-in { animation: ci .35s cubic-bezier(.2,.8,.3,1) both; }
        @keyframes ci { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .tab-in { animation: ti .25s ease both; }
        @keyframes ti { from{opacity:0} to{opacity:1} }
        @keyframes toastIn { from{opacity:0;transform:translate(-50%,8px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes micPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder { color: ${T.faint} }
        textarea::placeholder { color: ${T.faint} }
        @keyframes bd { 0%,80%,100%{transform:scale(.4);opacity:.3} 40%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar { width: 4px; height: 0; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 2px; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}

/* ============ الشريط الجانبي ============ */
function Sidebar({ T, t, F, isMobile, isRTL, sidebarOpen, setSidebarOpen, tab, setTab, onOpenGroups, showAppMenu, setShowAppMenu,
  sortedChats, activeChat, openChat, deleteChat, favs, send, newChat,
  settings, setSettings, effectiveMode, clearAllChats, clearAllFavs, exportChats,
  chatSearch, setChatSearch, onRename, userProfile, setUserProfile, onEditProfile }) {

  return (
    <aside style={{
      position: isMobile ? "fixed" : "relative",
      [isRTL ? "right" : "left"]: isMobile ? (sidebarOpen ? 0 : "-300px") : 0,
      top: 0, bottom: 0, width: 280,
      background: T.sidebarBg,
      backdropFilter: "blur(30px) saturate(180%)",
      WebkitBackdropFilter: "blur(30px) saturate(180%)",
      [isRTL ? "borderLeft" : "borderRight"]: `1px solid ${T.line}`,
      zIndex: 30, display: "flex", flexDirection: "column",
      transition: `${isRTL ? "right" : "left"} .3s cubic-bezier(.22,.68,.28,1)`,
      boxShadow: isMobile && sidebarOpen ? "0 0 30px rgba(0,0,0,0.2)" : "none",
    }}>
      {/* الهيدر */}
      <div style={{ padding: "16px 14px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(145deg,#0F2060,#2A5ED8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(15,32,96,0.4)", padding: 3,
          }}><img src={LOGO_LIGHT_XS} alt="مرن" style={{ width:"100%", height:"100%", objectFit:"contain" }}/></div>
          <div style={{ fontSize: F.base + 1, fontWeight: 700, color: T.text }}>{t.appName}</div>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={iconBtnStyle(T)}>
            <Icon.Close />
          </button>
        )}
      </div>

      {/* محادثة جديدة */}
      <div style={{ padding: "12px 14px 8px" }}>
        {/* زر + مع قائمة منبثقة */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowAppMenu(!showAppMenu)}
          style={{
            width: "100%",
            background: T.gradBtn||"linear-gradient(135deg,#0F2060,#2A5ED8)",
            color: "#fff", border: "none", borderRadius: 9,
            padding: "10px 14px", fontSize: F.base - 0.5, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 7, boxShadow: "0 2px 12px rgba(15,32,96,0.3)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {isRTL ? "جديد" : "New"}
        </button>

        {/* القائمة المنبثقة */}
        {showAppMenu && (
          <>
            {/* overlay لإغلاق القائمة */}
            <div
              onClick={() => setShowAppMenu(false)}
              style={{ position: "fixed", inset: 0, zIndex: 30 }}
            />
            <div style={{
              position: "absolute", top: "calc(100% + 6px)",
              right: 0, left: 0, zIndex: 40,
              background: T.cardBg || T.glassFill,
              border: `1px solid ${T.glassBorder || T.line}`,
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}>
              {/* محادثة جديدة */}
              <button onClick={() => { newChat(); setShowAppMenu(false); }} style={{
                width: "100%", background: "transparent", border: "none",
                borderBottom: `1px solid ${T.line}`,
                padding: "13px 16px", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 12, color: T.text,
                textAlign: "right",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.accentBlue||"#2A5ED8"}15`, border: `1px solid ${T.accentBlue||"#2A5ED8"}30`, display: "flex", alignItems: "center", justifyContent: "center", color: T.accentBlue||"#2A5ED8", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{isRTL ? "محادثة جديدة" : "New Chat"}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{isRTL ? "ابدأ محادثة مع مرن" : "Start a conversation"}</div>
                </div>
              </button>

              {/* المجموعات */}
              <button onClick={() => { onOpenGroups && onOpenGroups(); setShowAppMenu(false); }} style={{
                width: "100%", background: "transparent", border: "none",
                borderBottom: `1px solid ${T.line}`,
                padding: "13px 16px", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 12, color: T.text,
                textAlign: "right",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34D399", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="7" r="3"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{isRTL ? "المجموعات" : "Groups"}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{isRTL ? "رحلات، كشت، فعاليات" : "Trips, outings, events"}</div>
                </div>
              </button>

              {/* البحث الحي */}
              <button onClick={() => { setShowAppMenu(false); }} style={{
                width: "100%", background: "transparent", border: "none",
                padding: "13px 16px", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 12, color: T.text,
                textAlign: "right",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FBBF24", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{isRTL ? "بحث حي" : "Live Search"}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{isRTL ? "ابحث في الويب الآن" : "Search the web now"}</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
      </div>

      {/* التبويبات */}
      <div style={{ display: "flex", padding: "0 12px 12px", gap: 4 }}>
        {[
          { id: "chats", label: t.chats, icon: <Icon.Chat />, count: sortedChats.length },
          { id: "favs", label: t.favs, icon: <Icon.Star />, count: favs.length },
          { id: "settings", label: t.settings, icon: <Icon.Settings /> },
        ].map(tt => (
          <button key={tt.id} onClick={() => { if (tt.id === "groups") { onOpenGroups && onOpenGroups(); } else { setTab(tt.id); } }} style={{
            flex: 1,
            background: tab === tt.id ? T.pillActive : "transparent",
            color: tab === tt.id ? T.text : T.sub,
            border: "none", borderRadius: 9,
            padding: "8px 4px", fontSize: F.label, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            transition: "all .2s",
          }}>
            {tt.icon}
            <span>{tt.label}</span>
            {tt.count > 0 && <span style={{ opacity: 0.6, fontSize: F.label - 1 }}>({tt.count})</span>}
          </button>
        ))}
      </div>

      {/* المحتوى */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
        {tab === "chats" && (
          <>
            {Object.keys(sortedChats).length > 0 || chatSearch ? (
              <div style={{ padding: "0 4px 8px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: T.pillFill, border: `1px solid ${T.line}`,
                  borderRadius: 9, padding: "7px 10px",
                }}>
                  <Icon.Search2 />
                  <input
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    placeholder={isRTL ? "بحث في المحادثات..." : "Search chats..."}
                    style={{
                      flex: 1, background: "transparent", border: "none", outline: "none",
                      color: T.text, fontSize: F.base - 2, fontFamily: "inherit",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                  />
                  {chatSearch && (
                    <button onClick={() => setChatSearch("")} style={{
                      background: "transparent", border: "none", color: T.faint,
                      cursor: "pointer", padding: 2, display: "flex",
                    }}>
                      <Icon.Close />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
            {sortedChats.length === 0 ? (
              <EmptyTab T={T} F={F} text={chatSearch ? (isRTL ? "لا توجد نتائج" : "No results") : t.noChats} />
            ) : sortedChats.map(c => (
              <ChatItem key={c.id} c={c} T={T} F={F} isActive={activeChat === c.id}
                onOpen={() => openChat(c.id)} onDelete={() => deleteChat(c.id)}
                onRename={() => onRename(c.id)} lang={settings.lang} />
            ))}
          </>
        )}

        {tab === "favs" && (
          favs.length === 0 ? (
            <EmptyTab T={T} F={F} text={t.noFavs} hint={t.favHint} />
          ) : favs.map(f => (
            <div key={f.q} onClick={() => send(f.q)} style={{
              padding: "10px 12px", margin: "1px 0", borderRadius: 9,
              cursor: "pointer", fontSize: F.base - 1,
              display: "flex", alignItems: "center", gap: 8, transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.hover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ color: "#ffb800" }}>★</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.q}</span>
            </div>
          ))
        )}


        {tab === "settings" && (
          <SettingsPanel T={T} t={t} F={F}
            settings={settings} setSettings={setSettings}
            effectiveMode={effectiveMode}
            clearAllChats={clearAllChats} clearAllFavs={clearAllFavs}
            exportChats={exportChats}
            userProfile={userProfile} setUserProfile={setUserProfile}
            onEditProfile={onEditProfile}
            isRTL={isRTL}
          />
        )}
      </div>
    </aside>
  );
}

/* ============ عنصر المحادثة ============ */
function ChatItem({ c, T, F, isActive, onOpen, onDelete, onRename, lang }) {
  return (
    <div onClick={onOpen} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 12px", margin: "1px 0", borderRadius: 9, cursor: "pointer",
      background: isActive ? T.pillActive : "transparent", transition: "background .15s",
      borderRight: isActive ? `3px solid ${T.accentBlue||"#2A5ED8"}` : "3px solid transparent",
      gap: 4,
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.hover; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
      <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
        <div style={{ fontSize: F.base - 1.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {c.title}
        </div>
        <div style={{ fontSize: F.label - 1, color: T.faint, marginTop: 2 }}>
          {formatRelativeTime(c.createdAt, lang)}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onRename(); }} style={{
        background: "transparent", border: "none", color: T.faint,
        cursor: "pointer", padding: 4, borderRadius: 5,
        display: "flex", alignItems: "center", flexShrink: 0,
      }}>
        <Icon.Edit />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{
        background: "transparent", border: "none", color: T.faint,
        cursor: "pointer", padding: 4, borderRadius: 5,
        display: "flex", alignItems: "center", flexShrink: 0,
      }}>
        <Icon.Trash />
      </button>
    </div>
  );
}

/* ============ تبويب فارغ ============ */
function EmptyTab({ T, F, text, hint }) {
  return (
    <div style={{ textAlign: "center", color: T.faint, fontSize: F.base - 1.5, padding: "30px 16px" }}>
      {text}
      {hint && <><br/><span style={{ fontSize: F.label - 1, opacity: 0.7 }}>{hint}</span></>}
    </div>
  );
}

/* ============ لوحة الإعدادات ============ */
function SettingsPanel({ T, t, F, settings, setSettings, effectiveMode, clearAllChats, clearAllFavs, exportChats, userProfile, setUserProfile, onEditProfile, isRTL }) {
  const section = (label) => (
    <div style={{
      fontSize: F.label - 1, fontWeight: 700, color: T.faint,
      padding: "16px 8px 6px", textTransform: "uppercase", letterSpacing: 0.5,
    }}>{label}</div>
  );

  const setItem = (icon, label, control) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "11px 12px", borderRadius: 9,
    }}>
      <span style={{ color: T.sub, display: "flex" }}>{icon}</span>
      <span style={{ flex: 1, fontSize: F.base - 1, color: T.text }}>{label}</span>
      {control}
    </div>
  );

  const segmented = (value, options, onChange) => (
    <div style={{
      display: "flex", background: T.pillFill, borderRadius: 8, padding: 2,
      border: `1px solid ${T.line}`, gap: 1,
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          background: value === o.value ? T.pillActive : "transparent",
          color: value === o.value ? T.text : T.sub,
          border: "none", borderRadius: 6,
          padding: "5px 10px", fontSize: F.label - 0.5, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
          boxShadow: value === o.value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        }}>{o.label}</button>
      ))}
    </div>
  );

  const toggle = (value, onChange) => (
    <button onClick={() => onChange(!value)} style={{
      width: 42, height: 24, borderRadius: 12,
      background: value ? ACCENTS.knowledge : T.pillFill,
      border: "none", cursor: "pointer", position: "relative",
      transition: "background .2s", padding: 0,
    }}>
      <div style={{
        position: "absolute", top: 2, [value ? "left" : "right"]: 2,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "all .2s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );

  return (
    <div style={{ padding: "4px 4px 16px" }}>
      {/* الملف الشخصي */}
      {section(isRTL ? "ملفي الشخصي" : "My Profile")}
      <div style={{ padding:"10px 12px", borderRadius:9 }}>
        {(userProfile?.name || userProfile?.job || userProfile?.interests) ? (
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
            {userProfile.name && <div style={{ fontSize:F.base-0.5 }}>👤 {userProfile.name}</div>}
            {userProfile.job && <div style={{ fontSize:F.base-1, color:T.sub }}>💼 {userProfile.job}</div>}
            {userProfile.interests && <div style={{ fontSize:F.base-1, color:T.sub }}>⭐ {userProfile.interests}</div>}
          </div>
        ) : (
          <div style={{ fontSize:F.base-1, color:T.faint, marginBottom:8 }}>
            {isRTL ? "لم تضف ملفك الشخصي بعد" : "No profile added yet"}
          </div>
        )}
        <button onClick={onEditProfile} style={{ ...settingsBtnStyle(T, F), background:T.pillFill, borderRadius:9, padding:"8px 12px" }}>
          <Icon.User />
          <span>{isRTL ? "تعديل الملف الشخصي" : "Edit Profile"}</span>
        </button>
      </div>

      {section(t.appearance)}
      {setItem(<Icon.Sun />, t.appearance, segmented(settings.mode, [
        { value: "light", label: t.light },
        { value: "dark", label: t.dark },
        { value: "auto", label: t.auto },
      ], v => setSettings({ ...settings, mode: v })))}

      {setItem(<Icon.Type />, t.fontSize, segmented(settings.fontSize, [
        { value: "small", label: t.small },
        { value: "medium", label: t.medium },
        { value: "large", label: t.large },
      ], v => setSettings({ ...settings, fontSize: v })))}

      {section(t.language)}
      {setItem(<Icon.Globe />, t.language, segmented(settings.lang, [
        { value: "ar", label: "AR" },
        { value: "en", label: "EN" },
      ], v => setSettings({ ...settings, lang: v })))}

      {setItem(<Icon.Star />, t.showSuggestions,
        toggle(settings.showSuggestions, v => setSettings({ ...settings, showSuggestions: v })))}

      {section(t.data)}
      <button onClick={exportChats} style={settingsBtnStyle(T, F)}>
        <Icon.Download /><span>{t.exportChats}</span>
      </button>
      <button onClick={clearAllChats} style={{ ...settingsBtnStyle(T, F), color: "#ff453a" }}>
        <Icon.Trash /><span>{t.deleteAllChats}</span>
      </button>
      <button onClick={clearAllFavs} style={{ ...settingsBtnStyle(T, F), color: "#ff453a" }}>
        <Icon.Trash /><span>{t.deleteAllFavs}</span>
      </button>

      {section(t.about)}
      <div style={{ padding: "12px 12px", fontSize: F.label, color: T.sub, lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, color: T.text, fontSize: F.base, marginBottom: 4 }}>{t.appName}</div>
        <div>{t.tagline}</div>
        <div style={{ marginTop: 10, fontSize: F.label - 1, color: T.faint }}>
          {t.version} {VERSION}
        </div>
      </div>
    </div>
  );
}

/* ============ نافذة التأكيد ============ */
function ConfirmModal({ T, t, F, title, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, background: T.modalBg, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)", padding: 20, animation: "ci .2s",
    }}>
      <div onClick={e => e.stopPropagation()}>
        <Glass T={T} radius={18} style={{ padding: 24, maxWidth: 340, width: "100%" }}>
          <div style={{ fontSize: F.base + 1, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
            {title}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onCancel} style={{
              flex: 1, background: T.pillFill, color: T.text,
              border: "none", borderRadius: 11, padding: "11px",
              fontSize: F.base, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{t.cancel}</button>
            <button onClick={onConfirm} style={{
              flex: 1, background: "#ff453a", color: "#fff",
              border: "none", borderRadius: 11, padding: "11px",
              fontSize: F.base, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{t.delete}</button>
          </div>
        </Glass>
      </div>
    </div>
  );
}

/* ============ حالة فارغة ============ */
function EmptyState({ T, t, F, send, settings, userProfile }) {
  const name = userProfile?.name;
  return (
    <div style={{ textAlign: "center", padding: "40px 0 30px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, margin: "0 auto 20px",
        background: "linear-gradient(145deg,#0F2060,#2A5ED8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", padding: 6,
        boxShadow: "0 4px 20px rgba(15,32,96,0.4)",
      }}><img src={LOGO_LIGHT_SM} alt="مرن" style={{ width:"100%", height:"100%", objectFit:"contain" }}/></div>
      <h1 style={{ fontSize: F.h1 + 2, fontWeight: 700, margin: "0 0 10px", color: T.text, letterSpacing: "-0.5px" }}>
        {name ? (t.appName === "مرن" ? `أهلاً، ${name}` : `Hello, ${name}`) : t.tagline}
      </h1>
      <p style={{ fontSize: F.base, color: T.sub, margin: "0 0 32px", lineHeight: 1.7, maxWidth: 420, marginInline: "auto" }}>
        {t.askAnything}
      </p>
      {settings.showSuggestions && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 520, margin: "0 auto" }}>
          {t.suggestions.map(s => (
            <button key={s} onClick={() => send(s)} className="press"
              style={{
                background: T.pillFill, color: T.text,
                border: `1px solid ${T.line}`,
                borderRadius: 10, padding: "13px 16px",
                fontSize: F.base - 1, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                textAlign: "right", lineHeight: 1.5,
                transition: "all .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.hover}
              onMouseLeave={e => e.currentTarget.style.background = T.pillFill}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ عنصر الرسالة ============ */
function MessageItem({ m, idx, T, t, F, isRTL, lang, isFav, toggleFav, copyCard, activeChat,
  editingMsg, setEditingMsg, onEditSend, onRegenerate, onSelect, thinking }) {
  const timeStr = m.at ? formatTime(m.at, lang) : "";
  const isEditing = editingMsg && editingMsg.idx === idx;
  const [editDraft, setEditDraft] = useState(m.text || "");

  useEffect(() => {
    if (isEditing) setEditDraft(m.text || "");
  }, [isEditing, m.text]);

  if (m.role === "user") {
    if (isEditing) {
      return (
        <div style={{ marginBottom: 14 }}>
          <Glass T={T} radius={16} style={{ padding: "10px 12px" }}>
            <textarea
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              autoFocus
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (editDraft.trim()) onEditSend(editDraft);
                }
                if (e.key === "Escape") setEditingMsg(null);
              }}
              style={{
                width: "100%", background: "transparent", border: "none", outline: "none",
                color: T.text, fontSize: F.base, fontFamily: "inherit", resize: "none",
                direction: isRTL ? "rtl" : "ltr",
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
              <button onClick={() => setEditingMsg(null)} style={{
                background: "transparent", color: T.sub, border: `1px solid ${T.line}`,
                borderRadius: 8, padding: "6px 12px", fontSize: F.label, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>{t.cancel}</button>
              <button onClick={() => editDraft.trim() && onEditSend(editDraft)}
                disabled={!editDraft.trim()}
                style={{
                  background: ACCENTS.knowledge, color: "#fff", border: "none",
                  borderRadius: 8, padding: "6px 14px", fontSize: F.label, fontWeight: 600,
                  cursor: editDraft.trim() ? "pointer" : "default", fontFamily: "inherit",
                  opacity: editDraft.trim() ? 1 : 0.5,
                }}>{isRTL ? "إرسال" : "Send"}</button>
            </div>
          </Glass>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 14, alignItems: "flex-start", gap: 6 }}>
        <button onClick={toggleFav} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: isFav(m.text) ? "#ffb800" : T.faint, padding: 6, marginTop: 4,
        }}>
          <Icon.Star filled={isFav(m.text)} />
        </button>
        <button onClick={() => setEditingMsg({ idx })}
          disabled={thinking}
          title={isRTL ? "تعديل" : "Edit"}
          style={{
            background: "transparent", border: "none",
            cursor: thinking ? "default" : "pointer",
            color: T.faint, padding: 6, marginTop: 4, opacity: thinking ? 0.3 : 1,
          }}>
          <Icon.Edit />
        </button>
        <div>
          <div style={{
            background: T.userFill||"linear-gradient(135deg,#0F2060,#1E4BB8)", color: T.userText||"#fff",
            borderRadius: "16px 16px 4px 16px", padding: "10px 15px",
            fontSize: F.base, fontWeight: 400, maxWidth: "100%", lineHeight: 1.6,
            boxShadow: "none",
            wordBreak: "break-word",
          }}>{m.text}</div>
          {timeStr && <div style={{ fontSize: F.label - 1, color: T.faint, marginTop: 4, textAlign: "right" }}>{timeStr}</div>}
        </div>
      </div>
    );
  }

  if (m.role === "error") {
    return (
      <div style={{ marginBottom: 18 }}>
        <Glass T={T} radius={14} style={{ padding: "12px 16px" }}>
          <span style={{ color: "#ff453a", fontSize: F.base - 1 }}>{m.text}</span>
        </Glass>
        {timeStr && <div style={{ fontSize: F.label - 1, color: T.faint, marginTop: 4 }}>{timeStr}</div>}
      </div>
    );
  }

  return (
    <div className="card-in" style={{ marginBottom: 20 }}>
      <BigCard card={m.card} T={T} t={t} F={F} searched={m.searched}
        onCopy={() => copyCard(m.card)}
        onRegenerate={thinking ? null : onRegenerate}
        isRTL={isRTL}
      />
      <FollowUps suggestions={m.followUps} T={T} F={F}
        onSelect={onSelect} thinking={thinking} />
      {timeStr && <div style={{ fontSize: F.label - 1, color: T.faint, marginTop: 4 }}>{timeStr}</div>}
    </div>
  );
}

/* ============ البطاقة الكبيرة ============ */
function BigCard({ card, T, t, F, searched, onCopy, onRegenerate, isRTL }) {
  const a = ACCENTS[card.accent] || ACCENTS.knowledge;
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(card.tabs) ? card.tabs : [];
  const active = tabs[activeTab] || {};

  return (
    <Glass T={T} radius={14} style={{ padding: 0, overflow: "hidden" }}>
      {/* شريط هوية Clean Navy */}
      <div style={{ height: 3, background: "linear-gradient(90deg,#0F2060,#2A5ED8,#7BB3FF)" }}/>
      <div style={{ padding: 20 }}>

      {/* الهيدر */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            {card.kicker && <div style={{ color: T.accentBlue||"#2A5ED8", fontSize: F.label - 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{card.kicker}</div>}
            {searched && (
              <div style={{
                fontSize: F.label - 1, fontWeight: 600, color: "#34D399",
                background: "rgba(52,211,153,0.1)", padding: "2px 8px",
                borderRadius: 6, border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", gap: 4,
              }}>
                <Icon.Search /> {t.liveSearch}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {onRegenerate && (
              <button onClick={onRegenerate} title={isRTL ? "إعادة توليد" : "Regenerate"} style={cardActionBtn(T)}>
                <Icon.Refresh />
              </button>
            )}
            <button onClick={onCopy} title={t.copy} style={cardActionBtn(T)}>
              <Icon.Copy />
            </button>
          </div>
        </div>
        <h2 style={{ fontSize: F.h2, fontWeight: 700, margin: 0, letterSpacing: "-0.4px", lineHeight: 1.3 }}>{card.title}</h2>
        {card.sub && <div style={{ color: T.sub, fontSize: F.base - 1, marginTop: 5, lineHeight: 1.5 }}>{card.sub}</div>}
      </div>

      {tabs.length > 1 && (
        <div style={{
          display: "flex", gap: 0,
          borderBottom: `1px solid ${T.line}`,
          marginBottom: 16, overflowX: "auto",
        }}>
          {tabs.map((tt, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${i === activeTab ? T.accentBlue||T.blue : "transparent"}`,
              padding: "8px 14px",
              color: i === activeTab ? T.text : T.sub,
              fontSize: F.label + 0.5, fontWeight: i === activeTab ? 600 : 400,
              cursor: "pointer", fontFamily: "inherit",
              transition: "all .15s", whiteSpace: "nowrap",
              marginBottom: -1,
            }}>{tt.label}</button>
          ))}
        </div>
      )}

      <div key={activeTab} className="tab-in">
        <TabContent tab={active} a={a} T={T} F={F} />
      </div>
          </div>
    </Glass>
  );
}

/* ============ محتوى التبويب — 35 نوع ============ */

// --- مكونات مساعدة داخلية ---
function IBar({ v, max=100, color, label, right, T }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, color:T.sub }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:700, color }}>{right||v+(max===100?"/100":"")}</span>
      </div>
      <div style={{ height:4, background:T.line, borderRadius:2 }}>
        <div style={{ height:"100%", width:`${Math.min((v/max)*100,100)}%`, background:color||`linear-gradient(90deg,${T.navy||"#0F2060"},${T.blue||"#2A5ED8"})`, borderRadius:2 }}/>
      </div>
    </div>
  );
}

function ITile({ icon, label, value, color, T }) {
  return (
    <div style={{ background:T.pillFill, border:`1px solid ${T.line}`, borderRadius:12, padding:"12px 8px", textAlign:"center" }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:15, fontWeight:800, color:color||T.text }}>{value}</div>
      <div style={{ fontSize:10, color:T.faint, marginTop:2 }}>{label}</div>
    </div>
  );
}

function ITag({ text, color }) {
  return (
    <span style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:`${color}12`, border:`1px solid ${color}22`, color, fontWeight:500, whiteSpace:"nowrap" }}>{text}</span>
  );
}

// أيقونات مدمجة خفيفة
const Si = {
  up: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  dn: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  star: (f,c) => <svg width="12" height="12" viewBox="0 0 24 24" fill={f?c:"none"} stroke={c} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  dot: (c) => <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0, boxShadow:`0 0 6px ${c}` }}/>,
  pin: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  zap: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  shield: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  plane: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>,
  clock: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  dollar: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  users: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  music: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  book: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  film: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  cpu: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="6" height="6"/><rect x="4" y="4" width="16" height="16" rx="2"/></svg>,
  activity: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  globe: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  award: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  home: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  car: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  eye: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c||"currentColor"} strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

function TabContent({ tab, a, T, F }) {
  const d = tab.data || {};
  const ACCS = { sport:"#34c759", knowledge:"#0a84ff", history:"#bf5af2", food:"#ff9f0a", health:"#ff6b6b", weather:"#64d2ff", finance:"#30d158", tech:"#0a84ff", travel:"#ff9f0a" };

  switch (tab.type) {

    // ========== البطاقات الأصلية ==========

    case "stats":
      return (
        <div>
          {d.intro && <p style={{ color:T.sub, fontSize:F.base-1, margin:"0 0 14px", lineHeight:1.6 }}>{d.intro}</p>}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(100px,1fr))", gap:10 }}>
            {(d.items||[]).map((s,i) => (
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"12px 10px", border:`1px solid ${T.line}`, textAlign:"center" }}>
                <div style={{ color:a, fontSize:F.h2, fontWeight:800, lineHeight:1.1, marginBottom:3 }}>{s.value}</div>
                <div style={{ fontSize:F.label, fontWeight:600, marginBottom:2 }}>{s.label}</div>
                {s.hint && <div style={{ fontSize:F.label-1, color:T.sub }}>{s.hint}</div>}
                <div style={{ height:3, background:T.line, borderRadius:2, marginTop:6 }}>
                  <div style={{ height:"100%", width:"70%", background:a, borderRadius:2 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "steps":
      return (
        <div>
          {d.intro && <p style={{ color:T.sub, fontSize:F.base-1, margin:"0 0 12px", lineHeight:1.6 }}>{d.intro}</p>}
          {(d.steps||[]).map((s,i,arr) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:i===arr.length-1?"none":`1px solid ${T.line}` }}>
              <div style={{ flexShrink:0, width:26, height:26, borderRadius:7, background:`${a}18`, color:a, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:F.label+1 }}>{i+1}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:F.base-0.5, marginBottom:3 }}>{s.t}</div>
                {s.d && <div style={{ color:T.sub, fontSize:F.base-1.5, lineHeight:1.6 }}>{s.d}</div>}
              </div>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <div>
          {d.intro && <p style={{ color:T.sub, fontSize:F.base-1, margin:"0 0 12px", lineHeight:1.6 }}>{d.intro}</p>}
          {(d.items||[]).map((x,i,arr) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:i===arr.length-1?"none":`1px solid ${T.line}`, fontSize:F.base-0.5, lineHeight:1.6 }}>
              <span style={{ color:a, fontSize:16, lineHeight:1, marginTop:2, flexShrink:0 }}>•</span>
              <span>{typeof x==="string"?x:(x.text||JSON.stringify(x))}</span>
            </div>
          ))}
        </div>
      );

    case "timeline":
      return (
        <div style={{ position:"relative", paddingRight:20 }}>
          <div style={{ position:"absolute", right:5, top:6, bottom:6, width:2, background:`linear-gradient(180deg,${a},transparent)`, borderRadius:2 }}/>
          {(d.events||[]).map((e,i,arr) => (
            <div key={i} style={{ position:"relative", marginBottom:i===arr.length-1?0:18 }}>
              <div style={{ position:"absolute", right:-19, top:4, width:10, height:10, borderRadius:"50%", background:a, border:`2px solid ${T.cardBg||T.glassFill}`, boxShadow:`0 0 8px ${a}80` }}/>
              <div style={{ color:a, fontWeight:700, fontSize:F.base-1.5 }}>{e[0]}</div>
              <div style={{ fontWeight:600, fontSize:F.base-0.5, margin:"2px 0" }}>{e[1]}</div>
              {e[2] && <div style={{ color:T.sub, fontSize:F.base-1.5, lineHeight:1.6 }}>{e[2]}</div>}
            </div>
          ))}
        </div>
      );

    case "compare":
      return (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:F.base-1, minWidth:260 }}>
            <thead><tr>{(d.cols||[]).map((c,i) => <th key={i} style={{ textAlign:"right", padding:"8px 10px", color:i===0?T.sub:a, fontWeight:700, fontSize:F.label }}>{c}</th>)}</tr></thead>
            <tbody>{(d.rows||[]).map((row,ri) => <tr key={ri}>{row.map((cell,ci) => <td key={ci} style={{ padding:"11px 10px", color:ci===0?T.text:T.sub, fontWeight:ci===0?600:400, borderTop:`1px solid ${T.line}` }}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );

    case "facts":
      return (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:8 }}>
          {(d.items||[]).map((f,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9, padding:"10px 12px", borderRadius:10, background:T.pillFill, border:`1px solid ${T.line}`, fontSize:F.base-1 }}>
              {f.icon && <span style={{ fontSize:16, flexShrink:0 }}>{f.icon}</span>}
              <span style={{ flex:1 }}>{f.text}</span>
            </div>
          ))}
        </div>
      );

    // ========== بطاقات رياضية ==========

    case "match":
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 0 14px" }}>
            <div style={{ textAlign:"center", flex:1 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:T.pillFill, border:`1px solid ${T.line}`, margin:"0 auto 8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:T.text }}>{(d.team1||"?")[0]}</div>
              <div style={{ fontSize:F.base, fontWeight:700 }}>{d.team1}</div>
            </div>
            <div style={{ textAlign:"center", padding:"0 8px", minWidth:110 }}>
              <div style={{ fontSize:44, fontWeight:700, color:T.text, letterSpacing:3, lineHeight:1 }}>
                {d.score1!=null?d.score1:"–"}<span style={{ color:T.line, fontWeight:300 }}>:</span>{d.score2!=null?d.score2:"–"}
              </div>
              <div style={{ marginTop:6 }}>
                <span style={{ fontSize:11, color:T.sub, background:T.pillFill, padding:"3px 10px", borderRadius:20, border:`1px solid ${T.line}` }}>{d.status}</span>
              </div>
              {d.date && <div style={{ fontSize:10, color:T.faint, marginTop:5 }}>{d.date}</div>}
            </div>
            <div style={{ textAlign:"center", flex:1, opacity:0.5 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:T.pillFill, border:`1px solid ${T.line}`, margin:"0 auto 8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:T.sub }}>{(d.team2||"?")[0]}</div>
              <div style={{ fontSize:F.base, fontWeight:700, color:T.sub }}>{d.team2}</div>
            </div>
          </div>
          {d.venue && <div style={{ textAlign:"center", fontSize:11, color:T.faint, paddingBottom:12, borderBottom:`1px solid ${T.line}`, marginBottom:12 }}>📍 {d.venue}</div>}
          {(d.details||[]).map((dt,i,arr) => {
            const hasNums = dt.v1!=null && dt.v2!=null;
            const total = hasNums ? (dt.v1+dt.v2)||1 : 1;
            const p1 = hasNums ? Math.round((dt.v1/total)*100) : 50;
            return hasNums ? (
              <div key={i} style={{ marginBottom: i<arr.length-1?10:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4, fontWeight:600 }}>
                  <span style={{ color:T.text }}>{dt.v1}{dt.unit||""}</span>
                  <span style={{ color:T.faint, fontWeight:400, fontSize:11 }}>{dt.label}</span>
                  <span style={{ color:T.sub }}>{dt.v2}{dt.unit||""}</span>
                </div>
                <div style={{ height:4, background:T.line, borderRadius:2, display:"flex", overflow:"hidden" }}>
                  <div style={{ width:`${p1}%`, background:T.text, borderRadius:2 }}/>
                  <div style={{ flex:1, background:T.pillFill }}/>
                </div>
              </div>
            ) : (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.line}`, fontSize:F.base-1 }}>
                <span style={{ color:T.sub }}>{dt.label}</span>
                <span style={{ fontWeight:600 }}>{dt.value}</span>
              </div>
            );
          })}
        </div>
      );

    case "standings":
      return (
        <div>
          {d.league && <div style={{ fontSize:F.label, color:T.sub, marginBottom:10 }}>{d.league}</div>}
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:F.base-1.5 }}>
            <thead><tr style={{ borderBottom:`2px solid ${T.line}` }}>
              {["#","النادي","ف","ت","خ","ن"].map((h,i) => <th key={i} style={{ padding:"6px 8px", textAlign:i<=1?"right":"center", color:T.faint, fontWeight:600, fontSize:F.label-1 }}>{h}</th>)}
            </tr></thead>
            <tbody>{(d.rows||[]).map((r,i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${T.line}` }}>
                <td style={{ padding:"10px 8px", color:i<3?a:T.faint, fontWeight:700 }}>{r.pos}</td>
                <td style={{ padding:"10px 8px", fontWeight:i===0?700:500 }}>{r.team}</td>
                <td style={{ padding:"10px 8px", textAlign:"center", color:"#34c759" }}>{r.w}</td>
                <td style={{ padding:"10px 8px", textAlign:"center", color:T.sub }}>{r.d}</td>
                <td style={{ padding:"10px 8px", textAlign:"center", color:"#ff453a" }}>{r.l}</td>
                <td style={{ padding:"10px 8px", textAlign:"center", color:a, fontWeight:800 }}>{r.pts}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      );

    case "lineup":
      return (
        <div>
          {d.team && <div style={{ fontSize:F.label, color:T.sub, marginBottom:10 }}>{d.team} • {d.formation}</div>}
          {(d.players||[]).map((p,i,arr) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i===arr.length-1?"none":`1px solid ${T.line}` }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:`${a}18`, color:a, display:"flex", alignItems:"center", justifyContent:"center", fontSize:F.label-1, fontWeight:700, flexShrink:0 }}>{p.number}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:F.base-0.5 }}>{p.name}</div>
                <div style={{ fontSize:F.label-1, color:T.sub }}>{p.position}</div>
              </div>
              {p.rating && (
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:F.label, fontWeight:700, color:p.rating>=8.5?"#34c759":p.rating>=7.5?a:T.sub }}>{p.rating}</div>
                  <div style={{ width:40, height:3, background:T.line, borderRadius:2, marginTop:3 }}>
                    <div style={{ height:"100%", width:`${((p.rating-6)/4)*100}%`, background:p.rating>=8.5?"#34c759":a, borderRadius:2 }}/>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "player_profile":
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14, padding:"12px", background:T.pillFill, borderRadius:12, border:`1px solid ${T.line}` }}>
            <div style={{ width:54, height:54, borderRadius:15, background:`${a}18`, border:`2px solid ${a}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:a, flexShrink:0 }}>{(d.name||"?").charAt(0)}</div>
            <div>
              <div style={{ fontSize:F.base+2, fontWeight:700 }}>{d.name}</div>
              <div style={{ fontSize:F.base-1, color:T.sub, marginTop:2 }}>{d.club} • {d.nationality}</div>
              <div style={{ fontSize:F.label, color:a, fontWeight:600, marginTop:2 }}>{d.position}</div>
            </div>
          </div>
          {(d.stats||[]).map((s,i,arr) => (
            <div key={i} style={{ marginBottom:i<arr.length-1?10:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:F.base-1, color:T.sub }}>{s.label}</span>
                <span style={{ fontSize:F.base, fontWeight:800, color:a }}>{s.value}</span>
              </div>
              <div style={{ height:4, background:T.line, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${Math.min(parseInt(s.value)||50,100)}%`, background:a, borderRadius:2 }}/>
              </div>
            </div>
          ))}
        </div>
      );

    // ========== الطقس ==========

    case "weather":
      const isDark = T.pageBg === "#0f0f11" || T.pageBg === "#111111" || T.pageBg === "#000000";
      const skyGrad = isDark
        ? "linear-gradient(175deg, #0f2744 0%, #1a3a5c 50%, #0d1f35 100%)"
        : "linear-gradient(175deg, #1a6bb5 0%, #2e86de 50%, #54a0e0 100%)";
      const weatherIcon = d.icon || (d.condition?.includes("غيم") || d.condition?.includes("cloud") ? "⛅" : d.condition?.includes("مطر") || d.condition?.includes("rain") ? "🌧" : "☀️");
      return (
        <div style={{ margin:"-14px -20px -16px", overflow:"hidden", borderRadius:"0 0 12px 12px" }}>
          {/* Hero الطقس */}
          <div style={{ background: skyGrad, padding:"28px 24px 22px", color:"#fff", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
            <div style={{ position:"absolute", bottom:-30, left:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.03)" }}/>
            <div style={{ position:"relative" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  {d.city && <div style={{ fontSize:13, opacity:0.75, fontWeight:500, marginBottom:4 }}>{d.city}</div>}
                  <div style={{ fontSize:72, fontWeight:200, lineHeight:1, letterSpacing:-3 }}>{d.temp}°</div>
                  <div style={{ fontSize:17, fontWeight:500, marginTop:6, opacity:0.9 }}>{d.condition}</div>
                  {d.feels_like && <div style={{ fontSize:13, opacity:0.65, marginTop:3 }}>يحس بـ {d.feels_like}°</div>}
                  {(d.high || d.low) && <div style={{ fontSize:13, opacity:0.65, marginTop:2 }}>
                    {d.high && `أعلى ${d.high}°`}{d.high && d.low && " • "}{d.low && `أدنى ${d.low}°`}
                  </div>}
                </div>
                <div style={{ fontSize:64, opacity:0.9, lineHeight:1 }}>{weatherIcon}</div>
              </div>
            </div>
          </div>
          {/* التوقعات الساعية */}
          {d.forecast && d.forecast.length > 0 && (
            <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)", backdropFilter:"blur(10px)", borderTop:"0.5px solid rgba(255,255,255,0.1)", padding:"12px 4px" }}>
              <div style={{ display:"flex", justifyContent:"space-around" }}>
                {d.forecast.map((f,i) => (
                  <div key={i} style={{ textAlign:"center", flex:1 }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:500 }}>{f.day}</div>
                    <div style={{ fontSize:22, margin:"6px 0" }}>{f.icon || "☀️"}</div>
                    <div style={{ fontSize:15, fontWeight:600, color:"#fff" }}>{f.high}°</div>
                    {f.low != null && <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:1 }}>{f.low}°</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* تفاصيل */}
          <div style={{ background: T.cardBg, padding:"16px 20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                d.humidity != null && { label:"الرطوبة", value:`${d.humidity}%`, icon:"💧" },
                d.wind != null && { label:"الرياح", value:`${d.wind} كم/س`, icon:"💨" },
                d.uv != null && { label:"مؤشر UV", value:`${d.uv}`, icon:"☀️" },
                d.visibility != null && { label:"الرؤية", value:`${d.visibility} كم`, icon:"👁" },
              ].filter(Boolean).map((item,i) => (
                <div key={i} style={{ background: T.pillFill, borderRadius:12, padding:"12px 14px", border:`1px solid ${T.line}` }}>
                  <div style={{ fontSize:11, color:T.faint, display:"flex", alignItems:"center", gap:5, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>
                    <span>{item.icon}</span>{item.label}
                  </div>
                  <div style={{ fontSize:22, fontWeight:600, color:T.text }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    // ========== مالي ==========

    case "stock": {
      const isUp_s = (d.change_pct||0) >= 0;
      const lineColor_s = isUp_s ? "#30d158" : "#ff453a";
      const pts_s = d.chart_points && d.chart_points.length > 1 ? d.chart_points : [27,28,27.5,29,28,30,29,31,30,32,d.price||30];
      const maxP_s = Math.max(...pts_s), minP_s = Math.min(...pts_s);
      const W_s=320, H_s=72;
      const pPath_s = pts_s.map((p,i)=>`${i===0?"M":"L"} ${(i/(pts_s.length-1))*W_s} ${H_s-((p-minP_s)/(maxP_s-minP_s||1))*H_s}`).join(" ");
      const aPath_s = pPath_s + ` L ${W_s} ${H_s} L 0 ${H_s} Z`;
      const gradId_s = "sg" + Math.random().toString(36).slice(2,6);
      return (
        <div>
          {/* الرقم الرئيسي */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"4px 0 12px" }}>
            <div>
              <div style={{ fontSize:12, color:T.faint, marginBottom:4 }}>{d.symbol} • {d.name}</div>
              <div style={{ fontSize:44, fontWeight:700, color:T.text, lineHeight:1, letterSpacing:-1 }}>{d.price}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                <span style={{ fontSize:15, fontWeight:600, color:lineColor_s }}>
                  {isUp_s?"+":""}{d.change} ({isUp_s?"+":""}{d.change_pct}%)
                </span>
                <span style={{ fontSize:11, color:T.faint }}>اليوم</span>
              </div>
            </div>
            <div style={{ background: isUp_s?"rgba(48,209,88,0.1)":"rgba(255,69,58,0.1)", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:700, color:lineColor_s }}>{isUp_s?"▲":"▼"}</div>
              <div style={{ fontSize:11, color:T.faint, marginTop:2 }}>{isUp_s?"صاعد":"هابط"}</div>
            </div>
          </div>
          {/* رسم بياني */}
          <div style={{ margin:"0 -20px", background:T.pillFill, padding:"8px 0 4px" }}>
            <svg width="100%" height={H_s} viewBox={`0 0 ${W_s} ${H_s}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id={gradId_s} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor_s} stopOpacity="0.2"/>
                  <stop offset="100%" stopColor={lineColor_s} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={aPath_s} fill={`url(#${gradId_s})`}/>
              <path d={pPath_s} fill="none" stroke={lineColor_s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* بيانات */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
            {[
              ["أعلى", d.high], ["أدنى", d.low],
              ["الحجم", d.volume], ["الإغلاق السابق", d.prev_close||d.low],
            ].filter(([,v])=>v!=null).map(([l,v],i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 12px", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:11, color:T.faint }}>{l}</div>
                <div style={{ fontSize:F.base, fontWeight:600, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "crypto":
      const cupCrypto = (d.change_pct||0) >= 0;
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:F.base+1, fontWeight:700 }}>{d.name}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.symbol}</div>
            </div>
            <div>
              <div style={{ fontSize:F.h1+2, fontWeight:900 }}>${Number(d.price||0).toLocaleString()}</div>
              <div style={{ fontSize:F.base-1, color:cupCrypto?"#34c759":"#ff453a", display:"flex", alignItems:"center", gap:4 }}>
                {cupCrypto?Si.up:Si.dn} {Math.abs(d.change_pct||0)}%
              </div>
            </div>
          </div>
          {[["القيمة السوقية",d.market_cap],["حجم التداول",d.volume],["المعروض",d.supply]].filter(x=>x[1]).map(([l,v],i,arr)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
              <span style={{ color:T.sub }}>{l}</span>
              <span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      );

    // ========== صحة ==========

    case "symptoms":
      return (
        <div>
          {d.severity && <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, marginBottom:12, background:"rgba(255,149,0,0.1)", color:"#ff9500", fontSize:F.label, fontWeight:600 }}>
            {Si.shield("#ff9500")} {d.severity}
          </div>}
          {d.symptoms?.length>0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {d.symptoms.map((s,i) => <ITag key={i} text={s} color="#ff6b6b"/>)}
            </div>
          )}
          {d.causes?.length>0 && (
            <div style={{ background:T.pillFill, borderRadius:10, padding:"10px 12px", marginBottom:12, border:`1px solid ${T.line}` }}>
              <div style={{ fontSize:F.label, color:T.faint, marginBottom:8, fontWeight:600 }}>الأسباب المحتملة</div>
              {d.causes.map((c,i,arr) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
                  <span style={{ color:T.sub }}>{c}</span>
                </div>
              ))}
            </div>
          )}
          {d.remedies?.length>0 && d.remedies.map((r,i,arr)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:i===arr.length-1?"none":`1px solid ${T.line}` }}>
              <div style={{ flexShrink:0, width:24, height:24, borderRadius:7, background:"rgba(255,107,107,0.1)", color:"#ff6b6b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:F.label-1, fontWeight:700 }}>{i+1}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:F.base-0.5 }}>{r.t}</div>
                {r.d && <div style={{ color:T.sub, fontSize:F.base-2, lineHeight:1.5 }}>{r.d}</div>}
              </div>
            </div>
          ))}
          {d.warning && <div style={{ display:"flex", gap:8, padding:"10px 12px", background:"rgba(255,69,58,0.08)", borderRadius:9, marginTop:10, fontSize:F.base-2, color:"#ff453a", alignItems:"flex-start" }}>
            {Si.shield("#ff453a")}<span>{d.warning}</span>
          </div>}
        </div>
      );

    case "nutrition":
      return (
        <div>
          {d.food && <div style={{ fontSize:F.base+1, fontWeight:700, marginBottom:4 }}>{d.food}</div>}
          {d.per100g && <div style={{ fontSize:F.label-1, color:T.faint, marginBottom:12 }}>لكل 100 جرام</div>}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
            {[["سعرات",d.calories,"#ff9f0a"],["بروتين",`${d.protein}g`,"#0a84ff"],["كارب",`${d.carbs}g`,"#ff9f0a"],["دهون",`${d.fat}g`,"#bf5af2"]].map(([l,v,c],i)=>(
              <div key={i} style={{ textAlign:"center", padding:"10px 6px", background:T.pillFill, borderRadius:9, border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:700, color:c }}>{v}</div>
                <div style={{ fontSize:F.label-2, color:T.faint, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          {d.vitamins?.length>0 && d.vitamins.map((v,i,arr)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
              <span style={{ color:T.sub }}>{v.name}</span>
              <span style={{ fontWeight:600 }}>{v.amount}</span>
            </div>
          ))}
        </div>
      );

    // ========== طبخ ==========

    case "recipe":
      return (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {[["وقت",d.time,"#ff9f0a"],["أشخاص",d.servings&&`${d.servings}`,"#0a84ff"],["صعوبة",d.difficulty,"#bf5af2"]].filter(x=>x[1]).map(([l,v,c],i)=>(
              <div key={i} style={{ flex:1, textAlign:"center", padding:"8px", background:T.pillFill, borderRadius:9, border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:700, color:c }}>{v}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          {d.ingredients?.length>0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:F.label, color:T.faint, marginBottom:8, fontWeight:600 }}>المقادير</div>
              {d.ingredients.map((ing,i,arr)=>(
                <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
                  <span style={{ color:a, fontWeight:600, minWidth:55 }}>{ing.amount}</span>
                  <span style={{ color:T.sub }}>{ing.item}</span>
                </div>
              ))}
            </div>
          )}
          {d.steps?.length>0 && d.steps.map((s,i,arr)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
              <div style={{ flexShrink:0, width:22, height:22, borderRadius:6, background:`${a}18`, color:a, display:"flex", alignItems:"center", justifyContent:"center", fontSize:F.label-1, fontWeight:700 }}>{i+1}</div>
              <div style={{ fontSize:F.base-1, lineHeight:1.6, color:T.sub }}>{s}</div>
            </div>
          ))}
        </div>
      );

    // ========== تقنية ==========

    case "tech_compare":
      return (
        <div>
          {(d.items||[]).map((item,i)=>(
            <div key={i} style={{ marginBottom:i===d.items.length-1?0:16 }}>
              <div style={{ fontSize:F.base, fontWeight:700, marginBottom:8, color:a }}>{item.name}</div>
              {(item.specs||[]).map((s,j,arr)=>(
                <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:j<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
                  <span style={{ color:T.sub }}>{s.label}</span>
                  <span style={{ fontWeight:s.winner?700:400, color:s.winner?a:T.text }}>{s.value}{s.winner?" ✓":""}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case "app_card":
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:F.base+1, fontWeight:700 }}>{d.name}</div>
              <div style={{ fontSize:F.label, color:T.sub }}>{d.category}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:F.base, fontWeight:700, color:a }}>{d.price||"مجاني"}</div>
              {d.rating && <div style={{ fontSize:F.label, display:"flex", alignItems:"center", gap:2 }}>{Si.star(true,"#ffd60a")} {d.rating}</div>}
            </div>
          </div>
          {d.features?.length>0 && d.features.map((f,i,arr)=>(
            <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
              {Si.zap("#34c759")}<span style={{ color:T.sub }}>{f}</span>
            </div>
          ))}
          {d.platforms && <div style={{ display:"flex", gap:6, marginTop:10 }}>
            {d.platforms.map((p,i)=><ITag key={i} text={p} color={a}/>)}
          </div>}
        </div>
      );

    // ========== سفر ==========

    case "destination":
      return (
        <div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
            {d.currency && <ITag text={d.currency} color="#ff9f0a"/>}
            {d.language && <ITag text={d.language} color="#bf5af2"/>}
            {d.best_time && <ITag text={d.best_time} color="#0a84ff"/>}
          </div>
          {d.attractions?.length>0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:F.label, color:T.faint, marginBottom:8, fontWeight:600 }}>أبرز المعالم</div>
              {d.attractions.map((att,i,arr)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
                  <div style={{ display:"flex" }}>{Si.pin(a)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:F.base-0.5, fontWeight:500 }}>{att.name}</div>
                    <div style={{ fontSize:F.label-1, color:T.sub }}>{att.type}</div>
                  </div>
                  {att.rating && <div style={{ display:"flex", alignItems:"center", gap:2 }}>{Si.star(true,"#ffd60a")}<span style={{ fontSize:F.label, color:"#ffd60a", fontWeight:700 }}>{att.rating}</span></div>}
                </div>
              ))}
            </div>
          )}
          {d.tips?.length>0 && d.tips.map((t,i)=>(
            <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", fontSize:F.base-1 }}>
              {Si.zap(a)}<span style={{ color:T.sub }}>{t}</span>
            </div>
          ))}
        </div>
      );

    case "flight":
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 0 14px", borderBottom:`1px solid ${T.line}` }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:F.h1+4, fontWeight:900 }}>{d.from?.split(" ")[0]}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.from}</div>
            </div>
            <div style={{ flex:1, textAlign:"center", padding:"0 10px" }}>
              <div style={{ fontSize:F.label-1, color:T.faint, marginBottom:4 }}>{d.duration}</div>
              <div style={{ height:1, background:`linear-gradient(90deg,${a},transparent)`, position:"relative" }}>
                <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>{Si.plane(a)}</div>
              </div>
              <div style={{ fontSize:F.label-1, color:"#34c759", marginTop:4 }}>مباشرة</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:F.h1+4, fontWeight:900 }}>{d.to?.split(" ")[0]}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.to}</div>
            </div>
          </div>
          {d.airlines?.length>0 && d.airlines.map((al,i,arr)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
              <span style={{ fontWeight:500 }}>{al.name}</span>
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ color:T.sub }}>{al.stops===0?"مباشر":`${al.stops} توقف`}</span>
                <span style={{ fontWeight:700, color:a }}>{al.price}</span>
              </div>
            </div>
          ))}
        </div>
      );

    // ========== بطاقات جديدة ==========

    case "real_estate":
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, padding:"14px", background:T.pillFill, borderRadius:13, border:`1px solid ${T.line}` }}>
            <div>
              <div style={{ fontSize:F.h1+4, fontWeight:900, color:a }}>{d.price}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.currency||"ريال سعودي"}</div>
            </div>
            {d.rent && <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:F.base, color:T.sub }}>الإيجار السنوي</div>
              <div style={{ fontSize:F.base+2, fontWeight:700, color:"#34c759" }}>{d.rent}</div>
              {d.yield && <div style={{ fontSize:F.label-1, color:T.faint }}>عائد {d.yield}</div>}
            </div>}
          </div>
          {d.specs && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            {Object.entries(d.specs).map(([k,v],i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 12px", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.label-1, color:T.faint }}>{k}</div>
                <div style={{ fontSize:F.base, fontWeight:700, color:a, marginTop:3 }}>{v}</div>
              </div>
            ))}
          </div>}
          {d.ratings && d.ratings.map((r,i)=><IBar key={i} v={r.v} color={r.color||a} label={r.label} T={T}/>)}
        </div>
      );

    case "job":
      return (
        <div>
          {d.tags && <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>{d.tags.map((t,i)=><ITag key={i} text={t} color={a}/>)}</div>}
          {d.skills?.length>0 && (
            <div style={{ background:T.pillFill, borderRadius:12, padding:"12px 14px", marginBottom:12, border:`1px solid ${T.line}` }}>
              <div style={{ fontSize:F.label, color:T.faint, marginBottom:10, fontWeight:600 }}>المهارات المطلوبة</div>
              {d.skills.map((s,i,arr)=>(
                <div key={i} style={{ marginBottom:i<arr.length-1?10:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:F.base-1, color:T.sub }}>{s.name}</span>
                    <span style={{ fontSize:F.base-1, fontWeight:700, color:a }}>{s.pct}%</span>
                  </div>
                  <div style={{ height:4, background:T.line, borderRadius:2 }}>
                    <div style={{ height:"100%", width:`${s.pct}%`, background:a, borderRadius:2 }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
          {d.stats && d.stats.map((s,i,arr)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none", fontSize:F.base-1 }}>
              <span style={{ color:T.sub }}>{s.label}</span>
              <span style={{ fontWeight:700, color:s.color||a }}>{s.value}</span>
            </div>
          ))}
        </div>
      );

    case "car":
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, padding:"14px", background:T.pillFill, borderRadius:13, border:`1px solid ${T.line}` }}>
            <div>
              <div style={{ fontSize:F.h1+4, fontWeight:900 }}>{d.price}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.currency||"ريال"}</div>
            </div>
            {d.tags && <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {d.tags.map((t,i)=><ITag key={i} text={t} color={a}/>)}
            </div>}
          </div>
          {d.specs && <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {Object.entries(d.specs).map(([k,v],i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 8px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:700, color:a }}>{v}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{k}</div>
              </div>
            ))}
          </div>}
          {d.ratings && d.ratings.map((r,i)=><IBar key={i} v={r.v} color={r.color||a} label={r.label} T={T}/>)}
        </div>
      );

    case "book_review":
      return (
        <div>
          {d.genres && <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>{d.genres.map((g,i)=><ITag key={i} text={g} color={a}/>)}</div>}
          {d.rating && <div style={{ display:"flex", gap:2, alignItems:"center", marginBottom:12 }}>
            {[1,2,3,4,5].map(i=><span key={i}>{Si.star(i<=Math.round(d.rating),"#ffd60a")}</span>)}
            <span style={{ fontSize:F.base-1, color:"#ffd60a", fontWeight:700, marginRight:6 }}>{d.rating}/5</span>
            {d.reviews && <span style={{ fontSize:F.label-1, color:T.faint }}>من {d.reviews} تقييم</span>}
          </div>}
          {d.aspects && d.aspects.map((asp,i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:F.base-0.5, fontWeight:600 }}>{asp.label}</span>
                <span style={{ fontSize:F.base-1, fontWeight:700, color:a }}>{asp.v}%</span>
              </div>
              {asp.hint && <div style={{ fontSize:F.label-1, color:T.faint, marginBottom:4 }}>{asp.hint}</div>}
              <div style={{ height:4, background:T.line, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${asp.v}%`, background:a, borderRadius:2 }}/>
              </div>
            </div>
          ))}
        </div>
      );

    case "movie_review":
      return (
        <div>
          {d.tags && <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>{d.tags.map((t,i)=><ITag key={i} text={t} color={a}/>)}</div>}
          {d.stats && <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {d.stats.map((s,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 8px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:800, color:a }}>{s.value}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>}
          {d.aspects && d.aspects.map((asp,i)=>(
            <div key={i} style={{ marginBottom:i<d.aspects.length-1?10:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:F.base-1, color:T.sub }}>{asp.label}</span>
                <span style={{ fontSize:F.base-1, fontWeight:700, color:a }}>{asp.v}%</span>
              </div>
              <div style={{ height:3, background:T.line, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${asp.v}%`, background:a, borderRadius:2 }}/>
              </div>
            </div>
          ))}
        </div>
      );

    case "restaurant":
      return (
        <div>
          {d.rating && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", gap:2, alignItems:"center" }}>
              {[1,2,3,4,5].map(i=><span key={i}>{Si.star(i<=Math.round(d.rating),"#ffd60a")}</span>)}
              <span style={{ fontSize:F.base-1, color:"#ffd60a", fontWeight:700, marginRight:6 }}>{d.rating}</span>
            </div>
            {d.open && <ITag text="مفتوح الآن" color="#34c759"/>}
          </div>}
          {d.stats && <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {d.stats.map((s,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 6px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base-1, fontWeight:700, color:a }}>{s.value}</div>
                <div style={{ fontSize:F.label-2, color:T.faint, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>}
          {d.menu && d.menu.map((item,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:item.popular?"#34c759":T.line, flexShrink:0 }}/>
              <span style={{ flex:1, fontSize:F.base-0.5, fontWeight:item.popular?600:400, color:item.popular?T.text:T.sub }}>{item.name}</span>
              {item.popular && <ITag text="الأكثر طلباً" color="#34c759"/>}
              <span style={{ fontSize:F.base-0.5, fontWeight:700, color:a }}>{item.price}</span>
            </div>
          ))}
        </div>
      );

    case "workout":
      return (
        <div>
          {d.summary && <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {d.summary.map((s,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 8px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:700, color:s.color||a }}>{s.value}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>}
          {d.exercises && d.exercises.map((ex,i,arr)=>(
            <div key={i} style={{ padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:F.base-0.5, fontWeight:600 }}>{ex.name}</span>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:F.label-1, color:T.faint }}>{ex.sets}x{ex.reps}</span>
                  <span style={{ fontSize:F.label-1, fontWeight:600, color:"#34c759" }}>{ex.weight}</span>
                </div>
              </div>
              <div style={{ height:4, background:T.line, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${ex.pct||70}%`, background:a, borderRadius:2 }}/>
              </div>
            </div>
          ))}
        </div>
      );

    case "news":
      return (
        <div>
          {d.counts && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            {d.counts.map((c,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:12, padding:"12px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.h1+4, fontWeight:900, color:c.color||a }}>{c.value}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{c.label}</div>
              </div>
            ))}
          </div>}
          {d.items && d.items.map((item,i,arr)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:item.hot?"#ff453a":T.line, flexShrink:0, marginTop:5 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:F.base-0.5, fontWeight:item.hot?600:400, color:item.hot?T.text:T.sub, lineHeight:1.4 }}>{item.title}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:3 }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      );

    case "language_learning":
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, padding:"14px", background:T.pillFill, borderRadius:13, border:`1px solid ${T.line}` }}>
            <div>
              <div style={{ fontSize:F.h1+8, fontWeight:900, color:a }}>{d.level}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.level_name}</div>
            </div>
            {d.progress!=null && <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:F.base+4, fontWeight:700 }}>{d.progress}%</div>
              <div style={{ fontSize:F.label, color:T.faint }}>التقدم العام</div>
              <div style={{ height:3, background:T.line, borderRadius:2, marginTop:6, width:80 }}>
                <div style={{ height:"100%", width:`${d.progress}%`, background:a, borderRadius:2 }}/>
              </div>
            </div>}
          </div>
          {d.skills && d.skills.map((s,i)=><IBar key={i} v={s.v} color={s.color||a} label={s.label} T={T}/>)}
        </div>
      );

    case "github":
      return (
        <div>
          {d.counts && <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
            {d.counts.map((c,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 6px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:800, color:c.color||a }}>{c.value}</div>
                <div style={{ fontSize:F.label-2, color:T.faint, marginTop:2 }}>{c.label}</div>
              </div>
            ))}
          </div>}
          {d.languages && (
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", height:8, borderRadius:6, overflow:"hidden", gap:1, marginBottom:8 }}>
                {d.languages.map((l,i)=><div key={i} style={{ flex:l.pct, background:l.color }}/>)}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {d.languages.map((l,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:l.color }}/>
                    <span style={{ fontSize:F.label-1, color:T.sub }}>{l.name} {l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {d.metrics && d.metrics.map((m,i)=><IBar key={i} v={m.v} max={m.max||100} color={m.color||a} label={m.label} right={m.right} T={T}/>)}
        </div>
      );

    case "app_review":
      return (
        <div>
          {d.header && <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            <div style={{ width:60, height:60, borderRadius:16, background:`${a}18`, border:`1px solid ${a}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:28, fontWeight:800, color:a }}>{d.header.initial||"A"}</span>
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ fontSize:F.h1+4, fontWeight:900, color:"#ffd60a" }}>{d.header.rating}</div>
                {Si.star(true,"#ffd60a")}
              </div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.header.reviews}</div>
              {d.header.tags && <div style={{ display:"flex", gap:6, marginTop:6 }}>
                {d.header.tags.map((t,i)=><ITag key={i} text={t} color={a}/>)}
              </div>}
            </div>
          </div>}
          {d.distribution && d.distribution.map((r,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:F.label-1, color:"#ffd60a", minWidth:20 }}>{r.stars}</span>
              {Si.star(true,"#ffd60a")}
              <div style={{ flex:1, height:5, background:T.line, borderRadius:3 }}>
                <div style={{ height:"100%", width:`${r.pct}%`, background:r.stars>=4?"#34c759":r.stars===3?"#ff9f0a":"#ff453a", borderRadius:3 }}/>
              </div>
              <span style={{ fontSize:F.label-1, color:T.faint, minWidth:24 }}>{r.pct}%</span>
            </div>
          ))}
        </div>
      );

    case "profile":
      return (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14, padding:"12px", background:T.pillFill, borderRadius:12, border:`1px solid ${T.line}` }}>
            <div style={{ width:56, height:56, borderRadius:16, background:`${a}18`, border:`2px solid ${a}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:F.h1+4, fontWeight:800, color:a, flexShrink:0 }}>{d.initial||"م"}</div>
            <div>
              <div style={{ fontSize:F.base+2, fontWeight:800 }}>{d.name}</div>
              <div style={{ fontSize:F.base-1, color:T.sub, marginTop:2 }}>{d.role}</div>
              {d.tag && <div style={{ marginTop:6 }}><ITag text={d.tag} color="#34c759"/></div>}
            </div>
          </div>
          {d.skills && <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            {d.skills.map((s,i)=><ITag key={i} text={s.name} color={s.color||a}/>)}
          </div>}
          {d.metrics && d.metrics.map((m,i)=><IBar key={i} v={m.v} color={m.color||a} label={m.label} right={m.right} T={T}/>)}
        </div>
      );

    case "security":
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, padding:"14px", background:"rgba(52,199,89,0.05)", borderRadius:13, border:"1px solid rgba(52,199,89,0.15)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {Si.shield("#34c759")}
              <div>
                <div style={{ fontSize:F.base, fontWeight:700, color:"#34c759" }}>{d.status||"النظام محمي"}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{d.subtitle||""}</div>
              </div>
            </div>
            {d.score!=null && <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:F.h1+4, fontWeight:900, color:"#34c759" }}>{d.score}</div>
              <div style={{ fontSize:F.label-2, color:T.faint }}>نقاط الأمان</div>
            </div>}
          </div>
          {d.threats && d.threats.map((t,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:t.color||a, boxShadow:`0 0 6px ${t.color||a}`, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:F.base-0.5, fontWeight:500 }}>{t.name}</div>
                <div style={{ fontSize:F.label-1, color:t.color||a }}>{t.level}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:F.base, fontWeight:800, color:t.color||a }}>{t.count}</div>
                <div style={{ fontSize:F.label-2, color:T.faint }}>اليوم</div>
              </div>
            </div>
          ))}
          {d.metrics && <div style={{ marginTop:12 }}>{d.metrics.map((m,i)=><IBar key={i} v={m.v} color={m.color||a} label={m.label} T={T}/>)}</div>}
        </div>
      );

    case "itinerary":
      return (
        <div>
          {d.summary && <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
            {d.summary.map((s,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:10, padding:"10px 6px", textAlign:"center", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.base, fontWeight:700, color:s.color||a }}>{s.value}</div>
                <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>}
          {d.days && d.days.map((day,i)=>(
            <div key={i} style={{ marginBottom:i<d.days.length-1?12:0, padding:"12px", background:T.pillFill, borderRadius:12, border:`1px solid ${T.line}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:F.label-1, color:a, fontWeight:700 }}>{day.day}</span>
                <span style={{ fontSize:F.base-0.5, fontWeight:600 }}>{day.title}</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {day.spots && day.spots.map((s,j)=>(
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:3, fontSize:F.label-1, color:T.sub }}>
                    {Si.pin(`${a}80`)}<span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case "energy":
      return (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, padding:"14px", background:T.pillFill, borderRadius:13, border:`1px solid ${T.line}` }}>
            <div>
              <div style={{ fontSize:F.h1+8, fontWeight:900, color:"#ffd60a" }}>{d.total}</div>
              <div style={{ fontSize:F.label, color:T.faint }}>{d.unit||"كيلوواط ساعة"}</div>
            </div>
            {d.change && <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              {d.change.includes("-")?Si.dn:Si.up}
              <span style={{ fontSize:F.base, fontWeight:600, color:d.change.includes("-")?"#34c759":"#ff453a" }}>{d.change}</span>
            </div>}
          </div>
          {d.chart && <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:60, background:T.pillFill, borderRadius:10, padding:"8px", marginBottom:12, border:`1px solid ${T.line}` }}>
            {d.chart.map((v,i)=>{
              const max = Math.max(...d.chart);
              const h = (v/max)*100;
              const isLast = i===d.chart.length-1;
              return <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", height:`${Math.max(h,5)}%`, background:isLast?"#ffd60a":"rgba(255,214,10,0.3)" }}/>;
            })}
          </div>}
          {d.metrics && d.metrics.map((m,i)=><IBar key={i} v={m.v} max={m.max||100} color={m.color||"#ffd60a"} label={m.label} right={m.right} T={T}/>)}
        </div>
      );

    case "economy":
      return (
        <div>
          {d.indicators && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {d.indicators.map((ind,i)=>(
              <div key={i} style={{ background:T.pillFill, borderRadius:12, padding:"14px 12px", border:`1px solid ${T.line}` }}>
                <div style={{ fontSize:F.label-1, color:T.faint, marginBottom:4 }}>{ind.label}</div>
                <div style={{ fontSize:F.base+6, fontWeight:900, color:ind.color||a }}>{ind.value}</div>
              </div>
            ))}
          </div>}
          {d.metrics && d.metrics.map((m,i)=><IBar key={i} v={m.v} color={m.color||a} label={m.label} T={T}/>)}
        </div>
      );

    case "traffic":
      return (
        <div>
          {d.overview && <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            {d.overview.map((o,i)=>(
              <div key={i} style={{ background:`${o.color}08`, border:`1px solid ${o.color}20`, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                <div style={{ fontSize:F.base-0.5, fontWeight:700, color:o.color }}>{o.label}</div>
                <div style={{ fontSize:F.label-2, color:T.faint, marginTop:2 }}>{o.desc}</div>
              </div>
            ))}
          </div>}
          {d.routes && d.routes.map((r,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", background:T.pillFill, borderRadius:12, border:`1px solid ${T.line}`, marginBottom:i<arr.length-1?8:0 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:r.color, boxShadow:`0 0 8px ${r.color}`, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:F.base-0.5, fontWeight:600 }}>{r.name}</div>
                <div style={{ fontSize:F.label-1, color:r.color }}>{r.status}</div>
              </div>
              <div style={{ textAlign:"center" }}>
                {Si.clock(r.color)}
                <div style={{ fontSize:F.base-0.5, fontWeight:700, color:r.color }}>{r.time}</div>
              </div>
            </div>
          ))}
        </div>
      );

    case "podcast":
      return (
        <div>
          {d.header && <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            <div style={{ width:64, height:64, borderRadius:16, background:`${a}18`, border:`1px solid ${a}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {Si.music(a)}
            </div>
            <div>
              {d.header.tags && <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:6 }}>
                {d.header.tags.map((t,i)=><ITag key={i} text={t} color={a}/>)}
              </div>}
              <div style={{ display:"flex", gap:2 }}>
                {[1,2,3,4,5].map(i=><span key={i}>{Si.star(i<=Math.round(d.header.rating||4),a)}</span>)}
              </div>
              <div style={{ fontSize:F.label-1, color:T.faint, marginTop:2 }}>{d.header.listeners}</div>
            </div>
          </div>}
          {d.progress!=null && (
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:F.label-1, color:T.faint }}>التقدم في الاستماع</span>
                <span style={{ fontSize:F.label-1, color:a, fontWeight:700 }}>{d.progress}%</span>
              </div>
              <div style={{ height:5, background:T.line, borderRadius:3 }}>
                <div style={{ height:"100%", width:`${d.progress}%`, background:a, borderRadius:3 }}/>
              </div>
            </div>
          )}
          {d.chapters && d.chapters.map((ch,i,arr)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<arr.length-1?`1px solid ${T.line}`:"none" }}>
              <div style={{ width:28, height:28, borderRadius:8, background:ch.done?`${a}18`:T.pillFill, border:`1px solid ${ch.done?a:T.line}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:F.label-1, fontWeight:700, color:ch.done?a:T.faint, flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:F.base-0.5, fontWeight:ch.done?600:400, color:ch.done?T.text:T.sub }}>{ch.title}</div>
                <div style={{ fontSize:F.label-1, color:T.faint }}>{ch.time}</div>
              </div>
              {ch.done && <span style={{ display:"flex" }}>{Si.eye(a)}</span>}
            </div>
          ))}
        </div>
      );

    default:
      return <p style={{ color:T.text, lineHeight:1.9, margin:0, fontSize:F.base-0.5, whiteSpace:"pre-wrap" }}>{d.body||""}</p>;
  }
}


/* ============ دوال مساعدة ============ */
function iconBtnStyle(T) {
  return {
    background: T.pillFill, color: T.text, border: `1px solid ${T.line}`,
    borderRadius: 8, width: 34, height: 34, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit", transition: "all .15s", flexShrink: 0,
  };
}

function settingsBtnStyle(T, F) {
  return {
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", background: "transparent", border: "none",
    color: T.text, fontSize: F.base - 1, fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit", borderRadius: 9, textAlign: "right",
  };
}

function cardActionBtn(T) {
  return {
    background: "transparent", border: "none", color: T.faint,
    cursor: "pointer", padding: 6, borderRadius: 7,
    display: "flex", alignItems: "center", transition: "all .2s",
  };
}

/* ============ نافذة إعادة التسمية ============ */
function RenameModal({ T, t, F, isRTL, currentTitle, onSave, onCancel }) {
  const [value, setValue] = useState(currentTitle);
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, background: T.modalBg, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)", padding: 20, animation: "ci .2s",
    }}>
      <div onClick={e => e.stopPropagation()}>
        <Glass T={T} radius={18} style={{ padding: 24, maxWidth: 360, width: "100%" }}>
          <div style={{ fontSize: F.base + 1, fontWeight: 700, marginBottom: 14, textAlign: "center" }}>
            {isRTL ? "تغيير اسم المحادثة" : "Rename Chat"}
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave(value);
              if (e.key === "Escape") onCancel();
            }}
            style={{
              width: "100%", padding: "11px 14px",
              background: T.pillFill, border: `1px solid ${T.line}`,
              borderRadius: 10, color: T.text, fontSize: F.base,
              fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              direction: isRTL ? "rtl" : "ltr", marginBottom: 16,
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onCancel} style={{
              flex: 1, background: T.pillFill, color: T.text,
              border: "none", borderRadius: 11, padding: "11px",
              fontSize: F.base, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{t.cancel}</button>
            <button onClick={() => onSave(value)} style={{
              flex: 1, background: ACCENTS.knowledge, color: "#fff",
              border: "none", borderRadius: 11, padding: "11px",
              fontSize: F.base, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{isRTL ? "حفظ" : "Save"}</button>
          </div>
        </Glass>
      </div>
    </div>
  );
}

function formatTime(ts, lang) {
  if (!ts) return "";
  const d = new Date(ts);
  const opts = { hour: "2-digit", minute: "2-digit" };
  return d.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", opts);
}

function formatRelativeTime(ts, lang) {
  const now = Date.now();
  const diff = now - ts;
  const min = 60 * 1000, hour = 60 * min, day = 24 * hour;
  const d = new Date(ts);

  if (diff < min) return lang === "ar" ? "الآن" : "now";
  if (diff < hour) return lang === "ar" ? `قبل ${Math.floor(diff / min)} د` : `${Math.floor(diff / min)}m ago`;
  if (diff < day) return lang === "ar" ? `قبل ${Math.floor(diff / hour)} س` : `${Math.floor(diff / hour)}h ago`;
  if (diff < 2 * day) return lang === "ar" ? "أمس" : "yesterday";
  if (diff < 7 * day) return lang === "ar" ? `قبل ${Math.floor(diff / day)} أيام` : `${Math.floor(diff / day)}d ago`;

  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" });
}

/* ============ GroupsApp — نظام المجموعات الكامل ============ */
const GIcon = {
  Back:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>,
  Plus:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Group:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="7" r="3"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg>,
  Check:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>,
  Money:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>,
  Cal:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Task:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Spark:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>,
  Travel:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
  Camp:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M3.5 21h17L12 3 3.5 21z"/><path d="M12 9v12"/></svg>,
  Sport:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20"/></svg>,
  Event:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3"/></svg>,
  Food:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2M5 2v20M16 2c-1.7 0-3 2-3 5s1.3 5 3 5 3-2 3-5-1.3-5-3-5zM16 12v10"/></svg>,
  Car:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1M5 13v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/></svg>,
  Bed:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M5 18v2M19 18v2"/></svg>,
  Ticket:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/></svg>,
  Link:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>,
  Copy:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Arrow:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Trash:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>,
  Send:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  Clock:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Pin:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Wallet:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h3v-4z"/></svg>,
};

const G_TYPES = [
  { v: "سفرية", icon: <GIcon.Travel />, grad: "linear-gradient(135deg,#0F2060,#2A5ED8)" },
  { v: "كشتة",  icon: <GIcon.Camp />,   grad: "linear-gradient(135deg,#065F46,#10B981)" },
  { v: "تمرين", icon: <GIcon.Sport />,  grad: "linear-gradient(135deg,#7C2D12,#F59E0B)" },
  { v: "فعالية", icon: <GIcon.Event />, grad: "linear-gradient(135deg,#581C87,#A855F7)" },
  { v: "عزيمة", icon: <GIcon.Food />,   grad: "linear-gradient(135deg,#9F1239,#FB7185)" },
];
const G_TYPE_ICON = (type) => (G_TYPES.find(x => x.v === type) || G_TYPES[0]).icon;
const G_TYPE_GRAD = (type) => (G_TYPES.find(x => x.v === type) || G_TYPES[0]).grad;

const G_CATS = {
  "إقامة":   { color: "#4A8FFF", icon: <GIcon.Bed /> },
  "مواصلات": { color: "#A855F7", icon: <GIcon.Car /> },
  "طعام":    { color: "#34D399", icon: <GIcon.Food /> },
  "أنشطة":   { color: "#FBBF24", icon: <GIcon.Ticket /> },
  "أخرى":    { color: "#F87171", icon: <GIcon.Wallet /> },
};
const G_AVATAR_COLORS = ["#4A8FFF", "#34D399", "#F87171", "#FBBF24", "#A855F7", "#38BDF8", "#FB7185", "#2DD4BF"];

function GAvatar({ name, initials, color, size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}1A`, border: `1.5px solid ${color}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color, flexShrink: 0,
    }}>{initials || (name ? name.slice(0, 2) : "؟")}</div>
  );
}

function GroupsApp({ T, t, F, isRTL, dark, onBack }) {
  const [screen, setScreen] = useState("list");
  const [activeId, setActiveId] = useState(null);
  const [groupTab, setGroupTab] = useState(0);

  const [groups, setGroups] = useState(() => {
    try { const s = localStorage.getItem("marn_groups_v2"); if (s) return JSON.parse(s); } catch {}
    return [];
  });
  useEffect(() => {
    try { localStorage.setItem("marn_groups_v2", JSON.stringify(groups)); } catch {}
  }, [groups]);

  const [form, setForm] = useState({ name: "", type: "سفرية", dest: "", days: "3", budget: "" });
  const [modal, setModal] = useState(null); // member | expense | task | activity
  const [mForm, setMForm] = useState({});
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const activeGroup = groups.find(g => g.id === activeId);

  // ===== فلسفة الألوان =====
  const C = {
    bg:      dark ? "#070C1A" : "#F5F8FF",
    bg2:     dark ? "#0A1228" : "#FFFFFF",
    surface: dark ? "#0E1832" : "#FFFFFF",
    card:    dark ? "#13203F" : "#F7FAFF",
    raised:  dark ? "#1A2A50" : "#EEF3FF",
    border:  dark ? "#1C2C52" : "#E0E8FA",
    border2: dark ? "#152141" : "#EEF2FB",
    text:    dark ? "#F0F5FF" : "#0A1733",
    sub:     dark ? "#8AA6D0" : "#5A78A8",
    faint:   dark ? "#465f8a" : "#A8BFE0",
    blue:    dark ? "#5598FF" : "#2A5ED8",
    ice:     dark ? "#C8DEFF" : "#1B2F6B",
    grad:    "linear-gradient(135deg,#0F2060,#2A5ED8)",
    gradHover: "linear-gradient(135deg,#163080,#3A6FE8)",
    green:   "#34D399", red: "#F87171", amber: "#FBBF24",
    shadow:  dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(27,47,107,0.1)",
    shadowSm: dark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(27,47,107,0.06)",
  };

  // ===== عمليات البيانات =====
  const updateGroup = (id, patch) => setGroups(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g));
  const genCode = () => Array.from({length:6},()=>Math.random().toString(36)[2]||"X").join("").toUpperCase();

  const createGroup = () => {
    if (!form.name.trim()) return;
    const id = `g${Date.now()}`;
    const g = {
      id, name: form.name.trim(), type: form.type,
      dest: form.dest.trim(), days: parseInt(form.days) || 1,
      totalBudget: parseInt(form.budget) || 0,
      code: genCode(), createdAt: Date.now(),
      members: [], expenses: [], tasks: [], schedule: [],
    };
    setGroups(prev => [...prev, g]);
    setForm({ name: "", type: "سفرية", dest: "", days: "3", budget: "" });
    setActiveId(id); setGroupTab(0); setScreen("group");
  };

  const deleteGroup = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setScreen("list"); setActiveId(null);
  };

  const openModal = (type) => {
    setModal(type);
    if (type === "member") setMForm({ name: "", budget: "" });
    if (type === "expense") setMForm({ desc: "", amount: "", paidBy: "", cat: "إقامة" });
    if (type === "task") setMForm({ text: "", owner: "" });
    if (type === "activity") setMForm({ day: 1, time: "", act: "", note: "" });
  };

  const saveModal = () => {
    if (!activeGroup) return;
    const g = activeGroup;
    if (modal === "member") {
      if (!mForm.name?.trim()) return;
      const m = { id: Date.now(), name: mForm.name.trim(), initials: mForm.name.trim().slice(0,2),
        budget: parseInt(mForm.budget)||0, paid: 0, color: G_AVATAR_COLORS[g.members.length % G_AVATAR_COLORS.length] };
      updateGroup(g.id, { members: [...g.members, m] });
    }
    if (modal === "expense") {
      if (!mForm.desc?.trim() || !mForm.amount) return;
      const amount = parseInt(mForm.amount)||0;
      const paidBy = parseInt(mForm.paidBy)||0;
      const exp = { id: Date.now(), desc: mForm.desc.trim(), amount, paidBy, cat: mForm.cat };
      const members = g.members.map(m => m.id === paidBy ? { ...m, paid: m.paid + amount } : m);
      updateGroup(g.id, { expenses: [...g.expenses, exp], members });
    }
    if (modal === "task") {
      if (!mForm.text?.trim()) return;
      const task = { id: Date.now(), text: mForm.text.trim(), done: false, owner: parseInt(mForm.owner)||null };
      updateGroup(g.id, { tasks: [...g.tasks, task] });
    }
    if (modal === "activity") {
      if (!mForm.act?.trim()) return;
      const day = parseInt(mForm.day)||1;
      let schedule = [...g.schedule];
      const di = schedule.findIndex(d => d.day === day);
      const item = { id: Date.now(), time: mForm.time||"--:--", act: mForm.act.trim(), note: mForm.note?.trim()||"" };
      if (di >= 0) schedule[di] = { ...schedule[di], items: [...schedule[di].items, item].sort((a,b)=>a.time.localeCompare(b.time)) };
      else schedule.push({ day, items: [item] });
      schedule.sort((a,b)=>a.day-b.day);
      updateGroup(g.id, { schedule });
    }
    setModal(null);
  };

  const toggleTask = (id) => activeGroup && updateGroup(activeGroup.id, {
    tasks: activeGroup.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
  });
  const delExpense = (id) => {
    const exp = activeGroup.expenses.find(e=>e.id===id);
    const members = activeGroup.members.map(m => m.id === exp.paidBy ? { ...m, paid: Math.max(0,m.paid-exp.amount) } : m);
    updateGroup(activeGroup.id, { expenses: activeGroup.expenses.filter(e=>e.id!==id), members });
  };
  const delTask = (id) => updateGroup(activeGroup.id, { tasks: activeGroup.tasks.filter(t=>t.id!==id) });
  const delMember = (id) => updateGroup(activeGroup.id, { members: activeGroup.members.filter(m=>m.id!==id) });

  // ===== شات مرن للمجموعة =====
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs, chatLoading]);

  const askMarn = async (preset) => {
    const q = (preset || chatInput).trim();
    if (!q || chatLoading || !activeGroup) return;
    const g = activeGroup;
    setChatMsgs(prev => [...prev, { role: "user", text: q }]);
    setChatInput(""); setChatLoading(true);

    const ctx = `[سياق المجموعة]
الاسم: ${g.name} | النوع: ${g.type} | الوجهة: ${g.dest||"غير محدد"} | الأيام: ${g.days}
الأعضاء (${g.members.length}): ${g.members.map(m=>m.name).join("، ")||"لا أحد بعد"}
الميزانية الكلية: ${g.totalBudget||"غير محددة"} ريال
المصاريف الحالية: ${g.expenses.map(e=>`${e.desc} (${e.amount}ر)`).join("، ")||"لا شيء"}
المهام: ${g.tasks.map(t=>`${t.text}${t.done?" ✓":""}`).join("، ")||"لا شيء"}
عدد أيام الجدول المخطط: ${g.schedule.length}

[طلب المستخدم]
${q}

جاوب كمنظّم رحلات ذكي يساعد المجموعة. كن عملياً ومفيداً ومختصراً. لو طُلب جدول أو اقتراحات أو قائمة، رتّبها بوضوح.`;

    try {
      const r = await fetch("/api/ask", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: ctx, history: [], lang: isRTL ? "ar" : "en", forceSearch: false }),
      });
      const data = await r.json().catch(()=>null);
      let answer = "";
      if (data?.card) {
        const c = data.card;
        answer = c.title ? `${c.title}\n` : "";
        if (c.sub) answer += `${c.sub}\n`;
        (c.tabs||[]).forEach(tab => {
          if (tab.data?.body) answer += `\n${tab.data.body}`;
          if (Array.isArray(tab.data?.items)) answer += `\n${tab.data.items.map(i=>`• ${i}`).join("\n")}`;
          if (Array.isArray(tab.data?.steps)) answer += `\n${tab.data.steps.map((s,i)=>`${i+1}. ${s.t||s}`).join("\n")}`;
        });
      } else {
        answer = data?.error || "تعذّر الحصول على رد. حاول مرة أخرى.";
      }
      setChatMsgs(prev => [...prev, { role: "marn", text: answer.trim() }]);
    } catch {
      setChatMsgs(prev => [...prev, { role: "marn", text: "صار خطأ في الاتصال. حاول مرة ثانية." }]);
    }
    setChatLoading(false);
  };

  // ===== أنماط مشتركة =====
  const fontFamily = "'Noto Sans Arabic',-apple-system,'SF Pro Text',sans-serif";
  const screenWrap = { display:"flex", flexDirection:"column", height:"100dvh", background:C.bg, fontFamily, direction: isRTL?"rtl":"ltr" };
  const headerBar = { height:60, display:"flex", alignItems:"center", gap:12, padding:"0 18px", borderBottom:`1px solid ${C.border}`, background:C.bg2, flexShrink:0 };
  const backBtn = { background:C.card, border:`1px solid ${C.border}`, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.sub, flexShrink:0 };
  const primaryBtn = { background:C.grad, border:"none", borderRadius:12, padding:"13px", color:"#fff", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:14, boxShadow:"0 4px 16px rgba(42,94,216,0.35)" };
  const inputStyle = { width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:11, padding:"12px 14px", color:C.text, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", direction:isRTL?"rtl":"ltr" };
  const sectionLabel = { fontSize:10, color:C.faint, fontWeight:700, letterSpacing:1.2, marginBottom:12, textTransform:"uppercase" };
  const cardWrap = { background:C.surface, borderRadius:18, border:`1px solid ${C.border}`, boxShadow:C.shadowSm };

  // ============ شاشة القائمة ============
  if (screen === "list") {
    return (
      <div style={screenWrap}>
        <div style={headerBar}>
          <button onClick={onBack} style={backBtn}><GIcon.Back /></button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.text, letterSpacing:-0.3 }}>المجموعات</div>
            <div style={{ fontSize:11, color:C.faint }}>نظّم رحلاتك وفعالياتك مع أصحابك</div>
          </div>
          <button onClick={()=>setScreen("create")} style={{ ...primaryBtn, width:40, height:40, borderRadius:11, padding:0, display:"flex", alignItems:"center", justifyContent:"center" }}><GIcon.Plus /></button>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:"20px", maxWidth:680, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
          {groups.length === 0 ? (
            <div style={{ textAlign:"center", padding:"70px 24px" }}>
              <div style={{ width:72, height:72, borderRadius:20, background:C.grad, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:"0 8px 28px rgba(42,94,216,0.4)" }}>
                <div style={{ transform:"scale(1.5)" }}><GIcon.Group /></div>
              </div>
              <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>ابدأ مجموعتك الأولى</div>
              <div style={{ fontSize:13, color:C.sub, marginBottom:24, lineHeight:1.7, maxWidth:320, margin:"0 auto 24px" }}>أنشئ رحلة أو كشتة أو فعالية، وادعُ أصحابك، ونظّموا كل شيء — الجدول، المصاريف، المهام — في مكان واحد.</div>
              <button onClick={()=>setScreen("create")} style={{ ...primaryBtn, padding:"13px 28px" }}>إنشاء مجموعة</button>
            </div>
          ) : (
            <>
              {groups.map(g => {
                const totalExp = g.expenses.reduce((s,e)=>s+e.amount,0);
                const doneT = g.tasks.filter(t=>t.done).length;
                return (
                  <div key={g.id} onClick={()=>{ setActiveId(g.id); setGroupTab(0); setChatMsgs([]); setScreen("group"); }}
                    style={{ ...cardWrap, overflow:"hidden", cursor:"pointer", marginBottom:14 }}>
                    <div style={{ height:4, background:G_TYPE_GRAD(g.type) }} />
                    <div style={{ padding:"16px 18px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:14 }}>
                        <div style={{ width:46, height:46, borderRadius:13, background:G_TYPE_GRAD(g.type), display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:C.shadowSm }}>
                          {G_TYPE_ICON(g.type)}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:3 }}>{g.name}</div>
                          <div style={{ fontSize:12, color:C.sub, display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ color:C.faint }}><GIcon.Pin /></span>{g.dest || g.type}
                          </div>
                        </div>
                        <div style={{ color:C.faint }}><GIcon.Arrow /></div>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5, background:C.card, border:`1px solid ${C.border2}`, borderRadius:9, padding:"5px 10px", fontSize:11, color:C.sub }}>
                          <span style={{ color:C.blue }}><GIcon.User /></span>{g.members.length} أعضاء
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:5, background:C.card, border:`1px solid ${C.border2}`, borderRadius:9, padding:"5px 10px", fontSize:11, color:C.sub }}>
                          <span style={{ color:C.green }}><GIcon.Task /></span>{doneT}/{g.tasks.length} مهام
                        </div>
                        {totalExp > 0 && (
                          <div style={{ display:"flex", alignItems:"center", gap:5, background:C.card, border:`1px solid ${C.border2}`, borderRadius:9, padding:"5px 10px", fontSize:11, color:C.sub }}>
                            <span style={{ color:C.amber }}><GIcon.Money /></span>{totalExp.toLocaleString()} ر
                          </div>
                        )}
                      </div>
                      {g.members.length > 0 && (
                        <div style={{ display:"flex", marginTop:13 }}>
                          {g.members.slice(0,6).map((m,i)=>(
                            <div key={m.id} style={{ marginRight:isRTL?0:(i>0?-8:0), marginLeft:isRTL?(i>0?-8:0):0, zIndex:10-i }}>
                              <GAvatar name={m.name} initials={m.initials} color={m.color} size={26} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>setScreen("join")} style={{ width:"100%", background:"transparent", border:`1.5px dashed ${C.border}`, borderRadius:14, padding:"15px", cursor:"pointer", fontFamily:"inherit", fontSize:13, color:C.sub, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <GIcon.Link /> الانضمام لمجموعة برمز دعوة
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ============ شاشة الإنشاء ============
  if (screen === "create") {
    return (
      <div style={screenWrap}>
        <div style={headerBar}>
          <button onClick={()=>setScreen("list")} style={backBtn}><GIcon.Back /></button>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>مجموعة جديدة</div>
        </div>
        <div style={{ flex:1, overflow:"auto", padding:"20px", maxWidth:560, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
          <div style={{ ...cardWrap, padding:"18px", marginBottom:14 }}>
            <div style={sectionLabel}>اسم المجموعة</div>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="مثال: رحلة العيد" style={inputStyle} />
          </div>

          <div style={{ ...cardWrap, padding:"18px", marginBottom:14 }}>
            <div style={sectionLabel}>نوع النشاط</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))", gap:8 }}>
              {G_TYPES.map(tp => (
                <button key={tp.v} onClick={()=>setForm({...form,type:tp.v})} style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:7, padding:"14px 8px",
                  background: form.type===tp.v ? tp.grad : C.card,
                  border:`1.5px solid ${form.type===tp.v ? "transparent" : C.border}`,
                  color: form.type===tp.v ? "#fff" : C.sub, borderRadius:13, cursor:"pointer", fontFamily:"inherit",
                  fontSize:12, fontWeight:600, transition:"all .15s",
                  boxShadow: form.type===tp.v ? C.shadowSm : "none",
                }}>
                  {tp.icon}{tp.v}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...cardWrap, padding:"18px", marginBottom:14 }}>
            <div style={sectionLabel}>الوجهة أو المكان</div>
            <input value={form.dest} onChange={e=>setForm({...form,dest:e.target.value})} placeholder="مثال: أبها — أو ملعب الأمير — أو شاليه الشمال" style={inputStyle} />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ ...sectionLabel, marginBottom:6 }}>عدد الأيام</div>
                <input value={form.days} onChange={e=>setForm({...form,days:e.target.value})} type="number" min="1" placeholder="3" style={inputStyle} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ ...sectionLabel, marginBottom:6 }}>الميزانية (اختياري)</div>
                <input value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} type="number" placeholder="ريال" style={inputStyle} />
              </div>
            </div>
          </div>

          <button onClick={createGroup} style={{ ...primaryBtn, width:"100%" }}>إنشاء المجموعة</button>
        </div>
      </div>
    );
  }

  // ============ شاشة الانضمام ============
  if (screen === "join") {
    return (
      <div style={screenWrap}>
        <div style={headerBar}>
          <button onClick={()=>setScreen("list")} style={backBtn}><GIcon.Back /></button>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>الانضمام برمز</div>
        </div>
        <div style={{ flex:1, padding:"20px", maxWidth:440, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
          <div style={{ ...cardWrap, padding:"28px 24px", textAlign:"center" }}>
            <div style={{ width:60, height:60, borderRadius:16, background:`${C.blue}1A`, border:`1px solid ${C.blue}33`, margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center", color:C.blue }}>
              <div style={{ transform:"scale(1.4)" }}><GIcon.Link /></div>
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>أدخل رمز الدعوة</div>
            <div style={{ fontSize:12, color:C.faint, marginBottom:22, lineHeight:1.6 }}>اطلب الرمز من أحد أعضاء المجموعة لتنضم إليهم</div>
            <input placeholder="ABC123" maxLength={6} style={{ ...inputStyle, textAlign:"center", letterSpacing:6, fontSize:22, fontWeight:800, fontFamily:"monospace", marginBottom:16, textTransform:"uppercase" }} />
            <button style={{ ...primaryBtn, width:"100%" }}>انضمام</button>
            <div style={{ fontSize:11, color:C.faint, marginTop:14 }}>الانضمام الجماعي يحتاج تفعيل المزامنة السحابية (قريباً)</div>
          </div>
        </div>
      </div>
    );
  }

  // ============ داخل المجموعة ============
  if (screen === "group" && activeGroup) {
    const g = activeGroup;
    const totalExp = g.expenses.reduce((s,e)=>s+e.amount,0);
    const perPerson = g.members.length ? Math.round(totalExp/g.members.length) : 0;
    const budget = g.totalBudget || g.members.reduce((s,m)=>s+m.budget,0);
    const TABS = [
      { label:"نظرة عامة", icon:<GIcon.Group /> },
      { label:"الجدول", icon:<GIcon.Cal /> },
      { label:"المصاريف", icon:<GIcon.Money /> },
      { label:"المهام", icon:<GIcon.Task /> },
      { label:"مرن", icon:<GIcon.Spark /> },
    ];

    return (
      <div style={screenWrap}>
        {/* هيدر */}
        <div style={{ ...headerBar, height:64 }}>
          <button onClick={()=>setScreen("list")} style={backBtn}><GIcon.Back /></button>
          <div style={{ width:40, height:40, borderRadius:11, background:G_TYPE_GRAD(g.type), display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>{G_TYPE_ICON(g.type)}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{g.name}</div>
            <div style={{ fontSize:11, color:C.faint }}>{g.dest || g.type} · {g.days} أيام</div>
          </div>
          <button onClick={()=>{ navigator.clipboard?.writeText(g.code); }} title="نسخ رمز الدعوة"
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:C.sub, fontFamily:"monospace", background:C.card, padding:"6px 10px", borderRadius:8, border:`1px solid ${C.border}`, flexShrink:0, cursor:"pointer", letterSpacing:1 }}>
            <GIcon.Copy />{g.code}
          </button>
        </div>

        {/* تبويبات */}
        <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:C.bg2, flexShrink:0, overflowX:"auto" }}>
          {TABS.map((tb,i)=>(
            <button key={i} onClick={()=>setGroupTab(i)} style={{
              flex:"1 0 auto", background:"none", border:"none",
              borderBottom:`2.5px solid ${i===groupTab ? C.blue : "transparent"}`,
              color:i===groupTab ? C.text : C.faint, padding:"13px 14px", cursor:"pointer", fontFamily:"inherit",
              fontSize:12, fontWeight:i===groupTab?700:500, marginBottom:-1, transition:"all .15s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6, whiteSpace:"nowrap",
            }}>
              <span style={{ color:i===groupTab ? C.blue : C.faint }}>{tb.icon}</span>{tb.label}
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

          {/* ===== نظرة عامة ===== */}
          {groupTab===0 && (
            <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:14, maxWidth:640, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
              <div style={{ ...cardWrap, overflow:"hidden" }}>
                <div style={{ height:3, background:C.grad }} />
                <div style={{ padding:"16px 18px" }}>
                  <div style={sectionLabel}>الميزانية</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                    {[
                      { l:"الميزانية", v: budget?`${budget.toLocaleString()}`:"—", c:C.blue },
                      { l:"المصروف", v: totalExp.toLocaleString(), c:C.amber },
                      { l:"نصيب الفرد", v: perPerson.toLocaleString(), c:C.green },
                    ].map((s,i)=>(
                      <div key={i} style={{ background:C.card, borderRadius:12, padding:"12px 8px", border:`1px solid ${C.border2}`, textAlign:"center" }}>
                        <div style={{ fontSize:17, fontWeight:800, color:s.c, lineHeight:1.1 }}>{s.v}</div>
                        <div style={{ fontSize:10, color:C.faint, marginTop:5 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  {budget > 0 && (
                    <>
                      <div style={{ height:7, background:C.card, borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${Math.min((totalExp/budget)*100,100)}%`, background: totalExp>budget?"linear-gradient(90deg,#DC2626,#F87171)":C.grad, borderRadius:4, transition:"width .5s" }} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:10, color:C.faint }}>
                        <span>صُرف {Math.round((totalExp/budget)*100)}%</span>
                        <span>{budget-totalExp >= 0 ? `متبقي ${(budget-totalExp).toLocaleString()} ر` : `تجاوز ${(totalExp-budget).toLocaleString()} ر`}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* الأعضاء */}
              <div style={{ ...cardWrap, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ ...sectionLabel, marginBottom:0 }}>الأعضاء ({g.members.length})</div>
                  <button onClick={()=>openModal("member")} style={{ display:"flex", alignItems:"center", gap:4, background:`${C.blue}15`, border:`1px solid ${C.blue}30`, color:C.blue, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}><GIcon.Plus />إضافة</button>
                </div>
                {g.members.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"20px", color:C.faint, fontSize:13 }}>لا يوجد أعضاء — أضف أول عضو</div>
                ) : g.members.map(m => {
                  const owes = perPerson - m.paid;
                  return (
                    <div key={m.id} style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 0", borderBottom:`1px solid ${C.border2}` }}>
                      <GAvatar name={m.name} initials={m.initials} color={m.color} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{m.name}</div>
                        <div style={{ fontSize:11, color:C.faint }}>دفع {m.paid.toLocaleString()}{m.budget?` من ${m.budget.toLocaleString()}`:""} ر</div>
                      </div>
                      {totalExp > 0 && (
                        <div style={{ fontSize:12, fontWeight:700, color: owes>0?C.red:C.green, textAlign:"left" }}>
                          {owes>0 ? `عليه ${owes.toLocaleString()}` : owes<0 ? `له ${Math.abs(owes).toLocaleString()}` : "متوازن"}
                        </div>
                      )}
                      <button onClick={()=>delMember(m.id)} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", padding:4, display:"flex" }}><GIcon.Trash /></button>
                    </div>
                  );
                })}
              </div>

              {/* التسوية */}
              {totalExp > 0 && g.members.some(m=>perPerson-m.paid>0) && (
                <div style={{ ...cardWrap, padding:"16px 18px" }}>
                  <div style={sectionLabel}>التسوية المقترحة</div>
                  {(() => {
                    const creditors = g.members.filter(m=>m.paid>perPerson).map(m=>({...m,bal:m.paid-perPerson}));
                    return g.members.filter(m=>perPerson-m.paid>0).map(m => {
                      const to = creditors.sort((a,b)=>b.bal-a.bal)[0];
                      return (
                        <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.card, borderRadius:11, border:`1px solid ${C.border2}`, marginBottom:8 }}>
                          <GAvatar name={m.name} initials={m.initials} color={m.color} size={28} />
                          <div style={{ flex:1, fontSize:12, color:C.sub }}>
                            <span style={{ color:C.text, fontWeight:600 }}>{m.name}</span> يحوّل لـ <span style={{ color:C.ice, fontWeight:600 }}>{to?.name||"المجموعة"}</span>
                          </div>
                          <div style={{ fontSize:14, fontWeight:800, color:C.red }}>{(perPerson-m.paid).toLocaleString()} ر</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ===== الجدول ===== */}
          {groupTab===1 && (
            <div style={{ padding:"20px", maxWidth:640, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
              {g.schedule.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 24px", ...cardWrap }}>
                  <div style={{ color:C.sub, fontSize:14, fontWeight:600, marginBottom:6 }}>لا يوجد جدول بعد</div>
                  <div style={{ color:C.faint, fontSize:12, marginBottom:18, lineHeight:1.6 }}>أضف أنشطة يدوياً، أو اطلب من مرن ينظّم لكم جدولاً كاملاً</div>
                  <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                    <button onClick={()=>openModal("activity")} style={{ ...primaryBtn, padding:"11px 20px", fontSize:13 }}>إضافة نشاط</button>
                    <button onClick={()=>{ setGroupTab(4); setTimeout(()=>askMarn(`نظّم لنا جدولاً مفصّلاً لـ ${g.days} أيام في ${g.dest||g.type}`),200); }} style={{ background:C.card, border:`1px solid ${C.border}`, color:C.text, borderRadius:12, padding:"11px 20px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:7 }}><GIcon.Spark />اطلب من مرن</button>
                  </div>
                </div>
              ) : (
                <>
                  {g.schedule.map((day,di)=>(
                    <div key={di} style={{ marginBottom:18 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
                        <div style={{ width:30, height:30, borderRadius:9, background:C.grad, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff" }}>{day.day}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>اليوم {day.day}</div>
                      </div>
                      <div style={{ ...cardWrap, overflow:"hidden" }}>
                        {day.items.map((item,ii)=>(
                          <div key={item.id||ii} style={{ display:"flex", gap:13, padding:"13px 16px", borderBottom: ii<day.items.length-1?`1px solid ${C.border2}`:"none", alignItems:"flex-start" }}>
                            <div style={{ fontSize:12, color:C.blue, fontWeight:700, minWidth:46, fontFamily:"monospace", paddingTop:1 }}>{item.time}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:14, color:C.text, fontWeight:500 }}>{item.act}</div>
                              {item.note && <div style={{ fontSize:12, color:C.faint, marginTop:2 }}>{item.note}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>openModal("activity")} style={{ ...primaryBtn, width:"100%" }}><span style={{display:"inline-flex",verticalAlign:"middle",marginLeft:6}}><GIcon.Plus /></span>إضافة نشاط</button>
                </>
              )}
            </div>
          )}

          {/* ===== المصاريف ===== */}
          {groupTab===2 && (
            <div style={{ padding:"20px", maxWidth:640, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
              {g.expenses.length > 0 && (
                <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
                  {Object.entries(g.expenses.reduce((a,e)=>{a[e.cat]=(a[e.cat]||0)+e.amount;return a;},{})).map(([cat,amt])=>(
                    <div key={cat} style={{ flexShrink:0, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", textAlign:"center", minWidth:84 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, color:G_CATS[cat]?.color||C.sub, marginBottom:4 }}>{G_CATS[cat]?.icon}<span style={{ fontSize:13, fontWeight:800 }}>{amt.toLocaleString()}</span></div>
                      <div style={{ fontSize:10, color:C.faint }}>{cat}</div>
                    </div>
                  ))}
                </div>
              )}
              {g.expenses.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 24px", ...cardWrap, marginBottom:14 }}>
                  <div style={{ color:C.sub, fontSize:14, fontWeight:600, marginBottom:6 }}>لا توجد مصاريف بعد</div>
                  <div style={{ color:C.faint, fontSize:12 }}>سجّل أول مصروف ليُقسَّم تلقائياً على الأعضاء</div>
                </div>
              ) : g.expenses.map(exp => {
                const payer = g.members.find(m=>m.id===exp.paidBy);
                const cat = G_CATS[exp.cat] || G_CATS["أخرى"];
                return (
                  <div key={exp.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", ...cardWrap, marginBottom:9 }}>
                    <div style={{ width:40, height:40, borderRadius:11, background:`${cat.color}18`, border:`1px solid ${cat.color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:cat.color }}>{cat.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, color:C.text, fontWeight:600 }}>{exp.desc}</div>
                      <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>دفع {payer?.name||"؟"} · يُقسَّم على {g.members.length||1}</div>
                    </div>
                    <div style={{ fontSize:15, fontWeight:800, color:C.amber, flexShrink:0 }}>{exp.amount.toLocaleString()} ر</div>
                    <button onClick={()=>delExpense(exp.id)} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", padding:4, display:"flex" }}><GIcon.Trash /></button>
                  </div>
                );
              })}
              <button onClick={()=>openModal("expense")} style={{ ...primaryBtn, width:"100%", marginTop:5 }}><span style={{display:"inline-flex",verticalAlign:"middle",marginLeft:6}}><GIcon.Plus /></span>إضافة مصروف</button>
            </div>
          )}

          {/* ===== المهام ===== */}
          {groupTab===3 && (
            <div style={{ padding:"20px", maxWidth:640, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
              {g.tasks.length > 0 && (
                <div style={{ ...cardWrap, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:8 }}>
                    <span style={{ color:C.sub, fontWeight:600 }}>التقدم</span>
                    <span style={{ color:C.green, fontWeight:700 }}>{g.tasks.filter(t=>t.done).length}/{g.tasks.length}</span>
                  </div>
                  <div style={{ height:6, background:C.card, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(g.tasks.filter(t=>t.done).length/g.tasks.length)*100}%`, background:`linear-gradient(90deg,${C.green},#059669)`, borderRadius:3, transition:"width .4s" }} />
                  </div>
                </div>
              )}
              {g.tasks.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 24px", ...cardWrap, marginBottom:14 }}>
                  <div style={{ color:C.sub, fontSize:14, fontWeight:600, marginBottom:6 }}>لا توجد مهام بعد</div>
                  <div style={{ color:C.faint, fontSize:12 }}>وزّع المهام على الأعضaء وتابع الإنجاز</div>
                </div>
              ) : (
                <div style={{ ...cardWrap, overflow:"hidden", marginBottom:14 }}>
                  {g.tasks.map((task,i)=>{
                    const owner = g.members.find(m=>m.id===task.owner);
                    return (
                      <div key={task.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom: i<g.tasks.length-1?`1px solid ${C.border2}`:"none" }}>
                        <div onClick={()=>toggleTask(task.id)} style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, background: task.done?"rgba(52,211,153,0.15)":C.card, border:`2px solid ${task.done?C.green:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:C.green, transition:"all .15s" }}>{task.done && <GIcon.Check />}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, color: task.done?C.faint:C.text, textDecoration: task.done?"line-through":"none" }}>{task.text}</div>
                          {owner && <div style={{ fontSize:11, color:C.faint, marginTop:3, display:"flex", alignItems:"center", gap:5 }}><GAvatar name={owner.name} initials={owner.initials} color={owner.color} size={16} />{owner.name}</div>}
                        </div>
                        {!task.done && !owner && <span style={{ fontSize:10, color:C.faint, background:C.card, padding:"3px 9px", borderRadius:8, border:`1px solid ${C.border2}` }}>غير مُسند</span>}
                        <button onClick={()=>delTask(task.id)} style={{ background:"none", border:"none", color:C.faint, cursor:"pointer", padding:4, display:"flex" }}><GIcon.Trash /></button>
                      </div>
                    );
                  })}
                </div>
              )}
              <button onClick={()=>openModal("task")} style={{ ...primaryBtn, width:"100%" }}><span style={{display:"inline-flex",verticalAlign:"middle",marginLeft:6}}><GIcon.Plus /></span>إضافة مهمة</button>
            </div>
          )}

          {/* ===== شات مرن ===== */}
          {groupTab===4 && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
              <div style={{ flex:1, overflow:"auto", padding:"20px", maxWidth:640, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
                {chatMsgs.length === 0 ? (
                  <div style={{ paddingTop:10 }}>
                    <div style={{ textAlign:"center", marginBottom:24 }}>
                      <div style={{ width:54, height:54, borderRadius:15, background:C.grad, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:"0 6px 22px rgba(42,94,216,0.4)" }}>
                        <div style={{ transform:"scale(1.5)" }}><GIcon.Spark /></div>
                      </div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:5 }}>مرن — مساعد رحلتكم</div>
                      <div style={{ fontSize:13, color:C.sub, lineHeight:1.6, maxWidth:340, margin:"0 auto" }}>أعرف كل تفاصيل مجموعتكم. اطلب جدولاً، اقتراح مطاعم، توزيع مصاريف، أو أي شيء.</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {[
                        `نظّم جدولاً مثالياً لـ ${g.days} أيام في ${g.dest||g.type}`,
                        `اقترح أفضل ${g.type==="عزيمة"?"أطباق":"مطاعم"} مع الأسعار التقريبية`,
                        "وش الأغراض اللي نحتاج نجهّزها؟",
                        g.dest ? `وش طقس ${g.dest} هالأيام؟` : "نصائح مهمة قبل الانطلاق",
                      ].map((q,i)=>(
                        <button key={i} onClick={()=>askMarn(q)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"13px 15px", cursor:"pointer", fontFamily:"inherit", fontSize:13, color:C.text, textAlign:isRTL?"right":"left", display:"flex", alignItems:"center", gap:9, boxShadow:C.shadowSm }}>
                          <span style={{ color:C.blue, flexShrink:0 }}><GIcon.Spark /></span>
                          <span style={{ flex:1 }}>{q}</span>
                          <span style={{ color:C.faint }}><GIcon.Arrow /></span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {chatMsgs.map((msg,i)=>(
                      msg.role === "user" ? (
                        <div key={i} style={{ alignSelf:"flex-end", maxWidth:"82%", background:C.grad, color:"#fff", padding:"11px 15px", borderRadius:"16px 16px 4px 16px", fontSize:14, fontWeight:500, lineHeight:1.5, boxShadow:"0 2px 10px rgba(42,94,216,0.3)" }}>{msg.text}</div>
                      ) : (
                        <div key={i} style={{ alignSelf:"flex-start", maxWidth:"88%", display:"flex", gap:9 }}>
                          <div style={{ width:30, height:30, borderRadius:9, background:C.grad, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, marginTop:2 }}><GIcon.Spark /></div>
                          <div style={{ background:C.surface, border:`1px solid ${C.border}`, padding:"12px 15px", borderRadius:"4px 16px 16px 16px", fontSize:14, color:C.text, lineHeight:1.7, whiteSpace:"pre-wrap", boxShadow:C.shadowSm }}>{msg.text}</div>
                        </div>
                      )
                    ))}
                    {chatLoading && (
                      <div style={{ alignSelf:"flex-start", display:"flex", gap:9, alignItems:"center" }}>
                        <div style={{ width:30, height:30, borderRadius:9, background:C.grad, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}><GIcon.Spark /></div>
                        <div style={{ background:C.surface, border:`1px solid ${C.border}`, padding:"14px 18px", borderRadius:"4px 16px 16px 16px", display:"flex", gap:5 }}>
                          {[0,1,2].map(d=><div key={d} style={{ width:7, height:7, borderRadius:"50%", background:C.blue, opacity:0.6, animation:`gPulse 1.2s ${d*0.2}s infinite` }} />)}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>
              {/* إدخال */}
              <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`, background:C.bg2, flexShrink:0 }}>
                <div style={{ maxWidth:640, margin:"0 auto", display:"flex", gap:10, alignItems:"center" }}>
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askMarn()} placeholder="اسأل مرن عن رحلتكم..." style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"12px 16px", color:C.text, fontSize:14, fontFamily:"inherit", outline:"none", direction:isRTL?"rtl":"ltr" }} />
                  <button onClick={()=>askMarn()} disabled={!chatInput.trim()||chatLoading} style={{ width:46, height:46, background: chatInput.trim()?C.grad:C.card, border: chatInput.trim()?"none":`1px solid ${C.border}`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color: chatInput.trim()?"#fff":C.faint, flexShrink:0, boxShadow: chatInput.trim()?"0 2px 12px rgba(42,94,216,0.35)":"none" }}><GIcon.Send /></button>
                </div>
              </div>
              <style>{`@keyframes gPulse{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
            </div>
          )}
        </div>

        {/* ===== Modal الإضافة ===== */}
        {modal && (
          <>
            <div onClick={()=>setModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, backdropFilter:"blur(2px)" }} />
            <div style={{ position:"fixed", left:"50%", bottom:0, transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.bg2, borderRadius:"20px 20px 0 0", border:`1px solid ${C.border}`, borderBottom:"none", zIndex:201, padding:"22px 20px", boxShadow:"0 -8px 40px rgba(0,0,0,0.4)", direction:isRTL?"rtl":"ltr", fontFamily }}>
              <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 18px" }} />
              <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:18 }}>
                {modal==="member"?"إضافة عضو":modal==="expense"?"إضافة مصروف":modal==="task"?"إضافة مهمة":"إضافة نشاط"}
              </div>

              {modal==="member" && (<>
                <input autoFocus value={mForm.name||""} onChange={e=>setMForm({...mForm,name:e.target.value})} placeholder="اسم العضو" style={{ ...inputStyle, marginBottom:10 }} />
                <input value={mForm.budget||""} onChange={e=>setMForm({...mForm,budget:e.target.value})} type="number" placeholder="ميزانيته (اختياري)" style={inputStyle} />
              </>)}

              {modal==="expense" && (<>
                <input autoFocus value={mForm.desc||""} onChange={e=>setMForm({...mForm,desc:e.target.value})} placeholder="وصف المصروف" style={{ ...inputStyle, marginBottom:10 }} />
                <input value={mForm.amount||""} onChange={e=>setMForm({...mForm,amount:e.target.value})} type="number" placeholder="المبلغ (ريال)" style={{ ...inputStyle, marginBottom:10 }} />
                <select value={mForm.paidBy||""} onChange={e=>setMForm({...mForm,paidBy:e.target.value})} style={{ ...inputStyle, marginBottom:10, color: mForm.paidBy?C.text:C.faint }}>
                  <option value="">من دفع؟</option>
                  {g.members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {Object.keys(G_CATS).map(c=>(
                    <button key={c} onClick={()=>setMForm({...mForm,cat:c})} style={{ display:"flex", alignItems:"center", gap:5, background: mForm.cat===c?`${G_CATS[c].color}20`:C.card, border:`1px solid ${mForm.cat===c?G_CATS[c].color:C.border}`, color: mForm.cat===c?G_CATS[c].color:C.sub, borderRadius:9, padding:"7px 11px", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{G_CATS[c].icon}{c}</button>
                  ))}
                </div>
              </>)}

              {modal==="task" && (<>
                <input autoFocus value={mForm.text||""} onChange={e=>setMForm({...mForm,text:e.target.value})} placeholder="المهمة المطلوبة" style={{ ...inputStyle, marginBottom:10 }} />
                <select value={mForm.owner||""} onChange={e=>setMForm({...mForm,owner:e.target.value})} style={{ ...inputStyle, color: mForm.owner?C.text:C.faint }}>
                  <option value="">أسند لـ... (اختياري)</option>
                  {g.members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </>)}

              {modal==="activity" && (<>
                <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:C.faint, marginBottom:5 }}>اليوم</div>
                    <input value={mForm.day||1} onChange={e=>setMForm({...mForm,day:e.target.value})} type="number" min="1" max={g.days} style={inputStyle} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, color:C.faint, marginBottom:5 }}>الوقت</div>
                    <input value={mForm.time||""} onChange={e=>setMForm({...mForm,time:e.target.value})} type="time" style={inputStyle} />
                  </div>
                </div>
                <input autoFocus value={mForm.act||""} onChange={e=>setMForm({...mForm,act:e.target.value})} placeholder="النشاط" style={{ ...inputStyle, marginBottom:10 }} />
                <input value={mForm.note||""} onChange={e=>setMForm({...mForm,note:e.target.value})} placeholder="ملاحظة (اختياري)" style={inputStyle} />
              </>)}

              <div style={{ display:"flex", gap:10, marginTop:18 }}>
                <button onClick={()=>setModal(null)} style={{ flex:1, background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, padding:"13px", color:C.sub, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>إلغاء</button>
                <button onClick={saveModal} style={{ ...primaryBtn, flex:2 }}>حفظ</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}


/* ============ MicButton ============ */
function MicButton({ T, isRTL, onResult }) {
  const [listening, setListening] = React.useState(false);
  const recRef = React.useRef(null);

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = isRTL ? "ar-SA" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => { onResult(e.results[0][0].transcript + " "); };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stop = () => { recRef.current?.stop(); setListening(false); };

  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return null;

  return (
    <button
      onClick={listening ? stop : start}
      style={{
        background: listening ? "rgba(255,59,48,0.12)" : "transparent",
        color: listening ? "#ff3b30" : T.faint,
        border: "none", borderRadius: 8,
        width: 32, height: 32, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: listening ? "micPulse 1.4s infinite" : "none",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={listening ? "#ff3b30" : "currentColor"}>
        <rect x="9" y="2" width="6" height="12" rx="3"/>
        <path d="M5 10a7 7 0 0014 0M12 18v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

/* ============ FollowUps ============ */
function FollowUps({ suggestions, T, F, onSelect, thinking }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => !thinking && onSelect(s)}
          style={{
            background: T.pillFill, color: T.sub,
            border: `1px solid ${T.line}`,
            borderRadius: 20, padding: "6px 13px",
            fontSize: F.base - 2, fontWeight: 500,
            cursor: thinking ? "default" : "pointer",
            fontFamily: "inherit", opacity: thinking ? 0.5 : 1,
            transition: "all .15s",
          }}
        >{s}</button>
      ))}
    </div>
  );
}

/* ============ ProfileSetup ============ */
function ProfileSetup({ T, F, isRTL, onSave }) {
  const [name, setName] = React.useState("");
  const [job, setJob] = React.useState("");
  const [interests, setInterests] = React.useState("");

  const inputStyle = {
    width: "100%", background: T.inputBg || T.glassFill,
    border: `1px solid ${T.line}`, borderRadius: 9,
    padding: "10px 13px", fontSize: F.base, color: T.text,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    direction: isRTL ? "rtl" : "ltr",
  };
  const labelStyle = { fontSize: F.base - 1, color: T.sub, marginBottom: 5, display: "block" };

  return (
    <div style={{
      position: "fixed", inset: 0, background: T.modalBg,
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: T.cardBg || T.glassFill,
        border: `1px solid ${T.glassBorder || T.line}`,
        borderRadius: 18, padding: 28, width: "100%", maxWidth: 400,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: F.h2, fontWeight: 700, color: T.text, marginBottom: 6 }}>
          {isRTL ? "مرحباً بك في مرن" : "Welcome to Marn"}
        </div>
        <div style={{ fontSize: F.base - 1, color: T.sub, marginBottom: 22 }}>
          {isRTL ? "أخبرنا عنك لنخصص تجربتك" : "Tell us about yourself"}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{isRTL ? "الاسم" : "Name"}</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder={isRTL ? "اسمك..." : "Your name..."} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{isRTL ? "المهنة" : "Job"}</label>
          <input value={job} onChange={e => setJob(e.target.value)} style={inputStyle} placeholder={isRTL ? "مهنتك..." : "Your job..."} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>{isRTL ? "اهتماماتك" : "Interests"}</label>
          <input value={interests} onChange={e => setInterests(e.target.value)} style={inputStyle} placeholder={isRTL ? "رياضة، تقنية، طبخ..." : "Sports, tech, cooking..."} />
        </div>
        <button onClick={() => onSave({ name: name.trim(), job: job.trim(), interests: interests.trim() })}
          style={{
            width: "100%", background: T.text, color: T.pageBg || "#fff",
            border: "none", borderRadius: 11, padding: 13,
            fontSize: F.base, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >{isRTL ? "ابدأ الآن" : "Get Started"}</button>
      </div>
    </div>
  );
}
