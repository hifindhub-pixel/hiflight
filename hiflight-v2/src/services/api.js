import axios from 'axios';

// En production sur Vercel, les routes /api/* sont dans le même domaine
const BASE = process.env.REACT_APP_API_URL || '';

const API = axios.create({ timeout: 30000 });

export const searchFlights = (params) =>
  API.post(`${BASE}/api/flights/search`, params).then(r => r.data);

export const searchLocations = (q) =>
  API.get(`${BASE}/api/locations?q=${encodeURIComponent(q)}`).then(r => r.data);

export const getPopularFlights = (origin = 'PAR') =>
  API.get(`${BASE}/api/flights/popular?origin=${origin}`).then(r => r.data);

export const getHotelMapUrl = ({ lat, lng, checkin, checkout, adults, children, rooms }) => {
  const aid = '69d6ef5b5c2381056c6872bc';
  return `https://www.stay22.com/embed/gm?aid=${aid}&lat=${lat}&lng=${lng}&zoom=13&currency=EUR&ljs=fr&checkin=${checkin}&checkout=${checkout}&adults=${adults}&maincolor=FF6B6B&hidesearchbar=true`;
};

export const geocodeCity = async (city) => {
  const r = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=fr`);
  if (r.data?.[0]) return { lat: parseFloat(r.data[0].lat), lng: parseFloat(r.data[0].lon) };
  return null;
};

export default API;
