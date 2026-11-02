import type { RouteStats } from "./route-stats";
import { extraPlaces, extraSeeds } from "./routes-extra";
import { provincePlaces, provinceSeeds } from "./routes-province";
import { province2Places, province2Seeds } from "./routes-province2";

export { countryPages } from "./countries";

export type RouteRegion = "Europe" | "Algérie" | "Maroc et Tunisie" | "Amériques" | "Asie et Moyen-Orient" | "Outre-mer" | "Afrique et Océan Indien";
export type CountrySlug = "espagne" | "italie" | "royaume-uni" | "etats-unis" | "maroc" | "allemagne" | "algerie" | "turquie" | "canada" | "portugal" | "asie" | "outre-mer" | "afrique" | "amerique-latine";

export type FlightRoute = {
  slug: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  region: RouteRegion;
  /** Pays du Maghreb concerné par le trajet (pour les pages pays). */
  country?: CountrySlug;
  /** « retour » = vers la France depuis le Maghreb. */
  direction: "aller" | "retour";
  /** false = pas de vol direct régulier : le trajet se fait avec escale. */
  direct: boolean;
  reverseSlug?: string;
  /** Titre affiché en H1. */
  title: string;
  /** Titre court pour la balise <title> (le gabarit ajoute « | HiFlight »), sans prix. */
  metaTitle: string;
  /** Description sans prix (repli quand les relevés ne sont pas disponibles). */
  description: string;
  /** Durée moyenne d’un vol direct, exprimée de façon approximative. */
  duration: string;
  /** Compagnies fréquemment présentes sur la liaison (varie selon la saison). */
  carriers: string[];
  arrivalAirports: string;
  arrivalCenter?: string;
  currency?: string;
  /** Affiche le rappel de vérification des formalités d’entrée. */
  formalities: boolean;
  intro: string;
  season: string;
  tip: string;
  /** Date de dernière révision éditoriale (ISO), utilisée dans le sitemap. */
  updated: string;
};

type Copy = { intro: string; season: string; tip: string };

export type RouteSeed = Copy & {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  region: RouteRegion;
  country?: CountrySlug;
  duration: string;
  carriers: string[];
  formalities?: boolean;
  /** Pas de vol direct régulier : la durée indiquée est celle d’un trajet avec escale. */
  noDirect?: boolean;
  /** Si présent, une page « retour » (destination → origine) est générée. */
  back?: Copy;
};

export type PlaceFacts = { airports: string; center?: string; currency?: string };

// Aéroports et distances au centre : ordres de grandeur stables, volontairement arrondis.
const basePlaces: Record<string, PlaceFacts> = {
  PAR: { airports: "Paris – Charles-de-Gaulle (CDG), Orly (ORY) ou Beauvais (BVA)", center: "Roissy-CDG est à environ 25 km du centre de Paris, Orly à environ 13 km et Beauvais à plus de 80 km" },
  MRS: { airports: "Marseille-Provence (MRS)", center: "à environ 25 km du centre de Marseille" },
  LYS: { airports: "Lyon-Saint-Exupéry (LYS)", center: "à environ 25 km du centre de Lyon" },
  TLS: { airports: "Toulouse-Blagnac (TLS)", center: "à une dizaine de kilomètres du centre de Toulouse" },
  ALG: { airports: "Alger – Houari-Boumédiène (ALG)", center: "à une vingtaine de kilomètres du centre d’Alger", currency: "dinar algérien" },
  ORN: { airports: "Oran – Ahmed Ben Bella (ORN)", center: "à une dizaine de kilomètres du centre d’Oran", currency: "dinar algérien" },
  CZL: { airports: "Constantine – Mohamed Boudiaf (CZL)", center: "à une dizaine de kilomètres du centre de Constantine", currency: "dinar algérien" },
  AAE: { airports: "Annaba – Rabah Bitat (AAE)", center: "à une dizaine de kilomètres du centre d’Annaba", currency: "dinar algérien" },
  RAK: { airports: "Marrakech-Ménara (RAK)", center: "à environ 5 km du centre de Marrakech", currency: "dirham marocain" },
  CMN: { airports: "Casablanca – Mohammed V (CMN)", center: "à environ 30 km du centre de Casablanca", currency: "dirham marocain" },
  TNG: { airports: "Tanger – Ibn Battouta (TNG)", center: "à une quinzaine de kilomètres du centre de Tanger", currency: "dirham marocain" },
  FEZ: { airports: "Fès – Saïss (FEZ)", center: "à une quinzaine de kilomètres du centre de Fès", currency: "dirham marocain" },
  AGA: { airports: "Agadir – Al Massira (AGA)", center: "à environ 25 km du centre d’Agadir", currency: "dirham marocain" },
  TUN: { airports: "Tunis – Carthage (TUN)", center: "à environ 8 km du centre de Tunis", currency: "dinar tunisien" },
  BCN: { airports: "Barcelone – El Prat (BCN)", center: "à environ 14 km du centre de Barcelone" },
  LIS: { airports: "Lisbonne – Humberto-Delgado (LIS)", center: "à environ 7 km du centre de Lisbonne" },
  MAD: { airports: "Madrid – Adolfo-Suárez Barajas (MAD)", center: "à environ 13 km du centre de Madrid" },
  ROM: { airports: "Rome – Fiumicino (FCO) ou Ciampino (CIA)", center: "Fiumicino est à environ 30 km du centre de Rome" },
  LON: { airports: "Londres – Heathrow, Gatwick, Stansted, Luton ou City" },
  IST: { airports: "Istanbul (IST) ou Sabiha Gökçen (SAW)", center: "les deux aéroports sont à plus de 30 km du centre historique" },
  NYC: { airports: "New York – JFK, Newark (EWR) ou LaGuardia", center: "JFK est à environ 25 km de Manhattan" },
  YUL: { airports: "Montréal – Trudeau (YUL)", center: "à environ 20 km du centre de Montréal" },
  DXB: { airports: "Dubaï – International (DXB)" },
};

