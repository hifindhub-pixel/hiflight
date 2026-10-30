# Prototype Agoda local

Le prototype est dans `HIFLIGHT-Phase-2`, sur la branche locale `local/agoda-preview`.
Il n'a pas été poussé sur GitHub ni déployé. `/hotels/` est inchangé.

## Lancer sur votre ordinateur

Depuis un clone à jour de `hifindhub-pixel/hiflight`, branche `cloudflare-opennext-migration` :

1. Appliquer le fichier `agoda-local.patch` à la racine du dépôt avec `git apply /chemin/vers/agoda-local.patch`.
2. Entrer dans `HIFLIGHT-Phase-2`.
3. Créer `.env.local` avec `AGODA_AUTH=VOTRE_SITE_ID:VOTRE_CLE_API`. Ne jamais publier ce fichier. Il est ignoré par Git.
4. Exécuter `npm install --legacy-peer-deps`, puis `npm run dev`.
5. Ouvrir http://localhost:3000/hotels/agoda-test/ dans votre navigateur.

L'option legacy-peer-deps est un contournement pour ce test local : le dépôt dépend de Next 15.5.24 et de la dernière version OpenNext, dont les exigences ont changé. Il faudra résoudre et verrouiller ces versions avant un déploiement.

## Vérifications effectuées le 20 octobre 2026

- TypeScript : succès (`npm run check`).
- Page locale : HTTP 200, contenu rendu par Next.js.
- Paris, 13–15 novembre 2026, 2 adultes : 30 hôtels, réponse Agoda en 6,7 s via la route locale.
- Dates inversées : HTTP 400, message explicite sans appel Agoda.
- Les liens sont contrôlés côté serveur : HTTPS Agoda, CID du compte, dates et adultes correspondants.
- Le secret est uniquement dans `.env.local`, jamais dans les sources du navigateur.

## Limites du prototype

Paris et Bangkok seulement, 1 chambre, 1 à 6 adultes, 30 nuits maximum. Les filtres s'appliquent aux 30 hôtels maximum retournés, sans pagination. Carte OpenStreetMap interactive de l'hôtel sélectionné, pas une carte avec tous les prix. Prix journalier, sans affirmation de total taxes incluses. Le rendu visuel mobile et les clics de bout en bout dans le navigateur restent à vérifier : le navigateur distant ne pouvait pas joindre le serveur local de l'environnement. Les commissions effectives ne sont pas prouvées par la présence du CID.

La page et sa route API refusent de fonctionner en mode production. Ce prototype ne doit pas être publié tel quel : prévoir notamment protection contre les abus, quotas, cache autorisé, catalogue de destinations et validation des conditions tarifaires.
