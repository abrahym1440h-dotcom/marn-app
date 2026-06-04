import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { TRANSLATIONS } from "./i18n.js";


/* ===== شعار مرن ===== */
const LOGO_SM = "data:image/webp;base64,UklGRr4HAABXRUJQVlA4ILIHAAAQJACdASpQAFAAPikUh0KhoQijCgwBQlAFYZuQST6TzVLt224wFt70UbePzN+cb/vvVlvI/9P9QD9cutn/wNrFZ+/ir0KXsFlJ3tX5I/ldrCH8a/rH5J/lPnL/z7/CflhzNd5X+g/7rjp6AH5w/0H5VfK1/K/6T/Bfk/7a/nL/c/234Bf5R/Nf8t/cv3b/yv//+pn2B/tn7EP6ikz0VwiLPgq0+pFZ+L1VmiS7+lgZZpkCnhJjZPDr6eHRyvRSTYJ+XW0C6Oo1XOB/5/IvVH1m5aU7c8NuozmBy+CaSLlM4jcIHq5oAuWHXPpDNp384oSuEbsrlFhmcShaJZ70SvTsP+VJJghTfGmlKruqGLekOL6eUwOWSHxj3kYzmiEhRSRvYh2VWtNhtAAA/v/+lD3Ua+0Aj6+HapmddIhcjT55WfPZBoD/Br5mkbx9XklyphbF1dAd1waWKsYf0sY3iIPcQcmpfy3U1uktlXrT4XLET5Or/B6+bvv8svXyIlvtJA4xvotMte7tIBv/j9Y97RuWmsQDbPF4sdUoCyTD7Br+r8W0pYjtr0U/gJ3yVMojGDhnpdv2UhjLEjQJk2pwRUsGPe+JKKbWkLh66d0zchBTX47/Fh3nr+CBznlsd4aAJZ/RdBXroGhgUxEclhASbDnCOpL/o1NpZ3byB58MdeO+Sp/u6uKr+PnFrp6a9qYJOB7Kp2ufYtYZMvfcw90ILlc3VGBhlMz55ubQVUTgMVZz0TMU+mhKTpSyG09UhYZ+TS6pmVJJRpwIKaLf0bQ7Wf/3gZBANUxreBau/VXPzsyuQM8HFl72YEtvxzdeguuPpwEKCflIu55aZF8ik8dfUPLDX/cD2LGKkcVG8kph5RURLX+u95J+MDbXPnn/CQk1QLIf8++sMqZH1Ge2Dvq0BVG+1zJu9eh4pNCYgfyU4GvszzbT7BTvBly64CzIbKqhIm6i6OOhPO+v3tCPqio+Lmk2l/OYugoexPfk2DFfwojLRgGO/kNPRA3zwvpp0k49GD7v0rvf4tWh5rUGHQ9R7c+jT4wMx/zKdd88aG/CNzM49mIevKUmX9LNCYfBMAwtr4NeoqcnQE5A5acuns6lTZMaBsqJf4+SmExMBn9s6F8lYkvOP3+3+FVJ+rT7ylSvjNOoNyPLBkf+/scvaww6O5bKDeWD8+o+OKuowJ4hLfKpiQFgnWEZMJ6TnRupfi0gjc0FksOGpVnwXEyUrlACN+hDXkkD8hmx4p3aXRkYVfIFYSioKo9UgS4SuIFX/7vO1P6IRGcK3E2aRQ+UN8BeRroZ/sj5cXMREisigaI0jjTU/VYFTLanItQXaicCsXOlTFVTA2yBjGP9ph9HeUCc93MNLTblugYGqjHzbPjZjz6CewythDBHXzeR2n5RcuEKMf2hHX0ANb2lOdlLjaRbqJPoYFVxZ+1prQOiKJ2P0fMcmHK/OPF3wGGRGVXT3e4brSk7+iwfA6Uz5GAxdv6Gyih62KSsZ8z4AIt6zrz9VNWmzqNmrsAv0RjbPlGIi/2taemZjwAO2fs4BBMiqAk3a7qtSdnDYw1RtWM0FjumUisfKA4Yo9vxPx9o22KN/DhcpTBPLenh1XUIKK9/qUb1DPO94tSv6uWVUl9m9Bcxh6Iwz8rHf4ASTzteqO2JsRxQmCnUo55pEuMHYxTnWevmdorDtXaVDMSmejeuV0PneXlVUKz2s2f/nXRtYc7xpJz6ABGsDhIqWrsIyk4ASNash4jTL8xISgaENJ21WlNKkSQl5+egLt2ietr2VqvwoWsBp6NaD8ztcKeI21usMmCJaBoegm6V2okKuDX3+DuyyUGoxbzeXx/AftGyx+NGGLQ9BUJOmnt+i+PGfxjOWSEkSTZ0EQ8uiJ9qNHeS5zz2nSc4tx7dj7d1zf+lsbvieuLsmmFdQq+IOeWsuLweicVKGhyK8c+f7QrD0ckDPoJLlZ8lWmw/+W7SBEJvgpXnyAL5ry/nRub1igYSvWS0q8pwgSlKg42BBSze2FHv6JZJXtQTRophMeQ3gmcqGhISqC51LN/5V/neD4/8sa7iWnWmAjJLa/sJ18U1/rydfEUwdfRzrRPLvzx+kO5YL5oU0M08jdAu7Jv6syRYicqjZEF3UYnDjl2Rktv2b+3o7v5yMO7/gd/Wm6+4HyqvKI7KowgsIjdHTVLa646PSyTq+orGuS94cGkQHYvhCURxbqBwj//b53Pe+l7SfoWRF75+S8UVsXUuglEie83jwTkw3nIfNaB4NNMSc7oEqZw7zykoQYjeq4jGGIHGqXkPzvGsGiFZq2IVXbcSXmxB5t+BiqsBOrnlDz1R8KZwxJtDkwztnnlCEslOSqTYVC10H9+3ZI3CwoaD8/ox4uaRk7113OunnZ967l0T9+rTz5Wtw7H22R37UP45DRvyvfH8yDUk2h6Lw2KPWRoE4kbjO2IUqd96ABsN/yLZasfR2h8NSiI+8uaAceeG/kn+/H9RItd6i0sIvl944J03cZ96Hjf0VJKDCQMgAlLThiClWon7MUnf1Mv039jrK4Up8kjfbl399NkXqMvRwf4L8c2jRNCtGjzel7au2KXs3+bbF/DO/FPSvfY2TslBC6r2qQ7IljyitrxHn4AAAA==";
const LOGO_XS = "data:image/webp;base64,UklGRigGAABXRUJQVlA4IBwGAABwHQCdASpAAEAAPikSh0KhoQmGqsQMAUJQBS8uBpjyT/G8ttfVypzZ6BPQf5gHOw8wH7M+sn6Ot489EDpZP8Dap2ev4d9Dz7G/tVz5GPv2/8ivyq1Ff9r/Hz8js50+k/478c/Nb1U70X/LflpzmdAD+Tf1n/h/bB8UH9v9rXtr+d/+D7g38e/n/+Q/t372f37wReh5+whTW/IiZiRLnUJbf/xOzS5/Q3ss8xMyxad0Sb7AHlXpQpCdZ3C6rTrM7TfPpCChmkihiijY4e7baExE/mE5Zon3LVcIakKHZszA784/8t3wOvuL8Ffw3TbPL/YVRfyQAP7//pQ//RMqPFkdXOHhiGR6U6I3uUu3N+gcT9Jsgc4p3IVsAN0UO3xvYJbEHArbXtI75kOgsGlddKxhfzzeCEuGRfd3D5+JuN31/F9l5FWzzoLHrMC91/W17xfm5ub6bcHnQhzvD1OAdajcOltlYYQ0uhC7w1yYV38kN6vvUkjjkBCSeZt9HwpUDFxUFaMMPVcQl43WIyQbJ6o4OHMOPter1rd23Ep5AIYJiUJ9GMDeuC7MRTM3IIvjDRz0CNOGbBcUlrk8cyNE9sPM78TSr88Snr0ERzDnyUrvybO6bRCL+WxPY9YgXE+OeTByzHSKzzFSp1ILjwWFkZwMUPMlWp/PBJJy1SfV43RL0VFdoHfk5A3aPAtarDhbUTaBU+30Dbyyt9NRwD9sox7Ml6RbNryqnnHlJYH80IGfVLk5SIlZI3ZD1uEzPzYv5Zm7Yr9sOwFUkL1q7p+NlbqDPKpkTcLolO/7kFATGEkrWcV0ck/pW1UsBIcOXv3DQqZ5NYNTWoK8QWB5jASV66oLdm6CkcyR0UW3Yby3i3J69yIpA9Ca0z5r/yX0XeWfPpprLZ9IDSski9VwYHLaPmV+Dv2Sj5TpqcWMarVG9iakLPpyZCze6ov4u7qsZH+UfevDYGEzORIk8CDTO8AGIqfLD4x64SJeoCw0InqN0Qkw3sbXc03VbPKvUyqr1i1WyMWroXd7mhBPeePdEgvkhhu+r48PSH9jRDksDF5JBVNNwLcYMLJSdKju5ewKytOxMsC4jz/H/qInwXhgeXZNxtPLNfcnTDQblNk3eA4zdedXfjlmjm4eolkmFM8guSPLWAOVaVrDMvBxmkg9veEeJuCE1kXwUYwiBBF8Jny9eZGrrGMVj0vGxcDG3brBPta/pek5yDYh4gH/whWqVR3IJQeTxHrH397Xp3hXSn7Htz7A1L9yInLim9gseaHrJOQDZEGt84QjtUBethmK2slPFZrLtvJP3ksJlI9guCOeHBO1cbiioM7TCCwLKgXlvzOZ1j53uKRio/A6yKsuPb0tUa6+N/ucQ6RAS6HDqZtcEkH5dMqUAsL0j+EDEh3GyzL8AWQ/WyApAGiPAcMsPEYY5w4xKjgzbPtsdh/8ZfrEEeQdUPQB16qRJaA5OIrQcRE/hxtKjphNGpIunWag9etPwHjZ5L9KOVXfyuLB32UDhoNGh++Hsd/3/fH+W/uLZr0i946fXn/+pnVvpEMHWFbSDcP79BPoTDF21mp5o0NpI/8dEAayHU3y7fR6RlBnyg2FslIfJBlx2RSjnHHrg3g8/5oABp13xtf7HYdVfNPF0TLC8bBWWI9twCryfl6gvKRx7g2e3520KxZZFFP8GEvOqlspQDu+aoGcb1BzUZdXSqBm/6bJztDykMIRf/wBrWlVv8aRSlpNwrLELD+miMycQthVtGt21seSSZ7koO/UILfmx5Ef9f9/QSUhCiQZ67PmgLke3dlNylDQl7b37jVMl8FfyI0ypdf2VqTaEBRe+qnTKvD3Fn2fjnbaIo//D5WbquftCCeOM8vzMtx7mmt166EqP+XHwJUL1RSphXn0XZHE2gycJsV8fyLUQ+72W23ffrp3+5pEfTpepL/n02htjL64tIaB7fsKda8T8ERI4OWQQO5nIapNbTphK6nOIMCMpqbghPjIIEy/VuXsQgPbTgyjbVsC/UR1ZalSAvGGfLEVkX0GV7/O4tN7yKZGXSXwO7H/N7rNp3AHL1oSA7X9a2D6/RmiPlPSQPQmEAAA";


/* ============ ثوابت ============ */
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
              background: T.accent || "#0a84ff",
              color: "#fff",
              border: "none",
              boxShadow: "none",
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
            background: "#0a84ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", background: "transparent",
            boxShadow: "none", padding: 0,
          }}><img src={LOGO_XS} alt="مرن" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }}/></div>
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
        background: T.text,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "transparent",
        boxShadow: "none",
      }}><img src={LOGO_SM} alt="مرن" style={{ width:"100%", height:"100%", objectFit:"cover" }}/></div>
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
