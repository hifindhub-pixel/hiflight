import { ImageResponse } from "next/og";
import { flightRoutes } from "@/lib/content";

export const alt = "Comparateur de vols HiFlight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() { return flightRoutes.map(({ slug }) => ({ slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = flightRoutes.find((item) => item.slug === slug);
  const origin = route?.origin ?? "HiFlight";
  const destination = route?.destination ?? "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#07152b", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
          <span style={{ color: "#FF6B6B" }}>Hi</span>
          <span>Flight</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#9cabc0", marginBottom: 18 }}>Comparateur de vols</div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1.05 }}>
            {destination ? `${origin} – ${destination}` : origin}
          </div>
          {route ? <div style={{ display: "flex", fontSize: 34, color: "#FF6B6B", marginTop: 26 }}>{`Vol direct ${route.duration} · prix, bagages, escales`}</div> : null}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9cabc0" }}>hiflight.fr · Gratuit, sans inscription</div>
      </div>
    ),
    size
  );
}
