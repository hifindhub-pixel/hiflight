import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { airports } from "@/lib/content";

export function generateStaticParams() { return airports.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const airport = airports.find((x) => x.slug === slug); return airport ? { title: `Aéroport ${airport.name} (${airport.code})`, description: airport.intro, alternates: { canonical: `/aeroports/${slug}` } } : {}; }

export default async function AirportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const airport = airports.find((x) => x.slug === slug); if (!airport) notFound();
  return <main><section className="page-hero"><div><p className="breadcrumb"><Link href="/">Accueil</Link> / Aéroports / {airport.code}</p><h1>{airport.name} <span>({airport.code})</span></h1><p>{airport.intro}</p></div></section><article className="article"><h2>À vérifier avant de partir</h2><ul><li>Le terminal indiqué par la compagnie ou l’agence.</li><li>Le temps nécessaire pour rejoindre l’aéroport.</li><li>Les règles de bagage appliquées à votre tarif.</li><li>L’heure limite d’enregistrement communiquée par le transporteur.</li></ul><h2>Comparer sans oublier le transfert</h2><p>Lorsque vous comparez deux offres utilisant des aéroports différents, ajoutez mentalement le coût, la durée et la marge de sécurité du transfert. Le billet affiché comme le moins cher n’est pas toujours le voyage le moins coûteux.</p><Link className="text-link" href="/#recherche">Comparer un vol →</Link></article></main>;
}
