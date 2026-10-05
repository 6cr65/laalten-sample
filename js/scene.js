/* The Laalten: the drawn world.
   One building in Kamla Nagar, from the street to the roof, in flat hand-cut shapes.
   Rules of the style: flat colour only, no blur, no outlines, slightly wobbly edges,
   and everything mirrored about the door (x = 800). Only lettering and the things
   that live in the scene (cats, students, goods) differ from one side to the other.
   World units: x 0..1600 (building 450..1150), y grows downward. */
(function () {
'use strict';

const Y = { beam: 580, deck: 900, f2: 1380, f1: 1900, sign: 1960, g: 2380, road: 2402, end: 2800 };
const K = {
  wall2: '#7a5488', wall2d: '#6a4779', wall1: '#3b5a94', wall1d: '#32508a', wallG: '#262b5a',
  ledge: '#b9b2cf', ledgeL: '#d3cde3', frame: '#b9b2cf',
  off: '#1b2150', on: '#ffd27a', on2: '#ffb95e', stair: '#ffe2a0', stairD: '#e2a850',
  red: '#e8472f', redD: '#b83322', redL: '#f2644e', mar: '#ffbf3c', teal: '#12999a', tealD: '#0c6f73',
  cream: '#f5ecd9', ink: '#151a3c', inkD: '#0c0f2a', leaf: '#2f8f5b', leafL: '#58b874', leafD: '#1f6a45',
  pink: '#ff7aa2', road: '#171a3e', path: '#3a3d6e', far: '#3b2f63',
  wood: '#6b4630', terra: '#b8563a', metal: '#8e93bd', steel: '#cfd3e6', sil: '#2a2140'
};

/* ---------- drawing helpers ---------- */
let rand = rng(1);
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const f = n => Math.round(n * 10) / 10;
const j = k => (rand() - .5) * 2 * k;
const pick = a => a[Math.floor(rand() * a.length)];
function R(x, y, w, h, fill, k = 1.1, a = '') {
  const p = [[x + j(k), y + j(k)], [x + w + j(k), y + j(k)], [x + w + j(k), y + h + j(k)], [x + j(k), y + h + j(k)]];
  return `<path d="M${p.map(q => f(q[0]) + ' ' + f(q[1])).join('L')}Z" fill="${fill}" ${a}/>`;
}
function P(pts, fill, a = '', k = .7) {
  return `<path d="M${pts.map(q => f(q[0] + j(k)) + ' ' + f(q[1] + j(k))).join('L')}Z" fill="${fill}" ${a}/>`;
}
const C = (cx, cy, r, fill, a = '') => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${a}/>`;
const E = (cx, cy, rx, ry, fill, a = '') => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${a}/>`;
const L = (d, stroke, w, a = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${a}/>`;
function T(x, y, size, txt, fill, o = {}) {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="middle" font-family="${o.font || 'Yatra One'}, sans-serif"${o.w ? ` font-weight="${o.w}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.a ? ' ' + o.a : ''}>${txt}</text>`;
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16), t = amt < 0 ? 0 : 255, p = Math.abs(amt) / 100;
  const c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v + (t - v) * p));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}
/* mirror about the door */
const M = s => `<g transform="translate(1600 0) scale(-1 1)">${s}</g>`;
const both = s => s + M(s);

