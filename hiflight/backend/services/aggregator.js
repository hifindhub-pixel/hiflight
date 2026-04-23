const tpService = require('./travelpayouts');

async function searchFlights(params) {
  try {
    const offers = await tpService.searchCalendarPrices(params);
    const sorted = offers.sort((a, b) => a.price.total - b.price.total);
    return {
      offers: sorted,
      meta: {
        total: sorted.length,
        fromTravelpayouts: sorted.length,
        errors: [],
      },
    };
  } catch (err) {
    console.error('[Travelpayouts] Error:', err.message);
    return { offers: [], meta: { total: 0, fromTravelpayouts: 0, errors: [{ source: 'travelpayouts', error: err.message }] } };
  }
}

async function searchLocations(q) {
  const AIRPORTS = [
    { iataCode: 'CDG', cityName: 'Paris', name: 'Paris Charles de Gaulle', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'ORY', cityName: 'Paris', name: 'Paris Orly', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'NCE', cityName: 'Nice', name: 'Nice Côte d\'Azur', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'MRS', cityName: 'Marseille', name: 'Marseille Provence', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'LYS', cityName: 'Lyon', name: 'Lyon Saint-Exupéry', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'TLS', cityName: 'Toulouse', name: 'Toulouse Blagnac', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'BOD', cityName: 'Bordeaux', name: 'Bordeaux Mérignac', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'NTE', cityName: 'Nantes', name: 'Nantes Atlantique', countryName: 'France', type: 'AIRPORT' },
    { iataCode: 'LHR', cityName: 'Londres', name: 'Londres Heathrow', countryName: 'Royaume-Uni', type: 'AIRPORT' },
    { iataCode: 'LGW', cityName: 'Londres', name: 'Londres Gatwick', countryName: 'Royaume-Uni', type: 'AIRPORT' },
    { iataCode: 'BCN', cityName: 'Barcelone', name: 'Barcelone El Prat', countryName: 'Espagne', type: 'AIRPORT' },
    { iataCode: 'MAD', cityName: 'Madrid', name: 'Madrid Barajas', countryName: 'Espagne', type: 'AIRPORT' },
    { iataCode: 'FCO', cityName: 'Rome', name: 'Rome Fiumicino', countryName: 'Italie', type: 'AIRPORT' },
    { iataCode: 'MXP', cityName: 'Milan', name: 'Milan Malpensa', countryName: 'Italie', type: 'AIRPORT' },
    { iataCode: 'AMS', cityName: 'Amsterdam', name: 'Amsterdam Schiphol', countryName: 'Pays-Bas', type: 'AIRPORT' },
    { iataCode: 'LIS', cityName: 'Lisbonne', name: 'Lisbonne', countryName: 'Portugal', type: 'AIRPORT' },
    { iataCode: 'ATH', cityName: 'Athènes', name: 'Athènes', countryName: 'Grèce', type: 'AIRPORT' },
    { iataCode: 'VIE', cityName: 'Vienne', name: 'Vienne', countryName: 'Autriche', type: 'AIRPORT' },
    { iataCode: 'BER', cityName: 'Berlin', name: 'Berlin Brandenburg', countryName: 'Allemagne', type: 'AIRPORT' },
    { iataCode: 'FRA', cityName: 'Francfort', name: 'Francfort', countryName: 'Allemagne', type: 'AIRPORT' },
    { iataCode: 'MUC', cityName: 'Munich', name: 'Munich', countryName: 'Allemagne', type: 'AIRPORT' },
    { iataCode: 'BRU', cityName: 'Bruxelles', name: 'Bruxelles', countryName: 'Belgique', type: 'AIRPORT' },
    { iataCode: 'ZRH', cityName: 'Zurich', name: 'Zurich', countryName: 'Suisse', type: 'AIRPORT' },
    { iataCode: 'GVA', cityName: 'Genève', name: 'Genève', countryName: 'Suisse', type: 'AIRPORT' },
    { iataCode: 'PRG', cityName: 'Prague', name: 'Prague', countryName: 'Tchéquie', type: 'AIRPORT' },
    { iataCode: 'WAW', cityName: 'Varsovie', name: 'Varsovie', countryName: 'Pologne', type: 'AIRPORT' },
    { iataCode: 'BUD', cityName: 'Budapest', name: 'Budapest', countryName: 'Hongrie', type: 'AIRPORT' },
    { iataCode: 'DXB', cityName: 'Dubaï', name: 'Dubaï International', countryName: 'Émirats Arabes Unis', type: 'AIRPORT' },
    { iataCode: 'AUH', cityName: 'Abu Dhabi', name: 'Abu Dhabi', countryName: 'Émirats Arabes Unis', type: 'AIRPORT' },
    { iataCode: 'JFK', cityName: 'New York', name: 'New York JFK', countryName: 'États-Unis', type: 'AIRPORT' },
    { iataCode: 'LAX', cityName: 'Los Angeles', name: 'Los Angeles', countryName: 'États-Unis', type: 'AIRPORT' },
    { iataCode: 'MIA', cityName: 'Miami', name: 'Miami', countryName: 'États-Unis', type: 'AIRPORT' },
    { iataCode: 'YUL', cityName: 'Montréal', name: 'Montréal Trudeau', countryName: 'Canada', type: 'AIRPORT' },
    { iataCode: 'NRT', cityName: 'Tokyo', name: 'Tokyo Narita', countryName: 'Japon', type: 'AIRPORT' },
    { iataCode: 'HKG', cityName: 'Hong Kong', name: 'Hong Kong', countryName: 'Hong Kong', type: 'AIRPORT' },
    { iataCode: 'SIN', cityName: 'Singapour', name: 'Singapour Changi', countryName: 'Singapour', type: 'AIRPORT' },
    { iataCode: 'BKK', cityName: 'Bangkok', name: 'Bangkok Suvarnabhumi', countryName: 'Thaïlande', type: 'AIRPORT' },
    { iataCode: 'KUL', cityName: 'Kuala Lumpur', name: 'Kuala Lumpur', countryName: 'Malaisie', type: 'AIRPORT' },
    { iataCode: 'SYD', cityName: 'Sydney', name: 'Sydney', countryName: 'Australie', type: 'AIRPORT' },
    { iataCode: 'CMN', cityName: 'Casablanca', name: 'Casablanca Mohammed V', countryName: 'Maroc', type: 'AIRPORT' },
    { iataCode: 'RAK', cityName: 'Marrakech', name: 'Marrakech Menara', countryName: 'Maroc', type: 'AIRPORT' },
    { iataCode: 'TUN', cityName: 'Tunis', name: 'Tunis Carthage', countryName: 'Tunisie', type: 'AIRPORT' },
    { iataCode: 'ALG', cityName: 'Alger', name: 'Alger', countryName: 'Algérie', type: 'AIRPORT' },
    { iataCode: 'ORN', cityName: 'Oran', name: 'Oran', countryName: 'Algérie', type: 'AIRPORT' },
    { iataCode: 'CUN', cityName: 'Cancún', name: 'Cancún', countryName: 'Mexique', type: 'AIRPORT' },
    { iataCode: 'IST', cityName: 'Istanbul', name: 'Istanbul', countryName: 'Turquie', type: 'AIRPORT' },
    { iataCode: 'CAI', cityName: 'Le Caire', name: 'Le Caire', countryName: 'Égypte', type: 'AIRPORT' },
    { iataCode: 'REK', cityName: 'Reykjavik', name: 'Reykjavik', countryName: 'Islande', type: 'AIRPORT' },
    { iataCode: 'TIA', cityName: 'Tirana', name: 'Tirana', countryName: 'Albanie', type: 'AIRPORT' },
    { iataCode: 'DPS', cityName: 'Bali', name: 'Bali Ngurah Rai', countryName: 'Indonésie', type: 'AIRPORT' },
    { iataCode: 'GRU', cityName: 'São Paulo', name: 'São Paulo Guarulhos', countryName: 'Brésil', type: 'AIRPORT' },
  ];

  const s = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return AIRPORTS.filter(a => {
    const city = a.cityName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const name = a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const code = a.iataCode.toLowerCase();
    return city.startsWith(s) || name.includes(s) || code.startsWith(s);
  }).slice(0, 8);
}

module.exports = { searchFlights, searchLocations };
