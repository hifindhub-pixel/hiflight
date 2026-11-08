"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Plane } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useFavorites } from "./FavoritesProvider";
import FavoriteButton from "./FavoriteButton";
import { cityPhotos } from "@/lib/city-photos";
import type { RoutePriceEntry } from "@/app/api/route-prices/route";

type Snapshot = { updatedAt: string | null; routes: Record<string, RoutePriceEntry> };
type SortKey = "recent" | "price" | "name";

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
        <div className="fav-shell">
          <p className="breadcrumb"><Link href="/">Accueil</Link> / Favoris</p>
          <h1>Mes favoris</h1>
          <p>Gardez les trajets qui vous intéressent et retrouvez leur prix en un coup d’œil. Le tarif final est confirmé chez le partenaire au moment de réserver.</p>
        </div>
      </section>

      <div className="fav-shell">
        {ready && !loading && !user ? (
          <aside className="fav-guest">
            <div><strong>Vos favoris sont gardés sur cet appareil.</strong><span>Connectez-vous pour les retrouver sur tous vos appareils. Ceux que vous avez déjà ajoutés seront conservés.</span></div>
            <Link href="/connexion">Se connecter</Link>
          </aside>
        ) : null}

        {waiting ? <div className="fav-loading" aria-busy="true"><span /><span /><span /></div> : null}

        {!waiting && slugs.length === 0 ? (
          <section className="fav-empty">
            <Heart aria-hidden="true" size={34} strokeWidth={1.8} />
            <h2>Aucun favori pour le moment</h2>
            <p>Touchez le cœur d’un trajet pour l’enregistrer ici. Quelques idées pour commencer :</p>
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
            <div className="fav-toolbar">
              <p><strong>{items.length}</strong> trajet{items.length > 1 ? "s" : ""} enregistré{items.length > 1 ? "s" : ""}</p>
              <label>Trier par
                <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                  <option value="recent">Ajoutés récemment</option>
                  <option value="price">Prix croissant</option>
                  <option value="name">Destination (A–Z)</option>
                </select>
              </label>
            </div>
            <ul className="fav-grid">
              {items.map(({ slug, entry }) => {
                const photo = cityPhotos[entry.destinationCode];
                const pair = `${entry.origin} – ${entry.destination}`;
                return (
                  <li key={slug} className="fav-card">
                    <Link href={`/vols/${slug}`} className="fav-card-link" aria-label={`Comparer les vols ${pair}`}>
                      <div className={`fav-photo${photo ? "" : " is-fallback"}`}>
                        {photo ? <img src={photo} alt={`Vue de ${entry.destination}`} loading="lazy" width="720" height="480" /> : <span aria-hidden="true"><Plane size={22} />{entry.destinationCode}</span>}
                        {cheapest === slug ? <em className="fav-badge">Le moins cher de vos favoris</em> : null}
                      </div>
                      <div className="fav-body">
                        <h3>{entry.origin} <ArrowRight aria-hidden="true" size={16} /> {entry.destination}</h3>
                        <p className="fav-meta">{entry.duration} · {entry.direct ? "vol direct" : "avec escale"}</p>
                        {entry.price !== null ? (
                          <p className="fav-price">dès <strong>{euro(entry.price)}</strong> <span>aller-retour{entry.month ? ` · ${entry.month}` : ""}</span></p>
                        ) : <p className="fav-price is-none">Prix indisponible pour le moment</p>}
                        {entry.directPrice !== null && entry.directPrice !== entry.price ? <p className="fav-direct">Vol direct dès {euro(entry.directPrice)}</p> : null}
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
