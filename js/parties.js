/* Parties: the roof seen from above. The slider seats people table by table and lights each table's lantern. */
(function () {
'use strict';
const $ = s => document.querySelector(s);
/* 4 round tables, 3 long ones, 4 round: 50 seats, the same left to right and top to bottom.
   Listed in the order they fill: the middle first, then outwards. */
const TABLES = [
  ['l', 204, 152], ['l', 84, 152], ['l', 324, 152],
  ['r', 156, 62], ['r', 252, 62], ['r', 156, 242], ['r', 252, 242],
  ['r', 60, 62], ['r', 348, 62], ['r', 60, 242], ['r', 348, 242]
];
/* Seats are listed so that a table on the right or at the bottom is the mirror image of its twin.
   People are then seated one per table across each ring of tables, so the roof fills evenly. */
const seatsOf = ([t, x, y]) => {
  const fx = x > 204 ? -1 : 1, fy = y > 152 ? -1 : 1;
  const off = t === 'r' ? [[0, -27], [27, 0], [0, 27], [-27, 0]] : [[0, -26], [0, 26], [-24, -26], [-24, 26], [24, -26], [24, 26]];
  return off.map(([dx, dy]) => [x + dx * fx, y + dy * fy]);
};
const RINGS = [[0], [1, 2], [3, 4, 5, 6], [7, 8, 9, 10]], rank = {};
let k = 0;
RINGS.forEach(ring => { const n = TABLES[ring[0]][0] === 'r' ? 4 : 6; for (let s = 0; s < n; s++) ring.forEach(ti => { rank[ti + '.' + s] = k++; }); });
const tables = TABLES.map((tb, i) => {
  const [t, x, y] = tb, ss = seatsOf(tb);
  const chairs = ss.map(([cx, cy], si) => `<g class="seat" data-k="${rank[i + '.' + si]}"><rect x="${cx - 8}" y="${cy - 8}" width="16" height="16" rx="4.500"/><circle cx="${cx}" cy="${cy}" r="4.800"/></g>`).join('');
  const top = t === 'r' ? `<circle cx="${x}" cy="${y}" r="18" class="top"/>` : `<rect x="${x - 38}" y="${y - 15}" width="76" height="30" rx="3" class="top"/>`;
  return `<g class="tb" data-t="${i}"><circle cx="${x}" cy="${y}" r="13" class="pool"/>${chairs}${top}<circle cx="${x}" cy="${y}" r="4.500" class="lamp"/></g>`;
}).join('');
const greens = [[14, 14, 12], [394, 14, 12], [14, 290, 12], [394, 290, 12], [14, 152, 8], [394, 152, 8], [204, 11, 8], [204, 293, 8]]
  .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i < 4 ? '#2f8f5b' : '#58b874'}"/>`).join('');

$('#plan').innerHTML = `<svg viewBox="0 0 408 304" role="img" aria-label="Top-down drawing of the rooftop with tables">
  <defs><pattern id="tile" width="34" height="34" patternUnits="userSpaceOnUse">
    <rect width="34" height="34" fill="#f3e8d0"/>
    <circle cx="0" cy="0" r="11" fill="#dbe7dc"/><circle cx="34" cy="0" r="11" fill="#dbe7dc"/><circle cx="0" cy="34" r="11" fill="#dbe7dc"/><circle cx="34" cy="34" r="11" fill="#dbe7dc"/>
    <path d="M17 9L25 17L17 25L9 17Z" fill="#efd3c0"/><circle cx="17" cy="17" r="2.600" fill="#f3e8d0"/>
  </pattern></defs>
  <rect x="6" y="6" width="396" height="292" rx="3" fill="url(#tile)"/>
  <rect x="6" y="6" width="396" height="292" rx="3" fill="none" stroke="#fffaf0" stroke-width="9"/>
  <rect x="12.500" y="12.500" width="383" height="279" fill="none" stroke="#151a3c" stroke-width="1.500"/>
  ${greens}${tables}
</svg>`;

const size = $('#size'), seats = [...document.querySelectorAll('.seat')], tbs = [...document.querySelectorAll('.tb')];
const HINTS = [[14, 'a long table or two'], [24, 'the middle of the roof'], [34, 'half the roof'], [44, 'most of the roof'], [50, 'the whole roof']];
function paint() {
  const n = +size.value;
  $('#n').textContent = n; $('#s-n').textContent = n;
  seats.forEach(s => s.classList.toggle('on', +s.dataset.k < n));
  tbs.forEach(t => t.classList.toggle('lit', !!t.querySelector('.seat.on')));
  $('#hint').textContent = HINTS.find(h => n <= h[0])[1];
  size.style.setProperty('--f', (n - 10) / 40);
}
size.addEventListener('input', paint); paint();

$('#slip').addEventListener('submit', e => {
  e.preventDefault();
  const d = $('#date').value;
  const when = d ? new Date(d + 'T12:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'a date we still need to fix';
  window.open(Site.wa(`Hi! We're ${size.value} people, coming on ${when} for a ${$('#occ').value}. Could we book the rooftop at The Laalten?`), '_blank', 'noopener');
});
})();
