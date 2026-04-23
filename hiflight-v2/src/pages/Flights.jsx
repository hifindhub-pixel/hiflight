import React, { useState } from 'react';
import LocationInput from '../components/LocationInput';
import FlightCard from '../components/FlightCard';
import { searchFlights } from '../services/api';
import { format, addDays } from 'date-fns';
import './Flights.css';

const today = format(new Date(), 'yyyy-MM-dd');
const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

const POPULAR = [
  { city:'Barcelone', code:'BCN', country:'Espagne', price:'dès 20€', photo:'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80' },
  { city:'Marrakech', code:'RAK', country:'Maroc', price:'dès 44€', photo:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { city:'Rome', code:'FCO', country:'Italie', price:'dès 22€', photo:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  { city:'Dubaï', code:'DXB', country:'Émirats arabes unis', price:'dès 199€', photo:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { city:'Bangkok', code:'BKK', country:'Thaïlande', price:'dès 349€', photo:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { city:'Kuala Lumpur', code:'KUL', country:'Malaisie', price:'dès 389€', photo:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
  { city:'New York', code:'JFK', country:'États-Unis', price:'dès 327€', photo:'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  { city:'Cancún', code:'CUN', country:'Mexique', price:'dès 363€', photo:'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80' },
  { city:'Tirana', code:'TIA', country:'Albanie', price:'dès 50€', photo:'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&q=80' },
  { city:'Reykjavik', code:'REK', country:'Islande', price:'dès 79€', photo:'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80' },
  { city:'Madrid', code:'MAD', country:'Espagne', price:'dès 16€', photo:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80' },
  { city:'Lisbonne', code:'LIS', country:'Portugal', price:'dès 21€', photo:'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80' },
];

const FAQ = [
  ['Comment HiFlight trouve-t-il les meilleurs prix ?', 'HiFlight compare en temps réel les tarifs de plus de 700 compagnies aériennes. Notre moteur analyse des millions de combinaisons pour vous présenter les meilleures offres en quelques secondes.'],
  ['HiFlight est-il vraiment gratuit ?', 'Oui, entièrement gratuit. Nous nous rémunérons via des commissions d\'affiliation versées par les agences et compagnies partenaires — sans aucun surcoût pour vous.'],
  ['Puis-je réserver directement sur HiFlight ?', 'HiFlight est un comparateur — nous vous montrons les meilleures offres et vous redirigeons vers le site de la compagnie ou de l\'agence pour finaliser la réservation.'],
  ['Pourquoi les prix changent-ils aussi vite ?', 'Les prix des vols varient en fonction de la demande, du délai avant le départ et de la saison. En général, réserver 6 à 8 semaines à l\'avance offre les meilleurs tarifs.'],
  ['Comment HiFlight protège-t-il mes données ?', 'HiFlight respecte le RGPD. Nous ne vendons aucune donnée personnelle à des tiers. Consultez notre Politique de confidentialité pour plus de détails.'],
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
  const [openFaq, setOpenFaq] = useState(null);

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
        adults, max: 30,
      });
      setResults(data);
    } catch { setError('Erreur lors de la recherche. Veuillez réessayer.'); }
    finally { setLoading(false); }
  };

  const selectPopular = (p) => {
    setDest({ iataCode: p.code, cityName: p.city, countryName: p.country, name: p.city, type: 'AIRPORT' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredOffers = (results?.offers || [])
    .filter(o => filterDirect ? o.itineraries[0].segments[0].stops === 0 : true)
    .sort((a, b) => sortBy === 'price' ? a.price.total - b.price.total : 0);

  return (
    <div className="fp">

      {/* HERO */}
      {!results && !loading && (
        <div className="fp-hero">
          <div className="fp-hero-inner">
            <h1 className="fp-hero-title">Des millions de vols.<br /><span className="fp-coral">Un seul endroit.</span></h1>
            <p className="fp-hero-sub">Comparez des centaines de compagnies aériennes en temps réel. Gratuit, sans inscription.</p>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className={`fp-search-wrap${results || loading ? ' fp-search-wrap--top' : ''}`}>
        <div className="fp-search-inner">
          <form className="fp-search" onSubmit={handleSearch}>
            <div className="fp-opts">
              <button type="button" className={`fp-opt${tripType==='round'?' on':''}`} onClick={()=>setTripType('round')}>Aller-retour</button>
              <button type="button" className={`fp-opt${tripType==='one'?' on':''}`} onClick={()=>setTripType('one')}>Aller simple</button>
              <select className="fp-sel" value={adults} onChange={e=>setAdults(Number(e.target.value))}>
                {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} adulte{n>1?'s':''}</option>)}
              </select>
            </div>
            <div className="fp-fields">
              <div className="fp-field">
                <label className="fp-lbl">Départ</label>
                <LocationInput placeholder="Ville ou aéroport" value={origin} onChange={setOrigin} icon="✈️" />
              </div>
              <button type="button" className="fp-swap" onClick={()=>{const t=origin;setOrigin(dest);setDest(t);}}>⇄</button>
              <div className="fp-field">
                <label className="fp-lbl">Arrivée</label>
                <LocationInput placeholder="Ville ou aéroport" value={dest} onChange={setDest} icon="📍" />
              </div>
              <div className="fp-field fp-field--sm">
                <label className="fp-lbl">Aller</label>
                <input type="date" className="fp-date" value={departure} min={today} onChange={e=>setDeparture(e.target.value)} />
              </div>
              {tripType==='round' && (
                <div className="fp-field fp-field--sm">
                  <label className="fp-lbl">Retour</label>
                  <input type="date" className="fp-date" value={returnDate} min={departure} onChange={e=>setReturnDate(e.target.value)} />
                </div>
              )}
              <button type="submit" className="fp-submit" disabled={loading}>
                {loading ? <span className="fp-spin"/> : '🔍 Recherche de vols'}
              </button>
            </div>
          </form>
          {error && <p className="fp-err">{error}</p>}
        </div>
      </div>

      {/* TRUST */}
      {!results && !loading && (
        <div className="fp-trust">
          <span><b>728</b> compagnies</span>
          <span><b>100%</b> gratuit</span>
        </div>
      )}

      {/* LOADING */}
      {loading && <div className="fp-loading"><div className="fp-spin fp-spin--lg"/><p>Recherche des meilleurs prix...</p></div>}

      {/* RESULTS */}
      {results && (
        <div className="fp-results-wrap">
          <div className="fp-results-hdr">
            <span className="fp-results-count"><strong>{filteredOffers.length}</strong> vol{filteredOffers.length>1?'s':''} trouvé{filteredOffers.length>1?'s':''}</span>
            <div className="fp-results-ctrl">
              <label className="fp-chk"><input type="checkbox" checked={filterDirect} onChange={e=>setFilterDirect(e.target.checked)}/>Vols directs</label>
              <select className="fp-sort-sel" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="price">Trier par prix</option>
                <option value="duration">Trier par durée</option>
              </select>
            </div>
          </div>
          {filteredOffers.length===0
            ? <div className="fp-empty"><p>Aucun vol trouvé. Essayez d'autres dates.</p><button onClick={()=>setResults(null)} className="fp-retry">Nouvelle recherche</button></div>
            : filteredOffers.map(o=><FlightCard key={o.id} offer={o}/>)
          }
        </div>
      )}

      {/* POPULAR DESTINATIONS WITH PHOTOS */}
      {!results && !loading && (
        <div className="fp-pop-section" id="fp-popular">
          <div className="fp-pop-inner">
            <h2 className="fp-pop-title">Destinations populaires depuis la France</h2>
            <div className="fp-pop-grid">
              {POPULAR.map(p => (
                <div key={p.code} className="fp-pop-card" onClick={()=>selectPopular(p)}>
                  <div className="fp-pop-img">
                    <img src={p.photo} alt={p.city} loading="lazy" />
                    <div className="fp-pop-overlay"/>
                    <div className="fp-pop-info">
                      <span className="fp-pop-city">{p.city}</span>
                      <span className="fp-pop-country">{p.country}</span>
                    </div>
                  </div>
                  <div className="fp-pop-footer">
                    <span className="fp-pop-label">À partir de</span>
                    <span className="fp-pop-price">{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {!results && !loading && (
        <section className="fp-faq">
          <div className="fp-faq-inner">
            <h2 className="fp-faq-title">Questions fréquentes</h2>
            <p className="fp-faq-sub">Tout ce que vous devez savoir avant de réserver</p>
            {FAQ.map(([q, a], i) => (
              <div key={i} className={`fp-faq-item${openFaq===i?' open':''}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                <div className="fp-faq-q">{q}<span className="fp-faq-chevron">▾</span></div>
                <div className="fp-faq-a">{a}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
