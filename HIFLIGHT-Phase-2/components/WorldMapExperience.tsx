"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { WORLD_COUNTRIES } from "@/lib/worldCountries";
import styles from "./WorldMapExperience.module.css";

type CountryState = { country_code: string; visited: boolean; wishlist: boolean; visited_at?: string | null; note?: string | null; photo_url?: string | null };
type States = Record<string, CountryState>;
type Mode = "visited" | "wishlist" | "passport";

function flagEmoji(code2: string | null) {
  if (!code2) return "•";
  return String.fromCodePoint(...code2.toUpperCase().split("").map((letter) => 127397 + letter.charCodeAt(0)));
}

function formatStampDate(value?: string | null) {
  if (!value) return "PAYS VISITÉ";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`)).toUpperCase();
}

export default function WorldMapExperience() {
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("visited");
  const [states, setStates] = useState<States>({});
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "passport") setMode("passport");
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    setLoading(true);
    fetch("/api/user/countries", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Impossible de charger votre carte.");
        const next: States = {};
        (payload.countries as CountryState[]).forEach((country) => { next[country.country_code] = country; });
        setStates(next);
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const selectedCountry = WORLD_COUNTRIES.find((country) => country.code === selectedCode) || null;
  const selectedState = selectedCode ? states[selectedCode] : undefined;
  const visitedCountries = useMemo(() => WORLD_COUNTRIES.filter((country) => states[country.code]?.visited).sort((a, b) => a.name.localeCompare(b.name, "fr")), [states]);
  const wishlistCountries = useMemo(() => WORLD_COUNTRIES.filter((country) => states[country.code]?.wishlist).sort((a, b) => a.name.localeCompare(b.name, "fr")), [states]);
  const searchResults = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    if (!query) return [];
    return WORLD_COUNTRIES.filter((country) => country.name.toLocaleLowerCase("fr").includes(query) || country.code.toLowerCase().includes(query)).slice(0, 8);
  }, [search]);

  async function updateCountry(target: "visited" | "wishlist") {
    if (!selectedCountry || saving) return;
    const current = states[selectedCountry.code] || { country_code: selectedCountry.code, visited: false, wishlist: false };
    const nextActive = !current[target];
    const next: CountryState = {
      ...current,
      country_code: selectedCountry.code,
      visited: target === "visited" ? nextActive : false,
      wishlist: target === "wishlist" ? nextActive : false,
      visited_at: target === "visited" && nextActive ? current.visited_at || new Date().toISOString().slice(0, 10) : null,
    };
    setStates((previous) => ({ ...previous, [selectedCountry.code]: next }));
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/user/countries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ countryCode: next.country_code, visited: next.visited, wishlist: next.wishlist, visitedAt: next.visited_at }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Sauvegarde impossible.");
      setStates((previous) => ({ ...previous, [selectedCountry.code]: payload.country }));
    } catch (reason) {
      setStates((previous) => ({ ...previous, [selectedCountry.code]: current }));
      setError(reason instanceof Error ? reason.message : "Sauvegarde impossible.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) return <main className={styles.loading}><div className={styles.loader} /><p>Ouverture de votre carte…</p></main>;

  if (!user) return <main className={styles.guest}><section><span>World Map HiFlight</span><h1>Votre monde vous attend.</h1><p>Connectez-vous pour colorer les pays visités, préparer vos prochaines destinations et ouvrir votre passeport personnel.</p><div><Link href="/connexion">Se connecter</Link><Link href="/connexion">Créer un compte</Link></div></section></main>;

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div><span>Votre espace voyage</span><h1>Mes voyages</h1><p>{visitedCountries.length ? `${visitedCountries.length} pays déjà ajoutés à votre passeport.` : "Commencez par sélectionner votre premier pays."}</p></div>
        <div className={styles.stats}><div><strong>{visitedCountries.length}</strong><span>visités</span></div><div><strong>{wishlistCountries.length}</strong><span>à découvrir</span></div><div><strong>{Math.round((visitedCountries.length / WORLD_COUNTRIES.length) * 100)}%</strong><span>du monde</span></div></div>
      </header>

      <nav className={styles.tabs} aria-label="World Map et passeport">
        <button className={mode === "visited" ? styles.active : ""} onClick={() => setMode("visited")}><span>Carte</span>Pays visités</button>
        <button className={mode === "wishlist" ? styles.active : ""} onClick={() => setMode("wishlist")}><span>Projets</span>À visiter</button>
        <button className={mode === "passport" ? styles.active : ""} onClick={() => setMode("passport")}><span>Collection</span>Mon passeport</button>
      </nav>

      {mode === "passport" ? (
        <section className={styles.passportSection}>
          <div className={styles.passportCover}><div className={styles.passportGlobe} aria-hidden="true">✦</div><span>HIFLIGHT</span><h2>PASSEPORT</h2><p>{user.email}</p></div>
          <div className={styles.passportContent}>
            <div className={styles.passportHeading}><div><span>Collection personnelle</span><h2>Les pages de votre voyage</h2></div><p>Chaque pays marqué comme visité reçoit automatiquement sa page et son tampon.</p></div>
            {!visitedCountries.length ? <div className={styles.emptyPassport}><h3>Votre passeport attend son premier tampon.</h3><p>Ouvrez la carte et ajoutez un pays visité.</p><button onClick={() => setMode("visited")}>Ouvrir ma carte</button></div> : <div className={styles.passportGrid}>{visitedCountries.map((country, index) => {
              const state = states[country.code];
              return <article className={styles.passportPage} key={country.code}><div className={styles.pageTop}><span>{flagEmoji(country.code2)} {country.name}</span><b>{String(index + 1).padStart(2, "0")}</b></div><div className={styles.watermark}>{country.code}</div><div className={styles.stamp}><small>HIFLIGHT</small><strong>{formatStampDate(state.visited_at)}</strong><span>{country.name}</span></div><p>Une page de plus dans votre histoire.</p></article>;
            })}</div>}
          </div>
        </section>
      ) : (
        <section className={styles.workspace}>
          <div className={styles.mapCard}>
            <div className={styles.mapToolbar}><div><strong>{mode === "visited" ? "Les pays que vous avez explorés" : "Les pays que vous voulez découvrir"}</strong><span>Cliquez directement sur la carte</span></div><div className={styles.legend}><i className={mode === "visited" ? styles.coral : styles.blue} />{mode === "visited" ? "Visité" : "À visiter"}</div></div>
            <div className={styles.mapScroller}><svg className={styles.map} viewBox="0 0 1000 500" role="img" aria-label="Carte interactive du monde">{WORLD_COUNTRIES.map((country) => {
              const active = mode === "visited" ? states[country.code]?.visited : states[country.code]?.wishlist;
              return <path key={country.code} d={country.d} className={`${active ? styles.mapActive : ""} ${selectedCode === country.code ? styles.mapSelected : ""}`} data-mode={mode} onClick={() => setSelectedCode(country.code)}><title>{country.name}</title></path>;
            })}</svg></div>
          </div>

          <aside className={styles.sidePanel}>
            <div className={styles.search}><label htmlFor="country-search">Rechercher un pays</label><input id="country-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="France, Japon, Brésil…" />{searchResults.length > 0 && <div>{searchResults.map((country) => <button key={country.code} onClick={() => { setSelectedCode(country.code); setSearch(""); }}><span>{flagEmoji(country.code2)}</span>{country.name}<b>{country.code}</b></button>)}</div>}</div>
            {selectedCountry ? <div className={styles.countryDetail}><div className={styles.flag}>{flagEmoji(selectedCountry.code2)}</div><span>{selectedCountry.code}</span><h2>{selectedCountry.name}</h2><p>{selectedState?.visited ? "Ce pays fait partie de votre passeport." : selectedState?.wishlist ? "Cette destination est dans vos projets." : "Ajoutez ce pays à votre histoire HiFlight."}</p><button className={selectedState?.visited ? styles.selectedAction : ""} disabled={saving} onClick={() => updateCountry("visited")}>{selectedState?.visited ? "Retirer des pays visités" : "J’y suis allé"}</button><button className={selectedState?.wishlist ? styles.selectedWish : ""} disabled={saving} onClick={() => updateCountry("wishlist")}>{selectedState?.wishlist ? "Retirer de mes projets" : "Je veux y aller"}</button></div> : <div className={styles.selectPrompt}><div>⌖</div><h2>Choisissez un pays</h2><p>Sélectionnez-le sur la carte ou utilisez la recherche.</p></div>}
            {error && <p className={styles.error} role="alert">{error}</p>}
          </aside>
        </section>
      )}
    </main>
  );
}
