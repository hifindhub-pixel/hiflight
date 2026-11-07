import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: 'camera=(), microphone=(), geolocation=(self "https://www.stay22.com"), payment=()' },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self' https:",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https:",
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:"
        : "script-src 'self' 'unsafe-inline' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      "frame-src 'self' https:",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/blog/billet-avion-pas-cher-astuces", destination: "/blog/quand-reserver-vol-pas-cher", permanent: true },
      { source: "/blog/vol-derniere-minute-astuces", destination: "/blog/quand-reserver-vol-pas-cher", permanent: true },
      { source: "/blog/vol-vacances-scolaires-prix", destination: "/blog/quand-reserver-vol-pas-cher", permanent: true },
      { source: "/blog/bagage-cabine-ou-soute-que-choisir", destination: "/blog/compagnies-low-cost-frais-caches", permanent: true },
      { source: "/blog/vol-direct-ou-escale-que-choisir", destination: "/blog/compagnies-low-cost-frais-caches", permanent: true },
      { source: "/blog/aller-simple-ou-aller-retour", destination: "/blog/compagnies-low-cost-frais-caches", permanent: true },
      { source: "/blog/vol-maroc-tunisie-quand-reserver", destination: "/blog/vol-pas-cher-depuis-province", permanent: true },
      { source: "/conditions", destination: "/conditions-utilisations", permanent: true },
      { source: "/cgu", destination: "/conditions-utilisations", permanent: true },
      { source: "/terms", destination: "/conditions-utilisations", permanent: true },
      { source: "/confidentialite", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/privacy", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/politique-confidentialite", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/legal", destination: "/mentions-legales", permanent: true },
      { source: "/support", destination: "/faq", permanent: true },
      { source: "/blog/black-friday-voyage-2026-voyage-prive-edreams", destination: "/blog/black-friday-voyage-2026-dates-conseils", permanent: true },
    ];
  },
};

export default nextConfig;
