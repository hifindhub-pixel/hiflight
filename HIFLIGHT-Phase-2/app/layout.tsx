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
  openGraph: { type: "website", locale: "fr_FR", siteName: "HIFLIGHT", images: [{ url: "/hiflight-hero.jpg", width: 1600, height: 900, alt: "Voyage en avion au coucher du soleil" }] },
  twitter: { card: "summary_large_image", images: ["/hiflight-hero.jpg"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <meta name="trustpilot-one-time-domain-verification-id" content="6f1432d9-72ab-4ce7-9eb4-5b1f935fb211" />
      </head>
      <body>
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
