import type { PlaceFacts, RouteSeed } from "./content";

// Troisième vague : Nantes, Lille, Bordeaux, Toulouse, plus Montpellier comme nouveau départ.
// Les durées sont des ordres de grandeur ; aucune compagnie n’est citée car les dessertes
// changent selon les saisons, et aucun prix n’est écrit ici (les relevés viennent de l’API de prix).

export const wave3Places: Record<string, PlaceFacts> = {
  MPL: { airports: "Montpellier-Méditerranée (MPL)", center: "à une dizaine de kilomètres du centre de Montpellier" },
};

const nantes = { origin: "Nantes", originCode: "NTE" } as const;
const lille = { origin: "Lille", originCode: "LIL" } as const;
const bordeaux = { origin: "Bordeaux", originCode: "BOD" } as const;
const toulouse = { origin: "Toulouse", originCode: "TLS" } as const;
const montpellier = { origin: "Montpellier", originCode: "MPL" } as const;

export const wave3Seeds: RouteSeed[] = [
  // ——— Nantes
  { ...nantes, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h 30", carriers: [],
    intro: "Nantes–Amsterdam est un week-end facile à organiser : canaux, musées et balades à vélo, à environ une heure et demie de vol.",
    season: "Le printemps, avec les champs de tulipes, et les week-ends d’été sont les plus demandés. En hiver, les billets sont souvent plus doux.",
    tip: "Depuis Schiphol, le train rejoint le centre en une vingtaine de minutes : inutile de prévoir un taxi." },
  { ...nantes, destination: "Istanbul", destinationCode: "IST", region: "Europe", country: "turquie", duration: "environ 3 h 40", carriers: [],
    intro: "Nantes–Istanbul relie la Loire-Atlantique à une ville à cheval sur deux continents, entre bazars, mosquées et ferries sur le Bosphore.",
    season: "Le printemps et l’automne sont les plus agréables. L’été est chaud et plus cher, l’hiver plus calme.",
    tip: "Istanbul a deux aéroports, loin du centre : regardez lequel est utilisé avant de réserver, car le trajet jusqu’en ville n’est pas le même." },
  { ...nantes, destination: "Rome", destinationCode: "ROM", region: "Europe", country: "italie", duration: "environ 2 h", carriers: [],
    intro: "Nantes–Rome est un vol d’environ deux heures vers la capitale italienne : Colisée, places, trattorias et ruelles à explorer à pied.",
    season: "Le printemps et l’automne sont idéaux. Juillet et août sont très chauds et très fréquentés.",
    tip: "Selon l’offre, l’arrivée se fait à Fiumicino ou à Ciampino : comparez le temps de trajet jusqu’au centre." },
  { ...nantes, destination: "Djerba", destinationCode: "DJE", region: "Maroc et Tunisie", duration: "environ 3 h", carriers: [], formalities: true,
    intro: "Nantes–Djerba mène à l’île tunisienne des plages de sable fin et des villages blancs, très prisée pour les séjours en famille.",
    season: "L’été et les vacances scolaires concentrent la demande. Mai-juin et septembre-octobre sont plus calmes.",
    tip: "Les dessertes sont souvent saisonnières : vérifiez les jours de vol avant de fixer vos dates." },

  // ——— Lille
  { ...lille, destination: "Amsterdam", destinationCode: "AMS", region: "Europe", duration: "environ 1 h", carriers: [],
    intro: "Depuis Lille, Amsterdam est à environ une heure de vol : l’un des week-ends les plus rapides à organiser depuis le Nord.",
    season: "Le printemps et les week-ends d’été sont les plus demandés. En semaine et en hiver, les billets sont souvent plus doux.",
    tip: "Comparez aussi le train depuis Lille : selon les dates, il peut rivaliser en prix et en temps porte à porte." },
  { ...lille, destination: "Istanbul", destinationCode: "IST", region: "Europe", country: "turquie", duration: "environ 3 h 30", carriers: [],
    intro: "Lille–Istanbul est une liaison très utilisée depuis les Hauts-de-France, pour un week-end prolongé comme pour rendre visite à des proches.",
    season: "Le printemps et l’automne sont les plus agréables. Les vacances scolaires et l’été font monter les prix.",
    tip: "Vérifiez l’aéroport d’arrivée : Istanbul en compte deux, tous deux éloignés du centre historique." },
  { ...lille, destination: "Djerba", destinationCode: "DJE", region: "Maroc et Tunisie", duration: "environ 3 h", carriers: [], formalities: true,
    intro: "Lille–Djerba permet de rejoindre les plages tunisiennes sans passer par Paris, avec un vol d’environ trois heures.",
    season: "L’été et les congés scolaires concentrent la demande. Le printemps et l’automne offrent un bon compromis soleil et prix.",
    tip: "Les vols sont souvent saisonniers : regardez les jours de desserte avant de réserver." },

  // ——— Bordeaux
  { ...bordeaux, destination: "Istanbul", destinationCode: "IST", region: "Europe", country: "turquie", duration: "environ 3 h 30", carriers: [],
    intro: "Bordeaux–Istanbul relie la Gironde à la métropole turque, entre Sainte-Sophie, grand bazar et terrasses face au Bosphore.",
    season: "Avril-mai et septembre-octobre sont les plus agréables. L’été est chaud et plus cher.",
    tip: "Pensez aux horaires d’arrivée : les trajets vers le centre d’Istanbul sont longs en fin de journée." },
  { ...bordeaux, destination: "Rome", destinationCode: "ROM", region: "Europe", country: "italie", duration: "environ 2 h", carriers: [],
    intro: "Bordeaux–Rome, c’est la capitale italienne en deux heures de vol environ : un séjour court qui se remplit vite de visites.",
    season: "Le printemps et l’automne sont idéaux. L’été est très chaud, avec beaucoup de monde.",
    tip: "Comparez Fiumicino et Ciampino : le second est plus proche du centre mais n’est pas toujours desservi." },
  { ...bordeaux, destination: "Djerba", destinationCode: "DJE", region: "Maroc et Tunisie", duration: "environ 2 h 50", carriers: [], formalities: true,
    intro: "Bordeaux–Djerba mène à l’île tunisienne des plages et de la médina de Houmt Souk, avec un vol d’un peu moins de trois heures.",
    season: "L’été et les vacances scolaires font monter les prix. Mai-juin et septembre-octobre sont plus doux.",
    tip: "Les dessertes sont souvent saisonnières : vérifiez les jours de vol avant de réserver." },

  // ——— Toulouse
  { ...toulouse, destination: "Rome", destinationCode: "ROM", region: "Europe", country: "italie", duration: "environ 1 h 55", carriers: [],
    intro: "Toulouse–Rome relie la Ville rose à la Ville éternelle en moins de deux heures : un week-end qui suffit pour les grands classiques.",
    season: "Le printemps et l’automne sont les plus agréables. Juillet et août sont chauds et très fréquentés.",
    tip: "Réservez tôt pour les ponts et les vacances scolaires : les places se vendent vite." },
  { ...toulouse, destination: "Djerba", destinationCode: "DJE", region: "Maroc et Tunisie", duration: "environ 2 h 30", carriers: [], formalities: true,
    intro: "Toulouse–Djerba est un vol d’environ deux heures et demie vers l’île tunisienne, pratique pour un séjour de quelques jours ou plus.",
    season: "L’été et les congés scolaires concentrent la demande. Le printemps et l’automne sont plus calmes.",
    tip: "Les dessertes sont souvent saisonnières : vérifiez les jours de vol avant de fixer vos dates." },

  // ——— Montpellier
  { ...montpellier, destination: "Alger", destinationCode: "ALG", region: "Algérie", country: "algerie", duration: "environ 1 h 40", carriers: [], formalities: true,
    intro: "Montpellier–Alger est une liaison très utilisée en Occitanie, avec un peu moins de deux heures de vol pour rejoindre l’Algérie.",
    season: "L’été, les vacances scolaires et les fêtes concentrent la demande. Hors pointe, les prix sont plus souples.",
    tip: "Vérifiez la franchise de bagages incluse : elle change beaucoup d’une offre à l’autre." },
  { ...montpellier, destination: "Marrakech", destinationCode: "RAK", region: "Maroc et Tunisie", duration: "environ 2 h 50", carriers: [], formalities: true,
    intro: "Depuis Montpellier, Marrakech est une escapade soleil sans passer par Paris : médina, jardins et Atlas à portée de main.",
    season: "Le printemps et l’automne sont les plus agréables. L’été est très chaud et les vacances scolaires font monter les prix.",
    tip: "Les vols ne sont pas quotidiens toute l’année : regardez les jours de desserte avant de choisir vos dates." },
];
