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
  pickupCode: string;
  pickupType: string;
  dropoffCode: string;
  dropoffType: string;
};

const initialSearch: CarSearch = {
  pickup: "Paris, France",
  dropoff: "Paris, France",
  pickupDate: "",
  returnDate: "",
  pickupTime: "10:00",
  returnTime: "10:00",
  driverAge: "30",
  pickupCode: "",
  pickupType: "",
  dropoffCode: "",
  dropoffType: "",
};

export default function CarSearchExperience() {
  const [draft, setDraft] = useState<CarSearch>(initialSearch);
  const [error, setError] = useState("");
  const [launching, setLaunching] = useState(false);
  const [differentDropoff, setDifferentDropoff] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDay = new Date(tomorrow);
    returnDay.setDate(returnDay.getDate() + 4);
    const pickup = params.get("pickup") || initialSearch.pickup;
    const dropoff = params.get("dropoff") || pickup;
    setDraft({
      pickup,
      dropoff,
      pickupDate: params.get("pickupDate") || localIso(tomorrow),
      returnDate: params.get("returnDate") || localIso(returnDay),
      pickupTime: params.get("pickupTime") || initialSearch.pickupTime,
      returnTime: params.get("returnTime") || initialSearch.returnTime,
      driverAge: params.get("driverAge") || initialSearch.driverAge,
      pickupCode: params.get("pickupCode") || "",
      pickupType: params.get("pickupType") || "",
      dropoffCode: params.get("dropoffCode") || "",
      dropoffType: params.get("dropoffType") || "",
    });
    setDifferentDropoff(dropoff !== pickup);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.pickup.trim().length < 2) {
      setError("Sélectionnez une ville ou un aéroport.");
      return;
    }
    if (differentDropoff && draft.dropoff.trim().length < 2) {
      setError("Sélectionnez le lieu de restitution.");
      return;
    }
    const driverAge = Number.parseInt(draft.driverAge, 10);
    if (!Number.isInteger(driverAge) || driverAge < 18 || driverAge > 99) {
      setError("Indiquez un âge de conducteur compris entre 18 et 99 ans.");
      return;
    }
    if (!draft.pickupDate || !draft.returnDate) {
      setError("Sélectionnez les dates de retrait et de retour.");
      return;
    }
    if (draft.returnDate + "T" + draft.returnTime <= draft.pickupDate + "T" + draft.pickupTime) {
      setError("Le retour doit être postérieur au retrait.");
      return;
    }

    const params = new URLSearchParams({
      offre: "global",
      pickup: draft.pickup,
      dropoff: differentDropoff ? draft.dropoff : draft.pickup,
      pickupDate: draft.pickupDate,
      returnDate: draft.returnDate,
      pickupTime: draft.pickupTime,
      returnTime: draft.returnTime,
      driverAge: draft.driverAge,
      pickupCode: draft.pickupCode,
      pickupType: draft.pickupType,
      dropoffCode: differentDropoff ? draft.dropoffCode : draft.pickupCode,
      dropoffType: differentDropoff ? draft.dropoffType : draft.pickupType,
    });
    const resultsUrl = "/go/voitures?" + params.toString();
    const partnerTab = window.open("/go/voitures?tracking=1", "_blank");

    if (!partnerTab) {
      setError("Autorisez l’ouverture des nouveaux onglets pour afficher les résultats Expedia.");
      return;
    }
    partnerTab.opener = null;

    setError("");
    setLaunching(true);
    track("partner_click", {
      category: "car",
      partner: "expedia",
      pickup: draft.pickup,
      pickup_date: draft.pickupDate,
      return_date: draft.returnDate,
    });

    window.setTimeout(() => {
      try {
        if (!partnerTab.closed) partnerTab.location.href = resultsUrl;
      } catch {
        partnerTab.location = resultsUrl;
      }
      setLaunching(false);
    }, 3200);
  }

  return (
    <>
      <section className="market-hero cars car-clean-hero">
        <div>
          <ServiceTabs active="cars" />
          <div className="car-clean-heading">
            <h1>Votre voiture idéale<br /><span>pour chaque voyage.</span></h1>
            <p>Choisissez vos lieux, vos dates et vos horaires. Les résultats réels s’ouvrent ensuite directement sur Expedia.</p>
          </div>

          <form id="recherche-voitures" className="search-form flight-search-v2 car-flight-search" onSubmit={submit}>
            <div className="flight-search-head">
              <div className="search-options">
                <CarSelect
                  label="Lieu de restitution"
                  value={differentDropoff ? "different" : "same"}
                  options={[
                    { value: "same", label: "Même lieu", detail: "Retour au point de départ" },
                    { value: "different", label: "Autre lieu", detail: "Restitution dans une autre ville" },
                  ]}
                  onChange={(value) => {
                    const different = value === "different";
                    setDifferentDropoff(different);
                    if (!different) setDraft((current) => ({ ...current, dropoff: current.pickup, dropoffCode: current.pickupCode, dropoffType: current.pickupType }));
                  }}
                />
                <CarTimeSelector pickupTime={draft.pickupTime} returnTime={draft.returnTime} onChange={(pickupTime, returnTime) => setDraft((current) => ({ ...current, pickupTime, returnTime }))} />
                <CarAgeInput
                  value={draft.driverAge}
                  onChange={(driverAge) => setDraft((current) => ({ ...current, driverAge }))}
                />
              </div>
            </div>

            <div className={differentDropoff ? "search-fields car-search-fields has-dropoff" : "search-fields car-search-fields"}>
              <div className={differentDropoff ? "route-fields car-route-fields has-dropoff" : "route-fields car-route-fields"}>
                <LocationField
                  id="car-pickup"
                  label="Prise en charge"
                  value={draft.pickup}
                  selectedCode={draft.pickupCode}
                  onChange={(pickup, place) => {
                    setDraft((current) => ({
                      ...current,
                      pickup,
                      pickupCode: place?.code || "",
                      pickupType: place?.type || "",
                      ...(!differentDropoff ? { dropoff: pickup, dropoffCode: place?.code || "", dropoffType: place?.type || "" } : {}),
                    }));
                    setError("");
                  }}
                />
                {differentDropoff && <LocationField
                  id="car-dropoff"
                  label="Restitution"
                  value={draft.dropoff}
                  selectedCode={draft.dropoffCode}
                  onChange={(dropoff, place) => {
                    setDraft((current) => ({ ...current, dropoff, dropoffCode: place?.code || "", dropoffType: place?.type || "" }));
                    setError("");
                  }}
                />}
              </div>
              <CarDatePicker
                pickupDate={draft.pickupDate}
                returnDate={draft.returnDate}
                onChange={(pickupDate, returnDate) => {
                  setDraft((current) => ({ ...current, pickupDate, returnDate }));
                  setError("");
                }}
              />
              <button className="search-button" type="submit" disabled={launching}>
                <span>{launching ? "Ouverture…" : "Rechercher"}</span>
                <b><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></b>
              </button>
            </div>

            <p className={error ? "form-note error" : "form-note"} role={error ? "alert" : undefined}>
              {error || (differentDropoff ? "Les deux lieux seront transmis à Expedia dans un nouvel onglet." : "La recherche Expedia s’ouvrira dans un nouvel onglet.")}
            </p>
          </form>
        </div>
      </section>

      <section className="car-partners-showcase">
        <header>
          <h2>À vous la route.</h2>
        </header>
        <div className="car-partners-grid">
          <a className="car-expedia-card" href="#recherche-voitures">
            <span>Location de voitures</span>
            <div><h3>Prenez la route<br />en toute sérénité.</h3><p>Choisissez votre voiture, vos dates et votre destination. HiFlight prépare votre départ en quelques instants.</p><strong>Trouver ma voiture</strong></div>
          </a>
          <a className="car-bike-card car-bike-card-new" href="/go/voitures?offre=bike" target="_blank" rel="sponsored noreferrer" onClick={() => track("partner_click", { category: "car", offer_type: "bike" })}>
            <span>Location de motos et scooters</span>
            <div><h3>Prenez la route autrement.</h3><p>Explorez les motos et scooters proposés par BikesBooking.</p><strong>Découvrir BikesBooking</strong></div>
          </a>
        </div>
      </section>
    </>
  );
}

