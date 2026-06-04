import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { TRANSLATIONS } from "./i18n.js";


/* ===== شعار مرن ===== */




/* ============ ثوابت ============ */
/* ===== شعارات مرن - فاتح للداكن، داكن للفاتح ===== */
const LOGO_LIGHT_XS = "data:image/png;base64,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";  // أبيض/فاتح → يظهر على خلفية داكنة
const LOGO_LIGHT_SM = "data:image/png;base64,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";
const LOGO_DARK_XS  = "data:image/png;base64,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";   // أزرق داكن → يظهر على خلفية فاتحة
const LOGO_DARK_SM  = "data:image/png;base64,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";

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
    // SIGNAL — فاتح
    pageBg: "#ffffff",
    sidebarBg: "#fafafa",
    text: "#111827",
    sub: "#6b7280",
    faint: "#9ca3af",
    glassFill: "#ffffff",
    glassEdge: "rgba(0,0,0,0.04)",
    glassBorder: "#f3f4f6",
    glassShadow: "0 1px 2px rgba(0,0,0,0.03)",
    headerBg: "rgba(255,255,255,0.98)",
    composerBg: "rgba(255,255,255,0.98)",
    userFill: "#111827",
    userText: "#ffffff",
    pillFill: "#f9fafb",
    pillActive: "#ffffff",
    line: "#f3f4f6",
    hover: "#f9fafb",
    dotIdle: "#d1d5db",
    modalBg: "rgba(0,0,0,0.35)",
    cardBg: "#ffffff",
    inputBg: "#ffffff",
    accent: "#111827",
  },
  dark: {
    // SIGNAL — داكن
    pageBg: "#111111",
    sidebarBg: "#0a0a0a",
    text: "#f9fafb",
    sub: "#9ca3af",
    faint: "#6b7280",
    glassFill: "#1a1a1a",
    glassEdge: "rgba(255,255,255,0.04)",
    glassBorder: "#272727",
    glassShadow: "0 1px 2px rgba(0,0,0,0.2)",
    headerBg: "rgba(17,17,17,0.98)",
    composerBg: "rgba(17,17,17,0.98)",
    userFill: "#f9fafb",
    userText: "#111111",
    pillFill: "#1a1a1a",
    pillActive: "#272727",
    line: "#272727",
    hover: "#1a1a1a",
    dotIdle: "#3f3f3f",
    modalBg: "rgba(0,0,0,0.7)",
    cardBg: "#1a1a1a",
    inputBg: "#1a1a1a",
    accent: "#f9fafb",
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
              background: T.text,
              color: T.pageBg,
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
                    background: draft.trim() ? T.text : T.pillFill,
                    color: draft.trim() ? T.pageBg||"#fff" : T.faint,
                    border: "none", borderRadius: 9,
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
function Sidebar({ T, t, F, isMobile, isRTL, sidebarOpen, setSidebarOpen, tab, setTab,
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
            background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            boxShadow: "none", padding: 0,
          }}><img src={T.pageBg === "#ffffff" ? LOGO_DARK_XS : LOGO_LIGHT_XS} alt="مرن" style={{ width:"100%", height:"100%", objectFit:"contain" }}/></div>
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
        <button onClick={newChat} style={{
          width: "100%",
          background: T.text,
          color: T.pageBg||"#fff", border: "none", borderRadius: 9,
          padding: "10px 14px", fontSize: F.base - 0.5, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          boxShadow: "none",
          transition: "opacity .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          <Icon.Plus /> {t.newChat}
        </button>
      </div>

      {/* التبويبات */}
      <div style={{ display: "flex", padding: "0 12px 12px", gap: 4 }}>
        {[
          { id: "chats", label: t.chats, icon: <Icon.Chat />, count: sortedChats.length },
          { id: "favs", label: t.favs, icon: <Icon.Star />, count: favs.length },
          { id: "settings", label: t.settings, icon: <Icon.Settings /> },
        ].map(tt => (
          <button key={tt.id} onClick={() => setTab(tt.id)} style={{
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
        background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        boxShadow: "none",
      }}><img src={T.pageBg === "#ffffff" ? LOGO_DARK_SM : LOGO_LIGHT_SM} alt="مرن" style={{ width:"100%", height:"100%", objectFit:"contain" }}/></div>
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
            background: T.userFill, color: T.userText,
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
    <Glass T={T} radius={14} style={{ padding: 20 }}>


      {/* الهيدر */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            {card.kicker && <div style={{ color: T.faint, fontSize: F.label - 1, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{card.kicker}</div>}
            {searched && (
              <div style={{
                fontSize: F.label - 1, fontWeight: 500, color: T.faint,
                background: T.pillFill, padding: "2px 7px",
                borderRadius: 4, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 4,
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
              borderBottom: `1.5px solid ${i === activeTab ? T.text : "transparent"}`,
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
        <div style={{ height:"100%", width:`${Math.min((v/max)*100,100)}%`, background:color, borderRadius:2, boxShadow:`0 0 8px ${color}40` }}/>
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
