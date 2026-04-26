/* HERO */
.fp-hero{background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#f0fdf4 100%);padding:4rem 2rem 3.5rem;text-align:center;display:flex;align-items:center;justify-content:center;}
[data-theme="dark"] .fp-hero{background:linear-gradient(135deg,#0c1a2e 0%,#0f172a 100%);}
.fp-hero-inner{max-width:820px;margin:0 auto;}
.fp-hero-title{font-family:'Outfit',sans-serif;font-size:clamp(2.2rem,5vw,4.5rem);font-weight:900;line-height:1.06;letter-spacing:-.03em;margin-bottom:.8rem;color:var(--text);}
.fp-coral{color:#FF6B6B;}
.fp-hero-sub{color:#64748b;font-size:1rem;max-width:560px;margin:0 auto;}

/* TRUST */
.fp-trust{background:#fff;border-bottom:1px solid rgba(0,0,0,.08);padding:.5rem 2rem;display:flex;align-items:center;justify-content:center;gap:2rem;font-size:.8rem;color:#64748b;}
[data-theme="dark"] .fp-trust{background:var(--bg2);}
.fp-trust b{font-family:'Outfit',sans-serif;color:#FF6B6B;font-size:.92rem;}

/* TP OVERRIDES — contraindre la largeur */
:root{
  --tpwl-font-family:'Inter';
  --tpwl-headline-text:#0f172a;
  --tpwl-links:#FF6B6B;
  --tpwl-main-text:#0f172a;
  --tpwl-search-form-background:#ffffff;
  --tpwl-search-result-background:#f8fafc;
}
[class*="powered"],[class*="tpwl-logo__"]{display:none!important;}

/* Wrapper global TP */
[class*="tpwl-search__wrapper"],
[class*="tpwl-tickets__wrapper"]{
  padding-left:2rem!important;
  padding-right:2rem!important;
}
[class*="tpwl__content"]{
  max-width:1280px!important;
  min-width:unset!important;
  width:100%!important;
  margin:0 auto!important;
  box-sizing:border-box!important;
}

/* POPULAR */
.fp-pop-section{background:#fff;border-top:1px solid rgba(0,0,0,.08);padding:2.5rem 2rem;}
[data-theme="dark"] .fp-pop-section{background:var(--bg2);}
.fp-pop-inner{max-width:1280px;margin:0 auto;}
.fp-pop-title{font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:1.5rem;color:var(--text);text-align:center;}
.fp-pop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
.fp-pop-card{border-radius:14px;overflow:hidden;border:1px solid rgba(0,0,0,.08);background:#fff;transition:box-shadow .2s;}
[data-theme="dark"] .fp-pop-card{background:var(--bg2);}
.fp-pop-card:hover{box-shadow:0 6px 20px rgba(0,0,0,.1);}
.fp-pop-img{position:relative;height:160px;overflow:hidden;}
.fp-pop-img img{width:100%;height:100%;object-fit:cover;display:block;}
.fp-pop-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.6));}
.fp-pop-labels{position:absolute;bottom:.75rem;left:.9rem;color:#fff;}
.fp-pop-city{display:block;font-family:'Outfit',sans-serif;font-size:1.15rem;font-weight:800;}
.fp-pop-country{display:block;font-size:.75rem;opacity:.85;}
.fp-pop-origins{padding:.65rem .9rem;}
.fp-pop-origins-hdr{display:flex;justify-content:space-between;font-size:.7rem;color:#94a3b8;margin-bottom:.3rem;padding-bottom:.3rem;border-bottom:1px solid rgba(0,0,0,.07);}
.fp-pop-row{display:flex;justify-content:space-between;align-items:center;padding:.3rem .4rem;font-size:.82rem;color:var(--text);width:100%;background:none;border:none;text-align:left;cursor:pointer;border-radius:6px;transition:background .15s;}
.fp-pop-row:hover{background:rgba(255,107,107,.08);}
.fp-pop-price{color:#FF6B6B;font-weight:700;font-family:'Outfit',sans-serif;}

/* FAQ */
.fp-faq{padding:3.5rem 2rem;background:#f8fafc;}
[data-theme="dark"] .fp-faq{background:var(--bg);}
.fp-faq-inner{max-width:820px;margin:0 auto;}
.fp-faq-title{font-family:'Outfit',sans-serif;font-size:1.7rem;font-weight:800;text-align:center;margin-bottom:.3rem;color:var(--text);}
.fp-faq-sub{text-align:center;color:#64748b;font-size:.85rem;margin-bottom:2rem;}
.fp-faq-item{border:1px solid rgba(0,0,0,.08);border-radius:12px;margin-bottom:.6rem;overflow:hidden;cursor:pointer;}
.fp-faq-q{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.3rem;font-weight:600;font-size:.92rem;background:#fff;color:var(--text);user-select:none;}
[data-theme="dark"] .fp-faq-q{background:var(--bg2);}
.fp-faq-q:hover{background:#f8fafc;}
.fp-faq-chev{color:#FF6B6B;transition:transform .25s;}
.fp-faq-item.open .fp-faq-chev{transform:rotate(180deg);}
.fp-faq-a{max-height:0;overflow:hidden;padding:0 1.3rem;font-size:.85rem;color:#64748b;line-height:1.7;background:#fff;transition:max-height .3s,padding .3s;}
[data-theme="dark"] .fp-faq-a{background:var(--bg2);}
.fp-faq-item.open .fp-faq-a{max-height:200px;padding:.9rem 1.3rem 1.1rem;}

@media(max-width:1024px){.fp-pop-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:768px){
  .fp-pop-grid{grid-template-columns:1fr;}
  .fp-hero{padding:2.5rem 1rem;}
  [class*="tpwl-search__wrapper"],[class*="tpwl-tickets__wrapper"]{padding-left:1rem!important;padding-right:1rem!important;}
}
