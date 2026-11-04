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
    intro: "Paris offre le plus grand choix de vols de France : trois aéroports, énormément de destinations directes et des tarifs qui varient beaucoup de l’un à l’autre.",
    tip: "Roissy, Orly, Beauvais : comparez les trois, et comptez le trajet jusqu’à l’aéroport dans le prix. Beauvais est à plus de 80 km de Paris." },
  { slug: "lyon", name: "Lyon", code: "LYS", from: "depuis Lyon", airport: "Lyon-Saint-Exupéry (LYS)",
    intro: "Depuis Lyon-Saint-Exupéry, des vols directs desservent l’Espagne, le Portugal, le Royaume-Uni, l’Italie, la Turquie et le Maghreb, sans repasser par Paris.",
    tip: "Un billet moins cher depuis Paris n’en est pas forcément un : ajoutez le TGV, et parfois une nuit d’hôtel, avant de comparer à un direct depuis Lyon." },
  { slug: "marseille", name: "Marseille", code: "MRS", from: "depuis Marseille", airport: "Marseille-Provence (MRS)",
    intro: "Marseille-Provence est l’une des grandes portes de la France vers la Méditerranée, avec des vols directs vers le Maghreb, l’Espagne, l’Italie, la Turquie et le Royaume-Uni.",
    tip: "L’aéroport est à environ 25 km du centre : comptez le transfert dans votre budget et dans votre horaire." },
  { slug: "nice", name: "Nice", code: "NCE", from: "depuis Nice", airport: "Nice-Côte d’Azur (NCE)",
    intro: "Nice-Côte d’Azur dessert l’Europe, le Maghreb et plusieurs destinations long-courrier, dont New York et Dubaï, avec un aéroport à une dizaine de minutes du centre.",
    tip: "Vous ne savez pas où partir ? Comparez deux ou trois destinations aux mêmes dates : l’écart de prix surprend souvent." },
  { slug: "toulouse", name: "Toulouse", code: "TLS", from: "depuis Toulouse", airport: "Toulouse-Blagnac (TLS)",
    intro: "Toulouse-Blagnac propose des vols directs vers l’Espagne, le Portugal, le Royaume-Uni, la Turquie et le Maghreb, de quoi éviter Paris pour tout le Sud-Ouest.",
    tip: "Les vols directs ne partent pas tous les jours : regardez les jours de desserte avant de fixer vos dates." },
  { slug: "bordeaux", name: "Bordeaux", code: "BOD", from: "depuis Bordeaux", airport: "Bordeaux-Mérignac (BOD)",
    intro: "Bordeaux-Mérignac relie l’Aquitaine à l’Espagne, au Portugal, au Royaume-Uni et au Maghreb, avec une forte présence des compagnies à bas prix.",
    tip: "Sur les compagnies à bas prix, comparez le prix valise comprise : c’est lui qui compte au final." },
  { slug: "nantes", name: "Nantes", code: "NTE", from: "depuis Nantes", airport: "Nantes-Atlantique (NTE)",
    intro: "Nantes-Atlantique offre aux voyageurs de l’Ouest des vols directs vers l’Espagne, le Portugal, le Royaume-Uni et le Maghreb.",
    tip: "Regardez les départs en milieu de semaine : ils sont souvent moins chers que ceux du week-end." },
  { slug: "lille", name: "Lille", code: "LIL", from: "depuis Lille", airport: "Lille-Lesquin (LIL)",
    intro: "Depuis Lille-Lesquin, les vols directs sont moins nombreux qu’à Paris, mais l’aéroport reste utile pour le Maghreb, l’Espagne et le Portugal.",
    tip: "Si vos dates sont fixes, comparez avec un départ de Paris ou de Bruxelles : l’écart de prix peut valoir le trajet." },
  { slug: "bale-mulhouse", name: "Bâle-Mulhouse", code: "BSL", from: "depuis Bâle-Mulhouse", airport: "Bâle-Mulhouse – EuroAirport (BSL)",
    intro: "L’EuroAirport de Bâle-Mulhouse, côté français, dessert l’Alsace et la région frontalière avec des vols vers le Maghreb, l’Espagne et le Royaume-Uni.",
    tip: "L’aéroport est franco-suisse : vérifiez le côté de la frontière du vol et les codes BSL ou MLH." },
];

export const getCity = (slug: string) => departureCities.find((city) => city.slug === slug);
