// Repères propres à chaque trajet : arrivée sur place et documents.
// Vérifiés le 26 novembre 2026 (exploitants des transports, conseils aux voyageurs, sites officiels d’autorisation).
// Les tarifs ne sont indiqués que lorsqu’ils étaient lisibles à cette date ; à revoir au moins chaque trimestre.
export type RouteGuide = {
  arrivalHeading: string;
  arrival: string[];
  documentsHeading?: string;
  documents?: string[];
};

export const routeGuidesCheckedOn = "2026-11-26";

export const routeGuides: Record<string, RouteGuide> = {
  "paris-marrakech": {
    arrivalHeading: "De l’aéroport Ménara à la médina",
    arrival: [
      "Une navette en bus relie l’aéroport à la ville ; l’office des aéroports marocains l’annonce toutes les 20 minutes, et ALSA exploite la ligne Aéroport L19. Une station de taxis se trouve aussi sur l’esplanade, avec les tarifs affichés au parking taxi.",
      "Avec de grosses valises ou un riad au fond de la médina, prévoyez la fin du trajet à pied : ni le bus ni les voitures ne desservent forcément chaque porte. Demandez à votre hébergement le point de rendez-vous le plus proche."
    ],
    documentsHeading: "Passeport pour le Maroc : ce qu’il faut vérifier",
    documents: [
      "Pour un voyageur français, le passeport est obligatoire et doit rester valable pendant tout le séjour, y compris en voyage organisé. La carte d’identité ne le remplace pas.",
      "Contrôlez sa date d’expiration avant de payer le billet, pour chaque voyageur, enfants compris."
    ]
  },
  "paris-casablanca": {
    arrivalHeading: "De l’aéroport Mohammed V à Casablanca",
    arrival: [
      "La gare se trouve au sous-sol du terminal 1. Le train rejoint Casa-Voyageurs en une trentaine de minutes et dessert aussi Casa-Port ; le billet de 2e classe vers Casa-Voyageurs est annoncé à 50 dirhams.",
      "Avant de choisir un vol tardif, regardez l’horaire du dernier train sur le site de l’ONCF : il conditionne le coût réel de votre arrivée."
    ],
    documentsHeading: "Passeport pour le Maroc : ce qu’il faut vérifier",
    documents: [
      "Un Français doit présenter un passeport valable pendant toute la durée du séjour. C’est aussi le cas en voyage organisé : la carte d’identité ne suffit pas.",
      "Si vous continuez vers Rabat ou une autre ville, gardez ce passeport sur vous pendant le trajet."
    ]
  },
  "paris-alger": {
    arrivalHeading: "De l’aéroport Houari-Boumédiène au centre d’Alger",
    arrival: [
      "Un train de la SNTF relie l’aéroport à la gare d’Agha, au centre d’Alger, en une vingtaine de minutes.",
      "Les horaires peuvent être modifiés en cours d’année : vérifiez le dernier départ auprès de la SNTF avant de choisir un vol qui atterrit le soir."
    ],
    documentsHeading: "Visa pour l’Algérie : à anticiper avant le billet",
    documents: [
      "Un voyageur de nationalité française doit en principe obtenir un visa, auprès du consulat d’Algérie dont dépend son domicile. Si vous avez aussi la nationalité algérienne, renseignez-vous auprès du consulat sur les documents à présenter.",
      "Attendez de connaître votre délai d’obtention avant d’acheter un billet ni modifiable ni remboursable."
    ]
  },
  "paris-tunis": {
    arrivalHeading: "De Tunis-Carthage au centre de Tunis",
    arrival: [
      "Le bus urbain 635 de la TRANSTU relie l’aéroport à la station Tunis Marine, en passant par l’Ariana ; le gestionnaire de l’aéroport annonce environ 25 minutes et un départ par heure. Vérifiez qu’il circule encore à votre heure d’arrivée.",
      "Avec de gros bagages ou en soirée, le taxi est plus simple : demandez la mise en route du compteur au départ."
    ],
    documentsHeading: "Entrer en Tunisie : le passeport est obligatoire",
    documents: [
      "Depuis le 1er janvier 2025, tout visiteur doit présenter un passeport valable au moins 3 mois à la date d’entrée : la carte d’identité ne suffit pas. Pour un Français, aucun visa n’est demandé jusqu’à trois mois de séjour.",
      "Les binationaux franco-tunisiens sont soumis à des règles particulières, avec présentation de leurs deux passeports : vérifiez-les avant le départ."
    ]
  },
  "paris-barcelone": {
    arrivalHeading: "De l’aéroport El Prat au centre de Barcelone",
    arrival: [
      "L’Aerobús circule jour et nuit entre les deux terminaux et la place de Catalogne : c’est le choix le plus direct avec une valise.",
      "Le métro L9 Sud part des terminaux T1 et T2, avec un trajet d’environ 30 minutes sur la ligne, puis une correspondance pour le centre. Les stations de l’aéroport exigent un titre adapté : la carte de 10 trajets T-casual n’y est pas acceptée. TMB affiche le billet métro spécial aéroport à 5,90 € en 2026."
    ]
  },
  "paris-lisbonne": {
    arrivalHeading: "De l’aéroport de Lisbonne au centre, en métro",
    arrival: [
      "La station Aeroporto est le terminus de la ligne rouge. La ligne dessert la gare d’Oriente, puis permet de changer vers la ligne verte à Alameda, la jaune à Saldanha et la bleue à São Sebastião.",
      "Choisissez votre correspondance selon le quartier de votre hébergement. Avec de grosses valises ou une rue en pente à l’arrivée, comparez avec le taxi."
    ]
  },
  "paris-istanbul": {
    arrivalHeading: "De l’aéroport d’Istanbul (IST) au centre",
    arrival: [
      "La ligne de métro M11 rejoint Gayrettepe en une trentaine de minutes, avec une correspondance vers la ligne M2. Dans l’autre direction, elle va jusqu’à Halkalı, où passe le Marmaray.",
      "Ces repères ne valent que pour IST. Si votre billet indique Sabiha Gökçen (SAW), sur la rive asiatique, le trajet est différent : vérifiez le code avant de réserver."
    ],
    documentsHeading: "Carte d’identité ou passeport pour la Turquie",
    documents: [
      "Un Français est dispensé de visa pour un séjour touristique de 90 jours au plus sur 180 jours. Il lui faut une carte d’identité en cours de validité ou un passeport, dont la validité dépasse d’au moins 150 jours la date d’entrée.",
      "Pour éviter une difficulté à l’embarquement, le ministère français des Affaires étrangères conseille de préférer le passeport à une carte d’identité dont la date imprimée est dépassée."
    ]
  },
  "paris-new-york": {
    arrivalHeading: "De JFK à Manhattan",
    arrival: [
      "L’AirTrain relie les terminaux aux gares de Jamaica et de Howard Beach, où l’on prend le métro ou, à Jamaica, le train LIRR. Il est gratuit entre les terminaux et coûte 8,75 dollars pour rejoindre ou quitter ces deux gares ; le métro ou le train se paie en plus.",
      "Ce trajet concerne JFK. Si vous arrivez à Newark (EWR), les transports et les tarifs sont différents."
    ],
    documentsHeading: "ESTA et passeport avant de partir",
    documents: [
      "Un Français qui remplit les conditions du programme d’exemption de visa doit obtenir une autorisation ESTA avant le départ ; sinon, un visa est nécessaire. Le site officiel du gouvernement américain affiche des frais de 40,62 dollars.",
      "Faites la demande sur le site officiel uniquement, et avant d’acheter un billet non remboursable : une autorisation ne garantit pas à elle seule l’admission sur le territoire."
    ]
  },
  "paris-montreal": {
    arrivalHeading: "De Montréal-Trudeau au centre-ville",
    arrival: [
      "L’autobus 747 de la STM relie l’aéroport au centre-ville, jour et nuit. Son titre, affiché à 11,25 dollars canadiens, donne aussi accès au réseau de bus et de métro de la STM pendant 24 heures.",
      "Si votre hébergement est loin d’un arrêt ou d’une station, comparez la durée et le coût avec le taxi."
    ],
    documentsHeading: "AVE pour le Canada : indispensable en avion",
    documents: [
      "Pour un séjour touristique ou d’affaires de moins de six mois, un Français n’a pas besoin de visa, mais doit obtenir une autorisation de voyage électronique (AVE) avant de prendre l’avion. Elle vaut jusqu’à cinq ans, sans dépasser la validité du passeport auquel elle est liée.",
      "Une escale dans un aéroport canadien est aussi concernée. L’AVE ne garantit pas l’entrée : la décision revient à l’agent à la frontière."
    ]
  }
};
