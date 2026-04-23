const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { origin = 'PAR' } = req.query;
  try {
    const response = await axios.get('https://api.travelpayouts.com/v2/prices/cheap', {
      params: { currency: 'eur', origin, show_to_affiliates: true, marker: process.env.TP_MARKER || '714763' },
      headers: { 'X-Access-Token': process.env.TP_TOKEN },
      timeout: 15000,
    });
    const data = response.data?.data || {};
    const dests = [];
    for (const dest in data) {
      const cheapest = Object.values(data[dest]).sort((a, b) => a.price - b.price)[0];
      if (cheapest) dests.push({ destination: dest, price: cheapest.price, airline: cheapest.airline });
    }
    res.json({ data: dests.sort((a, b) => a.price - b.price).slice(0, 12) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
