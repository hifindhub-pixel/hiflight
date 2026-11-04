// Bons plans relevés à la main le 4 novembre 2026 sur les sites des compagnies et partenaires.
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

export const dealsCheckedOn = "4 novembre 2026";

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
    href: "https://www.transavia.com/vente-flash",
    external: true,
    alt: "Avion de ligne en vol",
  },
  {
    title: "Voyage Privé",
    sub: "Black Friday, du 10 nov. au 1er déc.",
    before: "dès",
    figure: "49 €",
    after: "par personne",
    image: photo("photo-1561501900-3701fa6a0864"),
    end: "2026-12-01T23:59:00+01:00",
    href: "https://www.voyage-prive.com/offres/travel-tuesday",
    external: true,
    alt: "Hôtel face à la mer au coucher du soleil",
  },
  {
    title: "Flying Blue",
    sub: "-25 % de miles, jusqu’au 30 nov.",
    before: "Los Angeles dès",
    figure: "18 750",
    after: "miles",
    image: photo("photo-1594386245199-289c2fe0bd0a"),
    end: "2026-11-30T23:59:00+01:00",
    href: "https://www.theflightclub.it/en/2026/11/air-france-klm-monthly-deals/",
    external: true,
    alt: "Aile d’avion vue du hublot au coucher du soleil",
  },
];
