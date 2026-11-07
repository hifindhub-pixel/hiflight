import Link from "next/link";
import { departureCities } from "@/lib/cities";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div
        className="trustpilot-strip"
        aria-label="Avis clients HIFLIGHT sur Trustpilot"
        style={{ width: "min(1160px, 100%)", minHeight: 52, margin: "0 auto 48px" }}
      >
        <div
          className="trustpilot-widget"
          data-locale="fr-FR"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="6a8f6841aab12caba2581c90"
          data-style-height="52px"
          data-style-width="100%"
          data-token="a36848ed-8417-4290-b575-31673616b8da"
          style={{ minHeight: 52 }}
        >
          <a
            href="https://fr.trustpilot.com/review/hiflight.fr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", minHeight: 52, alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}
          >
            Donnez-nous votre avis sur Trustpilot
          </a>
        </div>
      </div>
      <div className="footer-grid">
        <div className="footer-brand"><div className="brand"><span>Hi</span>Flight</div><p>Comparez gratuitement, puis réservez auprès du partenaire choisi.</p></div>
        <nav aria-label="Voyager"><strong>Voyager</strong><Link href="/#recherche">Vols</Link><Link href="/hotels">Hôtels</Link><Link href="/voitures">Voitures</Link><Link href="/esim">eSIM</Link><Link href="/trains-bus">Trains &amp; bus</Link><Link href="/world-map">World Map</Link></nav>
        <nav aria-label="Destinations"><strong>Destinations</strong><Link href="/destinations/maroc">Maroc</Link><Link href="/destinations/algerie">Algérie</Link><Link href="/destinations/espagne">Espagne</Link><Link href="/destinations/italie">Italie</Link><Link href="/destinations/royaume-uni">Royaume-Uni</Link><Link href="/destinations/etats-unis">États-Unis</Link><Link href="/destinations/asie">Asie</Link><Link href="/destinations/outre-mer">Outre-mer</Link><Link className="footer-more" href="/vols">Tous les itinéraires →</Link></nav>
        <nav aria-label="Villes de départ"><strong>Départ de</strong>{departureCities.map((city) => <Link key={city.slug} href={`/vols/depuis/${city.slug}`}>{city.name}</Link>)}</nav>
        <nav aria-label="Aide et informations"><strong>Aide</strong><Link href="/blog">Conseils voyage</Link><Link href="/guides/bagage-cabine">Bagage cabine</Link><Link href="/aeroports/paris-charles-de-gaulle">Aéroport CDG</Link><Link href="/aeroports/paris-orly">Aéroport Orly</Link><Link href="/faq">FAQ</Link><Link href="/a-propos">À propos</Link><a href="mailto:contact@hiflight.fr">Contact</a></nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} HIFLIGHT · Les prix et disponibilités peuvent évoluer.</span>
        <span className="footer-legal"><Link href="/conditions-utilisations">Conditions</Link><Link href="/mentions-legales">Mentions légales</Link><Link href="/politique-de-confidentialite">Confidentialité</Link><Link href="/politique-cookies">Cookies</Link></span>
      </div>
    </footer>
  );
}
