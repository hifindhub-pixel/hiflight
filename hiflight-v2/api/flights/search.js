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

  const dep = departureDate.substring(0, 10);
  const ret = returnDate ? returnDate.substring(0, 10) : null;
  const marker = process.env.TP_MARKER || '714763';
  const token = process.env.TP_TOKEN;

  try {
    // Appel API TP - prix les moins chers par mois
    const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/get_special_offers', {
      params: {
        currency: currencyCode.toLowerCase(),
        origin: originCode.toUpperCase(),
        destination: destinationCode.toUpperCase(),
        departure_at: dep,
        return_at: ret || undefined,
        sorting: 'price',
        direct: false,
        limit: 30,
        page: 1,
        token,
        marker,
      },
      timeout: 15000,
    });

    const data = response.data?.data || [];

    // Pour chaque vol TP, construire des liens vers TOUS les comparateurs
    const offers = data.map((o, i) => {
      const depDate = dep.replace(/-/g, '');
      const retDate = ret ? ret.replace(/-/g, '') : null;
      const orig = originCode.toUpperCase();
      const dest = destinationCode.toUpperCase();
      const pax = adults;

      // Liens affiliés vers tous les comparateurs
      const links = {
        aviasales: o.link ? `https://www.aviasales.com${o.link}` : null,
        kiwi: `https://www.kiwi.com/fr/search/results/${orig}/${dest}/${dep}${ret ? `/${ret}` : ''}?adults=${pax}&currency=EUR&affilid=hiflight`,
        kayak: `https://www.kayak.fr/flights/${orig}-${dest}/${dep}${ret ? `/${ret}` : ''}/${pax}adults?currency=EUR`,
        booking: `https://flights.booking.com/flights/${orig}.${dest}/?type=${ret ? 'roundtrip' : 'oneway'}&adults=${pax}&from=${orig}&to=${dest}&fromCountry=FR&depart=${dep}${ret ? `&return=${ret}` : ''}&currency=EUR`,
        expedia: `https://www.expedia.fr/Flights-Search?trip=${ret ? 'roundtrip' : 'oneway'}&leg1=from:${orig},to:${dest},departure:${dep}TANYT&leg2=${ret ? `from:${dest},to:${orig},departure:${ret}TANYT` : ''}&passengers=adults:${pax}&mode=search`,
        edreams: `https://www.edreams.fr/#/results/type=R;dep=${orig};arr=${dest};dd1=${dep}${ret ? `;dd2=${ret}` : ''};pa=${pax}`,
      };

      return {
        id: `tp_${i}_${o.flight_number || ''}`,
        source: 'travelpayouts',
        price: { total: o.price, currency: 'EUR', base: o.price, fees: 0 },
        itineraries: [{
          duration: o.duration ? `PT${o.duration}M` : null,
          segments: [{
            departure: { iataCode: orig, at: o.departure_at || dep },
            arrival: { iataCode: dest, at: o.return_at || dep },
            carrierCode: o.airline || '',
            flightNumber: String(o.flight_number || ''),
            stops: o.transfers || 0,
          }],
        }],
        validatingCarrier: o.airline || '',
        bookingToken: links.aviasales || links.kiwi,
        links, // tous les liens comparateurs
      };
    });

    const sorted = offers.sort((a, b) => a.price.total - b.price.total);
    res.json({ offers: sorted, meta: { total: sorted.length, fromTravelpayouts: sorted.length, errors: [] } });

  } catch (err) {
    console.error('[search]', err.response?.status, err.message);
    res.status(500).json({ error: err.message, offers: [], meta: { total: 0, errors: [] } });
  }
};