const arch = (x, y, w, h, r) => `M${f(x)} ${f(y + h)}L${f(x)} ${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}L${f(x + w)} ${f(y + h)}Z`;
function win(x, y, w, h, fill, o = {}) {
  const r = w / 2, fr = 6, fc = K.frame;
  let s = `<path d="${arch(x - fr, y - fr, w + fr * 2, h + fr, r + fr)}" fill="${fc}"/><path d="${arch(x, y, w, h, r)}" fill="${fill}"/>`;
  if (o.inside) s += o.inside;
  if (o.bars !== false) s += R(x + w / 2 - 1.5, y + 2, 3, h - 2, fc, .2) + R(x, y + r, w, 3, fc, .2);
  if (o.grill) for (let i = 1; i < 4; i++) s += R(x, y + r + (h - r) * i / 4, w, 2.4, fc, .2);
  return s + R(x - 11, y + h, w + 22, 9, K.ledgeL, .6);
}
function awning(x, y, w, h, c1, c2, n) {      // n is odd so the stripes mirror about the middle
  const sw = w / n; let s = '';
  for (let i = 0; i < n; i++) s += `<path d="M${f(x + i * sw)} ${y}h${f(sw)}v${h}a${f(sw / 2)} ${f(sw / 2)} 0 0 1 ${f(-sw)} 0Z" fill="${i % 2 ? c2 : c1}"/>`;
  return s + R(x - 3, y - 5, w + 6, 8, shade(c1, -30), .5);
}
function tank(cx, by) {
  return R(cx - 27, by - 16, 6, 16, K.metal) + R(cx + 21, by - 16, 6, 16, K.metal) + R(cx - 32, by - 20, 64, 5, K.metal, .5) +
    R(cx - 34, by - 78, 68, 58, K.inkD, 1) + E(cx, by - 78, 34, 8, '#1d2150') + R(cx - 11, by - 90, 22, 9, K.inkD) +
    R(cx - 34, by - 60, 68, 3.5, '#1d2150', .4) + R(cx - 34, by - 42, 68, 3.5, '#1d2150', .4);
}
function ac(x, y) {
  return R(x, y, 62, 38, K.steel) + C(x + 20, y + 19, 12, '#9aa0c6') + C(x + 20, y + 19, 4, K.steel) + R(x + 40, y + 9, 16, 3, '#9aa0c6', .3) + R(x + 40, y + 17, 16, 3, '#9aa0c6', .3) + R(x + 40, y + 25, 16, 3, '#9aa0c6', .3) + L(`M${x + 54} ${y + 38}v22`, '#9aa0c6', 2.5);
}
function plant(cx, by, sc = 1, lit = 0) {
  const g = lit ? [K.leafL, K.leaf, '#7fd08f'] : [K.leaf, K.leafD, K.leaf];
  return C(cx - 9 * sc, by - 22 * sc, 11 * sc, g[1]) + C(cx + 9 * sc, by - 22 * sc, 11 * sc, g[0]) + C(cx, by - 32 * sc, 11 * sc, g[2]) +
    P([[cx - 12 * sc, by - 16 * sc], [cx + 12 * sc, by - 16 * sc], [cx + 9 * sc, by], [cx - 9 * sc, by]], lit ? '#d2674a' : K.terra, '', 0);
}
/* stairs seen straight on: a stack of treads narrowing as they go up */
function steps(cx, by, w, n, h) {
  let s = '';
  for (let i = 0; i < n; i++) { const ww = w * (1 - i / (n + 1.5)); s += R(cx - ww / 2, by - (i + 1) * h, ww, h + .5, i % 2 ? '#e09a3c' : '#eeb357', 0); }
  return s;
}
function bulb(x, y0, len) { return L(`M${x} ${y0}v${len}`, '#5a4a3a', 1.6) + C(x, y0 + len + 10, 24, 'rgba(255,255,255,.32)') + C(x, y0 + len + 10, 9, '#fffdf5'); }

/* ---------- a neighbour (drawn once on the left, mirrored to the right) ---------- */
function building(o) {
  const keep = rand; rand = rng(o.seed * 97 + 1);
  const c = o.c, tr = shade(c, 16);
  let s = R(o.x, o.top, o.w, Y.g - o.top, c) + R(o.x - 5, o.top - 18, o.w + 10, 20, tr);
  const cols = Math.max(2, Math.round(o.w / 100)), gap = o.w / cols;
  for (let fy = o.top + 64; fy < Y.f1 - 130; fy += 236) {
    for (let i = 0; i < cols; i++) {
      const wx = o.x + gap * i + gap / 2 - 30, lit = rand() < .42;
      s += R(wx - 4, fy - 4, 68, 100, tr, .6) + R(wx, fy, 60, 92, lit ? pick([K.on, K.on2, '#ffe2a0']) : K.off, .4);
      if (lit && rand() < .55) s += R(wx, fy, 20, 92, pick([K.pink, K.teal, K.red, '#8b6bd0']), .4);
      s += R(wx + 28, fy, 4, 92, tr, .2);
    }
    s += R(o.x, fy + 160, o.w, 7, shade(c, 8), .5);
  }
  // shop at street level
  s += R(o.x + 14, Y.sign + 6, o.w - 28, Y.g - Y.sign - 6, o.shut ? '#3a3f78' : '#f0c074', .6);
  if (o.shut) for (let yy = Y.sign + 44; yy < Y.g - 8; yy += 18) s += R(o.x + 14, yy, o.w - 28, 3, '#2d3168', .3);
  else {
    for (let yy = Y.sign + 130; yy < Y.g - 150; yy += 70) { s += R(o.x + 24, yy, o.w - 48, 5, '#b8823c', .4); for (let xx = o.x + 30; xx < o.x + o.w - 50; xx += 26) s += R(xx, yy - 22 - rand() * 10, 16, 22 + rand() * 10, pick([K.red, K.teal, K.cream, K.pink, K.mar, '#8b6bd0']), .5); }
    s += R(o.x + 14, Y.g - 130, o.w - 28, 130, shade(o.awn, -28), .6) + R(o.x + 14, Y.g - 130, o.w - 28, 9, o.awn, .4);
  }
  const n = Math.round((o.w - 16) / 26) | 1;
  s += awning(o.x + 8, Y.sign + 4, o.w - 16, 30, o.awn, K.cream, n) + R(o.x + 8, Y.f1 - 2, o.w - 16, 60, o.sign, .8);
  if (o.tank) s += tank(o.x + o.w * o.tank, o.top - 18);
  if (o.line) {
    const lx = o.x + o.w * .44, ly = o.top - 78;
    s += R(lx, ly, 4, 60, K.metal) + R(lx + 110, ly, 4, 60, K.metal) + L(`M${lx + 2} ${ly + 4}q55 14 110 0`, K.metal, 1.6);
    [[12, K.red, 24, 30], [42, K.cream, 26, 38], [74, K.teal, 24, 30]].forEach(([dx, col, w, h]) => s += R(lx + dx, ly + 9 + Math.sin(dx / 35) * 4, w, h, col, 1.2));
  }
  rand = keep; return s;
}

