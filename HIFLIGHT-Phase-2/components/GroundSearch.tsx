"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { trackPartnerClick, trackSearch } from "./Analytics";

const OMIO_STYLES_ID = "hiflight-omio-widget-styles";
const OMIO_SCRIPT_ID = "hiflight-omio-widget-script";
const OMIO_STYLES = "https://www.omio.com/gcs-proxy/b2b-nemo-prod/bundle/fr/bundle.css";
const OMIO_SCRIPT = "https://www.omio.com/gcs-proxy/b2b-nemo-prod/bundle/fr/bundle.js";
const OMIO_REDIRECT = "https://omio.sjv.io/c/7530270/3963000/7385?u=";

export default function GroundSearch() {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  function trackWidgetAction(event: MouseEvent<HTMLDivElement>) {
    const action = (event.target as HTMLElement).closest("button, a");
    if (!action || !/rechercher|search|voir les/i.test(action.textContent || "")) return;
    trackSearch("ground", { provider: "omio" });
    trackPartnerClick("ground", { provider: "omio" });
  }

  useEffect(() => {
    document.getElementById(OMIO_SCRIPT_ID)?.remove();

    let styles = document.getElementById(OMIO_STYLES_ID) as HTMLLinkElement | null;
    if (!styles) {
      styles = document.createElement("link");
      styles.id = OMIO_STYLES_ID;
      styles.rel = "stylesheet";
      styles.href = OMIO_STYLES;
      document.head.appendChild(styles);
    }

    const reveal = () => {
      if (mountRef.current?.children.length) setReady(true);
    };
    const observer = new MutationObserver(reveal);
    if (mountRef.current) observer.observe(mountRef.current, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.id = OMIO_SCRIPT_ID;
    script.src = OMIO_SCRIPT;
    script.async = true;
    script.onload = reveal;
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
    };
  }, []);

  return (
    <section className="omio-search-shell" aria-label="Recherche de trains et de bus avec Omio">
      {failed ? (
        <div className="omio-search-fallback" role="alert">
          <p>Le moteur de recherche est momentanément indisponible.</p>
          <a href={OMIO_REDIRECT} target="_blank" rel="noopener noreferrer sponsored" onClick={() => { trackSearch("ground", { provider: "omio" }); trackPartnerClick("ground", { provider: "omio" }); }}>Rechercher sur Omio →</a>
        </div>
      ) : (
        <div className={`omio-widget-stage ${ready ? "ready" : "loading"}`}>
          {!ready && <div className="omio-widget-loader" aria-live="polite"><span /><span /><span /><span /></div>}
          <div
            ref={mountRef}
            onClickCapture={trackWidgetAction}
            className="omio-widget-mount"
            data-omio-widget="true"
            data-partner-id="omiolps"
            data-redirect={OMIO_REDIRECT}
            data-layout="fluid"
            data-new-tab="true"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </section>
  );
}
