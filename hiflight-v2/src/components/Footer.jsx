import React, { useState } from 'react';
import './Footer.css';

const LEGAL = {
  cgu: { title:"Conditions Générales d'Utilisation", body:"<h3>1. Objet</h3><p>Les présentes CGU régissent l'utilisation du site HiFlight.</p><h3>2. Service</h3><p>HiFlight est un comparateur de prix de vols. La réservation s'effectue sur le site du partenaire.</p><h3>3. Contact</h3><p>contact@hiflight.fr</p>" },
  privacy: { title:"Politique de Confidentialité", body:"<h3>1. Données</h3><p>Données de navigation anonymisées uniquement.</p><h3>2. Partage</h3><p>Nous ne vendons jamais vos données.</p><h3>3. Contact</h3><p>contact@hiflight.fr</p>" },
  rgpd: { title:"RGPD & Cookies", body:"<h3>1. Conformité RGPD</h3><p>HiFlight respecte le Règlement Général sur la Protection des Données (UE 2016/679).</p><h3>2. Cookies</h3><p>Essentiels, analytiques anonymisés, affiliation partenaires.</p>" },
};

export default function Footer() {
  const [modal, setModal] = useState(null);
  return (
    <>
      <footer className="hf-footer">
        <div className="hf-footer-brand">Hi<span>Flight</span></div>
        <div className="hf-footer-links">
          <button onClick={() => setModal('cgu')}>Conditions d'utilisation</button>
          <button onClick={() => setModal('privacy')}>Politique de confidentialité</button>
          <button onClick={() => setModal('rgpd')}>RGPD &amp; Cookies</button>
        </div>
        <p className="hf-footer-copy">© 2026 HiFlight · Comparateur de vols · Certains liens sont des liens d'affiliation</p>
      </footer>
      {modal && (
        <div className="hf-legal-overlay open" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="hf-legal-panel">
            <div className="hf-legal-head">
              <div className="hf-legal-title">{LEGAL[modal].title}</div>
              <button className="hf-legal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="hf-legal-body" dangerouslySetInnerHTML={{__html: LEGAL[modal].body}} />
          </div>
        </div>
      )}
    </>
  );
}
