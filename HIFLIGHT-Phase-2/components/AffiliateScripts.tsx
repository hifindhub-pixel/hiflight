"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "hiflight-consent-v1";

export default function AffiliateScripts() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(localStorage.getItem(CONSENT_KEY) === "accepted");
    const update = (event: Event) => setAllowed(Boolean((event as CustomEvent<{ accepted: boolean }>).detail?.accepted));
    window.addEventListener("hiflight-consent", update);
    return () => window.removeEventListener("hiflight-consent", update);
  }, []);

  if (!allowed) return null;
  return <Script id="cj-deep-link-automation" src="https://www.anrdoezrs.net/am/101723457/impressions/page/am.js" strategy="afterInteractive" />;
}
