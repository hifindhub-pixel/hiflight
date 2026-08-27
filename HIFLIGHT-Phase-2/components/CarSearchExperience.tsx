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
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  driverAge: string;
  pickupCode: string;
  pickupType: string;
};

const initialSearch: CarSearch = {
  pickup: "Paris, France",
  pickupDate: "",
  returnDate: "",
  pickupTime: "10:00",
  returnTime: "10:00",
  driverAge: "30",
  pickupCode: "",
  pickupType: "",
};

export default function CarSearchExperience() {
  const [draft, setDraft] = useState<CarSearch>(initialSearch);
  const [error, setError] = useState("");
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDay = new Date(tomorrow);
    returnDay.setDate(returnDay.getDate() + 4);
    setDraft({
      pickup: params.get("pickup") || initialSearch.pickup,
      pickupDate: params.get("pickupDate") || localIso(tomorrow),
      returnDate: params.get("returnDate") || localIso(returnDay),
      pickupTime: params.get("pickupTime") || initialSearch.pickupTime,
      returnTime: params.get("returnTime") || initialSearch.returnTime,
      driverAge: params.get("driverAge") || initialSearch.driverAge,
      pickupCode: params.get("pickupCode") || "",
      pickupType: params.get("pickupType") || "",
    });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.pickup.trim().length < 2) {
      setError("Sélectionnez une ville ou un aéroport.");
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
      pickupDate: draft.pickupDate,
      returnDate: draft.returnDate,
      pickupTime: draft.pickupTime,
      returnTime: draft.returnTime,
      driverAge: draft.driverAge,
      pickupCode: draft.pickupCode,
      pickupType: draft.pickupType,
    });
    const resultsUrl = "/go/voitures?" + params.toString();
    const partnerTab = window.open("/go/voitures?tracking=1", "_blank");

    if (!partnerTab) {
      setError("Autorisez l’ouverture des nouveaux onglets pour afficher les résultats Expedia.");
      return;
    }

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
            <p>Location de voiture</p>
            <h1>Trouvez la bonne voiture,<br /><span>pour chaque départ.</span></h1>
            <p>Votre recherche s’ouvre directement sur Expedia avec la ville, les dates et les horaires sélectionnés.</p>
          </div>

          <form className="car-clean-search" onSubmit={submit}>
            <div className="car-clean-primary">
              <LocationField
                value={draft.pickup}
                onChange={(pickup, place) => {
                  setDraft((current) => ({
                    ...current,
                    pickup,
                    pickupCode: place?.code || "",
                    pickupType: place?.type || "",
                  }));
                  setError("");
                }}
              />
              <CarDatePicker
                pickupDate={draft.pickupDate}
                returnDate={draft.returnDate}
                onChange={(pickupDate, returnDate) => {
                  setDraft((current) => ({ ...current, pickupDate, returnDate }));
                  setError("");
                }}
              />
            </div>

            <div className="car-clean-secondary">
              <label><span>Retrait</span><select aria-label="Heure de retrait" value={draft.pickupTime} onChange={(event) => setDraft((current) => ({ ...current, pickupTime: event.target.value }))}>{timeOptions().map((time) => <option key={time}>{time}</option>)}</select></label>
              <label><span>Retour</span><select aria-label="Heure de retour" value={draft.returnTime} onChange={(event) => setDraft((current) => ({ ...current, returnTime: event.target.value }))}>{timeOptions().map((time) => <option key={time}>{time}</option>)}</select></label>
              <label><span>Conducteur</span><select aria-label="Âge du conducteur" value={draft.driverAge} onChange={(event) => setDraft((current) => ({ ...current, driverAge: event.target.value }))}>{Array.from({ length: 58 }, (_, index) => index + 18).map((age) => <option key={age} value={age}>{age} ans</option>)}</select></label>
              <button type="submit" disabled={launching}>{launching ? "Ouverture des résultats…" : "Rechercher"}<span aria-hidden="true">→</span></button>
            </div>

            <p className={error ? "car-clean-note error" : "car-clean-note"} role={error ? "alert" : undefined}>
              {error || "Même lieu de retrait et de retour · Résultats dans un nouvel onglet"}
            </p>
          </form>
        </div>
      </section>

      <section className="car-clean-content">
        <div className="car-clean-intro">
          <p>Une recherche simple, une réservation transparente</p>
          <h2>Les informations utiles avant de choisir.</h2>
        </div>
        <div className="car-clean-columns">
          <article><span>01</span><h3>Des résultats réels</h3><p>Les véhicules, prix et disponibilités sont affichés directement par Expedia selon vos critères.</p></article>
          <article><span>02</span><h3>Des conditions lisibles</h3><p>Vérifiez le kilométrage, le carburant, la caution et les règles d’annulation avant de réserver.</p></article>
          <article><span>03</span><h3>Une réservation sécurisée</h3><p>Le paiement, la confirmation et le service après-vente sont assurés sur le site du partenaire.</p></article>
        </div>
      </section>

      <section className="car-clean-footer">
        <div><p>Besoin d’une agence locale ou d’un deux-roues ?</p><h2>D’autres options restent disponibles.</h2></div>
        <nav aria-label="Autres locations">
          <a href="/go/voitures?offre=local" target="_blank" rel="sponsored noreferrer" onClick={() => track("partner_click", { category: "car", offer_type: "local" })}>Agences locales <span>→</span></a>
          <a href="/go/voitures?offre=bike" target="_blank" rel="sponsored noreferrer" onClick={() => track("partner_click", { category: "car", offer_type: "bike" })}>Scooters et motos <span>→</span></a>
        </nav>
      </section>
    </>
  );
}

function LocationField({ value, onChange }: { value: string; onChange: (value: string, place?: CitySuggestion) => void }) {
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
    <div className="car-clean-location" ref={wrapRef}>
      <label htmlFor="car-pickup">Prise en charge</label>
      <input id="car-pickup" value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); }} onKeyDown={keyDown} placeholder="Ville ou aéroport" role="combobox" aria-expanded={open} autoComplete="off" required />
      {open && value.trim().length >= 2 && (
        <div className="car-clean-suggestions" role="listbox">
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
    <div className="car-clean-dates" ref={wrapRef}>
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
