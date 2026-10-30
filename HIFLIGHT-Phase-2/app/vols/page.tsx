import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { defaultOgImage, flightRoutes, routeRegions, siteUrl } from "@/lib/content";

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
        {routeRegions.map((region) => {
          const routes = flightRoutes.filter((route) => route.region === region);
          if (!routes.length) return null;
          return (
            <div key={region} className="route-group">
              <h2>{region}</h2>
              <div className="route-list">
                {routes.map((route) => (
                  <Link key={route.slug} href={`/vols/${route.slug}`}>
                    <span>{route.originCode}</span><b>→</b><span>{route.destinationCode}</span>
                    <strong>{route.origin} – {route.destination} <small>{route.duration}</small></strong>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
