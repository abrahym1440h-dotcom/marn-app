import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { TRANSLATIONS } from "./i18n.js";

/* ============ ثوابت ============ */
const STORAGE_KEY = "marn_chats_v2";
const SETTINGS_KEY = "marn_settings_v2";
const FAV_KEY = "marn_favs_v2";
const VERSION = "2.1";

const ACCENTS = {
  sport: "#34c759",
  knowledge: "#0a84ff",
  history: "#bf5af2",
  food: "#ff9500",
};

/* ============ الثيمات ============ */
const THEMES = {
  light: {
    pageBg: "linear-gradient(160deg, #f0f3f8 0%, #e7ecf3 50%, #e1eaf3 100%)",
    sidebarBg: "rgba(255,255,255,0.7)",
    text: "#1d1d1f",
    sub: "#5b5b60",
    faint: "#9b9ba0",
    glassFill: "linear-gradient(150deg, rgba(255,255,255,0.65), rgba(255,255,255,0.25))",
    glassEdge: "rgba(255,255,255,0.95)",
    glassBorder: "rgba(255,255,255,0.65)",
    glassShadow: "0 8px 30px rgba(40,50,90,0.14), inset 0 1px 1px rgba(255,255,255,0.9)",
    headerBg: "rgba(255,255,255,0.6)",
    composerBg: "rgba(255,255,255,0.55)",
    userFill: "linear-gradient(150deg, rgba(10,132,255,0.95), rgba(10,132,255,0.78))",
    userText: "#fff",
    pillFill: "rgba(255,255,255,0.55)",
    pillActive: "rgba(255,255,255,0.95)",
    line: "rgba(0,0,0,0.07)",
    hover: "rgba(0,0,0,0.04)",
    dotIdle: "#b8b8bd",
    modalBg: "rgba(0,0,0,0.45)",
  },
  dark: {
    pageBg: "linear-gradient(160deg, #0a0a0c 0%, #131318 50%, #0c0c11 100%)",
    sidebarBg: "rgba(16,16,20,0.85)",
    text: "#f5f5f7",
    sub: "#a1a1a8",
    faint: "#636366",
    glassFill: "linear-gradient(150deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
    glassEdge: "rgba(255,255,255,0.5)",
    glassBorder: "rgba(255,255,255,0.16)",
    glassShadow: "0 8px 36px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)",
    headerBg: "rgba(18,18,22,0.6)",
    composerBg: "rgba(14,14,18,0.6)",
    userFill: "linear-gradient(150deg, rgba(10,132,255,0.95), rgba(10,132,255,0.75))",
    userText: "#fff",
    pillFill: "rgba(255,255,255,0.08)",
    pillActive: "rgba(255,255,255,0.22)",
    line: "rgba(255,255,255,0.08)",
    hover: "rgba(255,255,255,0.05)",
    dotIdle: "#48484a",
    modalBg: "rgba(0,0,0,0.65)",
  },
};

const FONT_SIZES = {
  small: { base: 13, h1: 22, h2: 18, label: 11 },
  medium: { base: 14.5, h1: 24, h2: 20, label: 12 },
  large: { base: 16, h1: 27, h2: 22, label: 13 },
};

