import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Les pages sont préfabriquées au build et servies telles quelles depuis les assets Cloudflare
// (cache en lecture seule). Sans cette option, l'adaptateur recalcule chaque page à chaque
// visite (300-400 ms mesurés sur les pages de trajets, qui interrogent aussi l'API de prix).
// Conséquence : les prix sont mis à jour à chaque déploiement, pas en continu.
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
