import type { Metadata } from "next";
import HotelSearchExperience from "@/components/HotelSearchExperience";

export const metadata: Metadata = { title: "Comparer les hôtels", description: "Comparez les prix des hôtels en liste ou directement sur la carte HiFlight.", alternates: { canonical: "/hotels" } };
export const dynamic = "force-dynamic";

export default function HotelsPage() {
  const stay22Aid = (process.env.NEXT_PUBLIC_STAY22_AID || process.env.STAY22_AID || "").trim();
  return <main className="market-page"><HotelSearchExperience stay22Aid={stay22Aid} /></main>;
}
