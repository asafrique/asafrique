# ASA — Association Sciences pour l’Afrique (Site)

Ce dépôt contient un site statique multi‑pages prêt pour **GitHub Pages**.

## Déployer sur GitHub Pages
1. Créez un dépôt `asafrique.github.io` (ou tout autre repo).
2. Glissez **tout le contenu du dossier** dans la racine du dépôt (pas le dossier parent).
3. Dans *Settings → Pages*, sélectionnez la branche `main` (ou `master`) / `/root`.
4. Ouvrez `https://<votre-utilisateur>.github.io/`.

## Où modifier ?
- Couleurs / thèmes : `assets/style.css` (variables `:root`).
- Menu, langues : `assets/app.js` (dictionnaire `dict` et boutons `.lang-switch`).
- Page d’accueil : `index.html`.
- À propos / Contact : `about.html`, `contact.html`.
- Activités : `activities/…` avec trois sous-sections :
  - Séminaires : `activities/seminars` (index des années + 12 pages par année).
  - Vulgarisation : `activities/popularisation/index.html`.
  - Ateliers : `activities/workshops/index.html`.

## Ajouter un séminaire (ex. Mars 2026)
1. Ouvrir `activities/seminars/2026/index.html` et compléter le bloc `<details>` correspondant au mois.
2. Éditer `activities/seminars/2026/03.html` pour la page détaillée (titre, résumé, bio, PDF, vidéo).

## Bonnes pratiques
- Remplacez `assets/logoasa.jpg` par une version optimisée (~60–150 KB).
- Pour les PDF et vidéos, créez un dossier `assets/papers/` et `assets/videos/` puis liez‑les.
- Utilisez des titres courts pour les `<summary>` afin que l’accordéon reste lisible sur mobile.
