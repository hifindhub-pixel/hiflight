import type { Metadata } from "next";
import { defaultOgImage, siteUrl } from "@/lib/content";
import HotelSearchExperience from "@/components/HotelSearchExperience";
import ServiceFaq from "@/components/ServiceFaq";

export const metadata: Metadata = {
  title: "Comparer les hôtels : prix, carte et vendeurs",
  description: "Comparez les hôtels par destination et dates : liste, carte et vendeurs partenaires pour choisir l’établissement au meilleur prix. Gratuit, sans inscription.",
  alternates: { canonical: "/hotels" },
  openGraph: { type: "website", url: `${siteUrl}/hotels/`, images: [defaultOgImage], title: "Comparer les hôtels : prix, carte et vendeurs | HiFlight", description: "Comparez les hôtels par destination et dates : liste, carte et vendeurs partenaires pour choisir l’établissement au meilleur prix. Gratuit, sans inscription." },
};

export default function HotelsPage() {
  return <main className="market-page"><HotelSearchExperience /><ServiceFaq service="hotels" /></main>;
}
