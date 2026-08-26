import Link from "next/link";

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
        <div><div className="brand"><span>Hi</span>Flight</div><p>Comparez gratuitement, puis réservez auprès du partenaire choisi.</p></div>
        <div><strong>Comparer</strong><Link href="/#recherche">Vols</Link><Link href="/hotels">Hôtels</Link><Link href="/voitures">Voitures</Link><Link href="/trains-bus">Trains & bus</Link></div>
        <div><strong>Informations</strong><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><a href="mailto:contact@hiflight.fr">Contact</a></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} HIFLIGHT · Les prix et disponibilités peuvent évoluer.</div>
    </footer>
  );
}