/* ---------- the red hurricane lantern (the laalten itself) ---------- */
function lanternBody(lit) {
  const glass = lit ? '#ffe9ad' : '#343a78';
  return L('M30 64C30 4 90 4 90 64', K.red, 4.5) + C(60, 19, 5.5, 'none', `stroke="${K.redD}" stroke-width="3"`) +
    `<path d="M44 53Q60 34 76 53Z" fill="${K.redD}"/><path d="M47 40h26v8h-26zM40 52h40v10h-40z" fill="${K.red}"/>` +
    L('M40 60C16 72 16 122 30 140', K.red, 6) + L('M80 60C104 72 104 122 90 140', K.red, 6) +
    `<path d="M46 64C29 78 29 112 46 128L74 128C91 112 91 78 74 64Z" fill="${glass}"/>` +
    (lit ? '<g class="flame"><path d="M60 82C71 97 69 114 60 119C51 114 49 97 60 82Z" fill="#ff8a2a"/><path d="M60 96C65.500 104 64.500 114 60 116.500C55.500 114 54.500 104 60 96Z" fill="#fff3c4"/></g>'
      : L('M41 80C36 92 36 102 40 112M79 80C84 92 84 102 80 112', '#4a5196', 3)) +
    L('M33 96H87', K.redD, 2) + `<path d="M48 128h24v9h-24z" fill="${K.redD}"/>` +
    `<path d="M25 139L95 139L88 161L32 161Z" fill="${K.red}"/><path d="M35 145h50v4h-50z" fill="${K.redL}"/><path d="M30 160h60v6h-60z" fill="${K.redD}"/>`;
}
const lantern = (lit = true, cls = '') => `<svg class="${cls}" viewBox="0 0 120 170" aria-hidden="true">${lanternBody(lit)}</svg>`;

/* ---------- the roof (drawn twice: dark, and lit) ---------- */
function roof(lit) {
  rand = rng(23);
  const wh = lit ? '#fbf4e4' : '#aaa5c6', whD = lit ? '#e6dac0' : '#8d88ad', cu = lit ? '#18b0ae' : K.tealD;
  const lf = lit ? [K.leafL, K.leaf, '#7fd08f', K.leaf] : [K.leaf, K.leafD, K.leafD, '#286f4c'];
  let s = '', h = '';         // h = the left half, mirrored afterwards
  if (lit) s += C(800, 726, 172, 'rgba(255,196,110,.10)', 'class="ring r3"') + C(800, 726, 112, 'rgba(255,196,110,.13)', 'class="ring r2"') + C(800, 726, 62, 'rgba(255,206,120,.2)', 'class="ring r1"');
  // a table and two chairs, seen over the parapet
  const cx = 668;
  [-64, 38].forEach(dx => { h += `<path d="${arch(cx + dx, 790, 26, 66, 13)}" fill="${wh}"/>` + R(cx + dx + 3, 822, 20, 30, cu, .4); });
  h += R(cx - 42, 824, 84, 8, wh, .5) + R(cx - 4, 832, 8, 30, whD, .3);
  h += R(cx - 30, 808, 9, 16, lit ? '#bfe8e6' : '#5c62a0', .3) + R(cx + 21, 808, 9, 16, lit ? '#bfe8e6' : '#5c62a0', .3);
  h += R(cx - 6, 810, 12, 14, lit ? K.red : K.redD, .3) + (lit ? C(cx, 806, 15, 'rgba(255,206,120,.28)') + C(cx, 806, 4.2, '#fff3c4') : '');
  s += both(h); h = '';
  // parapet and planters
  s += R(440, 858, 720, 46, wh, .6) + R(432, 849, 736, 12, lit ? '#fffaf0' : '#c4bfdc', .5);
  for (let x = 800 - 29 * 12; x < 1150; x += 58) s += R(x - 1.5, 868, 3, 30, whD, .2);
  s += both(plant(462, 850, 1.15, lit) + plant(574, 850, .9, lit));
  // pergola
  s += both(R(470, 592, 14, 262, wh, .5) + R(620, 592, 14, 262, wh, .5));
  for (let x = 800 - 38 * 9; x < 1148; x += 38) s += R(x - 4.5, 562, 9, 20, whD, .3);
  s += R(436, 578, 728, 18, wh, .6);
  // string of bulbs
  const sag = x => 624 + 46 * (1 - Math.pow((x - 800) / 314, 2));
  s += L('M486 624Q800 716 1114 624', lit ? '#6a5a4a' : '#4a4f86', 1.6);
  for (let x = 800 - 47.5 * 6; x <= 1090; x += 47.5) { if (Math.abs(x - 800) < 60) continue; const y = sag(x) + 4; s += lit ? C(x, y, 11, 'rgba(255,206,120,.26)') + C(x, y, 4.6, '#ffe7a3') : C(x, y, 4.2, '#7d7fb5'); }
  // hanging greens and white flower strands: one half, mirrored
  for (let x = 446; x < 796; x += 13 + rand() * 7) {
    const d = 800 - x, len = d < 70 ? 12 + rand() * 16 : 34 + rand() * 60 + d * .22;
    if (rand() < .22) { for (let y = 600; y < 596 + len * .9; y += 9) h += C(x, y, 2.6, lit ? '#fffdf5' : '#c4bfdc'); continue; }
    h += L(`M${f(x)} 596v${f(len)}`, lf[1], 1.5);
    for (let y = 604, i = 0; y < 596 + len; y += 10, i++) { const dir = i % 2 ? 1 : -1; h += `<path d="M${f(x)} ${f(y)}q${6 * dir} -7 ${11 * dir} 1q${-6 * dir} 4 ${-11 * dir} -1Z" fill="${pick(lf)}"/>`; }
  }
  for (let x = 440; x < 800; x += 22) h += C(x + j(4), 590 + j(5), 13 + rand() * 6, pick(lf));
  s += both(h) + C(800, 590, 15, lf[0]);
  // the lantern, hung from the middle of the beam
  s += L('M800 596V650', lit ? '#6a5a4a' : '#4a4f86', 2) + `<g transform="translate(740 628)">${lanternBody(lit)}</g>`;
  return s;
}

