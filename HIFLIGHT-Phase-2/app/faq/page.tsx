import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Réponses aux questions fréquentes sur les recherches et réservations HiFlight.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Questions fréquentes</h1></div></section>
      <article className="article legal">
        <h2>Est-ce que HiFlight vend directement les billets ?</h2>
        <p>Non. HiFlight prépare ou compare votre recherche, puis vous redirige vers le partenaire qui assure la réservation, le paiement et le service après-vente.</p>
        <h2>Pourquoi le prix peut-il changer ?</h2>
        <p>Les prix et disponibilités sont dynamiques. Le montant définitif est toujours celui affiché par le partenaire avant le paiement.</p>
        <h2>La recherche est-elle gratuite ?</h2>
        <p>Oui. HiFlight ne facture aucun frais pour utiliser ses outils de recherche.</p>
        <h2>HiFlight reçoit-il une commission ?</h2>
        <p>HiFlight peut percevoir une commission lorsqu’une réservation est effectuée via un lien partenaire, sans coût supplémentaire pour vous.</p>
        <h2>Qui contacter pour modifier ou annuler une réservation ?</h2>
        <p>Contactez directement le partenaire indiqué dans votre confirmation de réservation. HiFlight ne peut pas modifier une commande passée sur un autre site.</p>
        <h2>Comment gérer mes données et mes cookies ?</h2>
        <p>Consultez notre <Link href="/confidentialite">politique de confidentialité</Link>. Le bouton « Cookies » en bas du site permet de modifier votre choix.</p>
        <h2>Une autre question ?</h2>
        <p>Écrivez-nous à <a href="mailto:contact@hiflight.fr">contact@hiflight.fr</a>.</p>
      </article>
    </main>
  );
}
