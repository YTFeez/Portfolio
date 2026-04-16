# Prism — fichiers du site vitrine

Ce dépôt contient le site **tel qu’il est servi aux visiteurs**. La configuration éditoriale (textes, liste des projets affichés, e-mail) se fait dans **`site-config.js`**.

## Publication (rappel technique)

- GitHub Pages : workflow **`.github/workflows/github-pages.yml`**, source Pages = **GitHub Actions**.
- Formulaire : **`contact-form.js`** + compte FormSubmit lié à l’adresse dans `site-config.js`.

Les visiteurs ne voient pas ce fichier : il sert uniquement au déploiement et à la maintenance du propriétaire du site.
