import React, { useState, useRef, useEffect, useCallback } from 'react';
import { searchLocations } from '../services/api';
import './LocationInput.css';

export default function LocationInput({ placeholder, value, onChange, icon }) {
  const [query, setQuery] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetch = useCallback(async (q) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const data = await searchLocations(q);
      setSuggestions(data.data || []);
      setOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onChange(null); // reset selection
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetch(q), 300);
  };

  const select = (loc) => {
    setQuery(`${loc.cityName || loc.name} (${loc.iataCode})`);
    onChange(loc);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="loc-wrap" ref={ref}>
      <div className="loc-icon">{icon}</div>
      <input
        className="loc-input"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {loading && <div className="loc-spinner" />}
      {open && suggestions.length > 0 && (
        <div className="loc-dropdown">
          {suggestions.map((s) => (
            <button key={s.iataCode} className="loc-item" onClick={() => select(s)}>
              <span className="loc-item-code">{s.iataCode}</span>
              <span className="loc-item-info">
                <span className="loc-item-city">{s.cityName || s.name}</span>
                <span className="loc-item-country">{s.countryName}</span>
              </span>
              <span className="loc-item-type">{s.type === 'CITY' ? '🏙️' : '✈️'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
