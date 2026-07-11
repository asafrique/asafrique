// ASA Afrique — script principal du site
// Gère le menu mobile, l'année courante dans le footer, et l'affichage
// des séminaires (onglets par année + accordéon) depuis les fichiers
// assets/seminars-XXXX.json

(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(path);
  return res.json();
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === "class") node.className = val;
    else node.setAttribute(key, val);
  }
  for (const child of children) node.append(child);
  return node;
}

// Construit l'accordéon des séminaires pour une année donnée.
// Champs supportés par entrée (tous optionnels sauf month/title/speaker) :
//   month     - ex: "Février 2024"
//   title     - titre du séminaire
//   speaker   - nom de l'intervenant·e (peut inclure l'affiliation entre parenthèses)
//   abstract  - résumé (texte)
//   bio       - courte bio de l'intervenant·e
//   poster    - chemin vers l'image de l'affiche du séminaire (ex: assets/posters/2024-02-11.jpg)
//   website   - lien vers le site / page perso de l'intervenant·e
//   slides    - lien vers les slides (PDF ou autre)
//   video     - lien vers l'enregistrement vidéo
function renderAccordion(container, items) {
  const wrap = el("div", { class: "accordion" });

  for (const item of items) {
    const headerParts = [item.title, item.speaker, item.month].filter(Boolean);
    const summaryText = headerParts.join(" — ") || "(Sans titre)";

    const acc = el("details", { class: "acc" });
    const summary = el("summary", {}, summaryText);
    const body = el("div", { class: "acc-body" });

    if (item.poster) {
      body.append(
        el("img", {
          class: "acc-poster",
          src: item.poster,
          alt: `Affiche — ${item.title || item.speaker || "séminaire ASA"}`,
          loading: "lazy",
        })
      );
    }

    if (item.month || item.speaker) {
      body.append(
        el(
          "p",
          { class: "meta" },
          `${item.month || ""}${item.speaker ? " · " + item.speaker : ""}`
        )
      );
    }

    if (item.abstract) body.append(el("p", {}, item.abstract));
    if (item.bio) body.append(el("p", {}, el("strong", {}, "Bio : "), item.bio));

    const ctas = el("div", { class: "ctas" });
    if (item.website) {
      ctas.append(
        el(
          "a",
          { href: item.website, class: "btn-link", target: "_blank", rel: "noopener" },
          "Site de l'intervenant·e"
        )
      );
    }
    if (item.slides) {
      ctas.append(
        el(
          "a",
          { href: item.slides, class: "btn-link", target: "_blank", rel: "noopener" },
          "Slides"
        )
      );
    }
    if (item.video) {
      ctas.append(
        el(
          "a",
          { href: item.video, class: "btn-link", target: "_blank", rel: "noopener" },
          "Vidéo"
        )
      );
    }
    if (ctas.childNodes.length) body.append(ctas);

    acc.append(summary, body);
    wrap.append(acc);
  }

  container.innerHTML = "";
  container.append(wrap);
}

async function initSeminarTabs() {
  const tabs = document.getElementById("yearTabs");
  const panel = document.getElementById("seminarPanel");
  if (!tabs || !panel) return;

  tabs.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-year]");
    if (!btn) return;

    for (const t of tabs.querySelectorAll("[data-year]")) {
      t.setAttribute("aria-selected", "false");
    }
    btn.setAttribute("aria-selected", "true");

    const year = btn.getAttribute("data-year");
    const items = await loadJSON(`assets/seminars-${year}.json`);
    renderAccordion(panel, items);
    history.replaceState(null, "", `#y${year}`);
  });

  const hashYear = (location.hash || "").replace("#y", "");
  const initialTab =
    (hashYear && tabs.querySelector(`[data-year="${hashYear}"]`)) ||
    tabs.querySelector("[data-year]");
  if (initialTab) initialTab.click();
}

document.addEventListener("DOMContentLoaded", initSeminarTabs);
