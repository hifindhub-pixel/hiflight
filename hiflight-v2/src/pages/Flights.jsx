import { useEffect } from 'react';

export default function Flights() {
  useEffect(() => {
    // Remplacer tout le contenu de la page par le HTML du White Label
    document.title = 'HiFlight — Comparateur de Vols';

    window.TPWL_EXTRA = {
      currency: 'EUR', marker: '714763', trs: '514265',
      domain: 'hiflight.vercel.app', locale: 'FR', link_color: 'FF6B6B'
    };
    window.TPWL_CONFIGURATION = { version:'v2', ab_flag:'', ab_variant:'', ab_evaluation_id:'' };

    if (!document.getElementById('tp-wl-script')) {
      const s = document.createElement('script');
      s.id = 'tp-wl-script'; s.async = true; s.type = 'module';
      s.src = 'https://tpwdg.com/wl_web/main.js?wl_id=15789';
      document.head.appendChild(s);
    }

    // Injecter weedles après chargement TP
    const injectWeedles = () => {
      const container = document.getElementById('tpwl-widget-weedles');
      if (!container || typeof window.TPWL_EXTRA === 'undefined') return;
      container.querySelectorAll('div[is="weedle"]').forEach(el => {
        if (el.querySelector('script')) return;
        const dest = el.getAttribute('data-destination');
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://tpwdg.com/content?currency=eur&trs=514265&shmarker=714763&destination=${dest}&target_host=hiflight.vercel.app&locale=FR&limit=6&powered_by=false&primary=%23FF6B6B&promo_id=4044&campaign_id=100`;
        el.appendChild(s);
      });
    };
    setTimeout(injectWeedles, 2000);
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="hf-hero">
        <div className="hf-hero-inner">
          <h1>Des millions de vols.<br /><span className="ac">Un seul endroit.</span></h1>
          <p className="hf-hero-sub">Comparez des centaines de compagnies aériennes en temps réel. Gratuit, sans inscription.</p>
        </div>
      </div>

      {/* TRUST */}
      <div className="hf-trust">
        <span><b>728</b> compagnies</span>
        <span><b>100%</b> gratuit</span>
      </div>

      {/* MOTEUR TP */}
      <header className="tpwl-search-header">
        <div className="tpwl-search__wrapper">
          <div className="tpwl__content">
            <div id="tpwl-search" />
          </div>
        </div>
      </header>

      <main className="tpwl-main">
        <div className="tpwl-tickets__wrapper">
          <div className="tpwl__content">
            <div id="tpwl-tickets" />
          </div>
        </div>

        {/* DESTINATIONS */}
        <div className="tpwl-widgets__wrapper">
          <div className="tpwl__content" style={{maxWidth:'1240px',width:'100%',margin:'0 auto'}}>
            <h3>Destinations populaires depuis la France</h3>
            <div id="tpwl-widget-weedles" className="tpwl-widget-weedles">
              {['BCN','RAK','FCO','DXB','BKK','KUL','JFK','CUN','TIA','REK','MAD','LIS'].map(dest => (
                <div key={dest} className="tpwl-widget-weedle" data-destination={dest} is="weedle" />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* FAQ */}
      <section className="hf-faq">
        <div className="hf-faq-inner">
          <h2>Questions fréquentes</h2>
          <p className="hf-faq-sub">Tout ce que vous devez savoir avant de réserver</p>
          {[
            ['Comment HiFlight trouve-t-il les meilleurs prix ?', 'HiFlight compare en temps réel les tarifs de plus de 700 compagnies aériennes. Notre moteur analyse des millions de combinaisons pour vous présenter les meilleures offres en quelques secondes.'],
            ['HiFlight est-il vraiment gratuit ?', "Oui, entièrement gratuit. Nous nous rémunérons via des commissions d'affiliation versées par les agences et compagnies partenaires — sans aucun surcoût pour vous."],
            ["Puis-je réserver directement sur HiFlight ?", "HiFlight est un comparateur — nous vous montrons les meilleures offres et vous redirigeons vers le site de la compagnie ou de l'agence pour finaliser la réservation."],
            ['Pourquoi les prix changent-ils aussi vite ?', "Les prix des vols varient en fonction de la demande, du délai avant le départ et de la saison. En général, réserver 6 à 8 semaines à l'avance offre les meilleurs tarifs."],
            ['Comment HiFlight protège-t-il mes données ?', 'HiFlight respecte le RGPD. Nous ne vendons aucune donnée personnelle à des tiers.'],
          ].map(([q, a], i) => (
            <div key={i} className="hf-faq-item" onClick={e => {
              const item = e.currentTarget;
              const open = item.classList.contains('open');
              document.querySelectorAll('.hf-faq-item').forEach(el => el.classList.remove('open'));
              if (!open) item.classList.add('open');
            }}>
              <div className="hf-faq-q">{q} <span className="hf-faq-chevron">▾</span></div>
              <div className="hf-faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
