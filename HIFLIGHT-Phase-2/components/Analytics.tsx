"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}


export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);
}

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [allowed, setAllowed] = useState(false);
  const validGaId = gaId && /^G-[A-Z0-9]+$/i.test(gaId) ? gaId : "";
  const validAdsId = adsId && /^AW-[0-9]+$/i.test(adsId) ? adsId : "";
  const validMetaId = metaId && /^[0-9]+$/.test(metaId) ? metaId : "";
  const loaderId = validGaId || validAdsId;

  useEffect(() => {
    setAllowed(readConsent() === "accepted");
    const update = (event: Event) => setAllowed(Boolean((event as CustomEvent<{ accepted: boolean }>).detail?.accepted));
    window.addEventListener("hiflight-consent", update);
    return () => window.removeEventListener("hiflight-consent", update);
  }, []);

  return (
    <>
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
      </Script>
      {loaderId && allowed ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`} strategy="afterInteractive" />
          <Script id="ga-config" strategy="afterInteractive">
            {`window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});window.gtag('js',new Date());${validGaId ? `window.gtag('config','${validGaId}',{anonymize_ip:true});` : ""}${validAdsId ? `window.gtag('config','${validAdsId}');` : ""}`}
          </Script>
        </>
      ) : null}
      {validMetaId && allowed ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','${validMetaId}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
