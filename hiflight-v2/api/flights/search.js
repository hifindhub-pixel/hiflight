const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST requis' });

  const { originCode, destinationCode, departureDate, adults = 1, currencyCode = 'eur' } = req.body;
  if (!originCode || !destinationCode || !departureDate) {
    return res.status(400).json({ error: 'originCode, destinationCode, departureDate requis' });
  }

  try {
    const response = await axios.get('https://api.travelpayouts.com/v2/prices/cheap', {
      params: {
        currency: currencyCode.toLowerCase(),
        origin: originCode.toUpperCase(),
        destination: destinationCode.toUpperCase(),
        show_to_affiliates: true,
        depart_date: departureDate.substring(0, 7),
        marker: process.env.TP_MARKER || '714763',
      },
      headers: { 'X-Access-Token': process.env.TP_TOKEN },
      timeout: 15000,
    });

    const data = response.data?.data || {};
    const offers = [];
    for (const dest in data) {
      for (const key in data[dest]) {
        const o = data[dest][key];
        if (!o.price) continue;
        offers.push({
          id: 'tp_' + (o.flight_number || key),
          source: 'travelpayouts',
          price: { total: o.price, currency: currencyCode.toUpperCase(), base: o.price, fees: 0 },
          itineraries: [{
            duration: o.duration ? 'PT' + o.duration + 'M' : null,
            segments: [{
              departure: { iataCode: originCode.toUpperCase(), at: o.departure_at },
              arrival: { iataCode: destinationCode.toUpperCase(), at: o.return_at },
              carrierCode: o.airline,
              flightNumber: String(o.flight_number || ''),
              stops: o.transfers || 0,
            }],
          }],
          validatingCarrier: o.airline,
          bookingToken: 'https://www.aviasales.com' + (o.link || ''),
        });
      }
    }
    const sorted = offers.sort((a, b) => a.price.total - b.price.total);
    res.json({ offers: sorted, meta: { total: sorted.length, fromTravelpayouts: sorted.length, errors: [] } });
  } catch (err) {
    console.error('[flights/search]', err.message);
    res.status(500).json({ error: err.message, offers: [], meta: { total: 0, errors: [] } });
  }
};
