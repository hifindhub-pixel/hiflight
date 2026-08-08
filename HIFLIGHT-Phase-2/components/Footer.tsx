import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><div className="brand"><span>Hi</span>Flight</div><p>Comparez gratuitement, puis réservez auprès du partenaire choisi.</p></div>
        <div><strong>Préparer son voyage</strong><Link href="/guides/bagage-cabine">Bagage cabine</Link><Link href="/aeroports/paris-charles-de-gaulle">Aéroport CDG</Link><Link href="/aeroports/paris-orly">Aéroport ORY</Link></div>
        <div><strong>Informations</strong><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><a href="mailto:contact@hiflight.fr">Contact</a></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} HIFLIGHT · Les prix et disponibilités peuvent évoluer.</div>
    </footer>
  );
}
