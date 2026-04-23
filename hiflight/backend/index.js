require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aggregator = require('./services/aggregator');
const tpService = require('./services/travelpayouts');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── HEALTH ──
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: { travelpayouts: !!process.env.TP_TOKEN },
  });
});

// ── AUTOCOMPLETE AÉROPORTS ──
app.get('/api/locations', async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ error: 'Paramètre q requis (min 2 chars)' });
  try {
    const locations = await aggregator.searchLocations(q);
    res.json({ data: locations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── RECHERCHE VOLS ──
app.post('/api/flights/search', async (req, res) => {
  const { originCode, destinationCode, departureDate, returnDate, adults = 1, currencyCode = 'EUR', max = 30 } = req.body;
  if (!originCode || !destinationCode || !departureDate) {
    return res.status(400).json({ error: 'originCode, destinationCode, departureDate requis' });
  }
  try {
    const results = await aggregator.searchFlights({
      originCode: originCode.toUpperCase(),
      destinationCode: destinationCode.toUpperCase(),
      departureDate,
      returnDate,
      adults: parseInt(adults),
      currencyCode,
      max: parseInt(max),
    });
    res.json(results);
  } catch (err) {
    console.error('[/api/flights/search]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── DESTINATIONS POPULAIRES ──
app.get('/api/flights/popular', async (req, res) => {
  const { origin } = req.query;
  try {
    const dests = await tpService.getPopularDestinations(origin || 'PAR');
    res.json({ data: dests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HÔTELS ──
app.get('/api/hotels/search', async (req, res) => {
  const { city, checkin, checkout, adults = 2, children = 0, rooms = 1 } = req.query;
  if (!city || !checkin || !checkout) {
    return res.status(400).json({ error: 'city, checkin, checkout requis' });
  }
  try {
    const hotels = await tpService.searchHotels({ cityName: city, checkin, checkout, adults: parseInt(adults), children: parseInt(children), rooms: parseInt(rooms) });
    res.json({ data: hotels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 HiFlight Backend sur http://localhost:${PORT}`);
  console.log(`   Travelpayouts: ${process.env.TP_TOKEN ? '✅ configuré' : '⚠️  TP_TOKEN manquant'}`);
  console.log(`\nEndpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/locations?q=Paris`);
  console.log(`   POST /api/flights/search`);
  console.log(`   GET  /api/flights/popular?origin=PAR`);
  console.log(`   GET  /api/hotels/search?city=Barcelone&checkin=2025-06-01&checkout=2025-06-07\n`);
});

module.exports = app;