type CarSelectOption = { value: string; label: string; detail: string };

function CarSelect({ label, value, options, onChange }: { label: string; value: string; options: CarSelectOption[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="search-select" ref={wrapRef}>
      <button type="button" className={open ? "active" : ""} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span><strong>{selected.label}</strong><small>{selected.detail}</small></span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
      </button>
      {open && <div className="search-select-popover" role="listbox" aria-label={label}>
        <header><strong>{label}</strong></header>
        <div className="search-select-list">{options.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={option.value === value ? "selected" : ""} onClick={() => { onChange(option.value); setOpen(false); }}>
          <span><strong>{option.label}</strong><small>{option.detail}</small></span><i aria-hidden="true" />
        </button>)}</div>
      </div>}
    </div>
  );
}


function CarAgeInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const age = Number.parseInt(value, 10);
  const valid = Number.isInteger(age) && age >= 18 && age <= 99;

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="passenger-selector car-age-selector" ref={wrapRef}>
      <button type="button" className={open ? "active" : ""} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span><strong>{value ? value + " ans" : "Votre âge"}</strong><small>Conducteur principal</small></span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
      </button>
      {open && <div className="passenger-popover car-age-popover">
        <header><strong>Âge du conducteur</strong><span>Au moment de la prise en charge</span></header>
        <label htmlFor="car-driver-age">
          <span>Votre âge</span>
          <div className="car-age-input"><input id="car-driver-age" type="number" inputMode="numeric" min="18" max="99" value={value} onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 2))} aria-describedby="car-age-help" autoFocus /><small>ans</small></div>
        </label>
        <p id="car-age-help">Saisissez un âge compris entre 18 et 99 ans.</p>
        <button className="passenger-done" type="button" disabled={!valid} onClick={() => setOpen(false)}>Terminé</button>
      </div>}
    </div>
  );
}