const places: Record<string, PlaceFacts> = { ...basePlaces, ...extraPlaces, ...provincePlaces, ...province2Places };

const routesUpdated = "2026-10-30";

const routeSeeds: RouteSeed[] = [
  // Algérie
  {
    origin: "Paris", originCode: "PAR", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 25", carriers: ["Air Algérie", "Air France", "Transavia"],
    intro: "Paris – Alger fait partie des liaisons les plus fréquentées entre la France et le Maghreb, avec plusieurs départs par jour depuis Roissy-Charles de Gaulle et Orly.",
    season: "Les tarifs montent en juillet-août, pendant les vacances scolaires et autour des fêtes religieuses. Les périodes plus calmes (janvier-février, septembre-novembre) sont en général les plus abordables.",
    tip: "Comparez Orly et Roissy : l’aéroport de départ change la compagnie, l’horaire et parfois la franchise de bagage en soute.",
    back: {
      intro: "Alger – Paris est la liaison de retour la plus demandée entre l’Algérie et la France, avec des arrivées à Orly et à Roissy-Charles de Gaulle.",
      season: "Les retours de fin août et de début septembre, ainsi que les fins de vacances scolaires, sont en général les plus chers. Un retour en semaine ou un peu avant la rentrée fait souvent baisser le prix.",
      tip: "Avant de payer, vérifiez l’aéroport d’arrivée (Orly ou Roissy) pour organiser votre transfert, ainsi que la franchise de bagage de votre billet retour."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Oran", destinationCode: "ORN", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 35", carriers: ["Air Algérie", "Air France", "Transavia"],
    intro: "Oran est l’une des grandes destinations de l’ouest algérien. La liaison depuis Paris est très demandée dès que les vacances approchent.",
    season: "Réservez tôt pour l’été et les fêtes : les derniers sièges à prix modéré partent vite. Hors vacances, les semaines de printemps et d’automne offrent plus de choix.",
    tip: "Vérifiez le poids de bagage en soute inclus dans le tarif : la différence entre deux offres proches peut disparaître au moment d’ajouter une valise.",
    back: {
      intro: "Oran – Paris relie la grande ville de l’ouest algérien à la région parisienne, avec des arrivées à Orly ou Roissy selon la compagnie.",
      season: "Les retours de fin d’été sont très demandés : repérer tôt un jour de retour moins cher fait gagner un budget appréciable.",
      tip: "Si vous revenez avec beaucoup de bagages, comparez la franchise incluse avant le prix : un supplément à l’aéroport coûte souvent plus cher qu’une option prise à la réservation."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Constantine", destinationCode: "CZL", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 40", carriers: [],
    intro: "Constantine est l’une des grandes villes de l’est algérien. Les vols vers Constantine sont très demandés en période de vacances et pour les fêtes.",
    season: "Comme sur les autres liaisons algériennes, l’été, les vacances scolaires et les fêtes concentrent la demande. Hors de ces périodes, les écarts de prix d’un jour à l’autre sont plus marqués.",
    tip: "Si le vol direct est complet ou trop cher, comparez un autre aéroport de départ ou une escale, en tenant compte de la durée totale du voyage.",
    back: {
      intro: "Constantine – Paris est la liaison de retour vers la région parisienne depuis l’est algérien.",
      season: "Les retours de fin d’été et de fin de vacances sont les plus chers. Décaler le retour de quelques jours peut suffire à réduire la facture.",
      tip: "Contrôlez les horaires d’arrivée à Paris : une arrivée tardive complique le transfert depuis l’aéroport."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Annaba", destinationCode: "AAE", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 45", carriers: [],
    intro: "Annaba, sur la côte est de l’Algérie, se rejoint en vol direct depuis Paris selon les périodes de l’année.",
    season: "L’été et les vacances scolaires sont les périodes les plus chères. En dehors, la liaison est moins sollicitée et les prix plus souples.",
    tip: "La liaison est moins fréquente que Paris – Alger : comparez tôt pour garder le choix des horaires.",
    back: {
      intro: "Annaba – Paris relie la côte est algérienne à la région parisienne, avec des fréquences qui varient selon la saison.",
      season: "Les retours de fin d’été sont très demandés : anticipez si vous devez revenir à une date précise.",
      tip: "Vérifiez les jours de la semaine desservis avant de fixer votre retour : toutes les dates ne proposent pas de vol direct."
    }
  },
  {
    origin: "Marseille", originCode: "MRS", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 1 h 50", carriers: ["Air Algérie", "Transavia"],
    intro: "Depuis Marseille-Provence, Alger se rejoint en moins de deux heures : c’est l’une des traversées les plus courtes entre la France et l’Algérie.",
    season: "Les départs du week-end et des vacances d’été sont les plus chers. En semaine et hors saison, les écarts de prix entre deux jours voisins peuvent être importants.",
    tip: "Si vous habitez entre Marseille et Montpellier, comparez aussi un départ depuis Lyon ou Paris avant de décider.",
    back: {
      intro: "Alger – Marseille est l’une des liaisons de retour les plus courtes entre l’Algérie et la France, pour un vol direct de moins de deux heures.",
      season: "Les retours de fin d’été et les week-ends de rentrée sont les plus demandés. En semaine, le prix est souvent plus bas.",
      tip: "Pensez au transport depuis l’aéroport de Marseille-Provence vers votre destination finale : il est éloigné du centre-ville."
    }
  },
  {
    origin: "Marseille", originCode: "MRS", destination: "Oran", destinationCode: "ORN", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 1 h 50", carriers: ["Air Algérie", "Transavia"],
    intro: "Marseille – Oran relie deux villes portuaires de la Méditerranée occidentale, pour un vol direct d’un peu moins de deux heures.",
    season: "La demande se concentre sur l’été, les congés scolaires et les fêtes. Décaler son départ de quelques jours suffit souvent à faire baisser le prix.",
    tip: "Contrôlez les horaires d’arrivée : un vol tardif peut compliquer le trajet jusqu’à votre destination finale.",
    back: {
      intro: "Oran – Marseille permet de rejoindre la Provence depuis l’ouest algérien en un peu moins de deux heures de vol.",
      season: "Les retours de fin d’été sont les plus chers. Un retour en milieu de semaine est souvent plus abordable.",
      tip: "Comparez avec un retour vers Paris ou Lyon si votre destination finale n’est pas en Provence."
    }
  },
  {
    origin: "Lyon", originCode: "LYS", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h", carriers: ["Air Algérie", "Transavia"],
    intro: "Lyon-Saint-Exupéry dessert Alger en vol direct, ce qui évite de passer par Paris pour les voyageurs de la région Auvergne-Rhône-Alpes.",
    season: "Comme sur les autres liaisons algériennes, juillet, août et les fêtes sont les périodes les plus chères. Le printemps et l’automne offrent des tarifs plus souples.",
    tip: "Comparez avec un départ depuis Marseille ou Paris : un billet plus bas peut compenser un trajet en train supplémentaire.",
    back: {
      intro: "Alger – Lyon est la liaison de retour directe pour la région lyonnaise, sans passer par Paris.",
      season: "Les retours de fin d’été et des fêtes concentrent la demande. Réserver le retour en même temps que l’aller évite les mauvaises surprises.",
      tip: "Vérifiez les horaires d’arrivée à Lyon-Saint-Exupéry : les liaisons avec le centre-ville sont moins fréquentes tard le soir."
    }
  },
  {
    origin: "Toulouse", originCode: "TLS", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h", carriers: ["Transavia"],
    intro: "Au départ de Toulouse-Blagnac, Alger est accessible en vol direct d’environ deux heures, pratique pour l’Occitanie et le sud-ouest.",
    season: "Surveillez les vacances scolaires de la zone Toulouse et l’été : les prix y progressent nettement. Hors pointe, la liaison reste plus accessible.",
    tip: "Les fréquences sont moins nombreuses que depuis Paris : si votre date est fixe, comparez tôt pour garder le choix des horaires.",
    back: {
      intro: "Alger – Toulouse est la liaison de retour directe vers l’Occitanie et le sud-ouest, en un peu moins de deux heures.",
      season: "Les retours de fin d’été et de fin de vacances sont les plus demandés. Hors pointe, les prix sont nettement plus bas.",
      tip: "Les fréquences sont limitées : consultez plusieurs dates de retour avant de bloquer votre calendrier."
    }
  },
  // Maroc et Tunisie
  {
    origin: "Paris", originCode: "PAR", destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 20", carriers: ["Transavia", "easyJet", "Ryanair", "Royal Air Maroc", "Air France", "Vueling"],
    intro: "Marrakech est l’une des destinations soleil les plus demandées depuis Paris, avec des vols réguliers et low cost depuis Roissy, Orly et Beauvais.",
    season: "Le printemps et l’automne offrent un climat agréable et des prix souvent plus modérés qu’en vacances scolaires. L’été est très chaud sur place et la demande y est moins soutenue côté loisirs.",
    tip: "Les offres low cost partent parfois de Beauvais : ajoutez le coût et la durée du transfert avant de comparer avec Orly ou Roissy.",
    back: {
      intro: "Marrakech – Paris relie la ville ocre à Orly, Roissy et Beauvais, avec de nombreuses compagnies régulières et low cost.",
      season: "Les fins de vacances et les week-ends prolongés sont les plus chers au retour. En semaine et hors vacances, les prix baissent nettement.",
      tip: "Un retour vers Beauvais peut être moins cher mais impose un transfert long jusqu’à Paris : comparez le prix total."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Casablanca", destinationCode: "CMN", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 10", carriers: ["Royal Air Maroc", "Transavia", "Air France", "Air Arabia Maroc"],
    intro: "Casablanca est la porte d’entrée économique du Maroc et un point de correspondance vers l’Afrique de l’Ouest. La liaison depuis Paris compte de nombreux vols par jour.",
    season: "Les périodes de forte demande sont l’été, les vacances scolaires et les fêtes. Le début du printemps et l’automne sont en général plus abordables.",
    tip: "Si vous continuez vers une autre ville marocaine, comparez un billet unique avec correspondance et deux billets séparés : les conditions de bagage changent.",
    back: {
      intro: "Casablanca – Paris est l’une des liaisons de retour les plus fréquentées du Maroc, avec de nombreux vols directs chaque jour.",
      season: "Les retours de fin d’été et des vacances scolaires sont les plus chers. En dehors, le jour de la semaine pèse beaucoup sur le prix.",
      tip: "Vérifiez l’aéroport d’arrivée à Paris (Orly ou Roissy) avant de prévoir votre transfert."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Tanger", destinationCode: "TNG", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 2 h 55", carriers: [],
    intro: "Tanger est la porte d’entrée du nord du Maroc, en face de l’Espagne. La liaison depuis Paris est très demandée à l’approche de l’été.",
    season: "L’été, les vacances scolaires et les fêtes sont les périodes les plus chères. Au printemps et à l’automne, les prix sont plus souples.",
    tip: "Les vols directs sont moins nombreux que vers Casablanca ou Marrakech : comparez tôt, et regardez aussi les escales si le prix est élevé.",
    back: {
      intro: "Tanger – Paris relie le nord du Maroc à la région parisienne, avec des fréquences plus fortes en été.",
      season: "Les retours de fin d’été sont les plus demandés. Un retour en semaine est souvent plus abordable.",
      tip: "Contrôlez la franchise de bagage : sur cette liaison très empruntée en été, les écarts de tarif entre compagnies sont importants."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Fès", destinationCode: "FEZ", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h", carriers: ["Royal Air Maroc", "Transavia"],
    intro: "Fès, capitale culturelle du Maroc, abrite l’une des plus grandes médinas du monde, classée à l’UNESCO. Des vols directs la relient à Paris.",
    season: "Le printemps et l’automne sont les saisons les plus agréables pour la visite. L’été est très chaud et les vacances scolaires font monter les tarifs.",
    tip: "Les fréquences sont limitées : repérez les jours où un vol direct est proposé avant de choisir vos dates.",
    back: {
      intro: "Fès – Paris est la liaison de retour directe vers Orly depuis la capitale culturelle du Maroc.",
      season: "Les retours de fin d’été et de fin de vacances sont les plus chers. Hors pointe, les prix baissent sensiblement.",
      tip: "Peu de vols par semaine : si votre retour est fixe, vérifiez les jours desservis avant de réserver l’aller."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Agadir", destinationCode: "AGA", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 35", carriers: [],
    intro: "Agadir est une station balnéaire de la côte atlantique du Maroc, très appréciée pour les séjours au soleil.",
    season: "L’hiver et le printemps sont très demandés pour les séjours au soleil, tout comme les vacances scolaires. Hors de ces périodes, les prix sont plus souples.",
    tip: "Comparez les offres avec bagage en soute : sur les séjours balnéaires, une valise est presque toujours nécessaire.",
    back: {
      intro: "Agadir – Paris relie la côte atlantique du Maroc à la région parisienne, avec des fréquences qui varient selon la saison.",
      season: "Les fins de vacances et de week-ends prolongés sont les plus chères. En semaine, les tarifs sont plus bas.",
      tip: "Vérifiez l’aéroport d’arrivée en région parisienne : les offres les moins chères atterrissent parfois loin de Paris."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Tunis", destinationCode: "TUN", region: "Maroc et Tunisie", formalities: true,
    duration: "environ 2 h 30", carriers: ["Tunisair", "Air France", "Transavia"],
    intro: "Paris – Tunis est une liaison de proximité très utilisée pour les séjours en famille comme pour les courts voyages.",
    season: "Comptez des tarifs plus élevés en été et pendant les vacances scolaires. Les mois de printemps et d’automne offrent un meilleur rapport prix-confort.",
    tip: "Vérifiez les horaires de retour : certaines offres peu chères imposent un départ très tôt le matin.",
    back: {
      intro: "Tunis – Paris est la liaison de retour la plus fréquentée entre la Tunisie et la France, avec des arrivées à Orly et à Roissy.",
      season: "Les retours de fin d’été et des vacances sont les plus chers. En dehors, un départ en semaine est souvent plus abordable.",
      tip: "Contrôlez le terminal et l’aéroport d’arrivée avant d’organiser votre transfert."
    }
  },
  {
    origin: "Lyon", originCode: "LYS", destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 15", carriers: ["easyJet", "Transavia"],
    intro: "Depuis Lyon-Saint-Exupéry, Marrakech se rejoint en vol direct d’un peu plus de trois heures, pour une escapade courte ou un séjour prolongé.",
    season: "Les week-ends prolongés et les vacances scolaires font monter les prix. Un départ en milieu de semaine est souvent plus abordable.",
    tip: "Les fréquences changent selon la saison : comparez plusieurs dates avant de bloquer vos congés.",
    back: {
      intro: "Marrakech – Lyon est la liaison de retour directe vers la région lyonnaise, sans passer par Paris.",
      season: "Les retours en fin de vacances et de week-end prolongé sont les plus chers. Un retour en semaine reste plus abordable.",
      tip: "Peu de vols par semaine selon la saison : vérifiez que le jour de retour choisi est bien desservi en direct."
    }
  },
  // Europe
  {
    origin: "Paris", originCode: "PAR", destination: "Barcelone", destinationCode: "BCN", region: "Europe", country: "espagne",
    duration: "environ 1 h 55", carriers: ["Vueling", "Air France", "Transavia"],
    intro: "Barcelone est l’une des escapades européennes les plus courues depuis Paris, avec de nombreux vols quotidiens.",
    season: "Les week-ends de printemps et d’été sont les plus demandés. En semaine, hors vacances, les billets sont souvent bien moins chers.",
    tip: "Comparez avec le train : la durée totale (centre à centre) peut rivaliser avec l’avion une fois les transferts aéroport ajoutés."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Lisbonne", destinationCode: "LIS", region: "Europe", country: "portugal",
    duration: "environ 2 h 30", carriers: ["TAP Air Portugal", "Air France", "Transavia", "easyJet"],
    intro: "Lisbonne attire toute l’année grâce à son climat doux. L’aéroport est proche du centre, ce qui limite le coût du transfert.",
    season: "L’été et les ponts de printemps sont les plus chers. L’automne et le début de l’hiver offrent un bon équilibre entre météo et budget.",
    tip: "L’aéroport se trouve à une courte distance du centre-ville en métro : le transfert pèse peu dans le prix total du voyage."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Madrid", destinationCode: "MAD", region: "Europe", country: "espagne",
    duration: "environ 2 h", carriers: ["Iberia", "Air France", "Transavia", "Air Europa"],
    intro: "Paris – Madrid est une liaison dense, utile autant pour les week-ends que pour les déplacements professionnels.",
    season: "Les périodes de pointe sont les ponts, les vacances d’été et de Noël. Hors pointe, les prix baissent sensiblement en semaine.",
    tip: "Pour un déplacement professionnel, comparez les horaires de retour du soir : ils changent beaucoup d’une compagnie à l’autre."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Rome", destinationCode: "ROM", region: "Europe", country: "italie",
    duration: "environ 2 h 10", carriers: ["ITA Airways", "Air France", "Transavia", "easyJet", "Vueling"],
    intro: "Rome est desservie par deux aéroports. Le tarif le plus bas n’est pas toujours le meilleur choix une fois le transfert vers le centre pris en compte.",
    season: "Printemps et début d’automne sont très demandés. Les semaines moins touristiques (novembre, février) permettent de trouver des vols plus abordables.",
    tip: "Comparez les deux aéroports de Rome : le temps et le coût du transfert vers le centre diffèrent."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Londres", destinationCode: "LON", region: "Europe", country: "royaume-uni",
    duration: "environ 1 h 20", carriers: ["British Airways", "Air France", "easyJet"],
    intro: "Londres compte cinq aéroports. Selon celui de l’offre, le trajet jusqu’au centre peut faire perdre plus de temps que le vol lui-même.",
    season: "Les week-ends et les vacances scolaires britanniques et françaises sont les plus chers. En semaine et hors saison, les tarifs sont plus souples.",
    tip: "Sur un si court trajet, comparez avec l’Eurostar en durée totale, bagages inclus, avant de choisir l’avion."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Istanbul", destinationCode: "IST", region: "Europe", country: "turquie",
    duration: "environ 3 h 20", carriers: ["Turkish Airlines", "Air France", "Pegasus", "AJet"],
    intro: "Istanbul se rejoint depuis Paris en un peu plus de trois heures, avec deux aéroports situés de part et d’autre du Bosphore.",
    season: "Le printemps et l’automne sont agréables et très demandés. L’été et les fêtes font monter les tarifs.",
    tip: "Le second aéroport est plus éloigné du centre historique : prenez en compte le temps de transfert, surtout en cas d’arrivée tardive."
  },
  // Long-courrier
  {
    origin: "Paris", originCode: "PAR", destination: "New York", destinationCode: "NYC", region: "Amériques", country: "etats-unis", formalities: true,
    duration: "environ 8 h 15", carriers: ["Air France", "Delta", "United", "American Airlines", "French bee"],
    intro: "Paris – New York est une liaison transatlantique très concurrentielle : compagnies régulières, alliances et offres plus économiques s’y côtoient.",
    season: "Les prix sont les plus élevés en été et pendant les fêtes de fin d’année. Les mois d’hiver (hors vacances) et le début du printemps offrent souvent de meilleures offres.",
    tip: "Contrôlez la franchise de bagage en soute, parfois non incluse sur les tarifs les plus bas, ainsi que l’aéroport d’arrivée (JFK ou Newark)."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Montréal", destinationCode: "YUL", region: "Amériques", country: "canada", formalities: true,
    duration: "environ 7 h 30", carriers: ["Air Canada", "Air France", "Air Transat"],
    intro: "Montréal est la porte d’entrée francophone de l’Amérique du Nord, très demandée pour les études, les séjours en famille et le tourisme.",
    season: "L’été et la période des fêtes sont les plus chers. L’automne (couleurs d’automne) attire beaucoup de visiteurs : réservez tôt.",
    tip: "Vérifiez les formalités d’entrée au Canada (autorisation de voyage électronique selon votre nationalité) avant de réserver."
  },
  {
    origin: "Lyon", originCode: "LYS", destination: "Dubaï", destinationCode: "DXB", region: "Asie et Moyen-Orient", country: "asie", formalities: true,
    duration: "environ 6 h 30", carriers: ["Emirates"],
    intro: "Depuis Lyon, Dubaï se rejoint avec ou sans escale selon les offres. Comparer la durée totale est aussi important que comparer le prix.",
    season: "L’hiver (octobre à avril) est la saison la plus agréable sur place et la plus demandée. L’été est très chaud, avec des tarifs souvent plus bas.",
    tip: "Une escale peut faire baisser le prix mais allonger fortement le voyage : regardez la durée de correspondance avant de choisir."
  }
];

/** Meta description 140-158 caractères : on garde la plus longue formulation qui tient. */
export function buildRouteDescription(pair: string, duration: string, price?: number): string {
  const candidates = price
    ? [
        `Vol ${pair} dès ${price} € A/R (${duration}) : prix par mois, jour de départ le moins cher, compagnies et bagages. Comparez gratuitement, réservez chez le partenaire de votre choix.`,
        `Vol ${pair} dès ${price} € A/R (${duration}) : prix par mois, compagnies, bagages et escales. Comparez gratuitement, réservez chez le partenaire de votre choix.`,
        `Vol ${pair} dès ${price} € A/R (${duration}) : prix par mois, compagnies, bagages et escales. Comparez gratuitement, réservez chez le partenaire.`,
        `Vol ${pair} dès ${price} € A/R (${duration}) : prix par mois, jour le moins cher, compagnies, bagages et escales. Comparez gratuitement.`,
        `Vol ${pair} dès ${price} € A/R (${duration}) : prix par mois, jour le moins cher, compagnies et bagages. Comparez gratuitement.`,
        `Vol ${pair} dès ${price} € A/R : prix par mois, compagnies et bagages. Comparez gratuitement.`
      ]
    : [
        `Vol ${pair} (${duration}) : comparez les prix par mois, les compagnies, les bagages et les escales, puis réservez chez le partenaire de votre choix. Gratuit.`,
        `Vol ${pair} (${duration}) : comparez les prix par mois, les compagnies, les bagages et les escales. Réservez chez le partenaire de votre choix.`,
        `Vol ${pair} (${duration}) : comparez les prix par mois, les compagnies, les bagages et les escales. Gratuit, sans inscription.`,
        `Vol ${pair} (${duration}) : comparez prix, compagnies, bagages et escales. Gratuit, sans inscription.`
      ];
  return candidates.find((text) => text.length <= 158) ?? candidates[candidates.length - 1];
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildRoute(seed: RouteSeed, direction: "aller" | "retour"): FlightRoute {
  const back = direction === "retour";
  const origin = back ? seed.destination : seed.origin;
  const originCode = back ? seed.destinationCode : seed.originCode;
  const destination = back ? seed.origin : seed.destination;
  const destinationCode = back ? seed.originCode : seed.destinationCode;
  const copy: Copy = back && seed.back ? seed.back : seed;
  const forwardSlug = `${slugify(seed.origin)}-${slugify(seed.destination)}`;
  const reverseSlug = `${slugify(seed.destination)}-${slugify(seed.origin)}`;
  const arrival = places[destinationCode];

  return {
    slug: back ? reverseSlug : forwardSlug,
    origin, originCode, destination, destinationCode,
    region: seed.region,
    country: seed.country,
    direction,
    direct: !seed.noDirect,
    reverseSlug: seed.back ? (back ? forwardSlug : reverseSlug) : undefined,
    title: `Vol ${origin} – ${destination}`,
    metaTitle: `Vol ${origin} ${destination} pas cher : comparateur`,
    description: buildRouteDescription(`${origin} – ${destination}`, seed.duration),
    duration: seed.duration,
    carriers: seed.carriers,
    arrivalAirports: arrival?.airports ?? destination,
    arrivalCenter: arrival?.center,
    currency: back ? undefined : arrival?.currency,
    formalities: back ? false : Boolean(seed.formalities),
    intro: copy.intro,
    season: copy.season,
    tip: copy.tip,
    updated: routesUpdated
  };
}

export const flightRoutes: FlightRoute[] = [...routeSeeds, ...extraSeeds, ...provinceSeeds, ...province2Seeds].flatMap((seed) => (seed.back ? [buildRoute(seed, "aller"), buildRoute(seed, "retour")] : [buildRoute(seed, "aller")]));

export const routeRegions: RouteRegion[] = ["Europe", "Amériques", "Algérie", "Maroc et Tunisie", "Asie et Moyen-Orient", "Outre-mer", "Afrique et Océan Indien"];

export function getRoute(slug: string) {
  return flightRoutes.find((route) => route.slug === slug);
}

export type CountryPage = {
  slug: CountrySlug;
  name: string;
  /** « l’Algérie », « le Maroc » : pour les phrases. */
  withArticle: string;
  /** « vers l’Algérie », « vers le Maroc ». */
  toward: string;
  currency?: string;
  /** Chiffre clé sourcé, affiché en tête de page. */
  stat?: string;
  metaTitle: string;
  description: string;
  intro: string[];
  airports: string[];
  faq: { question: string; answer: string }[];
};

export const airports = [
  { slug: "paris-charles-de-gaulle", name: "Paris-Charles de Gaulle", code: "CDG", intro: "Le principal aéroport international parisien. Vérifiez toujours le terminal et le temps de transfert avant votre départ." },
  { slug: "paris-orly", name: "Paris-Orly", code: "ORY", intro: "Un aéroport situé au sud de Paris. Comparez le prix du billet avec le coût et la durée de votre trajet jusqu’à l’aéroport." },
  { slug: "paris-beauvais", name: "Paris-Beauvais", code: "BVA", intro: "Un aéroport plus éloigné de Paris. Une offre moins chère peut perdre son avantage une fois le transfert et le temps de trajet ajoutés." }
];

/** Routes proches : sens inverse en tête, puis même destination, même départ, même région. */
export function relatedRoutes(route: FlightRoute, limit = 8): FlightRoute[] {
  return flightRoutes
    .filter((item) => item.slug !== route.slug)
    .map((item) => ({
      item,
      score:
        (item.slug === route.reverseSlug ? 10 : 0) +
        (item.destinationCode === route.destinationCode ? 3 : 0) +
        (item.originCode === route.originCode ? 2 : 0) +
        (item.country && item.country === route.country ? 2 : 0) +
        (item.region === route.region ? 1 : 0)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

const formatEuro = (value: number) => `${value} €`;

function minutesOf(duration: string): number | null {
  const match = /(\d+)\s*h(?:\s*(\d+))?/.exec(duration);
  return match ? Number(match[1]) * 60 + Number(match[2] ?? 0) : null;
}

const plain = (duration: string) => duration.replace(/^environ /, "");

/** Phrase de comparaison propre au trajet : durées des liaisons voisines (même départ, ou même arrivée au retour). */
export function routeComparison(route: FlightRoute): string | null {
  const own = minutesOf(route.duration);
  if (own === null || !route.direct) return null;
  const back = route.direction === "retour";
  const siblings = flightRoutes
    .filter((item) => item.slug !== route.slug && item.direct && item.direction === route.direction && (back ? item.destinationCode === route.destinationCode : item.originCode === route.originCode))
    .map((item) => ({ item, minutes: minutesOf(item.duration) }))
    .filter((entry): entry is { item: FlightRoute; minutes: number } => entry.minutes !== null)
    .sort((a, b) => Math.abs(a.minutes - own) - Math.abs(b.minutes - own))
    .slice(0, 3);
  if (siblings.length < 2) return null;
  const label = (entry: { item: FlightRoute; minutes: number }) => `${back ? entry.item.origin : entry.item.destination} (${plain(entry.item.duration)})`;
  const rank = flightRoutes.filter((item) => item.direct && item.direction === route.direction && (back ? item.destinationCode === route.destinationCode : item.originCode === route.originCode) && (minutesOf(item.duration) ?? 0) < own).length + 1;
  const total = flightRoutes.filter((item) => item.direct && item.direction === route.direction && (back ? item.destinationCode === route.destinationCode : item.originCode === route.originCode)).length;
  const lead = back
    ? `Pour rentrer à ${route.destination}, ${route.origin} se rejoint en ${plain(route.duration)}`
    : `Au départ de ${route.origin}, ${route.destination} se rejoint en ${plain(route.duration)}`;
  const near = siblings.map(label).join(", ");
  return `${lead}, soit la ${rank}${rank === 1 ? "re" : "e"} liaison la plus courte sur les ${total} comparées par HiFlight. Les trajets de durée voisine : ${near}.`;
}

/** Délai de réservation conseillé, adapté à la distance du trajet. */
export function bookingAdvice(route: FlightRoute): string {
  const minutes = minutesOf(route.duration) ?? 0;
  if (route.region === "Outre-mer") return "Pour l’Outre-mer, réservez plusieurs mois à l’avance : Noël et l’été partent les premiers.";
  if (!route.direct || minutes >= 420) return "Sur un long-courrier, ouvrez la comparaison plusieurs mois avant le départ, et davantage encore pour les vacances.";
  if (minutes >= 180) return "Comptez entre deux et quatre mois avant le départ, et plus tôt pour l’été et les fêtes.";
  return "Sur ce trajet court, comparez entre un et trois mois avant le départ ; les week-ends partent plus vite.";
}

/** FAQ de la page : les réponses chiffrées ne s’affichent que si les relevés de prix sont disponibles. */
export function routeFaq(route: FlightRoute, stats: RouteStats | null = null): { question: string; answer: string }[] {
  const pair = `${route.origin} – ${route.destination}`;
  const items: { question: string; answer: string }[] = [
    route.direct
      ? { question: `Combien de temps dure un vol ${pair} ?`, answer: `Un vol direct ${pair} dure ${route.duration}. Avec une escale, prévoyez davantage.` }
      : { question: `Combien de temps dure un vol ${pair} ?`, answer: `Il n’existe en général pas de vol direct ${pair} : comptez ${route.duration}. Comparez la durée de l’escale.` }
  ];

  if (route.carriers.length) {
    items.push({
      question: `Quelles compagnies assurent ${pair} ?`,
      answer: `Parmi les compagnies fréquemment présentes : ${route.carriers.join(", ")}. L’offre varie selon la saison.`
    });
  }

  items.push({
    question: `Quand réserver un vol ${pair} moins cher ?`,
    answer: stats ? `Selon les relevés récents, le départ le moins cher est en ${stats.lowest.monthLabel}, à partir de ${formatEuro(stats.lowest.price)} l’aller-retour. ${route.season}` : route.season
  });

  if (stats?.cheapestWeekday) {
    items.push({
      question: `Quel jour de départ est le moins cher pour ${pair} ?`,
      answer: `Sur les dates relevées, le ${stats.cheapestWeekday.label} est en moyenne le jour de départ le moins cher (autour de ${formatEuro(stats.cheapestWeekday.avg)}). Comparez toujours les jours voisins de la date souhaitée : l’écart dépend de la période.`
    });
  }

  if (route.direct && stats?.directLowest) {
    items.push({
      question: `Existe-t-il des vols directs ${pair} pas chers ?`,
      answer: `Oui : un vol direct a été relevé à partir de ${formatEuro(stats.directLowest)} l’aller-retour, contre ${formatEuro(stats.lowest.price)} pour l’offre la moins chère toutes options confondues.`
    });
  }

  items.push({
    question: `Quel aéroport à l’arrivée pour ${route.destination} ?`,
    answer: `Les vols arrivent à : ${route.arrivalAirports}.${route.arrivalCenter ? ` ${route.arrivalCenter.charAt(0).toUpperCase()}${route.arrivalCenter.slice(1)}.` : ""}`
  });

  return items;
}

export const defaultOgImage = { url: "/hiflight-hero.jpg", width: 1600, height: 900, alt: "Voyage en avion au coucher du soleil" };

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hiflight.fr";
export const searchUrl = process.env.NEXT_PUBLIC_SEARCH_URL || "https://vols.hiflight.fr";
