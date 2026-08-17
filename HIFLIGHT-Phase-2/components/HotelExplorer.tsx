"use client";

import { useEffect, useMemo, useState } from "react";
import { hotelResults, isPartnerConnected, partnerHref, stay22Aid } from "@/lib/travel-marketplace";
import { track } from "./Analytics";
import ProviderBadge from "./ProviderBadge";

type View = "split" | "list" | "map";

export default function HotelExplorer() {
  const [view, setView] = useState<View>("split");
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState(hotelResults[0].id);
  const [search, setSearch] = useState({ destination: "Paris", checkin: "", checkout: "", guests: "2" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch({
      destination: params.get("destination") || "Paris",
      checkin: params.get("checkin") || "",
      checkout: params.get("checkout") || "",
      guests: params.get("guests") || "2",
    });
  }, []);

  const results = useMemo(() => {
    const copy = [...hotelResults];
    if (sort === "price") copy.sort((a, b) => a.offers[0].price - b.offers[0].price);
    if (sort === "rating") copy.sort((a, b) => b.rating - a.rating);
    return copy;
  }, [sort]);

  const stay22Url = stay22Aid
    ? `https://www.stay22.com/embed/gm?aid=${encodeURIComponent(stay22Aid)}&address=${encodeURIComponent(search.destination)}`
    : "";

  const providers = Array.from(new Map(hotelResults.flatMap((hotel) => hotel.offers).map((offer) => [offer.provider, offer])).values());
  const clickPartner = (provider: string, hotelId: string) => track("partner_click", { provider, category: "hotel", result_id: hotelId, destination: search.destination });

  return (
    <div className="results-shell">
      <div className="results-toolbar">
        <div><strong>{results.length} établissements comparés à {search.destination}</strong><span>Prix indicatifs · {search.guests} voyageur{search.guests === "1" ? "" : "s"}</span></div>
        <label> Trier par
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recommended">Recommandés</option>
            <option value="price">Prix croissant</option>
            <option value="rating">Mieux notés</option>
          </select>
        </label>
        <div className="view-switch" aria-label="Mode d’affichage">
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>Liste</button>
          <button className={view === "split" ? "active" : ""} onClick={() => setView("split")}>Liste + carte</button>
          <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Carte</button>
        </div>
      </div>

      <div className="provider-strip" aria-label="Vendeurs d’hôtels comparés">
        <span>Vendeurs comparés</span>
        {providers.map((offer) => <div key={offer.provider}><ProviderBadge provider={offer.provider} /><b>{offer.provider}</b><small className={isPartnerConnected(offer.href) ? "connected" : "preview"}>{isPartnerConnected(offer.href) ? "Connecté" : "Aperçu"}</small></div>)}
      </div>

      <div className={`results-layout view-${view}`}>
        {view !== "map" && (
          <div className="result-list">
            {results.map((hotel) => {
              const best = [...hotel.offers].sort((a, b) => a.price - b.price)[0];
              return (
                <article key={hotel.id} className={`result-card ${selected === hotel.id ? "selected" : ""}`} onMouseEnter={() => setSelected(hotel.id)}>
                  <div className="result-visual hotel-visual"><span>{hotel.category} étoiles</span></div>
                  <div className="result-main">
                    <p className="result-location">{hotel.area}</p>
                    <h2>{hotel.name}</h2>
                    <div className="rating-line"><b>{hotel.rating}</b><span>Excellent · {hotel.reviews.toLocaleString("fr-FR")} avis</span></div>
                    <p>{hotel.description}</p>
                    <div className="perk-line">{hotel.perks.map((perk) => <span key={perk}>{perk}</span>)}</div>
                    <details>
                      <summary>Comparer {hotel.offers.length} vendeurs</summary>
                      <div className="provider-list">
                        {hotel.offers.map((offer) => <a key={offer.provider} href={partnerHref(offer.href, search)} target={isPartnerConnected(offer.href) ? "_blank" : undefined} rel={isPartnerConnected(offer.href) ? "sponsored noreferrer" : undefined} onClick={() => clickPartner(offer.provider, hotel.id)}><ProviderBadge provider={offer.provider} /><span>{offer.provider}<small>{offer.label || (isPartnerConnected(offer.href) ? "Offre partenaire" : "Lien à configurer")}</small></span><strong>{offer.price} €</strong></a>)}
                      </div>
                    </details>
                  </div>
                  <div className="best-price"><small>Meilleur prix</small><strong>{best.price} €</strong><span>soit {Math.round(best.price / 2)} €/nuit</span><a href={partnerHref(best.href, search)} target={isPartnerConnected(best.href) ? "_blank" : undefined} rel={isPartnerConnected(best.href) ? "sponsored noreferrer" : undefined} onClick={() => clickPartner(best.provider, hotel.id)}>Voir chez {best.provider}</a></div>
                </article>
              );
            })}
          </div>
        )}

        {view !== "list" && (
          <aside className="map-panel" aria-label="Carte des hôtels">
            {stay22Url ? (
              <iframe title="Carte des hôtels" src={stay22Url} loading="lazy" />
            ) : (
              <div className="prototype-map">
                <div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" />
                {results.map((hotel) => {
                  const price = Math.min(...hotel.offers.map((offer) => offer.price));
                  return <button key={hotel.id} className={`price-marker ${selected === hotel.id ? "active" : ""}`} style={{ left: `${hotel.x}%`, top: `${hotel.y}%` }} onClick={() => setSelected(hotel.id)}>{price} €</button>;
                })}
                <div className="map-brand"><strong>HiFlight Map</strong><span>Ajoutez l’identifiant Stay22 pour afficher les offres en direct.</span></div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
