import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";
import GroundSearch from "@/components/GroundSearch";

export const metadata: Metadata = { title: "Trains et bus", description: "Comparez vos trajets en train et en bus avec HiFlight." };

export default function GroundPage() {
  return <main className="market-page"><section className="market-hero ground"><div><ServiceTabs active="ground" /><p className="eyebrow">Trains & bus</p><h1>La meilleure route<br /><span>n’est pas toujours dans les airs.</span></h1><GroundSearch /><p className="hero-disclaimer">Consultez les trajets disponibles, puis finalisez votre réservation auprès du partenaire sélectionné.</p></div></section><section className="coming-section"><span>Partenaire connecté</span><h2>FlixBus rejoint HiFlight.</h2><p>La réservation et le paiement sont finalisés directement chez FlixBus. D’autres vendeurs train et bus seront ajoutés progressivement.</p></section></main>;
}
