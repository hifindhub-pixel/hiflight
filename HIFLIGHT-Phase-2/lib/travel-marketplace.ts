export type ProviderOffer = {
  provider: string;
  price: number;
  label?: string;
  href: string;
};

export type MarketplaceSearch = Record<string, string | number | undefined>;

export function partnerHref(href: string, search: MarketplaceSearch) {
  const entries = Object.entries(search).filter(([, value]) => value !== undefined && value !== "");
  let target = href;
  for (const [key, value] of entries) target = target.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
  try {
    const url = new URL(target, "https://www.hiflight.fr");
    if (url.hostname !== "www.hiflight.fr") {
      const clickref = search.clickref;
      if (clickref && url.hostname.endsWith("awin1.com")) url.searchParams.set("clickref", String(clickref));
      url.searchParams.set("utm_source", "hiflight");
      url.searchParams.set("utm_medium", "comparison");
      url.searchParams.set("utm_campaign", "partner_click");
    } else {
      for (const [key, value] of entries) url.searchParams.set(key, String(value));
    }
    return url.hostname === "www.hiflight.fr" ? `${url.pathname}${url.search}` : url.toString();
  } catch {
    return href;
  }
}

export function isPartnerConnected(href: string) { return /^https?:\/\//.test(href); }

export type HotelResult = {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  category: number;
  description: string;
  perks: string[];
  x: number;
  y: number;
  offers: ProviderOffer[];
};

const hotelLinks = {
  // CJ Deep Link Automation converts this dynamic Booking search URL after consent.
  booking: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_URL || "https://www.booking.com/searchresults.fr.html?ss={destination}&checkin={checkin}&checkout={checkout}&group_adults={guests}&no_rooms=1&group_children=0",
  trip: process.env.NEXT_PUBLIC_TRIP_AFFILIATE_URL || "https://track.effiliation.com/servlet/effi.redir?id_compteur=23298697&url=https%3A%2F%2Ffr.trip.com%2F%3Flocale%3Dfr-fr",
};

export const flixBusLink = process.env.NEXT_PUBLIC_FLIXBUS_AFFILIATE_URL || "https://www.awin1.com/cread.php?awinmid=110874&awinaffid=2855063";

export const hotelResults: HotelResult[] = [
  {
    id: "paris-rivoli",
    name: "Hôtel Rivoli Marais",
    area: "Paris Centre · Le Marais",
    rating: 8.8,
    reviews: 1842,
    category: 4,
    description: "À proximité de la Seine et des principales lignes de métro.",
    perks: ["Annulation gratuite", "Petit-déjeuner disponible"],
    x: 55,
    y: 36,
    offers: [
      { provider: "Booking.com", price: 184, label: "Annulation gratuite", href: hotelLinks.booking },
      { provider: "Trip.com", price: 191, href: hotelLinks.trip },
    ],
  },
  {
    id: "opera-design",
    name: "Opéra Design Hotel",
    area: "Paris · Opéra",
    rating: 9.1,
    reviews: 963,
    category: 4,
    description: "Une adresse centrale, calme et adaptée aux courts séjours.",
    perks: ["Paiement sur place", "Métro à 3 min"],
    x: 43,
    y: 25,
    offers: [
      { provider: "Trip.com", price: 169, label: "Meilleur prix", href: hotelLinks.trip },
      { provider: "Booking.com", price: 176, href: hotelLinks.booking },
    ],
  },
  {
    id: "montmartre-house",
    name: "Montmartre House",
    area: "Paris · Montmartre",
    rating: 8.6,
    reviews: 2146,
    category: 3,
    description: "Chambres lumineuses au pied de la butte Montmartre.",
    perks: ["Petit-déjeuner inclus", "Très bien situé"],
    x: 49,
    y: 12,
    offers: [
      { provider: "Booking.com", price: 138, label: "Meilleur prix", href: hotelLinks.booking },
      { provider: "Trip.com", price: 149, href: hotelLinks.trip },
    ],
  },
  {
    id: "rive-gauche",
    name: "Maison Rive Gauche",
    area: "Paris · Quartier latin",
    rating: 9.3,
    reviews: 728,
    category: 5,
    description: "Une maison intimiste avec spa près du jardin du Luxembourg.",
    perks: ["Spa inclus", "Annulation gratuite"],
    x: 51,
    y: 53,
    offers: [
      { provider: "Trip.com", price: 246, label: "Meilleur prix", href: hotelLinks.trip },
      { provider: "Booking.com", price: 255, href: hotelLinks.booking },
    ],
  },
];
