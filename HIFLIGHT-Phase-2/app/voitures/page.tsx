import type { Metadata } from "next";
import CarSearchExperience from "@/components/CarSearchExperience";

export const metadata: Metadata = { title: "Comparer les locations de voiture", description: "Recherchez une location de voiture par ville ou aéroport avec HiFlight." };

export default function CarsPage() {
  return <main className="market-page"><CarSearchExperience /></main>;
}
