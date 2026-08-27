import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d’utilisation",
  description: "Conditions d’utilisation du comparateur et des services HiFlight.",
  alternates: { canonical: "/conditions" },
};

export default function ConditionsPage() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Conditions d’utilisation</h1></div></section>
      <article className="article legal">
        <p>Dernière mise à jour : 27 août 2026.</p>
        <h2>Objet du service</h2>
        <p>HiFlight permet de rechercher et comparer des services de voyage. HiFlight n’est ni une compagnie aérienne, ni un hôtelier, ni un loueur, ni une agence de voyages et ne réalise aucune réservation directement.</p>
        <h2>Réservation auprès des partenaires</h2>
        <p>La réservation, le paiement, la confirmation, la modification, l’annulation et le service après-vente sont assurés par le partenaire sélectionné. Ses tarifs, disponibilités et conditions contractuelles s’appliquent avant toute validation.</p>
        <h2>Prix et informations</h2>
        <p>Les prix et disponibilités peuvent évoluer entre l’affichage sur HiFlight et l’ouverture du site partenaire. Vérifiez toujours le prix total, les bagages, assurances, frais, conditions d’âge, horaires et modalités d’annulation sur la page finale.</p>
        <h2>Liens affiliés</h2>
        <p>HiFlight peut recevoir une commission lorsqu’une réservation est effectuée via certains liens, sans supplément de prix pour l’utilisateur. Cette rémunération ne modifie pas les conditions proposées par le partenaire.</p>
        <h2>Compte HiFlight</h2>
        <p>Vous êtes responsable de la confidentialité de vos accès et de l’exactitude des informations enregistrées dans votre espace. L’utilisation du service à des fins frauduleuses, automatisées ou portant atteinte à son fonctionnement est interdite.</p>
        <h2>Responsabilité</h2>
        <p>HiFlight s’efforce de présenter des informations fiables, mais ne garantit pas l’exhaustivité permanente des offres fournies par des tiers. HiFlight n’est pas responsable de l’exécution du voyage ou de la prestation réservée auprès d’un partenaire.</p>
        <h2>Propriété intellectuelle</h2>
        <p>Les marques, textes, éléments graphiques et fonctionnalités propres à HiFlight sont protégés. Toute extraction ou reproduction non autorisée est interdite.</p>
        <h2>Droit applicable et contact</h2>
        <p>Ces conditions sont soumises au droit français. Pour toute question : <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a>.</p>
      </article>
    </main>
  );
}
