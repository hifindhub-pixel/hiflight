import { airports, countryPages, flightRoutes, siteUrl } from "@/lib/content";
import { blogPosts } from "@/lib/blog";

export const dynamic = "force-static";

// Fichier d’orientation pour les assistants IA (format llms.txt) : décrit le site et ses pages clés.
export function GET() {
  const origins = new Set(flightRoutes.map((route) => route.origin)).size;
  const lines = [
    "# HiFlight",
    "",
    "> HiFlight (hiflight.fr) est un comparateur de vols gratuit en français : prix par mois, jour de départ le moins cher, durée, compagnies et conseils. Le site renvoie vers des partenaires pour réserver ; il ne vend pas de billets. Sans lien avec les compagnies Hi Fly ou Hi-Air.",
    "",
    `Le site couvre ${flightRoutes.length} liaisons au départ de ${origins} villes, ${countryPages.length} pays et ${airports.length} aéroports. Les prix sont des relevés récents aller-retour, mis à jour chaque jour et indicatifs.`,
    "",
    "## Pages clés",
    `- [À propos de HiFlight](${siteUrl}/a-propos/) : ce que le site est, d’où viennent les prix, financement`,
    `- [Tous les itinéraires](${siteUrl}/vols/) : liste des vols par ville de départ`,
    `- [Questions fréquentes](${siteUrl}/faq/)`,
    `- [Conseils voyage](${siteUrl}/blog/)`,
    "",
    "## Guides par pays",
    ...countryPages.map((country) => `- [Vols ${country.toward}](${siteUrl}/destinations/${country.slug}/)`),
    "",
    "## Articles",
    ...blogPosts.map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug}/)`),
    "",
    "## Guides d’aéroports",
    ...airports.map((airport) => `- [${airport.name}](${siteUrl}/aeroports/${airport.slug}/)`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
