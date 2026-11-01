import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { airportGuides } from "@/lib/airport-guides";
import { airports, defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";

export function generateStaticParams() { return airports.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const airport = airports.find((x) => x.slug === slug);
  const guide = airportGuides[slug];
  if (!airport || !guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: `/aeroports/${slug}` },
    openGraph: { type: "website", url: `${siteUrl}/aeroports/${slug}/`, images: [defaultOgImage], title: `${guide.metaTitle} | HiFlight`, description: guide.description }
  };
}

export default async function AirportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const airport = airports.find((x) => x.slug === slug);
  const guide = airportGuides[slug];
  if (!airport || !guide) notFound();

  const parisRoutes = flightRoutes.filter((route) => route.originCode === "PAR" && route.direction === "aller");
  const others = airports.filter((item) => item.slug !== slug);

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: airport.name, item: `${siteUrl}/aeroports/${airport.slug}/` }
            ]
          },
          {
            "@type": "Airport",
            name: airport.name,
            iataCode: airport.code,
            url: `${siteUrl}/aeroports/${airport.slug}/`,
            geo: { "@type": "GeoCoordinates", latitude: guide.geo.latitude, longitude: guide.geo.longitude },
            address: { "@type": "PostalAddress", addressCountry: "FR" }
          },
          {
            "@type": "FAQPage",
            mainEntity: guide.faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }))
          }
        ]
      }} />
      <section className="page-hero">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / Aéroports / {airport.code}</p>
          <h1>{airport.name} <span>({airport.code})</span></h1>
          <p>{airport.intro}</p>
        </div>
      </section>
      <article className="article">
        <dl className="route-facts">
          {guide.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>

        <h2>Comment aller à l’aéroport {airport.name}</h2>
        <ul>
          {guide.access.map((item) => <li key={item.mode}><strong>{item.mode} :</strong> {item.detail}</li>)}
        </ul>

        <h2>Terminaux et orientation</h2>
        <p>{guide.terminals}</p>

        <h2>Conseils avant de partir</h2>
        <ul>{guide.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>

        <h2>Comparer les trois aéroports de Paris</h2>
        <table className="price-table">
          <thead><tr><th scope="col">Aéroport</th><th scope="col">Distance de Paris</th><th scope="col">Trajet vers le centre</th><th scope="col">Pour qui ?</th></tr></thead>
          <tbody>
            {airports.map((item) => {
              const g = airportGuides[item.slug];
              return (
                <tr key={item.slug} className={item.slug === slug ? "is-low" : undefined}>
                  <td><Link href={`/aeroports/${item.slug}`}>{item.name} ({item.code})</Link></td>
                  <td>{g.distance}</td>
                  <td>{g.toCentre}</td>
                  <td>{g.bestFor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="price-note">Repères arrondis, à vérifier avant le départ : les horaires, tarifs et lignes de transport évoluent.</p>

        <h2>Questions fréquentes</h2>
        <dl className="faq-inline">
          {guide.faq.map(({ question, answer }) => <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}
        </dl>

        <h2>Vols au départ de Paris</h2>
        <ul className="chips">{parisRoutes.map((route) => <li key={route.slug}><Link href={`/vols/${route.slug}`}>{route.origin} – {route.destination}</Link></li>)}</ul>

        <h2>Autres aéroports parisiens</h2>
        <ul className="chips">{others.map((item) => <li key={item.slug}><Link href={`/aeroports/${item.slug}`}>{item.name} ({item.code})</Link></li>)}</ul>
        <p>Pour choisir entre les trois, lisez notre guide : <Link href="/blog/orly-roissy-beauvais-quel-aeroport">Orly, Roissy-CDG ou Beauvais, lequel choisir ?</Link></p>

        <section lang="en" aria-label="Summary in English">
          <h2>{airport.name} Airport at a glance</h2>
          {guide.english.map((text) => <p key={text}>{text}</p>)}
        </section>

        <Link className="text-link" href="/#recherche">Comparer un vol →</Link>
      </article>
    </main>
  );
}
