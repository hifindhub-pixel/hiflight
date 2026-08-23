import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import ServiceTabs from "@/components/ServiceTabs";
import { airports, flightRoutes } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <ServiceTabs active="flights" />
          <div className="hero-copy"><h1>Des millions de vols,<br /><span>un seul endroit.</span></h1><p>Des centaines de compagnies et agences comparées gratuitement, sans inscription.</p></div>
          <SearchForm />
          <div className="trust-line"><span>Gratuit</span><span>Sans inscription</span><span>Réservation chez le partenaire</span></div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-head"><p className="eyebrow">Tout le voyage, au même endroit</p><h2>Un seul départ.<br />Quatre façons de voyager.</h2><p>HiFlight vous aide à comparer chaque étape, puis vous redirige vers le partenaire choisi pour finaliser la réservation.</p></div>
        <div className="service-grid">
          <Link href="/#recherche"><span>01</span><h3>Vols</h3><p>Comparez les compagnies et agences sur notre moteur dédié.</p><strong>Rechercher un vol →</strong></Link>
          <Link href="/hotels"><span>02</span><h3>Hôtels</h3><p>Comparez les établissements, les vendeurs et les prix sur la carte.</p><strong>Voir les hôtels →</strong></Link>
          <Link href="/voitures"><span>03</span><h3>Voitures</h3><p>Comparez les catégories, les loueurs et les points de retrait.</p><strong>Louer une voiture →</strong></Link>
          <Link href="/trains-bus"><span>04</span><h3>Trains & bus</h3><p>Préparez vos trajets terrestres et comparez les alternatives.</p><strong>Explorer les trajets →</strong></Link>
        </div>
      </section>

      <section className="journey-section"><div className="section"><p className="eyebrow">L’expérience qui continue après la réservation</p><h2>Explorez. Voyagez.<br /><span>Collectionnez le monde.</span></h2><div className="journey-cards"><div><b>Globe</b><p>Visualisez vos pays visités et ceux que vous voulez découvrir.</p></div><div><b>Passeport</b><p>Conservez vos tampons, dates, dessins et souvenirs de voyage.</p></div><div><b>Statistiques</b><p>Suivez le nombre de pays, continents et kilomètres parcourus.</p></div></div></div></section>

      <section className="section intro"><div><h2>Le prix du billet ne raconte pas toute l’histoire.</h2></div><p>HIFLIGHT vous aide à comparer les offres puis à vérifier les éléments qui changent réellement le coût du voyage : bagages, escales, aéroport de départ et conditions du partenaire.</p></section>

      <section className="section" id="destinations"><div className="section-head"><h2>Itinéraires populaires</h2><p>Des pages utiles pour préparer le trajet avant de lancer la comparaison en temps réel.</p></div><div className="route-list">{flightRoutes.map((route) => <Link key={route.slug} href={`/vols/${route.slug}`}><span>{route.originCode}</span><b>→</b><span>{route.destinationCode}</span><strong>{route.origin} – {route.destination}</strong></Link>)}</div></section>

      <section className="dark-section"><div className="section"><div className="section-head"><h2>Paris : le bon aéroport compte aussi</h2><p>Un billet moins cher peut coûter davantage une fois le transfert ajouté.</p></div><div className="airport-links">{airports.map((airport) => <Link key={airport.slug} href={`/aeroports/${airport.slug}`}><strong>{airport.code}</strong><span>{airport.name}</span><p>{airport.intro}</p></Link>)}</div></div></section>

      <section className="section editorial"><h2>Avant de réserver</h2><div><h3>Comparez le prix total</h3><p>Vérifiez les bagages inclus, les frais éventuels et les conditions de modification.</p></div><div><h3>Contrôlez les aéroports</h3><p>Une économie sur le billet peut être absorbée par un transfert long ou coûteux.</p></div><div><h3>Réservez chez le partenaire</h3><p>HIFLIGHT compare. Le paiement et le service après-vente sont assurés par le partenaire choisi.</p></div></section>
    </main>
  );
}
