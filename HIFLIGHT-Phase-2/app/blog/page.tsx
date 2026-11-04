import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { blogPosts } from "@/lib/blog";
import { defaultOgImage, siteUrl } from "@/lib/content";
import BlogIndex from "@/components/BlogIndex";

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
      <header className="idx-head">
        <p className="breadcrumb"><Link href="/">Accueil</Link> / Conseils voyage</p>
        <h1>Conseils voyage</h1>
        <p>Réserver au bon moment, choisir le bon aéroport, éviter les frais imprévus. Des guides écrits à la main, et les bons plans du moment vérifiés avant d’être publiés.</p>
      </header>
      <section className="idx-wrap">
        <BlogIndex posts={posts.map((post) => ({ slug: post.slug, title: post.title, description: post.description, heroImage: post.heroImage, category: post.category ?? "Conseils", date: dateFormat.format(new Date(post.published)), minutes: post.readingMinutes }))} />
        <p className="idx-more"><Link className="text-link" href="/guides/bagage-cabine">Guide : bagage cabine, les vérifications avant le vol →</Link><Link className="text-link" href="/vols">Voir tous les itinéraires →</Link></p>
      </section>
    </main>
  );
}
