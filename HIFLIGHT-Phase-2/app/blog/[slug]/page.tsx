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
import ArticleProgress from "@/components/ArticleProgress";
import ArticleToc from "@/components/ArticleToc";
import { fr } from "@/lib/typo";

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
  const candidates = blogPosts.filter((p) => p.slug !== post.slug && p.heroImage);
  const otherPosts = [...candidates.filter((p) => p.category === post.category), ...candidates.filter((p) => p.category !== post.category)]
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category) || b.published.localeCompare(a.published))
    .slice(0, 3);
  const cards = await Promise.all(related.map(async (route) => ({ route, stats: await getRouteStats(route) })));
  const tableSlugs = post.sections.flatMap((section) => section.routeTable ?? []);
  const tableData = new Map(await Promise.all(tableSlugs.map(async (slug) => {
    const route = flightRoutes.find((r) => r.slug === slug);
    return [slug, route ? { route, stats: await getRouteStats(route) } : null] as const;
  })));
  const tocItems = post.sections.map((section) => ({ id: anchor(section.heading), label: section.heading }));
  const heroUrl = post.heroImage ? absUrl(post.heroImage) : `${siteUrl}/hiflight-hero.jpg`;

  const meta = (
    <p className="mag-meta">
      <span>Rédaction HiFlight</span>
      <span>Mis à jour le <time dateTime={post.updated}>{dateFormat.format(new Date(post.updated))}</time></span>
      <span>{post.readingMinutes} min de lecture</span>
    </p>
  );
  const lowest = (rows: ({ route: { slug: string }; stats: { lowest: { price: number } } | null } | null | undefined)[]) =>
    Math.min(...rows.map((row) => row?.stats?.lowest.price ?? Infinity));

  return (
    <main className="mag">
      <ArticleProgress />
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
                <h1>{fr(post.title)}</h1>
              </div>
              <SearchForm />
              <div className="trust-line"><span>Gratuit</span><span>Sans inscription</span></div>
            </div>
          </section>
          <div className="mag-strip">
            <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/blog">Conseils voyage</Link></p>
            {meta}
          </div>
        </>
      ) : (
        <header className="mag-hero">
          {post.heroImage ? <img src={post.heroImage} alt="" width={1600} height={900} fetchPriority="high" /> : null}
          <div className="mag-hero-in">
            <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/blog">Conseils voyage</Link></p>
            <div className="mag-hero-copy">
              <span className="mag-cat">{post.category ?? "Conseils"}</span>
              <h1>{fr(post.title)}</h1>
              {meta}
            </div>
          </div>
        </header>
      )}

      <div className="mag-layout">
        <article className="mag-body" data-article-body>
          <p className="mag-lede">{fr(post.intro)}</p>

          {post.sections.length >= 3 ? (
            <details className="mag-toc-m">
              <summary>Dans cet article <span>{post.sections.length} parties</span></summary>
              <ol>{tocItems.map((item, index) => <li key={item.id}><a href={`#${item.id}`}><i>{String(index + 1).padStart(2, "0")}</i>{item.label}</a></li>)}</ol>
            </details>
          ) : null}

          {post.sections.map((section, index) => (
            <section key={section.heading} id={anchor(section.heading)} className="mag-section">
              <span className="mag-num">{String(index + 1).padStart(2, "0")}</span>
              <h2>{fr(section.heading)}</h2>
              {section.paragraphs.map((text) => <p key={text}>{fr(text)}</p>)}
              {section.list ? <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              {section.table ? (
                <figure className="mag-table">
                  <div className="table-scroll">
                    <table className={`data-table${section.table.headers.length > 3 ? " wide" : ""}`}>
                      <thead><tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                      <tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </figure>
              ) : null}
              {section.routeTable ? (() => {
                const rows = section.routeTable.map((slug) => tableData.get(slug)).filter((row) => row && row.stats);
                if (!rows.length) return null;
                const updated = rows[0]?.stats?.updatedAt;
                const best = lowest(rows);
                return (
                  <figure className="mag-table mag-prices">
                    <figcaption><strong>Prix de référence</strong><span>Aller-retour, relevés par HiFlight{updated ? ` le ${dateFormat.format(new Date(updated))}` : ""}</span></figcaption>
                    <div className="table-scroll">
                      <table className="data-table ref-table wide">
                        <thead><tr><th>Trajet</th><th>Prix le plus bas</th><th>Mois le moins cher</th><th>Jour le moins cher</th><th>Vols directs</th></tr></thead>
                        <tbody>{rows.map((row) => row && row.stats ? (
                          <tr key={row.route.slug}>
                            <td><Link href={`/vols/${row.route.slug}`}>{row.route.origin} – {row.route.destination}</Link></td>
                            <td><strong>{row.stats.lowest.price} €</strong>{rows.length > 1 && row.stats.lowest.price === best && rows.filter((r) => r?.stats?.lowest.price === best).length === 1 ? <em className="mag-best">le plus bas</em> : null}</td>
                            <td>{row.stats.lowest.monthLabel}</td>
                            <td>{row.stats.cheapestWeekday ? row.stats.cheapestWeekday.label : "—"}</td>
                            <td>{row.stats.directShare !== null ? `${row.stats.directShare} %` : "—"}</td>
                          </tr>
                        ) : null)}</tbody>
                      </table>
                    </div>
                    <p className="price-note">Ce sont des planchers relevés pour des départs dans les six prochains mois, pas des prix garantis : le tarif final se confirme chez la compagnie.</p>
                  </figure>
                );
              })() : null}
              {section.callout ? (
                <aside className={`mag-callout mag-${section.callout.kind}`}>
                  <b aria-hidden="true">{section.callout.kind === "piege" ? "!" : section.callout.kind === "astuce" ? "✦" : "i"}</b>
                  <div>
                    <strong>{section.callout.title ?? (section.callout.kind === "piege" ? "Le piège à éviter" : section.callout.kind === "astuce" ? "L’astuce" : "À savoir")}</strong>
                    <p>{fr(section.callout.text)}</p>
                  </div>
                </aside>
              ) : null}
            </section>
          ))}

          {post.faq?.length ? (
            <section id="questions-frequentes" className="mag-section mag-faq">
              <span className="mag-num">FAQ</span>
              <h2>Questions fréquentes</h2>
              <div>
                {post.faq.map(({ question, answer }) => (
                  <details key={question}>
                    <summary><span>{fr(question)}</span><i aria-hidden="true" /></summary>
                    <p>{fr(answer)}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {cards.length ? (
            <section id="comparer-les-vols" className="mag-section">
              <span className="mag-num">Passez à l’action</span>
              <h2>Comparer les vols</h2>
              <div className="mag-routes">
                {cards.map(({ route, stats }) => (
                  <Link key={route.slug} className="mag-route" href={`/vols/${route.slug}`}>
                    <span className="mag-route-codes"><b>{route.originCode}</b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h16m-5-5 5 5-5 5" /></svg><b>{route.destinationCode}</b></span>
                    <strong>{route.origin} – {route.destination}</strong>
                    <small>{route.duration}</small>
                    {stats ? <span className="mag-route-price">dès <b>{stats.lowest.price} €</b> <i>A/R</i></span> : <span className="mag-route-price">Voir les prix</span>}
                    <em>Comparer ce vol →</em>
                  </Link>
                ))}
              </div>
              {cards.some(({ stats }) => stats) ? <p className="price-note">Prix indicatifs relevés récemment, aller-retour. Le tarif final est confirmé chez le partenaire.</p> : null}
            </section>
          ) : null}

          <aside className="mag-endcta">
            <div>
              <strong>Le prix du jour sur votre trajet</strong>
              <p>Prix, horaires et conditions bougent vite : les chiffres de cet article datent de sa mise à jour. Une recherche HiFlight compare en quelques secondes les offres de ses partenaires.</p>
            </div>
            <Link href="/#recherche">Lancer une recherche →</Link>
          </aside>
        </article>

        <aside className="mag-side" aria-label="Informations sur l’article">
          {post.sections.length >= 3 ? <ArticleToc items={tocItems} /> : null}
          <Link className="mag-cta" href="/#recherche" style={post.heroImage ? { backgroundImage: `linear-gradient(180deg,rgba(7,22,47,.55),rgba(7,22,47,.92)),url(${post.heroImage})` } : undefined}>
            <strong>Comparer les vols</strong>
            <span>Des centaines de compagnies, une seule recherche. Gratuit, sans inscription.</span>
            <em>Lancer une recherche →</em>
          </Link>
        </aside>
      </div>

      {otherPosts.length ? (
        <section className="mag-more">
          <div className="home-head"><h2>À lire aussi</h2><Link className="text-link" href="/blog">Tous les guides →</Link></div>
          <div className="mag-more-grid">
            {otherPosts.map((other) => (
              <Link key={other.slug} href={`/blog/${other.slug}`} className="mag-more-card">
                <span className="mag-more-photo"><img src={other.heroImage} alt="" loading="lazy" width="480" height="300" /><em>{other.category ?? "Conseils"}</em></span>
                <strong>{fr(other.title)}</strong>
                <small>{other.readingMinutes} min de lecture</small>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
