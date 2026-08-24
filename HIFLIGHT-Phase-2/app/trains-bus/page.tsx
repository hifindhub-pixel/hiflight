import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";
import GroundSearch from "@/components/GroundSearch";

export const metadata: Metadata = { title: "Trains et bus", description: "Comparez vos trajets en train et en bus avec HiFlight." };

export default function GroundPage() {
  return <main className="market-page"><section className="market-hero ground"><div><ServiceTabs active="ground" /><p className="eyebrow">Trains & bus</p><h1>La meilleure route<br /><span>n’est pas toujours dans les airs.</span></h1><GroundSearch /><p className="hero-disclaimer">Comparez les options proposées par Omio, puis finalisez votre réservation en toute sécurité auprès du partenaire.</p></div></section><section className="coming-section"><span>Partenaire connecté</span><h2>Omio rejoint HiFlight.</h2><p>Recherchez vos trajets en train et en bus depuis HiFlight. Les horaires, les transporteurs et les prix sont ensuite comparés sur Omio, où la réservation et le paiement sont finalisés.</p></section></main>;
}
