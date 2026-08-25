"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const { user, loading } = useAuth();
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand brand-logo" href="/" aria-label="Accueil HiFlight">
          <img src="/hiflight-logo.png" alt="HiFlight" width="1027" height="328" />
        </Link>
        <nav aria-label="Navigation principale">
          <Link href="/esim">eSIM</Link>
          <Link className="nav-cta nav-worldmap" href="/world-map">World Map</Link>
          <Link className="nav-cta nav-login" href={user ? "/compte" : "/connexion"}>{loading ? "Compte" : user ? "Mon compte" : "Se connecter"}</Link>
        </nav>
      </div>
    </header>
  );
}
