import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/go/", "/recherche", "/connexion", "/compte"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
