"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import HotelExplorer, { HotelSearch } from "./HotelExplorer";
import ServiceTabs from "./ServiceTabs";

type CitySuggestion = {
  id: string;
  name: string;
  countryName: string;
  countryCode: string;
  stateCode: string;
  code: string;
  latitude?: number;
  longitude?: number;
};

const initialSearch: HotelSearch = { destination: "Paris, France", checkin: "", checkout: "", guests: "2" };

export default function HotelSearchExperience({ stay22Aid }: { stay22Aid: string }) {
  const [draft, setDraft] = useState<HotelSearch>(initialSearch);
  const [search, setSearch] = useState<HotelSearch>(initialSearch);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [error, setError] = useState("");
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = {
      destination: params.get("destination") || initialSearch.destination,
      checkin: params.get("checkin") || "",
      checkout: params.get("checkout") || "",
      guests: params.get("guests") || "2",
    };
    setDraft(fromUrl);
    setSearch(fromUrl);
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!cityRef.current?.contains(event.target as Node)) setSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const query = draft.destination.trim();
    if (!suggestionsOpen || query.length < 2 || draft.latitude !== undefined) {
      setSuggestionsLoading(false);
      if (query.length < 2) setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("cities-unavailable");
        const payload = (await response.json()) as { cities: CitySuggestion[] };
        setSuggestions(payload.cities);
        setActiveSuggestion(0);
      } catch (reason) {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setSuggestionsLoading(false);
      }
    }, 220);

    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [draft.destination, draft.latitude, suggestionsOpen]);

  function chooseCity(city: CitySuggestion) {
    setDraft((current) => ({
      ...current,
      destination: `${city.name}, ${city.countryName}`,
      latitude: city.latitude,
      longitude: city.longitude,
    }));
    setSuggestionsOpen(false);
    setSuggestions([]);
    setActiveSuggestion(0);
    setError("");
  }

  function onCityKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) => Math.max(current - 1, 0));
    }
    if (event.key === "Enter" && suggestionsOpen && suggestions[activeSuggestion]) {
      event.preventDefault();
      chooseCity(suggestions[activeSuggestion]);
    }
    if (event.key === "Escape") setSuggestionsOpen(false);
  }

  function updateCheckin(checkin: string) {
    setDraft((current) => ({
      ...current,
      checkin,
      checkout: current.checkout && current.checkout <= checkin ? nextDay(checkin) : current.checkout,
    }));
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.destination.trim().length < 2) { setError("Sélectionnez une destination."); return; }
    if (!draft.checkin || !draft.checkout) { setError("Sélectionnez les dates d’arrivée et de départ."); return; }
    if (draft.checkout <= draft.checkin) { setError("La date de départ doit être postérieure à l’arrivée."); return; }

    const nextSearch = { ...draft, destination: draft.destination.trim() };
    setSearch(nextSearch);
    setError("");
    const params = new URLSearchParams({
      destination: nextSearch.destination,
      checkin: nextSearch.checkin,
      checkout: nextSearch.checkout,
      guests: nextSearch.guests,
    });
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    window.setTimeout(() => document.getElementById("hotel-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <>
      <section className="market-hero hotels">
        <div>
          <ServiceTabs active="hotels" />
          <p className="eyebrow">Hôtels</p>
          <h1>Trouvez le bon hôtel,<br /><span>au bon endroit.</span></h1>
          <form className="market-search hotel-search" onSubmit={submit}>
            <div className="hotel-city-field" ref={cityRef}>
              <label htmlFor="hotel-destination">Destination</label>
              <div className="hotel-city-input">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12A7 7 0 1 0 5 9c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
                <input id="hotel-destination" value={draft.destination} onFocus={() => setSuggestionsOpen(true)} onChange={(event) => { setDraft((current) => ({ ...current, destination: event.target.value, latitude: undefined, longitude: undefined })); setSuggestionsOpen(true); setActiveSuggestion(0); setError(""); }} onKeyDown={onCityKeyDown} placeholder="Ville ou région" role="combobox" aria-expanded={suggestionsOpen} aria-controls="hotel-city-suggestions" aria-autocomplete="list" autoComplete="off" required />
              </div>
              {suggestionsOpen && draft.destination.trim().length >= 2 && (
                <div className="hotel-city-suggestions" id="hotel-city-suggestions" role="listbox">
                  <p>Villes dans le monde</p>
                  {suggestionsLoading && <span className="hotel-city-status">Recherche des destinations…</span>}
                  {!suggestionsLoading && suggestions.map((city, index) => (
                    <button key={city.id} type="button" role="option" aria-selected={index === activeSuggestion} className={index === activeSuggestion ? "active" : ""} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseCity(city)}>
                      <span className="hotel-suggestion-pin" aria-hidden="true">⌖</span>
                      <span><strong>{city.name}</strong><small>{city.stateCode ? `${city.stateCode} · ` : ""}{city.countryName}</small></span>
                      {city.code && <b>{city.code}</b>}
                    </button>
                  ))}
                  {!suggestionsLoading && !suggestions.length && <span className="hotel-city-status">Aucune ville trouvée. Essayez avec le pays.</span>}
                  <footer>Données de destinations Travelpayouts</footer>
                </div>
              )}
            </div>
            <label>Arrivée<input type="date" value={draft.checkin} min={todayIso()} onChange={(event) => updateCheckin(event.target.value)} required /></label>
            <label>Départ<input type="date" value={draft.checkout} min={draft.checkin ? nextDay(draft.checkin) : todayIso()} onChange={(event) => { setDraft((current) => ({ ...current, checkout: event.target.value })); setError(""); }} required /></label>
            <label>Voyageurs<select value={draft.guests} onChange={(event) => setDraft((current) => ({ ...current, guests: event.target.value }))}><option value="1">1 voyageur</option><option value="2">2 voyageurs</option><option value="3">3 voyageurs</option><option value="4">4 voyageurs</option><option value="5">5 voyageurs</option><option value="6">6 voyageurs</option></select></label>
            <button type="submit">Comparer</button>
          </form>
          <p className={`hero-disclaimer ${error ? "error" : ""}`} role={error ? "alert" : undefined}>{error || "La destination, les dates et les voyageurs actualisent directement les offres Stay22 ci-dessous."}</p>
        </div>
      </section>
      <div id="hotel-results"><HotelExplorer stay22Aid={stay22Aid} search={search} /></div>
    </>
  );
}

function todayIso() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function nextDay(value: string) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}
