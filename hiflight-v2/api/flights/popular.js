const axios = require('axios');

// Destinations populaires avec origines françaises
const DESTINATIONS = ['BCN','RAK','FCO','DXB','BKK','KUL','JFK','CUN','TIA','REK','MAD','LIS'];
const ORIGINS = [
  { code: 'MRS', name: 'Marseille' },
  { code: 'PAR', name: 'Paris' },
  { code: 'LYS', name: 'Lyon' },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const results = {};

  try {
    // Pour chaque origine, récupère les prix vers toutes les destinations
    const promises = ORIGINS.map(origin =>
      axios.get('https://api.travelpayouts.com/aviasales/v3/get_special_offers', {
        params: {
          currency: 'eur',
          origin: origin.code,
          sorting: 'price',
          limit: 30,
          page: 1,
          token: process.env.TP_TOKEN,
          marker: process.env.TP_MARKER || '714763',
        },
        timeout: 15000,
      }).then(r => ({ origin, data: r.data?.data || [] }))
       .catch(() => ({ origin, data: [] }))
    );

    const responses = await Promise.all(promises);

    // Construire un index : destination -> { origine -> prix }
    const priceIndex = {};
    for (const { origin, data } of responses) {
      for (const offer of data) {
        const dest = offer.destination;
        if (!priceIndex[dest]) priceIndex[dest] = {};
        if (!priceIndex[dest][origin.code] || offer.price < priceIndex[dest][origin.code].price) {
          priceIndex[dest][origin.code] = {
            price: offer.price,
            airline: offer.airline,
            departure_at: offer.departure_at,
            link: offer.link,
          };
        }
      }
    }

    // Construire la réponse finale
    const destinations = DESTINATIONS.map(dest => ({
      code: dest,
      origins: ORIGINS.map(o => ({
        from: o.name,
        fromCode: o.code,
        price: priceIndex[dest]?.[o.code]?.price || null,
        link: priceIndex[dest]?.[o.code]?.link || null,
        departure_at: priceIndex[dest]?.[o.code]?.departure_at || null,
      })).filter(o => o.price !== null),
    }));

    res.json({ data: destinations });

  } catch (err) {
    console.error('[popular]', err.message);
    res.status(500).json({ error: err.message });
  }
};
