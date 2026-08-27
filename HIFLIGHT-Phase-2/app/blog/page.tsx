import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conseils voyage",
  description: "Guides et conseils HiFlight pour préparer vos vols et vos séjours.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Conseils voyage</h1></div></section>
      <article className="article legal">
        <h2>Bien préparer son prochain départ</h2>
        <p>Retrouvez les conseils HiFlight pour comparer le prix total d’un voyage, choisir le bon aéroport et éviter les frais imprévus.</p>
        <p><Link href="/guides/bagage-cabine"><strong>Guide du bagage cabine</strong></Link><br />Dimensions, poids et points à vérifier avant le départ.</p>
        <h2>Itinéraires populaires</h2>
        <p><Link href="/vols/paris-barcelone">Paris – Barcelone</Link></p>
        <p><Link href="/vols/paris-marrakech">Paris – Marrakech</Link></p>
        <p><Link href="/vols/paris-new-york">Paris – New York</Link></p>
        <p><Link href="/">Lancer une nouvelle recherche</Link></p>
      </article>
    </main>
  );
}
