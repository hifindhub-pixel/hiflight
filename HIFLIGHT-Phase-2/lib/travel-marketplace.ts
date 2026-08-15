export type ProviderOffer = {
  provider: string;
  price: number;
  label?: string;
  href: string;
};

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

export type VehicleResult = {
  id: string;
  name: string;
  category: string;
  seats: number;
  bags: number;
  transmission: "Automatique" | "Manuelle";
  pickup: string;
  badge: string;
  x: number;
  y: number;
  offers: ProviderOffer[];
};

const hotelLinks = {
  booking: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_URL || "/hotels",
  expedia: process.env.NEXT_PUBLIC_EXPEDIA_AFFILIATE_URL || "/hotels",
  trip: process.env.NEXT_PUBLIC_TRIP_AFFILIATE_URL || "/hotels",
  hotels: process.env.NEXT_PUBLIC_HOTELS_AFFILIATE_URL || "/hotels",
};

const carLinks = {
  rentalcars: process.env.NEXT_PUBLIC_RENTALCARS_AFFILIATE_URL || "/voitures",
  discover: process.env.NEXT_PUBLIC_DISCOVERCARS_AFFILIATE_URL || "/voitures",
  expedia: process.env.NEXT_PUBLIC_EXPEDIA_CARS_AFFILIATE_URL || "/voitures",
};

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
      { provider: "Expedia", price: 191, href: hotelLinks.expedia },
      { provider: "Hotels.com", price: 197, href: hotelLinks.hotels },
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
      { provider: "Expedia", price: 181, href: hotelLinks.expedia },
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
      { provider: "Hotels.com", price: 138, label: "Meilleur prix", href: hotelLinks.hotels },
      { provider: "Expedia", price: 142, href: hotelLinks.expedia },
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
      { provider: "Expedia", price: 246, label: "Meilleur prix", href: hotelLinks.expedia },
      { provider: "Booking.com", price: 255, href: hotelLinks.booking },
      { provider: "Hotels.com", price: 261, href: hotelLinks.hotels },
    ],
  },
];

export const vehicleResults: VehicleResult[] = [
  {
    id: "citadine-auto",
    name: "Peugeot 208 ou similaire",
    category: "Citadine",
    seats: 5,
    bags: 2,
    transmission: "Automatique",
    pickup: "Aéroport Paris-Orly",
    badge: "Le plus économique",
    x: 63,
    y: 68,
    offers: [
      { provider: "Rentalcars", price: 34, label: "Kilométrage inclus", href: carLinks.rentalcars },
      { provider: "DiscoverCars", price: 37, href: carLinks.discover },
      { provider: "Expedia", price: 42, href: carLinks.expedia },
    ],
  },
  {
    id: "compacte",
    name: "Renault Captur ou similaire",
    category: "SUV compact",
    seats: 5,
    bags: 3,
    transmission: "Manuelle",
    pickup: "Paris Gare de Lyon",
    badge: "Choix populaire",
    x: 57,
    y: 43,
    offers: [
      { provider: "DiscoverCars", price: 46, label: "Meilleur prix", href: carLinks.discover },
      { provider: "Rentalcars", price: 49, href: carLinks.rentalcars },
      { provider: "Expedia", price: 55, href: carLinks.expedia },
    ],
  },
  {
    id: "familiale",
    name: "Peugeot 3008 ou similaire",
    category: "SUV familial",
    seats: 5,
    bags: 4,
    transmission: "Automatique",
    pickup: "Aéroport Paris-CDG",
    badge: "Idéal en famille",
    x: 76,
    y: 20,
    offers: [
      { provider: "Expedia", price: 61, label: "Annulation gratuite", href: carLinks.expedia },
      { provider: "Rentalcars", price: 65, href: carLinks.rentalcars },
      { provider: "DiscoverCars", price: 68, href: carLinks.discover },
    ],
  },
];

export const stay22Aid = process.env.NEXT_PUBLIC_STAY22_AID || "";
