/* Home: the climb. Scroll position drives a camera that rises from the street to the roof.
   Four layers move at different speeds for depth; nothing else is animated by scroll. */
(function () {
'use strict';
const S = window.Scene, $ = s => document.querySelector(s);
const stage = $('#stage'), climb = $('#climb'), hd = $('#hd');
const ly = { sky: $('#ly-sky'), far: $('#ly-far'), near: $('#ly-near'), fg: $('#ly-fg') };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const still = /[?&]still/.test(location.search);      // for checking: no easing, no fades
if (still) document.documentElement.classList.add('still');

ly.sky.innerHTML = `<svg aria-hidden="true">${S.sky()}</svg>`;
ly.far.innerHTML = `<svg aria-hidden="true">${S.far()}</svg>`;
ly.near.innerHTML = `<svg aria-hidden="true">${S.near()}</svg><svg class="lit" aria-hidden="true">${S.roofLit()}</svg><svg class="lv" aria-hidden="true">${S.live()}</svg>`;
ly.fg.innerHTML = '<svg aria-hidden="true"></svg>';
const canopy = $('#canopy'); canopy.innerHTML = `<svg aria-hidden="true">${S.canopy()}</svg>`;
const sv = { sky: ly.sky.firstChild, far: ly.far.firstChild, near: ly.near.children[0], lit: ly.near.children[1], lv: ly.near.children[2], fg: ly.fg.firstChild };

/* the floor display under the header */
const floors = [...document.querySelectorAll('#floors li')];

let vw, vh, s, x0, wU, hU, camA, camB, total, climbPx, stops = [0, .4, .7, 1];
const probe = document.createElement('div'); probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none'; document.body.append(probe);
const TOP = 110;       // header plus the floor display hanging under it
let cam, target, raf = 0, last = 0;

function box(svg, y0, h) {
  svg.setAttribute('viewBox', `${x0} ${y0} ${wU} ${h}`);
  svg.style.width = vw + 'px'; svg.style.height = h * s + 'px'; svg.style.top = y0 * s + 'px';
}
function layout() {
  vw = stage.clientWidth; vh = stage.clientHeight;
  const tabs = matchMedia('(min-width: 820px)').matches ? 0 : 62, sv_ = probe.offsetHeight || vh;   // the height you can actually see
  s = Math.max(vw / 1700, Math.min(1.2, vw / 400, (sv_ - TOP - tabs) / 800));
  wU = vw / s; hU = vh / s; x0 = 800 - wU / 2;
  camA = 1640 - TOP / s;                      // start: the painted name sits just under the floor display
  const plate = $('#arrive'), room = vh - plate.offsetTop + 16;      // space the arrival sign takes at the bottom
  camB = Math.min(900 + room / s - hU, 400);  // end: the parapet sits just above that sign, sky above
  climbPx = (camA - camB) * s * 1.4;
  climb.style.height = reduce ? vh + 'px' : Math.round(vh + climbPx + vh * .5) + 'px';
  total = climb.offsetHeight - vh;
  sv.fg.innerHTML = S.fg(camA, camB, hU);
  box(sv.sky, -210, 1700); box(sv.far, 0, 2700); box(sv.near, 0, 2800); box(sv.lv, 0, 2800); box(sv.lit, 330, 600); box(sv.fg, 0, 3400);
  canopy.firstChild.setAttribute('viewBox', `${x0} 0 ${wU} 250`); canopy.style.height = 250 * s + 'px';
  // where each floor sits on the climb (0..1)
  const mid = y => Math.min(1, Math.max(0, (camA - (y - hU / 2)) / (camA - camB)));
  stops = [0, mid(1500), mid(1290), 1];
  target = camFor(progress()); if (cam == null) cam = target;
  draw();
}
function progress() { return reduce ? 1 : Math.min(1, Math.max(0, -climb.getBoundingClientRect().top / total)); }
function camFor(p) {
  const t = Math.min(1, p * total / climbPx), e = t * .65 + t * t * (3 - 2 * t) * .35;
  return camA - (camA - camB) * e;
}
const dpr = Math.min(3, window.devicePixelRatio || 1), px = v => Math.round(v * dpr) / dpr;
function draw() {
  // every layer lines up at the roof; below it, far ones lag and near ones run ahead
  const tf = d => `translate3d(0,${px(-(camB + (cam - camB) * d) * s)}px,0)`;
  ly.near.style.transform = tf(1);
  ly.far.style.transform = tf(S.FAR_DEPTH);
  ly.sky.style.transform = tf(S.SKY_DEPTH);
  ly.fg.style.transform = tf(S.FG_DEPTH);
  const t = (camA - cam) / (camA - camB);
  canopy.style.transform = `translate3d(0,${px(-Math.min(1, Math.max(0, (1 - t) / .25)) * 260 * s)}px,0)`;
  ly.near.classList.toggle('on', t > .88);
  $('#arrive').classList.toggle('in', t > .975);
  $('#cue').classList.toggle('gone', t > .03);
  let at = 0; stops.forEach((st, i) => { if (t >= st - .06) at = i; });
  floors.forEach(li => li.classList.toggle('at', +li.dataset.f === at));
}
function tick(now) {
  const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
  cam += (target - cam) * (1 - Math.exp(-dt * 14));
  if (Math.abs(target - cam) < .15) cam = target;
  draw();
  raf = cam === target ? 0 : requestAnimationFrame(tick);
}
function onScroll() {
  target = camFor(progress());
  hd.classList.toggle('over', climb.getBoundingClientRect().bottom > 58);
  if (still) { cam = target; draw(); return; }
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
}
addEventListener('scroll', onScroll, { passive: true });
let rw = 0; addEventListener('resize', () => { if (stage.clientWidth === rw && Math.abs(stage.clientHeight - vh) < 120) return; rw = stage.clientWidth; cam = null; layout(); onScroll(); });
layout(); rw = vw; onScroll();
document.fonts && document.fonts.ready.then(() => { cam = null; layout(); });

floors.forEach(li => li.querySelector('button').addEventListener('click', () => {
  const p = stops[+li.dataset.f] * climbPx / total;
  scrollTo({ top: climb.offsetTop + p * total + (+li.dataset.f === 3 ? 4 : 0), behavior: reduce ? 'auto' : 'smooth' });
}));

/* photos, shown through arched windows */
const G = 'https://lh3.googleusercontent.com/gps-cs-s/';
const PHOTOS = [
  { src: G + 'ANWiy9Sey2EYq_lWLS0F79jNso_-ZRvyfKfEWB9yAU5-b6p0Bt3edIq9oX5GhRSqqQ6UONNjdbbq5M4gsIs99TlIvybSnixh4k_g572yZ8o7KVEbjzE9dN4GYaT3ym9UhLyI0B4JbN7QCg=w800-h1000-k-no', cap: 'From the bar' },
  { mid: 1, src: G + 'ANWiy9RKT9MFlYXaupZ4CFR-OmGhHzIo193hH486bEOHPwn4H5o1VY_l-CPQo7qH7pwxp6JXc--L-VZiBU7IGCsR2gnTh27MkzkZGJTaHA0GTOECLLkFgHua-aa37HL2-iPuVc1A9qom=w1200-h800-k-no', cap: 'The roof, by day' },
  { src: G + 'ANWiy9RH8YC-X_MFftL32ShRHsVHGu_I2kW4Ldq1qvcHVa9E7qxJB3S8e5-TO9vw5FAKFIdJaTod0JrCPGOgbyWzFFxr2XmJXXN0Vl78bNkBnqyNmLZyKtRc_LnGXwR2FKCKg7CZNBt9=w800-h1000-k-no', cap: 'On the sizzler' }
];
const panes = $('#panes'), lb = $('#lb');
panes.innerHTML = PHOTOS.map((p, i) => `<figure class="pane rv${p.mid ? ' mid' : ''}" style="--n:${i}"><button class="glass" data-i="${i}" aria-label="Open photo: ${p.cap}"><img loading="lazy" referrerpolicy="no-referrer" src="${p.src}" alt="${p.cap}"></button><span class="sill"></span><figcaption>${p.cap}</figcaption></figure>`).join('');
panes.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { const g = img.closest('.glass'); g.closest('.pane').classList.add('empty'); g.outerHTML = '<div class="glass">Your photo here</div>'; }));
Site.reveal(panes);
panes.addEventListener('click', e => { const b = e.target.closest('button.glass'); if (!b) return; const p = PHOTOS[+b.dataset.i]; lb.querySelector('img').src = p.src; lb.querySelector('img').alt = p.cap; lb.querySelector('p').textContent = p.cap; lb.classList.add('on'); });
lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('on'); });
addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });
})();
