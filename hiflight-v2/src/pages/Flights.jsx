import React, { useState } from 'react';
import LocationInput from '../components/LocationInput';
import FlightCard from '../components/FlightCard';
import { searchFlights } from '../services/api';
import { format, addDays } from 'date-fns';
import './Flights.css';

const today = format(new Date(), 'yyyy-MM-dd');
const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

export default function Flights() {
  const [origin, setOrigin] = useState(null);
  const [dest, setDest] = useState(null);
  const [departure, setDeparture] = useState(today);
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [tripType, setTripType] = useState('round'); // 'one' | 'round'
  const [cabin, setCabin] = useState('ECONOMY');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [filterDirect, setFilterDirect] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin || !dest) { setError('Veuillez sélectionner une origine et une destination.'); return; }
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const data = await searchFlights({
        originCode: origin.iataCode,
        destinationCode: dest.iataCode,
        departureDate: departure,
        returnDate: tripType === 'round' ? returnDate || nextWeek : undefined,
        adults,
        travelClass: cabin,
        sortBy,
        max: 30,
      });
      setResults(data);
    } catch (err) {
      setError('Erreur lors de la recherche. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = results?.offers?.filter(o =>
    filterDirect ? o.itineraries[0].segments.length === 1 : true
  ) || [];

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    if (sortBy === 'price') return a.price.total - b.price.total;
    if (sortBy === 'duration') return (a.itineraries[0].duration || '') < (b.itineraries[0].duration || '') ? -1 : 1;
    return 0;
  });

  return (
    <div className="flights-page">
      {/* HERO */}
      <div className="flights-hero">
        <div className="container flights-hero-inner">
          <h1 className="flights-hero-title outfit">
            Des millions de vols.<br />
            <span className="coral">Un seul endroit.</span>
          </h1>
          <p className="flights-hero-sub">Comparez Amadeus + Duffel en temps réel. Gratuit.</p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="search-section">
        <div className="container">
          <form className="search-box" onSubmit={handleSearch}>
            {/* Options */}
            <div className="search-opts">
              <button type="button" className={`opt-btn ${tripType === 'round' ? 'active' : ''}`} onClick={() => setTripType('round')}>Aller-retour</button>
              <button type="button" className={`opt-btn ${tripType === 'one' ? 'active' : ''}`} onClick={() => setTripType('one')}>Aller simple</button>
              <select className="opt-select" value={cabin} onChange={e => setCabin(e.target.value)}>
                <option value="ECONOMY">Économique</option>
                <option value="PREMIUM_ECONOMY">Premium Éco</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">Première</option>
              </select>
              <select className="opt-select" value={adults} onChange={e => setAdults(Number(e.target.value))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} adulte{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>

            {/* Champs */}
            <div className="search-fields">
              <div className="search-field">
                <label className="search-label">Départ</label>
                <LocationInput placeholder="Ville ou aéroport" value={origin} onChange={setOrigin} icon="✈️" />
              </div>
              <button type="button" className="swap-btn" onClick={() => { const t = origin; setOrigin(dest); setDest(t); }}>⇄</button>
              <div className="search-field">
                <label className="search-label">Arrivée</label>
                <LocationInput placeholder="Ville ou aéroport" value={dest} onChange={setDest} icon="📍" />
              </div>
              <div className="search-field search-field-date">
                <label className="search-label">Aller</label>
                <input type="date" className="date-input" value={departure} min={today} onChange={e => setDeparture(e.target.value)} />
              </div>
              {tripType === 'round' && (
                <div className="search-field search-field-date">
                  <label className="search-label">Retour</label>
                  <input type="date" className="date-input" value={returnDate} min={departure} onChange={e => setReturnDate(e.target.value)} />
                </div>
              )}
              <button type="submit" className="search-submit btn btn-primary btn-lg" disabled={loading}>
                {loading ? <span className="spinner" /> : '🔍 Rechercher'}
              </button>
            </div>
          </form>
          {error && <p className="search-error">{error}</p>}
        </div>
      </div>

      {/* RÉSULTATS */}
      {loading && (
        <div className="results-loading">
          <div className="spinner" style={{width:40,height:40,borderWidth:4}} />
          <p>Recherche en cours sur Amadeus + Duffel...</p>
        </div>
      )}

      {results && (
        <div className="container results-section">
          {/* Méta */}
          <div className="results-meta">
            <div className="results-count">
              <strong>{sortedOffers.length}</strong> vol{sortedOffers.length > 1 ? 's' : ''} trouvé{sortedOffers.length > 1 ? 's' : ''}
              <span className="results-sources">
                {results.meta.fromAmadeus > 0 && <span className="source-badge">Amadeus {results.meta.fromAmadeus}</span>}
                {results.meta.fromDuffel > 0 && <span className="source-badge">Duffel {results.meta.fromDuffel}</span>}
              </span>
            </div>
            <div className="results-controls">
              <label className="filter-check">
                <input type="checkbox" checked={filterDirect} onChange={e => setFilterDirect(e.target.checked)} />
                Vols directs uniquement
              </label>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price">Trier par prix</option>
                <option value="duration">Trier par durée</option>
                <option value="departure">Trier par départ</option>
              </select>
            </div>
          </div>

          {/* Offres */}
          <div className="results-list">
            {sortedOffers.length === 0 ? (
              <div className="no-results">
                <p>Aucun vol trouvé pour ces critères.</p>
                {results.meta.errors.length > 0 && (
                  <p className="sub" style={{fontSize:'0.82rem',marginTop:'0.5rem'}}>
                    Erreurs : {results.meta.errors.map(e => e.source).join(', ')}
                  </p>
                )}
              </div>
            ) : (
              sortedOffers.map(offer => <FlightCard key={offer.id} offer={offer} />)
            )}
          </div>
        </div>
      )}

      {/* DESTINATIONS POPULAIRES */}
      {!results && !loading && (
        <div className="container popular-section">
          <h2 className="popular-title outfit">Destinations populaires depuis la France</h2>
          <div className="popular-grid">
            {[
              { city: 'Barcelone', code: 'BCN', country: 'Espagne', emoji: '🇪🇸', price: 'dès 39€' },
              { city: 'Londres', code: 'LON', country: 'Royaume-Uni', emoji: '🇬🇧', price: 'dès 49€' },
              { city: 'Rome', code: 'FCO', country: 'Italie', emoji: '🇮🇹', price: 'dès 55€' },
              { city: 'Lisbonne', code: 'LIS', country: 'Portugal', emoji: '🇵🇹', price: 'dès 62€' },
              { city: 'Amsterdam', code: 'AMS', country: 'Pays-Bas', emoji: '🇳🇱', price: 'dès 79€' },
              { city: 'Dubaï', code: 'DXB', country: 'EAU', emoji: '🇦🇪', price: 'dès 299€' },
              { city: 'New York', code: 'JFK', country: 'États-Unis', emoji: '🇺🇸', price: 'dès 399€' },
              { city: 'Bangkok', code: 'BKK', country: 'Thaïlande', emoji: '🇹🇭', price: 'dès 349€' },
            ].map(d => (
              <button key={d.code} className="popular-card" onClick={() => {
                setDest({ iataCode: d.code, cityName: d.city, countryName: d.country, name: d.city });
              }}>
                <span className="popular-flag">{d.emoji}</span>
                <span className="popular-city">{d.city}</span>
                <span className="popular-country">{d.country}</span>
                <span className="popular-price">{d.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
