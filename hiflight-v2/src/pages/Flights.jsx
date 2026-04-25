import React, { useState, useRef, useEffect, useCallback } from 'react';
import FlightCard from '../components/FlightCard';
import { searchFlights, searchLocations, getPopularFlights } from '../services/api';
import { format, addDays } from 'date-fns';
import './Flights.css';

const today = format(new Date(), 'yyyy-MM-dd');
const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

const DEST_INFO = {
  BCN: { city:'Barcelone', country:'Espagne', photo:'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80' },
  RAK: { city:'Marrakech', country:'Maroc', photo:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  FCO: { city:'Rome', country:'Italie', photo:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  DXB: { city:'Dubaï', country:'Émirats arabes unis', photo:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  BKK: { city:'Bangkok', country:'Thaïlande', photo:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  KUL: { city:'Kuala Lumpur', country:'Malaisie', photo:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
  JFK: { city:'New York', country:'États-Unis', photo:'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  CUN: { city:'Cancún', country:'Mexique', photo:'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80' },
  TIA: { city:'Tirana', country:'Albanie', photo:'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&q=80' },
  REK: { city:'Reykjavik', country:'Islande', photo:'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80' },
  MAD: { city:'Madrid', country:'Espagne', photo:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80' },
  LIS: { city:'Lisbonne', country:'Portugal', photo:'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80' },
};

const FAQ = [
  ['Comment HiFlight trouve-t-il les meilleurs prix ?', 'HiFlight compare en temps réel les tarifs de plus de 700 compagnies aériennes. Notre moteur analyse des millions de combinaisons pour vous présenter les meilleures offres en quelques secondes.'],
  ['HiFlight est-il vraiment gratuit ?', "Oui, entièrement gratuit. Nous nous rémunérons via des commissions d'affiliation versées par les agences et compagnies partenaires — sans aucun surcoût pour vous."],
  ['Puis-je réserver directement sur HiFlight ?', "HiFlight est un comparateur — nous vous montrons les meilleures offres et vous redirigeons vers le site de la compagnie ou de l'agence pour finaliser la réservation."],
  ['Pourquoi les prix changent-ils aussi vite ?', "Les prix des vols varient en fonction de la demande, du délai avant le départ et de la saison. En général, réserver 6 à 8 semaines à l'avance offre les meilleurs tarifs."],
  ['Comment HiFlight protège-t-il mes données ?', 'HiFlight respecte le RGPD. Nous ne vendons aucune donnée personnelle à des tiers.'],
];

// ── AUTOCOMPLETE ──
function AirportInput({ placeholder, value, onChange }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    if (value?.label) setQuery(value.label);
    else if (!value) setQuery('');
  }, [value]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onChange(null);
    clearTimeout(timer.current);
    if (q.length >= 2) {
      timer.current = setTimeout(async () => {
        try {
          const data = await searchLocations(q);
          setSuggestions(data.data || []);
          setOpen(true);
        } catch { setSuggestions([]); }
      }, 250);
    } else { setSuggestions([]); setOpen(false); }
  };

  const select = (loc) => {
    const label = `${loc.cityName || loc.name} (${loc.iataCode})`;
    setQuery(label);
    onChange({ ...loc, label });
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="ai-wrap" ref={ref}>
      <input className="ai-input" type="text" placeholder={placeholder} value={query}
        onChange={handleChange} onFocus={() => suggestions.length > 0 && setOpen(true)} autoComplete="off" />
      {open && suggestions.length > 0 && (
        <div className="ai-dropdown">
          {suggestions.map(s => (
            <button key={s.iataCode} className="ai-item" onMouseDown={() => select(s)}>
              <span className="ai-code">{s.iataCode}</span>
              <span className="ai-info">
                <span className="ai-city">{s.cityName || s.name}</span>
                <span className="ai-country">{s.countryName}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN ──
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
  const [popular, setPopular] = useState([]);

  // Charger les prix populaires au démarrage
  useEffect(() => {
    getPopularFlights('PAR').then(data => {
      if (data?.data) setPopular(data.data);
    }).catch(() => {});
  }, []);

  const doSearch = useCallback(async (originLoc, destLoc, depDate, retDate, numAdults, type) => {
    if (!originLoc || !destLoc) return;
    setError(''); setLoading(true); setResults(null);
    try {
      const data = await searchFlights({
        originCode: originLoc.iataCode,
        destinationCode: destLoc.iataCode,
        departureDate: depDate,
        returnDate: type === 'round' ? (retDate || nextWeek) : undefined,
        adults: numAdults, max: 30,
      });
      setResults(data);
    } catch { setError('Erreur lors de la recherche. Veuillez réessayer.'); }
    finally { setLoading(false); }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin || !dest) { setError('Veuillez sélectionner une origine et une destination.'); return; }
    doSearch(origin, dest, departure, returnDate, adults, tripType);
  };

  // Clic sur une origine dans les destinations populaires → recherche directe
  const ORIGIN_CODES = { 'Marseille':'MRS', 'Paris':'CDG', 'Lyon':'LYS', 'Nantes':'NTE', 'Bordeaux':'BOD', 'Toulouse':'TLS' };

  const handleOriginClick = (destCode, originName, originCode) => {
    const code = originCode || ORIGIN_CODES[originName] || 'CDG';
    const originLoc = { iataCode: code, cityName: originName, label: `${originName} (${code})` };
    const destInfo = DEST_INFO[destCode];
    const destLoc = { iataCode: destCode, cityName: destInfo?.city, label: `${destInfo?.city} (${destCode})` };
    setOrigin(originLoc);
    setDest(destLoc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => doSearch(originLoc, destLoc, departure, returnDate, adults, tripType), 100);
  };

  const filteredOffers = (results?.offers || [])
    .filter(o => filterDirect ? o.itineraries[0].segments[0].stops === 0 : true)
    .sort((a, b) => sortBy === 'price' ? a.price.total - b.price.total : 0);

  // Construire les données des destinations populaires
  const popularCards = Object.entries(DEST_INFO).map(([code, info]) => {
    const pop = popular.find(p => p.destination === code);
    return { code, ...info, origins: pop?.origins || [] };
  });

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

      {/* TRUST */}
      {!results && !loading && (
        <div className="fp-trust">
          <span><b>728</b> compagnies</span>
          <span><b>100%</b> gratuit</span>
        </div>
      )}

      {/* SEARCH */}
      <div className={`fp-search-wrap${results || loading ? ' sticky' : ''}`}>
        <div className="fp-search-inner">
          <form className="fp-search" onSubmit={handleSearch}>
            <div className="fp-opts">
              <button type="button" className={`fp-opt${tripType==='round'?' on':''}`} onClick={()=>setTripType('round')}>Aller-retour</button>
              <button type="button" className={`fp-opt${tripType==='one'?' on':''}`} onClick={()=>setTripType('one')}>Aller simple</button>
            </div>
            <div className="fp-bar">
              <div className="fp-bar-cell fp-bar-lg">
                <AirportInput placeholder="Ville, aéroport" value={origin} onChange={setOrigin} />
              </div>
              <span className="fp-bar-sep" />
              <div className="fp-bar-cell fp-bar-lg">
                <AirportInput placeholder="Arrivée" value={dest} onChange={setDest} />
              </div>
              <button type="button" className="fp-swap" onClick={()=>{const t=origin;setOrigin(dest);setDest(t);}}>⇄</button>
              <span className="fp-bar-sep" />
              <div className="fp-bar-cell">
                <input type="date" className="fp-date" value={departure} min={today} onChange={e=>setDeparture(e.target.value)} />
              </div>
              {tripType==='round' && <>
                <span className="fp-bar-sep" />
                <div className="fp-bar-cell">
                  <input type="date" className="fp-date" value={returnDate} min={departure} onChange={e=>setReturnDate(e.target.value)} />
                </div>
              </>}
              <span className="fp-bar-sep" />
              <div className="fp-bar-cell fp-bar-pax">
                <span className="fp-pax-n">{adults} passager{adults>1?'s':''}</span>
                <span className="fp-pax-s">économie</span>
                <select className="fp-pax-sel" value={adults} onChange={e=>setAdults(Number(e.target.value))}>
                  {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} passager{n>1?'s':''}</option>)}
                </select>
              </div>
              <button type="submit" className="fp-submit" disabled={loading}>
                {loading ? <span className="fp-spin" /> : 'Recherche de vols'}
              </button>
            </div>
          </form>
          {error && <p className="fp-error">{error}</p>}
        </div>
      </div>

      {/* LOADING */}
      {loading && <div className="fp-loading"><div className="fp-spin fp-spin--lg" /><p>Recherche des meilleurs prix...</p></div>}

      {/* RESULTS */}
      {results && (
        <div className="fp-results-wrap">
          <div className="fp-results-hdr">
            <span className="fp-results-count"><strong>{filteredOffers.length}</strong> vol{filteredOffers.length>1?'s':''} trouvé{filteredOffers.length>1?'s':''}</span>
            <div className="fp-results-ctrl">
              <label className="fp-chk"><input type="checkbox" checked={filterDirect} onChange={e=>setFilterDirect(e.target.checked)} /> Vols directs</label>
              <select className="fp-sort-sel" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="price">Trier par prix</option>
                <option value="duration">Trier par durée</option>
              </select>
            </div>
          </div>
          {filteredOffers.length===0
            ? <div className="fp-empty"><p>Aucun vol trouvé.</p><button onClick={()=>setResults(null)} className="fp-retry">Nouvelle recherche</button></div>
            : filteredOffers.map(o=><FlightCard key={o.id} offer={o}/>)
          }
        </div>
      )}

      {/* DESTINATIONS POPULAIRES */}
      {!results && !loading && (
        <div className="fp-pop-section" id="fp-popular">
          <div className="fp-pop-inner">
            <h2 className="fp-pop-title">Destinations populaires depuis la France</h2>
            <div className="fp-pop-grid">
              {popularCards.map(p => (
                <div key={p.code} className="fp-pop-card">
                  <div className="fp-pop-img">
                    <img src={p.photo} alt={p.city} loading="lazy" />
                    <div className="fp-pop-overlay" />
                    <div className="fp-pop-labels">
                      <span className="fp-pop-city">{p.city}</span>
                      <span className="fp-pop-country">{p.country}</span>
                    </div>
                  </div>
                  <div className="fp-pop-origins">
                    <div className="fp-pop-origins-hdr">
                      <span>Origine</span>
                      <span>↩ à partir de</span>
                    </div>
                    {p.origins.length > 0 ? p.origins.slice(0,3).map((o,i)=>(
                      <button key={i} className="fp-pop-row" onClick={()=>handleOriginClick(p.code, o.from, o.fromCode)}>
                        <span>{o.from}</span>
                        <span className="fp-pop-price">{o.price ? `€ ${o.price}` : '...'}</span>
                      </button>
                    )) : (
                      <div className="fp-pop-loading">Chargement des prix...</div>
                    )}
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
            {FAQ.map(([q,a],i)=>(
              <div key={i} className={`fp-faq-item${openFaq===i?' open':''}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                <div className="fp-faq-q">{q}<span className="fp-faq-chev">▾</span></div>
                <div className="fp-faq-a">{a}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
