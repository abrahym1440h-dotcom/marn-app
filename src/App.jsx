import React, { useState, useRef, useEffect } from "react";

/* ============================================================
   اسم التطبيق
   ============================================================ */
const APP_NAME = "مرن";
const APP_TAGLINE = "إجابة واحدة، تجمع لك كل شيء";
/* ============================================================ */

const ACCENTS = { sport:"#34c759", knowledge:"#0a84ff", history:"#bf5af2", food:"#ff9500" };

const THEMES = {
  light: {
    pageBg:"linear-gradient(160deg, #eef1f6 0%, #e6ebf3 45%, #e0eaf3 100%)",
    mesh1:"radial-gradient(55% 45% at 12% 8%, rgba(120,160,255,0.30), transparent 60%)",
    mesh2:"radial-gradient(50% 42% at 88% 14%, rgba(255,150,200,0.24), transparent 60%)",
    mesh3:"radial-gradient(48% 48% at 75% 92%, rgba(130,255,200,0.22), transparent 60%)",
    text:"#1d1d1f", sub:"#5b5b60", faint:"#9b9ba0",
    glassFill:"linear-gradient(150deg, rgba(255,255,255,0.6), rgba(255,255,255,0.22))",
    glassEdge:"rgba(255,255,255,0.95)", glassBorder:"rgba(255,255,255,0.6)",
    glassShadow:"0 8px 30px rgba(40,50,90,0.16), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -8px 22px rgba(255,255,255,0.3)",
    headerBg:"rgba(255,255,255,0.55)", composerBg:"rgba(255,255,255,0.5)",
    userFill:"linear-gradient(150deg, rgba(10,132,255,0.92), rgba(10,132,255,0.78))", userText:"#fff",
    pillFill:"rgba(255,255,255,0.5)", pillActive:"rgba(255,255,255,0.95)",
    line:"rgba(0,0,0,0.07)", innerSoft:"rgba(255,255,255,0.5)", dotIdle:"#b8b8bd",
  },
  dark: {
    pageBg:"linear-gradient(160deg, #0a0a0c 0%, #131318 50%, #0c0c11 100%)",
    mesh1:"radial-gradient(55% 45% at 12% 8%, rgba(90,120,255,0.20), transparent 60%)",
    mesh2:"radial-gradient(50% 42% at 88% 14%, rgba(190,90,242,0.16), transparent 60%)",
    mesh3:"radial-gradient(48% 48% at 75% 92%, rgba(52,199,89,0.14), transparent 60%)",
    text:"#f5f5f7", sub:"#a1a1a8", faint:"#636366",
    glassFill:"linear-gradient(150deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
    glassEdge:"rgba(255,255,255,0.5)", glassBorder:"rgba(255,255,255,0.18)",
    glassShadow:"0 8px 36px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.32), inset 0 -10px 28px rgba(0,0,0,0.28)",
    headerBg:"rgba(18,18,22,0.5)", composerBg:"rgba(14,14,18,0.5)",
    userFill:"linear-gradient(150deg, rgba(10,132,255,0.9), rgba(10,132,255,0.72))", userText:"#fff",
    pillFill:"rgba(255,255,255,0.08)", pillActive:"rgba(255,255,255,0.22)",
    line:"rgba(255,255,255,0.09)", innerSoft:"rgba(255,255,255,0.06)", dotIdle:"#48484a",
  },
};

const SUGGESTIONS = [
  "مباريات الدوري السعودي اليوم",
  "كيف أسوي قهوة مختصة؟",
  "متى تأسست الدولة السعودية؟",
];

