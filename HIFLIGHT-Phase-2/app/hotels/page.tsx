import type { Metadata } from "next";
import HotelExplorer from "@/components/HotelExplorer";
import ServiceTabs from "@/components/ServiceTabs";

export const metadata: Metadata = { title: "Comparer les hôtels", description: "Comparez les prix des hôtels en liste ou directement sur la carte HiFlight." };
export const dynamic = "force-dynamic";

export default function HotelsPage() {
  const stay22Aid = (process.env.NEXT_PUBLIC_STAY22_AID || process.env.STAY22_AID || "").trim();
  return <main className="market-page"><section className="market-hero hotels"><div><ServiceTabs active="hotels" /><p className="eyebrow">Hôtels</p><h1>Trouvez le bon hôtel,<br /><span>au bon endroit.</span></h1><form className="market-search"><label>Destination<input name="destination" defaultValue="Paris" required /></label><label>Arrivée<input type="date" name="checkin" required /></label><label>Départ<input type="date" name="checkout" required /></label><label>Voyageurs<select name="guests" defaultValue="2"><option value="1">1 voyageur</option><option value="2">2 voyageurs</option><option value="3">3 voyageurs</option><option value="4">4 voyageurs</option></select></label><button type="submit">Comparer</button></form><p className="hero-disclaimer">Prix et disponibilités sont fournis par Stay22. Le paiement est finalisé auprès du partenaire choisi.</p></div></section><HotelExplorer stay22Aid={stay22Aid} /></main>;
}
