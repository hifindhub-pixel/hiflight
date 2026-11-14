import type { Metadata } from "next";
import FavoritesExperience from "@/components/FavoritesExperience";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez les trajets que vous avez enregistrés sur HiFlight, avec leur prix indicatif.",
  alternates: { canonical: "/favoris" },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() { return <FavoritesExperience />; }
