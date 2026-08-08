import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" href="/" aria-label="Accueil HIFLIGHT"><span>Hi</span>Flight</Link>
        <nav aria-label="Navigation principale">
          <Link href="/#destinations">Destinations</Link>
          <Link href="/guides/bagage-cabine">Guides</Link>
          <a className="nav-cta" href="#recherche">Comparer un vol</a>
        </nav>
      </div>
    </header>
  );
}
