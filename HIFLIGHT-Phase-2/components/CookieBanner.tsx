"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

const KEY = "hiflight-consent-v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    setVisible(!saved);
    if (saved === "accepted") {
      window.gtag?.("consent", "update", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    }
  }, []);

  function choose(accepted: boolean) {
    localStorage.setItem(KEY, accepted ? "accepted" : "refused");
    window.gtag?.("consent", "update", {
      analytics_storage: accepted ? "granted" : "denied",
      ad_storage: accepted ? "granted" : "denied",
      ad_user_data: accepted ? "granted" : "denied",
      ad_personalization: accepted ? "granted" : "denied"
    });
    setVisible(false);
  }

  if (!visible) return <button className="cookie-manage" type="button" onClick={() => setVisible(true)}>Cookies</button>;
  return (
    <aside className="cookie" aria-label="Choix des cookies">
      <div>
        <strong>Votre confidentialité compte</strong>
        <p>Nous utilisons des traceurs de mesure uniquement avec votre accord. Le comparateur reste accessible si vous refusez.</p>
      </div>
      <div className="cookie-actions">
        <button className="button secondary" onClick={() => choose(false)}>Tout refuser</button>
        <button className="button" onClick={() => choose(true)}>Tout accepter</button>
      </div>
    </aside>
  );
}
