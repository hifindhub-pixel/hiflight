"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { airportCities, AirportCity, findAirportCity } from "@/lib/airports";
import { searchUrl } from "@/lib/content";
import { track } from "./Analytics";

type Props = { origin?: string; destination?: string; originCode?: string; destinationCode?: string; compact?: boolean };
type DateMode = "departure" | "return";
type FlightPlace = AirportCity & { id?: string; type?: "city" | "airport"; distanceKm?: number; referenceCity?: string };
type ApiPlace = { id: string; type?: "city" | "airport"; name: string; countryName: string; code: string; distanceKm?: number; referenceCity?: string };

const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function localIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function addMonths(date: Date, amount: number) { return new Date(date.getFullYear(), date.getMonth() + amount, 1); }
function formatTravelpayoutsDate(value: string) { const [, month = "", day = ""] = value.split("-"); return `${day}${month}`; }
function formatShortDate(value: string, placeholder: string) {
  if (!value) return placeholder;
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
}
function airportLabel(item: FlightPlace) { return `${item.city} (${item.code})`; }

function PassengerSelector({ adults, children, infants, onChange }: {
  adults: number; children: number; infants: number;
  onChange: (kind: "adults" | "children" | "infants", value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const total = adults + children + infants;

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const rows: Array<{ kind: "adults" | "children" | "infants"; title: string; detail: string; value: number; minimum: number; maximum: number }> = [
    { kind: "adults", title: "Adultes", detail: "12 ans et plus", value: adults, minimum: 1, maximum: 9 },
    { kind: "children", title: "Enfants", detail: "2 à 11 ans", value: children, minimum: 0, maximum: 8 },
    { kind: "infants", title: "Bébés", detail: "Moins de 2 ans", value: infants, minimum: 0, maximum: adults },
  ];

  return (
    <div className="passenger-selector" ref={wrapRef}>
      <button type="button" className={open ? "active" : ""} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span><strong>{total} voyageur{total > 1 ? "s" : ""}</strong><small>{children || infants ? `${adults} adulte${adults > 1 ? "s" : ""}, ${children} enfant${children > 1 ? "s" : ""}, ${infants} bébé${infants > 1 ? "s" : ""}` : `${adults} adulte${adults > 1 ? "s" : ""}`}</small></span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
      </button>
      {open && <div className="passenger-popover">
        <header><strong>Nombre de passagers</strong><span>9 voyageurs maximum</span></header>
        {rows.map((row) => <div className="passenger-row" key={row.kind}>
          <span><strong>{row.title}</strong><small>{row.detail}</small></span>
          <div><button type="button" aria-label={`Retirer un ${row.title.toLowerCase()}`} disabled={row.value <= row.minimum} onClick={() => onChange(row.kind, row.value - 1)}>−</button><b>{row.value}</b><button type="button" aria-label={`Ajouter un ${row.title.toLowerCase()}`} disabled={total >= 9 || row.value >= row.maximum} onClick={() => onChange(row.kind, row.value + 1)}>+</button></div>
        </div>)}
        <button className="passenger-done" type="button" onClick={() => setOpen(false)}>Terminé</button>
      </div>}
    </div>
  );
}

function fareLevel(price: number | undefined, monthlyPrices: number[]) {
  if (!price || !monthlyPrices.length) return "";
  const sorted = [...monthlyPrices].sort((left, right) => left - right);
  if (sorted[0] === sorted[sorted.length - 1]) return "fare-medium";
  const first = sorted.indexOf(price);
  const last = sorted.lastIndexOf(price);
  const percentile = ((first + last) / 2) / (sorted.length - 1);
  if (percentile <= 0.33) return "fare-low";
  if (percentile >= 0.67) return "fare-high";
  return "fare-medium";
}

function CityField({ label, value, selectedCode, onChange, onSelect }: {
  label: string; value: string; selectedCode: string; onChange: (value: string) => void; onSelect: (item: FlightPlace) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [matches, setMatches] = useState<FlightPlace[]>(airportCities.slice(0, 8));
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const query = value.replace(/\([^)]*\)/g, "").trim();
    if (query.length < 2) { setMatches(airportCities.slice(0, 8)); setLoading(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cities?mode=flight&q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("flight-places-unavailable");
        const payload = (await response.json()) as { cities: ApiPlace[] };
        const places = payload.cities.filter((place) => place.code).map((place) => ({ id: place.id, type: place.type, city: place.name, country: place.countryName, code: place.code, airports: place.type === "airport" ? "Aéroport" : undefined, distanceKm: place.distanceKm, referenceCity: place.referenceCity }));
        setMatches(places);
        setActive(0);
      } catch (reason) {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        const normalized = query.toLocaleLowerCase("fr-FR");
        setMatches(airportCities.filter((item) => `${item.city} ${item.country} ${item.code}`.toLocaleLowerCase("fr-FR").includes(normalized)).slice(0, 8));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 220);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, value]);

  function choose(item: FlightPlace) { onSelect(item); setOpen(false); setActive(0); }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && event.key === "ArrowDown") setOpen(true);
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((current) => Math.min(current + 1, matches.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
    if (event.key === "Enter" && open && matches[active]) { event.preventDefault(); choose(matches[active]); }
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div className="city-field" ref={wrapRef}>
      <div className="city-input-wrap">
        <input aria-label={label} value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); setActive(0); }} onKeyDown={onKeyDown} placeholder={label === "Départ" ? "Ville ou aéroport de départ" : "Ville ou aéroport d’arrivée"} role="combobox" aria-expanded={open} aria-autocomplete="list" autoComplete="off" />
        {selectedCode && <b className="iata-chip">{selectedCode}</b>}
      </div>
      {open && (
        <div className="city-suggestions" role="listbox">
          {!value && <p>Destinations populaires</p>}
          {loading && <span className="no-suggestion">Recherche en cours…</span>}
          {!loading && matches.length ? matches.map((item, index) => (
            <button key={`${item.id || item.code}-${index}`} type="button" className={index === active ? "active" : ""} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item)}>
              <span className="suggestion-copy"><small>{item.type === "airport" ? "Aéroport" : "Ville"}</small><strong>{item.city}</strong><em>{item.type === "airport" && item.distanceKm !== undefined && item.referenceCity ? `${item.distanceKm} km de ${item.referenceCity}` : item.country}</em></span><b>{item.code}</b>
            </button>
          )) : !loading && <span className="no-suggestion">Aucune ville trouvée. Essayez un code IATA.</span>}
        </div>
      )}
    </div>
  );
}

