"use client";

import Link from "next/link";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useFavorites } from "./FavoritesProvider";
import FavoriteButton from "./FavoriteButton";
import { cityPhotos } from "@/lib/city-photos";
import type { RoutePriceEntry } from "@/app/api/route-prices/route";

type Snapshot = { updatedAt: string | null; routes: Record<string, RoutePriceEntry> };
type SortKey = "recent" | "price" | "name";

/** Teinte stable par destination, pour les villes sans photo. */
const hueOf = (code: string) => [...code].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 360, 7);
const euro = (value: number) => `${value} €`;
const frDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const suggestions: [string, string][] = [
  ["paris-marrakech", "Paris – Marrakech"],
  ["paris-barcelone", "Paris – Barcelone"],
  ["paris-lisbonne", "Paris – Lisbonne"],
  ["paris-rome", "Paris – Rome"],
];

export default function FavoritesExperience() {
  const { user, loading } = useAuth();
  const { slugs, ready } = useFavorites();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [failed, setFailed] = useState(false);
  const [sort, setSort] = useState<SortKey>("recent");

  useEffect(() => {
    fetch("/api/route-prices/").then(async (response) => {
      if (!response.ok) throw new Error("prix indisponibles");
      setSnapshot(await response.json() as Snapshot);
    }).catch(() => setFailed(true));
  }, []);

  const items = useMemo(() => {
    const known = slugs.flatMap((slug, index) => {
      const entry = snapshot?.routes[slug];
      return entry ? [{ slug, entry, index }] : [];
    });
    if (sort === "price") return [...known].sort((a, b) => (a.entry.price ?? Infinity) - (b.entry.price ?? Infinity) || a.index - b.index);
    if (sort === "name") return [...known].sort((a, b) => a.entry.destination.localeCompare(b.entry.destination, "fr"));
    return known;
  }, [slugs, snapshot, sort]);

  const cheapest = useMemo(() => {
    const priced = items.filter((item) => item.entry.price !== null);
    if (priced.length < 2) return null;
    return priced.reduce((best, item) => ((item.entry.price ?? Infinity) < (best.entry.price ?? Infinity) ? item : best)).slug;
  }, [items]);

  const waiting = !ready || loading || (slugs.length > 0 && !snapshot && !failed);

  return (
    <main className="fav-page">
      <section className="fav-hero">
        <div className="fav-shell fav-hero-inner">
          <div>
            <p className="breadcrumb"><Link href="/">Accueil</Link> / Favoris</p>
            <h1>Mes favoris</h1>
            <p>Les trajets qui vous font envie, avec leur prix du moment.</p>
          </div>
          {items.length > 0 ? <p className="fav-count"><strong>{items.length}</strong><span>trajet{items.length > 1 ? "s" : ""}</span></p> : null}
        </div>
      </section>

      <div className="fav-shell">
        {ready && !loading && !user ? (
          <aside className="fav-guest">
            <Heart aria-hidden="true" size={22} />
            <div><strong>Vos favoris sont gardés sur cet appareil.</strong><span>Connectez-vous pour les retrouver partout. Ceux déjà ajoutés seront conservés.</span></div>
            <Link href="/connexion">Se connecter</Link>
          </aside>
        ) : null}

        {waiting ? <div className="fav-loading" aria-busy="true"><span /><span /><span /></div> : null}

        {!waiting && slugs.length === 0 ? (
          <section className="fav-empty">
            <span className="fav-empty-icon"><Heart aria-hidden="true" size={30} strokeWidth={2} /></span>
            <h2>Votre liste est vide pour l’instant</h2>
            <p>Touchez le cœur d’un trajet pour le retrouver ici, avec son prix.</p>
            <ul>
              {suggestions.map(([slug, label]) => <li key={slug}><Link href={`/vols/${slug}`}>{label}</Link></li>)}
            </ul>
            <Link className="fav-all" href="/vols">Voir tous les itinéraires <ArrowRight aria-hidden="true" size={16} /></Link>
          </section>
        ) : null}

        {!waiting && slugs.length > 0 && failed ? (
          <p className="fav-error">Les prix ne sont pas disponibles pour le moment. Vos favoris sont bien enregistrés : réessayez dans un instant.</p>
        ) : null}

        {!waiting && items.length > 0 ? (
          <>
            <div className="fav-toolbar" role="group" aria-label="Trier les favoris">
              {([["recent", "Récents"], ["price", "Prix croissant"], ["name", "Destination A–Z"]] as [SortKey, string][]).map(([key, label]) => (
                <button key={key} type="button" className={sort === key ? "is-on" : undefined} aria-pressed={sort === key} onClick={() => setSort(key)}>{label}</button>
              ))}
            </div>
            <ul className="fav-grid">
              {items.map(({ slug, entry }) => {
                const photo = cityPhotos[entry.destinationCode];
                const pair = `${entry.origin} – ${entry.destination}`;
                return (
                  <li key={slug} className="fav-card">
                    <Link href={`/vols/${slug}`} className="fav-card-link" aria-label={`Comparer les vols ${pair}`}>
                      <div className={`fav-photo${photo ? "" : " is-fallback"}`} style={photo ? undefined : { "--fav-hue": hueOf(entry.destinationCode) } as CSSProperties}>
                        {photo ? <img src={photo} alt={`Vue de ${entry.destination}`} loading="lazy" width="720" height="480" /> : <b aria-hidden="true">{entry.destinationCode}</b>}
                        <span className="fav-shade" aria-hidden="true" />
                        {cheapest === slug ? <em className="fav-badge">Le moins cher</em> : null}
                        <div className="fav-photo-text"><small>Depuis {entry.origin}</small><h3>{entry.destination}</h3></div>
                      </div>
                      <div className="fav-body">
                        {entry.price !== null ? (
                          <p className="fav-price"><span>dès</span><strong>{euro(entry.price)}</strong><small>aller-retour{entry.month ? ` · ${entry.month}` : ""}</small></p>
                        ) : <p className="fav-price is-none">Prix indisponible pour le moment</p>}
                        <ul className="fav-chips">
                          <li>{entry.duration.replace(/^environ /, "")}</li>
                          <li className={entry.direct ? "is-direct" : undefined}>{entry.direct ? "Vol direct" : "Avec escale"}</li>
                          {entry.directPrice !== null && entry.directPrice !== entry.price ? <li>Direct dès {euro(entry.directPrice)}</li> : null}
                        </ul>
                        <span className="fav-cta">Comparer les prix <ArrowRight aria-hidden="true" size={16} /></span>
                      </div>
                    </Link>
                    <FavoriteButton slug={slug} label={pair} />
                  </li>
                );
              })}
            </ul>
            <p className="fav-note">
              Prix aller-retour les plus bas relevés récemment{snapshot?.updatedAt ? ` (relevé du ${frDate.format(new Date(`${snapshot.updatedAt}T00:00:00Z`))})` : ""}, mis à jour chaque jour. Ils servent de repère et peuvent ne plus être disponibles : le montant définitif est celui affiché par le partenaire avant le paiement.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
