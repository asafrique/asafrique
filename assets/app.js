/* ========= helpers ========= */
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }

/* ========= seminars ========= */
function initYearFromURL(){
  const url = new URL(window.location);
  let year = url.searchParams.get('year');
  if(!year && location.hash.startsWith('#y')) year = location.hash.slice(2);
  const allowed = ['2025','2024','2023','2022','2021'];
  if(!allowed.includes(String(year))) year = '2025';
  return year;
}
function updateURL(year){
  const url = new URL(window.location);
  url.searchParams.set('year', year);
  history.replaceState(null, '', url);
  location.hash = `#y${year}`;
}
function seminarCard(s){
  const heading = s.month ? `${s.month} — ${s.title}` : `#${s.n} — ${s.title}`;
  const meta = s.month ? `${s.speaker || ''}` : `${s.date || ''} • ${s.speaker || ''}`;
  const abs = s.abstract || '';
  const bio = s.bio ? `<p class="seminar-abs"><em>${s.bio}</em></p>` : '';
  const links = s.links ? `<p class="seminar-abs">${s.links}</p>` : '';
  const ctas = [
    s.video ? `<a class="btn-link" target="_blank" rel="noopener" href="${s.video}">Regarder</a>` : '',
    s.slides ? `<a class="btn-link" target="_blank" rel="noopener" href="${s.slides}">Slides</a>` : ''
  ].filter(Boolean).join(' ');
  const ctaBlock = ctas ? `<p class="seminar-abs ctas">${ctas}</p>` : '';
  return `
    <div class="seminar-card">
      <h3 class="seminar-title">${heading}</h3>
      <p class="seminar-meta">${meta}</p>
      <p class="seminar-abs">${abs}</p>
      ${bio}
      ${links}
      ${ctaBlock}
    </div>
  `;
}

function setActiveTab(year){
  $all('.year-tab').forEach(btn=>{
    btn?.setAttribute('aria-selected', btn.dataset.year === String(year) ? 'true' : 'false');
  });
  const panel = $('#seminarPanel');
  if(panel) panel.setAttribute('aria-labelledby', `tab-${year}`);
}
async function renderYear(year){
  setActiveTab(year);
  updateURL(year);
  await loadYearData(year);
}
function setupYearTabs(){
  const tabs = $all('.year-tab');
  if(!tabs.length) return;
  tabs.forEach((btn, i)=>{
    btn.addEventListener('click', ()=> renderYear(btn.dataset.year));
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
      }
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault(); renderYear(btn.dataset.year);
      }
    });
  });
}

/* ========= articles ========= */
async function initArticles(){
  const mount = $('#articlesList');
  if(!mount) return;
  mount.textContent = 'Chargement…';
  try{
    const res = await fetch('assets/articles.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status} for assets/articles.json`);
    const items = await res.json();
    mount.innerHTML = items.map(a=>`
      <div class="seminar-card">
        <h3 class="seminar-title">${a.title}</h3>
        <p class="seminar-meta">${a.author || ''}${a.date ? ' • '+a.date : ''}</p>
        <p class="seminar-abs">${a.abstract || ''}</p>
        ${a.link ? `<p class="seminar-abs"><a href="${a.link}">Lire</a></p>` : ''}
      </div>
    `).join('');
  }catch(err){
    console.error('[Articles]', err);
    mount.innerHTML = `<p class="muted">Impossible de charger <code>assets/articles.json</code>.</p>`;
  }
}

/* ========= workshops ========= */
async function initWorkshops(){
  const mount = $('#workshopsList');
  if(!mount) return;
  mount.textContent = 'Chargement…';
  try{
    const res = await fetch('assets/workshops.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status} for assets/workshops.json`);
    const items = await res.json();
    mount.innerHTML = items.map(w=>`
      <div class="seminar-card">
        <h3 class="seminar-title">${w.title}</h3>
        <p class="seminar-meta">${w.date || ''}${w.speaker ? ' • '+w.speaker : ''}</p>
        <p class="seminar-abs">${w.abstract || ''}</p>
        ${w.link ? `<p class="seminar-abs"><a href="${w.link}">Détails</a></p>` : ''}
      </div>
    `).join('');
  }catch(err){
    console.error('[Workshops]', err);
    mount.innerHTML = `<p class="muted">Impossible de charger <code>assets/workshops.json</code>.</p>`;
  }
}

/* ========= init ========= */
document.addEventListener('DOMContentLoaded', async ()=>{
  setupYearTabs();
  if($('#seminarList')){
    const year = initYearFromURL();
    await renderYear(year);
  }
  initArticles();
  initWorkshops();
  const ySpan = $('#year'); if(ySpan) ySpan.textContent = new Date().getFullYear();
});
