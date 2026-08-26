"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Globe2, List, Plane, Search, Share2, Star } from "lucide-react";
import { useAuth } from "./AuthProvider";
import HiflightGlobe, { GlobeMode } from "./HiflightGlobe";
import { GLOBE_COUNTRIES } from "@/lib/world-map/globeCountries";
import { VECTOR_FLAGS } from "@/lib/world-map/vectorFlags";
import { MISSING_VECTOR_FLAGS } from "@/lib/world-map/missingVectorFlags";
import { PASSPORT_PAGE_IMAGES } from "@/lib/passportPageImages";
import styles from "./WorldMapExperience.module.css";
import motionStyles from "./PassportPageTurn.module.css";
import flagModalStyles from "./CountryFlagModal.module.css";
import WavingFlag from "./WavingFlag";

type CountryState = {
  country_code: string;
  visited: boolean;
  wishlist: boolean;
  visited_at?: string | null;
};
type StateMap = Record<string, CountryState>;
type PrimarySection = "globe" | "passport";
type ViewMode = "map" | "list";
type Country = { code: string; code2: string | null; name: string };

const NON_COUNTRY_TERRITORY_CODES = new Set(["ATF", "FLK", "GRL", "NCL", "PRI"]);
const COUNTRY_CATALOG_ADDITIONS: Country[] = [
  { code: "ATG", code2: "AG", name: "Antigua-et-Barbuda" }, { code: "BRB", code2: "BB", name: "Barbade" },
  { code: "CPV", code2: "CV", name: "Cap-Vert" }, { code: "COM", code2: "KM", name: "Comores" },
  { code: "DMA", code2: "DM", name: "Dominique" }, { code: "FSM", code2: "FM", name: "Micronésie" },
  { code: "GRD", code2: "GD", name: "Grenade" }, { code: "KIR", code2: "KI", name: "Kiribati" },
  { code: "MHL", code2: "MH", name: "Îles Marshall" }, { code: "MUS", code2: "MU", name: "Maurice" },
  { code: "MDV", code2: "MV", name: "Maldives" }, { code: "NRU", code2: "NR", name: "Nauru" },
  { code: "PLW", code2: "PW", name: "Palaos" }, { code: "KNA", code2: "KN", name: "Saint-Christophe-et-Niévès" },
  { code: "LCA", code2: "LC", name: "Sainte-Lucie" }, { code: "VCT", code2: "VC", name: "Saint-Vincent-et-les-Grenadines" },
  { code: "WSM", code2: "WS", name: "Samoa" }, { code: "STP", code2: "ST", name: "São Tomé-et-Príncipe" },
  { code: "SYC", code2: "SC", name: "Seychelles" }, { code: "TON", code2: "TO", name: "Tonga" },
  { code: "TUV", code2: "TV", name: "Tuvalu" },
];

const COUNTRIES: Country[] = Array.from(
  [...GLOBE_COUNTRIES, ...COUNTRY_CATALOG_ADDITIONS].reduce((catalog, country) => {
    if (country.code !== "ESH" && !NON_COUNTRY_TERRITORY_CODES.has(country.code) && !catalog.has(country.code)) {
      catalog.set(country.code, { code: country.code, code2: country.code2, name: country.name });
    }
    return catalog;
  }, new Map<string, Country>()),
).map(([, country]) => country);

const COUNTRY_BY_CODE = new Map(COUNTRIES.map((country) => [country.code, country]));
const PLURAL_COUNTRY_CODES = new Set(["ARE", "BHS", "COM", "USA", "FJI", "MHL", "MDV", "NLD", "PHL", "SLB", "SYC"]);
const NO_ARTICLE_COUNTRY_CODES = new Set(["CYP", "CUB", "DJI", "HTI", "ISR", "MDG", "MLT", "MUS", "OMN", "QAT", "SGP"]);
const MASCULINE_ENDING_E_COUNTRY_CODES = new Set(["BLZ", "KHM", "MEX", "MOZ", "ZWE"]);
const VOWEL_SOUND = /^[AEIOUYÉÈÊËÀÂÄÎÏÔÖÙÛÜ]/i;

