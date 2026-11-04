import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts, getPost } from "@/lib/blog";
import { flightRoutes, siteUrl } from "@/lib/content";
import { getRouteStats } from "@/lib/route-data";
import { Countdown } from "@/components/Countdown";
import SearchForm from "@/components/SearchForm";
import ServiceTabs from "@/components/ServiceTabs";

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", url: `${siteUrl}/blog/${slug}/`, images: [post.heroImage ? absUrl(post.heroImage) : `${siteUrl}/hiflight-hero.jpg`], title: `${post.metaTitle} | HiFlight`, description: post.description, publishedTime: post.published, modifiedTime: post.updated },
  };
}

const absUrl = (u: string) => (u.startsWith("http") ? u : `${siteUrl}${u}`);
const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const anchor = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = post.relatedRoutes.map((s) => flightRoutes.find((r) => r.slug === s)).filter((r) => r !== undefined);
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug && p.heroImage).slice(-3).reverse();
  const cards = await Promise.all(related.map(async (route) => ({ route, stats: await getRouteStats(route) })));
  const tableSlugs = post.sections.flatMap((section) => section.routeTable ?? []);
  const tableData = new Map(await Promise.all(tableSlugs.map(async (slug) => {
    const route = flightRoutes.find((r) => r.slug === slug);
    return [slug, route ? { route, stats: await getRouteStats(route) } : null] as const;
  })));
  const heroUrl = post.heroImage ? absUrl(post.heroImage) : `${siteUrl}/hiflight-hero.jpg`;

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.published,
            dateModified: post.updated,
            inLanguage: "fr-FR",
            mainEntityOfPage: `${siteUrl}/blog/${post.slug}/`,
            image: heroUrl,
            author: { "@type": "Organization", name: "HiFlight", url: `${siteUrl}/` },
            publisher: { "@type": "Organization", name: "HiFlight", url: `${siteUrl}/`, logo: { "@type": "ImageObject", url: `${siteUrl}/hiflight-logo.png` } },
          },
          ...(post.faq ? [{ "@type": "FAQPage", mainEntity: post.faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }] : []),
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Conseils voyage", item: `${siteUrl}/blog/` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}/` },
            ],
          },
        ],
      }} />
      {post.countdown ? (
        <>
          <section className="hero hero-tt" id="recherche" style={{ backgroundImage: `linear-gradient(90deg,rgba(3,12,29,.92),rgba(3,12,29,.6) 50%,rgba(3,12,29,.2) 85%),linear-gradient(0deg,rgba(3,12,29,.72),transparent 50%),url(${post.heroImage})` }}>
            <div className="hero-inner">
              <ServiceTabs active="flights" />
              <div className="hero-copy">
                <span className="tt-badge">Travel Tuesday · mardi 1er décembre</span>
                <Countdown to={post.countdown.to} className="art-count" />
                <h1>{post.title}</h1>
              </div>
              <SearchForm />
              <div className="trust-line"><span>Gratuit</span><span>Sans inscription</span></div>
            </div>
          </section>
          <section className="tt-intro">
            <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/blog">Conseils voyage</Link></p>
            <p className="art-standfirst">{post.intro}</p>
          </section>
        </>
      ) : (
        <>
      <section className="art-head">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/blog">Conseils voyage</Link></p>
          <span className="art-chip">Conseils voyage</span>
          <h1>{post.title}</h1>
          <p className="art-standfirst">{post.intro}</p>
        </div>
      </section>
      {post.heroImage ? (
        <figure className="art-photo">
          <img src={post.heroImage} alt={post.title} width={1600} height={700} fetchPriority="high" />
        </figure>
      ) : null}
        </>
      )}
      <div className="art-layout">
      <article className="art-body">
        {post.keyPoints?.length ? (
          <aside className="key-points" aria-label="À retenir">
            <strong>À retenir</strong>
            <ul>{post.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </aside>
        ) : null}
        {post.sections.map((section) => (
          <section key={section.heading} id={anchor(section.heading)}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((text) => <p key={text}>{text}</p>)}
            {section.list ? <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            {section.table ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead><tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                  <tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            ) : null}
            {section.routeTable ? (() => {
              const rows = section.routeTable.map((slug) => tableData.get(slug)).filter((row) => row && row.stats);
              if (!rows.length) return null;
              const updated = rows[0]?.stats?.updatedAt;
              return (
                <>
                  <div className="table-scroll">
                    <table className="data-table ref-table">
                      <thead><tr><th>Trajet</th><th>Prix le plus bas (A/R)</th><th>Mois le moins cher</th><th>Jour le moins cher</th><th>Vols directs</th></tr></thead>
                      <tbody>{rows.map((row) => row && row.stats ? (
                        <tr key={row.route.slug}>
                          <td><Link href={`/vols/${row.route.slug}`}>{row.route.origin} – {row.route.destination}</Link></td>
                          <td><strong>{row.stats.lowest.price} €</strong></td>
                          <td>{row.stats.lowest.monthLabel}</td>
                          <td>{row.stats.cheapestWeekday ? row.stats.cheapestWeekday.label : "—"}</td>
                          <td>{row.stats.directShare !== null ? `${row.stats.directShare} %` : "—"}</td>
                        </tr>
                      ) : null)}</tbody>
                    </table>
                  </div>
                  <p className="price-note">Prix aller-retour les plus bas relevés par le réseau de partenaires HiFlight (Travelpayouts) pour des départs dans les six prochains mois{updated ? `, calculés le ${dateFormat.format(new Date(updated))}` : ""}. Ce sont des planchers relevés, pas des prix garantis.</p>
                </>
              );
            })() : null}
          </section>
        ))}

        {post.faq?.length ? (
          <section id="questions-frequentes">
            <h2>Questions fréquentes</h2>
            <dl className="faq-inline">
              {post.faq.map(({ question, answer }) => (
                <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>
              ))}
            </dl>
          </section>
        ) : null}

        {cards.length ? (
          <section id="comparer-les-vols">
            <h2>Comparer les vols</h2>
            <div className="deal-cards">
              {cards.map(({ route, stats }) => (
                <Link key={route.slug} className="deal-card" href={`/vols/${route.slug}`}>
                  <span className="deal-route">{route.origin} – {route.destination}</span>
                  <span className="deal-meta">{route.duration}</span>
                  {stats ? <span className="deal-price">dès <strong>{stats.lowest.price} €</strong> A/R</span> : <span className="deal-price">Voir les prix</span>}
                  <span className="deal-cta">Comparer ce vol →</span>
                </Link>
              ))}
            </div>
            {cards.some(({ stats }) => stats) ? <p className="price-note">Prix indicatifs relevés récemment, aller-retour. Le tarif final est confirmé chez le partenaire.</p> : null}
          </section>
        ) : null}

        <Link className="text-link" href="/#recherche">Lancer une recherche de vol →</Link>
      </article>
      <aside className="art-side" aria-label="Informations sur l’article">
        <div className="side-meta">
          <span className="side-avatar">Hi</span>
          <div><strong>HiFlight</strong><span>Mis à jour le <time dateTime={post.updated}>{dateFormat.format(new Date(post.updated))}</time></span><span>{post.readingMinutes} min de lecture</span></div>
        </div>
        {post.sections.length >= 3 ? (
          <nav className="side-toc" aria-label="Sommaire">
            <strong>Dans cet article</strong>
            <ol>{post.sections.map((section) => <li key={section.heading}><a href={`#${anchor(section.heading)}`}>{section.heading}</a></li>)}</ol>
          </nav>
        ) : null}
        <Link className="side-cta" href="/#recherche"><strong>Comparer les vols</strong><span>Des centaines de compagnies, une seule recherche. Gratuit.</span><em>Rechercher →</em></Link>
      </aside>
      </div>
      {otherPosts.length ? (
        <section className="art-more">
          <div className="home-head"><h2>À lire aussi</h2><Link className="text-link" href="/blog">Tous les guides →</Link></div>
          <div className="more-grid">
            {otherPosts.map((other) => (
              <Link key={other.slug} href={`/blog/${other.slug}`} className="more-card">
                <img src={other.heroImage} alt="" loading="lazy" width="480" height="300" />
                <strong>{other.title}</strong>
                <span>{other.readingMinutes} min de lecture</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
