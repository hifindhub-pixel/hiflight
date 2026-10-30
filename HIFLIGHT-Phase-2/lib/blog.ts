export type BlogSection = { heading: string; paragraphs: string[]; list?: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  /** Titre court pour la balise <title> (le gabarit ajoute « | HiFlight »). */
  metaTitle: string;
  description: string;
  published: string;
  updated: string;
  readingMinutes: number;
  intro: string;
  sections: BlogSection[];
  relatedRoutes: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "vol-algerie-ete-quand-reserver",
    metaTitle: "Vol Algérie en été : quand réserver ?",
    title: "Vol pour l’Algérie en été : quand réserver et comment payer moins cher",
    description: "Alger, Oran, Constantine : à quel moment réserver un vol pour l’Algérie en été, quels pièges éviter sur les bagages et comment comparer les aéroports de départ.",
    published: "2026-10-30",
    updated: "2026-10-30",
    readingMinutes: 4,
    intro: "Chaque été, les vols entre la France et l’Algérie comptent parmi les plus demandés de la Méditerranée. Les tarifs évoluent vite : voici comment organiser votre réservation pour garder du choix sans payer plus que nécessaire.",
    sections: [
      {
        heading: "Pourquoi les prix montent en été",
        paragraphs: [
          "La demande se concentre sur quelques semaines : vacances scolaires, retours en famille, mariages et fêtes religieuses. Quand les sièges disponibles se raréfient, les compagnies ouvrent des tarifs plus élevés.",
          "Les dates exactes des fêtes religieuses changent chaque année. Si votre voyage tombe à côté, regardez les prix de la veille et du lendemain avant de figer vos dates."
        ]
      },
      {
        heading: "Quand réserver",
        paragraphs: [
          "Il n’existe pas de jour miracle, mais une règle simple : pour juillet-août, plus vous attendez, moins vous avez de choix à tarif modéré. Commencer à comparer plusieurs mois à l’avance permet de suivre l’évolution des prix et de repérer une baisse.",
          "Si vos dates sont flexibles, décalez le départ ou le retour de quelques jours. Un départ en semaine est souvent moins cher qu’un départ le vendredi ou le samedi."
        ]
      },
      {
        heading: "Comparer plusieurs aéroports de départ",
        paragraphs: [
          "Paris n’est pas le seul point de départ. Marseille, Lyon et Toulouse proposent des vols directs vers l’Algérie, avec parfois des horaires plus pratiques selon votre région.",
          "Avant de comparer deux prix, ajoutez le coût du trajet jusqu’à l’aéroport : un billet moins cher peut revenir plus cher une fois le train ou la voiture comptés."
        ]
      },
      {
        heading: "Les points à vérifier avant de payer",
        paragraphs: ["Le prix affiché au départ n’est pas toujours le prix final du voyage."],
        list: [
          "Le bagage en soute : poids inclus, nombre de valises et tarif des bagages supplémentaires.",
          "Le bagage cabine : dimensions et poids autorisés par la compagnie.",
          "Les horaires : une arrivée tardive complique le trajet vers votre ville finale.",
          "Les conditions de modification et d’annulation du tarif choisi.",
          "L’identité du vendeur : compagnie ou agence, et ses frais de service."
        ]
      },
      {
        heading: "Vol direct ou avec escale",
        paragraphs: [
          "Un vol avec escale peut être moins cher, mais il allonge le voyage et expose à un risque de correspondance manquée. Sur des liaisons d’environ deux heures, le vol direct est en général le meilleur choix quand il est disponible à un prix raisonnable."
        ]
      }
    ],
    relatedRoutes: ["paris-alger", "paris-oran", "marseille-alger", "lyon-alger", "toulouse-alger"]
  },
  {
    slug: "vol-paris-marrakech-guide",
    metaTitle: "Vol Paris Marrakech : durée, aéroports, budget",
    title: "Vol Paris – Marrakech : durée, aéroports, meilleur moment et budget",
    description: "Tout savoir avant de réserver un vol Paris – Marrakech : durée, aéroports de départ, compagnies, meilleure période et conseils pour comparer le prix total.",
    published: "2026-10-30",
    updated: "2026-10-30",
    readingMinutes: 4,
    intro: "Marrakech se trouve à environ trois heures de Paris en vol direct. Voici ce qu’il faut savoir pour choisir le bon vol, le bon aéroport et la bonne période.",
    sections: [
      {
        heading: "Durée et fréquence",
        paragraphs: [
          "Comptez environ 3 h 15 de vol direct depuis Paris. Les départs sont nombreux, avec des compagnies régulières et des compagnies low cost selon la saison.",
          "Les vols avec escale existent aussi, mais l’écart de prix doit être suffisant pour compenser plusieurs heures de voyage en plus."
        ]
      },
      {
        heading: "Quel aéroport choisir à Paris",
        paragraphs: [
          "Roissy-Charles de Gaulle, Orly et Beauvais proposent des vols vers Marrakech. Les offres au meilleur prix partent parfois de Beauvais, plus éloigné de Paris : le transfert ajoute du temps et un coût.",
          "Calculez le prix total avant de décider, bagages et transfert compris."
        ]
      },
      {
        heading: "Quel est le meilleur moment pour partir",
        paragraphs: [
          "Le printemps et l’automne offrent en général un climat agréable et des tarifs moins tendus que pendant les vacances scolaires. L’été est très chaud à Marrakech, ce qui limite l’intérêt des longues visites en journée.",
          "Les vacances scolaires françaises, les ponts et les fêtes font monter les prix : si vous le pouvez, partez en semaine et évitez les dates de pointe."
        ]
      },
      {
        heading: "Bagages et formalités",
        paragraphs: [
          "Les tarifs les plus bas n’incluent pas toujours un bagage en soute. Vérifiez la franchise avant de payer et comparez le prix avec bagage compris. Notre guide du bagage cabine détaille les points à contrôler.",
          "Avant de réserver, vérifiez les formalités d’entrée au Maroc selon votre nationalité (validité du passeport, durée du séjour) sur le site officiel du ministère français des Affaires étrangères."
        ]
      },
      {
        heading: "Un budget plus clair",
        paragraphs: [
          "Ajoutez au prix du billet le bagage, le transfert vers l’aéroport de départ et le transfert à l’arrivée. C’est ce total, et non le tarif d’appel, qui doit servir à comparer deux offres."
        ]
      }
    ],
    relatedRoutes: ["paris-marrakech", "lyon-marrakech", "paris-casablanca"]
  },
  {
    slug: "orly-roissy-beauvais-quel-aeroport",
    metaTitle: "Orly, Roissy ou Beauvais : quel aéroport ?",
    title: "Orly, Roissy-CDG ou Beauvais : quel aéroport choisir pour votre vol ?",
    description: "Orly, Roissy-Charles de Gaulle ou Beauvais : comparez accès, durée de transfert et prix total pour choisir l’aéroport parisien le plus adapté à votre départ.",
    published: "2026-10-30",
    updated: "2026-10-30",
    readingMinutes: 3,
    intro: "Le billet le moins cher n’est pas toujours le voyage le moins cher. Le choix de l’aéroport change le temps de trajet, le coût du transfert et parfois la compagnie.",
    sections: [
      {
        heading: "Roissy-Charles de Gaulle (CDG)",
        paragraphs: [
          "Situé au nord-est de Paris, c’est le plus grand aéroport de la région et celui qui propose le plus de destinations long-courriers. Le RER B le relie au centre de Paris ; prévoyez une marge de sécurité, surtout en cas de perturbations.",
          "Sur un vol long-courrier ou avec correspondance, CDG est souvent le choix le plus naturel."
        ]
      },
      {
        heading: "Orly (ORY)",
        paragraphs: [
          "Au sud de Paris, Orly est plus proche du centre et dessert beaucoup de destinations en Europe, au Maghreb et dans les départements d’outre-mer. Le tramway T7 et la ligne 14 du métro améliorent l’accès, selon votre point de départ.",
          "Si vous habitez au sud de Paris, Orly peut vous faire gagner du temps par rapport à Roissy."
        ]
      },
      {
        heading: "Paris-Beauvais (BVA)",
        paragraphs: [
          "Beauvais accueille surtout des compagnies low cost. Il est situé à plus d’une heure de Paris en navette : le prix du billet peut être plus bas, mais le transfert coûte du temps et de l’argent.",
          "Beauvais convient quand l’écart de prix est net et que vos horaires s’accordent avec ceux des navettes."
        ]
      },
      {
        heading: "Comment comparer correctement",
        paragraphs: ["Pour chaque offre, additionnez :"],
        list: [
          "le prix du billet avec les bagages dont vous avez besoin ;",
          "le coût du trajet jusqu’à l’aéroport (transport en commun, taxi, parking) ;",
          "le temps de trajet et la marge de sécurité avant l’enregistrement ;",
          "les horaires de retour, notamment tard le soir."
        ]
      }
    ],
    relatedRoutes: ["paris-marrakech", "paris-barcelone", "paris-lisbonne"]
  }
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
