export type RouteRegion = "Algérie" | "Maroc et Tunisie" | "Europe" | "Long-courrier";

export type FlightRoute = {
  slug: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  region: RouteRegion;
  /** Titre affiché en H1. */
  title: string;
  /** Titre court pour la balise <title> (le gabarit ajoute « | HiFlight »). */
  metaTitle: string;
  description: string;
  /** Durée moyenne d’un vol direct, exprimée de façon approximative. */
  duration: string;
  /** Compagnies fréquemment présentes sur la liaison (varie selon la saison). */
  carriers: string[];
  arrivalAirports: string;
  intro: string;
  season: string;
  tip: string;
  /** Date de dernière révision éditoriale (ISO), utilisée dans le sitemap. */
  updated: string;
};

type RouteSeed = Omit<FlightRoute, "title" | "metaTitle" | "description" | "updated">;

const routesUpdated = "2026-10-30";

const routeSeeds: RouteSeed[] = [
  // Algérie
  {
    slug: "paris-alger", origin: "Paris", originCode: "PAR", destination: "Alger", destinationCode: "ALG", region: "Algérie",
    duration: "environ 2 h 15", carriers: ["Air Algérie", "Air France", "Transavia"], arrivalAirports: "Alger – Houari-Boumédiène (ALG)",
    intro: "Paris – Alger fait partie des liaisons les plus fréquentées entre la France et le Maghreb, avec plusieurs départs par jour depuis Roissy-Charles de Gaulle et Orly.",
    season: "Les tarifs montent en juillet-août, pendant les vacances scolaires et autour des fêtes religieuses. Les périodes plus calmes (janvier-février, septembre-novembre) sont en général les plus abordables.",
    tip: "Comparez Orly et Roissy : l’aéroport de départ change la compagnie, l’horaire et parfois la franchise de bagage en soute."
  },
  {
    slug: "paris-oran", origin: "Paris", originCode: "PAR", destination: "Oran", destinationCode: "ORN", region: "Algérie",
    duration: "environ 2 h 30", carriers: ["Air Algérie", "Air France", "Transavia"], arrivalAirports: "Oran – Ahmed Ben Bella (ORN)",
    intro: "Oran est l’une des grandes destinations de la diaspora de l’ouest algérien. La liaison depuis Paris est très demandée dès que les vacances approchent.",
    season: "Réservez tôt pour l’été et les fêtes : les derniers sièges à prix modéré partent vite. Hors vacances, les semaines de printemps et d’automne offrent plus de choix.",
    tip: "Vérifiez le poids de bagage en soute inclus dans le tarif : la différence entre deux offres proches peut disparaître au moment d’ajouter une valise."
  },
  {
    slug: "marseille-alger", origin: "Marseille", originCode: "MRS", destination: "Alger", destinationCode: "ALG", region: "Algérie",
    duration: "environ 1 h 50", carriers: ["Air Algérie", "Transavia"], arrivalAirports: "Alger – Houari-Boumédiène (ALG)",
    intro: "Depuis Marseille-Provence, Alger se rejoint en moins de deux heures : c’est l’une des traversées les plus courtes entre la France et l’Algérie.",
    season: "Les départs du week-end et des vacances d’été sont les plus chers. En semaine et hors saison, les écarts de prix entre deux jours voisins peuvent être importants.",
    tip: "Si vous habitez entre Marseille et Montpellier, comparez aussi un départ depuis Montpellier ou Lyon avant de décider."
  },
  {
    slug: "marseille-oran", origin: "Marseille", originCode: "MRS", destination: "Oran", destinationCode: "ORN", region: "Algérie",
    duration: "environ 1 h 50", carriers: ["Air Algérie", "Transavia"], arrivalAirports: "Oran – Ahmed Ben Bella (ORN)",
    intro: "Marseille – Oran relie deux villes portuaires de la Méditerranée occidentale, pour un vol direct d’un peu moins de deux heures.",
    season: "La demande se concentre sur l’été, les congés scolaires et les fêtes. Décaler son départ de quelques jours suffit souvent à faire baisser le prix.",
    tip: "Contrôlez les horaires d’arrivée : un vol tardif peut compliquer le trajet jusqu’à votre destination finale."
  },
  {
    slug: "lyon-alger", origin: "Lyon", originCode: "LYS", destination: "Alger", destinationCode: "ALG", region: "Algérie",
    duration: "environ 2 h", carriers: ["Air Algérie", "Transavia"], arrivalAirports: "Alger – Houari-Boumédiène (ALG)",
    intro: "Lyon-Saint-Exupéry dessert Alger en vol direct, ce qui évite de passer par Paris pour les voyageurs de la région Auvergne-Rhône-Alpes.",
    season: "Comme sur les autres liaisons algériennes, juillet, août et les fêtes sont les périodes les plus chères. Le printemps et l’automne offrent des tarifs plus souples.",
    tip: "Comparez avec un départ depuis Marseille ou Paris : un billet plus bas peut compenser un trajet en train supplémentaire."
  },
  {
    slug: "toulouse-alger", origin: "Toulouse", originCode: "TLS", destination: "Alger", destinationCode: "ALG", region: "Algérie",
    duration: "environ 2 h", carriers: ["Air Algérie", "Transavia"], arrivalAirports: "Alger – Houari-Boumédiène (ALG)",
    intro: "Au départ de Toulouse-Blagnac, Alger est accessible en vol direct d’environ deux heures, pratique pour l’Occitanie et le sud-ouest.",
    season: "Surveillez les vacances scolaires de la zone Toulouse et l’été : les prix y progressent nettement. Hors pointe, la liaison reste plus accessible.",
    tip: "Les fréquences sont moins nombreuses que depuis Paris : si votre date est fixe, comparez tôt pour garder le choix des horaires."
  },
  // Maroc et Tunisie
  {
    slug: "paris-marrakech", origin: "Paris", originCode: "PAR", destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie",
    duration: "environ 3 h 15", carriers: ["Royal Air Maroc", "Air France", "Transavia", "easyJet", "Ryanair"], arrivalAirports: "Marrakech-Ménara (RAK)",
    intro: "Marrakech est l’une des destinations soleil les plus demandées depuis Paris, avec des vols réguliers et low cost depuis Roissy, Orly et Beauvais.",
    season: "Le printemps et l’automne offrent un climat agréable et des prix souvent plus modérés qu’en vacances scolaires. L’été est très chaud sur place et la demande y est moins soutenue côté loisirs.",
    tip: "Les offres low cost partent parfois de Beauvais : ajoutez le coût et la durée du transfert avant de comparer avec Orly ou Roissy."
  },
  {
    slug: "paris-casablanca", origin: "Paris", originCode: "PAR", destination: "Casablanca", destinationCode: "CMN", region: "Maroc et Tunisie",
    duration: "environ 3 h", carriers: ["Royal Air Maroc", "Air France", "Transavia"], arrivalAirports: "Casablanca – Mohammed V (CMN)",
    intro: "Casablanca est la porte d’entrée économique du Maroc et un point de correspondance vers l’Afrique de l’Ouest. La liaison depuis Paris compte de nombreux vols par jour.",
    season: "Les périodes de forte demande sont l’été, les vacances scolaires et les fêtes. En dehors, les prix varient surtout selon le jour de la semaine.",
    tip: "Si vous continuez vers une autre ville marocaine, comparez un billet unique avec correspondance et deux billets séparés : les conditions de bagage changent."
  },
  {
    slug: "paris-tunis", origin: "Paris", originCode: "PAR", destination: "Tunis", destinationCode: "TUN", region: "Maroc et Tunisie",
    duration: "environ 2 h 30", carriers: ["Tunisair", "Air France", "Transavia"], arrivalAirports: "Tunis – Carthage (TUN)",
    intro: "Paris – Tunis est une liaison de proximité très utilisée pour les séjours en famille comme pour les courts voyages.",
    season: "Comptez des tarifs plus élevés en été et pendant les vacances scolaires. Les mois de printemps et d’automne offrent un meilleur rapport prix-confort.",
    tip: "Vérifiez les horaires de retour : certaines offres peu chères imposent un départ très tôt le matin."
  },
  {
    slug: "lyon-marrakech", origin: "Lyon", originCode: "LYS", destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie",
    duration: "environ 2 h 50", carriers: [], arrivalAirports: "Marrakech-Ménara (RAK)",
    intro: "Depuis Lyon-Saint-Exupéry, Marrakech se rejoint en moins de trois heures, ce qui en fait une escapade courte ou un séjour prolongé.",
    season: "Les week-ends prolongés et les vacances scolaires font monter les prix. Un départ en milieu de semaine est souvent plus abordable.",
    tip: "Les fréquences changent selon la saison : comparez plusieurs dates avant de bloquer vos congés."
  },
  // Europe
  {
    slug: "paris-barcelone", origin: "Paris", originCode: "PAR", destination: "Barcelone", destinationCode: "BCN", region: "Europe",
    duration: "environ 1 h 55", carriers: ["Vueling", "Air France", "Transavia", "easyJet"], arrivalAirports: "Barcelone – El Prat (BCN)",
    intro: "Barcelone est l’une des escapades européennes les plus courues depuis Paris, avec de nombreux vols quotidiens.",
    season: "Les week-ends de printemps et d’été sont les plus demandés. En semaine, hors vacances, les billets sont souvent bien moins chers.",
    tip: "Comparez avec le train : la durée totale (centre à centre) peut rivaliser avec l’avion une fois les transferts aéroport ajoutés."
  },
  {
    slug: "paris-lisbonne", origin: "Paris", originCode: "PAR", destination: "Lisbonne", destinationCode: "LIS", region: "Europe",
    duration: "environ 2 h 30", carriers: ["TAP Air Portugal", "Air France", "Transavia", "easyJet"], arrivalAirports: "Lisbonne – Humberto-Delgado (LIS)",
    intro: "Lisbonne attire toute l’année grâce à son climat doux. L’aéroport est proche du centre, ce qui limite le coût du transfert.",
    season: "L’été et les ponts de printemps sont les plus chers. L’automne et le début de l’hiver offrent un bon équilibre entre météo et budget.",
    tip: "L’aéroport se trouve à une courte distance du centre-ville en métro : le transfert pèse peu dans le prix total du voyage."
  },
  {
    slug: "paris-madrid", origin: "Paris", originCode: "PAR", destination: "Madrid", destinationCode: "MAD", region: "Europe",
    duration: "environ 2 h", carriers: ["Iberia", "Air France", "Vueling", "Transavia"], arrivalAirports: "Madrid – Adolfo-Suárez Barajas (MAD)",
    intro: "Paris – Madrid est une liaison dense, utile autant pour les week-ends que pour les déplacements professionnels.",
    season: "Les périodes de pointe sont les ponts, les vacances d’été et de Noël. Hors pointe, les prix baissent sensiblement en semaine.",
    tip: "Pour un déplacement professionnel, comparez les horaires de retour du soir : ils changent beaucoup d’une compagnie à l’autre."
  },
  {
    slug: "paris-rome", origin: "Paris", originCode: "PAR", destination: "Rome", destinationCode: "ROM", region: "Europe",
    duration: "environ 2 h 10", carriers: ["ITA Airways", "Air France", "easyJet", "Vueling"], arrivalAirports: "Rome – Fiumicino (FCO) ou Ciampino (CIA)",
    intro: "Rome est desservie par deux aéroports. Le tarif le plus bas n’est pas toujours le meilleur choix une fois le transfert vers le centre pris en compte.",
    season: "Printemps et début d’automne sont très demandés. Les semaines moins touristiques (novembre, février) permettent de trouver des vols plus abordables.",
    tip: "Comparez les deux aéroports de Rome : le temps et le coût du transfert vers le centre diffèrent."
  },
  {
    slug: "paris-londres", origin: "Paris", originCode: "PAR", destination: "Londres", destinationCode: "LON", region: "Europe",
    duration: "environ 1 h 20", carriers: ["British Airways", "Air France", "easyJet"], arrivalAirports: "Londres – Heathrow, Gatwick, Stansted, Luton ou City",
    intro: "Londres compte cinq aéroports. Selon celui de l’offre, le trajet jusqu’au centre peut faire perdre plus de temps que le vol lui-même.",
    season: "Les week-ends et les vacances scolaires britanniques et françaises sont les plus chers. En semaine et hors saison, les tarifs sont plus souples.",
    tip: "Sur un si court trajet, comparez avec l’Eurostar en durée totale, bagages inclus, avant de choisir l’avion."
  },
  {
    slug: "paris-istanbul", origin: "Paris", originCode: "PAR", destination: "Istanbul", destinationCode: "IST", region: "Europe",
    duration: "environ 3 h 20", carriers: ["Turkish Airlines", "Air France", "Pegasus"], arrivalAirports: "Istanbul (IST) ou Sabiha Gökçen (SAW)",
    intro: "Istanbul se rejoint depuis Paris en un peu plus de trois heures, avec deux aéroports situés de part et d’autre du Bosphore.",
    season: "Le printemps et l’automne sont agréables et très demandés. L’été et les fêtes font monter les tarifs.",
    tip: "Le second aéroport est plus éloigné du centre historique : prenez en compte le temps de transfert, surtout en cas d’arrivée tardive."
  },
  // Long-courrier
  {
    slug: "paris-new-york", origin: "Paris", originCode: "PAR", destination: "New York", destinationCode: "NYC", region: "Long-courrier",
    duration: "environ 8 h 15", carriers: ["Air France", "Delta", "United", "American Airlines", "French bee"], arrivalAirports: "New York – JFK, Newark (EWR) ou LaGuardia",
    intro: "Paris – New York est une liaison transatlantique très concurrentielle : compagnies régulières, alliances et offres plus économiques s’y côtoient.",
    season: "Les prix sont les plus élevés en été et pendant les fêtes de fin d’année. Les mois d’hiver (hors vacances) et le début du printemps offrent souvent de meilleures offres.",
    tip: "Contrôlez la franchise de bagage en soute, parfois non incluse sur les tarifs les plus bas, ainsi que l’aéroport d’arrivée (JFK ou Newark)."
  },
  {
    slug: "paris-montreal", origin: "Paris", originCode: "PAR", destination: "Montréal", destinationCode: "YUL", region: "Long-courrier",
    duration: "environ 7 h 30", carriers: ["Air Canada", "Air France", "Air Transat"], arrivalAirports: "Montréal – Trudeau (YUL)",
    intro: "Montréal est la porte d’entrée francophone de l’Amérique du Nord, très demandée pour les études, les séjours en famille et le tourisme.",
    season: "L’été et la période des fêtes sont les plus chères. L’automne (couleurs d’automne) attire beaucoup de visiteurs : réservez tôt.",
    tip: "Vérifiez les formalités d’entrée au Canada (autorisation de voyage électronique selon votre nationalité) avant de réserver."
  },
  {
    slug: "lyon-dubai", origin: "Lyon", originCode: "LYS", destination: "Dubaï", destinationCode: "DXB", region: "Long-courrier",
    duration: "environ 6 h 30", carriers: [], arrivalAirports: "Dubaï – International (DXB)",
    intro: "Depuis Lyon, Dubaï se rejoint avec ou sans escale selon les offres. Comparer la durée totale est aussi important que comparer le prix.",
    season: "L’hiver (octobre à avril) est la saison la plus agréable sur place et la plus demandée. L’été est très chaud, avec des tarifs souvent plus bas.",
    tip: "Une escale peut faire baisser le prix mais allonger fortement le voyage : regardez la durée de correspondance avant de choisir."
  }
];

