type FaqItem = { question: string; answer: string };

const serviceFaqs = {
  flights: {
    title: "Réserver vos vols avec HiFlight",
    items: [
      { question: "Comment fonctionne la recherche de vols HiFlight ?", answer: "Indiquez votre départ, votre destination, vos dates et vos voyageurs. HiFlight prépare la recherche puis ouvre les résultats disponibles sur son moteur partenaire." },
      { question: "Puis-je réserver directement auprès de HiFlight ?", answer: "HiFlight vous aide à rechercher et comparer. La réservation, le paiement et le service après-vente sont ensuite assurés par le partenaire choisi." },
      { question: "Pourquoi le prix d’un vol peut-il changer ?", answer: "Les tarifs aériens évoluent selon les disponibilités, l’heure de la recherche et les conditions de chaque offre. Le prix définitif est celui affiché avant le paiement." },
      { question: "Puis-je rechercher uniquement des vols directs ?", answer: "Oui. Activez l’option « Vols directs uniquement » avant de lancer votre recherche." },
      { question: "Comment vérifier le vrai prix du voyage ?", answer: "Contrôlez les bagages inclus, les frais de paiement, les conditions de modification et l’aéroport utilisé avant de réserver." },
      { question: "HiFlight propose-t-il aussi des hôtels ?", answer: "Oui. Lors d’une recherche de vol, HiFlight peut également préparer un séjour avec la même destination et les mêmes dates." },
    ],
  },
  hotels: {
    title: "Trouver votre hôtel avec HiFlight",
    items: [
      { question: "Comment rechercher un hôtel ?", answer: "Choisissez une destination, vos dates et le nombre de voyageurs. Les résultats disponibles sont ensuite actualisés dans la rubrique Hôtels." },
      { question: "Les prix affichés sont-ils définitifs ?", answer: "Les prix et disponibilités peuvent évoluer. Vérifiez toujours le montant total, les taxes et les conditions sur la page du partenaire avant le paiement." },
      { question: "Puis-je voir les hôtels sur une carte ?", answer: "Oui. La carte vous aide à comparer les emplacements, les quartiers et la proximité avec les points d’intérêt." },
      { question: "Qui gère ma réservation d’hôtel ?", answer: "Le partenaire sélectionné gère la réservation, le paiement, la confirmation, les modifications et les annulations." },
      { question: "Comment choisir le bon quartier ?", answer: "Comparez la distance avec vos activités, les transports disponibles et le temps de trajet réel plutôt que le prix seul." },
      { question: "La recherche d’hôtel est-elle gratuite ?", answer: "Oui. HiFlight ne vous facture aucun frais pour utiliser la recherche." },
    ],
  },
  cars: {
    title: "Louer une voiture avec HiFlight",
    items: [
      { question: "Comment fonctionne la recherche de voiture ?", answer: "Indiquez le lieu de retrait, les dates, les horaires et l’âge du conducteur. HiFlight transmet ces critères à Expedia dans un nouvel onglet." },
      { question: "Puis-je restituer la voiture dans une autre ville ?", answer: "Oui. Choisissez « Autre lieu », puis indiquez le lieu de restitution souhaité avant de lancer la recherche." },
      { question: "Pourquoi l’âge du conducteur est-il demandé ?", answer: "Certains loueurs appliquent des conditions ou des frais différents selon l’âge. Le tarif final est confirmé par le partenaire." },
      { question: "Qui gère la réservation et la caution ?", answer: "Expedia ou le loueur indiqué sur l’offre gère la réservation. Vérifiez les règles de caution, de carte bancaire et d’assurance avant le paiement." },
      { question: "Puis-je aussi louer une moto ou un scooter ?", answer: "Oui. La carte BikesBooking vous permet de consulter les motos et scooters disponibles auprès de ce partenaire." },
      { question: "Que faut-il vérifier avant de réserver ?", answer: "Contrôlez le kilométrage, le carburant, la caution, les assurances, le passage de frontières et les conditions d’annulation." },
    ],
  },
  ground: {
    title: "Voyager en train ou en bus avec HiFlight",
    items: [
      { question: "Comment rechercher un trajet en train ou en bus ?", answer: "Choisissez votre départ, votre arrivée et votre date. Les horaires et tarifs disponibles s’ouvrent ensuite chez le partenaire." },
      { question: "Les résultats s’ouvrent-ils dans un nouvel onglet ?", answer: "Oui. Votre page HiFlight reste ouverte pendant que vous consultez les résultats du partenaire." },
      { question: "Puis-je comparer train et bus ?", answer: "Selon l’itinéraire, le partenaire peut présenter plusieurs modes de transport afin de comparer durée, horaire et prix." },
      { question: "Qui gère mon billet après l’achat ?", answer: "Le partenaire auprès duquel vous réservez assure le paiement, l’émission du billet et le service après-vente." },
      { question: "Pourquoi choisir le train plutôt que l’avion ?", answer: "Sur certaines liaisons, un départ en centre-ville réduit les transferts et le temps d’attente. Comparez toujours la durée totale du voyage." },
    ],
  },
  esim: {
    title: "Choisir votre eSIM avec HiFlight",
    items: [
      { question: "Qu’est-ce qu’une eSIM de voyage ?", answer: "Une eSIM est un forfait mobile numérique installé sans carte SIM physique. Elle permet d’utiliser des données mobiles dans une destination compatible." },
      { question: "Quand faut-il installer l’eSIM ?", answer: "Installez-la de préférence avant le départ avec une connexion Wi-Fi, puis activez les données à votre arrivée selon les instructions du fournisseur." },
      { question: "Puis-je garder mon numéro principal ?", answer: "Oui, sur la plupart des téléphones double SIM. Vérifiez la compatibilité de votre appareil et les réglages recommandés par le fournisseur." },
      { question: "Comment choisir le volume de données ?", answer: "Estimez votre consommation selon la durée du séjour, la navigation, les appels en ligne et le partage de connexion." },
      { question: "Qui fournit le forfait eSIM ?", answer: "Le fournisseur sélectionné, comme Airalo, Saily ou Yesim, assure l’achat, l’activation et l’assistance." },
    ],
  },
} as const;

export type ServiceFaqKey = keyof typeof serviceFaqs;

export function FaqAccordion({ title, items, compact = false }: { title: string; items: readonly FaqItem[]; compact?: boolean }) {
  return (
    <section className={compact ? "faq-section faq-section-compact" : "faq-section"}>
      <div className="faq-shell">
        <h2>{title}</h2>
        <div className="faq-grid">
          {items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<span aria-hidden="true" /></summary>
              <div><p>{item.answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServiceFaq({ service }: { service: ServiceFaqKey }) {
  const content = serviceFaqs[service];
  return <FaqAccordion title={content.title} items={content.items} />;
}
