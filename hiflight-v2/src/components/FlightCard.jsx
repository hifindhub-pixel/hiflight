import React, { useState } from 'react';
import './FlightCard.css';

function formatTime(iso) {
  if (!iso) return '--:--';
  try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  catch { return '--:--'; }
}
function formatDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
  catch { return ''; }
}
function formatDuration(dur) {
  if (!dur) return '';
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return '';
  const h = parseInt(m[1]||0), min = parseInt(m[2]||0);
  if (h > 0 && min > 0) return `${h}h ${min}min`;
  if (h > 0) return `${h}h`;
  if (min > 0) return `${min}min`;
  // fallback: si c'est juste des minutes totales
  const total = parseInt(dur);
  if (!isNaN(total)) return `${Math.floor(total/60)}h ${total%60}min`;
  return '';
}

const AIRLINES = {
  FR:'Ryanair', VY:'Vueling', AF:'Air France', U2:'easyJet', IB:'Iberia',
  BA:'British Airways', LH:'Lufthansa', KL:'KLM', TP:'TAP', AZ:'ITA Airways',
  EK:'Emirates', TK:'Turkish Airlines', W6:'Wizz Air', PC:'Pegasus',
  TO:'Transavia France', HV:'Transavia', BJ:'Nouvelair', TU:'Tunisair',
  AT:'Royal Air Maroc', QR:'Qatar Airways', EY:'Etihad', SN:'Brussels Airlines',
  XK:'Air Corsica', A5:'HOP!', DL:'Delta', AA:'American Airlines', UA:'United',
};

const COMPARATORS = [
  { key:'kiwi', label:'Kiwi', color:'#00B2A9', icon:'✈' },
  { key:'kayak', label:'Kayak', color:'#FF690F', icon:'🔍' },
  { key:'booking', label:'Booking', color:'#003580', icon:'🏨' },
  { key:'expedia', label:'Expedia', color:'#1B4FA1', icon:'🌐' },
  { key:'edreams', label:'eDreams', color:'#FF6600', icon:'💡' },
];

export default function FlightCard({ offer }) {
  const [expanded, setExpanded] = useState(false);
  const seg = offer.itineraries[0].segments[0];
  const stops = seg.stops || 0;
  const name = AIRLINES[seg.carrierCode] || seg.carrierCode;
  const dur = formatDuration(offer.itineraries[0].duration);

  return (
    <div className={`fc${expanded?' fc--open':''}`}>
      <div className="fc-main" onClick={() => setExpanded(e => !e)}>

        {/* Logo compagnie */}
        <div className="fc-airline">
          <img src={`https://pics.avs.io/48/48/${seg.carrierCode}.png`} alt={name}
            className="fc-logo" onError={e => e.target.style.display='none'} />
          <span className="fc-airline-name">{name}</span>
        </div>

        {/* Horaires */}
        <div className="fc-times">
          <div className="fc-time-block">
            <span className="fc-time">{formatTime(seg.departure.at)}</span>
            <span className="fc-iata">{seg.departure.iataCode}</span>
            <span className="fc-date">{formatDate(seg.departure.at)}</span>
          </div>
          <div className="fc-middle">
            {dur && <span className="fc-dur">{dur}</span>}
            <div className="fc-line"><div className="fc-dot"/><div className="fc-dash"/><div className="fc-dot"/></div>
            <span className={`fc-stops${stops===0?' fc-direct':''}`}>{stops===0?'Direct':`${stops} escale${stops>1?'s':''}`}</span>
          </div>
          <div className="fc-time-block fc-time-block--right">
            <span className="fc-time">{formatTime(seg.arrival.at)}</span>
            <span className="fc-iata">{seg.arrival.iataCode}</span>
            <span className="fc-date">{formatDate(seg.arrival.at)}</span>
          </div>
        </div>

        {/* Prix */}
        <div className="fc-price-wrap">
          <span className="fc-price">{Math.round(offer.price.total)}€</span>
          <span className="fc-per">/ pers.</span>
        </div>

        {/* Bouton expand */}
        <button className="fc-expand" onClick={e => { e.stopPropagation(); setExpanded(ex => !ex); }}>
          {expanded ? '▲' : 'Comparer ▼'}
        </button>
      </div>

      {/* Détails + comparateurs */}
      {expanded && (
        <div className="fc-details">
          <div className="fc-detail-info">
            <span>✈️ {seg.departure.iataCode} → {seg.arrival.iataCode}</span>
            {seg.carrierCode && seg.flightNumber && (
              <span className="fc-flight-no">{seg.carrierCode}{seg.flightNumber}</span>
            )}
            {dur && <span>Durée : {dur}</span>}
            <span>🧳 Bagages selon tarif</span>
          </div>

          <div className="fc-comparators">
            <p className="fc-comp-title">Trouver le meilleur prix sur :</p>
            <div className="fc-comp-grid">
              {/* Lien Aviasales principal */}
              {offer.bookingToken && (
                <a href={offer.bookingToken} target="_blank" rel="noopener noreferrer"
                  className="fc-comp-btn fc-comp-btn--main">
                  <span>✈</span> Aviasales · <strong>{Math.round(offer.price.total)}€</strong>
                </a>
              )}
              {/* Tous les comparateurs */}
              {COMPARATORS.map(c => offer.links?.[c.key] ? (
                <a key={c.key} href={offer.links[c.key]} target="_blank" rel="noopener noreferrer"
                  className="fc-comp-btn" style={{'--comp-color': c.color}}>
                  <span>{c.icon}</span> {c.label}
                </a>
              ) : null)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
