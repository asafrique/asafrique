// ---------- Utils URL / année ----------
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

// ---------- Rendu ----------
function seminarCard(s){
  return `
    <div class="seminar-card">
      <h3 class="seminar-title">#${s.n} — ${s.title}</h3>
      <p class="seminar-meta">${s.date} • ${s.speaker}</p>
      <p class="seminar-abs">${s.abstract}</p>
    </div>
  `;
}

function padToTwelve(data, year){
  const out = [...data];
  for(let i = data.length; i < 12; i++){
    out.push({ n: i+1, date: `${year}-—`, speaker: 'À confirmer', title: 'TBA', abstract: 'À venir.' });
  }
  return out.slice(0, 12);
}

async function loadYearData(year){
  const list = document.getElementById('seminarList');
  list.textContent = 'Chargement…';
  try{
    const res = await fetch(`assets/seminars-${year}.json`, { cache: 'no-store' }); // <— chemin corrigé
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const filled = padToTwelve(Array.isArray(data) ? data : [], year);
    list.innerHTML = `<div class="seminar-grid">${filled.map(seminarCard).join('')}</div>`;
  }catch(err){
    console.error(err);
    list.innerHTML = `
      <div class="seminar-grid">
        ${padToTwelve([], year).map(seminarCard).join('')}
      </div>
      <p class="muted mt-1">Impossible de charger <code>assets/seminars-${year}.json</code>. Vérifie le chemin/fichier.</p>
    `;
  }
}


function setActiveTab(year){
  document.querySelectorAll('.year-tab').forEach(btn=>{
    const selected = btn.dataset.year === String(year);
    btn.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
  const panel = document.getElementById('seminarPanel');
  panel.setAttribute('aria-labelledby', `tab-${year}`);
}

async function renderYear(year){
  setActiveTab(year);
  updateURL(year);
  await loadYearData(year);
}

// ---------- Tabs (clic + clavier) ----------
function setupYearTabs(){
  const tabs = [...document.querySelectorAll('.year-tab')];
  tabs.forEach((btn, i)=>{
    btn.addEventListener('click', ()=> renderYear(btn.dataset.year));
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
      }
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        renderYear(btn.dataset.year);
      }
    });
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  setupYearTabs();
  const year = initYearFromURL();
  await renderYear(year);

  // année dynamique footer (si présent)
  const ySpan = document.getElementById('year');
  if(ySpan) ySpan.textContent = new Date().getFullYear();
});