function MonthView({ month, prices, mode, departure, returnDate, onChoose }: {
  month: Date; prices: Record<string, number>; mode: DateMode; departure: string; returnDate: string; onChoose: (date: string) => void;
}) {
  const today = localIso(new Date());
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<number | null> = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  while (cells.length % 7) cells.push(null);
  const monthlyPrices = Object.entries(prices).filter(([date]) => date.startsWith(monthKey(month))).map(([, price]) => price);

  return (
    <div className="calendar-month">
      <h3>{monthNames[month.getMonth()]} {month.getFullYear()}</h3>
      <div className="week-row">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="days-grid">
        {cells.map((day, index) => {
          if (!day) return <span className="empty-day" key={`empty-${index}`} />;
          const date = localIso(new Date(month.getFullYear(), month.getMonth(), day));
          const disabled = date < today || (mode === "return" && Boolean(departure) && date < departure);
          const selected = date === departure || date === returnDate;
          const between = Boolean(departure && returnDate && date > departure && date < returnDate);
          const price = prices[date];
          return <button key={date} type="button" disabled={disabled} className={`${selected ? "selected" : ""} ${between ? "between" : ""} ${fareLevel(price, monthlyPrices)}`} onClick={() => onChoose(date)}><span>{day}</span>{price ? <small>{Math.round(price)} €</small> : <small>&nbsp;</small>}</button>;
        })}
      </div>
    </div>
  );
}

