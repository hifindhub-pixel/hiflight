import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import { flightRoutes, siteUrl } from "@/lib/content";

export function generateStaticParams() { return flightRoutes.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = flightRoutes.find((item) => item.slug === slug);
  if (!route) return {};
  return { title: route.title, description: route.description, alternates: { canonical: `/vols/${slug}` }, openGraph: { url: `${siteUrl}/vols/${slug}`, title: route.title, description: route.description } };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = flightRoutes.find((item) => item.slug === slug);
  if (!route) notFound();
  return <main><section className="page-hero"><div><p className="breadcrumb"><Link href="/">Accueil</Link> / Vols / {route.origin} – {route.destination}</p><h1>{route.title}</h1><p>{route.description}</p></div></section><section className="section route-search"><SearchForm compact origin={route.origin} destination={route.destination} originCode={route.originCode} destinationCode={route.destinationCode} /></section><article className="article"><h2>Bien comparer ce trajet</h2><p>Le tarif affiché au départ n’est qu’un élément de comparaison. Avant de choisir, vérifiez les bagages inclus, les horaires, la durée totale, les escales et l’aéroport exact.</p><h2>Direct ou avec escale ?</h2><p>Une escale peut réduire le prix mais augmenter sensiblement le temps de voyage. HIFLIGHT vous redirige vers le moteur de comparaison pour consulter les offres disponibles à vos dates.</p><h2>Avant le paiement</h2><p>Contrôlez l’identité du vendeur, les conditions de modification et d’annulation ainsi que le prix final confirmé. La réservation est conclue directement avec le partenaire sélectionné.</p></article></main>;
}
