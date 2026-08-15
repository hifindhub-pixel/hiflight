"use client";

import { useMemo, useState } from "react";
import { vehicleResults } from "@/lib/travel-marketplace";

export default function VehicleExplorer() {
  const [showMap, setShowMap] = useState(true);
  const [automatic, setAutomatic] = useState(false);
  const [selected, setSelected] = useState(vehicleResults[0].id);

  const results = useMemo(() => automatic ? vehicleResults.filter((vehicle) => vehicle.transmission === "Automatique") : vehicleResults, [automatic]);

  return (
    <div className="results-shell">
      <div className="results-toolbar">
        <div><strong>{results.length} catégories disponibles</strong><span>Prix par jour · taxes principales incluses</span></div>
        <label className="check-filter"><input type="checkbox" checked={automatic} onChange={(event) => setAutomatic(event.target.checked)} /> Automatique uniquement</label>
        <div className="view-switch"><button className={!showMap ? "active" : ""} onClick={() => setShowMap(false)}>Liste</button><button className={showMap ? "active" : ""} onClick={() => setShowMap(true)}>Liste + carte</button></div>
      </div>
      <div className={`results-layout ${showMap ? "view-split" : "view-list"}`}>
        <div className="result-list">
          {results.map((vehicle) => {
            const best = [...vehicle.offers].sort((a, b) => a.price - b.price)[0];
            return (
              <article key={vehicle.id} className={`result-card vehicle-card ${selected === vehicle.id ? "selected" : ""}`} onMouseEnter={() => setSelected(vehicle.id)}>
                <div className="result-visual car-visual"><span>{vehicle.badge}</span><b>🚙</b></div>
                <div className="result-main"><p className="result-location">{vehicle.category}</p><h2>{vehicle.name}</h2><p>{vehicle.seats} places · {vehicle.bags} bagages · {vehicle.transmission}</p><div className="perk-line"><span>Retrait : {vehicle.pickup}</span><span>Annulation selon l’offre</span></div><details><summary>Comparer {vehicle.offers.length} loueurs</summary><div className="provider-list">{vehicle.offers.map((offer) => <a key={offer.provider} href={offer.href}><span>{offer.provider}<small>{offer.label}</small></span><strong>{offer.price} €/j</strong></a>)}</div></details></div>
                <div className="best-price"><small>À partir de</small><strong>{best.price} €</strong><span>par jour</span><a href={best.href}>Voir l’offre</a></div>
              </article>
            );
          })}
        </div>
        {showMap && <aside className="map-panel"><div className="prototype-map car-map"><div className="map-road road-one" /><div className="map-road road-two" />{results.map((vehicle) => <button key={vehicle.id} className={`price-marker ${selected === vehicle.id ? "active" : ""}`} style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }} onClick={() => setSelected(vehicle.id)}>{Math.min(...vehicle.offers.map((offer) => offer.price))} €/j</button>)}<div className="map-brand"><strong>Points de retrait</strong><span>Aéroports, gares et agences en ville.</span></div></div></aside>}
      </div>
    </div>
  );
}
