import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import './styles/global.css';

function Footer() {
  return (
    <footer style={{
      background: 'var(--bg2)', borderTop: '1px solid var(--border)',
      padding: '2rem', textAlign: 'center', marginTop: 'auto',
    }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.3rem', fontWeight: 900, color: 'var(--coral)', marginBottom: '0.4rem' }}>
        Hi<span style={{ color: 'var(--text)' }}>Flight</span>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>
        © {new Date().getFullYear()} HiFlight · Comparateur de vols et hôtels · Certains liens sont des liens d'affiliation
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
