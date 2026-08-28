import type { Metadata } from "next";
import CarSearchExperience from "@/components/CarSearchExperience";
import ServiceFaq from "@/components/ServiceFaq";

export const metadata: Metadata = { title: "Comparer les locations de voiture", description: "Recherchez une location de voiture par ville ou aéroport avec HiFlight.", alternates: { canonical: "/voitures" } };

export default function CarsPage() {
  return <main className="market-page"><CarSearchExperience /><ServiceFaq service="cars" /></main>;
}
