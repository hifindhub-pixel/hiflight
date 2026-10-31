import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Configuration minimale : pages statiques servies depuis les assets Cloudflare.
// Le rafraîchissement automatique (ISR) des prix demanderait un cache R2/KV ;
// sans lui, les prix sont mis à jour à chaque déploiement.
export default defineCloudflareConfig({});
