const axios = require('axios');

// ── TRAVELPAYOUTS API ──
// Docs: https://support.travelpayouts.com/hc/en-us/articles/203956163
const TP_BASE_FLIGHTS = 'https://api.travelpayouts.com/v2';
const TP_BASE_HOTELS = 'https://engine.hotellook.com/api/v2';

const tpFlights = axios.create({
  baseURL: TP_BASE_FLIGHTS,
  headers: {
    'X-Access-Token': process.env.TP_TOKEN,
    'Accept-Encoding': 'gzip',
  },
  timeout: 15000,
});

const tpHotels = axios.create({
  baseURL: TP_BASE_HOTELS,
  timeout: 15000,
});

// ── NORMALISATION VOLS ──
function normalizeTP(offer) {
  return {
    id: 'tp_' + offer.flight_number + '_' + offer.departure_at,
    source: 'travelpayouts',
    price: {
      total: offer.price,
      currency: 'EUR',
      base: offer.price,
      fees: 0,
    },
    itineraries: [{
      duration: offer.duration ? 'PT' + offer.duration + 'M' : null,
      segments: [{
        departure: {
          iataCode: offer.origin,
          at: offer.departure_at,
        },
        arrival: {
          iataCode: offer.destination,
          at: offer.return_at || null,
        },
        carrierCode: offer.airline,
        flightNumber: offer.flight_number,
        duration: offer.duration ? 'PT' + offer.duration + 'M' : null,
        stops: offer.transfers || 0,
      }],
    }],
    validatingCarrier: offer.airline,
    bookingToken: offer.link,
    expires_at: offer.expires_at,
  };
}

// ── RECHERCHE VOLS ──
// Utilise les prix les moins chers en cache TP (réponse instantanée)
async function searchFlights(params) {
  if (!process.env.TP_TOKEN) throw new Error('TP_TOKEN manquant');

  const response = await tpFlights.get('/prices/month-matrix', {
    params: {
      currency: params.currencyCode || 'eur',
      origin: params.originCode,
      destination: params.destinationCode,
      show_to_affiliates: true,
      month: params.departureDate ? params.departureDate.substring(0, 7) : undefined,
      marker: process.env.TP_MARKER || '714763',
    },
  });

  const data = response.data?.data || [];
  return data.slice(0, params.max || 20).map(normalizeTP);
}

// ── RECHERCHE VOLS PRIX CALENDRIER ──
async function searchCalendarPrices(params) {
  if (!process.env.TP_TOKEN) throw new Error('TP_TOKEN manquant');

  const response = await tpFlights.get('/prices/cheap', {
    params: {
      currency: 'eur',
      origin: params.originCode,
      destination: params.destinationCode,
      depart_date: params.departureDate,
      return_date: params.returnDate,
      marker: process.env.TP_MARKER || '714763',
    },
  });

  const data = response.data?.data || {};
  const offers = [];
  for (const dest in data) {
    for (const key in data[dest]) {
      const o = data[dest][key];
      offers.push({
        id: 'tp_' + o.flight_number + '_' + key,
        source: 'travelpayouts',
        price: { total: o.price, currency: 'EUR', base: o.price, fees: 0 },
        itineraries: [{
          duration: o.duration ? 'PT' + o.duration + 'M' : null,
          segments: [{
            departure: { iataCode: params.originCode, at: o.departure_at },
            arrival: { iataCode: params.destinationCode, at: o.return_at },
            carrierCode: o.airline,
            flightNumber: String(o.flight_number),
            stops: o.transfers || 0,
          }],
        }],
        validatingCarrier: o.airline,
        bookingToken: 'https://www.aviasales.com' + o.link,
      });
    }
  }
  return offers;
}

// ── RECHERCHE HÔTELS ──
async function searchHotels(params) {
  const response = await tpHotels.get('/cache.json', {
    params: {
      location: params.cityName,
      checkIn: params.checkin,
      checkOut: params.checkout,
      adultsCount: params.adults || 2,
      childrenCount: params.children || 0,
      roomsCount: params.rooms || 1,
      currency: 'EUR',
      limit: 20,
      marker: process.env.TP_MARKER || '714763',
      token: process.env.TP_TOKEN,
    },
  });

  return (response.data || []).map(hotel => ({
    id: 'tp_hotel_' + hotel.id,
    source: 'travelpayouts',
    name: hotel.name,
    stars: hotel.stars,
    price: { total: hotel.priceFrom, currency: 'EUR' },
    location: { lat: hotel.location?.lat, lng: hotel.location?.lon },
    photo: hotel.photoUrl,
    rating: hotel.guestScore,
    bookingUrl: `https://search.hotellook.com/?marker=${process.env.TP_MARKER || '714763'}&hotelId=${hotel.id}&checkIn=${params.checkin}&checkOut=${params.checkout}&adults=${params.adults || 2}`,
  }));
}

// ── DESTINATIONS POPULAIRES ──
async function getPopularDestinations(origin) {
  if (!process.env.TP_TOKEN) throw new Error('TP_TOKEN manquant');

  const response = await tpFlights.get('/prices/cheap', {
    params: {
      currency: 'eur',
      origin: origin || 'PAR',
      marker: process.env.TP_MARKER || '714763',
    },
  });

  const data = response.data?.data || {};
  const dests = [];
  for (const dest in data) {
    const prices = data[dest];
    const cheapest = Object.values(prices).sort((a, b) => a.price - b.price)[0];
    if (cheapest) {
      dests.push({
        destination: dest,
        price: cheapest.price,
        airline: cheapest.airline,
        departure_at: cheapest.departure_at,
      });
    }
  }
  return dests.sort((a, b) => a.price - b.price).slice(0, 12);
}

module.exports = { searchFlights, searchCalendarPrices, searchHotels, getPopularDestinations };
