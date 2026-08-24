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

const impactTrackingScript = `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7671073-7827-44f2-ad25-a30f19bbfa731.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: impactTrackingScript }} />
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
        <Analytics />
        <Header />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
