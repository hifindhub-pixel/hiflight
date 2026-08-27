import type { Metadata } from "next";
import WorldMapExperience from "@/components/WorldMapExperience";

export const metadata: Metadata = { title: "World Map et passeport", description: "Retrouvez vos pays visités, vos prochaines destinations et votre passeport HiFlight.", alternates: { canonical: "/world-map" } };

export default function WorldMapPage() {
  return <WorldMapExperience />;
}