/* ---------- the near layer: street, building, neighbours ---------- */
function near() {
  rand = rng(11);
  let s = '', h = '';
  // neighbours: tall wings at the edges, lower roofs beside us
  s += both(building({ x: -86, w: 238, top: 800, c: '#222757', seed: 3, sign: K.teal, awn: K.teal, shut: 1 }));
  s += both(building({ x: 150, w: 300, top: 1110, c: '#2a2f66', seed: 5, sign: K.mar, awn: K.red, tank: .22, line: 1 }));
  s += T(33, Y.f1 + 40, 30, 'BOOKS', K.cream) + T(1567, Y.f1 + 40, 30, 'TAILOR', K.cream);
  s += T(300, Y.f1 + 40, 30, 'चाय · CHAI', K.ink) + T(1300, Y.f1 + 40, 30, 'JUICE · जूस', K.ink);
  // a kite flyer on each neighbour's roof
  s += both(C(424, 1068, 8, K.inkD) + R(417, 1076, 14, 18, K.inkD, .4) + L('M428 1080l13 -16', K.inkD, 4) + L('M441 1064Q560 800 664 506', '#8e93bd', 1));

  /* --- the building --- */
  s += R(450, Y.deck, 700, Y.f2 - Y.deck, K.wall2, .6) + R(450, Y.f2, 700, Y.f1 - Y.f2, K.wall1, .6) + R(450, Y.f1, 700, Y.g - Y.f1, K.wallG, .6);
  s += R(450, 1380, 700, 26, K.wall1d, .4) + R(450, 900, 700, 22, K.wall2d, .4);
  s += both(R(456, Y.deck, 8, Y.g - Y.deck, '#565b93', .5) + R(452, 1160, 16, 7, '#565b93', .3) + R(452, 1700, 16, 7, '#565b93', .3));
  s += R(440, Y.f2 - 7, 720, 15, K.ledge, .5) + R(440, Y.f1 - 8, 720, 12, K.ledge, .5);

  // second floor: dark outer windows, a student either side of the stairwell
  const w2 = 1215, h2 = 130;
  s += both(win(490, w2, 90, h2, K.off, { grill: 1 }) + ac(504, 1132));
  const student = (book, shadeC) => R(630, 1318, 90, 27, K.wood, .3) + C(658, 1284, 11, K.sil) + E(658, 1312, 21, 15, K.sil) + R(682, 1309, 25, 7, book[0], .3) + R(684, 1302, 21, 7, book[1], .3) + L('M712 1318V1290L702 1281', K.sil, 2.5) + P([[692, 1277], [704, 1272], [708, 1286], [696, 1290]], shadeC, '', .3);
  s += win(630, w2, 90, h2, K.on, { bars: false, inside: student([K.red, K.mar], K.teal) });
  s += M(win(630, w2, 90, h2, K.on, { bars: false, inside: student([K.teal, K.pink], K.red) }));
  s += win(760, w2, 80, h2, K.stair, { bars: false, inside: steps(800, 1345, 74, 5, 13) });
  s += R(744, 1166, 112, 34, K.cream, .6) + T(800, 1190, 19, '↑ बस एक और', K.red);
  s += both([536, 560].map((x, i) => { const d = i ? -1 : 1; return E(x, Y.f2 - 15, 11, 7, '#a9aed0') + C(x + 9 * d, Y.f2 - 23, 5, '#a9aed0') + P([[x + 13 * d, Y.f2 - 23], [x + 19 * d, Y.f2 - 21], [x + 13 * d, Y.f2 - 20]], K.mar, '', .2) + P([[x - 9 * d, Y.f2 - 16], [x - 20 * d, Y.f2 - 12], [x - 9 * d, Y.f2 - 11]], '#8e93bd', '', .2); }).join(''));

  // first floor: lit grilled windows outside, a cat on each inner sill
  const w1 = 1420, h1 = 150;
  s += both(win(490, w1, 90, h1, K.on2, { grill: 1 }) + ac(504, 1590));
  const cat = R(630, 1466, 20, 104, K.teal, .3) + E(672, 1557, 20, 12, K.sil) + C(689, 1543, 9, K.sil) + P([[682, 1538], [685, 1528], [690, 1536]], K.sil, '', .2) + P([[690, 1536], [695, 1528], [697, 1539]], K.sil, '', .2) + L('M653 1558q-9 -3 -6 -16', K.sil, 4);
  s += both(win(630, w1, 90, h1, K.on, { bars: false, inside: cat }));
  s += win(760, w1, 80, h1, K.stair, { bars: false, inside: steps(800, 1570, 74, 6, 13) });
  s += R(744, 1586, 112, 34, K.cream, .6) + T(800, 1610, 19, '↑ दो और · 2 MORE', K.red, { a: 'textLength="98" lengthAdjust="spacingAndGlyphs"' });

  // painted wall sign: the name
  s += R(606, 1640, 388, 250, '#1b2150', .8) + `<rect x="616" y="1650" width="368" height="230" fill="none" stroke="${K.cream}" stroke-width="2" opacity=".75"/>`;
  s += T(800, 1688, 15, 'ROOFTOP · KAMLA NAGAR', K.cream, { font: 'Anek Latin', w: 700, ls: 3 });
  s += T(800, 1754, 62, 'The Laalten', K.cream, { font: 'Eczar', w: 800 });
  s += T(800, 1836, 88, 'लालटेन', K.mar, { font: 'Eczar', w: 800 });
  s += T(800, 1869, 16, '↑ तीन मंज़िल ऊपर', K.red);
  // either side of it: a tube light, the usual notice (one per language), and the posters stuck there anyway
  s += both(R(472, 1846, 88, 7, '#eaf2ff', .3) + R(468, 1844, 6, 11, K.metal, .2) + R(558, 1844, 6, 11, K.metal, .2) +
    `<g transform="rotate(-5 498 1790)">${R(474, 1756, 46, 66, K.pink, 1)}${R(480, 1767, 34, 5, K.ink, .3)}${R(480, 1778, 24, 4, K.ink, .3)}</g><g transform="rotate(4 542 1796)">${R(526, 1770, 34, 50, K.mar, 1)}</g>`);
  s += T(516, 1700, 18, 'STICK NO', '#c9cde6', { font: 'Anek Latin', w: 800, ls: 1 }) + T(516, 1722, 18, 'BILLS', '#c9cde6', { font: 'Anek Latin', w: 800, ls: 1 });
  s += T(1084, 1700, 17, 'पोस्टर लगाना', '#c9cde6') + T(1084, 1723, 17, 'मना है', '#c9cde6');

  // signboards
  s += both(R(462, 1898, 222, 64, K.red, .8));
  s += T(573, 1941, 34, 'फोटोस्टेट', K.mar) + T(573, 1956, 9, 'PRINT · LAMINATION · SPIRAL', K.cream, { font: 'Anek Latin', w: 700, ls: 1 });
  s += T(1027, 1941, 36, 'मोमोज़', K.mar) + T(1027, 1956, 9, 'STEAMED · FRIED · TANDOORI', K.cream, { font: 'Anek Latin', w: 700, ls: 1 });
  s += R(700, 1902, 200, 58, K.cream, .6) + T(800, 1928, 21, 'THE LAALTEN', K.red, { font: 'Eczar', w: 800, ls: .5 }) + T(800, 1948, 12.5, '↑ ROOFTOP · 3RD FLOOR', K.ink, { font: 'Anek Latin', w: 700, ls: 1.5 });

  // the two shops: same shell either side, different trade
  h = R(470, 1966, 206, 414, '#ffd98a', .5);
  for (let yy = 2086; yy < 2200; yy += 74) { h += R(478, yy, 190, 5, '#c9953f', .4); for (let xx = 486; xx < 652; xx += 24) h += R(xx, yy - 30 - rand() * 14, 17, 30 + rand() * 14, pick(['#fffdf5', K.pink, '#bfd8ff', K.mar, '#fffdf5', K.teal]), .5); }
  h += bulb(574, 1990, 44) + R(470, 2250, 206, 130, K.redD, .5) + R(470, 2250, 206, 9, K.red, .3);
  h += R(470, 1966, 206, 22, '#9aa0c6', .4) + R(470, 1974, 206, 2.5, '#7c82ad', .2) + R(470, 1981, 206, 2.5, '#7c82ad', .2) + awning(464, 1990, 218, 30, K.teal, K.cream, 9);
  h += R(486, 2222, 40, 28, '#fffdf5', .6) + R(490, 2212, 32, 10, K.mar, .5);
  s += both(h);
  // left: the photocopier.  right: the momo steamer
  s += R(594, 2190, 78, 60, '#e9e4f2', .6) + R(602, 2200, 62, 8, '#3a3f78', .3) + R(600, 2182, 66, 9, '#cfc8de', .4) + T(573, 2330, 34, 'XEROX', K.mar, { font: 'Anek Latin', w: 800, ls: 2 });
  [0, 1, 2].forEach(i => s += R(930, 2226 - i * 24, 74, 24, K.steel, .4) + R(930, 2226 - i * 24, 74, 4, '#9aa0c6', .2));
  s += `<path d="M928 2178q39 -30 78 0Z" fill="${K.steel}"/>` + C(967, 2160, 5, '#9aa0c6') + T(1027, 2330, 34, 'MOMOS', K.mar, { font: 'Anek Latin', w: 800, ls: 2 });

  // the door, with the stairs going straight up
  s += R(706, 1972, 188, 408, K.inkD, .5) + R(720, 1988, 160, 392, '#ffcf70', .3);
  s += steps(800, 2380, 160, 9, 26) + both(L('M724 2334L784 2150', '#a8662a', 4) + L('M724 2334v32M754 2242v40M784 2150v36', '#a8662a', 3));
  s += bulb(800, 1988, 36) + T(800, 2118, 44, '↑', K.red, { font: 'Anek Latin', w: 800 });
  // either side of the door: the meter box, and the number plate
  s += R(680, 2064, 26, 38, '#4a4f86', .4) + R(685, 2070, 16, 10, '#8e93bd', .2) + L('M693 2064C693 2030 676 2030 680 1996M697 2064C700 2034 712 2026 706 1996', '#0c0f2a', 1.6);
  s += R(886, 2068, 40, 30, '#1f4fd0', .4) + `<rect x="889" y="2071" width="34" height="24" fill="none" stroke="#fffdf5" stroke-width="1.2"/>` + T(906, 2090, 15, '2/11', '#fffdf5', { font: 'Anek Latin', w: 800 });

  // street
  s += R(-300, Y.g, 2200, 24, K.path, .3) + R(-300, Y.road, 2200, Y.end - Y.road, K.road, 0);
  for (let i = -26; i <= 26; i++) s += R(778 + i * 44, Y.g, 44, 11, i % 2 ? '#10132f' : '#e3b340', .3);
  for (let i = -7; i <= 7; i++) s += R(765 + i * 150, 2478, 70, 5, '#2c3068', .3);
  // a dog asleep on each side of the door, a scooter and an e-rickshaw further along
  h = E(640, 2371, 32, 12, '#c79e63') + C(669, 2367, 10, '#c79e63') + P([[664, 2360], [668, 2351], [673, 2360]], '#a37c45', '', .2) + L('M609 2372q-10 -4 -6 -14', '#c79e63', 5) + E(676, 2370, 4, 3, '#a37c45');
  h += C(486, 2388, 15, K.inkD) + C(486, 2388, 6, K.metal) + C(558, 2388, 15, K.inkD) + C(558, 2388, 6, K.metal) +
    P([[482, 2372], [496, 2350], [538, 2350], [550, 2330], [560, 2330], [568, 2376], [528, 2384], [498, 2384]], K.teal, '', .3) + R(498, 2342, 40, 9, K.inkD, .4) + L('M554 2332l-4 -22l12 -4', K.inkD, 4) + C(568, 2338, 5, '#fff3c4');
  h += R(232, 2292, 150, 74, K.red, .6) + R(226, 2278, 162, 16, K.mar, .6) + R(244, 2302, 52, 40, '#1b2150', .4) + R(308, 2302, 62, 40, '#ffe2a0', .4) + C(260, 2384, 17, K.inkD) + C(260, 2384, 6, K.metal) + C(360, 2384, 17, K.inkD) + C(360, 2384, 6, K.metal) + R(222, 2352, 170, 16, K.inkD, .4);
  s += both(h);

  // the roof, unlit
  s += roof(false);
  return s;
}

