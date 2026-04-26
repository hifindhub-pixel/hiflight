import React, { useState, useEffect } from 'react';
import './Flights.css';

const DEST_INFO = {
  BCN:{city:'Barcelone',country:'Espagne',photo:'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80'},
  RAK:{city:'Marrakech',country:'Maroc',photo:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80'},
  FCO:{city:'Rome',country:'Italie',photo:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80'},
  DXB:{city:'Dubaï',country:'Émirats arabes unis',photo:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80'},
  BKK:{city:'Bangkok',country:'Thaïlande',photo:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80'},
  KUL:{city:'Kuala Lumpur',country:'Malaisie',photo:'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80'},
  JFK:{city:'New York',country:'États-Unis',photo:'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80'},
  CUN:{city:'Cancún',country:'Mexique',photo:'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80'},
  TIA:{city:'Tirana',country:'Albanie',photo:'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&q=80'},
  REK:{city:'Reykjavik',country:'Islande',photo:'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80'},
  MAD:{city:'Madrid',country:'Espagne',photo:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80'},
  LIS:{city:'Lisbonne',country:'Portugal',photo:'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80'},
};

const POPULAR_PRICES = [
  {code:'BCN',origins:[{from:'Marseille',fromCode:'MRS',price:'€ 20'},{from:'Paris',fromCode:'CDG',price:'€ 21'},{from:'Lyon',fromCode:'LYS',price:'€ 35'}]},
  {code:'RAK',origins:[{from:'Marseille',fromCode:'MRS',price:'€ 68'},{from:'Paris',fromCode:'CDG',price:'€ 44'},{from:'Nantes',fromCode:'NTE',price:'€ 74'}]},
  {code:'FCO',origins:[{from:'Marseille',fromCode:'MRS',price:'€ 22'},{from:'Paris',fromCode:'CDG',price:'€ 26'},{from:'Lyon',fromCode:'LYS',price:'€ 28'}]},
  {code:'DXB',origins:[{from:'Paris',fromCode:'CDG',price:'€ 199'},{from:'Lyon',fromCode:'LYS',price:'€ 215'},{from:'Marseille',fromCode:'MRS',price:'€ 220'}]},
  {code:'BKK',origins:[{from:'Paris',fromCode:'CDG',price:'€ 349'},{from:'Lyon',fromCode:'LYS',price:'€ 369'},{from:'Bordeaux',fromCode:'BOD',price:'€ 389'}]},
  {code:'KUL',origins:[{from:'Paris',fromCode:'CDG',price:'€ 389'},{from:'Lyon',fromCode:'LYS',price:'€ 409'},{from:'Marseille',fromCode:'MRS',price:'€ 420'}]},
  {code:'JFK',origins:[{from:'Paris',fromCode:'CDG',price:'€ 327'},{from:'Lyon',fromCode:'LYS',price:'€ 355'},{from:'Marseille',fromCode:'MRS',price:'€ 360'}]},
  {code:'CUN',origins:[{from:'Paris',fromCode:'CDG',price:'€ 363'},{from:'Lyon',fromCode:'LYS',price:'€ 389'},{from:'Bordeaux',fromCode:'BOD',price:'€ 399'}]},
  {code:'TIA',origins:[{from:'Marseille',fromCode:'MRS',price:'€ 50'},{from:'Paris',fromCode:'CDG',price:'€ 65'},{from:'Lyon',fromCode:'LYS',price:'€ 71'}]},
  {code:'REK',origins:[{from:'Paris',fromCode:'CDG',price:'€ 79'},{from:'Lyon',fromCode:'LYS',price:'€ 95'},{from:'Bordeaux',fromCode:'BOD',price:'€ 110'}]},
  {code:'MAD',origins:[{from:'Marseille',fromCode:'MRS',price:'€ 16'},{from:'Paris',fromCode:'CDG',price:'€ 22'},{from:'Bordeaux',fromCode:'BOD',price:'€ 18'}]},
  {code:'LIS',origins:[{from:'Marseille',fromCode:'MRS',price:'€ 29'},{from:'Paris',fromCode:'CDG',price:'€ 35'},{from:'Bordeaux',fromCode:'BOD',price:'€ 32'}]},
];

const FAQ = [
  ['Comment HiFlight trouve-t-il les meilleurs prix ?','HiFlight compare en temps réel les tarifs de plus de 700 compagnies aériennes. Notre moteur analyse des millions de combinaisons pour vous présenter les meilleures offres en quelques secondes.'],
  ['HiFlight est-il vraiment gratuit ?',"Oui, entièrement gratuit. Nous nous rémunérons via des commissions d'affiliation versées par les agences et compagnies partenaires — sans aucun surcoût pour vous."],
  ['Puis-je réserver directement sur HiFlight ?',"HiFlight est un comparateur — nous vous montrons les meilleures offres et vous redirigeons vers le site de la compagnie ou de l'agence pour finaliser la réservation."],
  ['Pourquoi les prix changent-ils aussi vite ?',"Les prix des vols varient en fonction de la demande, du délai avant le départ et de la saison. En général, réserver 6 à 8 semaines à l'avance offre les meilleurs tarifs."],
  ['Comment HiFlight protège-t-il mes données ?','HiFlight respecte le RGPD. Nous ne vendons aucune donnée personnelle à des tiers.'],
];

export default function Flights() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.TPWL_EXTRA = {
      currency:'EUR', marker:'714763', trs:'514265',
      domain:'hiflight.vercel.app', locale:'FR', link_color:'FF6B6B',
    };
    window.TPWL_CONFIGURATION = { version:'v2', ab_flag:'', ab_variant:'', ab_evaluation_id:'' };

    if (!document.getElementById('tp-wl-script')) {
      const s = document.createElement('script');
      s.id = 'tp-wl-script'; s.async = true; s.type = 'module';
      s.src = 'https://tpwdg.com/wl_web/main.js?wl_id=15789';
      document.head.appendChild(s);
    }

    // Observer pour corriger la largeur dès que TP injecte ses éléments
    const observer = new MutationObserver(() => {
      const wrappers = document.querySelectorAll('[class*="tpwl__content"],[class*="tpwl-search__wrapper"],[class*="tpwl-tickets__wrapper"]');
      wrappers.forEach(el => {
        el.style.setProperty('max-width', '1280px', 'important');
        el.style.setProperty('min-width', 'unset', 'important');
        el.style.setProperty('margin', '0 auto', 'important');
        el.style.setProperty('padding-left', '2rem', 'important');
        el.style.setProperty('padding-right', '2rem', 'important');
        el.style.setProperty('box-sizing', 'border-box', 'important');
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fp">
      <div className="fp-hero">
        <div className="fp-hero-inner">
          <h1 className="fp-hero-title">Des millions de vols.<br /><span className="fp-coral">Un seul endroit.</span></h1>
          <p className="fp-hero-sub">Comparez des centaines de compagnies aériennes en temps réel. Gratuit, sans inscription.</p>
        </div>
      </div>

      <div className="fp-trust">
        <span><b>728</b> compagnies</span>
        <span><b>100%</b> gratuit</span>
      </div>

      <div id="tpwl-search" />
      <div id="tpwl-tickets" />

      <div className="fp-pop-section" id="fp-popular">
        <div className="fp-pop-inner">
          <h2 className="fp-pop-title">Destinations populaires depuis la France</h2>
          <div className="fp-pop-grid">
            {POPULAR_PRICES.map(p => {
              const info = DEST_INFO[p.code];
              return (
                <div key={p.code} className="fp-pop-card">
                  <div className="fp-pop-img">
                    <img src={info.photo} alt={info.city} loading="lazy" />
                    <div className="fp-pop-overlay" />
                    <div className="fp-pop-labels">
                      <span className="fp-pop-city">{info.city}</span>
                      <span className="fp-pop-country">{info.country}</span>
                    </div>
                  </div>
                  <div className="fp-pop-origins">
                    <div className="fp-pop-origins-hdr"><span>Origine</span><span>↩ à partir de</span></div>
                    {p.origins.map((o,i) => (
                      <button key={i} className="fp-pop-row"
                        onClick={() => document.getElementById('tpwl-search')?.scrollIntoView({behavior:'smooth'})}>
                        <span>{o.from}</span>
                        <span className="fp-pop-price">{o.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="fp-faq">
        <div className="fp-faq-inner">
          <h2 className="fp-faq-title">Questions fréquentes</h2>
          <p className="fp-faq-sub">Tout ce que vous devez savoir avant de réserver</p>
          {FAQ.map(([q,a],i) => (
            <div key={i} className={`fp-faq-item${openFaq===i?' open':''}`} onClick={() => setOpenFaq(openFaq===i?null:i)}>
              <div className="fp-faq-q">{q}<span className="fp-faq-chev">▾</span></div>
              <div className="fp-faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
