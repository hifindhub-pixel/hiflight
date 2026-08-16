import type { Metadata } from "next";
import HotelExplorer from "@/components/HotelExplorer";
import ServiceTabs from "@/components/ServiceTabs";

export const metadata: Metadata = { title: "Comparer les hôtels", description: "Comparez les prix des hôtels en liste ou directement sur la carte HiFlight." };

export default function HotelsPage() {
  return <main className="market-page"><section className="market-hero hotels"><div><ServiceTabs active="hotels" /><p className="eyebrow">Hôtels</p><h1>Trouvez le bon hôtel,<br /><span>au bon endroit.</span></h1><form className="market-search"><label>Destination<input name="destination" defaultValue="Paris" /></label><label>Arrivée<input type="date" name="checkin" /></label><label>Départ<input type="date" name="checkout" /></label><label>Voyageurs<select name="guests" defaultValue="2"><option value="1">1 voyageur</option><option value="2">2 voyageurs</option><option value="3">3 voyageurs</option><option value="4">4 voyageurs</option></select></label><button type="submit">Comparer</button></form><p className="hero-disclaimer">HiFlight rapproche les offres disponibles chez plusieurs vendeurs. Le paiement est finalisé auprès du partenaire choisi.</p></div></section><HotelExplorer /></main>;
}
