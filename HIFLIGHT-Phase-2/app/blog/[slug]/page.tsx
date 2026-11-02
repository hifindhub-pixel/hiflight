import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts, getPost } from "@/lib/blog";
import { flightRoutes, siteUrl } from "@/lib/content";
import { getRouteStats } from "@/lib/route-data";

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", url: `${siteUrl}/blog/${slug}/`, images: [post.heroImage ? `${siteUrl}${post.heroImage}` : `${siteUrl}/hiflight-hero.jpg`], title: `${post.metaTitle} | HiFlight`, description: post.description, publishedTime: post.published, modifiedTime: post.updated },
  };
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const anchor = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = post.relatedRoutes.map((s) => flightRoutes.find((r) => r.slug === s)).filter((r) => r !== undefined);
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug);
  const cards = await Promise.all(related.map(async (route) => ({ route, stats: await getRouteStats(route) })));
  const heroUrl = post.heroImage ? `${siteUrl}${post.heroImage}` : `${siteUrl}/hiflight-hero.jpg`;

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
      <section className="page-hero small">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / <Link href="/blog">Conseils voyage</Link></p>
          <h1>{post.title}</h1>
          <p>{post.intro}</p>
        </div>
      </section>
      {post.heroImage ? (
        <figure className="article-hero">
          <img src={post.heroImage} alt={post.title} width={1600} height={840} fetchPriority="high" />
        </figure>
      ) : null}
      <article className="article">
        {post.keyPoints?.length ? (
          <aside className="key-points" aria-label="À retenir">
            <strong>À retenir</strong>
            <ul>{post.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </aside>
        ) : null}
        {post.sections.length >= 3 ? (
          <nav className="toc" aria-label="Sommaire">
            <strong>Sommaire</strong>
            <ol>{post.sections.map((section) => <li key={section.heading}><a href={`#${anchor(section.heading)}`}>{section.heading}</a></li>)}</ol>
          </nav>
        ) : null}
        <p className="price-note">Mis à jour le <time dateTime={post.updated}>{dateFormat.format(new Date(post.updated))}</time> · {post.readingMinutes} min de lecture</p>
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

        {otherPosts.length ? (
          <>
            <h2>À lire aussi</h2>
            <ul>
              {otherPosts.map((other) => <li key={other.slug}><Link href={`/blog/${other.slug}`}>{other.title}</Link></li>)}
              <li><Link href="/guides/bagage-cabine">Bagage cabine : les vérifications avant le vol</Link></li>
            </ul>
          </>
        ) : null}
        <Link className="text-link" href="/#recherche">Lancer une recherche de vol →</Link>
      </article>
    </main>
  );
}
