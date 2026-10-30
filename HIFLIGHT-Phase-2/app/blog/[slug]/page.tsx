import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts, getPost } from "@/lib/blog";
import { defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", url: `${siteUrl}/blog/${slug}/`, images: [defaultOgImage], title: `${post.metaTitle} | HiFlight`, description: post.description, publishedTime: post.published, modifiedTime: post.updated },
  };
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = post.relatedRoutes.map((s) => flightRoutes.find((r) => r.slug === s)).filter((r) => r !== undefined);
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug);

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
            image: `${siteUrl}/hiflight-hero.jpg`,
            author: { "@type": "Organization", name: "HiFlight", url: `${siteUrl}/` },
            publisher: { "@type": "Organization", name: "HiFlight", url: `${siteUrl}/`, logo: { "@type": "ImageObject", url: `${siteUrl}/hiflight-logo.png` } },
          },
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
      <article className="article">
        <p className="price-note">Mis à jour le <time dateTime={post.updated}>{dateFormat.format(new Date(post.updated))}</time> · {post.readingMinutes} min de lecture</p>
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((text) => <p key={text}>{text}</p>)}
            {section.list ? <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </section>
        ))}

        {related.length ? (
          <>
            <h2>Comparer les vols</h2>
            <ul className="chips">
              {related.map((route) => <li key={route.slug}><Link href={`/vols/${route.slug}`}>{route.origin} – {route.destination}</Link></li>)}
            </ul>
          </>
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
