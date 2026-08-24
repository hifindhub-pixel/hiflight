import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Se connecter", description: "Connexion au compte HiFlight." };

export default function ConnexionPage() {
  return <main><section className="page-hero"><div><p className="eyebrow">Compte HiFlight</p><h1>Retrouvez bientôt<br /><span>tous vos voyages.</span></h1><p>La connexion permettra de synchroniser l’application, la World Map, le passeport et vos recherches sur le site.</p></div></section><article className="article"><h2>Connexion en préparation</h2><p>Le compte web sera activé avec la World Map. Aucune donnée de connexion n’est collectée sur cette page pour le moment.</p><Link className="text-link" href="/">Retour à l’accueil</Link></article></main>;
}
