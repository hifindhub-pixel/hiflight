import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import JsonLd from "@/components/JsonLd";
import RoutePrices from "@/components/RoutePrices";
import StickyCta from "@/components/StickyCta";
import { airports, bookingAdvice, buildRouteDescription, countryPages, flightRoutes, getRoute, relatedRoutes, routeComparison, routeFaq, siteUrl } from "@/lib/content";
import { getRouteStats } from "@/lib/route-data";
import { blogPosts } from "@/lib/blog";

// Page entièrement préfabriquée au build : les relevés de prix sont figés jusqu’au prochain déploiement.

const FORMALITIES_URL = "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/";
const frDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export function generateStaticParams() { return flightRoutes.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = getRoute(slug);
  if (!route) return {};
  const stats = await getRouteStats(route);
  const title = stats ? `Vol ${route.origin} ${route.destination} dès ${stats.lowest.price} € : comparateur` : route.metaTitle;
  const description = stats ? buildRouteDescription(`${route.origin} – ${route.destination}`, route.duration, stats.lowest.price) : route.description;
  return {
    title,
    description,
    alternates: { canonical: `/vols/${slug}` },
    // L’image Open Graph est générée par opengraph-image.tsx dans ce dossier.
    openGraph: { type: "website", url: `${siteUrl}/vols/${slug}/`, title: `${title} | HiFlight`, description },
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = getRoute(slug);
  if (!route) notFound();

  const stats = await getRouteStats(route);
  const faq = routeFaq(route, stats);
  const comparison = routeComparison(route);
  const related = relatedRoutes(route);
  const reverse = route.reverseSlug ? getRoute(route.reverseSlug) : undefined;
  const country = countryPages.find((item) => item.slug === route.country);
  const fromParis = route.originCode === "PAR";
  const toParis = route.destinationCode === "PAR";
  const posts = blogPosts.filter((post) => post.relatedRoutes.includes(route.slug) || (reverse && post.relatedRoutes.includes(reverse.slug)));
  const pair = `${route.origin} – ${route.destination}`;
  const practical = [
    { label: "Aéroport d’arrivée", value: `${route.arrivalAirports}${route.arrivalCenter ? ` (${route.arrivalCenter})` : ""}.` },
    ...(route.currency ? [{ label: "Monnaie locale", value: `${route.currency.charAt(0).toUpperCase()}${route.currency.slice(1)}.` }] : []),
  ];

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${siteUrl}/vols/${route.slug}/#webpage`,
            url: `${siteUrl}/vols/${route.slug}/`,
            name: `${route.title} | HiFlight`,
            description: route.description,
            inLanguage: "fr-FR",
            dateModified: stats?.updatedAt ?? route.updated,
            isPartOf: { "@type": "WebSite", url: `${siteUrl}/`, name: "HiFlight" },
            breadcrumb: { "@id": `${siteUrl}/vols/${route.slug}/#breadcrumb` },
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${siteUrl}/vols/${route.slug}/#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Vols", item: `${siteUrl}/vols/` },
              { "@type": "ListItem", position: 3, name: pair, item: `${siteUrl}/vols/${route.slug}/` },
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
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/vols">Vols</Link> / {pair}</p>
          <h1>{route.title}</h1>
          <p>{route.intro}</p>
          {stats ? <p className="hero-price">À partir de <strong>{stats.lowest.price} €</strong> aller-retour · relevé récent en {stats.lowest.monthLabel}</p> : null}
        </div>
      </section>
      <section className="section route-search" id="comparer">
        <SearchForm compact origin={route.origin} destination={route.destination} originCode={route.originCode} destinationCode={route.destinationCode} />
      </section>
      <article className="article">
        <dl className="route-facts">
          <div><dt>{route.direct ? "Durée du vol direct" : "Durée du trajet"}</dt><dd>{route.duration}</dd></div>
          <div><dt>Arrivée</dt><dd>{route.arrivalAirports}</dd></div>
          {route.carriers.length ? <div><dt>Compagnies fréquentes</dt><dd>{route.carriers.join(", ")}</dd></div> : null}
        </dl>

        {stats ? <RoutePrices route={route} stats={stats} /> : null}

        <h2>Quand réserver {pair}</h2>
        <p>{route.season}</p>
        {stats ? <p>Sur les dates relevées, le départ le moins cher tombe en {stats.lowest.monthLabel}{stats.cheapestWeekday ? `, et le ${stats.cheapestWeekday.label} est en moyenne le jour de départ le moins cher` : ""}.</p> : null}
        <p>{bookingAdvice(route)}</p>

        <h2>Bien comparer ce trajet</h2>
        <p>{route.tip}</p>
        {comparison ? <p>{comparison}</p> : null}

        <h2>Direct ou avec escale ?</h2>
        {route.direct ? (
          <p>Le vol direct dure {route.duration} ; une escale ajoute en général plusieurs heures, à justifier par un prix nettement plus bas.</p>
        ) : (
          <p>Il n’existe en général pas de vol direct {pair} : toutes les offres comportent une escale. Comparez la durée totale ({route.duration}), la ville de correspondance et la durée d’attente avant de choisir.</p>
        )}
        {stats?.directLowest ? <p>Un vol direct a été relevé à partir de {stats.directLowest} € aller-retour, contre {stats.lowest.price} € pour l’offre la moins chère toutes options confondues.</p> : null}

        <h2>Informations pratiques</h2>
        <ul>
          {practical.map((item) => <li key={item.label}><strong>{item.label} :</strong> {item.value}</li>)}
          {route.formalities ? <li><strong>Formalités d’entrée :</strong> elles dépendent de votre nationalité et de la durée du séjour. Consultez les <a href={FORMALITIES_URL} target="_blank" rel="noopener noreferrer">conseils aux voyageurs du ministère français de l’Europe et des Affaires étrangères</a> avant de réserver.</li> : null}
          {toParis ? <li><strong>À l’arrivée en France :</strong> vérifiez l’aéroport et le terminal indiqués sur votre billet avant d’organiser votre transfert.</li> : null}
        </ul>

        <h2>Questions fréquentes</h2>
        <dl className="faq-inline">
          {faq.map(({ question, answer }) => (
            <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>
          ))}
        </dl>

        {reverse ? (
          <p className="reverse-link">
            <Link href={`/vols/${reverse.slug}`}>Vous voyagez dans l’autre sens ? Comparer {reverse.origin} – {reverse.destination} →</Link>
          </p>
        ) : null}
        {country ? (
          <p className="reverse-link">
            <Link href={`/destinations/${country.slug}`}>Tous les vols {country.toward} : villes, compagnies et conseils →</Link>
          </p>
        ) : null}

        {fromParis || toParis ? (
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

        <p className="price-note method-note">Avant de payer, vérifiez les bagages inclus, l’aéroport exact et les conditions de modification : la réservation est conclue avec le partenaire. Page révisée le {frDate.format(new Date(route.updated))} ; durées et compagnies sont des repères variables selon la saison.</p>
        <Link className="text-link" href="#comparer">Lancer la comparaison {pair} ↑</Link>
      </article>
      <StickyCta label={pair} price={stats?.lowest.price} route={route.slug} />
    </main>
  );
}