/* ---------- live bits on the near layer (small animated things) ---------- */
function live() {
  const kite = (c1, c2) => `<path d="M664 440L696 476L664 518L632 476Z" fill="${c1}"/><path d="M664 440L696 476L632 476Z" fill="${c2}"/><path d="M664 518q-9 14 0 27q9 13 0 26" fill="none" stroke="${c2}" stroke-width="2.4" stroke-linecap="round"/>`;
  let s = '<g class="steam">' + [0, 1, 2].map(i => C(950 + i * 17, 2154, 7 + i, 'rgba(255,255,255,.55)', `style="--d:${i * .9}s"`)).join('') + '</g>';
  s += `<g class="kite" style="transform-origin:664px 506px">${kite(K.pink, K.mar)}</g>`;
  s += M(`<g class="kite k2" style="transform-origin:664px 506px">${kite(K.mar, K.pink)}</g>`);
  s += '<g class="birds">' + [[0, 0], [26, -12], [52, -24], [78, -12], [104, 0]].map(([x, y], i) => `<path d="M${x} ${y}q6 -8 12 0q6 -8 12 0" fill="none" stroke="#0c0f2a" stroke-width="2.4" stroke-linecap="round" style="--d:${Math.abs(i - 2) * .12}s"/>`).join('') + '</g>';
  return s;
}

