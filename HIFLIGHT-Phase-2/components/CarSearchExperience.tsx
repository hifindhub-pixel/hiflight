"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { track } from "./Analytics";
import ServiceTabs from "./ServiceTabs";

type CitySuggestion = {
  id: string;
  name: string;
  countryName: string;
  stateCode: string;
  code: string;
  type?: string;
};

type CarSearch = {
  pickup: string;
  dropoff: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  driverAge: string;
};

type LocationFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

const initialSearch: CarSearch = {
  pickup: "Paris, France",
  dropoff: "Paris, France",
  pickupDate: "",
  returnDate: "",
  pickupTime: "10:00",
  returnTime: "10:00",
  driverAge: "30",
};

const affiliateUrl = process.env.NEXT_PUBLIC_VIPCARS_AFFILIATE_URL || "https://www.awin1.com/cread.php?awinmid=58019&awinaffid=2855063";

export default function CarSearchExperience() {
  const [draft, setDraft] = useState<CarSearch>(initialSearch);
  const [search, setSearch] = useState<CarSearch>(initialSearch);
  const [differentDropoff, setDifferentDropoff] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pickup = params.get("pickup") || initialSearch.pickup;
    const fromUrl: CarSearch = {
      pickup,
      dropoff: params.get("dropoff") || pickup,
      pickupDate: params.get("pickupDate") || "",
      returnDate: params.get("returnDate") || "",
      pickupTime: params.get("pickupTime") || initialSearch.pickupTime,
      returnTime: params.get("returnTime") || initialSearch.returnTime,
      driverAge: params.get("driverAge") || initialSearch.driverAge,
    };
    setDraft(fromUrl);
    setSearch(fromUrl);
    setDifferentDropoff(fromUrl.dropoff !== fromUrl.pickup);
    setSearched(Boolean(fromUrl.pickupDate && fromUrl.returnDate));
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { ...draft, dropoff: differentDropoff ? draft.dropoff : draft.pickup };
    if (next.pickup.trim().length < 2 || next.dropoff.trim().length < 2) { setError("Sélectionnez les lieux de retrait et de retour."); return; }
    if (!next.pickupDate || !next.returnDate) { setError("Sélectionnez les dates de retrait et de retour."); return; }
    const pickupAt = `${next.pickupDate}T${next.pickupTime}`;
    const returnAt = `${next.returnDate}T${next.returnTime}`;
    if (returnAt <= pickupAt) { setError("Le retour doit être postérieur au retrait."); return; }

    setSearch(next);
    setDraft(next);
    setSearched(true);
    setError("");
    const params = new URLSearchParams(next);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    window.setTimeout(() => document.getElementById("car-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const clickref = `hf-car-${search.pickupDate.replaceAll("-", "")}-${search.returnDate.replaceAll("-", "")}`.slice(0, 50);
  const outbound = new URL(affiliateUrl);
  if (outbound.hostname.endsWith("awin1.com")) outbound.searchParams.set("clickref", clickref);

  return (
    <>
      <section className="market-hero cars">
        <div>
          <ServiceTabs active="cars" />
          <p className="eyebrow">Location de voiture</p>
          <h1>Prenez la route,<br /><span>en toute liberté.</span></h1>
          <form className="market-search car-search" onSubmit={submit}>
            <LocationField id="car-pickup" label="Lieu de retrait" value={draft.pickup} placeholder="Ville ou aéroport" onChange={(pickup) => { setDraft((current) => ({ ...current, pickup, ...(!differentDropoff ? { dropoff: pickup } : {}) })); setError(""); }} />
            {differentDropoff && <LocationField id="car-dropoff" label="Lieu de retour" value={draft.dropoff} placeholder="Ville ou aéroport" onChange={(dropoff) => { setDraft((current) => ({ ...current, dropoff })); setError(""); }} />}
            <CarDatePicker pickupDate={draft.pickupDate} returnDate={draft.returnDate} onChange={(pickupDate, returnDate) => { setDraft((current) => ({ ...current, pickupDate, returnDate })); setError(""); }} />
            <label className="car-time-field">Heures<div><select aria-label="Heure de retrait" value={draft.pickupTime} onChange={(event) => setDraft((current) => ({ ...current, pickupTime: event.target.value }))}>{timeOptions().map((time) => <option key={time}>{time}</option>)}</select><span>→</span><select aria-label="Heure de retour" value={draft.returnTime} onChange={(event) => setDraft((current) => ({ ...current, returnTime: event.target.value }))}>{timeOptions().map((time) => <option key={time}>{time}</option>)}</select></div></label>
            <label>Âge du conducteur<select value={draft.driverAge} onChange={(event) => setDraft((current) => ({ ...current, driverAge: event.target.value }))}>{Array.from({ length: 58 }, (_, index) => index + 18).map((age) => <option key={age} value={age}>{age} ans</option>)}</select></label>
            <button type="submit">Rechercher</button>
            <label className="car-different-location"><input type="checkbox" checked={differentDropoff} onChange={(event) => { setDifferentDropoff(event.target.checked); if (!event.target.checked) setDraft((current) => ({ ...current, dropoff: current.pickup })); }} /> Restituer le véhicule dans une autre ville</label>
          </form>
          <p className={`hero-disclaimer ${error ? "error" : ""}`} role={error ? "alert" : undefined}>{error || "Comparez les véhicules disponibles selon vos lieux, dates et horaires."}</p>
        </div>
      </section>

      <section id="car-results" className="car-results">
        <div className="car-results-card">
          <div className="car-results-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48"><path d="M9 29 13.4 17a4 4 0 0 1 3.8-2.7h13.6a4 4 0 0 1 3.8 2.7L39 29" /><path d="M7 28.5h34v8H7zM12 36.5v3M36 36.5v3M14 31.8h5M29 31.8h5" /></svg>
          </div>
          <div className="car-results-copy">
            <span>{searched ? "Votre recherche est prête" : "Préparez votre location"}</span>
            <h2>{searched ? `${search.pickup} → ${search.dropoff}` : "Trouvez la voiture qui vous convient"}</h2>
            {searched ? (
              <div className="car-search-summary">
                <p><small>Retrait</small><strong>{formatLongDate(search.pickupDate)} · {search.pickupTime}</strong></p>
                <i aria-hidden="true">→</i>
                <p><small>Retour</small><strong>{formatLongDate(search.returnDate)} · {search.returnTime}</strong></p>
                <p><small>Conducteur</small><strong>{search.driverAge} ans</strong></p>
              </div>
            ) : <p className="car-results-intro">Renseignez votre trajet pour accéder aux véhicules et conditions disponibles.</p>}
            <ul><li>Catégories adaptées à chaque voyage</li><li>Conditions affichées avant réservation</li><li>Retrait en ville ou à l’aéroport</li></ul>
          </div>
          <div className="car-results-action">
            <strong>Comparez avant de réserver</strong>
            <span>Prix, kilométrage, assurance et politique carburant.</span>
            <a href={searched ? outbound.toString() : "#car-pickup"} target={searched ? "_blank" : undefined} rel={searched ? "sponsored noreferrer" : undefined} onClick={() => searched && track("partner_click", { category: "car", pickup: search.pickup, pickup_date: search.pickupDate })}>{searched ? "Voir les voitures disponibles" : "Commencer la recherche"}</a>
            <small>Vous accéderez à l’inventaire de nos partenaires.</small>
          </div>
        </div>
      </section>
    </>
  );
}

function LocationField({ id, label, value, placeholder, onChange }: LocationFieldProps) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const query = value.trim();
    if (!open || query.length < 2) { setLoading(false); if (query.length < 2) setSuggestions([]); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cities?mode=car&q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const payload = (await response.json()) as { cities: CitySuggestion[] };
        setSuggestions(payload.cities || []);
        setActive(0);
      } catch { if (!controller.signal.aborted) setSuggestions([]); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 220);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, value]);

  function choose(city: CitySuggestion) { onChange(`${city.name}, ${city.countryName}`); setSuggestions([]); setOpen(false); }
  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive((current) => Math.min(current + 1, suggestions.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
    if (event.key === "Enter" && open && suggestions[active]) { event.preventDefault(); choose(suggestions[active]); }
    if (event.key === "Escape") setOpen(false);
  }

  return <div className="hotel-city-field car-location-field" ref={wrapRef}><label htmlFor={id}>{label}</label><div className="hotel-city-input"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12A7 7 0 1 0 5 9c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg><input id={id} value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); }} onKeyDown={keyDown} placeholder={placeholder} role="combobox" aria-expanded={open} autoComplete="off" required /></div>{open && value.trim().length >= 2 && <div className="hotel-city-suggestions" role="listbox"><p>Villes et aéroports dans le monde</p>{loading && <span className="hotel-city-status">Recherche des lieux…</span>}{!loading && suggestions.map((city, index) => <button key={city.id} type="button" role="option" aria-selected={index === active} className={index === active ? "active" : ""} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(city)}><span className="hotel-suggestion-pin" aria-hidden="true">{city.type === "airport" ? "✈" : "⌖"}</span><span><strong>{city.name}</strong><small>{city.type === "airport" ? "Aéroport · " : ""}{city.stateCode ? `${city.stateCode} · ` : ""}{city.countryName}</small></span>{city.code && <b>{city.code}</b>}</button>)}{!loading && !suggestions.length && <span className="hotel-city-status">Aucun lieu trouvé. Essayez avec le pays.</span>}<footer>Destinations HiFlight dans le monde</footer></div>}</div>;
}

