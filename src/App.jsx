import React, { useState, useRef, useEffect, useCallback } from "react";

/* ============ ثوابت التطبيق ============ */
const APP_NAME = "مرن";
const APP_TAGLINE = "إجابة واحدة، تجمع لك كل شيء";
const STORAGE_KEY = "marn_chats_v1";
const SETTINGS_KEY = "marn_settings_v1";
const FAV_KEY = "marn_favs_v1";

const ACCENTS = {
  sport: "#34c759",
  knowledge: "#0a84ff",
  history: "#bf5af2",
  food: "#ff9500",
};

const SUGGESTIONS = [
  "آخر أخبار التقنية اليوم",
  "كيف أسوي قهوة مختصة؟",
  "متى تأسست الدولة السعودية؟",
  "أفضل وجهات سياحية في 2026",
];

/* ============ الثيمات ============ */
const THEMES = {
  light: {
    pageBg: "linear-gradient(160deg, #f0f3f8 0%, #e7ecf3 50%, #e1eaf3 100%)",
    sidebarBg: "rgba(255,255,255,0.7)",
    panelBg: "rgba(255,255,255,0.55)",
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
  },
  dark: {
    pageBg: "linear-gradient(160deg, #0a0a0c 0%, #131318 50%, #0c0c11 100%)",
    sidebarBg: "rgba(16,16,20,0.85)",
    panelBg: "rgba(20,20,26,0.7)",
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
  },
};

