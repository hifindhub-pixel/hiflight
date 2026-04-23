const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { origin = 'PAR' } = req.query;
  try {
    const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/get_special_offers', {
      params: {
        currency: 'eur',
        origin: origin.toUpperCase(),
        sorting: 'price',
        limit: 12,
        page: 1,
        token: process.env.TP_TOKEN,
        marker: process.env.TP_MARKER || '714763',
      },
      timeout: 15000,
    });

    const data = response.data?.data || [];
    const dests = data.map(o => ({
      destination: o.destination,
      price: o.price,
      airline: o.airline,
      departure_at: o.departure_at,
    }));
    res.json({ data: dests });
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('[flights/popular]', err.response?.status, detail);
    res.status(500).json({ error: String(detail) });
  }
};
