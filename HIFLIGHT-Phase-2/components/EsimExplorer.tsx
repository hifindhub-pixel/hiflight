"use client";

import { useEffect, useRef, useState } from "react";

const AIRALO_LINK = "https://airalo.tpk.lu/uQBzbNMH";
const alternatives = [
  { name: "Saily", href: "https://saily.tpk.lu/WTzGQa9T", mark: "S", tone: "blue", description: "Une application claire pour préparer et activer sa connexion avant le départ." },
  { name: "Yesim", href: "https://yesim.tpk.lu/QYk4GCvP", mark: "Y", tone: "green", description: "Des forfaits par pays, région ou zone mondiale selon votre itinéraire." },
] as const;

export default function EsimExplorer() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!widgetRef.current || widgetRef.current.dataset.loaded) return;
    widgetRef.current.dataset.loaded = "true";
    let shadowObserver: MutationObserver | null = null;

    const localizeWidget = () => {
      const root = widgetRef.current;
      if (!root) return;
      const component = root.querySelector<HTMLElement>("tp-cascoon");
      const scope: ParentNode = component?.shadowRoot || root;

      if (component) component.setAttribute("lang", "fr");
      if (component?.shadowRoot && !shadowObserver) {
        shadowObserver = new MutationObserver(localizeWidget);
        shadowObserver.observe(component.shadowRoot, { childList: true, subtree: true, characterData: true, attributes: true });
      }
      if (component?.shadowRoot && !component.shadowRoot.querySelector("#hiflight-airalo-layer-fix")) {
        const style = document.createElement("style");
        style.id = "hiflight-airalo-layer-fix";
        style.textContent = ':host{display:block!important;min-height:320px!important;overflow:visible!important}[class*="search"],[class*="input"],[class*="content"]{overflow:visible!important}[role="listbox"],[class*="dropdown"],[class*="suggest"],[class*="options"],[class*="menu"]{position:absolute!important;z-index:2147483000!important;max-height:330px!important;overflow-y:auto!important}';
        component.shadowRoot.appendChild(style);
      }

      const replacements: Record<string, string> = {
        "Local, regional and global eSIMs for travellers": "Des eSIM locales, régionales et mondiales",
        "Stay connected, wherever you travel, at affordable rates": "Restez connecté partout, avec un forfait adapté à votre voyage",
      };
      scope.querySelectorAll<HTMLElement>("*").forEach((element) => {
        const value = element.textContent?.trim();
        if (value && replacements[value] && element.children.length === 0) element.textContent = replacements[value];
      });

      const input = scope.querySelector<HTMLInputElement>('input[data-testid="autocomplete-input-country"]');
      const selectedValue = scope.querySelector<HTMLInputElement>('input[data-testid="autocomplete-hidden-country"]');
      const form = scope.querySelector<HTMLFormElement>('form[data-testid="form"]');
      const submit = scope.querySelector<HTMLButtonElement>('button[type="submit"]');
      const submitCopy = submit?.querySelector<HTMLElement>(".form-submit__content");

      if (input) {
        if (input.placeholder.toLowerCase().includes("search data packs")) input.placeholder = "Rechercher parmi plus de 200 pays et régions";
        input.setAttribute("aria-label", "Destination eSIM");
      }
      if (submit) submit.setAttribute("aria-label", "Rechercher une eSIM");
      if (submitCopy && submitCopy.textContent !== "Rechercher") submitCopy.textContent = "Rechercher";

      if (form && input && selectedValue && form.dataset.hiflightValidated !== "true") {
        form.dataset.hiflightValidated = "true";
        input.addEventListener("input", () => input.setCustomValidity(""));
        form.addEventListener("submit", (event) => {
          if (!selectedValue.value.trim()) {
            event.preventDefault();
            input.setCustomValidity("Sélectionnez une destination dans la liste proposée.");
            input.reportValidity();
            input.focus();
            return;
          }
          input.setCustomValidity("");
        }, true);
      }
    };

    const observer = new MutationObserver(localizeWidget);
    observer.observe(widgetRef.current, { childList: true, subtree: true });
    const localizationTimer = window.setInterval(localizeWidget, 500);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://tpwdg.com/content?trs=514265&shmarker=714763&locale=fr&powered_by=false&color_button=%23f2685f&color_focused=%23f2685f&secondary=%23FFFFFF&dark=%2311100f&light=%23FFFFFF&special=%23C4C4C4&border_radius=12&plain=false&no_labels=true&promo_id=8588&campaign_id=541";
    script.charset = "utf-8";
    script.onerror = () => setFailed(true);
    widgetRef.current.appendChild(script);
    return () => { observer.disconnect(); shadowObserver?.disconnect(); window.clearInterval(localizationTimer); };
  }, []);

  return (
    <>
      <section className="market-hero esim"><div>
        <h1>Le monde dans votre poche,<br /><span>dès l’atterrissage.</span></h1>
        <p className="esim-hero-copy">Choisissez votre destination, consultez les forfaits disponibles et partez connecté sans changer de carte SIM physique.</p>
        <section className="esim-airalo-shell" aria-label="Recherche de forfaits eSIM Airalo">
          {failed ? <div className="esim-widget-fallback"><p>Le widget est momentanément indisponible.</p><a href={AIRALO_LINK} target="_blank" rel="nofollow sponsored noopener">Voir les forfaits Airalo →</a></div> : <div className="esim-widget" ref={widgetRef}><noscript><a href={AIRALO_LINK}>Voir les forfaits Airalo</a></noscript></div>}
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
