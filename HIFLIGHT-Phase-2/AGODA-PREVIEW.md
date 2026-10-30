# Prévisualisation Agoda sur Cloudflare

Worker séparé : `hiflight-agoda-preview`. La configuration
`wrangler.agoda-preview.jsonc` ne contient aucun domaine personnalisé.
Ne pas utiliser `deploy:cloudflare` pour cette prévisualisation.

## Préparation (depuis HIFLIGHT-Phase-2)

Node.js 22 ou 24 recommandé. Next.js 16 exige au minimum Node 20.9.

```powershell
npm.cmd ci --legacy-peer-deps
npx.cmd wrangler login
npx.cmd wrangler whoami
```

Vérifier le compte de déploiement HiFlight, puis :

```powershell
npx.cmd wrangler r2 bucket create hiflight-agoda-preview-catalogue
npx.cmd wrangler r2 object put hiflight-agoda-preview-catalogue/destinations-v1.json --file lib/agoda/destinations-full.json --remote
npm.cmd run build:agoda-preview
npm.cmd run deploy:agoda-preview
npx.cmd wrangler secret put AGODA_AUTH --config wrangler.agoda-preview.jsonc
```

La dernière commande demande la valeur secrète (siteId:clé), sans la mettre
sur la ligne de commande ou dans Git. Ne pas utiliser NEXT_PUBLIC_AGODA_AUTH.
Le premier déploiement, avant ajout du secret, refuse les recherches (503).
Si le bucket existe déjà, ne pas le recréer. R2 doit être activé dans le compte.
Les services Cloudflare peuvent être facturés selon le forfait et l'usage.

Ouvrir l'URL workers.dev retournée, chemin `/hotels/`.
La page hôtels porte noindex ; le lien reste public, ce n'est pas une protection
par mot de passe. Activer Cloudflare Access si un accès privé est nécessaire.

## Vérifications avant validation

- Paris et Grenoble, dates futures, 1 et 2 adultes.
- Carte, filtres, photos, lien vers le bon hôtel et dates côté Agoda.
- Écrans mobile et ordinateur.
- Prix explicitement hors taxes/frais (pas de TTC estimé).
- Recherche 429 au-delà de la limite approximative de 10 appels/minute/IP
  par point de présence Cloudflare ; ce n'est pas un quota global strict.
- Booking.com reste disponible en secours.

## Isolation et limites

Sans AGODA_ENABLED=true, le mode production conserve Stay22 et les routes
Agoda répondent 404. Le Worker de test reçoit le flag ; la configuration de
production `wrangler.jsonc` n'est pas modifiée.

Le catalogue privé est chargé depuis R2 à la première recherche, puis conservé
en mémoire par instance. Après remplacement du catalogue, redéployer pour
renouveler les instances. Le coût mémoire et le démarrage à froid doivent être
mesurés sur Cloudflare avec le catalogue complet avant ouverture publique.

L'API Lite renvoie au plus 30 offres ; Booking et Trip.com ne sont pas encore
branchés comme fournisseurs API. L'accès Agoda TTC reste à obtenir.

Aucun domaine, DNS ou fichier de la partie vols n'est modifié. La mise à jour
Next.js concerne toutefois le socle commun : vérifier aussi les routes existantes
sur la prévisualisation avant toute future mise en production.

## Validation effectuée

Compilation complète OpenNext réussie avec Next.js 16.4.1. Tests de la bascule
production/prévisualisation, du refus sans limiteur, et du catalogue R2 simulé
réussis. Le catalogue a également été importé dans R2 local. Le démarrage du
Worker local est bloqué dans cet environnement par uv_interface_addresses ;
la validation sur Cloudflare et le contrôle visuel restent obligatoires.
