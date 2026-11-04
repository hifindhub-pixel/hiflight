// Bons plans relevés à la main le 4 novembre 2026 sur les sites des compagnies et partenaires.
// Chaque offre a une date de fin : elle disparaît toute seule de l’accueil une fois passée.
export type Deal = {
  tag: string;
  title: string;
  figure: string;
  detail: string;
  dates: string;
  /** Fin de l’offre (ISO) : au-delà, la carte n’est plus affichée. */
  end: string;
  href: string;
  source: string;
};

export const dealsCheckedOn = "4 novembre 2026";

export const travelTuesday = {
  href: "/blog/travel-tuesday-2026-bons-plans-vols/",
  search: "/blog/travel-tuesday-2026-bons-plans-vols/#recherche",
  date: "2026-12-01T00:00:00+01:00",
  image: "https://images.unsplash.com/photo-1631080801009-5b4741cf3f12?auto=format&fit=crop&w=1600&q=75",
};

export const deals: Deal[] = [
  {
    tag: "Vente flash",
    title: "Transavia : jusqu’à -25 % sur une sélection de vols",
    figure: "Dès 39 € l’aller",
    detail: "Athènes et Malaga dès 39 €, Héraklion dès 40 €. Aussi le Maroc, l’Italie, l’Espagne, le Portugal. Voyages à partir du 24 novembre, au départ de France métropolitaine.",
    dates: "À réserver jusqu’au 10 novembre, 23 h 59",
    end: "2026-11-10T23:59:00+01:00",
    href: "https://www.transavia.com/vente-flash",
    source: "Transavia, conditions relayées par Dealabs",
  },
  {
    tag: "Black Friday",
    title: "Voyage Privé : ventes privées jusqu’au Travel Tuesday",
    figure: "Dès 49 € par personne",
    detail: "Séjours, week-ends et croisières. Prix relevé le 3 novembre pour une nuit en Andorre ; les prix du Travel Tuesday sont affichés le 1er décembre.",
    dates: "Du 10 novembre au 1er décembre",
    end: "2026-12-01T23:59:00+01:00",
    href: "https://www.voyage-prive.com/offres/travel-tuesday",
    source: "Voyage Privé",
  },
  {
    tag: "Travel Tuesday",
    title: "eDreams : les offres démarrent avant la date",
    figure: "Jusqu’à -40 % sur les hôtels",
    detail: "Et jusqu’à -20 % sur les locations de voiture, avec des remises en plus pour les membres Prime. Les offres s’affichent d’abord dans l’appli.",
    dates: "Appli dès le 19 novembre, site dès le 20, jusqu’au 1er décembre",
    end: "2026-12-01T23:59:00+01:00",
    href: "https://www.edreams.com/our-brand/news/travel-tuesday-flight-hotel-deals/",
    source: "eDreams",
  },
  {
    tag: "Miles",
    title: "Flying Blue : -25 % de miles sur des billets primes",
    figure: "Los Angeles dès 18 750 miles",
    detail: "En éco, par personne et en aller simple, plus les taxes à payer. New York en Business dès 45 000 miles. Voyage possible jusqu’au 30 avril 2027.",
    dates: "À réserver jusqu’au 30 novembre",
    end: "2026-11-30T23:59:00+01:00",
    href: "https://www.theflightclub.it/en/2026/11/air-france-klm-monthly-deals/",
    source: "The Flight Club",
  },
];
