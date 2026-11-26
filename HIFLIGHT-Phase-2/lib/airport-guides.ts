export type AirportGuide = {
  metaTitle: string;
  description: string;
  /** Position géographique (WGS84), arrondie. */
  geo: { latitude: number; longitude: number };
  distance: string;
  toCentre: string;
  bestFor: string;
  facts: { label: string; value: string }[];
  access: { mode: string; detail: string }[];
  terminals: string;
  tips: string[];
  faq: { question: string; answer: string }[];
  /** Court résumé en anglais : une partie des recherches Google vers ces pages est en anglais. */
  english: string[];
};

// Repères pratiques volontairement arrondis : horaires, tarifs et lignes évoluent.
// Les vérifier sur le site de l’aéroport ou de la compagnie avant de partir.
export const airportGuides: Record<string, AirportGuide> = {
  "paris-charles-de-gaulle": {
    metaTitle: "Aéroport Charles de Gaulle (CDG) : accès, terminaux",
    description: "Roissy-CDG : accès en RER B et en bus, terminaux 1, 2 et 3, temps de transfert et conseils pour comparer vos vols au départ de l’aéroport parisien.",
    geo: { latitude: 49.0097, longitude: 2.5479 },
    distance: "environ 25 km au nord-est de Paris",
    toCentre: "35 à 60 min",
    bestFor: "Long-courriers, correspondances, grandes compagnies",
    facts: [
      { label: "Code", value: "CDG (Roissy-en-France)" },
      { label: "Distance", value: "environ 25 km du centre de Paris" },
      { label: "Terminaux", value: "1, 2 (plusieurs halls) et 3" },
      { label: "Accès principal", value: "RER B, bus, taxi, voiture" }
    ],
    access: [
      { mode: "RER B", detail: "Relie le centre de Paris (Châtelet-Les Halles, Gare du Nord) aux gares de l’aéroport en 35 à 45 minutes environ. C’est le moyen le plus économique, mais la ligne peut être perturbée : gardez de la marge." },
      { mode: "Bus", detail: "Des liaisons en bus desservent l’aéroport depuis plusieurs points de Paris. Comptez environ une heure selon la circulation." },
      { mode: "Taxi", detail: "Un tarif forfaitaire existe entre Paris et l’aéroport. Vérifiez-le avant de monter ; la durée varie beaucoup aux heures de pointe." },
      { mode: "Voiture", detail: "L’aéroport est desservi par l’autoroute A1. Comparez le coût du parking avec celui des transports en commun si vous partez plusieurs jours." }
    ],
    terminals: "Le terminal et le hall dépendent de la compagnie et de la destination : vérifiez-les sur votre confirmation de réservation. Des navettes gratuites relient les terminaux entre eux ; prévoyez du temps si vous devez changer de terminal.",
    tips: [
      "Arrivez au moins deux heures avant un vol court ou moyen-courrier, et trois heures avant un long-courrier.",
      "Si votre billet comprend une correspondance, vérifiez le temps minimum entre deux vols : la taille de l’aéroport allonge les trajets.",
      "Comparez le prix du billet avec celui d’Orly : un vol moins cher peut coûter plus cher une fois le transfert ajouté."
    ],
    faq: [
      { question: "Combien de temps faut-il pour aller à Roissy-CDG depuis le centre de Paris ?", answer: "Comptez 35 à 45 minutes en RER B, environ une heure en bus et de 40 minutes à plus d’une heure en taxi selon la circulation. Prévoyez toujours une marge." },
      { question: "Quels sont les terminaux de Roissy-CDG ?", answer: "L’aéroport compte les terminaux 1, 2 (divisé en plusieurs halls) et 3. Votre terminal est indiqué sur la confirmation de votre vol." },
      { question: "Faut-il choisir CDG ou Orly pour son vol ?", answer: "Roissy est plus éloigné mais offre davantage de destinations long-courriers. Orly est plus proche du centre de Paris. Comparez le prix du billet, le temps de transfert et l’horaire du vol." }
    ],
    english: [
      "Paris Charles de Gaulle Airport (CDG) is the main international airport of Paris, about 25 km north-east of the city centre.",
      "The RER B suburban train and several bus lines link it to central Paris in roughly 35 to 60 minutes. Check your terminal on your booking confirmation before you leave."
    ]
  },
  "paris-orly": {
    metaTitle: "Aéroport Paris-Orly (ORY) : accès, terminaux",
    description: "Orly : accès par la ligne 14 du métro, le tramway T7 et les bus, bâtiments Orly 1-2 et Orly 3-4, temps de transfert et conseils pour comparer vos vols.",
    geo: { latitude: 48.7233, longitude: 2.3794 },
    distance: "environ 13 km au sud de Paris",
    toCentre: "25 à 45 min",
    bestFor: "Maghreb, Outre-mer, Europe, vols courts",
    facts: [
      { label: "Code", value: "ORY (Orly)" },
      { label: "Distance", value: "environ 13 km du centre de Paris" },
      { label: "Bâtiments", value: "Orly 1-2 et Orly 3-4" },
      { label: "Accès principal", value: "Métro ligne 14, tramway T7, bus, taxi" }
    ],
    access: [
      { mode: "Métro ligne 14", detail: "La ligne 14 dessert l’aéroport depuis son prolongement de 2024 et le relie au centre de Paris en une trentaine de minutes environ." },
      { mode: "Tramway T7", detail: "Le tramway T7 relie l’aéroport à Villejuif, où l’on retrouve le métro. C’est une alternative selon votre point de départ." },
      { mode: "Bus", detail: "Plusieurs lignes de bus relient l’aéroport à Paris et à la banlieue sud." },
      { mode: "Taxi", detail: "Orly est proche du centre : le taxi est souvent plus rapide que pour Roissy, mais la durée dépend des embouteillages." }
    ],
    terminals: "L’aéroport est organisé en deux bâtiments principaux, Orly 1-2 et Orly 3-4. Le bâtiment dépend de votre compagnie : vérifiez-le sur votre confirmation de réservation avant de partir.",
    tips: [
      "Orly est apprécié pour les vols courts et pour les liaisons vers le Maghreb et l’Outre-mer : comparez-le avec Roissy.",
      "Arrivez au moins deux heures avant un vol court ou moyen-courrier.",
      "Le trajet jusqu’à l’aéroport est plus court que pour Roissy ou Beauvais : tenez-en compte dans le prix total."
    ],
    faq: [
      { question: "Comment aller à Orly depuis le centre de Paris ?", answer: "La ligne 14 du métro, le tramway T7 et plusieurs lignes de bus desservent l’aéroport. Comptez une trentaine de minutes par la ligne 14 depuis le centre." },
      { question: "Orly ou Roissy-CDG : lequel choisir ?", answer: "Orly est plus proche de Paris et pratique pour les vols courts et moyens. Roissy propose davantage de long-courriers. Comparez le prix, l’horaire et le coût du transfert." },
      { question: "Quels bâtiments à Orly ?", answer: "Orly se compose de deux bâtiments, Orly 1-2 et Orly 3-4. Le bon bâtiment est indiqué sur votre confirmation de vol." }
    ],
    english: [
      "Paris Orly Airport (ORY) is located about 13 km south of Paris and handles many European, North African and overseas flights.",
      "Metro line 14, tram T7 and buses connect it to the city; allow roughly 25 to 45 minutes to reach the centre."
    ]
  },
  "paris-beauvais": {
    metaTitle: "Aéroport Paris-Beauvais (BVA) : navette, accès",
    description: "Paris-Beauvais : navette depuis Porte Maillot, durée du trajet, compagnies à bas coûts et conseils pour calculer le prix total d’un vol au départ de BVA.",
    geo: { latitude: 49.4544, longitude: 2.1128 },
    distance: "environ 85 km au nord de Paris",
    toCentre: "1 h 15 à 1 h 30",
    bestFor: "Vols à bas coût, budgets serrés",
    facts: [
      { label: "Code", value: "BVA (Beauvais-Tillé)" },
      { label: "Distance", value: "environ 85 km de Paris" },
      { label: "Terminal", value: "un terminal unique" },
      { label: "Accès principal", value: "Navette depuis Paris-Porte Maillot" }
    ],
    access: [
      { mode: "Navette bus", detail: "Une navette relie Paris-Porte Maillot à l’aéroport en 1 h 15 à 1 h 30 environ. Ses départs sont calés sur les horaires des vols : consultez-les avant de réserver. Le billet de navette est à ajouter au prix du vol." },
      { mode: "Train + navette", detail: "On peut rejoindre la gare de Beauvais depuis Paris-Nord, puis prendre une navette ou un taxi jusqu’à l’aéroport, situé à quelques kilomètres." },
      { mode: "Taxi", detail: "Le trajet est long et coûteux depuis Paris ; il peut se justifier à plusieurs ou pour un horaire où la navette ne circule pas." },
      { mode: "Voiture", detail: "L’aéroport est accessible par l’A16. Comparez le coût du parking avec celui de la navette." }
    ],
    terminals: "Beauvais compte un seul terminal, ce qui simplifie l’orientation. L’aéroport accueille surtout des compagnies à bas coûts, avec des vols réguliers vers l’Europe et l’Afrique du Nord.",
    tips: [
      "Ajoutez à votre budget la navette aller et retour, et le temps de trajet (près de trois heures cumulées) : un billet très bas peut cesser d’être avantageux.",
      "Vérifiez l’horaire de la dernière navette si votre vol arrive tard : elle est liée aux vols, pas à un horaire fixe.",
      "Arrivez à l’aéroport suffisamment tôt : les dépôts de bagages et contrôles peuvent être longs en période de forte affluence."
    ],
    faq: [
      { question: "À quelle distance de Paris est l’aéroport de Beauvais ?", answer: "Beauvais-Tillé est situé à environ 85 km au nord de Paris. La navette depuis Porte Maillot prend 1 h 15 à 1 h 30 environ." },
      { question: "Comment aller à l’aéroport de Beauvais ?", answer: "La navette depuis Paris-Porte Maillot est l’option la plus courante. Il existe aussi la combinaison train jusqu’à Beauvais puis navette ou taxi, ou la voiture par l’A16." },
      { question: "Un vol au départ de Beauvais est-il vraiment moins cher ?", answer: "Le billet est souvent moins cher, mais la navette, le temps de trajet et d’éventuels bagages en option s’ajoutent. Comparez le prix total avec un départ d’Orly ou de Roissy." }
    ],
    english: [
      "Paris Beauvais Airport (BVA) is about 85 km north of Paris and mainly serves low-cost airlines.",
      "A coach shuttle runs from Porte Maillot in Paris and takes roughly 1 hour 15 to 1 hour 30; the shuttle ticket is usually bought in addition to your flight, so compare the total cost with Orly or Charles de Gaulle."
    ]
  }
};
