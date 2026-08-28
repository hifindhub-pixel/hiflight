import type { Metadata } from "next";
import { FaqAccordion } from "@/components/ServiceFaq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Réponses aux questions fréquentes sur les recherches et réservations HiFlight.",
  alternates: { canonical: "/faq" },
};

const questions = [
  { question: "Comment fonctionne HiFlight ?", answer: "HiFlight vous aide à rechercher et comparer les principales étapes d’un voyage : vols, hôtels, voitures, trains, bus et eSIM. Vous finalisez ensuite la réservation auprès du partenaire sélectionné." },
  { question: "Est-ce que HiFlight vend directement les billets ?", answer: "Non. HiFlight prépare ou compare votre recherche, puis vous redirige vers le partenaire qui assure la réservation, le paiement et le service après-vente." },
  { question: "Pourquoi le prix peut-il changer ?", answer: "Les tarifs et disponibilités sont dynamiques. Le montant définitif est toujours celui affiché par le partenaire avant le paiement." },
  { question: "La recherche est-elle gratuite ?", answer: "Oui. HiFlight ne facture aucun frais pour utiliser ses outils de recherche." },
  { question: "HiFlight reçoit-il une commission ?", answer: "HiFlight peut percevoir une commission lorsqu’une réservation est effectuée via un lien partenaire, sans coût supplémentaire pour vous." },
  { question: "Qui contacter pour modifier ou annuler une réservation ?", answer: "Contactez directement le partenaire indiqué dans votre confirmation. HiFlight ne peut pas modifier une commande passée sur un autre site." },
  { question: "Puis-je réserver un hôtel ou une voiture ?", answer: "Oui. Les rubriques Hôtels et Voitures permettent de préparer une recherche avec vos lieux, vos dates et vos préférences." },
  { question: "Comment gérer mes données et mes cookies ?", answer: "La politique de confidentialité explique les données traitées. Le bouton « Cookies » en bas du site permet de modifier votre choix à tout moment." },
  { question: "Comment contacter HiFlight ?", answer: "Vous pouvez écrire à contact@hiflight.fr pour toute question concernant le site." },
] as const;

export default function FaqPage() {
  return (
    <main>
      <section className="page-hero small"><div><h1>Questions fréquentes</h1></div></section>
      <FaqAccordion title="Tout savoir avant votre prochain voyage" items={questions} compact />
    </main>
  );
}