function CarDatePicker({ pickupDate, returnDate, onChange }: { pickupDate: string; returnDate: string; onChange: (pickup: string, back: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"pickup" | "return">("pickup");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) return; const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, [open]);
  function choose(date: string) { if (mode === "pickup" || !pickupDate || (pickupDate && returnDate)) { onChange(date, returnDate && returnDate >= date ? returnDate : ""); setMode("return"); } else if (date < pickupDate) { onChange(date, ""); setMode("return"); } else { onChange(pickupDate, date); } }
  function show(next: "pickup" | "return") { setMode(next); const date = next === "pickup" ? pickupDate : returnDate; if (date) setMonth(startOfMonth(new Date(`${date}T12:00:00`))); setOpen(true); }
  return <div className="hotel-date-picker car-date-picker" ref={wrapRef}><div className="hotel-date-triggers"><button type="button" className={open && mode === "pickup" ? "active" : ""} onClick={() => show("pickup")}><small>Retrait</small><strong>{formatShortDate(pickupDate)}</strong></button><span>→</span><button type="button" className={open && mode === "return" ? "active" : ""} onClick={() => show("return")}><small>Retour</small><strong>{formatShortDate(returnDate)}</strong></button></div>{open && <div className="hotel-calendar" role="dialog" aria-label="Choisir les dates de location"><header><div><strong>Quand prenez-vous la route ?</strong><span>Sélectionnez le retrait puis le retour</span></div><button type="button" aria-label="Fermer" onClick={() => setOpen(false)}>×</button></header><div className="hotel-calendar-selection"><button type="button" className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}><small>Retrait</small><strong>{formatShortDate(pickupDate)}</strong></button><button type="button" className={mode === "return" ? "active" : ""} onClick={() => setMode("return")}><small>Retour</small><strong>{formatShortDate(returnDate)}</strong></button></div><div className="hotel-calendar-nav"><button type="button" aria-label="Mois précédent" disabled={monthKey(month) <= monthKey(new Date())} onClick={() => setMonth((current) => addMonths(current, -1))}>‹</button><button type="button" aria-label="Mois suivant" onClick={() => setMonth((current) => addMonths(current, 1))}>›</button></div><div className="hotel-calendar-months"><CarMonth month={month} pickup={pickupDate} back={returnDate} onChoose={choose} /><CarMonth month={addMonths(month, 1)} pickup={pickupDate} back={returnDate} onChoose={choose} /></div><footer><button type="button" className="hotel-calendar-clear" onClick={() => { onChange("", ""); setMode("pickup"); }}>Effacer</button><span>{pickupDate && returnDate ? `${dayDifference(pickupDate, returnDate)} jour${dayDifference(pickupDate, returnDate) > 1 ? "s" : ""}` : "Sélectionnez vos dates"}</span><button type="button" className="hotel-calendar-apply" disabled={!pickupDate || !returnDate} onClick={() => setOpen(false)}>Appliquer</button></footer></div>}</div>;
}

