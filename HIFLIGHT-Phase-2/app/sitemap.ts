import type { MetadataRoute } from "next";
import { airports, flightRoutes, siteUrl } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/hotels", "/voitures", "/trains-bus", "/esim", "/world-map", "/blog", "/faq", "/conditions-utilisations", "/guides/bagage-cabine", "/mentions-legales", "/politique-de-confidentialite", "/politique-cookies"];
  return [
    ...staticPages.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date(), changeFrequency: path ? "monthly" as const : "weekly" as const, priority: path ? .6 : 1 })),
    ...flightRoutes.map(({ slug }) => ({ url: `${siteUrl}/vols/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .8 })),
    ...airports.map(({ slug }) => ({ url: `${siteUrl}/aeroports/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .7 }))
  ];
}
