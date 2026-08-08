# HIFLIGHT — Phase 2

Ce projet transforme `www.hiflight.fr` en site éditorial et SEO contrôlé par HIFLIGHT, tout en conservant le moteur Travelpayouts sur `vols.hiflight.fr`.

## Architecture recommandée

- `www.hiflight.fr` : ce projet Next.js, à déployer sur Vercel.
- `vols.hiflight.fr` : le white-label Travelpayouts actuel.
- Les boutons de recherche redirigent vers Travelpayouts.

Cette séparation évite de casser le moteur actuel et permet à Google d’indexer les pages HIFLIGHT.

## Mise en ligne pas à pas

1. Créez un nouveau dépôt GitHub nommé `hiflight-site`.
2. Importez tous les fichiers de ce dossier à la racine du dépôt.
3. Importez le dépôt dans Vercel.
4. Dans Vercel > Settings > Environment Variables, ajoutez :
   - `NEXT_PUBLIC_SITE_URL` = `https://www.hiflight.fr`
   - `NEXT_PUBLIC_SEARCH_URL` = `https://vols.hiflight.fr`
   - `NEXT_PUBLIC_GA_ID` = votre identifiant GA4, ou laissez vide au départ.
5. Dans Travelpayouts, faites fonctionner le white-label sur `vols.hiflight.fr` avant de déplacer le domaine principal.
6. Quand `vols.hiflight.fr` fonctionne, rattachez `www.hiflight.fr` au projet Vercel.

Ne modifiez pas le domaine principal avant que le sous-domaine Travelpayouts soit testé.

## Test local facultatif

```bash
npm install
npm run dev
```

Puis ouvrez `http://localhost:3000`.

## Ce qui est déjà inclus

- Accueil responsive cohérent avec l’identité HIFLIGHT.
- 6 pages de routes dans `/vols/...`.
- 3 pages aéroports dans `/aeroports/...`.
- Guide bagage cabine.
- Sitemap automatique : `/sitemap.xml`.
- Robots.txt automatique : `/robots.txt`.
- Canonical et Open Graph.
- Bannière de consentement et GA4 en mode refusé par défaut.
- Événement GA4 `search_started` avant redirection vers Travelpayouts.
- Préremplissage Travelpayouts via les paramètres officiels `origin_iata`, `destination_iata`, `depart_date`, `return_date` et `adults`.

## Configuration du déploiement

- Renseigner l’identifiant GA4 dans la configuration d’hébergement si la mesure d’audience est utilisée.
- Relier le sous-domaine Travelpayouts au moteur de recherche.
- Maintenir les textes juridiques en cohérence avec les outils réellement activés.

## Limite actuelle

Le clic final vers une compagnie ou une agence se produit dans le white-label Travelpayouts. Il doit être rapproché des événements HIFLIGHT à l’aide des statistiques Travelpayouts et des marqueurs de campagne.
