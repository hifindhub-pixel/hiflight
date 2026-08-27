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

type LocationFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string, place?: CitySuggestion) => void;
};

const initialSearch: CarSearch = {
  pickup: "Paris, France",
  dropoff: "Paris, France",
  pickupDate: "",
  returnDate: "",
  pickupTime: "10:30",
  returnTime: "10:30",
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pickup = params.get("pickup") || initialSearch.pickup;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDay = new Date(tomorrow);
    returnDay.setDate(returnDay.getDate() + 4);
    setDraft({
      ...initialSearch,
      pickup,
      dropoff: pickup,
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
    const pickupAt = draft.pickupDate + "T" + draft.pickupTime;
    const returnAt = draft.returnDate + "T" + draft.returnTime;
    if (returnAt <= pickupAt) {
      setError("Le retour doit être postérieur au retrait.");
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
    window.location.assign("/go/voitures?" + params.toString());
  }

  return (
    <>
      <section className="car-stage">
        <div className="car-stage-glow car-stage-glow-one" />
        <div className="car-stage-glow car-stage-glow-two" />
        <div className="car-stage-inner">
          <ServiceTabs active="cars" />
          <div className="car-stage-grid">
            <div className="car-stage-copy">
              <span className="car-stage-kicker"><i /> Location de voiture dans le monde entier</span>
              <h1>La route vous<br /><em>appartient.</em></h1>
              <p>Choisissez votre ville et vos dates. En un clic, vous accédez directement aux véhicules réellement disponibles sur Expedia.</p>
              <div className="car-stage-points">
                <span><b>1 clic</b><small>vers les offres</small></span>
                <span><b>Expedia</b><small>partenaire</small></span>
                <span><b>100%</b><small>prix réels</small></span>
              </div>
            </div>
            <CarRoadVisual />
          </div>
        </div>
      </section>

      <section className="car-engine-zone" aria-labelledby="car-engine-title">
        <div className="car-engine-shell">
          <header className="car-engine-header">
            <div>
              <span>Votre location</span>
              <h2 id="car-engine-title">Où prenez-vous la route ?</h2>
            </div>
            <p><i>✓</i> Redirection sécurisée vers Expedia</p>
          </header>

          <form className="car-direct-form" onSubmit={submit}>
            <div className="car-direct-grid">
              <LocationField
                id="car-pickup"
                label="Prise en charge"
                value={draft.pickup}
                placeholder="Ville ou aéroport"
                onChange={(pickup, place) => {
                  setDraft((current) => ({
                    ...current,
                    pickup,
                    dropoff: pickup,
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

            <div className="car-direct-details">
              <label>
                <span>Heure de retrait</span>
                <select value={draft.pickupTime} onChange={(event) => setDraft((current) => ({ ...current, pickupTime: event.target.value }))}>
                  {timeOptions().map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
              <label>
                <span>Heure de retour</span>
                <select value={draft.returnTime} onChange={(event) => setDraft((current) => ({ ...current, returnTime: event.target.value }))}>
                  {timeOptions().map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
              <label>
                <span>Âge du conducteur</span>
                <select value={draft.driverAge} onChange={(event) => setDraft((current) => ({ ...current, driverAge: event.target.value }))}>
                  {Array.from({ length: 58 }, (_, index) => index + 18).map((age) => <option key={age} value={age}>{age} ans</option>)}
                </select>
              </label>
              <button className="car-direct-submit" type="submit" disabled={launching}>
                <span>{launching ? "Ouverture d’Expedia…" : "Voir les voitures sur Expedia"}</span>
                <i aria-hidden="true">→</i>
              </button>
            </div>

            <p className={error ? "car-direct-error visible" : "car-direct-error"} role={error ? "alert" : undefined}>
              {error || "Votre ville, vos dates et vos horaires seront transmis automatiquement."}
            </p>
          </form>

          <footer className="car-engine-footer">
            <p><i>✓</i> Aucun faux tarif : les résultats et disponibilités sont affichés par Expedia.</p>
            <span>Vous finalisez votre réservation sur le site sécurisé du partenaire.</span>
          </footer>
        </div>
      </section>

      <section className="car-categories">
        <div className="car-section-heading">
          <span>À chacun sa route</span>
          <h2>Un véhicule pour chaque voyage.</h2>
        </div>
        <div className="car-category-grid">
          <CarCategory label="Citadine" detail="Agile et économique" icon={<><path d="M4 15.5 6.5 10a2.5 2.5 0 0 1 2.3-1.5h7.1a2.5 2.5 0 0 1 2.2 1.3l2.9 5.7" /><path d="M3 15h18v4H3zM6 19v2M18 19v2M7 17h2M15 17h2" /></>} />
          <CarCategory label="SUV" detail="Espace et confort" icon={<><path d="M3 15.5 5.8 9a2 2 0 0 1 1.9-1.2h9.1a2 2 0 0 1 1.8 1.1l2.4 6.6" /><path d="M2.5 15h19v4.5h-19zM6 19.5v2M18 19.5v2M7 17.2h3M15 17.2h3" /><path d="M8 8v7M16 8v7" /></>} />
          <CarCategory label="Électrique" detail="Silencieuse et moderne" icon={<><path d="M4 15.5 6.5 10a2.5 2.5 0 0 1 2.3-1.5h7.1a2.5 2.5 0 0 1 2.2 1.3l2.9 5.7" /><path d="M3 15h18v4H3zM6 19v2M18 19v2" /><path d="m13 3-3 5h3l-2 4" /></>} />
          <CarCategory label="Premium" detail="Voyagez autrement" icon={<><path d="M3 15.5 6.2 9a2 2 0 0 1 1.8-1.1h8.8a2 2 0 0 1 1.8 1.1l2.9 6.5" /><path d="M2.5 15h19v4.2h-19zM6 19.2v2M18 19.2v2" /><path d="m12 2 1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2L9.8 9l.4-2.5-1.8-1.8 2.5-.4z" /></>} />
        </div>
      </section>

      <section className="car-confidence">
        <div className="car-confidence-copy">
          <span>Avant de réserver</span>
          <h2>Tout ce qui compte,<br />visible avant de payer.</h2>
        </div>
        <div className="car-confidence-list">
          <p><i>01</i><span><b>Résultats Expedia en direct</b><small>La recherche s’ouvre avec la ville et les dates que vous avez choisies.</small></span></p>
          <p><i>02</i><span><b>Prix et conditions réels</b><small>Kilométrage, carburant, caution et annulation sont affichés avant réservation.</small></span></p>
          <p><i>03</i><span><b>Réservation sécurisée</b><small>Le paiement et la confirmation sont entièrement gérés par Expedia.</small></span></p>
        </div>
      </section>

      <section className="car-other-rides">
        <div>
          <span>Une autre façon de bouger ?</span>
          <h2>Explorez aussi nos partenaires spécialisés.</h2>
        </div>
        <nav aria-label="Autres locations">
          <a href="/go/voitures?offre=local" target="_blank" rel="sponsored noreferrer" onClick={() => track("partner_click", { category: "car", offer_type: "local" })}>Agences locales <b>→</b></a>
          <a href="/go/voitures?offre=bike" target="_blank" rel="sponsored noreferrer" onClick={() => track("partner_click", { category: "car", offer_type: "bike" })}>Scooters et motos <b>→</b></a>
        </nav>
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

  function choose(city: CitySuggestion) { onChange(`${city.name}, ${city.countryName}`, city); setSuggestions([]); setOpen(false); }
  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive((current) => Math.min(current + 1, suggestions.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
    if (event.key === "Enter" && open && suggestions[active]) { event.preventDefault(); choose(suggestions[active]); }
    if (event.key === "Escape") setOpen(false);
  }

  return <div className="hotel-city-field car-location-field premium-control" ref={wrapRef}><label htmlFor={id}>{label}</label><div className="hotel-city-input"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12A7 7 0 1 0 5 9c0 5.9 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg><input id={id} value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); }} onKeyDown={keyDown} placeholder={placeholder} role="combobox" aria-expanded={open} autoComplete="off" required /></div>{open && value.trim().length >= 2 && <div className="hotel-city-suggestions" role="listbox"><p>Villes et aéroports dans le monde</p>{loading && <span className="hotel-city-status">Recherche des lieux…</span>}{!loading && suggestions.map((city, index) => <button key={city.id} type="button" role="option" aria-selected={index === active} className={index === active ? "active" : ""} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(city)}><span className="hotel-suggestion-pin" aria-hidden="true">{city.type === "airport" ? "✈" : "⌖"}</span><span><strong>{city.name}</strong><small>{city.type === "airport" ? "Aéroport · " : ""}{city.stateCode ? `${city.stateCode} · ` : ""}{city.countryName}</small></span>{city.code && <b>{city.code}</b>}</button>)}{!loading && !suggestions.length && <span className="hotel-city-status">Aucun lieu trouvé. Essayez avec le pays.</span>}<footer>Destinations HiFlight dans le monde</footer></div>}</div>;
}

function CarDatePicker({ pickupDate, returnDate, onChange }: { pickupDate: string; returnDate: string; onChange: (pickup: string, back: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"pickup" | "return">("pickup");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) return; const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, [open]);
  function choose(date: string) { if (mode === "pickup" || !pickupDate || (pickupDate && returnDate)) { onChange(date, returnDate && returnDate >= date ? returnDate : ""); setMode("return"); } else if (date < pickupDate) { onChange(date, ""); setMode("return"); } else { onChange(pickupDate, date); } }
  function show(next: "pickup" | "return") { setMode(next); const date = next === "pickup" ? pickupDate : returnDate; if (date) setMonth(startOfMonth(new Date(`${date}T12:00:00`))); setOpen(true); }
  return <div className="hotel-date-picker car-date-picker premium-control" ref={wrapRef}><span className="car-control-heading">Dates de location</span><div className="hotel-date-triggers"><button type="button" className={open && mode === "pickup" ? "active" : ""} onClick={() => show("pickup")}><small>Retrait</small><strong>{formatShortDate(pickupDate)}</strong></button><span>→</span><button type="button" className={open && mode === "return" ? "active" : ""} onClick={() => show("return")}><small>Retour</small><strong>{formatShortDate(returnDate)}</strong></button></div>{open && <div className="hotel-calendar" role="dialog" aria-label="Choisir les dates de location"><header><div><strong>Quand prenez-vous la route ?</strong><span>Sélectionnez le retrait puis le retour</span></div><button type="button" aria-label="Fermer" onClick={() => setOpen(false)}>×</button></header><div className="hotel-calendar-selection"><button type="button" className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}><small>Retrait</small><strong>{formatShortDate(pickupDate)}</strong></button><button type="button" className={mode === "return" ? "active" : ""} onClick={() => setMode("return")}><small>Retour</small><strong>{formatShortDate(returnDate)}</strong></button></div><div className="hotel-calendar-nav"><button type="button" aria-label="Mois précédent" disabled={monthKey(month) <= monthKey(new Date())} onClick={() => setMonth((current) => addMonths(current, -1))}>‹</button><button type="button" aria-label="Mois suivant" onClick={() => setMonth((current) => addMonths(current, 1))}>›</button></div><div className="hotel-calendar-months"><CarMonth month={month} pickup={pickupDate} back={returnDate} onChoose={choose} /><CarMonth month={addMonths(month, 1)} pickup={pickupDate} back={returnDate} onChoose={choose} /></div><footer><button type="button" className="hotel-calendar-clear" onClick={() => { onChange("", ""); setMode("pickup"); }}>Effacer</button><span>{pickupDate && returnDate ? `${dayDifference(pickupDate, returnDate)} jour${dayDifference(pickupDate, returnDate) > 1 ? "s" : ""}` : "Sélectionnez vos dates"}</span><button type="button" className="hotel-calendar-apply" disabled={!pickupDate || !returnDate} onClick={() => setOpen(false)}>Appliquer</button></footer></div>}</div>;
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


function CarRoadVisual() {
  return (
    <div className="car-road-visual" aria-hidden="true">
      <span className="car-road-orbit" />
      <svg viewBox="0 0 680 430">
        <defs>
          <linearGradient id="carBody" x1="0" x2="1"><stop stopColor="#ff8585" /><stop offset="1" stopColor="#ff5f65" /></linearGradient>
          <linearGradient id="carGlass" x1="0" x2="1"><stop stopColor="#18345a" /><stop offset="1" stopColor="#07162f" /></linearGradient>
        </defs>
        <path className="car-road-line" d="M48 390C164 314 252 298 357 305c102 7 176 46 278 4" />
        <path className="car-road-line car-road-line-soft" d="M76 418c131-66 214-75 321-62 88 11 157 44 238 38" />
        <g className="car-hero-car">
          <ellipse cx="349" cy="335" rx="222" ry="28" fill="rgba(0,0,0,.34)" />
          <path d="M135 291c14-47 37-71 72-79l70-16c22-36 50-55 84-57h72c33 2 58 18 77 50l27 13c42 11 69 39 77 82l5 31H123z" fill="url(#carBody)" />
          <path d="M298 198c17-27 37-39 64-41h66c27 2 47 15 62 41z" fill="url(#carGlass)" />
          <path d="M399 157v41M277 197h264M174 266h33M548 263h35" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="226" cy="314" r="48" fill="#07162f" stroke="#19365a" strokeWidth="10" />
          <circle cx="226" cy="314" r="19" fill="#e8eef7" />
          <circle cx="518" cy="314" r="48" fill="#07162f" stroke="#19365a" strokeWidth="10" />
          <circle cx="518" cy="314" r="19" fill="#e8eef7" />
          <path d="M130 289h62c17 0 29 8 36 23M566 289h47" fill="none" stroke="#ffb0b0" strokeWidth="6" strokeLinecap="round" />
          <rect x="566" y="238" width="32" height="13" rx="6.5" fill="#fff5bd" />
          <path d="M332 225h90" stroke="rgba(255,255,255,.45)" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
      <span className="car-visual-chip car-visual-chip-one"><i>✓</i> Départ flexible</span>
      <span className="car-visual-chip car-visual-chip-two"><i>€</i> Prix réels</span>
    </div>
  );
}

function CarCategory({ label, detail, icon }: { label: string; detail: string; icon: React.ReactNode }) {
  return (
    <article className="car-category-card">
      <div><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg></div>
      <span><b>{label}</b><small>{detail}</small></span>
      <i>→</i>
    </article>
  );
}
