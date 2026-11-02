import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { airports, countryPages, defaultOgImage, flightRoutes, siteUrl } from "@/lib/content";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "À propos de HiFlight : comparateur de vols",
  description: "HiFlight est un comparateur de vols gratuit : d’où viennent les prix, comment le site est financé, ce qu’il compare et ce qu’il ne vend pas.",
  alternates: { canonical: "/a-propos" },
  openGraph: { type: "website", url: `${siteUrl}/a-propos/`, images: [defaultOgImage], title: "À propos de HiFlight | HiFlight", description: "Ce qu’est HiFlight, d’où viennent ses prix et comment le site est financé." },
};

export default function AboutPage() {
  const frenchCodes = new Set(["PAR", "LYS", "MRS", "NCE", "TLS", "BOD", "NTE", "LIL", "BSL"]);
  const fromFrance = flightRoutes.filter((route) => frenchCodes.has(route.originCode));
  const origins = new Set(fromFrance.map((route) => route.origin)).size;
  const destinations = new Set(fromFrance.map((route) => route.destination)).size;
  const facts = [
    "HiFlight est un comparateur de voyages en ligne en français : vols, hôtels, voitures de location, trains et bus, eSIM.",
    "Le site est gratuit et sans inscription pour comparer. HiFlight ne vend pas lui-même de billets : la réservation se fait chez un partenaire.",
    `Le site compte ${fromFrance.length} pages de vols au départ de ${origins} villes françaises vers ${destinations} destinations (et ${flightRoutes.length - fromFrance.length} trajets retour depuis l’étranger), ${countryPages.length} guides par pays, ${airports.length} guides d’aéroports et ${blogPosts.length} articles de conseils.`,
    "Les prix affichés sont des relevés récents de prix aller-retour, mis à jour chaque jour. Ils sont indicatifs : le prix final est confirmé chez le partenaire.",
    "HiFlight peut recevoir une commission d’un partenaire lorsqu’une réservation est faite via un lien du site, sans surcoût pour le voyageur.",
    "Une application HiFlight est disponible sur l’App Store.",
    "HiFlight n’a aucun lien avec les compagnies aériennes Hi Fly ou Hi-Air.",
  ];
  const sections = [
    { title: "Qu’est-ce que HiFlight ?", text: "HiFlight aide à préparer un voyage depuis la France : comparer les prix des vols, repérer le mois et le jour de départ les moins chers, puis être redirigé vers un partenaire pour réserver. Le site propose aussi des guides par destination, par pays et par aéroport, et des conseils pour payer moins cher." },
    { title: "D’où viennent les prix ?", text: "Les prix de départ affichés sur les pages de vols proviennent de relevés récents de prix aller-retour pour les six prochains mois, obtenus auprès d’un réseau d’affiliation de voyage. Ils sont recalculés chaque jour. Quand les données sont insuffisantes, la page n’affiche pas de prix plutôt que d’en inventer un." },
    { title: "Comment HiFlight est-il financé ?", text: "Le service est gratuit pour les voyageurs. Lorsqu’une réservation est faite chez un partenaire à partir d’un lien du site, HiFlight peut percevoir une commission. Elle ne modifie pas le prix que vous payez." },
    { title: "Ce que HiFlight ne fait pas", text: "HiFlight n’émet pas de billets, ne gère pas les réservations et ne peut pas modifier ou annuler un voyage : ces demandes se font auprès du partenaire indiqué dans votre confirmation. HiFlight n’a aucun lien avec les compagnies aériennes Hi Fly ou Hi-Air, dont le nom ressemble au sien." },
  ];

  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "À propos de HiFlight",
        url: `${siteUrl}/a-propos/`,
        inLanguage: "fr-FR",
        about: { "@id": `${siteUrl}/#organization` },
      }} />
      <section className="page-hero small">
        <div>
          <p className="breadcrumb"><Link href="/">Accueil</Link> / À propos</p>
          <h1>À propos de HiFlight</h1>
          <p>Ce qu’est HiFlight, d’où viennent les prix affichés et comment le site est financé.</p>
        </div>
      </section>
      <article className="article">
        <aside className="key-points" aria-label="HiFlight en bref">
          <strong>HiFlight en bref</strong>
          <ul>{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        </aside>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <h2>Aller plus loin</h2>
        <ul>
          <li><Link href="/vols">Tous les itinéraires et leurs prix</Link></li>
          <li><Link href="/blog">Conseils pour payer moins cher</Link></li>
          <li><Link href="/faq">Questions fréquentes</Link></li>
          <li>Contact : <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a></li>
        </ul>
      </article>
    </main>
  );
}
