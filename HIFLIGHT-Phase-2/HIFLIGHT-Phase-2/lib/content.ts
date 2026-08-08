export type FlightRoute = {
  slug: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  title: string;
  description: string;
};

export const flightRoutes: FlightRoute[] = [
  { slug: "paris-barcelone", origin: "Paris", originCode: "PAR", destination: "Barcelone", destinationCode: "BCN", title: "Vol Paris – Barcelone", description: "Comparez les vols Paris–Barcelone et choisissez l’offre adaptée à vos dates, vos bagages et vos préférences." },
  { slug: "paris-marrakech", origin: "Paris", originCode: "PAR", destination: "Marrakech", destinationCode: "RAK", title: "Vol Paris – Marrakech", description: "Comparez gratuitement les offres de vols entre Paris et Marrakech auprès des compagnies et agences partenaires." },
  { slug: "marseille-alger", origin: "Marseille", originCode: "MRS", destination: "Alger", destinationCode: "ALG", title: "Vol Marseille – Alger", description: "Trouvez un vol Marseille–Alger en comparant les horaires, escales et conditions proposées par les partenaires." },
  { slug: "lyon-dubai", origin: "Lyon", originCode: "LYS", destination: "Dubaï", destinationCode: "DXB", title: "Vol Lyon – Dubaï", description: "Comparez les options disponibles pour voyager de Lyon à Dubaï selon vos dates et vos préférences." },
  { slug: "paris-new-york", origin: "Paris", originCode: "PAR", destination: "New York", destinationCode: "NYC", title: "Vol Paris – New York", description: "Comparez les vols Paris–New York, avec ou sans escale, puis réservez auprès du partenaire sélectionné." },
  { slug: "paris-lisbonne", origin: "Paris", originCode: "PAR", destination: "Lisbonne", destinationCode: "LIS", title: "Vol Paris – Lisbonne", description: "Recherchez les offres disponibles entre Paris et Lisbonne et comparez les conditions avant de réserver." }
];

export const airports = [
  { slug: "paris-charles-de-gaulle", name: "Paris-Charles de Gaulle", code: "CDG", intro: "Le principal aéroport international parisien. Vérifiez toujours le terminal et le temps de transfert avant votre départ." },
  { slug: "paris-orly", name: "Paris-Orly", code: "ORY", intro: "Un aéroport situé au sud de Paris. Comparez le prix du billet avec le coût et la durée de votre trajet jusqu’à l’aéroport." },
  { slug: "paris-beauvais", name: "Paris-Beauvais", code: "BVA", intro: "Un aéroport plus éloigné de Paris. Une offre moins chère peut perdre son avantage une fois le transfert et le temps de trajet ajoutés." }
];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hiflight.fr";
export const searchUrl = process.env.NEXT_PUBLIC_SEARCH_URL || "https://vols.hiflight.fr";
