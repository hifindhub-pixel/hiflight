import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" href="/" aria-label="Accueil HIFLIGHT"><span>Hi</span>Flight</Link>
        <nav aria-label="Navigation principale">
          <Link href="/#services">Voyager</Link>
          <Link href="/hotels">Hôtels</Link>
          <Link href="/voitures">Voitures</Link>
          <Link href="/#destinations">Explorer</Link>
          <Link href="/esim">eSIM</Link>
          <a className="nav-cta" href="/#recherche">Comparer</a>
        </nav>
      </div>
    </header>
  );
}