/* ---------- far city: one half, mirrored ---------- */
function far() {
  rand = rng(41);
  let h = '', x;
  const lights = (x, w, top, n, c) => { let o = ''; for (let i = 0; i < n; i++) if (rand() < .55) o += R(x + 6 + rand() * (w - 14), top + 8 + rand() * 46, 3.4, 4.4, rand() < .75 ? '#ffd58a' : c, .2); return o; };
  x = -300; while (x < 800) { const w = 26 + rand() * 60, t = 777 - rand() * 46; h += R(x, t, w + 2, 1700, '#6d4683', .4); if (rand() < .35) h += R(x + w * .3, t - 11, 13, 11, '#6d4683', .3); if (rand() < .14) h += R(x + w * .6, t - 34, 2, 34, '#6d4683', .2); h += lights(x, w, t, 2, '#ff9a5a'); x += w; }
  x = -300; while (x < 800) { const w = 40 + rand() * 80, t = 819 - rand() * 58; h += R(x, t, w + 2, 1700, '#4f3a78', .5); if (rand() < .4) { const tx = x + w * (.15 + rand() * .5); h += R(tx, t - 20, 20, 17, '#3d2d68', .4) + R(tx + 2, t - 4, 2.5, 5, '#3d2d68', .2) + R(tx + 15, t - 4, 2.5, 5, '#3d2d68', .2); } h += lights(x, w, t, 3, '#ff9a5a'); x += w; }
  x = -300; while (x < 800) {
    const w = 60 + rand() * 120, t = 881 - rand() * 70;
    h += R(x, t, w + 2, 1700, K.far, .6);
    if (rand() < .5) { const tx = x + w * (.2 + rand() * .5); h += R(tx, t - 26, 26, 22, '#241c47', .5) + R(tx + 3, t - 5, 3, 6, '#241c47', .2) + R(tx + 20, t - 5, 3, 6, '#241c47', .2); }
    if (rand() < .3) h += R(x + w * .7, t - 30, 2.5, 30, '#241c47', .2) + C(x + w * .7 - 7, t - 28, 9, '#241c47');
    h += lights(x, w, t, 5, '#ff8a6a');
    x += w;
  }
  // a phone tower with its red light, and a few trees
  h += `<g transform="translate(0 191)">${L('M338 640L350 372L362 640M341 580h18M343 520h14M345 460h10M341 580l16 -60l-12 -60', '#241c47', 3) + R(336, 400, 28, 5, '#241c47', .3) + C(350, 368, 4, '#ff5a4a', 'class="blink"')}</g>`;
  [[90, 871], [560, 863]].forEach(([tx, ty]) => h += C(tx, ty, 26, '#2c2452') + C(tx + 24, ty + 6, 20, '#2c2452') + C(tx - 22, ty + 8, 18, '#2c2452'));
  return both(h);
}

