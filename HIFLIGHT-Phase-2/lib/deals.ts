// Bons plans relevés à la main le 9 novembre 2026 sur les sites des compagnies et partenaires.
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

export const dealsCheckedOn = "9 novembre 2026";

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`;

export const deals: Deal[] = [
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
  {
    title: "Transavia",
    sub: "Vente flash, jusqu’au 10 novembre",
    before: "dès",
    figure: "39 €",
    after: "l’aller",
    image: photo("photo-1569629743817-70d8db6c323b"),
    end: "2026-11-10T23:59:00+01:00",
    href: "/blog/vente-flash-transavia-novembre-2026/",
    external: false,
    alt: "Avion de ligne en vol",
  },
  {
    title: "Black Friday voyages",
    sub: "Du 10 novembre au 1er décembre",
    cta: "Les dates et les bons réflexes →",
    image: photo("photo-1561501900-3701fa6a0864"),
    end: "2026-12-02T00:00:00+01:00",
    href: "/blog/black-friday-voyage-2026-dates-conseils/",
    external: false,
    alt: "Hôtel face à la mer au coucher du soleil",
  },
  {
    title: "Vos miles Flying Blue",
    sub: "Promo -25 %, jusqu’au 30 novembre",
    cta: "Miles ou euros : faire le calcul →",
    image: photo("photo-1594386245199-289c2fe0bd0a"),
    end: "2026-11-30T23:59:00+01:00",
    href: "/blog/flying-blue-promo-rewards-novembre-2026/",
    external: false,
    alt: "Aile d’avion vue du hublot au coucher du soleil",
  },
  {
    title: "Royal Air Maroc",
    sub: "Billets en miles -30 %, jusqu’au 30 novembre",
    cta: "Miles ou euros : les conditions →",
    image: photo("photo-1596750320291-a082a23dcc19"),
    end: "2026-11-30T23:59:00+01:00",
    href: "/blog/royal-air-maroc-safar-flyer-novembre-2026/",
    external: false,
    alt: "Marrakech, Maroc",
  },
];
