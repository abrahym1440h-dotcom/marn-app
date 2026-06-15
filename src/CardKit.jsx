// ============================================================================
// CardKit.jsx — محرّك بطاقات وتصاميم مرن (30 شكلاً بصرياً)
// يستخدمه نبراس ومرن لعرض إجابات غنية بالرسوم. ثيم لكل وكيل.
// لا إيموجي — SVG/HTML inline فقط. تصميم مسطّح.
// ============================================================================
import React, { useState } from 'react';

const FONT = "'Tajawal','Segoe UI',system-ui,sans-serif";

const BASE = {
  good: '#34C77B', gold: '#E2B14A', purple: '#A78BFA', rose: '#F472B6',
  cyan: '#22D3EE', orange: '#FB923C', red: '#F87171',
  line: '#1F2940', card2: '#0E1422', sub: '#9AA8C8', text: '#E8EEFB', faint: '#5E6B8A',
};
const THEMES = {
  marn:   { ...BASE, accent: '#4A8FFF', surface: '#121829', bg: '#0A0E1A' },
  nibras: { ...BASE, accent: '#E2B14A', surface: '#141019', bg: '#0F0A04' },
  fatwa:  { ...BASE, accent: '#1FB286', surface: '#0E1A16', bg: '#07140F' },
};
function pal(theme) { return THEMES[theme] || THEMES.marn; }
function palette(P) { return [P.accent, P.good, P.gold, P.purple, P.rose, P.cyan, P.orange, P.red]; }