function countryWithArticle(country: Country | undefined) {
  if (!country) return "ce pays";
  if (NO_ARTICLE_COUNTRY_CODES.has(country.code)) return country.name;
  if (PLURAL_COUNTRY_CODES.has(country.code)) return `les ${country.name}`;
  if (VOWEL_SOUND.test(country.name)) return `l’${country.name}`;
  const feminine = country.name.endsWith("e") && !MASCULINE_ENDING_E_COUNTRY_CODES.has(country.code);
  return `${feminine ? "la" : "le"} ${country.name}`;
}

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
}

function flagSource(code2: string | null) {
  if (!code2) return null;
  const key = code2.toLowerCase();
  const vector = VECTOR_FLAGS[key] || MISSING_VECTOR_FLAGS[key];
  return vector ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(vector)}` : null;
}

function passportPageSource(code: string) {
  return PASSPORT_PAGE_IMAGES[code];
}

function PassportPage({ country, side, onPress, interactive = true }: { country?: Country; side: "left" | "right"; onPress: (code: string) => void; interactive?: boolean }) {
  const pageClassName = `${styles.bookPage} ${country ? motionStyles.passportCountryPage : ""} ${styles[side]} ${motionStyles.bookPage} ${motionStyles[side]}`;
  if (!country) return <div className={pageClassName}><Plane className={styles.nextStopIcon} aria-hidden="true" /><strong>PROCHAINE ESCALE</strong><p>Une nouvelle page reste à écrire.</p></div>;
  const content = <img className={motionStyles.passportCountryArtwork} src={passportPageSource(country.code)} alt={`Page du passeport HiFlight pour ${country.name}`} draggable={false} decoding="async" fetchPriority="high" />;
  if (!interactive) return <div className={pageClassName}>{content}</div>;
  return <button className={pageClassName} onClick={() => onPress(country.code)}>{content}</button>;
}

export default function WorldMapExperience() {
  const { user, loading: authLoading } = useAuth();
  const [states, setStates] = useState<StateMap>({});
  const [primarySection, setPrimarySection] = useState<PrimarySection>("globe");
  const [mode, setMode] = useState<GlobeMode>("visited");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [passportOpen, setPassportOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState<"next" | "previous" | null>(null);
  const [turnTarget, setTurnTarget] = useState<number | null>(null);
  const pageTurnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("view") === "passport") setPrimarySection("passport");
    const localPreview = ["localhost", "127.0.0.1", "terminal.local"].includes(window.location.hostname);
    if ((process.env.NODE_ENV === "development" || localPreview) && parameters.get("demo") === "1") setDemoMode(true);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (demoMode) {
      const demoCountries = ["FRA", "ESP", "MAR", "DZA", "ITA", "USA", "JPN", "ARG"];
      setStates(Object.fromEntries(demoCountries.map((code, index) => [code, { country_code: code, visited: true, wishlist: false, visited_at: `202${Math.min(index, 6)}-0${(index % 8) + 1}-12` }])))
      setLoading(false);
      return;
    }
    if (!user) { setLoading(false); return; }
    setLoading(true);
    fetch("/api/user/countries", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Impossible de charger votre carte.");
        const next: StateMap = {};
        (payload.countries as CountryState[]).forEach((country) => { next[country.country_code] = country; });
        setStates(next);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Impossible de charger votre carte."))
      .finally(() => setLoading(false));
  }, [user, authLoading, demoMode]);

  const visitedCountries = useMemo(() => COUNTRIES.filter((country) => states[country.code]?.visited).sort((a, b) => a.name.localeCompare(b.name, "fr")), [states]);
  const wishlistCountries = useMemo(() => COUNTRIES.filter((country) => states[country.code]?.wishlist).sort((a, b) => a.name.localeCompare(b.name, "fr")), [states]);
  const activeCountries = mode === "visited" ? visitedCountries : wishlistCountries;
  const filteredCountries = useMemo(() => {
    const query = normalizeSearch(search);
    const source = query ? COUNTRIES : activeCountries;
    return source.filter((country) => !query || normalizeSearch(`${country.name} ${country.code}`).includes(query));
  }, [activeCountries, search]);
  const pendingCountry = pendingCode ? COUNTRY_BY_CODE.get(pendingCode) : undefined;
  const pendingState = pendingCode ? states[pendingCode] : undefined;
  const pendingIsActive = mode === "visited" ? pendingState?.visited : pendingState?.wishlist;
  const spreadCount = Math.max(1, Math.ceil(visitedCountries.length / 2));
  const leftCountry = visitedCountries[spreadIndex * 2];
  const rightCountry = visitedCountries[spreadIndex * 2 + 1];
  const targetSpreadIndex = turnTarget ?? spreadIndex;
  const targetLeftCountry = visitedCountries[targetSpreadIndex * 2];
  const targetRightCountry = visitedCountries[targetSpreadIndex * 2 + 1];
  const baseLeftCountry = turnDirection === "previous" ? targetLeftCountry : leftCountry;
  const baseRightCountry = turnDirection === "next" ? targetRightCountry : rightCountry;

  useEffect(() => { setSpreadIndex((current) => Math.min(current, Math.max(0, spreadCount - 1))); }, [spreadCount]);
  useEffect(() => () => { if (pageTurnTimer.current) clearTimeout(pageTurnTimer.current); }, []);
  useEffect(() => {
    if (primarySection !== "passport") return;
    const indexes = passportOpen ? [spreadIndex - 1, spreadIndex, spreadIndex + 1] : [0, 1];
    indexes.forEach((index) => {
      if (index < 0 || index >= spreadCount) return;
      visitedCountries.slice(index * 2, index * 2 + 2).forEach((country) => {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = index === spreadIndex ? "high" : "low";
        image.src = passportPageSource(country.code);
      });
    });
  }, [passportOpen, primarySection, spreadCount, spreadIndex, visitedCountries]);

  function turnPassportPage(delta: -1 | 1) {
    if (turnDirection) return;
    const nextIndex = spreadIndex + delta;
    if (nextIndex < 0 || nextIndex >= spreadCount) return;
    setTurnTarget(nextIndex);
    setTurnDirection(delta === 1 ? "next" : "previous");
    pageTurnTimer.current = setTimeout(() => finishPassportTurn(nextIndex), 760);
  }

  function finishPassportTurn(nextIndex: number) {
    if (pageTurnTimer.current) clearTimeout(pageTurnTimer.current);
    setSpreadIndex(nextIndex);
    setTurnDirection(null);
    setTurnTarget(null);
    pageTurnTimer.current = null;
  }

  const updateCountry = useCallback(async (code: string, target: GlobeMode) => {
    if (saving) return;
    const current = states[code] || { country_code: code, visited: false, wishlist: false };
    const active = !current[target];
    const next: CountryState = {
      ...current,
      country_code: code,
      visited: target === "visited" ? active : false,
      wishlist: target === "wishlist" ? active : false,
      visited_at: target === "visited" && active ? current.visited_at || new Date().toISOString().slice(0, 10) : null,
    };
    setStates((previous) => ({ ...previous, [code]: next }));
    if (demoMode) {
      setPendingCode(null);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/user/countries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ countryCode: code, visited: next.visited, wishlist: next.wishlist }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Sauvegarde impossible.");
      setStates((previous) => ({ ...previous, [code]: { ...next, ...payload.country } }));
      setPendingCode(null);
    } catch (reason) {
      setStates((previous) => ({ ...previous, [code]: current }));
      setError(reason instanceof Error ? reason.message : "Sauvegarde impossible.");
    } finally { setSaving(false); }
  }, [demoMode, saving, states]);

  async function sharePassport() {
    const url = `${window.location.origin}/world-map?view=passport`;
    const shareData = { title: "Mon passeport HiFlight", text: `J’ai déjà visité ${visitedCountries.length} pays avec HiFlight.`, url };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(url); setShareMessage("Lien copié !"); }
    } catch { setShareMessage(""); }
  }

  if (authLoading || loading) return <main className={styles.loading}><div className={styles.loader} /><p>Préparation de votre globe…</p></main>;
  if (!user && !demoMode) return <main className={styles.guest}><section><span>World Map HiFlight</span><h1>Votre monde vous attend.</h1><p>Connectez-vous pour colorer les pays avec leurs vrais drapeaux et remplir votre passeport personnel.</p><div><Link href="/connexion">Se connecter</Link><Link href="/connexion">Créer un compte</Link></div></section></main>;

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div><span>VOTRE ESPACE VOYAGE</span><h1>Mes voyages</h1><p>{visitedCountries.length ? `${visitedCountries.length} pays ajoutés à votre passeport.` : "Tournez le globe et marquez votre premier pays."}</p></div>
        <div className={styles.stats}><div><strong>{visitedCountries.length}</strong><span>visités</span></div><div><strong>{wishlistCountries.length}</strong><span>à visiter</span></div><div><strong>{Math.round((visitedCountries.length / COUNTRIES.length) * 100)}%</strong><span>du monde</span></div></div>
      </header>

      <nav className={styles.primaryTabs} aria-label="Globe et passeport">
        <button className={primarySection === "globe" ? styles.activePrimary : ""} onClick={() => setPrimarySection("globe")}><Globe2 size={19} />Globe</button>
        <button className={primarySection === "passport" ? styles.activePrimary : ""} onClick={() => setPrimarySection("passport")}><BookOpen size={19} />Passeport</button>
      </nav>

      {primarySection === "passport" ? (
        <section className={styles.passportHome}>
          {!visitedCountries.length ? (
            <div className={styles.emptyPassport}><img src="/world-map/hiflight-passport-cover.png" alt="Passeport HiFlight" /><h2>Votre passeport vous attend</h2><p>Tournez le globe et marquez votre premier pays visité pour recevoir votre premier tampon.</p><button onClick={() => setPrimarySection("globe")}><Globe2 size={20} />Ouvrir mon globe</button></div>
          ) : !passportOpen ? (
            <div className={styles.closedPassport}><button onClick={() => setPassportOpen(true)} aria-label="Ouvrir le passeport"><img src="/world-map/hiflight-passport-cover.png" alt="Passeport HiFlight" /><span><BookOpen size={18} />Ouvrir le passeport</span></button></div>
          ) : (
            <div className={styles.openPassportWrap}>
              <div className={`${styles.openBook} ${motionStyles.openBook}`}>
                <img className={motionStyles.openBookBackground} src="/world-map/hiflight-passport-open.png" alt="" aria-hidden="true" />
                <div className={motionStyles.bookPages}>
                  <PassportPage country={baseLeftCountry} side="left" onPress={(code) => { setMode("visited"); setPendingCode(code); }} />
                  <PassportPage country={baseRightCountry} side="right" onPress={(code) => { setMode("visited"); setPendingCode(code); }} />
                </div>
                {turnDirection ? (
                  <div className={`${motionStyles.turnPage} ${turnDirection === "next" ? motionStyles.turnNext : motionStyles.turnPrevious}`} aria-hidden="true" onAnimationEnd={() => { if (turnTarget !== null) finishPassportTurn(turnTarget); }}>
                    <div className={`${motionStyles.turnFace} ${motionStyles.turnFront}`}>
                      <PassportPage
                        country={turnDirection === "next" ? rightCountry : leftCountry}
                        side={turnDirection === "next" ? "right" : "left"}
                        onPress={() => undefined}
                        interactive={false}
                      />
                    </div>
                    <div className={`${motionStyles.turnFace} ${motionStyles.turnBack}`}>
                      <PassportPage
                        country={turnDirection === "next" ? targetLeftCountry : targetRightCountry}
                        side={turnDirection === "next" ? "left" : "right"}
                        onPress={() => undefined}
                        interactive={false}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className={styles.bookNavigation}><button aria-label="Pages précédentes" disabled={spreadIndex === 0 || Boolean(turnDirection)} onClick={() => turnPassportPage(-1)}><ChevronLeft /></button><div aria-live="polite"><strong>Pages {spreadIndex * 2 + 1}–{Math.min(spreadIndex * 2 + 2, visitedCountries.length)}</strong><span>Utilisez les flèches pour tourner les pages</span></div><button aria-label="Pages suivantes" disabled={spreadIndex === spreadCount - 1 || Boolean(turnDirection)} onClick={() => turnPassportPage(1)}><ChevronRight /></button></div>
              <button className={styles.closePassport} onClick={() => setPassportOpen(false)}><BookOpen size={16} />Fermer le passeport</button>
            </div>
          )}
          {visitedCountries.length ? <button className={styles.sharePassport} onClick={sharePassport}><Share2 size={20} />{shareMessage || "Partager mon passeport"}</button> : null}
        </section>
      ) : (
        <section className={styles.globeWorkspace}>
          <div className={styles.controlRow}>
            <div className={styles.segment}><button className={mode === "visited" ? styles.segmentActive : ""} onClick={() => setMode("visited")}><Check size={16} />Visités</button><button className={mode === "wishlist" ? styles.segmentActive : ""} onClick={() => setMode("wishlist")}><Star size={16} />À visiter</button></div>
            <div className={styles.segment}><button className={viewMode === "map" ? styles.viewActive : ""} onClick={() => setViewMode("map")}><Globe2 size={16} />Carte</button><button className={viewMode === "list" ? styles.viewActive : ""} onClick={() => setViewMode("list")}><List size={16} />Liste</button></div>
          </div>
          {viewMode === "map" ? <HiflightGlobe states={states} mode={mode} onCountryPress={setPendingCode} /> : (
            <div className={styles.listPanel}>
              <label className={styles.listSearch}><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un pays" /></label>
              <div className={styles.countryList}>{filteredCountries.length ? filteredCountries.map((country) => {
                const flag = flagSource(country.code2); const state = states[country.code]; const active = mode === "visited" ? state?.visited : state?.wishlist;
                return <button key={country.code} onClick={() => setPendingCode(country.code)}><span className={styles.listFlag}>{flag ? <img src={flag} alt="" /> : <Globe2 size={20} />}</span><span><strong>{country.name}</strong><small>{state?.visited ? "Pays visité" : state?.wishlist ? "À visiter" : "Non ajouté"}</small></span><b className={active ? styles.countryActive : ""}>{active ? <Check size={17} /> : "+"}</b></button>;
              }) : <div className={styles.emptyList}>Aucun pays dans cette liste.</div>}</div>
            </div>
          )}
          <p className={styles.globeSummary}>{mode === "visited" ? `${visitedCountries.length} pays visités` : `${wishlistCountries.length} destinations à découvrir`} · {COUNTRIES.length} pays disponibles</p>
        </section>
      )}

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {pendingCountry ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingCode(null); }}>
          <section className={`${styles.countryModal} ${flagModalStyles.countryModal}`} role="dialog" aria-modal="true" aria-labelledby="country-modal-title">
            {flagSource(pendingCountry.code2) ? <WavingFlag src={flagSource(pendingCountry.code2)!} /> : <div className={flagModalStyles.flagFallback}><Globe2 size={78} /></div>}
            <div className={flagModalStyles.flagShade} aria-hidden="true" />
            <div className={flagModalStyles.modalContent}>
              <div className={flagModalStyles.statusIcon} aria-hidden="true">{mode === "visited" ? <Check size={28} strokeWidth={3.5} /> : <Star size={27} strokeWidth={3} />}</div>
              <h2 id="country-modal-title">{pendingIsActive ? mode === "visited" ? `Retirer ${countryWithArticle(pendingCountry)} des pays visités ?` : `Retirer ${countryWithArticle(pendingCountry)} de la liste À visiter ?` : mode === "visited" ? `Passer ${countryWithArticle(pendingCountry)} en pays visité ?` : `Ajouter ${countryWithArticle(pendingCountry)} à la liste À visiter ?`}</h2>
              <p>{pendingIsActive ? "Ce pays ne sera plus comptabilisé dans cette liste." : mode === "visited" ? "Son drapeau apparaîtra sur ta carte du monde." : "Tu le retrouveras parmi tes prochaines destinations."}</p>
              <div className={flagModalStyles.modalActions}>
                <button className={`${styles.cancelCountry} ${flagModalStyles.cancelCountry}`} onClick={() => setPendingCode(null)}>Annuler</button>
                <button className={`${styles.confirmCountry} ${flagModalStyles.confirmCountry}`} disabled={saving} onClick={() => updateCountry(pendingCountry.code, mode)}>{saving ? "Enregistrement…" : pendingIsActive ? "Retirer" : mode === "visited" ? "Oui, visité" : "Ajouter"}</button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