/* ============ مكوّن الزجاج السائل ============ */
function Glass({ T, children, style, radius = 22, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`liquid ${className}`}
      style={{
        position: "relative",
        borderRadius: radius,
        background: T.glassFill,
        border: `1px solid ${T.glassBorder}`,
        boxShadow: T.glassShadow,
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        overflow: "hidden",
        ...style,
      }}
    >
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
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

/* ============ التطبيق الرئيسي ============ */
export default function App() {
  // الحالة العامة
  const [mode, setMode] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("chats"); // chats | favs | settings
  const [isMobile, setIsMobile] = useState(false);

  // البيانات المحفوظة
  const [chats, setChats] = useState({});  // { id: {id, title, messages, createdAt} }
  const [activeChat, setActiveChat] = useState(null);
  const [favs, setFavs] = useState([]); // [{q, chatId}]

  // الكتابة والإرسال
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const T = THEMES[mode];

  /* ===== التحميل من المتصفح عند البداية ===== */
  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed.mode) setMode(parsed.mode);
      }
      const c = localStorage.getItem(STORAGE_KEY);
      if (c) setChats(JSON.parse(c));
      const f = localStorage.getItem(FAV_KEY);
      if (f) setFavs(JSON.parse(f));
    } catch {}
  }, []);

  /* ===== الحفظ ===== */
  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ mode })); } catch {}
  }, [mode]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); } catch {}
  }, [chats]);

  useEffect(() => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch {}
  }, [favs]);

  /* ===== كشف حجم الشاشة ===== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===== التمرير لأسفل ===== */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChat, thinking, chats]);

  /* ===== الإجراءات ===== */
  const currentMessages = activeChat ? (chats[activeChat]?.messages || []) : [];
  const empty = currentMessages.length === 0;

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

  const deleteChat = useCallback((id, e) => {
    e?.stopPropagation();
    if (!confirm("حذف هذه المحادثة؟")) return;
    setChats(prev => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    if (activeChat === id) setActiveChat(null);
  }, [activeChat]);

  const clearAll = useCallback(() => {
    if (!confirm("حذف كل المحادثات والمفضلة؟ لا يمكن التراجع.")) return;
    setChats({});
    setFavs([]);
    setActiveChat(null);
  }, []);

  const toggleFav = useCallback((q, chatId) => {
    setFavs(prev => {
      const exists = prev.find(f => f.q === q);
      if (exists) return prev.filter(f => f.q !== q);
      return [{ q, chatId, at: Date.now() }, ...prev];
    });
  }, []);

  const isFav = useCallback((q) => favs.some(f => f.q === q), [favs]);

  /* ===== الإرسال ===== */
  const send = async (text) => {
    const q = (text ?? draft).trim();
    if (!q || thinking) return;

    // إنشاء محادثة جديدة أو استخدام الحالية
    let chatId = activeChat;
    if (!chatId) {
      chatId = "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      setChats(prev => ({
        ...prev,
        [chatId]: {
          id: chatId,
          title: q.slice(0, 40),
          messages: [],
          createdAt: Date.now(),
        }
      }));
      setActiveChat(chatId);
    }

    // إضافة رسالة المستخدم
    setChats(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...(prev[chatId]?.messages || []), { role: "user", text: q }],
      }
    }));
    setDraft("");
    setThinking(true);

    // تجهيز التاريخ للذكاء
    const history = (chats[chatId]?.messages || []).slice(-6).map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.role === "user" ? m.text : (m.card?.title || ""),
    }));

    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      let data = null;
      try { data = await r.json(); } catch {}

      setChats(prev => {
        const cur = prev[chatId];
        if (!cur) return prev;
        let newMsg;
        if (r.ok && data?.card) {
          newMsg = { role: "card", card: data.card, searched: data.searched };
        } else {
          const errMsg = (data && (data.error || data.detail))
            ? `${data.error || ""}${data.detail ? " — " + data.detail : ""}`
            : `خطأ ${r.status}`;
          newMsg = { role: "error", text: errMsg };
        }
        return {
          ...prev,
          [chatId]: { ...cur, messages: [...cur.messages, newMsg] }
        };
      });
    } catch (e) {
      setChats(prev => {
        const cur = prev[chatId];
        if (!cur) return prev;
        return {
          ...prev,
          [chatId]: { ...cur, messages: [...cur.messages, { role: "error", text: "تعذّر الاتصال بالشبكة" }] }
        };
      });
    } finally {
      setThinking(false);
    }
  };

  /* ===== ترتيب المحادثات ===== */
  const sortedChats = Object.values(chats).sort((a, b) => b.createdAt - a.createdAt);

  /* ===== العرض ===== */
  return (
    <div dir="rtl" style={{
      height: "100dvh",
      display: "flex",
      position: "relative",
      background: T.pageBg,
      color: T.text,
      fontFamily: "'Noto Sans Arabic','SF Pro Text','Segoe UI',sans-serif",
      WebkitFontSmoothing: "antialiased",
      transition: "background .5s ease, color .4s ease",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ============ الشريط الجانبي ============ */}
      <aside style={{
        position: isMobile ? "fixed" : "relative",
        right: isMobile ? (sidebarOpen ? 0 : "-300px") : 0,
        top: 0,
        bottom: 0,
        width: 280,
        background: T.sidebarBg,
        backdropFilter: "blur(30px) saturate(180%)",
        WebkitBackdropFilter: "blur(30px) saturate(180%)",
        borderLeft: `1px solid ${T.line}`,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        transition: "right .3s cubic-bezier(.22,.68,.28,1)",
        boxShadow: isMobile && sidebarOpen ? "-8px 0 30px rgba(0,0,0,0.2)" : "none",
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
            }}>{APP_NAME.charAt(0)}</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{APP_NAME}</div>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={iconBtnStyle(T)}>
              <Icon.Close />
            </button>
          )}
        </div>

        {/* زر محادثة جديدة */}
        <div style={{ padding: "0 12px 12px" }}>
          <button onClick={newChat} style={{
            width: "100%",
            background: `linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "11px 14px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 14px rgba(10,132,255,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
          }}>
            <Icon.Plus /> محادثة جديدة
          </button>
        </div>

        {/* التبويبات */}
        <div style={{ display: "flex", padding: "0 12px 12px", gap: 4 }}>
          {[
            { id: "chats", label: "المحادثات", icon: <Icon.Chat /> },
            { id: "favs", label: "المفضلة", icon: <Icon.Star /> },
            { id: "settings", label: "الإعدادات", icon: <Icon.Settings /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1,
              background: tab === t.id ? T.pillActive : "transparent",
              color: tab === t.id ? T.text : T.sub,
              border: "none",
              borderRadius: 9,
              padding: "8px 4px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transition: "all .2s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
          {tab === "chats" && (
            sortedChats.length === 0 ? (
              <div style={{ textAlign: "center", color: T.faint, fontSize: 13, padding: "30px 16px" }}>
                لا توجد محادثات بعد
              </div>
            ) : (
              sortedChats.map(c => (
                <div key={c.id} onClick={() => openChat(c.id)} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  margin: "1px 0",
                  borderRadius: 9,
                  cursor: "pointer",
                  background: activeChat === c.id ? T.pillActive : "transparent",
                  transition: "background .15s",
                }}
                onMouseEnter={e => { if (activeChat !== c.id) e.currentTarget.style.background = T.hover; }}
                onMouseLeave={e => { if (activeChat !== c.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.title}
                  </div>
                  <button onClick={(e) => deleteChat(c.id, e)} style={{
                    background: "transparent",
                    border: "none",
                    color: T.faint,
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                  }}>
                    <Icon.Trash />
                  </button>
                </div>
              ))
            )
          )}

          {tab === "favs" && (
            favs.length === 0 ? (
              <div style={{ textAlign: "center", color: T.faint, fontSize: 13, padding: "30px 16px" }}>
                لا توجد أسئلة مفضلة بعد<br/>
                <span style={{ fontSize: 11, opacity: 0.7 }}>اضغط ⭐ بجانب أي سؤال</span>
              </div>
            ) : (
              favs.map(f => (
                <div key={f.q} onClick={() => send(f.q)} style={{
                  padding: "10px 12px",
                  margin: "1px 0",
                  borderRadius: 9,
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ color: "#ffb800" }}>★</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.q}
                  </span>
                </div>
              ))
            )
          )}

          {tab === "settings" && (
            <div style={{ padding: "8px 4px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.faint, padding: "8px 8px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                المظهر
              </div>
              <button onClick={() => setMode(mode === "light" ? "dark" : "light")} style={settingsBtnStyle(T)}>
                {mode === "light" ? <Icon.Moon /> : <Icon.Sun />}
                <span>الوضع {mode === "light" ? "الداكن" : "النهاري"}</span>
              </button>

              <div style={{ fontSize: 11, fontWeight: 700, color: T.faint, padding: "16px 8px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                البيانات
              </div>
              <button onClick={clearAll} style={{ ...settingsBtnStyle(T), color: "#ff453a" }}>
                <Icon.Trash />
                <span>حذف كل المحادثات</span>
              </button>

              <div style={{ fontSize: 11, fontWeight: 700, color: T.faint, padding: "16px 8px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                عن التطبيق
              </div>
              <div style={{ padding: "12px 12px", fontSize: 12, color: T.sub, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: T.text, marginBottom: 4 }}>{APP_NAME}</div>
                <div>{APP_TAGLINE}</div>
                <div style={{ marginTop: 8, fontSize: 11, color: T.faint }}>الإصدار 2.0</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ============ المنطقة الرئيسية ============ */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* الهيدر */}
        <header style={{
          flexShrink: 0,
          position: "relative",
          zIndex: 5,
          background: T.headerBg,
          borderBottom: `1px solid ${T.line}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 820, margin: "0 auto", padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} style={iconBtnStyle(T)}>
                <Icon.Menu />
              </button>
            )}
            <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: T.text }}>
              {activeChat ? chats[activeChat]?.title : APP_NAME}
            </div>
            <button onClick={newChat} style={iconBtnStyle(T)} title="محادثة جديدة">
              <Icon.Plus />
            </button>
          </div>
        </header>

        {/* خيط الرسائل */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", position: "relative" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 0 16px" }}>
            {empty && (
              <div style={{ textAlign: "center", padding: "30px 0 26px" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18, margin: "0 auto 18px",
                  background: `linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 30,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 8px 24px rgba(124,58,237,0.3)",
                }}>{APP_NAME.charAt(0)}</div>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.6px" }}>{APP_TAGLINE}</h1>
                <p style={{ fontSize: 14, color: T.sub, margin: "0 0 24px", lineHeight: 1.6 }}>
                  اسأل أي شيء، يبحث ويلخّص لك في بطاقة منظّمة
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {SUGGESTIONS.map(s => (
                    <Glass key={s} T={T} radius={999} onClick={() => send(s)} className="press"
                      style={{ cursor: "pointer", padding: "10px 16px" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{s}</span>
                    </Glass>
                  ))}
                </div>
              </div>
            )}

            {currentMessages.map((m, i) => (
              m.role === "user" ? (
                <div key={i} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 14, alignItems: "flex-start", gap: 6 }}>
                  <button onClick={() => toggleFav(m.text, activeChat)} style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: isFav(m.text) ? "#ffb800" : T.faint, padding: 6, marginTop: 4,
                  }}>
                    <Icon.Star filled={isFav(m.text)} />
                  </button>
                  <div style={{
                    background: T.userFill, color: T.userText,
                    borderRadius: "18px 18px 5px 18px",
                    padding: "11px 16px", fontSize: 14.5, fontWeight: 500,
                    maxWidth: "82%", lineHeight: 1.5,
                    boxShadow: "0 4px 14px rgba(10,132,255,0.3), inset 0 1px 1px rgba(255,255,255,0.3)",
                  }}>{m.text}</div>
                </div>
              ) : m.role === "error" ? (
                <div key={i} style={{ marginBottom: 18 }}>
                  <Glass T={T} radius={14} style={{ padding: "12px 16px" }}>
                    <span style={{ color: "#ff453a", fontSize: 13.5 }}>{m.text}</span>
                  </Glass>
                </div>
              ) : (
                <div key={i} className="card-in" style={{ marginBottom: 20 }}>
                  <BigCard card={m.card} T={T} searched={m.searched} />
                </div>
              )
            ))}

            {thinking && (
              <div style={{ display: "flex", gap: 6, padding: "6px 4px 20px" }}>
                {[0, 0.16, 0.32].map((d, i) => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: T.dotIdle,
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
          background: T.composerBg,
          borderTop: `1px solid ${T.line}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "12px 16px" }}>
            {!empty && currentMessages.length > 0 && (
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
                {SUGGESTIONS.slice(0, 3).map(s => (
                  <Glass key={s} T={T} radius={999} onClick={() => send(s)} className="press"
                    style={{ cursor: thinking ? "default" : "pointer", padding: "7px 13px", flexShrink: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: T.sub, whiteSpace: "nowrap" }}>{s}</span>
                  </Glass>
                ))}
              </div>
            )}
            <Glass T={T} radius={16} style={{ padding: "5px 5px 5px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                  placeholder="اسأل عن أي شيء..."
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: T.text, fontSize: 15, padding: "11px 2px", fontFamily: "inherit",
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
                  }}>
                  <Icon.Send />
                </button>
              </div>
            </Glass>
            <div style={{ textAlign: "center", fontSize: 10.5, color: T.faint, marginTop: 8 }}>
              {APP_NAME} قد يخطئ أحياناً — تحقّق من المعلومات المهمة
            </div>
          </div>
        </div>
      </main>

      {/* خلفية مظلمة لما الشريط الجانبي مفتوح في الجوال */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 25, backdropFilter: "blur(4px)",
        }} />
      )}

      <style>{`
        .liquid { transition: transform .25s cubic-bezier(.2,.7,.3,1); }
        .press:hover { transform: translateY(-1px); }
        .press:active { transform: scale(.96); }
        .card-in { animation: ci .55s cubic-bezier(.22,.68,.28,1) both; }
        @keyframes ci { from{opacity:0;transform:translateY(16px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
        .tab-in { animation: ti .4s cubic-bezier(.22,.68,.28,1) both; }
        @keyframes ti { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: ${T.faint} }
        @keyframes bd { 0%,80%,100%{transform:scale(.5);opacity:.4} 40%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar { width: 6px; height: 0; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

/* ============ أنماط مساعدة ============ */
function iconBtnStyle(T) {
  return {
    background: T.pillFill, color: T.text, border: `1px solid ${T.line}`,
    borderRadius: 10, width: 38, height: 38, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit", transition: "background .2s",
  };
}

function settingsBtnStyle(T) {
  return {
    width: "100%",
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px",
    background: "transparent",
    border: "none",
    color: T.text,
    fontSize: 13.5, fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 9,
    textAlign: "right",
  };
}

/* ============ البطاقة الكبيرة ============ */
function BigCard({ card, T, searched }) {
  const a = ACCENTS[card.accent] || ACCENTS.knowledge;
  const [tab, setTab] = useState(0);
  const tabs = Array.isArray(card.tabs) ? card.tabs : [];
  const active = tabs[tab] || {};

  return (
    <Glass T={T} radius={22} style={{ padding: 20 }}>
      <div style={{
        position: "absolute", top: -90, right: -60, width: 260, height: 190,
        background: a, opacity: 0.15, filter: "blur(75px)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          {card.kicker && <div style={{ color: a, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{card.kicker}</div>}
          {searched && (
            <div style={{
              fontSize: 10, fontWeight: 600, color: "#34c759",
              background: "rgba(52,199,89,0.12)", padding: "2px 7px",
              borderRadius: 6, display: "flex", alignItems: "center", gap: 4,
            }}>
              <Icon.Search /> بحث حي
            </div>
          )}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.4px", lineHeight: 1.3 }}>{card.title}</h2>
        {card.sub && <div style={{ color: T.sub, fontSize: 13, marginTop: 5, lineHeight: 1.5 }}>{card.sub}</div>}
      </div>

      {tabs.length > 1 && (
        <div style={{
          position: "relative", display: "flex", gap: 3,
          background: T.pillFill, borderRadius: 11, padding: 3,
          marginBottom: 16, border: `1px solid ${T.line}`,
          overflowX: "auto",
        }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              flex: "1 0 auto",
              background: i === tab ? T.pillActive : "transparent",
              border: "none", borderRadius: 8,
              padding: "8px 12px",
              color: i === tab ? T.text : T.sub,
              fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all .2s",
              whiteSpace: "nowrap",
              boxShadow: i === tab ? "0 1px 4px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.5)" : "none",
            }}>{t.label}</button>
          ))}
        </div>
      )}

      <div key={tab} className="tab-in">
        <TabContent tab={active} a={a} T={T} />
      </div>
    </Glass>
  );
}

/* ============ محتوى التبويب ============ */
function TabContent({ tab, a, T }) {
  const d = tab.data || {};
  switch (tab.type) {
    case "stats":
      return (
        <div>
          {d.intro && <p style={{ color: T.sub, fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.6 }}>{d.intro}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
            {(d.items || []).map((s, i) => (
              <div key={i} style={{
                background: T.pillFill, borderRadius: 12, padding: "12px 10px",
                border: `1px solid ${T.line}`, textAlign: "center",
              }}>
                <div style={{ color: a, fontSize: 22, fontWeight: 800, lineHeight: 1.1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 2 }}>{s.label}</div>
                {s.hint && <div style={{ fontSize: 11, color: T.sub }}>{s.hint}</div>}
              </div>
            ))}
          </div>
        </div>
      );

    case "steps":
      return (
        <div>
          {d.intro && <p style={{ color: T.sub, fontSize: 13.5, margin: "0 0 12px", lineHeight: 1.6 }}>{d.intro}</p>}
          {(d.steps || []).map((s, i, arr) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "12px 0",
              borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.line}`,
            }}>
              <div style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                background: `${a}22`, color: a,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13,
              }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{s.t}</div>
                {s.d && <div style={{ color: T.sub, fontSize: 13, lineHeight: 1.6 }}>{s.d}</div>}
              </div>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <div>
          {d.intro && <p style={{ color: T.sub, fontSize: 13.5, margin: "0 0 12px", lineHeight: 1.6 }}>{d.intro}</p>}
          {(d.items || []).map((x, i, arr) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 11, padding: "11px 0",
              borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.line}`,
              fontSize: 14, lineHeight: 1.6,
            }}>
              <span style={{ color: a, fontSize: 18, lineHeight: 1, marginTop: 2 }}>•</span>
              <span>{x}</span>
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
              <div style={{ color: a, fontWeight: 700, fontSize: 13 }}>{e[0]}</div>
              <div style={{ fontWeight: 600, fontSize: 14, margin: "2px 0" }}>{e[1]}</div>
              {e[2] && <div style={{ color: T.sub, fontSize: 13, lineHeight: 1.6 }}>{e[2]}</div>}
            </div>
          ))}
        </div>
      );

    case "compare":
      return (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 280 }}>
            <thead>
              <tr>{(d.cols || []).map((c, i) => (
                <th key={i} style={{
                  textAlign: "right", padding: "8px 10px",
                  color: i === 0 ? T.sub : a,
                  fontWeight: 700, fontSize: 12,
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
              fontSize: 13.5,
            }}>
              <span style={{ fontSize: 18 }}>{f.icon || "•"}</span>
              <span style={{ flex: 1 }}>{f.text}</span>
            </div>
          ))}
        </div>
      );

    default:
      return <p style={{ color: T.text, lineHeight: 1.9, margin: 0, fontSize: 14, whiteSpace: "pre-wrap" }}>{d.body}</p>;
  }
}
