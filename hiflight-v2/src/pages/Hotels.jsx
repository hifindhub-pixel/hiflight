import React, { useState, useEffect } from 'react';
import { geocodeCity, getHotelMapUrl } from '../services/api';
import { format, addDays } from 'date-fns';
import './Hotels.css';

const today = format(new Date(), 'yyyy-MM-dd');
const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

const POPULAR = [
  { city: 'Barcelone', lat: 41.3874, lng: 2.1686, emoji: '🇪🇸' },
  { city: 'Paris', lat: 48.8566, lng: 2.3522, emoji: '🇫🇷' },
  { city: 'Rome', lat: 41.9028, lng: 12.4964, emoji: '🇮🇹' },
  { city: 'Londres', lat: 51.5074, lng: -0.1278, emoji: '🇬🇧' },
  { city: 'Marrakech', lat: 31.6295, lng: -7.9811, emoji: '🇲🇦' },
  { city: 'Dubaï', lat: 25.2048, lng: 55.2708, emoji: '🇦🇪' },
  { city: 'Bangkok', lat: 13.7563, lng: 100.5018, emoji: '🇹🇭' },
  { city: 'Amsterdam', lat: 52.3676, lng: 4.9041, emoji: '🇳🇱' },
];

export default function Hotels() {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(nextWeek);
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [mapUrl, setMapUrl] = useState('');
  const [view, setView] = useState('map');
  const [zoom, setZoom] = useState(13);
  const [loading, setLoading] = useState(false);

  const buildUrl = (c, z, v) => {
    if (!c) return '';
    return getHotelMapUrl({ lat: c.lat, lng: c.lng, checkin, checkout, adults, children: 0, rooms })
      + `&zoom=${z || zoom}`
      + (v === 'list' || view === 'list' ? '&viewmode=listview' : '&viewmode=map');
  };

  const search = async (c) => {
    const co = c || coords;
    if (!co) return;
    const url = buildUrl(co, zoom, view);
    setMapUrl(url);
  };

  const selectCity = async (name, lat, lng) => {
    setCity(name);
    const c = { lat, lng };
    setCoords(c);
    const url = buildUrl(c, zoom, view);
    setMapUrl(url);
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!city) return;
    setLoading(true);
    try {
      let co = coords;
      if (!co) {
        co = await geocodeCity(city);
        setCoords(co);
      }
      if (co) {
        const url = buildUrl(co, zoom, view);
        setMapUrl(url);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleZoom = (delta) => {
    const z = Math.max(5, Math.min(18, zoom + delta));
    setZoom(z);
    if (coords) setMapUrl(buildUrl(coords, z, view));
  };

  const handleView = (v) => {
    setView(v);
    if (coords) setMapUrl(buildUrl(coords, zoom, v));
  };

  return (
    <div className="hotels-page">
      <div className="hotels-hero">
        <div className="container">
          <h1 className="hotels-hero-title outfit">
            Trouvez votre hôtel.<br />
            <span className="coral">Au meilleur prix.</span>
          </h1>
          <p className="hotels-hero-sub">Comparez des milliers d'hébergements en temps réel.</p>
        </div>
      </div>

      <div className="hotels-search-section">
        <div className="container">
          <form className="hotels-search-box" onSubmit={handleSearch}>
            <div className="hotels-fields">
              <div className="hotels-field hotels-field-dest">
                <label className="hotels-label">Destination</label>
                <input
                  className="hotels-input"
                  type="text"
                  placeholder="Ville, hôtel ou région..."
                  value={city}
                  onChange={e => { setCity(e.target.value); setCoords(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="hotels-field">
                <label className="hotels-label">Arrivée</label>
                <input type="date" className="hotels-input" value={checkin} min={today} onChange={e => setCheckin(e.target.value)} />
              </div>
              <div className="hotels-field">
                <label className="hotels-label">Départ</label>
                <input type="date" className="hotels-input" value={checkout} min={checkin} onChange={e => setCheckout(e.target.value)} />
              </div>
              <div className="hotels-field hotels-field-sm">
                <label className="hotels-label">Adultes</label>
                <select className="hotels-input" value={adults} onChange={e => setAdults(Number(e.target.value))}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="hotels-field hotels-field-sm">
                <label className="hotels-label">Chambres</label>
                <select className="hotels-input" value={rooms} onChange={e => setRooms(Number(e.target.value))}>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-lg hotels-submit" disabled={loading}>
                {loading ? <span className="spinner" /> : '🔍 Rechercher'}
              </button>
            </div>
          </form>

          {/* Populaires */}
          {!mapUrl && (
            <div className="hotels-popular">
              <span className="hotels-popular-label">Populaires :</span>
              {POPULAR.map(p => (
                <button key={p.city} className="hotels-popular-btn" onClick={() => selectCity(p.city, p.lat, p.lng)}>
                  {p.emoji} {p.city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CARTE */}
      {mapUrl && (
        <div className="container hotels-map-section">
          <div className="hotels-map-controls">
            <div className="hotels-view-toggle">
              <button className={`view-btn ${view === 'map' ? 'active' : ''}`} onClick={() => handleView('map')}>🗺️ Carte</button>
              <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => handleView('list')}>☰ Liste</button>
            </div>
            <span className="hotels-map-city">{city}</span>
          </div>

          <div className="hotels-map-wrapper">
            <div className="hotels-map-clip">
              <iframe
                id="hotel-iframe"
                src={mapUrl}
                width="100%"
                height={view === 'list' ? '600' : '610'}
                frameBorder="0"
                title="Hôtels"
                style={{ marginTop: view === 'list' ? '0' : '-70px', display: 'block' }}
              />
            </div>
            {view === 'map' && (
              <div className="hotels-zoom">
                <button onClick={() => handleZoom(1)}>+</button>
                <button onClick={() => handleZoom(-1)}>−</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
