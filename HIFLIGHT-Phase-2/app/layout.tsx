import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import AffiliateScripts from "@/components/AffiliateScripts";
import { siteUrl } from "@/lib/content";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "HiFlight — Le hub de tous vos voyages", template: "%s | HiFlight" },
  description: "Comparez vols, hôtels, voitures, trains et bus, puis retrouvez vos voyages sur votre globe et votre passeport HiFlight.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: "HIFLIGHT", images: [{ url: "/hiflight-hero.jpg", width: 1600, height: 900, alt: "Voyage en avion au coucher du soleil" }] },
  twitter: { card: "summary_large_image", images: ["/hiflight-hero.jpg"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><head><meta name="trustpilot-one-time-domain-verification-id" content="6f1432d9-72ab-4ce7-9eb4-5b1f935fb211" /><script type="text/javascript" dangerouslySetInnerHTML={{ __html: "(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7671073-7827-44f2-ad25-a30f19bbfa731.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');" }} /></head><body><AuthProvider><Analytics /><AffiliateScripts /><Header />{children}<Footer /><CookieBanner /></AuthProvider></body></html>;
}
