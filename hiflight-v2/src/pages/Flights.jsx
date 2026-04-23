import React, { useState } from 'react';
import LocationInput from '../components/LocationInput';
import FlightCard from '../components/FlightCard';
import { searchFlights } from '../services/api';
import { format, addDays } from 'date-fns';
import './Flights.css';

const today = format(new Date(), 'yyyy-MM-dd');
const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

const POPULAR = [
  { city:'Barcelone', code:'BCN', country:'Espagne', emoji:'🇪🇸', price:'dès 20€' },
  { city:'Rome', code:'FCO', country:'Italie', emoji:'🇮🇹', price:'dès 22€' },
  { city:'Marrakech', code:'RAK', country:'Maroc', emoji:'🇲🇦', price:'dès 44€' },
  { city:'Londres', code:'LHR', country:'Royaume-Uni', emoji:'🇬🇧', price:'dès 49€' },
  { city:'Madrid', code:'MAD', country:'Espagne', emoji:'🇪🇸', price:'dès 16€' },
  { city:'Lisbonne', code:'LIS', country:'Portugal', emoji:'🇵🇹', price:'dès 21€' },
  { city:'Dubaï', code:'DXB', country:'Émirats', emoji:'🇦🇪', price:'dès 199€' },
  { city:'New York', code:'JFK', country:'États-Unis', emoji:'🇺🇸', price:'dès 327€' },
  { city:'Bangkok', code:'BKK', country:'Thaïlande', emoji:'🇹🇭', price:'dès 349€' },
  { city:'Reykjavik', code:'REK', country:'Islande', emoji:'🇮🇸', price:'dès 79€' },
  { city:'Cancún', code:'CUN', country:'Mexique', emoji:'🇲🇽', price:'dès 363€' },
  { city:'Tirana', code:'TIA', country:'Albanie', emoji:'🇦🇱', price:'dès 50€' },
];

export default function Flights() {
  const [origin, setOrigin] = useState(null);
  const [dest, setDest] = useState(null);
  const [departure, setDeparture] = useState(today);
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [tripType, setTripType] = useState('round');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [filterDirect, setFilterDirect] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin || !dest) { setError('Veuillez sélectionner une origine et une destination.'); return; }
    setError(''); setLoading(true); setResults(null);
    try {
      const data = await searchFlights({
        originCode: origin.iataCode,
        destinationCode: dest.iataCode,
        departureDate: departure,
        returnDate: tripType === 'round' ? (returnDate || nextWeek) : undefined,
        adults,
        max: 30,
      });
      setResults(data);
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => { const t = origin; setOrigin(dest); setDest(t); };

  const selectPopular = (p) => {
    setDest({ iataCode: p.code, cityName: p.city, countryName: p.country, name: p.city, type: 'AIRPORT' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredOffers = (results?.offers || [])
    .filter(o => filterDirect ? (o.itineraries[0].segments[0].stops === 0) : true)
    .sort((a, b) => sortBy === 'price' ? a.price.total - b.price.total : (a.itineraries[0].duration||'') < (b.itineraries[0].duration||'') ? -1 : 1);

  return (
    <div className="fp">
      {/* HERO */}
      {!results && !loading && (
        <div className="fp-hero">
          <div className="fp-hero-inner">
            <h1 className="fp-hero-title">Des millions de vols.<br /><span className="coral">Un seul endroit.</span></h1>
            <p className="fp-hero-sub">Comparez des centaines de compagnies aériennes en temps réel. Gratuit, sans inscription.</p>
          </div>
        </div>
      )}

      {/* SEARCH BOX */}
      <div className={`fp-search-wrap${results || loading ? ' fp-search-wrap--sticky' : ''}`}>
        <div className="container">
          <form className="fp-search" onSubmit={handleSearch}>
            <div className="fp-opts">
              <button type="button" className={`fp-opt${tripType==='round'?' fp-opt--on':''}`} onClick={()=>setTripType('round')}>Aller-retour</button>
              <button type="button" className={`fp-opt${tripType==='one'?' fp-opt--on':''}`} onClick={()=>setTripType('one')}>Aller simple</button>
              <select className="fp-sel" value={adults} onChange={e=>setAdults(Number(e.target.value))}>
                {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} adulte{n>1?'s':''}</option>)}
              </select>
            </div>
            <div className="fp-fields">
              <div className="fp-field">
                <label className="fp-label">Départ</label>
                <LocationInput placeholder="Ville ou aéroport" value={origin} onChange={setOrigin} icon="✈️" />
              </div>
              <button type="button" className="fp-swap" onClick={handleSwap}>⇄</button>
              <div className="fp-field">
                <label className="fp-label">Arrivée</label>
                <LocationInput placeholder="Ville ou aéroport" value={dest} onChange={setDest} icon="📍" />
              </div>
              <div className="fp-field fp-field--date">
                <label className="fp-label">Aller</label>
                <input type="date" className="fp-date" value={departure} min={today} onChange={e=>setDeparture(e.target.value)} />
              </div>
              {tripType==='round' && (
                <div className="fp-field fp-field--date">
                  <label className="fp-label">Retour</label>
                  <input type="date" className="fp-date" value={returnDate} min={departure} onChange={e=>setReturnDate(e.target.value)} />
                </div>
              )}
              <button type="submit" className="fp-submit" disabled={loading}>
                {loading ? <span className="fp-spinner" /> : '🔍 Recherche de vols'}
              </button>
            </div>
          </form>
          {error && <p className="fp-error">{error}</p>}
        </div>
      </div>

      {/* TRUST BAR */}
      {!results && !loading && (
        <div className="fp-trust">
          <span><b>728</b> compagnies</span>
          <span><b>100%</b> gratuit</span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="fp-loading">
          <div className="fp-spinner fp-spinner--lg" />
          <p>Recherche des meilleurs prix...</p>
        </div>
      )}

      {/* RÉSULTATS */}
      {results && (
        <div className="container fp-results">
          <div className="fp-results-header">
            <div className="fp-results-count">
              <strong>{filteredOffers.length}</strong> vol{filteredOffers.length > 1 ? 's' : ''} trouvé{filteredOffers.length > 1 ? 's' : ''}
              {origin && dest && <span className="fp-results-route">{origin.iataCode} → {dest.iataCode}</span>}
            </div>
            <div className="fp-results-controls">
              <label className="fp-check">
                <input type="checkbox" checked={filterDirect} onChange={e=>setFilterDirect(e.target.checked)} />
                Vols directs
              </label>
              <select className="fp-sort" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="price">Trier par prix</option>
                <option value="duration">Trier par durée</option>
              </select>
            </div>
          </div>
          {filteredOffers.length === 0 ? (
            <div className="fp-empty">
              <p>Aucun vol trouvé. Essayez d'autres dates ou destinations.</p>
              <button className="fp-btn-retry" onClick={()=>setResults(null)}>Nouvelle recherche</button>
            </div>
          ) : (
            filteredOffers.map(o => <FlightCard key={o.id} offer={o} />)
          )}
        </div>
      )}

      {/* DESTINATIONS POPULAIRES */}
      {!results && !loading && (
        <div className="container fp-popular">
          <h2 className="fp-popular-title">Destinations populaires depuis la France</h2>
          <div className="fp-popular-grid">
            {POPULAR.map(p => (
              <button key={p.code} className="fp-pop-card" onClick={() => selectPopular(p)}>
                <span className="fp-pop-flag">{p.emoji}</span>
                <div className="fp-pop-info">
                  <span className="fp-pop-city">{p.city}</span>
                  <span className="fp-pop-country">{p.country}</span>
                </div>
                <span className="fp-pop-price">{p.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
