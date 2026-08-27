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

type DateMode = "arrival" | "departure";
const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

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
          <h1>Trouvez le bon hôtel,<br /><span>au bon endroit.</span></h1>
          <form className="market-search hotel-search hotel-search-premium" onSubmit={submit}>
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
                  <footer>Destinations HiFlight dans le monde</footer>
                </div>
              )}
            </div>
            <HotelDatePicker checkin={draft.checkin} checkout={draft.checkout} onChange={(checkin, checkout) => { setDraft((current) => ({ ...current, checkin, checkout })); setError(""); }} />
            <label className="hotel-guests-field">Voyageurs<select value={draft.guests} onChange={(event) => setDraft((current) => ({ ...current, guests: event.target.value }))}><option value="1">1 voyageur</option><option value="2">2 voyageurs</option><option value="3">3 voyageurs</option><option value="4">4 voyageurs</option><option value="5">5 voyageurs</option><option value="6">6 voyageurs</option></select></label>
            <button className="hotel-search-submit" type="submit"><span>Voir les séjours</span><b>→</b></button>
          </form>
          <p className={`hero-disclaimer ${error ? "error" : ""}`} role={error ? "alert" : undefined}>{error || "La destination, les dates et les voyageurs actualisent immédiatement les offres disponibles."}</p>
        </div>
      </section>
      <div id="hotel-results"><HotelExplorer stay22Aid={stay22Aid} search={search} /></div>
    </>
  );
}

function HotelDatePicker({ checkin, checkout, onChange }: { checkin: string; checkout: string; onChange: (checkin: string, checkout: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<DateMode>("arrival");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function show(nextMode: DateMode) {
    setMode(nextMode);
    const value = nextMode === "arrival" ? checkin : checkout;
    if (value) setMonth(startOfMonth(new Date(value + "T12:00:00")));
    setOpen(true);
  }

  function choose(date: string) {
    if (mode === "arrival" || !checkin) {
      onChange(date, "");
      setMode("departure");
      return;
    }
    if (date <= checkin) {
      onChange(date, "");
      setMode("departure");
      return;
    }
    onChange(checkin, date);
    setOpen(false);
  }

  return (
    <div className="hotel-date-picker flight-style-range" ref={wrapRef}>
      <div className="hotel-date-triggers">
        <button type="button" className={open && mode === "arrival" ? "active" : ""} onClick={() => show("arrival")}><small>Arrivée</small><strong>{formatHotelDate(checkin, "Choisir")}</strong></button>
        <span aria-hidden="true">→</span>
        <button type="button" className={open && mode === "departure" ? "active" : ""} onClick={() => show("departure")}><small>Départ</small><strong>{formatHotelDate(checkout, "Choisir")}</strong></button>
      </div>
      {open && (
        <div className="fare-calendar hotel-flight-calendar" role="dialog" aria-label="Choisir les dates du séjour">
          <div className="calendar-top"><div><strong>{mode === "arrival" ? "Choisissez votre arrivée" : "Choisissez votre départ"}</strong><span>Le calendrier se ferme après la date de départ.</span></div><button type="button" aria-label="Fermer" onClick={() => setOpen(false)}>×</button></div>
          <div className="calendar-nav"><button type="button" aria-label="Mois précédent" disabled={monthKey(month) <= monthKey(new Date())} onClick={() => setMonth((current) => addMonths(current, -1))}>‹</button><button type="button" aria-label="Mois suivant" onClick={() => setMonth((current) => addMonths(current, 1))}>›</button></div>
          <div className="calendar-grid"><HotelMonth month={month} checkin={checkin} checkout={checkout} onChoose={choose} /><HotelMonth month={addMonths(month, 1)} checkin={checkin} checkout={checkout} onChoose={choose} /></div>
        </div>
      )}
    </div>
  );
}

function HotelMonth({ month, checkin, checkout, onChoose }: { month: Date; checkin: string; checkout: string; onChoose: (date: string) => void }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<number | null> = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="calendar-month">
      <h3>{new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month)}</h3>
      <div className="week-row">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="days-grid">
        {cells.map((day, index) => {
          if (!day) return <span className="empty-day" key={"empty-" + index} />;
          const date = localIso(new Date(month.getFullYear(), month.getMonth(), day));
          const selected = date === checkin || date === checkout;
          const between = Boolean(checkin && checkout && date > checkin && date < checkout);
          return <button key={date} type="button" disabled={date < todayIso()} className={(selected ? "selected " : "") + (between ? "between" : "")} onClick={() => onChoose(date)}><span>{day}</span><small>&nbsp;</small></button>;
        })}
      </div>
    </div>
  );
}

function todayIso() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function localIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addMonths(date: Date, amount: number) { return new Date(date.getFullYear(), date.getMonth() + amount, 1); }
function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function formatHotelDate(value: string, placeholder: string) {
  if (!value) return placeholder;
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
}
