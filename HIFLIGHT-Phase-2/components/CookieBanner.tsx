"use client";

import { useEffect, useState } from "react";
import { readConsent, writeConsent } from "@/lib/consent";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  function choose(accepted: boolean) {
    const previous = readConsent();
    writeConsent(accepted ? "accepted" : "refused");
    window.dispatchEvent(new CustomEvent("hiflight-consent", { detail: { accepted } }));
    window.gtag?.("consent", "update", {
      analytics_storage: accepted ? "granted" : "denied",
      ad_storage: accepted ? "granted" : "denied",
      ad_user_data: accepted ? "granted" : "denied",
      ad_personalization: accepted ? "granted" : "denied"
    });
    setVisible(false);
    if (!accepted && previous === "accepted") window.setTimeout(() => window.location.reload(), 0);
  }

  if (!visible) return <button className="cookie-manage" type="button" onClick={() => setVisible(true)}>Cookies</button>;
  return (
    <aside className="cookie" aria-label="Choix des cookies">
      <div>
        <strong>Votre confidentialité compte</strong>
        <p>Nous utilisons des traceurs de mesure, d’avis et d’affiliation uniquement avec votre accord. Le comparateur reste accessible si vous refusez. Votre choix est redemandé après six mois.</p>
      </div>
      <div className="cookie-actions">
        <button className="button secondary" onClick={() => choose(false)}>Tout refuser</button>
        <button className="button" onClick={() => choose(true)}>Tout accepter</button>
      </div>
    </aside>
  );
}
