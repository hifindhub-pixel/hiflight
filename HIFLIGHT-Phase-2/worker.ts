// Point d’entrée du Worker : l’application Next.js (OpenNext) + une tâche planifiée.
//
// Les pages sont préfabriquées au build (prix compris) ; cette tâche nocturne demande à Cloudflare
// de reconstruire et redéployer le site pour rafraîchir les prix. Elle appelle un « Deploy Hook »
// Cloudflare dont l’adresse est stockée dans le secret REDEPLOY_HOOK_URL (Settings > Variables and
// secrets du Worker). Sans ce secret, la tâche ne fait rien.

// @ts-ignore : fichier généré par « opennextjs-cloudflare build », absent lors du typage Next.
import openNextWorker from "./.open-next/worker.js";

// @ts-ignore : idem (exports éventuels de l’adaptateur).
export * from "./.open-next/worker.js";

type Env = { REDEPLOY_HOOK_URL?: string };
type Context = { waitUntil(promise: Promise<unknown>): void };

export default {
  fetch: (openNextWorker as { fetch: (...args: unknown[]) => Promise<Response> }).fetch,

  async scheduled(_controller: unknown, env: Env, ctx: Context) {
    const hook = env.REDEPLOY_HOOK_URL?.trim();
    if (!hook) {
      console.log("Redéploiement quotidien ignoré : secret REDEPLOY_HOOK_URL absent.");
      return;
    }
    ctx.waitUntil(
      fetch(hook, { method: "POST" })
        .then((response) => console.log(`Redéploiement demandé : HTTP ${response.status}`))
        .catch((error) => console.log(`Redéploiement impossible : ${String(error)}`))
    );
  }
};
