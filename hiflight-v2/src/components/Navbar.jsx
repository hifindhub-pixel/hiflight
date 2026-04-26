import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`hf-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="hf-nav-inner">
        <Link to="/" className="hf-brand">Hi<span>Flight</span></Link>
        <div className="hf-nav-right">
          <button className="hf-monde-btn"
            onClick={() => document.querySelector('.tpwl-widgets__wrapper')?.scrollIntoView({behavior:'smooth'})}>
            🌍 Monde entier
          </button>
        </div>
      </div>
    </nav>
  );
}
