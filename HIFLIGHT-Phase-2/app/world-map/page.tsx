import type { Metadata } from "next";
import { defaultOgImage, siteUrl } from "@/lib/content";
import WorldMapExperience from "@/components/WorldMapExperience";

export const metadata: Metadata = {
  title: "World Map et passeport de voyage",
  description: "Retrouvez vos pays visités, vos prochaines destinations et votre passeport HiFlight : un globe interactif pour garder le souvenir de tous vos voyages.",
  alternates: { canonical: "/world-map" },
  openGraph: { type: "website", url: `${siteUrl}/world-map/`, images: [defaultOgImage], title: "World Map et passeport de voyage | HiFlight", description: "Retrouvez vos pays visités, vos prochaines destinations et votre passeport HiFlight : un globe interactif pour garder le souvenir de tous vos voyages." },
};

export default function WorldMapPage() {
  return (
    <>
      <h1 style={{ position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>World Map et passeport de voyage HiFlight</h1>
      <WorldMapExperience />
    </>
  );
}
