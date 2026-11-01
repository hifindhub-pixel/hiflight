import type { Metadata } from "next";
import { defaultOgImage, siteUrl } from "@/lib/content";
import CarSearchExperience from "@/components/CarSearchExperience";
import ServiceFaq from "@/components/ServiceFaq";

export const metadata: Metadata = {
  title: "Comparer les locations de voiture",
  description: "Comparez les locations de voiture par ville ou aéroport : catégories, loueurs et points de retrait, puis réservez auprès du partenaire de votre choix.",
  alternates: { canonical: "/voitures" },
  openGraph: { type: "website", url: `${siteUrl}/voitures/`, images: [defaultOgImage], title: "Comparer les locations de voiture | HiFlight", description: "Comparez les locations de voiture par ville ou aéroport : catégories, loueurs et points de retrait, puis réservez auprès du partenaire de votre choix." },
};

export default function CarsPage() {
  return <main className="market-page"><CarSearchExperience /><ServiceFaq service="cars" /></main>;
}
