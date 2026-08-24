"use client";

import { useMemo, useState } from "react";

type View = "split" | "list" | "map";

export type HotelSearch = {
  destination: string;
  checkin: string;
  checkout: string;
  guests: string;
  latitude?: number;
  longitude?: number;
};

export default function HotelExplorer({ stay22Aid, search }: { stay22Aid: string; search: HotelSearch }) {
  const [view, setView] = useState<View>("split");

  const stay22Url = useMemo(() => {
    if (!stay22Aid) return "";
    const params = new URLSearchParams({
      aid: stay22Aid,
      adults: search.guests,
      rooms: "1",
      campaign: "hiflight_hotels_results",
      currency: "EUR",
      supportedcurrencies: "EUR",
      supportedlang: "fr",
      unitsystem: "metric",
      maincolor: "ff6b6b",
      hotelscolor: "ff6b6b",
      hotelsfontcolor: "07152f",
      loadingbarcolor: "ff6b6b",
      priceper: "total",
      showhotels: "true",
      invmode: "accommodation",
      hidebrandlogo: "true",
      hidefooter: "true",
      listviewexpand: view === "split" ? "true" : "false",
      viewmode: view === "list" ? "listview" : view === "map" ? "map" : "all",
    });
    if (search.latitude !== undefined && search.longitude !== undefined) {
      params.set("lat", String(search.latitude));
      params.set("lng", String(search.longitude));
    } else {
      params.set("address", search.destination);
    }
    if (search.checkin) params.set("checkin", search.checkin);
    if (search.checkout) params.set("checkout", search.checkout);
    return `https://www.stay22.com/embed/gm?${params.toString()}`;
  }, [search, stay22Aid, view]);

  const hasDates = Boolean(search.checkin && search.checkout);

  return (
    <div className="results-shell hotel-live-shell">
      <div className="results-toolbar hotel-live-toolbar">
        <div>
          <strong>Hébergements disponibles à {search.destination}</strong>
          <span>{hasDates ? `Prix du ${formatDate(search.checkin)} au ${formatDate(search.checkout)} · ${search.guests} voyageur${search.guests === "1" ? "" : "s"}` : "Ajoutez vos dates pour afficher les prix et disponibilités en direct."}</span>
        </div>
        <div className="view-switch" aria-label="Mode d’affichage">
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>Liste</button>
          <button className={view === "split" ? "active" : ""} onClick={() => setView("split")}>Liste + carte</button>
          <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Carte</button>
        </div>
      </div>


      {stay22Url ? (
        <section className={`hotel-live-frame view-${view}`} aria-label="Résultats d’hôtels HiFlight">
          <iframe key={stay22Url} title={`Hôtels disponibles à ${search.destination}`} src={stay22Url} loading="lazy" allow="geolocation" />
        </section>
      ) : (
        <section className="hotel-live-missing">
          <strong>Offres momentanément indisponibles</strong>
          <p>Veuillez réessayer dans quelques instants.</p>
        </section>
      )}

    </div>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(year, month - 1, day));
}
