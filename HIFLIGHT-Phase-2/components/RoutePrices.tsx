import type { FlightRoute } from "@/lib/content";
import type { RouteStats } from "@/lib/route-stats";

const euro = (value: number) => `${value} €`;
const frDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/**
 * Indicateurs de prix d’un trajet, à partir de relevés récents (voir lib/route-data.ts).
 * Rendu serveur, sans JavaScript client : l’histogramme est en CSS et chaque valeur est aussi en texte.
 */
export default function RoutePrices({ route, stats }: { route: FlightRoute; stats: RouteStats }) {
  const maxMonth = Math.max(...stats.months.map((month) => month.min));
  const pair = `${route.origin} – ${route.destination}`;

  return (
    <section aria-labelledby="prix-par-mois">
      <h2 id="prix-par-mois">Prix {pair} : par mois, par jour, en direct</h2>
      <p>Tarifs aller-retour les plus bas récemment relevés pour les prochains mois. Ils servent de repère pour choisir une période, pas de prix garanti.</p>

      <dl className="stat-cards">
        <div><dt>Prix le plus bas relevé</dt><dd>{euro(stats.lowest.price)}<small>en {stats.lowest.monthLabel}</small></dd></div>
        {stats.directLowest !== null ? <div><dt>Vol direct le moins cher</dt><dd>{euro(stats.directLowest)}<small>aller-retour</small></dd></div> : null}
        {stats.cheapestWeekday ? <div><dt>Départ le moins cher</dt><dd>{stats.cheapestWeekday.label}<small>autour de {euro(stats.cheapestWeekday.avg)}</small></dd></div> : null}
        {stats.directShare !== null ? <div><dt>Offres en vol direct</dt><dd>{stats.directShare} %<small>des offres relevées</small></dd></div> : null}
      </dl>

      <h3>Prix par mois de départ</h3>
      <ul className="price-bars">
        {stats.months.map((month) => (
          <li key={month.key} className={month.min === stats.lowest.price ? "is-low" : undefined}>
            <span className="price-bars-label">{month.label}</span>
            <span className="price-bars-track" aria-hidden="true"><span style={{ width: `${Math.max(8, Math.round((month.min / maxMonth) * 100))}%` }} /></span>
            <span className="price-bars-value">dès {euro(Math.round(month.min))}{month.min === stats.lowest.price ? " · le plus bas" : ""}</span>
          </li>
        ))}
      </ul>

      {stats.weekdays.length ? (
        <>
          <h3>Prix moyen selon le jour de départ</h3>
          <table className="price-table">
            <thead><tr><th scope="col">Jour de départ</th><th scope="col">Prix moyen relevé</th></tr></thead>
            <tbody>
              {stats.weekdays.map((day) => (
                <tr key={day.label} className={day.label === stats.cheapestWeekday?.label ? "is-low" : undefined}>
                  <td>{day.label}</td>
                  <td>{euro(day.avg)}{day.label === stats.cheapestWeekday?.label ? " · le moins cher" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      <p className="price-note">
        Méthode : prix aller-retour les plus bas relevés par le réseau de partenaires HiFlight sur {stats.sample} dates de départ, actualisés chaque jour (dernier calcul le {frDate.format(new Date(stats.updatedAt))}).
        Prix indicatifs, susceptibles de ne plus être disponibles ; le montant définitif est celui affiché par le partenaire avant le paiement.
      </p>
    </section>
  );
}
