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

  return (
    <>
      <Script id="impact-affiliate-tracking" strategy="afterInteractive">
        {"(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7671073-7827-44f2-ad25-a30f19bbfa731.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');"}
      </Script>
      <Script id="cj-deep-link-automation" src="https://www.anrdoezrs.net/am/101723457/impressions/page/am.js" strategy="afterInteractive" />
      <Script id="trustpilot-widget" src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" strategy="afterInteractive" />
    </>
  );
}
