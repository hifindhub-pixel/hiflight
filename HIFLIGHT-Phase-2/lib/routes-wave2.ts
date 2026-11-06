import type { RouteSeed } from "./content";

// Seconde vague de liaisons régionales : les destinations les plus recherchées depuis Lyon,
// Marseille, Nice, Toulouse et Bordeaux qui manquaient encore. Les durées sont des ordres de
// grandeur ; aucune compagnie n’est citée car les dessertes changent selon les saisons, et
// aucun prix n’est écrit ici (les relevés viennent de l’API de prix).

const lyon = { origin: "Lyon", originCode: "LYS" } as const;
const marseille = { origin: "Marseille", originCode: "MRS" } as const;
const nice = { origin: "Nice", originCode: "NCE" } as const;
const toulouse = { origin: "Toulouse", originCode: "TLS" } as const;
const bordeaux = { origin: "Bordeaux", originCode: "BOD" } as const;

export const wave2Seeds: RouteSeed[] = [
  // ——— Lyon
  { ...lyon, destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", duration: "environ 2 h", carriers: [], formalities: true,
    intro: "Lyon–Alger est l’une des liaisons les plus utilisées entre la région Auvergne-Rhône-Alpes et l’Algérie, avec des familles qui voyagent toute l’année.",
    season: "L’été, les vacances scolaires et les fêtes concentrent la demande. Hors pointe, en semaine, les prix sont plus souples.",
    tip: "Vérifiez la franchise de bagages incluse : elle change beaucoup d’une offre à l’autre, et c’est un poste qui pèse lourd sur ce trajet." },
  { ...lyon, destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie", country: "maroc", duration: "environ 2 h 50", carriers: [], formalities: true,
    intro: "Depuis Lyon-Saint-Exupéry, Marrakech est une escapade de soleil sans passer par Paris : médina, jardins et désert à quelques heures de route.",
    season: "Le printemps et l’automne sont les plus agréables. Les vacances scolaires font monter les prix, et l’été est très chaud.",
    tip: "Comparez les jours de départ : un vol en milieu de semaine est souvent moins cher qu’un départ du vendredi." },
  { ...lyon, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h 30", carriers: [],
    intro: "Lyon–Amsterdam est un week-end facile : canaux, musées et vélo, avec un vol d’une heure et demie environ.",
    season: "Le printemps, avec les champs de tulipes, et les week-ends d’été sont les plus demandés. En hiver, les prix sont en général plus doux.",
    tip: "Depuis l’aéroport de Schiphol, le train rejoint le centre en une vingtaine de minutes : inutile de réserver un taxi." },
  { ...lyon, destination: "Prague", destinationCode: "PRG", region: "Europe", duration: "environ 1 h 45", carriers: [],
    intro: "Lyon–Prague, c’est une vieille ville à parcourir à pied et des brasseries où l’on mange bien sans se ruiner.",
    season: "L’été et la fin d’année sont les plus fréquentés. Entre janvier et mars, la ville est plus calme et les billets plus abordables.",
    tip: "Les liaisons ne sont pas quotidiennes toute l’année : regardez les jours de desserte avant de fixer vos dates." },
  { ...lyon, destination: "Djerba", destinationCode: "DJE", region: "Maroc et Tunisie", duration: "environ 2 h 30", carriers: [], formalities: true,
    intro: "Lyon–Djerba relie la région lyonnaise à l’île tunisienne des plages et des villages blancs, très prisée pour les séjours en famille.",
    season: "L’été et les vacances scolaires concentrent la demande. Le printemps et l’automne offrent de belles journées pour des prix plus doux.",
    tip: "Beaucoup d’offres sont vendues avec l’hôtel : regardez aussi le vol seul, pour comparer." },

  // ——— Marseille
  { ...marseille, destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", duration: "environ 1 h 35", carriers: [], formalities: true,
    intro: "Marseille–Alger est l’une des traversées les plus courtes entre la France et l’Algérie : un peu plus d’une heure et demie de vol.",
    season: "L’été, les congés scolaires et les fêtes concentrent la demande. Hors pointe, les prix sont plus souples.",
    tip: "Réservez tôt pour l’été : les vols au départ de Marseille se remplissent vite." },
  { ...marseille, destination: "Oran", destinationCode: "ORN", region: "Algérie", country: "algerie", duration: "environ 1 h 40", carriers: [], formalities: true,
    intro: "Marseille–Oran se fait en moins de deux heures : une liaison très utilisée par les familles de la région.",
    season: "Juillet, août et les fêtes font monter les prix. En dehors, on trouve des billets plus abordables.",
    tip: "Comparez avec un départ depuis Alger si vous avez de la famille ailleurs : les écarts de prix peuvent être sensibles." },
  { ...marseille, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h 55", carriers: [],
    intro: "Depuis Marseille, Amsterdam se rejoint en moins de deux heures : un week-end de musées, de canaux et de brunchs.",
    season: "Le printemps et l’été sont les plus demandés. En automne et en hiver, les billets sont souvent plus doux.",
    tip: "Le train rejoint le centre depuis l’aéroport en une vingtaine de minutes." },
  { ...marseille, destination: "Djerba", destinationCode: "DJE", region: "Maroc et Tunisie", duration: "environ 2 h 10", carriers: [], formalities: true,
    intro: "Marseille–Djerba est un vol court vers les plages tunisiennes, pratique pour un séjour de quelques jours.",
    season: "L’été et les vacances scolaires concentrent la demande. Mai-juin et septembre-octobre sont plus calmes.",
    tip: "Regardez la distance entre l’aéroport et votre hôtel avant de réserver un transfert." },
  { ...marseille, destination: "Prague", destinationCode: "PRG", region: "Europe", duration: "environ 2 h", carriers: [],
    intro: "Marseille–Prague, c’est un week-end dans une ville qui se visite à pied, entre château, pont Charles et brasseries.",
    season: "L’été et les marchés de Noël attirent la foule. Janvier à mars est plus calme et moins cher.",
    tip: "Les liaisons directes ne sont pas quotidiennes : vérifiez les jours de desserte." },

  // ——— Nice
  { ...nice, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h 55", carriers: [],
    intro: "Depuis Nice, Amsterdam se rejoint en moins de deux heures : l’échappée idéale quand on veut changer de climat et de décor.",
    season: "Le printemps, avec les tulipes, et l’été sont les plus demandés. L’hiver est plus calme et plus abordable.",
    tip: "Pensez à une veste imperméable : le contraste avec la Côte d’Azur est net." },
  { ...nice, destination: "Prague", destinationCode: "PRG", region: "Europe", duration: "environ 2 h", carriers: [],
    intro: "Nice–Prague est un week-end de ville historique à moins de deux heures de vol.",
    season: "L’été et la fin d’année sont les plus fréquentés. De janvier à mars, c’est plus calme.",
    tip: "Les vols ne sont pas quotidiens toute l’année : regardez les jours de desserte avant de fixer vos dates." },
  { ...nice, destination: "Vienne", destinationCode: "VIE", region: "Europe", duration: "environ 1 h 50", carriers: [],
    intro: "Nice–Vienne mène en moins de deux heures à l’opéra, aux cafés historiques et aux palais d’une capitale très simple à vivre.",
    season: "Les marchés de Noël remplissent la ville de fin novembre à décembre. Le printemps et le début de l’automne sont plus calmes.",
    tip: "Un train relie l’aéroport au centre en une quinzaine de minutes." },
  { ...nice, destination: "Varsovie", destinationCode: "WAW", region: "Europe", duration: "environ 2 h 25", carriers: [],
    intro: "Nice–Varsovie relie la Côte d’Azur à une capitale reconstruite, entre vieille ville restaurée, musées récents et quartiers vivants.",
    season: "Le printemps et l’été sont les plus agréables. Aux fêtes de fin d’année, la ville s’illumine, avec des billets plus chers.",
    tip: "La Pologne reste abordable sur place : le budget repas et transports pèse peu face au prix du vol." },
  { ...nice, destination: "Copenhague", destinationCode: "CPH", region: "Europe", duration: "environ 2 h 25", carriers: [],
    intro: "Nice–Copenhague mène à une capitale à vélo, avec le port, les quartiers de design et une cuisine nordique.",
    season: "L’été est la belle saison, mais aussi la plus chère. Au printemps et à l’automne, on trouve plus de choix côté prix.",
    tip: "Le Danemark est cher sur place : prévoyez un budget repas plus élevé que dans le sud de l’Europe." },

  // ——— Toulouse
  { ...toulouse, destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", duration: "environ 1 h 50", carriers: [], formalities: true,
    intro: "Toulouse–Alger est l’une des liaisons les plus utilisées entre le Sud-Ouest et l’Algérie, en moins de deux heures.",
    season: "L’été, les congés scolaires et les fêtes concentrent la demande. Hors pointe, les prix sont plus souples.",
    tip: "Réservez tôt pour juillet et août : les vols directs depuis Toulouse se remplissent vite." },
  { ...toulouse, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h 50", carriers: [],
    intro: "Depuis Toulouse, Amsterdam se rejoint en moins de deux heures : canaux, musées et vélo pour un week-end.",
    season: "Le printemps et l’été sont les plus demandés. En hiver, les billets sont plus doux.",
    tip: "Le train rejoint le centre depuis l’aéroport en une vingtaine de minutes." },
  { ...toulouse, destination: "Prague", destinationCode: "PRG", region: "Europe", duration: "environ 2 h 05", carriers: [],
    intro: "Toulouse–Prague, c’est un week-end de vieille ville, de ponts et de brasseries à un peu plus de deux heures de vol.",
    season: "L’été et la fin d’année sont les plus fréquentés. En janvier et février, les prix sont plus bas.",
    tip: "Vérifiez les jours de desserte : les vols directs ne sont pas quotidiens toute l’année." },

  // ——— Bordeaux
  { ...bordeaux, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h 45", carriers: [],
    intro: "Bordeaux–Amsterdam, c’est un week-end de canaux et de musées à moins de deux heures.",
    season: "Le printemps et l’été sont les plus demandés. En automne et en hiver, les billets sont souvent plus doux.",
    tip: "Le train rejoint le centre depuis l’aéroport en une vingtaine de minutes." },
  { ...bordeaux, destination: "Prague", destinationCode: "PRG", region: "Europe", duration: "environ 2 h", carriers: [],
    intro: "Bordeaux–Prague mène en deux heures à une ville qui se parcourt à pied, entre château, pont Charles et brasseries.",
    season: "L’été et les marchés de Noël attirent la foule. De janvier à mars, c’est plus calme et moins cher.",
    tip: "Regardez les jours de desserte : les liaisons directes ne sont pas quotidiennes toute l’année." }
];