export const flightRoutes: FlightRoute[] = routeSeeds.map((seed) => ({
  ...seed,
  title: `Vol ${seed.origin} – ${seed.destination}`,
  metaTitle: `Vol ${seed.origin} ${seed.destination} pas cher : comparateur`,
  description: `Vol ${seed.origin} – ${seed.destination} (${seed.duration}) : comparez les prix mois par mois, les compagnies, les bagages et les escales. Gratuit, sans inscription.`,
  updated: routesUpdated
}));

export const routeRegions: RouteRegion[] = ["Algérie", "Maroc et Tunisie", "Europe", "Long-courrier"];

export const airports = [
  { slug: "paris-charles-de-gaulle", name: "Paris-Charles de Gaulle", code: "CDG", intro: "Le principal aéroport international parisien. Vérifiez toujours le terminal et le temps de transfert avant votre départ." },
  { slug: "paris-orly", name: "Paris-Orly", code: "ORY", intro: "Un aéroport situé au sud de Paris. Comparez le prix du billet avec le coût et la durée de votre trajet jusqu’à l’aéroport." },
  { slug: "paris-beauvais", name: "Paris-Beauvais", code: "BVA", intro: "Un aéroport plus éloigné de Paris. Une offre moins chère peut perdre son avantage une fois le transfert et le temps de trajet ajoutés." }
];