// ---------- مساعدات آمنة ----------
function nums(v, fb) { return Array.isArray(v) && v.length ? v.map((x) => Number(x) || 0) : (fb || []); }
function arr(v, fb) { return Array.isArray(v) && v.length ? v : (fb || []); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ============================================================================
// 30 رسماً — كل دالة تُعيد HTML نصّياً (يُحقن عبر dangerouslySetInnerHTML)
// ============================================================================
function cPie(d, P) {
  const data = arr(d.slices, [{ value: 40 }, { value: 25 }, { value: 20 }, { value: 15 }]);
  const total = data.reduce((s, x) => s + (Number(x.value) || 0), 0) || 1;
  const cols = palette(P); let a = -90, p = ''; const cx = 70, cy = 70, r = 60;
  data.forEach((x, i) => {
    const v = (Number(x.value) || 0) / total * 360, a2 = a + v;
    const x1 = cx + r * Math.cos(a * Math.PI / 180), y1 = cy + r * Math.sin(a * Math.PI / 180);
    const x2 = cx + r * Math.cos(a2 * Math.PI / 180), y2 = cy + r * Math.sin(a2 * Math.PI / 180);
    p += `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${v > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${cols[i % cols.length]}"/>`;
    a = a2;
  });
  const lg = data.map((x, i) => `<span style="display:flex;align-items:center;gap:5px;font-size:11px;color:${P.sub}"><span style="width:9px;height:9px;border-radius:3px;background:${cols[i % cols.length]}"></span>${esc(x.label || '')}</span>`).join('');
  return `<div style="text-align:center"><svg width="140" height="140" viewBox="0 0 140 140">${p}</svg><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;justify-content:center">${lg}</div></div>`;
}
function cDonut(d, P) {
  const v = Math.max(0, Math.min(100, Number(d.value) || 80));
  const r = 54, circ = 2 * Math.PI * r, len = v / 100 * circ;
  return `<div style="position:relative;width:140px;height:140px;margin:auto"><svg width="140" height="140"><circle cx="70" cy="70" r="${r}" fill="none" stroke="${P.line}" stroke-width="16"/><circle cx="70" cy="70" r="${r}" fill="none" stroke="${P.accent}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${len} ${circ - len}" transform="rotate(-90 70 70)"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:28px;font-weight:800;color:${P.text}">${v}%</div><div style="font-size:11px;color:${P.sub}">${esc(d.label || 'مكتمل')}</div></div></div>`;
}
function cBar(d, P) {
  const data = nums(d.values, [60, 85, 45, 95, 70, 55]); const max = Math.max(...data, 1);
  const labels = arr(d.labels, []);
  return `<svg width="100%" height="150" viewBox="0 0 240 150">${data.map((v, i) => {
    const h = v / max * 110; const x = i * (224 / data.length) + 8; const w = Math.min(28, 200 / data.length);
    return `<rect x="${x}" y="${130 - h}" width="${w}" height="${h}" rx="5" fill="${P.accent}"/><text x="${x + w / 2}" y="145" fill="${P.faint}" font-size="9" text-anchor="middle" font-family="${FONT}">${esc(labels[i] || (i + 1))}</text>`;
  }).join('')}</svg>`;
}
function cHbar(d, P) {
  const cols = palette(P);
  const data = arr(d.items, [{ label: 'الأول', value: 90 }, { label: 'الثاني', value: 75 }, { label: 'الثالث', value: 60 }, { label: 'الرابع', value: 40 }]);
  const max = Math.max(...data.map((x) => Number(x.value) || 0), 1);
  return `<div style="width:100%">${data.map((x, i) => `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><span style="width:64px;font-size:12px;color:${P.sub};text-align:right;flex-shrink:0">${esc(x.label || '')}</span><span style="flex:1;height:14px;background:${P.card2};border-radius:999px;overflow:hidden"><span style="display:block;height:100%;width:${(Number(x.value) || 0) / max * 100}%;background:${cols[i % cols.length]};border-radius:999px"></span></span><span style="font-size:11px;color:${P.sub};width:34px">${esc(x.value)}</span></div>`).join('')}</div>`;
}
function cLine(d, P) {
  const pts = nums(d.values, [20, 50, 35, 70, 55, 90, 75]); const w = 240, h = 130, step = w / (pts.length - 1 || 1);
  const max = Math.max(...pts, 1);
  const dd = pts.map((v, i) => `${i * step},${h - v / max * 110}`).join(' ');
  return `<svg width="100%" height="140" viewBox="0 0 240 140"><polyline points="${dd}" fill="none" stroke="${P.accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((v, i) => `<circle cx="${i * step}" cy="${h - v / max * 110}" r="3.5" fill="${P.accent}"/>`).join('')}</svg>`;
}
function cArea(d, P) {
  const pts = nums(d.values, [20, 45, 30, 65, 50, 85, 70]); const w = 240, h = 130, step = w / (pts.length - 1 || 1);
  const max = Math.max(...pts, 1);
  const ln = pts.map((v, i) => `${i * step},${h - v / max * 110}`).join(' ');
  return `<svg width="100%" height="140" viewBox="0 0 240 140"><defs><linearGradient id="ag${P.accent.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.accent}" stop-opacity="0.5"/><stop offset="1" stop-color="${P.accent}" stop-opacity="0"/></linearGradient></defs><polygon points="0,${h} ${ln} ${w},${h}" fill="url(#ag${P.accent.slice(1)})"/><polyline points="${ln}" fill="none" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function cStackedBar(d, P) {
  const cols = palette(P);
  const data = arr(d.groups, [[30, 40, 20], [45, 25, 30], [20, 50, 25], [35, 35, 40]]);
  return `<svg width="100%" height="150" viewBox="0 0 240 150">${data.map((seg, i) => { let y = 130; return seg.map((v, j) => { const hh = v * 0.9; y -= hh; return `<rect x="${i * 52 + 12}" y="${y}" width="34" height="${hh}" fill="${cols[j % cols.length]}"/>`; }).join(''); }).join('')}</svg>`;
}
function cStackedArea(d, P) {
  const s1 = nums(d.s1, [20, 35, 25, 45, 40]), s2 = nums(d.s2, [15, 20, 30, 25, 35]);
  const w = 240, h = 120, step = w / (s1.length - 1 || 1);
  const t1 = s1.map((v, i) => `${i * step},${h - v}`).join(' ');
  const t2 = s1.map((v, i) => `${i * step},${h - (v + (s2[i] || 0))}`).join(' ');
  return `<svg width="100%" height="130" viewBox="0 0 240 130"><polygon points="0,${h} ${t2} ${w},${h}" fill="${P.purple}55"/><polygon points="0,${h} ${t1} ${w},${h}" fill="${P.accent}88"/></svg>`;
}
function cRadar(d, P) {
  const vals = nums(d.values, [0.9, 0.7, 0.8, 0.6, 0.85, 0.75]).map((v) => v > 1 ? v / 100 : v);
  const n = vals.length, cx = 70, cy = 70, R = 58;
  const pt = (i, r) => { const a = (i / n * 2 * Math.PI) - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  let g = '';
  for (let k = 1; k <= 3; k++) { let p = ''; for (let i = 0; i < n; i++) { const [x, y] = pt(i, R * k / 3); p += `${x},${y} `; } g += `<polygon points="${p}" fill="none" stroke="${P.line}" stroke-width="1"/>`; }
  let poly = ''; for (let i = 0; i < n; i++) { const [x, y] = pt(i, R * vals[i]); poly += `${x},${y} `; }
  return `<svg width="140" height="140" style="margin:auto;display:block">${g}<polygon points="${poly}" fill="${P.accent}44" stroke="${P.accent}" stroke-width="2"/></svg>`;
}
function cBubble(d, P) {
  const cols = palette(P);
  const b = arr(d.points, [[50, 60, 28], [120, 50, 38], [180, 80, 22], [90, 100, 18], [160, 40, 15]]);
  return `<svg width="100%" height="140" viewBox="0 0 240 140">${b.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${cols[i % cols.length]}55" stroke="${cols[i % cols.length]}" stroke-width="1.5"/>`).join('')}</svg>`;
}
function cScatter(d, P) {
  const pts = arr(d.points, [[30, 90], [60, 70], [80, 80], [110, 50], [140, 55], [160, 35], [190, 40], [210, 25]]);
  return `<svg width="100%" height="140" viewBox="0 0 240 140"><line x1="20" y1="120" x2="230" y2="120" stroke="${P.line}"/><line x1="20" y1="10" x2="20" y2="120" stroke="${P.line}"/>${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${P.cyan}"/>`).join('')}</svg>`;
}
function cHeatmap(d, P) {
  const cells = arr(d.cells, Array.from({ length: 84 }, () => Math.random()));
  const html = cells.slice(0, 84).map((v) => { const c = v > 0.7 ? P.red : v > 0.4 ? P.gold : v > 0.15 ? P.good : '#1A2238'; return `<div style="aspect-ratio:1;border-radius:3px;background:${c}"></div>`; }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(12,1fr);gap:4px;width:100%">${html}</div>`;
}
function cTreemap(d, P) {
  const cols = palette(P);
  const items = arr(d.items, [{ label: 'الأكبر', value: 60 }, { label: 'متوسط', value: 25 }, { label: 'صغير', value: 15 }]);
  const total = items.reduce((s, x) => s + (Number(x.value) || 0), 0) || 1;
  const big = items[0], rest = items.slice(1);
  return `<div style="width:100%;height:140px;display:flex;gap:4px"><div style="flex:${(Number(big.value) || 1)};background:${cols[0]};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#0A0E1A;text-align:center">${esc(big.label)}<br>${Math.round((Number(big.value) || 0) / total * 100)}%</div><div style="flex:${total - (Number(big.value) || 0)};display:flex;flex-direction:column;gap:4px">${rest.map((x, i) => `<div style="flex:${Number(x.value) || 1};background:${cols[(i + 1) % cols.length]};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#0A0E1A">${esc(x.label)}</div>`).join('')}</div></div>`;
}
function cFunnel(d, P) {
  const cols = palette(P);
  const f = arr(d.items, [{ label: 'زائر', value: 100 }, { label: 'تسجيل', value: 70 }, { label: 'سلة', value: 40 }, { label: 'شراء', value: 20 }]);
  const max = Math.max(...f.map((x) => Number(x.value) || 0), 1);
  return `<div style="width:100%">${f.map((x, i) => `<div style="display:flex;justify-content:center;margin-bottom:6px"><div style="width:${(Number(x.value) || 0) / max * 100}%;background:${cols[i % cols.length]};padding:8px;border-radius:6px;text-align:center;font-size:12px;font-weight:700;color:#0A0E1A">${esc(x.label)} ${esc(x.value)}</div></div>`).join('')}</div>`;
}
function cGauge(d, P) {
  const v = Math.max(0, Math.min(100, Number(d.value) || 72));
  const a = -90 + (v / 100 * 180); const r = 58, cx = 70, cy = 75;
  const x = cx + r * Math.cos(a * Math.PI / 180), y = cy + r * Math.sin(a * Math.PI / 180);
  return `<svg width="140" height="95" style="margin:auto;display:block"><path d="M12 75 A58 58 0 0 1 128 75" fill="none" stroke="${P.line}" stroke-width="12" stroke-linecap="round"/><path d="M12 75 A58 58 0 0 1 ${x} ${y}" fill="none" stroke="${P.accent}" stroke-width="12" stroke-linecap="round"/><text x="70" y="70" fill="${P.text}" font-size="22" font-weight="800" text-anchor="middle" font-family="${FONT}">${v}%</text></svg>`;
}
function cRing(d, P) {
  const v = Math.max(0, Math.min(100, Number(d.value) || 75));
  const r = 52, circ = 2 * Math.PI * r, len = v / 100 * circ;
  return `<div style="position:relative;width:130px;height:130px;margin:auto"><svg width="130" height="130"><circle cx="65" cy="65" r="${r}" fill="none" stroke="${P.line}" stroke-width="11"/><circle cx="65" cy="65" r="${r}" fill="none" stroke="${P.accent}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${len} ${circ}" transform="rotate(-90 65 65)"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:${P.text}">${v}%</div></div>`;
}
function cKpi(d, P) {
  const cols = palette(P);
  const k = arr(d.items, [{ value: '25K', label: 'مستخدم' }, { value: '4.8', label: 'تقييم' }, { value: '+23%', label: 'نمو' }]);
  return `<div style="display:flex;gap:10px;flex-wrap:wrap;width:100%">${k.map((x, i) => `<div style="flex:1;min-width:80px;background:${P.card2};border:1px solid ${P.line};border-radius:14px;padding:14px;text-align:center"><div style="font-size:24px;font-weight:800;color:${x.color || cols[i % cols.length]}">${esc(x.value)}</div><div style="font-size:11px;color:${P.sub};margin-top:2px">${esc(x.label)}</div></div>`).join('')}</div>`;
}
function cTimeline(d, P) {
  const cols = palette(P);
  const t = arr(d.items, [{ title: 'البداية', desc: 'المرحلة' }, { title: 'التخطيط', desc: 'المرحلة' }, { title: 'التنفيذ', desc: 'المرحلة' }, { title: 'الإطلاق', desc: 'المرحلة' }]);
  return `<div style="width:100%;padding-right:4px">${t.map((x, i) => `<div style="position:relative;padding-bottom:16px;padding-right:18px;border-right:2px solid ${P.line}"><span style="position:absolute;right:-7px;top:2px;width:12px;height:12px;border-radius:50%;border:2px solid ${P.surface};background:${cols[i % cols.length]}"></span><div style="font-size:13px;font-weight:700;color:${P.text}">${esc(x.title)}</div><div style="font-size:11px;color:${P.faint}">${esc(x.desc || '')}</div></div>`).join('')}</div>`;
}
function cCalHeat(d, P) {
  const cells = arr(d.cells, Array.from({ length: 105 }, () => Math.random()));
  const html = cells.slice(0, 105).map((v) => { const c = v > 0.75 ? P.good : v > 0.5 ? P.good + '99' : v > 0.25 ? P.good + '55' : '#1A2238'; return `<div style="aspect-ratio:1;border-radius:2px;background:${c}"></div>`; }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(15,1fr);gap:3px;width:100%">${html}</div>`;
}
function cSankey(d, P) {
  return `<svg width="100%" height="140" viewBox="0 0 240 140"><rect x="10" y="20" width="14" height="40" fill="${P.accent}"/><rect x="10" y="80" width="14" height="40" fill="${P.good}"/><rect x="216" y="10" width="14" height="35" fill="${P.gold}"/><rect x="216" y="55" width="14" height="35" fill="${P.purple}"/><rect x="216" y="100" width="14" height="30" fill="${P.rose}"/><path d="M24 40 C120 40 120 27 216 27" fill="none" stroke="${P.accent}44" stroke-width="14"/><path d="M24 50 C120 50 120 72 216 72" fill="none" stroke="${P.accent}33" stroke-width="10"/><path d="M24 100 C120 100 120 115 216 115" fill="none" stroke="${P.good}44" stroke-width="12"/></svg>`;
}
function cNetwork(d, P) {
  const cols = palette(P);
  const nodes = arr(d.nodes, [[70, 30], [30, 80], [110, 80], [70, 110], [140, 50]]);
  const edges = arr(d.edges, [[0, 1], [0, 2], [1, 3], [2, 3], [0, 4], [2, 4]]);
  return `<svg width="100%" height="140" viewBox="0 0 180 140">${edges.map((e) => nodes[e[0]] && nodes[e[1]] ? `<line x1="${nodes[e[0]][0]}" y1="${nodes[e[0]][1]}" x2="${nodes[e[1]][0]}" y2="${nodes[e[1]][1]}" stroke="${P.line}" stroke-width="2"/>` : '').join('')}${nodes.map((n, i) => `<circle cx="${n[0]}" cy="${n[1]}" r="9" fill="${cols[i % cols.length]}"/>`).join('')}</svg>`;
}
function cWaterfall(d, P) {
  const steps = arr(d.steps, [[0, 40], [40, 25], [65, -15], [50, 20], [70, -10]]); const h = 110;
  return `<svg width="100%" height="140" viewBox="0 0 240 140">${steps.map((s, i) => { const base = s[0], delta = s[1]; const y = delta > 0 ? h - (base + delta) : h - base; const hh = Math.abs(delta); const c = delta >= 0 ? P.good : P.red; return `<rect x="${i * 46 + 12}" y="${y}" width="32" height="${hh}" rx="3" fill="${c}"/>`; }).join('')}</svg>`;
}
function cCandle(d, P) {
  const data = arr(d.candles, [[40, 80, 30, 70], [70, 90, 60, 85], [85, 88, 55, 62], [62, 75, 45, 72], [72, 95, 68, 90]]);
  return `<svg width="100%" height="140" viewBox="0 0 240 140">${data.map((c, i) => { const o = c[0], hi = c[1], lo = c[2], cl = c[3]; const x = i * 46 + 30; const col = cl >= o ? P.good : P.red; return `<line x1="${x}" y1="${140 - hi}" x2="${x}" y2="${140 - lo}" stroke="${col}" stroke-width="2"/><rect x="${x - 9}" y="${140 - Math.max(o, cl)}" width="18" height="${Math.abs(cl - o) || 2}" fill="${col}"/>`; }).join('')}</svg>`;
}
function cGeo(d, P) {
  return `<svg width="100%" height="140" viewBox="0 0 200 140"><rect width="200" height="140" rx="10" fill="${P.card2}"/><path d="M40 40 Q70 30 100 45 T160 50 L155 90 Q120 100 90 90 T45 95 Z" fill="${P.accent}22" stroke="${P.accent}66"/><circle cx="80" cy="60" r="6" fill="${P.rose}"/><circle cx="120" cy="70" r="9" fill="${P.gold}"/><circle cx="100" cy="80" r="5" fill="${P.good}"/></svg>`;
}
function cMetricTiles(d, P) {
  const cols = palette(P);
  const m = arr(d.items, [{ label: 'القيمة', value: '28' }, { label: 'العدد', value: '12K' }, { label: 'النسبة', value: '87%' }, { label: 'المعدّل', value: '4.5' }]);
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%">${m.map((x, i) => `<div style="background:${P.card2};border:1px solid ${P.line};border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${cols[i % cols.length]}22"><div style="width:14px;height:14px;border-radius:4px;background:${cols[i % cols.length]}"></div></div><div><div style="font-size:18px;font-weight:800;color:${P.text}">${esc(x.value)}</div><div style="font-size:10px;color:${P.sub}">${esc(x.label)}</div></div></div>`).join('')}</div>`;
}
function cComparison(d, P) {
  const cols = palette(P);
  const a = d.a || { label: 'الأول', value: '3' }, b = d.b || { label: 'الثاني', value: '1' };
  return `<div style="display:flex;gap:10px;align-items:stretch;width:100%"><div style="flex:1;background:${P.card2};border-radius:12px;padding:14px;text-align:center"><div style="font-weight:800;color:${cols[0]}">${esc(a.label)}</div><div style="font-size:28px;font-weight:800;margin:6px 0;color:${P.text}">${esc(a.value)}</div><div style="font-size:11px;color:${P.sub}">${esc(a.note || '')}</div></div><div style="display:flex;align-items:center;font-weight:800;color:${P.faint}">VS</div><div style="flex:1;background:${P.card2};border-radius:12px;padding:14px;text-align:center"><div style="font-weight:800;color:${cols[2]}">${esc(b.label)}</div><div style="font-size:28px;font-weight:800;margin:6px 0;color:${P.text}">${esc(b.value)}</div><div style="font-size:11px;color:${P.sub}">${esc(b.note || '')}</div></div></div>`;
}
function cLeaderboard(d, P) {
  const meds = [P.gold, '#C0C0C0', '#CD7F32', P.line];
  const lb = arr(d.items, [{ name: 'الأول', score: 2500 }, { name: 'الثاني', score: 2100 }, { name: 'الثالث', score: 1800 }, { name: 'الرابع', score: 1500 }]);
  return `<div style="width:100%">${lb.map((x, i) => { const c = meds[i] || P.line; return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid ${P.line}"><span style="width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;background:${c}33;color:${i < 3 ? c : P.sub}">${i + 1}</span><span style="flex:1;font-weight:700;font-size:13px;color:${P.text}">${esc(x.name)}</span><span style="color:${P.accent};font-weight:800;font-size:13px">${esc(x.score)}</span></div>`; }).join('')}</div>`;
}
function cKanban(d, P) {
  const cols = arr(d.columns, [{ title: 'جديد', cards: ['مهمة'] }, { title: 'جارٍ', cards: ['مهمة'] }, { title: 'مكتمل', cards: ['مهمة'] }]);
  return `<div style="display:flex;gap:8px;width:100%">${cols.map((c) => `<div style="flex:1;background:${P.card2};border-radius:12px;padding:8px"><div style="font-size:11px;color:${P.sub};font-weight:700;margin-bottom:8px;text-align:center">${esc(c.title)}</div>${arr(c.cards, []).map((t) => `<div style="background:${P.surface};border:1px solid ${P.line};border-radius:8px;padding:8px;font-size:11px;margin-bottom:6px;color:${P.text}">${esc(t)}</div>`).join('')}</div>`).join('')}</div>`;
}
function cMatrix(d, P) {
  const m = d.cells || { tl: 'افعل', tr: 'خطّط', bl: 'فوّض', br: 'احذف' };
  const cc = (txt, c) => `<div style="padding:10px;border-radius:8px;text-align:center;font-size:11px;font-weight:700;background:${c}33;color:${c}">${esc(txt)}</div>`;
  const hd = (txt) => `<div style="padding:10px;border-radius:8px;text-align:center;font-size:11px;font-weight:700;color:${P.sub}">${esc(txt)}</div>`;
  return `<div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:4px;width:100%">${hd('')}${hd(d.cx || 'سهل')}${hd(d.cy || 'صعب')}${hd(d.rx || 'مهم')}${cc(m.tl, P.good)}${cc(m.tr, P.gold)}${hd(d.ry || 'ثانوي')}${cc(m.bl, P.accent)}${cc(m.br, P.red)}</div>`;
}
function cInsight(d, P) {
  return `<div style="background:linear-gradient(135deg,${P.accent}18,transparent);border:1px solid ${P.accent}44;border-radius:14px;padding:16px;width:100%"><div style="width:34px;height:34px;border-radius:10px;background:${P.accent}22;display:flex;align-items:center;justify-content:center;margin-bottom:10px"><div style="width:16px;height:16px;background:${P.accent};border-radius:5px"></div></div><div style="font-weight:800;font-size:13px;margin-bottom:6px;color:${P.text}">${esc(d.title || 'استنتاج')}</div><div style="font-size:12.5px;color:${P.sub};line-height:1.7">${esc(d.body || '')}</div></div>`;
}
function cTable(d, P) {
  const head = arr(d.head, []); const rows = arr(d.rows, []);
  return `<table style="width:100%;border-collapse:collapse;font-size:12.5px"><thead><tr>${head.map((h) => `<th style="color:${P.sub};font-weight:700;padding:8px;text-align:right;border-bottom:1px solid ${P.line};font-size:11px">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${arr(r, []).map((c) => `<td style="padding:9px 8px;border-bottom:1px solid ${P.line};color:${P.text}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

const CHARTS = {
  pie: cPie, donut: cDonut, bar: cBar, hbar: cHbar, line: cLine, area: cArea,
  stackedBar: cStackedBar, stackedArea: cStackedArea, radar: cRadar, bubble: cBubble,
  scatter: cScatter, heatmap: cHeatmap, treemap: cTreemap, funnel: cFunnel, gauge: cGauge,
  ring: cRing, kpi: cKpi, timeline: cTimeline, calheat: cCalHeat, sankey: cSankey,
  network: cNetwork, waterfall: cWaterfall, candle: cCandle, geo: cGeo, metricTiles: cMetricTiles,
  comparison: cComparison, leaderboard: cLeaderboard, kanban: cKanban, matrix: cMatrix, insight: cInsight,
  table: cTable,
};
export function renderChart(kind, data, theme) {
  const P = pal(theme); const fn = CHARTS[kind];
  try { return fn ? fn(data || {}, P) : ''; } catch { return ''; }
}
export const CHART_KINDS = Object.keys(CHARTS);
export { THEMES, pal };

// ============================================================================
// مكوّن Card — يعرض البطاقة (تبويبات + رسوم) بثيم الوكيل
// ============================================================================
// ---------- اختبار تفاعلي داخل البطاقة (اختياري + مقالي) ----------
function QuizItem({ item, idx, P }) {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [selfMark, setSelfMark] = useState(null);
  const opts = Array.isArray(item.options) ? item.options : null;
  const isMcq = item.type === 'mcq' || (opts && opts.length > 0);
  const correct = typeof item.answer === 'number' ? item.answer : -1;
  return (
    <div style={{ background: P.card2, border: '1px solid ' + P.line, borderRadius: 12, padding: 12, marginBottom: 10 }}>
      <div style={{ color: P.text, fontWeight: 700, fontSize: 14, lineHeight: 1.8, marginBottom: 10 }}>{(idx + 1) + '. ' + (item.q || '')}</div>
      {isMcq ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {opts.map((opt, i) => {
            const answered = picked !== null;
            const isCorrect = answered && i === correct;
            const isWrongPick = answered && picked === i && i !== correct;
            const bg = isCorrect ? P.good + '22' : isWrongPick ? P.red + '22' : 'transparent';
            const bd = isCorrect ? P.good : isWrongPick ? P.red : P.line;
            const col = isCorrect ? P.good : isWrongPick ? P.red : P.text;
            return (
              <button key={i} disabled={answered} onClick={() => setPicked(i)} style={{ textAlign: 'right', background: bg, border: '1px solid ' + bd, borderRadius: 10, padding: '10px 12px', fontSize: 13.5, color: col, cursor: answered ? 'default' : 'pointer', fontFamily: FONT, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span>{opt}</span>
                {isCorrect ? <span style={{ fontSize: 11, fontWeight: 800, color: P.good }}>صح</span> : isWrongPick ? <span style={{ fontSize: 11, fontWeight: 800, color: P.red }}>خطأ</span> : null}
              </button>
            );
          })}
          {picked !== null ? (
            <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.8 }}>
              <span style={{ fontWeight: 800, color: picked === correct ? P.good : P.red }}>{picked === correct ? 'إجابة صحيحة' : 'إجابة غير صحيحة'}</span>
              {item.explain ? <span style={{ color: P.sub }}>{' — ' + item.explain}</span> : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <textarea placeholder="اكتب إجابتك هنا..." style={{ width: '100%', minHeight: 70, boxSizing: 'border-box', background: P.surface, border: '1px solid ' + P.line, borderRadius: 10, padding: 10, color: P.text, fontSize: 13.5, fontFamily: FONT, resize: 'vertical', outline: 'none', direction: 'rtl' }} />
          {!revealed ? (
            <button onClick={() => setRevealed(true)} style={{ marginTop: 8, background: P.accent + '22', color: P.accent, border: '1px solid ' + P.accent + '55', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>عرض الإجابة النموذجية</button>
          ) : (
            <div style={{ marginTop: 8, background: P.good + '14', border: '1px solid ' + P.good + '33', borderRadius: 10, padding: 11 }}>
              <div style={{ color: P.good, fontWeight: 800, fontSize: 12.5, marginBottom: 5 }}>الإجابة النموذجية</div>
              <div style={{ color: P.text, fontSize: 13.5, lineHeight: 1.85 }}>{item.modelAnswer || item.answerText || ''}</div>
              {Array.isArray(item.points) && item.points.length ? (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {item.points.map((p, j) => <div key={j} style={{ display: 'flex', gap: 7, color: P.sub, fontSize: 12.5 }}><span style={{ color: P.good }}>•</span>{p}</div>)}
                </div>
              ) : null}
              <div style={{ marginTop: 9, display: 'flex', gap: 7 }}>
                <button onClick={() => setSelfMark('ok')} style={{ background: selfMark === 'ok' ? P.good : 'transparent', color: selfMark === 'ok' ? '#0A0E1A' : P.good, border: '1px solid ' + P.good, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>إجابتي صحيحة</button>
                <button onClick={() => setSelfMark('no')} style={{ background: selfMark === 'no' ? P.red : 'transparent', color: selfMark === 'no' ? '#0A0E1A' : P.red, border: '1px solid ' + P.red, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>أعيد المحاولة</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Quiz({ items, P }) {
  const list = Array.isArray(items) ? items : [];
  return <div>{list.map((it, i) => <QuizItem key={i} item={it} idx={i} P={P} />)}</div>;
}

function TabBody({ tab, theme, P }) {
  if (!tab) return null;
  const type = tab.type || 'text';
  const d = tab.data || {};
  const kind = type === 'chart' ? d.kind : (CHART_KINDS.includes(type) ? type : null);
  if (kind) {
    return (
      <div>
        {d.intro ? <div style={{ color: P.sub, fontSize: 13, marginBottom: 10 }}>{d.intro}</div> : null}
        <div dangerouslySetInnerHTML={{ __html: renderChart(kind, d, theme) }} />
        {d.caption ? <div style={{ color: P.faint, fontSize: 12, marginTop: 8, textAlign: 'center' }}>{d.caption}</div> : null}
      </div>
    );
  }
  if (type === 'quiz') {
    return <Quiz items={arr(d.items, [])} P={P} />;
  }
  if (type === 'list') {
    return (
      <div>
        {d.intro ? <div style={{ color: P.sub, fontSize: 13, marginBottom: 8 }}>{d.intro}</div> : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {arr(d.items, []).map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, color: P.text, fontSize: 14.5, lineHeight: 1.9 }}>
              <span style={{ flexShrink: 0, marginTop: 9, width: 5, height: 5, borderRadius: '50%', background: P.accent }} />
              <span>{typeof it === 'string' ? it : (it.title ? (it.desc ? it.title + ' — ' + it.desc : it.title) : (it.desc || ''))}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'steps') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {arr(d.items, []).map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 11 }}>
            <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 9, background: P.accent + '22', color: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
            <div>
              <div style={{ color: P.text, fontWeight: 700, fontSize: 14 }}>{typeof it === 'string' ? it : it.title}</div>
              {it && it.desc ? <div style={{ color: P.sub, fontSize: 12.5, lineHeight: 1.7, marginTop: 2 }}>{it.desc}</div> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <div style={{ color: P.text, fontSize: 14.5, lineHeight: 1.95, whiteSpace: 'pre-wrap' }}>{d.body || d.text || ''}</div>;
}

export function Card({ card, theme = 'marn', sources, showFollowUps = true }) {
  const P = pal(theme);
  const [active, setActive] = useState(0);
  if (!card) return null;
  const tabs = Array.isArray(card.tabs) ? card.tabs : [];
  const tab = tabs[active] || tabs[0];
  return (
    <div style={{ background: P.surface, border: '1px solid ' + P.line, borderRadius: 18, padding: 16, fontFamily: FONT, direction: 'rtl' }}>
      {card.kicker ? <div style={{ color: P.accent, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, marginBottom: 4 }}>{card.kicker}</div> : null}
      {card.title ? <div style={{ color: P.text, fontWeight: 800, fontSize: 17, marginBottom: card.sub ? 2 : 12 }}>{card.title}</div> : null}
      {card.sub ? <div style={{ color: P.sub, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{card.sub}</div> : null}
      {tabs.length > 1 ? (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {tabs.map((tb, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ background: i === active ? P.accent : 'transparent', color: i === active ? '#0A0E1A' : P.sub, border: '1px solid ' + (i === active ? P.accent : P.line), borderRadius: 999, padding: '6px 13px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{(tb && tb.label) || ('قسم ' + (i + 1))}</button>
          ))}
        </div>
      ) : null}
      <div style={{ minHeight: 40 }}><TabBody tab={tab} theme={theme} P={P} /></div>
      {showFollowUps && Array.isArray(card.followUps) && card.followUps.length > 0 ? (
        <div style={{ borderTop: '1px solid ' + P.line, marginTop: 14, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {card.followUps.slice(0, 4).map((f, i) => (
            <div key={i} style={{ color: P.accent, fontSize: 13, display: 'flex', gap: 7 }}><span style={{ color: P.faint }}>•</span>{f}</div>
          ))}
        </div>
      ) : null}
      {Array.isArray(sources) && sources.length > 0 ? (
        <div style={{ borderTop: '1px solid ' + P.line, marginTop: 14, paddingTop: 12 }}>
          <div style={{ color: P.sub, fontWeight: 700, fontSize: 12, marginBottom: 7 }}>{'المصادر (' + sources.length + ')'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {sources.slice(0, 20).map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, color: P.accent, fontSize: 13, textDecoration: 'none' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || s.domain || s.url}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
