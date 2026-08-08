import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import { siteUrl } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "HIFLIGHT — Comparateur de vols", template: "%s | HIFLIGHT" },
  description: "Comparez gratuitement les offres de vols de compagnies et agences partenaires.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: "HIFLIGHT", images: [{ url: "/hiflight-hero.jpg", width: 1600, height: 900, alt: "Voyage en avion au coucher du soleil" }] },
  twitter: { card: "summary_large_image", images: ["/hiflight-hero.jpg"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><Analytics /><Header />{children}<Footer /><CookieBanner /></body></html>;
}
