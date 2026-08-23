"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ServiceTabs from "@/components/ServiceTabs";

const providers = [
  { name: "Airalo", href: "https://airalo.tpk.lu/uQBzbNMH", mark: "A", tone: "violet", description: "Une couverture internationale étendue et un grand choix de forfaits locaux, régionaux et mondiaux." },
  { name: "Saily", href: "https://saily.tpk.lu/WTzGQa9T", mark: "S", tone: "blue", description: "Une application simple, pensée pour activer rapidement une connexion avant ou pendant le voyage." },
  { name: "Yesim", href: "https://yesim.tpk.lu/QYk4GCvP", mark: "Y", tone: "green", description: "Des forfaits par pays et des options internationales, dont des volumes importants selon la destination." },
] as const;

const destinations = ["France", "Espagne", "Italie", "Maroc", "Turquie", "États-Unis", "Canada", "Thaïlande", "Indonésie", "Japon", "Émirats arabes unis", "Monde"];

export default function EsimExplorer() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [destination, setDestination] = useState("Turquie");
  const [duration, setDuration] = useState("7");
  const [searched, setSearched] = useState({ destination: "Turquie", duration: "7" });

  useEffect(() => {
    if (!widgetRef.current || widgetRef.current.dataset.loaded) return;
    widgetRef.current.dataset.loaded = "true";
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://tpwdg.com/content?trs=514265&shmarker=714763&locale=fr&powered_by=false&color_button=%23f2685f&color_focused=%23f2685f&secondary=%23FFFFFF&dark=%2311100f&light=%23FFFFFF&special=%23C4C4C4&border_radius=12&plain=false&no_labels=true&promo_id=8588&campaign_id=541";
    script.charset = "utf-8";
    widgetRef.current.appendChild(script);
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    setSearched({ destination, duration });
    document.getElementById("esim-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="market-hero esim"><div><ServiceTabs active="esim" /><p className="eyebrow">eSIM de voyage</p><h1>Le monde dans votre poche,<br /><span>dès l’atterrissage.</span></h1><p className="esim-hero-copy">Comparez les forfaits de plusieurs spécialistes et gardez votre numéro tout en voyageant connecté.</p><form className="esim-search" onSubmit={submit}>
        <label><span>Destination</span><select value={destination} onChange={(event) => setDestination(event.target.value)}>{destinations.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Durée du voyage</span><select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="3">3 jours</option><option value="7">7 jours</option><option value="15">15 jours</option><option value="30">30 jours</option><option value="60">60 jours</option></select></label>
        <label><span>Besoin de données</span><select defaultValue="standard"><option value="light">Essentiel · messages</option><option value="standard">Confort · navigation</option><option value="heavy">Intensif · vidéo</option></select></label>
        <button type="submit">Comparer les eSIM</button>
      </form></div></section>

      <section className="esim-results section" id="esim-results">
        <div className="esim-results-head"><div><p className="eyebrow">Comparaison</p><h2>Les offres pour {searched.destination}</h2></div><p>Séjour de {searched.duration} jours · comparez les volumes, la durée de validité et les conditions sur le site du fournisseur.</p></div>
        <div className="esim-provider-grid">
          {providers.map((provider, index) => <article className="esim-provider" key={provider.name}>
            <div className={`esim-provider-mark ${provider.tone}`}>{provider.mark}</div>
            <div className="esim-provider-rank">{index === 0 ? "Choix populaire" : "Alternative"}</div>
            <h3>{provider.name}</h3><p>{provider.description}</p>
            <ul><li>Activation numérique</li><li>Sans changer de carte SIM physique</li><li>Forfaits selon la destination</li></ul>
            <a href={provider.href} target="_blank" rel="nofollow sponsored noopener">Voir les forfaits <span aria-hidden="true">→</span></a>
          </article>)}
        </div>

        <div className="esim-live"><div className="esim-live-copy"><p className="eyebrow">Offres en direct</p><h2>Comparez davantage de forfaits</h2><p>Consultez les forfaits disponibles et choisissez celui qui correspond à votre consommation.</p></div><div className="esim-widget" ref={widgetRef}><noscript>Activez JavaScript pour afficher les offres eSIM.</noscript></div></div>

        <div className="esim-how"><p className="eyebrow">En trois étapes</p><h2>Connecté dès l’atterrissage.</h2><div><article><b>01</b><h3>Choisissez</h3><p>Comparez la destination, les données et la durée.</p></article><article><b>02</b><h3>Installez</h3><p>Scannez le QR code reçu après votre achat.</p></article><article><b>03</b><h3>Activez</h3><p>Activez votre eSIM à l’arrivée et gardez votre SIM principale.</p></article></div></div>
        <p className="affiliate-disclosure">HiFlight peut percevoir une commission si vous réservez via ces liens, sans coût supplémentaire pour vous. Les prix et conditions sont ceux affichés par chaque partenaire.</p>
      </section>
    </>
  );
}
