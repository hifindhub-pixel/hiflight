// Bons plans relevés à la main le 26 novembre 2026.
// Chaque offre a une date de fin : la carte disparaît toute seule de l’accueil une fois passée.
export type Deal = {
  title: string;
  sub: string;
  /** Texte avant le chiffre, le chiffre mis en avant, puis le texte après. */
  before?: string;
  figure?: string;
  after?: string;
  cta?: string;
  image: string;
  /** Fin de l’offre (ISO) : au-delà, la carte n’est plus affichée. */
  end: string;
  href: string;
  /** Lien interne (article) ou externe (page de l’offre). */
  external: boolean;
  alt: string;
};

export const dealsCheckedOn = "26 novembre 2026";

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`;

export const deals: Deal[] = [
  {
    title: "Vueling",
    sub: "Black Friday, d’ici le 29 novembre",
    before: "jusqu’à",
    figure: "-30 %",
    after: "sur une sélection",
    image: photo("photo-1617093888347-f73de2649f94"),
    end: "2026-11-29T23:59:00+01:00",
    href: "/blog/vueling-black-friday-2026-vols-2027/",
    external: false,
    alt: "Palma de Majorque",
  },
  {
    title: "Air Transat, Canada",
    sub: "Black Friday, jusqu’au 1er décembre",
    before: "Montréal dès",
    figure: "369 €",
    after: "A/R",
    image: photo("photo-1767290453327-14def235f9b4"),
    end: "2026-12-01T23:59:00+01:00",
    href: "/blog/air-transat-black-friday-canada-2026/",
    external: false,
    alt: "Montréal",
  },
  {
    title: "Black Friday voyages",
    sub: "Jusqu’au 1er décembre",
    cta: "Les ventes et les bons réflexes →",
    image: photo("photo-1561501900-3701fa6a0864"),
    end: "2026-12-02T00:00:00+01:00",
    href: "/blog/black-friday-voyage-2026-dates-conseils/",
    external: false,
    alt: "Hôtel face à la mer au coucher du soleil",
  },
  {
    title: "Travel Tuesday",
    sub: "Mardi 1er décembre",
    cta: "Lire notre guide et comparer →",
    image: photo("photo-1631080801009-5b4741cf3f12"),
    end: "2026-12-02T00:00:00+01:00",
    href: "/blog/travel-tuesday-2026-bons-plans-vols/",
    external: false,
    alt: "Valise couverte d’autocollants de voyage",
  },
];
