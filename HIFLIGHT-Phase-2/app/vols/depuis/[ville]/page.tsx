import FavoriteButton from "@/components/FavoriteButton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { defaultOgImage, flightRoutes, routeRegions, siteUrl } from "@/lib/content";
import { departureCities, getCity } from "@/lib/cities";
import { getRouteStats } from "@/lib/route-data";

export function generateStaticParams() { return departureCities.map(({ slug }) => ({ ville: slug })); }

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville } = await params;
  const city = getCity(ville);
  if (!city) return {};
  const count = flightRoutes.filter((route) => route.originCode === city.code).length;
  const title = `Vols ${city.from} : destinations et prix`;
  const description = `${count} destinations au départ de ${city.name} : prix mois par mois, durée, compagnies et jour le moins cher. Comparez gratuitement avec HiFlight.`;
  return {
    title,
    description,
    alternates: { canonical: `/vols/depuis/${city.slug}` },
    openGraph: { type: "website", url: `${siteUrl}/vols/depuis/${city.slug}/`, images: [defaultOgImage], title: `${title} | HiFlight`, description },
  };
}

export default async function DepartureCityPage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const city = getCity(ville);
  if (!city) notFound();
  const routes = flightRoutes.filter((route) => route.originCode === city.code);
  const withStats = await Promise.all(routes.map(async (route) => ({ route, stats: await getRouteStats(route) })));
  const cheapest = withStats.filter((item) => item.stats).sort((a, b) => (a.stats!.lowest.price - b.stats!.lowest.price)).slice(0, 3);
  const destinationNames = routes.slice(0, 6).map((route) => route.destination).join(", ");
  const faq = [
    { question: `Quelles sont les destinations au départ de ${city.name} ?`, answer: `HiFlight compare ${routes.length} liaisons ${city.from}, par exemple ${destinationNames}. Chaque page indique la durée du vol, les prix par mois et des conseils pour réserver.` },
    { question: `Quel aéroport utiliser ${city.from} ?`, answer: `${city.airport}. ${city.tip}` },
    ...(cheapest.length ? [{ question: `Quels sont les vols les moins chers ${city.from} ?`, answer: `Sur les derniers relevés, les prix de départ les plus bas sont ${cheapest.map(({ route, stats }) => `${route.destination} dès ${stats!.lowest.price} €`).join(", ")} (aller-retour). Les prix changent chaque jour : confirmez-les avant de réserver.` }] : []),
    { question: "Les prix affichés sont-ils garantis ?", answer: "Non : ce sont des prix indicatifs relevés récemment. Le prix final est confirmé chez le partenaire au moment de la réservation." },
  ];

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Vols", item: `${siteUrl}/vols/` },
            { "@type": "ListItem", position: 3, name: `Vols ${city.from}`, item: `${siteUrl}/vols/depuis/${city.slug}/` },
          ] },
          { "@type": "ItemList", itemListElement: routes.map((route, index) => ({ "@type": "ListItem", position: index + 1, name: `${route.origin} – ${route.destination}`, url: `${siteUrl}/vols/${route.slug}/` })) },
          { "@type": "FAQPage", mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
        ],
      }} />
      <section className="page-hero small">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/vols">Vols</Link> / {city.name}</p>
          <h1>Vols pas chers {city.from}</h1>
          <p>{city.intro}</p>
        </div>
      </section>
      <article className="article city-page">
        <aside className="key-points" aria-label="À retenir">
          <strong>À retenir</strong>
          <ul>
            <li>{routes.length} destinations comparées {city.from}.</li>
            <li>Aéroport : {city.airport}.</li>
            <li>{city.tip}</li>
          </ul>
        </aside>
        {routeRegions.map((region) => {
          const group = withStats.filter(({ route }) => route.region === region);
          if (!group.length) return null;
          return (
            <section key={region}>
              <h2>{region}</h2>
              <div className="deal-cards">
                {group.map(({ route, stats }) => (
                  <div key={route.slug} className="fav-host">
                    <Link className="deal-card" href={`/vols/${route.slug}`}>
                      <span className="deal-route">{route.origin} – {route.destination}</span>
                      <span className="deal-meta">{route.duration}</span>
                      {stats ? <span className="deal-price">dès <strong>{stats.lowest.price} €</strong> A/R</span> : <span className="deal-price">Voir les prix</span>}
                      <span className="deal-cta">Comparer ce vol →</span>
                    </Link>
                    <FavoriteButton slug={route.slug} label={`${route.origin} – ${route.destination}`} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        <p className="price-note">Prix indicatifs aller-retour relevés récemment ; le tarif final est confirmé chez le partenaire.</p>
        <section>
          <h2>Questions fréquentes</h2>
          <dl className="faq-inline">
            {faq.map(({ question, answer }) => <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}
          </dl>
        </section>
        <h2>Autres villes de départ</h2>
        <ul className="chips">
          {departureCities.filter((other) => other.slug !== city.slug).map((other) => <li key={other.slug}><Link href={`/vols/depuis/${other.slug}`}>Vols {other.from}</Link></li>)}
        </ul>
      </article>
    </main>
  );
}
