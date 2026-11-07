# Déploiement HiFlight

Le site est construit et publié par Cloudflare Workers Builds à chaque fusion
sur la branche `cloudflare-opennext-migration`.

- Build : `npm run build:cloudflare`
- Déploiement : `npm run deploy:cloudflare`
- Dossier racine : `/HIFLIGHT-Phase-2`
- Un déclencheur quotidien (« redeploy-quotidien ») reconstruit aussi la branche chaque nuit.

Note : la liaison GitHub ↔ Cloudflare a été reconnectée le 7 novembre 2026.
