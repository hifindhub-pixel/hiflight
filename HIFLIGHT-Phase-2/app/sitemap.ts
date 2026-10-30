import type { MetadataRoute } from "next";
import { airports, flightRoutes, siteUrl } from "@/lib/content";
import { blogPosts } from "@/lib/blog";

export const dynamic = "force-static";

// Les URLs doivent correspondre exactement aux canonicals (trailingSlash: true).
// lastModified n’est renseigné que lorsque la date de révision est connue :
// une date « maintenant » à chaque build n’apporte aucune information à Google.
// Les pages légales sont volontairement absentes du sitemap.
const url = (path: string) => `${siteUrl}${path}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/vols", "/hotels", "/voitures", "/trains-bus", "/esim", "/world-map", "/faq", "/guides/bagage-cabine"];
  const latestPost = blogPosts.map((post) => post.updated).sort().at(-1);

  return [
    ...staticPages.map((path) => ({ url: url(path) })),
    { url: url("/blog"), lastModified: latestPost },
    ...blogPosts.map((post) => ({ url: url(`/blog/${post.slug}`), lastModified: post.updated })),
    ...flightRoutes.map((route) => ({ url: url(`/vols/${route.slug}`), lastModified: route.updated })),
    ...airports.map(({ slug }) => ({ url: url(`/aeroports/${slug}`) })),
  ];
}
