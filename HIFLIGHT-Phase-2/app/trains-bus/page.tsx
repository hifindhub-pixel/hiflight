import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";

export const metadata: Metadata = { title: "Trains et bus", description: "Comparez vos trajets en train et en bus avec HiFlight." };

export default function GroundPage() {
  return <main className="market-page"><section className="market-hero ground"><div><ServiceTabs active="ground" /><p className="eyebrow">Trains & bus</p><h1>La meilleure route<br /><span>n’est pas toujours dans les airs.</span></h1><form className="market-search"><label>Départ<input name="origin" placeholder="Ville ou gare" /></label><label>Destination<input name="destination" placeholder="Ville ou gare" /></label><label>Aller<input type="date" name="departure" /></label><label>Voyageurs<select name="travelers"><option>1 voyageur</option><option>2 voyageurs</option><option>3 voyageurs</option></select></label><button type="submit">Comparer</button></form><p className="hero-disclaimer">Le comparateur train et bus sera relié aux partenaires disponibles, notamment Omio et 12Go.</p></div></section><section className="coming-section"><span>Prochaine étape</span><h2>Train, bus et vol dans une même recherche.</h2><p>Cette section est prête à recevoir les flux partenaires afin de comparer durée, prix, correspondances et empreinte du trajet.</p></section></main>;
}
