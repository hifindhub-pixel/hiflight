import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et gestion des cookies HiFlight.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function Privacy() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Politique de confidentialité</h1></div></section>
      <article className="article legal">
        <p>Dernière mise à jour : 28 août 2026.</p>
        <h2>Responsable du traitement</h2>
        <p>HIFLIGHT · <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a>.</p>
        <h2>Données traitées</h2>
        <p>Lorsque vous créez un compte, HIFLIGHT traite notamment votre adresse e-mail, votre profil, vos préférences, les pays visités et les destinations enregistrées. Lors d’une recherche, les villes, dates, voyageurs et autres critères nécessaires sont transmis au moteur ou au partenaire sélectionné. Des données techniques de sécurité peuvent également être traitées.</p>
        <h2>Finalités et bases légales</h2>
        <p>Les données du compte sont traitées pour fournir les fonctionnalités demandées et exécuter le service. La sécurité, la prévention des abus et la maintenance reposent sur l’intérêt légitime de HIFLIGHT. Les traceurs de mesure, d’avis et d’affiliation non essentiels reposent sur votre consentement. Certaines informations peuvent être conservées pour respecter une obligation légale.</p>
        <h2>Destinataires et partenaires</h2>
        <p>Supabase héberge les comptes et données personnelles de l’espace HiFlight. Vercel héberge le site. Les moteurs de recherche, réseaux d’affiliation et partenaires de réservation reçoivent les critères nécessaires lorsque vous utilisez leurs services ou ouvrez leurs liens.</p>
        <h2>Transferts internationaux</h2>
        <p>Certains prestataires peuvent traiter des données hors de l’Espace économique européen. HIFLIGHT s’appuie alors sur les mécanismes prévus par le RGPD, notamment les décisions d’adéquation ou les clauses contractuelles types, lorsque ces garanties sont requises.</p>
        <h2>Durées de conservation</h2>
        <p>Les données liées au compte sont conservées pendant son utilisation, puis supprimées ou anonymisées après une demande de suppression, sous réserve des obligations légales. Les critères de recherche ne sont conservés que pendant la durée nécessaire au fonctionnement, à la sécurité et aux journaux techniques des prestataires. La preuve de votre choix concernant les cookies est renouvelée au plus tard tous les six mois.</p>
        <h2>Cookies et traceurs</h2>
        <p>Les traceurs non essentiels de mesure d’audience, d’avis, d’affiliation et de publicité sont chargés uniquement après votre accord. Vous pouvez refuser sans perdre l’accès au comparateur et rouvrir à tout moment le panneau depuis le bouton « Cookies ». Le détail des services, finalités et durées figure dans la <Link href="/politique-cookies">politique relative aux cookies</Link>.</p>
        <h2>Vos droits</h2>
        <p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos données, retirer votre consentement ou vous opposer à certains traitements via <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a>. Vous pouvez également adresser une réclamation à la CNIL.</p>
        <h2>Conditions d’utilisation</h2>
        <p>Les règles du service figurent dans les <Link href="/conditions-utilisations">conditions d’utilisation</Link>.</p>
      </article>
    </main>
  );
}
