/* Shared chrome: header, phone tabs, street-level footer, live status, WhatsApp links. */
(function () {
'use strict';
document.documentElement.classList.add('js');
const PHONE = '919811211595', TEL = '+919811211595', MAPS = 'https://maps.app.goo.gl/bnaf6EXaKUoQ5i5s8';
const page = document.body.dataset.page;
const wa = t => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;
const RESERVE = "Hi! I'd like to reserve a table at The Laalten.";
const NAV = [['index.html', 'home', 'छत', 'Roof'], ['menu.html', 'menu', 'खाना', 'Menu'], ['parties.html', 'parties', 'पार्टी', 'Parties'], ['visit.html', 'visit', 'रास्ता', 'Visit']];
const cur = k => k === page ? ' aria-current="page"' : '';

/* header: [Call] name [Reserve] on phones; [links] name [number, Reserve] on wide screens */
document.body.insertAdjacentHTML('afterbegin', `
<header class="hd${page === 'home' ? ' over' : ''}" id="hd">
  <div class="l">
    <a class="sign sm line call" href="tel:${TEL}">Call</a>
    <nav aria-label="Main">${NAV.slice(1).map(n => `<a href="${n[0]}"${cur(n[1])}>${n[3]}</a>`).join('')}</nav>
  </div>
  <a class="mark" href="index.html" aria-label="The Laalten, home">${Scene.lantern(true)}<span class="nm">The Laalten<small>Sample concept</small></span><i lang="hi">लालटेन</i></a>
  <div class="r">
    <a class="tel" href="tel:${TEL}">98112 11595</a>
    <a class="sign sm" data-wa="${RESERVE}" href="#">Reserve</a>
  </div>
</header>`);
document.body.insertAdjacentHTML('beforeend', `
<footer class="ft">
  <div class="kerb"></div>
  <div class="in">
    <div class="side l"><strong>Open every day</strong><span>1 pm to 1 am</span></div>
    <div class="mid">${Scene.plate()}<address>3rd Floor, 2/11, Block 2,<br>Kamla Nagar, New Delhi 110007</address></div>
    <div class="side r"><a href="tel:${TEL}">98112 11595</a><span><a data-wa="${RESERVE}" href="#">WhatsApp</a> · <a href="${MAPS}" target="_blank" rel="noopener">Directions</a></span></div>
    <p class="sample">Sample concept, not the official website. Photos come from the restaurant's Google listing and are shown for demonstration only.</p>
  </div>
</footer>
<nav class="tabs" aria-label="Pages">${NAV.map(n => `<a href="${n[0]}"${cur(n[1])}><b lang="hi">${n[2]}</b><span>${n[3]}</span></a>`).join('')}</nav>`);

function wire(root = document) {
  root.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
}
wire();

/* open 1 pm to 1 am, every day, Delhi time */
function delhi() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', weekday: 'long', hour12: false }).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  return { h: +g('hour') % 24, m: +g('minute'), day: g('weekday') };
}
function isOpen() { const { h } = delhi(); return h >= 13 || h < 1; }
function status() {
  const open = isOpen();
  document.querySelectorAll('[data-status]').forEach(el => { el.classList.toggle('shut', !open); el.textContent = open ? 'Open now · closes 1 am' : 'Closed now · opens 1 pm'; });
}
status(); setInterval(status, 60000);

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
const reveal = (root = document) => root.querySelectorAll('.rv').forEach(el => io.observe(el));
reveal();

window.Site = { wa, wire, reveal, delhi, isOpen, status, PHONE, TEL, MAPS };
})();
