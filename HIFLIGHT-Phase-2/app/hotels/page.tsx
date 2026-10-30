import { agodaEnabled } from '@/lib/agoda/server-config';
export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import HotelSearchExperience from "@/components/HotelSearchExperience";
import ServiceFaq from "@/components/ServiceFaq";

const baseMetadata: Metadata = { title: "Rechercher des hôtels", description: "Recherchez des hôtels par destination et dates avec HiFlight.", alternates: { canonical: "/hotels" } };

export function generateMetadata(): Metadata {
  return { ...baseMetadata, ...(agodaEnabled() ? { robots: { index: false, follow: false } } : {}) };
}

export default function HotelsPage() {
  return <main className="market-page"><HotelSearchExperience provider={agodaEnabled() ? "agoda" : "stay22"} /><ServiceFaq service="hotels" /></main>;
}
