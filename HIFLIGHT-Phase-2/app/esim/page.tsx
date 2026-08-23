import type { Metadata } from "next";
import EsimExplorer from "@/components/EsimExplorer";

export const metadata: Metadata = { title: "Comparer les eSIM de voyage", description: "Comparez les forfaits eSIM Airalo, Saily, Yesim et d'autres offres pour rester connecté à l'étranger." };

export default function EsimPage() {
  return <main className="market-page esim-page"><EsimExplorer /></main>;
}
