import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site HiFlight.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Legal() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Mentions légales</h1></div></section>
      <article className="article legal">
        <h2>Éditeur</h2>
        <p>Le site hiflight.fr et les services HiFlight sont édités sous la marque HIFLIGHT. Contact : <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a>.</p>
        <h2>Directeur de la publication</h2>
        <p>Le directeur de la publication est le représentant légal de l’éditeur de HIFLIGHT.</p>
        <h2>Hébergement</h2>
        <p>Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.</p>
        <h2>Nature du service</h2>
        <p>HIFLIGHT est un service de recherche et de comparaison de voyages exploité avec des technologies et contenus fournis par plusieurs partenaires. Les réservations, paiements et services après-vente sont assurés par le partenaire sélectionné par l’utilisateur.</p>
        <h2>Liens affiliés</h2>
        <p>HiFlight peut percevoir une commission si vous réservez via certains liens, sans coût supplémentaire pour vous. Les prix et conditions applicables sont ceux affichés par chaque partenaire avant la réservation.</p>
        <h2>Propriété intellectuelle</h2>
        <p>La marque HIFLIGHT, les textes, éléments graphiques et contenus propres au site sont protégés. Toute reproduction non autorisée est interdite.</p>
      </article>
    </main>
  );
}