function CarTimeSelector({ pickupTime, returnTime, onChange }: { pickupTime: string; returnTime: string; onChange: (pickup: string, back: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="passenger-selector car-time-selector" ref={wrapRef}>
      <button type="button" className={open ? "active" : ""} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span><strong>{pickupTime} → {returnTime}</strong><small>Horaires de location</small></span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
      </button>
      {open && <div className="passenger-popover car-time-popover">
        <header><strong>Horaires</strong><span>Retrait et retour</span></header>
        <label><span>Heure de retrait</span><select value={pickupTime} onChange={(event) => onChange(event.target.value, returnTime)}>{timeOptions().map((time) => <option key={time}>{time}</option>)}</select></label>
        <label><span>Heure de retour</span><select value={returnTime} onChange={(event) => onChange(pickupTime, event.target.value)}>{timeOptions().map((time) => <option key={time}>{time}</option>)}</select></label>
        <button className="passenger-done" type="button" onClick={() => setOpen(false)}>Terminé</button>
      </div>}
    </div>
  );
}

function LocationField({ id, label, value, selectedCode, onChange }: { id: string; label: string; value: string; selectedCode: string; onChange: (value: string, place?: CitySuggestion) => void }) {
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
    if (!open || query.length < 2) {
      setLoading(false);
      if (query.length < 2) setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/cities?mode=car&q=" + encodeURIComponent(query), { signal: controller.signal });
        const payload = (await response.json()) as { cities: CitySuggestion[] };
        setSuggestions(payload.cities || []);
        setActive(0);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, value]);

  function choose(city: CitySuggestion) {
    onChange(city.name + ", " + city.countryName, city);
    setSuggestions([]);
    setOpen(false);
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive((current) => Math.min(current + 1, suggestions.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
    if (event.key === "Enter" && open && suggestions[active]) { event.preventDefault(); choose(suggestions[active]); }
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div className="city-field car-city-field" ref={wrapRef}>
      <span className="city-field-label">{label}</span>
      <div className="city-input-wrap"><input id={id} aria-label={label} value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); }} onKeyDown={keyDown} placeholder="Ville ou aéroport" role="combobox" aria-expanded={open} autoComplete="off" required />{selectedCode && <b className="iata-chip">{selectedCode}</b>}</div>
      {open && value.trim().length >= 2 && (
        <div className="city-suggestions car-city-suggestions" role="listbox">
          <p>Villes et aéroports</p>
          {loading && <span>Recherche en cours…</span>}
          {!loading && suggestions.map((city, index) => (
            <button key={city.id} type="button" role="option" aria-selected={index === active} className={index === active ? "active" : ""} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(city)}>
              <span><strong>{city.name}</strong><small>{city.type === "airport" ? "Aéroport · " : ""}{city.stateCode ? city.stateCode + " · " : ""}{city.countryName}</small></span>
              {city.code && <b>{city.code}</b>}
            </button>
          ))}
          {!loading && !suggestions.length && <span>Aucun lieu trouvé. Essayez avec le pays.</span>}
        </div>
      )}
    </div>
  );
}

