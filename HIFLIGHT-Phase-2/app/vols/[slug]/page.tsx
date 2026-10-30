import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import JsonLd from "@/components/JsonLd";
import RoutePrices from "@/components/RoutePrices";
import { airports, flightRoutes, relatedRoutes, routeFaq, siteUrl } from "@/lib/content";
import { blogPosts } from "@/lib/blog";

// Les prix du bloc « mois par mois » sont rafraîchis une fois par jour.
export const revalidate = 86400;

export function generateStaticParams() { return flightRoutes.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = flightRoutes.find((item) => item.slug === slug);
  if (!route) return {};
  return {
    title: route.metaTitle,
    description: route.description,
    alternates: { canonical: `/vols/${slug}` },
    // L’image Open Graph est générée par opengraph-image.tsx dans ce dossier.
    openGraph: { type: "website", url: `${siteUrl}/vols/${slug}/`, title: `${route.metaTitle} | HiFlight`, description: route.description },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = flightRoutes.find((item) => item.slug === slug);
  if (!route) notFound();

  const faq = routeFaq(route);
  const related = relatedRoutes(route);
  const parisDeparture = route.originCode === "PAR";
  const posts = blogPosts.filter((post) => post.relatedRoutes.includes(route.slug));

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
              { "@type": "ListItem", position: 3, name: `${route.origin} – ${route.destination}`, item: `${siteUrl}/vols/${route.slug}/` },
            ],
          },
          {
            "@type": "FAQPage",
            mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
          },
        ],
      }} />
      <section className="page-hero">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/vols">Vols</Link> / {route.origin} – {route.destination}</p>
          <h1>{route.title}</h1>
          <p>{route.intro}</p>
        </div>
      </section>
      <section className="section route-search">
        <SearchForm compact origin={route.origin} destination={route.destination} originCode={route.originCode} destinationCode={route.destinationCode} />
      </section>
      <article className="article">
        <dl className="route-facts">
          <div><dt>Durée du vol direct</dt><dd>{route.duration}</dd></div>
          <div><dt>Arrivée</dt><dd>{route.arrivalAirports}</dd></div>
          {route.carriers.length ? <div><dt>Compagnies fréquentes</dt><dd>{route.carriers.join(", ")}</dd></div> : null}
        </dl>

        <RoutePrices route={route} />

        <h2>Quand réserver {route.origin} – {route.destination}</h2>
        <p>{route.season}</p>

        <h2>Bien comparer ce trajet</h2>
        <p>{route.tip}</p>
        <p>Le tarif affiché au départ n’est qu’un élément de comparaison. Avant de choisir, vérifiez les bagages inclus, les horaires, la durée totale, les escales et l’aéroport exact.</p>

        <h2>Direct ou avec escale ?</h2>
        <p>Une escale peut réduire le prix mais augmenter sensiblement le temps de voyage. Pour un vol direct de {route.duration}, comparez l’écart de prix avec la durée supplémentaire avant de choisir une correspondance.</p>

        <h2>Avant le paiement</h2>
        <p>Contrôlez l’identité du vendeur, les conditions de modification et d’annulation ainsi que le prix final confirmé. La réservation est conclue directement avec le partenaire sélectionné.</p>

        <h2>Questions fréquentes</h2>
        <dl className="faq-inline">
          {faq.map(({ question, answer }) => (
            <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>
          ))}
        </dl>

        {parisDeparture ? (
          <>
            <h2>Choisir son aéroport à Paris</h2>
            <ul className="chips">
              {airports.map((airport) => <li key={airport.slug}><Link href={`/aeroports/${airport.slug}`}>{airport.name} ({airport.code})</Link></li>)}
            </ul>
          </>
        ) : null}

        {posts.length ? (
          <>
            <h2>Nos conseils</h2>
            <ul>{posts.map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>)}</ul>
          </>
        ) : null}

        {related.length ? (
          <>
            <h2>Autres vols à comparer</h2>
            <ul className="chips">
              {related.map((item) => <li key={item.slug}><Link href={`/vols/${item.slug}`}>{item.origin} – {item.destination}</Link></li>)}
              <li><Link href="/vols">Tous les itinéraires</Link></li>
            </ul>
          </>
        ) : null}
      </article>
    </main>
  );
}
