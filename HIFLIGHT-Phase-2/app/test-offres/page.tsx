import type { Metadata } from "next";
import { flightRoutes, getRoute, searchUrl } from "@/lib/content";
import { getRouteStats } from "@/lib/route-data";
import OffersTest, { type OfferRoute } from "@/components/OffersTest";

/** Page de test (non indexée, hors plan du site) : une carte par offre, avec cœur et renvoi vers la recherche partenaire. */
export const metadata: Metadata = {
  title: "Test offres",
  robots: { index: false, follow: false },
  alternates: { canonical: "/test-offres" },
};

const SLUGS = ["paris-marrakech", "paris-alger", "paris-barcelone", "paris-lisbonne", "paris-rome", "paris-istanbul"];
const pad = (value: number) => String(value).padStart(2, "0");

/** Date de départ au milieu du mois (ou demain si le mois est entamé) et retour 7 jours plus tard, format Travelpayouts JJMM. */
function searchDates(monthKey: string, now: Date) {
  const [year, month] = monthKey.split("-").map(Number);
  let depart = new Date(Date.UTC(year, month - 1, 15));
  const tomorrow = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  if (depart < tomorrow) depart = tomorrow;
  const back = new Date(depart.getTime() + 7 * 86400000);
  const fmt = (date: Date) => `${pad(date.getUTCDate())}${pad(date.getUTCMonth() + 1)}`;
  return { depart: fmt(depart), back: fmt(back) };
}

export default async function TestOffresPage() {
  const now = new Date();
  const routes: OfferRoute[] = [];
  for (const slug of SLUGS) {
    const route = getRoute(slug) ?? flightRoutes.find((item) => item.slug === slug);
    if (!route) continue;
    const stats = await getRouteStats(route);
    if (!stats) continue;
    const offers = stats.months.flatMap((month) => {
      const { depart, back } = searchDates(month.key, now);
      const search = `${route.originCode}${depart}${route.destinationCode}${back}1`;
      const base = { month: month.label, search, slug };
      const list = [{ ...base, price: Math.round(month.min), direct: month.directMin !== null && Math.round(month.directMin) === Math.round(month.min) }];
      if (month.directMin !== null && Math.round(month.directMin) !== Math.round(month.min)) list.push({ ...base, price: Math.round(month.directMin), direct: true });
      return list;
    });
    routes.push({ slug, label: `${route.origin} – ${route.destination}`, offers, updatedAt: stats.updatedAt });
  }
  return <OffersTest routes={routes} searchUrl={searchUrl} />;
}
