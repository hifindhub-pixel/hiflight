"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { useAuth } from "./AuthProvider";

const AuthExperience = dynamic(() => import("./AuthExperience"), { ssr: false });

export default function Header() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  function openAuth(event: MouseEvent<HTMLAnchorElement>) {
    if (user || loading) return;
    event.preventDefault();
    setAuthOpen(true);
  }

  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand brand-logo" href="/" aria-label="Accueil HiFlight">
            <img src="/hiflight-logo.png" alt="HiFlight" width="1027" height="328" />
          </a>
          <nav aria-label="Navigation principale">
            <Link href="/esim">eSIM</Link>
            <Link className="nav-cta nav-worldmap" href="/world-map">World Map</Link>
            <Link className="nav-cta nav-login" href={user ? "/compte" : "/connexion"} onClick={openAuth}>{loading ? "Compte" : user ? "Mon compte" : "Se connecter"}</Link>
          </nav>
        </div>
      </header>
      {authOpen ? <AuthExperience onClose={() => setAuthOpen(false)} /> : null}
    </>
  );
}
