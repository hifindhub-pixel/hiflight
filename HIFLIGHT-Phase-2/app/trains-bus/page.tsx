import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";
import GroundSearch from "@/components/GroundSearch";
import ServiceFaq from "@/components/ServiceFaq";

export const metadata: Metadata = { title: "Trains et bus", description: "Comparez vos trajets en train et en bus avec HiFlight.", alternates: { canonical: "/trains-bus" } };

export default function GroundPage() {
  return <main className="market-page">
    <section className="market-hero ground"><div><ServiceTabs active="ground" /><h1>La meilleure route<br /><span>n’est pas toujours dans les airs.</span></h1><GroundSearch /><p className="hero-disclaimer">Lancez votre recherche puis consultez les horaires et tarifs disponibles dans un nouvel onglet.</p></div></section>
    <section className="ground-discovery section">
      <div className="ground-discovery-copy"><h2>La route fait déjà<br />partie du voyage.</h2><p>Centre-ville à centre-ville, paysages en mouvement et bagages à portée de main : le train et le bus transforment le trajet en expérience.</p></div>
      <div className="ground-discovery-grid">
        <article className="ground-feature-image"><div><span>Escapade ferroviaire</span><h3>Montez à bord.<br />Regardez le monde défiler.</h3></div></article>
        <article className="ground-feature-card coral"><h3>Moins d’attente.<br />Plus de voyage.</h3><p>Partez depuis le cœur des villes et évitez les longs transferts vers l’aéroport.</p></article>
        <article className="ground-feature-card navy"><h3>Votre itinéraire,<br />en un coup d’œil.</h3><p>Comparez train et bus, puis choisissez selon l’horaire, la durée et le prix.</p><div className="ground-route-line"><b>PAR</b><i>6 h 41</i><b>BCN</b></div></article>
      </div>
    </section>
    <ServiceFaq service="ground" />
  </main>;
}
