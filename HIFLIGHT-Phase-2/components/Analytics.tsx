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
  if (typeof window === "undefined" || readConsent() !== "accepted") return;
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);
}

type TravelCategory = "flight" | "hotel" | "car" | "ground" | "esim";

const eventCategoryNames: Record<TravelCategory, string> = {
  flight: "flight",
  hotel: "hotel",
  car: "car",
  ground: "train_bus",
  esim: "esim",
};

export function trackSearch(category: TravelCategory, params: Record<string, string | number> = {}) {
  track("search_started", { category, ...params });
  track(`${eventCategoryNames[category]}_search`, params);
}

export function trackPartnerClick(category: TravelCategory, params: Record<string, string | number> = {}) {
  track("partner_click", { category, ...params });
  track(`${eventCategoryNames[category]}_partner_click`, params);
}

export default function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NN5ZTFT2";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [allowed, setAllowed] = useState(false);
  const validGtmId = /^GTM-[A-Z0-9]+$/i.test(gtmId) ? gtmId : "";
  const validGaId = gaId && /^G-[A-Z0-9]+$/i.test(gaId) ? gaId : "";
  const validAdsId = adsId && /^AW-[0-9]+$/i.test(adsId) ? adsId : "";
  const validMetaId = metaId && /^[0-9]+$/.test(metaId) ? metaId : "";
  // When GTM is configured, Google tags must be managed from the container.
  // The direct gtag loader remains as a safe fallback for deployments without GTM.
  const directLoaderId = validGtmId ? "" : validGaId || validAdsId;

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    setAllowed(readConsent() === "accepted");
    const update = (event: Event) => setAllowed(Boolean((event as CustomEvent<{ accepted: boolean }>).detail?.accepted));
    window.addEventListener("hiflight-consent", update);
    return () => window.removeEventListener("hiflight-consent", update);
  }, []);

  return (
    <>
      {validGtmId && allowed ? (
        <Script id="gtm-after-consent" strategy="afterInteractive">
          {`window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});if(!document.querySelector('script[data-hiflight-gtm]')){var h=document.createElement('script');h.async=true;h.dataset.hiflightGtm='true';h.src='https://www.googletagmanager.com/gtm.js?id=${validGtmId}';document.head.appendChild(h);}`}
        </Script>
      ) : null}
      {directLoaderId && allowed ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${directLoaderId}`} strategy="afterInteractive" />
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
