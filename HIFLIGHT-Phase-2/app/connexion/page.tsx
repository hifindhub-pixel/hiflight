import type { Metadata } from "next";
import AuthExperience from "@/components/AuthExperience";

export const metadata: Metadata = { title: "Se connecter", description: "Connexion au compte HiFlight.", robots: { index: false, follow: false }, alternates: { canonical: "/connexion" } };

export default function ConnexionPage() {
  return <AuthExperience />;
}
