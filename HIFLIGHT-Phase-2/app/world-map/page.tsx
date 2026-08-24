import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "World Map", description: "Retrouvez bientôt votre World Map HiFlight sur le web." };

export default function WorldMapPage() {
  return <main><section className="page-hero"><div><p className="eyebrow">HiFlight World Map</p><h1>Vos voyages,<br /><span>sur une seule carte.</span></h1><p>La World Map de l’application HiFlight sera prochainement disponible sur le site avec la synchronisation de vos destinations.</p></div></section><article className="article"><h2>La carte arrive sur le web</h2><p>Vous pourrez retrouver les pays visités, vos prochaines destinations et votre passeport HiFlight depuis le même compte.</p><Link className="text-link" href="/">Retour à l’accueil</Link></article></main>;
}