/* ---------- sky ---------- */
function sky() {
  rand = rng(53);
  let s = `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0c1130"/><stop offset=".16" stop-color="#171c48"/><stop offset=".3" stop-color="#3a2f72"/>
    <stop offset=".4" stop-color="#7d3f84"/><stop offset=".47" stop-color="#c9577a"/><stop offset=".53" stop-color="#f08a5d"/><stop offset=".6" stop-color="#f8c182"/><stop offset="1" stop-color="#f8c182"/>
  </linearGradient></defs><g transform="translate(0 259)"><rect x="-300" y="-460" width="2300" height="1660" fill="#0c1130"/><rect x="-300" y="-200" width="2300" height="1400" fill="url(#dusk)"/>`;
  let h = '';
  for (let i = 0; i < 46; i++) { const y = -150 + rand() * 440; h += C(-250 + rand() * 1030, y, .7 + rand() * 1.1, '#fff8e6', `opacity="${f(.25 + rand() * .7)}"${rand() < .25 ? ` class="tw" style="--d:${f(rand() * 5)}s"` : ''}`); }
  // a crescent lying on its back, straight above the lantern
  return s + both(h) + '<path d="M766 196A34 34 0 0 0 834 196A41 41 0 0 1 766 196Z" fill="#fff3c4"/></g>';
}

