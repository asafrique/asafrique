
// Mobile nav
const burger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav-links');
if(burger && nav){
  burger.addEventListener('click', ()=> nav.classList.toggle('open'));
}

// Lightweight i18n: swap texts by [data-i18n] keys using dictionaries.
const dict = {
  fr: {
    home_title: "Association Sciences pour l’Afrique",
    home_claim: "Relier, inspirer et former par les sciences.",
    home_lead: "ASA encourage les vocations scientifiques à travers des séminaires, des ateliers et des contenus de vulgarisation.",
    cta_programs: "Découvrir nos activités",
    cta_contact: "Nous contacter",
    nav_home: "Accueil",
    nav_activities: "Nos activités",
    nav_seminars: "ASA Séminaire",
    nav_pop: "Vulgarisation",
    nav_workshops: "Ateliers",
    nav_about: "À propos",
    nav_contact: "Contact",
    section_activities: "Axes d’impact",
    activities_intro: "Des actions concrètes et mesurables, ouvertes à tous.",
    card_seminars: "Séminaires mensuels avec des chercheurs et ingénieurs.",
    card_pop: "Articles et vidéos pour rendre les sciences accessibles.",
    card_workshops: "Ateliers, masterclasses & webinaires hands-on.",
    footer_note: "Tous droits réservés."
  },
  en: {
    home_title: "Association Sciences for Africa",
    home_claim: "Connect, inspire, and train through science.",
    home_lead: "ASA fosters scientific vocations via seminars, workshops, and outreach content.",
    cta_programs: "Explore our activities",
    cta_contact: "Contact us",
    nav_home: "Home",
    nav_activities: "Activities",
    nav_seminars: "ASA Seminar",
    nav_pop: "Outreach",
    nav_workshops: "Workshops",
    nav_about: "About",
    nav_contact: "Contact",
    section_activities: "Impact pillars",
    activities_intro: "Concrete, measurable actions open to everyone.",
    card_seminars: "Monthly seminars with researchers and engineers.",
    card_pop: "Articles and videos to make science accessible.",
    card_workshops: "Hands-on workshops, masterclasses & webinars.",
    footer_note: "All rights reserved."
  }
};

function setLang(lang){
  localStorage.setItem('asa_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[lang] && dict[lang][key]) el.textContent = dict[lang][key];
  });
  document.querySelectorAll('.lang-switch button').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
}

const userLang = localStorage.getItem('asa_lang') || 'fr';
setLang(userLang);
document.querySelectorAll('.lang-switch button').forEach(b=> b.addEventListener('click', ()=> setLang(b.dataset.lang)));

// Year auto
const year = document.getElementById('year');
if(year) year.textContent = new Date().getFullYear();
