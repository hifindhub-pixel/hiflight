import { airports, countryPages, flightRoutes, siteUrl } from "@/lib/content";
import { blogPosts } from "@/lib/blog";
import { departureCities } from "@/lib/cities";

export const dynamic = "force-static";

// Fichier d’orientation pour les assistants IA (format llms.txt) : décrit le site et ses pages clés.
export function GET() {
  const frenchCodes = new Set(["PAR", "LYS", "MRS", "NCE", "TLS", "BOD", "NTE", "LIL", "BSL"]);
  const fromFrance = flightRoutes.filter((route) => frenchCodes.has(route.originCode));
  const origins = new Set(fromFrance.map((route) => route.origin)).size;
  const destinations = new Set(fromFrance.map((route) => route.destination)).size;
  const lines = [
    "# HiFlight",
    "",
    "> HiFlight (hiflight.fr) est un comparateur de vols gratuit en français : prix par mois, jour de départ le moins cher, durée, compagnies et conseils. Le site renvoie vers des partenaires pour réserver ; il ne vend pas de billets. Sans lien avec les compagnies Hi Fly ou Hi-Air.",
    "",
    `Le site couvre ${fromFrance.length} liaisons au départ de ${origins} villes françaises vers ${destinations} destinations, ${countryPages.length} pays et ${airports.length} aéroports. Les prix sont des relevés récents aller-retour, mis à jour chaque jour et indicatifs.`,
    "",
    "## Pages clés",
    `- [À propos de HiFlight](${siteUrl}/a-propos/) : ce que le site est, d’où viennent les prix, financement`,
    `- [Tous les itinéraires](${siteUrl}/vols/) : liste des vols par ville de départ`,
    `- [Questions fréquentes](${siteUrl}/faq/)`,
    `- [Conseils voyage](${siteUrl}/blog/)`,
    "",
    "## Vols par ville de départ",
    ...departureCities.map((city) => `- [Vols ${city.from}](${siteUrl}/vols/depuis/${city.slug}/)`),
    "",
    "## Vols depuis Paris vers chaque destination",
    ...flightRoutes.filter((route) => route.originCode === "PAR" && route.direction !== "retour").map((route) => `- [${route.origin} → ${route.destination}](${siteUrl}/vols/${route.slug}/)`),
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
