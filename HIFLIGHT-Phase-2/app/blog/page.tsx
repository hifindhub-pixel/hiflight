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
      <section className="page-hero small">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / Conseils voyage</p>
          <h1>Conseils voyage</h1>
          <p>Réserver au bon moment, choisir le bon aéroport, éviter les frais imprévus.</p>
        </div>
      </section>
      <section className="article">
        <ul className="post-list">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <time dateTime={post.published}>{dateFormat.format(new Date(post.published))} · {post.readingMinutes} min de lecture</time>
                <strong>{post.title}</strong>
                <span>{post.description}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/guides/bagage-cabine">
              <time>Guide</time>
              <strong>Bagage cabine : les vérifications avant le vol</strong>
              <span>Dimensions, poids et points à vérifier avant le départ.</span>
            </Link>
          </li>
        </ul>
        <Link className="text-link" href="/vols">Voir tous les itinéraires →</Link>
      </section>
    </main>
  );
}
