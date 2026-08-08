"use client";

import { FormEvent, useState } from "react";
import { searchUrl } from "@/lib/content";
import { track } from "./Analytics";

type Props = { origin?: string; destination?: string; originCode?: string; destinationCode?: string; compact?: boolean };

const cityCodes: Record<string, string> = {
  paris: "PAR", lyon: "LYS", marseille: "MRS", nice: "NCE", toulouse: "TLS", bordeaux: "BOD", nantes: "NTE",
  barcelone: "BCN", madrid: "MAD", lisbonne: "LIS", londres: "LON", rome: "ROM", amsterdam: "AMS", bruxelles: "BRU",
  marrakech: "RAK", alger: "ALG", tunis: "TUN", dubai: "DXB", "dubaï": "DXB", "new york": "NYC", bangkok: "BKK", tokyo: "TYO"
};

function resolveCode(value: string, fixedCode: string) {
  if (fixedCode) return fixedCode;
  const normalized = value.trim().toLocaleLowerCase("fr-FR");
  if (/^[a-z]{3}$/i.test(normalized)) return normalized.toUpperCase();
  return cityCodes[normalized] || "";
}

export default function SearchForm({ origin = "", destination = "", originCode = "", destinationCode = "", compact = false }: Props) {
  const [from, setFrom] = useState(origin);
  const [to, setTo] = useState(destination);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fromCode = resolveCode(from, originCode);
    const toCode = resolveCode(to, destinationCode);
    track("search_started", { origin: fromCode || from, destination: toCode || to, source: location.pathname });
    const target = new URL(searchUrl);
    target.pathname = `${target.pathname.replace(/\/$/, "")}/flights/`;
    if (fromCode && toCode) {
      target.searchParams.set("origin_iata", fromCode);
      target.searchParams.set("destination_iata", toCode);
      target.searchParams.set("depart_date", departure);
      if (returnDate) target.searchParams.set("return_date", returnDate);
      target.searchParams.set("oneway", returnDate ? "0" : "1");
      target.searchParams.set("adults", adults);
    }
    target.searchParams.set("utm_source", "hiflight");
    target.searchParams.set("utm_medium", "seo_site");
    target.searchParams.set("utm_campaign", "flight_search");
    window.location.assign(target.toString());
  }

  return (
    <form id="recherche" className={`search-form ${compact ? "compact" : ""}`} onSubmit={submit}>
      <label>Départ<input required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Ville ou code IATA" list="hf-cities" autoComplete="off" /></label>
      <button className="swap" type="button" aria-label="Inverser le trajet" onClick={() => { setFrom(to); setTo(from); }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" /></svg></button>
      <label>Destination<input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="Ville ou code IATA" list="hf-cities" autoComplete="off" /></label>
      <datalist id="hf-cities">{Object.entries(cityCodes).map(([city, code]) => <option key={`${city}-${code}`} value={city.charAt(0).toUpperCase() + city.slice(1)}>{code}</option>)}</datalist>
      <label>Aller<input required type="date" name="departure" value={departure} onChange={(e) => setDeparture(e.target.value)} /></label>
      <label>Retour<input type="date" name="return" value={returnDate} min={departure} onChange={(e) => setReturnDate(e.target.value)} /></label>
      <label>Voyageurs<select value={adults} onChange={(e) => setAdults(e.target.value)}><option value="1">1 voyageur</option><option value="2">2 voyageurs</option><option value="3">3 voyageurs</option><option value="4">4 voyageurs</option></select></label>
      <button className="search-button" type="submit">Rechercher</button>
      <p className="form-note">Saisissez une ville proposée ou son code IATA. Vous poursuivrez sur le moteur HIFLIGHT propulsé par Travelpayouts.</p>
    </form>
  );
}