function CarDatePicker({ pickupDate, returnDate, onChange }: { pickupDate: string; returnDate: string; onChange: (pickup: string, back: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"pickup" | "return">("pickup");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function show(next: "pickup" | "return") {
    setMode(next);
    const value = next === "pickup" ? pickupDate : returnDate;
    if (value) setMonth(startOfMonth(new Date(value + "T12:00:00")));
    setOpen(true);
  }

  function choose(date: string) {
    if (mode === "pickup" || !pickupDate) {
      onChange(date, "");
      setMode("return");
      return;
    }
    if (date <= pickupDate) {
      onChange(date, "");
      setMode("return");
      return;
    }
    onChange(pickupDate, date);
    setOpen(false);
  }

  return (
    <div className="date-field-wrap car-flight-dates" ref={wrapRef}>
      <div className="date-buttons">
        <button type="button" className={open && mode === "pickup" ? "active" : ""} onClick={() => show("pickup")}><small>Retrait</small><strong>{formatShortDate(pickupDate)}</strong></button>
        <button type="button" className={open && mode === "return" ? "active" : ""} onClick={() => show("return")}><small>Retour</small><strong>{formatShortDate(returnDate)}</strong></button>
      </div>
      {open && (
        <div className="fare-calendar car-clean-calendar" role="dialog" aria-label="Choisir les dates de location">
          <div className="calendar-top"><div><strong>{mode === "pickup" ? "Choisissez le retrait" : "Choisissez le retour"}</strong><span>Le calendrier se ferme après la date de retour.</span></div><button type="button" aria-label="Fermer" onClick={() => setOpen(false)}>×</button></div>
          <div className="calendar-nav"><button type="button" aria-label="Mois précédent" disabled={monthKey(month) <= monthKey(new Date())} onClick={() => setMonth((current) => addMonths(current, -1))}>‹</button><button type="button" aria-label="Mois suivant" onClick={() => setMonth((current) => addMonths(current, 1))}>›</button></div>
          <div className="calendar-grid"><CarMonth month={month} pickup={pickupDate} back={returnDate} onChoose={choose} /><CarMonth month={addMonths(month, 1)} pickup={pickupDate} back={returnDate} onChoose={choose} /></div>
        </div>
      )}
    </div>
  );
}

function CarMonth({ month, pickup, back, onChoose }: { month: Date; pickup: string; back: string; onChoose: (date: string) => void }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<number | null> = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="calendar-month">
      <h3>{new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month)}</h3>
      <div className="week-row">{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="days-grid">
        {cells.map((day, index) => {
          if (!day) return <span className="empty-day" key={"empty-" + index} />;
          const date = localIso(new Date(month.getFullYear(), month.getMonth(), day));
          const selected = date === pickup || date === back;
          const between = Boolean(pickup && back && date > pickup && date < back);
          return <button key={date} type="button" disabled={date < todayIso()} className={(selected ? "selected " : "") + (between ? "between" : "")} onClick={() => onChoose(date)}><span>{day}</span><small>&nbsp;</small></button>;
        })}
      </div>
    </div>
  );
}

function timeOptions() { return Array.from({ length: 48 }, (_, index) => String(Math.floor(index / 2)).padStart(2, "0") + ":" + (index % 2 ? "30" : "00")); }
function todayIso() { const date = new Date(); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
function localIso(date: Date) { return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0"); }
function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addMonths(date: Date, amount: number) { return new Date(date.getFullYear(), date.getMonth() + amount, 1); }
function monthKey(date: Date) { return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0"); }
function formatShortDate(value: string) { return value ? new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(value + "T12:00:00")) : "Choisir"; }