export default function SearchForm({ origin = "", destination = "", originCode = "", destinationCode = "", compact = false }: Props) {
  const [from, setFrom] = useState(originCode ? `${origin} (${originCode})` : origin);
  const [to, setTo] = useState(destinationCode ? `${destination} (${destinationCode})` : destination);
  const [fromCode, setFromCode] = useState(originCode);
  const [toCode, setToCode] = useState(destinationCode);
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [dateMode, setDateMode] = useState<DateMode>("departure");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [priceStatus, setPriceStatus] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("economy");
  const [direct, setDirect] = useState(false);
  const [error, setError] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarOpen) return;
    const close = (event: MouseEvent) => { if (!calendarRef.current?.contains(event.target as Node)) setCalendarOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [calendarOpen]);

  useEffect(() => {
    if (!calendarOpen || !fromCode || !toCode) { setPriceStatus("idle"); return; }
    const controller = new AbortController();
    setPriceStatus("loading");
    Promise.all([calendarMonth, addMonths(calendarMonth, 1)].map(async (month) => {
      const query = new URLSearchParams({ origin: fromCode, destination: toCode, month: monthKey(month), oneWay: String(tripType === "oneway") });
      const response = await fetch(`/api/flight-prices?${query}`, { signal: controller.signal });
      if (!response.ok) throw new Error("prices-unavailable");
      return response.json() as Promise<{ prices: Record<string, number> }>;
    })).then((payloads) => { setPrices(Object.assign({}, ...payloads.map((payload) => payload.prices))); setPriceStatus("ready"); }).catch((reason) => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setPrices({}); setPriceStatus("unavailable");
    });
    return () => controller.abort();
  }, [calendarOpen, calendarMonth, fromCode, toCode, tripType]);

  function updateCity(kind: "from" | "to", value: string) {
    const match = findAirportCity(value);
    const code = match?.code || (/^[a-z]{3}$/i.test(value.trim()) ? value.trim().toUpperCase() : "");
    if (kind === "from") { setFrom(value); setFromCode(code); } else { setTo(value); setToCode(code); }
    setError("");
  }
  function selectCity(kind: "from" | "to", item: FlightPlace) {
    if (kind === "from") { setFrom(airportLabel(item)); setFromCode(item.code); } else { setTo(airportLabel(item)); setToCode(item.code); }
    setError("");
  }
  function swapRoute() { setFrom(to); setFromCode(toCode); setTo(from); setToCode(fromCode); setPrices({}); setError(""); }
  function openCalendar(mode: DateMode) {
    setDateMode(mode);
    const value = mode === "departure" ? departure : returnDate;
    if (value) { const date = new Date(`${value}T12:00:00`); setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1)); }
    setCalendarOpen(true);
  }
  function chooseDate(date: string) {
    if (dateMode === "departure") {
      setDeparture(date); if (returnDate && returnDate < date) setReturnDate("");
      if (tripType === "oneway") setCalendarOpen(false); else setDateMode("return");
    } else { setReturnDate(date); setCalendarOpen(false); }
    setError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fromCode || !toCode) { setError("Sélectionnez une ville dans la liste pour le départ et la destination."); return; }
    if (fromCode === toCode) { setError("Le départ et la destination doivent être différents."); return; }
    if (!departure) { setError("Sélectionnez une date de départ."); return; }
    if (tripType === "roundtrip" && !returnDate) { setError("Sélectionnez une date de retour, ou choisissez Aller simple."); return; }
    const route = tripType === "roundtrip" ? `${fromCode}${formatTravelpayoutsDate(departure)}${toCode}${formatTravelpayoutsDate(returnDate)}1` : `${fromCode}${formatTravelpayoutsDate(departure)}${toCode}00`;
    track("search_started", { origin: fromCode, destination: toCode, source: window.location.pathname });
    const target = new URL(searchUrl); target.pathname = "/"; target.search = "";
    target.searchParams.set("flightSearch", route);
    target.searchParams.set("adults", String(adults));
    if (children) target.searchParams.set("children", String(children));
    if (infants) target.searchParams.set("infants", String(infants));
    target.searchParams.set("trip_class", travelClass);
    if (direct) target.searchParams.set("direct", "true");
    target.searchParams.set("utm_source", "hiflight"); target.searchParams.set("utm_medium", "hub"); target.searchParams.set("utm_campaign", "flight_search");
    const hotelTarget = new URL("/hotels", window.location.origin);
    hotelTarget.searchParams.set("destination", to.replace(/\s*\([^)]*\)\s*$/, "").trim());
    hotelTarget.searchParams.set("checkin", departure);
    if (returnDate) hotelTarget.searchParams.set("checkout", returnDate);
    hotelTarget.searchParams.set("guests", String(adults + children));
    hotelTarget.hash = "hotel-results";

    const flightTab = window.open(target.toString(), "_blank");
    if (!flightTab) {
      setError("Autorisez l’ouverture des nouveaux onglets pour afficher simultanément les vols et les hébergements.");
      return;
    }
    flightTab.opener = null;
    window.location.assign(hotelTarget.toString());
  }

  return (
    <form id="recherche" className={`search-form flight-search-v2 ${compact ? "compact" : ""}`} onSubmit={submit}>
      <div className="flight-search-head">
        <div className="search-options">
          <select aria-label="Type de voyage" value={tripType} onChange={(event) => { const value = event.target.value as "roundtrip" | "oneway"; setTripType(value); if (value === "oneway") setReturnDate(""); }}><option value="roundtrip">Aller-retour</option><option value="oneway">Aller simple</option></select>
          <PassengerSelector adults={adults} children={children} infants={infants} onChange={(kind, value) => { if (kind === "adults") { setAdults(value); setInfants((current) => Math.min(current, value)); } else if (kind === "children") setChildren(value); else setInfants(value); }} />
          <select aria-label="Classe de voyage" value={travelClass} onChange={(event) => setTravelClass(event.target.value)}><option value="economy">Économique</option><option value="business">Affaires</option><option value="first">Première</option></select>
        </div>
      </div>
      <div className="search-fields">
        <div className="route-fields">
          <CityField label="Départ" value={from} selectedCode={fromCode} onChange={(value) => updateCity("from", value)} onSelect={(item) => selectCity("from", item)} />
          <button className="swap" type="button" aria-label="Inverser le trajet" onClick={swapRoute}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h11l-3-3M17 17H6l3 3" /></svg></button>
          <CityField label="Destination" value={to} selectedCode={toCode} onChange={(value) => updateCity("to", value)} onSelect={(item) => selectCity("to", item)} />
        </div>
        <div className="date-field-wrap" ref={calendarRef}>
          <div className="date-buttons">
            <button type="button" className={calendarOpen && dateMode === "departure" ? "active" : ""} onClick={() => openCalendar("departure")}><small>Aller</small><strong>{formatShortDate(departure, "Choisir")}</strong></button>
            <button type="button" disabled={tripType === "oneway"} className={`${calendarOpen && dateMode === "return" ? "active" : ""} ${tripType === "oneway" ? "oneway-disabled" : ""}`} onClick={() => openCalendar("return")}><small>Retour</small><strong>{tripType === "oneway" ? "Non requis" : formatShortDate(returnDate, "Choisir")}</strong>{tripType === "oneway" && <span>Aller simple</span>}</button>
          </div>
          {calendarOpen && (
            <div className="fare-calendar" role="dialog" aria-label="Choisir les dates">
              <div className="calendar-top"><div><strong>{dateMode === "departure" ? "Choisissez votre aller" : "Choisissez votre retour"}</strong><span>Les prix affichés sont indicatifs et peuvent évoluer.</span></div><button type="button" aria-label="Fermer" onClick={() => setCalendarOpen(false)}>×</button></div>
              <div className="calendar-nav"><button type="button" aria-label="Mois précédent" onClick={() => setCalendarMonth((month) => addMonths(month, -1))} disabled={monthKey(calendarMonth) <= monthKey(new Date())}>‹</button><button type="button" aria-label="Mois suivant" onClick={() => setCalendarMonth((month) => addMonths(month, 1))}>›</button></div>
              <div className="calendar-grid"><MonthView month={calendarMonth} prices={prices} mode={dateMode} departure={departure} returnDate={returnDate} onChoose={chooseDate} /><MonthView month={addMonths(calendarMonth, 1)} prices={prices} mode={dateMode} departure={departure} returnDate={returnDate} onChoose={chooseDate} /></div>
              <div className="calendar-status">{!fromCode || !toCode ? "Sélectionnez d’abord le départ et la destination pour voir les prix." : priceStatus === "loading" ? "Chargement des meilleurs prix…" : priceStatus === "unavailable" ? "Dates disponibles — activez l’API Travelpayouts pour afficher les prix." : priceStatus === "ready" && !Object.keys(prices).length ? "Aucun tarif en cache pour ces dates." : priceStatus === "ready" ? "Prix indicatifs issus du cache Travelpayouts." : ""}</div>
            </div>
          )}
        </div>
        <button className="search-button" type="submit"><span>Comparer les vols</span><b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg></b></button>
      </div>
      <label className="direct-toggle"><input type="checkbox" checked={direct} onChange={(event) => setDirect(event.target.checked)} /><span /> Vols directs uniquement</label>
      <p className={`form-note ${error ? "error" : ""}`} role={error ? "alert" : undefined}>{error || "HiFlight recherche et compare les offres disponibles selon vos critères."}</p>
    </form>
  );
}
