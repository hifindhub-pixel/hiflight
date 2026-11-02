import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import AffiliateScripts from "@/components/AffiliateScripts";
import { siteUrl } from "@/lib/content";
import AuthProvider from "@/components/AuthProvider";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "HiFlight — Le hub de tous vos voyages", template: "%s | HiFlight" },
  description: "Comparez vols, hôtels, voitures, trains et bus, puis retrouvez vos voyages sur votre globe et votre passeport HiFlight.",
  // Smart App Banner Safari iOS : propose l’app HiFlight (App Store id6766213610).
  itunes: { appId: "6766213610" },
  openGraph: { type: "website", locale: "fr_FR", siteName: "HIFLIGHT", images: [{ url: "/hiflight-hero.jpg", width: 1600, height: 900, alt: "Voyage en avion au coucher du soleil" }] },
  twitter: { card: "summary_large_image", images: ["/hiflight-hero.jpg"] }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" />
        <meta name="trustpilot-one-time-domain-verification-id" content="6f1432d9-72ab-4ce7-9eb4-5b1f935fb211" />
      </head>
      <body>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "HiFlight",
          url: siteUrl,
          inLanguage: "fr-FR",
          description: "Comparateur de vols, hôtels, voitures, trains, bus et eSIM.",
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: "HiFlight",
              url: `${siteUrl}/`,
              logo: `${siteUrl}/hiflight-logo.png`,
              email: "contact@hiflight.fr",
              description: "HiFlight est un comparateur de voyages en français : vols, hôtels, voitures, trains, bus et eSIM. Le service est gratuit et renvoie vers des partenaires pour réserver.",
              disambiguatingDescription: "Comparateur de vols français, sans lien avec les compagnies aériennes Hi Fly ou Hi-Air.",
              slogan: "Comparez, repérez le jour le moins cher, réservez chez le partenaire de votre choix.",
              knowsAbout: ["comparateur de vols", "billets d’avion pas chers", "vols vers le Maroc, l’Algérie et la Tunisie", "vols depuis la province"],
              sameAs: ["https://apps.apple.com/fr/app/id6766213610", "https://fr.trustpilot.com/review/hiflight.fr"],
            },
            {
              "@type": "MobileApplication",
              name: "HiFlight",
              url: "https://apps.apple.com/fr/app/id6766213610",
              operatingSystem: "iOS, Android",
              applicationCategory: "TravelApplication",
              inLanguage: "fr-FR",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              publisher: { "@id": `${siteUrl}/#organization` },
            },
          ],
        }} />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Impact-Site-Verification: 52b1d8cb-a0bb-4e31-b350-02e35cb25e61
        </span>
        <AuthProvider>
          <Analytics />
          <AffiliateScripts />
          <Header />
          {children}
          <Footer />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
