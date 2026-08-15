import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";
import VehicleExplorer from "@/components/VehicleExplorer";

export const metadata: Metadata = { title: "Comparer les locations de voiture", description: "Comparez les offres de location de voiture et trouvez les agences sur la carte HiFlight." };

export default function CarsPage() {
  return <main className="market-page"><section className="market-hero cars"><div><ServiceTabs active="cars" /><p className="eyebrow">Location de voiture</p><h1>Comparez les voitures.<br /><span>Gardez la route.</span></h1><form className="market-search"><label>Lieu de retrait<input name="pickup" defaultValue="Paris" /></label><label>Du<input type="date" name="pickupDate" /></label><label>Au<input type="date" name="returnDate" /></label><label>Conducteur<select name="driverAge" defaultValue="30"><option value="25">25–29 ans</option><option value="30">30–69 ans</option><option value="70">70 ans et +</option></select></label><button type="submit">Comparer</button></form><p className="hero-disclaimer">Comparez le prix, la catégorie, le lieu de retrait et les conditions avant de réserver chez le loueur.</p></div></section><VehicleExplorer /></main>;
}
