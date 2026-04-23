import React, { useState } from 'react';
import './FlightCard.css';

function formatTime(iso) {
  if (!iso) return '--:--';
  try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  catch { return '--:--'; }
}
function formatDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', weekday: 'short' }); }
  catch { return ''; }
}
function formatDuration(dur) {
  if (!dur) return '';
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return '';
  return `${m[1] ? m[1]+'h' : ''}${m[2] ? ' '+m[2]+'min' : ''}`.trim();
}

const AIRLINES = { FR:'Ryanair',VY:'Vueling',AF:'Air France',U2:'easyJet',IB:'Iberia',BA:'British Airways',LH:'Lufthansa',KL:'KLM',TP:'TAP',AZ:'ITA Airways',EK:'Emirates',TK:'Turkish Airlines',W6:'Wizz Air',PC:'Pegasus',TO:'Transavia France',HV:'Transavia',BJ:'Nouvelair',TU:'Tunisair',AT:'Royal Air Maroc',QR:'Qatar Airways',EY:'Etihad',SN:'Brussels Airlines' };

export default function FlightCard({ offer }) {
  const [expanded, setExpanded] = useState(false);
  const seg = offer.itineraries[0].segments[0];
  const stops = seg.stops || 0;
  const name = AIRLINES[seg.carrierCode] || seg.carrierCode;
  const dur = formatDuration(offer.itineraries[0].duration);
  const url = offer.bookingToken && offer.bookingToken !== '' ? offer.bookingToken : 
    `https://www.aviasales.com/search/${seg.departure.iataCode}${seg.departure.at ? seg.departure.at.substring(5,7)+seg.departure.at.substring(8,10) : ''}${seg.arrival.iataCode}1`;

  return (
    <div className={`fc${expanded?' fc--open':''}`}>
      <div className="fc-main" onClick={()=>setExpanded(e=>!e)}>
        <div className="fc-airline">
          <img src={`https://pics.avs.io/48/48/${seg.carrierCode}.png`} alt={name} className="fc-logo" onError={e=>e.target.style.display='none'} />
          <span className="fc-airline-name">{name}</span>
        </div>
        <div className="fc-times">
          <div className="fc-time-block">
            <span className="fc-time">{formatTime(seg.departure.at)}</span>
            <span className="fc-iata">{seg.departure.iataCode}</span>
            <span className="fc-date">{formatDate(seg.departure.at)}</span>
          </div>
          <div className="fc-middle">
            {dur && <span className="fc-dur">{dur}</span>}
            <div className="fc-line"><div className="fc-dot"/><div className="fc-dash"/><div className="fc-dot"/></div>
            <span className={`fc-stops${stops===0?' fc-stops--direct':''}`}>{stops===0?'Direct':`${stops} escale${stops>1?'s':''}`}</span>
          </div>
          <div className="fc-time-block fc-time-block--right">
            <span className="fc-time">{formatTime(seg.arrival.at)}</span>
            <span className="fc-iata">{seg.arrival.iataCode}</span>
            <span className="fc-date">{formatDate(seg.arrival.at)}</span>
          </div>
        </div>
        <div className="fc-right">
          <div className="fc-price-wrap">
            <span className="fc-price">{Math.round(offer.price.total)}€</span>
            <span className="fc-per">/ pers.</span>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="fc-btn" onClick={e=>e.stopPropagation()}>Voir l'offre →</a>
          <button className="fc-expand-btn" onClick={e=>{e.stopPropagation();setExpanded(ex=>!ex);}}>{expanded?'▲':'▼'}</button>
        </div>
      </div>
      {expanded && (
        <div className="fc-details">
          <div className="fc-detail-row">
            <span className="fc-detail-label">✈️ {seg.departure.iataCode} → {seg.arrival.iataCode}</span>
            <span className="fc-detail-flight">{seg.carrierCode}{seg.flightNumber}</span>
            {dur && <span className="fc-detail-dur">Durée : {dur}</span>}
          </div>
          <div className="fc-detail-footer">
            <span className="fc-baggage">🧳 Bagages : vérifier lors de la réservation</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="fc-btn fc-btn--lg">Réserver maintenant →</a>
          </div>
        </div>
      )}
    </div>
  );
}
