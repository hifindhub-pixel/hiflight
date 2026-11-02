// Villes de départ françaises couvertes : pages « Vols pas chers depuis … ».
export type DepartureCity = {
  slug: string;
  name: string;
  /** Codes de départ utilisés dans les pages de vols. */
  code: string;
  /** « depuis Lyon », « depuis Bâle-Mulhouse ». */
  from: string;
  airport: string;
  intro: string;
  tip: string;
};

export const departureCities: DepartureCity[] = [
  { slug: "paris", name: "Paris", code: "PAR", from: "depuis Paris", airport: "Paris-Charles-de-Gaulle (CDG), Orly (ORY) et Beauvais (BVA)",
    intro: "Paris est le plus grand choix de vols de France : trois aéroports, de très nombreuses destinations directes et des tarifs qui varient beaucoup d’un aéroport à l’autre.",
    tip: "Comparez les trois aéroports parisiens : le prix, mais aussi le trajet jusqu’à l’aéroport, comptent dans le coût total." },
  { slug: "lyon", name: "Lyon", code: "LYS", from: "depuis Lyon", airport: "Lyon-Saint-Exupéry (LYS)",
    intro: "Depuis Lyon-Saint-Exupéry, des vols directs relient la région à l’Espagne, au Portugal, au Royaume-Uni, à l’Italie, à la Turquie et au Maghreb, sans passer par Paris.",
    tip: "Avant de choisir Paris, comparez le prix total avec un vol direct depuis Lyon : le train jusqu’à Paris et l’hôtel éventuel comptent dans le budget." },
  { slug: "marseille", name: "Marseille", code: "MRS", from: "depuis Marseille", airport: "Marseille-Provence (MRS)",
    intro: "Marseille-Provence est l’une des grandes portes de la France vers la Méditerranée, avec des vols directs vers le Maghreb, l’Espagne, l’Italie, la Turquie et le Royaume-Uni.",
    tip: "L’aéroport est à environ 25 km du centre : prévoyez le transfert dans votre budget et votre horaire." },
  { slug: "nice", name: "Nice", code: "NCE", from: "depuis Nice", airport: "Nice-Côte d’Azur (NCE)",
    intro: "Nice-Côte d’Azur dessert l’Europe, le Maghreb et plusieurs destinations long-courrier, dont New York et Dubaï, avec un aéroport à une dizaine de minutes du centre.",
    tip: "Pour l’Europe, comparez plusieurs destinations aux mêmes dates : l’écart de prix peut être important." },
  { slug: "toulouse", name: "Toulouse", code: "TLS", from: "depuis Toulouse", airport: "Toulouse-Blagnac (TLS)",
    intro: "Toulouse-Blagnac propose des vols directs vers l’Espagne, le Portugal, le Royaume-Uni, la Turquie et le Maghreb pour les voyageurs du Sud-Ouest.",
    tip: "Les vols directs ne partent pas tous les jours vers chaque destination : vérifiez les jours de desserte avant de fixer vos dates." },
  { slug: "bordeaux", name: "Bordeaux", code: "BOD", from: "depuis Bordeaux", airport: "Bordeaux-Mérignac (BOD)",
    intro: "Bordeaux-Mérignac relie l’Aquitaine à l’Espagne, au Portugal, au Royaume-Uni et au Maghreb, avec une forte présence des compagnies à bas prix.",
    tip: "Sur les compagnies à bas prix, comparez le prix bagage compris : c’est lui qui compte au final." },
  { slug: "nantes", name: "Nantes", code: "NTE", from: "depuis Nantes", airport: "Nantes-Atlantique (NTE)",
    intro: "Nantes-Atlantique offre aux voyageurs de l’Ouest des vols directs vers l’Espagne, le Portugal, le Royaume-Uni et le Maghreb.",
    tip: "Regardez aussi les départs en milieu de semaine : ils sont souvent moins chers que ceux du week-end." },
  { slug: "lille", name: "Lille", code: "LIL", from: "depuis Lille", airport: "Lille-Lesquin (LIL)",
    intro: "Depuis Lille-Lesquin, les vols directs sont moins nombreux qu’à Paris ; l’aéroport reste utile pour le Maghreb, l’Espagne et le Portugal.",
    tip: "Comparez avec un départ depuis Paris ou Bruxelles si vos dates sont fixes : la différence de prix peut compenser le trajet." },
  { slug: "bale-mulhouse", name: "Bâle-Mulhouse", code: "BSL", from: "depuis Bâle-Mulhouse", airport: "Bâle-Mulhouse – EuroAirport (BSL)",
    intro: "L’EuroAirport de Bâle-Mulhouse, situé côté français, dessert l’Alsace et la région frontalière avec des vols vers le Maghreb, l’Espagne et le Royaume-Uni.",
    tip: "L’aéroport est franco-suisse : vérifiez bien le côté de la frontière du vol et les codes BSL ou MLH." },
];

export const getCity = (slug: string) => departureCities.find((city) => city.slug === slug);
