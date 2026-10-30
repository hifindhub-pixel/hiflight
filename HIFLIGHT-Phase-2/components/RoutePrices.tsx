import type { FlightRoute } from "@/lib/content";

type Offer = { depart_date?: string; value?: number };

const MONTHS_AHEAD = 6;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

async function lowestPrice(token: string, route: FlightRoute, month: string): Promise<number | null> {
  const url = new URL("https://api.travelpayouts.com/v2/prices/month-matrix");
  url.searchParams.set("currency", "eur");
  url.searchParams.set("origin", route.originCode);
  url.searchParams.set("destination", route.destinationCode);
  url.searchParams.set("month", `${month}-01`);
  url.searchParams.set("market", "fr");
  url.searchParams.set("one_way", "false");
  url.searchParams.set("show_to_affiliates", "true");
  url.searchParams.set("limit", "31");
  try {
    const response = await fetch(url, { headers: { "X-Access-Token": token, Accept: "application/json" }, next: { revalidate: 86400 } });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: Offer[] };
    const values = (payload.data || []).map((offer) => offer.value).filter((value): value is number => typeof value === "number" && value > 0);
    return values.length ? Math.min(...values) : null;
  } catch {
    return null;
  }
}

/**
 * Prix indicatifs les plus bas relevés par mois (aller-retour), via la Data API Travelpayouts.
 * Rendu côté serveur, mis en cache 24 h. Sans jeton ou sans données, le bloc n’est pas affiché :
 * la page reste complète grâce au reste du contenu éditorial.
 */
export default async function RoutePrices({ route }: { route: FlightRoute }) {
  const token = (process.env.TP_TOKEN || process.env.TRAVELPAYOUTS_TOKEN || "").trim();
  if (!token) return null;

  const start = new Date();
  start.setDate(1);
  const months = Array.from({ length: MONTHS_AHEAD }, (_, index) => new Date(start.getFullYear(), start.getMonth() + index, 1));
  const prices = await Promise.all(months.map((month) => lowestPrice(token, route, monthKey(month))));
  const label = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
  const rows = months.map((month, index) => ({ label: label.format(month), price: prices[index] })).filter((row): row is { label: string; price: number } => row.price !== null);
  if (rows.length < 2) return null;
  const lowest = Math.min(...rows.map((row) => row.price));

  return (
    <section aria-labelledby="prix-par-mois">
      <h2 id="prix-par-mois">Prix {route.origin} – {route.destination} mois par mois</h2>
      <p>Tarifs aller-retour les plus bas récemment relevés pour les prochains mois. Ils servent de repère pour choisir une période, pas de prix garanti.</p>
      <table className="price-table">
        <thead><tr><th scope="col">Mois de départ</th><th scope="col">À partir de</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className={row.price === lowest ? "is-low" : undefined}>
              <td>{row.label}</td>
              <td>{row.price} €{row.price === lowest ? " · le plus bas" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="price-note">Prix indicatifs, susceptibles de ne plus être disponibles. Le montant définitif est celui affiché par le partenaire avant le paiement.</p>
    </section>
  );
}
