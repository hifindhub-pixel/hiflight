import { cache } from "react";
import type { FlightRoute } from "./content";
import { buildStats, type Offer, type RouteStats } from "./route-stats";

const MONTHS_AHEAD = 6;
// Surcharge réservée aux tests (serveur factice). En production, l’API officielle est utilisée.
const API_BASE = process.env.TP_API_BASE || "https://api.travelpayouts.com";

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

async function fetchMonth(token: string, route: FlightRoute, key: string): Promise<Offer[]> {
  const url = new URL(`${API_BASE}/v2/prices/month-matrix`);
  url.searchParams.set("currency", "eur");
  url.searchParams.set("origin", route.originCode);
  url.searchParams.set("destination", route.destinationCode);
  url.searchParams.set("month", `${key}-01`);
  url.searchParams.set("market", "fr");
  url.searchParams.set("one_way", "false");
  url.searchParams.set("show_to_affiliates", "true");
  url.searchParams.set("limit", "31");
  try {
    const response = await fetch(url, { headers: { "X-Access-Token": token, Accept: "application/json" }, next: { revalidate: 86400 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Offer[] };
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

/**
 * Relevés de prix récents (Travelpayouts Data API, aller-retour, 6 prochains mois), agrégés en
 * statistiques. Mis en cache 24 h. Sans jeton ou sans données suffisantes : null, et la page
 * reste complète grâce à son contenu éditorial. Aucune valeur n’est jamais inventée.
 */
export const getRouteStats = cache(async (route: FlightRoute): Promise<RouteStats | null> => {
  const token = (process.env.TP_TOKEN || process.env.TRAVELPAYOUTS_TOKEN || "").trim();
  if (!token) return null;
  const start = new Date();
  const keys = Array.from({ length: MONTHS_AHEAD }, (_, index) => monthKey(new Date(start.getFullYear(), start.getMonth() + index, 1)));
  const byMonth = await Promise.all(keys.map(async (key) => ({ key, offers: await fetchMonth(token, route, key) })));
  return buildStats(byMonth, start);
});
