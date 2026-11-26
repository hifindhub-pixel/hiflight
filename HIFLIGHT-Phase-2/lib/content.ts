import type { RouteStats } from "./route-stats";
import { extraPlaces, extraSeeds } from "./routes-extra";
import { moreSeeds, morePlaces } from "./routes-more";
import { provincePlaces, provinceSeeds } from "./routes-province";
import { wave2Seeds } from "./routes-wave2";
import { wave3Seeds, wave3Places } from "./routes-wave3";
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

const places: Record<string, PlaceFacts> = { ...basePlaces, ...extraPlaces, ...morePlaces, ...provincePlaces, ...province2Places, ...wave3Places };

const routesUpdated = "2026-10-30";

const routeSeeds: RouteSeed[] = [
  // Algérie
  {
    origin: "Paris", originCode: "PAR", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 25", carriers: ["Air Algérie", "Air France", "Transavia"],
    intro: "Alger est l’une des liaisons les plus passantes entre la France et le Maghreb : Air Algérie, Air France et Transavia se partagent les départs de Roissy et d’Orly, avec plusieurs vols chaque jour.",
    season: "Juillet et août, la Toussaint, Noël et les semaines autour de l’Aïd : c’est là que les prix s’envolent. Janvier, février et une bonne partie de septembre-novembre sont nettement plus calmes.",
    tip: "Roissy ou Orly, ce n’est pas qu’une question de RER : la compagnie, l’horaire et le bagage en soute changent d’un aéroport à l’autre. Regardez les deux avant de trancher.",
    back: {
      intro: "Pour rentrer d’Alger, vous atterrissez à Orly ou à Roissy selon la compagnie. C’est le sens le plus tendu de l’année dès que les vacances touchent à leur fin.",
      season: "Fin août et début septembre, tout le monde rentre en même temps et les prix suivent. Rentrer en milieu de semaine, ou quelques jours avant la rentrée, change vraiment la facture.",
      tip: "Notez l’aéroport d’arrivée avant de réserver : à 23 h, un retour à Orly ou à Roissy ne se gère pas pareil pour rejoindre Paris. Et vérifiez la franchise bagage du billet retour, elle n’est pas toujours celle de l’aller."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Oran", destinationCode: "ORN", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 35", carriers: ["Air Algérie", "Air France", "Transavia"],
    intro: "Oran, c’est la grande ville de l’ouest algérien, tournée vers la mer et réputée pour avoir vu naître le raï. Depuis Paris, la demande monte dès que les vacances approchent.",
    season: "Réservez tôt pour l’été et les fêtes : les derniers sièges à petit prix partent vite. Au printemps et à l’automne, vous avez plus de choix de jours et d’horaires.",
    tip: "Une valise en soute ajoutée au dernier moment coûte souvent plus que l’écart entre deux billets. Regardez le prix bagage compris, pas le prix affiché.",
    back: {
      intro: "Oran–Paris : un retour qui se joue en fin d’été, avec des arrivées à Orly ou à Roissy selon la compagnie.",
      season: "Les retours de fin d’été sont pris d’assaut. Repérer un jour moins cher assez tôt vous fait gagner un budget que vous ne retrouverez pas en réservant au dernier moment.",
      tip: "Vous revenez chargé ? Comparez d’abord la franchise bagage, puis le prix. Un supplément payé à l’aéroport coûte presque toujours plus qu’une option prise à la réservation."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Constantine", destinationCode: "CZL", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 40", carriers: [],
    intro: "Constantine, la ville des ponts suspendus au-dessus des gorges du Rhumel, est la grande ville de l’est algérien. Les vols depuis Paris se remplissent vite l’été et pour les fêtes.",
    season: "Comme sur les autres lignes algériennes, l’été, les vacances scolaires et les fêtes concentrent la demande. Le reste de l’année, les prix bougent beaucoup d’un jour à l’autre : décaler d’une journée peut tout changer.",
    tip: "Si le direct est complet ou trop cher, regardez un autre aéroport de départ ou une escale, mais en comptant la durée totale du voyage, pas seulement le prix.",
    back: {
      intro: "Pour rentrer de Constantine vers la région parisienne, le vol direct reste le plus simple quand il est proposé. Mieux vaut s’y prendre assez tôt.",
      season: "Fin d’été et fin de vacances : ce sont les retours les plus chers. Décaler de quelques jours suffit parfois à alléger la facture.",
      tip: "Regardez l’heure d’arrivée à Paris : atterrir tard le soir complique le transfert depuis l’aéroport."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Annaba", destinationCode: "AAE", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h 45", carriers: [],
    intro: "Annaba, sur la côte est, c’est la plage, les ruines d’Hippone et la basilique Saint-Augustin sur sa colline. Un vol direct depuis Paris est proposé selon les périodes de l’année.",
    season: "L’été et les vacances scolaires sont les périodes les plus chères. Le reste de l’année, la ligne est moins sollicitée et les prix plus souples.",
    tip: "Il y a moins de départs qu’entre Paris et Alger : si vos dates sont fixes, cherchez tôt pour garder le choix des horaires.",
    back: {
      intro: "Annaba–Paris, avec des fréquences qui varient selon la saison : sur cette ligne, mieux vaut connaître ses dates de retour à l’avance.",
      season: "Les retours de fin d’été sont très demandés. Si vous devez rentrer à une date précise, réservez en avance.",
      tip: "Tous les jours de la semaine ne sont pas desservis en direct : regardez les jours avant de fixer votre retour."
    }
  },
  {
    origin: "Marseille", originCode: "MRS", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 1 h 50", carriers: ["Air Algérie", "Transavia"],
    intro: "Moins de deux heures de vol entre Marseille et Alger : c’est l’une des traversées les plus courtes entre la France et l’Algérie, et la plus pratique si vous habitez dans le Sud.",
    season: "Les départs du week-end et ceux de l’été coûtent le plus. En semaine, hors saison, l’écart de prix entre deux jours voisins peut être important.",
    tip: "Si vous habitez entre Marseille et Montpellier, comparez aussi un départ de Lyon ou de Paris : un billet moins cher compense parfois un trajet en train.",
    back: {
      intro: "Alger–Marseille : un vol direct de moins de deux heures, idéal pour rentrer dans le Sud sans repasser par Paris.",
      season: "Fins d’été et week-ends de rentrée sont les retours les plus demandés. En semaine, le prix est souvent plus bas.",
      tip: "L’aéroport de Marseille-Provence est à environ 25 km du centre : prévoyez le transfert, surtout si vous arrivez tard."
    }
  },
  {
    origin: "Marseille", originCode: "MRS", destination: "Oran", destinationCode: "ORN", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 1 h 50", carriers: ["Air Algérie", "Transavia"],
    intro: "Marseille et Oran se font face de part et d’autre de la Méditerranée : un peu moins de deux heures de vol direct entre deux villes portuaires.",
    season: "L’été, les congés scolaires et les fêtes concentrent la demande. Partir quelques jours plus tôt ou plus tard suffit souvent à faire baisser le prix.",
    tip: "Regardez l’heure d’arrivée : un vol tardif complique le trajet jusqu’à votre destination finale.",
    back: {
      intro: "Oran–Marseille : le retour en Provence en un peu moins de deux heures de vol.",
      season: "La fin d’été donne les retours les plus chers. En milieu de semaine, le billet est souvent plus abordable.",
      tip: "Si vous ne restez pas en Provence, comparez avec un retour vers Paris ou Lyon."
    }
  },
  {
    origin: "Lyon", originCode: "LYS", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h", carriers: ["Air Algérie", "Transavia"],
    intro: "Lyon-Saint-Exupéry dessert Alger en vol direct : inutile de passer par Paris quand on habite en Auvergne-Rhône-Alpes.",
    season: "Juillet, août et les fêtes sont les périodes les plus chères, comme sur toutes les lignes algériennes. Le printemps et l’automne laissent plus de souplesse.",
    tip: "Un billet moins cher depuis Marseille ou Paris peut compenser un trajet en train en plus. À vous de faire le calcul.",
    back: {
      intro: "Alger–Lyon : un retour direct vers la région lyonnaise, sans escale parisienne.",
      season: "Les retours de fin d’été et de fêtes concentrent la demande. Réserver l’aller et le retour en même temps évite les mauvaises surprises.",
      tip: "Les liaisons entre l’aéroport et le centre de Lyon sont moins fréquentes tard le soir : regardez l’heure d’arrivée."
    }
  },
  {
    origin: "Toulouse", originCode: "TLS", destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", formalities: true,
    duration: "environ 2 h", carriers: ["Transavia"],
    intro: "Depuis Toulouse-Blagnac, Alger est à deux heures de vol environ : une solution pratique pour l’Occitanie et le sud-ouest.",
    season: "Surveillez les vacances scolaires de la zone et l’été : les prix y montent nettement. Hors pointe, la ligne reste plus accessible.",
    tip: "Il y a moins de vols qu’au départ de Paris : si votre date est fixe, cherchez tôt pour garder le choix des horaires.",
    back: {
      intro: "Alger–Toulouse, un peu moins de deux heures de vol direct vers l’Occitanie et le sud-ouest.",
      season: "Fin d’été et fin de vacances : les retours les plus demandés. Hors pointe, les prix sont nettement plus bas.",
      tip: "Peu de fréquences : regardez plusieurs dates de retour avant de bloquer votre calendrier."
    }
  },
  // Maroc et Tunisie
  {
    origin: "Paris", originCode: "PAR", destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 20", carriers: ["Transavia", "easyJet", "Ryanair", "Royal Air Maroc", "Air France", "Vueling"],
    intro: "Marrakech, c’est la médina, la place Jemaa el-Fna et du soleil presque toute l’année, à environ 3 h 20 de Paris. Les vols réguliers et low cost partent de Roissy, d’Orly et de Beauvais.",
    season: "Printemps et automne sont les saisons les plus agréables, avec des prix raisonnables hors vacances scolaires. L’été, il fait très chaud sur place et la demande loisirs retombe.",
    tip: "Les billets low cost partent parfois de Beauvais, à plus de 80 km de Paris. Ajoutez le transfert au prix avant de comparer avec Orly ou Roissy.",
    back: {
      intro: "Marrakech–Paris : un retour vers Orly, Roissy ou Beauvais, avec des compagnies régulières et low cost.",
      season: "Les fins de vacances et les week-ends prolongés sont les retours les plus chers. En semaine et hors vacances, les prix baissent nettement.",
      tip: "Un retour vers Beauvais coûte parfois moins mais impose un long transfert jusqu’à Paris. Comparez le prix total, pas le prix du billet."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Casablanca", destinationCode: "CMN", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 10", carriers: ["Royal Air Maroc", "Transavia", "Air France", "Air Arabia Maroc"],
    intro: "Casablanca, c’est la capitale économique du Maroc, la mosquée Hassan II face à l’océan et un point de correspondance vers l’Afrique de l’Ouest. Depuis Paris, les vols se succèdent toute la journée.",
    season: "Été, vacances scolaires et fêtes : la demande explose. Le début du printemps et l’automne sont en général plus abordables.",
    tip: "Vous continuez vers une autre ville marocaine ? Un billet unique avec correspondance protège mieux vos bagages que deux billets séparés, dont les conditions diffèrent.",
    back: {
      intro: "Casablanca–Paris est l’une des liaisons de retour les plus fréquentées du Maroc, avec de nombreux vols directs chaque jour.",
      season: "Fin d’été et fin de vacances scolaires : les retours les plus chers. Le reste de l’année, le jour de la semaine pèse lourd dans le prix.",
      tip: "Orly ou Roissy ? Notez l’aéroport d’arrivée avant de prévoir votre transfert."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Tanger", destinationCode: "TNG", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 2 h 55", carriers: [],
    intro: "Tanger, face à l’Espagne, est la porte du nord du Maroc. La ligne depuis Paris est très demandée à l’approche de l’été.",
    season: "L’été, les vacances scolaires et les fêtes sont les périodes les plus chères. Au printemps et à l’automne, les prix se détendent.",
    tip: "Il y a moins de vols directs que vers Casablanca ou Marrakech : cherchez tôt, et regardez aussi les escales si le prix du direct est trop élevé.",
    back: {
      intro: "Tanger–Paris, avec des fréquences plus fortes en été.",
      season: "La fin d’été donne les retours les plus demandés. Un retour en semaine est souvent plus abordable.",
      tip: "L’été, les écarts de tarif entre compagnies sont importants sur cette ligne : regardez la franchise bagage avant le prix."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Fès", destinationCode: "FEZ", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h", carriers: ["Royal Air Maroc", "Transavia"],
    intro: "Fès, c’est la capitale culturelle du Maroc : une médina classée à l’UNESCO parmi les plus vastes du monde, les tanneries, l’université Al Quaraouiyine fondée au IXe siècle. Des vols directs la relient à Paris.",
    season: "Le printemps et l’automne sont les plus agréables pour visiter. L’été est très chaud et les vacances scolaires font monter les tarifs.",
    tip: "Il y a peu de vols par semaine : repérez les jours où un direct est proposé avant de choisir vos dates.",
    back: {
      intro: "Fès–Paris : un retour direct vers Orly depuis la capitale culturelle du Maroc.",
      season: "Fin d’été et fin de vacances : les retours les plus chers. Hors pointe, les prix baissent sensiblement.",
      tip: "Peu de vols dans la semaine : si votre retour est fixe, vérifiez les jours desservis avant de réserver l’aller."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Agadir", destinationCode: "AGA", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 35", carriers: [],
    intro: "Agadir, c’est la grande plage de la côte atlantique du Maroc et du soleil presque toute l’année, à moins de quatre heures de Paris.",
    season: "L’hiver et le printemps attirent beaucoup de monde en quête de soleil, tout comme les vacances scolaires. En dehors de ces périodes, les prix sont plus souples.",
    tip: "Pour un séjour à la plage, une valise en soute est presque toujours nécessaire : comparez les offres bagage compris.",
    back: {
      intro: "Agadir–Paris, avec des fréquences qui varient selon la saison.",
      season: "Les fins de vacances et de week-ends prolongés sont les retours les plus chers. En semaine, les tarifs sont plus bas.",
      tip: "Regardez l’aéroport d’arrivée en région parisienne : les offres les moins chères atterrissent parfois loin de Paris."
    }
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Tunis", destinationCode: "TUN", region: "Maroc et Tunisie", formalities: true,
    duration: "environ 2 h 30", carriers: ["Tunisair", "Air France", "Transavia"],
    intro: "Tunis est à 2 h 30 de Paris : on y va en famille, pour un week-end, ou pour pousser jusqu’à Carthage et Sidi Bou Saïd.",
    season: "Été et vacances scolaires : tarifs en hausse. Au printemps et à l’automne, le rapport prix-confort est meilleur.",
    tip: "Contrôlez l’heure du vol retour : certaines offres peu chères imposent un décollage très tôt le matin.",
    back: {
      intro: "Tunis–Paris est la liaison de retour la plus fréquentée entre la Tunisie et la France, avec des arrivées à Orly et à Roissy.",
      season: "Fin d’été et fin de vacances : les retours les plus chers. Le reste de l’année, un départ en semaine est souvent plus abordable.",
      tip: "Notez le terminal et l’aéroport d’arrivée avant d’organiser votre transfert."
    }
  },
  {
    origin: "Lyon", originCode: "LYS", destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie", country: "maroc", formalities: true,
    duration: "environ 3 h 15", carriers: ["easyJet", "Transavia"],
    intro: "Lyon–Marrakech en vol direct, c’est un peu plus de trois heures pour un week-end prolongé ou un séjour plus long, sans repasser par Paris.",
    season: "Les week-ends prolongés et les vacances scolaires font monter les prix. Partir en milieu de semaine coûte souvent moins cher.",
    tip: "Les fréquences changent selon la saison : regardez plusieurs dates avant de poser vos congés.",
    back: {
      intro: "Marrakech–Lyon : un retour direct vers la région lyonnaise.",
      season: "Fin de vacances et week-ends prolongés : les retours les plus chers. En semaine, c’est plus abordable.",
      tip: "Il y a peu de vols dans la semaine : vérifiez que votre jour de retour est bien desservi en direct."
    }
  },
  // Europe
  {
    origin: "Paris", originCode: "PAR", destination: "Barcelone", destinationCode: "BCN", region: "Europe", country: "espagne",
    duration: "environ 1 h 55", carriers: ["Vueling", "Air France", "Transavia"],
    intro: "Barcelone reste l’escapade européenne préférée au départ de Paris : la Sagrada Família, des plages en pleine ville et de nombreux vols chaque jour.",
    season: "Les week-ends de printemps et d’été sont les plus demandés. En semaine, hors vacances, les billets sont souvent bien moins chers.",
    tip: "Le prix affiché dépend beaucoup du bagage : sur les compagnies à bas prix, la petite cabine suffit rarement pour un week-end de trois jours."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Lisbonne", destinationCode: "LIS", region: "Europe", country: "portugal",
    duration: "environ 2 h 30", carriers: ["TAP Air Portugal", "Air France", "Transavia", "easyJet"],
    intro: "Lisbonne, ses collines et son tram 28 : douce toute l’année, à environ 2 h 30 de Paris, avec un aéroport tout près du centre.",
    season: "L’été et les ponts de printemps sont les plus chers. L’automne et le début de l’hiver offrent le meilleur équilibre entre météo et budget.",
    tip: "L’aéroport est relié au centre par le métro : le transfert pèse peu dans le budget, contrairement à beaucoup de capitales."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Madrid", destinationCode: "MAD", region: "Europe", country: "espagne",
    duration: "environ 2 h", carriers: ["Iberia", "Air France", "Transavia", "Air Europa"],
    intro: "Paris–Madrid, deux heures de vol, tourne toute l’année : week-ends culturels, déplacements professionnels et correspondances vers l’Amérique latine.",
    season: "Ponts, vacances d’été et Noël : les prix montent. Hors pointe, la semaine est nettement moins chère.",
    tip: "En déplacement professionnel, regardez les horaires du vol retour du soir : ils varient beaucoup d’une compagnie à l’autre."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Rome", destinationCode: "ROM", region: "Europe", country: "italie",
    duration: "environ 2 h 10", carriers: ["ITA Airways", "Air France", "Transavia", "easyJet", "Vueling"],
    intro: "Rome a deux aéroports, Fiumicino et Ciampino, et le billet le moins cher n’est pas toujours le bon choix une fois le transfert vers le centre compté.",
    season: "Printemps et début d’automne sont très demandés. Novembre et février, moins touristiques, donnent souvent des vols plus abordables.",
    tip: "Depuis Fiumicino, un train direct rejoint la gare Termini ; depuis Ciampino, il faut passer par un bus. Comparez le temps et le coût du transfert."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Londres", destinationCode: "LON", region: "Europe", country: "royaume-uni",
    duration: "environ 1 h 20", carriers: ["British Airways", "Air France", "easyJet"],
    intro: "Londres a cinq aéroports, et selon celui de l’offre, le trajet jusqu’au centre peut durer plus longtemps que le vol de 1 h 20.",
    season: "Week-ends et vacances scolaires, françaises comme britanniques, font grimper les prix. En semaine et hors saison, les tarifs sont plus souples.",
    tip: "Sur un trajet aussi court, comparez avec l’Eurostar en durée totale, bagages compris, avant de choisir l’avion."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Istanbul", destinationCode: "IST", region: "Europe", country: "turquie",
    duration: "environ 3 h 20", carriers: ["Turkish Airlines", "Air France", "Pegasus", "AJet"],
    intro: "Istanbul est à un peu plus de trois heures de Paris, avec deux aéroports de part et d’autre du Bosphore : le grand IST côté européen, Sabiha Gökçen (SAW) côté asiatique.",
    season: "Printemps et automne sont agréables et très demandés. L’été et les fêtes font monter les tarifs.",
    tip: "L’aéroport change le prix, mais aussi la durée du transfert jusqu’au centre historique : comptez-la, surtout si vous arrivez tard."
  },
  // Long-courrier
  {
    origin: "Paris", originCode: "PAR", destination: "New York", destinationCode: "NYC", region: "Amériques", country: "etats-unis", formalities: true,
    duration: "environ 8 h 15", carriers: ["Air France", "Delta", "United", "American Airlines", "French bee"],
    intro: "Paris–New York est l’une des lignes transatlantiques les plus disputées : compagnies régulières, alliances et offres plus économiques s’y côtoient, pour environ 8 h 15 de vol.",
    season: "L’été et la fin d’année sont les plus chers. L’hiver, hors vacances, et le début du printemps donnent souvent de meilleures offres.",
    tip: "Regardez ce que le tarif inclut : sur les offres les plus basses, la valise en soute est parfois en option. Et vérifiez l’aéroport d’arrivée, JFK ou Newark."
  },
  {
    origin: "Paris", originCode: "PAR", destination: "Montréal", destinationCode: "YUL", region: "Amériques", country: "canada", formalities: true,
    duration: "environ 7 h 30", carriers: ["Air Canada", "Air France", "Air Transat"],
    intro: "Montréal, la porte d’entrée francophone de l’Amérique du Nord, attire étudiants, familles et voyageurs, à environ 7 h 30 de vol.",
    season: "L’été et les fêtes sont les plus chers. À l’automne, les couleurs attirent beaucoup de monde : réservez tôt.",
    tip: "Avant de réserver, vérifiez les formalités d’entrée au Canada (autorisation de voyage électronique selon votre nationalité)."
  },
  {
    origin: "Lyon", originCode: "LYS", destination: "Dubaï", destinationCode: "DXB", region: "Asie et Moyen-Orient", country: "asie", formalities: true,
    duration: "environ 6 h 30", carriers: ["Emirates"],
    intro: "Depuis Lyon, Dubaï se rejoint avec ou sans escale selon les offres : la durée totale compte autant que le prix.",
    season: "L’hiver, d’octobre à avril, est la saison la plus agréable sur place, donc la plus demandée. L’été est très chaud, avec des tarifs souvent plus bas.",
    tip: "Une escale peut faire baisser le prix mais rallonger fortement le voyage : regardez la durée de la correspondance."
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

export const flightRoutes: FlightRoute[] = [...routeSeeds, ...extraSeeds, ...moreSeeds, ...provinceSeeds, ...province2Seeds, ...wave2Seeds, ...wave3Seeds].flatMap((seed) => (seed.back ? [buildRoute(seed, "aller"), buildRoute(seed, "retour")] : [buildRoute(seed, "aller")]));

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
  const near = siblings.map(label).join(", ");
  const own_ = `${route.origin}–${route.destination} dure ${plain(route.duration)} en vol direct.`;
  return back
    ? `${own_} Pour rentrer à ${route.destination}, d’autres départs affichent une durée voisine : ${near}.`
    : `${own_} Au départ de ${route.origin}, des destinations de durée voisine : ${near}.`;
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
