# Site web — Association Sciences pour l'Afrique (ASA)

Site statique (HTML / CSS / JavaScript, sans dépendance ni build). Il se publie tel quel sur GitHub Pages.

## Structure

```
index.html          Accueil
activites.html      Vue d'ensemble des activités + soutiens
seminaires.html     ASA Séminaire, années 2021 → 2027
journal.html        Journal de vulgarisation des sciences + mini-cours
apropos.html        Objet, valeurs, gouvernance, repères légaux
adhesion.html       Comment adhérer
contact.html        Courriel, formulaires, réseaux sociaux
404.html            Page d'erreur
CNAME               Nom de domaine personnalisé (GitHub Pages)
.nojekyll           Désactive le traitement Jekyll de GitHub Pages
assets/
  css/style.css     Feuille de style unique
  js/app.js         Menu, accordéons des séances, filtres du journal
  data/             Contenu éditable (JSON)
  posters/          Affiches des séances
  slides/           Diapositives PDF
  docs/             Mini-cours, modèle LaTeX du journal
  img/              Logos
```

## Ajouter une séance de séminaire

Tout se passe dans `assets/data/seminars-<année>.json`. Chaque séance est un objet :

```json
{
  "date": "2026-09-13",
  "dateLabel": "13 septembre 2026",
  "title": "Titre de l'exposé",
  "speaker": "Prénom Nom",
  "affiliation": "Laboratoire, ville, pays",
  "abstract": "Résumé. Un saut de ligne double crée un nouveau paragraphe.",
  "bio": "Quelques lignes sur l'orateur ou l'oratrice.",
  "website": "https://…",
  "poster": "assets/posters/2026-09-13-nom.jpg",
  "slides": "assets/slides/2026-09-13-nom-slides.pdf",
  "video": "https://zoom.us/rec/share/…"
}
```

Seuls `dateLabel`, `title` et `speaker` sont obligatoires. Tout champ vide peut être supprimé :
le site n'affiche que ce qui existe. Les séances apparaissent dans l'ordre du fichier.

Convention de nommage des fichiers : `AAAA-MM-JJ-nom.jpg` pour les affiches,
`AAAA-MM-JJ-nom-slides.pdf` pour les diapositives.

## Ajouter une entrée au journal

Dans `assets/data/journal.json`. Le champ `genre` doit valoir `article`, `cours` ou `modele` —
ce sont les valeurs utilisées par les filtres de la page.

## Développer en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Un simple double-clic sur `index.html` ne suffit pas : les fichiers JSON sont chargés en `fetch`,
ce qui exige un serveur HTTP.

## Publication

GitHub Pages, branche `main`, dossier racine. Le fichier `CNAME` fixe le domaine personnalisé.
Toute modification poussée sur `main` est en ligne en une à deux minutes.

## Mise à jour des supports
Modifier les cours uniquement dans assets/data/journal.json (titre, auteurs,
date, resume et liens). Le catalogue, les cartes Mini-cours et l'aperçu Activités
lisent ces données. Déposer le PDF au chemin indiqué par liens[].url.
Pour Cyprien, remplacer assets/slides/2026-03-08-tamekue-slides.pdf :
les pages de séminaires utilisent déjà ce même fichier.
Pour tester les données dynamiques en local : python3 -m http.server 8000,
puis ouvrir http://localhost:8000. Le chargement JSON nécessite HTTP ;
une ouverture directe en file:// peut bloquer les fonctions existantes.
