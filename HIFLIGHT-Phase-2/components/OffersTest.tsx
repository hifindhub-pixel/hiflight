"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Plane } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export type Offer = { slug: string; month: string; price: number; direct: boolean; search: string };
export type OfferRoute = { slug: string; label: string; offers: Offer[]; updatedAt: string };

const frDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function OffersTest({ routes, searchUrl }: { routes: OfferRoute[]; searchUrl: string }) {
  const [slug, setSlug] = useState(routes[0]?.slug ?? "");
  const [directOnly, setDirectOnly] = useState(false);
  const route = routes.find((item) => item.slug === slug);
  const offers = useMemo(() => {
    const list = (route?.offers ?? []).filter((offer) => !directOnly || offer.direct);
    return [...list].sort((a, b) => a.price - b.price);
  }, [route, directOnly]);

  if (!route) return <main className="offers-page"><p>Aucune donnée de prix disponible pour le moment.</p></main>;

  const link = (offer: Offer) => {
    const target = new URL(searchUrl);
    target.pathname = "/"; target.search = "";
    target.searchParams.set("flightSearch", offer.search);
    if (offer.direct) target.searchParams.set("direct", "true");
    target.searchParams.set("utm_source", "hiflight"); target.searchParams.set("utm_medium", "offers_test"); target.searchParams.set("utm_campaign", "flight_search");
    return target.toString();
  };

  return (
    <main className="offers-page">
      <section className="offers-hero">
        <div className="offers-shell">
          <p className="offers-tag">Page de test</p>
          <h1>Offres de vols</h1>
          <p>Les prix aller-retour les plus bas relevés, mois par mois. Choisissez un trajet, mettez-le en favori, puis comparez les vendeurs.</p>
        </div>
      </section>
      <div className="offers-shell">
        <div className="offers-tabs" role="tablist" aria-label="Trajets">
          {routes.map((item) => (
            <button key={item.slug} type="button" role="tab" aria-selected={item.slug === slug} className={item.slug === slug ? "is-on" : undefined} onClick={() => setSlug(item.slug)}>{item.label}</button>
          ))}
        </div>
        <label className="offers-direct"><input type="checkbox" checked={directOnly} onChange={(event) => setDirectOnly(event.target.checked)} /> Vols directs uniquement</label>

        <ul className="offers-list">
          {offers.map((offer) => (
            <li key={`${offer.month}-${offer.direct}-${offer.price}`} className="offer-row">
              <div className="offer-info">
                <span className="offer-icon" aria-hidden="true"><Plane size={18} /></span>
                <div>
                  <strong>{route.label}</strong>
                  <span>Départ en {offer.month} · aller-retour</span>
                </div>
                <em className={offer.direct ? "is-direct" : undefined}>{offer.direct ? "Vol direct" : "Avec ou sans escale"}</em>
              </div>
              <div className="offer-buy">
                <p className="offer-price"><span>dès</span><strong>{offer.price} €</strong></p>
                <a className="offer-cta" href={link(offer)} target="_blank" rel="noopener nofollow">Voir les vendeurs <ArrowRight aria-hidden="true" size={16} /></a>
              </div>
              <FavoriteButton slug={route.slug} label={route.label} />
            </li>
          ))}
        </ul>
        {!offers.length ? <p className="offers-none">Aucune offre en vol direct relevée pour ce trajet.</p> : null}
        <p className="fav-note">Prix aller-retour les plus bas relevés (relevé du {frDate.format(new Date(`${route.updatedAt}T00:00:00Z`))}), indicatifs et sans garantie de disponibilité. Le bouton ouvre la recherche partenaire, où vous choisissez le vendeur ; le montant définitif est celui affiché avant le paiement.</p>
      </div>
    </main>
  );
}
