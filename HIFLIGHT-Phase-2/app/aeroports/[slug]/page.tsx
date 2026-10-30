import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { airports, defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";

export function generateStaticParams() { return airports.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const airport = airports.find((x) => x.slug === slug); return airport ? { title: `Aéroport ${airport.name} (${airport.code})`, description: airport.intro, alternates: { canonical: `/aeroports/${slug}` }, openGraph: { type: "website", url: `${siteUrl}/aeroports/${slug}/`, images: [defaultOgImage], title: `Aéroport ${airport.name} (${airport.code}) | HiFlight`, description: airport.intro } } : {}; }

export default async function AirportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const airport = airports.find((x) => x.slug === slug); if (!airport) notFound();
  const parisRoutes = flightRoutes.filter((route) => route.originCode === "PAR");
  return <main>
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: airport.name, item: `${siteUrl}/aeroports/${airport.slug}/` },
        ] },
        { "@type": "Airport", name: airport.name, iataCode: airport.code, url: `${siteUrl}/aeroports/${airport.slug}/` },
      ],
    }} />
    <section className="page-hero"><div><p className="breadcrumb"><Link href="/">Accueil</Link> / Aéroports / {airport.code}</p><h1>{airport.name} <span>({airport.code})</span></h1><p>{airport.intro}</p></div></section>
    <article className="article"><h2>À vérifier avant de partir</h2><ul><li>Le terminal indiqué par la compagnie ou l’agence.</li><li>Le temps nécessaire pour rejoindre l’aéroport.</li><li>Les règles de bagage appliquées à votre tarif.</li><li>L’heure limite d’enregistrement communiquée par le transporteur.</li></ul><h2>Comparer sans oublier le transfert</h2><p>Lorsque vous comparez deux offres utilisant des aéroports différents, ajoutez mentalement le coût, la durée et la marge de sécurité du transfert. Le billet affiché comme le moins cher n’est pas toujours le voyage le moins coûteux.</p>
      <p>Pour choisir entre les trois aéroports parisiens, lisez notre guide : <Link href="/blog/orly-roissy-beauvais-quel-aeroport">Orly, Roissy-CDG ou Beauvais, lequel choisir ?</Link></p>
      <h2>Vols au départ de Paris</h2>
      <ul className="chips">{parisRoutes.map((route) => <li key={route.slug}><Link href={`/vols/${route.slug}`}>{route.origin} – {route.destination}</Link></li>)}</ul>
      <Link className="text-link" href="/#recherche">Comparer un vol →</Link></article></main>;
}
