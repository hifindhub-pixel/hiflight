import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand brand-logo" href="/" aria-label="Accueil HiFlight">
          <img src="/hiflight-logo.svg" alt="HiFlight" width="161" height="51" />
        </Link>
        <nav aria-label="Navigation principale">
          <Link href="/esim">eSIM</Link>
          <Link className="nav-cta nav-worldmap" href="/world-map">World Map</Link>
          <Link className="nav-cta nav-login" href="/connexion">Se connecter</Link>
        </nav>
      </div>
    </header>
  );
}