/* ---------- foreground: two lamp posts, wires, a lost kite ----------
   The layers line up exactly when the camera is at the roof (camB) and drift apart below it,
   so each piece is placed for the camera height at which it is meant to be seen. */
function fg(camA, camB, hU) {
  rand = rng(61);
  const at = (y, cam) => y + (cam - camB) * .3;
  let s = '', h = '';
  // a street lamp either side of the door, seen from the street
  const top = at(1978, camA);
  h += P([[650, top + 16], [690, top + 16], [790, top + 520], [530, top + 520]], 'rgba(255,205,120,.08)', '', 0);
  h += R(604, top, 10, 900, K.inkD, .4) + R(604, top - 6, 76, 8, K.inkD, .3) + P([[650, top - 10], [696, top - 10], [692, top + 10], [654, top + 10]], K.inkD, '', .3) + R(658, top + 10, 30, 5, '#ffe9ad', .2) + R(594, top + 46, 30, 40, K.inkD, .5);
  [[0, 20], [14, 34]].forEach(([dy, sg]) => h += L(`M609 ${top + 52 + dy}Q150 ${top + 52 + dy + sg * 2} -300 ${top + 30 + dy}`, K.inkD, 2.2));
  s += both(h);
  // wires along the ledge between the floors, with a kite caught in the middle
  const ky = at(1392, 1392 - hU / 2);
  s += L(`M-300 ${ky - 6}Q800 ${ky + 44} 1900 ${ky - 6}`, K.inkD, 2.2) + L(`M-300 ${ky + 16}Q800 ${ky + 62} 1900 ${ky + 16}`, K.inkD, 2);
  s += `<path d="M800 ${ky + 18}l24 28l-24 38l-24 -38Z" fill="${K.teal}"/><path d="M800 ${ky + 18}l24 28h-48Z" fill="${K.cream}"/>` + L(`M800 ${ky + 84}q-7 12 0 22q7 10 0 20`, K.cream, 2);
  return s;
}
/* greens that hang in front of you once you are on the roof (slides in from the top) */
function canopy() {
  rand = rng(67);
  let h = '';
  for (let x = -280; x < 796; x += 15 + rand() * 12) {
    const d = Math.min(1, (800 - x) / 230), len = 12 + rand() * 18 + d * (40 + rand() * 50);
    h += L(`M${f(x)} 0v${f(len)}`, K.leafD, 1.8);
    for (let y = 6, i = 0; y < len; y += 11, i++) { const dir = i % 2 ? 1 : -1; h += `<path d="M${f(x)} ${f(y)}q${7 * dir} -8 ${13 * dir} 1q${-7 * dir} 5 ${-13 * dir} -1Z" fill="${pick([K.leafD, '#18563a', '#226f49'])}"/>`; }
  }
  return both(h);
}

/* ---------- the blue enamel house-number plate ---------- */
function plate() {
  return `<svg viewBox="0 0 150 96" class="plate" aria-hidden="true"><rect x="2" y="2" width="146" height="92" rx="5" fill="#1f4fd0"/><rect x="9" y="9" width="132" height="78" rx="2" fill="none" stroke="#fffdf5" stroke-width="2.4"/><circle cx="18" cy="18" r="2.6" fill="#fffdf5"/><circle cx="132" cy="18" r="2.6" fill="#fffdf5"/><circle cx="18" cy="78" r="2.6" fill="#fffdf5"/><circle cx="132" cy="78" r="2.6" fill="#fffdf5"/><text x="75" y="56" text-anchor="middle" font-family="Eczar, serif" font-weight="800" font-size="42" fill="#fffdf5">2/11</text><text x="75" y="77" text-anchor="middle" font-family="Yatra One, sans-serif" font-size="14" fill="#fffdf5">कमला नगर</text></svg>`;
}

window.Scene = { Y, K, near, live, roofLit: () => roof(true), far, sky, fg, canopy, lantern, plate, FG_DEPTH: 1.3, FAR_DEPTH: .35, SKY_DEPTH: .12 };
})();
