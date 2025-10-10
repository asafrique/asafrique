// Small helpers for all pages
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',()=>nav.classList.toggle('open'));
  }
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();

// Fake form submit (join.html)
function fakeSubmit(){
  alert('Merci ! Votre demande a été enregistrée (démo).');
}

// Load seminars into table (seminars.html) and highlight next seminar (index)
(async function(){
  try{
    const res = await fetch('assets/seminars.json');
    if(!res.ok) return; // page may not need it
    const data = await res.json();

    // Render table if present
    const tbody = document.querySelector('#seminarTable tbody');
    if(tbody){
      tbody.innerHTML = data.map(row => `
        <tr>
          <td>${row.month}</td>
          <td>${row.speaker}</td>
          <td>${row.topic}</td>
        </tr>`).join('');
    }

    // Render next seminar card on home
    const card = document.getElementById('nextSeminarCard');
    if(card){
      // pick first item that has a concrete topic (not "À compléter")
      const next = data.find(x => !/À compléter/i.test(x.topic));
      if(next){
        card.innerHTML = `
          <h3>${next.month} — ${next.speaker}</h3>
          <p>${next.topic}</p>
          <div class="mt-1"><a class="btn btn-outline" href="seminars.html">Détails &raquo;</a></div>`;
      } else {
        card.textContent = 'Les annonces arrivent bientôt.';
      }
    }
  }catch(e){/* silent */}
})();
