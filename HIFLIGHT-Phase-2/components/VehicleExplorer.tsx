"use client";

import { useEffect, useMemo, useState } from "react";
import { isPartnerConnected, partnerHref, vehicleResults } from "@/lib/travel-marketplace";
import { track } from "./Analytics";
import ProviderBadge from "./ProviderBadge";

export default function VehicleExplorer() {
  const [showMap, setShowMap] = useState(true);
  const [automatic, setAutomatic] = useState(false);
  const [selected, setSelected] = useState(vehicleResults[0].id);
  const [search, setSearch] = useState({ pickup: "Paris", pickupDate: "", returnDate: "", driverAge: "30" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch({ pickup: params.get("pickup") || "Paris", pickupDate: params.get("pickupDate") || "", returnDate: params.get("returnDate") || "", driverAge: params.get("driverAge") || "30" });
  }, []);

  const results = useMemo(() => automatic ? vehicleResults.filter((vehicle) => vehicle.transmission === "Automatique") : vehicleResults, [automatic]);
  const providers = Array.from(new Map(vehicleResults.flatMap((vehicle) => vehicle.offers).map((offer) => [offer.provider, offer])).values());
  const clickPartner = (provider: string, vehicleId: string) => track("partner_click", { provider, category: "car", result_id: vehicleId, pickup: search.pickup });

  return (
    <div className="results-shell">
      <div className="results-toolbar">
        <div><strong>{results.length} catégories disponibles à {search.pickup}</strong><span>Prix indicatifs par jour · conducteur {search.driverAge} ans</span></div>
        <label className="check-filter"><input type="checkbox" checked={automatic} onChange={(event) => setAutomatic(event.target.checked)} /> Automatique uniquement</label>
        <div className="view-switch"><button className={!showMap ? "active" : ""} onClick={() => setShowMap(false)}>Liste</button><button className={showMap ? "active" : ""} onClick={() => setShowMap(true)}>Liste + carte</button></div>
      </div>
      <div className="provider-strip" aria-label="Loueurs comparés">
        <span>Loueurs comparés</span>
        {providers.map((offer) => <div key={offer.provider}><ProviderBadge provider={offer.provider} /><b>{offer.provider}</b><small className={isPartnerConnected(offer.href) ? "connected" : "preview"}>{isPartnerConnected(offer.href) ? "Connecté" : "Aperçu"}</small></div>)}
      </div>
      <div className={`results-layout ${showMap ? "view-split" : "view-list"}`}>
        <div className="result-list">
          {results.map((vehicle) => {
            const best = [...vehicle.offers].sort((a, b) => a.price - b.price)[0];
            return (
              <article key={vehicle.id} className={`result-card vehicle-card ${selected === vehicle.id ? "selected" : ""}`} onMouseEnter={() => setSelected(vehicle.id)}>
                <div className="result-visual car-visual"><span>{vehicle.badge}</span><b>🚙</b></div>
                <div className="result-main"><p className="result-location">{vehicle.category}</p><h2>{vehicle.name}</h2><p>{vehicle.seats} places · {vehicle.bags} bagages · {vehicle.transmission}</p><div className="perk-line"><span>Retrait : {vehicle.pickup}</span><span>Annulation selon l’offre</span></div><details><summary>Comparer {vehicle.offers.length} loueurs</summary><div className="provider-list">{vehicle.offers.map((offer) => <a key={offer.provider} href={partnerHref(offer.href, search)} target={isPartnerConnected(offer.href) ? "_blank" : undefined} rel={isPartnerConnected(offer.href) ? "sponsored noreferrer" : undefined} onClick={() => clickPartner(offer.provider, vehicle.id)}><ProviderBadge provider={offer.provider} /><span>{offer.provider}<small>{offer.label || (isPartnerConnected(offer.href) ? "Offre partenaire" : "Lien à configurer")}</small></span><strong>{offer.price} €/j</strong></a>)}</div></details></div>
                <div className="best-price"><small>À partir de</small><strong>{best.price} €</strong><span>par jour</span><a href={partnerHref(best.href, search)} target={isPartnerConnected(best.href) ? "_blank" : undefined} rel={isPartnerConnected(best.href) ? "sponsored noreferrer" : undefined} onClick={() => clickPartner(best.provider, vehicle.id)}>Voir chez {best.provider}</a></div>
              </article>
            );
          })}
        </div>
        {showMap && <aside className="map-panel"><div className="prototype-map car-map"><div className="map-road road-one" /><div className="map-road road-two" />{results.map((vehicle) => <button key={vehicle.id} className={`price-marker ${selected === vehicle.id ? "active" : ""}`} style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }} onClick={() => setSelected(vehicle.id)}>{Math.min(...vehicle.offers.map((offer) => offer.price))} €/j</button>)}<div className="map-brand"><strong>Points de retrait</strong><span>Aéroports, gares et agences en ville.</span></div></div></aside>}
      </div>
    </div>
  );
}
