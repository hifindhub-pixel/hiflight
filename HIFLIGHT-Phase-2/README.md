# HIFLIGHT — Phase 2

Ce projet transforme `www.hiflight.fr` en site éditorial et SEO contrôlé par HIFLIGHT, tout en conservant le moteur Travelpayouts sur `vols.hiflight.fr`.

## Architecture recommandée

- `www.hiflight.fr` : ce projet Next.js, à déployer sur Vercel.
- `vols.hiflight.fr` : le white-label Travelpayouts actuel.
- Les boutons de recherche redirigent vers Travelpayouts.
- `/hotels` : comparateur d'hôtels avec liste, vendeurs et carte Stay22.
- `/voitures` : comparateur de locations avec liste, loueurs et carte des points de retrait.
- `/trains-bus` : base de la future comparaison Omio / 12Go.

Cette séparation évite de casser le moteur actuel et permet à Google d’indexer les pages HIFLIGHT.

## Mise en ligne pas à pas

1. Créez un nouveau dépôt GitHub nommé `hiflight-site`.
2. Importez tous les fichiers de ce dossier à la racine du dépôt.
3. Importez le dépôt dans Vercel.
4. Dans Vercel > Settings > Environment Variables, ajoutez :
   - `NEXT_PUBLIC_SITE_URL` = `https://www.hiflight.fr`
   - `NEXT_PUBLIC_SEARCH_URL` = `https://vols.hiflight.fr`
   - `NEXT_PUBLIC_GA_ID` = votre identifiant GA4, ou laissez vide au départ.
   - `TP_TOKEN` = votre jeton serveur Travelpayouts Data API pour afficher les tarifs indicatifs du calendrier (`TRAVELPAYOUTS_TOKEN` reste accepté comme alias).
   - `TP_MARKER` = votre identifiant partenaire Travelpayouts, automatiquement rattaché au White Label.
   - `NEXT_PUBLIC_STAY22_AID` = votre identifiant affilié Stay22 pour activer la carte hôtelière réelle.
   - les URL affiliées listées dans `.env.example` = liens profonds provenant de Stay22, Awin, CJ ou Effinity.
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
- Expérience hôtels en liste, liste + carte ou carte seule.
- Comparaison de plusieurs vendeurs par établissement.
- Expérience location de voiture avec plusieurs loueurs et points de retrait.

## Données hôtels et voitures

L'interface de comparaison est indépendante des fournisseurs. Les données de démonstration de `lib/travel-marketplace.ts` servent à valider l'expérience avant le branchement des flux.

- Stay22 fournit la carte hôtelière embarquée quand `NEXT_PUBLIC_STAY22_AID` est renseigné.
- Les liens profonds Booking.com, Expedia, Trip.com, Hotels.com et location de voitures sont configurés par variables d'environnement.
- Pour comparer des prix réellement identiques, les futurs connecteurs devront rapprocher chaque hôtel ou véhicule avec un identifiant interne HIFLIGHT, puis normaliser devise, taxes, dates, annulation et catégorie de chambre ou véhicule.

## Configuration du déploiement

- Renseigner l’identifiant GA4 dans la configuration d’hébergement si la mesure d’audience est utilisée.
- Relier le sous-domaine Travelpayouts au moteur de recherche.
- Maintenir les textes juridiques en cohérence avec les outils réellement activés.

## Limite actuelle

Le clic final vers une compagnie ou une agence se produit dans le white-label Travelpayouts. Il doit être rapproché des événements HIFLIGHT à l’aide des statistiques Travelpayouts et des marqueurs de campagne.
