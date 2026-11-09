import type { Metadata } from "next";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import JsonLd from "@/components/JsonLd";
import { countryPages, defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";
import { departureCities } from "@/lib/cities";

const frenchCodes = new Set(departureCities.map((city) => city.code));
const popularSlugs = ["paris-barcelone", "paris-londres", "paris-rome", "paris-madrid", "paris-lisbonne", "paris-marrakech", "paris-alger", "paris-istanbul", "paris-new-york", "paris-dubai", "paris-tokyo", "paris-bangkok", "lyon-barcelone", "lyon-marrakech", "marseille-alger", "marseille-marrakech", "nice-londres", "nice-new-york", "toulouse-marrakech", "bordeaux-alger", "nantes-marrakech", "lille-marrakech", "bale-mulhouse-alger", "paris-montreal"];
const popular = popularSlugs.map((slug) => flightRoutes.find((route) => route.slug === slug)).filter((route) => route !== undefined);
const returns = flightRoutes.filter((route) => !frenchCodes.has(route.originCode));

const description = "Tous les itinéraires comparés par HiFlight : Algérie, Maroc, Tunisie, Europe et long-courrier. Durée, compagnies, prix par mois et conseils pour chaque trajet.";

export const metadata: Metadata = {
  title: "Vols pas chers : tous les itinéraires",
  description,
  alternates: { canonical: "/vols" },
  openGraph: { type: "website", url: `${siteUrl}/vols/`, images: [defaultOgImage], title: "Vols pas chers : tous les itinéraires | HiFlight", description },
};

export default function FlightsHubPage() {
  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Vols", item: `${siteUrl}/vols/` },
            ],
          },
          {
            "@type": "ItemList",
            itemListElement: flightRoutes.map((route, index) => ({ "@type": "ListItem", position: index + 1, name: `${route.origin} – ${route.destination}`, url: `${siteUrl}/vols/${route.slug}/` })),
          },
        ],
      }} />
      <section className="page-hero small">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / Vols</p>
          <h1>Vols pas chers : tous les itinéraires</h1>
          <p>Choisissez votre trajet pour voir la durée du vol, les compagnies, les prix mois par mois et nos conseils avant de réserver.</p>
        </div>
      </section>
      <section className="section">
        <h2>Choisir votre ville de départ</h2>
        <div className="deal-cards">
          {departureCities.map((city) => {
            const count = flightRoutes.filter((route) => route.originCode === city.code).length;
            return (
              <Link key={city.slug} className="deal-card" href={`/vols/depuis/${city.slug}`}>
                <span className="deal-route">Vols {city.from}</span>
                <span className="deal-meta">{count} destinations</span>
                <span className="deal-cta">Voir les vols →</span>
              </Link>
            );
          })}
        </div>
        <h2>Par pays de destination</h2>
        <ul className="chips country-chips">
          {countryPages.map((country) => <li key={country.slug}><Link href={`/destinations/${country.slug}`}>Vols {country.toward}</Link></li>)}
        </ul>
        <div className="route-group">
          <h2>Itinéraires populaires</h2>
          <div className="route-list">
            {popular.map((route) => (
              <div key={route.slug} className="route-row">
                <Link href={`/vols/${route.slug}`}>
                <span>{route.originCode}</span><b>→</b><span>{route.destinationCode}</span>
                <strong>{route.origin} – {route.destination} <small>{route.duration}</small></strong>

                </Link>
                <FavoriteButton slug={route.slug} label={`${route.origin} – ${route.destination}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="route-group">
          <h2>Trajets retour depuis l’étranger</h2>
          <ul className="chips">
            {returns.map((route) => <li key={route.slug}><Link href={`/vols/${route.slug}`}>{route.origin} – {route.destination}</Link></li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
