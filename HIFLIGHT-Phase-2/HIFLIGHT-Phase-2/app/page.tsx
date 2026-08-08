import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import { airports, flightRoutes } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy"><h1>Comparez les vols.<br /><span>Voyagez moins cher.</span></h1><p>Des centaines de compagnies et agences comparées gratuitement, sans inscription.</p></div>
          <SearchForm />
          <div className="trust-line"><span>Gratuit</span><span>Sans inscription</span><span>Réservation chez le partenaire</span></div>
        </div>
      </section>

      <section className="section intro"><div><h2>Le prix du billet ne raconte pas toute l’histoire.</h2></div><p>HIFLIGHT vous aide à comparer les offres puis à vérifier les éléments qui changent réellement le coût du voyage : bagages, escales, aéroport de départ et conditions du partenaire.</p></section>

      <section className="section" id="destinations"><div className="section-head"><h2>Itinéraires populaires</h2><p>Des pages utiles pour préparer le trajet avant de lancer la comparaison en temps réel.</p></div><div className="route-list">{flightRoutes.map((route) => <Link key={route.slug} href={`/vols/${route.slug}`}><span>{route.originCode}</span><b>→</b><span>{route.destinationCode}</span><strong>{route.origin} – {route.destination}</strong></Link>)}</div></section>

      <section className="dark-section"><div className="section"><div className="section-head"><h2>Paris : le bon aéroport compte aussi</h2><p>Un billet moins cher peut coûter davantage une fois le transfert ajouté.</p></div><div className="airport-links">{airports.map((airport) => <Link key={airport.slug} href={`/aeroports/${airport.slug}`}><strong>{airport.code}</strong><span>{airport.name}</span><p>{airport.intro}</p></Link>)}</div></div></section>

      <section className="section editorial"><h2>Avant de réserver</h2><div><h3>Comparez le prix total</h3><p>Vérifiez les bagages inclus, les frais éventuels et les conditions de modification.</p></div><div><h3>Contrôlez les aéroports</h3><p>Une économie sur le billet peut être absorbée par un transfert long ou coûteux.</p></div><div><h3>Réservez chez le partenaire</h3><p>HIFLIGHT compare. Le paiement et le service après-vente sont assurés par le partenaire choisi.</p></div></section>
    </main>
  );
}
