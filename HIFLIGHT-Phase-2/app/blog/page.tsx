import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/lib/blog";
import { defaultOgImage, siteUrl } from "@/lib/content";

export const metadata: Metadata = {
  title: "Conseils voyage : vols, aéroports, bagages",
  description: "Guides HiFlight pour réserver un vol au meilleur prix : quand réserver, quel aéroport choisir, bagages et pièges à éviter.",
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: `${siteUrl}/blog/`, images: [defaultOgImage], title: "Conseils voyage | HiFlight", description: "Guides HiFlight pour réserver un vol au meilleur prix." },
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  const posts = [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Conseils voyage", item: `${siteUrl}/blog/` },
        ],
      }} />
      <section className="art-head blog-head">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / Conseils voyage</p>
          <h1>Conseils voyage</h1>
          <p className="art-standfirst">Réserver au bon moment, choisir le bon aéroport, éviter les frais imprévus.</p>
        </div>
      </section>
      <section className="blog-wrap">
        <div className="blog-grid">
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={`blog-card${index === 0 ? " blog-card-featured" : ""}`}>
              {post.heroImage ? <img src={post.heroImage} alt="" loading={index < 3 ? "eager" : "lazy"} width="800" height="500" /> : null}
              <div>
                <time dateTime={post.published}>{dateFormat.format(new Date(post.published))} · {post.readingMinutes} min de lecture</time>
                <strong>{post.title}</strong>
                <span>{post.description}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link className="text-link" href="/guides/bagage-cabine">Guide : bagage cabine, les vérifications avant le vol →</Link>
        <br /><Link className="text-link" href="/vols">Voir tous les itinéraires →</Link>
      </section>
    </main>
  );
}