/* ============ مكوّن الزجاج ============ */
function Glass({ T, children, style, radius = 22, onClick, className = "" }) {
  return (
    <div onClick={onClick} className={`liquid ${className}`} style={{
      position: "relative", borderRadius: radius, background: T.glassFill,
      border: `1px solid ${T.glassBorder}`, boxShadow: T.glassShadow,
      backdropFilter: "blur(22px) saturate(180%)",
      WebkitBackdropFilter: "blur(22px) saturate(180%)",
      overflow: "hidden", ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: 1.5,
        background: `linear-gradient(90deg, transparent, ${T.glassEdge}, transparent)`,
        pointerEvents: "none",
      }} />
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
  const [activeChat, setActiveChat] = useState(null);
  const [favs, setFavs] = useState([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { title, action }
  const [toast, setToast] = useState(null);

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
    } catch {}
  }, []);

  /* ===== الحفظ ===== */
  useEffect(() => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {} }, [settings]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); } catch {} }, [chats]);
  useEffect(() => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch {} }, [favs]);

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
  const sortedChats = useMemo(() => Object.values(chats).sort((a, b) => b.createdAt - a.createdAt), [chats]);

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
  const send = async (text) => {
    const q = (text ?? draft).trim();
    if (!q || thinking) return;

    let chatId = activeChat;
    if (!chatId) {
      chatId = "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      setChats(prev => ({
        ...prev,
        [chatId]: { id: chatId, title: q.slice(0, 40), messages: [], createdAt: Date.now() }
      }));
      setActiveChat(chatId);
    }

    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...(prev[chatId]?.messages || []), { role: "user", text: q, at: Date.now() }],
      }
    }));
    setDraft("");
    setThinking(true);

    const history = (chats[chatId]?.messages || []).slice(-6).map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.role === "user" ? m.text : (m.card?.title || ""),
    }));

    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history, lang: settings.lang }),
      });
      let data = null;
      try { data = await r.json(); } catch {}

      setChats(prev => {
        const cur = prev[chatId];
        if (!cur) return prev;
        let newMsg;
        if (r.ok && data?.card) {
          newMsg = { role: "card", card: data.card, searched: data.searched, at: Date.now() };
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
    }
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
      />

      {/* المنطقة الرئيسية */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* الهيدر */}
        <header style={{
          flexShrink: 0, position: "relative", zIndex: 5,
          background: T.headerBg, borderBottom: `1px solid ${T.line}`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={iconBtnStyle(T)}>
                <Icon.Menu />
              </button>
            )}
            <div style={{ flex: 1, fontSize: F.base + 1.5, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeChat ? chats[activeChat]?.title : t.appName}
            </div>
            <button onClick={newChat} style={iconBtnStyle(T)} title={t.newChat}>
              <Icon.Plus />
            </button>
          </div>
        </header>

        {/* خيط الرسائل */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 14px", position: "relative" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 0 16px" }}>
            {empty && (
              <EmptyState T={T} t={t} F={F} send={send} settings={settings} />
            )}

            {currentMessages.map((m, i) => (
              <MessageItem key={i} m={m} T={T} t={t} F={F}
                isRTL={isRTL} lang={settings.lang}
                isFav={isFav} toggleFav={() => toggleFav(m.text, activeChat)}
                copyCard={copyCard} activeChat={activeChat}
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
            <Glass T={T} radius={16} style={{ padding: isRTL ? "5px 5px 5px 16px" : "5px 16px 5px 5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                  placeholder={t.placeholder}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: T.text, fontSize: F.base + 0.5, padding: "11px 2px", fontFamily: "inherit",
                    direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left",
                  }}
                />
                <button onClick={() => send()} disabled={!draft.trim() || thinking}
                  style={{
                    background: draft.trim() ? ACCENTS.knowledge : T.pillFill,
                    color: "#fff", border: "none", borderRadius: 11,
                    width: 40, height: 40, fontSize: 16,
                    cursor: draft.trim() ? "pointer" : "default",
                    fontFamily: "inherit", transition: "background .2s", flexShrink: 0,
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: isRTL ? "scaleX(-1)" : "none",
                  }}>
                  <Icon.Send />
                </button>
              </div>
            </Glass>
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
        .liquid { transition: transform .25s cubic-bezier(.2,.7,.3,1); }
        .press:hover { transform: translateY(-1px); }
        .press:active { transform: scale(.96); }
        .card-in { animation: ci .55s cubic-bezier(.22,.68,.28,1) both; }
        @keyframes ci { from{opacity:0;transform:translateY(16px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
        .tab-in { animation: ti .4s cubic-bezier(.22,.68,.28,1) both; }
        @keyframes ti { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translate(-50%,10px)} to{opacity:1;transform:translate(-50%,0)} }
        input::placeholder { color: ${T.faint} }
        @keyframes bd { 0%,80%,100%{transform:scale(.5);opacity:.4} 40%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar { width: 6px; height: 0; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

/* ============ الشريط الجانبي ============ */
function Sidebar({ T, t, F, isMobile, isRTL, sidebarOpen, setSidebarOpen, tab, setTab,
  sortedChats, activeChat, openChat, deleteChat, favs, send, newChat,
  settings, setSettings, effectiveMode, clearAllChats, clearAllFavs, exportChats }) {

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
      <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 16,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
          }}>{t.appName.charAt(0)}</div>
          <div style={{ fontSize: F.base + 2.5, fontWeight: 700 }}>{t.appName}</div>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={iconBtnStyle(T)}>
            <Icon.Close />
          </button>
        )}
      </div>

      {/* محادثة جديدة */}
      <div style={{ padding: "0 12px 12px" }}>
        <button onClick={newChat} style={{
          width: "100%",
          background: `linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
          color: "#fff", border: "none", borderRadius: 12,
          padding: "11px 14px", fontSize: F.base, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 4px 14px rgba(10,132,255,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
        }}>
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
          sortedChats.length === 0 ? (
            <EmptyTab T={T} F={F} text={t.noChats} />
          ) : sortedChats.map(c => (
            <ChatItem key={c.id} c={c} T={T} F={F} isActive={activeChat === c.id}
              onOpen={() => openChat(c.id)} onDelete={() => deleteChat(c.id)} lang={settings.lang} />
          ))
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
          />
        )}
      </div>
    </aside>
  );
}

/* ============ عنصر المحادثة ============ */
function ChatItem({ c, T, F, isActive, onOpen, onDelete, lang }) {
  return (
    <div onClick={onOpen} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 12px", margin: "1px 0", borderRadius: 9, cursor: "pointer",
      background: isActive ? T.pillActive : "transparent", transition: "background .15s",
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
function SettingsPanel({ T, t, F, settings, setSettings, effectiveMode, clearAllChats, clearAllFavs, exportChats }) {
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
function EmptyState({ T, t, F, send, settings }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 0 26px" }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18, margin: "0 auto 18px",
        background: `linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800, fontSize: 30,
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 8px 24px rgba(124,58,237,0.3)",
      }}>{t.appName.charAt(0)}</div>
      <h1 style={{ fontSize: F.h1, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.6px" }}>{t.tagline}</h1>
      <p style={{ fontSize: F.base, color: T.sub, margin: "0 0 24px", lineHeight: 1.6 }}>{t.askAnything}</p>
      {settings.showSuggestions && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {t.suggestions.map(s => (
            <Glass key={s} T={T} radius={999} onClick={() => send(s)} className="press"
              style={{ cursor: "pointer", padding: "10px 16px" }}>
              <span style={{ fontSize: F.base - 0.5, fontWeight: 500 }}>{s}</span>
            </Glass>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ عنصر الرسالة ============ */
function MessageItem({ m, T, t, F, isRTL, lang, isFav, toggleFav, copyCard, activeChat }) {
  const timeStr = m.at ? formatTime(m.at, lang) : "";

  if (m.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 14, alignItems: "flex-start", gap: 6 }}>
        <button onClick={toggleFav} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: isFav(m.text) ? "#ffb800" : T.faint, padding: 6, marginTop: 4,
        }}>
          <Icon.Star filled={isFav(m.text)} />
        </button>
        <div>
          <div style={{
            background: T.userFill, color: T.userText,
            borderRadius: "18px 18px 5px 18px", padding: "11px 16px",
            fontSize: F.base, fontWeight: 500, maxWidth: "100%", lineHeight: 1.5,
            boxShadow: "0 4px 14px rgba(10,132,255,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
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
      <BigCard card={m.card} T={T} t={t} F={F} searched={m.searched} onCopy={() => copyCard(m.card)} />
      {timeStr && <div style={{ fontSize: F.label - 1, color: T.faint, marginTop: 4 }}>{timeStr}</div>}
    </div>
  );
}

/* ============ البطاقة الكبيرة ============ */
function BigCard({ card, T, t, F, searched, onCopy }) {
  const a = ACCENTS[card.accent] || ACCENTS.knowledge;
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(card.tabs) ? card.tabs : [];
  const active = tabs[activeTab] || {};

  return (
    <Glass T={T} radius={22} style={{ padding: 20 }}>
      <div style={{
        position: "absolute", top: -90, right: -60, width: 260, height: 190,
        background: a, opacity: 0.15, filter: "blur(75px)", pointerEvents: "none",
      }} />

      {/* الهيدر */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            {card.kicker && <div style={{ color: a, fontSize: F.label, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{card.kicker}</div>}
            {searched && (
              <div style={{
                fontSize: F.label - 1, fontWeight: 600, color: "#34c759",
                background: "rgba(52,199,89,0.12)", padding: "2px 7px",
                borderRadius: 6, display: "flex", alignItems: "center", gap: 4,
              }}>
                <Icon.Search /> {t.liveSearch}
              </div>
            )}
          </div>
          <button onClick={onCopy} title={t.copy} style={{
            background: "transparent", border: "none", color: T.faint,
            cursor: "pointer", padding: 4, borderRadius: 5,
            display: "flex", alignItems: "center", transition: "color .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.text}
          onMouseLeave={e => e.currentTarget.style.color = T.faint}>
            <Icon.Copy />
          </button>
        </div>
        <h2 style={{ fontSize: F.h2, fontWeight: 700, margin: 0, letterSpacing: "-0.4px", lineHeight: 1.3 }}>{card.title}</h2>
        {card.sub && <div style={{ color: T.sub, fontSize: F.base - 1, marginTop: 5, lineHeight: 1.5 }}>{card.sub}</div>}
      </div>

      {tabs.length > 1 && (
        <div style={{
          position: "relative", display: "flex", gap: 3,
          background: T.pillFill, borderRadius: 11, padding: 3,
          marginBottom: 16, border: `1px solid ${T.line}`, overflowX: "auto",
        }}>
          {tabs.map((tt, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              flex: "1 0 auto",
              background: i === activeTab ? T.pillActive : "transparent",
              border: "none", borderRadius: 8, padding: "8px 12px",
              color: i === activeTab ? T.text : T.sub,
              fontSize: F.label + 0.5, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all .2s", whiteSpace: "nowrap",
              boxShadow: i === activeTab ? "0 1px 4px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.5)" : "none",
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

/* ============ محتوى التبويب ============ */
function TabContent({ tab, a, T, F }) {
  const d = tab.data || {};
  switch (tab.type) {
    case "stats":
      return (
        <div>
          {d.intro && <p style={{ color: T.sub, fontSize: F.base - 1, margin: "0 0 14px", lineHeight: 1.6 }}>{d.intro}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
            {(d.items || []).map((s, i) => (
              <div key={i} style={{
                background: T.pillFill, borderRadius: 12, padding: "12px 10px",
                border: `1px solid ${T.line}`, textAlign: "center",
              }}>
                <div style={{ color: a, fontSize: F.h2, fontWeight: 800, lineHeight: 1.1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: F.label, fontWeight: 600, color: T.text, marginBottom: 2 }}>{s.label}</div>
                {s.hint && <div style={{ fontSize: F.label - 1, color: T.sub }}>{s.hint}</div>}
              </div>
            ))}
          </div>
        </div>
      );

    case "steps":
      return (
        <div>
          {d.intro && <p style={{ color: T.sub, fontSize: F.base - 1, margin: "0 0 12px", lineHeight: 1.6 }}>{d.intro}</p>}
          {(d.steps || []).map((s, i, arr) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "12px 0",
              borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.line}`,
            }}>
              <div style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                background: `${a}22`, color: a,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: F.label + 1,
              }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: F.base - 0.5, marginBottom: 3 }}>{s.t}</div>
                {s.d && <div style={{ color: T.sub, fontSize: F.base - 1.5, lineHeight: 1.6 }}>{s.d}</div>}
              </div>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <div>
          {d.intro && <p style={{ color: T.sub, fontSize: F.base - 1, margin: "0 0 12px", lineHeight: 1.6 }}>{d.intro}</p>}
          {(d.items || []).map((x, i, arr) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 11, padding: "11px 0",
              borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.line}`,
              fontSize: F.base - 0.5, lineHeight: 1.6,
            }}>
              <span style={{ color: a, fontSize: 18, lineHeight: 1, marginTop: 2 }}>•</span>
              <span>{typeof x === "string" ? x : (x.text || JSON.stringify(x))}</span>
            </div>
          ))}
        </div>
      );

    case "timeline":
      return (
        <div style={{ position: "relative", paddingRight: 20 }}>
          <div style={{ position: "absolute", right: 5, top: 6, bottom: 6, width: 2, background: `${a}33` }} />
          {(d.events || []).map((e, i, arr) => (
            <div key={i} style={{ position: "relative", marginBottom: i === arr.length - 1 ? 0 : 18 }}>
              <div style={{
                position: "absolute", right: -19, top: 4,
                width: 11, height: 11, borderRadius: "50%",
                background: a, border: `3px solid ${T.text === "#f5f5f7" ? "#16181d" : "#fff"}`,
                boxShadow: `0 0 8px ${a}88`,
              }} />
              <div style={{ color: a, fontWeight: 700, fontSize: F.base - 1.5 }}>{e[0]}</div>
              <div style={{ fontWeight: 600, fontSize: F.base - 0.5, margin: "2px 0" }}>{e[1]}</div>
              {e[2] && <div style={{ color: T.sub, fontSize: F.base - 1.5, lineHeight: 1.6 }}>{e[2]}</div>}
            </div>
          ))}
        </div>
      );

    case "compare":
      return (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: F.base - 1, minWidth: 280 }}>
            <thead>
              <tr>{(d.cols || []).map((c, i) => (
                <th key={i} style={{
                  textAlign: "right", padding: "8px 10px",
                  color: i === 0 ? T.sub : a, fontWeight: 700, fontSize: F.label,
                }}>{c}</th>
              ))}</tr>
            </thead>
            <tbody>
              {(d.rows || []).map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: "12px 10px",
                    color: ci === 0 ? T.text : T.sub,
                    fontWeight: ci === 0 ? 600 : 400,
                    borderTop: `1px solid ${T.line}`,
                  }}>{cell}</td>
                ))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "facts":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
          {(d.items || []).map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 12px", borderRadius: 10,
              background: T.pillFill, border: `1px solid ${T.line}`,
              fontSize: F.base - 1,
            }}>
              <span style={{ fontSize: 18 }}>{f.icon || "•"}</span>
              <span style={{ flex: 1 }}>{f.text}</span>
            </div>
          ))}
        </div>
      );

    default:
      return <p style={{ color: T.text, lineHeight: 1.9, margin: 0, fontSize: F.base - 0.5, whiteSpace: "pre-wrap" }}>{d.body}</p>;
  }
}

/* ============ دوال مساعدة ============ */
function iconBtnStyle(T) {
  return {
    background: T.pillFill, color: T.text, border: `1px solid ${T.line}`,
    borderRadius: 10, width: 38, height: 38, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit", transition: "background .2s",
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
