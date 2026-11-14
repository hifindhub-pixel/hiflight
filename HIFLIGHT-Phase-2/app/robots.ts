import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/go/", "/recherche", "/connexion", "/compte"] },
      // Robots des assistants IA et moteurs de réponse : explicitement autorisés sur le contenu public.
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"], allow: "/", disallow: ["/api/", "/go/", "/recherche", "/connexion", "/compte"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
