import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique relative aux cookies",
  description: "Informations sur les cookies et traceurs utilisés par HiFlight.",
  alternates: { canonical: "/politique-cookies" },
};

export default function CookiePolicy() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Politique relative aux cookies</h1></div></section>
      <article className="article legal">
        <p>Dernière mise à jour : 30 août 2026.</p>
        <h2>Votre choix</h2>
        <p>HiFlight ne charge les traceurs non essentiels qu’après votre accord. Vous pouvez accepter ou refuser avec le même niveau de simplicité. Le bouton « Cookies », présent sur chaque page, permet de modifier ce choix à tout moment. Le choix est conservé pendant six mois au maximum.</p>
        <h2>Traceur essentiel</h2>
        <p><strong>hiflight-consent-v1</strong> mémorise uniquement votre choix de confidentialité. Il est nécessaire au fonctionnement du panneau et expire au plus tard après six mois.</p>
        <h2>Mesure d’audience et publicité</h2>
        <p>Google Analytics peut mesurer les pages consultées et les interactions afin d’améliorer le site. Les outils de mesure publicitaire Google et Meta ne sont activés que lorsqu’ils sont configurés et après votre accord. Les signaux de consentement publicitaire sont refusés par défaut.</p>
        <h2>Avis et affiliation</h2>
        <p>Après votre accord, Trustpilot peut afficher et mesurer le widget d’avis, tandis que les scripts automatiques Impact et CJ peuvent mesurer les performances d’affiliation. Lorsque vous choisissez volontairement un lien partenaire, le site externe peut aussi attribuer ce clic selon sa propre politique. HiFlight peut recevoir une commission lorsqu’une réservation éligible est finalisée, sans surcoût ajouté par HiFlight.</p>
        <h2>Services de comparaison intégrés</h2>
        <p>Lorsque vous ouvrez ou utilisez une rubrique concernée, Airalo/Travelpayouts, Omio ou Stay22 peuvent recevoir les données techniques et critères nécessaires pour afficher le service demandé. La réservation et le paiement ont lieu auprès du partenaire, selon sa propre politique de confidentialité.</p>
        <h2>Données Google</h2>
        <p>Google explique comment les données provenant de sites et d’applications utilisant ses services sont traitées sur sa page <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">Responsabilité des données d’entreprise</a>.</p>
        <h2>Nous contacter</h2>
        <p>Pour toute question sur vos données ou vos choix : <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a>.</p>
      </article>
    </main>
  );
}
