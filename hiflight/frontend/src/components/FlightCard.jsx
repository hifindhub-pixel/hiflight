import React, { useState } from 'react';
import './FlightCard.css';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function formatDuration(dur) {
  if (!dur) return '';
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return dur;
  const h = m[1] ? `${m[1]}h` : '';
  const min = m[2] ? `${m[2]}min` : '';
  return `${h} ${min}`.trim();
}

export default function FlightCard({ offer }) {
  const [expanded, setExpanded] = useState(false);
  const outbound = offer.itineraries[0];
  const inbound = offer.itineraries[1];
  const firstSeg = outbound.segments[0];
  const lastSeg = outbound.segments[outbound.segments.length - 1];
  const stops = outbound.segments.length - 1;

  return (
    <div className={`flight-card ${expanded ? 'expanded' : ''}`}>
      <div className="flight-card-main" onClick={() => setExpanded(e => !e)}>

        {/* Compagnie */}
        <div className="flight-airline">
          <div className="flight-airline-logo">
            <img
              src={`https://pics.avs.io/40/40/${firstSeg.carrierCode}.png`}
              alt={firstSeg.carrierCode}
              onError={e => { e.target.style.display='none'; }}
            />
          </div>
          <span className="flight-airline-code">{firstSeg.carrierCode}</span>
        </div>

        {/* Horaires */}
        <div className="flight-times">
          <div className="flight-time-block">
            <span className="flight-time">{formatTime(firstSeg.departure.at)}</span>
            <span className="flight-airport">{firstSeg.departure.iataCode}</span>
          </div>
          <div className="flight-middle">
            <span className="flight-duration">{formatDuration(outbound.duration)}</span>
            <div className="flight-line">
              <div className="flight-dot" />
              <div className="flight-dash" />
              <div className="flight-dot" />
            </div>
            <span className={`flight-stops ${stops === 0 ? 'direct' : ''}`}>
              {stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="flight-time-block right">
            <span className="flight-time">{formatTime(lastSeg.arrival.at)}</span>
            <span className="flight-airport">{lastSeg.arrival.iataCode}</span>
          </div>
        </div>

        {/* Retour si A/R */}
        {inbound && (
          <div className="flight-return-badge">
            ↩ Retour inclus
          </div>
        )}

        {/* Prix */}
        <div className="flight-price-block">
          <span className="flight-price">{Math.round(offer.price.total)}€</span>
          <span className="flight-price-label">/ pers.</span>
          <span className="flight-source">{offer.source}</span>
        </div>

        {/* CTA */}
        <button className="flight-btn btn btn-primary">
          Voir l'offre
        </button>

        {/* Expand toggle */}
        <button className="flight-expand" onClick={e => { e.stopPropagation(); setExpanded(ex => !ex); }}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Détails dépliés */}
      {expanded && (
        <div className="flight-details">
          {offer.itineraries.map((itin, i) => (
            <div key={i} className="flight-itin">
              <div className="flight-itin-label">
                {i === 0 ? '✈️ Aller' : '↩️ Retour'}
                <span className="flight-itin-duration">{formatDuration(itin.duration)}</span>
              </div>
              {itin.segments.map((seg, j) => (
                <div key={j} className="flight-seg">
                  <div className="flight-seg-times">
                    <span>{formatTime(seg.departure.at)}</span>
                    <span className="flight-seg-arrow">→</span>
                    <span>{formatTime(seg.arrival.at)}</span>
                  </div>
                  <div className="flight-seg-info">
                    <span>{seg.departure.iataCode} → {seg.arrival.iataCode}</span>
                    <span className="flight-seg-flight">
                      {seg.carrierCode}{seg.flightNumber} · {formatDuration(seg.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="flight-details-footer">
            <span className="flight-baggage">🧳 Bagages : selon tarif sélectionné</span>
            <button className="btn btn-primary btn-lg">
              Réserver maintenant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
