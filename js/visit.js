/* Visit: the street door from the home illustration, the number plate, and a 24-hour dial of when the lantern is lit. */
(function () {
'use strict';
const $ = s => document.querySelector(s), S = window.Scene;

// the same drawing as the home page, held at street level
const street = $('#street');
street.innerHTML = `<svg preserveAspectRatio="xMidYMin slice" aria-hidden="true"><rect x="-200" y="1800" width="2000" height="700" fill="#262b5a"/>${S.near()}</svg>`;
function frame() {            // show as much of the street as the banner's shape allows
  const w = Math.min(1660, Math.max(430, 524 * street.clientWidth / street.clientHeight));
  street.firstChild.setAttribute('viewBox', `${800 - w / 2} 1892 ${w} 524`);
}
frame(); addEventListener('resize', frame);
$('#plate').innerHTML = S.plate();

/* 24-hour dial: noon at the top, midnight at the bottom. Lit from 13:00 to 01:00. */
const R = 96, C = 130;
const pt = (h, r = R) => { const a = (h - 12) / 24 * Math.PI * 2; return [C + Math.sin(a) * r, C - Math.cos(a) * r]; };
const f = n => n.toFixed(1);
const [ax, ay] = pt(13), [bx, by] = pt(25);
let ticks = '';
for (let h = 0; h < 24; h++) { const [x1, y1] = pt(h, R - (h % 6 ? 7 : 12)), [x2, y2] = pt(h, R + (h % 6 ? 7 : 12)); ticks += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="${(h >= 13 || h < 1) ? 'on' : ''}"/>`; }
const labels = [[12, 'NOON', 0, -26], [18, '6 PM', 30, 5], [0, 'MIDNIGHT', 0, 36], [6, '6 AM', -30, 5]].map(([h, t, dx, dy]) => { const [x, y] = pt(h); return `<text x="${f(x + dx)}" y="${f(y + dy)}" text-anchor="middle">${t}</text>`; }).join('');
$('#dial').innerHTML = `<svg viewBox="-20 -14 300 290" role="img" aria-label="Open from 1 pm to 1 am every day">
  <circle cx="${C}" cy="${C}" r="${R}" class="ring"/>
  <path d="M${f(ax)} ${f(ay)}A${R} ${R} 0 0 1 ${f(bx)} ${f(by)}" class="lit"/>
  ${ticks}${labels}
  <g id="now"><circle r="19" class="halo"/><g transform="translate(-13 -19) scale(.22)">${S.lantern(true).replace(/<\/?svg[^>]*>/g, '')}</g></g>
  <text x="${C}" y="${C - 4}" text-anchor="middle" class="big" id="d-big">Open</text>
  <text x="${C}" y="${C + 22}" text-anchor="middle" class="small" id="d-small">till 1 am</text>
</svg>`;
function tick() {
  const { h, m } = Site.delhi(), open = Site.isOpen(), [x, y] = pt(h + m / 60);
  $('#now').setAttribute('transform', `translate(${f(x)} ${f(y)})`);
  $('#dial').classList.toggle('shut', !open);
  $('#d-big').textContent = open ? 'Open' : 'Closed';
  $('#d-small').textContent = open ? 'till 1 am' : 'opens 1 pm';
}
tick(); setInterval(tick, 60000);
})();
