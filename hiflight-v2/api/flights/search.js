const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST requis' });

  const { originCode, destinationCode, departureDate, returnDate, adults = 1, currencyCode = 'eur' } = req.body;
  if (!originCode || !destinationCode || !departureDate) {
    return res.status(400).json({ error: 'originCode, destinationCode, departureDate requis' });
  }

  try {
    // Aviasales/TP API v2 - recherche de vols pas chers
    const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/get_special_offers', {
      params: {
        currency: currencyCode.toLowerCase(),
        origin: originCode.toUpperCase(),
        destination: destinationCode.toUpperCase(),
        departure_at: departureDate,
        return_at: returnDate || undefined,
        sorting: 'price',
        direct: false,
        cy_from: originCode.toUpperCase(),
        limit: 30,
        page: 1,
        one_way: returnDate ? false : true,
        token: process.env.TP_TOKEN,
        marker: process.env.TP_MARKER || '714763',
      },
      timeout: 15000,
    });

    const data = response.data?.data || [];
    const offers = data.map((o, i) => ({
      id: 'tp_' + i + '_' + (o.flight_number || o.number || ''),
      source: 'travelpayouts',
      price: { total: o.price, currency: currencyCode.toUpperCase(), base: o.price, fees: 0 },
      itineraries: [{
        duration: o.duration ? 'PT' + o.duration + 'M' : null,
        segments: [{
          departure: { iataCode: o.origin || originCode.toUpperCase(), at: o.departure_at || departureDate },
          arrival: { iataCode: o.destination || destinationCode.toUpperCase(), at: o.return_at || '' },
          carrierCode: o.airline || '',
          flightNumber: String(o.flight_number || o.number || ''),
          stops: o.transfers || 0,
        }],
      }],
      validatingCarrier: o.airline || '',
      bookingToken: o.link ? 'https://www.aviasales.com' + o.link : '',
    }));

    const sorted = offers.sort((a, b) => a.price.total - b.price.total);
    res.json({ offers: sorted, meta: { total: sorted.length, fromTravelpayouts: sorted.length, errors: [] } });

  } catch (err) {
    // Log détaillé pour debug
    const detail = err.response?.data || err.message;
    const status = err.response?.status;
    console.error('[flights/search]', status, detail);

    // Fallback : retourner des offres vides avec détail erreur
    res.status(500).json({
      error: `TP API error ${status}: ${JSON.stringify(detail)}`,
      offers: [],
      meta: { total: 0, errors: [{ source: 'travelpayouts', error: String(detail) }] }
    });
  }
};