/** Routes proches de celle-ci : même région, même départ ou même destination. */
export function relatedRoutes(route: FlightRoute, limit = 6): FlightRoute[] {
  return flightRoutes
    .filter((item) => item.slug !== route.slug)
    .map((item) => ({
      item,
      score: (item.destinationCode === route.destinationCode ? 3 : 0) + (item.originCode === route.originCode ? 2 : 0) + (item.region === route.region ? 1 : 0)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function routeFaq(route: FlightRoute): { question: string; answer: string }[] {
  const pair = `${route.origin} – ${route.destination}`;
  const items = [
    { question: `Combien de temps dure un vol ${pair} ?`, answer: `Un vol direct ${pair} dure ${route.duration}. Avec une escale, comptez plus selon la durée de correspondance : comparez la durée totale avant de choisir.` },
    { question: `Quand réserver un vol ${pair} moins cher ?`, answer: route.season },
    { question: `Quel aéroport à l’arrivée pour ${route.destination} ?`, answer: `Les vols arrivent à : ${route.arrivalAirports}. Vérifiez l’aéroport indiqué sur l’offre avant de réserver.` }
  ];
  if (route.carriers.length) {
    items.splice(1, 0, {
      question: `Quelles compagnies assurent ${pair} ?`,
      answer: `Parmi les compagnies fréquemment présentes : ${route.carriers.join(", ")}. L’offre varie selon la saison ; la comparaison affiche celles disponibles à vos dates.`
    });
  }
  return items;
}

export const defaultOgImage = { url: "/hiflight-hero.jpg", width: 1600, height: 900, alt: "Voyage en avion au coucher du soleil" };

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hiflight.fr";
export const searchUrl = process.env.NEXT_PUBLIC_SEARCH_URL || "https://vols.hiflight.fr";
