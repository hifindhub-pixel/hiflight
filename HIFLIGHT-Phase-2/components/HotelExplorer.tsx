"use client";

import { useEffect, useState } from "react";

export type HotelSearch = {
  destination: string;
  checkin: string;
  checkout: string;
  guests: string;
  latitude?: number;
  longitude?: number;
};

// AID verified in the Stay22 Hub. Public affiliate identifier, not a secret.
function stay22Search(search: HotelSearch) {
  const url = new URL("https://www.stay22.com/embed/gm");
  const params = new URLSearchParams({
    aid: "hiflight", campaign: "hiflight-hotels", address: search.destination,
    adults: search.guests, rooms: "1", currency: "EUR", ljs: "fr",
    listviewexpand: "true", viewmode: "all", showhotels: "true",
    maincolor: "FF6B6B", hotelscolor: "0F172A", zoom: "13", priceper: "nightly",
  });
  if (Number.isFinite(search.latitude) && Number.isFinite(search.longitude)) {
    params.set("lat", String(search.latitude));
    params.set("lng", String(search.longitude));
  }
  if (search.checkin && search.checkout) {
    params.set("checkin", search.checkin);
    params.set("checkout", search.checkout);
  }
  url.search = params.toString();
  return url.toString();
}

export default function HotelExplorer({ search }: { search: HotelSearch }) {
  const hasDates = Boolean(search.checkin && search.checkout);
  const mapUrl = stay22Search(search);
  const [reload, setReload] = useState(0);
  const [frameLoaded, setFrameLoaded] = useState(false);
  useEffect(() => { setFrameLoaded(false); }, [mapUrl, reload]);
  return (
    <section className="results-shell hotel-live-shell" id="hotel-offers" aria-label="Recherche d'hôtels">
      <div className="results-toolbar hotel-live-toolbar">
        <div>
          <strong>Rechercher un hébergement à {search.destination}</strong>
          <span>{hasDates
            ? `Séjour du ${formatDate(search.checkin)} au ${formatDate(search.checkout)} · ${search.guests} voyageur${search.guests === "1" ? "" : "s"}`
            : "Sélectionnez vos dates pour affiner la recherche."}</span>
        </div>
      </div>
      <div style={{ padding: "16px", display: "grid", gap: "12px" }}>
        <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
          Explorez la carte et les hébergements proposés par Stay22. Les prix affichés restent à confirmer lors de la réservation.
        </p>
        {!frameLoaded && <p role="status" style={{ margin: 0, fontSize: 14 }}>Chargement de la carte…</p>}
        <iframe
          key={`${mapUrl}-${reload}`}
          id="stay22-widget"
          title={`Carte des hôtels et disponibilités à ${search.destination}`}
          src={mapUrl}
          width="100%"
          height="680"
          style={{ display: "block", width: "100%", height: "clamp(520px, 75vh, 760px)", border: 0, borderRadius: 16, background: "#f8fafc" }}
          allowFullScreen
          onLoad={() => setFrameLoaded(true)}
        />
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "12px", fontSize: 14 }}>
          <span>La carte ne s’affiche pas ?</span>
          <button type="button" onClick={() => setReload((value) => value + 1)} style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 12px", background: "white", cursor: "pointer" }}>Recharger la carte</button>
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(year, month - 1, day));
}