function Glass({ T, children, style, radius=22, onClick, className="" }) {
  return (
    <div onClick={onClick} className={`liquid ${className}`} style={{
      position:"relative", borderRadius:radius, background:T.glassFill,
      border:`1px solid ${T.glassBorder}`, boxShadow:T.glassShadow,
      backdropFilter:"blur(22px) saturate(180%)", WebkitBackdropFilter:"blur(22px) saturate(180%)",
      overflow:"hidden", ...style,
    }}>
      <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:1.5,
        background:`linear-gradient(90deg, transparent, ${T.glassEdge}, transparent)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:-1, right:-1, width:64, height:64,
        background:`radial-gradient(circle at top right, ${T.glassEdge}, transparent 70%)`, opacity:0.5, pointerEvents:"none" }} />
      {children}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("light");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);
  const T = THEMES[mode];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth", block:"end" }); }, [messages, thinking]);

  const send = async (text) => {
    const q = (text ?? draft).trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role:"user", text:q }]);
    setDraft(""); setThinking(true);

    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      let data = null;
      try { data = await r.json(); } catch {}
      if (r.ok && data && data.card) {
        setMessages((m) => [...m, { role:"card", card: data.card }]);
      } else {
        const errMsg = (data && (data.error || data.detail))
          ? `${data.error || ""}${data.detail ? " — " + data.detail : ""}${data.hint ? " | " + data.hint : ""}`
          : `خطأ ${r.status}: ${r.statusText || "غير معروف"}`;
        setMessages((m) => [...m, { role:"error", text: errMsg }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { role:"error", text: "تعذّر الاتصال بالشبكة: " + String(e?.message || e) }]);
    } finally {
      setThinking(false);
    }
  };

  const empty = messages.length === 0;

  return (
    <div dir="rtl" style={{
      height:"100vh", display:"flex", flexDirection:"column", position:"relative",
      background:T.pageBg, color:T.text,
      fontFamily:"'Noto Sans Arabic','SF Pro Text','Segoe UI',sans-serif",
      WebkitFontSmoothing:"antialiased", transition:"background .5s ease, color .4s ease", overflow:"hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ position:"fixed", inset:0, background:T.mesh1, pointerEvents:"none" }} />
      <div style={{ position:"fixed", inset:0, background:T.mesh2, pointerEvents:"none" }} />
      <div style={{ position:"fixed", inset:0, background:T.mesh3, pointerEvents:"none" }} />

      <header style={{ flexShrink:0, position:"relative", zIndex:5, background:T.headerBg,
        borderBottom:`1px solid ${T.line}`, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", transition:"all .4s" }}>
        <div style={{ maxWidth:680, margin:"0 auto", padding:"13px 18px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:32, height:32, borderRadius:9,
              background:`linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
              display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:16,
              boxShadow:"inset 0 1px 1px rgba(255,255,255,0.4)" }}>{APP_NAME.charAt(0)}</div>
            <div style={{ fontSize:17, fontWeight:700, letterSpacing:"-0.3px" }}>{APP_NAME}</div>
          </div>
          <Glass T={T} radius={999} onClick={()=>setMode(mode==="light"?"dark":"light")} className="press"
            style={{ cursor:"pointer", padding:"8px 11px" }}>
            <span style={{ fontSize:15 }}>{mode==="light" ? "☾" : "☀︎"}</span>
          </Glass>
        </div>
      </header>

      <div style={{ flex:1, overflowY:"auto", padding:"0 18px", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:680, margin:"0 auto", padding:"24px 0 16px" }}>
          {empty && (
            <div style={{ textAlign:"center", padding:"44px 0 26px" }}>
              <div style={{ width:58, height:58, borderRadius:17, margin:"0 auto 18px",
                background:`linear-gradient(135deg, ${ACCENTS.knowledge}, ${ACCENTS.history})`,
                display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:27,
                boxShadow:"inset 0 1px 2px rgba(255,255,255,0.4), 0 8px 24px rgba(124,58,237,0.3)" }}>{APP_NAME.charAt(0)}</div>
              <h1 style={{ fontSize:26, fontWeight:800, margin:"0 0 8px", letterSpacing:"-0.6px" }}>{APP_TAGLINE}</h1>
              <p style={{ fontSize:15, color:T.sub, margin:"0 0 26px", lineHeight:1.6 }}>
                اطرح سؤالك، واحصل على بطاقة منظّمة بدل إجابة طويلة
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:9, justifyContent:"center" }}>
                {SUGGESTIONS.map((s)=>(
                  <Glass key={s} T={T} radius={999} onClick={()=>send(s)} className="press"
                    style={{ cursor:"pointer", padding:"10px 16px" }}>
                    <span style={{ fontSize:14, fontWeight:500 }}>{s}</span>
                  </Glass>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            m.role === "user" ? (
              <div key={i} style={{ display:"flex", justifyContent:"flex-start", marginBottom:16 }}>
                <div style={{ background:T.userFill, color:T.userText, borderRadius:"18px 18px 5px 18px",
                  padding:"11px 16px", fontSize:15, fontWeight:500, maxWidth:"80%", lineHeight:1.5,
                  boxShadow:"0 4px 14px rgba(10,132,255,0.3), inset 0 1px 1px rgba(255,255,255,0.3)" }}>{m.text}</div>
              </div>
            ) : m.role === "error" ? (
              <div key={i} style={{ marginBottom:20 }}>
                <Glass T={T} radius={16} style={{ padding:"14px 18px" }}>
                  <span style={{ color:"#ff453a", fontSize:14.5 }}>{m.text}</span>
                </Glass>
              </div>
            ) : (
              <div key={i} className="card-in" style={{ marginBottom:20 }}>
                <BigCard card={m.card} T={T} />
              </div>
            )
          ))}

          {thinking && (
            <div style={{ display:"flex", gap:6, padding:"6px 4px 20px" }}>
              {[0,0.16,0.32].map((d,i)=>(
                <span key={i} style={{ width:8,height:8,borderRadius:"50%",background:T.dotIdle,animation:`bd 1.3s ${d}s infinite ease-in-out` }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div style={{ flexShrink:0, position:"relative", zIndex:5, background:T.composerBg,
        borderTop:`1px solid ${T.line}`, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", transition:"all .4s" }}>
        <div style={{ maxWidth:680, margin:"0 auto", padding:"12px 18px" }}>
          {!empty && (
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:10 }}>
              {SUGGESTIONS.map((s)=>(
                <Glass key={s} T={T} radius={999} onClick={()=>send(s)} className="press"
                  style={{ cursor:thinking?"default":"pointer", padding:"7px 13px", flexShrink:0 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:T.sub, whiteSpace:"nowrap" }}>{s}</span>
                </Glass>
              ))}
            </div>
          )}
          <Glass T={T} radius={16} style={{ padding:"5px 5px 5px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input value={draft} onChange={(e)=>setDraft(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==="Enter") send(); }}
                placeholder="اكتب سؤالك هنا…"
                style={{ flex:1, background:"transparent", border:"none", outline:"none",
                  color:T.text, fontSize:16, padding:"11px 2px", fontFamily:"inherit" }} />
              <button onClick={()=>send()} disabled={!draft.trim() || thinking}
                style={{ background: draft.trim()? ACCENTS.knowledge : T.pillFill, color:"#fff", border:"none",
                  borderRadius:12, width:42, height:42, fontSize:18, cursor: draft.trim()?"pointer":"default",
                  fontFamily:"inherit", transition:"background .2s", flexShrink:0,
                  boxShadow:"inset 0 1px 1px rgba(255,255,255,0.4)" }}>↑</button>
            </div>
          </Glass>
          <div style={{ textAlign:"center", fontSize:11, color:T.faint, marginTop:8 }}>
            مرن قد يخطئ أحياناً — تحقّق من المعلومات المهمة
          </div>
        </div>
      </div>

      <style>{`
        .liquid { transition: transform .25s cubic-bezier(.2,.7,.3,1); }
        .press:hover { transform: translateY(-1px); }
        .press:active { transform: scale(.96); }
        .card-in { animation: ci .55s cubic-bezier(.22,.68,.28,1) both; }
        @keyframes ci { from{opacity:0;transform:translateY(16px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
        .tab-in { animation: ti .4s cubic-bezier(.22,.68,.28,1) both; }
        @keyframes ti { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:${T.faint} }
        @keyframes bd { 0%,80%,100%{transform:scale(.5);opacity:.4} 40%{transform:scale(1);opacity:1} }
        ::-webkit-scrollbar { height:0; width:0; }
      `}</style>
    </div>
  );
}

function BigCard({ card, T }) {
  const a = ACCENTS[card.accent] || ACCENTS.knowledge;
  const [tab, setTab] = useState(0);
  const tabs = Array.isArray(card.tabs) ? card.tabs : [];
  const active = tabs[tab] || {};

  return (
    <Glass T={T} radius={26} style={{ padding:22 }}>
      <div style={{ position:"absolute", top:-90, right:-60, width:260, height:190,
        background:a, opacity:0.15, filter:"blur(75px)", pointerEvents:"none" }} />
      <div style={{ position:"relative", marginBottom:18 }}>
        {card.kicker && <div style={{ color:a, fontSize:12.5, fontWeight:600, marginBottom:5 }}>{card.kicker}</div>}
        <h2 style={{ fontSize:21, fontWeight:700, margin:0, letterSpacing:"-0.4px" }}>{card.title}</h2>
        {card.sub && <div style={{ color:T.sub, fontSize:13, marginTop:4 }}>{card.sub}</div>}
      </div>

      {tabs.length > 1 && (
        <div style={{ position:"relative", display:"flex", gap:3, background:T.pillFill, borderRadius:12, padding:3,
          marginBottom:18, border:`1px solid ${T.line}` }}>
          {tabs.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{
              flex:1, background: i===tab ? T.pillActive : "transparent", border:"none", borderRadius:9,
              padding:"8px 6px", color: i===tab ? T.text : T.sub, fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"inherit", transition:"all .2s",
              boxShadow: i===tab ? "0 1px 4px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.5)" : "none" }}>{t.label}</button>
          ))}
        </div>
      )}

      <div key={tab} className="tab-in" style={{ position:"relative" }}>
        <TabContent tab={active} a={a} T={T} />
      </div>
    </Glass>
  );
}

function TabContent({ tab, a, T }) {
  const d = tab.data || {};
  switch (tab.type) {
    case "steps":
      return (
        <div>{(d.steps||[]).map((s,i,arr)=>(
          <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom: i===arr.length-1?"none":`1px solid ${T.line}` }}>
            <div style={{ flexShrink:0, width:27,height:27,borderRadius:8,background:`${a}22`,color:a,
              display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13 }}>{i+1}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:14.5, marginBottom:2 }}>{s.t}</div>
              {s.d && <div style={{ color:T.sub, fontSize:13, lineHeight:1.6 }}>{s.d}</div>}
            </div>
          </div>
        ))}</div>
      );
    case "list":
      return (
        <div>{(d.items||[]).map((x,i,arr)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:11, padding:"13px 0",
            borderBottom: i===arr.length-1?"none":`1px solid ${T.line}`, fontSize:14.5 }}>
            <span style={{ color:a }}>•</span> {x}
          </div>
        ))}</div>
      );
    case "timeline":
      return (
        <div style={{ position:"relative", paddingRight:20 }}>
          <div style={{ position:"absolute", right:5, top:6, bottom:6, width:2, background:`${a}33` }} />
          {(d.events||[]).map((e,i,arr)=>(
            <div key={i} style={{ position:"relative", marginBottom:i===arr.length-1?0:18 }}>
              <div style={{ position:"absolute", right:-19, top:4, width:11,height:11,borderRadius:"50%",
                background:a, border:`3px solid ${T.text==="#f5f5f7"?"#16181d":"#fff"}`, boxShadow:`0 0 8px ${a}88` }} />
              <div style={{ color:a, fontWeight:700, fontSize:13.5 }}>{e[0]}</div>
              <div style={{ fontWeight:600, fontSize:14.5, margin:"2px 0" }}>{e[1]}</div>
              {e[2] && <div style={{ color:T.sub, fontSize:13, lineHeight:1.6 }}>{e[2]}</div>}
            </div>
          ))}
        </div>
      );
    case "compare":
      return (
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
          <thead><tr>{(d.cols||[]).map((c,i)=>(
            <th key={i} style={{ textAlign:"right", padding:"8px 10px", color:i===0?T.sub:a, fontWeight:600, fontSize:12.5 }}>{c}</th>
          ))}</tr></thead>
          <tbody>{(d.rows||[]).map((row,ri)=>(
            <tr key={ri}>{row.map((cell,ci)=>(
              <td key={ci} style={{ padding:"12px 10px", color:ci===0?T.text:T.sub, fontWeight:ci===0?600:400,
                borderTop:`1px solid ${T.line}` }}>{cell}</td>
            ))}</tr>
          ))}</tbody>
        </table>
      );
    default:
      return <p style={{ color:T.text, lineHeight:1.9, margin:0, fontSize:14.5, whiteSpace:"pre-wrap" }}>{d.body}</p>;
  }
}
