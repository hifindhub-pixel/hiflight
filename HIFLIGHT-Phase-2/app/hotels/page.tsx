import type { Metadata } from "next";
import HotelSearchExperience from "@/components/HotelSearchExperience";
import ServiceFaq from "@/components/ServiceFaq";

export const metadata: Metadata = { title: "Rechercher des hôtels", description: "Recherchez des hôtels par destination et dates avec HiFlight.", alternates: { canonical: "/hotels" } };

export default function HotelsPage() {
  return <main className="market-page"><HotelSearchExperience /><ServiceFaq service="hotels" /></main>;
}
