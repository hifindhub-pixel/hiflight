"use client";

import { ReactNode, useState } from "react";
import { track } from "./Analytics";
import ServiceTabs from "./ServiceTabs";

const HOLIDAY_AUTOS_SEARCH = "https://www.holidayautos.com/fr/minimal?clientID=641225&curr=EUR&PID=101723457&SID=&AID=12341343";

export default function CarSearchExperience() {
  const [engineReady, setEngineReady] = useState(false);

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
              <p>Choisissez votre ville et vos dates. Les véhicules réellement disponibles s’affichent ensuite directement chez notre partenaire.</p>
              <div className="car-stage-points">
                <span><b>20 000+</b><small>agences</small></span>
                <span><b>180+</b><small>pays</small></span>
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
            <p><i>✓</i> Moteur de réservation sécurisé</p>
          </header>

          <div className={`car-frame-wrap ${engineReady ? "is-ready" : ""}`}>
            {!engineReady && <div className="car-frame-loader"><i /><span>Chargement du moteur de recherche…</span></div>}
            <iframe
              className="car-booking-frame"
              src={HOLIDAY_AUTOS_SEARCH}
              title="Rechercher une location de voiture"
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                setEngineReady(true);
                track("car_search_engine_loaded", { partner: "holidayautos" });
              }}
            />
          </div>

          <footer className="car-engine-footer">
            <p><i>✓</i> Ville, dates, horaires et âge sont utilisés pour lancer la recherche réelle.</p>
            <span>Tarifs et disponibilités fournis par Holiday Autos.</span>
          </footer>
        </div>
      </section>

      <section className="car-categories">
        <div className="car-section-heading">
          <span>À chacun sa route</span>
          <h2>Un véhicule pour chaque voyage.</h2>
        </div>
        <div className="car-category-grid">
          <CarCategory
            label="Citadine"
            detail="Agile et économique"
            icon={<><path d="M4 15.5 6.5 10a2.5 2.5 0 0 1 2.3-1.5h7.1a2.5 2.5 0 0 1 2.2 1.3l2.9 5.7" /><path d="M3 15h18v4H3zM6 19v2M18 19v2M7 17h2M15 17h2" /></>}
          />
          <CarCategory
            label="SUV"
            detail="Espace et confort"
            icon={<><path d="M3 15.5 5.8 9a2 2 0 0 1 1.9-1.2h9.1a2 2 0 0 1 1.8 1.1l2.4 6.6" /><path d="M2.5 15h19v4.5h-19zM6 19.5v2M18 19.5v2M7 17.2h3M15 17.2h3" /><path d="M8 8v7M16 8v7" /></>}
          />
          <CarCategory
            label="Électrique"
            detail="Silencieuse et moderne"
            icon={<><path d="M4 15.5 6.5 10a2.5 2.5 0 0 1 2.3-1.5h7.1a2.5 2.5 0 0 1 2.2 1.3l2.9 5.7" /><path d="M3 15h18v4H3zM6 19v2M18 19v2" /><path d="m13 3-3 5h3l-2 4" /></>}
          />
          <CarCategory
            label="Premium"
            detail="Voyagez autrement"
            icon={<><path d="M3 15.5 6.2 9a2 2 0 0 1 1.8-1.1h8.8a2 2 0 0 1 1.8 1.1l2.9 6.5" /><path d="M2.5 15h19v4.2h-19zM6 19.2v2M18 19.2v2" /><path d="m12 2 1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2L9.8 9l.4-2.5-1.8-1.8 2.5-.4z" /></>}
          />
        </div>
      </section>

      <section className="car-confidence">
        <div className="car-confidence-copy">
          <span>Avant de réserver</span>
          <h2>Tout ce qui compte,<br />visible avant de payer.</h2>
        </div>
        <div className="car-confidence-list">
          <p><i>01</i><span><b>Conditions claires</b><small>Kilométrage, carburant et caution affichés par le partenaire.</small></span></p>
          <p><i>02</i><span><b>Loueurs internationaux et locaux</b><small>Choisissez selon le prix, la note et le lieu de retrait.</small></span></p>
          <p><i>03</i><span><b>Réservation sécurisée</b><small>Le paiement et la confirmation sont gérés sur le site partenaire.</small></span></p>
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

function CarCategory({ label, detail, icon }: { label: string; detail: string; icon: ReactNode }) {
  return (
    <article className="car-category-card">
      <div><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg></div>
      <span><b>{label}</b><small>{detail}</small></span>
      <i>→</i>
    </article>
  );
}