function CarMonth({ month, pickup, back, onChoose }: { month: Date; pickup: string; back: string; onChoose: (date: string) => void }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<number | null> = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  while (cells.length % 7) cells.push(null);
  return <section className="hotel-calendar-month"><h3>{new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month)}</h3><div className="hotel-calendar-week">{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => <span key={day}>{day}</span>)}</div><div className="hotel-calendar-days">{cells.map((day, index) => { if (!day) return <span key={`empty-${index}`} />; const date = localIso(new Date(month.getFullYear(), month.getMonth(), day)); const selected = date === pickup || date === back; const between = Boolean(pickup && back && date > pickup && date < back); return <button key={date} type="button" disabled={date < todayIso()} className={`${selected ? "selected" : ""} ${between ? "between" : ""}`} onClick={() => onChoose(date)}><span>{day}</span></button>; })}</div></section>;
}

function timeOptions() { return Array.from({ length: 48 }, (_, index) => `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`); }
function todayIso() { const date = new Date(); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
function localIso(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addMonths(date: Date, amount: number) { return new Date(date.getFullYear(), date.getMonth() + amount, 1); }
function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function dayDifference(from: string, to: string) { return Math.max(1, Math.round((new Date(`${to}T12:00:00`).getTime() - new Date(`${from}T12:00:00`).getTime()) / 86400000)); }
function formatShortDate(value: string) { return value ? new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`)) : "Choisir"; }
function formatLongDate(value: string) { return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long" }).format(new Date(`${value}T12:00:00`)); }
