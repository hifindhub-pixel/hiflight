import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><div className="brand"><span>Hi</span>Flight</div><p>Comparez gratuitement, puis réservez auprès du partenaire choisi.</p></div>
        <div><strong>Comparer</strong><Link href="/#recherche">Vols</Link><Link href="/hotels">Hôtels</Link><Link href="/voitures">Voitures</Link><Link href="/trains-bus">Trains & bus</Link></div>
        <div><strong>Informations</strong><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><a href="mailto:contact@hiflight.fr">Contact</a></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} HIFLIGHT · Les prix et disponibilités peuvent évoluer.</div>
    </footer>
  );
}
