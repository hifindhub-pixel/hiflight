import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/cgu", destination: "/conditions", permanent: true },
      { source: "/terms", destination: "/conditions", permanent: true },
      { source: "/privacy", destination: "/confidentialite", permanent: true },
      { source: "/legal", destination: "/mentions-legales", permanent: true },
      { source: "/support", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
