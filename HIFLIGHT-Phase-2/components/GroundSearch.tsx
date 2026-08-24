"use client";

import { useEffect, useState } from "react";

const OMIO_STYLES_ID = "hiflight-omio-widget-styles";
const OMIO_SCRIPT_ID = "hiflight-omio-widget-script";
const OMIO_STYLES = "https://www.omio.com/gcs-proxy/b2b-nemo-prod/bundle/fr/bundle.css";
const OMIO_SCRIPT = "https://www.omio.com/gcs-proxy/b2b-nemo-prod/bundle/fr/bundle.js";
const OMIO_REDIRECT = "https://omio.sjv.io/c/7530270/3963000/7385?u=";

export default function GroundSearch() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    document.getElementById(OMIO_STYLES_ID)?.remove();
    document.getElementById(OMIO_SCRIPT_ID)?.remove();

    const styles = document.createElement("link");
    styles.id = OMIO_STYLES_ID;
    styles.rel = "stylesheet";
    styles.href = `${OMIO_STYLES}?v=${Date.now()}`;
    document.head.appendChild(styles);

    const script = document.createElement("script");
    script.id = OMIO_SCRIPT_ID;
    script.src = `${OMIO_SCRIPT}?v=${Date.now()}`;
    script.async = true;
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);

    return () => {
      styles.remove();
      script.remove();
    };
  }, []);

  return (
    <section className="omio-search-shell" aria-label="Recherche de trains et de bus avec Omio">
      {failed ? (
        <div className="omio-search-fallback" role="alert">
          <p>Le moteur de recherche est momentanément indisponible.</p>
          <a href={OMIO_REDIRECT} target="_blank" rel="noopener noreferrer sponsored">Rechercher sur Omio →</a>
        </div>
      ) : (
        <div
          className="omio-widget-mount"
          data-omio-widget="true"
          data-partner-id="omiolps"
          data-redirect={OMIO_REDIRECT}
          data-layout="fluid"
          data-new-tab="true"
          style={{ width: "100%" }}
        />
      )}
    </section>
  );
}
