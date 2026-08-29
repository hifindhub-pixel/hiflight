"use client";

import { useEffect, useRef, useState } from "react";

const AIRALO_LINK = "https://airalo.tpk.lu/uQBzbNMH";
const alternatives = [
  { name: "Saily", href: "https://saily.tpk.lu/WTzGQa9T", mark: "S", tone: "blue", description: "Une application claire pour préparer et activer sa connexion avant le départ." },
  { name: "Yesim", href: "https://yesim.tpk.lu/QYk4GCvP", mark: "Y", tone: "green", description: "Des forfaits par pays, région ou zone mondiale selon votre itinéraire." },
] as const;

export default function EsimExplorer() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source === frameRef.current?.contentWindow && event.data?.type === "hiflight:airalo-ready") {
        setWidgetReady(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <section className="market-hero esim"><div>
        <h1>Le monde dans votre poche,<br /><span>dès l’atterrissage.</span></h1>
        <p className="esim-hero-copy">Choisissez votre destination, consultez les forfaits disponibles et partez connecté sans changer de carte SIM physique.</p>
        <section className="esim-airalo-shell" aria-label="Recherche de forfaits eSIM Airalo">
          <div className="esim-widget-stage">
            {!widgetReady && <div className="esim-widget-fallback">
              <div className="esim-widget-fallback-copy">
                <span>Airalo</span>
                <h2>Votre connexion vous attend.</h2>
                <p>Consultez les forfaits disponibles pour votre destination et activez votre eSIM avant le départ.</p>
              </div>
              <a href={AIRALO_LINK} target="_blank" rel="nofollow sponsored noopener">Rechercher mon forfait Airalo</a>
            </div>}
            <iframe
              ref={frameRef}
              className={`esim-widget-frame${widgetReady ? " is-ready" : ""}`}
              src="/airalo-widget.html"
              title="Widget Airalo — recherche de forfaits eSIM"
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              aria-hidden={!widgetReady}
              tabIndex={widgetReady ? 0 : -1}
            />
          </div>
        </section>
        <p className="hero-disclaimer">Les prix, volumes de données, durées et compatibilités sont confirmés sur le site du partenaire.</p>
      </div></section>

      <section className="esim-results section">
        <div className="esim-results-head"><div><h2>Deux alternatives,<br />une connexion partout.</h2></div><p>Comparez aussi les conditions et la couverture proposées par d’autres spécialistes avant de choisir votre forfait.</p></div>
        <div className="esim-alternatives">
          {alternatives.map((provider) => <article className="esim-provider" key={provider.name}>
            <div className={`esim-provider-mark ${provider.tone}`}>{provider.mark}</div>
            <h3>{provider.name}</h3><p>{provider.description}</p>
            <ul><li>Activation 100 % numérique</li><li>Forfaits selon la destination</li><li>Votre SIM principale reste en place</li></ul>
            <a href={provider.href} target="_blank" rel="nofollow sponsored noopener">Découvrir les forfaits <span aria-hidden="true">→</span></a>
          </article>)}
          <article className="esim-photo-card"><div><span>Prêt avant le décollage</span><h3>Installez aujourd’hui.<br />Activez à l’arrivée.</h3></div></article>
        </div>

        <div className="esim-how"><h2>Connecté dès l’atterrissage.</h2><div><article><h3>Choisissez votre forfait</h3><p>Sélectionnez le pays, le volume de données et la durée adaptés.</p></article><article><h3>Installez-le avant de partir</h3><p>Scannez le QR code reçu après votre achat, avant le départ.</p></article><article><h3>Activez-le à l’arrivée</h3><p>Activez l’eSIM à l’arrivée et gardez votre numéro principal.</p></article></div></div>
      </section>
    </>
  );
}
