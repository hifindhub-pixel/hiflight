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
    relatedRoutes: ["paris-alger", "alger-paris", "paris-oran", "oran-paris", "marseille-alger", "lyon-alger", "toulouse-alger"]
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
    relatedRoutes: ["paris-marrakech", "marrakech-paris", "lyon-marrakech", "paris-casablanca"]
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
  },
  {
    slug: "quand-reserver-vol-pas-cher",
    metaTitle: "Quand réserver un vol pas cher ? Les règles utiles",
    title: "Quand réserver un vol pas cher : les règles qui marchent vraiment",
    description: "Il n’existe pas de jour magique pour réserver un vol. Voici ce qui fait réellement baisser le prix : dates flexibles, jour de départ, comparaison et alertes.",
    published: "2026-11-02",
    updated: "2026-11-02",
    readingMinutes: 5,
    intro: "On lit partout qu’il faut réserver un mardi à 3 h du matin. En pratique, ce qui compte, ce sont vos dates, votre aéroport de départ et le moment où vous comparez. Voici les règles qui servent vraiment.",
    sections: [
      {
        heading: "Le jour de la réservation compte peu, le jour du voyage beaucoup",
        paragraphs: [
          "Les compagnies fixent leurs prix en fonction du remplissage de chaque vol. Ce qui change le prix, c’est donc surtout la date de départ : un vol en milieu de semaine est souvent moins cher qu’un vendredi ou un dimanche, et les vacances scolaires font monter les tarifs.",
          "Sur chaque page de vol HiFlight, un tableau montre le jour de la semaine le moins cher quand les données sont suffisantes. Regardez-le avant de choisir vos dates."
        ]
      },
      {
        heading: "Comparer sur plusieurs mois, pas sur une seule date",
        paragraphs: [
          "Le prix d’un même trajet varie beaucoup d’un mois à l’autre. En regardant le calendrier des prix par mois, vous voyez tout de suite les périodes où le trajet est le plus abordable, puis vous réservez dans cette fenêtre.",
          "Si vos dates sont fixes, comparez au moins la veille et le lendemain : un décalage d’un jour peut suffire à économiser."
        ]
      },
      {
        heading: "Réserver tôt ou attendre ?",
        paragraphs: [
          "Il n’y a pas de règle valable pour tous les trajets. Pour les périodes très demandées (été, fêtes, ponts), attendre réduit le choix et fait monter les prix. Pour une escapade hors vacances, les prix restent souvent stables plusieurs semaines à l’avance.",
          "Le plus sûr : comparer dès que vous avez une idée de dates, repérer la fourchette de prix habituelle, puis réserver quand une offre vous semble raisonnable."
        ]
      },
      {
        heading: "Comparer le prix total, bagages compris",
        paragraphs: [
          "Un billet à 40 € sans bagage peut revenir plus cher qu’un billet à 70 € avec bagage en soute. Avant de réserver, ajoutez le bagage, le choix du siège et le transfert jusqu’à l’aéroport."
        ],
        list: [
          "choisissez des dates en milieu de semaine quand c’est possible ;",
          "comparez plusieurs aéroports de départ, y compris en province ;",
          "ajoutez le bagage dont vous avez besoin avant de comparer ;",
          "vérifiez les conditions de modification et d’annulation."
        ]
      }
    ],
    relatedRoutes: ["paris-barcelone", "paris-lisbonne", "paris-marrakech", "lyon-barcelone"]
  },
  {
    slug: "vol-pas-cher-depuis-province",
    metaTitle: "Vol pas cher depuis la province : sans passer par Paris",
    title: "Partir de Lyon, Marseille, Nice, Toulouse, Bordeaux ou Nantes : quand c’est plus avantageux",
    description: "Partir de la province évite le trajet vers Paris. Voici quand un vol direct depuis Lyon, Marseille, Nice, Toulouse, Bordeaux ou Nantes est le meilleur choix.",
    published: "2026-11-02",
    updated: "2026-11-02",
    readingMinutes: 5,
    intro: "Beaucoup de voyageurs prennent le train jusqu’à Paris par habitude. Or les grands aéroports régionaux proposent des vols directs vers le Maghreb, l’Espagne, le Portugal ou le Royaume-Uni. Voici comment savoir si c’est plus avantageux.",
    sections: [
      {
        heading: "Le vrai coût d’un départ de Paris",
        paragraphs: [
          "Un billet moins cher depuis Paris peut devenir plus cher une fois ajoutés le train, la nuit d’hôtel éventuelle et le temps perdu. Pour comparer honnêtement, calculez le coût total du trajet de porte à porte."
        ]
      },
      {
        heading: "Les destinations les mieux servies depuis la province",
        paragraphs: [
          "Les liaisons vers le Maroc, l’Algérie, la Tunisie, l’Espagne, le Portugal et Londres sont proposées depuis la plupart des grands aéroports régionaux. L’offre varie selon la saison : certaines lignes sont quotidiennes, d’autres seulement quelques fois par semaine.",
          "Sur HiFlight, vous trouverez des pages de vol pour chaque départ, avec la durée, les prix par mois et les jours les moins chers."
        ],
        list: [
          "Lyon : Barcelone, Madrid, Lisbonne, Londres, Rome, Istanbul, Tunis, Casablanca, Oran ;",
          "Marseille : Marrakech, Casablanca, Tunis, Istanbul, Barcelone, Londres ;",
          "Nice : Londres, Madrid, Rome, Alger, Marrakech, New York ;",
          "Toulouse : Marrakech, Casablanca, Londres, Madrid, Barcelone ;",
          "Bordeaux et Nantes : Alger, Marrakech, Casablanca, Tunis, Barcelone, Lisbonne."
        ]
      },
      {
        heading: "Comparer deux aéroports en deux minutes",
        paragraphs: [
          "Ouvrez la page du vol depuis votre ville et celle depuis la ville voisine ou depuis Paris. Notez le prix de départ, la durée et le coût du transport jusqu’à l’aéroport. Choisissez le total le plus bas, en gardant une marge de sécurité pour le trajet."
        ]
      }
    ],
    relatedRoutes: ["lyon-barcelone", "marseille-marrakech", "nice-londres", "toulouse-casablanca", "bordeaux-marrakech", "nantes-lisbonne"]
  },
  {
    slug: "week-end-europe-vol-pas-cher",
    metaTitle: "Week-end en Europe pas cher : Barcelone, Lisbonne, Londres",
    title: "Week-end pas cher en Europe : comment choisir la destination et le vol",
    description: "Barcelone, Lisbonne, Rome, Madrid ou Londres : comment choisir un week-end court au meilleur prix, quels jours partir et quels pièges éviter sur les bagages.",
    published: "2026-11-02",
    updated: "2026-11-02",
    readingMinutes: 5,
    intro: "Un week-end de trois jours se décide vite, et c’est là qu’on paie le plus cher quand on ne compare pas. Voici une méthode simple pour choisir la destination et le vol.",
    sections: [
      {
        heading: "Partir du budget, pas de la destination",
        paragraphs: [
          "Plutôt que de viser une ville précise, regardez les prix de plusieurs capitales pour les mêmes dates : Barcelone, Lisbonne, Madrid, Rome, Londres. L’écart entre deux villes peut changer le budget du week-end."
        ]
      },
      {
        heading: "Les jours qui coûtent moins cher",
        paragraphs: [
          "Un départ le jeudi soir ou le vendredi tôt, avec un retour le dimanche soir, est très demandé. Décaler d’un jour, en partant le jeudi matin ou en revenant le lundi, fait souvent baisser le prix.",
          "Les pages de vol HiFlight affichent le jour de la semaine le moins cher lorsque les données le permettent."
        ]
      },
      {
        heading: "Les pièges d’un vol court",
        paragraphs: [
          "Sur un vol court, le bagage en soute peut doubler le prix du billet. Voyager avec un seul bagage à main permet souvent de rester sous le tarif de base ; vérifiez les dimensions autorisées avant de réserver."
        ],
        list: [
          "comparez au moins trois destinations pour les mêmes dates ;",
          "ajoutez le transfert aéroport – centre à votre budget ;",
          "vérifiez l’heure d’arrivée et de retour pour ne pas perdre une demi-journée ;",
          "choisissez un tarif avec modification possible si vos dates ne sont pas sûres."
        ]
      }
    ],
    relatedRoutes: ["paris-barcelone", "paris-lisbonne", "paris-londres", "paris-rome", "paris-madrid"]
  },
  {
    slug: "vol-maroc-tunisie-quand-reserver",
    metaTitle: "Vol Maroc et Tunisie : quand réserver et d’où partir",
    title: "Vols vers le Maroc et la Tunisie : quand réserver et d’où partir pour payer moins",
    description: "Marrakech, Casablanca, Agadir, Tunis : à quelle période réserver, quels aéroports de départ comparer et comment éviter les surprises sur les bagages.",
    published: "2026-11-02",
    updated: "2026-11-02",
    readingMinutes: 5,
    intro: "Le Maroc et la Tunisie sont parmi les destinations les plus demandées depuis la France. Les prix varient fortement selon la ville de départ, la saison et les bagages. Voici comment s’y retrouver.",
    sections: [
      {
        heading: "Les périodes les plus chères",
        paragraphs: [
          "Les vacances scolaires, les ponts et les fêtes religieuses concentrent la demande. Les dates des fêtes religieuses changent chaque année : regardez les prix autour de ces dates avant de vous décider.",
          "En dehors de ces périodes, un départ en semaine est souvent nettement moins cher."
        ]
      },
      {
        heading: "Comparer plusieurs villes de départ",
        paragraphs: [
          "Les vols vers le Maroc partent de Paris, mais aussi de Lyon, Marseille, Nice, Toulouse, Bordeaux, Nantes, Lille et Bâle-Mulhouse. Vers la Tunisie, les vols directs partent de plusieurs villes de province. L’offre change selon la saison."
        ]
      },
      {
        heading: "Bagages et franchises",
        paragraphs: [
          "Sur ces liaisons, beaucoup de voyageurs emportent plus qu’un bagage à main. Comparez le prix en incluant le bagage en soute : un tarif d’appel sans bagage n’est pas toujours le moins cher au final.",
          "Pensez aussi aux formalités d’entrée : elles dépendent de votre nationalité et de la durée de séjour. Vérifiez-les sur le site officiel avant de réserver."
        ],
        list: [
          "comparez au moins deux aéroports de départ ;",
          "regardez les prix mois par mois avant de fixer vos dates ;",
          "ajoutez le bagage dont vous avez besoin ;",
          "gardez une marge pour le trajet jusqu’à l’aéroport."
        ]
      }
    ],
    relatedRoutes: ["paris-marrakech", "paris-casablanca", "paris-tunis", "lyon-casablanca", "marseille-tunis", "toulouse-marrakech"]
  },
  {
    slug: "billet-avion-pas-cher-astuces",
    metaTitle: "Billet d’avion pas cher : 10 astuces utiles",
    title: "Billet d’avion pas cher : 10 astuces qui marchent vraiment (et 3 qui ne servent à rien)",
    description: "Comment payer un billet d’avion moins cher : dates flexibles, aéroport, bagages, escales, alertes de prix. 10 astuces concrètes à tester avant de réserver.",
    published: "2026-11-02",
    updated: "2026-11-02",
    readingMinutes: 7,
    intro: "Le billet d’avion est souvent le premier poste de dépense d’un voyage. Il n’y a pas de formule magique, mais une méthode : savoir ce qui fait vraiment varier le prix, et le vérifier avant de payer. Voici dix astuces concrètes, puis trois idées reçues à oublier.",
    sections: [
      {
        heading: "Astuces 1 à 3 : jouer sur vos dates",
        paragraphs: [
          "C’est le levier le plus puissant, parce que les compagnies ajustent leurs prix selon le remplissage de chaque vol.",
          "Astuce 1 : cherchez sur tout le mois plutôt que sur une date. Un calendrier des prix par mois montre en quelques secondes les périodes où le trajet est le plus abordable. Sur chaque page de vol HiFlight, un graphique donne le prix de départ mois par mois.",
          "Astuce 2 : choisissez le bon jour de la semaine. Un départ en milieu de semaine est souvent moins cher qu’un vendredi ou un dimanche. Quand les données sont suffisantes, la page du vol affiche le jour le moins cher.",
          "Astuce 3 : décalez d’un jour ou deux. Les vacances scolaires, les ponts et les fêtes concentrent la demande. Partir la veille ou revenir le lendemain peut changer le tarif de façon importante."
        ]
      },
      {
        heading: "Astuces 4 à 6 : choisir son trajet",
        paragraphs: [
          "Astuce 4 : comparez plusieurs aéroports de départ. Au départ de Paris, Orly, Roissy et Beauvais ne proposent pas les mêmes prix. En province, un vol direct depuis Lyon, Marseille, Nice, Toulouse, Bordeaux ou Nantes peut coûter moins cher qu’un billet depuis Paris une fois ajouté le train.",
          "Astuce 5 : comparez plusieurs destinations. Si vous cherchez surtout une escapade, regardez Barcelone, Lisbonne, Madrid, Rome et Londres pour les mêmes dates : l’écart de prix peut décider de la destination.",
          "Astuce 6 : testez avec et sans escale. Une escale fait souvent baisser le prix, mais allonge le voyage. Notez la durée totale et la durée de la correspondance avant de choisir : une correspondance trop courte est un risque, une trop longue est une journée perdue."
        ]
      },
      {
        heading: "Astuces 7 à 10 : éviter les mauvaises surprises",
        paragraphs: [
          "Astuce 7 : comparez le prix total, bagages compris. Un billet à 40 € sans bagage peut dépasser un billet à 70 € avec bagage en soute. Ajoutez le bagage, le siège éventuel et le transport jusqu’à l’aéroport.",
          "Astuce 8 : vérifiez les conditions de modification et d’annulation. Un tarif très bas est souvent non modifiable. Si vos dates ne sont pas sûres, un tarif plus souple peut coûter moins cher qu’un changement de billet.",
          "Astuce 9 : comparez plusieurs sites avant de payer. Un comparateur affiche les offres de plusieurs partenaires ; le prix final et les frais peuvent différer d’un partenaire à l’autre.",
          "Astuce 10 : surveillez le prix avec une alerte. Si vous avez le temps, repérez le prix habituel du trajet, puis réservez quand une offre passe sous ce niveau. Sans repère, il est difficile de savoir si un prix est bon."
        ]
      },
      {
        heading: "Trois idées reçues à oublier",
        paragraphs: [
          "Réserver un mardi à 3 h du matin : les sources se contredisent, et rien ne prouve un effet fiable. Ce qui change le prix, c’est le trajet et la date du voyage, pas l’heure de la réservation.",
          "Effacer ses cookies ou naviguer en mode privé : l’effet n’est pas démontré. Comparer sur plusieurs sites est plus utile.",
          "Toujours attendre la dernière minute : pour les périodes très demandées, attendre réduit le choix et fait monter les prix. La dernière minute ne marche que si vous êtes très flexible."
        ],
        list: [
          "Cherchez sur un mois entier, pas sur une seule date.",
          "Comparez au moins deux aéroports et deux destinations.",
          "Ajoutez toujours le bagage avant de comparer.",
          "Gardez une marge pour les correspondances."
        ]
      },
      {
        heading: "Questions fréquentes",
        paragraphs: [
          "Quel est le meilleur moment pour réserver ? Il n’existe pas de règle valable pour tous. Hors vacances, les prix restent souvent stables plusieurs semaines avant le départ ; pour l’été et les fêtes, il vaut mieux comparer tôt.",
          "Quel jour est le moins cher pour voler ? Le plus souvent le milieu de semaine. La page de chaque vol indique le jour le moins cher quand les données le permettent.",
          "Un comparateur est-il vraiment gratuit ? Oui pour l’utilisateur : HiFlight peut recevoir une commission du partenaire en cas de réservation, sans surcoût pour vous.",
          "Les prix affichés sont-ils garantis ? Non : ce sont des prix indicatifs constatés récemment. Le prix final est confirmé chez le partenaire au moment de la réservation."
        ]
      }
    ],
    relatedRoutes: ["paris-barcelone", "paris-lisbonne", "lyon-marrakech", "marseille-tunis", "paris-londres"]
  }
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
