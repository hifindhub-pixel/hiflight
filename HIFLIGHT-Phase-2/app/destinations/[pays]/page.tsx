import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/lib/blog";
import { countryPages, defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";

export function generateStaticParams() { return countryPages.map(({ slug }) => ({ pays: slug })); }

export async function generateMetadata({ params }: { params: Promise<{ pays: string }> }): Promise<Metadata> {
  const { pays } = await params;
  const country = countryPages.find((item) => item.slug === pays);
  if (!country) return {};
  return {
    title: country.metaTitle,
    description: country.description,
    alternates: { canonical: `/destinations/${country.slug}` },
    openGraph: { type: "website", url: `${siteUrl}/destinations/${country.slug}/`, images: [defaultOgImage], title: `${country.metaTitle} | HiFlight`, description: country.description },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ pays: string }> }) {
  const { pays } = await params;
  const country = countryPages.find((item) => item.slug === pays);
  if (!country) notFound();

  const routes = flightRoutes.filter((route) => route.country === country.slug);
  const outbound = routes.filter((route) => route.direction === "aller");
  const inbound = routes.filter((route) => route.direction === "retour");
  const posts = blogPosts.filter((post) => post.relatedRoutes.some((slug) => routes.some((route) => route.slug === slug)));

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
              { "@type": "ListItem", position: 3, name: `Vols ${country.toward}`, item: `${siteUrl}/destinations/${country.slug}/` },
            ],
          },
          {
            "@type": "ItemList",
            itemListElement: routes.map((route, index) => ({ "@type": "ListItem", position: index + 1, name: `${route.origin} – ${route.destination}`, url: `${siteUrl}/vols/${route.slug}/` })),
          },
          {
            "@type": "FAQPage",
            mainEntity: country.faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
          },
        ],
      }} />
      <section className="page-hero small">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/vols">Vols</Link> / {country.name}</p>
          <h1>Vol {country.name} pas cher : tous les trajets</h1>
          <p>Comparez les vols {country.toward} et au départ de {country.withArticle}, avec la durée, les compagnies et les prix par mois de chaque liaison.</p>
        </div>
      </section>
      <article className="article">
        {country.intro.map((text) => <p key={text}>{text}</p>)}

        <h2>Vols de France {country.toward}</h2>
        <div className="route-list">
          {outbound.map((route) => (
            <Link key={route.slug} href={`/vols/${route.slug}`}>
              <span>{route.originCode}</span><b>→</b><span>{route.destinationCode}</span>
              <strong>{route.origin} – {route.destination} <small>{route.duration}</small></strong>
            </Link>
          ))}
        </div>

        <h2>Vols depuis {country.withArticle} vers la France</h2>
        <div className="route-list">
          {inbound.map((route) => (
            <Link key={route.slug} href={`/vols/${route.slug}`}>
              <span>{route.originCode}</span><b>→</b><span>{route.destinationCode}</span>
              <strong>{route.origin} – {route.destination} <small>{route.duration}</small></strong>
            </Link>
          ))}
        </div>

        <h2>Aéroports desservis</h2>
        <ul>{country.airports.map((airport) => <li key={airport}>{airport}</li>)}</ul>
        <p>Monnaie locale : {country.currency}.</p>

        <h2>Questions fréquentes</h2>
        <dl className="faq-inline">
          {country.faq.map(({ question, answer }) => <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}
        </dl>

        {posts.length ? (
          <>
            <h2>Nos conseils</h2>
            <ul>{posts.map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>)}</ul>
          </>
        ) : null}
        <Link className="text-link" href="/#recherche">Lancer une recherche de vol →</Link>
      </article>
    </main>
  );
}
