/* Menu: one long printed card, a rail to jump between sections, and a pick-list you can send on WhatsApp. */
(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const rail = $('#rail'), menu = $('#menu'), veg = $('#veg'), picks = $('#picks');
const picked = new Map();     // name -> price (or null)

rail.innerHTML = MENU.map(c => `<a href="#${c.id}" data-id="${c.id}"><b lang="hi">${c.hi}</b><span>${c.en}</span></a>`).join('');
menu.innerHTML = MENU.map((c, ci) => `
  <section class="cat c${ci % 3}" id="${c.id}">
    <header class="sh"><h2 class="d" lang="hi">${c.hi}</h2><p class="lab">${c.en}</p><div class="orn"><i></i></div></header>
    <ul class="dishes">${c.items.map(([n, p, nv, lv, note]) => `
      <li${nv ? ' data-nv' : ''}><button class="dish" aria-pressed="false" data-n="${n}" data-p="${p ?? ''}">
        <span class="dot${nv ? ' nv' : ''}" title="${nv ? 'Non-veg' : 'Veg'}"></span>
        <span class="nm">${lv ? `<mark>${n}</mark>` : n}${note ? `<small>${note}</small>` : ''}</span>
        <span class="lead"></span>
        <span class="pr${p ? '' : ' ask'}">${p ? '₹' + p : 'ask'}</span>
        <span class="add" aria-hidden="true"></span>
      </button></li>`).join('')}
    </ul>
  </section>`).join('');

veg.addEventListener('change', () => {
  document.body.classList.toggle('vegonly', veg.checked);
  $$('.cat').forEach(c => c.classList.toggle('none', veg.checked && !c.querySelector('li:not([data-nv])')));
});

/* pick-list */
function render() {
  const n = picked.size, sum = [...picked.values()].reduce((a, p) => a + (p || 0), 0), unknown = [...picked.values()].filter(p => !p).length;
  picks.classList.toggle('on', n > 0);
  document.body.classList.toggle('picking', n > 0);
  $('#pn').textContent = n; $('#pl').textContent = n === 1 ? 'dish picked' : 'dishes picked';
  $('#pt').textContent = n ? ` about ₹${sum.toLocaleString('en-IN')}${unknown ? ` + ${unknown} to ask` : ''}` : '';
  $('#psend').href = Site.wa(`Hi! We're coming to The Laalten and would like to order:\n${[...picked.keys()].map(k => '• ' + k).join('\n')}`);
}
menu.addEventListener('click', e => {
  const b = e.target.closest('.dish'); if (!b) return;
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', on);
  on ? picked.set(b.dataset.n, +b.dataset.p || null) : picked.delete(b.dataset.n);
  render();
});
$('#pclear').addEventListener('click', () => { picked.clear(); $$('.dish[aria-pressed=true]').forEach(b => b.setAttribute('aria-pressed', false)); render(); });

/* rail follows the section you're reading */
const links = new Map($$('#rail a').map(a => [a.dataset.id, a]));
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.removeAttribute('aria-current'));
  const a = links.get(e.target.id); a.setAttribute('aria-current', 'true');
  rail.scrollTo({ left: a.offsetLeft - rail.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
}), { rootMargin: '-30% 0px -60% 0px' });
$$('.cat').forEach(c => spy.observe(c));
})();
