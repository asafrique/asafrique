/* ASA — comportements du site (aucune dépendance externe) */
(function () {
  "use strict";

  /* ---------------------------------------------------------- menu mobile */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu-principal");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var ouvert = menu.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
  }

  /* ---------------------------------------------------------- année pied */
  var an = document.getElementById("annee");
  if (an) an.textContent = new Date().getFullYear();

  var echapper = function (t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };
  var paragraphes = function (t) {
    return echapper(t).split(/\n{2,}/).map(function (b) {
      return "<p>" + b.replace(/\n/g, "<br>") + "</p>";
    }).join("");
  };

  var charger = function (url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  };

  /* ---------------------------------------------------------- séminaires */
  var panneau = document.getElementById("panneau-seances");
  var rail = document.getElementById("rail-annees");

  function carteSeance(s, i) {
    var liens = [];
    if (s.video) liens.push('<a class="puce" href="' + echapper(s.video) + '" target="_blank" rel="noopener">Revoir l\u2019enregistrement</a>');
    if (s.slides) liens.push('<a class="puce" href="' + echapper(s.slides) + '" target="_blank" rel="noopener">Diapositives (PDF)</a>');
    if (s.doc) liens.push('<a class="puce" href="' + echapper(s.doc) + '" target="_blank" rel="noopener">Annonce et r\u00e9sum\u00e9 (PDF)</a>');
    if (s.poster) liens.push('<a class="puce" href="' + echapper(s.poster) + '" target="_blank" rel="noopener">Affiche</a>');
    if (s.website) liens.push('<a class="puce" href="' + echapper(s.website) + '" target="_blank" rel="noopener">Page de l\u2019orateur\u00b7rice</a>');

    var corps = "";
    if (s.poster) corps += '<img class="seance-affiche" src="' + echapper(s.poster) + '" alt="Affiche du s\u00e9minaire de ' + echapper(s.speaker) + '" loading="lazy">';
    if (s.abstract) corps += "<h4>R\u00e9sum\u00e9</h4>" + paragraphes(s.abstract);
    if (s.bio) corps += "<h4>L\u2019orateur\u00b7rice</h4>" + paragraphes(s.bio);
    if (!s.abstract && !s.bio) corps += '<p class="seance-orateur">R\u00e9sum\u00e9 non archiv\u00e9 \u2014 les documents disponibles sont list\u00e9s ci-dessous.</p>';
    if (liens.length) corps += '<div class="liens-seance">' + liens.join("") + "</div>";

    var id = "seance-" + i;
    return (
      '<article class="seance" id="' + id + '">' +
        '<button class="seance-tete" type="button" aria-expanded="false" aria-controls="' + id + '-corps">' +
          '<span class="seance-date">' + echapper(s.dateLabel || "") + "</span>" +
          "<div>" +
            '<span class="seance-titre">' + echapper(s.title) + "</span>" +
            '<p class="seance-orateur">' + echapper(s.speaker) +
              (s.affiliation ? " \u2014 " + echapper(s.affiliation) : "") + "</p>" +
          "</div>" +
          '<span class="chevron" aria-hidden="true">+</span>' +
        "</button>" +
        '<div class="seance-corps" id="' + id + '-corps">' +
          '<div class="vide"></div><div class="seance-detail">' + corps + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function afficherAnnee(annee) {
    if (!panneau) return;
    panneau.setAttribute("aria-busy", "true");
    charger("assets/data/seminars-" + annee + ".json")
      .then(function (liste) {
        if (!liste.length) {
          panneau.innerHTML =
            '<div class="etat-vide"><h3>La programmation ' + annee + " s\u2019\u00e9crit maintenant</h3>" +
            "<p>Aucune s\u00e9ance n\u2019est encore fix\u00e9e pour cette ann\u00e9e. Proposez un expos\u00e9 : " +
            'une s\u00e9ance par mois, en ligne, une heure.</p>' +
            '<a class="btn btn-or" href="https://forms.gle/T9jEudFH7i3tUBnf6" target="_blank" rel="noopener">Proposer un expos\u00e9</a></div>';
        } else {
          panneau.innerHTML = liste.map(carteSeance).join("");
        }
        panneau.removeAttribute("aria-busy");
        brancherAccordeons();
        history.replaceState(null, "", "#y" + annee);
      })
      .catch(function () {
        panneau.innerHTML = '<div class="etat-vide"><h3>Donn\u00e9es indisponibles</h3>' +
          "<p>Le fichier des s\u00e9ances " + annee + " n\u2019a pas pu \u00eatre charg\u00e9. Rechargez la page ou " +
          '<a href="contact.html">signalez-le nous</a>.</p></div>';
        panneau.removeAttribute("aria-busy");
      });
  }

  function brancherAccordeons() {
    panneau.querySelectorAll(".seance-tete").forEach(function (b) {
      b.addEventListener("click", function () {
        var art = b.closest(".seance");
        var ouvert = art.classList.toggle("ouvert");
        b.setAttribute("aria-expanded", ouvert ? "true" : "false");
        b.querySelector(".chevron").textContent = ouvert ? "+" : "+";
      });
    });
  }

  if (rail && panneau) {
    var boutons = rail.querySelectorAll("button");
    boutons.forEach(function (b) {
      b.addEventListener("click", function () {
        boutons.forEach(function (o) { o.setAttribute("aria-selected", "false"); });
        b.setAttribute("aria-selected", "true");
        afficherAnnee(b.dataset.annee);
      });
    });
    var demande = (location.hash.match(/^#y(\d{4})$/) || [])[1];
    var cible = demande && rail.querySelector('[data-annee="' + demande + '"]');
    (cible || rail.querySelector('[data-defaut="1"]') || boutons[0]).click();
  }

  /* ---------------------------------------------------------- journal */
  var catalogue = document.getElementById("catalogue");
  if (catalogue) {
    var tout = [];
    var rendre = function (genre) {
      var vus = genre === "tout" ? tout : tout.filter(function (x) { return x.genre === genre; });
      if (!vus.length) {
        catalogue.innerHTML = '<div class="etat-vide"><h3>Rien dans cette rubrique pour l\u2019instant</h3>' +
          "<p>La biblioth\u00e8que s\u2019enrichit \u00e0 chaque num\u00e9ro. Proposez le v\u00f4tre.</p></div>";
        return;
      }
      catalogue.innerHTML = vus.map(function (a) {
        var liens = (a.liens || []).map(function (l) {
          return '<a class="puce" href="' + echapper(l.url) + '" target="_blank" rel="noopener">' + echapper(l.texte) + "</a>";
        }).join("");
        return '<article class="fiche">' +
          '<span class="genre">' + echapper(a.etiquette) + "</span>" +
          "<h3>" + echapper(a.titre) + "</h3>" +
          '<p class="auteurs">' + echapper(a.auteurs) + (a.date ? " \u00b7 " + echapper(a.date) : "") + "</p>" +
          "<p>" + echapper(a.resume) + "</p>" +
          (liens ? '<div class="liens-seance">' + liens + "</div>" : "") +
          "</article>";
      }).join("");
    };
    charger("assets/data/journal.json").then(function (d) {
      tout = d;
      rendre("tout");
      document.querySelectorAll("#filtres button").forEach(function (b) {
        b.addEventListener("click", function () {
          document.querySelectorAll("#filtres button").forEach(function (o) {
            o.setAttribute("aria-pressed", "false");
          });
          b.setAttribute("aria-pressed", "true");
          rendre(b.dataset.genre);
        });
      });
    }).catch(function () {
      catalogue.innerHTML = '<div class="etat-vide"><h3>Catalogue indisponible</h3><p>Rechargez la page.</p></div>';
    });
  }
})();
