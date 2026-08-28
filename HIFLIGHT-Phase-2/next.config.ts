import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/conditions", destination: "/conditions-utilisations", permanent: true },
      { source: "/cgu", destination: "/conditions-utilisations", permanent: true },
      { source: "/terms", destination: "/conditions-utilisations", permanent: true },
      { source: "/confidentialite", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/privacy", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/politique-confidentialite", destination: "/politique-de-confidentialite", permanent: true },
      { source: "/legal", destination: "/mentions-legales", permanent: true },
      { source: "/support", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
